void MarkStart("Assets");
const Assets = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    /* eslint-disable no-unused-vars */
    const SCRIPTNAME = "Assets";

    // #region ~ COMMON INITIALIZATION
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

    // #region LOCAL INITIALIZATION
    const initialize = () => {
        STATE.REF.AssetLibrary = STATE.REF.AssetLibrary || {};
        STATE.REF.GenericTokenImages = STATE.REF.GenericTokenImages || {};
    };
        // #endregion

    // #region ~ EVENT HANDLERS: (HANDLEINPUT)
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
                    case "all": case "full": {
                        switch (D.LCase(call = args.shift())) {
                            case "library": D.Alert(D.JS(LI.B), "ASSET LIBRARY"); break;
                            case "assets": D.Alert(`${D.JS(Asset.LIB)} (${Object.keys(Asset.LIB).length})`, "ASSETS"); break;
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
            }

                // no default
        }
    }; /* ,
        onGraphicAdd = imgObj => {
            
        }
        */
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    // #region ~ TOP SCOPE VARIABLE DELCARATIONS
    const PENDINGCHANGES = [];
    const LI = {
        get B() { return STATE.REF.AssetLibrary }
    };
    const ASSETS = {};
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
        set libData(v) { LI.B[this._id] = D.Merge(this.libData, v) }
        get pendingData() { return this._pendingData }
        set pendingData(v) { this._pendingData = D.Merge(this._pendingData, v) }
        get data() { return D.Merge(this.libData, this.pendingData) }

        // Data.Modes:
        get mode() { return this.data.modes[Session.Mode] }
        get lastMode() { return this.data.modes[Session.LastMode] }
        // #endregion

        // #region ~ CONSTRUCTOR
        constructor(assetID) {
            try {
                this._id = assetID;
                this._objType = {image: "graphic", token: "graphic", anim: "graphic", text: "text"}[LI.B[assetID].type];
                this._obj = getObj(this._objType, this._id);
                this._pendingChanges = {};
                this._pendingData = {};
                this.syncLibrary(); // Updating LIBRARY with current object data & calculating derivative stats.
            } catch (errObj) {
                THROW(`Error Constructing Asset '${D.JS(assetID)}'`, "ASSET", errObj);
            }
        }
        // #endregion

        // #region ~ GETTERS 
        // READ-ONLY
        get id() { return this._id }
        get objType() { return this._objType }
        get obj() { return this._obj }
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
        get position() { return Object.assign({}, this.data, {topEdge: this.topEdge, bottomEdge: this.bottomEdge, leftEdge: this.leftEdge, rightEdge: this.rightEdge}) }
        get layer() { return this.data.layer }
        get activeLayer() { return this.data.activeLayer }
        get isActive() { return this.data.isActive }

        // MODE DATA
        get wasModeUpdated() { return this.data.wasModeUpdated }
        get wasActive() { return this.mode.wasActive }
        get wasState() { return this.mode.wasState }

        // PENDING CHANGES
        get pendingChanges() { return this._pendingChanges }
        // #endregion

        // #region ~ SETTERS
        set name(v) {
            this.pendingChanges = {name: v};
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
            this.pendingChanges = {layer: v};
        }
        set activeLayer(v) {
            this.pendingData = {activeLayer: v};
            if (this.isActive)
                this.layer = v;
        }
        set isActive(v) {
            this.pendingData = {isActive: Boolean(v)};
            this.layer = v ? this.activeLayer : "walls";
        }

        // MODE DATA
        set wasModeUpdated(v) { this.pendingData = {wasModeUpdated: Boolean(v)} }
        set wasActive(v) { this.pendingData = {modes: {[Session.LastMode]: {wasActive: Boolean(v)}}} }
        set wasState(v) { this.pendingData = {modes: {[Session.LastMode]: {wasState: v}}} }

        // PENDING CHANGES
        set pendingChanges(v) {
            this.pendingData = v;
            this._pendingChanges = _.pick(D.Merge(this.pendingChanges, v), (val, key) => {
                const isChanged = (libRef) => {
                    if (Array.isArray(libRef)) {
                        if (Number.isInteger(Number(key)) && Number(key) < libRef.length)
                            return libRef[Number(key)] !== val;       
                        else
                            return _.any(libRef, (libVal) => _.isObject(libVal) && isChanged(libVal));
                    } else if (_.isObject(libRef)) {        
                        if (key in libRef)
                            return libRef[key] !== val;
                        return _.any(libRef, (libVal) => _.isObject(libVal) && isChanged(libVal));
                    } else {
                        return false;
                    }
                };
                return isChanged(this.libData);
            });
            if (!_.isEmpty(this.pendingChanges) && !PENDINGCHANGES.includes(this))
                PENDINGCHANGES.push(this);
        }
        // #endregion

        // #region ~ PRIVATE METHODS
        setNewPosition(delta) {
            const posData = Object.assign({}, _.pick(this.data, "top", "left", "height", "width"), _.pick(delta, "top", "left", "height", "width"));
            const edgeData = Object.assign({}, {topEdge: this.topEdge, bottomEdge: this.bottomEdge, leftEdge: this.leftEdge, rightEdge: this.rightEdge}, _.pick(delta, "leftEdge", "rightEdge", "topEdge", "bottomEdge"));
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
            this.pendingChanges = posData;
        }
        syncLibrary() {
            this.libData = {
                page: _.findKey(C.PAGES, v => v === this.obj.get("_pageid")),
                layer: this.obj.get("layer"),
                isActive: this.layer !== "walls",
                top: D.Int(this.obj.get("top")),
                left: D.Int(this.obj.get("left")),
                height: D.Int(this.obj.get("height")),
                width: D.Int(this.obj.get("width"))
            };
        }
        syncObject() {
            this.pendingChanges = {
                name: this.name,
                left: this.left,
                top: this.top,
                height: this.height,
                width: this.width,
                layer: this.isActive ? this.activeLayer : "walls"
            };
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
                    this._pendingChanges = {};
                }
            this.libData = this.pendingData;
            this._pendingData = {};
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
        Set(state) { this.pendingData = {state} }
        Unregister() { delete Asset.LIB[this.id]; delete LI.B[this.id] }
        Remove() { this.obj.remove(); this.Unregister() }
        // #endregion
    }
    class Image extends Asset {       
        // #region ~ STATIC METHODS, GETTERS & SETTERS
        // #region Instance Storage Libraries (Image.LIB, Image.DragPads)
        static get LIB() { return this._ImageLIB }
        static set LIB(v) { this._ImageLIB = Object.assign(this._ImageLIB || {}, {[v.id]: v}) }
        static get DragPads() { return this._DragPadsLIB }
        static set DragPads(v) { this._DragPadsLIB = Object.assign(this._DragPadsLIB || {}, {[v._dragPads.ids[0]]: v}, {[v._dragPads.ids[1]]: v}) }
        // #endregion
        static Initialize(imgID) {
            const imgAsset = new Image(imgID);
            Asset.LIB = imgAsset;
            Image.LIB = imgAsset;
            if (imgAsset.hasDragPads)
                Image.DragPads = imgAsset;
        }
        static ParseSrcURL(url) { return url.replace(/[a-z]*\.(png|jpg|jpeg)/gu, "thumb.$1") }
        // #endregion

        // #region ~ BASIC GETTERS & SETTERS
        get padData() { return this.data.dragPads }
        set padData(v) { Object.assign(this.data.dragPads, v) }
        // #endregion        

        // #region ~ CONSTRUCTOR
        constructor(imgID) {
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
                this.pendingChanges = {isDrawing: true};     
            } catch (errObj) {                
                THROW(`Error Constructing Asset '${D.JS(Media.GetImgData(imgID) ? Media.GetImgData(imgID).name : imgID)}' --> `, "Image", errObj);
            }
        }
        // #endregion

        // #region ~ GETTERS
        // READ-ONLY
        get srcs() {
            if (typeof this.data.srcs === "string")
                return Asset.Get(this.data.srcs).srcs;
            return this.data.srcs;
        }
        get pendingChanges() { return super.pendingChanges }
        
        // PENDING CHANGES (DragPads)
        // #endregion

        // #region ~ SETTERS
        // PENDING CHANGES (DragPads)
        set pendingChanges(v) {
            super.pendingChanges = v;
            if (this.hasDragPads)
                this.syncDragPads();
        }
        // #endregion

        // #region ~ DRAGPADS
        // #region DRAGPAD GETTERS & SETTERS
        get dragPads() { return this._dragPads.objs }
        get hasDragPads() { return Boolean(this._dragPads) }
        get areDragPadsOnline() { return this._dragPads.areOnline }
        get areDragPadsActive() { return this.isActive && this._dragPads.areOnline } // Getting areOnline ONLY returns 'true' if both areOnline and isActive are true.
        set areDragPadsActive(v) {
            // Setting dragPadsActivation ONLY activates dragPads if image object is active too (see dragPadsActive getter)
            if (v !== this.areDragPadsOnline) {
                this._dragPads.areOnline = v;
                this.syncDragPads(true);
            }
        }
        get newDragPadLayers() { return this.areDragPadsActive && ["objects", "walls"] || ["walls", "walls"] }
        get pendingDragPadChanges() { return this._pendingDragPadChanges }
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
            const padLayerData = _.zip(["layer", "layer"], this.newDragPadLayers).map(x => _.object([x]));
            this.pendingDragPadChanges = padLayerData.map((x, i) => x.layer === this._dragPads.layers[i] ? {} : x);
            this._dragPads.layers = this.newDragPadLayers;
            if (!isLayerOnly) {
                const padPosData = {
                    top: this.top + (this.data.dragPads.deltaTop || 0),
                    left: this.left + (this.data.dragPads.deltaLeft || 0),
                    height: this.height + (this.data.dragPads.deltaHeight || 0),
                    width: this.width + (this.data.dragPads.deltaWidth || 0)
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
            };
            const padParams = [startActive && this.isActive ? "objects" : "walls", "walls"].map(x => Object.assign({}, padsData, {layer: x}));
            const padObjs = padParams.map((x,i) => createObj("graphic", Object.assign({}, x,
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
        // RemoveDragPads() { }
        FlipDragPads() {
            this._dragPads.reverse();
            this.syncDragPads(true);
        }
        ToggleDragPads(padsActive) { this.areDragPadsActive = typeof padsActive === "boolean" ? padsActive : !this.areDragPadsOnline }
        // #endregion
        // #endregion

        // #region ~ PUBLIC METHODS
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
        Set(srcName) {
            if (this.state !== srcName) {
                super.Set(srcName);
                this.pendingChanges = {imgsrc: this.srcs[srcName]};
            }
        }
        Cycle() {
            const index = Object.keys(this.srcs).indexOf(this.state);
            DB({
                state: this.state,
                srcs: Object.keys(this.srcs),
                index,
                nextIndex: index >= Object.keys(this.srcs).length - 1 ? 0 : index + 1,
                nextState: Object.keys(this.srcs)[index >= Object.keys(this.srcs).length - 1 ? 0 : index + 1]
            }, "Cycle");
            this.Set(Object.keys(this.srcs)[index >= Object.keys(this.srcs).length - 1 ? 0 : index + 1]);
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
        Unregister() { 
            super.Unregister();
            delete Image.LIB[this.id];
            if (this.hasDragPads)
                this.dragPads.forEach(x => delete Image.DragPads[x.id]);
        }
        Remove() {
            super.Remove();
            if (this.hasDragPads)
                this.dragPads.forEach(x => x.remove());
        }
        Apply(isTesting = false) {
            super.Apply(isTesting);
            if (this.hasDragPads)
                if (isTesting) {
                    D.Alert(D.JS(this._pendingDragPadChanges), `IMAGE - DRAGPADS: ${this.name}`);
                } else {           
                    this._pendingDragPadChanges.forEach((x, i) => { if (!_.isEmpty(x)) this._dragPads.objs[i].set(x); });
                    this._pendingDragPadChanges = [{}, {}];
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
        static Initialize(animID) {
            const animAsset = new Anim(animID);
            Asset.LIB = animAsset;
            Image.LIB = animAsset;
            Anim.LIB = animAsset;
            if (animAsset.hasDragPads)
                Image.DragPads = animAsset;
        }
        static Make() { D.Alert("Cannot dynamically create Animation assets!", "ERROR: Anim.Make") }
        // #endregion
        
        // #region ~ BASIC GETTERS & SETTERS
        // set libData(v) { super.libData = _.omit(v, "state", "srcs") }
        // set pendingData(v) { super.pendingData = _.omit(v, "state", "srcs") }
        // #endregion

        // #region ~ CONSTRUCTOR
        constructor(animID) { super(animID); D.Alert(this.name) }
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
                    this.pendingChanges = {isDrawing: true};  
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
        ChangeMode() {
            this.wasActive = this.isActive;
            switch (this.isForcedOn) {
                case true: case false: this.isActive = this.isForcedOn; break;
                case "LAST": this.isActive = this.wasActive; break;
                case null: break;
                // no default
            }
        }
        Unregister() { super.Unregister(); delete Anim.LIB[this.id] }
        // #endregion
    }
    class Token extends Image {
        // #region ~ STATIC METHODS, GETTERS & SETTERS
        // #region Instance Storage Libraries (Asset.LIB)
        static get LIB() { return this._TokenLIB }
        static set LIB(v) { this._TokenLIB = Object.assign(this._TokenLIB || {}, {[v.charID]: v}) }
        // #endregion
        static Initialize(charID) {
            return;
            const tokenAsset = new Token(charID);
            Asset.LIB = tokenAsset;
            super.LIB = tokenAsset;
            this.LIB = tokenAsset;
        }
        // #endregion

        // #region ~ CONSTRUCTOR
        constructor(charID) {            
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
                        this.pendingChanges = {isDrawing: true};     
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
            super(charID);
            try {
                const [tokenObj] = findObjs({
                    _type: "graphic",
                    _subtype: "token",
                    represents: charID
                });
                if (tokenObj) {
                    this._id = tokenObj.id;
                    this._obj = tokenObj;
                    // this._libData.layer = tokenObj.get("layer");
                    // this._libData.isActive = this._libData.layer !== walls;
                    /* if (this._libData.isGenericToken) {

                    } else if (this._libData.isRandomToken) {
                        const curImgURL = tokenObj.get("imgsrc");
                        this._libData.state = _.findIndex(this._libData.srcs, x => curImgURL.includes(x));
                    } else {

                    } */
                    // this._libData.state =  
                    // this._libData. = 
                    // this._libData. = 
                    // this._libData. = 
                } else {
                    delete this._id;
                    delete this._obj;
                }
                this._charID = charID;
                this._charObj = getObj("character", charID);
                this.pendingChanges = {isDrawing: false};
            } catch(errObj) {              
                THROW(`Error Constructing Token for '${LI.B[charID].name}'`, "Token", errObj);
            }
        }
        // #endregion

        // #region ~ GETTERS 
        // READ-ONLY
        get id() { return this._id }
        get objType() { return this._objType }
        get obj() { return this._obj }
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
        get position() { return Object.assign({}, this.data, {topEdge: this.topEdge, bottomEdge: this.bottomEdge, leftEdge: this.leftEdge, rightEdge: this.rightEdge}) }
        get layer() { return this.data.layer }
        get activeLayer() { return this.data.activeLayer }
        get isActive() { return this.data.isActive }

        // MODE DATA
        get wasModeUpdated() { return this.data.wasModeUpdated }
        get wasActive() { return this.mode.wasActive }
        get wasState() { return this.mode.wasState }

        // PENDING CHANGES
        get pendingChanges() { return this._pendingChanges }
        // #endregion

        // #region ~ SETTERS
        set name(v) {
            this.pendingChanges = {name: v};
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
            this.pendingChanges = {layer: v};
        }
        set activeLayer(v) {
            this.pendingData = {activeLayer: v};
            if (this.isActive)
                this.layer = v;
        }
        set isActive(v) {
            this.pendingData = {isActive: Boolean(v)};
            this.layer = v ? this.activeLayer : "walls";
        }

        // MODE DATA
        set wasModeUpdated(v) { this.pendingData = {wasModeUpdated: Boolean(v)} }
        set wasActive(v) { this.pendingData = {modes: {[Session.LastMode]: {wasActive: Boolean(v)}}} }
        set wasState(v) { this.pendingData = {modes: {[Session.LastMode]: {wasState: v}}} }

        // PENDING CHANGES
        set pendingChanges(v) {
            this.pendingData = v;
            this._pendingChanges = _.pick(D.Merge(this.pendingChanges, v), (val, key) => {
                const isChanged = (libRef) => {
                    if (Array.isArray(libRef)) {
                        if (Number.isInteger(Number(key)) && Number(key) < libRef.length)
                            return libRef[Number(key)] !== val;       
                        else
                            return _.any(libRef, (libVal) => _.isObject(libVal) && isChanged(libVal));
                    } else if (_.isObject(libRef)) {        
                        if (key in libRef)
                            return libRef[key] !== val;
                        return _.any(libRef, (libVal) => _.isObject(libVal) && isChanged(libVal));
                    } else {
                        return false;
                    }
                };
                return isChanged(this.libData);
            });
            if (!_.isEmpty(this.pendingChanges) && !PENDINGCHANGES.includes(this))
                PENDINGCHANGES.push(this);
        }
        // #endregion

        // #region ~ PRIVATE METHODS
        setNewPosition(delta) {
            const posData = Object.assign({}, _.pick(this.data, "top", "left", "height", "width"), _.pick(delta, "top", "left", "height", "width"));
            const edgeData = Object.assign({}, {topEdge: this.topEdge, bottomEdge: this.bottomEdge, leftEdge: this.leftEdge, rightEdge: this.rightEdge}, _.pick(delta, "leftEdge", "rightEdge", "topEdge", "bottomEdge"));
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
            this.pendingChanges = posData;
        }
        syncLibrary() {
            this.libData = {
                page: _.findKey(C.PAGES, v => v === this.obj.get("_pageid")),
                layer: this.obj.get("layer"),
                isActive: this.layer !== "walls",
                top: D.Int(this.obj.get("top")),
                left: D.Int(this.obj.get("left")),
                height: D.Int(this.obj.get("height")),
                width: D.Int(this.obj.get("width"))
            };
        }
        syncObject() {
            this.pendingChanges = {
                name: this.name,
                left: this.left,
                top: this.top,
                height: this.height,
                width: this.width,
                layer: this.isActive ? this.activeLayer : "walls"
            };
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
                    this._pendingChanges = {};
                }
            this.libData = this.pendingData;
            this._pendingData = {};
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
        Set(state) { this.pendingData = {state} }
        Unregister() { delete Asset.LIB[this.id]; delete LI.B[this.id] }
        Remove() { this.obj.remove(); this.Unregister() }
        // #endregion
    }
    class Text extends Asset {
        // #region ~ STATIC METHODS        
        static get LIB() { return this._TextLIB }
        static set LIB(v) { 
            this._TextLIB = this._TextLIB || {};
            this._TextLIB[v.id] = v;
        }
        static Initialize(textID) {
            const textAsset = new Text(textID);
            Asset.LIB = textAsset;
            this.LIB = textAsset;
        }
        // #endregion

        // #region ~ CONSTRUCTOR
        constructor(textID) {
            super(textID);
            try {
                if (this.data.shadowID)
                    this._shadowObj = getObj("text", this.data.shadowID);
                this._pendingShadowChanges = {};
                Text.LIB = this;
            } catch (errObj) {
                THROW(`Error Constructing Asset '${D.JS(Media.GetTextData(textID) ? Media.GetTextData(textID).name : textID)}'`, "TEXT", errObj);
                D.Alert(`Attempt to get CHARWIDTH for:
                font_family: ${D.JS(this.data.font_family)}
                font_size: ${D.JS(this.data.font_size)}`, "ERROR ALERT");
            }
        }
        // #endregion

        // #region ~ GETTERS
        // READ-ONLY
        get shadow() { return this._shadowObj || false }

        // GENERAL
        get shadowShift() { return this.data.shadowShift || C.SHADOWOFFSETS[this.data.font_size] || 0 }
        get color() { return this.data.color }
        get font() { return this.data.font_family }
        get size() { return this.data.font_size }
        get lineHeight() { return this._lineHeight }
        // color, font, size
        // shadow image
        // "real pos" overrides
        // justification & line splitting
        // PENDING CHANGES (Shadow Object)
        get pendingChanges() { return super.pendingChanges }
        get pendingShadowChanges() { return this._pendingShadowChanges }
        // #endregion

        // #region ~ SETTERS
        set shadowShift(v) {
            if (v !== this.shadowShift) {
                this.data.shadowShift = v;
                this.pendingShadowChanges = {top: this.top + v, left: this.left + v};
            }
        }
        set color(v) {
            if (v !== this.color) {
                this.data.color = v;
                this.pendingChanges = {color: v};
            }
        }
        set font(v) {
            if (v !== this.font) {
                this.data.font_family = v;
                this.pendingChanges = {font_family: v};
                this.justifyText();
            }
        }
        set size(v) {
            if (v !== this.size) {
                this.data.font_size = v;
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
        
        // #region ~ PRIVATE METHODS
        justifyText() { }
        // #endregion

        // #region ~ PUBLIC METHODS
        Apply(isTesting = false) {
            super.Apply(isTesting);
            if (this.shadow && !_.isEmpty(this.pendingShadowChanges))
                if (isTesting) {
                    D.Alert(D.JS(this.pendingShadowChanges), `TEXT - SHADOW: ${this.name}`);
                } else {
                    this.shadow.set(this.pendingShadowChanges);
                    this._pendingShadowChanges = {};
                }
        }
        // #endregion

    }
    // #endregion

    // #region CONFIGURATION


    // #endregion

    // #region UTILITY   
    const initAssets = (isTesting = false) => {
        initIMGAssets();
        initTEXTAssets();
        initANIMAssets();
        initTOKENAssets();
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
        D.Alert(`Anim Keys: ${D.JS(Object.keys(STATE.REF.AssetLibrary).filter(x => STATE.REF.AssetLibrary[x].type === "anim"))}`);
        for (const assetID of Object.keys(STATE.REF.AssetLibrary).filter(x => STATE.REF.AssetLibrary[x].type === "anim"))
            Anim.Initialize(assetID);
        D.Flag("... ... Animation Assets Compiled!");
    };       
    const initTOKENAssets = () => {
        for (const assetID of Object.keys(STATE.REF.AssetLibrary).filter(x => STATE.REF.AssetLibrary[x].type === "token"))
            Token.Initialize(assetID);
        D.Flag("... ... Token Assets Compiled!");
    };
    // #endregion

    return {
        CheckInstall: checkInstall,
        OnChatCall: onChatCall,
        // OnGraphicAdd: onGraphicAdd,

        Init: initAssets,

        Get: Asset.Get,

        Apply: Asset.ApplyPendingChanges

    };

})();

on("ready", () => {
    Assets.CheckInstall();
    D.Log("Assets Ready!");
});
void MarkStop("Assets");