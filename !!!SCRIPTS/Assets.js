/* eslint-disable one-var */
void MarkStart("Assets")
const Assets = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Assets",

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
            STATE.REF.AssetLibrary = STATE.REF.AssetLibrary || {}
            parseREGISTRY()
            initIMGAssets()
            // initTEXTAssets()
            Asset.ApplyPendingChanges()
        },
    // #endregion

    // #region EVENT HANDLERS: (HANDLEINPUT)
        onChatCall = (call, args, objects, msg) => {
            const assets = [call, ...args].filter(x => x.startsWith("+")).map(x => Asset.Get(x.replace(/^\+/gu, "")))
            // assets.push(...Listener.GetObjects(objects, "graphic").map(x => MediaAsset.Get(x)))
            // assets.push(...Listener.GetObjects(objects, "text").map(x => MediaAsset.Get(x)))
            args = args.filter(x => !x.startsWith("+"))
            switch (call) {
                case "get": {
                    switch (D.LCase(call = args.shift())) {
                        case "library": D.Alert(D.JS(LI.B), "ASSET LIBRARY"); break
                        case "allassets": D.Alert(`${D.JS(ASSETS)} (${Object.keys(ASSETS).length})`, "ASSETS"); break
                        case "allimg": D.Alert(D.JS(Object.values(ASSETS).filter(x => x instanceof Image)), "IMAGE ASSETS"); break
                        case "assets": D.Alert(`${D.JS(assets)} (${Object.keys(assets).length})`, "Assets"); break
                        // no default
                    }
                    break
                }
                case "init": {
                    parseREGISTRY()
                    initIMGAssets()
                    initTEXTAssets()
                    break
                }
                case "toggle": {
                    assets.forEach(x => x.ForceToggle({on: true, off: false, true: true, false: false}[args[0] || "undefined"]))
                    Asset.ApplyPendingChanges()
                    break
                }
                case "set": {
                    switch (D.LCase(call = args.shift())) {
                        case "random": {
                            const timeStart = Date.now()
                            for (let i = 0; i < 300; i++) {                                
                                assets.forEach(x => {
                                    if ("Random" in x)
                                        x.Random()
                                })
                                Asset.ApplyPendingChanges()
                            }
                            const deltaTime = Date.now() - timeStart
                            D.Alert(`300 Asset Randomizations took ${D.Round(deltaTime/1000, 2)}s`, "!asset set random")
                            break
                        }
                        case "cycle": case "next": {
                            assets.forEach(x => {
                                if ("Cycle" in x)
                                    x.Cycle()
                            })
                            Asset.ApplyPendingChanges()
                            break
                        }
                        default: {
                            assets.forEach(x => x.Set(call))
                            Asset.ApplyPendingChanges()
                            break
                        }
                    }
                }

                // no default
            }
        } /* ,
        onGraphicAdd = imgObj => {
            
        }
        */
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    // #region TOP SCOPE VARIABLE DELCARATIONS
    const PENDINGCHANGES = [],
        LI = {
            get B() { return STATE.REF.AssetLibrary }
        },
        ASSETS = {}
    // #endregion

    // #region CLASS DEFINITIONS
    class Asset {
        // STATIC METHODS
        static ApplyPendingChanges() {
            for (const asset of PENDINGCHANGES)
                asset.Apply()
            PENDINGCHANGES.length = 0
        }
        static Get(assetRef) { // Get an Asset instance by passing an asset, object, an id, or a name.
            if (assetRef instanceof Asset)
                return assetRef
            if (typeof assetRef === "object" && "id" in assetRef && assetRef.id in ASSETS)
                return ASSETS[assetRef.id]
            if (typeof assetRef === "string") {
                if (assetRef in ASSETS)
                    return ASSETS[assetRef]
                return ASSETS[Object.keys(ASSETS).find(x => ASSETS[x].name.startsWith(assetRef)) || ""] || false
            }
            return false
        }
        static Make(assetType, assetData) {

        }
        static Register(assetObj) {

        }

        // CONSTRUCTOR
        constructor(assetID) {
            try {
                this._id = assetID
                this._data = LI.B[assetID]
                this._objectType = {image: "graphic", token: "graphic", anim: "graphic", text: "text"}[this._data.type]
                this._object = getObj(this._objectType, this._id)
                this._pendingChanges = {}
                this.syncLibrary() // Updating LIBRARY with current object data & calculating derivative stats.
            } catch (errObj) {
                THROW(`Error Constructing Asset '${D.JS(assetID)}'`, "ASSET", errObj)
            }
        }

        // READ-ONLY GETTERS
        get id() { return this._id }
        get obj() { return this._object }
        get objType() { return this._objectType }
        get type() { return this._data.type }
        get page() { return this._data.page }
        get state() { return this._data.state }

        // GETTERS & SETTERS
        get name() { return this._data.name };
        set name(v) {
            if (v !== this.name) {
                this._data.name = v
                writeToLIB(this.id, this.data)                
                this.pendingChanges = {name: v}
            }
        }
        get top() { return this._data.pos.top }; set top(v) { if (v !== this.top) this.setNewPosition({top: v}) }
        get left() { return this._data.pos.left }; set left(v) { if (v !== this.left) this.setNewPosition({left: v}) }
        get height() { return this._data.pos.height }; set height(v) { if (v !== this.height) this.setNewPosition({height: v}) }
        get width() { return this._data.pos.width }; set width(v) { if (v !== this.width) this.setNewPosition({width: v}) }
        get topEdge() { return this._pos.topEdge }; set topEdge(v) { if (v !== this.topEdge) this.setNewPosition({topEdge: v}) }
        get bottomEdge() { return this._pos.bottomEdge }; set bottomEdge(v) { if (v !== this.bottomEdge) this.setNewPosition({bottomEdge: v}) }
        get leftEdge() { return this._pos.leftEdge }; set leftEdge(v) { if (v !== this.leftEdge) this.setNewPosition({leftEdge: v}) }
        get rightEdge() { return this._pos.rightEdge }; set rightEdge(v) { if (v !== this.rightEdge) this.setNewPosition({rightEdge: v}) }
        set position(v) { this.setNewPosition(v) }
        get layer() { return this._data.layer };
        set layer(v) {
            if (v !== this.layer) {
                this._data.layer = v
                writeToLIB(this.id, this.data)
                this.pendingChanges = {layer: v}
            }
        }
        get zIndex() { return this._data.zIndex }
        get activeLayer() { return this._data.activeLayer }
        set activeLayer(v) {
            if (v !== this.activeLayer) {
                this._data.activeLayer = v
                writeToLIB(this.id, this.data)
                if (this.isActive)
                    this.layer = v
            }
        }
        get isActive() { return this._data.isActive }
        set isActive(v) {
            if (v !== this.isActive)
                this.layer = v ? this.activeLayer : "walls"
            this._data.isActive = Boolean(v)
            writeToLIB(this.id, this.data)
        }

        // MODE DATA GETTERS
        get wasModeUpdated() { return this._data.wasModeUpdated }; set wasModeUpdated(v) { this._data.wasModeUpdated = Boolean(v); writeToLIB(this.id, this.data) }
        get isForcedOn() { 
            if (this._data.modes[Session.Mode].isForcedOn === "LAST")
                return this._data.modes[Session.Mode].lastActive
            return this._data.modes[Session.Mode].isForcedOn
        }
        get lastActive() { return this._data.modes[Session.Mode].lastActive }; set lastActive(v) { this._data.modes[Session.LastMode].lastActive = Boolean(v); writeToLIB(this.id, this.data) }
        get isForcedState() {
            if (this._data.modes[Session.Mode].isForcedState === true)
                return this._data.modes[Session.Mode].lastState
            return this._data.modes[Session.Mode].isForcedState
        }
        get lastState() { return this._data.modes[Session.Mode].lastState }; set lastState(v) { this._data.modes[Session.LastMode].lastState = v; writeToLIB(this.id, this.data) }

        // PENDING CHANGES GETTER & SETTER
        get pendingChanges() { return this._pendingChanges }
        set pendingChanges(v) {
            Object.assign(this._pendingChanges, v)
            if (!PENDINGCHANGES.includes(this))
                PENDINGCHANGES.push(this)
        }

        // PRIVATE METHODS
        setNewPosition(delta) {
            const posData = Object.assign({}, this._data.pos, _.pick(delta, "top", "left", "height", "width")),
                edgeData = Object.assign({}, this._pos, _.pick(delta, "leftEdge", "rightEdge", "topEdge", "bottomEdge"))
            if ("topEdge" in delta && "bottomEdge" in delta) {
                posData.height = edgeData.bottomEdge - edgeData.topEdge
                posData.top = (edgeData.topEdge + edgeData.bottomEdge) / 2
            } else if ("topEdge" in delta) {
                posData.top = edgeData.topEdge + 0.5 * posData.height
            } else if ("bottomEdge" in delta) {
                posData.top = edgeData.bottomEdge - 0.5 * posData.height
            }
            if ("leftEdge" in delta && "rightEdge" in delta) {
                posData.width = edgeData.rightEdge - edgeData.leftEdge
                posData.left = (edgeData.leftEdge + edgeData.rightEdge) / 2
            } else if ("leftEdge" in delta) {
                posData.left = edgeData.leftEdge + 0.5 * posData.width
            } else if ("rightEdge" in delta) {
                posData.left = edgeData.rightEdge - 0.5 * posData.width
            }            
            edgeData.topEdge = posData.top - 0.5 * posData.height
            edgeData.bottomEdge = posData.top + 0.5 * posData.height
            edgeData.leftEdge = posData.left - 0.5 * posData.width
            edgeData.rightEdge = posData.left + 0.5 * posData.width

            this.pendingChanges = _.omit(posData, (v,k) => this[k] === v)
            this._data.pos = posData
            this._pos = edgeData
            writeToLIB(this.id, this.data)
        }
        syncLibrary() {            
            this._data.pos.top = this._object.get("top")
            this._data.pos.left = this._object.get("left")
            this._data.pos.height = this._object.get("height")
            this._data.pos.width = this._object.get("width")
            this._data.page = _.findKey(C.PAGES, v => v === this._object.get("_pageid"))
            this._data.layer = this._object.get("layer")
            this._data.isActive = this._data.layer !== "walls"

            // Calculating derivative stats
            this._pos = {
                leftEdge: this._data.pos.left - 0.5 * this._data.pos.width,
                rightEdge: this._data.pos.left + 0.5 * this._data.pos.width,
                topEdge: this._data.pos.top - 0.5 * this._data.pos.height,
                bottomEdge: this._data.pos.top + 0.5 * this._data.pos.height
            }
            writeToLIB(this.id, this.data)        
        }
        syncObject() {
            const delta = {
                left: this._data.pos.left,
                top: this._data.pos.top,
                height: this._data.pos.height,
                width: this._data.pos.width,
                layer: this._data.isActive ? this._data.activeLayer : "walls"
            }
            this.pendingChanges = _.omit(delta, (v, k) => this._object.get(k) === v)
        }

        // PUBLIC METHODS
        Apply() {
            if (!_.isEmpty(this.pendingChanges)) {
                this.obj.set(this.pendingChanges)
                this._pendingChanges = {}
            }
        }
        ChangeMode() {
            this.lastActive = this.isActive
            this.lastState = this.state
            switch (this.isForcedOn) {
                case true: case false: this.isActive = this.isForcedOn; break
                case "LAST": this.isActive = this.lastActive; break
                case null: break
                // no default
            }
            if (this.isActive && this.isForcedState === true)
                this.Set(this.lastState)
        }
        Set(state) { this._data.state = state; writeToLIB(this.id, this.data) }
        Toggle(isActive = null, isForcing = false) { 
            if (this.isForcedOn !== "NEVER" || isForcing) {
                switch (isActive) {
                    case true: case false: break
                    default: isActive = !this._data.isActive; break
                }
                if (isActive !== this._data.isActive && (
                    !isActive || this.isForcedOn !== "NEVER" || isForcing
                ))
                    this.isActive = isActive
            }
        }
        ForceToggle(isActive = null) {
            this.Toggle(isActive, true)
        }        
        Unregister() {
            delete ASSETS[this.id]
            delete LI.B[this.id]
        }
        Remove() {
            this.obj.remove()
            this.Unregister()
        }
        /*
        Fix() { }
        */
    }
    class Image extends Asset {
        static ParseSrcURL(url) { return url.replace(/[a-z]*\.(png|jpg|jpeg)/gu, "thumb.$1") }
        
        // The constructor is used on initialization by passing an object ID to it.
        constructor(imgID) {
            super(imgID)
            if (this._data.dragPadIDs) {
                this._dragPads = this._data.dragPadIDs.map(x => getObj("graphic", x))
                this._dragPadsActive = this._data.dragPadsStartActive
                this._pendingDragPadChanges = {}
                this._dragPadLayers = [this.isActive && this._dragPadsActive ? "objects" : "walls", "walls"]
                this._dragPadPos = {
                    top: this.top - this._data.dragPadDeltas.deltaHeight/2,
                    left: this.left - this._data.dragPadDeltas.deltaWidth/2,
                    height: this.height - this._data.dragPadDeltas.deltaHeight,
                    width: this.width - this._data.dragPadDeltas.deltaWidth
                }
                this.SyncDragPads()
            }
            if (this._type === "image" && !this._object.get("isDrawing"))
                this._pendingChanges.isDrawing = true
        }

        get srcs() {
            if (typeof this._data.srcs === "string")
                return Asset.Get(this._data.srcs).srcs
            return this._data.srcs
        }
        get dragPadsActive() { return this.isActive && this._dragPadsActive }
        set dragPadsActive(v) {
            if (v !== this._dragPadsActive) {
                this._dragPadsActive = v
                this.pendingDragPadChanges = {layer: [this.dragPadsActive ? "objects" : "walls", "walls"]}
            }
        }

        Add(srcRef, srcName) {
            const asset = Asset.Get(srcRef)
            if (asset) {
                this._data.srcs = asset.name
            } else {                
                srcRef = "get" in srcRef && srcRef.get("imgsrc") || srcRef
                this._data.srcs[srcName] = Image.ParseSrcURL(srcRef)
            }
            writeToLIB(this.id, this.data)
        }
        
        Set(srcName) {
            if (this.state !== srcName) {
                super.Set(srcName)
                this.pendingChanges = {imgsrc: this.srcs[srcName]}
            }
        }

        Cycle() {
            const index = Object.keys(this.srcs).indexOf(x => x === this.state)
            this.Set(Object.keys(this.srcs)[index >= this.srcs.length - 1 ? 0 : index + 1])
        }

        Random() {
            this._shuffledSrcs = (this._shuffledSrcs || []).length ? this._shuffledSrcs : _.shuffle(Object.keys(this.srcs))
            this.Set(this._shuffledSrcs.pop())
        }

        // dragpad control
        SyncDragPads() {
            const dragPadDeltas = {}
            this._dragPads.forEach((x,i) => {
                if (x.get("layer") !== this._dragPadLayers[i]) {
                    dragPadDeltas.layer = dragPadDeltas.layer || []
                    dragPadDeltas.layer[i] = this._dragPadLayers[i]
                }
                for (const [posKey, posVal] of Object.entries(this._dragPadPos)) {
                    if (x.get(posKey) !== posVal) {
                        dragPadDeltas[posKey] = dragPadDeltas[posKey] || []
                        dragPadDeltas[posKey][i] = posVal
                    }
                }
            })
            if (!_.isEmpty(dragPadDeltas))
                this.pendingDragPadChanges = dragPadDeltas
        }
        MakeDragPads(funcName, deltaHeight = 0, deltaWidth = 0) {
            
        }
        RemoveDragPads() {

        }
        FlipDragPads() {
            if (this._dragPads && this._isActive && this._dragPadsActive)

        }
        ToggleDragPads(padsActive) {
            if (this._dragPads && typeof padsActive === "boolean" && padsActive !== this._dragPadsActive) {
                padsActive = typeof padsActive === "boolean" ? padsActive : this._dragPadsActive
                this._dragPadsActive = padsActive
                if (this.isActive && this._dragPadsActive)
                    this.pendingDragPadChanges = {layer: ["objects", "walls"]}
                else
                    this.pendingDragPadChanges = {layer: ["walls", "walls"]}
        }


        Toggle(isActive = null, isForcing = false) {
            super.Toggle(isActive, isForcing)
            if (this._dragPads) {
                if (this.isActive && this._dragPadsActive && _.none(this._dragPadLayers, (x,i) => ))
                    this.pendingDragPadChanges = {layer: "objects"}
                else
                    this.pendingDragPadChanges = {layer: "walls"}
            }
        }
        Remove() {
            super.Remove()
            if ()
        }

        // PENDING CHANGES GETTER & SETTER
        get pendingDragPadChanges() { return this._pendingDragPadChanges }; set pendingDragPadChanges(v) { Object.assign(this._pendingDragPadChanges, v)}
        set pendingChanges(v) {
            Object.assign(this._pendingChanges, v)
            const pendingDragPadChanges = _.pick(this.pendingChanges, "layer", "top", "left", "height", "width")
            if ("top" in pendingDragPadChanges)
                pendingDragPadChanges.top += this.shadowShift
            if ("left" in pendingDragPadChanges)
                pendingDragPadChanges.left += this.shadowShift
            this.pendingDragPadChanges = pendingDragPadChanges
            if (!PENDINGCHANGES.includes(this))
                PENDINGCHANGES.push(this)
        }

        Apply() {
            super.Apply()
            if (this.shadow && !_.isEmpty(this.pendingDragPadChanges)) {
                this.shadow.set(this.pendingDragPadChanges)
                this._pendingDragPadChanges = {}
            }
        }

    }
    /*
    class Token extends Image {

        constructor(tokenObj) {
            super(tokenObj, "token")
            this.pendingChanges = {isDrawing: false}
        }

        setCombinedSrc(srcName) { }
    }
    class Anim extends Image {
        constructor(animID) {
            super(animID)

        }

        Add(srcName) { D.Alert(`ERROR: Attempt to Add Source '${D.JS(srcName)}' to Animation '${this.name}'`, "Cannot Set Animation Source") }
        Set(srcName) { D.Alert(`ERROR: Attempt to Change Animation '${this.name}' Source to '${D.JS(srcName)}'`, "Cannot Set Animation Source") }
        Cycle() { D.Alert(`ERROR: Attempt to Cycle Animation '${this.name}' Source`, "Cannot Set Animation Source") }
        Random() { D.Alert(`ERROR: Attempt to Randomize Animation '${this.name}' Source`, "Cannot Set Animation Source") }

        // overrides to lock out changing source, etc
    }
    */
    class Text extends Asset {
        constructor(textID) {
            super(textID)
            if (this._data.shadowID)
                this._shadowObj = getObj("text", this._data.shadowID)
            this._lineHeight = D.CHARWIDTH[this.font_family][this.font_size].lineHeight
            this._shadowShift = this._data.shadowShift || C.SHADOWOFFSETS[this._data.font_size]
            this._pendingShadowChanges = {}
        }

        get shadow() { return this._shadowObj || false }
        get shadowShift() { return this._shadowShift }
        set shadowShift(v) {
            if (v !== this.shadowShift) {
                this._data.shadowShift = v
                writeToLIB(this.id, this.data)
                this.pendingShadowChanges = {top: this.top + v, left: this.left + v}
            }
        }

        get color() { return this._data.color }
        set color(v) { 
            if (v !== this.color) {
                this._data.color = v
                writeToLIB(this.id, this.data)
                this.pendingChanges = {color: v}
            }
        }
        get font() { return this._data.font_family }
        set font(v) {
            if (v !== this.font) {
                this._data.font_family = v
                writeToLIB(this.id, this.data)
                this.pendingChanges = {font_family: v}
                this.justifyText()
            }
        }
        get size() { return this._data.font_size }
        set size(v) {
            if (v !== this.size) {
                this._data.font_size = v
                writeToLIB(this.id, this.data)
                this.pendingChanges = {font_size: v}
                this.justifyText()
            }
        }
        get lineHeight() { return this._lineHeight }
        set lineHeight(v) {
            if (v !== this.lineHeight) {
                this._lineHeight = v
                this.justifyText()
            }
        }

        // color, font, size
        // shadow image
        // "real pos" overrides
        // justification & line splitting
        // PENDING CHANGES GETTER & SETTER
        get pendingShadowChanges() { return this._pendingShadowChanges }; set pendingShadowChanges(v) { Object.assign(this._pendingShadowChanges, v)}
        set pendingChanges(v) {
            Object.assign(this._pendingChanges, v)
            const pendingShadowChanges = _.pick(this.pendingChanges, "text", "layer", "font_family", "font_size", "top", "left")
            if ("top" in pendingShadowChanges)
                pendingShadowChanges.top += this.shadowShift
            if ("left" in pendingShadowChanges)
                pendingShadowChanges.left += this.shadowShift
            this.pendingShadowChanges = pendingShadowChanges
            if (!PENDINGCHANGES.includes(this))
                PENDINGCHANGES.push(this)
        }
        // PRIVATE METHODS
        justifyText() { }



        Apply() {
            super.Apply()
            if (this.shadow && !_.isEmpty(this.pendingShadowChanges)) {
                this.shadow.set(this.pendingShadowChanges)
                this._pendingShadowChanges = {}
            }
        }

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
    const parseIMGRegistry = () => { 
        // STATE.REF.AssetLibrary = STATE.REF.AssetLibrary || {}
            const errorLines = []
            for (const itemData of Object.values(D.Clone(Media.IMAGES))) {
                const mediaObj = getObj("graphic", itemData.id)
                if (mediaObj) {
                    const libData = {
                        name: itemData.name,
                        type: "image",
                        page:  _.findKey(C.PAGES, v => v === itemData.pageID),
                        layer: mediaObj.get("layer"),
                        zIndex: itemData.zIndex,
                        pos: {
                            top: itemData.top,
                            left: itemData.left,
                            height: itemData.height,
                            width: itemData.width
                        },
                        state: itemData.curSrc,
                        isActive: itemData.isActive,
                        activeLayer: itemData.activeLayer,
                        wasModeUpdated: Boolean(itemData.wasModeUpdated),
                        modes: itemData.modes,
                        srcs: itemData.srcs
                    }
                    if (itemData.padID) {
                        libData.dragPadIDs = [itemData.padID, itemData.partnerID]
                        libData.dragPadsStartActive = true
                        const [pad, partner] = libData.dragPadIDS.map(x => getObj("graphic", x))
                        libData.dragPadDeltas = {
                            deltaHeight: pad.get("height") - libData.height,
                            deltaWidth: pad.get("width") - libData.width
                        }
                    }
                    STATE.REF.AssetLibrary[itemData.id] = D.Clone(libData)
                } else {
                    errorLines.push(`Error finding object with key ${D.JS(itemData.name)}`)
                }
            }
            if (errorLines.length)
                D.Alert([
                    "<h4>Image Conversion Errors:</h4>",
                    errorLines.join("<br>")
                ].join(""))
            else
                D.Flag("Image Conversion Successful!")
        },
        parseTEXTRegistry = () => {
// STATE.REF.AssetLibrary = STATE.REF.AssetLibrary || {}
            const errorLines = []
            for (const itemData of Object.values(D.Clone(Media.TEXT))) {
                const mediaObj = getObj("text", itemData.id)
                if (mediaObj) {
                    const libData = {
                        name: itemData.name,
                        type: "text",
                        page:  _.findKey(C.PAGES, v => v === itemData.pageID),
                        layer: mediaObj.get("layer"),
                        zIndex: itemData.zIndex,
                        pos: {
                            top: itemData.top,
                            left: itemData.left,
                            height: itemData.height,
                            width: itemData.width
                        },
                        state: mediaObj.get("text"),
                        isActive: itemData.isActive,
                        activeLayer: itemData.activeLayer,
                        wasModeUpdated: Boolean(itemData.wasModeUpdated),
                        modes: D.Clone(itemData.modes),
                        color: itemData.color,
                        font_family: itemData.font_family, // Class should correct to "Contrail One"
                        font_size: itemData.font_size,
                        align: {
                            vert: itemData.vertAlign,
                            horiz: itemData.justification
                        },
                        maxWidth: itemData.maxWidth
                    }
                    if (itemData.shadowID) 
                        libData.shadowID = itemData.shadowID
                    STATE.REF.AssetLibrary[itemData.id] = D.Clone(libData)
                } else {
                    errorLines.push(`Error finding text object with key ${D.JS(itemData.name)}`)
                }
            }
            if (errorLines.length)
                D.Alert([
                    "<h4>Text Conversion Errors:</h4>",
                    errorLines.join("<br>")
                ].join(""))
            else
                D.Flag("Text Conversion Successful!")
        },
        parseREGISTRY = () => {
            parseIMGRegistry()
            parseTEXTRegistry()
            state.VAMPIRE.Assets.AssetLibrary = D.Clone(STATE.REF.AssetLibrary)
            D.Flag("Registry Parsed to Library")
            // D.Alert(D.JS(state.VAMPIRE.Assets), "Assets After Parsing Registry.")
            // STATE.REF.AssetLibrary = D.Clone(STATE.REF.AssetLibrary)
        },
        initIMGAssets = () => {
            for (const assetID of Object.keys(STATE.REF.AssetLibrary).filter(x => STATE.REF.AssetLibrary[x].type === "image")) 
                ASSETS[assetID] = new Image(assetID)
            D.Flag("Image Assets Compiled")    
        },
        initTEXTAssets = () => {
            for (const assetID of Object.keys(STATE.REF.AssetLibrary).filter(x => STATE.REF.AssetLibrary[x].type === "text")) 
                ASSETS[assetID] = new Text(assetID)     
            D.Flag("Text Assets Compiled")
        },
        writeToLIB = (assetID, key, value) => {
            return true
            STATE.REF.AssetLibrary[assetID] = STATE.REF.AssetLibrary[assetID] || {}
            if (typeof key === "object")
                STATE.REF.AssetLibrary[assetID] = D.Clone(key)
            else
                STATE.REF.AssetLibrary[assetID][key] = D.Clone(value)
        }
    // #endregion
    
    return {
        CheckInstall: checkInstall,
        OnChatCall: onChatCall,
        // OnGraphicAdd: onGraphicAdd,

        ASSETS,

        Get: Asset.Get,

        Apply: Asset.ApplyPendingChanges

    }
        
})()

on("ready", () => {
    Assets.CheckInstall()
    D.Log("Assets Ready!")
})
void MarkStop("Assets")