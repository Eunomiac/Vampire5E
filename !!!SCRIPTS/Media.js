void MarkStart("Media");
const Media = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Media";
    // #region COMMON INITIALIZATION
    const STATE = {
        get REF() {
            return C.RO.OT[SCRIPTNAME];
        }
    };
    const VAL = (varList, funcName, isArray = false) => D.Validate(varList, funcName, SCRIPTNAME, isArray);
    const DB = (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME);
    const LOG = (msg, funcName) => D.Log(msg, funcName, SCRIPTNAME);
    const THROW = (msg, funcName, errObj) => D.ThrowError(msg, funcName, SCRIPTNAME, errObj);
    const TRACEON = (funcName, funcParams = [], msg = "") => D.TraceStart(funcName, funcParams, SCRIPTNAME, msg);
    const TRACEOFF = (funcID, returnVal) => D.TraceStop(funcID, returnVal);
    const checkInstall = () => {
        // const traceID = TRACEON("checkInstall", [])
        C.RO.OT[SCRIPTNAME] = C.RO.OT[SCRIPTNAME] || {};
        initialize();
        // TRACEOFF(traceID)
    };
    // #endregion

    // #region LOCAL INITIALIZATION
    const initialize = () => {
        // STATE.REF.imgregistry.SiteTopLeft_1.srcs = "SiteCenter";
        // STATE.REF.tokenregistry["Agnes Bellanger"].srcs.Majesty = "https://s3.amazonaws.com/files.d20.io/images/148268272/-t6iXzCJEOuXUKQwczL4Sw/thumb.png?1593935369";
        // STATE.REF.tokenregistry["Agnes Bellanger"].srcs.AweMajesty = "https://s3.amazonaws.com/files.d20.io/images/148268272/-t6iXzCJEOuXUKQwczL4Sw/thumb.png?1593935369";
        // STATE.REF.tokenregistry["Agnes Bellanger"].srcs.AweBlushMajesty = "https://s3.amazonaws.com/files.d20.io/images/148268272/-t6iXzCJEOuXUKQwczL4Sw/thumb.png?1593935369";
        // STATE.REF.tokenregistry["Agnes Bellanger"].srcs.BlushMajesty = "https://s3.amazonaws.com/files.d20.io/images/148268272/-t6iXzCJEOuXUKQwczL4Sw/thumb.png?1593935369";

        STATE.REF.imgregistry = STATE.REF.imgregistry || {};
        STATE.REF.textregistry = STATE.REF.textregistry || {};
        STATE.REF.animregistry = STATE.REF.animregistry || {};
        STATE.REF.idregistry = STATE.REF.idregistry || {};
        STATE.REF.areas = STATE.REF.areas || {};
        STATE.REF.tokenregistry = STATE.REF.tokenregistry || {};
        STATE.REF.tokenregistry.GENERIC = STATE.REF.tokenregistry.GENERIC || {};
        STATE.REF.soundregistry = STATE.REF.soundregistry || {};
        STATE.REF.playlistregistry = STATE.REF.playlistregistry || {};
        STATE.REF.TokenSrcs = STATE.REF.TokenSrcs || {};
        STATE.REF.imgResizeDims = STATE.REF.imgResizeDims || {height: 100, width: 100};
        STATE.REF.activeAnimations = STATE.REF.activeAnimations || {};
        STATE.REF.activeSounds = STATE.REF.activeSounds || [];
        STATE.REF.loopingSounds = STATE.REF.loopingSounds || [];
        STATE.REF.soundScore = STATE.REF.soundScore || "ScoreMain";
        STATE.REF.isRunningSilent = STATE.REF.isRunningSilent || false;
        STATE.REF.panelLog = STATE.REF.panelLog || {};
        STATE.REF.VOLUME = STATE.REF.VOLUME || D.Clone(C.SOUNDVOLUME);
        STATE.REF.boundImages = STATE.REF.boundImages || {};
        STATE.REF.tokenAuras = STATE.REF.tokenAuras || {Majesty: "MajestyAura"};
        STATE.REF.areImgsBound = true;

        // STATE.REF.textregistry.panel.maxWidth = 330

        for (const [, textData] of Object.entries(STATE.REF.textregistry)) {
            const realText = (VAL({string: textData.curText}) && textData.curText !== "LAST" && textData.curText)
                || (VAL({string: textData.text}) && textData.text !== "LAST" && textData.text)
                || (VAL({string: textData.activeText}) && textData.activeText !== "LAST" && textData.activeText)
                || " ";
            textData.curText = realText;
            textData.activeText = realText;
            delete textData.text;
            for (const [, modeData] of Object.entries(textData.modes))
                if (modeData.lastState === "LAST")
                    modeData.lastState = realText;
        }

        for (const animData of Object.values(STATE.REF.animregistry).filter((x) => x.timeOut))
            toggleAnimation(animData.name, false);

        for (const panelName of Object.keys(STATE.REF.panelLog))
            killPanel(panelName);

        // Initialize IMGDICT Fuzzy Dictionary
        STATE.REF.IMGDICT = Fuzzy.Fix();
        for (const imgKey of Object.keys(STATE.REF.imgregistry))
            STATE.REF.IMGDICT.add(imgKey);

        // Initialize TEXTDICT Fuzzy Dictionary
        STATE.REF.TEXTDICT = Fuzzy.Fix();
        for (const textKey of Object.keys(STATE.REF.textregistry))
            STATE.REF.TEXTDICT.add(textKey);

        // Initialize AREADICT Fuzzy Dictionary
        STATE.REF.AREADICT = Fuzzy.Fix();
        for (const areaKey of Object.keys(STATE.REF.areas))
            STATE.REF.AREADICT.add(areaKey);

        /*
            for (const cat of ["anarch", "camarilla", "independent", "si", "civilian", "medical", "media", "cop"]) {
                STATE.REF.tokenregistry.GENERIC[cat] = [
                    ...STATE.REF.tokenregistry.GENERIC[`${cat}f`],
                    ...STATE.REF.tokenregistry.GENERIC[`${cat}m`]
                ]
            }
            */
        // TRACEOFF(traceID)
    };
    // #endregion

    // #region EVENT HANDLERS: (HANDLEINPUT)
    const onChatCall = (call, args, objects, msg) => {
        const traceID = TRACEON("onChatCall", [call, args, objects, msg]);
        switch (call) { // CTRL-K CTRL-7 to shrink sub-cases
            case "!media": {
                const mediaObjs = [...Listener.GetObjects(objects, "graphic"), ...Listener.GetObjects(objects, "text")];
                switch (D.LCase((call = args.shift()))) {
                    case "backup": {
                        STATE.REF.backup = {
                            arearegistry: JSON.parse(JSON.stringify(REGISTRY.AREA)),
                            imgregistry: JSON.parse(JSON.stringify(REGISTRY.IMG)),
                            textregistry: JSON.parse(JSON.stringify(REGISTRY.TEXT)),
                            animregistry: JSON.parse(JSON.stringify(REGISTRY.ANIM)),
                            tokenregistry: JSON.parse(JSON.stringify(REGISTRY.TOKEN))
                        };
                        D.Alert("Media Registry Backup Updated.", "!img backup");
                        break;
                    }
                    case "set": {
                        switch (D.LCase((call = args.shift()))) {
                            case "anchor": {
                                setAnchor((D.GetSelected(msg) || mediaObjs).shift());
                                break;
                            }
                            // no default
                        }
                        break;
                    }
                    case "match": {
                        const [targetObj, sourceObj] = mediaObjs;
                        if (VAL({object: [targetObj, sourceObj]}, "!media match modes", true)) {
                            const sourceModes = (getMediaData(sourceModes) || {modes: false}).modes;
                            if (VAL({list: sourceModes})) {
                                const targetData = getMediaData(targetObj);
                                targetData.modes = D.Clone(sourceModes);
                                D.Alert(`Object '${targetData.name}' modes set to: ${D.JS(sourceModes)}`, "!media match modes");
                            }
                        }
                        break;
                    }
                    case "fix": {
                        switch (D.LCase((call = args.shift()))) {
                            case "modes": {
                                resetModeData(
                                    D.LCase(args.join(" ")).includes("all"),
                                    false,
                                    D.LCase(args.join(" ")).includes("verb"),
                                    D.LCase(args.join(" ")).includes("confirm")
                                );
                                break;
                            }
                            case "layers": {
                                setActiveLayers();
                                break;
                            }
                            case "zlevels":
                            case "zindex":
                            case "zindices": {
                                setZIndices();
                                break;
                            }
                            case "dragpads": {
                                checkDragPads();
                                break;
                            }
                            case "backgrounds": {
                                resetBGImgs();
                                break;
                            }
                            case "img": {
                                fixImgObjs();
                                break;
                            }
                            case "text": {
                                fixTextObjs();
                                break;
                            }
                            case "objects": {
                                STATE.REF.fixAllCommands = [];
                                D.Queue(fixImgObjs, [], "FixObjects", 8);
                                D.Queue(fixTextObjs, [], "FixObjects", 8);
                                D.Queue(
                                    () => {
                                        D.Alert(D.JS(STATE.REF.fixAllCommands), "!media fix objects");
                                        STATE.REF.fixAllCommands = [];
                                    },
                                    [],
                                    "FixObjects",
                                    0.1
                                );
                                break;
                            }
                            case "all": {
                                fixAll(args[0] && args[0].includes("kill"));
                                break;
                            }
                            default: {
                                D.Alert(
                                    `Commands Include: ${D.JS(["modes", "layers", "zindex", "dragpads", "backgrounds", "objects", "sounds", "all"])}`,
                                    "!media fix"
                                );
                                break;
                            }
                        }
                        break;
                    }
                    case "align": {
                        alignObjs(D.GetSelected(msg) || mediaObjs, ...args);
                        break;
                    }
                    case "resize": {
                        resizeImgs(D.GetSelected(msg) || mediaObjs);
                        break;
                    }
                    case "dist": {
                        distObjs(D.GetSelected(msg) || mediaObjs, args.shift());
                        break;
                    }
                    case "adjust": {
                        adjustObj(mediaObjs, ...args.map((x) => D.Float(x)));
                        break;
                    }
                    case "clean": {
                        Media.Polish();
                        break;
                    }
                    // no default
                }
                break;
            }
            case "!area":
            case "!areas": {
                const [imgObj] = D.GetSelected(msg) || Listener.GetObjects(objects, "graphic");
                switch (D.LCase((call = args.shift()))) {
                    case "reg":
                    case "register": {
                        if (!args.length)
                            args.unshift(msg.content.split(/\s+/gu).pop());
                        if (args.length && VAL({imgObj}, "!area register"))
                            regArea(imgObj, args.shift());
                        else
                            D.Alert("Syntax: !area reg &lt;areaName&gt;", "!area reg");
                        break;
                    }
                    case "get": {
                        switch (D.LCase((call = args.shift()))) {
                            case "names": {
                                D.Alert(`Registered Areas:<br>${D.JS(Object.keys(REGISTRY.AREA))}`);
                                break;
                            }
                            // no default
                        }
                    }
                    // no default
                }
                break;
            }
            case "!img": {
                let imgParams, imgModes, imgSrcs;
                const imgObjs = Listener.GetObjects(objects, "graphic");
                switch (D.LCase((call = args.shift()))) {
                    case "testtokens": {
                        D.Show(
                            _.uniq([
                                ..._.flatten(Object.values(REGISTRY.TOKEN.GENERIC)),
                                ..._.flatten(Object.values(_.omit(REGISTRY.TOKEN, "GENERIC")).map((x) => Object.values(x.srcs).map((xx) => [xx])))
                            ])
                        );
                        break;
                    }
                    case "get": {
                        switch (D.LCase((call = args.shift()))) {
                            case "data": {
                                D.Alert(D.JS(getImgData(imgObjs.shift())), "MEDIA, !img get data");
                                break;
                            }
                            case "realdata": {
                                D.Alert(D.JS(getImgObj(imgObjs.shift()), true), "MEDIA, !img get realdata");
                                break;
                            }
                            case "names": {
                                D.Alert(`<b>IMAGE NAMES:</b><br><br>${D.JS(Object.keys(REGISTRY.IMG).sort())}`);
                                break;
                            }
                            case "charsin": {
                                const containedCharObjs = [];
                                for (const imgObj of imgObjs)
                                    containedCharObjs.push(...Media.GetContainedChars(getImgKey(imgObj), {padding: 50}));
                                D.Alert(D.JS(containedCharObjs), "Contained Characters");
                                break;
                            }
                            // no default
                        }
                        break;
                    }
                    case "rereg":
                    case "reregister": {
                        const [imgObj] = imgObjs;
                        if (isRegImg(imgObj)) {
                            const imgData = getImgData(msg, true);
                            args[0] = (args[0] !== "x" && args[0]) || imgData.name;
                            args[1] = (args[1] !== "x" && args[1]) || imgData.curSrc;
                            args[2] = (args[2] !== "x" && args[2]) || imgData.activeLayer;
                            imgParams = args.slice(2).join(" ");
                            imgModes = JSON.parse(JSON.stringify(imgData.modes));
                            imgSrcs = D.Clone(imgData.srcs);
                            removeImg(imgObj, true);
                        }
                    }
                    // falls through
                    case "reg":
                    case "register": {
                        const [imgObj] = imgObjs;
                        if (VAL({imgObj}, "!img register"))
                            switch (D.LCase((call = args.shift()))) {
                                case "token": {
                                    if (VAL({imgObj}))
                                        regToken(imgObj);
                                    break;
                                }
                                case "generic":
                                case "generictoken":
                                case "gen":
                                case "gentoken": {
                                    const [tokenCat] = args;
                                    for (const img of imgObjs)
                                        if (VAL({img}))
                                            regGenericToken(img, tokenCat);
                                    break;
                                }
                                case "random":
                                case "randomizertoken":
                                case "randtoken": {
                                    regRandomizerToken(imgObj);
                                    break;
                                }
                                case "cyclesrc":
                                case "cycle": {
                                    if (isRegImg(imgObj)) {
                                        const hostName = getImgKey(imgObj);
                                        REGISTRY.IMG[hostName].cycleSrcs = [];
                                        REGISTRY.IMG[hostName].cycleSrcs.push(REGISTRY.IMG[hostName].curSrc);
                                        D.Alert(
                                            `${D.JS(hostName)} Registered as a Cycling Image.<br><br>Currently Displaying '${D.JS(
                                                REGISTRY.IMG[hostName].curSrc
                                            )}'.`,
                                            "!img reg cyclesrc"
                                        );
                                    } else {
                                        D.Alert(
                                            "Must register the image as normal first!<br><br>Syntax: !img reg <hostname> <srcName> <activeLayer>",
                                            "!img reg cyclesrc"
                                        );
                                    }
                                    break;
                                }
                                default: {
                                    if (call)
                                        args.unshift(call);
                                    const [hostName, srcName, objLayer, ...paramArgs] = args;
                                    imgParams = imgParams || paramArgs.join(" ");
                                    if (hostName && srcName && objLayer) {
                                        regImg(imgObj, hostName, srcName, objLayer, D.ParseToObj(imgParams));
                                        if (imgModes)
                                            REGISTRY.IMG[getImgKey(imgObj)].modes = imgModes;
                                        if (imgSrcs)
                                            REGISTRY.IMG[getImgKey(imgObj)].srcs = imgSrcs;
                                    } else {
                                        D.Alert(
                                            "Syntax: !img reg &lt;hostName&gt; &lt;(ref:)currentSourceName&gt; &lt;activeLayer&gt; [params (\"key:value, key:value\")]<br><br>OR !img rereg &lt;replace any of the above parameters with 'x' to skip it &gt;",
                                            "MEDIA: !img reg"
                                        );
                                    }
                                    break;
                                }
                            }
                        else
                            D.Alert(
                                "Syntax: !img reg &lt;hostName&gt; &lt;(ref:)currentSourceName&gt; &lt;activeLayer(objects/map/walls/gmlayer)&gt; &lt;isStartingActive&gt; [params (\"key:value, key:value\")]<br><br>OR !img rereg &lt;replace any of the above parameters with 'x' to skip it &gt;<br><br>!img reg token &lt;tokenName&rt;",
                                "MEDIA: !img reg"
                            );
                        break;
                    }
                    case "set": {
                        switch (D.LCase((call = args.shift()))) {
                            case "mode": {
                                const [hostName, mode, ...paramArgs] = args;
                                const imgKey = getImgKey(hostName);
                                // D.Alert(`Sending to ParseParams: ${args.join(" ")} --> ${D.JS(D.ParseParams(args.join(" ")))}`)
                                const params = D.ParseParams(paramArgs.join(" "));
                                // D.Alert(`Params: ${D.JS(params)}`)
                                if (!Session.Modes.includes(mode)) {
                                    D.Alert(
                                        "Mode Set Syntax:<br><br><b>!img set mode (hostName) (mode) (key:val, key:val...)</b><br><br>isForcedOn: true, false, null, \"LAST\"<br>isForcedState: true, null, (string)<br>lastState: null, (string)<br>lastActive: true, false",
                                        "!img set mode"
                                    );
                                } else {
                                    REGISTRY.IMG[imgKey].modes = REGISTRY.IMG[imgKey].modes || {};
                                    REGISTRY.IMG[imgKey].modes[mode] = REGISTRY.IMG[imgKey].modes[mode] || {};
                                    for (const key of Object.keys(params)) {
                                        if (["true", "false", "null"].includes(D.LCase(params[key])))
                                            params[key] = {true: true, false: false, null: null}[D.LCase(params[key])];
                                        REGISTRY.IMG[imgKey].modes[mode][key] = params[key];
                                    }
                                    D.Alert(`${mode} mode for ${imgKey} set to ${D.JS(REGISTRY.IMG[imgKey].modes[mode])}`, "!img set mode");
                                }
                                break;
                            }
                            case "source":
                            case "src": {
                                const [imgObj] = imgObjs;
                                const [hostName, srcName] = [getImgKey(imgObj), args.shift()];
                                if (isRegImg(hostName))
                                    setImg(hostName, srcName);
                                else
                                    D.Alert(`Img name ${D.JS(hostName)} is not registered.`, "MEDIA: !img set src");
                                break;
                            }
                            case "tokensrc": {
                                const charObjs = Listener.GetObjects(objects, "characters");
                                for (const charObj of charObjs)
                                    if (VAL({charObj}))
                                        combineTokenSrc(charObj, args.join(" "));
                                break;
                            }
                            case "activesource":
                            case "activesrc": {
                                const [imgObj] = imgObjs;
                                const [hostName, srcName] = [getImgKey(imgObj), args.shift()];
                                if (isRegImg(hostName))
                                    setImgData(hostName, {activeSrc: srcName});
                                else
                                    D.Alert(`Img name ${D.JS(hostName)} is not registered.`, "MEDIA: !img set activesrc");
                                break;
                            }
                            case "area": {
                                const [imgObj] = imgObjs;
                                if (VAL({imgObj}, "!img set area"))
                                    setImgArea(imgObj, args.shift(), args.shift().toLowerCase === "resize");
                                break;
                            }
                            case "params": {
                                const [imgObj] = imgObjs;
                                const params = D.ParseParams(args);
                                if (VAL({imgObj}, "!img set params"))
                                    setImgTemp(imgObj, params);
                                break;
                            }
                            case "front": {
                                const [imgObj] = imgObjs;
                                if (VAL({imgObj}, "!img set front")) {
                                    const modeData = getModeData(imgObj);
                                    if (!modeData) {
                                        D.Alert(`No mode data for ${D.JS(imgObj)}!<br>Toggling & sending to front anyways!`, "!img set front");
                                        toggleImg(imgObj, true, true);
                                        toFront(imgObj);
                                    } else if (modeData.isForcedOn === "NEVER") {
                                        D.Alert(`Can't toggle ${D.JS(imgObj)} on: isForcedOn = "NEVER"`, "!img set front");
                                    } else {
                                        D.Alert(`Toggling ON and sending ${D.JS(imgObj)} to Front`, "MEDIA: !img set front");
                                        toggleImg(imgObj, true, true);
                                        toFront(imgObj);
                                    }
                                }
                                break;
                            }
                            // no default
                        }
                        break;
                    }
                    case "bind": bindImgs(imgObjs, args[0] === "off" || args[0] === "true"); break;
                    case "clean":
                    case "cleanreg":
                    case "cleanregistry": {
                        clearMissingRegImgs(args[0] && args[0].includes("kill"));
                        break;
                    }
                    case "clearunreg":
                        clearUnregImgs(args[0] && args[0].includes("kill"), false);
                        break;
                    case "add": {
                        const [imgObj] = imgObjs;
                        let srcName;
                        switch (D.LCase((call = args.shift()))) {
                            case "cyclesrc":
                            case "cycle": {
                                const hostName = getImgKey(imgObj);
                                srcName = args.shift();
                                if (VAL({string: srcName}, "!img add cyclesrc") && isRegImg(hostName)) {
                                    REGISTRY.IMG[hostName].cycleSrcs = REGISTRY.IMG[hostName].cycleSrcs || [];
                                    REGISTRY.IMG[hostName].cycleSrcs.push(srcName);
                                }
                                if (srcName === "blank" || Object.keys(REGISTRY.IMG[hostName].srcs).includes(srcName)) {
                                    D.Alert(
                                        `Existing image source '${srcName}' added to cycling queue.<br><br>Current Cycling Queue: ${REGISTRY.IMG[hostName].cycleSrcs}`,
                                        "!img add cyclesrc"
                                    );
                                    break;
                                }
                                D.Alert(`Adding '${srcName}' to cycling queue; proceeding to add image as source.`, "!img add cyclesrc");
                            }
                            // falls through
                            case "src":
                            case "source": {
                                const hostName = getImgKey(imgObj);
                                srcName = srcName || args.shift();
                                if (VAL({string: srcName}, "!img add cyclesrc") && isRegImg(hostName)) {
                                    if (!_.isObject(REGISTRY.IMG[hostName].srcs))
                                        REGISTRY.IMG[hostName].srcs = {};
                                    if (srcName)
                                        addImgSrc(msg, hostName, srcName);
                                    else
                                        D.Alert(`Invalid image name '${D.JS(srcName)}'`, "MEDIA: !img add src");
                                } else {
                                    D.Alert(`Host name '${D.JS(hostName)}' not registered.`, "MEDIA: !img add src");
                                }
                                break;
                            }
                            case "random":
                            case "randomsrc":
                            case "tokensrc":
                            case "tokensource": {
                                const [charObj] = Listener.GetObjects(objects, "character");
                                const [tokenSrcObj] = D.GetSelected(msg);
                                const tokenSrcName = args[0];
                                DB(
                                    {
                                        charObj,
                                        tokenSrcObj,
                                        tokenSrcName
                                    },
                                    "addTokenSrc"
                                );
                                if (VAL({charObj, imgObj: tokenSrcObj, string: tokenSrcName}))
                                    addTokenSrc(tokenSrcObj, charObj, tokenSrcName);
                                else
                                    D.Alert(
                                        "Select the image source object, then supply both the character and source name as parameters.",
                                        "!img add tokensource"
                                    );
                                break;
                            }
                            default: {
                                D.Alert("<b>Syntax:<br><br><pre>!img add &lt;src/area&gt; &lt;hostName&gt; &lt;srcName&gt;</pre>", "MEDIA: !img add");
                                break;
                            }
                        }
                        break;
                    }
                    case "del":
                    case "delete": {
                        switch (D.LCase((call = args.shift()))) {
                            case "all": {
                                for (const hostName of Object.keys(REGISTRY.IMG))
                                    if (D.LCase(hostName).includes(D.LCase(args.join(" "))))
                                        removeImg(hostName);
                                break;
                            }
                            default: {
                                for (const imgObj of imgObjs)
                                    removeImg(imgObj);
                                break;
                            }
                        }
                        break;
                    }
                    case "unreg":
                    case "unregister": {
                        switch (D.LCase((call = args.shift()))) {
                            case "allimg":
                            case "allimages": {
                                for (const hostName of Object.keys(REGISTRY.IMG))
                                    if (D.LCase(hostName).includes(D.LCase(args.join(" "))))
                                        removeImg(hostName, true);
                                break;
                            }
                            default: {
                                const imgRefs = [...imgObjs, ...args];
                                if (call)
                                    imgRefs.push(call);
                                for (const imgRef of imgRefs) {
                                    const imgKeys = _.compact(
                                        _.flatten([
                                            getImgKey(imgRef)
                                            || (VAL({string: imgRef})
                                                && Object.keys(REGISTRY.IMG).map((x) => x.match(new RegExp(`^${imgRef}_?\\d*$`, "gu"))))
                                            || null
                                        ])
                                    );
                                    for (const imgKey of imgKeys) {
                                        removeImg(imgKey, true);
                                        if (REGISTRY.IMG[imgKey])
                                            delete REGISTRY.IMG[imgKey];
                                    }
                                }
                                break;
                            }
                        }
                        break;
                    }
                    case "reset": {
                        switch (D.LCase((call = args.shift()))) {
                            case "pos":
                            case "position": {
                                for (const imgObj of imgObjs)
                                    if (VAL({imgObj}, "!img set pos")) {
                                        const hostName = getImgKey(imgObj);
                                        REGISTRY.IMG[hostName].top = D.Int(imgObj.get("top"));
                                        REGISTRY.IMG[hostName].left = D.Int(imgObj.get("left"));
                                        REGISTRY.IMG[hostName].height = D.Int(imgObj.get("height"));
                                        REGISTRY.IMG[hostName].width = D.Int(imgObj.get("width"));
                                        D.Alert(`Position Set for Img ${hostName}<br><br><pre>${D.JS(REGISTRY.IMG[hostName])}</pre>`);
                                    }
                                break;
                            }
                            case "cyclesrc":
                            case "cyclesrcs": {
                                const imgKey = getImgKey(imgObjs.shift());
                                if (isRegImg(imgKey))
                                    delete REGISTRY.IMG[imgKey].cycleSrcs;
                                break;
                            }
                            // no default
                        }
                        break;
                    }
                    case "toggle": {
                        switch (D.LCase((call = args.shift()))) {
                            case "on": {
                                for (const imgObj of imgObjs)
                                    toggleImg(imgObj, true);
                                break;
                            }
                            case "off": {
                                for (const imgObj of imgObjs)
                                    toggleImg(imgObj, false);
                                break;
                            }
                            case "token": {
                                const charObjs = Listener.GetObjects(objects, "character");
                                switch (D.LCase((call = args.shift()))) {
                                    case "on": {
                                        toggleTokens(charObjs, true);
                                        break;
                                    }
                                    case "off": {
                                        toggleTokens(charObjs, false);
                                        break;
                                    }
                                    // no default
                                }
                                break;
                            }
                            case "bind": case "bindings": case "binds": {
                                STATE.REF.areImgsBound = !STATE.REF.areImgsBound;
                                D.Alert(`Bound Images <b>${STATE.REF.areImgsBound ? "LINKED" : "UNLINKED"}</b>`, "!img toggle bind");
                                break;
                            }
                            case "log": {
                                imgRecord = !imgRecord;
                                if (imgRecord)
                                    D.Alert("Logging image data as they are added to the sandbox.", "MEDIA, !img toggle log");
                                else
                                    D.Alert("Img logging disabled.", "MEDIA, !img toggle log");
                                break;
                            }
                            case "resize": {
                                const params = D.ParseParams(args);
                                if ((!imgResize || params.length) && params.height && params.width) {
                                    imgResize = true;
                                    STATE.REF.imgResizeDims.height = params.height;
                                    STATE.REF.imgResizeDims.width = params.width;
                                    D.Alert(
                                        `New imagess automatically resized to height: ${STATE.REF.imgResizeDims.height}, width: ${STATE.REF.imgResizeDims.width}.`,
                                        "!img toggle resize"
                                    );
                                } else {
                                    imgResize = false;
                                    D.Alert("Img resizing disabled.", "MEDIA, !img toggle resize");
                                }
                                break;
                            }
                            case "autopos": {
                                const mapIndObj = getImgObj("MapIndicator_Base_1");
                                toFront(mapIndObj);
                                if (!["confirm", "skip"].includes(args[0])) {
                                    STATE.REF.siteNamesOnDeck = Object.keys(_.omit(C.SITES, (v) => v.district === null));
                                    D.Alert("Site Names loaded, prepare to identify map locations on my mark!", "Auto Site Movement");
                                } else if (args[0] === "confirm") {
                                    state.VAMPIRE.Session.locationPointer[STATE.REF.siteNamesOnDeck[0]] = {
                                        pointerPos: {left: D.Int(mapIndObj.get("left")), top: D.Int(mapIndObj.get("top"))}
                                    };
                                    D.Alert(
                                        `Site <b>${STATE.REF.siteNamesOnDeck[0]}</b> placed at: ${D.JS(
                                            state.VAMPIRE.Session.locationPointer[STATE.REF.siteNamesOnDeck.shift()]
                                        )}!`
                                    );
                                } else if (args[0] === "skip") {
                                    D.Alert(`Skipping <b>${STATE.REF.siteNamesOnDeck.shift()}</b>`);
                                }
                                if (STATE.REF.siteNamesOnDeck.length)
                                    D.Alert(
                                        `Now position site <b>${STATE.REF.siteNamesOnDeck[0]}</b><br><br>!img toggle autopos confirm or skip to continue!`,
                                        "Auto Site Movement"
                                    );
                                break;
                            }
                            case "autosrc": {
                                const [imgObj] = Listener.GetObjects(objects, "graphic");
                                if (imgSrcAutoReg) {
                                    imgSrcAutoReg = false;
                                    D.Alert("Automatic registration of image sources toggled OFF.", "!img toggle autosrc");
                                } else {
                                    const hostName = getImgKey(imgObj);
                                    const keysSrc = args.shift();
                                    if (isRegImg(hostName) /* && C[(keysSrc || "").toUpperCase()] */) {
                                        STATE.REF.autoRegSrcNames = Object.keys(REGISTRY.IMG[hostName].srcs); // Complications.Cards.map(x => x.name) // Object.keys(C[keysSrc.toUpperCase()])
                                        imgSrcAutoReg = hostName;
                                        D.Alert(
                                            `Automatic registration of image sources toggled ON for ${D.JS(hostName)}.<br><br>Upload image for <b>${
                                                STATE.REF.autoRegSrcNames[0]
                                            }</b>`,
                                            "Image Auto Registration"
                                        );
                                    } else {
                                        D.Alert(`No '${keysSrc}' keys found for image host name '${D.JS(hostName)}'`, "!img toggle autosrc");
                                    }
                                }
                                break;
                            }
                            case "autogeneric": {
                                if (imgSrcAutoGeneric && !args[0]) {
                                    imgSrcAutoGeneric = false;
                                    D.Alert("Automatic registration of generic tokens toggled OFF", "!img toggle autogeneric");
                                } else {
                                    const [tokenCat] = args;
                                    imgSrcAutoGeneric = D.LCase(tokenCat);
                                    REGISTRY.TOKEN.GENERIC[imgSrcAutoGeneric] = REGISTRY.TOKEN.GENERIC[imgSrcAutoGeneric] || [];
                                    D.Alert(
                                        `Automatic registration of generic token images toggled ON.<br><br>Token Category: <b>${D.UCase(
                                            imgSrcAutoGeneric
                                        )}</b>`,
                                        "!img toggle autogeneric"
                                    );
                                }
                                break;
                            }
                            case "autotoken": {
                                if (args[0] === "skip") {
                                    let skippedName;
                                    if (imgSrcAddingProfilePic) {
                                        skippedName = imgSrcAddingProfilePic.get("name");
                                        imgSrcAddingProfilePic = false;
                                    } else {
                                        [skippedName] = STATE.REF.autoRegTokenNames;
                                        STATE.REF.autoRegTokenNames.shift();
                                    }
                                    if (imgSrcAutoToken && skippedName && STATE.REF.autoRegTokenNames.length) {
                                        D.Alert(
                                            `Skipping <b>${skippedName}</b>...<br>Upload token image for <b>${STATE.REF.autoRegTokenNames[0]}`,
                                            "Token Auto Registration"
                                        );
                                    } else if (imgSrcAutoToken) {
                                        imgSrcAutoToken = false;
                                        D.Alert("Automatic registration of character tokens toggled OFF.", "!img toggle autotoken");
                                    }
                                } else {
                                    if (imgSrcAutoToken) {
                                        imgSrcAutoToken = false;
                                        D.Alert("Automatic registration of character tokens toggled OFF.", "!img toggle autotoken");
                                    } else {
                                        imgSrcAutoToken = true;
                                        STATE.REF.autoRegTokenNames = D.GetChars("all").get("name");
                                        if (VAL({number: args[0]}))
                                            STATE.REF.autoRegTokenNames = STATE.REF.autoRegTokenNames.slice(D.Int(args[0]));
                                        D.Alert(
                                            `Automatic registration of character tokens toggled ON.<br><br>Upload image for <b>${STATE.REF.autoRegTokenNames[0]}"</b><br>... OR "!img toggle autotoken skip" to skip.`,
                                            "Token Auto Registration"
                                        );
                                    }
                                }
                                break;
                            }
                            default: {
                                D.Alert(
                                    "Must state either 'on', 'off', 'log', 'autosrc' or 'resize'.  <b>Syntax:</b><br><br><pre>!img toggle &lt;on/off&gt; &lt;hostnames&gt;</pre><br><pre>!img toggle log/resize</pre>",
                                    "MEDIA: !img toggle"
                                );
                                break;
                            }
                        }
                        break;
                    }
                    case "align": {
                        alignObjs(imgObjs, ...args);
                        break;
                    }
                    case "resize": {
                        resizeImgs(imgObjs, args);
                        break;
                    }
                    case "dist": {
                        distObjs(imgObjs, args.shift());
                        break;
                    }
                    case "fix": {
                        fixImgObjs();
                        break;
                    }
                    // no default
                }
                break;
            }
            case "!text": {
                let imgParams, imgModes;
                const textObjs = Listener.GetObjects(objects, "text");
                switch (D.LCase((call = args.shift()))) {
                    case "get": {
                        switch (D.LCase((call = args.shift()))) {
                            case "data": {
                                const [textObj] = textObjs;
                                if (VAL({textObj}, "!text get data"))
                                    D.Alert(D.JS(getTextData(textObj)), "!text get data");
                                break;
                            }
                            case "realdata": {
                                D.Alert(D.JS(getTextObj(textObjs.shift()), true), "MEDIA, !text get realdata");
                                break;
                            }
                            case "width": {
                                const [textObj] = textObjs;
                                const textString = msg.content.match(/@@(.*?)@@/iu)[1];
                                D.Alert(`The width of @@${textString}@@ is ${getTextWidth(textObj, textString, false)}`);
                                break;
                            }
                            case "names": {
                                D.Alert(D.JS(Object.keys(REGISTRY.TEXT).sort()), "!text get names");
                                break;
                            }
                            case "widths": {
                                const dbStrings = [];
                                for (const textData of _.values(STATE.REF.textregistry)) {
                                    textData.justification = "left";
                                    const textObj = getObj("text", textData.id);
                                    if (textObj) {
                                        const text = textObj.get("text");
                                        const left = textObj.get("left");
                                        const textWidth = getTextWidth(textObj, text);
                                        let width = textObj.get("width");
                                        if (width === 0) {
                                            textObj.set("left", left + 10);
                                            width = textObj.get("width");
                                            textObj.set("left", left);
                                        }
                                        dbStrings.push(`${textData.name}: width: ${width} --> ${textWidth}`);
                                    }
                                }
                                D.Alert(`${dbStrings.join("<br>")}`, "Text Width Check");
                                break;
                            }
                            // no default
                        }
                        break;
                    }
                    case "set": {
                        switch (D.LCase((call = args.shift()))) {
                            case "mode": {
                                const [hostName, mode, key, val] = args;
                                const textKey = getTextKey(hostName);
                                if (
                                    !Session.Modes.includes(mode)
                                    || !["isForcedOn", "isForcedState", "lastActive", "lastState"].includes(key)
                                    || !["true", "false", "null", "LAST", "NEVER"].includes(val)
                                ) {
                                    D.Alert("Mode Set Syntax:<br><br><b>!text set mode (hostName) (mode) (key) (val)</b>", "!text set mode");
                                } else {
                                    REGISTRY.TEXT[textKey].modes = REGISTRY.TEXT[textKey].modes || {};
                                    REGISTRY.TEXT[textKey].modes[mode] = REGISTRY.TEXT[textKey].modes[mode] || {};
                                    REGISTRY.TEXT[textKey].modes[mode][key] = {
                                        true: true,
                                        false: false,
                                        null: null,
                                        LAST: "LAST",
                                        NEVER: "NEVER"
                                    }[val];
                                    D.Alert(`${mode} mode for ${textKey} set to ${D.JS(REGISTRY.TEXT[textKey].modes[mode])}`, "!text set mode");
                                }
                                break;
                            }
                            case "font": {
                                const textObj = textObjs.pop();
                                const fontFamily = args.join(" ");
                                let fontMatch
                                    = (fontFamily.length > 4
                                        && D.IsIn(D.LCase(fontFamily), [
                                            "candal",
                                            "contrail",
                                            "contrail one",
                                            "light",
                                            "shadows into light",
                                            "patrick hand",
                                            "arial"
                                        ]))
                                    || "";
                                D.Alert(`Text Objs: ${D.JS(textObjs)}<br>Text Obj: ${D.JS(textObj)}<br>Text Obj ID: ${textObj.id}`);
                                switch (D.LCase(fontMatch)) {
                                    case "contrail":
                                        fontMatch = "contrail one";
                                    // falls through
                                    case "light":
                                        fontMatch = fontMatch.replace(/light/gu, "shadows into light");
                                    // falls through
                                    default: {
                                        const attrs = {font_family: D.Capitalize(fontMatch, true)};
                                        DB({textObjs, textObj, attrs}, "textSetFont");
                                        textObj.set(attrs);
                                        setTextData(textObj, attrs);
                                        break;
                                    }
                                }
                                break;
                            }
                            case "updateslave": {
                                updateSlaveText(args.shift());
                                break;
                            }
                            case "slave": {
                                try {
                                    const [textObj] = textObjs;
                                    const [hostName, edgeDir, horizPad, vertPad] = args;
                                    linkText(hostName, {[edgeDir]: [getTextKey(textObj)]}, D.Int(horizPad), D.Int(vertPad));
                                } catch (errObj) {
                                    D.Alert(
                                        `Syntax: !text set slave (hostName) (edgeDirection) (horizPad) (vertPad)<br>${JSON.stringify(errObj)}`,
                                        "!text set slave"
                                    );
                                }
                                break;
                            }
                            case "justify":
                            case "justification":
                            case "just": {
                                const justification = args.shift() || "center";
                                for (const textObj of textObjs)
                                    justifyText(textObj, justification);
                                break;
                            }
                            case "params": {
                                const [textObj] = textObjs;
                                const params = D.ParseParams(args);
                                if (VAL({textObj}, "!text set params"))
                                    setTextData(textObj, params);
                                break;
                            }
                            case "front": {
                                const [textObj] = textObjs;
                                if (VAL({textObj}, "!text set front")) {
                                    const modeData = getModeData(textObj);
                                    if (!modeData) {
                                        D.Alert(`No mode data for ${D.JS(textObj)}!<br>Toggling & sending to front anyways!`, "!text set front");
                                        toggleText(textObj, true, true);
                                        toFront(textObj);
                                    } else if (modeData.isForcedOn === "NEVER") {
                                        D.Alert(`Can't toggle ${D.JS(textObj)} on: isForcedOn = "NEVER"`, "!text set front");
                                    } else {
                                        D.Alert(`Toggling ON and sending ${D.JS(textObj)} to Front`, "MEDIA: !text set front");
                                        toggleText(textObj, true, true);
                                        toFront(textObj);
                                    }
                                }
                                break;
                            }
                            default: {
                                const [textObj] = textObjs;
                                if (VAL({textObj}, "!text set"))
                                    setText(textObj, args.join(" ") || " ");
                                break;
                            }
                            // no default
                        }
                        break;
                    }
                    case "clearunreg":
                    case "killunreg":
                        clearUnregText(call === "killunreg");
                        break;
                    case "reset":
                    case "resetreg":
                    case "resetregistry": {
                        switch (D.LCase((call = args.shift()))) {
                            case "pos":
                            case "position": {
                                const [textObj] = textObjs;
                                if (isRegText(textObj)) {
                                    const hostName = getTextKey(textObj);
                                    setTextData(textObj, {
                                        top: D.Int(textObj.get("top")),
                                        left: getBlankLeft(textObj),
                                        layer: textObj.get("layer")
                                    });
                                    D.Alert(`Position Set for Text ${hostName}<br><br><pre>${D.JS(REGISTRY.TEXT[hostName])}</pre>`);
                                } else {
                                    D.Alert("Select a text object first!", "MEDIA: !text set position");
                                }
                                break;
                            }
                            default: {
                                resetTextRegistry();
                                break;
                            }
                        }
                        break;
                    }
                    case "del":
                    case "delete": {
                        switch (D.LCase((call = args.shift()))) {
                            case "all": {
                                for (const hostName of Object.keys(REGISTRY.TEXT))
                                    if (D.LCase(hostName).includes(D.LCase(args.join(" "))))
                                        removeText(hostName);
                                break;
                            }
                            default: {
                                for (const textObj of textObjs)
                                    removeText(textObj);
                                break;
                            }
                        }
                        break;
                    }
                    case "rereg":
                    case "reregister": {
                        const [textObj] = textObjs;
                        if (isRegText(textObj)) {
                            const textData = getTextData(msg);
                            args[0] = (args[0] !== "x" && args[0]) || textData.name;
                            args[1] = (args[1] !== "x" && args[1]) || textData.activeLayer;
                            args[2] = (args[2] !== "x" && args[2]) || hasShadowObj(msg);
                            args[3] = (args[3] !== "x" && args[3]) || textData.justification;
                            imgParams = args.slice(3).join(" ");
                            imgParams
                                = _.compact([
                                    imgParams.includes("vertAlign") ? "" : `vertAlign:${textData.vertAlign || "top"}`,
                                    textData.maxWidth && !imgParams.includes("maxWidth") ? `maxWidth:${textData.maxWidth}` : "",
                                    imgParams.includes("zIndex") ? "" : `zIndex:${textData.zIndex || 300}`
                                ]).join(",") + imgParams;
                            imgModes = JSON.parse(JSON.stringify(textData.modes));
                            removeText(msg, true, true);
                        }
                    }
                    // falls through
                    case "reg":
                    case "register": {
                        if (args.length) {
                            const [textObj] = textObjs;
                            if (textObj) {
                                const [hostName, objLayer, isShadow, justification, ...paramArgs] = args;
                                imgParams = imgParams || paramArgs.join(" ");
                                if (hostName && objLayer) {
                                    regText(
                                        textObj,
                                        hostName,
                                        objLayer,
                                        !isShadow || isShadow !== "false",
                                        justification || "center",
                                        D.ParseToObj(imgParams)
                                    );
                                    if (imgModes)
                                        REGISTRY.TEXT[getTextKey(textObj)].modes = imgModes;
                                } else {
                                    D.Alert(
                                        "Syntax: !text reg &lt;hostName&gt; &lt;activeLayer&gt; &lt;isMakingShadow&gt; &lt;justification&gt; [params (\"key:value, key:value\")]<br><br>OR !text rereg &lt;replace any of the above parameters with 'x' to skip it &gt;",
                                        "MEDIA: !text reg"
                                    );
                                }
                            } else {
                                D.Alert("Select a text object first!", "MEDIA: !text reg");
                            }
                        } else {
                            D.Alert(
                                "Syntax: !text reg &lt;hostName&gt; &lt;activeLayer(objects/map/walls/gmlayer)&gt; &lt;isMakingShadow&gt; &lt;justification&gt; [params (\"key:value, key:value\")]",
                                "MEDIA: !text reg"
                            );
                        }
                        break;
                    }
                    case "unreg":
                    case "unregister": {
                        switch (D.LCase((call = args.shift()))) {
                            case "alltext": {
                                for (const hostName of Object.keys(REGISTRY.TEXT))
                                    if (D.LCase(hostName).includes(D.LCase(args.join(" "))))
                                        removeText(hostName, true, true);
                                break;
                            }
                            default: {
                                const textRefs = [...textObjs, ...args];
                                if (call)
                                    textRefs.push(call);
                                for (const textRef of textRefs) {
                                    const textKeys = _.compact(
                                        _.flatten([
                                            getTextKey(textRef)
                                            || (VAL({string: textRef})
                                                && Object.keys(REGISTRY.TEXT).map((x) => x.match(new RegExp(`^${textRef}_?\\d*$`, "gu"))))
                                            || null
                                        ])
                                    );
                                    for (const textKey of textKeys) {
                                        removeText(textKey, true, true);
                                        if (REGISTRY.TEXT[textKey])
                                            delete REGISTRY.TEXT[textKey];
                                    }
                                }
                                break;
                            }
                        }
                        break;
                    }
                    case "toggle": {
                        switch (D.LCase((call = args.shift()))) {
                            case "on": {
                                for (const textObj of textObjs)
                                    toggleText(textObj, true, true);
                                break;
                            }
                            case "off": {
                                for (const textObj of textObjs)
                                    toggleText(textObj, false, true);
                                break;
                            }
                            default: {
                                D.Alert(
                                    "Must state either 'on' or 'off'.  <b>Syntax:</b><br><br><pre>!text toggle &lt;on/off&gt; &lt;hostnames&gt;</pre>",
                                    "MEDIA: !text toggle"
                                );
                                break;
                            }
                        }
                        break;
                    }
                    // no default
                }
                break;
            }
            case "!anim": {
                const imgObjs = Listener.GetObjects(objects, "graphic");
                switch (D.LCase((call = args.shift()))) {
                    case "reg":
                    case "register": {
                        const [imgObj] = imgObjs;
                        const [animName, timeOut] = args;
                        if (VAL({imgObj, string: animName, number: timeOut}, "!anim register")) {
                            regAnimation(imgObj, animName, D.Float(timeOut));
                            D.Alert(`Animation Registered:<br><br>${D.JS(REGISTRY.ANIM[animName])}`, "!anim register");
                        } else {
                            D.Alert("Syntax: <b>!anim register &lt;animName&gt; &lt;timeOut [ms]&gt;</b>", "!anim register");
                        }
                        break;
                    }
                    case "get": {
                        switch (D.LCase(call = args.shift())) {
                            case "data": {
                                D.Alert(D.JS(getImgData(imgObjs.shift())), "MEDIA, !anim get data");
                                break;
                            }
                            case "realdata": {
                                D.Alert(D.JS(getImgObj(imgObjs.shift()), true), "MEDIA, !img get realdata");
                                break;
                            }
                            case "names": {
                                D.Alert(`<b>ANIMATION NAMES:</b><br><br>${D.JS(Object.keys(REGISTRY.ANIM).sort())}`);
                                break;
                            }
                            // no default
                        }
                        break;
                    }
                    case "set": {
                        switch (D.LCase((call = args.shift()))) {
                            case "timeout": {
                                const hostName = getImgKey(imgObjs.shift());
                                const timeOut = args.shift();
                                if (VAL({string: hostName, number: timeOut}, "!anim set timeout")) {
                                    REGISTRY.ANIM[hostName].timeOut = D.Int(1000 * D.Float(timeOut));
                                    flashAnimation(hostName);
                                }
                                break;
                            }
                            case "data": {
                                const hostName = getImgKey(imgObjs.shift());
                                const [minTime, maxTime, soundName, validModes] = args;
                                if (VAL({string: [hostName, soundName], number: [minTime, maxTime]}, "!anim set sound", true)) {
                                    setAnimTimerData(hostName, minTime, maxTime, soundName === "x" ? null : soundName, validModes);
                                    D.Alert(D.JS(REGISTRY.ANIM[hostName]), "!anim set sound");
                                }
                                break;
                            }
                            // no default
                        }
                        break;
                    }
                    case "toggle": {
                        switch (D.LCase((call = args.shift()))) {
                            case "on": {
                                for (const imgObj of imgObjs)
                                    toggleAnimation(imgObj, true);
                                break;
                            }
                            case "off": {
                                for (const imgObj of imgObjs)
                                    toggleAnimation(imgObj, false);
                                break;
                            }
                            default: {
                                D.Alert(
                                    "Must state either 'on' or 'off'.  <b>Syntax:</b><br><br><pre>!anim toggle &lt;on/off&gt;</pre>",
                                    "MEDIA: !anim toggle"
                                );
                                break;
                            }
                        }
                        break;
                    }
                    case "activate": {
                        activateAnimation(getImgKey(imgObjs.shift()) || args.shift(), args.shift(), args.shift());
                        break;
                    }
                    case "deactivate": {
                        deactivateAnimation(getImgKey(imgObjs.shift()) || args.shift());
                        break;
                    }
                    case "flash": {
                        flashAnimation(getImgKey(imgObjs.shift()) || args.shift());
                        break;
                    }
                    case "kill": {
                        switch (D.LCase((call = args.shift()))) {
                            case "all": {
                                killAllAnims();
                                break;
                            }
                            default: {
                                killAnimation(imgObjs.shift());
                                break;
                            }
                        }
                        break;
                    }
                    // no default
                }
                break;
            }
            // no default
        }
        TRACEOFF(traceID);
    };
    const onGraphicAdd = (imgObj) => {
        const traceID = TRACEON("onGraphicAdd", [imgObj]);
        if (imgRecord)
            LOG(imgObj.get("imgsrc"));
        if (imgResize)
            imgObj.set(STATE.REF.imgResizeDims);
        if (imgSrcAutoReg && STATE.REF.autoRegSrcNames.length) {
            const hostName = imgSrcAutoReg;
            const srcName = STATE.REF.autoRegSrcNames.shift();
            addImgSrc(imgObj, hostName, srcName);
            if (STATE.REF.autoRegSrcNames.length) {
                D.Alert(`Upload image for <b>${STATE.REF.autoRegSrcNames[0]}</b>`, "Image Auto Registration");
            } else {
                delete STATE.REF.autoRegSrcNames;
                imgSrcAutoReg = false;
                D.Alert("Image auto registration complete!", "Image Auto Registration");
            }
            return TRACEOFF(traceID, true);
        }
        if (imgSrcAutoToken) {
            if (imgSrcAddingProfilePic) {
                const charObj = imgSrcAddingProfilePic;
                charObj.set("avatar", imgObj.get("imgsrc"));
                imgSrcAddingProfilePic = false;
                if (STATE.REF.autoRegTokenNames.length) {
                    D.Alert(`Upload token for <b>${STATE.REF.autoRegTokenNames[0]}</b>`, "Token Auto Registration");
                } else {
                    delete STATE.REF.autoRegTokenNames;
                    imgSrcAutoToken = false;
                    D.Alert("Token auto registration complete!", "Token Auto Registration");
                }
                imgObj.remove();
            } else if (STATE.REF.autoRegTokenNames.length) {
                const charName = STATE.REF.autoRegTokenNames.shift();
                const charObj
                    = D.GetChar(charName)
                    || createObj("character", {
                        name: charName,
                        inplayerjournals: "all",
                        controlledby: D.GMID()
                    });
                if (VAL({charObj})) {
                    imgObj.set({
                        height: 100,
                        width: 90,
                        represents: charObj.id,
                        name: charName
                    });
                    regToken(imgObj);
                    imgSrcAddingProfilePic = charObj;
                    D.Alert(`Upload profile image for <b>${imgSrcAddingProfilePic.get("name")}</b>`, "Token Auto Registration");
                } else {
                    imgSrcAddingProfilePic = false;
                    D.Alert("Error uploading token image.", "Token Auto Registration");
                }
            }
            return TRACEOFF(traceID, true);
        }
        if (imgSrcAutoGeneric && !isRegImg(imgObj) && !isCharToken(imgObj))
            if (regGenericToken(imgObj, imgSrcAutoGeneric))
                imgObj.remove();
        if (isRandomizerToken(imgObj))
            setRandomizerToken(imgObj);
        if (isCharToken(imgObj))
            setGenericToken(imgObj);
        return TRACEOFF(traceID, true);
    };
    const onGraphicChange = (imgObj, prevData) => {
        // DB({imgObj, prevData, areBound: STATE.REF.areImgsBound, isActive: isObjActive(imgObj)}, "onGraphicChange");
        if (STATE.REF.areImgsBound) {
            let imgKey = getImgKey(imgObj);
            // DB({imgKey}, "onGraphicChange");
            if (VAL({tokenObj: imgObj}))
                imgKey = imgObj.get("name");
            // DB({imgKey}, "onGraphicChange");
            if (imgKey in STATE.REF.boundImages) {
                const newAttrs = {
                    top: imgObj.get("top"),
                    left: imgObj.get("left")
                };
                for (const boundImgKey of STATE.REF.boundImages[imgKey]) {
                    if (isObjActive(boundImgKey)) {
                        toggle(boundImgKey, false);
                        setTimeout(() => { toggle(boundImgKey, true) }, 500);
                    }
                    setImgData(boundImgKey, newAttrs, true);
                }
            }
            //     const deltaAttrs = {};
            //     if ("top" in prevData && prevData.top !== imgObj.get("top"))
            //         deltaAttrs.top = prevData.top - imgObj.get("top");
            //     if ("left" in prevData && prevData.left !== imgObj.get("left"))
            //         deltaAttrs.left = prevData.left - imgObj.get("left");
            //     if ("height" in prevData && prevData.height !== imgObj.get("height"))
            //         deltaAttrs.height = imgObj.get("height") / prevData.height;
            //     if ("width" in prevData && prevData.width !== imgObj.get("width"))
            //         deltaAttrs.width = imgObj.get("width") / prevData.width;
            //     for (const boundImgKey of STATE.REF.boundImages[imgKey]) {
            //         const attrList = {};
            //         const imgData = getImgData(boundImgKey);
            //         if (deltaAttrs.top)
            //             attrList.top = imgData.top + deltaAttrs.top;
            //         if (deltaAttrs.left)
            //             attrList.left = imgData.left + deltaAttrs.left;
            //         if (deltaAttrs.height)
            //             attrList.height = imgData.height * deltaAttrs.height;
            //         if (deltaAttrs.width)
            //             attrList.width = imgData.width * deltaAttrs.width;
            //         if (attrList !== {})
            //             setImgData(boundImgKey, attrList, true);
            //     }
            // }
        }
    };
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    let [imgRecord, imgResize, imgSrcAutoReg, imgSrcAutoToken, imgSrcAutoGeneric, imgSrcAddingProfilePic] = [
            false,
            false,
            false,
            false,
            false,
            false
        ],
        progressBarTimer = null;
    const animTimers = {};
    const MODEDATAJSON = `[
        ["TEXT", "PlayerSpoofNoticeSplash", "isActive", "@@curState@@"],["TEXT", "PlayerSpoofNoticeSplash", "pageID", "SplashPage"],["TEXT", "PlayerSpoofNoticeSplash", "activeLayer", "gmlayer"],["TEXT", "PlayerSpoofNoticeSplash", "zIndex", 30030],["TEXT", "PlayerSpoofNoticeSplash", "modes", "Active", {"isForcedOn": null, "lastState": null}],["TEXT", "PlayerSpoofNoticeSplash", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "PlayerSpoofNoticeSplash", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["TEXT", "PlayerSpoofNoticeSplash", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["TEXT", "PlayerSpoofNoticeSplash", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["TEXT", "PlayerSpoofNoticeSplash", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "testSessionNoticeSplash", "isActive", "@@curState@@"],["TEXT", "testSessionNoticeSplash", "pageID", "SplashPage"],["TEXT", "testSessionNoticeSplash", "activeLayer", "gmlayer"],["TEXT", "testSessionNoticeSplash", "zIndex", 30000],["TEXT", "testSessionNoticeSplash", "modes", "Active", {"isForcedOn": null, "lastState": null}],["TEXT", "testSessionNoticeSplash", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "testSessionNoticeSplash", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["TEXT", "testSessionNoticeSplash", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["TEXT", "testSessionNoticeSplash", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["TEXT", "testSessionNoticeSplash", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RelationshipMap_1", "isActive", true],["IMG", "RelationshipMap_1", "curSrc", "base"],["IMG", "RelationshipMap_1", "activeSrc", "base"],["IMG", "RelationshipMap_1", "pageID", "SplashPage"],["IMG", "RelationshipMap_1", "activeLayer", "map"],["IMG", "RelationshipMap_1", "zIndex", 100],["IMG", "RelationshipMap_1", "modes", "Active", {"isForcedOn": true, "isForcedState": "base", "lastState": "base"}],["IMG", "RelationshipMap_1", "modes", "Inactive", {"isForcedOn": true, "isForcedState": "base", "lastState": "base"}],["IMG", "RelationshipMap_1", "modes", "Daylighter", {"isForcedOn": true, "isForcedState": "base", "lastState": "base"}],["IMG", "RelationshipMap_1", "modes", "Downtime", {"isForcedOn": true, "isForcedState": "base", "lastState": "base"}],["IMG", "RelationshipMap_1", "modes", "Spotlight", {"isForcedOn": true, "isForcedState": "base", "lastState": "base"}],["IMG", "RelationshipMap_1", "modes", "Complications", {"isForcedOn": true, "isForcedState": "base", "lastState": "base"}],["IMG", "SplashHorizon_1", "isActive", true],["IMG", "SplashHorizon_1", "curSrc", "base"],["IMG", "SplashHorizon_1", "activeSrc", "base"],["IMG", "SplashHorizon_1", "pageID", "SplashPage"],["IMG", "SplashHorizon_1", "activeLayer", "map"],["IMG", "SplashHorizon_1", "zIndex", 20],["IMG", "SplashHorizon_1", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "SplashHorizon_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "SplashHorizon_1", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "SplashHorizon_1", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "SplashHorizon_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "SplashHorizon_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "SplashMoon_1", "isActive", true],["IMG", "SplashMoon_1", "curSrc", "base"],["IMG", "SplashMoon_1", "activeSrc", "base"],["IMG", "SplashMoon_1", "pageID", "SplashPage"],["IMG", "SplashMoon_1", "activeLayer", "map"],["IMG", "SplashMoon_1", "zIndex", 30],["IMG", "SplashMoon_1", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "SplashMoon_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "SplashMoon_1", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "SplashMoon_1", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "SplashMoon_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "SplashMoon_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "SplashOverlay_1", "isActive", true],["IMG", "SplashOverlay_1", "curSrc", "base"],["IMG", "SplashOverlay_1", "activeSrc", "base"],["IMG", "SplashOverlay_1", "pageID", "SplashPage"],["IMG", "SplashOverlay_1", "activeLayer", "map"],["IMG", "SplashOverlay_1", "zIndex", 60],["IMG", "SplashOverlay_1", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "SplashOverlay_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "SplashOverlay_1", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "SplashOverlay_1", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "SplashOverlay_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "SplashOverlay_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "SplashWater_1", "isActive", true],["IMG", "SplashWater_1", "curSrc", "red0"],["IMG", "SplashWater_1", "activeSrc", "red0"],["IMG", "SplashWater_1", "pageID", "SplashPage"],["IMG", "SplashWater_1", "activeLayer", "map"],["IMG", "SplashWater_1", "zIndex", 40],["IMG", "SplashWater_1", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "SplashWater_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "SplashWater_1", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "SplashWater_1", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "SplashWater_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "SplashWater_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "Countdown", "isActive", true],["TEXT", "Countdown", "pageID", "SplashPage"],["TEXT", "Countdown", "activeLayer", "objects"],["TEXT", "Countdown", "zIndex", 4000],["TEXT", "Countdown", "modes", "Active", {"isForcedOn": null, "lastState": null}],["TEXT", "Countdown", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "Countdown", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["TEXT", "Countdown", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["TEXT", "Countdown", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["TEXT", "Countdown", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "NextSession", "isActive", true],["TEXT", "NextSession", "pageID", "SplashPage"],["TEXT", "NextSession", "activeLayer", "objects"],["TEXT", "NextSession", "zIndex", 4010],["TEXT", "NextSession", "modes", "Active", {"isForcedOn": null, "lastState": null}],["TEXT", "NextSession", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "NextSession", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["TEXT", "NextSession", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["TEXT", "NextSession", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["TEXT", "NextSession", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "PromptsAvailableNotice", "isActive", "@@curState@@"],["TEXT", "PromptsAvailableNotice", "pageID", "SplashPage"],["TEXT", "PromptsAvailableNotice", "activeLayer", "objects"],["TEXT", "PromptsAvailableNotice", "zIndex", 4020],["TEXT", "PromptsAvailableNotice", "modes", "Active", {"isForcedOn": null, "lastState": null}],["TEXT", "PromptsAvailableNotice", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "PromptsAvailableNotice", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["TEXT", "PromptsAvailableNotice", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["TEXT", "PromptsAvailableNotice", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["TEXT", "PromptsAvailableNotice", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "clockStatusNotice", "isActive", "@@curState@@"],["TEXT", "clockStatusNotice", "pageID", "GAME"],["TEXT", "clockStatusNotice", "activeLayer", "gmlayer"],["TEXT", "clockStatusNotice", "zIndex", 30010],["TEXT", "clockStatusNotice", "modes", "Active", {"isForcedOn": null, "lastState": null}],["TEXT", "clockStatusNotice", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "clockStatusNotice", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["TEXT", "clockStatusNotice", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["TEXT", "clockStatusNotice", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["TEXT", "clockStatusNotice", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "CompCard_Name_1", "isActive", false],["TEXT", "CompCard_Name_1", "pageID", "GAME"],["TEXT", "CompCard_Name_1", "activeLayer", "gmlayer"],["TEXT", "CompCard_Name_1", "zIndex", 20000],["TEXT", "CompCard_Name_1", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCard_Name_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "CompCard_Name_1", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCard_Name_1", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCard_Name_1", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCard_Name_1", "modes", "Complications", {"isForcedOn": true, "isForcedState": true, "lastState": "@@curText@@"}],["TEXT", "CompCard_Name_10", "isActive", false],["TEXT", "CompCard_Name_10", "pageID", "GAME"],["TEXT", "CompCard_Name_10", "activeLayer", "gmlayer"],["TEXT", "CompCard_Name_10", "zIndex", 20000],["TEXT", "CompCard_Name_10", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCard_Name_10", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "CompCard_Name_10", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCard_Name_10", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCard_Name_10", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCard_Name_10", "modes", "Complications", {"isForcedOn": true, "isForcedState": true, "lastState": "@@curText@@"}],["TEXT", "CompCard_Name_2", "isActive", false],["TEXT", "CompCard_Name_2", "pageID", "GAME"],["TEXT", "CompCard_Name_2", "activeLayer", "gmlayer"],["TEXT", "CompCard_Name_2", "zIndex", 20000],["TEXT", "CompCard_Name_2", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCard_Name_2", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "CompCard_Name_2", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCard_Name_2", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCard_Name_2", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCard_Name_2", "modes", "Complications", {"isForcedOn": true, "isForcedState": true, "lastState": "@@curText@@"}],["TEXT", "CompCard_Name_3", "isActive", false],["TEXT", "CompCard_Name_3", "pageID", "GAME"],["TEXT", "CompCard_Name_3", "activeLayer", "gmlayer"],["TEXT", "CompCard_Name_3", "zIndex", 20000],["TEXT", "CompCard_Name_3", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCard_Name_3", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "CompCard_Name_3", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCard_Name_3", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCard_Name_3", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCard_Name_3", "modes", "Complications", {"isForcedOn": true, "isForcedState": true, "lastState": "@@curText@@"}],["TEXT", "CompCard_Name_4", "isActive", false],["TEXT", "CompCard_Name_4", "pageID", "GAME"],["TEXT", "CompCard_Name_4", "activeLayer", "gmlayer"],["TEXT", "CompCard_Name_4", "zIndex", 20000],["TEXT", "CompCard_Name_4", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCard_Name_4", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "CompCard_Name_4", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCard_Name_4", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCard_Name_4", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCard_Name_4", "modes", "Complications", {"isForcedOn": true, "isForcedState": true, "lastState": "@@curText@@"}],["TEXT", "CompCard_Name_5", "isActive", false],["TEXT", "CompCard_Name_5", "pageID", "GAME"],["TEXT", "CompCard_Name_5", "activeLayer", "gmlayer"],["TEXT", "CompCard_Name_5", "zIndex", 20000],["TEXT", "CompCard_Name_5", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCard_Name_5", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "CompCard_Name_5", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCard_Name_5", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCard_Name_5", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCard_Name_5", "modes", "Complications", {"isForcedOn": true, "isForcedState": true, "lastState": "@@curText@@"}],["TEXT", "CompCard_Name_6", "isActive", false],["TEXT", "CompCard_Name_6", "pageID", "GAME"],["TEXT", "CompCard_Name_6", "activeLayer", "gmlayer"],["TEXT", "CompCard_Name_6", "zIndex", 20000],["TEXT", "CompCard_Name_6", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCard_Name_6", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "CompCard_Name_6", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCard_Name_6", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCard_Name_6", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCard_Name_6", "modes", "Complications", {"isForcedOn": true, "isForcedState": true, "lastState": "@@curText@@"}],["TEXT", "CompCard_Name_7", "isActive", false],["TEXT", "CompCard_Name_7", "pageID", "GAME"],["TEXT", "CompCard_Name_7", "activeLayer", "gmlayer"],["TEXT", "CompCard_Name_7", "zIndex", 20000],["TEXT", "CompCard_Name_7", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCard_Name_7", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "CompCard_Name_7", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCard_Name_7", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCard_Name_7", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCard_Name_7", "modes", "Complications", {"isForcedOn": true, "isForcedState": true, "lastState": "@@curText@@"}],["TEXT", "CompCard_Name_8", "isActive", false],["TEXT", "CompCard_Name_8", "pageID", "GAME"],["TEXT", "CompCard_Name_8", "activeLayer", "gmlayer"],["TEXT", "CompCard_Name_8", "zIndex", 20000],["TEXT", "CompCard_Name_8", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCard_Name_8", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "CompCard_Name_8", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCard_Name_8", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCard_Name_8", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCard_Name_8", "modes", "Complications", {"isForcedOn": true, "isForcedState": true, "lastState": "@@curText@@"}],["TEXT", "CompCard_Name_9", "isActive", false],["TEXT", "CompCard_Name_9", "pageID", "GAME"],["TEXT", "CompCard_Name_9", "activeLayer", "gmlayer"],["TEXT", "CompCard_Name_9", "zIndex", 20000],["TEXT", "CompCard_Name_9", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCard_Name_9", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "CompCard_Name_9", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCard_Name_9", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCard_Name_9", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCard_Name_9", "modes", "Complications", {"isForcedOn": true, "isForcedState": true, "lastState": "@@curText@@"}],["TEXT", "playerPageAlertMessage", "isActive", "@@curState@@"],["TEXT", "playerPageAlertMessage", "pageID", "GAME"],["TEXT", "playerPageAlertMessage", "activeLayer", "gmlayer"],["TEXT", "playerPageAlertMessage", "zIndex", 30020],["TEXT", "playerPageAlertMessage", "modes", "Active", {"isForcedOn": null, "lastState": null}],["TEXT", "playerPageAlertMessage", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "playerPageAlertMessage", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["TEXT", "playerPageAlertMessage", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["TEXT", "playerPageAlertMessage", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["TEXT", "playerPageAlertMessage", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "PlayerSpoofNotice", "isActive", "@@curState@@"],["TEXT", "PlayerSpoofNotice", "pageID", "GAME"],["TEXT", "PlayerSpoofNotice", "activeLayer", "gmlayer"],["TEXT", "PlayerSpoofNotice", "zIndex", 30030],["TEXT", "PlayerSpoofNotice", "modes", "Active", {"isForcedOn": null, "lastState": null}],["TEXT", "PlayerSpoofNotice", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "PlayerSpoofNotice", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["TEXT", "PlayerSpoofNotice", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["TEXT", "PlayerSpoofNotice", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["TEXT", "PlayerSpoofNotice", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "secretRollTraits", "isActive", true],["TEXT", "secretRollTraits", "pageID", "GAME"],["TEXT", "secretRollTraits", "activeLayer", "gmlayer"],["TEXT", "secretRollTraits", "zIndex", 25000],["TEXT", "secretRollTraits", "modes", "Active", {"isForcedOn": null, "lastState": null}],["TEXT", "secretRollTraits", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "secretRollTraits", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["TEXT", "secretRollTraits", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["TEXT", "secretRollTraits", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["TEXT", "secretRollTraits", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "testSessionNotice", "isActive", "@@curState@@"],["TEXT", "testSessionNotice", "pageID", "GAME"],["TEXT", "testSessionNotice", "activeLayer", "gmlayer"],["TEXT", "testSessionNotice", "zIndex", 30000],["TEXT", "testSessionNotice", "modes", "Active", {"isForcedOn": null, "lastState": null}],["TEXT", "testSessionNotice", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "testSessionNotice", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["TEXT", "testSessionNotice", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["TEXT", "testSessionNotice", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["TEXT", "testSessionNotice", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "AirLights-A", "isActive", true],["IMG", "AirLights-A", "curSrc", null],["IMG", "AirLights-A", "activeSrc"],["IMG", "AirLights-A", "pageID", "GAME"],["IMG", "AirLights-A", "activeLayer", "map"],["IMG", "AirLights-A", "zIndex", 150],["IMG", "AirLights-A", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "AirLights-A", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "AirLights-A", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "AirLights-A", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "AirLights-A", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "AirLights-A", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "AirLights-B", "isActive", true],["IMG", "AirLights-B", "curSrc", null],["IMG", "AirLights-B", "activeSrc"],["IMG", "AirLights-B", "pageID", "GAME"],["IMG", "AirLights-B", "activeLayer", "map"],["IMG", "AirLights-B", "zIndex", 150],["IMG", "AirLights-B", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "AirLights-B", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "AirLights-B", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "AirLights-B", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "AirLights-B", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "AirLights-B", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "AirLights-C", "isActive", true],["IMG", "AirLights-C", "curSrc", null],["IMG", "AirLights-C", "activeSrc"],["IMG", "AirLights-C", "pageID", "GAME"],["IMG", "AirLights-C", "activeLayer", "map"],["IMG", "AirLights-C", "zIndex", 150],["IMG", "AirLights-C", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "AirLights-C", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "AirLights-C", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "AirLights-C", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "AirLights-C", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "AirLights-C", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "AirLights-C-Cloudy", "isActive", false],["IMG", "AirLights-C-Cloudy", "curSrc", null],["IMG", "AirLights-C-Cloudy", "activeSrc"],["IMG", "AirLights-C-Cloudy", "pageID", "GAME"],["IMG", "AirLights-C-Cloudy", "activeLayer", "map"],["IMG", "AirLights-C-Cloudy", "zIndex", 150],["IMG", "AirLights-C-Cloudy", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "AirLights-C-Cloudy", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "AirLights-C-Cloudy", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "AirLights-C-Cloudy", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "AirLights-C-Cloudy", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "AirLights-C-Cloudy", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "CompCard_Base_1", "isActive", false],["IMG", "CompCard_Base_1", "curSrc", "cardBack"],["IMG", "CompCard_Base_1", "activeSrc", "cardBack"],["IMG", "CompCard_Base_1", "pageID", "GAME"],["IMG", "CompCard_Base_1", "activeLayer", "map"],["IMG", "CompCard_Base_1", "zIndex", 7020],["IMG", "CompCard_Base_1", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Base_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompCard_Base_1", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Base_1", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Base_1", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Base_1", "modes", "Complications", {"isForcedOn": true, "isForcedState": "cardBack", "lastState": "cardBack"}],
        ["IMG", "CompCard_Base_10", "isActive", false],["IMG", "CompCard_Base_10", "curSrc", "cardBack"],["IMG", "CompCard_Base_10", "activeSrc", "cardBack"],["IMG", "CompCard_Base_10", "pageID", "GAME"],["IMG", "CompCard_Base_10", "activeLayer", "map"],["IMG", "CompCard_Base_10", "zIndex", 7020],["IMG", "CompCard_Base_10", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Base_10", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompCard_Base_10", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Base_10", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Base_10", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Base_10", "modes", "Complications", {"isForcedOn": true, "isForcedState": "cardBack", "lastState": "cardBack"}],["IMG", "CompCard_Base_2", "isActive", false],["IMG", "CompCard_Base_2", "curSrc", "cardBack"],["IMG", "CompCard_Base_2", "activeSrc", "cardBack"],["IMG", "CompCard_Base_2", "pageID", "GAME"],["IMG", "CompCard_Base_2", "activeLayer", "map"],["IMG", "CompCard_Base_2", "zIndex", 7020],["IMG", "CompCard_Base_2", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Base_2", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompCard_Base_2", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Base_2", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Base_2", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Base_2", "modes", "Complications", {"isForcedOn": true, "isForcedState": "cardBack", "lastState": "cardBack"}],["IMG", "CompCard_Base_3", "isActive", false],["IMG", "CompCard_Base_3", "curSrc", "cardBack"],["IMG", "CompCard_Base_3", "activeSrc", "cardBack"],["IMG", "CompCard_Base_3", "pageID", "GAME"],["IMG", "CompCard_Base_3", "activeLayer", "map"],["IMG", "CompCard_Base_3", "zIndex", 7020],["IMG", "CompCard_Base_3", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Base_3", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompCard_Base_3", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Base_3", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Base_3", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Base_3", "modes", "Complications", {"isForcedOn": true, "isForcedState": "cardBack", "lastState": "cardBack"}],["IMG", "CompCard_Base_4", "isActive", false],["IMG", "CompCard_Base_4", "curSrc", "cardBack"],["IMG", "CompCard_Base_4", "activeSrc", "cardBack"],["IMG", "CompCard_Base_4", "pageID", "GAME"],["IMG", "CompCard_Base_4", "activeLayer", "map"],["IMG", "CompCard_Base_4", "zIndex", 7020],["IMG", "CompCard_Base_4", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Base_4", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompCard_Base_4", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Base_4", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Base_4", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Base_4", "modes", "Complications", {"isForcedOn": true, "isForcedState": "cardBack", "lastState": "cardBack"}],["IMG", "CompCard_Base_5", "isActive", false],["IMG", "CompCard_Base_5", "curSrc", "cardBack"],["IMG", "CompCard_Base_5", "activeSrc", "cardBack"],["IMG", "CompCard_Base_5", "pageID", "GAME"],["IMG", "CompCard_Base_5", "activeLayer", "map"],["IMG", "CompCard_Base_5", "zIndex", 7020],["IMG", "CompCard_Base_5", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Base_5", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompCard_Base_5", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Base_5", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Base_5", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Base_5", "modes", "Complications", {"isForcedOn": true, "isForcedState": "cardBack", "lastState": "cardBack"}],["IMG", "CompCard_Base_6", "isActive", false],["IMG", "CompCard_Base_6", "curSrc", "cardBack"],["IMG", "CompCard_Base_6", "activeSrc", "cardBack"],["IMG", "CompCard_Base_6", "pageID", "GAME"],["IMG", "CompCard_Base_6", "activeLayer", "map"],["IMG", "CompCard_Base_6", "zIndex", 7020],["IMG", "CompCard_Base_6", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Base_6", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompCard_Base_6", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Base_6", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Base_6", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Base_6", "modes", "Complications", {"isForcedOn": true, "isForcedState": "cardBack", "lastState": "cardBack"}],["IMG", "CompCard_Base_7", "isActive", false],["IMG", "CompCard_Base_7", "curSrc", "cardBack"],["IMG", "CompCard_Base_7", "activeSrc", "cardBack"],["IMG", "CompCard_Base_7", "pageID", "GAME"],["IMG", "CompCard_Base_7", "activeLayer", "map"],["IMG", "CompCard_Base_7", "zIndex", 7020],["IMG", "CompCard_Base_7", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Base_7", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompCard_Base_7", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Base_7", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Base_7", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Base_7", "modes", "Complications", {"isForcedOn": true, "isForcedState": "cardBack", "lastState": "cardBack"}],["IMG", "CompCard_Base_8", "isActive", false],["IMG", "CompCard_Base_8", "curSrc", "cardBack"],["IMG", "CompCard_Base_8", "activeSrc", "cardBack"],["IMG", "CompCard_Base_8", "pageID", "GAME"],["IMG", "CompCard_Base_8", "activeLayer", "map"],["IMG", "CompCard_Base_8", "zIndex", 7020],["IMG", "CompCard_Base_8", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Base_8", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompCard_Base_8", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Base_8", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Base_8", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Base_8", "modes", "Complications", {"isForcedOn": true, "isForcedState": "cardBack", "lastState": "cardBack"}],["IMG", "CompCard_Base_9", "isActive", false],["IMG", "CompCard_Base_9", "curSrc", "cardBack"],["IMG", "CompCard_Base_9", "activeSrc", "cardBack"],["IMG", "CompCard_Base_9", "pageID", "GAME"],["IMG", "CompCard_Base_9", "activeLayer", "map"],["IMG", "CompCard_Base_9", "zIndex", 7020],["IMG", "CompCard_Base_9", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Base_9", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompCard_Base_9", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Base_9", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Base_9", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Base_9", "modes", "Complications", {"isForcedOn": true, "isForcedState": "cardBack", "lastState": "cardBack"}],["IMG", "CompCard_Negated_1", "isActive", false],["IMG", "CompCard_Negated_1", "curSrc", "base"],["IMG", "CompCard_Negated_1", "activeSrc", "base"],["IMG", "CompCard_Negated_1", "pageID", "GAME"],["IMG", "CompCard_Negated_1", "activeLayer", "map"],["IMG", "CompCard_Negated_1", "zIndex", 7050],["IMG", "CompCard_Negated_1", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Negated_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompCard_Negated_1", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Negated_1", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Negated_1", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Negated_1", "modes", "Complications", {"isForcedOn": false, "lastState": null}],["IMG", "CompCard_Negated_10", "isActive", false],["IMG", "CompCard_Negated_10", "curSrc", "base"],["IMG", "CompCard_Negated_10", "activeSrc", "base"],["IMG", "CompCard_Negated_10", "pageID", "GAME"],["IMG", "CompCard_Negated_10", "activeLayer", "map"],["IMG", "CompCard_Negated_10", "zIndex", 7050],["IMG", "CompCard_Negated_10", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Negated_10", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompCard_Negated_10", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Negated_10", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Negated_10", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Negated_10", "modes", "Complications", {"isForcedOn": false, "lastState": null}],["IMG", "CompCard_Negated_2", "isActive", false],["IMG", "CompCard_Negated_2", "curSrc", "base"],["IMG", "CompCard_Negated_2", "activeSrc", "base"],["IMG", "CompCard_Negated_2", "pageID", "GAME"],["IMG", "CompCard_Negated_2", "activeLayer", "map"],["IMG", "CompCard_Negated_2", "zIndex", 7050],["IMG", "CompCard_Negated_2", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Negated_2", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompCard_Negated_2", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Negated_2", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Negated_2", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Negated_2", "modes", "Complications", {"isForcedOn": false, "lastState": null}],["IMG", "CompCard_Negated_3", "isActive", false],["IMG", "CompCard_Negated_3", "curSrc", "base"],["IMG", "CompCard_Negated_3", "activeSrc", "base"],["IMG", "CompCard_Negated_3", "pageID", "GAME"],["IMG", "CompCard_Negated_3", "activeLayer", "map"],["IMG", "CompCard_Negated_3", "zIndex", 7050],["IMG", "CompCard_Negated_3", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Negated_3", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompCard_Negated_3", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Negated_3", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Negated_3", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Negated_3", "modes", "Complications", {"isForcedOn": false, "lastState": null}],["IMG", "CompCard_Negated_4", "isActive", false],["IMG", "CompCard_Negated_4", "curSrc", "base"],["IMG", "CompCard_Negated_4", "activeSrc", "base"],["IMG", "CompCard_Negated_4", "pageID", "GAME"],["IMG", "CompCard_Negated_4", "activeLayer", "map"],["IMG", "CompCard_Negated_4", "zIndex", 7050],["IMG", "CompCard_Negated_4", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Negated_4", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompCard_Negated_4", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Negated_4", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Negated_4", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Negated_4", "modes", "Complications", {"isForcedOn": false, "lastState": null}],["IMG", "CompCard_Negated_5", "isActive", false],["IMG", "CompCard_Negated_5", "curSrc", "base"],["IMG", "CompCard_Negated_5", "activeSrc", "base"],["IMG", "CompCard_Negated_5", "pageID", "GAME"],["IMG", "CompCard_Negated_5", "activeLayer", "map"],["IMG", "CompCard_Negated_5", "zIndex", 7050],["IMG", "CompCard_Negated_5", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Negated_5", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompCard_Negated_5", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Negated_5", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Negated_5", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Negated_5", "modes", "Complications", {"isForcedOn": false, "lastState": null}],["IMG", "CompCard_Negated_6", "isActive", false],["IMG", "CompCard_Negated_6", "curSrc", "base"],["IMG", "CompCard_Negated_6", "activeSrc", "base"],["IMG", "CompCard_Negated_6", "pageID", "GAME"],["IMG", "CompCard_Negated_6", "activeLayer", "map"],["IMG", "CompCard_Negated_6", "zIndex", 7050],["IMG", "CompCard_Negated_6", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Negated_6", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompCard_Negated_6", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Negated_6", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Negated_6", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Negated_6", "modes", "Complications", {"isForcedOn": false, "lastState": null}],["IMG", "CompCard_Negated_7", "isActive", false],["IMG", "CompCard_Negated_7", "curSrc", "base"],["IMG", "CompCard_Negated_7", "activeSrc", "base"],["IMG", "CompCard_Negated_7", "pageID", "GAME"],["IMG", "CompCard_Negated_7", "activeLayer", "map"],["IMG", "CompCard_Negated_7", "zIndex", 7050],["IMG", "CompCard_Negated_7", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Negated_7", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompCard_Negated_7", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Negated_7", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Negated_7", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Negated_7", "modes", "Complications", {"isForcedOn": false, "lastState": null}],["IMG", "CompCard_Negated_8", "isActive", false],["IMG", "CompCard_Negated_8", "curSrc", "base"],["IMG", "CompCard_Negated_8", "activeSrc", "base"],["IMG", "CompCard_Negated_8", "pageID", "GAME"],["IMG", "CompCard_Negated_8", "activeLayer", "map"],["IMG", "CompCard_Negated_8", "zIndex", 7050],["IMG", "CompCard_Negated_8", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Negated_8", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompCard_Negated_8", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Negated_8", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Negated_8", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Negated_8", "modes", "Complications", {"isForcedOn": false, "lastState": null}],["IMG", "CompCard_Negated_9", "isActive", false],["IMG", "CompCard_Negated_9", "curSrc", "base"],["IMG", "CompCard_Negated_9", "activeSrc", "base"],["IMG", "CompCard_Negated_9", "pageID", "GAME"],["IMG", "CompCard_Negated_9", "activeLayer", "map"],["IMG", "CompCard_Negated_9", "zIndex", 7050],["IMG", "CompCard_Negated_9", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Negated_9", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompCard_Negated_9", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Negated_9", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Negated_9", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Negated_9", "modes", "Complications", {"isForcedOn": false, "lastState": null}],["IMG", "CompCard_Revalue_1", "isActive", false],["IMG", "CompCard_Revalue_1", "curSrc", "0"],["IMG", "CompCard_Revalue_1", "activeSrc", "0"],["IMG", "CompCard_Revalue_1", "pageID", "GAME"],["IMG", "CompCard_Revalue_1", "activeLayer", "map"],["IMG", "CompCard_Revalue_1", "zIndex", 7040],["IMG", "CompCard_Revalue_1", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Revalue_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompCard_Revalue_1", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Revalue_1", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Revalue_1", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Revalue_1", "modes", "Complications", {"isForcedOn": false, "lastState": null}],["IMG", "CompCard_Revalue_10", "isActive", false],["IMG", "CompCard_Revalue_10", "curSrc", "0"],["IMG", "CompCard_Revalue_10", "activeSrc", "0"],["IMG", "CompCard_Revalue_10", "pageID", "GAME"],["IMG", "CompCard_Revalue_10", "activeLayer", "map"],["IMG", "CompCard_Revalue_10", "zIndex", 7040],["IMG", "CompCard_Revalue_10", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Revalue_10", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompCard_Revalue_10", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Revalue_10", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Revalue_10", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Revalue_10", "modes", "Complications", {"isForcedOn": false, "lastState": null}],["IMG", "CompCard_Revalue_2", "isActive", false],["IMG", "CompCard_Revalue_2", "curSrc", "0"],["IMG", "CompCard_Revalue_2", "activeSrc", "0"],["IMG", "CompCard_Revalue_2", "pageID", "GAME"],["IMG", "CompCard_Revalue_2", "activeLayer", "map"],["IMG", "CompCard_Revalue_2", "zIndex", 7040],["IMG", "CompCard_Revalue_2", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Revalue_2", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompCard_Revalue_2", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Revalue_2", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Revalue_2", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Revalue_2", "modes", "Complications", {"isForcedOn": false, "lastState": null}],["IMG", "CompCard_Revalue_3", "isActive", false],["IMG", "CompCard_Revalue_3", "curSrc", "0"],["IMG", "CompCard_Revalue_3", "activeSrc", "0"],["IMG", "CompCard_Revalue_3", "pageID", "GAME"],["IMG", "CompCard_Revalue_3", "activeLayer", "map"],["IMG", "CompCard_Revalue_3", "zIndex", 7040],["IMG", "CompCard_Revalue_3", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Revalue_3", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompCard_Revalue_3", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Revalue_3", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Revalue_3", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Revalue_3", "modes", "Complications", {"isForcedOn": false, "lastState": null}],["IMG", "CompCard_Revalue_4", "isActive", false],["IMG", "CompCard_Revalue_4", "curSrc", "0"],["IMG", "CompCard_Revalue_4", "activeSrc", "0"],["IMG", "CompCard_Revalue_4", "pageID", "GAME"],["IMG", "CompCard_Revalue_4", "activeLayer", "map"],["IMG", "CompCard_Revalue_4", "zIndex", 7040],["IMG", "CompCard_Revalue_4", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Revalue_4", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompCard_Revalue_4", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Revalue_4", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Revalue_4", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Revalue_4", "modes", "Complications", {"isForcedOn": false, "lastState": null}],["IMG", "CompCard_Revalue_5", "isActive", false],["IMG", "CompCard_Revalue_5", "curSrc", "0"],["IMG", "CompCard_Revalue_5", "activeSrc", "0"],["IMG", "CompCard_Revalue_5", "pageID", "GAME"],["IMG", "CompCard_Revalue_5", "activeLayer", "map"],["IMG", "CompCard_Revalue_5", "zIndex", 7040],["IMG", "CompCard_Revalue_5", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Revalue_5", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompCard_Revalue_5", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Revalue_5", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Revalue_5", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Revalue_5", "modes", "Complications", {"isForcedOn": false, "lastState": null}],["IMG", "CompCard_Revalue_6", "isActive", false],["IMG", "CompCard_Revalue_6", "curSrc", "0"],["IMG", "CompCard_Revalue_6", "activeSrc", "0"],["IMG", "CompCard_Revalue_6", "pageID", "GAME"],["IMG", "CompCard_Revalue_6", "activeLayer", "map"],["IMG", "CompCard_Revalue_6", "zIndex", 7040],["IMG", "CompCard_Revalue_6", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Revalue_6", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompCard_Revalue_6", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Revalue_6", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Revalue_6", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Revalue_6", "modes", "Complications", {"isForcedOn": false, "lastState": null}],["IMG", "CompCard_Revalue_7", "isActive", false],["IMG", "CompCard_Revalue_7", "curSrc", "0"],["IMG", "CompCard_Revalue_7", "activeSrc", "0"],["IMG", "CompCard_Revalue_7", "pageID", "GAME"],["IMG", "CompCard_Revalue_7", "activeLayer", "map"],["IMG", "CompCard_Revalue_7", "zIndex", 7040],["IMG", "CompCard_Revalue_7", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Revalue_7", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompCard_Revalue_7", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Revalue_7", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Revalue_7", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Revalue_7", "modes", "Complications", {"isForcedOn": false, "lastState": null}],["IMG", "CompCard_Revalue_8", "isActive", false],["IMG", "CompCard_Revalue_8", "curSrc", "0"],["IMG", "CompCard_Revalue_8", "activeSrc", "0"],["IMG", "CompCard_Revalue_8", "pageID", "GAME"],["IMG", "CompCard_Revalue_8", "activeLayer", "map"],["IMG", "CompCard_Revalue_8", "zIndex", 7040],["IMG", "CompCard_Revalue_8", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Revalue_8", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompCard_Revalue_8", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Revalue_8", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Revalue_8", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Revalue_8", "modes", "Complications", {"isForcedOn": false, "lastState": null}],["IMG", "CompCard_Revalue_9", "isActive", false],["IMG", "CompCard_Revalue_9", "curSrc", "0"],["IMG", "CompCard_Revalue_9", "activeSrc", "0"],["IMG", "CompCard_Revalue_9", "pageID", "GAME"],["IMG", "CompCard_Revalue_9", "activeLayer", "map"],["IMG", "CompCard_Revalue_9", "zIndex", 7040],["IMG", "CompCard_Revalue_9", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Revalue_9", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompCard_Revalue_9", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Revalue_9", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Revalue_9", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Revalue_9", "modes", "Complications", {"isForcedOn": false, "lastState": null}],["IMG", "CompCard_Text_1", "isActive", false],["IMG", "CompCard_Text_1", "curSrc", "@@curSrc@@"],["IMG", "CompCard_Text_1", "activeSrc"],["IMG", "CompCard_Text_1", "pageID", "GAME"],["IMG", "CompCard_Text_1", "activeLayer", "map"],["IMG", "CompCard_Text_1", "zIndex", 7030],["IMG", "CompCard_Text_1", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Text_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompCard_Text_1", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Text_1", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Text_1", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Text_1", "modes", "Complications", {"isForcedOn": false, "lastState": null}],
        ["IMG", "CompCard_Text_10", "isActive", false],["IMG", "CompCard_Text_10", "curSrc", "@@curSrc@@"],["IMG", "CompCard_Text_10", "activeSrc"],["IMG", "CompCard_Text_10", "pageID", "GAME"],["IMG", "CompCard_Text_10", "activeLayer", "map"],["IMG", "CompCard_Text_10", "zIndex", 7030],["IMG", "CompCard_Text_10", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Text_10", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompCard_Text_10", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Text_10", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Text_10", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Text_10", "modes", "Complications", {"isForcedOn": false, "lastState": null}],["IMG", "CompCard_Text_2", "isActive", false],["IMG", "CompCard_Text_2", "curSrc", "@@curSrc@@"],["IMG", "CompCard_Text_2", "activeSrc"],["IMG", "CompCard_Text_2", "pageID", "GAME"],["IMG", "CompCard_Text_2", "activeLayer", "map"],["IMG", "CompCard_Text_2", "zIndex", 7030],["IMG", "CompCard_Text_2", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Text_2", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompCard_Text_2", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Text_2", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Text_2", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Text_2", "modes", "Complications", {"isForcedOn": false, "lastState": null}],["IMG", "CompCard_Text_3", "isActive", false],["IMG", "CompCard_Text_3", "curSrc", "@@curSrc@@"],["IMG", "CompCard_Text_3", "activeSrc"],["IMG", "CompCard_Text_3", "pageID", "GAME"],["IMG", "CompCard_Text_3", "activeLayer", "map"],["IMG", "CompCard_Text_3", "zIndex", 7030],["IMG", "CompCard_Text_3", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Text_3", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompCard_Text_3", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Text_3", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Text_3", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Text_3", "modes", "Complications", {"isForcedOn": false, "lastState": null}],["IMG", "CompCard_Text_4", "isActive", false],["IMG", "CompCard_Text_4", "curSrc", "@@curSrc@@"],["IMG", "CompCard_Text_4", "activeSrc"],["IMG", "CompCard_Text_4", "pageID", "GAME"],["IMG", "CompCard_Text_4", "activeLayer", "map"],["IMG", "CompCard_Text_4", "zIndex", 7030],["IMG", "CompCard_Text_4", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Text_4", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompCard_Text_4", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Text_4", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Text_4", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Text_4", "modes", "Complications", {"isForcedOn": false, "lastState": null}],["IMG", "CompCard_Text_5", "isActive", false],["IMG", "CompCard_Text_5", "curSrc", "@@curSrc@@"],["IMG", "CompCard_Text_5", "activeSrc"],["IMG", "CompCard_Text_5", "pageID", "GAME"],["IMG", "CompCard_Text_5", "activeLayer", "map"],["IMG", "CompCard_Text_5", "zIndex", 7030],["IMG", "CompCard_Text_5", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Text_5", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompCard_Text_5", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Text_5", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Text_5", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Text_5", "modes", "Complications", {"isForcedOn": false, "lastState": null}],["IMG", "CompCard_Text_6", "isActive", false],["IMG", "CompCard_Text_6", "curSrc", "@@curSrc@@"],["IMG", "CompCard_Text_6", "activeSrc"],["IMG", "CompCard_Text_6", "pageID", "GAME"],["IMG", "CompCard_Text_6", "activeLayer", "map"],["IMG", "CompCard_Text_6", "zIndex", 7030],["IMG", "CompCard_Text_6", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Text_6", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompCard_Text_6", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Text_6", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Text_6", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Text_6", "modes", "Complications", {"isForcedOn": false, "lastState": null}],["IMG", "CompCard_Text_7", "isActive", false],["IMG", "CompCard_Text_7", "curSrc", "@@curSrc@@"],["IMG", "CompCard_Text_7", "activeSrc"],["IMG", "CompCard_Text_7", "pageID", "GAME"],["IMG", "CompCard_Text_7", "activeLayer", "map"],["IMG", "CompCard_Text_7", "zIndex", 7030],["IMG", "CompCard_Text_7", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Text_7", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompCard_Text_7", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Text_7", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Text_7", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Text_7", "modes", "Complications", {"isForcedOn": false, "lastState": null}],["IMG", "CompCard_Text_8", "isActive", false],["IMG", "CompCard_Text_8", "curSrc", "@@curSrc@@"],["IMG", "CompCard_Text_8", "activeSrc"],["IMG", "CompCard_Text_8", "pageID", "GAME"],["IMG", "CompCard_Text_8", "activeLayer", "map"],["IMG", "CompCard_Text_8", "zIndex", 7030],["IMG", "CompCard_Text_8", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Text_8", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompCard_Text_8", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Text_8", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Text_8", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Text_8", "modes", "Complications", {"isForcedOn": false, "lastState": null}],["IMG", "CompCard_Text_9", "isActive", false],["IMG", "CompCard_Text_9", "curSrc", "@@curSrc@@"],["IMG", "CompCard_Text_9", "activeSrc"],["IMG", "CompCard_Text_9", "pageID", "GAME"],["IMG", "CompCard_Text_9", "activeLayer", "map"],["IMG", "CompCard_Text_9", "zIndex", 7030],["IMG", "CompCard_Text_9", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Text_9", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompCard_Text_9", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Text_9", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Text_9", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompCard_Text_9", "modes", "Complications", {"isForcedOn": false, "lastState": null}],["IMG", "ComplicationMat_1", "isActive", false],["IMG", "ComplicationMat_1", "curSrc", "base"],["IMG", "ComplicationMat_1", "activeSrc", "base"],["IMG", "ComplicationMat_1", "pageID", "GAME"],["IMG", "ComplicationMat_1", "activeLayer", "map"],["IMG", "ComplicationMat_1", "zIndex", 7000],["IMG", "ComplicationMat_1", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "ComplicationMat_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "ComplicationMat_1", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "ComplicationMat_1", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "ComplicationMat_1", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "ComplicationMat_1", "modes", "Complications", {"isForcedOn": true, "isForcedState": "base", "lastState": "base"}],["IMG", "CompSpot_1", "isActive", false],["IMG", "CompSpot_1", "curSrc", "base"],["IMG", "CompSpot_1", "activeSrc", "base"],["IMG", "CompSpot_1", "pageID", "GAME"],["IMG", "CompSpot_1", "activeLayer", "map"],["IMG", "CompSpot_1", "zIndex", 7010],["IMG", "CompSpot_1", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompSpot_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompSpot_1", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompSpot_1", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompSpot_1", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompSpot_1", "modes", "Complications", {"isForcedOn": true, "isForcedState": "base", "lastState": "base"}],["IMG", "CompSpot_10", "isActive", false],["IMG", "CompSpot_10", "curSrc", "base"],["IMG", "CompSpot_10", "activeSrc", "base"],["IMG", "CompSpot_10", "pageID", "GAME"],["IMG", "CompSpot_10", "activeLayer", "map"],["IMG", "CompSpot_10", "zIndex", 7010],["IMG", "CompSpot_10", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompSpot_10", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompSpot_10", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompSpot_10", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompSpot_10", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompSpot_10", "modes", "Complications", {"isForcedOn": true, "isForcedState": "base", "lastState": "base"}],["IMG", "CompSpot_2", "isActive", false],["IMG", "CompSpot_2", "curSrc", "base"],["IMG", "CompSpot_2", "activeSrc", "base"],["IMG", "CompSpot_2", "pageID", "GAME"],["IMG", "CompSpot_2", "activeLayer", "map"],["IMG", "CompSpot_2", "zIndex", 7010],["IMG", "CompSpot_2", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompSpot_2", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompSpot_2", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompSpot_2", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompSpot_2", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompSpot_2", "modes", "Complications", {"isForcedOn": true, "isForcedState": "base", "lastState": "base"}],["IMG", "CompSpot_3", "isActive", false],["IMG", "CompSpot_3", "curSrc", "base"],["IMG", "CompSpot_3", "activeSrc", "base"],["IMG", "CompSpot_3", "pageID", "GAME"],["IMG", "CompSpot_3", "activeLayer", "map"],["IMG", "CompSpot_3", "zIndex", 7010],["IMG", "CompSpot_3", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompSpot_3", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompSpot_3", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompSpot_3", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompSpot_3", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompSpot_3", "modes", "Complications", {"isForcedOn": true, "isForcedState": "base", "lastState": "base"}],["IMG", "CompSpot_4", "isActive", false],["IMG", "CompSpot_4", "curSrc", "base"],["IMG", "CompSpot_4", "activeSrc", "base"],["IMG", "CompSpot_4", "pageID", "GAME"],["IMG", "CompSpot_4", "activeLayer", "map"],["IMG", "CompSpot_4", "zIndex", 7010],["IMG", "CompSpot_4", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompSpot_4", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompSpot_4", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompSpot_4", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompSpot_4", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompSpot_4", "modes", "Complications", {"isForcedOn": true, "isForcedState": "base", "lastState": "base"}],["IMG", "CompSpot_5", "isActive", false],["IMG", "CompSpot_5", "curSrc", "base"],["IMG", "CompSpot_5", "activeSrc", "base"],["IMG", "CompSpot_5", "pageID", "GAME"],["IMG", "CompSpot_5", "activeLayer", "map"],["IMG", "CompSpot_5", "zIndex", 7010],["IMG", "CompSpot_5", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompSpot_5", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompSpot_5", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompSpot_5", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompSpot_5", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompSpot_5", "modes", "Complications", {"isForcedOn": true, "isForcedState": "base", "lastState": "base"}],["IMG", "CompSpot_6", "isActive", false],["IMG", "CompSpot_6", "curSrc", "base"],["IMG", "CompSpot_6", "activeSrc", "base"],["IMG", "CompSpot_6", "pageID", "GAME"],["IMG", "CompSpot_6", "activeLayer", "map"],["IMG", "CompSpot_6", "zIndex", 7010],["IMG", "CompSpot_6", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompSpot_6", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompSpot_6", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompSpot_6", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompSpot_6", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompSpot_6", "modes", "Complications", {"isForcedOn": true, "isForcedState": "base", "lastState": "base"}],["IMG", "CompSpot_7", "isActive", false],["IMG", "CompSpot_7", "curSrc", "base"],["IMG", "CompSpot_7", "activeSrc", "base"],["IMG", "CompSpot_7", "pageID", "GAME"],["IMG", "CompSpot_7", "activeLayer", "map"],["IMG", "CompSpot_7", "zIndex", 7010],["IMG", "CompSpot_7", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompSpot_7", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompSpot_7", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompSpot_7", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompSpot_7", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompSpot_7", "modes", "Complications", {"isForcedOn": true, "isForcedState": "base", "lastState": "base"}],["IMG", "CompSpot_8", "isActive", false],["IMG", "CompSpot_8", "curSrc", "base"],["IMG", "CompSpot_8", "activeSrc", "base"],["IMG", "CompSpot_8", "pageID", "GAME"],["IMG", "CompSpot_8", "activeLayer", "map"],["IMG", "CompSpot_8", "zIndex", 7010],["IMG", "CompSpot_8", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompSpot_8", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompSpot_8", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompSpot_8", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompSpot_8", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompSpot_8", "modes", "Complications", {"isForcedOn": true, "isForcedState": "base", "lastState": "base"}],["IMG", "CompSpot_9", "isActive", false],["IMG", "CompSpot_9", "curSrc", "base"],["IMG", "CompSpot_9", "activeSrc", "base"],["IMG", "CompSpot_9", "pageID", "GAME"],["IMG", "CompSpot_9", "activeLayer", "map"],["IMG", "CompSpot_9", "zIndex", 7010],["IMG", "CompSpot_9", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompSpot_9", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "CompSpot_9", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompSpot_9", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompSpot_9", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "CompSpot_9", "modes", "Complications", {"isForcedOn": true, "isForcedState": "base", "lastState": "base"}],["IMG", "DisableLocLeft_1", "isActive", "@@curState@@"],["IMG", "DisableLocLeft_1", "curSrc", "base"],["IMG", "DisableLocLeft_1", "activeSrc", "base"],["IMG", "DisableLocLeft_1", "pageID", "GAME"],["IMG", "DisableLocLeft_1", "activeLayer", "map"],["IMG", "DisableLocLeft_1", "zIndex", 1780],["IMG", "DisableLocLeft_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "DisableLocLeft_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "DisableLocLeft_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "DisableLocLeft_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "DisableLocLeft_1", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "DisableLocLeft_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "DisableLocRight_1", "isActive", "@@curState@@"],["IMG", "DisableLocRight_1", "curSrc", "base"],["IMG", "DisableLocRight_1", "activeSrc", "base"],["IMG", "DisableLocRight_1", "pageID", "GAME"],["IMG", "DisableLocRight_1", "activeLayer", "map"],["IMG", "DisableLocRight_1", "zIndex", 1780],["IMG", "DisableLocRight_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "DisableLocRight_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "DisableLocRight_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "DisableLocRight_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "DisableLocRight_1", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "DisableLocRight_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "DisableSiteBottomAll_1", "isActive", false],["IMG", "DisableSiteBottomAll_1", "curSrc", "base"],["IMG", "DisableSiteBottomAll_1", "activeSrc", "base"],["IMG", "DisableSiteBottomAll_1", "pageID", "GAME"],["IMG", "DisableSiteBottomAll_1", "activeLayer", "map"],["IMG", "DisableSiteBottomAll_1", "zIndex", 1740],["IMG", "DisableSiteBottomAll_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "DisableSiteBottomAll_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "DisableSiteBottomAll_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "DisableSiteBottomAll_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "DisableSiteBottomAll_1", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "DisableSiteBottomAll_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "DisableSiteLeft_1", "isActive", "@@curState@@"],["IMG", "DisableSiteLeft_1", "curSrc", "base"],["IMG", "DisableSiteLeft_1", "activeSrc", "base"],["IMG", "DisableSiteLeft_1", "pageID", "GAME"],["IMG", "DisableSiteLeft_1", "activeLayer", "map"],["IMG", "DisableSiteLeft_1", "zIndex", 1780],["IMG", "DisableSiteLeft_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "DisableSiteLeft_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "DisableSiteLeft_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "DisableSiteLeft_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "DisableSiteLeft_1", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "DisableSiteLeft_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "DisableSiteRight_1", "isActive", "@@curState@@"],["IMG", "DisableSiteRight_1", "curSrc", "base"],["IMG", "DisableSiteRight_1", "activeSrc", "base"],["IMG", "DisableSiteRight_1", "pageID", "GAME"],["IMG", "DisableSiteRight_1", "activeLayer", "map"],["IMG", "DisableSiteRight_1", "zIndex", 1780],["IMG", "DisableSiteRight_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "DisableSiteRight_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "DisableSiteRight_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "DisableSiteRight_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "DisableSiteRight_1", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "DisableSiteRight_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "DisableSiteTopAll_1", "isActive", false],["IMG", "DisableSiteTopAll_1", "curSrc", "base"],["IMG", "DisableSiteTopAll_1", "activeSrc", "base"],["IMG", "DisableSiteTopAll_1", "pageID", "GAME"],["IMG", "DisableSiteTopAll_1", "activeLayer", "map"],["IMG", "DisableSiteTopAll_1", "zIndex", 770],["IMG", "DisableSiteTopAll_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "DisableSiteTopAll_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "DisableSiteTopAll_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "DisableSiteTopAll_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "DisableSiteTopAll_1", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "DisableSiteTopAll_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "DisableSiteTopLeft_1", "isActive", false],["IMG", "DisableSiteTopLeft_1", "curSrc", "base"],["IMG", "DisableSiteTopLeft_1", "activeSrc", "base"],["IMG", "DisableSiteTopLeft_1", "pageID", "GAME"],["IMG", "DisableSiteTopLeft_1", "activeLayer", "map"],["IMG", "DisableSiteTopLeft_1", "zIndex", 770],["IMG", "DisableSiteTopLeft_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "DisableSiteTopLeft_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "DisableSiteTopLeft_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "DisableSiteTopLeft_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "DisableSiteTopLeft_1", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "DisableSiteTopLeft_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "DisableSiteTopRight_1", "isActive", false],["IMG", "DisableSiteTopRight_1", "curSrc", "base"],["IMG", "DisableSiteTopRight_1", "activeSrc", "base"],["IMG", "DisableSiteTopRight_1", "pageID", "GAME"],["IMG", "DisableSiteTopRight_1", "activeLayer", "map"],["IMG", "DisableSiteTopRight_1", "zIndex", 770],["IMG", "DisableSiteTopRight_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "DisableSiteTopRight_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "DisableSiteTopRight_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "DisableSiteTopRight_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "DisableSiteTopRight_1", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "DisableSiteTopRight_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "DistrictCenter_1", "isActive", true],["IMG", "DistrictCenter_1", "curSrc", "@@curSrc@@"],["IMG", "DistrictCenter_1", "activeSrc"],["IMG", "DistrictCenter_1", "pageID", "GAME"],["IMG", "DistrictCenter_1", "activeLayer", "map"],["IMG", "DistrictCenter_1", "zIndex", 1400],["IMG", "DistrictCenter_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "DistrictCenter_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "DistrictCenter_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "DistrictCenter_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "DistrictCenter_1", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "DistrictCenter_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "DistrictLeft_1", "isActive", true],["IMG", "DistrictLeft_1", "curSrc", "@@curSrc@@"],["IMG", "DistrictLeft_1", "activeSrc"],["IMG", "DistrictLeft_1", "pageID", "GAME"],["IMG", "DistrictLeft_1", "activeLayer", "map"],["IMG", "DistrictLeft_1", "zIndex", 1400],["IMG", "DistrictLeft_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "DistrictLeft_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "DistrictLeft_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "DistrictLeft_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "DistrictLeft_1", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "DistrictLeft_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],
        ["IMG", "DistrictRight_1", "isActive", true],["IMG", "DistrictRight_1", "curSrc", "@@curSrc@@"],["IMG", "DistrictRight_1", "activeSrc"],["IMG", "DistrictRight_1", "pageID", "GAME"],["IMG", "DistrictRight_1", "activeLayer", "map"],["IMG", "DistrictRight_1", "zIndex", 1400],["IMG", "DistrictRight_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "DistrictRight_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "DistrictRight_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "DistrictRight_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "DistrictRight_1", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "DistrictRight_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "Foreground_1", "isActive", true],["IMG", "Foreground_1", "curSrc", "@@curSrc@@"],["IMG", "Foreground_1", "activeSrc"],["IMG", "Foreground_1", "pageID", "GAME"],["IMG", "Foreground_1", "activeLayer", "map"],["IMG", "Foreground_1", "zIndex", 850],["IMG", "Foreground_1", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "Foreground_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "Foreground_1", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "Foreground_1", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "Foreground_1", "modes", "Spotlight", {"isForcedOn": true, "isForcedState": "spotlight", "lastState": "spotlight"}],["IMG", "Foreground_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "Horizon_1", "isActive", true],["IMG", "Horizon_1", "curSrc", "@@curSrc@@"],["IMG", "Horizon_1", "activeSrc"],["IMG", "Horizon_1", "pageID", "GAME"],["IMG", "Horizon_1", "activeLayer", "map"],["IMG", "Horizon_1", "zIndex", 30],["IMG", "Horizon_1", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "Horizon_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "Horizon_1", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "Horizon_1", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "Horizon_1", "modes", "Spotlight", {"isForcedOn": true, "isForcedState": "night5clear", "lastState": "night5clear"}],["IMG", "Horizon_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "HungerBotLeft_1", "isActive", true],["IMG", "HungerBotLeft_1", "curSrc", "@@curSrc@@"],["IMG", "HungerBotLeft_1", "activeSrc"],["IMG", "HungerBotLeft_1", "pageID", "GAME"],["IMG", "HungerBotLeft_1", "activeLayer", "map"],["IMG", "HungerBotLeft_1", "zIndex", 1130],["IMG", "HungerBotLeft_1", "modes", "Active", {"isForcedOn": true, "isForcedState": true, "lastState": "@@curSrc@@"}],["IMG", "HungerBotLeft_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "HungerBotLeft_1", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "HungerBotLeft_1", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "HungerBotLeft_1", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "HungerBotLeft_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "HungerBotRight_1", "isActive", true],["IMG", "HungerBotRight_1", "curSrc", "@@curSrc@@"],["IMG", "HungerBotRight_1", "activeSrc"],["IMG", "HungerBotRight_1", "pageID", "GAME"],["IMG", "HungerBotRight_1", "activeLayer", "map"],["IMG", "HungerBotRight_1", "zIndex", 1130],["IMG", "HungerBotRight_1", "modes", "Active", {"isForcedOn": true, "isForcedState": true, "lastState": "@@curSrc@@"}],["IMG", "HungerBotRight_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "HungerBotRight_1", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "HungerBotRight_1", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "HungerBotRight_1", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "HungerBotRight_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "HungerMidRight_1", "isActive", true],["IMG", "HungerMidRight_1", "curSrc", "@@curSrc@@"],["IMG", "HungerMidRight_1", "activeSrc"],["IMG", "HungerMidRight_1", "pageID", "GAME"],["IMG", "HungerMidRight_1", "activeLayer", "map"],["IMG", "HungerMidRight_1", "zIndex", 1130],["IMG", "HungerMidRight_1", "modes", "Active", {"isForcedOn": true, "isForcedState": true, "lastState": "@@curSrc@@"}],["IMG", "HungerMidRight_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "HungerMidRight_1", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "HungerMidRight_1", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "HungerMidRight_1", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "HungerMidRight_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "HungerTopLeft_1", "isActive", true],["IMG", "HungerTopLeft_1", "curSrc", "@@curSrc@@"],["IMG", "HungerTopLeft_1", "activeSrc"],["IMG", "HungerTopLeft_1", "pageID", "GAME"],["IMG", "HungerTopLeft_1", "activeLayer", "map"],["IMG", "HungerTopLeft_1", "zIndex", 1130],["IMG", "HungerTopLeft_1", "modes", "Active", {"isForcedOn": true, "isForcedState": true, "lastState": "@@curSrc@@"}],["IMG", "HungerTopLeft_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "HungerTopLeft_1", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "HungerTopLeft_1", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "HungerTopLeft_1", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "HungerTopLeft_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "HungerTopRight_1", "isActive", true],["IMG", "HungerTopRight_1", "curSrc", "@@curSrc@@"],["IMG", "HungerTopRight_1", "activeSrc"],["IMG", "HungerTopRight_1", "pageID", "GAME"],["IMG", "HungerTopRight_1", "activeLayer", "map"],["IMG", "HungerTopRight_1", "zIndex", 1130],["IMG", "HungerTopRight_1", "modes", "Active", {"isForcedOn": true, "isForcedState": true, "lastState": "@@curSrc@@"}],["IMG", "HungerTopRight_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "HungerTopRight_1", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "HungerTopRight_1", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "HungerTopRight_1", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "HungerTopRight_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "MajestyAura", "isActive", false],["IMG", "MajestyAura", "curSrc", null],["IMG", "MajestyAura", "activeSrc"],["IMG", "MajestyAura", "pageID", "GAME"],["IMG", "MajestyAura", "activeLayer", "map"],["IMG", "MajestyAura", "zIndex", 4305],["IMG", "MajestyAura", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "MajestyAura", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "MajestyAura", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "MajestyAura", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "MajestyAura", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "MajestyAura", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_Districts_1", "isActive", false],["IMG", "MapButton_Districts_1", "curSrc", null],["IMG", "MapButton_Districts_1", "activeSrc"],["IMG", "MapButton_Districts_1", "pageID", "GAME"],["IMG", "MapButton_Districts_1", "activeLayer", "map"],["IMG", "MapButton_Districts_1", "zIndex", 5510],["IMG", "MapButton_Districts_1", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_Districts_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_Districts_1", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_Districts_1", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_Districts_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_Districts_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_Domain_1", "isActive", false],["IMG", "MapButton_Domain_1", "curSrc", null],["IMG", "MapButton_Domain_1", "activeSrc"],["IMG", "MapButton_Domain_1", "pageID", "GAME"],["IMG", "MapButton_Domain_1", "activeLayer", "map"],["IMG", "MapButton_Domain_1", "zIndex", 5510],["IMG", "MapButton_Domain_1", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_Domain_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_Domain_1", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_Domain_1", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_Domain_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_Domain_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_Panel_1", "isActive", true],["IMG", "MapButton_Panel_1", "curSrc", "closed"],["IMG", "MapButton_Panel_1", "activeSrc", "closed"],["IMG", "MapButton_Panel_1", "pageID", "GAME"],["IMG", "MapButton_Panel_1", "activeLayer", "map"],["IMG", "MapButton_Panel_1", "zIndex", 5500],["IMG", "MapButton_Panel_1", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_Panel_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_Panel_1", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_Panel_1", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_Panel_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_Panel_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_Parks_1", "isActive", false],["IMG", "MapButton_Parks_1", "curSrc", null],["IMG", "MapButton_Parks_1", "activeSrc"],["IMG", "MapButton_Parks_1", "pageID", "GAME"],["IMG", "MapButton_Parks_1", "activeLayer", "map"],["IMG", "MapButton_Parks_1", "zIndex", 5510],["IMG", "MapButton_Parks_1", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_Parks_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_Parks_1", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_Parks_1", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_Parks_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_Parks_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_Rack_1", "isActive", false],["IMG", "MapButton_Rack_1", "curSrc", null],["IMG", "MapButton_Rack_1", "activeSrc"],["IMG", "MapButton_Rack_1", "pageID", "GAME"],["IMG", "MapButton_Rack_1", "activeLayer", "map"],["IMG", "MapButton_Rack_1", "zIndex", 5510],["IMG", "MapButton_Rack_1", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_Rack_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_Rack_1", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_Rack_1", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_Rack_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_Rack_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_Roads_1", "isActive", false],["IMG", "MapButton_Roads_1", "curSrc", null],["IMG", "MapButton_Roads_1", "activeSrc"],["IMG", "MapButton_Roads_1", "pageID", "GAME"],["IMG", "MapButton_Roads_1", "activeLayer", "map"],["IMG", "MapButton_Roads_1", "zIndex", 5510],["IMG", "MapButton_Roads_1", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_Roads_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_Roads_1", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_Roads_1", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_Roads_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_Roads_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesCulture_1", "isActive", false],["IMG", "MapButton_SitesCulture_1", "curSrc", null],["IMG", "MapButton_SitesCulture_1", "activeSrc"],["IMG", "MapButton_SitesCulture_1", "pageID", "GAME"],["IMG", "MapButton_SitesCulture_1", "activeLayer", "map"],["IMG", "MapButton_SitesCulture_1", "zIndex", 5510],["IMG", "MapButton_SitesCulture_1", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesCulture_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesCulture_1", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesCulture_1", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesCulture_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesCulture_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesEducation_1", "isActive", false],["IMG", "MapButton_SitesEducation_1", "curSrc", null],["IMG", "MapButton_SitesEducation_1", "activeSrc"],["IMG", "MapButton_SitesEducation_1", "pageID", "GAME"],["IMG", "MapButton_SitesEducation_1", "activeLayer", "map"],["IMG", "MapButton_SitesEducation_1", "zIndex", 5510],["IMG", "MapButton_SitesEducation_1", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesEducation_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesEducation_1", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesEducation_1", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesEducation_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesEducation_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesHavens_1", "isActive", false],["IMG", "MapButton_SitesHavens_1", "curSrc", null],["IMG", "MapButton_SitesHavens_1", "activeSrc"],["IMG", "MapButton_SitesHavens_1", "pageID", "GAME"],["IMG", "MapButton_SitesHavens_1", "activeLayer", "map"],["IMG", "MapButton_SitesHavens_1", "zIndex", 5510],["IMG", "MapButton_SitesHavens_1", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesHavens_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesHavens_1", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesHavens_1", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesHavens_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesHavens_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesHealth_1", "isActive", false],["IMG", "MapButton_SitesHealth_1", "curSrc", null],["IMG", "MapButton_SitesHealth_1", "activeSrc"],["IMG", "MapButton_SitesHealth_1", "pageID", "GAME"],["IMG", "MapButton_SitesHealth_1", "activeLayer", "map"],["IMG", "MapButton_SitesHealth_1", "zIndex", 5510],["IMG", "MapButton_SitesHealth_1", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesHealth_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesHealth_1", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesHealth_1", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesHealth_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesHealth_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesLandmarks_1", "isActive", false],["IMG", "MapButton_SitesLandmarks_1", "curSrc", null],["IMG", "MapButton_SitesLandmarks_1", "activeSrc"],["IMG", "MapButton_SitesLandmarks_1", "pageID", "GAME"],["IMG", "MapButton_SitesLandmarks_1", "activeLayer", "map"],["IMG", "MapButton_SitesLandmarks_1", "zIndex", 5510],["IMG", "MapButton_SitesLandmarks_1", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesLandmarks_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesLandmarks_1", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesLandmarks_1", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesLandmarks_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesLandmarks_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesNightlife_1", "isActive", false],["IMG", "MapButton_SitesNightlife_1", "curSrc", null],["IMG", "MapButton_SitesNightlife_1", "activeSrc"],["IMG", "MapButton_SitesNightlife_1", "pageID", "GAME"],["IMG", "MapButton_SitesNightlife_1", "activeLayer", "map"],["IMG", "MapButton_SitesNightlife_1", "zIndex", 5510],["IMG", "MapButton_SitesNightlife_1", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesNightlife_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesNightlife_1", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesNightlife_1", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesNightlife_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesNightlife_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesShopping_1", "isActive", false],["IMG", "MapButton_SitesShopping_1", "curSrc", null],["IMG", "MapButton_SitesShopping_1", "activeSrc"],["IMG", "MapButton_SitesShopping_1", "pageID", "GAME"],["IMG", "MapButton_SitesShopping_1", "activeLayer", "map"],["IMG", "MapButton_SitesShopping_1", "zIndex", 5510],["IMG", "MapButton_SitesShopping_1", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesShopping_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesShopping_1", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesShopping_1", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesShopping_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesShopping_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesTransportation_1", "isActive", false],["IMG", "MapButton_SitesTransportation_1", "curSrc", null],["IMG", "MapButton_SitesTransportation_1", "activeSrc"],["IMG", "MapButton_SitesTransportation_1", "pageID", "GAME"],["IMG", "MapButton_SitesTransportation_1", "activeLayer", "map"],["IMG", "MapButton_SitesTransportation_1", "zIndex", 5510],["IMG", "MapButton_SitesTransportation_1", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesTransportation_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesTransportation_1", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesTransportation_1", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesTransportation_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "MapButton_SitesTransportation_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "MapIndicator", "isActive", true],["IMG", "MapIndicator", "curSrc", null],["IMG", "MapIndicator", "activeSrc"],["IMG", "MapIndicator", "pageID", "GAME"],["IMG", "MapIndicator", "activeLayer", "map"],["IMG", "MapIndicator", "zIndex", 80],["IMG", "MapIndicator", "modes", "Active", {"isForcedOn": true, "lastState": null}],["IMG", "MapIndicator", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "MapIndicator", "modes", "Daylighter", {"isForcedOn": true, "lastState": null}],["IMG", "MapIndicator", "modes", "Downtime", {"isForcedOn": true, "lastState": null}],["IMG", "MapIndicator", "modes", "Spotlight", {"isForcedOn": true, "lastState": null}],["IMG", "MapIndicator", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "MapIndicator_Base_1", "isActive", true],["IMG", "MapIndicator_Base_1", "curSrc", "base"],["IMG", "MapIndicator_Base_1", "activeSrc", "base"],["IMG", "MapIndicator_Base_1", "pageID", "GAME"],["IMG", "MapIndicator_Base_1", "activeLayer", "map"],["IMG", "MapIndicator_Base_1", "zIndex", 80],["IMG", "MapIndicator_Base_1", "modes", "Active", {"isForcedOn": true, "isForcedState": "base", "lastState": "base"}],["IMG", "MapIndicator_Base_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "MapIndicator_Base_1", "modes", "Daylighter", {"isForcedOn": true, "isForcedState": "base", "lastState": "base"}],["IMG", "MapIndicator_Base_1", "modes", "Downtime", {"isForcedOn": true, "isForcedState": "base", "lastState": "base"}],["IMG", "MapIndicator_Base_1", "modes", "Spotlight", {"isForcedOn": true, "isForcedState": "base", "lastState": "base"}],["IMG", "MapIndicator_Base_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_Base_1", "isActive", true],["IMG", "MapLayer_Base_1", "curSrc", "base"],["IMG", "MapLayer_Base_1", "activeSrc", "base"],["IMG", "MapLayer_Base_1", "pageID", "GAME"],["IMG", "MapLayer_Base_1", "activeLayer", "map"],["IMG", "MapLayer_Base_1", "zIndex", 40],["IMG", "MapLayer_Base_1", "modes", "Active", {"isForcedOn": true, "isForcedState": "base", "lastState": "base"}],["IMG", "MapLayer_Base_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_Base_1", "modes", "Daylighter", {"isForcedOn": true, "isForcedState": "base", "lastState": "base"}],["IMG", "MapLayer_Base_1", "modes", "Downtime", {"isForcedOn": true, "isForcedState": "base", "lastState": "base"}],["IMG", "MapLayer_Base_1", "modes", "Spotlight", {"isForcedOn": true, "isForcedState": "base", "lastState": "base"}],["IMG", "MapLayer_Base_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_Districts_1", "isActive", "@@curState@@"],["IMG", "MapLayer_Districts_1", "curSrc", "base"],["IMG", "MapLayer_Districts_1", "activeSrc", "base"],["IMG", "MapLayer_Districts_1", "pageID", "GAME"],["IMG", "MapLayer_Districts_1", "activeLayer", "map"],["IMG", "MapLayer_Districts_1", "zIndex", 100],["IMG", "MapLayer_Districts_1", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_Districts_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_Districts_1", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_Districts_1", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_Districts_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_Districts_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_DistrictsFill_1", "isActive", "@@curState@@"],["IMG", "MapLayer_DistrictsFill_1", "curSrc", "base"],["IMG", "MapLayer_DistrictsFill_1", "activeSrc", "base"],["IMG", "MapLayer_DistrictsFill_1", "pageID", "GAME"],["IMG", "MapLayer_DistrictsFill_1", "activeLayer", "map"],["IMG", "MapLayer_DistrictsFill_1", "zIndex", 50],["IMG", "MapLayer_DistrictsFill_1", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_DistrictsFill_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_DistrictsFill_1", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_DistrictsFill_1", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_DistrictsFill_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_DistrictsFill_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_Domain_1", "isActive", "@@curState@@"],["IMG", "MapLayer_Domain_1", "curSrc", "@@curSrc@@"],["IMG", "MapLayer_Domain_1", "activeSrc"],["IMG", "MapLayer_Domain_1", "pageID", "GAME"],["IMG", "MapLayer_Domain_1", "activeLayer", "map"],["IMG", "MapLayer_Domain_1", "zIndex", 70],["IMG", "MapLayer_Domain_1", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_Domain_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_Domain_1", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_Domain_1", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_Domain_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_Domain_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_Parks_1", "isActive", "@@curState@@"],["IMG", "MapLayer_Parks_1", "curSrc", "base"],["IMG", "MapLayer_Parks_1", "activeSrc", "base"],["IMG", "MapLayer_Parks_1", "pageID", "GAME"],["IMG", "MapLayer_Parks_1", "activeLayer", "map"],["IMG", "MapLayer_Parks_1", "zIndex", 60],["IMG", "MapLayer_Parks_1", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_Parks_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_Parks_1", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_Parks_1", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_Parks_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_Parks_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],
        ["IMG", "MapLayer_Rack_1", "isActive", "@@curState@@"],["IMG", "MapLayer_Rack_1", "curSrc", "base"],["IMG", "MapLayer_Rack_1", "activeSrc", "base"],["IMG", "MapLayer_Rack_1", "pageID", "GAME"],["IMG", "MapLayer_Rack_1", "activeLayer", "map"],["IMG", "MapLayer_Rack_1", "zIndex", 60],["IMG", "MapLayer_Rack_1", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_Rack_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_Rack_1", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_Rack_1", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_Rack_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_Rack_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_Roads_1", "isActive", "@@curState@@"],["IMG", "MapLayer_Roads_1", "curSrc", "base"],["IMG", "MapLayer_Roads_1", "activeSrc", "base"],["IMG", "MapLayer_Roads_1", "pageID", "GAME"],["IMG", "MapLayer_Roads_1", "activeLayer", "map"],["IMG", "MapLayer_Roads_1", "zIndex", 90],["IMG", "MapLayer_Roads_1", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_Roads_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_Roads_1", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_Roads_1", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_Roads_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_Roads_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesCulture_1", "isActive", "@@curState@@"],["IMG", "MapLayer_SitesCulture_1", "curSrc", "base"],["IMG", "MapLayer_SitesCulture_1", "activeSrc", "base"],["IMG", "MapLayer_SitesCulture_1", "pageID", "GAME"],["IMG", "MapLayer_SitesCulture_1", "activeLayer", "map"],["IMG", "MapLayer_SitesCulture_1", "zIndex", 110],["IMG", "MapLayer_SitesCulture_1", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesCulture_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesCulture_1", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesCulture_1", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesCulture_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesCulture_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesEducation_1", "isActive", "@@curState@@"],["IMG", "MapLayer_SitesEducation_1", "curSrc", "base"],["IMG", "MapLayer_SitesEducation_1", "activeSrc", "base"],["IMG", "MapLayer_SitesEducation_1", "pageID", "GAME"],["IMG", "MapLayer_SitesEducation_1", "activeLayer", "map"],["IMG", "MapLayer_SitesEducation_1", "zIndex", 110],["IMG", "MapLayer_SitesEducation_1", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesEducation_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesEducation_1", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesEducation_1", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesEducation_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesEducation_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesHavens_1", "isActive", "@@curState@@"],["IMG", "MapLayer_SitesHavens_1", "curSrc", "base"],["IMG", "MapLayer_SitesHavens_1", "activeSrc", "base"],["IMG", "MapLayer_SitesHavens_1", "pageID", "GAME"],["IMG", "MapLayer_SitesHavens_1", "activeLayer", "map"],["IMG", "MapLayer_SitesHavens_1", "zIndex", 110],["IMG", "MapLayer_SitesHavens_1", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesHavens_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesHavens_1", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesHavens_1", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesHavens_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesHavens_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesHealth_1", "isActive", "@@curState@@"],["IMG", "MapLayer_SitesHealth_1", "curSrc", "base"],["IMG", "MapLayer_SitesHealth_1", "activeSrc", "base"],["IMG", "MapLayer_SitesHealth_1", "pageID", "GAME"],["IMG", "MapLayer_SitesHealth_1", "activeLayer", "map"],["IMG", "MapLayer_SitesHealth_1", "zIndex", 110],["IMG", "MapLayer_SitesHealth_1", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesHealth_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesHealth_1", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesHealth_1", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesHealth_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesHealth_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesLandmarks_1", "isActive", "@@curState@@"],["IMG", "MapLayer_SitesLandmarks_1", "curSrc", "base"],["IMG", "MapLayer_SitesLandmarks_1", "activeSrc", "base"],["IMG", "MapLayer_SitesLandmarks_1", "pageID", "GAME"],["IMG", "MapLayer_SitesLandmarks_1", "activeLayer", "map"],["IMG", "MapLayer_SitesLandmarks_1", "zIndex", 110],["IMG", "MapLayer_SitesLandmarks_1", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesLandmarks_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesLandmarks_1", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesLandmarks_1", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesLandmarks_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesLandmarks_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesNightlife_1", "isActive", "@@curState@@"],["IMG", "MapLayer_SitesNightlife_1", "curSrc", "base"],["IMG", "MapLayer_SitesNightlife_1", "activeSrc", "base"],["IMG", "MapLayer_SitesNightlife_1", "pageID", "GAME"],["IMG", "MapLayer_SitesNightlife_1", "activeLayer", "map"],["IMG", "MapLayer_SitesNightlife_1", "zIndex", 110],["IMG", "MapLayer_SitesNightlife_1", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesNightlife_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesNightlife_1", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesNightlife_1", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesNightlife_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesNightlife_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesShopping_1", "isActive", "@@curState@@"],["IMG", "MapLayer_SitesShopping_1", "curSrc", "base"],["IMG", "MapLayer_SitesShopping_1", "activeSrc", "base"],["IMG", "MapLayer_SitesShopping_1", "pageID", "GAME"],["IMG", "MapLayer_SitesShopping_1", "activeLayer", "map"],["IMG", "MapLayer_SitesShopping_1", "zIndex", 110],["IMG", "MapLayer_SitesShopping_1", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesShopping_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesShopping_1", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesShopping_1", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesShopping_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesShopping_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesTransportation_1", "isActive", "@@curState@@"],["IMG", "MapLayer_SitesTransportation_1", "curSrc", "base"],["IMG", "MapLayer_SitesTransportation_1", "activeSrc", "base"],["IMG", "MapLayer_SitesTransportation_1", "pageID", "GAME"],["IMG", "MapLayer_SitesTransportation_1", "activeLayer", "map"],["IMG", "MapLayer_SitesTransportation_1", "zIndex", 110],["IMG", "MapLayer_SitesTransportation_1", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesTransportation_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesTransportation_1", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesTransportation_1", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesTransportation_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "MapLayer_SitesTransportation_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "Roller_WPReroller_1", "isActive", false],["IMG", "Roller_WPReroller_1", "curSrc", null],["IMG", "Roller_WPReroller_1", "activeSrc"],["IMG", "Roller_WPReroller_1", "pageID", "GAME"],["IMG", "Roller_WPReroller_1", "activeLayer", "map"],["IMG", "Roller_WPReroller_1", "zIndex", 6030],["IMG", "Roller_WPReroller_1", "modes", "Active", {"isForcedOn": "LAST", "lastActive": false, "lastState": null}],["IMG", "Roller_WPReroller_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "Roller_WPReroller_1", "modes", "Daylighter", {"isForcedOn": "LAST", "lastActive": false, "lastState": null}],["IMG", "Roller_WPReroller_1", "modes", "Downtime", {"isForcedOn": "LAST", "lastActive": false, "lastState": null}],["IMG", "Roller_WPReroller_1", "modes", "Spotlight", {"isForcedOn": "LAST", "lastActive": false, "lastState": null}],["IMG", "Roller_WPReroller_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "Roller_WPReroller_2", "isActive", false],["IMG", "Roller_WPReroller_2", "curSrc", null],["IMG", "Roller_WPReroller_2", "activeSrc"],["IMG", "Roller_WPReroller_2", "pageID", "GAME"],["IMG", "Roller_WPReroller_2", "activeLayer", "map"],["IMG", "Roller_WPReroller_2", "zIndex", 6010],["IMG", "Roller_WPReroller_2", "modes", "Active", {"isForcedOn": "LAST", "lastActive": false, "lastState": null}],["IMG", "Roller_WPReroller_2", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "Roller_WPReroller_2", "modes", "Daylighter", {"isForcedOn": "LAST", "lastActive": false, "lastState": null}],["IMG", "Roller_WPReroller_2", "modes", "Downtime", {"isForcedOn": "LAST", "lastActive": false, "lastState": null}],["IMG", "Roller_WPReroller_2", "modes", "Spotlight", {"isForcedOn": "LAST", "lastActive": false, "lastState": null}],["IMG", "Roller_WPReroller_2", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "Roller_WPReroller_Base_1", "isActive", false],["IMG", "Roller_WPReroller_Base_1", "curSrc", "base"],["IMG", "Roller_WPReroller_Base_1", "activeSrc", "base"],["IMG", "Roller_WPReroller_Base_1", "pageID", "GAME"],["IMG", "Roller_WPReroller_Base_1", "activeLayer", "map"],["IMG", "Roller_WPReroller_Base_1", "zIndex", 6020],["IMG", "Roller_WPReroller_Base_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "Roller_WPReroller_Base_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "Roller_WPReroller_Base_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "Roller_WPReroller_Base_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "Roller_WPReroller_Base_1", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "Roller_WPReroller_Base_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "Roller_WPReroller_Base_2", "isActive", false],["IMG", "Roller_WPReroller_Base_2", "curSrc", "base"],["IMG", "Roller_WPReroller_Base_2", "activeSrc", "base"],["IMG", "Roller_WPReroller_Base_2", "pageID", "GAME"],["IMG", "Roller_WPReroller_Base_2", "activeLayer", "map"],["IMG", "Roller_WPReroller_Base_2", "zIndex", 6000],["IMG", "Roller_WPReroller_Base_2", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "Roller_WPReroller_Base_2", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "Roller_WPReroller_Base_2", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "Roller_WPReroller_Base_2", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "Roller_WPReroller_Base_2", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "Roller_WPReroller_Base_2", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Big_1", "isActive", false],["IMG", "RollerDie_Big_1", "curSrc", null],["IMG", "RollerDie_Big_1", "activeSrc"],["IMG", "RollerDie_Big_1", "pageID", "GAME"],["IMG", "RollerDie_Big_1", "activeLayer", "map"],["IMG", "RollerDie_Big_1", "zIndex", 3990],["IMG", "RollerDie_Big_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Big_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Big_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Big_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Big_1", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Big_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Big_2", "isActive", false],["IMG", "RollerDie_Big_2", "curSrc", null],["IMG", "RollerDie_Big_2", "activeSrc"],["IMG", "RollerDie_Big_2", "pageID", "GAME"],["IMG", "RollerDie_Big_2", "activeLayer", "map"],["IMG", "RollerDie_Big_2", "zIndex", 3980],["IMG", "RollerDie_Big_2", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Big_2", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Big_2", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Big_2", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Big_2", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Big_2", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_1", "isActive", false],["IMG", "RollerDie_Main_1", "curSrc", null],["IMG", "RollerDie_Main_1", "activeSrc"],["IMG", "RollerDie_Main_1", "pageID", "GAME"],["IMG", "RollerDie_Main_1", "activeLayer", "map"],["IMG", "RollerDie_Main_1", "zIndex", 3990],["IMG", "RollerDie_Main_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_1", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_10", "isActive", false],["IMG", "RollerDie_Main_10", "curSrc", null],["IMG", "RollerDie_Main_10", "activeSrc"],["IMG", "RollerDie_Main_10", "pageID", "GAME"],["IMG", "RollerDie_Main_10", "activeLayer", "map"],["IMG", "RollerDie_Main_10", "zIndex", 3900],["IMG", "RollerDie_Main_10", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_10", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_10", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_10", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_10", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_10", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_11", "isActive", false],["IMG", "RollerDie_Main_11", "curSrc", null],["IMG", "RollerDie_Main_11", "activeSrc"],["IMG", "RollerDie_Main_11", "pageID", "GAME"],["IMG", "RollerDie_Main_11", "activeLayer", "map"],["IMG", "RollerDie_Main_11", "zIndex", 3890],["IMG", "RollerDie_Main_11", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_11", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_11", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_11", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_11", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_11", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_12", "isActive", false],["IMG", "RollerDie_Main_12", "curSrc", null],["IMG", "RollerDie_Main_12", "activeSrc"],["IMG", "RollerDie_Main_12", "pageID", "GAME"],["IMG", "RollerDie_Main_12", "activeLayer", "map"],["IMG", "RollerDie_Main_12", "zIndex", 3880],["IMG", "RollerDie_Main_12", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_12", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_12", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_12", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_12", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_12", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_13", "isActive", false],["IMG", "RollerDie_Main_13", "curSrc", null],["IMG", "RollerDie_Main_13", "activeSrc"],["IMG", "RollerDie_Main_13", "pageID", "GAME"],["IMG", "RollerDie_Main_13", "activeLayer", "map"],["IMG", "RollerDie_Main_13", "zIndex", 3870],["IMG", "RollerDie_Main_13", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_13", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_13", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_13", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_13", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_13", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_14", "isActive", false],["IMG", "RollerDie_Main_14", "curSrc", null],["IMG", "RollerDie_Main_14", "activeSrc"],["IMG", "RollerDie_Main_14", "pageID", "GAME"],["IMG", "RollerDie_Main_14", "activeLayer", "map"],["IMG", "RollerDie_Main_14", "zIndex", 3860],["IMG", "RollerDie_Main_14", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_14", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_14", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_14", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_14", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_14", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_15", "isActive", false],["IMG", "RollerDie_Main_15", "curSrc", null],["IMG", "RollerDie_Main_15", "activeSrc"],["IMG", "RollerDie_Main_15", "pageID", "GAME"],["IMG", "RollerDie_Main_15", "activeLayer", "map"],["IMG", "RollerDie_Main_15", "zIndex", 3850],["IMG", "RollerDie_Main_15", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_15", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_15", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_15", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_15", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_15", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_16", "isActive", false],["IMG", "RollerDie_Main_16", "curSrc", null],["IMG", "RollerDie_Main_16", "activeSrc"],["IMG", "RollerDie_Main_16", "pageID", "GAME"],["IMG", "RollerDie_Main_16", "activeLayer", "map"],["IMG", "RollerDie_Main_16", "zIndex", 3840],["IMG", "RollerDie_Main_16", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_16", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_16", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_16", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_16", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_16", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_17", "isActive", false],["IMG", "RollerDie_Main_17", "curSrc", null],["IMG", "RollerDie_Main_17", "activeSrc"],["IMG", "RollerDie_Main_17", "pageID", "GAME"],["IMG", "RollerDie_Main_17", "activeLayer", "map"],["IMG", "RollerDie_Main_17", "zIndex", 3830],["IMG", "RollerDie_Main_17", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_17", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_17", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_17", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_17", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_17", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_18", "isActive", false],["IMG", "RollerDie_Main_18", "curSrc", null],["IMG", "RollerDie_Main_18", "activeSrc"],["IMG", "RollerDie_Main_18", "pageID", "GAME"],["IMG", "RollerDie_Main_18", "activeLayer", "map"],["IMG", "RollerDie_Main_18", "zIndex", 3820],["IMG", "RollerDie_Main_18", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_18", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_18", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_18", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_18", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_18", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_19", "isActive", false],["IMG", "RollerDie_Main_19", "curSrc", null],["IMG", "RollerDie_Main_19", "activeSrc"],["IMG", "RollerDie_Main_19", "pageID", "GAME"],["IMG", "RollerDie_Main_19", "activeLayer", "map"],["IMG", "RollerDie_Main_19", "zIndex", 3810],["IMG", "RollerDie_Main_19", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_19", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_19", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_19", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_19", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_19", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_2", "isActive", false],["IMG", "RollerDie_Main_2", "curSrc", null],["IMG", "RollerDie_Main_2", "activeSrc"],["IMG", "RollerDie_Main_2", "pageID", "GAME"],["IMG", "RollerDie_Main_2", "activeLayer", "map"],["IMG", "RollerDie_Main_2", "zIndex", 3980],["IMG", "RollerDie_Main_2", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_2", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_2", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_2", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_2", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_2", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_20", "isActive", false],["IMG", "RollerDie_Main_20", "curSrc", null],["IMG", "RollerDie_Main_20", "activeSrc"],["IMG", "RollerDie_Main_20", "pageID", "GAME"],["IMG", "RollerDie_Main_20", "activeLayer", "map"],["IMG", "RollerDie_Main_20", "zIndex", 3800],["IMG", "RollerDie_Main_20", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_20", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_20", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_20", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_20", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_20", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_21", "isActive", false],["IMG", "RollerDie_Main_21", "curSrc", null],["IMG", "RollerDie_Main_21", "activeSrc"],["IMG", "RollerDie_Main_21", "pageID", "GAME"],["IMG", "RollerDie_Main_21", "activeLayer", "map"],["IMG", "RollerDie_Main_21", "zIndex", 3790],["IMG", "RollerDie_Main_21", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_21", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_21", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_21", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_21", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_21", "modes", "Complications", {"isForcedOn": null, "lastState": null}],
        ["IMG", "RollerDie_Main_22", "isActive", false],["IMG", "RollerDie_Main_22", "curSrc", null],["IMG", "RollerDie_Main_22", "activeSrc"],["IMG", "RollerDie_Main_22", "pageID", "GAME"],["IMG", "RollerDie_Main_22", "activeLayer", "map"],["IMG", "RollerDie_Main_22", "zIndex", 3780],["IMG", "RollerDie_Main_22", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_22", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_22", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_22", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_22", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_22", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_23", "isActive", false],["IMG", "RollerDie_Main_23", "curSrc", null],["IMG", "RollerDie_Main_23", "activeSrc"],["IMG", "RollerDie_Main_23", "pageID", "GAME"],["IMG", "RollerDie_Main_23", "activeLayer", "map"],["IMG", "RollerDie_Main_23", "zIndex", 3770],["IMG", "RollerDie_Main_23", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_23", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_23", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_23", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_23", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_23", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_24", "isActive", false],["IMG", "RollerDie_Main_24", "curSrc", null],["IMG", "RollerDie_Main_24", "activeSrc"],["IMG", "RollerDie_Main_24", "pageID", "GAME"],["IMG", "RollerDie_Main_24", "activeLayer", "map"],["IMG", "RollerDie_Main_24", "zIndex", 3760],["IMG", "RollerDie_Main_24", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_24", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_24", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_24", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_24", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_24", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_25", "isActive", false],["IMG", "RollerDie_Main_25", "curSrc", null],["IMG", "RollerDie_Main_25", "activeSrc"],["IMG", "RollerDie_Main_25", "pageID", "GAME"],["IMG", "RollerDie_Main_25", "activeLayer", "map"],["IMG", "RollerDie_Main_25", "zIndex", 3750],["IMG", "RollerDie_Main_25", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_25", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_25", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_25", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_25", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_25", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_26", "isActive", false],["IMG", "RollerDie_Main_26", "curSrc", null],["IMG", "RollerDie_Main_26", "activeSrc"],["IMG", "RollerDie_Main_26", "pageID", "GAME"],["IMG", "RollerDie_Main_26", "activeLayer", "map"],["IMG", "RollerDie_Main_26", "zIndex", 3740],["IMG", "RollerDie_Main_26", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_26", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_26", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_26", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_26", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_26", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_27", "isActive", false],["IMG", "RollerDie_Main_27", "curSrc", null],["IMG", "RollerDie_Main_27", "activeSrc"],["IMG", "RollerDie_Main_27", "pageID", "GAME"],["IMG", "RollerDie_Main_27", "activeLayer", "map"],["IMG", "RollerDie_Main_27", "zIndex", 3730],["IMG", "RollerDie_Main_27", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_27", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_27", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_27", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_27", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_27", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_28", "isActive", false],["IMG", "RollerDie_Main_28", "curSrc", null],["IMG", "RollerDie_Main_28", "activeSrc"],["IMG", "RollerDie_Main_28", "pageID", "GAME"],["IMG", "RollerDie_Main_28", "activeLayer", "map"],["IMG", "RollerDie_Main_28", "zIndex", 3720],["IMG", "RollerDie_Main_28", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_28", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_28", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_28", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_28", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_28", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_29", "isActive", false],["IMG", "RollerDie_Main_29", "curSrc", null],["IMG", "RollerDie_Main_29", "activeSrc"],["IMG", "RollerDie_Main_29", "pageID", "GAME"],["IMG", "RollerDie_Main_29", "activeLayer", "map"],["IMG", "RollerDie_Main_29", "zIndex", 3710],["IMG", "RollerDie_Main_29", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_29", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_29", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_29", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_29", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_29", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_3", "isActive", false],["IMG", "RollerDie_Main_3", "curSrc", null],["IMG", "RollerDie_Main_3", "activeSrc"],["IMG", "RollerDie_Main_3", "pageID", "GAME"],["IMG", "RollerDie_Main_3", "activeLayer", "map"],["IMG", "RollerDie_Main_3", "zIndex", 3970],["IMG", "RollerDie_Main_3", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_3", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_3", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_3", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_3", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_3", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_30", "isActive", false],["IMG", "RollerDie_Main_30", "curSrc", null],["IMG", "RollerDie_Main_30", "activeSrc"],["IMG", "RollerDie_Main_30", "pageID", "GAME"],["IMG", "RollerDie_Main_30", "activeLayer", "map"],["IMG", "RollerDie_Main_30", "zIndex", 3700],["IMG", "RollerDie_Main_30", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_30", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_30", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_30", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_30", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_30", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_4", "isActive", false],["IMG", "RollerDie_Main_4", "curSrc", null],["IMG", "RollerDie_Main_4", "activeSrc"],["IMG", "RollerDie_Main_4", "pageID", "GAME"],["IMG", "RollerDie_Main_4", "activeLayer", "map"],["IMG", "RollerDie_Main_4", "zIndex", 3960],["IMG", "RollerDie_Main_4", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_4", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_4", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_4", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_4", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_4", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_5", "isActive", false],["IMG", "RollerDie_Main_5", "curSrc", null],["IMG", "RollerDie_Main_5", "activeSrc"],["IMG", "RollerDie_Main_5", "pageID", "GAME"],["IMG", "RollerDie_Main_5", "activeLayer", "map"],["IMG", "RollerDie_Main_5", "zIndex", 3950],["IMG", "RollerDie_Main_5", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_5", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_5", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_5", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_5", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_5", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_6", "isActive", false],["IMG", "RollerDie_Main_6", "curSrc", null],["IMG", "RollerDie_Main_6", "activeSrc"],["IMG", "RollerDie_Main_6", "pageID", "GAME"],["IMG", "RollerDie_Main_6", "activeLayer", "map"],["IMG", "RollerDie_Main_6", "zIndex", 3940],["IMG", "RollerDie_Main_6", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_6", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_6", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_6", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_6", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_6", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_7", "isActive", false],["IMG", "RollerDie_Main_7", "curSrc", null],["IMG", "RollerDie_Main_7", "activeSrc"],["IMG", "RollerDie_Main_7", "pageID", "GAME"],["IMG", "RollerDie_Main_7", "activeLayer", "map"],["IMG", "RollerDie_Main_7", "zIndex", 3930],["IMG", "RollerDie_Main_7", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_7", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_7", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_7", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_7", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_7", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_8", "isActive", false],["IMG", "RollerDie_Main_8", "curSrc", null],["IMG", "RollerDie_Main_8", "activeSrc"],["IMG", "RollerDie_Main_8", "pageID", "GAME"],["IMG", "RollerDie_Main_8", "activeLayer", "map"],["IMG", "RollerDie_Main_8", "zIndex", 3920],["IMG", "RollerDie_Main_8", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_8", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_8", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_8", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_8", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_8", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_9", "isActive", false],["IMG", "RollerDie_Main_9", "curSrc", null],["IMG", "RollerDie_Main_9", "activeSrc"],["IMG", "RollerDie_Main_9", "pageID", "GAME"],["IMG", "RollerDie_Main_9", "activeLayer", "map"],["IMG", "RollerDie_Main_9", "zIndex", 3910],["IMG", "RollerDie_Main_9", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_9", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerDie_Main_9", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_9", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_9", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "RollerDie_Main_9", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_BottomEnd_1", "isActive", false],["IMG", "RollerFrame_BottomEnd_1", "curSrc", "base"],["IMG", "RollerFrame_BottomEnd_1", "activeSrc", "base"],["IMG", "RollerFrame_BottomEnd_1", "pageID", "GAME"],["IMG", "RollerFrame_BottomEnd_1", "activeLayer", "map"],["IMG", "RollerFrame_BottomEnd_1", "zIndex", 3610],["IMG", "RollerFrame_BottomEnd_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_BottomEnd_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_BottomEnd_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_BottomEnd_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_BottomEnd_1", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_BottomEnd_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_BottomMid_1", "isActive", false],["IMG", "RollerFrame_BottomMid_1", "curSrc", "base"],["IMG", "RollerFrame_BottomMid_1", "activeSrc", "base"],["IMG", "RollerFrame_BottomMid_1", "pageID", "GAME"],["IMG", "RollerFrame_BottomMid_1", "activeLayer", "map"],["IMG", "RollerFrame_BottomMid_1", "zIndex", 3520],["IMG", "RollerFrame_BottomMid_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_BottomMid_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_BottomMid_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_BottomMid_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_BottomMid_1", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_BottomMid_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_BottomMid_2", "isActive", false],["IMG", "RollerFrame_BottomMid_2", "curSrc", "base"],["IMG", "RollerFrame_BottomMid_2", "activeSrc", "base"],["IMG", "RollerFrame_BottomMid_2", "pageID", "GAME"],["IMG", "RollerFrame_BottomMid_2", "activeLayer", "map"],["IMG", "RollerFrame_BottomMid_2", "zIndex", 3530],["IMG", "RollerFrame_BottomMid_2", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_BottomMid_2", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_BottomMid_2", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_BottomMid_2", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_BottomMid_2", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_BottomMid_2", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_BottomMid_3", "isActive", false],["IMG", "RollerFrame_BottomMid_3", "curSrc", "base"],["IMG", "RollerFrame_BottomMid_3", "activeSrc", "base"],["IMG", "RollerFrame_BottomMid_3", "pageID", "GAME"],["IMG", "RollerFrame_BottomMid_3", "activeLayer", "map"],["IMG", "RollerFrame_BottomMid_3", "zIndex", 3540],["IMG", "RollerFrame_BottomMid_3", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_BottomMid_3", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_BottomMid_3", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_BottomMid_3", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_BottomMid_3", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_BottomMid_3", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_BottomMid_4", "isActive", false],["IMG", "RollerFrame_BottomMid_4", "curSrc", "base"],["IMG", "RollerFrame_BottomMid_4", "activeSrc", "base"],["IMG", "RollerFrame_BottomMid_4", "pageID", "GAME"],["IMG", "RollerFrame_BottomMid_4", "activeLayer", "map"],["IMG", "RollerFrame_BottomMid_4", "zIndex", 3550],["IMG", "RollerFrame_BottomMid_4", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_BottomMid_4", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_BottomMid_4", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_BottomMid_4", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_BottomMid_4", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_BottomMid_4", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_BottomMid_5", "isActive", false],["IMG", "RollerFrame_BottomMid_5", "curSrc", "base"],["IMG", "RollerFrame_BottomMid_5", "activeSrc", "base"],["IMG", "RollerFrame_BottomMid_5", "pageID", "GAME"],["IMG", "RollerFrame_BottomMid_5", "activeLayer", "map"],["IMG", "RollerFrame_BottomMid_5", "zIndex", 3560],["IMG", "RollerFrame_BottomMid_5", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_BottomMid_5", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_BottomMid_5", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_BottomMid_5", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_BottomMid_5", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_BottomMid_5", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_BottomMid_6", "isActive", false],["IMG", "RollerFrame_BottomMid_6", "curSrc", "base"],["IMG", "RollerFrame_BottomMid_6", "activeSrc", "base"],["IMG", "RollerFrame_BottomMid_6", "pageID", "GAME"],["IMG", "RollerFrame_BottomMid_6", "activeLayer", "map"],["IMG", "RollerFrame_BottomMid_6", "zIndex", 3570],["IMG", "RollerFrame_BottomMid_6", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_BottomMid_6", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_BottomMid_6", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_BottomMid_6", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_BottomMid_6", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_BottomMid_6", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_BottomMid_7", "isActive", false],["IMG", "RollerFrame_BottomMid_7", "curSrc", "base"],["IMG", "RollerFrame_BottomMid_7", "activeSrc", "base"],["IMG", "RollerFrame_BottomMid_7", "pageID", "GAME"],["IMG", "RollerFrame_BottomMid_7", "activeLayer", "map"],["IMG", "RollerFrame_BottomMid_7", "zIndex", 3580],["IMG", "RollerFrame_BottomMid_7", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_BottomMid_7", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_BottomMid_7", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_BottomMid_7", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_BottomMid_7", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_BottomMid_7", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_BottomMid_8", "isActive", false],["IMG", "RollerFrame_BottomMid_8", "curSrc", "base"],["IMG", "RollerFrame_BottomMid_8", "activeSrc", "base"],["IMG", "RollerFrame_BottomMid_8", "pageID", "GAME"],["IMG", "RollerFrame_BottomMid_8", "activeLayer", "map"],["IMG", "RollerFrame_BottomMid_8", "zIndex", 3590],["IMG", "RollerFrame_BottomMid_8", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_BottomMid_8", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_BottomMid_8", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_BottomMid_8", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_BottomMid_8", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_BottomMid_8", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_BottomMid_9", "isActive", false],["IMG", "RollerFrame_BottomMid_9", "curSrc", "base"],["IMG", "RollerFrame_BottomMid_9", "activeSrc", "base"],["IMG", "RollerFrame_BottomMid_9", "pageID", "GAME"],["IMG", "RollerFrame_BottomMid_9", "activeLayer", "map"],["IMG", "RollerFrame_BottomMid_9", "zIndex", 3600],["IMG", "RollerFrame_BottomMid_9", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_BottomMid_9", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_BottomMid_9", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_BottomMid_9", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_BottomMid_9", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_BottomMid_9", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_Diff_1", "isActive", false],["IMG", "RollerFrame_Diff_1", "curSrc", "base"],["IMG", "RollerFrame_Diff_1", "activeSrc", "base"],["IMG", "RollerFrame_Diff_1", "pageID", "GAME"],["IMG", "RollerFrame_Diff_1", "activeLayer", "map"],["IMG", "RollerFrame_Diff_1", "zIndex", 3750],["IMG", "RollerFrame_Diff_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_Diff_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_Diff_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_Diff_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_Diff_1", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_Diff_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_Left_1", "isActive", true],["IMG", "RollerFrame_Left_1", "curSrc", "@@curSrc@@"],["IMG", "RollerFrame_Left_1", "activeSrc"],["IMG", "RollerFrame_Left_1", "pageID", "GAME"],["IMG", "RollerFrame_Left_1", "activeLayer", "map"],["IMG", "RollerFrame_Left_1", "zIndex", 3510],["IMG", "RollerFrame_Left_1", "modes", "Active", {"isForcedOn": true, "isForcedState": true, "lastState": "@@curSrc@@"}],["IMG", "RollerFrame_Left_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_Left_1", "modes", "Daylighter", {"isForcedOn": true, "isForcedState": true, "lastState": "@@curSrc@@"}],["IMG", "RollerFrame_Left_1", "modes", "Downtime", {"isForcedOn": true, "isForcedState": true, "lastState": "@@curSrc@@"}],["IMG", "RollerFrame_Left_1", "modes", "Spotlight", {"isForcedOn": true, "isForcedState": true, "lastState": "@@curSrc@@"}],["IMG", "RollerFrame_Left_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_TopEnd_1", "isActive", true],["IMG", "RollerFrame_TopEnd_1", "curSrc", "base"],["IMG", "RollerFrame_TopEnd_1", "activeSrc", "base"],["IMG", "RollerFrame_TopEnd_1", "pageID", "GAME"],["IMG", "RollerFrame_TopEnd_1", "activeLayer", "map"],["IMG", "RollerFrame_TopEnd_1", "zIndex", 3610],["IMG", "RollerFrame_TopEnd_1", "modes", "Active", {"isForcedOn": true, "isForcedState": "base", "lastState": "base"}],["IMG", "RollerFrame_TopEnd_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_TopEnd_1", "modes", "Daylighter", {"isForcedOn": true, "isForcedState": "base", "lastState": "base"}],["IMG", "RollerFrame_TopEnd_1", "modes", "Downtime", {"isForcedOn": true, "isForcedState": "base", "lastState": "base"}],["IMG", "RollerFrame_TopEnd_1", "modes", "Spotlight", {"isForcedOn": true, "isForcedState": "base", "lastState": "base"}],["IMG", "RollerFrame_TopEnd_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_TopMid_1", "isActive", false],["IMG", "RollerFrame_TopMid_1", "curSrc", "base"],["IMG", "RollerFrame_TopMid_1", "activeSrc", "base"],["IMG", "RollerFrame_TopMid_1", "pageID", "GAME"],["IMG", "RollerFrame_TopMid_1", "activeLayer", "map"],["IMG", "RollerFrame_TopMid_1", "zIndex", 3520],["IMG", "RollerFrame_TopMid_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_TopMid_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_TopMid_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_TopMid_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_TopMid_1", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_TopMid_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],
        ["IMG", "RollerFrame_TopMid_2", "isActive", false],["IMG", "RollerFrame_TopMid_2", "curSrc", "base"],["IMG", "RollerFrame_TopMid_2", "activeSrc", "base"],["IMG", "RollerFrame_TopMid_2", "pageID", "GAME"],["IMG", "RollerFrame_TopMid_2", "activeLayer", "map"],["IMG", "RollerFrame_TopMid_2", "zIndex", 3530],["IMG", "RollerFrame_TopMid_2", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_TopMid_2", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_TopMid_2", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_TopMid_2", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_TopMid_2", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_TopMid_2", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_TopMid_3", "isActive", false],["IMG", "RollerFrame_TopMid_3", "curSrc", "base"],["IMG", "RollerFrame_TopMid_3", "activeSrc", "base"],["IMG", "RollerFrame_TopMid_3", "pageID", "GAME"],["IMG", "RollerFrame_TopMid_3", "activeLayer", "map"],["IMG", "RollerFrame_TopMid_3", "zIndex", 3540],["IMG", "RollerFrame_TopMid_3", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_TopMid_3", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_TopMid_3", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_TopMid_3", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_TopMid_3", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_TopMid_3", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_TopMid_4", "isActive", false],["IMG", "RollerFrame_TopMid_4", "curSrc", "base"],["IMG", "RollerFrame_TopMid_4", "activeSrc", "base"],["IMG", "RollerFrame_TopMid_4", "pageID", "GAME"],["IMG", "RollerFrame_TopMid_4", "activeLayer", "map"],["IMG", "RollerFrame_TopMid_4", "zIndex", 3550],["IMG", "RollerFrame_TopMid_4", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_TopMid_4", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_TopMid_4", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_TopMid_4", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_TopMid_4", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_TopMid_4", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_TopMid_5", "isActive", false],["IMG", "RollerFrame_TopMid_5", "curSrc", "base"],["IMG", "RollerFrame_TopMid_5", "activeSrc", "base"],["IMG", "RollerFrame_TopMid_5", "pageID", "GAME"],["IMG", "RollerFrame_TopMid_5", "activeLayer", "map"],["IMG", "RollerFrame_TopMid_5", "zIndex", 3560],["IMG", "RollerFrame_TopMid_5", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_TopMid_5", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_TopMid_5", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_TopMid_5", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_TopMid_5", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_TopMid_5", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_TopMid_6", "isActive", false],["IMG", "RollerFrame_TopMid_6", "curSrc", "base"],["IMG", "RollerFrame_TopMid_6", "activeSrc", "base"],["IMG", "RollerFrame_TopMid_6", "pageID", "GAME"],["IMG", "RollerFrame_TopMid_6", "activeLayer", "map"],["IMG", "RollerFrame_TopMid_6", "zIndex", 3570],["IMG", "RollerFrame_TopMid_6", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_TopMid_6", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_TopMid_6", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_TopMid_6", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_TopMid_6", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_TopMid_6", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_TopMid_7", "isActive", false],["IMG", "RollerFrame_TopMid_7", "curSrc", "base"],["IMG", "RollerFrame_TopMid_7", "activeSrc", "base"],["IMG", "RollerFrame_TopMid_7", "pageID", "GAME"],["IMG", "RollerFrame_TopMid_7", "activeLayer", "map"],["IMG", "RollerFrame_TopMid_7", "zIndex", 3580],["IMG", "RollerFrame_TopMid_7", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_TopMid_7", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_TopMid_7", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_TopMid_7", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_TopMid_7", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_TopMid_7", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_TopMid_8", "isActive", false],["IMG", "RollerFrame_TopMid_8", "curSrc", "base"],["IMG", "RollerFrame_TopMid_8", "activeSrc", "base"],["IMG", "RollerFrame_TopMid_8", "pageID", "GAME"],["IMG", "RollerFrame_TopMid_8", "activeLayer", "map"],["IMG", "RollerFrame_TopMid_8", "zIndex", 3590],["IMG", "RollerFrame_TopMid_8", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_TopMid_8", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_TopMid_8", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_TopMid_8", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_TopMid_8", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_TopMid_8", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_TopMid_9", "isActive", false],["IMG", "RollerFrame_TopMid_9", "curSrc", "base"],["IMG", "RollerFrame_TopMid_9", "activeSrc", "base"],["IMG", "RollerFrame_TopMid_9", "pageID", "GAME"],["IMG", "RollerFrame_TopMid_9", "activeLayer", "map"],["IMG", "RollerFrame_TopMid_9", "zIndex", 3600],["IMG", "RollerFrame_TopMid_9", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_TopMid_9", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "RollerFrame_TopMid_9", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_TopMid_9", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_TopMid_9", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "RollerFrame_TopMid_9", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "SignalLightBotLeft_1", "isActive", true],["IMG", "SignalLightBotLeft_1", "curSrc", "off"],["IMG", "SignalLightBotLeft_1", "activeSrc", "off"],["IMG", "SignalLightBotLeft_1", "pageID", "GAME"],["IMG", "SignalLightBotLeft_1", "activeLayer", "map"],["IMG", "SignalLightBotLeft_1", "zIndex", 1200],["IMG", "SignalLightBotLeft_1", "modes", "Active", {"isForcedOn": true, "isForcedState": "off", "lastState": "off"}],["IMG", "SignalLightBotLeft_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "SignalLightBotLeft_1", "modes", "Daylighter", {"isForcedOn": true, "isForcedState": "off", "lastState": "off"}],["IMG", "SignalLightBotLeft_1", "modes", "Downtime", {"isForcedOn": true, "isForcedState": "off", "lastState": "off"}],["IMG", "SignalLightBotLeft_1", "modes", "Spotlight", {"isForcedOn": true, "isForcedState": "off", "lastState": "off"}],["IMG", "SignalLightBotLeft_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "SignalLightBotRight_1", "isActive", true],["IMG", "SignalLightBotRight_1", "curSrc", "off"],["IMG", "SignalLightBotRight_1", "activeSrc", "off"],["IMG", "SignalLightBotRight_1", "pageID", "GAME"],["IMG", "SignalLightBotRight_1", "activeLayer", "map"],["IMG", "SignalLightBotRight_1", "zIndex", 1200],["IMG", "SignalLightBotRight_1", "modes", "Active", {"isForcedOn": true, "isForcedState": "off", "lastState": "off"}],["IMG", "SignalLightBotRight_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "SignalLightBotRight_1", "modes", "Daylighter", {"isForcedOn": true, "isForcedState": "off", "lastState": "off"}],["IMG", "SignalLightBotRight_1", "modes", "Downtime", {"isForcedOn": true, "isForcedState": "off", "lastState": "off"}],["IMG", "SignalLightBotRight_1", "modes", "Spotlight", {"isForcedOn": true, "isForcedState": "off", "lastState": "off"}],["IMG", "SignalLightBotRight_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "SignalLightMidRight_1", "isActive", true],["IMG", "SignalLightMidRight_1", "curSrc", "off"],["IMG", "SignalLightMidRight_1", "activeSrc", "off"],["IMG", "SignalLightMidRight_1", "pageID", "GAME"],["IMG", "SignalLightMidRight_1", "activeLayer", "map"],["IMG", "SignalLightMidRight_1", "zIndex", 1200],["IMG", "SignalLightMidRight_1", "modes", "Active", {"isForcedOn": true, "isForcedState": "off", "lastState": "off"}],["IMG", "SignalLightMidRight_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "SignalLightMidRight_1", "modes", "Daylighter", {"isForcedOn": true, "isForcedState": "off", "lastState": "off"}],["IMG", "SignalLightMidRight_1", "modes", "Downtime", {"isForcedOn": true, "isForcedState": "off", "lastState": "off"}],["IMG", "SignalLightMidRight_1", "modes", "Spotlight", {"isForcedOn": true, "isForcedState": "off", "lastState": "off"}],["IMG", "SignalLightMidRight_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "SignalLightTopLeft_1", "isActive", true],["IMG", "SignalLightTopLeft_1", "curSrc", "off"],["IMG", "SignalLightTopLeft_1", "activeSrc", "off"],["IMG", "SignalLightTopLeft_1", "pageID", "GAME"],["IMG", "SignalLightTopLeft_1", "activeLayer", "map"],["IMG", "SignalLightTopLeft_1", "zIndex", 1200],["IMG", "SignalLightTopLeft_1", "modes", "Active", {"isForcedOn": true, "isForcedState": "off", "lastState": "off"}],["IMG", "SignalLightTopLeft_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "SignalLightTopLeft_1", "modes", "Daylighter", {"isForcedOn": true, "isForcedState": "off", "lastState": "off"}],["IMG", "SignalLightTopLeft_1", "modes", "Downtime", {"isForcedOn": true, "isForcedState": "off", "lastState": "off"}],["IMG", "SignalLightTopLeft_1", "modes", "Spotlight", {"isForcedOn": true, "isForcedState": "off", "lastState": "off"}],["IMG", "SignalLightTopLeft_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "SignalLightTopRight_1", "isActive", true],["IMG", "SignalLightTopRight_1", "curSrc", "off"],["IMG", "SignalLightTopRight_1", "activeSrc", "off"],["IMG", "SignalLightTopRight_1", "pageID", "GAME"],["IMG", "SignalLightTopRight_1", "activeLayer", "map"],["IMG", "SignalLightTopRight_1", "zIndex", 1200],["IMG", "SignalLightTopRight_1", "modes", "Active", {"isForcedOn": true, "isForcedState": "off", "lastState": "off"}],["IMG", "SignalLightTopRight_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "SignalLightTopRight_1", "modes", "Daylighter", {"isForcedOn": true, "isForcedState": "off", "lastState": "off"}],["IMG", "SignalLightTopRight_1", "modes", "Downtime", {"isForcedOn": true, "isForcedState": "off", "lastState": "off"}],["IMG", "SignalLightTopRight_1", "modes", "Spotlight", {"isForcedOn": true, "isForcedState": "off", "lastState": "off"}],["IMG", "SignalLightTopRight_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "SiteBarCenter_1", "isActive", "@@curState@@"],["IMG", "SiteBarCenter_1", "curSrc", "base"],["IMG", "SiteBarCenter_1", "activeSrc", "base"],["IMG", "SiteBarCenter_1", "pageID", "GAME"],["IMG", "SiteBarCenter_1", "activeLayer", "map"],["IMG", "SiteBarCenter_1", "zIndex", 2000],["IMG", "SiteBarCenter_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "SiteBarCenter_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "SiteBarCenter_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "SiteBarCenter_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "SiteBarCenter_1", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "SiteBarCenter_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "SiteBarLeft_1", "isActive", "@@curState@@"],["IMG", "SiteBarLeft_1", "curSrc", "base"],["IMG", "SiteBarLeft_1", "activeSrc", "base"],["IMG", "SiteBarLeft_1", "pageID", "GAME"],["IMG", "SiteBarLeft_1", "activeLayer", "map"],["IMG", "SiteBarLeft_1", "zIndex", 1640],["IMG", "SiteBarLeft_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "SiteBarLeft_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "SiteBarLeft_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "SiteBarLeft_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "SiteBarLeft_1", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "SiteBarLeft_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "SiteBarRight_1", "isActive", "@@curState@@"],["IMG", "SiteBarRight_1", "curSrc", "base"],["IMG", "SiteBarRight_1", "activeSrc", "base"],["IMG", "SiteBarRight_1", "pageID", "GAME"],["IMG", "SiteBarRight_1", "activeLayer", "map"],["IMG", "SiteBarRight_1", "zIndex", 1640],["IMG", "SiteBarRight_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "SiteBarRight_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "SiteBarRight_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "SiteBarRight_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "SiteBarRight_1", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "SiteBarRight_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "SiteCenter_1", "isActive", "@@curState@@"],["IMG", "SiteCenter_1", "curSrc", "@@curSrc@@"],["IMG", "SiteCenter_1", "activeSrc"],["IMG", "SiteCenter_1", "pageID", "GAME"],["IMG", "SiteCenter_1", "activeLayer", "map"],["IMG", "SiteCenter_1", "zIndex", 1820],["IMG", "SiteCenter_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SiteCenter_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "SiteCenter_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SiteCenter_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SiteCenter_1", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SiteCenter_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "SiteCenterTint_1", "isActive", false],["IMG", "SiteCenterTint_1", "curSrc", "base"],["IMG", "SiteCenterTint_1", "activeSrc", "base"],["IMG", "SiteCenterTint_1", "pageID", "GAME"],["IMG", "SiteCenterTint_1", "activeLayer", "map"],["IMG", "SiteCenterTint_1", "zIndex", 2070],["IMG", "SiteCenterTint_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "SiteCenterTint_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "SiteCenterTint_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "SiteCenterTint_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "SiteCenterTint_1", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "SiteCenterTint_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "SiteFocusHub_1", "isActive", false],["IMG", "SiteFocusHub_1", "curSrc", null],["IMG", "SiteFocusHub_1", "activeSrc"],["IMG", "SiteFocusHub_1", "pageID", "GAME"],["IMG", "SiteFocusHub_1", "activeLayer", "map"],["IMG", "SiteFocusHub_1", "zIndex", 4307],["IMG", "SiteFocusHub_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SiteFocusHub_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "SiteFocusHub_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SiteFocusHub_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SiteFocusHub_1", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SiteFocusHub_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "SiteLeft_1", "isActive", "@@curState@@"],["IMG", "SiteLeft_1", "curSrc", "@@curSrc@@"],["IMG", "SiteLeft_1", "activeSrc"],["IMG", "SiteLeft_1", "pageID", "GAME"],["IMG", "SiteLeft_1", "activeLayer", "map"],["IMG", "SiteLeft_1", "zIndex", 1520],["IMG", "SiteLeft_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SiteLeft_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "SiteLeft_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SiteLeft_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SiteLeft_1", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SiteLeft_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "SiteLeftTint_1", "isActive", false],["IMG", "SiteLeftTint_1", "curSrc", "base"],["IMG", "SiteLeftTint_1", "activeSrc", "base"],["IMG", "SiteLeftTint_1", "pageID", "GAME"],["IMG", "SiteLeftTint_1", "activeLayer", "map"],["IMG", "SiteLeftTint_1", "zIndex", 1710],["IMG", "SiteLeftTint_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "SiteLeftTint_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "SiteLeftTint_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "SiteLeftTint_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "SiteLeftTint_1", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "SiteLeftTint_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "SiteMidCenter_1", "isActive", false],["IMG", "SiteMidCenter_1", "curSrc", null],["IMG", "SiteMidCenter_1", "activeSrc"],["IMG", "SiteMidCenter_1", "pageID", "GAME"],["IMG", "SiteMidCenter_1", "activeLayer", "map"],["IMG", "SiteMidCenter_1", "zIndex", 1480],["IMG", "SiteMidCenter_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SiteMidCenter_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "SiteMidCenter_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SiteMidCenter_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SiteMidCenter_1", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SiteMidCenter_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "SiteMidCenterTint_1", "isActive", false],["IMG", "SiteMidCenterTint_1", "curSrc", "base"],["IMG", "SiteMidCenterTint_1", "activeSrc", "base"],["IMG", "SiteMidCenterTint_1", "pageID", "GAME"],["IMG", "SiteMidCenterTint_1", "activeLayer", "map"],["IMG", "SiteMidCenterTint_1", "zIndex", 1490],["IMG", "SiteMidCenterTint_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "SiteMidCenterTint_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "SiteMidCenterTint_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "SiteMidCenterTint_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "SiteMidCenterTint_1", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "SiteMidCenterTint_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "SiteRight_1", "isActive", "@@curState@@"],["IMG", "SiteRight_1", "curSrc", "@@curSrc@@"],["IMG", "SiteRight_1", "activeSrc"],["IMG", "SiteRight_1", "pageID", "GAME"],["IMG", "SiteRight_1", "activeLayer", "map"],["IMG", "SiteRight_1", "zIndex", 1520],["IMG", "SiteRight_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SiteRight_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "SiteRight_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SiteRight_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SiteRight_1", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SiteRight_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "SiteRightTint_1", "isActive", false],["IMG", "SiteRightTint_1", "curSrc", "base"],["IMG", "SiteRightTint_1", "activeSrc", "base"],["IMG", "SiteRightTint_1", "pageID", "GAME"],["IMG", "SiteRightTint_1", "activeLayer", "map"],["IMG", "SiteRightTint_1", "zIndex", 1710],["IMG", "SiteRightTint_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "SiteRightTint_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "SiteRightTint_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "SiteRightTint_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "SiteRightTint_1", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "SiteRightTint_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "SiteTopCenter_1", "isActive", false],["IMG", "SiteTopCenter_1", "curSrc", null],["IMG", "SiteTopCenter_1", "activeSrc"],["IMG", "SiteTopCenter_1", "pageID", "GAME"],["IMG", "SiteTopCenter_1", "activeLayer", "map"],["IMG", "SiteTopCenter_1", "zIndex", 1420],["IMG", "SiteTopCenter_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SiteTopCenter_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "SiteTopCenter_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SiteTopCenter_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SiteTopCenter_1", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SiteTopCenter_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "SiteTopCenterTint_1", "isActive", false],["IMG", "SiteTopCenterTint_1", "curSrc", "base"],["IMG", "SiteTopCenterTint_1", "activeSrc", "base"],["IMG", "SiteTopCenterTint_1", "pageID", "GAME"],["IMG", "SiteTopCenterTint_1", "activeLayer", "map"],["IMG", "SiteTopCenterTint_1", "zIndex", 1430],["IMG", "SiteTopCenterTint_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "SiteTopCenterTint_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "SiteTopCenterTint_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "SiteTopCenterTint_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "SiteTopCenterTint_1", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "SiteTopCenterTint_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "SiteTopLeft_1", "isActive", false],["IMG", "SiteTopLeft_1", "curSrc", null],["IMG", "SiteTopLeft_1", "activeSrc"],["IMG", "SiteTopLeft_1", "pageID", "GAME"],["IMG", "SiteTopLeft_1", "activeLayer", "map"],["IMG", "SiteTopLeft_1", "zIndex", 1440],["IMG", "SiteTopLeft_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SiteTopLeft_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "SiteTopLeft_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SiteTopLeft_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SiteTopLeft_1", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SiteTopLeft_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "SiteTopLeftTint_1", "isActive", false],["IMG", "SiteTopLeftTint_1", "curSrc", "base"],["IMG", "SiteTopLeftTint_1", "activeSrc", "base"],["IMG", "SiteTopLeftTint_1", "pageID", "GAME"],["IMG", "SiteTopLeftTint_1", "activeLayer", "map"],["IMG", "SiteTopLeftTint_1", "zIndex", 1450],["IMG", "SiteTopLeftTint_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "SiteTopLeftTint_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "SiteTopLeftTint_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "SiteTopLeftTint_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "SiteTopLeftTint_1", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "SiteTopLeftTint_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "SiteTopRight_1", "isActive", false],["IMG", "SiteTopRight_1", "curSrc", null],["IMG", "SiteTopRight_1", "activeSrc"],["IMG", "SiteTopRight_1", "pageID", "GAME"],["IMG", "SiteTopRight_1", "activeLayer", "map"],["IMG", "SiteTopRight_1", "zIndex", 1440],["IMG", "SiteTopRight_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SiteTopRight_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "SiteTopRight_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SiteTopRight_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SiteTopRight_1", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SiteTopRight_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],
        ["IMG", "SiteTopRightTint_1", "isActive", false],["IMG", "SiteTopRightTint_1", "curSrc", "base"],["IMG", "SiteTopRightTint_1", "activeSrc", "base"],["IMG", "SiteTopRightTint_1", "pageID", "GAME"],["IMG", "SiteTopRightTint_1", "activeLayer", "map"],["IMG", "SiteTopRightTint_1", "zIndex", 1450],["IMG", "SiteTopRightTint_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "SiteTopRightTint_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "SiteTopRightTint_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "SiteTopRightTint_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "SiteTopRightTint_1", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": "base", "lastActive": false, "lastState": "base"}],["IMG", "SiteTopRightTint_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "Spotlight_1", "isActive", false],["IMG", "Spotlight_1", "curSrc", "@@curSrc@@"],["IMG", "Spotlight_1", "activeSrc"],["IMG", "Spotlight_1", "pageID", "GAME"],["IMG", "Spotlight_1", "activeLayer", "map"],["IMG", "Spotlight_1", "zIndex", 1050],["IMG", "Spotlight_1", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "Spotlight_1", "modes", "Inactive", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "Spotlight_1", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "Spotlight_1", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "Spotlight_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "Spotlight_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "SpotlightBG_1", "isActive", false],["IMG", "SpotlightBG_1", "curSrc", "@@curSrc@@"],["IMG", "SpotlightBG_1", "activeSrc"],["IMG", "SpotlightBG_1", "pageID", "GAME"],["IMG", "SpotlightBG_1", "activeLayer", "map"],["IMG", "SpotlightBG_1", "zIndex", 750],["IMG", "SpotlightBG_1", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "SpotlightBG_1", "modes", "Inactive", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "SpotlightBG_1", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "SpotlightBG_1", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "SpotlightBG_1", "modes", "Spotlight", {"isForcedOn": true, "isForcedState": true, "lastState": "@@curSrc@@"}],["IMG", "SpotlightBG_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "SubLocBotLeft_1", "isActive", "@@curState@@"],["IMG", "SubLocBotLeft_1", "curSrc", "@@curSrc@@"],["IMG", "SubLocBotLeft_1", "activeSrc"],["IMG", "SubLocBotLeft_1", "pageID", "GAME"],["IMG", "SubLocBotLeft_1", "activeLayer", "map"],["IMG", "SubLocBotLeft_1", "zIndex", 2120],["IMG", "SubLocBotLeft_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SubLocBotLeft_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "SubLocBotLeft_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SubLocBotLeft_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SubLocBotLeft_1", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SubLocBotLeft_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "SubLocBotRight_1", "isActive", "@@curState@@"],["IMG", "SubLocBotRight_1", "curSrc", "@@curSrc@@"],["IMG", "SubLocBotRight_1", "activeSrc"],["IMG", "SubLocBotRight_1", "pageID", "GAME"],["IMG", "SubLocBotRight_1", "activeLayer", "map"],["IMG", "SubLocBotRight_1", "zIndex", 2120],["IMG", "SubLocBotRight_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SubLocBotRight_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "SubLocBotRight_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SubLocBotRight_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SubLocBotRight_1", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SubLocBotRight_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "SubLocLeft_1", "isActive", "@@curState@@"],["IMG", "SubLocLeft_1", "curSrc", "@@curSrc@@"],["IMG", "SubLocLeft_1", "activeSrc"],["IMG", "SubLocLeft_1", "pageID", "GAME"],["IMG", "SubLocLeft_1", "activeLayer", "map"],["IMG", "SubLocLeft_1", "zIndex", 2120],["IMG", "SubLocLeft_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SubLocLeft_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "SubLocLeft_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SubLocLeft_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SubLocLeft_1", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SubLocLeft_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "SubLocRight_1", "isActive", "@@curState@@"],["IMG", "SubLocRight_1", "curSrc", "@@curSrc@@"],["IMG", "SubLocRight_1", "activeSrc"],["IMG", "SubLocRight_1", "pageID", "GAME"],["IMG", "SubLocRight_1", "activeLayer", "map"],["IMG", "SubLocRight_1", "zIndex", 2120],["IMG", "SubLocRight_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SubLocRight_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "SubLocRight_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SubLocRight_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SubLocRight_1", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SubLocRight_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "SubLocTopLeft_1", "isActive", "@@curState@@"],["IMG", "SubLocTopLeft_1", "curSrc", "@@curSrc@@"],["IMG", "SubLocTopLeft_1", "activeSrc"],["IMG", "SubLocTopLeft_1", "pageID", "GAME"],["IMG", "SubLocTopLeft_1", "activeLayer", "map"],["IMG", "SubLocTopLeft_1", "zIndex", 2120],["IMG", "SubLocTopLeft_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SubLocTopLeft_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "SubLocTopLeft_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SubLocTopLeft_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SubLocTopLeft_1", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SubLocTopLeft_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "SubLocTopRight_1", "isActive", "@@curState@@"],["IMG", "SubLocTopRight_1", "curSrc", "@@curSrc@@"],["IMG", "SubLocTopRight_1", "activeSrc"],["IMG", "SubLocTopRight_1", "pageID", "GAME"],["IMG", "SubLocTopRight_1", "activeLayer", "map"],["IMG", "SubLocTopRight_1", "zIndex", 2120],["IMG", "SubLocTopRight_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SubLocTopRight_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "SubLocTopRight_1", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SubLocTopRight_1", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SubLocTopRight_1", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curSrc@@"}],["IMG", "SubLocTopRight_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "TombstoneBotLeft_1", "isActive", false],["IMG", "TombstoneBotLeft_1", "curSrc", "@@curSrc@@"],["IMG", "TombstoneBotLeft_1", "activeSrc"],["IMG", "TombstoneBotLeft_1", "pageID", "GAME"],["IMG", "TombstoneBotLeft_1", "activeLayer", "map"],["IMG", "TombstoneBotLeft_1", "zIndex", 1110],["IMG", "TombstoneBotLeft_1", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneBotLeft_1", "modes", "Inactive", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneBotLeft_1", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneBotLeft_1", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneBotLeft_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "TombstoneBotLeft_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "TombstoneBotRight_1", "isActive", false],["IMG", "TombstoneBotRight_1", "curSrc", "@@curSrc@@"],["IMG", "TombstoneBotRight_1", "activeSrc"],["IMG", "TombstoneBotRight_1", "pageID", "GAME"],["IMG", "TombstoneBotRight_1", "activeLayer", "map"],["IMG", "TombstoneBotRight_1", "zIndex", 1110],["IMG", "TombstoneBotRight_1", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneBotRight_1", "modes", "Inactive", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneBotRight_1", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneBotRight_1", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneBotRight_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "TombstoneBotRight_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "TombstoneMidRight_1", "isActive", false],["IMG", "TombstoneMidRight_1", "curSrc", "@@curSrc@@"],["IMG", "TombstoneMidRight_1", "activeSrc"],["IMG", "TombstoneMidRight_1", "pageID", "GAME"],["IMG", "TombstoneMidRight_1", "activeLayer", "map"],["IMG", "TombstoneMidRight_1", "zIndex", 1090],["IMG", "TombstoneMidRight_1", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneMidRight_1", "modes", "Inactive", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneMidRight_1", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneMidRight_1", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneMidRight_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "TombstoneMidRight_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "TombstoneTokenBotLeft_1", "isActive", false],["IMG", "TombstoneTokenBotLeft_1", "curSrc", "@@curSrc@@"],["IMG", "TombstoneTokenBotLeft_1", "activeSrc"],["IMG", "TombstoneTokenBotLeft_1", "pageID", "GAME"],["IMG", "TombstoneTokenBotLeft_1", "activeLayer", "map"],["IMG", "TombstoneTokenBotLeft_1", "zIndex", 800],["IMG", "TombstoneTokenBotLeft_1", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneTokenBotLeft_1", "modes", "Inactive", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneTokenBotLeft_1", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneTokenBotLeft_1", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneTokenBotLeft_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "TombstoneTokenBotLeft_1", "modes", "Complications", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneTokenBotRight_1", "isActive", false],["IMG", "TombstoneTokenBotRight_1", "curSrc", "@@curSrc@@"],["IMG", "TombstoneTokenBotRight_1", "activeSrc"],["IMG", "TombstoneTokenBotRight_1", "pageID", "GAME"],["IMG", "TombstoneTokenBotRight_1", "activeLayer", "map"],["IMG", "TombstoneTokenBotRight_1", "zIndex", 800],["IMG", "TombstoneTokenBotRight_1", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneTokenBotRight_1", "modes", "Inactive", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneTokenBotRight_1", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneTokenBotRight_1", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneTokenBotRight_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "TombstoneTokenBotRight_1", "modes", "Complications", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneTokenMidRight_1", "isActive", false],["IMG", "TombstoneTokenMidRight_1", "curSrc", "@@curSrc@@"],["IMG", "TombstoneTokenMidRight_1", "activeSrc"],["IMG", "TombstoneTokenMidRight_1", "pageID", "GAME"],["IMG", "TombstoneTokenMidRight_1", "activeLayer", "map"],["IMG", "TombstoneTokenMidRight_1", "zIndex", 800],["IMG", "TombstoneTokenMidRight_1", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneTokenMidRight_1", "modes", "Inactive", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneTokenMidRight_1", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneTokenMidRight_1", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneTokenMidRight_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "TombstoneTokenMidRight_1", "modes", "Complications", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneTokenTopLeft_1", "isActive", false],["IMG", "TombstoneTokenTopLeft_1", "curSrc", "@@curSrc@@"],["IMG", "TombstoneTokenTopLeft_1", "activeSrc"],["IMG", "TombstoneTokenTopLeft_1", "pageID", "GAME"],["IMG", "TombstoneTokenTopLeft_1", "activeLayer", "map"],["IMG", "TombstoneTokenTopLeft_1", "zIndex", 800],["IMG", "TombstoneTokenTopLeft_1", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneTokenTopLeft_1", "modes", "Inactive", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneTokenTopLeft_1", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneTokenTopLeft_1", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneTokenTopLeft_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "TombstoneTokenTopLeft_1", "modes", "Complications", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneTokenTopRight_1", "isActive", false],["IMG", "TombstoneTokenTopRight_1", "curSrc", "@@curSrc@@"],["IMG", "TombstoneTokenTopRight_1", "activeSrc"],["IMG", "TombstoneTokenTopRight_1", "pageID", "GAME"],["IMG", "TombstoneTokenTopRight_1", "activeLayer", "map"],["IMG", "TombstoneTokenTopRight_1", "zIndex", 800],["IMG", "TombstoneTokenTopRight_1", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneTokenTopRight_1", "modes", "Inactive", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneTokenTopRight_1", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneTokenTopRight_1", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneTokenTopRight_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "TombstoneTokenTopRight_1", "modes", "Complications", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneTopLeft_1", "isActive", false],["IMG", "TombstoneTopLeft_1", "curSrc", "@@curSrc@@"],["IMG", "TombstoneTopLeft_1", "activeSrc"],["IMG", "TombstoneTopLeft_1", "pageID", "GAME"],["IMG", "TombstoneTopLeft_1", "activeLayer", "map"],["IMG", "TombstoneTopLeft_1", "zIndex", 1070],["IMG", "TombstoneTopLeft_1", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneTopLeft_1", "modes", "Inactive", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneTopLeft_1", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneTopLeft_1", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneTopLeft_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "TombstoneTopLeft_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "TombstoneTopRight_1", "isActive", false],["IMG", "TombstoneTopRight_1", "curSrc", "@@curSrc@@"],["IMG", "TombstoneTopRight_1", "activeSrc"],["IMG", "TombstoneTopRight_1", "pageID", "GAME"],["IMG", "TombstoneTopRight_1", "activeLayer", "map"],["IMG", "TombstoneTopRight_1", "zIndex", 1070],["IMG", "TombstoneTopRight_1", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneTopRight_1", "modes", "Inactive", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneTopRight_1", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneTopRight_1", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "TombstoneTopRight_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "TombstoneTopRight_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "WeatherFog_1", "isActive", "@@curState@@"],["IMG", "WeatherFog_1", "curSrc", "@@curSrc@@"],["IMG", "WeatherFog_1", "activeSrc"],["IMG", "WeatherFog_1", "pageID", "GAME"],["IMG", "WeatherFog_1", "activeLayer", "map"],["IMG", "WeatherFog_1", "zIndex", 1250],["IMG", "WeatherFog_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": true, "lastState": "@@curSrc@@"}],["IMG", "WeatherFog_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "WeatherFog_1", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "WeatherFog_1", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "WeatherFog_1", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "WeatherFog_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "WeatherFrost_1", "isActive", "@@curState@@"],["IMG", "WeatherFrost_1", "curSrc", "@@curSrc@@"],["IMG", "WeatherFrost_1", "activeSrc"],["IMG", "WeatherFrost_1", "pageID", "GAME"],["IMG", "WeatherFrost_1", "activeLayer", "map"],["IMG", "WeatherFrost_1", "zIndex", 1390],["IMG", "WeatherFrost_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": true, "lastState": "@@curSrc@@"}],["IMG", "WeatherFrost_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "WeatherFrost_1", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "WeatherFrost_1", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "WeatherFrost_1", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "WeatherFrost_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "WeatherGround_1", "isActive", "@@curState@@"],["IMG", "WeatherGround_1", "curSrc", "@@curSrc@@"],["IMG", "WeatherGround_1", "activeSrc"],["IMG", "WeatherGround_1", "pageID", "GAME"],["IMG", "WeatherGround_1", "activeLayer", "map"],["IMG", "WeatherGround_1", "zIndex", 1190],["IMG", "WeatherGround_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": true, "lastState": "@@curSrc@@"}],["IMG", "WeatherGround_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "WeatherGround_1", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "WeatherGround_1", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "WeatherGround_1", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "WeatherGround_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "WeatherLightning_1", "isActive", false],["IMG", "WeatherLightning_1", "curSrc", null],["IMG", "WeatherLightning_1", "activeSrc"],["IMG", "WeatherLightning_1", "pageID", "GAME"],["IMG", "WeatherLightning_1", "activeLayer", "map"],["IMG", "WeatherLightning_1", "zIndex", 500],["IMG", "WeatherLightning_1", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "WeatherLightning_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "WeatherLightning_1", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "WeatherLightning_1", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "WeatherLightning_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "WeatherLightning_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "WeatherLightning_2", "isActive", false],["IMG", "WeatherLightning_2", "curSrc", null],["IMG", "WeatherLightning_2", "activeSrc"],["IMG", "WeatherLightning_2", "pageID", "GAME"],["IMG", "WeatherLightning_2", "activeLayer", "map"],["IMG", "WeatherLightning_2", "zIndex", 500],["IMG", "WeatherLightning_2", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "WeatherLightning_2", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "WeatherLightning_2", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "WeatherLightning_2", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "WeatherLightning_2", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "WeatherLightning_2", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "WeatherMain_1", "isActive", "@@curState@@"],["IMG", "WeatherMain_1", "curSrc", "@@curSrc@@"],["IMG", "WeatherMain_1", "activeSrc"],["IMG", "WeatherMain_1", "pageID", "GAME"],["IMG", "WeatherMain_1", "activeLayer", "map"],["IMG", "WeatherMain_1", "zIndex", 1240],["IMG", "WeatherMain_1", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": true, "lastState": "@@curSrc@@"}],["IMG", "WeatherMain_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "WeatherMain_1", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "WeatherMain_1", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "WeatherMain_1", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["IMG", "WeatherMain_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "AvaDesire", "isActive", true],["TEXT", "AvaDesire", "pageID", "GAME"],["TEXT", "AvaDesire", "activeLayer", "map"],["TEXT", "AvaDesire", "zIndex", 4310],["TEXT", "AvaDesire", "modes", "Active", {"isForcedOn": true, "isForcedState": null, "lastState": null}],["TEXT", "AvaDesire", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "AvaDesire", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "AvaDesire", "modes", "Downtime", {"isForcedOn": true, "isForcedState": null, "lastState": null}],["TEXT", "AvaDesire", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["TEXT", "AvaDesire", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "BacchusDesire", "isActive", true],["TEXT", "BacchusDesire", "pageID", "GAME"],["TEXT", "BacchusDesire", "activeLayer", "map"],["TEXT", "BacchusDesire", "zIndex", 4320],["TEXT", "BacchusDesire", "modes", "Active", {"isForcedOn": true, "isForcedState": null, "lastState": null}],["TEXT", "BacchusDesire", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "BacchusDesire", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "BacchusDesire", "modes", "Downtime", {"isForcedOn": true, "isForcedState": null, "lastState": null}],["TEXT", "BacchusDesire", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["TEXT", "BacchusDesire", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "CompCardsDiscarded", "isActive", false],["TEXT", "CompCardsDiscarded", "pageID", "GAME"],["TEXT", "CompCardsDiscarded", "activeLayer", "map"],["TEXT", "CompCardsDiscarded", "zIndex", 7060],["TEXT", "CompCardsDiscarded", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCardsDiscarded", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "CompCardsDiscarded", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCardsDiscarded", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCardsDiscarded", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCardsDiscarded", "modes", "Complications", {"isForcedOn": true, "isForcedState": true, "lastState": "@@curText@@"}],["TEXT", "CompCardsExcluded", "isActive", false],["TEXT", "CompCardsExcluded", "pageID", "GAME"],["TEXT", "CompCardsExcluded", "activeLayer", "map"],["TEXT", "CompCardsExcluded", "zIndex", 7060],["TEXT", "CompCardsExcluded", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCardsExcluded", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "CompCardsExcluded", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCardsExcluded", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCardsExcluded", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCardsExcluded", "modes", "Complications", {"isForcedOn": true, "isForcedState": true, "lastState": "@@curText@@"}],["TEXT", "CompCardsRemaining", "isActive", false],["TEXT", "CompCardsRemaining", "pageID", "GAME"],["TEXT", "CompCardsRemaining", "activeLayer", "map"],["TEXT", "CompCardsRemaining", "zIndex", 7060],["TEXT", "CompCardsRemaining", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCardsRemaining", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "CompCardsRemaining", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCardsRemaining", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCardsRemaining", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCardsRemaining", "modes", "Complications", {"isForcedOn": true, "isForcedState": true, "lastState": "@@curText@@"}],
        ["TEXT", "CompCurrent", "isActive", false],["TEXT", "CompCurrent", "pageID", "GAME"],["TEXT", "CompCurrent", "activeLayer", "map"],["TEXT", "CompCurrent", "zIndex", 7060],["TEXT", "CompCurrent", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCurrent", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "CompCurrent", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCurrent", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCurrent", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompCurrent", "modes", "Complications", {"isForcedOn": true, "isForcedState": true, "lastState": "@@curText@@"}],["TEXT", "CompRemaining", "isActive", false],["TEXT", "CompRemaining", "pageID", "GAME"],["TEXT", "CompRemaining", "activeLayer", "map"],["TEXT", "CompRemaining", "zIndex", 7060],["TEXT", "CompRemaining", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompRemaining", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "CompRemaining", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompRemaining", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompRemaining", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompRemaining", "modes", "Complications", {"isForcedOn": true, "isForcedState": true, "lastState": "@@curText@@"}],["TEXT", "CompTarget", "isActive", false],["TEXT", "CompTarget", "pageID", "GAME"],["TEXT", "CompTarget", "activeLayer", "map"],["TEXT", "CompTarget", "zIndex", 7060],["TEXT", "CompTarget", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompTarget", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "CompTarget", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompTarget", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompTarget", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "CompTarget", "modes", "Complications", {"isForcedOn": true, "isForcedState": true, "lastState": "@@curText@@"}],["TEXT", "dicePool", "isActive", false],["TEXT", "dicePool", "pageID", "GAME"],["TEXT", "dicePool", "activeLayer", "map"],["TEXT", "dicePool", "zIndex", 4360],["TEXT", "dicePool", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "dicePool", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "dicePool", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "dicePool", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "dicePool", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "dicePool", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "difficulty", "isActive", false],["TEXT", "difficulty", "pageID", "GAME"],["TEXT", "difficulty", "activeLayer", "map"],["TEXT", "difficulty", "zIndex", 4370],["TEXT", "difficulty", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "difficulty", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "difficulty", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "difficulty", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "difficulty", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "difficulty", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "goldMods", "isActive", false],["TEXT", "goldMods", "pageID", "GAME"],["TEXT", "goldMods", "activeLayer", "map"],["TEXT", "goldMods", "zIndex", 4380],["TEXT", "goldMods", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "goldMods", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "goldMods", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "goldMods", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "goldMods", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "goldMods", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "HubAspectsNotice", "isActive", false],["TEXT", "HubAspectsNotice", "pageID", "GAME"],["TEXT", "HubAspectsNotice", "activeLayer", "map"],["TEXT", "HubAspectsNotice", "zIndex", 4309],["TEXT", "HubAspectsNotice", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "HubAspectsNotice", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "HubAspectsNotice", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "HubAspectsNotice", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": null, "lastActive": false, "lastState": null}],["TEXT", "HubAspectsNotice", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "HubAspectsNotice", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "HubAspectsTitle", "isActive", false],["TEXT", "HubAspectsTitle", "pageID", "GAME"],["TEXT", "HubAspectsTitle", "activeLayer", "map"],["TEXT", "HubAspectsTitle", "zIndex", 4309],["TEXT", "HubAspectsTitle", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "HubAspectsTitle", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "HubAspectsTitle", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "HubAspectsTitle", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": null, "lastActive": false, "lastState": null}],["TEXT", "HubAspectsTitle", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "HubAspectsTitle", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "LockeDesire", "isActive", true],["TEXT", "LockeDesire", "pageID", "GAME"],["TEXT", "LockeDesire", "activeLayer", "map"],["TEXT", "LockeDesire", "zIndex", 4330],["TEXT", "LockeDesire", "modes", "Active", {"isForcedOn": true, "isForcedState": null, "lastState": null}],["TEXT", "LockeDesire", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "LockeDesire", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "LockeDesire", "modes", "Downtime", {"isForcedOn": true, "isForcedState": null, "lastState": null}],["TEXT", "LockeDesire", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["TEXT", "LockeDesire", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "mainRoll", "isActive", false],["TEXT", "mainRoll", "pageID", "GAME"],["TEXT", "mainRoll", "activeLayer", "map"],["TEXT", "mainRoll", "zIndex", 4390],["TEXT", "mainRoll", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "mainRoll", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "mainRoll", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "mainRoll", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "mainRoll", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "mainRoll", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "margin", "isActive", false],["TEXT", "margin", "pageID", "GAME"],["TEXT", "margin", "activeLayer", "map"],["TEXT", "margin", "zIndex", 4400],["TEXT", "margin", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "margin", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "margin", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "margin", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "margin", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "margin", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "NapierDesire", "isActive", true],["TEXT", "NapierDesire", "pageID", "GAME"],["TEXT", "NapierDesire", "activeLayer", "map"],["TEXT", "NapierDesire", "zIndex", 4340],["TEXT", "NapierDesire", "modes", "Active", {"isForcedOn": true, "isForcedState": null, "lastState": null}],["TEXT", "NapierDesire", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "NapierDesire", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "NapierDesire", "modes", "Downtime", {"isForcedOn": true, "isForcedState": null, "lastState": null}],["TEXT", "NapierDesire", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["TEXT", "NapierDesire", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "negMods", "isActive", false],["TEXT", "negMods", "pageID", "GAME"],["TEXT", "negMods", "activeLayer", "map"],["TEXT", "negMods", "zIndex", 4410],["TEXT", "negMods", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "negMods", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "negMods", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "negMods", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "negMods", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "negMods", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "outcome", "isActive", false],["TEXT", "outcome", "pageID", "GAME"],["TEXT", "outcome", "activeLayer", "map"],["TEXT", "outcome", "zIndex", 4420],["TEXT", "outcome", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "outcome", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "outcome", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "outcome", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "outcome", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "outcome", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "posMods", "isActive", false],["TEXT", "posMods", "pageID", "GAME"],["TEXT", "posMods", "activeLayer", "map"],["TEXT", "posMods", "zIndex", 4430],["TEXT", "posMods", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "posMods", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "posMods", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "posMods", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "posMods", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "posMods", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "redMods", "isActive", false],["TEXT", "redMods", "pageID", "GAME"],["TEXT", "redMods", "activeLayer", "map"],["TEXT", "redMods", "zIndex", 4440],["TEXT", "redMods", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "redMods", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "redMods", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "redMods", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "redMods", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "redMods", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "resultCount", "isActive", false],["TEXT", "resultCount", "pageID", "GAME"],["TEXT", "resultCount", "activeLayer", "map"],["TEXT", "resultCount", "zIndex", 4450],["TEXT", "resultCount", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "resultCount", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "resultCount", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "resultCount", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "resultCount", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "resultCount", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "rollerName", "isActive", false],["TEXT", "rollerName", "pageID", "GAME"],["TEXT", "rollerName", "activeLayer", "map"],["TEXT", "rollerName", "zIndex", 4460],["TEXT", "rollerName", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "rollerName", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "rollerName", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "rollerName", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "rollerName", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "rollerName", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "RoyDesire", "isActive", true],["TEXT", "RoyDesire", "pageID", "GAME"],["TEXT", "RoyDesire", "activeLayer", "map"],["TEXT", "RoyDesire", "zIndex", 4350],["TEXT", "RoyDesire", "modes", "Active", {"isForcedOn": true, "isForcedState": null, "lastState": null}],["TEXT", "RoyDesire", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "RoyDesire", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "RoyDesire", "modes", "Downtime", {"isForcedOn": true, "isForcedState": null, "lastState": null}],["TEXT", "RoyDesire", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["TEXT", "RoyDesire", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "SiteGenericCenterAspect", "isActive", "@@curState@@"],["TEXT", "SiteGenericCenterAspect", "pageID", "GAME"],["TEXT", "SiteGenericCenterAspect", "activeLayer", "map"],["TEXT", "SiteGenericCenterAspect", "zIndex", 2060],["TEXT", "SiteGenericCenterAspect", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteGenericCenterAspect", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "SiteGenericCenterAspect", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteGenericCenterAspect", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteGenericCenterAspect", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteGenericCenterAspect", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "SiteGenericCenterRes", "isActive", "@@curState@@"],["TEXT", "SiteGenericCenterRes", "pageID", "GAME"],["TEXT", "SiteGenericCenterRes", "activeLayer", "map"],["TEXT", "SiteGenericCenterRes", "zIndex", 2060],["TEXT", "SiteGenericCenterRes", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteGenericCenterRes", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "SiteGenericCenterRes", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteGenericCenterRes", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteGenericCenterRes", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteGenericCenterRes", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "SiteGenericCenterSong", "isActive", "@@curState@@"],["TEXT", "SiteGenericCenterSong", "pageID", "GAME"],["TEXT", "SiteGenericCenterSong", "activeLayer", "map"],["TEXT", "SiteGenericCenterSong", "zIndex", 2060],["TEXT", "SiteGenericCenterSong", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteGenericCenterSong", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "SiteGenericCenterSong", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteGenericCenterSong", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteGenericCenterSong", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteGenericCenterSong", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "SiteGenericLeftAspect", "isActive", "@@curState@@"],["TEXT", "SiteGenericLeftAspect", "pageID", "GAME"],["TEXT", "SiteGenericLeftAspect", "activeLayer", "map"],["TEXT", "SiteGenericLeftAspect", "zIndex", 1700],["TEXT", "SiteGenericLeftAspect", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteGenericLeftAspect", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "SiteGenericLeftAspect", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteGenericLeftAspect", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteGenericLeftAspect", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteGenericLeftAspect", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "SiteGenericLeftRes", "isActive", "@@curState@@"],["TEXT", "SiteGenericLeftRes", "pageID", "GAME"],["TEXT", "SiteGenericLeftRes", "activeLayer", "map"],["TEXT", "SiteGenericLeftRes", "zIndex", 1700],["TEXT", "SiteGenericLeftRes", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteGenericLeftRes", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "SiteGenericLeftRes", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteGenericLeftRes", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteGenericLeftRes", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteGenericLeftRes", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "SiteGenericLeftSong", "isActive", "@@curState@@"],["TEXT", "SiteGenericLeftSong", "pageID", "GAME"],["TEXT", "SiteGenericLeftSong", "activeLayer", "map"],["TEXT", "SiteGenericLeftSong", "zIndex", 1700],["TEXT", "SiteGenericLeftSong", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteGenericLeftSong", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "SiteGenericLeftSong", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteGenericLeftSong", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteGenericLeftSong", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteGenericLeftSong", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "SiteGenericRightAspect", "isActive", "@@curState@@"],["TEXT", "SiteGenericRightAspect", "pageID", "GAME"],["TEXT", "SiteGenericRightAspect", "activeLayer", "map"],["TEXT", "SiteGenericRightAspect", "zIndex", 1700],["TEXT", "SiteGenericRightAspect", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteGenericRightAspect", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "SiteGenericRightAspect", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteGenericRightAspect", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteGenericRightAspect", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteGenericRightAspect", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "SiteGenericRightRes", "isActive", "@@curState@@"],["TEXT", "SiteGenericRightRes", "pageID", "GAME"],["TEXT", "SiteGenericRightRes", "activeLayer", "map"],["TEXT", "SiteGenericRightRes", "zIndex", 1700],["TEXT", "SiteGenericRightRes", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteGenericRightRes", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "SiteGenericRightRes", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteGenericRightRes", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteGenericRightRes", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteGenericRightRes", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "SiteGenericRightSong", "isActive", "@@curState@@"],["TEXT", "SiteGenericRightSong", "pageID", "GAME"],["TEXT", "SiteGenericRightSong", "activeLayer", "map"],["TEXT", "SiteGenericRightSong", "zIndex", 1700],["TEXT", "SiteGenericRightSong", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteGenericRightSong", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "SiteGenericRightSong", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteGenericRightSong", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteGenericRightSong", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteGenericRightSong", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "SiteNameCenter", "isActive", "@@curState@@"],["TEXT", "SiteNameCenter", "pageID", "GAME"],["TEXT", "SiteNameCenter", "activeLayer", "map"],["TEXT", "SiteNameCenter", "zIndex", 2040],["TEXT", "SiteNameCenter", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteNameCenter", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "SiteNameCenter", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteNameCenter", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteNameCenter", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteNameCenter", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "SiteNameLeft", "isActive", "@@curState@@"],["TEXT", "SiteNameLeft", "pageID", "GAME"],["TEXT", "SiteNameLeft", "activeLayer", "map"],["TEXT", "SiteNameLeft", "zIndex", 1700],["TEXT", "SiteNameLeft", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteNameLeft", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "SiteNameLeft", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteNameLeft", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteNameLeft", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteNameLeft", "modes", "Complications", {"isForcedOn": null, "lastState": null}],
        ["TEXT", "SiteNameRight", "isActive", "@@curState@@"],["TEXT", "SiteNameRight", "pageID", "GAME"],["TEXT", "SiteNameRight", "activeLayer", "map"],["TEXT", "SiteNameRight", "zIndex", 1700],["TEXT", "SiteNameRight", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteNameRight", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "SiteNameRight", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteNameRight", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteNameRight", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "SiteNameRight", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "subOutcome", "isActive", false],["TEXT", "subOutcome", "pageID", "GAME"],["TEXT", "subOutcome", "activeLayer", "map"],["TEXT", "subOutcome", "zIndex", 4470],["TEXT", "subOutcome", "modes", "Active", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "subOutcome", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "subOutcome", "modes", "Daylighter", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "subOutcome", "modes", "Downtime", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "subOutcome", "modes", "Spotlight", {"isForcedOn": "LAST", "isForcedState": true, "lastActive": false, "lastState": "@@curText@@"}],["TEXT", "subOutcome", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "tempC", "isActive", true],["TEXT", "tempC", "pageID", "GAME"],["TEXT", "tempC", "activeLayer", "map"],["TEXT", "tempC", "zIndex", 4480],["TEXT", "tempC", "modes", "Active", {"isForcedOn": true, "isForcedState": true, "lastState": "@@curText@@"}],["TEXT", "tempC", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "tempC", "modes", "Daylighter", {"isForcedOn": true, "isForcedState": true, "lastState": "@@curText@@"}],["TEXT", "tempC", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "tempC", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "tempC", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "tempF", "isActive", true],["TEXT", "tempF", "pageID", "GAME"],["TEXT", "tempF", "activeLayer", "map"],["TEXT", "tempF", "zIndex", 4490],["TEXT", "tempF", "modes", "Active", {"isForcedOn": true, "isForcedState": true, "lastState": "@@curText@@"}],["TEXT", "tempF", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "tempF", "modes", "Daylighter", {"isForcedOn": true, "isForcedState": true, "lastState": "@@curText@@"}],["TEXT", "tempF", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "tempF", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "tempF", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "TimeTracker", "isActive", true],["TEXT", "TimeTracker", "pageID", "GAME"],["TEXT", "TimeTracker", "activeLayer", "map"],["TEXT", "TimeTracker", "zIndex", 4500],["TEXT", "TimeTracker", "modes", "Active", {"isForcedOn": true, "isForcedState": true, "lastState": "@@curText@@"}],["TEXT", "TimeTracker", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "TimeTracker", "modes", "Daylighter", {"isForcedOn": true, "isForcedState": true, "lastState": "@@curText@@"}],["TEXT", "TimeTracker", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "TimeTracker", "modes", "Spotlight", {"isForcedOn": true, "isForcedState": true, "lastState": "@@curText@@"}],["TEXT", "TimeTracker", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "TombstoneNameBotLeft", "isActive", false],["TEXT", "TombstoneNameBotLeft", "pageID", "GAME"],["TEXT", "TombstoneNameBotLeft", "activeLayer", "map"],["TEXT", "TombstoneNameBotLeft", "zIndex", 1150],["TEXT", "TombstoneNameBotLeft", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "TombstoneNameBotLeft", "modes", "Inactive", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "TombstoneNameBotLeft", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "TombstoneNameBotLeft", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "TombstoneNameBotLeft", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["TEXT", "TombstoneNameBotLeft", "modes", "Complications", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "TombstoneNameBotRight", "isActive", false],["TEXT", "TombstoneNameBotRight", "pageID", "GAME"],["TEXT", "TombstoneNameBotRight", "activeLayer", "map"],["TEXT", "TombstoneNameBotRight", "zIndex", 1150],["TEXT", "TombstoneNameBotRight", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "TombstoneNameBotRight", "modes", "Inactive", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "TombstoneNameBotRight", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "TombstoneNameBotRight", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "TombstoneNameBotRight", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["TEXT", "TombstoneNameBotRight", "modes", "Complications", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "TombstoneNameMidRight", "isActive", false],["TEXT", "TombstoneNameMidRight", "pageID", "GAME"],["TEXT", "TombstoneNameMidRight", "activeLayer", "map"],["TEXT", "TombstoneNameMidRight", "zIndex", 1150],["TEXT", "TombstoneNameMidRight", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "TombstoneNameMidRight", "modes", "Inactive", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "TombstoneNameMidRight", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "TombstoneNameMidRight", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "TombstoneNameMidRight", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["TEXT", "TombstoneNameMidRight", "modes", "Complications", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "TombstoneNameTopLeft", "isActive", false],["TEXT", "TombstoneNameTopLeft", "pageID", "GAME"],["TEXT", "TombstoneNameTopLeft", "activeLayer", "map"],["TEXT", "TombstoneNameTopLeft", "zIndex", 1150],["TEXT", "TombstoneNameTopLeft", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "TombstoneNameTopLeft", "modes", "Inactive", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "TombstoneNameTopLeft", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "TombstoneNameTopLeft", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "TombstoneNameTopLeft", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["TEXT", "TombstoneNameTopLeft", "modes", "Complications", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "TombstoneNameTopRight", "isActive", false],["TEXT", "TombstoneNameTopRight", "pageID", "GAME"],["TEXT", "TombstoneNameTopRight", "activeLayer", "map"],["TEXT", "TombstoneNameTopRight", "zIndex", 1150],["TEXT", "TombstoneNameTopRight", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "TombstoneNameTopRight", "modes", "Inactive", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "TombstoneNameTopRight", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "TombstoneNameTopRight", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "TombstoneNameTopRight", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["TEXT", "TombstoneNameTopRight", "modes", "Complications", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "weather", "isActive", true],["TEXT", "weather", "pageID", "GAME"],["TEXT", "weather", "activeLayer", "map"],["TEXT", "weather", "zIndex", 4510],["TEXT", "weather", "modes", "Active", {"isForcedOn": true, "isForcedState": true, "lastState": "@@curText@@"}],["TEXT", "weather", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "weather", "modes", "Daylighter", {"isForcedOn": true, "isForcedState": true, "lastState": "@@curText@@"}],["TEXT", "weather", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "weather", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "weather", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "Weekly_Char_Col1", "isActive", false],["TEXT", "Weekly_Char_Col1", "pageID", "GAME"],["TEXT", "Weekly_Char_Col1", "activeLayer", "map"],["TEXT", "Weekly_Char_Col1", "zIndex", 4280],["TEXT", "Weekly_Char_Col1", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "Weekly_Char_Col1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "Weekly_Char_Col1", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "Weekly_Char_Col1", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "Weekly_Char_Col1", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "Weekly_Char_Col1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "Weekly_Char_Col2", "isActive", false],["TEXT", "Weekly_Char_Col2", "pageID", "GAME"],["TEXT", "Weekly_Char_Col2", "activeLayer", "map"],["TEXT", "Weekly_Char_Col2", "zIndex", 4290],["TEXT", "Weekly_Char_Col2", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "Weekly_Char_Col2", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "Weekly_Char_Col2", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "Weekly_Char_Col2", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "Weekly_Char_Col2", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "Weekly_Char_Col2", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "Weekly_Char_Col3", "isActive", false],["TEXT", "Weekly_Char_Col3", "pageID", "GAME"],["TEXT", "Weekly_Char_Col3", "activeLayer", "map"],["TEXT", "Weekly_Char_Col3", "zIndex", 4300],["TEXT", "Weekly_Char_Col3", "modes", "Active", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "Weekly_Char_Col3", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "Weekly_Char_Col3", "modes", "Daylighter", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "Weekly_Char_Col3", "modes", "Downtime", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "Weekly_Char_Col3", "modes", "Spotlight", {"isForcedOn": "NEVER", "lastState": null}],["TEXT", "Weekly_Char_Col3", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "LoadingMoon", "isActive", null],["IMG", "LoadingMoon", "curSrc", null],["IMG", "LoadingMoon", "activeSrc"],["IMG", "LoadingMoon", "pageID", "GAME"],["IMG", "LoadingMoon", "activeLayer", "objects"],["IMG", "LoadingMoon", "zIndex", 9990],["IMG", "LoadingMoon", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "LoadingMoon", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "LoadingMoon", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "LoadingMoon", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "LoadingMoon", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "LoadingMoon", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "LoadingProgressMatte_1", "isActive", null],["IMG", "LoadingProgressMatte_1", "curSrc", "base"],["IMG", "LoadingProgressMatte_1", "activeSrc", "base"],["IMG", "LoadingProgressMatte_1", "pageID", "GAME"],["IMG", "LoadingProgressMatte_1", "activeLayer", "objects"],["IMG", "LoadingProgressMatte_1", "zIndex", 9900],["IMG", "LoadingProgressMatte_1", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "LoadingProgressMatte_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "LoadingProgressMatte_1", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "LoadingProgressMatte_1", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "LoadingProgressMatte_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "LoadingProgressMatte_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["IMG", "LoadingScreen_1", "isActive", null],["IMG", "LoadingScreen_1", "curSrc", "initializing"],["IMG", "LoadingScreen_1", "activeSrc", "initializing"],["IMG", "LoadingScreen_1", "pageID", "GAME"],["IMG", "LoadingScreen_1", "activeLayer", "objects"],["IMG", "LoadingScreen_1", "zIndex", 10000],["IMG", "LoadingScreen_1", "modes", "Active", {"isForcedOn": null, "lastState": null}],["IMG", "LoadingScreen_1", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["IMG", "LoadingScreen_1", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["IMG", "LoadingScreen_1", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["IMG", "LoadingScreen_1", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["IMG", "LoadingScreen_1", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "LoadingMessage", "isActive", null],["TEXT", "LoadingMessage", "pageID", "GAME"],["TEXT", "LoadingMessage", "activeLayer", "objects"],["TEXT", "LoadingMessage", "zIndex", 10010],["TEXT", "LoadingMessage", "modes", "Active", {"isForcedOn": null, "lastState": null}],["TEXT", "LoadingMessage", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "LoadingMessage", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["TEXT", "LoadingMessage", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["TEXT", "LoadingMessage", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["TEXT", "LoadingMessage", "modes", "Complications", {"isForcedOn": null, "lastState": null}],["TEXT", "LoadingProgressBar", "isActive", null],["TEXT", "LoadingProgressBar", "pageID", "GAME"],["TEXT", "LoadingProgressBar", "activeLayer", "objects"],["TEXT", "LoadingProgressBar", "zIndex", 9950],["TEXT", "LoadingProgressBar", "modes", "Active", {"isForcedOn": null, "lastState": null}],["TEXT", "LoadingProgressBar", "modes", "Inactive", {"isForcedOn": null, "lastState": null}],["TEXT", "LoadingProgressBar", "modes", "Daylighter", {"isForcedOn": null, "lastState": null}],["TEXT", "LoadingProgressBar", "modes", "Downtime", {"isForcedOn": null, "lastState": null}],["TEXT", "LoadingProgressBar", "modes", "Spotlight", {"isForcedOn": null, "lastState": null}],["TEXT", "LoadingProgressBar", "modes", "Complications", {"isForcedOn": null, "lastState": null}]
    ]`;
    // #region CONFIGURATION
    const REGISTRY = {
        get IMG() {
            return STATE.REF.imgregistry;
        },
        get TEXT() {
            return STATE.REF.textregistry;
        },
        get ANIM() {
            return STATE.REF.animregistry;
        },
        get ID() {
            return STATE.REF.idregistry;
        },
        get TOKEN() {
            return STATE.REF.tokenregistry;
        },
        get AREA() {
            return STATE.REF.areas;
        },
        get GRAPHIC() {
            return Object.assign({}, STATE.REF.animregistry, STATE.REF.imgregistry);
        },
        get ALL() {
            return Object.assign({}, STATE.REF.animregistry, STATE.REF.textregistry, STATE.REF.imgregistry);
        },
        get PANELS() {
            return STATE.REF.panelLog;
        }
    };
    const LAST = {
        Media: {},
        Img: {},
        Text: {},
        Anim: {},
        Area: {},
        Tokens: [],
        get Token() {
            return this.Tokens[0] || {};
        }
    };
    const BGIMGS = {
        top: C.SANDBOX.top,
        left: C.SANDBOX.left,
        height: C.SANDBOX.height,
        width: C.SANDBOX.width,
        keys: ["Horizon", "Foreground", "LoadingScreen", "WeatherGround", "WeatherMain", "WeatherFog", "WeatherFrost", "Spotlight"]
    };
    const MAPIMGS = {
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
    };
    const DEFAULTZINDICES = {
        dragpad: 900,
        token: 950
    };
    const DEFAULTTOKENDATA = {
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
    };
    // #endregion

    // #region GENERAL MEDIA OBJECT GETTERS:
    const isRegistered = (mediaRef) => {
        if (mediaRef === null)
            return Boolean(LAST.Media.key);
        return isRegText(mediaRef) || isRegImg(mediaRef) || isRegAnim(mediaRef);
    };
    const getMediaObj = (mediaRef) => {
        if (mediaRef === null)
            return LAST.Media.obj || false;
        const traceID = TRACEON("getMediaObj", [mediaRef]);
        if (VAL({object: mediaRef}))
            return TRACEOFF(traceID, mediaRef);
        if (isRegText(mediaRef)) {
            return TRACEOFF(traceID, getTextObj(mediaRef));
        } else if (isRegImg(mediaRef)) {
            return TRACEOFF(traceID, getImgObj(mediaRef));
        } else if (VAL({string: mediaRef})) {
            const imgObj = getObj("graphic", mediaRef);
            if (VAL({imgObj}))
                return TRACEOFF(traceID, imgObj);
            const textObj = getObj("text", mediaRef);
            if (VAL({textObj}))
                return TRACEOFF(traceID, textObj);
        }
        return TRACEOFF(traceID, mediaRef);
    };
    const getMediaKey = (mediaRef, funcName = false) => {
        if (mediaRef === null)
            return LAST.Media.key || false;
        const traceID = TRACEON("getMediaKey", [mediaRef, funcName]);
        if (mediaRef === null)
            return LAST.Media.key;
        if (isRegText(mediaRef))
            return TRACEOFF(traceID, getTextKey(mediaRef, funcName));
        return TRACEOFF(traceID, getImgKey(mediaRef, funcName));
    };
    const getMediaData = (mediaRef) => {
        if (mediaRef === null)
            return LAST.Media.data || false;
        const traceID = TRACEON("getMediaData", [mediaRef]);
        if (isRegText(mediaRef))
            return TRACEOFF(traceID, getTextData(mediaRef));
        return TRACEOFF(traceID, getImgData(mediaRef));
    };
    const getRegistryRef = (mediaRef) => {
        if (mediaRef === null)
            return (
                {
                    graphic: REGISTRY.GRAPHIC,
                    text: REGISTRY.TEXT,
                    image: REGISTRY.IMG,
                    anim: REGISTRY.ANIM,
                    token: REGISTRY.TOKEN
                }[D.LCase(LAST.Media.type)] || {}
            );
        const traceID = TRACEON("getRegistryRef", [mediaRef]);
        if (isRegText(mediaRef))
            return TRACEOFF(traceID, REGISTRY.TEXT);
        if (isRegAnim(mediaRef))
            return TRACEOFF(traceID, REGISTRY.ANIM);
        if (isRegToken(mediaRef))
            return TRACEOFF(traceID, REGISTRY.TOKEN);
        if (isRegImg(mediaRef))
            return TRACEOFF(traceID, REGISTRY.IMG);
        DB(`Unable to find registry reference for ${D.JSL(mediaRef)}!`, "getRegistryRef");
        return TRACEOFF(traceID, {});
    };
    const getModeData = (mediaRef, mode) => {
        const traceID = TRACEON("getModeData", [mediaRef, mode]);
        mode = mode || Session.Mode;
        const mediaData = getMediaData(mediaRef);
        if (VAL({list: [mediaData, mediaData.modes]}, "getModeData", true))
            return TRACEOFF(traceID, mediaData.modes[mode]);
        return TRACEOFF(traceID, THROW(`Invalid Media Reference: ${D.JSL(mediaRef)}`, "getModeData"));
    };
    const hasForcedState = (mediaRef) => {
        const traceID = TRACEON("hasForcedState", [mediaRef]);
        const mediaData = getModeData(mediaRef, Session.Mode);
        if (VAL({list: mediaData}, "hasForcedState"))
            return TRACEOFF(traceID, VAL({string: mediaData.isForcedState}) && mediaData.isForcedState !== "LAST");
        return TRACEOFF(traceID, THROW(`Invalid Media Reference: ${D.JSL(mediaRef)}`, "hasForcedState"));
    };
    const getModeStatus = (mediaRef) => {
        const traceID = TRACEON("getModeStatus", [mediaRef]);
        const modeStatus = {};
        if (isRegistered(mediaRef)) {
            const mediaData = getMediaData(mediaRef);
            if (VAL({list: mediaData}, "getModeStatus")) {
                const mediaModes = mediaData.modes && _.clone(mediaData.modes[Session.Mode]);
                if (VAL({list: mediaModes}, "getModeStatus")) {
                    if (mediaModes.isForcedOn === "LAST")
                        modeStatus.isActive = mediaModes.lastActive;
                    else if (mediaModes.isForcedOn === "NEVER")
                        modeStatus.isActive = false;
                    else if (mediaModes.isForcedOn === true || mediaModes.isForcedOn === false)
                        modeStatus.isActive = mediaModes.isForcedOn;
                    else
                        modeStatus.isActive = mediaData.isActive;
                    if (mediaModes.isForcedState === true || mediaModes.isForcedState === "LAST")
                        modeStatus.state = mediaModes.lastState;
                    else if (mediaModes.isForcedState === null)
                        modeStatus.state = undefined;
                    else
                        modeStatus.state = mediaModes.isForcedState;
                    return TRACEOFF(traceID, modeStatus);
                }
            }
        }
        return TRACEOFF(traceID, THROW(`Invalid Media Reference: ${D.JSL(mediaRef)}`, "getModeStatus"));
    };
    const getActiveLayer = (mediaRef) => {
        const traceID = TRACEON("getActiveLayer", [mediaRef]);
        const mediaData = getMediaData(mediaRef);
        if (VAL({list: mediaData}, "getActiveLayer"))
            return TRACEOFF(traceID, mediaData.activeLayer);
        return TRACEOFF(traceID, THROW(`Invalid Media Reference: ${D.JSL(mediaRef)}`, "getActiveLayer"));
    };
    // #endregion

    // #region GENERAL MEDIA OBJECT SETTERS:
    const fixAll = (isKilling = false) => {
        const traceID = TRACEON("fixAll", [isKilling]);
        const [isTesting, currentMode] = [Session.IsTesting, Session.Mode];

        if (currentMode === "Active") {
            if (!isTesting)
                Session.ToggleTesting(true);
            STATE.REF.fixAllCommands = [];
            Media.ToggleLoadingScreen("initializing", null, {duration: 120, numTicks: 30});
            D.Queue(Media.SetLoadingMessage, ["Initializing Media Assets!"], "Media", 3);
            D.Queue(Roller.Kill, [], "Media", 0.5);
            D.Queue(Media.SetLoadingMessage, ["[1/17] Purging Dice Roller..."], "Media", 2);
            D.Queue(Media.SetLoadingMessage, ["[2/17] Rebuilding Dice Roller..."], "Media", 0.1);
            D.Queue(Roller.Init, [false], "Media", 10);
            D.Queue(Media.SetLoadingMessage, ["[3/17] Reconfiguring Mode Data..."], "Media", 0.1);
            D.Queue(resetModeData, [true, true, false, true], "Media", 15);
            D.Queue(Media.SetLoadingMessage, ["[4/17] Checking for Missing Image Objects..."], "Media", 0.1);
            D.Queue(clearMissingRegImgs, [], "Media");
            D.Queue(Media.SetLoadingMessage, ["[5/17] Checking for Missing Text Objects..."], "Media", 0.1);
            D.Queue(clearMissingRegText, [], "Media");
            D.Queue(Media.SetLoadingMessage, ["[6/17] Checking for Orphaned Image Objects..."], "Media", 0.1);
            D.Queue(clearUnregImgs, [isKilling], "Media");
            D.Queue(Media.SetLoadingMessage, ["[7/17] Checking for Orphaned Text Objects..."], "Media", 0.1);
            D.Queue(clearUnregText, [isKilling], "Media");
            D.Queue(Media.SetLoadingMessage, ["[8/17] Initializing Animation Objects..."], "Media", 1);
            D.Queue(Media.SetLoadingMessage, ["[9/17] Sorting Objects by Z-Index..."], "Media", 0.1);
            D.Queue(setZIndices, [], "Media");
            D.Queue(Media.SetLoadingMessage, ["[10/17] Correcting Background & Overlay Layout..."], "Media", 0.1);
            D.Queue(resetBGImgs, [], "Media");
            D.Queue(Media.SetLoadingMessage, ["[11/17] Calibrating Time, Weather & Horizon..."], "Media", 0.1);
            D.Queue(TimeTracker.Fix, [], "Media", 10);
            D.Queue(Media.SetLoadingMessage, ["[12/17] Restoring District & Site Locations..."], "Media", 0.1);
            D.Queue(Session.ResetLocations, ["Active", true], "Media", 3);
            D.Queue(Media.SetLoadingMessage, ["[13/17] Performing Final Dice Roller Pass..."], "Media", 0.1);
            D.Queue(Roller.Clean, [], "Media");
            D.Queue(Media.SetLoadingMessage, ["[14/17] Performing Final Image Object Pass..."], "Media", 0.1);
            D.Queue(fixImgObjs, [true], "Media", 10);
            D.Queue(Media.SetLoadingMessage, ["[15/17] Performing Final Text Object Pass..."], "Media", 0.1);
            D.Queue(fixTextObjs, [true], "Media", 5);
            D.Queue(Media.SetLoadingMessage, ["[16/17] Initializing Soundscape..."], "Media", 0.1);
            D.Queue(Soundscape.Sync, [true], "Media", 3);
            D.Queue(Media.SetLoadingMessage, ["[17/17] Cleaning Up..."], "Media", 0.1);

            if (isTesting)
                D.Queue(Session.ToggleTesting, [isTesting], "Media", 0.1);

            // D.Queue(Media.SetLoadingMessage, ["Finished! (Please Refresh Sandbox!)"], "Media", 2)
            // D.Queue(Media.SetLoadingMessage, ["Returning to Game ..."], "Media", 2)
            D.Queue(
                () => {
                    D.Alert(STATE.REF.fixAllCommands.join("<br>"), "Media Initialization Report");
                    STATE.REF.fixAllCommands = [];
                },
                [],
                "Media",
                0.1
            );
            // D.Queue(Media.ToggleLoadingScreen, [false], "Media", 0.1)
            D.Run("Media");
        } else {
            D.Alert("Must be in ACTIVE Mode!", "Media: Fix All");
        }
        TRACEOFF(traceID);
    };
    const setLayer = (mediaRef, layer, isForcing = false) => {
        const traceID = TRACEON("setLayer", [mediaRef, layer, isForcing]);
        const mediaData = getMediaData(mediaRef);
        if (VAL({list: mediaData}, "setLayer")) {
            const mediaObj = getMediaObj(mediaRef);
            layer = layer || getActiveLayer(mediaData.name);
            if (!isForcing && mediaData.layer === layer)
                return TRACEOFF(traceID, null);
            mediaObj.set("layer", layer);
            return TRACEOFF(traceID, true);
        }
        return TRACEOFF(traceID, false);
    };
    const sendToFront = (mediaRef) => {
        const mediaObj = getMediaObj(mediaRef);
        if (mediaObj)
            toFront(mediaObj);
    };
    const sendToBack = (mediaRef) => {
        const mediaObj = getMediaObj(mediaRef);
        if (mediaObj)
            toBack(mediaObj);
    };
    const setMediaTemp = (mediaRef, params = {}) => {
        const traceID = TRACEON("setMediaTemp", [mediaRef, params]);
        const mediaObj = getMediaObj(mediaRef);
        if (VAL({object: mediaObj}))
            mediaObj.set(params);
        TRACEOFF(traceID);
    };
    const toggle = (mediaRef, isActive, isForcing = false) => {
        const traceID = TRACEON("toggle", [mediaRef, isActive, isForcing]);
        if (isActive !== true && isActive !== false)
            return TRACEOFF(traceID, null);
        if (isRegText(mediaRef))
            return TRACEOFF(traceID, toggleText(mediaRef, isActive, isForcing));
        if (isRegAnim(mediaRef))
            return TRACEOFF(traceID, toggleAnimation(mediaRef, isActive));
        return TRACEOFF(traceID, toggleImg(mediaRef, isActive, isForcing));
    };
    const setAnchor = (mediaRef) => {
        const traceID = TRACEON("setAnchor", [mediaRef]);
        const mediaObj = getMediaObj(mediaRef);
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
            };
            D.Alert(`Anchor Set to: ${D.JS(STATE.REF.anchorObj)}`, "Setting Media Anchor");
        }
        TRACEOFF(traceID);
    };
    const distObjs = (mediaRefs, distDir) => {
        const traceID = TRACEON("distObjs", [mediaRefs, distDir]);
        const posRef = D.LCase(distDir).startsWith("h") ? "left" : "top";
        const mediaObjs = mediaRefs.map((x) => getMediaObj(x)).sort((a, b) => a.get(posRef) - b.get(posRef));
        spreadImgs(mediaObjs.shift(), mediaObjs.pop(), mediaObjs);
        TRACEOFF(traceID);
    };
    const alignObjs = (mediaRefs, objAlignFrom = "center", anchorAlignTo) => {
        const traceID = TRACEON("alignObjs", [mediaRefs, objAlignFrom, anchorAlignTo]);
        const mediaObjs = _.compact(mediaRefs.map((x) => getMediaObj(x) || (VAL({object: x}) && x) || false));
        const alignGuides = {left: STATE.REF.anchorObj.left, top: STATE.REF.anchorObj.top};
        anchorAlignTo = anchorAlignTo || objAlignFrom;
        switch (D.LCase(anchorAlignTo)) {
            case "cfhoriz":
            case "cfvert":
            case "horiz":
            case "vert":
            case "center": {
                break;
            }
            case "top":
            case "topedge": {
                alignGuides.top = STATE.REF.anchorObj.topEdge;
                break;
            }
            case "bottom":
            case "bottomedge":
            case "botedge": {
                alignGuides.top = STATE.REF.anchorObj.bottomEdge;
                break;
            }
            case "left":
            case "leftedge": {
                alignGuides.left = STATE.REF.anchorObj.leftEdge;
                break;
            }
            case "right":
            case "rightedge": {
                alignGuides.left = STATE.REF.anchorObj.rightEdge;
                break;
            }
            default: {
                return TRACEOFF(traceID, THROW(`Unrecognized value for anchorAlignTo (${D.JSL(anchorAlignTo)})`, "alignObjs"));
            }
        }
        for (const mediaObj of mediaObjs)
            switch (D.LCase(objAlignFrom)) {
                case "cfhoriz": {
                    mediaObj.set("left", C.SANDBOX.width - mediaObj.get("left"));
                    break;
                }
                case "cfvert": {
                    mediaObj.set("top", C.SANDBOX.height - mediaObj.get("top"));
                    break;
                }
                case "horiz": {
                    mediaObj.set("left", alignGuides.left);
                    break;
                }
                case "vert": {
                    mediaObj.set("top", alignGuides.top);
                    break;
                }
                case "center": {
                    mediaObj.set({left: alignGuides.left, top: alignGuides.top});
                    break;
                }
                case "top":
                case "topedge": {
                    mediaObj.set("top", alignGuides.top + 0.5 * mediaObj.get("height"));
                    break;
                }
                case "bottom":
                case "bottomedge":
                case "botedge": {
                    mediaObj.set("top", alignGuides.top - 0.5 * mediaObj.get("height"));
                    break;
                }
                case "left":
                case "leftedge": {
                    mediaObj.set("left", alignGuides.left + 0.5 * mediaObj.get("width"));
                    break;
                }
                case "right":
                case "rightedge": {
                    mediaObj.set("left", alignGuides.left - 0.5 * mediaObj.get("width"));
                    break;
                }
                default: {
                    return TRACEOFF(traceID, THROW(`Unrecognized value for objAlignFrom (${D.JSL(objAlignFrom)})`, "alignObjs"));
                }
            }
        return TRACEOFF(traceID, true);
    };
    const adjustObj = (mediaRefs, deltaX, deltaY) => {
        const traceID = TRACEON("adjustObj", [mediaRefs, deltaX, deltaY]);
        for (const mediaObj of _.flatten([mediaRefs]).map((x) => getMediaObj(x)))
            if (VAL({object: mediaObj}))
                setMediaTemp({
                    left: D.Float(mediaObj.get("left")) + D.Float(deltaX),
                    top: D.Float(mediaObj.get("top")) + D.Float(deltaY)
                });
        TRACEOFF(traceID);
    };
    const modeUpdate = (mediaRefs = "all") => {
        const traceID = TRACEON("modeUpdate", [mediaRefs]);
        mediaRefs
            = mediaRefs === "all"
                ? [...Object.keys(REGISTRY.IMG), ...Object.keys(REGISTRY.TEXT), ...Object.keys(REGISTRY.ANIM)]
                : _.flatten([mediaRefs], true);
        for (const mediaRef of mediaRefs)
            if (isRegText(mediaRef)) {
                const textData = getTextData(mediaRef);
                const textKey = textData.name;
                const modeStatus = getModeStatus(textKey);
                DB(`Updating '${D.JSL(mediaRef)}'. ModeStatus: ${D.JSL(modeStatus)}`, "modeUpdate");
                if (VAL({list: modeStatus}, "modeUpdate")) {
                    const lastMode = textData.curMode;
                    if (lastMode) {
                        REGISTRY.TEXT[textKey].modes[lastMode].lastActive = textData.isActive;
                        REGISTRY.TEXT[textKey].modes[lastMode].lastState
                            = (textData.isActive && ((_.isString(textData.activeText) && textData.activeText) || textData.curText))
                            || REGISTRY.TEXT[textKey].modes[lastMode].lastState;
                    }
                    REGISTRY.TEXT[textKey].curMode = Session.Mode;
                    if (!_.isUndefined(modeStatus.isActive)) {
                        DB(`... IsActive OK! toggleText(${D.JSL(textKey)}, ${D.JSL(modeStatus.isActive)})`, "modeUpdate");
                        toggleText(textKey, modeStatus.isActive);
                    }
                    if (!_.isUndefined(modeStatus.state)) {
                        DB(`... State OK! setText(${D.JSL(textKey)}, ${D.JSL(modeStatus.state)})`, "modeUpdate");
                        setText(textKey, modeStatus.state);
                    }
                }
            } else {
                const graphicData = getImgData(mediaRef);
                const graphicKey = graphicData.name;
                const regRef = (REGISTRY.IMG[graphicKey] && REGISTRY.IMG) || (REGISTRY.ANIM[graphicKey] && REGISTRY.ANIM) || false;
                const modeStatus = getModeStatus(graphicKey);
                DB(`Updating '${D.JSL(mediaRef)}'. ModeStatus: ${D.JSL(modeStatus)}`, "modeUpdate");
                if (VAL({list: [regRef, modeStatus]}, "modeUpdate", true)) {
                    const lastMode = graphicData.curMode;

                    if (lastMode) {
                        regRef[graphicKey].modes[lastMode].lastActive = graphicData.isActive;
                        regRef[graphicKey].modes[lastMode].lastState
                            = (graphicData.isActive && graphicData.activeSrc) || regRef[graphicKey].modes[lastMode].lastState;
                    }
                    regRef[graphicKey].curMode = Session.Mode;
                    if (!_.isUndefined(modeStatus.isActive)) {
                        DB(`... IsActive OK! toggleImg(${D.JSL(graphicKey)}, ${D.JSL(modeStatus.isActive)})`, "modeUpdate");
                        toggleImg(graphicKey, modeStatus.isActive);
                    }
                    if (!_.isUndefined(modeStatus.state) && REGISTRY.IMG[graphicKey]) {
                        DB(`... State OK! setImg(${D.JSL(graphicKey)}, ${D.JSL(modeStatus.state)})`, "modeUpdate");
                        setImg(graphicKey, modeStatus.state);
                    }
                }
            }
        TRACEOFF(traceID);
    };
    const setActiveLayers = () => {
        const traceID = TRACEON("setActiveLayers", []);
        const mediaObjData = [
            ...Object.values(REGISTRY.GRAPHIC).map((x) => [getObj("graphic", x.id), x]),
            ...Object.values(REGISTRY.TEXT).map((x) => [getObj("text", x.id), x])
        ].filter((x) => x[0] && x[0].get && x[0].get("layer") !== ((x[1].isActive && x[1].activeLayer) || "walls"));
        DB({mediaObjData}, "setActiveLayers");
        for (const objData of mediaObjData)
            objData[0].set({layer: (objData[1].isActive && objData[1].activeLayer) || "walls"});
        TRACEOFF(traceID);
    };
    const setZIndices = () => {
        const traceID = TRACEON("setZIndices", []);
        // D.Alert(D.JS(findObjs({_id: "-Lua29PqPseZeUuUN0cv"}), true), "Mystery Object")
        const [allImgDatas, allAnimDatas, allTextDatas] = [Object.values(REGISTRY.IMG), Object.values(REGISTRY.ANIM), Object.values(REGISTRY.TEXT)];
        const allMediaRefs = _.compact([
            ..._.flatten(
                allImgDatas.map((x) => _.compact([
                    [getObj("graphic", x.id), x.zIndex],
                    "padID" in x && [getObj("graphic", x.padID), DEFAULTZINDICES.dragpad],
                    "partnerID" in x && [getObj("graphic", x.partnerID), DEFAULTZINDICES.dragpad]
                ])),
                true
            ),
            ...getTokenObjs().map((x) => [x, DEFAULTZINDICES.token]),
            ...allAnimDatas.map((x) => [getObj("graphic", x.id), x.zIndex]),
            ..._.flatten(
                allTextDatas.map((x) => {
                    const returnData = [[getObj("text", x.id), x.zIndex]];
                    if ("shadowID" in x) {
                        let shadowObj = getObj("text", x.shadowID);
                        if (shadowObj) {
                            if (shadowObj.get("_pageid") !== x.pageID) {
                                shadowObj.remove();
                                shadowObj = makeTextShadow(getObj("text", x.id), {
                                    text: x.curText,
                                    left: x.left,
                                    top: x.top,
                                    font_size: x.font_size,
                                    font_family: x.font_family,
                                    layer: x.activeLayer
                                });
                            }
                            returnData.push([shadowObj, x.zIndex - 0.5]);
                        }
                    }
                    return TRACEOFF(traceID, _.compact(returnData));
                }),
                true
            )
        ]).filter((x) => VAL({object: x[0], number: x[1]}));
        const sortedMediaRefs = allMediaRefs.sort((a, b) => a[1] - b[1]).reverse();
        DB({allMediaRefs, sortedMediaRefs}, "setZIndices");
        for (const [mediaObj] of sortedMediaRefs)
            toBack(mediaObj);
    };
    const alignMatteImages = () => {
        const mapObjs = Object.values(Media.IMAGES).filter((x) => x.height === C.MAP.height && x.width === C.MAP.width).map((x) => getObj("graphic", x.id));
        mapObjs.forEach((x) => { x.set({left: C.MAP.left, top: C.MAP.top}) });
        const bgObjs = Object.values(Media.IMAGES).filter((x) => x.height === C.SANDBOX.height && x.width === C.SANDBOX.width).map((x) => getObj("graphic", x.id));
        bgObjs.forEach((x) => { x.set({left: C.SANDBOX.left, top: C.SANDBOX.top}) });
    };
    const resetModeData = (isResettingAll = false, isQueueing = false, isVerbose = false, isChangingData = false) => {
        const traceID = TRACEON("resetModeData", [isResettingAll, isQueueing, isVerbose, isChangingData]);
        // ^([^.]+)\.([^.\n=]+)\.([^.\n=]+)\.([^.\n=]+)\.([^.\n=]+) = (.*)
        // ["$1", "$2", "$3", "$4", "$5", $6],

        // isActive, curSrc, activeSrc, curText
        isChangingData = isQueueing || isChangingData;
        const [errorLines, updatedKeys] = [[], {IMG: [], TEXT: [], ANIM: []}];
        const MODEDATA = JSON.parse(MODEDATAJSON);
        const parseValue = (objKey, k, v) => {
            const innerTraceID = TRACEON("parseValue", [objKey, k, v]);
            if (v === null)
                return TRACEOFF(innerTraceID, v);
            if (VAL({list: v}) || VAL({array: v}))
                return TRACEOFF(
                    innerTraceID,
                    D.KeyMapObj(D.Clone(v), null, (vv, kk) => parseValue(objKey, kk, vv))
                );
            if (k === "pageID")
                return TRACEOFF(innerTraceID, D.GetPageID(v));
            if (VAL({string: v}) && `${v}`.startsWith("@@")) {
                const mediaObj = getMediaObj(objKey);
                const mediaData = getMediaData(objKey);
                if (VAL({object: mediaObj, list: mediaData})) {
                    switch (v) {
                        case "@@curState@@": {
                            return TRACEOFF(innerTraceID, mediaObj.get("layer") !== "walls");
                        }
                        case "@@curText@@": {
                            return TRACEOFF(innerTraceID, mediaObj.get("text"));
                        }
                        case "@@curSrc@@": {
                            if (mediaData.isAnimation) {
                                errorLines.push(
                                    `<span style="color: darkred; background-color: rgba(100,0,0,0.2);"><b>${objKey}</b>: Animation object has a '@@curSrc@@' parameter!</span>`
                                );
                                return TRACEOFF(innerTraceID, null);
                            }
                            if (!`${mediaObj.get("imgsrc")}`.includes("http")) {
                                const topSrc = Object.keys(getImgSrcs(mediaObj))
                                    .filter((x) => !(x in C.IMAGES))
                                    .shift();
                                setImg(mediaObj, topSrc, undefined, true);
                                errorLines.push(
                                    `<span style="color: darkred; background-color: rgba(100,0,0,0.2);"><b>${objKey}</b>: Object imgsrc set wrong (${D.JSL(
                                        mediaObj.get("imgsrc")
                                    )}). Setting to top srcRef (${topSrc})</span>`
                                );
                            }
                            const srcRef = getSrcFromURL(mediaObj.get("imgsrc"), getImgSrcs(mediaObj));
                            if (srcRef) {
                                return TRACEOFF(innerTraceID, srcRef);
                            } else {
                                const topSrc = Object.keys(getImgSrcs(mediaObj))
                                    .filter((x) => !(x in C.IMAGES))
                                    .shift();
                                setImg(mediaObj, topSrc, undefined, true);
                                errorLines.push(
                                    `<span style="color: darkred; background-color: rgba(100,0,0,0.2);"><b>${objKey}</b>: Failure finding curSrc from URL '${D.JSL(
                                        mediaObj.get("imgsrc")
                                    )}'<br>SRCS: ${Object.keys(getImgSrcs(mediaObj)).join(
                                        ", "
                                    )} --> Setting to topSrc (${topSrc})<br>... srcRef: ${D.JS(srcRef)}<br>... getSrcfromURL: ${D.JS(
                                        getSrcFromURL(mediaObj.get("imgsrc"), mediaData.srcs)
                                    )}</span><br><span style="color: red; background-color: darkred;">... <b>MANUAL FIX REQUIRED!!</b></span>`
                                );
                                return TRACEOFF(innerTraceID, null);
                            }
                            break;
                        }
                        // no default
                    }
                } else {
                    errorLines.push(
                        `<span style="color: darkred; background-color: rgba(100,0,0,0.2);"><b>${objKey}</b>: Failure finding media obj!</span> (obj: ${D.JS(
                            mediaObj
                        )}, data: ${D.JS(mediaData)})`
                    );
                    return TRACEOFF(innerTraceID, null);
                }
            }
            return TRACEOFF(innerTraceID, v);
        };
        for (const mData of MODEDATA) {
            const data = [...mData];
            let value = data.pop();
            const key = data.pop();
            const objFlag = data.shift();
            const objName = data.shift();
            const objType = (objName in REGISTRY.ANIM && "ANIM") || objFlag;
            let ref = REGISTRY[objType][objName];

            if (!ref || (!isResettingAll && ref.wasModeUpdated))
                continue;
            value = parseValue(objName, key, value);
            if (value === null)
                continue;

            while (data.length) {
                const newKey = data.shift();
                if (newKey === "modes")
                    updatedKeys[objType].push(objName);
                if (!ref[newKey])
                    ref[newKey] = {};
                ref = ref[newKey];
            }

            if (isVerbose)
                errorLines.push(`<span style="color: darkgreen;"><b>${objName}</b></span>: ref[${D.JSL(key)}] set to ${D.JSL(value)}`);
            if (isChangingData)
                ref[key] = value;
        }
        if (isChangingData) {
            for (const imgKey of _.uniq(updatedKeys.IMG))
                REGISTRY.IMG[imgKey].wasModeUpdated = true;
            for (const textKey of _.uniq(updatedKeys.TEXT))
                REGISTRY.TEXT[textKey].wasModeUpdated = true;
            for (const animKey of _.uniq(updatedKeys.ANIM))
                REGISTRY.ANIM[animKey].wasModeUpdated = true;
        }
        if (errorLines.length)
            if (isQueueing)
                STATE.REF.fixAllCommands.push(...["<h3><u>Resetting Mode Data</u></h3>", ...errorLines]);
            else
                D.Alert(
                    _.compact([
                        "<h3><u>Resetting Mode Data</u></h3>",
                        ...errorLines,
                        " ",
                        isResettingAll ? null : "<b><u>NOT</u></b> Resetting All: (add argument 'all' to toggle ON)",
                        isVerbose ? null : "<b><u>NOT</u></b> Verbose: (add argument 'verb' to toggle ON)",
                        isChangingData ? null : "<b><u>NOT</u></b> Changing Data: (add argument 'confirm' to toggle ON)"
                    ]).join("<br>"),
                    "resetModeData"
                );
        TRACEOFF(traceID);
    };
    // #endregion

    // #region IMG OBJECT & AREA GETTERS: Img Object & Data Retrieval
    const isRegImg = (imgRef) => Boolean(getImgKey(imgRef, true));
    const isCharToken = (imgObj) => VAL({imgObj}) && getObj("character", imgObj.get("represents"));
    const isRegToken = (imgObj) => VAL({imgObj}) && Boolean(REGISTRY.TOKEN[D.GetName(imgObj.get("represents"))]);
    const isRandomizerToken = (tokenObj) => isCharToken(tokenObj) && isRegToken(tokenObj) && (REGISTRY.TOKEN[D.GetName(tokenObj.get("represents"))].srcs.randomSrcs || []).length;
    const isCyclingImg = (imgObj) => {
        const traceID = TRACEON("isCyclingImg", [imgObj]);
        const imgData = getImgData(imgObj);
        if (VAL({list: imgData}))
            return TRACEOFF(traceID, imgData.cycleSrcs && imgData.cycleSrcs.length);
        return TRACEOFF(traceID, false);
    };
    const getImgKey = (imgRef, funcName = false) => {
        const traceID = TRACEON("getImgKey", [imgRef, funcName]);
        try {
            let imgKey, imgObj;
            if (VAL({char: imgRef}))
                return TRACEOFF(traceID, imgRef);
            if (VAL({string: imgRef})) {
                if (REGISTRY.GRAPHIC[imgRef])
                    return TRACEOFF(traceID, imgRef);
                if (REGISTRY.GRAPHIC[`${imgRef}_1`])
                    return TRACEOFF(traceID, `${imgRef}_1`);
                imgObj = getObj("graphic", imgRef);
            } else if (VAL({imgObj: imgRef})) {
                imgObj = imgRef;
            } else if (VAL({selection: imgRef})) {
                [imgObj] = D.GetSelected(imgRef);
            }
            if (VAL({imgObj})) {
                imgKey = getImgKey(imgObj.get("name"), true);
                if (REGISTRY.GRAPHIC[imgKey])
                    return TRACEOFF(traceID, imgKey);
                imgKey = getImgKey(imgObj.get("name"), true);
                if (REGISTRY.GRAPHIC[imgKey])
                    return TRACEOFF(traceID, imgKey);
                imgKey = getImgKey((_.find(_.values(Char.REGISTRY), (x) => x.id === imgObj.get("represents")) || {tokenName: false}).tokenName, true);
                if (REGISTRY.GRAPHIC[imgKey])
                    return TRACEOFF(traceID, imgKey);
                imgKey = getImgKey(
                    `${getObj("character", imgObj.get("represents"))
                        .get("name")
                        .replace(/\s+/gu, "")}Token`,
                    true
                );
                if (REGISTRY.GRAPHIC[imgKey])
                    return TRACEOFF(traceID, imgKey);
            }
            return TRACEOFF(
                traceID,
                VAL({string: funcName}) && THROW(`Cannot find name of image from reference '${D.JSL(imgRef)}'`, `${D.JSL(funcName)} > GetImgKey`)
            );
        } catch (errObj) {
            return TRACEOFF(
                traceID,
                VAL({string: funcName}) && THROW(`Cannot locate image with search value '${D.JSL(imgRef)}'`, `${D.JSL(funcName)} > GetImgKey`, errObj)
            );
        }
    };
    const getImgObj = (imgRef, funcName = false) => {
        const traceID = TRACEON("getImgObj", [imgRef, funcName]);
        // D.Alert("GETTING IMG OBJECT")
        try {
            let imgObj;
            if (VAL({imgObj: imgRef}))
                return TRACEOFF(traceID, imgRef);
            if (VAL({char: imgRef}))
                return TRACEOFF(
                    traceID,
                    (findObjs({
                        _pageid: D.MAINPAGEID,
                        _type: "graphic",
                        _subtype: "token",
                        represents: D.GetChar(imgRef).id
                    }) || [false])[0]
                );
            if (VAL({string: imgRef})) {
                imgObj = getObj("graphic", imgRef);
                if (VAL({imgObj}))
                    return TRACEOFF(traceID, imgObj);
            }
            if (VAL({selection: imgRef})) {
                [imgObj] = D.GetSelected(imgRef);
                if (VAL({imgObj}))
                    return TRACEOFF(traceID, imgObj);
            }
            const imgKey = getImgKey(imgRef);
            if (VAL({string: imgKey}))
                imgObj = getObj("graphic", REGISTRY.GRAPHIC[imgKey].id);
            if (VAL({imgObj}))
                return TRACEOFF(traceID, imgObj);
            return TRACEOFF(traceID, false);
        } catch (errObj) {
            return TRACEOFF(traceID, VAL({string: funcName}) && THROW(`IMGREF: ${D.JSL(imgRef)}`, `${D.JSL(funcName)} > getImgObj`, errObj));
        }
    };
    const getImgObjs = (imgRefs, funcName = false) => {
        const traceID = TRACEON("getImgObjs", [imgRefs, funcName]);
        // D.Alert(`GetSelected ImgRefs: ${D.JS(D.GetSelected(imgRefs))}`)
        imgRefs = VAL({selection: imgRefs}) ? D.GetSelected(imgRefs) : _.flatten([imgRefs]) || Object.keys(REGISTRY.GRAPHIC);
        const imgObjs = [];
        if (VAL({array: imgRefs}))
            for (const imgRef of imgRefs)
                imgObjs.push(getImgObj(imgRef, funcName));
        return TRACEOFF(traceID, _.compact(imgObjs));
    };
    const getImgData = (imgRef, funcName = false) => {
        const traceID = TRACEON("getImgData", [imgRef, funcName]);
        const imgData = (() => {
            const innerTraceID = TRACEON("imgData", []);
            let imgKey, imgObj;
            try {
                imgKey = getImgKey(imgRef, funcName);
                if (VAL({string: imgKey}) || (VAL({imgObj: imgKey}) && REGISTRY.GRAPHIC[imgKey.get("name")]))
                    return TRACEOFF(innerTraceID, REGISTRY.GRAPHIC[imgKey] || REGISTRY.GRAPHIC[imgKey.get("name")]);
                imgObj = getImgObj(imgRef, funcName);
                if (VAL({imgObj}, "getImgData")) {
                    if (REGISTRY.GRAPHIC[imgObj.get("name")])
                        return TRACEOFF(innerTraceID, REGISTRY.GRAPHIC[imgObj.get("name")]);
                    if (VAL({char: imgKey}) && !REGISTRY.GRAPHIC[imgObj.get("name")])
                        return TRACEOFF(
                            innerTraceID,
                            Object.assign(
                                {},
                                DEFAULTTOKENDATA,
                                {
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
                                },
                                getTokenData(imgKey)
                            )
                        );
                    return TRACEOFF(innerTraceID, {
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
                    });
                }
                return TRACEOFF(innerTraceID, false);
            } catch (errObj) {
                return TRACEOFF(
                    innerTraceID,
                    VAL({string: funcName})
                    && THROW(`Cannot locate image with search value '${D.JSL(imgRef)}'`, `${D.JSL(funcName)} > getImgData`, errObj)
                );
            }
        })();
        if (VAL({list: imgData}, VAL({string: funcName}) ? `${D.JSL(funcName)} > getImgData` : null)) {
            imgData.leftEdge = imgData.left - 0.5 * imgData.width;
            imgData.rightEdge = imgData.left + 0.5 * imgData.width;
            imgData.topEdge = imgData.top - 0.5 * imgData.height;
            imgData.bottomEdge = imgData.top + 0.5 * imgData.height;
        }
        return TRACEOFF(traceID, imgData);
    };
    const getImgSrcs = (imgRef) => {
        const traceID = TRACEON("getImgSrcs", [imgRef]);
        let imgData = getImgData(imgRef);
        if (VAL({list: imgData})) {
            while (isRegImg(imgData.srcs))
                imgData = getImgData(imgData.srcs);
            return TRACEOFF(traceID, Object.assign({}, D.Clone(C.IMAGES), imgData.srcs));
        }
        return TRACEOFF(traceID, false);
    };
    const getURLFromSrc = (srcRef, srcData) => {
        const traceID = TRACEON("getURLFromSrc", [srcRef, srcData]);
        if (VAL({string: srcRef})) {
            if (`${srcRef}`.includes("http"))
                return TRACEOFF(traceID, srcRef);
            if (VAL({string: srcData}))
                srcData = getImgSrcs(srcData);
            if (VAL({list: srcData}, "getURLFromSrc"))
                return TRACEOFF(traceID, srcData[srcRef] || false);
        }
        return TRACEOFF(traceID, false);
    };
    const getSrcFromURL = (URLRef, srcData) => {
        const traceID = TRACEON("getSrcFromURL", [URLRef, srcData]);
        if (VAL({string: srcData}))
            srcData = getImgSrcs(srcData);
        if (VAL({string: URLRef, list: srcData}, "getSrcFromURL")) {
            let matchingKeys = Object.keys(srcData).filter((x) => D.LCase(srcData[x]) === D.LCase(URLRef));
            if (matchingKeys.length === 1)
                return TRACEOFF(traceID, matchingKeys.pop());
            matchingKeys = matchingKeys.filter((x) => x !== "blank");
            if (matchingKeys.length === 1)
                return TRACEOFF(traceID, matchingKeys.pop());
            const tokenSrcURLs = _.uniq([
                ..._.flatten(Object.values(REGISTRY.TOKEN.GENERIC)),
                ..._.flatten(Object.values(_.omit(REGISTRY.TOKEN, "GENERIC")).map((x) => Object.values(x.srcs).map((xx) => [xx])))
            ]);
            matchingKeys = tokenSrcURLs.filter((x) => D.LCase(x) === D.LCase(URLRef));
            if (matchingKeys.length === 1)
                return TRACEOFF(traceID, "TOKENSOURCE");
        }
        return TRACEOFF(traceID, false);
    };
    const getTokenObjs = (charRef, layerFilter = false) => {
        const traceID = TRACEON("getTokenObjs", [charRef, layerFilter]);
        const mainPageID = D.MAINPAGEID;
        const allTokenObjs = (
            findObjs(
                (layerFilter && {
                    _pageid: mainPageID,
                    _type: "graphic",
                    _subtype: "token",
                    layer: layerFilter
                }) || {
                    _pageid: mainPageID,
                    _type: "graphic",
                    _subtype: "token"
                }
            ) || []
        ).filter((x) => isCharToken(x));
        const charIDs = (charRef && D.GetChars(charRef).map((x) => x.id)) || "ALL";
        DB({mainPageID, allTokenObjs, charIDs}, "getTokenObjs");
        return TRACEOFF(
            traceID,
            _.compact(
                (charIDs === "ALL" && allTokenObjs) || (charIDs.length && allTokenObjs.filter((x) => charIDs.includes(x.get("represents")))) || []
            )
        );
    };
    const getTokenData = (charRef) => {
        const traceID = TRACEON("getTokenData", [charRef]);
        const charID = (D.GetChar(charRef) || {id: false}).id;
        if (charID)
            return TRACEOFF(traceID, _.findWhere(REGISTRY.TOKEN, {charID}));
        return TRACEOFF(traceID, {});
    };
    const getAreaData = (areaRef) => REGISTRY.AREA[areaRef];
    /* getImgDatas = imgRefs => {
			const imgRefs = D.GetSelected(imgRefs) || imgRefs,
				 imgDatas = []
			for (const imgRef of imgRefs) {
				imgDatas.push(getImgData(imgRef))
			}
			return imgDatas
		}, */
    const getBounds = (imgRef) => {
        const traceID = TRACEON("getBounds", [imgRef]);
        const imgObj = getImgObj(imgRef);
        const boundaryData = {};
        DB({imgRef, imgObj, boundaryData}, "checkBounds");
        if (VAL({imgObj})) {
            boundaryData.top = imgObj.get("top");
            boundaryData.left = imgObj.get("left");
            boundaryData.height = imgObj.get("height");
            boundaryData.width = imgObj.get("width");
            return TRACEOFF(traceID, {
                top: boundaryData.top - 0.5 * boundaryData.height,
                bottom: boundaryData.top + 0.5 * boundaryData.height,
                left: boundaryData.left - 0.5 * boundaryData.width,
                right: boundaryData.left + 0.5 * boundaryData.width,
                height: boundaryData.height,
                width: boundaryData.width
            });
        }
        return TRACEOFF(traceID, false);
    };
    const isInside = (containerRef, imgRef, padding = 0) => {
        const traceID = TRACEON("isInside", [containerRef, imgRef, padding]);
        const containerBounds = getBounds(containerRef);
        const imgBounds = getBounds(imgRef);
        DB(
            {
                containerRef,
                imgRef,
                padding,
                containerBounds,
                imgBounds
            },
            "checkBounds"
        );
        return TRACEOFF(
            traceID,
            containerBounds
            && imgBounds
            && containerBounds.top <= imgBounds.top + padding
            && containerBounds.bottom >= imgBounds.bottom - padding
            && containerBounds.left <= imgBounds.left + padding
            && containerBounds.right >= imgBounds.right - padding
        );
    };
    const getImgSrc = (imgRef) => (getImgData(imgRef) || {curSrc: false}).curSrc;
    /* getImgSrcs = imgRef => getImgData(imgRef) ? getImgData(imgRef).srcs : false, */
    const isObjActive = (mediaRef) => (getMediaData(mediaRef) || {isActive: null}).isActive;
    const getContainedImgObjs = (containerRef, options = {}, filter = {}) => {
        const traceID = TRACEON("getContainedImgObjs", [containerRef, options, filter]);
        const containerObj = getImgObj(containerRef);
        const containerData = getImgData(containerObj.id);
        /*  allImgObjs = findObjs({
                    _pageid: D.GetPageID(containerObj),
                    _type: "graphic"
                }),
                allContainedImgObjs = allImgObjs.filter(x => isInside(containerData.id, x.id, options.padding || 0)),
                minusContainer = allContainedImgObjs.filter(x => containerData.id !== x.id),
                minusInactive = minusContainer.filter(x => isObjActive(x)),
                filteredImgObjs = minusInactive.filter(x => {
                    for (const [prop, value] of Object.entries(filter))
                        if (x.get(prop) !== value)
                            return false
                    return true
                }), */
        const containedImgObjs = findObjs({
            _pageid: D.GetPageID(containerObj),
            _type: "graphic"
        }).filter((x) => {
            if (containerData.id === x.id)
                return false;
            if (!isObjActive(x))
                return false;
            for (const [prop, value] of Object.entries(filter))
                if (x.get(prop) !== value)
                    return false;
            return isInside(containerData.id, x.id, options.padding || 0);
        });
        DB(
            {
                containerRef,
                options,
                filter,
                containerName: containerData.name,
                /* imgCount: allImgObjs.length, allContainedImgObjs, minusContainer, minusInactive, filteredImgObjs, */ containedImgObjs
            },
            "getContainedImgObjs"
        );
        return TRACEOFF(traceID, containedImgObjs);
    };
    const getContainedChars = (containerRef, options, filter = {}) => getContainedImgObjs(containerRef, options, Object.assign(filter, {_subtype: "token", _layer: "objects"})).map((x) => D.GetChar(x));
    // #endregion

    // #region IMG OBJECT & AREA SETTERS: Registering & Manipulating Img Objects
    const addImgSrc = (imgSrcRef, imgName, srcName, isSilent = false) => {
        const traceID = TRACEON("addImgSrc", [imgSrcRef, imgName, srcName, isSilent]);
        try {
            const imgSrc
                = !srcName.startsWith("ref:")
                && (_.isString(imgSrcRef) && imgSrcRef.includes("http")
                    ? imgSrcRef
                    : (getImgObj(imgSrcRef) || {get: () => ""}).get("imgsrc").replace(/\w*?(?=\.\w+?\?)/u, "thumb"));
            if (imgSrc !== "" && isRegImg(imgName)) {
                if (srcName.startsWith("ref:"))
                    REGISTRY.IMG[getImgKey(imgName)].srcs = srcName.replace(/ref:/gu, "");
                else
                    REGISTRY.IMG[getImgKey(imgName)].srcs[srcName] = imgSrc;
                if (!isSilent)
                    D.Alert(`Img '${D.JS(srcName)}' added to category '${D.JS(imgName)}'.<br><br>Source: ${D.JS(imgSrc)}`);
            }
        } catch (errObj) {
            THROW("", "addImgSrc", errObj);
        }
        TRACEOFF(traceID);
    };
    const addTokenSrc = (tokenSrcRef, charRef, srcName = false) => {
        const traceID = TRACEON("addTokenSrc", [tokenSrcRef, charRef, srcName]);
        const charObj = D.GetChar(charRef);
        const tokenSrc = (VAL({string: tokenSrcRef}) && tokenSrcRef.includes(".png")
            ? tokenSrcRef || ""
            : (getImgObj(tokenSrcRef) || {get: () => ""}).get("imgsrc")
        ).replace(/[^/]*\.png/gu, "thumb.png");
        DB({charObj, tokenSrc}, "addTokenSrc");
        if (VAL({charObj, string: tokenSrc}) && tokenSrc.includes("png")) {
            const tokenKey = charObj.get("name");
            const [tokenObj] = getTokenObjs(tokenKey);
            DB(
                {
                    tokenKey,
                    tokenObj,
                    isRandomizer: isRandomizerToken(tokenObj),
                    isChar: isCharToken(tokenObj)
                },
                "addTokenSrc"
            );
            // isCharToken(tokenObj) && isRegToken(tokenObj) && REGISTRY.TOKEN[tokenObj.get("name")].srcs.randomSrcs && REGISTRY.TOKEN[tokenObj.get("name")].srcs.randomSrcs.length
            if (!srcName && isRandomizerToken(tokenObj)) {
                REGISTRY.TOKEN[tokenKey].srcs.randomSrcs = _.uniq([...REGISTRY.TOKEN[tokenKey].srcs.randomSrcs, tokenSrc]);
                D.Alert(`Random token image added:<br><br>${D.JS(REGISTRY.TOKEN[tokenKey])}`, "addTokenSrc");
                return TRACEOFF(traceID, true);
            } else if (VAL({string: srcName})) {
                REGISTRY.TOKEN[tokenKey].srcs[srcName] = tokenSrc;
                D.Alert(`Token image source '${D.JS(srcName)}' added:<br><br>${D.JS(REGISTRY.TOKEN[tokenKey])}`, "addTokenSrc");
                return TRACEOFF(traceID, true);
            }
            D.Alert("Not a randomizer token!  Must include a valid source name.", "addTokenSrc");
            return TRACEOFF(traceID, false);
        }
        D.Alert("Invalid character or token image source.", "addTokenSrc");
        return TRACEOFF(traceID, false);
    };
    const setTokenSrc = (charRef, srcName = "base") => {
        const traceID = TRACEON("setTokenSrc", [charRef, srcName]);
        srcName = srcName === "" ? "base" : srcName;
        const [tokenObj] = getTokenObjs(charRef);
        DB({tokenObj, tokenObjID: tokenObj && tokenObj.id, srcName, "isToken?": VAL({tokenObj}), "isReg?": isRegToken(tokenObj)}, "setTokenSrc");
        if (VAL({tokenObj}) && isRegToken(tokenObj)) {
            const prevTokenAuras = getActiveTokenAuras(charRef);
            const tokenName = tokenObj.get("name");
            const tokenSrcs = REGISTRY.TOKEN[tokenName].srcs;
            const tokenSrcURL = tokenSrcs[srcName] || tokenSrcs[srcName.toLowerCase()];
            DB({tokenName, tokenSrcs, tokenSrcURL}, "setTokenSrc");
            if (VAL({string: tokenSrcURL})) {
                REGISTRY.TOKEN[tokenName].curSrc = srcName;
                tokenObj.set("imgsrc", tokenSrcURL);
            }
            const curTokenAuras = getActiveTokenAuras(charRef);
            DB({prevTokenAuras, curTokenAuras}, "setTokenSrc");
            for (const tokenAura of _.uniq([...prevTokenAuras, ...curTokenAuras])) {
                setImgData(tokenAura, {top: tokenObj.get("top"), left: tokenObj.get("left")});
                toggleImg(tokenAura, curTokenAuras.includes(tokenAura));
            }
        }
        TRACEOFF(traceID);
    };
    const setGenericToken = (imgObj) => {
        const traceID = TRACEON("setGenericToken", [imgObj]);
        const tokenCat = D.LCase(D.GetStatVal(imgObj, "tokencat"));
        if (tokenCat in REGISTRY.TOKEN.GENERIC)
            imgObj.set({
                imgsrc: _.sample(REGISTRY.TOKEN.GENERIC[tokenCat]),
                showname: true,
                height: 73,
                width: 90
            });
        TRACEOFF(traceID);
    };
    const toggleTokens = (tokenRef, isActive) => {
        const traceID = TRACEON("toggleTokens", [tokenRef, isActive]);
        DB({tokenRef, isActive}, "toggleTokens");
        if (isActive !== null)
            for (const tokenObj of getTokenObjs(tokenRef)) {
                if (tokenObj.get("layer") === "gmlayer")
                    continue;
                for (const tokenAura of getActiveTokenAuras(tokenRef))
                    toggle(tokenAura, isActive);
                if (isActive === true && tokenObj.get("layer") !== "objects")
                    tokenObj.set("layer", "objects");
                else if (isActive === false && tokenObj.get("layer") !== "walls")
                    tokenObj.set("layer", "walls");
            }
        TRACEOFF(traceID);
    };
    const combineTokenSrc = (charRef, srcName = "base") => {
        const traceID = TRACEON("combineTokenSrc", [charRef, srcName]);
        const [tokenObj] = getTokenObjs(charRef);
        DB({charRef, srcName}, "combineTokenSrc");
        if (VAL({tokenObj, string: srcName}) && isRegToken(tokenObj)) {
            const tokenName = tokenObj.get("name");
            const tokenSrc = REGISTRY.TOKEN[tokenName].curSrc || "base";
            const splitTokenSrcs = D.Capitalize(tokenSrc).match(/[A-Z][a-z]*/gu);
            let newTokenSrcs = [];
            if (D.LCase(srcName) === "base")
                newTokenSrcs = ["base"];
            else if (splitTokenSrcs.includes(D.Capitalize(srcName)))
                newTokenSrcs = _.without(splitTokenSrcs, D.Capitalize(srcName));
            else
                newTokenSrcs = [..._.without(splitTokenSrcs, "Base"), D.Capitalize(srcName)];
            newTokenSrcs.sort();
            DB(
                {
                    tokenName,
                    tokenSrc,
                    splitTokenSrcs,
                    newTokenSrcs
                },
                "combineTokenSrc"
            );
            setTokenSrc(charRef, newTokenSrcs.join(""));
        }
        TRACEOFF(traceID);
    };
    const getActiveTokenAuras = (charRef) => {
        const [tokenObj] = getTokenObjs(charRef);
        const tokenName = tokenObj && tokenObj.get("name");
        const tokenSrc = (tokenName && tokenName in REGISTRY.TOKEN) ? REGISTRY.TOKEN[tokenName].curSrc : "base";
        const splitTokenSrcs = D.Capitalize(tokenSrc).match(/[A-Z][a-z]*/gu);
        const tokenAuras = [];
        for (const srcName of splitTokenSrcs)
            if (D.Capitalize(srcName) in STATE.REF.tokenAuras)
                tokenAuras.push(STATE.REF.tokenAuras[srcName]);

        DB({splitTokenSrcs, tokenAuras}, "getActiveTokenAuras");
        return tokenAuras;
    };
    const regImg = (imgRef, imgName, srcName, activeLayer, options = {}, funcName = false, isSilent = false) => {
        const traceID = TRACEON("regImg", [imgRef, imgName, srcName, activeLayer, options, funcName, isSilent]);
        // D.Alert(`Options for '${D.JS(imgName)}': ${D.JS(options)}`, "MEDIA: regImg")
        if (!(imgRef && imgName && srcName && activeLayer))
            return TRACEOFF(traceID, THROW("Must supply all parameters for regImg.", "RegImg"));
        const imgObj = getImgObj(imgRef);
        if (VAL({graphicObj: imgObj}, "regImg")) {
            const baseName = imgName.replace(/(_|\d|#)+$/gu, "");
            const name = `${baseName}_${_.filter(Object.keys(REGISTRY.IMG), (k) => k.includes(baseName)).length + 1}`;
            const params = {
                left:
                    options.left
                    || imgObj.get("left")
                    || REGISTRY.IMG[name].left
                    || (C.IMAGES[baseName.toLowerCase()] && C.IMAGES[baseName.toLowerCase()].left),
                top:
                    options.top
                    || imgObj.get("top")
                    || REGISTRY.IMG[name].top
                    || (C.IMAGES[baseName.toLowerCase()] && C.IMAGES[baseName.toLowerCase()].top),
                height:
                    options.height
                    || imgObj.get("height")
                    || REGISTRY.IMG[name].height
                    || (C.IMAGES[baseName.toLowerCase()] && C.IMAGES[baseName.toLowerCase()].height),
                width:
                    options.width
                    || imgObj.get("width")
                    || REGISTRY.IMG[name].width
                    || (C.IMAGES[baseName.toLowerCase()] && C.IMAGES[baseName.toLowerCase()].width)
            };
            if (!params.left || !params.top || !params.height || !params.width)
                return TRACEOFF(traceID, THROW("Must supply position & dimension to register image.", "RegImg"));
            imgObj.set({name, showname: false, isdrawing: options.isDrawing !== false});
            REGISTRY.IMG[name] = {
                id: imgObj.id,
                type: (imgObj.get("_type") === "text" && "text") || "image",
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
            };
            if (options.modes)
                REGISTRY.IMG[name].wasModeUpdated = true;
            DB(`Modes for ${name}: ${D.JSL(REGISTRY.IMG[name].modes)}`, "regImg");
            if (srcName !== "none") {
                addImgSrc(imgObj.get("imgsrc").replace(/med/gu, "thumb"), name, srcName, isSilent);
                setImg(name, srcName.includes("ref:") ? "base" : srcName);
            }
            layerImgs([name], REGISTRY.IMG[name].activeLayer);
            if (options.isActive === false)
                toggleImg(name, false, true);
            if (VAL({string: funcName}) && !isSilent)
                D.Alert(`Host obj for '${D.JS(name)}' registered: ${D.JS(REGISTRY.IMG[name])}`, "MEDIA: regImg");
            return TRACEOFF(traceID, getImgData(name));
        }
        return TRACEOFF(traceID, THROW(`Invalid image reference '${D.JSL(imgRef)}'`, "regImg"));
    };
    const regToken = (tokenRef, isClearingSrcs = false) => {
        const traceID = TRACEON("regToken", [tokenRef, isClearingSrcs]);
        const tokenObj = (tokenRef && tokenRef.get && tokenRef) || getImgObj(tokenRef);
        // D.Alert(`tokenRef: ${D.JS(tokenRef, true)}<br><br>tokenObj: ${D.JS(tokenObj, true)}`)
        if (VAL({tokenObj}, "regToken")) {
            const tokenSrc = tokenObj.get("imgsrc").replace(/[^/]*\.png/gu, "thumb.png");
            const tokenName = tokenObj.get("name");
            const tokenData = REGISTRY.TOKEN[tokenName] || {};
            const tokenParams = {
                name: tokenName,
                id: tokenObj.id,
                charID: tokenObj.get("represents")
            };
            if (isClearingSrcs || !tokenParams.srcs || Object.values(tokenParams.srcs).length === 0) {
                tokenParams.srcs = {base: tokenSrc};
            } else {
                tokenParams.srcs = tokenData.srcs || {};
                tokenParams.srcs.base = tokenSrc;
            }
            REGISTRY.TOKEN[tokenName] = Object.assign(REGISTRY.TOKEN[tokenName] || {}, tokenParams);
            D.Alert(`Token registered:<br><br>${D.JS(REGISTRY.TOKEN[tokenName])}`, "regToken");
            return TRACEOFF(traceID, true);
        }
        D.Alert("Token registration failed.", "regToken");
        return TRACEOFF(traceID, false);
    };
    const regRandomizerToken = (imgRef, tokenName) => {
        const traceID = TRACEON("regRandomizerToken", [imgRef, tokenName]);
        if (isRegToken(imgRef) || regToken(imgRef)) {
            const tokenObj = getImgObj(imgRef);
            const tokenKey = tokenObj.get("name");
            const tokenBaseSrc = REGISTRY.TOKEN[tokenKey].srcs.base;
            if (VAL({string: tokenBaseSrc})) {
                REGISTRY.TOKEN[tokenKey].srcs = {
                    base: tokenBaseSrc,
                    randomSrcs: [tokenBaseSrc]
                };
                REGISTRY.TOKEN[tokenKey].randomSrcCount = 0;
                D.Alert(`Randomizer Token Registered:<br><br>${D.JS(REGISTRY.TOKEN[tokenKey])}`, "regRandomizerToken");
                return TRACEOFF(traceID, true);
            }
        }
        D.Alert(`No 'base' source found for ${tokenName}`, "regRandomizerToken");
        return TRACEOFF(traceID, false);
    };
    const regGenericToken = (imgObj, tokenCat) => {
        const traceID = TRACEON("regGenericToken", [imgObj, tokenCat]);
        tokenCat = D.LCase(tokenCat);
        if (tokenCat && VAL({imgObj})) {
            const imgSrc = imgObj.get("imgsrc").replace(/\/[^/]*?\.(jpg|png|jpeg)\?/gu, "/thumb.$1?");
            REGISTRY.TOKEN.GENERIC[tokenCat] = REGISTRY.TOKEN.GENERIC[tokenCat] || [];
            REGISTRY.TOKEN.GENERIC[tokenCat] = _.uniq([...REGISTRY.TOKEN.GENERIC[tokenCat], imgSrc]);
            return TRACEOFF(traceID, true);
        }
        return TRACEOFF(traceID, false);
    };
    const regArea = (imgRef, areaName) => {
        const traceID = TRACEON("regArea", [imgRef, areaName]);
        const imgObj = getImgObj(imgRef) || getTokenObjs(imgRef).pop();
        DB({imgRef, imgObj, areaName}, "regArea");
        if (VAL({graphicObj: imgObj}, "regArea")) {
            REGISTRY.AREA[areaName] = {
                top: D.Int(imgObj.get("top")),
                left: D.Int(imgObj.get("left")),
                height: D.Int(imgObj.get("height")),
                width: D.Int(imgObj.get("width"))
            };
            D.Alert(`Area Registered: ${areaName}<br><br><pre>${D.JS(REGISTRY.AREA[areaName])}</pre>`, "Media: Register Area");
        }
        TRACEOFF(traceID);
    };
    const makeImg = (imgName = "", params = {}, funcName = false, isSilent = false) => {
        const traceID = TRACEON("makeImg", [imgName, params, funcName, isSilent]);
        const dataRef = C.IMAGES.defaults;
        const imgObj = createObj("graphic", {
            _pageid: (params.pageID && D.GetPageID(params.pageID)) || D.THISPAGEID,
            imgsrc: (params.imgsrc || C.IMAGES.blank).replace(/\/med\./gu, "/thumb."),
            left: params.left || dataRef.left,
            top: params.top || dataRef.top,
            width: params.width || dataRef.width,
            height: params.height || dataRef.height,
            layer: params.layer || params.activeLayer || "gmlayer",
            isdrawing: params.isDrawing !== false,
            controlledby: params.controlledby || "",
            showname: params.showname === true
        });
        const options = _.omit(params, "activeLayer");
        DB({imgObj, options}, "makeImg");
        regImg(
            imgObj,
            imgName,
            params.imgsrc && params.imgsrc !== C.IMAGES.blank ? "base" : "blank",
            params.activeLayer || params.layer || "gmlayer",
            options,
            funcName,
            isSilent
        );
        return TRACEOFF(traceID, imgObj);
    };
    const setImg = (imgRef, srcRef, isToggling, isForcing = false) => {
        const traceID = TRACEON("setImg", [imgRef, srcRef, isToggling, isForcing]);
        // D.Alert(`Getting ${D.JS(srcRef)} for ${D.JS(imgRef)} --> ${D.JS(REGISTRY[getImgData(imgRef).name].srcs[srcRef])}`, "MEDIA:SetImg")
        if (isToggling === true || isToggling === false)
            toggleImg(imgRef, isToggling, isForcing);
        if (srcRef === null || REGISTRY.ANIM[getImgKey(imgRef)])
            return TRACEOFF(traceID, null);
        const imgData = getImgData(imgRef);
        const imgObj = imgData && getImgObj(imgData.id);
        if (VAL({list: imgData}))
            if (VAL({string: srcRef})) {
                if (!isForcing && imgData.curSrc === srcRef)
                    return TRACEOFF(traceID, null);
                const srcData = getImgSrcs(imgData.name);
                const srcURL = getURLFromSrc(srcRef, srcData);
                if (VAL({string: srcURL}, "setImg")) {
                    if (VAL({imgObj}, ["setImg", `Key: ${D.JS(imgData.name)}`])) {
                        if (isObjActive(imgData.name) && srcRef !== "blank")
                            REGISTRY.IMG[imgData.name].activeSrc = srcRef;
                        REGISTRY.IMG[imgData.name].curSrc = srcRef;
                        imgObj.set("imgsrc", srcURL);
                    }
                    return TRACEOFF(traceID, imgObj);
                }
            } else if (VAL({charObj: srcRef})) {
                srcRef.get("_defaulttoken", (tokenDataJSON) => {
                    const tokenData = JSON.parse(tokenDataJSON);
                    const srcURL = tokenData.imgsrc.replace(/med\.png/gu, "thumb.png");
                    REGISTRY.IMG[imgData.name].curSrc = srcURL;
                    imgObj.set("imgsrc", srcURL);
                });
            }
        return TRACEOFF(traceID, false);
    };
    const moveImgRelative = (imgRef, startImgRef, targetImgRef) => {
        const [imgObj, startData, targetData] = [getImgObj(imgRef), getImgData(startImgRef), getImgData(targetImgRef)];
        const imgData = getImgData(imgRef);
        const [deltaX, deltaY] = [targetData.left - startData.left, targetData.top - startData.top];
        setImgTemp(imgObj, {
            left: imgData.left + deltaX,
            top: imgData.top + deltaY
        });
    };
    const setRandomizerToken = (tokenObj) => {
        const traceID = TRACEON("setRandomizerToken", [tokenObj]);
        if (isRandomizerToken(tokenObj)) {
            const tokenKey = D.GetName(tokenObj.get("represents"));
            const tokenSrcs = REGISTRY.TOKEN[tokenKey].srcs.randomSrcs;
            let tokenNum = REGISTRY.TOKEN[tokenKey].randomSrcCount;
            tokenNum++;
            if (tokenNum >= tokenSrcs.length)
                tokenNum = 0;
            const tokenSrc = tokenSrcs[tokenNum];
            tokenObj.set("imgsrc", tokenSrc);
            REGISTRY.TOKEN[tokenKey].randomSrcCount = tokenNum;
        }
        TRACEOFF(traceID);
    };
    const cycleImg = (imgRef, isLooping = true, isReversing = false) => {
        const traceID = TRACEON("cycleImg", [imgRef, isLooping, isReversing]);
        const imgData = getImgData(imgRef);
        if (imgData && isCyclingImg(imgData.id)) {
            const srcIndex = Math.max(
                _.findIndex(imgData.cycleSrcs, (x) => x === imgData.curSrc),
                0
            );
            let newIndex = srcIndex + (isReversing ? -1 : 1);
            if (newIndex < 0)
                if (isLooping)
                    newIndex = imgData.cycleSrcs.length - 1;
                else
                    return TRACEOFF(traceID, false);
            else if (newIndex >= imgData.cycleSrcs.length)
                if (isLooping)
                    newIndex = 0;
                else
                    return TRACEOFF(traceID, false);
            toggleImg(imgData.name, true);
            setImg(imgData.name, imgData.cycleSrcs[newIndex]);
            return TRACEOFF(traceID, newIndex);
        }
        return TRACEOFF(traceID, false);
    };
    const setImgTemp = (imgRef, params) => {
        const traceID = TRACEON("setImgTemp", [imgRef, params]);
        const imgObj = getImgObj(imgRef);
        if (VAL({imgObj}, "setImgTemp")) {
            const imgData = getImgData(imgRef);
            imgObj.set(params);
            return TRACEOFF(traceID, imgObj);
        }
        return TRACEOFF(traceID, false);
    };
    const setImgData = (imgRef, params, isSettingObject = true) => {
        const traceID = TRACEON("setImgData", [imgRef, params, isSettingObject]);
        const imgKey = getImgKey(imgRef);
        if (VAL({string: imgKey}, "setImgData")) {
            _.each(params, (v, k) => {
                if (imgKey in REGISTRY.IMG)
                    REGISTRY.IMG[imgKey][k] = v;
                else if (imgKey in REGISTRY.ANIM)
                    REGISTRY.ANIM[imgKey][k] = v;
            });
            if (isSettingObject) {
                setImgTemp(imgKey, params);
                if (getImgData(imgKey).padID)
                    DragPads.Sync(imgKey);
            }
            return TRACEOFF(traceID, REGISTRY.IMG[imgKey]);
        }
        return TRACEOFF(traceID, false);
    };
    const resizeImgs = (imgRefs, axes = []) => {
        const traceID = TRACEON("resizeImgs", [imgRefs, axes]);
        const imgObjs = imgRefs.map((x) => getImgObj(x));
        for (const imgObj of imgObjs) {
            const dims = {height: STATE.REF.anchorObj.height, width: STATE.REF.anchorObj.width};
            if (axes.length === 1)
                if (axes.includes("horiz") || axes.includes("width"))
                    dims.height = imgObj.get("height") * (dims.width / imgObj.get("width"));
                else if (axes.includes("vert") || axes.includes("height"))
                    dims.width = imgObj.get("width") * (dims.height / imgObj.get("height"));
            imgObj.set(dims);
        }
        TRACEOFF(traceID);
    };
    const toggleImg = (imgRef, isActive, isForcing = false) => {
        const traceID = TRACEON("toggleImg", [imgRef, isActive, isForcing]);
        // NON-PERMANENT.  If turning off, set activeSrc to curSrc.
        // Also, verify img status is changing before doing anything.
        if (isActive === null)
            return TRACEOFF(traceID, null);
        // Check if it's an animation object, then turn it off that way.
        if (isRegAnim(imgRef))
            return TRACEOFF(traceID, toggleAnimation(imgRef, isActive));
        const regRef = getRegistryRef(imgRef);
        const imgData = getImgData(imgRef) || (VAL({object: imgRef}) && {isActive: imgRef.get("layer") === "walls"});
        const modeData = getModeData(imgRef, Session.Mode);
        if (VAL({list: [imgData, modeData]}, "toggleImg", true)) {
            let activeCheck = null;
            if ((isActive === true || (isActive !== false && !imgData.isActive)) && modeData.isForcedOn !== "NEVER")
                activeCheck = true;
            else if (isActive === false || (isActive !== true && imgData.isActive) || (modeData.isForcedOn === "NEVER" && imgData.isActive))
                activeCheck = false;
            if (activeCheck === null || (!isForcing && imgData.isActive === activeCheck))
                return TRACEOFF(traceID, null);
            const imgObj = getImgObj(imgData.name) || (VAL({graphicObj: imgRef}) && imgRef);
            DragPads.Toggle(imgData.name, activeCheck, true);
            if (activeCheck === false) {
                // TURN OFF: Set layer to walls, toggle off associated drag pads, update activeState value
                if (REGISTRY.IMG[imgData.name])
                    regRef[imgData.name].activeSrc = (imgData.curSrc === "blank" && imgData.activeSrc) || imgData.curSrc;
                DB({imgData, name: imgData.name}, "toggleImg");
                regRef[imgData.name].isActive = false;
                setLayer(imgObj, "walls", isForcing);
                return TRACEOFF(traceID, false);
            } else if (activeCheck === true) {
                // TURN ON: Set layer to active layer, toggle on associated drag pads, restore activeState value if it's different
                DB({imgData, name: imgData.name}, "toggleImg");
                regRef[imgData.name].isActive = true;
                setLayer(imgObj, imgData.activeLayer, isForcing);
                return TRACEOFF(traceID, true);
            }
        }
        return TRACEOFF(traceID, null);
    };
    const removeImg = (imgRef, isUnregOnly) => {
        const traceID = TRACEON("removeImg", [imgRef, isUnregOnly]);
        const imgObj = getImgObj(imgRef);
        const imgData = getImgData(imgRef);
        const ref = (isRegAnim(imgObj) && REGISTRY.ANIM) || REGISTRY.IMG;
        DragPads.DelPad(imgObj);
        if (imgObj && !isUnregOnly) {
            imgObj.remove();
            delete ref[imgData.name];
            return TRACEOFF(traceID, true);
        } else if (imgData && ref[imgData.name]) {
            delete ref[imgData.name];
            return TRACEOFF(traceID, true);
        } else if (_.isString(imgRef) && ref[imgRef]) {
            delete ref[imgRef];
            return TRACEOFF(traceID, true);
        }
        return TRACEOFF(traceID, THROW(`Invalid image reference ${D.JSL(imgRef)}`, "removeImg"));
    };
    const removeImgs = (imgString, isUnregOnly) => {
        const traceID = TRACEON("removeImgs", [imgString, isUnregOnly]);
        const imgNames = _.filter([...Object.keys(REGISTRY.IMG), ...Object.keys(REGISTRY.ANIM)], (v) => v.includes(imgString));
        for (const imgName of imgNames)
            removeImg(imgName, isUnregOnly);
        TRACEOFF(traceID);
    };
    const checkDragPads = () => {
        const traceID = TRACEON("checkDragPads", []);
        const reportLines = [];
        const allImgObjs = findObjs({
            _type: "graphic",
            _pageid: D.MAINPAGEID
        });
        const allPadObjs = allImgObjs.filter((x) => x.get("name").endsWith("_Pad") || x.get("name").endsWith("_PartnerPad"));
        const allPadIDs = allPadObjs.map((x) => x.id);
        const mediaDragPadIDs = D.KeyMapObj(
            _.omit(REGISTRY.IMG, (v) => !v.padID && !v.partnerID),
            (k, v) => v.id,
            (v) => [v.padID, v.partnerID]
        );
        const dpadDragPadIDs = _.uniq(Object.keys(DragPads.PadsByID));
        // Step 1) Check DragPads. Make sure they are listed in REGISTRY.IMG **AND** DragPads stateref.
        if (
            _.isEqual(_.uniq(_.flatten(_.values(mediaDragPadIDs))).sort(), dpadDragPadIDs.sort())
            && _.isEqual(dpadDragPadIDs.sort(), allPadIDs.sort())
        ) {
            D.Alert("All Pads Equal!", "Drag Pad Check");
        } else {
            const missingDragPadIDs = _.without(dpadDragPadIDs, ..._.uniq(_.flatten(_.values(mediaDragPadIDs))));
            reportLines.push(...missingDragPadIDs.map((x) => `<b>${DragPads.PadsByID[x].name}</b> (${x})`));
            D.Alert(
                `Pad List DOES NOT Equal.<br><br><b>Found ${allPadIDs.length} Pads.<br>${
                    _.uniq(_.flatten(_.values(mediaDragPadIDs))).length
                } Pads in REGISTRY.<br>${dpadDragPadIDs.length} Pads in DRAGPADS.<br><br>${reportLines.join("<br>")}`,
                "Drag Pad Check"
            );
        }
        return TRACEOFF(traceID, reportLines);
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
    };
    const clearMissingRegImgs = () => {
        const traceID = TRACEON("clearMissingRegImgs", []);
        const returnLines = [];
        for (const imgName of Object.keys(REGISTRY.IMG))
            if (!getImgObj(imgName))
                returnLines.push(
                    `... ${imgName} Missing Object, Removing: ${
                        removeImg(imgName) ? "<span style='color: green;'><b>OK!</b></span>" : "<span style='color: red;'><b>ERROR!</b></span>"
                    }`
                );

        if (returnLines.length)
            STATE.REF.fixAllCommands.push(...["<h3><u>Removing Unlinked Image Registry Entries</u></h3>", ...returnLines]);
        TRACEOFF(traceID);
    };
    const resetBGImgs = () => {
        const traceID = TRACEON("resetBGImgs", []);
        for (const imgObj of getImgObjs(BGIMGS.keys))
            setImgData(
                imgObj,
                {
                    top: BGIMGS.top,
                    left: BGIMGS.left,
                    height: BGIMGS.height,
                    width: BGIMGS.width
                },
                true
            );
        for (const imgObj of getImgObjs(MAPIMGS.keys))
            setImgData(
                imgObj,
                {
                    top: MAPIMGS.top,
                    left: MAPIMGS.left,
                    height: MAPIMGS.height,
                    width: MAPIMGS.width
                },
                true
            );
        TRACEOFF(traceID);
    };
    const clearUnregImgs = (isKilling = false, isQueueing = true) => {
        const traceID = TRACEON("clearUnregImgs", [isKilling, isQueueing]);
        const returnLines = [];
        const allImgObjs = findObjs({
            _type: "graphic"
        });
        const regPadIDs = Object.values(REGISTRY.IMG)
            .filter((x) => x.padID)
            .map((x) => x.padID);
        const regPartnerIDs = Object.values(REGISTRY.IMG)
            .filter((x) => x.partnerID)
            .map((x) => x.partnerID);
        const allRegIDs = [..._.values(REGISTRY.GRAPHIC).map((x) => x.id), ...regPadIDs, ...regPartnerIDs];
        const unregImgObjs = allImgObjs.filter((x) => !isRegToken(x) && !allRegIDs.includes(x.id));

        // D.Alert(`RegPadIDs: ${D.JSL(regPadIDs)}<br><br>PartnerIDs: ${D.JSL(regPartnerIDs)}`)
        for (const imgObj of unregImgObjs) {
            const imgSrc = imgObj.get("imgsrc");
            if (imgSrc.includes("webm"))
                returnLines.push(
                    `<div style="display: block; height: 60px; width: auto;"><b>${imgObj.get("name")
                    || "(UNNAMED)"}</b><br><span style='color: blue;'><b>${
                        imgObj.id
                    }</b></span><span style='color: red;'><b>REMOVED</b></span><br>${imgSrc}</div>`
                );
            else
                returnLines.push(
                    `<div style="display: block; height: 60px; width: auto; background: url('${imgSrc}') no-repeat; background-size: contain;"><b>${imgObj.get(
                        "name"
                    ) || "(UNNAMED)"}</b><br><span style='color: blue;'><b>${
                        imgObj.id
                    }</b></span><span style='color: red;'><b>REMOVED</b></span></div>`
                );
            if (isKilling)
                imgObj.remove();
        }
        if (returnLines.length)
            if (isQueueing)
                STATE.REF.fixAllCommands.push(...["<h4><u>Clearing Unregistered Image Objects</u></h4>", ...returnLines]);
            else
                D.Alert(D.JS(["<h4><u>Clearing Orphan Images</u></h4>", ...returnLines].join("")), "clearUnregImgs");
        TRACEOFF(traceID);
    };
    const toggleLoadingScreen = (imgSrc, customText = " ", progressBarData = false) => {
        const traceID = TRACEON("toggleLoadingScreen", [imgSrc, customText, progressBarData]);
        const [imgObj, animObj, textObj, shadowObj, progressBarObj, progressMatteObj] = [
            getImgObj("LoadingScreen"),
            getImgObj("LoadingMoon"),
            getTextObj("LoadingMessage"),
            getTextShadowObj("LoadingMessage"),
            getTextObj("LoadingProgressBar"),
            getImgObj("LoadingProgressMatte")
        ];
        if (imgSrc) {
            Media.ToggleImg("LoadingScreen", true, true);
            Media.SetImg("LoadingScreen", imgSrc);
            Media.ToggleAnim("LoadingMoon", true, true);
            Media.ToggleText("LoadingMessage", true, true);
            Media.ToggleText("LoadingProgressBar", true, true);
            Media.ToggleImg("LoadingProgressMatte", true, true);
            setLoadingText(customText);
            toFront(progressMatteObj);
            toFront(animObj);
            toFront(progressBarObj);
            toFront(imgObj);
            toFront(shadowObj);
            toFront(textObj);
            if (VAL({list: progressBarData})) {
                Media.ToggleText("LoadingProgressBar", true, true);
                startProgressBar(progressBarData.duration, progressBarData.numTicks, () => {
                    Media.ToggleImg("LoadingScreen", false, true);
                    Media.ToggleAnim("LoadingMoon", false, true);
                    Media.ToggleText("LoadingMessage", false, true);
                    Media.ToggleText("LoadingProgressBar", false, true);
                    Media.ToggleImg("LoadingProgressMatte", false, true);
                    if (VAL({function: progressBarData.callback}))
                        progressBarData.callback();
                });
            }
        } else {
            Media.ToggleImg("LoadingScreen", false, true);
            Media.ToggleAnim("LoadingMoon", false, true);
            Media.ToggleText("LoadingMessage", false, true);
            Media.ToggleText("LoadingProgressBar", false, true);
            Media.ToggleImg("LoadingProgressMatte", false, true);
            stopProgressBar();
        }
        TRACEOFF(traceID);
    };
    const setLoadingText = (textString = " ") => {
        const traceID = TRACEON("setLoadingText", [textString]);
        Media.SetText("LoadingMessage", D.JSL(textString));
        TRACEOFF(traceID);
    };
    const startProgressBar = (duration, numTicks, callback) => {
        numTicks = 22;
        const traceID = TRACEON("startProgressBar", [duration, numTicks, callback]);
        const timeline = TimeTracker.GetRandomTimeline(duration || 20, numTicks);
        const tickTimeline = () => {
            const innerTraceID = TRACEON("tickTimeline", []);
            if (timeline.length) {
                const stepTime = timeline.pop();
                Media.SetText("LoadingProgressBar", "█".repeat(numTicks - timeline.length));
                progressBarTimer = setTimeout(tickTimeline, stepTime);
                return TRACEOFF(innerTraceID, progressBarTimer);
            } else {
                Media.ToggleText("LoadingProgressBar", false, true);
                clearTimeout(progressBarTimer);
                progressBarTimer = null;
                if (VAL({function: callback}))
                    return TRACEOFF(innerTraceID, callback());
                return TRACEOFF(innerTraceID, true);
            }
        };
        Media.SetText("LoadingProgressBar", " ");
        Media.ToggleText("LoadingProgressBar", true, true);
        Media.ToggleImg("LoadingProgressMatte", true, true);
        tickTimeline();
        TRACEOFF(traceID);
    };
    const stopProgressBar = () => {
        const traceID = TRACEON("stopProgressBar", []);
        Media.ToggleText("LoadingProgressBar", false, true);
        Media.ToggleImg("LoadingProgressMatte", false, true);
        clearTimeout(progressBarTimer);
        progressBarTimer = null;
        TRACEOFF(traceID);
    };
    const fixImgObjs = (isQueueing = false) => {
        const traceID = TRACEON("fixImgObjs", [isQueueing]);
        // D.Alert(`Starting FixImgObjects: ${D.JS(REGISTRY.ANIM.MapIndicator.isActive)}`)
        const imgKeys = [...Object.keys(REGISTRY.IMG), ...Object.keys(REGISTRY.ANIM)];
        const imgPairs = _.zip(
            imgKeys.map((x) => REGISTRY.IMG[x] || REGISTRY.ANIM[x]),
            imgKeys.map((x) => getObj("graphic", (REGISTRY.IMG[x] || REGISTRY.ANIM[x]).id))
        );
        const reportLines = [];
        // D.Alert(`Beginning Checks: ${D.JS(REGISTRY.ANIM.MapIndicator.isActive)}`)
        for (const [imgData, imgObj] of imgPairs) {
            if (!imgObj) {
                reportLines.push(`No <b>OBJECT</b> found for ${D.JS(imgData)}: Continuing...`);
                continue;
            }
            const regRef = getRegistryRef(imgData.name);
            if (!regRef) {
                reportLines.push(`No <b>REGISTRY REFERENCE</b> for ${imgData.name}: Continuing...`);
                continue;
            }
            const reportStrings = [];
            if (!isRegToken(imgObj) && !imgData.isSetToken && imgObj.get("isdrawing") !== true) {
                reportStrings.push("Non-token not set to drawing --> Updating <b><u>OBJECT</u></b>");
                // reportStrings.push(`...${isRegToken(imgObj)}, ${D.JS(imgData.isSetToken)}, ${imgObj.get("isdrawing")}`)
                imgObj.set("isdrawing", true);
            }
            if ((isRegToken(imgObj) || imgData.isSetToken) && imgObj.get("isdrawing") === true) {
                reportStrings.push("Set-token set to drawing --> Updating <b><u>OBJECT</u></b>");
                // reportStrings.push(`...${isRegToken(imgObj)}, ${D.JS(imgData.isSetToken)}, ${imgObj.get("isdrawing")}`)
                imgObj.set("isdrawing", false);
            }
            if (imgData.isActive !== true && imgData.isActive !== false) {
                reportStrings.push(
                    `Invalid 'isActive' (${D.JS(imgData.isActive)})! On '${imgObj.get("layer")}' SO Setting ${
                        imgObj.get("layer") === "walls" ? "FALSE" : "TRUE"
                    }`
                );
                regRef[imgData.name].isActive = imgObj.get("layer") !== "walls";
            }
            if (imgData.isActive === true && imgObj.get("layer") === "walls") {
                reportStrings.push(`Active object on 'walls' --> moving to '${D.JS(imgData.activeLayer)}'`);
                imgObj.set("layer", imgData.activeLayer);
            }
            if (imgData.isActive === false && imgObj.get("layer") !== "walls") {
                reportStrings.push(`Inactive object on '${imgObj.get("layer")}' --> moving to 'walls'`);
                imgObj.set("layer", "walls");
            }
            if (!isRegAnim(imgObj)) {
                const srcURL = getURLFromSrc(imgData.curSrc, getImgSrcs(imgData.name));
                const realURL = imgObj.get("imgsrc");
                if (srcURL !== realURL)
                    if (VAL({string: srcURL}) && srcURL.startsWith("http")) {
                        reportStrings.push(
                            `Image source URL doesn't match registry source (= ${D.JS(imgData.curSrc)}) --> Updating <b><u>OBJECT</u></b>`
                        );
                        imgObj.set("imgsrc", srcURL);
                    } else {
                        const realSrc = getSrcFromURL(realURL, getImgSrcs(imgData.name));
                        if (VAL({string: realSrc}) && realSrc in imgData.srcs) {
                            reportStrings.push(
                                `Image source URL doesn't match registry source (= ${D.JS(
                                    imgData.curSrc
                                )}) BUT couldn't get a valid URL from registry src --> Updating <b><u>REGISTRY</u> to '${D.JSL(realSrc)}'</b>`
                            );
                            regRef[imgData.name].curSrc = realSrc;
                        } else {
                            reportStrings.push(
                                `Image source URL doesn't match registry source (= ${D.JS(
                                    imgData.curSrc
                                )}) AND couldn't find a valid Src. <span style="color: red; background-color: darkred;"> <b>MANUAL FIX REQUIRED!</b> </span>`
                            );
                        }
                    }
                const srcRef = getSrcFromURL(imgObj.get("imgsrc"), getImgSrcs(imgData.name));
                if (srcRef === false) {
                    reportStrings.push(`Unable to determine srcName from URL '${imgObj.get("imgsrc")}'.`);
                } else {
                    if (srcRef !== imgData.curSrc) {
                        reportStrings.push(
                            `Registry source (${D.JS(imgData.curSrc)}) doesn't match object source (${D.JS(
                                srcRef
                            )}) --> Updating <b><u>REGISTRY</u></b>`
                        );
                        regRef[imgData.name].curSrc = srcRef;
                    }
                    setImg(imgData.name, imgData.curSrc, null, true);
                }
            }
            toggleImg(imgData.name, imgData.isActive, true);
            if (reportStrings.length)
                reportLines.push(...[`<b>${imgData.name}</b>`, reportStrings.map((x) => `... ${x}`).join("<br>")]);
        }
        // layerImgs(imgKeys, null, true)
        if (reportLines.length)
            if (isQueueing)
                STATE.REF.fixAllCommands.push(...["<h3><u>Final Image Object Pass</u></h3>", ...reportLines]);
            else
                D.Alert(["<h3><u>Fixing Image Objects</u></h3>", ...reportLines].join("<br>"), "fixImgObjs");
        TRACEOFF(traceID);
    };
    const layerImgs = (imgRefs, layer, isSilent = false) => {
        const traceID = TRACEON("layerImgs", [imgRefs, layer, isSilent]);
        const imgObjs = getImgObjs(imgRefs);
        // orderImgs(IMGLAYERS.objects)
        for (const imgObj of imgObjs)
            if (VAL({imgObj})) {
                const imgData = getImgData(imgObj.id);
                layer = layer || (imgData.isActive && imgData.activeLayer) || "walls" || "";
                imgObj.set({layer});
            } else if (!isSilent) {
                D.Alert(`No image found for reference ${D.JS(imgObj)}`, "MEDIA: layerImgs");
            }
        TRACEOFF(traceID);
    };
    const setImgArea = (imgRef, areaRef, isResizing = false) => {
        const traceID = TRACEON("setImgArea", [imgRef, areaRef, isResizing]);
        if (!imgRef)
            return TRACEOFF(traceID, false);
        const imgObj = getImgObj(imgRef);
        const areaData = getAreaData(areaRef);
        if (!imgObj)
            return TRACEOFF(traceID, D.Alert(`Invalid image reference: ${D.JS(imgRef)}`, "MEDIA: setImgArea"));
        else if (!areaData)
            return TRACEOFF(traceID, D.Alert(`No area registered as '${D.JS(areaRef)}'`, "MEDIA: setImgArea"));
        const imgParams = {
            top: areaData.top,
            left: areaData.left
        };
        if (isResizing) {
            imgParams.height = areaData.height;
            imgParams.width = areaData.width;
        }
        imgObj.set(imgParams);
        return TRACEOFF(traceID, true);
    };
    const spreadImgs = (leftImgRef, rightImgRef, midImgRefOrRefs, width, minOverlap = 20, maxOverlap = 40) => {
        const traceID = TRACEON("spreadImgs", [leftImgRef, rightImgRef, midImgRefOrRefs, width, minOverlap, maxOverlap]);
        DB(
            {
                leftImgRef,
                rightImgRef,
                midImgRefOrRefs,
                width,
                minOverlap,
                maxOverlap
            },
            "spreadImgs"
        );
        midImgRefOrRefs = _.flatten([midImgRefOrRefs]);
        const [leftObj, rightObj, ...midObjs] = [getImgObj(leftImgRef), getImgObj(rightImgRef), ...midImgRefOrRefs.map((x) => getImgObj(x))];
        const [leftData, rightData, ...midData] = [leftObj, rightObj, ...midObjs].map(
            (x) => (isRegImg(x) && getImgData(x)) || {
                id: x.id,
                name: x.get("name"),
                left: x.get("left"),
                width: x.get("width"),
                leftEdge: x.get("left") - 0.5 * x.get("width"),
                rightEdge: x.get("left") + 0.5 * x.get("width")
            }
        );
        if (!VAL({number: width})) {
            const [startPos, endPos] = [leftData.left, rightData.left];
            const buffer = (endPos - startPos) / (midObjs.length + 1);
            for (let i = 0; i < midObjs.length; i++)
                setImgTemp(midObjs[i], {left: startPos + (i + 1) * buffer});
            return TRACEOFF(traceID, true);
        }
        const spread = parseFloat(VAL({number: width}) ? width : rightData.left - leftData.left);
        let dbString = `Width: ${spread}, MinOverlap: ${parseFloat(minOverlap)}, MaxOverlap: ${parseFloat(maxOverlap)}<br><br>`;
        DB(`minOverlap: ${minOverlap}, maxOverlap: ${maxOverlap}`);
        if (VAL({list: [leftData, rightData, ...midData], number: [spread]}, "spreadImgs", true)) {
            for (const imgRef of [leftData.name, rightData.name])
                toggleImg(imgRef, true);
            setImgTemp(leftData.id, {left: leftData.left});
            dbString += `Setting Left to {left: ${D.Int(leftData.left)}}<br>`;
            // If the spread is smaller than the combined width of the bookends, then set the minimum possible spread and blank all mid imgs.
            if (spread <= leftData.width + rightData.width - maxOverlap) {
                dbString += `Spread ${D.Int(spread)} less than ${D.Int(leftData.width + rightData.width - 2 * maxOverlap)} (${D.Int(
                    leftData.width
                )} + ${D.Int(rightData.width)} - ${2 * D.Int(maxOverlap)})<br>`;
                for (const imgData of midData)
                    toggleImg(imgData.id, false);
                DB(
                    `${dbString}Setting Right to {left: ${D.Int(leftData.rightEdge)} + 0.5x${D.Int(rightData.width)} - ${D.Int(maxOverlap)} = ${D.Int(
                        leftData.rightEdge + 0.5 * rightData.width
                    ) - D.Int(maxOverlap)}`,
                    "spreadImgs"
                );
                return TRACEOFF(
                    traceID,
                    setImgTemp(rightData.id, {
                        left: leftData.rightEdge + 0.5 * rightData.width - maxOverlap
                    })
                );
            }
            // Otherwise, determine how much space will be in the middle.  Does NOT count overlap of left and right sides.
            let totalMidWidth = spread - leftData.width - rightData.width + 2 * minOverlap;
            dbString += `Total Mid Width = ${D.Int(totalMidWidth)} (spr:${D.Int(spread)} - L.w:${D.Int(leftData.width)} - R.w:${D.Int(
                rightData.width
            )})<br>`;
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
                    return TRACEOFF(traceID, true)
                } else { */

            // If multiple middle imgs were specified, first determine the minimum and maximum amount each can cover based on overlap.
            // The "real" minOverlap is twice the given value, since offsetting an image by one minOverlap width will result in a minOverlap covering another minOverlap.
            const midImgWidth = midData[0].width;
            const [minCover, maxCover] = [Math.max(0, midImgWidth - 2 * maxOverlap), Math.max(0, midImgWidth - 1.5 * minOverlap)];
            const midImgIDs = [];
            dbString += `midWidth: ${D.Int(midData[0].width)}, maxCover: ${D.Int(maxCover)}, minCover: ${D.Int(minCover)}<br>`;
            // Now add mid imgs one by one until their total MAX cover equals or exceeds the spread:
            let coveredSpread = 0;
            while (coveredSpread < totalMidWidth)
                if (midData.length) {
                    toggleImg(_.last(midData).id, true);
                    setImg(_.last(midData).id, "base", true, true);
                    midImgIDs.push(midData.pop().id);
                    coveredSpread += maxCover;
                    dbString += `... adding ${getImgKey(_.last(midImgIDs))} (cover: ${D.Int(coveredSpread)}), ${midData.length} remaining<br>`;
                } else {
                    dbString += `Ran out of mid images! ${totalMidWidth - coveredSpread} to cover!`;
                    totalMidWidth = coveredSpread;
                    break;
                }

            // Now divide up the spread among the imgs, and check that each img's cover is between min and max:
            const spreadPerImg = totalMidWidth / midImgIDs.length;

            // Toggle off unused mid sections
            while (midData.length) {
                dbString += `... turning off ${_.last(midData).name}<br>`;
                toggleImg(midData.pop().id, false);
            }
            dbString += "<br>";

            dbString += `SPI = ${D.Int(spreadPerImg)} = TMW:${D.Int(totalMidWidth)} / #Mids:${midImgIDs.length}<br>`;
            if (spreadPerImg < minCover || spreadPerImg > maxCover)
                THROW(
                    `Unable to spread given images over spread ${spread}: per-img spread of ${spreadPerImg} outside bounds of ${minCover} - ${maxCover}`,
                    "spreadImgs"
                );
            // Get the actual overlap between imgs, dividing by two to get the value for one side,
            // and use this number to get the left position for the first middle img.
            const sideOverlap = 0.5 * (midImgWidth - spreadPerImg);
            const firstMidLeft = leftData.rightEdge - 2 * sideOverlap + 0.5 * midImgWidth;
            dbString += `Side Overlap: ${D.Int(sideOverlap)} = 0.5x(M.w:${D.Int(midImgWidth)} - SPI:${D.Int(spreadPerImg)})<br>`;
            dbString += `L.l: ${D.Int(leftData.left)}, L.re: ${D.Int(leftData.rightEdge)}, firstMidLeft: ${D.Int(firstMidLeft)} (L.re - sO:${D.Int(
                sideOverlap
            )} + 0.5xM.w:${D.Int(midImgWidth)})<br><br>`;
            dbString += `LEFT: ${D.Int(leftData.left - 0.5 * leftData.width)} - ${D.Int(leftData.rightEdge)}<br>`;
            // Turn on each midImg being used and set the left positioning of each mid img by recursively adding the spreadPerImg:
            let lastRightEdge = D.Int(leftData.rightEdge),
                currentLeft = firstMidLeft;
            for (const imgID of midImgIDs) {
                setImgTemp(imgID, {
                    left: currentLeft
                });
                dbString += `... Spreading Mid ${getImgKey(imgID).replace(/^.*_(\d\d?)$/gu, "$1")} to ${D.Int(
                    currentLeft - 0.5 * midImgWidth
                )} - ${D.Int(currentLeft + 0.5 * midImgWidth)} (-${lastRightEdge - D.Int(currentLeft - 0.5 * midImgWidth)})<br>`;
                lastRightEdge = D.Int(currentLeft + 0.5 * midImgWidth);
                currentLeft += spreadPerImg;
                // testVertSpread += 5
            }

            // Finally, set the position of the rightmost img to the far side of the total width:
            setImgTemp(rightData.id, {
                left: leftData.leftEdge + totalMidWidth + leftData.width + rightData.width - 2 * minOverlap - 0.5 * rightData.width
            });
            dbString += `RIGHT: ${D.Int(
                leftData.leftEdge + totalMidWidth + leftData.width + rightData.width - 2 * minOverlap - 0.5 * rightData.width - 0.5 * rightData.width
            )} - ${D.Int(
                leftData.leftEdge + totalMidWidth + leftData.width + rightData.width - 2 * minOverlap - 0.5 * rightData.width + 0.5 * rightData.width
            )} (${lastRightEdge
            - D.Int(
                leftData.leftEdge
                + totalMidWidth
                + leftData.width
                + rightData.width
                - 2 * minOverlap
                - 0.5 * rightData.width
                - 0.5 * rightData.width
            )})`;
            DB(dbString, "spreadImgs");
            // for (const imgData of midData)
            //    setImg(imgData.id, "blank")
            return TRACEOFF(traceID, true);
            // }
        }
        return TRACEOFF(traceID, false);
    };
    const bindImgs = (imgRefs, isUnbinding = false) => {
        // Get a list of ALL associated image keys.
        // For each key, register it in STATE.REF.boundImages by its key, to an array containing all other keys.
        const imgKeys = imgRefs.map((x) => {
            if (VAL({char: x})) {
                const [tokenObj] = getTokenObjs(x);
                if (tokenObj)
                    return tokenObj.get("name");
                return D.GetName(x);
            }
            return getImgKey(x);
        });
        DB({imgKeys: imgKeys.join(", ")}, "bindImgs");
        const reportLines = [];
        for (const imgKey of imgKeys)
            if (isUnbinding) {
                delete STATE.REF.boundImages[imgKey];
                reportLines.push(`UNBOUND ${imgKey}`);
            } else {
                STATE.REF.boundImages[imgKey] = _.without(imgKeys, imgKey);
                reportLines.push(`BOUND ${imgKey}: ${_.without(imgKeys, imgKey).join(", ")}`);
            }
        D.Alert(reportLines.join("<br>"), "bindImgs");
    };
    // #endregion

    // #region ANIMATIONS: Creating, Timeouts, Controlling WEBM Animations
    const isRegAnim = (animRef) => {
        const traceID = TRACEON("isRegAnim", [animRef]);
        const imgObj = getImgObj(animRef);
        return TRACEOFF(traceID, imgObj && imgObj.get("name") in REGISTRY.ANIM);
    };
    const regAnimation = (imgObj, animName, timeOut = 0, activeLayer = "map") => {
        const traceID = TRACEON("regAnimation", [imgObj, animName, timeOut, activeLayer]);
        if (VAL({imgObj}, "regAnimation")) {
            imgObj.set("name", animName);
            imgObj.set("layer", activeLayer);
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
            };
            REGISTRY.ANIM[animName].leftEdge = REGISTRY.ANIM[animName].left - 0.5 * REGISTRY.ANIM[animName].width;
            REGISTRY.ANIM[animName].rightEdge = REGISTRY.ANIM[animName].left + 0.5 * REGISTRY.ANIM[animName].width;
            REGISTRY.ANIM[animName].topEdge = REGISTRY.ANIM[animName].top - 0.5 * REGISTRY.ANIM[animName].height;
            REGISTRY.ANIM[animName].bottomEdge = REGISTRY.ANIM[animName].top + 0.5 * REGISTRY.ANIM[animName].height;
        }
        TRACEOFF(traceID);
    };
    const setAnimData = (animRef, params) => {
        const traceID = TRACEON("setAnimData", [animRef, params]);
        const imgKey = getImgKey(animRef);
        if (VAL({string: imgKey}, "setAnimData")) {
            _.each(params, (v, k) => {
                REGISTRY.ANIM[imgKey][k] = v;
            });
            getImgObj(imgKey).set(params);
            return TRACEOFF(traceID, REGISTRY.ANIM[imgKey]);
        }
        return TRACEOFF(traceID, false);
    };
    const setAnimTimerData = (animName, minTimeBetween = 0, maxTimeBetween = 100, soundEffect = null, validModes = "Active") => {
        const traceID = TRACEON("setAnimTimerData", [animName, minTimeBetween, maxTimeBetween, soundEffect, validModes]);
        const animData = getImgData(animName);
        animData.minTimeBetween = D.Int(1000 * D.Float(minTimeBetween));
        animData.maxTimeBetween = D.Int(1000 * D.Float(maxTimeBetween));
        animData.soundEffect = soundEffect;
        animData.validModes = validModes.split("|");
        TRACEOFF(traceID);
    };
    const flashAnimation = (animName) => {
        const traceID = TRACEON("flashAnimation", [animName]);
        const animData = getImgData(animName);
        if (!animData.validModes.includes(Session.Mode)) {
            deactivateAnimation(animName);
        } else if (animData.isActive) {
            const animObj = getImgObj(animName);
            animObj.set("layer", animData.activeLayer);
            if (animData.soundEffect && animData.validModes.includes(Session.Mode))
                Soundscape.Play(animData.soundEffect);
            if (animData.timeOut)
                setTimeout(() => killAnimation(animObj), animData.timeOut);
        }
        TRACEOFF(traceID);
    };
    const activateAnimation = (animNames, minTime, maxTime, minBuffer = 0) => {
        const traceID = TRACEON("activateAnimation", [animNames, minTime, maxTime, minBuffer]);
        const animTimes = [];
        minTime = D.Int(1000 * D.Float(minTime));
        maxTime = D.Int(1000 * D.Float(maxTime));
        minBuffer = D.Int(1000 * D.Float(minBuffer));
        for (const animName of _.flatten([animNames])) {
            const animData = getImgData(animName);
            animData.minTimeBetween = minTime || animData.minTimeBetween;
            animData.maxTimeBetween = maxTime || animData.maxTimeBetween;
            let pulseTime = randomInteger(animData.maxTimeBetween - animData.minTimeBetween) + animData.minTimeBetween;
            if (animTimers[animName]) {
                clearTimeout(animTimers[animName]);
                delete animTimers[animName];
            }
            animData.isActive = true;
            if (Math.abs(D.Int(animTimes[0]) - pulseTime) < minBuffer)
                if (animTimes[0] > pulseTime) {
                    animTimes[0] = pulseTime;
                    pulseTime += minBuffer;
                } else {
                    pulseTime = animTimes[0] + minBuffer;
                }
            animTimes.unshift(pulseTime);
        }
        for (const animName of _.flatten([animNames]))
            setTimeout(() => {
                pulseAnimation(animName);
            }, animTimes.pop());
        TRACEOFF(traceID);
    };
    const pulseAnimation = (animName) => {
        const traceID = TRACEON("pulseAnimation", [animName]);
        const animData = getImgData(animName);
        if (animTimers[animName]) {
            clearTimeout(animTimers[animName]);
            delete animTimers[animName];
        }
        if (animData.isActive) {
            const timeBetween = randomInteger(animData.maxTimeBetween - animData.minTimeBetween) + animData.minTimeBetween;
            flashAnimation(animName);
            animTimers[animName] = setTimeout(() => {
                const innerTraceID = TRACEON("animTimer");
                pulseAnimation(animName);
                return TRACEOFF(innerTraceID);
            }, timeBetween);
        }
        TRACEOFF(traceID);
        // D.Alert(JSON.stringify(activeTimers[animName]))
    };
    const deactivateAnimation = (animName) => {
        const traceID = TRACEON("deactivateAnimation", [animName]);
        const animData = getImgData(animName);
        if (animTimers[animName]) {
            clearTimeout(animTimers[animName]);
            delete animTimers[animName];
        }
        animData.isActive = false;
        TRACEOFF(traceID);
    };
    const toggleAnimation = (animName, isActive) => {
        const traceID = TRACEON("toggleAnimation", [animName, isActive]);
        const animData = getImgData(animName);
        const animObj = getImgObj(animName);
        // DB({animData, animObj}, "toggleAnimation")
        if (isActive) {
            // DB("Setting to MAP", "toggleAnimation")
            animObj.set("layer", animData.activeLayer);
            REGISTRY.ANIM[animData.name].isActive = true;
        } else {
            // DB("Setting to WALLS", "toggleAnimation")
            animObj.set("layer", "walls");
            REGISTRY.ANIM[animData.name].isActive = false;
        }
        TRACEOFF(traceID);
    };
    const killAnimation = (animObj) => {
        const traceID = TRACEON("killAnimation", [animObj]);
        if (VAL({imgObj: animObj}, "killAnimation"))
            animObj.set("layer", "walls");
        TRACEOFF(traceID);
    };
    const killAllAnims = () => {
        const traceID = TRACEON("killAllAnims", []);
        for (const animData of _.values(REGISTRY.ANIM))
            (getObj("graphic", animData.id) || {set: () => false}).set("layer", "walls");
        TRACEOFF(traceID);
    };
    // #endregion

    // #region PANEL CONTROL: Displaying temporary text messages
    const PANELLEFT = 1250;
    const PANELTOP = 170;
    const PANELPOS = {
        top: (textHeight = 0) => PANELTOP + 0.5 * textHeight,
        left: (textWidth = 0) => PANELLEFT + 0.5 * textWidth
    };
    const killPanel = (panelKey) => {
        const traceID = TRACEON("killPanel", [panelKey]);
        if (panelKey in REGISTRY.PANELS) {
            setText(panelKey, " ");
            toggleText(panelKey, false);
            REGISTRY.PANELS[panelKey].textLines = [];
            killPanelBG(panelKey);
        }
        TRACEOFF(traceID);
    };
    const killPanelBG = (panelKey) => {
        const traceID = TRACEON("killPanelBG", [panelKey]);
        const panelBGObj = getObj("path", (REGISTRY.PANELS[panelKey] || {bgID: false}).bgID);
        if (panelBGObj) {
            panelBGObj.remove();
            delete REGISTRY.PANELS[panelKey].bgID;
        }
        TRACEOFF(traceID);
    };
    const resetPanelBG = (panelKey) => {
        const traceID = TRACEON("resetPanelBG", [panelKey]);
        const panelBGObj = getObj("path", (REGISTRY.PANELS[panelKey] || {bgID: false}).bgID);
        const panelTextHeight = getTextHeight(panelKey, (REGISTRY.PANELS[panelKey].textLines || [" "]).join("\n"));
        const panelTextWidth = C.SANDBOX.width - PANELLEFT; // getTextWidth(panelKey, (REGISTRY.PANELS[panelKey].textLines || [" "]).join("\n")) + 10,
        const panelBGPath = [
            ["M", 0, 0],
            ["L", panelTextWidth + 10, 0],
            ["L", panelTextWidth + 10, panelTextHeight + 20],
            ["L", 0, panelTextHeight + 20],
            ["L", 0, 0]
        ];
        const panelTop = PANELPOS.top(panelTextHeight) - 10;
        const panelLeft = PANELPOS.left(panelTextWidth) - 10;
        if (panelBGObj && panelBGObj.get("top") === panelTop && panelBGObj.get("left") === panelLeft)
            return TRACEOFF(traceID);
        killPanelBG(panelKey);
        const panelObj = createObj("path", {
            _pageid: D.THISPAGEID,
            fill: C.COLORS.black,
            path: JSON.stringify(panelBGPath),
            stroke: C.COLORS.brightred,
            stroke_width: 2,
            layer: "map",
            top: panelTop,
            left: panelLeft,
            height: panelTextHeight + 20,
            width: panelTextWidth + 10
        });
        toFront(panelObj);
        REGISTRY.PANELS[panelKey] = REGISTRY.PANELS[panelKey] || {};
        REGISTRY.PANELS[panelKey].bgID = panelObj.id;
        return TRACEOFF(traceID);
    };
    const togglePanel = (panelKey, isActive) => {
        const traceID = TRACEON("togglePanel", [panelKey, isActive]);
        if (isActive) {
            toggleText(panelKey, true);
            resetPanelBG(panelKey);
        } else {
            killPanelBG(panelKey);
            toggleText(panelKey, false);
        }
        TRACEOFF(traceID);
    };
    const addPanelText = (panelKey = "panel", text) => {
        const traceID = TRACEON("addPanelText", [panelKey, text]);
        text = VAL({string: text}) ? text : D.JSL(text);
        REGISTRY.PANELS[panelKey].textLines = REGISTRY.PANELS[panelKey].textLines || [];
        REGISTRY.PANELS[panelKey].textLines.push(text);
        togglePanel(panelKey, true);
        setText(panelKey, REGISTRY.PANELS[panelKey].textLines.join("\n"));
        setTimeout(() => {
            removePanelText(panelKey, text);
        }, 10000);
        TRACEOFF(traceID);
    };
    const removePanelText = (panelKey = "panel", delText = "", numRepeats = 2) => {
        const traceID = TRACEON("removePanelText", [panelKey, delText, numRepeats]);
        if (numRepeats === 0)
            return TRACEOFF(traceID);
        D.PullOut(REGISTRY.PANELS[panelKey].textLines, (v) => v === delText);
        if (REGISTRY.PANELS[panelKey].textLines.length) {
            setText(panelKey, (REGISTRY.PANELS[panelKey].textLines || [" "]).join("\n"));
            resetPanelBG(panelKey);
        } else {
            setText(panelKey, " ");
            togglePanel(panelKey, false);
        }
        setTimeout(() => {
            removePanelText(panelKey, delText, numRepeats - 1);
        }, 1000);
        return TRACEOFF(traceID);
    };
    // #endregion

    // #region TEXT OBJECT GETTERS: Text Object, Width Measurements, Data Retrieval
    const isRegText = (textRef) => Boolean(getTextKey(textRef, true)) || (VAL({object: textRef}) && _.findKey(REGISTRY.TEXT, (v) => v.shadowID === textRef.id));
    const getTextKey = (textRef, funcName = false) => {
        const traceID = TRACEON("getTextKey", [textRef, funcName]);
        try {
            let textObj;
            if (VAL({string: textRef})) {
                if (REGISTRY.TEXT[textRef])
                    return TRACEOFF(traceID, textRef);
                if (REGISTRY.ID[textRef])
                    return TRACEOFF(traceID, REGISTRY.ID[textRef]);
            }
            if (VAL({selected: textRef}))
                [textObj] = D.GetSelected(textRef);
            if (VAL({textObj: textRef}))
                textObj = textRef;
            if (VAL({textObj}))
                if (REGISTRY.ID[textObj.id])
                    return TRACEOFF(traceID, REGISTRY.ID[textObj.id]);
            return TRACEOFF(
                traceID,
                VAL({string: funcName}) && THROW(`Cannot locate text key with search value '${D.JSL(textRef)}'`, `${D.JSL(funcName)} > getTextKey`)
            );
        } catch (errObj) {
            return TRACEOFF(
                traceID,
                VAL({string: funcName})
                && THROW(`Cannot locate text key with search value '${D.JSL(textRef)}'`, `${D.JSL(funcName)} > getTextKey`, errObj)
            );
        }
    };
    const getTextObj = (textRef, funcName = false) => {
        const traceID = TRACEON("getTextObj", [textRef, funcName]);
        try {
            let textObj;
            if (VAL({textObj: textRef}))
                textObj = textRef;
            else if (VAL({string: textRef}))
                if (getTextKey(textRef, funcName))
                    textObj = getObj("text", REGISTRY.TEXT[getTextKey(textRef)].id);
                else
                    textObj = getObj("text", textRef) || null;
            else if (VAL({selected: textRef}))
                [textObj] = D.GetSelected(textRef);
            return TRACEOFF(
                traceID,
                textObj || (VAL({string: funcName}) && THROW(`Bad text reference: ${D.JSL(textRef)}`, `${D.JSL(funcName)} > getTextObj`))
            );
        } catch (errObj) {
            return TRACEOFF(
                traceID,
                VAL({string: funcName}) && THROW(`Bad text reference: ${D.JSL(textRef)}`, `${D.JSL(funcName)} > getTextObj`, errObj)
            );
        }
    };
    const getTextObjs = (textRefs, funcName = false) => {
        const traceID = TRACEON("getTextObjs", [textRefs, funcName]);
        textRefs = VAL({selection: textRefs}) ? D.GetSelected(textRefs) : _.flatten([textRefs]) || Object.keys(REGISTRY.TEXT);
        const textObjs = [];
        if (VAL({array: textRefs}))
            for (const textRef of textRefs)
                textObjs.push(getTextObj(textRef, funcName));
        return TRACEOFF(traceID, _.compact(textObjs));
    };
    const hasShadowObj = (textRef) => Boolean((getTextData(textRef) || {shadowID: false}).shadowID);
    const getTextShadowObj = (textRef) => getObj("text", (getTextData(textRef) || {shadowID: false}).shadowID);
    const getShadowShift = (textRef) => C.SHADOWOFFSETS[(getTextObj(textRef) || {get: () => 20}).get("font_size")];
    const getTextData = (textRef, funcName = false) => {
        const traceID = TRACEON("getTextData", [textRef, funcName]);
        try {
            if (getTextKey(textRef, funcName)) {
                return TRACEOFF(traceID, REGISTRY.TEXT[getTextKey(textRef, funcName)]);
            } else if (getTextObj(textRef, funcName)) {
                const textObj = getTextObj(textRef, funcName);
                DB(`Retrieving data for UNREGISTERED Text Object ${D.JSL(textRef)}`, "getTextData");
                return TRACEOFF(traceID, {
                    id: textObj.id,
                    left: D.Int(textObj.get("left")),
                    top: D.Int(textObj.get("top")),
                    height: D.Int(textObj.get("height")),
                    width: D.Int(textObj.get("width")),
                    font: textObj.get("font_family"),
                    fontSize: textObj.get("font_size"),
                    color: textObj.get("color"),
                    text: textObj.get("text")
                });
            }
            return TRACEOFF(
                traceID,
                VAL({string: funcName})
                && THROW(`Text reference '${textRef}' does not refer to a registered text object.`, `${D.JSL(funcName)} > getTextData`)
            );
        } catch (errObj) {
            return TRACEOFF(
                traceID,
                VAL({string: funcName})
                && THROW(`Text reference '${textRef}' does not refer to a registered text object.`, `${D.JSL(funcName)} > getTextData`, errObj)
            );
        }
    };
    const getLineHeight = (textRef) => {
        const traceID = TRACEON("getLineHeight", [textRef]);
        const textObj = getTextObj(textRef);
        if (VAL({textObj})) {
            const [fontFamily, fontSize, height] = [
                textObj
                    .get("font_family")
                    .toLowerCase()
                    .includes("contrail")
                    ? "Contrail One"
                    : textObj.get("font_family"),
                textObj.get("font_size"),
                textObj.get("height")
            ];
            // D.Alert([font_family, font_size, height, D.CHARWIDTH[font_family][font_size].lineHeight].join("<br>"))
            return TRACEOFF(
                traceID,
                (D.CHARWIDTH[fontFamily] && D.CHARWIDTH[fontFamily][fontSize] && D.CHARWIDTH[fontFamily][fontSize].lineHeight) || height
            );
        }
        return TRACEOFF(traceID, false);
    };
    const getSimpleTextWidth = (text, fontFamily, fontSize) => {
        const traceID = TRACEON("getSimpleTextWidth", [text, fontFamily, fontSize]);
        const sizeRef = D.IsIn(fontFamily, D.CHARWIDTH) && D.IsIn(fontSize, D.CHARWIDTH[fontFamily]) && D.CHARWIDTH[fontFamily][fontSize];
        const sizeDefault = VAL({array: sizeRef}) && D.Float(_.reduce(sizeRef, (tot = 0, n) => tot + n) / sizeRef.length, 2);
        const sizeArray = VAL({string: text}) && text.split("").map((x) => (x in sizeRef && sizeRef[x]) || sizeDefault);
        return TRACEOFF(
            traceID,
            _.reduce(sizeArray, (tot = 0, n) => tot + n)
        );
    };
    const getTextWidth = (textRef, text, maxWidth = 0, isSilent = true) => {
        const traceID = TRACEON("getTextWidth", [textRef, text, maxWidth, isSilent]);
        const textObj = getTextObj(textRef);
        const dbLines = [
            `<b>TEXTREF:</b> ${D.JSL(textRef)}`,
            `<b>TEXT:</b> ${D.JSL(text).replace(/ /gu, "⸰")}`,
            `<b>MAXWIDTH:</b> ${D.JSL(maxWidth)}`,
            ""
        ];
        if (VAL({textObj}, "getTextWidth")) {
            const textData = getTextData(textObj);
            const maxW = (textData && textData.maxWidth) || maxWidth || 0;
            const textString = text === "" ? "" : (text && `${text}`) || (textObj && textObj.get && `${textObj.get("text")}`) || false;
            const font = textObj
                .get("font_family")
                .split(" ")[0]
                .replace(/[^a-zA-Z]/gu, "");
            const size = textObj.get("font_size");
            const chars = textString.split("");
            const fontRef = D.CHARWIDTH[font];
            const charRef = fontRef && fontRef[size];
            let width = 0;
            dbLines.push(
                chars.length === textString.length ? "TEXT OK!" : `TEXT LENGTH MISMATCH: ${chars.length} chars, ${textString.length} text length.<br>`
            );
            if (!textString || textString === "" || textString.length === 0)
                return TRACEOFF(traceID, 0);
            if (!fontRef || !charRef) {
                dbLines.push(`No font/character reference for '${font}' at size '${size}': Returning default`, "getTextWidth");
                DB(dbLines.join("<br>"), "getTextWidth");
                return TRACEOFF(traceID, textString.length * (D.Int(textObj.get("width")) / textObj.get("text").length));
            }
            let textLines = [];
            if (maxWidth !== false && maxW)
                textLines = _.compact(splitTextLines(textObj, textString, maxW, textData && textData.justification));
            else if (maxWidth !== false && textString && textString.includes("\n"))
                textLines = textString
                    .split(/\n/gu)
                    .filter((x) => x || x === "" || x === 0)
                    .map((x) => x.trim());
            if (textLines.length) {
                dbLines.push(`Text split into text lines:<br>${textLines.map((x) => `▐${x.replace(/ /gu, "⸰")}▌ ► ${x.length} Chars`).join("<br>")}`);
                let maxLine = textLines[0];
                dbLines.push("Iterating Max-Line...");
                for (const textLine of textLines) {
                    dbLines.push(
                        `... MAX: ${D.Round(getTextWidth(textObj, maxLine, false, true), 2)} vs. TEXT: ${D.Round(
                            getTextWidth(textObj, textLine, false, true),
                            2
                        )}`
                    );
                    maxLine = getTextWidth(textObj, maxLine, false, true) < getTextWidth(textObj, textLine, false, true) ? textLine : maxLine;
                }
                dbLines.push(`Max Line: ▐${maxLine}▌ ► Returning maxline width (${D.Round(getTextWidth(textObj, maxLine, false, true), 2)})`);
                if (!isSilent)
                    DB(dbLines.join("<br>"), "getTextWidth");
                return TRACEOFF(traceID, getTextWidth(textObj, maxLine, false, true));
            }
            let charString = "";
            for (const char of chars) {
                charString += char;
                if (char !== "\n" && !charRef[char])
                    D.MissingTextChars = char;
                else
                    width += charRef[char];
            }
            dbLines.push(`Chars measured: ▐${charString}▌ ► Returning width (${D.Round(width, 2)}`);
            if (!isSilent)
                DB(dbLines.join("<br>"), "getTextWidth");
            /* if (maxWidth !== false)
                    D.Alert(`GetTextWidth called on ${text} with maxWidth ${D.JS(maxWidth)} and maxW ${D.JS(maxW)}`) */
            return TRACEOFF(traceID, width);
        }
        return TRACEOFF(traceID, false);
    };
    const getMaxWidth = (textRef) => {
        const traceID = TRACEON("getMaxWidth", [textRef]);
        const textObj = getTextObj(textRef);
        const splitLines = textObj.get("text").split(/\n/gu);
        let max = 0;
        for (const line of splitLines)
            max = Math.max(max, getTextWidth(textObj, line, false));
        return TRACEOFF(traceID, max);
    };
    const getTextLines = (textRef, text, maxWidth) => {
        const traceID = TRACEON("getTextLines", [textRef, text, maxWidth]);
        const textObj = getTextObj(textRef);
        const textData = getTextData(textRef);
        const textValue = text || textObj.get("text");
        maxWidth = maxWidth || (textData && textData.maxWidth);
        return TRACEOFF(
            traceID,
            maxWidth ? splitTextLines(textObj, textValue, maxWidth, textData.justification).length : (textValue.match(/\n/giu) || []).length + 1
        );
    };
    const getTextHeight = (textRef, text, maxWidth) => (getTextData(textRef) || {lineHeight: "10"}).lineHeight * getTextLines(textRef, text, maxWidth);
    const getBlankLeft = (textRef, justification, maxWidth = 0, useCurrent = false) => {
        const traceID = TRACEON("getBlankLeft", [textRef, justification, maxWidth, useCurrent]);
        const textObj = getTextObj(textRef);
        const justify = justification || getTextData(textRef).justification || "center";
        if (VAL({textObj}, "getBlankLeft")) {
            // D.Alert(`GetBlankLeft(${D.JS(getTextKey(textRef))}, ${D.JS(justify)}, ${D.JS(maxWidth)}, ${D.JS(useCurrent)}) =<br>Left: ${D.JS(textObj.get("left"))}, Width: ${D.JS(useCurrent ? getTextWidth(textObj, textObj.get("text"), maxWidth) : getTextWidth(textObj))}, Final: ${D.JS(useCurrent && (textObj.get("left") + {left: -0.5, right: 0.5, center: 0}[justify] * getMaxWidth(textObj)) || (textObj.get("left") + {left: -0.5, right: 0.5, center: 0}[justify] * getTextWidth(textObj, textObj.get("text"), maxWidth)))}`)
            // if (useCurrent)
            //    return TRACEOFF(traceID, textObj.get("left") + (justify === "left" ? -0.5 : justify === "right" ? 0.5 : 0) * getMaxWidth(textObj))
            // D.Alert(`getBlankLeft Called on ${textObj.get("text")} with maxWidth ${maxWidth} into getTextWidth -->`)
            // return TRACEOFF(traceID, textObj.get("left") + (justify === "left" ? -0.5 : justify === "right" ? 0.5 : 0) * getTextWidth(textObj, textObj.get("text"), maxWidth))
            if (useCurrent)
                return TRACEOFF(traceID, textObj.get("left") + {left: -0.5, right: 0.5, center: 0}[justify] * getMaxWidth(textObj));
            return TRACEOFF(
                traceID,
                textObj.get("left") + {left: -0.5, right: 0.5, center: 0}[justify] * getTextWidth(textObj, textObj.get("text"), maxWidth)
            );
        }
        return TRACEOFF(traceID, false);
    };
    const getRealLeft = (textRef, params = {}) => {
        const traceID = TRACEON("getRealLeft", [textRef, params]);
        const textObj = getTextObj(textRef);
        const textData = getTextData(textRef);
        if (VAL({textObj}, "getRealLeft")) {
            params.left = params.left || textData.left;
            params.text = params.text || textObj.get("text");
            params.justification = params.justification || textData.justification || "center";
            // D.Alert(`getRealLeft(${D.JS(textData.name)}, ${D.JS(params)}) =<br>Left: ${D.JS(textObj.get("left"))}, DataLeft: ${D.JS(textData.left)}, Final: ${params.left + {left: -0.5, right: 0.5, center: 0}[params.justification] * getTextWidth(textObj, params.text, params.maxWidth || 0)}`)
            return TRACEOFF(
                traceID,
                params.left + {left: 0.5, right: -0.5, center: 0}[params.justification] * getTextWidth(textObj, params.text, params.maxWidth || 0)
            );
        }
        return TRACEOFF(traceID, false);
    };
    // #endregion

    // #region TEXT OBJECT MANIPULATORS: Buffering, Justifying, Splitting
    const buffer = (textRef, width) => " ".repeat(Math.max(0, Math.round(width / getTextWidth(textRef, " ", false))));
    const splitTextLines = (textRef, text, maxWidth, justification = "left") => {
        const traceID = TRACEON("splitTextLines", [textRef, text, maxWidth, justification]);
        const textObj = getTextObj(textRef);
        const textLines = (text || " ").split(/\n/gu);
        const splitLines = [];
        const mapperFuncs = {
            center: (hWidth) => (v) => `${buffer(textObj, 0.5 * (hWidth - getTextWidth(textObj, v, false)))}${v}${buffer(
                textObj,
                0.5 * (hWidth - getTextWidth(textObj, v, false))
            )}`,
            right: (hWidth) => (v) => `${buffer(textObj, hWidth - getTextWidth(textObj, v, false))}${v}`,
            left: () => (v) => `${v}`
        };
        let highWidth = 0;
        if (VAL({textObj}, "splitTextLines")) {
            for (const textLine of textLines) {
                let wordsInLine = textLine.split(/(\s|-)/gu).filter((x) => x.match(/\S/gu));
                const splitLine = [];
                for (let i = 0; i < wordsInLine.length; i++)
                    if (wordsInLine[i] === "-") {
                        wordsInLine[i - 1] = `${wordsInLine[i - 1]}-`;
                        wordsInLine = [...[...wordsInLine].splice(0, i), ...[...wordsInLine].splice(i + 1)];
                    }
                for (let i = 0; true; i++) {
                    if (getTextWidth(textObj, wordsInLine[i] || "", false) > maxWidth) {
                        let [prevLine, curLine, nextLine] = [
                            i > 0 ? wordsInLine[i - 1] : false,
                            wordsInLine[i],
                            i < wordsInLine.length - 1 ? wordsInLine[i + 1] : false
                        ];
                        if (prevLine !== false && prevLine.charAt(prevLine.length - 1) === " ")
                            prevLine = prevLine.slice(0, -1);
                        if (nextLine !== false && nextLine.charAt(0) === " ")
                            nextLine = nextLine.slice(1);
                        if (curLine.charAt(curLine.length - 1) === " ")
                            curLine = curLine.slice(0, -1);
                        if (curLine.charAt(0) === " ")
                            curLine = curLine.slice(1);
                        const [prevLineSpace, nextLineSpace] = [
                            prevLine === false ? maxWidth : maxWidth - getTextWidth(textObj, prevLine, false),
                            nextLine === false ? maxWidth : maxWidth - getTextWidth(textObj, nextLine, false)
                        ]; // Set PERCENTAGE of maxWidth that free space must take up in previous line to prefer it.
                        const PREVLINEPERCENT = 0.75;
                        if (prevLineSpace >= maxWidth * PREVLINEPERCENT || prevLineSpace >= nextLineSpace) {
                            let shiftString = curLine.charAt(0);
                            curLine = curLine.slice(1);
                            for (let j = 0; j < curLine.length; j++) {
                                if (getTextWidth(textObj, ` ${shiftString}${curLine.charAt(0)}-`, false) > prevLineSpace)
                                    break;
                                shiftString += curLine.charAt(0);
                                curLine = curLine.slice(1);
                            }
                            prevLine = `${((prevLine && `${prevLine} `) || "").replace(/-$/gu, "")}${shiftString}-`;
                        }
                        if (getTextWidth(textObj, `${curLine}-`, false) > maxWidth) {
                            let shiftString = curLine.charAt(curLine.length - 1);
                            curLine = curLine.slice(0, -1);
                            for (let j = 0; j < curLine.length; j++) {
                                if (getTextWidth(textObj, `${curLine}-`, false) <= maxWidth)
                                    break;
                                shiftString = curLine.charAt(curLine.length - 1);
                                curLine = curLine.slice(0, -1);
                            }
                            curLine = `${curLine}-`;
                            nextLine = `${shiftString}${((nextLine && ` ${nextLine}`) || "").replace(/^-/gu, "")}`;
                        }
                        if (i === 0 && prevLine) {
                            if (nextLine)
                                wordsInLine = [prevLine, curLine, nextLine, ...wordsInLine.slice(2)];
                            else
                                wordsInLine = [prevLine, curLine];
                            i++;
                        } else {
                            wordsInLine[i - 1] = prevLine || wordsInLine[i - 1];
                            wordsInLine[i] = curLine;
                            if (nextLine)
                                wordsInLine[i + 1] = nextLine;
                        }
                    }
                    if (i >= wordsInLine.length - 1)
                        break;
                }
                // let [stringCount, lineCount] = [0, 0]

                while (wordsInLine.length) {
                    let thisString = "",
                        nextWidth = getTextWidth(textObj, wordsInLine[0] + (wordsInLine[0].endsWith("-") ? "" : " "), false);
                    // lineCount++
                    // stringCount = 0
                    // DB(`LINE ${lineCount}.  NextWidth: ${nextWidth}`, "splitTextLines")
                    while (nextWidth < maxWidth && wordsInLine.length) {
                        thisString += wordsInLine[0].endsWith("-") ? `${wordsInLine.shift()}` : `${wordsInLine.shift()} `;
                        nextWidth = wordsInLine.length
                            ? getTextWidth(textObj, thisString + wordsInLine[0] + (wordsInLine[0].endsWith("-") ? "" : " "), false)
                            : 0;
                        // stringCount++
                        // DB(`... STRING ${stringCount}: ${thisString}  NextWidth: ${nextWidth}`, "splitTextLines")
                    }
                    // DB(`ADDING LINE: ${thisString} with width ${getTextWidth(textObj, thisString, false)}`, "splitTextLines")
                    splitLine.push(thisString);
                    highWidth = Math.max(getTextWidth(textObj, thisString, false), highWidth);
                }
                // D.Alert(`spaceWidth: ${spaceWidth}, repeating ${D.JS(Math.round((highWidth - getTextWidth(textObj, splitStrings[0], false))/spaceWidth))} Times.`)
                splitLines.push(...splitLine);
            }
            // D.Alert(`SplitTextLines Called.  Returning: ${D.JS(splitStrings)}`)
            return TRACEOFF(traceID, splitLines.map((mapperFuncs[justification] || mapperFuncs.left)(highWidth)));
        }
        return TRACEOFF(traceID, [text]);
    };
    const justifyText = (textRef, justification, maxWidth = 0) => {
        const traceID = TRACEON("justifyText", [textRef, justification, maxWidth]);
        const textObj = getTextObj(textRef);
        // D.Alert(`Justifying ${D.JS(getTextKey(textObj))}.  Reference: ${D.JS(textRef)}, Object: ${D.JS(textObj)}`, "justifyText")
        if (VAL({textObj})) {
            REGISTRY.TEXT[getTextKey(textObj)].justification = justification || "center";
            REGISTRY.TEXT[getTextKey(textObj)].left = getBlankLeft(textObj, justification, maxWidth);
            REGISTRY.TEXT[getTextKey(textObj)].width = getTextWidth(textObj, textObj.get("text"), maxWidth);
            // D.Alert(`${getTextKey(textRef)} Updated: ${D.JS(REGISTRY.TEXT[getTextKey(textObj)])}`, "justifyText")
        }
        TRACEOFF(traceID);
    };
    // #endregion

    // #region TEXT OBJECT SETTERS: Registering, Changing, Deleting
    const regText = (textRef, hostName, activeLayer, hasShadow, justification = "center", options = {}, funcName = false) => {
        const traceID = TRACEON("regText", [textRef, hostName, activeLayer, hasShadow, justification, options, funcName]);
        const textObj = getTextObj(textRef);
        DB(`regText(textRef, ${D.JSL(hostName)}, ${D.JSL(activeLayer)}, ${D.JSL(hasShadow)}, ${D.JSL(options)}`, "regText");
        if (VAL({text: textObj})) {
            if (!(hostName && activeLayer))
                return TRACEOFF(traceID, THROW("Must supply host name and active layer for regText.", "RegText"));
            let name;
            if (options.name && !REGISTRY.TEXT[options.name])
                name = options.name;
            else if (!REGISTRY.TEXT[hostName])
                name = hostName;
            else
                name = `${hostName.replace(/(_|\d|#)+$/gu, "")}_${_.filter(Object.keys(REGISTRY.TEXT), (k) => k.includes(hostName.replace(/(_|\d|#)+$/gu, ""))).length + 1}`;
            /* eslint-disable-next-line camelcase */
            const [font_family, font_size, curText, height] = [
                textObj
                    .get("font_family")
                    .toLowerCase()
                    .includes("contrail")
                    ? "Contrail One"
                    : textObj.get("font_family"),
                textObj.get("font_size"),
                textObj.get("text").trim(),
                textObj.get("height")
            ];
            const lineHeight = getLineHeight(textObj);
            REGISTRY.TEXT[name] = Object.assign(
                {
                    name,
                    height,
                    font_family,
                    font_size,
                    activeLayer,
                    lineHeight,
                    justification,
                    curText,
                    id: textObj.id,
                    pageID: textObj.get("_pageid"),
                    type: (textObj.get("_type") === "text" && "text") || "image",
                    top: textObj.get("top") - 0.5 * (curText.split("\n").length - 1) * lineHeight,
                    color: textObj.get("color"),
                    maxWidth: 0,
                    activeText: curText,
                    vertAlign: "top",
                    curMode: Session.Mode,
                    isActive: true
                },
                _.omit(options, (v, k) => ["text", "layer", "_type", "obj", "object", "isActive", "modes"].includes(k) || v === undefined)
            );
            REGISTRY.TEXT[name].left = getBlankLeft(textObj, options.justification || justification, options.maxWidth, true);
            REGISTRY.TEXT[name].width = getMaxWidth(textObj);
            REGISTRY.TEXT[name].zIndex = REGISTRY.TEXT[name].zIndex || 300;
            REGISTRY.TEXT[name].modes = C.MODEDEFAULTS(textObj, options.modes);
            DB(`Modes for ${name}: ${D.JSL(REGISTRY.TEXT[name].modes)}`, "regText");
            REGISTRY.ID[textObj.id] = name;
            setTextData(textObj, _.pick(REGISTRY.TEXT[name], C.TEXTPROPS));
            setText(textObj, REGISTRY.TEXT[name].curText);
            setLayer(name, REGISTRY.TEXT[name].activeLayer, true);
            if (hasShadow) {
                const shadowObj = makeTextShadow(name, {
                    text: REGISTRY.TEXT[name].curText,
                    left: REGISTRY.TEXT[name].left,
                    top: REGISTRY.TEXT[name].top,
                    font_size: REGISTRY.TEXT[name].font_size,
                    font_family: REGISTRY.TEXT[name].font_family,
                    layer: REGISTRY.TEXT[name].activeLayer
                });
                toFront(shadowObj);
            }
            if (options.isActive === false)
                toggleText(name, false, true);
            else
                toFront(textObj);
            // D.Alert(`Host obj for '${D.JS(name)}' registered: ${D.JS(REGISTRY.TEXT[name])}`, "regText")
            setZIndices();
            return TRACEOFF(traceID, getTextData(name));
        }
        return TRACEOFF(traceID, VAL({string: funcName}) && THROW(`Invalid text reference '${D.JSL(textRef)}'`, `${D.JSL(funcName)} > regText`));
    };
    const makeText = (hostName, activeLayer, hasShadow, justification, options = {}, funcName = false) => {
        const traceID = TRACEON("makeText", [hostName, activeLayer, hasShadow, justification, options, funcName]);
        DB(`makeText(${D.JSL(hostName)}, ${D.JSL(activeLayer)}, ${D.JSL(hasShadow)}, ${D.JSL(options)}`, "makeText");
        const actLayer = activeLayer || options.activeLayer || options.layer || "objects";
        const objParams = Object.assign(
            {
                _pageid: D.THISPAGEID,
                text: options.text || "",
                left: options.left || 200,
                top: options.top || 200,
                font_size: options.size || options.fontSize || options.font_size || 24,
                color: options.color || C.COLORS.brightred,
                font_family: options.font || options.fontFamily || options.font_family || "Candal",
                layer: actLayer,
                controlledby: ""
            },
            _.pick(options, ...C.TEXTPROPS)
        );
        const textObj = createObj("text", objParams);
        options.activeText = objParams.text;
        textObj.set(
            "left",
            getRealLeft(textObj, {
                left: textObj.get("left"),
                justification: justification || options.justification || "center",
                maxWidth: options.maxWidth || 0
            })
        );
        regText(textObj, hostName, actLayer, hasShadow, justification, options, funcName);
        return TRACEOFF(traceID, textObj);
    };
    const makeTextShadow = (textRef, params) => {
        const traceID = TRACEON("makeTextShadow", [textRef, params]);
        const textKey = getTextKey(textRef);
        const textData = getTextData(textKey);
        const shadowObj = createObj(
            "text",
            Object.assign(
                {
                    _pageid: textData.pageID,
                    color: "rgb(0,0,0)",
                    controlledby: ""
                },
                params
            )
        );
        REGISTRY.TEXT[textKey].shadowID = shadowObj.id;
        updateTextShadow(textKey);
        return TRACEOFF(traceID, shadowObj);
    };
    const updateTextShadow = (textRef) => {
        const traceID = TRACEON("updateTextShadow", [textRef]);
        const textData = getTextData(textRef);
        if (VAL({list: textData}, "updateTextShadow") && textData.shadowID) {
            const textObj = getTextObj(textData.name);
            const shadowObj = getObj("text", textData.shadowID);
            if (VAL({textObj: shadowObj}, "updateTextShadow")) {
                const shadowShift = getShadowShift(textObj);
                const shadowParams = {
                    text: textObj.get("text"),
                    left: textObj.get("left") + shadowShift,
                    top: textObj.get("top") + shadowShift
                };
                shadowObj.set(shadowParams);
            }
        }
        TRACEOFF(traceID);
    };
    const linkText = (masterRef, slaveData, horizPad = 0, vertPad = 0) => {
        const traceID = TRACEON("linkText", [masterRef, slaveData, horizPad, vertPad]);
        // ON MASTER: list each slave object in terms of the edge it attaches to -- top, left, right or bottom
        // ON SLAVES: set "pushleft" and "pushtop" values in their registry data whenever master changes
        //      Register them with "horizPad" and "vertPad" to add extra distance.
        //      Slaves must be set to the exact same position as the master to shift properly.
        const masterObj = getTextObj(masterRef);
        const masterKey = getTextKey(masterObj);
        D.Alert(`Slave Data: ${D.JS(slaveData)}`);
        REGISTRY.TEXT[masterKey].linkedText = REGISTRY.TEXT[masterKey].linkedText || {};
        for (const edgeDir of Object.keys(slaveData)) {
            REGISTRY.TEXT[masterKey].linkedText[edgeDir] = REGISTRY.TEXT[masterKey].linkedText[edgeDir] || [];
            for (const slaveRef of slaveData[edgeDir]) {
                const slaveKey = getTextKey(slaveRef);
                REGISTRY.TEXT[masterKey].linkedText[edgeDir].push(slaveKey);
                REGISTRY.TEXT[slaveKey].horizPad = horizPad;
                REGISTRY.TEXT[slaveKey].vertPad = vertPad;
            }
        }
        updateSlaveText(masterKey);
        TRACEOFF(traceID);
    };
    const updateSlaveText = (masterRef) => {
        const traceID = TRACEON("updateSlaveText", [masterRef]);
        const masterObj = getTextObj(masterRef);
        const masterKey = getTextKey(masterObj);
        const edgeDirs = REGISTRY.TEXT[masterKey].linkedText || {};
        for (const edgeDir of Object.keys(edgeDirs))
            for (const slaveKey of edgeDirs[edgeDir]) {
                const slaveData = getTextData(slaveKey);
                if (slaveData) {
                    switch (edgeDir) {
                        case "left":
                            REGISTRY.TEXT[slaveKey].pushleft = masterObj.get("text").match(/\S/giu)
                                ? -getMaxWidth(masterObj) - slaveData.horizPad
                                : 0;
                            break;
                        case "right":
                            REGISTRY.TEXT[slaveKey].pushleft = masterObj.get("text").match(/\S/giu) ? getMaxWidth(masterObj) + slaveData.horizPad : 0;
                            break;
                        case "top":
                            REGISTRY.TEXT[slaveKey].pushtop = masterObj.get("text").match(/\S/giu)
                                ? -getTextHeight(masterObj) - slaveData.vertPad
                                : 0;
                            break;
                        case "bottom":
                            REGISTRY.TEXT[slaveKey].pushtop = masterObj.get("text").match(/\S/giu) ? getTextHeight(masterObj) + slaveData.vertPad : 0;
                        // no default
                    }
                    setText(slaveKey, slaveData.curText);
                }
            }
        TRACEOFF(traceID);
    };
    const setText = (textRef, text, isToggling, isForcing = false) => {
        const traceID = TRACEON("setText", [textRef, text, isToggling, isForcing]);
        // D.Alert(`setText(${D.JS(textRef, true)}, ${D.JS(text)}, ${D.JS(isToggling)}, ${D.JS(isForcing)})`)
        if (isToggling === false || isToggling === true)
            toggleText(textRef, isToggling, isForcing);
        if (!isForcing && (text === null || text === undefined))
            return TRACEOFF(traceID, null);
        const textData = getTextData(textRef);
        if (VAL({list: textData}, "setText")) {
            if (!isForcing && textData.curText === text)
                return TRACEOFF(traceID, null);
            const textKey = textData.name;
            const textObj = getTextObj(textRef);
            const textParams = {text};
            if (!VAL({string: textParams.text}))
                textParams.text = (_.isString(textData.curText) && textData.curText) || textObj.get("text");
            let [totalTopShift, totalLeftShift] = [
                (textData.shiftTop || 0) + (textData.pushtop || 0),
                (textData.shiftLeft || 0) + (textData.pushleft || 0)
            ];
            if (VAL({textObj}, ["setText", `textRef: ${D.JS(textRef)}, text: ${D.JS(text)}`])) {
                if (textData.maxWidth && textParams.text.length) {
                    const splitLines = splitTextLines(textObj, textParams.text, textData.maxWidth, textData.justification);
                    textParams.text = splitLines.join("\n");
                }
                if (textParams.text.split("\n").length > 1)
                    switch (textData.vertAlign) {
                        case "top":
                            totalTopShift
                                += 0.5
                                * (textParams.text.split("\n").length - 1)
                                * (textData.lineHeight
                                    || (D.CHARWIDTH[textObj.get("font_family")]
                                        && D.CHARWIDTH[textObj.get("font_family")][textObj.get("font_size")]
                                        && D.CHARWIDTH[textObj.get("font_family")][textObj.get("font_size")].lineHeight)
                                    || 0);
                            break;
                        case "bottom":
                            totalTopShift
                                += 0.5
                                * (textParams.text.split("\n").length - 1)
                                * (textData.lineHeight
                                    || (D.CHARWIDTH[textObj.get("font_family")]
                                        && D.CHARWIDTH[textObj.get("font_family")][textObj.get("font_size")]
                                        && D.CHARWIDTH[textObj.get("font_family")][textObj.get("font_size")].lineHeight)
                                    || 0);
                            break;
                        // no default
                    }
                textParams.left = getRealLeft(textObj, {
                    left: (textData.left || getBlankLeft(textObj, textObj.get("text"))) + totalLeftShift,
                    text: textParams.text,
                    justification: textData.justification,
                    maxWidth: textData.maxWidth
                });
                textParams.top = (textData.top || textObj.get("top")) + totalTopShift;
                if (textData.isActive)
                    REGISTRY.TEXT[textData.name].activeText = textParams.text;
                // D.Alert(`Setting CurText on ${D.JS(textData.name)}`)
                REGISTRY.TEXT[textData.name].curText = textParams.text;
                if (textParams.left === textObj.get("left"))
                    delete textParams.left;
                if (textParams.top === textObj.get("top"))
                    delete textParams.top;
                textObj.set(textParams);
                if (textData.shadowID)
                    updateTextShadow(textKey);
                if (textData.linkedText)
                    updateSlaveText(textKey);
                REGISTRY.TEXT[textData.name].width = getTextWidth(textKey, textParams.text, textData.maxWidth);
                return TRACEOFF(traceID, textObj);
            }
        }
        return TRACEOFF(traceID, false);
    };
    const setTextData = (textRef, params) => {
        const traceID = TRACEON("setTextData", [textRef, params]);
        const textKey = getTextKey(textRef);
        if (VAL({string: textKey}, "setTextData")) {
            const textObj = getTextObj(textKey);
            if (VAL({textObj}, ["setTextData", `Registered object '${textKey}' not found!`])) {
                const textParams = params; // Object.assign(params, {left: getBlankLeft(textObj)}),
                const objParams = _.omit(_.pick(textParams, C.TEXTPROPS), "text");
                // D.Alert(`textParams: ${D.JS(textParams)}<br>objParams: ${D.JS(objParams)}`, `${textKey}`)
                _.each(textParams, (v, k) => {
                    if (k === "text")
                        D.Alert("Attempt to set 'text' via setTextData: Use setText() to set text values!", "ERROR: setTextData");
                    else
                        REGISTRY.TEXT[textKey][k] = v;
                });
                textObj.set(objParams);
                if (_.intersection(Object.keys(textParams), ["shiftTop", "top", "shiftLeft", "left", "pushtop", "pushleft"]).length)
                    setText(textKey, null, undefined, true);
                return TRACEOFF(traceID, getTextData(textKey));
            }
        }
        return TRACEOFF(traceID, false);
    };
    const toggleText = (textRef, isActive, isForcing = false) => {
        const traceID = TRACEON("toggleText", [textRef, isActive, isForcing]);
        // NON-PERMANENT.  If turning off, set activeSrc to curSrc.
        // Also, verify img status is changing before doing anything.
        if (isActive === null)
            return TRACEOFF(traceID, null);
        const textData = getTextData(textRef);
        const modeData = getModeData(textRef, Session.Mode);
        if (VAL({list: [textData, modeData]}, "toggleText", true)) {
            let activeCheck = null;
            if ((isActive === true || (isActive !== false && !textData.isActive)) && modeData.isForcedOn !== "NEVER")
                activeCheck = true;
            else if (isActive === false || (isActive !== true && textData.isActive) || (modeData.isForcedOn === "NEVER" && textData.isActive))
                activeCheck = false;
            if (activeCheck === null || (!isForcing && textData.isActive === activeCheck))
                return TRACEOFF(traceID, null);
            const textKey = textData.name;
            const textObj = getTextObj(textKey);
            if (activeCheck === false) {
                // TURN OFF: Set layer to walls, toggle off associated drag pads, update activeState value
                REGISTRY.TEXT[textKey].activeText = textData.curText;
                REGISTRY.TEXT[textKey].isActive = false;
                // setLayer(textObj, "walls", isForcing)
                textObj.set("layer", "walls");
                if (textData.shadowID)
                    (getObj("text", textData.shadowID) || {set: () => false}).set("layer", "walls");
                return TRACEOFF(traceID, false);
            } else if (activeCheck === true) {
                // TURN ON: Set layer to active layer, toggle on associated drag pads, restore activeState value if it's different
                REGISTRY.TEXT[textKey].isActive = true;
                setText(textKey, textData.activeText, null, isForcing);
                textObj.set("layer", textData.activeLayer);
                // setLayer(textObj, textData.activeLayer, isForcing)
                if (textData.shadowID)
                    (getObj("text", textData.shadowID) || {set: () => false}).set("layer", textData.activeLayer);
                return TRACEOFF(traceID, true);
            }
        }
        return TRACEOFF(traceID, null);
    };
    const removeText = (textRef, isUnregOnly, isStillKillingShadow) => {
        const traceID = TRACEON("removeText", [textRef, isUnregOnly, isStillKillingShadow]);
        const textObj = getTextObj(textRef);
        const textData = getTextData(textRef);
        if (textData.shadowID) {
            const shadowObj = getObj("text", textData.shadowID);
            if (shadowObj && (!isUnregOnly || isStillKillingShadow))
                shadowObj.remove();
        }
        if (textObj && !isUnregOnly)
            textObj.remove();
        if (textData) {
            if (REGISTRY.ID[textData.id])
                delete REGISTRY.ID[textData.id];
            if (REGISTRY.TEXT[textData.name])
                delete REGISTRY.TEXT[textData.name];
            return TRACEOFF(traceID, true);
        }
        return TRACEOFF(traceID, THROW(`Invalid text reference ${D.JSL(textRef)}`, "removeText"));
    };
    const removeTexts = (textString, isUnregOnly) => {
        const traceID = TRACEON("removeTexts", [textString, isUnregOnly]);
        const textNames = _.filter(Object.keys(REGISTRY.TEXT), (v) => v.includes(textString));
        for (const textName of textNames)
            removeText(textName, isUnregOnly);
        TRACEOFF(traceID);
    };
    const clearMissingRegText = () => {
        const traceID = TRACEON("clearMissingRegText", []);
        const returnLines = [];
        for (const textName of Object.keys(REGISTRY.TEXT))
            if (!getTextObj(textName))
                returnLines.push(
                    `... ${textName} Missing Object, Removing: ${
                        removeText(textName) ? "<span style='color: green;'><b>OK!</b></span>" : "<span style='color: red;'><b>ERROR!</b></span>"
                    }`
                );
        if (returnLines.length)
            STATE.REF.fixAllCommands.push(...["<h3><u>Removing Unlinked Text Registry Entries</u></h3>", ...returnLines]);
        TRACEOFF(traceID);
    };
    const clearUnregText = (isKilling = false, isKillingPlayerText = false) => {
        const traceID = TRACEON("clearUnregText", [isKilling, isKillingPlayerText]);
        const returnLines = [];
        const allTextObjs = findObjs({
            _type: "text"
        });
        const unregTextObjs = allTextObjs.filter((x) => !isRegText(x) && (isKillingPlayerText || x.get("controlledby") === D.GMID()));
        for (const textObj of unregTextObjs) {
            returnLines.push(
                `"<span style='color: ${textObj.get("color")}; background-color: #AAAAAA;'> ${textObj
                    .get("text")
                    .slice(0, 15)}... </span>"<br><span style='color: blue;'><b>${
                    textObj.id
                }</b></span> <span style='color: red;'><b>REMOVED</b></span>`
            );
            if (isKilling)
                textObj.remove();
        }
        if (returnLines.length)
            STATE.REF.fixAllCommands.push(...["<h4><u>Clearing Orphan Texts</u></h4>", ...returnLines]);
        TRACEOFF(traceID);
    };
    const resetTextRegistry = () => {
        const traceID = TRACEON("resetTextRegistry", []);
        STATE.REF.textregistry = {};
        STATE.REF.idregistry = {};
        TRACEOFF(traceID);
    };
    const fixTextObjs = (isQueueing = false) => {
        const traceID = TRACEON("fixTextObjs", [isQueueing]);
        const textKeys = Object.keys(REGISTRY.TEXT);
        const textPairs = _.zip(
            textKeys.map((x) => REGISTRY.TEXT[x]),
            textKeys.map((x) => getObj("text", REGISTRY.TEXT[x].id))
        );
        const reportLines = [];
        for (const [textData, textObj] of textPairs) {
            if (!textObj) {
                reportLines.push(`No text object found for ${D.JS(textData)}`);
                continue;
            }
            const reportStrings = [];
            if (!textData.isActive && textData.isActive !== false) {
                reportStrings.push(
                    `Missing 'isActive' --> On '${textObj.get("layer")}' SO Setting ${textObj.get("layer") === "walls" ? "FALSE" : "TRUE"}`
                );
                REGISTRY.TEXT[textData.name].isActive = textObj.get("layer") !== "walls";
            }
            if (textData.isActive && textObj.get("layer") === "walls") {
                reportStrings.push(`Active object on 'walls' --> Moving to '${D.JS(textData.activeLayer)}`);
                textObj.set("layer", textData.activeLayer);
            }
            if (!textData.isActive && textObj.get("layer") !== "walls") {
                reportStrings.push(`Inactive object on '${textObj.get("layer")}' --> Moving to 'walls'`);
                textObj.set("layer", "walls");
            }
            if (textData.curText !== textObj.get("text"))
                if (VAL({string: textData.curText})) {
                    reportStrings.push(
                        `Object text (<span style='background-color: #AAAAAA;'> ${D.JS(
                            textObj.get("text")
                        )} </span>) doesn't match registry text (<span style='background-color: #AAAAAA;'> ${D.JS(
                            textData.curText
                        )} </span>) --> Updating <b><u>OBJECT</u></b>`
                    );
                    textObj.set("text", textData.curText);
                } else {
                    reportStrings.push(
                        `Registry text (<span style='background-color: #AAAAAA;'> ${D.JS(
                            textData.curText
                        )} </span>) doesn't match object text (<span style='background-color: #AAAAAA;'> ${D.JS(
                            textObj.get("text")
                        )} </span>) --> Updating <b><u>REGISTRY</u></b>`
                    );
                    REGISTRY.TEXT[textData.name].text = textObj.get("text");
                }
            toggleText(textData.name, textData.isActive, true);
            setText(textData.name, textData.curText, null, true);
            if (reportStrings.length)
                reportLines.push(...[`<b>${textData.name}</b>`, reportStrings.map((x) => `... ${x}`).join("<br>")]);
        }
        if (reportLines.length)
            if (isQueueing)
                STATE.REF.fixAllCommands.push(...["<h3><u>Final Text Object Pass</u></h3>", ...reportLines]);
            else
                D.Alert(["<h3><u>Fixing Text Objects</u></h3>", ...reportLines].join("<br>"), "fixTextObjs");
        TRACEOFF(traceID);
    };
    // #endregion

    return {
        CheckInstall: checkInstall,
        OnChatCall: onChatCall,
        OnGraphicAdd: onGraphicAdd,
        OnGraphicChange: onGraphicChange,

        // REGISTRIES
        get IMAGES() { return REGISTRY.IMG },
        get GRAPHICS() { return REGISTRY.GRAPHIC },
        get TEXT() { return REGISTRY.TEXT },
        get TEXTIDS() { return REGISTRY.ID },
        get ANIM() { return REGISTRY.ANIM },
        get AREAS() { return REGISTRY.AREA },
        get TOKENS() { return REGISTRY.TOKEN },

        // GENERAL MEDIA FUNCTIONS
        Get: getMediaObj,
        GetKey: getMediaKey,
        GetData: getMediaData,
        GetModeData: getModeData,
        IsRegistered: isRegistered,
        HasForcedState: hasForcedState,
        ModeUpdate: modeUpdate,
        IsActive: isObjActive,
        IsCyclingImg: isCyclingImg,
        Toggle: toggle,
        Adjust: adjustObj,

        // GETTERS
        GetImg: getImgObj,
        GetText: getTextObj,
        GetImgs: getImgObjs,
        GetTexts: getTextObjs,
        GetImgKey: getImgKey,
        GetTextKey: getTextKey,
        GetImgData: getImgData,
        GetTextData: getTextData,
        GetImgSrc: getImgSrc,
        GetTokens: getTokenObjs,
        GetTokenData: getTokenData,
        GetLineHeight: getLineHeight,
        GetSimpleTextWidth: getSimpleTextWidth,
        GetTextWidth: getTextWidth,
        GetTextHeight: getTextHeight,
        GetTextLines: getTextLines,
        Buffer: buffer,

        // CONSTRUCTORS, REGISTERS & DESTROYERS
        MakeImg: makeImg,
        MakeText: makeText,
        RegImg: regImg,
        RegToken: regToken,
        RegText: regText,
        RemoveImg: removeImg,
        RemoveAllImgs: removeImgs,
        RemoveText: removeText,
        RemoveAllText: removeTexts,
        AddImgSrc: addImgSrc,

        // SETTERS
        SetImg: setImg,
        SetText: setText,
        SetToken: setTokenSrc,
        CombineTokenSrc: combineTokenSrc,
        ToggleImg: toggleImg,
        ToggleText: toggleText,
        ToggleToken: toggleTokens,
        ToggleTokens: toggleTokens,
        CycleImg: cycleImg,
        SetImgData: setImgData,
        SetTextData: setTextData,
        SetImgTemp: setImgTemp, // SetTextTemp: setTextTemp,
        Spread: spreadImgs,
        ToggleLoadingScreen: toggleLoadingScreen,
        SetLoadingMessage: setLoadingText,
        StartProgressBar: startProgressBar,
        StopProgressBar: stopProgressBar,
        Notify: addPanelText,
        ToFront: sendToFront,
        ToBack: sendToBack,

        // AREA FUNCTIONS
        GetBounds: getBounds,
        GetContents: getContainedImgObjs,
        IsInside: isInside,
        GetContainedChars: getContainedChars,
        SetArea: setImgArea,

        // ANIMATION FUNCTIONS
        GetAnim: getImgObj,
        GetAnimData: getImgData,
        GetAnimKey: getImgKey,
        ToggleAnim: toggleAnimation,
        Flash: flashAnimation,
        Pulse: activateAnimation,
        Kill: deactivateAnimation,
        SetAnimData: setAnimData,

        // REINITIALIZE MEDIA OBJECTS (i.e. on MODE CHANGE)
        Fix: (isZIndicesOnly = false) => {
            if (!isZIndicesOnly) {
                fixImgObjs();
                fixTextObjs();
            }
            setZIndices();
            alignMatteImages();
        },
        Polish: () => Media.Fix(true)
    };
})();

on("ready", () => {
    Media.CheckInstall();
    D.Log("Media Ready!");
});
void MarkStop("Media");
