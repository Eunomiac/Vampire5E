/* eslint-disable one-var */
void MarkStart("Assets");
const Assets = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Assets",

        // #region ~ COMMON INITIALIZATION
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
        },
        // #endregion

        // #region ~ EVENT HANDLERS: (HANDLEINPUT)
        onChatCall = (call, args, objects, msg) => {
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
                                map(xx => ["true", "false", "null"].includes(xx) ? {"true": true, "false": false, "null": null}[xx] : xx))),
                        asset = Asset.Get(assetRef);
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
                        default: {
                            const [assetRef, ...propRefs] = _.flatten(_.compact(msg.content.match(/^[^']*'([^']*)'\s*(.*)$/u).slice(1)).
                                    map((x, i) => i === 0 ? x : x.split(/,\s*/gu))),
                                asset = Asset.Get(assetRef);
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

    // #region ~ TOP SCOPE VARIABLE DELCARATIONS
    const PENDINGCHANGES = [],
        LI = {
            get B() { return STATE.REF.AssetLibrary }
        },
        ASSETS = {};
    // #endregion

    // #region CLASS DEFINITIONS
    class Asset {
        // #region ~ STATIC METHODS
        static ApplyPendingChanges(isTesting = false) {
            for (const asset of PENDINGCHANGES)
                asset.Apply(isTesting);
            if (isTesting)
                D.Alert(`Testing PENDINGCHANGES ("!asset apply confirm" to change objects): 
                
                ${D.JS(PENDINGCHANGES)}`, "Asset.ApplyPendingChanges");
            else
                PENDINGCHANGES.length = 0;
        }
        static Get(assetRef, type = null) { // Get an Asset instance by passing an asset, object, an id, or a name.
            let classRef;
            switch (D.LCase(type)) {
                case "image": case "graphic": classRef = Image; break;
                case "text": classRef = Text; break;
                // case "anim": classRef = Anim; break;
                // case "token": classRef = Token; break;
                // case "area": classRef = Area; break;
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
        static get LIB() { return this._AssetLIB }
        static set LIB(v) { this._AssetLIB = Object.assign(this._AssetLIB || {}, {[v.id]: v}) }
        // #endregion
        
        get libData() { return LI.B[this.id] }
        set libData(v) { LI.B[this._id] = D.Merge(this.libData, v) }
        get pendingData() { return this._pendingData }
        set pendingData(v) { this._pendingData = D.Merge(this._pendingData, v) }
        get data() { return D.Merge(this.libData, this.pendingData) }
        get mode() { return this.data.modes[Session.Mode] }
        get lastMode() { return this.data.modes[Session.LastMode] }

        // #region ~ CONSTRUCTOR
        constructor(assetID) {
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
        /*
            const debugLines = [],
                curPendChanges = D.Clone(this.pendingChanges);
            let indentCount = 0;
            const filterDelta = (thisRef, deltaRef) => {
                debugLines.push(`${"&nbsp;&nbsp;&gt;&nbsp;&nbsp;".repeat(indentCount)}FILTERDELTA( { ${Object.keys(thisRef).join(", ").slice(0, 10)}... },`);
                // debugLines.push(`${"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;".repeat(indentCount)}${"&nbsp;".repeat(" FILTERDELTA(".length)}${D.JSL(changesRef)} )`);     
                debugLines.push(`${"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;".repeat(indentCount)}${"&nbsp;".repeat(" FILTERDELTA(".length)}${D.JSL(deltaRef)} )`);              
                indentCount++;
                const validDeltas = {};
                for (const [prop, value] of Object.entries(deltaRef)) {
                    // const thisChangesRef = prop in changesRef ? changesRef[prop] : {};
                    debugLines.push(`${"&nbsp;&nbsp;&gt;&nbsp;&nbsp;".repeat(indentCount)}...Checking {${D.JSL(prop)}: ${D.JSL(value)}} ...`)
                    if (typeof value === "object")
                        Object.assign(validDeltas, filterDelta(thisRef[prop], value));
                    else if (thisRef[prop] !== value)
                        Object.assign(validDeltas, {[prop]: value});
                }
                indentCount--;
                debugLines.push(`${"&gt; ".repeat(indentCount)} <b>RETURN: ${D.JSL(validDeltas)}</b>`);              
                return validDeltas;
            };
            this._pendingChanges = Object.assign({}, this.pendingChanges || {}, filterDelta(this, v));
            DB(debugLines.join("<br>"), "setPendingChanges")
            if (!_.isEmpty(this.pendingChanges) && !PENDINGCHANGES.includes(this))
                PENDINGCHANGES.push(this);
            DB({curState: `{ ${Object.keys(v).map(x => `${x}: ${D.JSL(this[x])}`)} }`,
                curPendChanges,
                newChanges: v,
                filtered: filterDelta(this, v),
                newPendingChanges: this.pendingChanges,
                "isEmpty + isIncluded": `${_.isEmpty(this.pendingChanges)} + ${PENDINGCHANGES.includes(this)}`,
                PENDINGCHANGES: PENDINGCHANGES.map(x => x.name),
                pendingChangesCheck: D.JSL(this.pendingChanges)
            }, "setPendingChanges");
        }
        */
        // #endregion

        // #region ~ PRIVATE METHODS
        setNewPosition(delta) {
            const posData = Object.assign({}, _.pick(this.data, "top", "left", "height", "width"), _.pick(delta, "top", "left", "height", "width")),
                edgeData = Object.assign({}, {topEdge: this.topEdge, bottomEdge: this.bottomEdge, leftEdge: this.leftEdge, rightEdge: this.rightEdge}, _.pick(delta, "leftEdge", "rightEdge", "topEdge", "bottomEdge"));
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
        static get LIB() { return this._ImageLIB }
        static set LIB(v) { this._ImageLIB = Object.assign(this._ImageLIB || {}, {[v.id]: v}) }
        static get DragPads() { return this._DragPadsLIB }
        static set DragPads(v) { this._DragPadsLIB = Object.assign(this._DragPadsLIB || {}, {[v._dragPads.ids[0]]: v}, {[v._dragPads.ids[1]]: v}) }
        static ParseSrcURL(url) { return url.replace(/[a-z]*\.(png|jpg|jpeg)/gu, "thumb.$1") }
        static Initialize(imgID) {
            const imgAsset = new Image(imgID);
            Asset.LIB = imgAsset;
            this.LIB = imgAsset;
            if (imgAsset.hasDragPads)
                this.DragPads = imgAsset;
        }
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
                if (this._type === "image")
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
        Remove() {
            super.Remove();
            // if ()
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
                Image.Initialize(assetID);
            D.Flag("... ... Image Assets Compiled!");
        },        
        initTEXTAssets = () => {
            for (const assetID of Object.keys(STATE.REF.AssetLibrary).filter(x => STATE.REF.AssetLibrary[x].type === "text"))
                Text.Initialize(assetID);
            D.Flag("... ... Text Assets Compiled!");
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