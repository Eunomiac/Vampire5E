/* eslint-disable one-var */
void MarkStart("Assets");
const Assets = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Assets",

        // #region (hide) COMMON INITIALIZATION
        STATE = {get REF() { return C.RO.OT[SCRIPTNAME] }},	// eslint-disable-line no-unused-vars
        VAL = (varList, funcName, isArray = false) => D.Validate(varList, funcName, SCRIPTNAME, isArray), // eslint-disable-line no-unused-vars
        DB = (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        LOG = (msg, funcName) => D.Log(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        THROW = (msg, funcName, errObj) => D.ThrowError(msg, funcName, SCRIPTNAME, errObj), // eslint-disable-line no-unused-vars

        checkInstall = () => {
            C.RO.OT[SCRIPTNAME] = C.RO.OT[SCRIPTNAME] || {};
            initialize();
        },
        // #endregion

        // #region LOCAL INITIALIZATION
        initialize = () => {
            STATE.REF.AssetLibrary = STATE.REF.AssetLibrary || {};
            // parseREGISTRY();
            // initIMGAssets();
            // initTEXTAssets();
            // Asset.ApplyPendingChanges();
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
                                case "img": D.Alert(D.JS(Image.LIB), "IMAGE ASSETS"); break;
                                case "pads": case "dragpads": D.Alert(D.JS(Object.values(Image.LIB).filter(x => x.hasDragPads)), "IMAGE ASSETS with DRAG PADS"); break;
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
            if (typeof assetRef === "object" && "id" in assetRef && assetRef.id in ASSETS)
                return Asset.LIB[assetRef.id];
            if (typeof assetRef === "string") {
                if (assetRef in Asset.LIB)
                    return Asset.LIB[assetRef];
                return Asset.LIB[Object.keys(Asset.LIB).find(x => Asset.LIB[x].name.startsWith(assetRef)) || ""] || false;
            }
            return false;
        }
        static Make(assetType, assetData) { }
        static get LIB() { return Asset._LIB }
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
                Asset._LIB = Asset._LIB || {};
                Asset._LIB[this.id] = this;
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
                /* writeToLIB(this.id, this.data); */
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
                /* writeToLIB(this.id, this.data); */
                this.pendingChanges = {layer: v};
            }
        }
        set activeLayer(v) {
            if (v !== this.activeLayer) {
                this._data.activeLayer = v;
                /* writeToLIB(this.id, this.data); */
                if (this.isActive)
                    this.layer = v;
            }
        }
        set isActive(v) {
            if (v !== this.isActive)
                this.layer = v ? this.activeLayer : "walls";
            this._data.isActive = Boolean(v);
            /* writeToLIB(this.id, this.data); */
        }

        // MODE DATA
        set wasModeUpdated(v) { this._data.wasModeUpdated = Boolean(v) /* writeToLIB(this.id, this.data) */ }
        set lastActive(v) { this._data.modes[Session.LastMode].lastActive = Boolean(v) /* writeToLIB(this.id, this.data) */ }
        set lastState(v) { this._data.modes[Session.LastMode].lastState = v /* writeToLIB(this.id, this.data) */ }

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
                posData.height = edgeData.bottomEdge - edgeData.topEdge;
                posData.top = (edgeData.topEdge + edgeData.bottomEdge) / 2;
            } else if ("topEdge" in delta) {
                posData.top = edgeData.topEdge + 0.5 * posData.height;
            } else if ("bottomEdge" in delta) {
                posData.top = edgeData.bottomEdge - 0.5 * posData.height;
            }
            if ("leftEdge" in delta && "rightEdge" in delta) {
                posData.width = edgeData.rightEdge - edgeData.leftEdge;
                posData.left = (edgeData.leftEdge + edgeData.rightEdge) / 2;
            } else if ("leftEdge" in delta) {
                posData.left = edgeData.leftEdge + 0.5 * posData.width;
            } else if ("rightEdge" in delta) {
                posData.left = edgeData.rightEdge - 0.5 * posData.width;
            }
            edgeData.topEdge = posData.top - 0.5 * posData.height;
            edgeData.bottomEdge = posData.top + 0.5 * posData.height;
            edgeData.leftEdge = posData.left - 0.5 * posData.width;
            edgeData.rightEdge = posData.left + 0.5 * posData.width;

            this.pendingChanges = _.omit(posData, (v, k) => this[k] === v);
            this._data.pos = posData;
            this._pos = edgeData;
            /* writeToLIB(this.id, this.data); */
        }
        syncLibrary() {
            this._data.pos.top = this.obj.get("top");
            this._data.pos.left = this.obj.get("left");
            this._data.pos.height = this.obj.get("height");
            this._data.pos.width = this.obj.get("width");
            this._data.page = _.findKey(C.PAGES, v => v === this.obj.get("_pageid"));
            this._data.layer = this.obj.get("layer");
            this._data.isActive = this.layer !== "walls";

            // Calculating derivative stats
            this._pos = {
                leftEdge: this.left - 0.5 * this.width,
                rightEdge: this.left + 0.5 * this.width,
                topEdge: this.top - 0.5 * this.height,
                bottomEdge: this.top + 0.5 * this.height
            };
            /* writeToLIB(this.id, this.data); */
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
        Set(state) { this._data.state = state /* writeToLIB(this.id, this.data) */ }
        Unregister() { delete Asset.LIB[this.id]; delete LI.B[this.id] }
        Remove() { this.obj.remove(); this.Unregister() }
        // #endregion
    }
    class Image extends Asset {
        // #region (hide) STATIC METHODS
        static ParseSrcURL(url) { return url.replace(/[a-z]*\.(png|jpg|jpeg)/gu, "thumb.$1") }
        static get LIB() { return Image._LIB }
        // #endregion

        // #region (hide) CONSTRUCTOR
        constructor(imgID) {
            // The constructor is used on initialization by passing an object ID to it.
            super(imgID);
            try {
                if (this._data.dragPadIDs) {
                    this._dragPads = this._data.dragPadIDs.map(x => getObj("graphic", x)).map(x => _.object(
                        ["obj", "layer", "top", "left", "height", "width"],
                        [x, ...["layer", "top", "left", "height", "width"].map(xx => x.get(xx))]
                    ));
                    if (this._dragPads[1].layer !== "walls")
                        this._dragPads.reverse();
                    this._dragPadsActivation = this.isActive && _.any(this._dragPads, x => x.layer === "objects") ||
                                          (typeof this._data.dragPadsStartActive === "boolean" ? this._data.dragPadsStartActive : true);
                    this._dragPadFunc = DragPads.Functions[this._data.dragPadFuncName];
                    this._pendingDragPadChanges = [{}, {}];
                    this.syncDragPads();
                }
                if (this._type === "image" && !this._object.get("isDrawing"))
                    this._pendingChanges.isDrawing = true;    
                Image._LIB = Image._LIB || {};
                Image._LIB[this.id] = this;     
            } catch (errObj) {                
                THROW(`Error Constructing Asset '${D.JS(Media.GetImgData(imgID) ? Media.GetImgData(imgID).name : imgID)}' --> `, "TEXT", errObj);
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
        get dragPadsActivation() { return this._dragPadsActivation }
        get areDragPadsActive() { return this.isActive && this._dragPadsActivation } // Getting dragPadsActive ONLY returns 'true' if both dragPadsActivation and isActive are true.
        set areDragPadsActive(v) {
            // Setting dragPadsActivation ONLY activates dragPads if image object is active too (see dragPadsActive getter)
            if (v !== this._dragPadsActivation) {
                this._dragPadsActivation = v;
                this.syncDragPads(true);
            }
        }
        get newDragPadLayers() { return this.areDragPadsActive && ["objects", "walls"] || ["walls", "walls"] }
        set pendingDragPadChanges(v) {
            for (let i = 0; i < v.length; i++) {
                Object.assign(this._pendingDragPadChanges[i], v[i]);
                if (!_.isEmpty(this.pendingDragPadChanges[i]) && !PENDINGCHANGES.includes(this))
                    PENDINGCHANGES.push(this);
            }
        }
            // #endregion

            // #region DRAGPAD PRIVATE METHODS
        syncDragPads(isLayerOnly = false) {
            const newDragPadData = this._dragPads.map((x, i) => Object.assign({}, x, {layer: this.newDragPadLayers[i]}));
            if (!isLayerOnly) {
                const padPosData = {
                    top: this.top + (this._data.dragPadDeltas.deltaTop || 0),
                    left: this.left + (this._data.dragPadDeltas.deltaLeft || 0),
                    height: this.height + (this._data.dragPadDeltas.deltaHeight || 0),
                    width: this.width + (this._data.dragPadDeltas.deltaWidth || 0)
                };
                newDragPadData.forEach((x,i,a) => Object.assign(a[i], padPosData));
            }
            this.pendingDragPadChanges = newDragPadData.map((x, i) => _.omit(x, (v, k) => this._dragPads[i][k] === v));
            Object.assign(this._dragPads, newDragPadData);
        }
            // #endregion

            // #region DRAGPAD PUBLIC METHODS
        MakeDragPads(funcName, deltaHeight = 0, deltaWidth = 0, deltaTop = 0, deltaLeft = 0, dragPadsActivation = true) {
            const padPosition = {
                    top: this.top,
                    left: this.left,
                    height: this.height + deltaHeight,
                    width: this.width + deltaWidth
                },
                padParams = [dragPadsActivation && this.isActive ? "objects" : "walls", "walls"].map(x => Object.assign({}, padPosition, {layer: x})),
                padObjs = padParams.map((x,i) => createObj("graphic", Object.assign({}, x,
                                                                                    {
                                                                                        name: `${this.name}_Pad_${i}`,
                                                                                        imgsrc: C.IMAGES.blank,
                                                                                        isdrawing: true,
                                                                                        controlledby: "all"
                                                                                    }
                )));
            Object.assign(this._data, {
                dragPadIDs: padObjs.map(x => x.id),
                dragPadsStartActive: dragPadsActivation,
                dragPadDeltas: {
                    deltaTop,
                    deltaLeft,
                    deltaHeight,
                    deltaWidth
                },
                dragPadFuncName: funcName
            });
            this._dragPadsActivation = dragPadsActivation;
            this._pendingDragPadChanges = [{}, {}];
            this._dragPads = Object.assign({}, padParams, padObjs.map(x => ({obj: x})));
            this._dragPadFunc = DragPads.Functions[funcName];
        }
        // RemoveDragPads() { }
        FlipDragPads() {
            this._dragPads.reverse();
            this.syncDragPads(true);
        }
        ToggleDragPads(padsActive) { this.areDragPadsActive = typeof padsActive === "boolean" ? padsActive : !this._dragPadsActivation }
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
            /* writeToLIB(this.id, this.data); */
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
            if (this._dragPads) 
                if (this.isActive && this._dragPadsActivation && _.none(this._dragPadLayers, (x, i) => {} ))
                    this.pendingDragPadChanges = {layer: "objects"};
                else
                    this.pendingDragPadChanges = {layer: "walls"};
                
        }
        Remove() {
            super.Remove();
                // if ()
        }

        Apply(isDragPadsOnly = false) {
            if (!isDragPadsOnly)
                super.Apply();
            for (const [padData, padDelta] of _.zip(this._dragPads, this.pendingDragPadChanges))
                if (!_.isEmpty(padDelta))
                    padData.obj.set(padDelta);
            this._pendingDragPadChanges = [{}, {}];
        }
        // #endregion
    }
    class Text extends Asset {
        // #region (hide) STATIC METHODS
        static get LIB() { return Text._LIB }
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
                Text._LIB = Text._LIB || {};
                Text._LIB[this.id] = this;
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
                /* writeToLIB(this.id, this.data); */
                this.pendingShadowChanges = {top: this.top + v, left: this.left + v};
            }
        }
        set color(v) {
            if (v !== this.color) {
                this._data.color = v;
                /* writeToLIB(this.id, this.data); */
                this.pendingChanges = {color: v};
            }
        }
        set font(v) {
            if (v !== this.font) {
                this._data.font_family = v;
                /* writeToLIB(this.id, this.data); */
                this.pendingChanges = {font_family: v};
                this.justifyText();
            }
        }
        set size(v) {
            if (v !== this.size) {
                this._data.font_size = v;
                /* writeToLIB(this.id, this.data); */
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
    const initIMGAssets = () => {
            for (const assetID of Object.keys(STATE.REF.AssetLibrary).filter(x => STATE.REF.AssetLibrary[x].type === "image"))
                ASSETS[assetID] = new Image(assetID);
            D.Flag("Image Assets Compiled");
        },        
        initTEXTAssets = () => {
            for (const assetID of Object.keys(STATE.REF.AssetLibrary).filter(x => STATE.REF.AssetLibrary[x].type === "text"))
                ASSETS[assetID] = new Text(assetID);
            D.Flag("Text Assets Compiled");
        },
        writeToLIB = (assetID, key, value) => {
            return true;
            STATE.REF.AssetLibrary[assetID] = STATE.REF.AssetLibrary[assetID] || {};
            if (typeof key === "object")
                STATE.REF.AssetLibrary[assetID] = D.Clone(key);
            else
                STATE.REF.AssetLibrary[assetID][key] = D.Clone(value);
        };
    // #endregion

    return {
        CheckInstall: checkInstall,
        OnChatCall: onChatCall,
        // OnGraphicAdd: onGraphicAdd,

        ASSETS,

        Get: Asset.Get,

        Apply: Asset.ApplyPendingChanges

    };

})();

on("ready", () => {
    Assets.CheckInstall();
    D.Log("Assets Ready!");
});
void MarkStop("Assets");