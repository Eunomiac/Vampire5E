void MarkStart("Assets");
const Assets = (() => {
    // #region ~ ************* COMMON INITIALIZATION *************
    /* eslint-disable no-unused-vars */
    const SCRIPTNAME = "Assets";
    const STATE = {get REF() { return C.RO.OT[SCRIPTNAME] }};
    const VAL = (varList, funcName, isArray = false) => D.Validate(varList, funcName, SCRIPTNAME, isArray);
    const DB = (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME);
    const LOG = (msg, funcName) => D.Log(msg, funcName, SCRIPTNAME);
    const THROW = (msg, funcName, errObj) => D.ThrowError(msg, funcName, SCRIPTNAME, errObj);
    /* eslint-enable no-unused-vars */
    const checkInstall = () => {
        C.RO.OT[SCRIPTNAME] = C.RO.OT[SCRIPTNAME] || {};
        initialize();
    };    
    // #endregion
    // #region ~ ************* LOCAL INITIALIZATION **************
    const initialize = () => {
        STATE.REF.AssetLibrary = STATE.REF.AssetLibrary || {};
        STATE.REF.GenericTokenImages = STATE.REF.GenericTokenImages || {};
    };
    // #endregion
    // #region ~ ************* EVENT HANDLERS ********************
    const onChatCall = (call, args, objects, msg) => {
        const assets = [call, ...args].filter(x => x.startsWith("+")).map(x => Asset.Get(x.replace(/^\+/gu, "")));
        // assets.push(...Listener.GetObjects(objects, "graphic").map(x => MediaAsset.Get(x)))
        // assets.push(...Listener.GetObjects(objects, "text").map(x => MediaAsset.Get(x)))
        args = args.filter(x => !x.startsWith("+"));
        switch (call) {
            case "c": case "com": case "command": {
                // !asset c "<string to pass to Asset.Get>" <method or field name> <comma-delimited parameters: "true", "false", "null" will be converted>
                // E.G.     !asset c "DistrictCenter_1" isActive true
                //          !asset c "DistrictCenter_1" Toggle true, true
                DB({msg: msg.content, matcher: D.JSL(msg.content.match(/^[^']+'([^']+)'\s(\S+)\s*(.*)$/u))}, "assetCommand");
                const [assetRef, propRef, ...params] = _.flatten(_.compact(msg.content.match(/^[^']+'([^']+)'\s(\S+)\s*(.*)$/u).slice(1)).
                    map((x, i) => i < 2 ? x : x.split(/,\s*/gu).
                        map(xx => ["true", "false", "null"].includes(xx) ? {"true": true, "false": false, "null": null}[xx] : xx)));
                const asset = Asset.Get(assetRef);
                DB({assetRef, propRef, params, paramTypes: params.map(x => typeof x)}, "assetCommand");
                if (asset && propRef in asset)
                    if (typeof asset[propRef] === "function") {
                        asset[propRef](...params);
                        D.Alert(`Ran <b>&lt;${asset.name}&gt;</b>.${propRef}(${params.join(", ")})`, "Run Method");
                    } else {
                        [asset[propRef]] = params;
                        D.Alert(`Set <b>&lt;${asset.name}&gt;</b>.${propRef} = ${params[0]}`, "Set Field");
                    }
                else
                    D.Alert(`!asset c '&lt;assetRef&gt;' &lt;method/field&gt; &lt;comma-delim params&gt;
                        E.G.     !asset c 'DistrictCenter' isActive true
                                 !asset c 'DistrictCenter' Toggle true, true`, "!asset command");
                break;
            }
            case "apply": Asset.ApplyPendingChanges(args[0] !== "confirm"); break;
            case "get": {
                switch (D.LCase(call = args.shift())) {
                    case "full": {
                        switch (D.LCase(call = args.shift())) {
                            case "library": D.Alert(D.JS(LI.B), "ASSET LIBRARY"); break;
                            case "assets": D.Alert(`${D.JS(Asset.LIB)} (${Object.keys(Asset.LIB).length})`, "ASSETS"); break;
                            case "img": D.Alert(D.JS(Image.LIB), "IMAGE ASSETS"); break;
                            case "anim": D.Alert(D.JS(Anim.LIB), "ANIMATION ASSETS"); break;
                            case "token": D.Alert(D.JS(Token.LIB), "TOKEN ASSETS"); break;
                            case "text": D.Alert(D.JS(Text.LIB), "TEXT ASSETS"); break;
                            case "pads": case "dragpads": {
                                const alertLines = [];
                                for (const [, image] of Object.entries(Image.DragPads)) 
                                    if (image.areDragPadsActive)
                                        alertLines.push(`<span style="color: green; font-weight: bold;">${image.name}</span>: ${image.dragPads.map(x => D.JS(x)).join(", ")}`);
                                    else
                                        alertLines.push(`${image.name}: ${image.dragPads.map(x => D.JS(x)).join(", ")}`);                                    
                                alertLines.push(" ");
                                alertLines.push(D.JS(Object.values(Image.DragPads)[0]));
                                D.Alert(alertLines.join("<br>"), "Drag Pads");
                                break;
                            }
                            // no default
                        }
                        break;
                    }
                    case "all": {
                        switch (D.LCase(call = args.shift())) {
                            case "library": D.Alert(D.JS(Object.values(LI.B).map(x => `${x.id}: <b>${x.name}</b> (${x.type})`)), "ASSET LIBRARY"); break;
                            case "assets": D.Alert(`${D.JS(Object.values(Asset.LIB).map(x => x.obj))} (${Object.keys(Asset.LIB).length})`, "ASSETS"); break;
                            case "img": D.Alert(D.JS(Object.values(Image.LIB).map(x => x.name)), "IMAGE ASSETS"); break;
                            case "anim": D.Alert(D.JS(Object.values(Anim.LIB).map(x => x.name)), "ANIMATION ASSETS"); break;
                            case "token": D.Alert(D.JS(Object.values(Token.LIB).map(x => x.name)), "TOKEN ASSETS"); break;
                            case "text": D.Alert(D.JS(Object.values(Text.LIB).map(x => x.name)), "TEXT ASSETS"); break;
                            case "pads": case "dragpads": {
                                const alertLines = [];
                                for (const [, image] of Object.entries(Image.DragPads)) 
                                    if (image.areDragPadsActive)
                                        alertLines.push(`<span style="color: green; font-weight: bold;">${image.name}</span>: ${image.dragPads.map(x => D.JS(x)).join(", ")}`);
                                    else
                                        alertLines.push(`${image.name}: ${image.dragPads.map(x => D.JS(x)).join(", ")}`);                                    
                                alertLines.push(" ");
                                alertLines.push(D.JS(Object.values(Image.DragPads)[0]));
                                D.Alert(alertLines.join("<br>"), "Drag Pads");
                                break;
                            }
                            // no default
                        }
                        break;
                    }
                    case "assets": D.Alert(`${D.JS(assets)} (${Object.keys(assets).length})`, "Assets"); break;
                    default: {
                        const [assetRef, ...propRefs] = _.flatten(_.compact(msg.content.match(/^[^']*'([^']*)'\s*(.*)$/u).slice(1)).
                            map((x, i) => i === 0 ? x : x.split(/,\s*/gu)));
                        const asset = Asset.Get(assetRef);
                        DB({assetRef, propRefs, asset}, "assetGet");
                        if (asset) {
                            let valueRef = asset;
                            for (const thisRef of propRefs) {
                                DB({thisRef, valueRef}, "assetGet");
                                valueRef = valueRef[thisRef];
                            }
                            D.Alert(`${asset.name}.${propRefs.join(".")} = ${D.JS(valueRef)}`, "Get Property");
                        } else {                                
                            D.Alert(`!asset get '&lt;assetRef&gt;' &lt;comma-delim keys&gt;
                                E.G.     !asset get 'SignalLightBotLeft' dragPads, layers
                                         !asset get 'SignalLightBotLeft' srcs`, "!asset get");
                        }
                        break;
                    }
                        // no default
                }
                break;
            }
            case "init": initAssets(args[0] === "test"); break;
            case "toggle": {
                assets.forEach(x => x.ForceToggle({on: true, off: false, true: true, false: false}[args[0] || "undefined"]));
                Asset.ApplyPendingChanges();
                break;
            }
            case "make": {
                switch (D.LCase(call = args.shift())) {
                    case "pads": case "dragpads": {
                        const [funcName, deltaHeight, deltaWidth] = args;
                        assets.filter(x => x instanceof Image).forEach(x => x.MakeDragPads(funcName, deltaHeight, deltaWidth, args[3] !== "false"));
                        break;
                    }
                        // no default
                }
                break;
            }
            case "set": {
                switch (D.LCase(call = args.shift())) {
                    case "random": {
                        assets.forEach(x => {
                            if ("Random" in x)
                                x.Random();
                        });
                        Asset.ApplyPendingChanges();
                        break;
                    }
                    case "cycle": case "next": {
                        assets.forEach(x => {
                            if ("Cycle" in x)
                                x.Cycle();
                        });
                        Asset.ApplyPendingChanges();
                        break;
                    }
                    default: {
                        assets.forEach(x => x.Set(call));
                        Asset.ApplyPendingChanges();
                        break;
                    }
                }
                break;
            }
            case "fix": Asset.LIB.forEach(x => x.Fix()); break;
                // no default
        }
    };
    const onGraphicAdd = imgObj => {
        if (imgObj.get("represents")) {
            const tokenAsset = Token.Initialize(imgObj);    
            if (tokenAsset.isGenericToken) { }
            else if (tokenAsset.isRandomToken) { }
        }
        /*
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
                const charObj = D.GetChar(charName) || createObj("character", {
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
        */
    };
    const onGraphicDestroy = imgObj => {
        const tokenAsset = Token.Get(imgObj);
        if (tokenAsset)
            tokenAsset.Unregister();
    };
    const onGraphicChange = (imgObj) => {
        if (imgObj.id in Image.DragPads)
            Image.DragPads[imgObj.id].fireDragPad();
    };
    
    // #endregion
    
    // #region ~ VARIABLE DECLARATIONS
    let MAPPANELTIMER;
    const FUNCTIONS = { 
        // Function will get an Image asset and moveData: ["left", "up", isDiagonal]
        selectDie: (imgAsset) => {
            const [, dieCat, dieNum] = imgAsset.name.split("_");
            Roller.Select(dieCat, D.Int(dieNum));
        },
        wpReroll: () => {
            const stateVar = C.RO.OT.Roller.selected;
            const diceCats = [...Roller.DiceCats];
            let dieCat = "";
            do {
                dieCat = diceCats.pop();
                dieCat = stateVar[dieCat] && stateVar[dieCat].length ? dieCat : 0;
            } while (dieCat === 0);
            Roller.Reroll(dieCat);
        },
        signalLight: (signalLightAsset) => { signalLightAsset.Set(signalLightAsset.state === "on" ? "off" : "on"); Asset.ApplyPendingChanges() },
        flipComp: (cardAsset) => { Complications.Flip(cardAsset.name.replace(/CompSpot_/gu, "")) },
        toggleMapLayer: (buttonAsset) => {
            const mapAsset = Image.Get(buttonAsset.name.replace(/Button/gu, "Layer"));
            mapAsset.Toggle();
            buttonAsset.Set(mapAsset.isActive ? "on" : "off");
            Asset.ApplyPendingChanges();
            if (MAPPANELTIMER) {
                clearTimeout(MAPPANELTIMER);
                MAPPANELTIMER = setTimeout(FUNCTIONS.toggleMapPanel, 10000);
            }
        },
        toggleMapSlider: (sliderAsset, moveData) => {
            const mapAsset = Image.Get(sliderAsset.name.replace(/Button/gu, "Layer"));
            const mapFillAsset = Image.Get("MapLayer_DistrictsFill");
            sliderAsset.Cycle(moveData.includes("left"));
            switch (sliderAsset.state) {                
                case "base": {
                    mapAsset.Toggle(false);
                    if (sliderAsset.name.includes("District"))
                        mapFillAsset.Toggle(false);
                    break;
                }
                case "labels": mapAsset.Toggle(true); mapFillAsset.Toggle(false); break;
                case "fills": mapAsset.Toggle(false); mapFillAsset.Toggle(true); break;
                case "both": mapAsset.Toggle(true); mapFillAsset.Toggle(true); break;
                default: mapAsset.Set(sliderAsset.state);
            }
            Asset.ApplyPendingChanges();           
            if (MAPPANELTIMER) {
                clearTimeout(MAPPANELTIMER);
                MAPPANELTIMER = setTimeout(FUNCTIONS.toggleMapPanel, 10000);
            }
        },
        toggleMapPanel: () => {
            const panelAsset = Image.Get("MapButton_Panel");
            panelAsset.Set(panelAsset.state === "open" ? "closed" : "open");
            D.Alert(D.JS(panelAsset));
            D.Alert(D.JS(panelAsset.data));
            for (const buttonAsset of Object.values(Image.LIB).filter(x => x.name.startsWith("MapButton")))
                buttonAsset.Toggle(panelAsset.state === "open");
            panelAsset.Toggle(true);
            Asset.ApplyPendingChanges();
            if (MAPPANELTIMER)
                clearTimeout(MAPPANELTIMER);
            MAPPANELTIMER = panelAsset.state === "open" && setTimeout(FUNCTIONS.toggleMapPanel, 10000);
        }
    };
    const PENDINGCHANGES = [];
    const LI = {get B() { return STATE.REF.AssetLibrary }};
    // #endregion

    // #region CLASS DEFINITIONS
    class Asset {
        // #region ~ STATIC METHODS, GETTERS & SETTERS
        // #region Instance Storage Libraries (Asset.LIB)
        static get LIB() { return this._AssetLIB }
        static set LIB(v) { this._AssetLIB = Object.assign(this._AssetLIB || {}, {[v.id]: v}) }
        // #endregion
        static ApplyPendingChanges(isTesting = false) {
            for (const asset of PENDINGCHANGES)
                asset.Apply(isTesting);
            if (isTesting)
                D.Alert(`Testing PENDINGCHANGES ("!asset apply confirm" to change objects):<br><br>${D.JS(PENDINGCHANGES)}`, "Asset.ApplyPendingChanges");
            else
                PENDINGCHANGES.length = 0;
        }
        static Get(assetRef, type = null) { // Get an Asset instance by passing an asset, object, an id, or a name.
            let classRef;
            switch (D.LCase(type)) {
                case "image": case "graphic": classRef = Image; break;
                case "text": classRef = Text; break;
                case "anim": classRef = Anim; break;
                case "token": classRef = Token; break;
                default: classRef = Asset; break;
            }
            if (assetRef instanceof classRef)
                return assetRef;
            if (typeof assetRef === "object" && "id" in assetRef && assetRef.id in classRef.LIB)
                return classRef.LIB[assetRef.id];
            if (typeof assetRef === "string") {
                if (assetRef in classRef.LIB)
                    return classRef.LIB[assetRef];
                return classRef.LIB[Object.keys(classRef.LIB).find(x => classRef.LIB[x].name.startsWith(assetRef)) || ""] || false;
            }
            return false;
        }
        static Make(assetType, assetData) { }
        // #endregion
        
        // #region ~ BASIC GETTERS & SETTERS
        get libData() { return LI.B[this.id] }
        set libData(v) { LI.B[this.id] = v }
        get pendingData() { return this._pendingData }
        set pendingData(v) { this._pendingData = v }
        get pendingChanges() { return this._pendingChanges }
        set pendingChanges(v) { this._pendingChanges = v }
        get data() { return D.Merge(this.libData, this.pendingData, false) }

        // Data.Modes:
        get mode() { return this.data.modes[Session.Mode] }
        get lastMode() { return this.data.modes[Session.LastMode] }
        // #endregion

        // #region ~ CONSTRUCTOR
        constructor(assetRef) {
            try {
                if (typeof assetRef === "object") {
                    this._id = assetRef.id;
                    this._objType = assetRef.get("_type");
                    this._obj = assetRef;
                } else {
                    this._id = assetRef;
                    this._objType = {image: "graphic", token: "graphic", anim: "graphic", text: "text"}[this.libData.type];
                    this._obj = getObj(this._objType, this._id);
                }
                this._pendingChanges = {};
                this._pendingData = {};
                this.syncLibrary(); // Updating LIBRARY with current object data & calculating derivative stats.
            } catch (errObj) {
                THROW(`Error Constructing Asset '${D.JS(assetRef)}'`, "ASSET", errObj);
            }
        }
        // #endregion

        // #region ~ GETTERS 
        // READ-ONLY
        get id() { return this._id }
        get objType() { return this._objType }
        get obj() { return this._obj }
        get objKeys() { return Object.keys(this.obj.attributes) }
        get type() { return this.data.type }
        get page() { return this.data.page }
        get state() { return this.data.state }
        get zIndex() { return this.data.zIndex }
        get isForcedOn() { return this.mode.isForcedOn === "LAST" ? this.mode.wasActive : this.mode.isForcedOn }
        get hasForcedState() { return typeof this.mode.isForcedState === "string" }
        get forcedState() { return this.mode.isForcedState === true && this.mode.wasState ||
                                   this.mode.isForcedState === null && this.state ||
                                   this.mode.isForcedState; }

        // GENERAL
        get name() { return this.data.name }

        get top() { return this.data.top }
        get left() { return this.data.left }
        get height() { return this.data.height }
        get width() { return this.data.width }
        get topEdge() { return D.Int(this.top - 0.5 * this.height) }
        get bottomEdge() { return D.Int(this.top + 0.5 * this.height) }
        get leftEdge() { return D.Int(this.left - 0.5 * this.width) }
        get rightEdge() { return D.Int(this.left + 0.5 * this.width) }
        get position() { return {top: this.top,
                                 left: this.left,
                                 height: this.height,
                                 width: this.width,
                                 topEdge: this.topEdge,
                                 bottomEdge: this.bottomEdge,
                                 leftEdge: this.leftEdge,
                                 rightEdge: this.rightEdge}; }

        get layer() { return this.data.layer }
        get activeLayer() { return this.data.activeLayer }

        get isActive() { return this.data.isActive }

        get wasModeUpdated() { return this.data.wasModeUpdated }
        get wasActive() { return this.mode.wasActive }
        get wasState() { return this.mode.wasState }
        // #endregion

        // #region ~ SETTERS
        set name(v) { this.submit({name: v}) }

        set top(v) { if (v !== this.top) this.setNewPosition({top: v}); }
        set left(v) { if (v !== this.left) this.setNewPosition({left: v}); }
        set height(v) { if (v !== this.height) this.setNewPosition({height: v}); }
        set width(v) { if (v !== this.width) this.setNewPosition({width: v}); }
        set topEdge(v) { if (v !== this.topEdge) this.setNewPosition({topEdge: v}); }
        set bottomEdge(v) { if (v !== this.bottomEdge) this.setNewPosition({bottomEdge: v}); }
        set leftEdge(v) { if (v !== this.leftEdge) this.setNewPosition({leftEdge: v}); }
        set rightEdge(v) { if (v !== this.rightEdge) this.setNewPosition({rightEdge: v}); }
        set position(v) { this.setNewPosition(v) }

        set layer(v) { this.submit({layer: v}) }
        set activeLayer(v) { this.submit({activeLayer: v, layer: this.isActive ? v : this.layer}) }

        set isActive(v) { this.submit({isActive: Boolean(v), layer: v ? this.activeLayer : "walls"}) }

        set wasModeUpdated(v) { this.submit({wasModeUpdated: Boolean(v)}) }
        set wasActive(v) { this.submit({modes: {[Session.LastMode]: {wasActive: Boolean(v)}}}) }
        set wasState(v) { this.submit({modes: {[Session.LastMode]: {wasState: v}}}) }
        // #endregion

        // #region ~ PRIVATE METHODS
        submit(deltas) {
            this.pendingData = D.Merge(this.pendingData, deltas);
            this.pendingChanges = D.FilterForChanges(this.libData,
                                                     D.FilterForObjectAttributes(this.obj, 
                                                                                 D.Merge(this.pendingChanges, deltas)));
            if (!(_.isEmpty(this.pendingChanges) && _.isEmpty(this.pendingData)) && !PENDINGCHANGES.includes(this))
                PENDINGCHANGES.push(this);
        }
        setNewPosition(delta) {
            const posData = Object.assign({}, _.pick(this.position, "top", "left", "height", "width"), _.pick(delta, "top", "left", "height", "width"));
            const edgeData = Object.assign({}, _.pick(this.position, "leftEdge", "rightEdge", "topEdge", "bottomEdge"), _.pick(delta, "leftEdge", "rightEdge", "topEdge", "bottomEdge"));
            if ("topEdge" in delta && "bottomEdge" in delta) {
                posData.height = D.Int(edgeData.bottomEdge - edgeData.topEdge);
                posData.top = D.Int((edgeData.topEdge + edgeData.bottomEdge) / 2);
            } else if ("topEdge" in delta) {
                posData.top = D.Int(edgeData.topEdge + 0.5 * posData.height);
            } else if ("bottomEdge" in delta) {
                posData.top = D.Int(edgeData.bottomEdge - 0.5 * posData.height);
            }
            if ("leftEdge" in delta && "rightEdge" in delta) {
                posData.width = D.Int(edgeData.rightEdge - edgeData.leftEdge);
                posData.left = D.Int((edgeData.leftEdge + edgeData.rightEdge) / 2);
            } else if ("leftEdge" in delta) {
                posData.left = D.Int(edgeData.leftEdge + 0.5 * posData.width);
            } else if ("rightEdge" in delta) {
                posData.left = D.Int(edgeData.rightEdge - 0.5 * posData.width);
            }
            this.submit(posData);
        }
        syncLibrary() {
            this.submit({
                page: _.findKey(C.PAGES, v => v === this.obj.get("_pageid")),
                layer: this.obj.get("layer"),
                isActive: this.layer !== "walls",
                top: D.Int(this.obj.get("top")),
                left: D.Int(this.obj.get("left")),
                height: D.Int(this.obj.get("height")),
                width: D.Int(this.obj.get("width"))
            });
        }
        syncObject() {
            this.submit({
                name: this.name,
                left: this.left,
                top: this.top,
                height: this.height,
                width: this.width,
                layer: this.isActive ? this.activeLayer : "walls"
            });
        }
        // #endregion

        // #region ~ PUBLIC METHODS         
        Apply(isTesting = false) {
            if (!_.isEmpty(this.pendingChanges))
                if (isTesting) {
                    D.Alert([
                        D.JS(this.pendingChanges),
                        D.JS(this.pendingData)
                    ].join("<br><br>"), `APPLY: ${this.name}`);
                } else {
                    this.obj.set(this.pendingChanges);
                    this.pendingChanges = {};
                }
            this.libData = D.Merge(this.libData, this.pendingData, false);
            this.pendingData = {};
        }
        ChangeMode() {
            this.wasActive = this.isActive;
            this.wasState = this.state;
            switch (this.isForcedOn) {
                case true: case false: this.isActive = this.isForcedOn; break;
                case "LAST": this.isActive = this.wasActive; break;
                case null: break;
                // no default
            }
            if (this.isActive && this.forcedState)
                this.Set(this.forcedState);
        }
        Toggle(isActive = null, isForcing = false) {
            isActive = typeof isActive === "boolean" ? isActive : !this.isActive;
            if (isActive !== this.isActive && (!isActive ||
                                               this.isForcedOn !== "NEVER" || isForcing))
                this.isActive = isActive;
        }
        ForceToggle(isActive = null) { this.Toggle(isActive, true) }
        Set(state, isActivating = true) { 
            this.submit({state});
            if (isActivating)
                this.Toggle(true);
        }        
        Fix() {
            this.obj.set(D.FilterForObjectAttributes(this.obj,
                                                     D.Merge(this.data, this.pendingChanges)));
            this.libData = D.Merge(this.libData, this.pendingData, false);
            this.pendingChanges = {};
            this.pendingData = {};
        }
        Unregister() { delete Asset.LIB[this.id]; delete LI.B[this.id] }
        Remove() { this.obj.remove(); this.Unregister() }
        // #endregion
    }
    class Image extends Asset {       
        // #region ~ STATIC METHODS, GETTERS & SETTERS
        // #region Instance Storage Libraries (Image.LIB, Image.DragPads)
        static get LIB() { return this._ImageLIB }
        static set LIB(v) { this._ImageLIB = Object.assign(this._ImageLIB || {}, 
                                                           {[v.id]: v}); }
        static get DragPads() { return this._DragPadsLIB }
        static set DragPads(v) { this._DragPadsLIB = Object.assign(this._DragPadsLIB || {},
                                                                   {[v._dragPads._data[0].id]: v},
                                                                   {[v._dragPads._data[1].id]: v}); }
        static get DragPadFunctions() { return FUNCTIONS }
        // #endregion        
        static Get(imgRef) { return Asset.Get(imgRef, "image") }
        static Initialize(imgID) {
            const imgAsset = new Image(imgID);
            Asset.LIB = imgAsset;
            Image.LIB = imgAsset;
            if (imgAsset.hasDragPads)
                Image.DragPads = imgAsset;
            return imgAsset;
        }
        static ParseSrcURL(url) { return url.replace(/[a-z]*\.(png|jpg|jpeg)/gu, "thumb.$1") }
        // #endregion

        // #region ~ BASIC GETTERS & SETTERS
        get dragPadLibData() { return this.data.dragPads }
        get pendingDragPadChanges() { return this.hasDragPads && this._dragPads._data.map(x => x._pendingChanges) }
        set pendingDragPadChanges(v) { if (this.hasDragPads) this._dragPads._data.forEach((x, i) => { x._pendingChanges = v[i] }); }
        // #endregion        

        // #region ~ CONSTRUCTOR
        constructor(imgID) { super(imgID);
            imgID = typeof imgID === "object" ? imgID.id : imgID;
            try {
                if (!_.isEmpty(this.dragPadLibData)) {
                    this._dragPads = {
                        _areOnline: this.dragPadLibData.startActive,
                        _func: Image.DragPadFunctions[this.dragPadLibData.funcName],
                        _data: this.data.dragPads.ids.
                            map(id => getObj("graphic", id)).
                            map(pad => ({
                                id: pad.id,
                                obj: pad,
                                layer: pad.get("layer"),                                
                                top: this.top + (this.data.dragPads.deltaTop || 0 ),
                                left: this.left + (this.data.dragPads.deltaLeft || 0 ),
                                height: this.height + (this.data.dragPads.deltaHeight || 0 ),
                                width: this.width + (this.data.dragPads.deltaWidth || 0 ),
                                _pendingChanges: {}
                            }))
                    };
                    if (this._dragPads._data[1].layer !== "walls")
                        this._dragPads._data.reverse();                    
                    // this._dragPads.objs.forEach((x, i) => x.set({name: x.get("name").replace(/_(Partner)?Pad$/g, `_Pad${i}`)}));
                    // this._dragPads.objs.forEach(x => x.set({name: x.get("name").replace(/_Pad(\d)$/g, x.get("name").includes("Pad0") ? "_Pad" : "_PartnerPad")}));
                    this.syncDragPads();
                }
                this.submit({isdrawing: true});    
            } catch (errObj) {                
                THROW(`Error Constructing Asset '${D.JS(Media.GetImgData(imgID) ? Media.GetImgData(imgID).name : imgID)}' --> `, "Image", errObj);
            }
        }
        // #endregion

        // #region ~ GETTERS
        // READ-ONLY
        get srcs() { return typeof this.data.srcs === "string" ? Asset.Get(this.data.srcs).srcs : this.data.srcs }
        get srcNames() { return Object.keys(this.srcs) }

        get hasDragPads() { return Boolean(this._dragPads) }
        get dragPads() { return this.hasDragPads && this._dragPads._data.map(x => x.obj) }
        get dragPadData() { return this.hasDragPads && this._dragPads._data.map(x => D.Merge(_.omit(x, "_pendingChanges"), x._pendingChanges, false)) }
        get dragPadFunc() { return this.hasDragPads && this._dragPads._func }

        get dragPadsTop() { return this.hasDragPads && this.dragPadData[0].top }
        get dragPadsLeft() { return this.hasDragPads && this.dragPadData[0].left }
        get dragPadsHeight() { return this.hasDragPads && this.dragPadData[0].height }
        get dragPadsWidth() { return this.hasDragPads && this.dragPadData[0].width }
        
        get areDragPadsOnline() { return this.hasDragPads && this._dragPads._areOnline }
        
        // GENERAL
        get areDragPadsActive() { return this.areDragPadsOnline && this.isActive } // Getting areOnline ONLY returns 'true' if both areOnline and isActive are true
        // #endregion

        // #region ~ SETTERS
        set areDragPadsActive(v) { // Setting dragPadsActivation ONLY activates dragPads if image object is active too (see dragPadsActive getter)
            if (this.hasDragPads && v !== this.areDragPadsOnline) {
                this._dragPads._areOnline = v;
                this.syncDragPads(true);
            }
        }        
        // #endregion
        
        // #region ~ PRIVATE METHODS
        // #region Overrides (Asset)
        submit(deltas) { super.submit(deltas);
            if (this.hasDragPads)
                this.syncDragPads();
        }   
        // #endregion       
        submitDragPads(deltas) {
            deltas = Array.isArray(deltas) && deltas || [deltas, deltas];
            this.pendingDragPadChanges = this.pendingDragPadChanges.
                map((x, i) => D.FilterForObjectAttributes(this.dragPadData[i].obj, 
                                                          D.Merge(x, deltas[i])));
            if (!_.all(this.pendingDragPadChanges, x => _.isEmpty(x)) && !PENDINGCHANGES.includes(this))
                PENDINGCHANGES.push(this);
        }
        syncDragPads(isLayerOnly = false) {
            if (this.hasDragPads) {
                this.submitDragPads([{layer: this.areDragPadsActive && "objects" || "walls"},
                                     {layer: "walls"}]);
                if (!isLayerOnly)
                    this.submitDragPads({
                        top: this.dragPadsTop,
                        left: this.dragPadsLeft,
                        height: this.dragPadsHeight,
                        width: this.dragPadsWidth
                    });
            }
        }        
        flipDragPads() {
            if (this.hasDragPads) {
                this._dragPads._data.reverse();
                this.syncDragPads();
                this.Apply();
            }
        }
        getDragPadMoveDirs() {
            const [deltaVert, deltaHoriz] = this.dragPadData.
                map(x => [Math.floor(x.obj.get("top") - this.dragPadsTop),
                          Math.floor(x.obj.get("left") - this.dragPadsLeft)]).
                find(x => _.any(x)) || [0, 0];
            if (deltaVert || deltaHoriz) {
                const moveData = [
                    deltaVert > 0 ? "down" : "up",
                    deltaHoriz > 0 ? "right" : "left"
                ];
                if (Math.abs(deltaHoriz) > Math.abs(deltaVert))
                    moveData.reverse();    
                moveData.push(
                    Math.abs(deltaHoriz) / Math.abs(deltaVert) >= 0.75 && 
                    Math.abs(deltaHoriz) / Math.abs(deltaVert) <= 1.33
                );
                return moveData;
            }
            return [false, false, false];
        }        
        fireDragPad() {   
            if (this.areDragPadsActive) {
                const moveData = this.getDragPadMoveDirs();
                this.flipDragPads();
                this.dragPadFunc(this, moveData);
            }
        }  
        // #endregion

        // #region ~ PUBLIC METHODS
        // #region Overrides (Asset)
        Apply(isTesting = false) { super.Apply(isTesting);
            if (this.hasDragPads)
                if (isTesting) {
                    D.Alert(D.JS(this.pendingDragPadChanges), `IMAGE - DRAGPADS: ${this.name}`);
                } else {
                    this.pendingDragPadChanges.forEach((x, i) => {
                        if (!_.isEmpty(x)) { 
                            this.dragPadData[i].obj.set(x);
                            this._dragPads._data[i] = D.Merge(this._dragPads._data[i], x, false);
                        } 
                    });
                    this.pendingDragPadChanges = [{}, {}];
                }
        }
        Toggle(isActive = null, isForcing = false) { super.Toggle(isActive, isForcing);
            if (this.hasDragPads)
                this.syncDragPads(true);
        }
        Set(state, isActivating = true) { super.Set(state, isActivating);
            this.submit({imgsrc: `${C.IMGPREFIX}${this.srcs[state]}`});
        }
        Fix() { super.Fix();
            if (this.hasDragPads)
                this.dragPadData.forEach((x, i) => this.dragPads[i].set(D.FilterForObjectAttributes(this.dragPads[i], x)));
        }
        Unregister() { super.Unregister();
            delete Image.LIB[this.id];
            if (this.hasDragPads)
                this.dragPadData.forEach(x => delete Image.DragPads[x.id]);
        }
        Remove() { super.Remove();
            if (this.hasDragPads)
                this.dragPadData.forEach(x => x.obj.remove());
        }
        // #endregion
        GetSrcFromURL(url) { return _.findKey(this.srcs, v => v === Image.ParseSrcURL(url)) };
        Add(srcRef, srcName) {
            const asset = Asset.Get(srcRef);
            if (asset) {
                this.libData = {srcs: asset.name};
            } else {
                srcRef = typeof srcRef === "object" && "get" in srcRef && srcRef.get("imgsrc") || srcRef;
                this.libData = {srcs: {[srcName]: Image.ParseSrcURL(srcRef)}};
            }
        }
        Cycle(isReversing = false) { this.Set(this.srcNames[D.Cycle(this.srcNames.indexOf(this.state) + (isReversing ? -1 : 1), 0, this.srcNames.length - 1)]) }
        Random() {
            this._shuffledSrcs = (this._shuffledSrcs || []).length ? this._shuffledSrcs : _.shuffle(Object.keys(this.srcs));
            this.Set(this._shuffledSrcs.pop());
        }        
        ToggleDragPads(padsActive) { 
            if (this.hasDragPads)
                this.areDragPadsActive = typeof padsActive === "boolean" ? padsActive : !this.areDragPadsOnline;
        }
        MakeDragPads(funcName, deltaHeight = 0, deltaWidth = 0, deltaTop = 0, deltaLeft = 0, startActive = true) {
            const padsData = {
                top: this.top + deltaHeight,
                left: this.left + deltaWidth,
                height: this.height + deltaHeight,
                width: this.width + deltaWidth
            };
            const padParams = [startActive && this.isActive ? "objects" : "walls", "walls"].map(x => Object.assign({}, padsData, {layer: x}));
            const padObjs = padParams.map((x,i) => createObj("graphic", Object.assign({},
                                                                                      x,
                                                                                      {
                                                                                          name: `${this.name}_Pad${i}`,
                                                                                          imgsrc: C.IMAGES.blank,
                                                                                          isdrawing: true,
                                                                                          controlledby: "all"
                                                                                      }
            )));
            this.data.dragPads = {
                ids: padObjs.map(x => x.id),
                funcName,
                startActive,
                deltaTop,
                deltaLeft,
                deltaHeight,
                deltaWidth
            };
            this._dragPads = {
                ids: padObjs.map(x => x.id),
                objs: padObjs,
                layers: startActive && this.isActive ? ["objects", "walls"] : ["walls", "walls"],
                func: DragPads.Functions[funcName],
                areOnline: startActive
            };
            Object.assign(this._dragPads, padsData);
        }
        RemoveDragPads() {
            if (this.hasDragPads) {
                this.dragPadData.forEach(x => { delete Image.DragPads[x.id]; x.remove() });
                delete this._dragPads;
            }
        }   
        // #endregion
    }
    class Anim extends Image {  
        // #region ~ STATIC METHODS, GETTERS & SETTERS
        // #region Instance Storage Libraries (Anim.LIB)
        static get LIB() { return this._AnimLIB }
        static set LIB(v) { this._AnimLIB = Object.assign(this._AnimLIB || {}, {[v.id]: v}) }
        // #endregion
        static Get(animRef) { return Asset.Get(animRef, "anim") }
        static Initialize(animID) {
            const animAsset = new Anim(animID);
            Asset.LIB = animAsset;
            Image.LIB = animAsset;
            Anim.LIB = animAsset;
            if (animAsset.hasDragPads)
                Image.DragPads = animAsset;
            return animAsset;
        }
        static Make() { D.Alert("Cannot dynamically create Animation assets!", "ERROR: Anim.Make") }
        // #endregion
        
        // #region ~ BASIC GETTERS & SETTERS
        // set libData(v) { super.libData = _.omit(v, "state", "srcs") }
        // set pendingData(v) { super.pendingData = _.omit(v, "state", "srcs") }
        // #endregion

        // #region ~ CONSTRUCTOR
        constructor(animID) { super(animID);
            this.submit({isdrawing: true});
        }
        /* AssetConstructor(assetID) {
                    this._id = assetID;
                    this._objType = {image: "graphic", token: "graphic", anim: "graphic", text: "text"}[LI.B[assetID].type];
                    this._obj = getObj(this._objType, this._id);
                    this._pendingChanges = {};
                    this._pendingData = {};
                    this.syncLibrary(); // Updating LIBRARY with current object data & calculating derivative stats.
            } */
        /* ImageConstructor(imgID) {
                    if (this.padData) {
                        const padObjs = this.padData.ids.map(x => getObj("graphic", x));
                        this._dragPads = {
                            ids: padObjs.map(x => x.id),
                            objs: [...padObjs],
                            layers: padObjs.map(x => x.get("layer")),
                            func: DragPads.Functions[this.padData.funcName],
                            areOnline: this.padData.startActive
                        };
                        if (this._dragPads.layers[1] !== "walls") {
                            this._dragPads.ids.reverse();
                            this._dragPads.layers.reverse();
                            this._dragPads.objs.reverse();
                        }
                        this._pendingDragPadChanges = [{}, {}];
                        this.syncDragPads();
                    }
                    this.pendingChanges = {isdrawing: true};  
            } */
        /* "ANIM" LIBRARY EXAMPLE:
                [animID]: {
                    id: "-M-Ir4EN9n8m_BgQmqDw",
                    name: "WeatherLightning_1",
                    type: "anim",
                    page: "GAME",
                    layer: "walls",
                    zIndex: 50,
                    top: 254,
                    left: 322,
                    height: 337,
                    width: 600,
                    state: "103762471/wLL7EeDyo1VCX1PboCYQVQ/thumb.webm?1580881171",
                    isActive: false,
                    activeLayer: "map",
                    wasModeUpdated: true,
                    modes: {
                        Active: { isForcedOn: NULL, lastState: NULL, lastActive: false },
                        Inactive: { isForcedOn: NULL, lastState: NULL, lastActive: false },
                        Daylighter: { isForcedOn: NULL, lastState: NULL },
                        Downtime: { isForcedOn: NULL, lastState: NULL },
                        Spotlight: { isForcedOn: NULL, lastState: NULL },
                        Complications: { isForcedOn: NULL, lastState: NULL }
                    },
                    srcs: false,
                    timeOut: 1000,              // false if animation doesn't timeout
                    minTimeBetween: 45000,      // false if animation doesn't timeout
                    maxTimeBetween: 75000,      // false if animation doesn't timeout
                    soundEffect: "Thunder"      // false if no sound effect
                }
            */
        // #endregion

        // #region ~ GETTERS 
        // READ-ONLY
        get hasForcedState() { return false }
        get forcedState() { return false }

        // MODE DATA
        get wasState() { return false }
        // #endregion

        // #region ~ SETTERS
        // MODE DATA
        set wasState(v) { D.Alert("Cannot set wasState of Animation objects!", `ERROR: ${this.name}.wasState`) }

        // PENDING CHANGES
        // set pendingChanges(v) { super.pendingChanges = _.omit(v, "state", "srcs") }
        // #endregion

        // #region ~ PRIVATE METHODS
        // #endregion

        // #region ~ PUBLIC METHODS
        // #region Overrides (Image)
        ChangeMode() {
            this.wasActive = this.isActive;
            switch (this.isForcedOn) {
                case true: case false: this.isActive = this.isForcedOn; break;
                case "LAST": this.isActive = this.wasActive; break;
                case null: break;
                // no default
            }
            // No setting lastState for animation objects.
        }
        Unregister() { super.Unregister(); delete Anim.LIB[this.id] }
        // #endregion
    }
    class Token extends Image {
        // #region ~ STATIC METHODS, GETTERS & SETTERS
        // #region Instance Storage Libraries (Asset.LIB)
        static get LIB() { return this._TokenLIB }
        static set LIB(v) { this._TokenLIB = Object.assign(this._TokenLIB || {}, {[v.id]: v}) }
        // #endregion
        static Get(tokenRef) { return Asset.Get(tokenRef, "token") }
        static Initialize(tokenObj) {
            const tokenAsset = new Token(tokenObj);
            tokenAsset.pendingChanges = {};
            tokenAsset.pendingData = {};
            Asset.LIB = tokenAsset;
            Image.LIB = tokenAsset;
            Token.LIB = tokenAsset;
            tokenAsset.submit({isdrawing: false});
            tokenAsset.Apply();
            return tokenAsset;
        }
        static InitializeAll() {
            for (const tokenObj of findObjs({_type: "graphic", _subtype: "token"}).filter(x => x.get("represents")))
                Token.Initialize(tokenObj);
        }
        // #endregion

        // #region ~ BASIC GETTERS & SETTERS
        get libData() { return LI.B[this.id] || LI.B[this.charID || this.obj.get("represents")] || {type: "token",
                                                                                                    zIndex: 1000,
                                                                                                    height: 100,
                                                                                                    width: 90,
                                                                                                    modes: { }
        }; }
        set libData(v) { }
        // #endregion

        // #region ~ CONSTRUCTOR
        constructor(imgObj) {          
            /* AssetConstructor(assetID) {
                try {
                    this._id = assetID;
                    this._objType = {image: "graphic", token: "graphic", anim: "graphic", text: "text"}[LI.B[assetID].type];
                    this._obj = getObj(this._objType, this._id);
                    this._pendingChanges = {};
                    this._pendingData = {};
                    this.syncLibrary(); // Updating LIBRARY with current object data & calculating derivative stats.
                    Asset.LIB = this;
                } catch (errObj) {
                    THROW(`Error Constructing Asset '${D.JS(assetID)}'`, "ASSET", errObj);
                }
            } */
            /* ImageConstructor(imgID) {
                super(imgID);
                try {
                    if (this.padData) {
                        const padObjs = this.padData.ids.map(x => getObj("graphic", x));
                        this._dragPads = {
                            ids: padObjs.map(x => x.id),
                            objs: [...padObjs],
                            layers: padObjs.map(x => x.get("layer")),
                            func: DragPads.Functions[this.padData.funcName],
                            areOnline: this.padData.startActive
                        };
                        if (this._dragPads.layers[1] !== "walls") {
                            this._dragPads.ids.reverse();
                            this._dragPads.layers.reverse();
                            this._dragPads.objs.reverse();
                        }
                        // this._dragPads.objs.forEach((x, i) => x.set({name: x.get("name").replace(/_(Partner)?Pad$/g, `_Pad${i}`)}));
                        // this._dragPads.objs.forEach(x => x.set({name: x.get("name").replace(/_Pad(\d)$/g, x.get("name").includes("Pad0") ? "_Pad" : "_PartnerPad")}));
                        this._pendingDragPadChanges = [{}, {}];
                        this.syncDragPads();
                    }
                    if (this._type === "image")
                        this.pendingChanges = {isdrawing: true};     
                } catch (errObj) {                
                    THROW(`Error Constructing Asset '${D.JS(Media.GetImgData(imgID) ? Media.GetImgData(imgID).name : imgID)}' --> `, "Image", errObj);
                }
            } */
            /* "TOKEN" LIBRARY EXAMPLE:
                [charID]: {
                    id: false,
                    name: "Kai",
                    type: "token",
                    page: "GAME",
                    layer: "objects",
                    zIndex: 1000,
                    top: false,
                    left: false,
                    height: 100,
                    width: 90,
                    state: "base",                      // = index if random token; = false if generic token
                    isActive: true,
                    activeLayer: "objects",
                    wasModeUpdated: true,
                    modes: { },
                    srcs: {                             // = array if random token; = tokencat (string) if generic token
                        base: "96482169/auY4eFbhRRkS8DIVcQORGQ/thumb.png?1573282109" 
                    },
                    charID: "-Lt9QXmY7HUtLjJPxq7U",
                    homePos: { 
                        top: 875, 
                        left: 795 
                    },
                    lastPos: { 
                        top: 875, 
                        left: 795 
                    },
                    controllers: [ 
                        "-Lt3NSz8cKkFxCrZsEmr" 
                    ],
                    isGenericToken: false,
                    isRandomToken: false
                }
            */
            /* get("_defaulttoken") Callback Data: 
                charObj.get("_defaulttoken", (data) => {
                    data = {
                        left: 837,
                        top: 196,
                        width: 90,
                        height: 73,
                        imgsrc: "https://s3.amazonaws.com/files.d20.io/images/127701981/1olUt2HD-_ip-NCQ7idkaA/thumb.png?1587897342",
                        page_id: "-Lt3Ml6LYAIgYbWB6IVq",
                        layer: "objects",
                        name: "Itho Bofraaj",
                        represents: "-M5pe3RFB1O7wfR31Olx",
                        showname: true
                    }
                }
            */
            super(imgObj);
            try { // *** OR: Instantiate this object only when a token is added to the board
                this._charID = imgObj.get("represents");
                this._charObj = getObj("character", this._charID);
                this._name = this._charObj.get("name");
            } catch(errObj) {              
                THROW(`Error Constructing Token for '${D.JSL(imgObj)}'`, "Token", errObj);
            }
        }
        // #endregion

        // #region ~ GETTERS 
        // READ-ONLY
        get charID() { return this._charID }
        get charObj() { return this._charObj }

        // GENERAL
        get top() { return D.Int(this.obj.get("top")) }
        get left() { return D.Int(this.obj.get("left")) }
        // #endregion

        // #region ~ SETTERS
        
        // #endregion

        // #region ~ PRIVATE METHODS

        // #endregion

        // #region ~ PUBLIC METHODS
        // #region Overrides (Image)
        Unregister() { super.Unregister(); delete Token.LIB[this.id] }
        // #endregion
    }
    class Text extends Asset {
        // #region ~ STATIC METHODS, GETTERS & SETTERS
        // #region Instance Storage Libraries (Text.LIB)     
        static get LIB() { return this._TextLIB }
        static set LIB(v) { this._TextLIB = Object.assign(this._TextLIB || {}, 
                                                          {[v.id]: v}); }
        // #endregion
        static Get(textRef) { return Asset.Get(textRef, "text") }
        static Initialize(textID) {
            const textAsset = new Text(textID);
            Asset.LIB = textAsset;
            Text.LIB = textAsset;
            return textAsset;
        }
        // #endregion

        // #region ~ BASIC GETTERS & SETTERS
        get pendingShadowChanges() { return this.hasShadow && this._pendingShadowChanges }
        set pendingShadowChanges(v) { if (this.hasShadow) this._pendingShadowChanges = v; }
        // #endregion

        // #region ~ CONSTRUCTOR
        constructor(textID) { super(textID);
            try {
                if (this.data.shadowID) {
                    this._shadowObj = getObj("text", this.data.shadowID);
                    this._pendingShadowChanges = {};
                }
            } catch (errObj) {
                THROW(`Error Constructing Asset '${D.JS(Media.GetTextData(textID) ? Media.GetTextData(textID).name : textID)}'`, "TEXT", errObj);
            }
        }
        // #endregion

        // #region ~ GETTERS
        // READ-ONLY
        get lineHeight() { return this.data.lineHeight }        
        get hasShadow() { return Boolean(this._shadowObj) }
        get shadowObj() { return this.hasShadow && this._shadowObj }

        // GENERAL
        get color() { return this.data.color }
        get font() { return this.data.font_family }
        get size() { return this.data.font_size }

        get shadowShift() { return this.hasShadow && this.data.shadowShift }
        // "real pos" overrides
        // justification & line splitting
        // #endregion

        // #region ~ SETTERS
        set color(v) { if (v !== this.color) this.submit({color: v}); }
        set font(v) { if (v !== this.font) this.submit({font_family: v}); }
        set size(v) { if (v !== this.size) this.submit({font_size: v}); }
        
        set shadowShift(v) { if (this.hasShadow && v !== this.shadowShift) this.submit({shadowShift: v}); }
        // #endregion
       
        // #region ~ PRIVATE METHODS
        // #region Overrides (Asset)
        submit(deltas) { super.submit(deltas);
            this.justifyText();
            if (this.hasShadow)
                this.syncShadow();
        }
        // #endregion      
        submitShadow(deltas) {
            if (this.hasShadow) {
                this.pendingShadowChanges = D.FilterForObjectAttributes(this.shadowObj,
                                                                        D.Merge(this.pendingShadowChanges, deltas));
                if (!PENDINGCHANGES.includes(this) && !_.isEmpty(this.pendingShadowChanges))
                    PENDINGCHANGES.push(this);
            }
        }
        syncShadow() {
            if (this.hasShadow)
                this.submitShadow({
                    layer: this.layer,
                    top: this.top += this.shadowShift,
                    left: this.left += this.shadowShift,
                    text: this.state
                });
        }
        justifyText() { }
        // #endregion

        // #region ~ PUBLIC METHODS
        // #region Overrides (Asset)
        Apply(isTesting = false) { super.Apply(isTesting);
            if (this.hasShadow && !_.isEmpty(this.pendingShadowChanges))
                if (isTesting) {
                    D.Alert(D.JS(this.pendingShadowChanges), `TEXT - SHADOW: ${this.name}`);
                } else {
                    this.shadowObj.set(this.pendingShadowChanges);
                    this._pendingShadowChanges = {};
                }
        }
        Set(state, isActivating = true) { super.Set(state, isActivating);
            this.submit({text: this.state});
        }
        Remove() { super.Remove();
            if (this.hasShadow)
                this.shadowObj.remove();        
        }
        // #endregion
        // #endregion
    }
    // #endregion

    // #region ~ INSTANTIATION   
    const initAssets = (isTesting = false) => {
        initIMGAssets();
        initTEXTAssets();
        initANIMAssets();
        Token.InitializeAll();
        Asset.ApplyPendingChanges(isTesting);
    };
    const initIMGAssets = () => {
        for (const assetID of Object.keys(STATE.REF.AssetLibrary).filter(x => STATE.REF.AssetLibrary[x].type === "image"))
            Image.Initialize(assetID);
        D.Flag("... ... Image Assets Compiled!");
    };        
    const initTEXTAssets = () => {
        for (const assetID of Object.keys(STATE.REF.AssetLibrary).filter(x => STATE.REF.AssetLibrary[x].type === "text"))
            Text.Initialize(assetID);
        D.Flag("... ... Text Assets Compiled!");
    };    
    const initANIMAssets = () => {
        for (const assetID of Object.keys(STATE.REF.AssetLibrary).filter(x => STATE.REF.AssetLibrary[x].type === "anim"))
            Anim.Initialize(assetID);
        D.Flag("... ... Animation Assets Compiled!");
    };
    // #endregion

    // #region ~ ************* RETURN ****************************
    return {
        CheckInstall: checkInstall,
        OnChatCall: onChatCall, OnGraphicAdd: onGraphicAdd, OnGraphicDestroy: onGraphicDestroy, OnGraphicChange: onGraphicChange,

        Init: initAssets,

        Get: Asset.Get,

        Apply: Asset.ApplyPendingChanges

    };
    // #endregion
})();

on("ready", () => {
    Assets.CheckInstall();
    D.Log("Assets Ready!");
});
void MarkStop("Assets");