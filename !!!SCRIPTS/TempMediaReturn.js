/* eslint-disable one-var */
void MarkStart("Assets");
const Assets = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Assets",

        // #region (hide) COMMON INITIALIZATION
        STATE = {get REF() { return C.RO.OT[SCRIPTNAME] }},
        VAL = (varList, funcName, isArray = false) => D.Validate(varList, funcName, SCRIPTNAME, isArray),
        DB = (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME),
        LOG = (msg, funcName) => D.Log(msg, funcName, SCRIPTNAME),
        THROW = (msg, funcName, errObj) => D.ThrowError(msg, funcName, SCRIPTNAME, errObj),

        checkInstall = () => {
            C.RO.OT[SCRIPTNAME] = C.RO.OT[SCRIPTNAME] || {};
            initialize();
        },
        // #endregion

        // #region LOCAL INITIALIZATION
        initialize = () => {
            STATE.REF.AssetLibrary = STATE.REF.AssetLibrary || {};
        },
        // #endregion

        // #region (hide) EVENT HANDLERS: (HANDLEINPUT)
        onChatCall = (call, args, objects, msg) => {
            const assets = [call, ...args].filter(x => x.startsWith("+")).map(x => Asset.Get(x.replace(/^\+/gu, "")));
            // assets.push(...Listener.GetObjects(objects, "graphic").map(x => MediaAsset.Get(x)))
            // assets.push(...Listener.GetObjects(objects, "text").map(x => MediaAsset.Get(x)))
            args = args.filter(x => !x.startsWith("+"));
            switch (call) {
                case "get": {
                    switch (D.LCase(call = args.shift())) {
                        case "all": case "full": {
                            switch (D.LCase(call = args.shift())) {
                                case "library": D.Alert(D.JS(LI.B), "ASSET LIBRARY"); break;
                                case "assets": D.Alert(`${D.JS(Asset.LIB)} (${Object.keys(Asset.LIB).length})`, "ASSETS"); break;
                                case "img": D.Alert(D.JS(Object.values(Image.LIB).map(x => x.name)), "IMAGE ASSETS"); break;
                                case "text": D.Alert(D.JS(Object.values(Text.LIB).map(x => x.name)), "TEXT ASSETS"); break;
                                case "pads": case "dragpads": {
                                    const alertLines = [];
                                    for (const [padID, image] of Object.entries(Image.DragPads)) 
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
                        // no default
                    }
                    break;
                }
                case "init": {
                    // parseREGISTRY();
                    initIMGAssets();
                    initTEXTAssets();
                    Asset.ApplyPendingChanges();
                    break;
                }
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
                }

                // no default
            }
        }; /* ,
        onGraphicAdd = imgObj => {
            
        }
        */
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    // #region (hide) TOP SCOPE VARIABLE DELCARATIONS
    const PENDINGCHANGES = [],
        LI = {
            get B() { return STATE.REF.AssetLibrary }
        },
        ASSETS = {};
    // #endregion

    // #region CLASS DEFINITIONS
    class Asset {
        // #region (hide) STATIC METHODS
        static ApplyPendingChanges() {
            for (const asset of PENDINGCHANGES)
                asset.Apply();
            PENDINGCHANGES.length = 0;
        }
        static Get(assetRef) { // Get an Asset instance by passing an asset, object, an id, or a name.
            if (assetRef instanceof Asset)
                return assetRef;
            if (typeof assetRef === "object" && "id" in assetRef && assetRef.id in Asset.LIB)
                return Asset.LIB[assetRef.id];
            if (typeof assetRef === "string") {
                if (assetRef in Asset.LIB)
                    return Asset.LIB[assetRef];
                return Asset.LIB[Object.keys(Asset.LIB).find(x => Asset.LIB[x].name.startsWith(assetRef)) || ""] || false;
            }
            return false;
        }
        static Make(assetType, assetData) { }
        static get LIB() { return this._AssetLIB }
        static set LIB(v) { 
            this._AssetLIB = this._AssetLIB || {};
            this._AssetLIB[v.id] = v;
        }
        // #endregion

        // #region (hide) CONSTRUCTOR
        constructor(assetID) {
            try {
                this._id = assetID;
                this._data = LI.B[assetID];
                this._objectType = {image: "graphic", token: "graphic", anim: "graphic", text: "text"}[this._data.type];
                this._object = getObj(this._objectType, this._id);
                this._pendingChanges = {};
                this.syncLibrary(); // Updating LIBRARY with current object data & calculating derivative stats.
                Asset.LIB = this;
            } catch (errObj) {
                THROW(`Error Constructing Asset '${D.JS(assetID)}'`, "ASSET", errObj);
            }
        }
        // #endregion

        // #region (hide) GETTERS 
        // READ-ONLY
        get id() { return this._id }
        get obj() { return this._object }
        get objType() { return this._objectType }
        get type() { return this._data.type }
        get page() { return this._data.page }
        get state() { return this._data.state }
        get zIndex() { return this._data.zIndex }
        get isForcedOn() {
            if (this._data.modes[Session.Mode].isForcedOn === "LAST")
                return this._data.modes[Session.Mode].lastActive;
            return this._data.modes[Session.Mode].isForcedOn;
        }
        get isForcedState() {
            if (this._data.modes[Session.Mode].isForcedState === true)
                return this._data.modes[Session.Mode].lastState;
            return this._data.modes[Session.Mode].isForcedState;
        }

        // GENERAL
        get name() { return this._data.name }
        get top() { return this._data.pos.top }
        get left() { return this._data.pos.left }
        get height() { return this._data.pos.height }
        get width() { return this._data.pos.width }
        get topEdge() { return this._pos.topEdge }
        get bottomEdge() { return this._pos.bottomEdge }
        get leftEdge() { return this._pos.leftEdge }
        get rightEdge() { return this._pos.rightEdge }
        get position() { return this.setNewPosition }
        get layer() { return this._data.layer }
        get activeLayer() { return this._data.activeLayer }
        get isActive() { return this._data.isActive }

        // MODE DATA
        get wasModeUpdated() { return this._data.wasModeUpdated }
        get lastActive() { return this._data.modes[Session.Mode].lastActive }
        get lastState() { return this._data.modes[Session.Mode].lastState }

        // PENDING CHANGES
        get pendingChanges() { return this._pendingChanges }
        // #endregion

        // #region (hide) SETTERS
        set name(v) {
            if (v !== this.name) {
                this._data.name = v;
                this.pendingChanges = {name: v};
            }
        }
        set top(v) { if (v !== this.top) this.setNewPosition({top: v}); }
        set left(v) { if (v !== this.left) this.setNewPosition({left: v}); }
        set height(v) { if (v !== this.height) this.setNewPosition({height: v}); }
        set width(v) { if (v !== this.width) this.setNewPosition({width: v}); }
        set topEdge(v) { if (v !== this.topEdge) this.setNewPosition({topEdge: v}); }
        set bottomEdge(v) { if (v !== this.bottomEdge) this.setNewPosition({bottomEdge: v}); }
        set leftEdge(v) { if (v !== this.leftEdge) this.setNewPosition({leftEdge: v}); }
        set rightEdge(v) { if (v !== this.rightEdge) this.setNewPosition({rightEdge: v}); }
        set position(v) { this.setNewPosition(v) }
        set layer(v) {
            if (v !== this.layer) {
                this._data.layer = v;
                this.pendingChanges = {layer: v};
            }
        }
        set activeLayer(v) {
            if (v !== this.activeLayer) {
                this._data.activeLayer = v;
                if (this.isActive)
                    this.layer = v;
            }
        }
        set isActive(v) {
            if (v !== this.isActive)
                this.layer = v ? this.activeLayer : "walls";
            this._data.isActive = Boolean(v);
        }

        // MODE DATA
        set wasModeUpdated(v) { this._data.wasModeUpdated = Boolean(v) }
        set lastActive(v) { this._data.modes[Session.LastMode].lastActive = Boolean(v) }
        set lastState(v) { this._data.modes[Session.LastMode].lastState = v }

        // PENDING CHANGES
        set pendingChanges(v) {
            Object.assign(this._pendingChanges, v);
            if (!_.isEmpty(this.pendingChanges) && !PENDINGCHANGES.includes(this))
                PENDINGCHANGES.push(this);
        }
        // #endregion

        // #region (hide) PRIVATE METHODS
        setNewPosition(delta) {
            const posData = Object.assign({}, this._data.pos, _.pick(delta, "top", "left", "height", "width")),
                edgeData = Object.assign({}, this._pos, _.pick(delta, "leftEdge", "rightEdge", "topEdge", "bottomEdge"));
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
            edgeData.topEdge = D.Int(posData.top - 0.5 * posData.height);
            edgeData.bottomEdge = D.Int(posData.top + 0.5 * posData.height);
            edgeData.leftEdge = D.Int(posData.left - 0.5 * posData.width);
            edgeData.rightEdge = D.Int(posData.left + 0.5 * posData.width);

            this.pendingChanges = _.omit(posData, (v, k) => this[k] === v);
            this._data.pos = posData;
            this._pos = edgeData;
        }
        syncLibrary() {
            this._data.pos.top = D.Int(this.obj.get("top"));
            this._data.pos.left = D.Int(this.obj.get("left"));
            this._data.pos.height = D.Int(this.obj.get("height"));
            this._data.pos.width = D.Int(this.obj.get("width"));
            this._data.page = _.findKey(C.PAGES, v => v === this.obj.get("_pageid"));
            this._data.layer = this.obj.get("layer");
            this._data.isActive = this.layer !== "walls";

            // Calculating derivative stats
            this._pos = {
                leftEdge: D.Int(this.left - 0.5 * this.width),
                rightEdge: D.Int(this.left + 0.5 * this.width),
                topEdge: D.Int(this.top - 0.5 * this.height),
                bottomEdge: D.Int(this.top + 0.5 * this.height)
            };
        }
        syncObject() {
            const delta = {
                left: this.left,
                top: this.top,
                height: this.height,
                width: this.width,
                layer: this.isActive ? this.activeLayer : "walls"
            };
            this.pendingChanges = _.omit(delta, (v, k) => this.obj.get(k) === v);
        }
        // #endregion

        // #region (hide) PUBLIC METHODS
        Apply() {
            if (!_.isEmpty(this.pendingChanges)) {
                this.obj.set(this.pendingChanges);
                this._pendingChanges = {};
            }
        }
        ChangeMode() {
            this.lastActive = this.isActive;
            this.lastState = this.state;
            switch (this.isForcedOn) {
                case true: case false: this.isActive = this.isForcedOn; break;
                case "LAST": this.isActive = this.lastActive; break;
                case null: break;
                // no default
            }
            if (this.isActive && this.isForcedState === true)
                this.Set(this.lastState);
        }
        Toggle(isActive = null, isForcing = false) {
            isActive = typeof isActive === "boolean" ? isActive : !this.isActive;
            if (isActive !== this.isActive && (!isActive ||
                                               this.isForcedOn !== "NEVER" || isForcing))
                this.isActive = isActive;
        }
        ForceToggle(isActive = null) { this.Toggle(isActive, true) }
        Set(state) { this._data.state = state }
        Unregister() { delete Asset.LIB[this.id]; delete LI.B[this.id] }
        Remove() { this.obj.remove(); this.Unregister() }
        // #endregion
    }
    class Image extends Asset {
        // #region (hide) STATIC METHODS
        static ParseSrcURL(url) { return url.replace(/[a-z]*\.(png|jpg|jpeg)/gu, "thumb.$1") }
        static get LIB() { return this._ImageLIB }
        static set LIB(v) { 
            this._ImageLIB = this._ImageLIB || {};
            this._ImageLIB[v.id] = v;
        }
        static get DragPads() { return this._DragPadsLIB }
        static set DragPads(v) {
            this._DragPadsLIB = this._DragPadsLIB || {};
            this._DragPadsLIB[v._dragPads.ids[0]] = v;
            this._DragPadsLIB[v._dragPads.ids[1]] = v;
        }
        // #endregion

        // #region (hide) CONSTRUCTOR
        constructor(imgID) {
            // The constructor is used on initialization by passing an object ID to it.
            super(imgID);
            try {
                if (this._data.dragPads) {
                    const REGREF = this._data.dragPads,
                        padObjs = REGREF.ids.map(x => getObj("graphic", x));
                    this._dragPads = {
                        ids: padObjs.map(x => x.id),
                        objs: [...padObjs],
                        layers: padObjs.map(x => x.get("layer")),
                        func: DragPads.Functions[REGREF.funcName],
                        areOnline: REGREF.startActive
                    };
                    if (this._dragPads.layers[1] !== "walls") {
                        this._dragPads.layers.reverse();
                        this._dragPads.objs.reverse();
                    }
                    // this._dragPads.objs.forEach((x, i) => x.set({name: x.get("name").replace(/_(Partner)?Pad$/g, `_Pad${i}`)}));
                    this._dragPads.objs.forEach(x => x.set({name: x.get("name").replace(/_Pad(\d)$/g, x.get("name").includes("Pad0") ? "_Pad" : "_PartnerPad")}));
                    this._pendingDragPadChanges = [{}, {}];
                    this.syncDragPads();
                }
                if (this._type === "image" && !this._object.get("isDrawing"))
                    this._pendingChanges.isDrawing = true;    
                Image.LIB = this;
                Image.DragPads = this;   
            } catch (errObj) {                
                THROW(`Error Constructing Asset '${D.JS(Media.GetImgData(imgID) ? Media.GetImgData(imgID).name : imgID)}' --> `, "Image", errObj);
            }
        }
        // #endregion

        // #region (hide) GETTERS
        // READ-ONLY
        get srcs() {
            if (typeof this._data.srcs === "string")
                return Asset.Get(this._data.srcs).srcs;
            return this._data.srcs;
        }
        
        // PENDING CHANGES (DragPads)
        get pendingDragPadChanges() { return this._pendingDragPadChanges }
        // #endregion

        // #region (hide) SETTERS
        // PENDING CHANGES (DragPads)
        set pendingChanges(v) {
            super.pendingChanges = v;
            this.syncDragPads();
        }
        // #endregion

        // #region (hide) DRAGPADS
        // #region DRAGPAD GETTERS & SETTERS
        get hasDragPads() { return Boolean(this._dragPads) }
        get areDragPadsOnline() { return this._dragPads.areOnline }
        get areDragPadsActive() { return this.isActive && this._dragPads.areOnline } // Getting areOnline ONLY returns 'true' if both areOnline and isActive are true.
        set areDragPadsActive(v) {
            // Setting dragPadsActivation ONLY activates dragPads if image object is active too (see dragPadsActive getter)
            if (v !== this._dragPads.areOnline) { // ["walls", "walls"], ["layer", "layer"]
                this._dragPads.areOnline = v;
                this.syncDragPads(true);
            }
        }
        get dragPads() { return this._dragPads.objs }
        get newDragPadLayers() { return this.areDragPadsActive && ["objects", "walls"] || ["walls", "walls"] }
        set pendingDragPadChanges(v) {
            for (let i = 0; i < v.length; i++) {
                Object.assign(this._pendingDragPadChanges[i], v[i]);
                if (!_.isEmpty(this.pendingDragPadChanges[i]) && !PENDINGCHANGES.includes(this))
                    PENDINGCHANGES.push(this);
            }
        }
        // #endregion

        /*
                    ["layer", "layer"], ["objects", "walls"]
                    [["layer", "objects"], ["layer", "walls"]]
                    --->  ["layer", "objects"] --> _.object([x]) --> {layer: "objects"}


            */

        // #region DRAGPAD PRIVATE METHODS
        syncDragPads(isLayerOnly = false) {
            const padLayerData = _.zip(["layer", "layer"], this.newDragPadLayers).map(x => _.object([x]));
            this.pendingDragPadChanges = padLayerData.map((x, i) => x.layer === this._dragPads.layers[i] ? {} : x);
            this._dragPads.layers = this.newDragPadLayers;
            if (!isLayerOnly) {
                const padPosData = {
                    top: this.top + (this._data.dragPads.deltas.deltaTop || 0),
                    left: this.left + (this._data.dragPads.deltas.deltaLeft || 0),
                    height: this.height + (this._data.dragPads.deltas.deltaHeight || 0),
                    width: this.width + (this._data.dragPads.deltas.deltaWidth || 0)
                };
                Object.assign(this._dragPads, padPosData);
                this.pendingDragPadChanges = [padPosData, padPosData];
            }
        }
        // #endregion

        // #region DRAGPAD PUBLIC METHODS
        MakeDragPads(funcName, deltaHeight = 0, deltaWidth = 0, deltaTop = 0, deltaLeft = 0, startActive = true) {
            const padsData = {
                    top: this.top + deltaHeight,
                    left: this.left + deltaWidth,
                    height: this.height + deltaHeight,
                    width: this.width + deltaWidth
                },
                padParams = [startActive && this.isActive ? "objects" : "walls", "walls"].map(x => Object.assign({}, padsData, {layer: x})),
                padObjs = padParams.map((x,i) => createObj("graphic", Object.assign({}, x,
                                                                                    {
                                                                                        name: `${this.name}_Pad${i}`,
                                                                                        imgsrc: C.IMAGES.blank,
                                                                                        isdrawing: true,
                                                                                        controlledby: "all"
                                                                                    }
                )));
            this._data.dragPads = {
                ids: padObjs.map(x => x.id),
                funcName,
                startActive,
                deltas: {
                    deltaTop,
                    deltaLeft,
                    deltaHeight,
                    deltaWidth
                }
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
        // RemoveDragPads() { }
        FlipDragPads() {
            this._dragPads.reverse();
            this.syncDragPads(true);
        }
        ToggleDragPads(padsActive) { this.areDragPadsActive = typeof padsActive === "boolean" ? padsActive : !this.areDragPadsOnline }
        // #endregion
        // #endregion

        // #region (hide) PUBLIC METHODS
        Add(srcRef, srcName) {
            const asset = Asset.Get(srcRef);
            if (asset) {
                this._data.srcs = asset.name;
            } else {
                srcRef = "get" in srcRef && srcRef.get("imgsrc") || srcRef;
                this._data.srcs[srcName] = Image.ParseSrcURL(srcRef);
            }
        }

        Set(srcName) {
            if (this.state !== srcName) {
                super.Set(srcName);
                this.pendingChanges = {imgsrc: this.srcs[srcName]};
            }
        }

        Cycle() {
            const index = Object.keys(this.srcs).indexOf(x => x === this.state);
            this.Set(Object.keys(this.srcs)[index >= this.srcs.length - 1 ? 0 : index + 1]);
        }

        Random() {
            this._shuffledSrcs = (this._shuffledSrcs || []).length ? this._shuffledSrcs : _.shuffle(Object.keys(this.srcs));
            this.Set(this._shuffledSrcs.pop());
        }

        Toggle(isActive = null, isForcing = false) {
            super.Toggle(isActive, isForcing);
            if (this.hasDragPads) 
                if (this.areDragPadsActive)
                    this.pendingDragPadChanges = [{layer: "objects"}, {layer: "walls"}].filter((x, i) => this._dragPads.layers[i] !== x.layer);
                else
                    this.pendingDragPadChanges = [{layer: "walls"}, {layer: "walls"}].filter((x, i) => this._dragPads.layers[i] !== x.layer);
                
        }
        Remove() {
            super.Remove();
            // if ()
        }

        Apply(isDragPadsOnly = false) {
            if (!isDragPadsOnly)
                super.Apply();
            this._pendingDragPadChanges.forEach((x, i) => { if (!_.isEmpty(x)) this._dragPads.objs[i].set(x); });
            this._pendingDragPadChanges = [{}, {}];
        }
        // #endregion
    }
    class Text extends Asset {
        // #region (hide) STATIC METHODS        
        static get LIB() { return this._TextLIB }
        static set LIB(v) { 
            this._TextLIB = this._TextLIB || {};
            this._TextLIB[v.id] = v;
        }
        // #endregion

        // #region (hide) CONSTRUCTOR
        constructor(textID) {
            super(textID);
            try {
                if (this._data.shadowID)
                    this._shadowObj = getObj("text", this._data.shadowID);
                this._lineHeight = D.CHARWIDTH[this._data.font_family.replace(/Shadows.*/gu, "Shadows")][this._data.font_size].lineHeight;
                this._shadowShift = this._data.shadowShift || C.SHADOWOFFSETS[this._data.font_size];
                this._pendingShadowChanges = {};
                Text.LIB = this;
            } catch (errObj) {
                THROW(`Error Constructing Asset '${D.JS(Media.GetTextData(textID) ? Media.GetTextData(textID).name : textID)}'`, "TEXT", errObj);
                D.Alert(`Attempt to get CHARWIDTH for:
                font_family: ${D.JS(this._data.font_family)}
                font_size: ${D.JS(this._data.font_size)}`, "ERROR ALERT");
            }
        }
        // #endregion

        // #region (hide) GETTERS
        // READ-ONLY
        get shadow() { return this._shadowObj || false }

        // GENERAL
        get shadowShift() { return this._shadowShift }
        get color() { return this._data.color }
        get font() { return this._data.font_family }
        get size() { return this._data.font_size }
        get lineHeight() { return this._lineHeight }
        // color, font, size
        // shadow image
        // "real pos" overrides
        // justification & line splitting
        // PENDING CHANGES (Shadow Object)
        get pendingShadowChanges() { return this._pendingShadowChanges }
        // #endregion

        // #region (hide) SETTERS
        set shadowShift(v) {
            if (v !== this.shadowShift) {
                this._data.shadowShift = v;
                this.pendingShadowChanges = {top: this.top + v, left: this.left + v};
            }
        }
        set color(v) {
            if (v !== this.color) {
                this._data.color = v;
                this.pendingChanges = {color: v};
            }
        }
        set font(v) {
            if (v !== this.font) {
                this._data.font_family = v;
                this.pendingChanges = {font_family: v};
                this.justifyText();
            }
        }
        set size(v) {
            if (v !== this.size) {
                this._data.font_size = v;
                this.pendingChanges = {font_size: v};
                this.justifyText();
            }
        }
        set lineHeight(v) {
            if (v !== this.lineHeight) {
                this._lineHeight = v;
                this.justifyText();
            }
        }
        // PENDING CHANGES (Shadow Object)
        set pendingShadowChanges(v) { Object.assign(this._pendingShadowChanges, v) }
        set pendingChanges(v) {
            Object.assign(this._pendingChanges, v);
            const pendingShadowChanges = _.pick(this.pendingChanges, "text", "layer", "font_family", "font_size", "top", "left");
            if ("top" in pendingShadowChanges)
                pendingShadowChanges.top += this.shadowShift;
            if ("left" in pendingShadowChanges)
                pendingShadowChanges.left += this.shadowShift;
            this.pendingShadowChanges = pendingShadowChanges;
            if (!PENDINGCHANGES.includes(this))
                PENDINGCHANGES.push(this);
        }
        // #endregion
        
        // #region (hide) PRIVATE METHODS
        justifyText() { }
        // #endregion

        // #region (hide) PUBLIC METHODS
        Apply() {
            super.Apply();
            if (this.shadow && !_.isEmpty(this.pendingShadowChanges)) {
                this.shadow.set(this.pendingShadowChanges);
                this._pendingShadowChanges = {};
            }
        }
        // #endregion

    }
    /*
    class Area {
        constructor(asset) {
            
        }
    }
    */
    // #endregion

    // #region CONFIGURATION


    // #endregion

    // #region UTILITY   
    const initAssets = () => {
            initIMGAssets();
            initTEXTAssets();
            Asset.ApplyPendingChanges();
        },
        initIMGAssets = () => {
            for (const assetID of Object.keys(STATE.REF.AssetLibrary).filter(x => STATE.REF.AssetLibrary[x].type === "image"))
                new Image(assetID);
            D.Flag("... ... Image Assets Compiled!");
        },        
        initTEXTAssets = () => {
            for (const assetID of Object.keys(STATE.REF.AssetLibrary).filter(x => STATE.REF.AssetLibrary[x].type === "text"))
                new Text(assetID);
            D.Flag("... ... Text Assets Compiled!");
        };
    // #endregion

    return {
        CheckInstall: checkInstall,
        OnChatCall: onChatCall,
        OnGraphicAdd: onGraphicAdd,
        OnGraphicChange: onGraphicChange,

        Init: initAssets,
        Apply: Asset.ApplyPendingChanges,
    
        // CLASS-BASED OBJECT LIBRARIES
        get ALL() { return Asset.LIB },
        get IMAGE() { return Image.LIB },
        get TEXT() { return Text.LIB },
        get ANIM() { return Anim.LIB },
        get TOKEN() { return Token.LIB },
        get AREA() { return Area.LIB },

        // GENERAL MEDIA FUNCTIONS
        Get: Asset.Get,
        GetImg: (assetRef) => Asset.Get(assetRef, "image"),
        GetText: (assetRef) => Asset.Get(assetRef, "text"), //                                        NOTE: Returns instance, not object. (<asset>.obj for object)                                
        // XXX GetKey: getMediaKey,                             <asset>.name
        // XXX GetData: getMediaData,                           <asset>.<access getters and setters as needed>
        // XXX GetModeData: getModeData,                        <asset>.isForcedOn, <asset>.forcedState 
        IsRegistered: (ref) => Boolean(Asset.Get(ref)),
        // XXX HasForcedState: hasForcedState,                 <asset>.hasForcedState
        /* ? */ ModeUpdate: modeUpdate,
        // XXX IsActive: isObjActive,                              <asset>.isActive
        /* ? */ IsCyclingImg: isCyclingImg,
        // XXX Toggle: toggle,                                    <asset>.Toggle()
        /* ? */ Adjust: adjustObj,
        
        // GETTERS
        // XXX GetImg: getImgObj,
        // XXX GetText: getTextObj,
        // XXX GetImgs: getImgObjs,
        // XXX GetTexts: getTextObjs,
        // XXX GetImgKey: getImgKey,
        // XXX GetTextKey: getTextKey,
        // XXX GetImgData: getImgData,
        // XXX GetTextData: getTextData,
        // XXX GetImgSrc: getImgSrc,                                   <asset>.state
        /* ? */ GetTokens: getTokenObjs,
        // XXX GetTokenData: getTokenData,
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
        // XXX AddImgSrc: addImgSrc,                                   <image>.Add(srcRef, srcName)

        // SETTERS
        // XXX SetImg: setImg,                                                   <image>.Set(src)
        // XXX SetText: setText,                                                    <text>.Set(text)
        SetToken: setTokenSrc,
        CombineTokenSrc: combineTokenSrc,
        // XXX ToggleImg: toggleImg,                                            <image>.Toggle() OR <image>.isActive = true/false
        // XXX ToggleText: toggleText,                                            <text>.Toggle() OR <text>.isActive = true/false
        ToggleToken: toggleTokens,
        ToggleTokens: toggleTokens,
        // CycleImg: cycleImg,                                                        <image>.Cycle()
        // SetImgData: setImgData,                                              <asset>.<prop> = <whatever>
        // SetTextData: setTextData,                                            <asset>.<prop> = <whatever>
        SetImgTemp: setImgTemp,
        Spread: spreadImgs, // Will have to be a static method on Image accepting an array of image instances.
       
        ToggleLoadingScreen: toggleLoadingScreen,
        SetLoadingMessage: setLoadingText,
        StartProgressBar: startProgressBar,
        StopProgressBar: stopProgressBar,
        Notify: addPanelText,

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
        }

    };

})();

on("ready", () => {
    Assets.CheckInstall();
    D.Log("Assets Ready!");
});
void MarkStop("Assets");

