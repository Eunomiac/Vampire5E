void MarkStart("DragPads");
const DragPads = (() => {
    // #region ▒░▒░▒░▒[FRONT] Boilerplate Namespacing & Initialization ▒░▒░▒░▒ ~
    const SCRIPTNAME = "DragPads";

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

    const checkInstall = () => {
        C.RO.OT[SCRIPTNAME] = C.RO.OT[SCRIPTNAME] || {};
        initialize();
    };
    // #endregion

    // #region LOCAL INITIALIZATION
    const initialize = () => {
        STATE.REF.byPad = STATE.REF.byPad || {};
        STATE.REF.byGraphic = STATE.REF.byGraphic || {};
        STATE.REF.arePadsActive = true;
    };
    // #endregion

    // #region EVENT HANDLERS: (HANDLEINPUT)
    const onChatCall = (call, args, objects, msg) => {
        switch (call) {
            case "backup": {
                STATE.REF.backup = {
                    byPad: JSON.parse(JSON.stringify(PADREGISTRY)),
                    byGraphic: JSON.parse(JSON.stringify(GRAPHICREGISTRY))
                };
                D.Alert("Drag Pad Backup Updated.", "!dpad backup");
                break;
            }
            case "restore": {
                STATE.REF.byPad = JSON.parse(JSON.stringify(STATE.REF.backup.byPad));
                STATE.REF.byGraphic = JSON.parse(JSON.stringify(STATE.REF.backup.byGraphic));
                D.Alert("Drag Pad Backup Restored.", "!dpad restore");
                break;
            }
            case "find": {
                const funcName = args.shift();
                const padData = _.filter(_.values(PADREGISTRY), (v) => v.funcName === funcName);
                const padObjs = _.map(padData, (v) => getObj("graphic", v.partnerID));
                const padLayer = _.map(padObjs, (v) => `${v.get("name")}: ${v.get("layer")}`);
                D.Alert(`Pad Data:<br><br>${D.JS(padLayer)}`, "!dpad find");
                break;
            }
            case "make": {
                // !dpad <funcName> <imgKey OR select img> [top:100 left:100 height:100 width:100 deltaHeight:-50 deltaWidth:-50 deltaTop:-50 deltaLeft:-50 startActive:true]
                const funcName = args.shift();
                const hostObj = (D.GetSelected(msg) && D.GetSelected(msg)[0]) || Media.GetImg(args.shift());
                if (VAL({graphicObj: hostObj}, "!dpad make")) {
                    D.Alert(`Host Object Retrieved: ${D.JS(hostObj.get("name"))}<br>Making Drag Pads...`, "!dpad make");
                    makePad(hostObj, funcName, args.join(", ")); // deltaHeight:-28 width:-42 left:0 top:0
                }
                break;
            }
            case "on":
            case "off": {
                togglePad(args.shift(), call === "on");
                break;
            }
            case "lock": {
                STATE.REF.arePadsActive = !STATE.REF.arePadsActive;
                D.Flag(`Pads Now ${STATE.REF.arePadsActive ? "ACTIVE" : "INACTIVE"}`);
                break;
            }
            case "show": {
                const padFilter = args.shift().toLowerCase();
                _.each(PADREGISTRY, (v, padID) => {
                    const padObj = getObj("graphic", padID);
                    if (padFilter === "all" || (padObj && D.LCase(padObj.get("name")).includes(padFilter))) {
                        padObj.set(
                            "imgsrc",
                            "https://s3.amazonaws.com/files.d20.io/images/64184544/CnzRwB8CwKGg-0jfjCkT6w/thumb.png?1538736404"
                        );
                        padObj.set("layer", "gmlayer");
                    }
                });
                break;
            }
            case "hide": {
                _.each(PADREGISTRY, (v, padID) => {
                    const padObj = getObj("graphic", padID);
                    if (padObj) {
                        padObj.set("imgsrc", IMAGES.blank);
                        if (
                            v.active === "on"
                            && (Media.GetImgData(v.name).startActive === true
                                || Media.GetImgData(PADREGISTRY[v.partnerID].name).startActive === true)
                        )
                            padObj.set("layer", "objects");
                    }
                });
                break;
            }
            case "kill": {
                const funcName = args.shift();
                const imgKeys = [];
                for (const padID of Object.keys(PADREGISTRY))
                    if (funcName === "allpads" || PADREGISTRY[padID].funcName === funcName) {
                        const padObj = getObj("graphic", padID);
                        imgKeys.push(PADREGISTRY[padID].name);
                        if (padObj)
                            padObj.remove();
                        delete GRAPHICREGISTRY[PADREGISTRY[padID].id];
                        delete PADREGISTRY[padID];
                    }
                for (const imgKey of imgKeys)
                    Media.RemoveImg(imgKey);
                break;
            }
            case "reset": {
                const [padObjs, padNames, padData, graphicList, reportStrings] = [[], [], [], [], []];
                switch (D.LCase((call = args.shift()))) {
                    case "confirm": {
                        STATE.REF.byPad = {};
                        STATE.REF.byGraphic = {};
                        _.each(_.flatten(padObjs), (pad) => {
                            if (Media.IsRegistered(pad))
                                Media.RemoveImg(pad, true);
                            pad.remove();
                        });
                        _.each(graphicList, (padName) => {
                            Media.RemoveImg(padName, true);
                        });
                        _.each(padData, (data) => {
                            const hostObj = getObj("graphic", data.hostID) || getObj("text", data.hostID);
                            makePad(hostObj, data.funcName, data.options);
                        });
                        D.Alert(["<h3>Current Image Registry</h3>", ...Object.keys(Media.IMAGES)].join("<br>"), "!dpad reset confirm");
                        break;
                    }
                    default: {
                        for (const [hostID, data] of Object.entries(GRAPHICREGISTRY)) {
                            const hostObj = getObj("graphic", hostID) || getObj("text", hostID);
                            const padObjPair = [getObj("graphic", data.id), getObj("graphic", data.pad.partnerID)];
                            padObjs.push([padObjPair[0] || null, padObjPair[1] || null, data.pad.funcName]);
                            padNames.push([
                                `${data.pad.name}${(padObjPair[0] && "") || " -> MISSING!"}`,
                                `${data.partnerPad.name}${(padObjPair[1] && "") || " -> MISSING!"}`
                            ]);
                            if (hostObj)
                                padData.push({
                                    hostID,
                                    funcName: data.pad.funcName,
                                    options: {
                                        left: data.left,
                                        top: data.top,
                                        height: PADREGISTRY[data.id].height,
                                        width: PADREGISTRY[data.id].width,
                                        startActive: data.pad.active === "on" || data.partnerPad.active === "on"
                                    }
                                });
                            else
                                reportStrings.push(
                                    `'${Media.GetImgKey(hostID) || "&lt;UNREGISTERED&gt;"}' (${hostID}) for <b>${D.JSL(data.pad.name)}</b>`
                                );
                        }
                        if (reportStrings.length)
                            reportStrings.unshift("<h3>Missing Graphic Objects</h3>");
                        reportStrings.unshift(
                            ...[
                                "<h3>Initial Image Registry</h3>",
                                ...Object.keys(GRAPHICREGISTRY).map(
                                    (x) => Media.GetImgKey(x) || Media.GetTextKey(x) || `MISSING: ${GRAPHICREGISTRY[x].pad.name}`
                                )
                            ]
                        );
                        reportStrings.push(`<h3>${padObjs.length} Pad Objects Found</h3>`);
                        reportStrings.push(
                            ...padObjs.map(
                                (x) => `${(x[0] && PADREGISTRY[x[0].id] && PADREGISTRY[x[0].id].name)
                                        || (VAL({object: x[0]}) && `(${x[0].get("name")})`)
                                        || `(${D.JS(x[2])})`}${x[0] ? "" : ` <b>&lt;NO PAD</b> (${D.JS(x[0])})<b>&gt;</b>`}${
                                    x[1] ? "" : ` --> <b>&lt;NO PARTNER</b> (${D.JS(x[1])})<b>&gt;</b>`
                                }`
                            )
                        );
                        _.each(Media.IMAGES, (imgData, imgName) => {
                            if (imgName.includes("Pad_") && !_.any(_.flatten(padNames), (x) => x.includes(imgName)))
                                graphicList.push(imgName);
                        });
                        if (graphicList.length)
                            reportStrings.push(...[`<h3>${graphicList.length} Unconnected Pad Objects</h3>`, ...graphicList]);
                        reportStrings.push("<b>!dpad reset confirm</b> to prune registries.");
                        D.Alert(reportStrings.join("<br>"), "!dpad reset");
                        break;
                    }
                }
                break;
            }
            case "list": {
                const padNames = [];
                _.each(GRAPHICREGISTRY, (v) => {
                    padNames.push(v.pad.name);
                });
                D.Alert(["<h3>Registered Drag Pads</h3>", ...padNames].join("<br>"));
                break;
            }
            case "fix": {
                fixPadRegistry();
                setPadDeltas();
                D.Alert("Pad Registry fixed.<br>Media registry updated with pad IDs.<br>Pad Deltas Set.", "!dpad fix");
                break;
            }
            // no default
        }
    };
    const onGraphicChange = (imgObj, prevData) => {
        if (
            !STATE.REF.arePadsActive
            || imgObj.get("layer") === "walls"
            || !PADREGISTRY[imgObj.id]
            || (imgObj.get("left") === prevData.left && imgObj.get("top") === prevData.top)
        )
            return false;
        const curData = {
            left: imgObj.get("left"),
            top: imgObj.get("top")
        };

        // First, immediately toggle the DragPad to its partner, to create the responsive "snapping" feedback for the player:
        imgObj.set({
            layer: "walls",
            controlledby: ""
        });
        const objData = PADREGISTRY[imgObj.id];
        const partnerObj = getObj("graphic", objData.partnerID);
        imgObj.set({
            left: objData.left,
            top: objData.top
        });
        partnerObj.set({
            layer: "objects",
            controlledby: "all"
        });
        PADREGISTRY[imgObj.id].active = "off";
        PADREGISTRY[partnerObj.id].active = "on";

        if (!FUNCTIONS[objData.funcName])
            return false;
        // Determine the direction the pad was moved in, to send to the function.
        // Will send an array of two directions, one horizontal, one vertical, with the first direction being the largest.
        const [deltaX, deltaY] = [curData.left - prevData.left, curData.top - prevData.top];
        const moveData = [deltaY > 0 ? "down" : "up"];
        if (Math.abs(deltaX) > Math.abs(deltaY))
            moveData.unshift(deltaX > 0 ? "right" : "left");
        else
            moveData.push(deltaX > 0 ? "right" : "left");
        // The third element is "true" if the movement was diagonal, judged roughly by relative magnitudes of the axial shifts:
        moveData.push(Math.abs(deltaX) / Math.abs(deltaY) >= 0.75 && Math.abs(deltaX) / Math.abs(deltaY) <= 1.33);

        DB({deltaX, deltaY, prevData: {left: prevData.left, top: prevData.top}, curData, moveData}, "toggleMapSlider");

        FUNCTIONS[objData.funcName]({
            id: objData.id,
            moveData
        });
        toFront(imgObj);
        toFront(partnerObj);

        return true;
    };
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************
    // #region CONFIGURATION
    const IMAGES = {
        blank: "https://s3.amazonaws.com/files.d20.io/images/63990142/MQ_uNU12WcYYmLUMQcbh0w/thumb.png?1538455511",
        signalLight: "https://s3.amazonaws.com/files.d20.io/images/66320080/pUJEq-Vo-lx_-Nn16TvhYQ/thumb.png?1541372292" // 455 x 514
    };
    const DICECATS = ["Main", "Big"];
    const GRAPHICREGISTRY = STATE.REF.byGraphic;
    const PADREGISTRY = STATE.REF.byPad;
    // #endregion

    // #region PERSONAL FUNCTION SETTINGS
    /* CUSTOM PAD FUNCTIONS: Put functions linked by name to drag pads here.
   Each will be passed an object of form:
   {  id: <id of graphic object beneath> } */
    const FUNCTIONS = {
        selectDie(args) {
            const [, dieCat, dieNum] = Media.GetImgKey(args.id).split("_");
            Roller.Select(dieCat, D.Int(dieNum));
        },
        wpReroll() {
            const stateVar = C.RO.OT.Roller.selected;
            const diceCats = [...DICECATS];
            let dieCat = "";
            do {
                dieCat = diceCats.pop();
                dieCat = stateVar[dieCat] && stateVar[dieCat].length ? dieCat : 0;
            } while (dieCat === 0);
            Roller.Reroll(dieCat);
        },
        signalLight(args) {
            const [light] = findObjs({
                _type: "graphic",
                _id: args.id
            });
            if (!light)
                THROW(`No signal light found with id ${JSON.stringify(args.id)}.`, "signalLight");
            else if (Media.GetImgSrc(light) === "off")
                Media.SetImg(light, "on");
            else
                Media.SetImg(light, "off");
        },
        flipComp(card) {
            const slot = D.Int(Media.GetImgData(card.id).name.replace(/CompSpot_/gu, "")) - 1;
            Complications.Flip(slot);
        },
        toggleMapLayer(padData) {
            const buttonKey = Media.GetImgKey(padData.id);
            const mapLayerKey = buttonKey.replace(/Button/gu, "Layer");
            Media.SetImg(buttonKey, (Media.ToggleImg(mapLayerKey) && "on") || "off");
            if (MAPPANELTIMER) {
                clearTimeout(MAPPANELTIMER);
                MAPPANELTIMER = setTimeout(FUNCTIONS.toggleMapPanel, 10000);
            }
        },
        toggleMapSlider(padData) {
            const sliderData = Media.GetImgData(padData.id);
            const mapLayerData = Media.GetImgData(sliderData.name.replace(/Button/gu, "Layer"));
            const newSliderPos = Media.CycleImg(sliderData.id, false, padData.moveData.includes("left"));
            if (newSliderPos !== false) {
                const sliderSrc = sliderData.cycleSrcs[newSliderPos];
                switch (sliderSrc) {
                    case "base": {
                        Media.ToggleImg(mapLayerData.id, false);
                        if (sliderData.name.includes("District"))
                            Media.ToggleImg("MapLayer_DistrictsFill_1", false);
                        break;
                    }
                    case "labels": {
                        Media.ToggleImg(mapLayerData.id, true);
                        Media.ToggleImg("MapLayer_DistrictsFill_1", false);
                        break;
                    }
                    case "fills": {
                        Media.ToggleImg(mapLayerData.id, false);
                        Media.ToggleImg("MapLayer_DistrictsFill_1", true);
                        break;
                    }
                    case "both": {
                        Media.ToggleImg(mapLayerData.id, true);
                        Media.ToggleImg("MapLayer_DistrictsFill_1", true);
                        break;
                    }
                    case "anarch":
                    case "camarilla":
                    case "autarkis": {
                        Media.ToggleImg(mapLayerData.id, true);
                        Media.SetImg(mapLayerData.id, sliderSrc);
                        break;
                    }
                    // no default
                }
            }
            if (MAPPANELTIMER) {
                clearTimeout(MAPPANELTIMER);
                MAPPANELTIMER = setTimeout(FUNCTIONS.toggleMapPanel, 10000);
            }
        },
        toggleMapPanel(panelData) {
            const imgData = Media.GetImgData("MapButton_Panel_1");
            if (imgData.curSrc === "open" || panelData === undefined) {
                for (const buttonName of [
                    "Domain",
                    "Districts",
                    "Roads",
                    "Parks",
                    "Rack",
                    ...["Culture", "Education", "Havens", "Health", "Landmarks", "Nightlife", "Shopping", "Transportation"].map(
                        (x) => `Sites${x}`
                    )
                ])
                    Media.ToggleImg(`MapButton_${buttonName}`, false);
                Media.SetImg(imgData.id, "closed");
                if (MAPPANELTIMER)
                    clearTimeout(MAPPANELTIMER);
                MAPPANELTIMER = null;
            } else {
                for (const buttonName of [
                    "Domain",
                    "Districts",
                    "Roads",
                    "Parks",
                    "Rack",
                    ...["Culture", "Education", "Havens", "Health", "Landmarks", "Nightlife", "Shopping", "Transportation"].map(
                        (x) => `Sites${x}`
                    )
                ])
                    Media.ToggleImg(`MapButton_${buttonName}`, true);
                Media.SetImg(imgData.id, "open");
                if (MAPPANELTIMER)
                    clearTimeout(MAPPANELTIMER);
                MAPPANELTIMER = setTimeout(FUNCTIONS.toggleMapPanel, 10000);
            }
        }
    };
    // #endregion
    let MAPPANELTIMER = null;
    // #region GETTERS
    const getPadPair = (padRef) => {
        const imgData = Media.GetImgData(padRef);
        DB({padRef, imgData}, "getPadPair");
        if (VAL({list: imgData}) && "padID" in imgData) {
            const pads = [getObj("graphic", imgData.padID), getObj("graphic", imgData.partnerID)];
            DB({PadRefIS: "ImgRef: ImgData Found", return: D.JS(_.compact([getObj("graphic", imgData.padID), getObj("graphic", imgData.partnerID)])), map: pads.map((x) => (x && "get" in x && x.get("name")) || (x && `??: ${D.JS(x)}`) || "NO OBJ")}, "getPadPair");
            return _.compact([getObj("graphic", imgData.padID), getObj("graphic", imgData.partnerID)]);
        } else if (VAL({object: padRef}) && padRef.id in PADREGISTRY) {
            DB({PadRefIS: "PadRef: Pad ID Found", return: D.JS(_.compact([getObj("graphic", padRef.id), getObj("graphic", PADREGISTRY[padRef.id].partnerID)]))}, "getPadPair");
            return _.compact([getObj("graphic", padRef.id), getObj("graphic", PADREGISTRY[padRef.id].partnerID)]);
        } else if (VAL({string: padRef}) && padRef in FUNCTIONS) {
            DB({PadRefIS: "FuncRef: Function Found", return: D.JS(_.compact(Object.keys(PADREGISTRY).filter((x) => PADREGISTRY[x].funcName === padRef).map((x) => getObj("graphic", x))))}, "getPadPair");
            return _.compact(Object.keys(PADREGISTRY).filter((x) => PADREGISTRY[x].funcName === padRef).map((x) => getObj("graphic", x)));
        }
        DB({PadRefIS: "UNKNOWN", return: "EMPTY ARRAY"}, "getPadPair");
        return [];
    };
    const getPads = (padRefs) => _.compact(_.flatten(_.flatten([padRefs]).map((x) => getPadPair(x))));
    const getGraphic = (pad) => Media.GetImg((PADREGISTRY[((VAL({object: pad}) && pad) || {id: ""}).id] || {id: ""}).id);
    // #endregion

    // #region SETTERS
    const makePad = (imgRef, funcName, params = {deltaTop: 0, deltaLeft: 0, deltaHeight: 0, deltaWidth: 0}) => {
        // THROW(`Making Pad: ${graphicObj.get("name")}, ${funcName}, ${D.JSL(params)}`, "makePad")
        const imgData = Media.GetImgData(imgRef);
        const imgObj = Media.GetImg(imgData.name);

        if (VAL({graphicObj: imgObj, list: imgData, string: funcName}, "makePad")) {
            let options = {
                _pageid: imgObj.get("_pageid"),
                left: imgData.left,
                top: imgData.top,
                width: imgData.width,
                height: imgData.height,
                name: `${imgData.name}_${funcName}_Pad`,
                layer: imgData.isActive ? "objects" : "walls",
                imgsrc: C.IMAGES.blank,
                isdrawing: true,
                controlledby: "all",
                showname: false
            };
            if (VAL({string: params}))
                _.each(params.split(/,\s*?(?=\S)/gu), (v) => {
                    const [key, value] = v.split(/\s*?(?=\S):\s*?(?=\S)/gu);
                    options[key] = value;
                });
            else if (VAL({list: params}))
                options = Object.assign(options, params);
            options.left += D.Int(options.deltaLeft);
            options.top += D.Int(options.deltaTop);
            options.width += D.Int(options.deltaWidth);
            options.height += D.Int(options.deltaHeight);
            const pad = createObj("graphic", _.omit(options, ["deltaLeft", "deltaTop", "deltaWidth", "deltaHeight"]));
            const partnerPad = createObj(
                "graphic",
                Object.assign(_.omit(options, ["deltaLeft", "deltaTop", "deltaWidth", "deltaHeight"]), {name: `${imgData.name}_${funcName}_PartnerPad`, layer: "walls"})
            );
            if (!Media.IMAGES[imgData.name]) {
                DB(`No registry entry found for ${D.JS(imgData)}`, "makePad");
            } else {
                Media.IMAGES[imgData.name].padID = pad.id;
                Media.IMAGES[imgData.name].partnerID = partnerPad.id;
            }
            const padData = {
                funcName,
                id: imgObj.id,
                name: pad.get("name"),
                left: pad.get("left"),
                top: pad.get("top"),
                height: pad.get("height"),
                width: pad.get("width"),
                deltaLeft: D.Int(options.deltaLeft),
                deltaTop: D.Int(options.deltaTop),
                deltaWidth: D.Int(options.deltaWidth),
                deltaHeight: D.Int(options.deltaHeight),
                partnerID: partnerPad.id,
                active: imgData.isActive ? "on" : "off"
            };
            PADREGISTRY[pad.id] = D.Clone(padData);
            PADREGISTRY[partnerPad.id] = Object.assign({}, padData, {partnerID: pad.id, active: "off"});
            GRAPHICREGISTRY[imgObj.id] = {
                id: pad.id,
                pad: PADREGISTRY[pad.id],
                partnerPad: PADREGISTRY[partnerPad.id]
            };
            toFront(partnerPad);
            toFront(pad);
        }
    };
    const removePad = (padRef) => {
        const pads = getPads(padRef);
        _.each(pads, (pad) => {
            const padData = PADREGISTRY[pad.id];
            if (VAL({list: padData})) {
                const imgKey = Media.GetImgKey(padData.id);
                if (VAL({string: imgKey}) && Media.IMAGES[imgKey].padID) {
                    delete Media.IMAGES[imgKey].padID;
                    delete Media.IMAGES[imgKey].partnerID;
                }
                if (GRAPHICREGISTRY[padData.id])
                    delete GRAPHICREGISTRY[padData.id];
                if (PADREGISTRY[padData.partnerID])
                    delete PADREGISTRY[padData.partnerID];
                delete PADREGISTRY[pad.id];
            }
            pad.remove();
        });
    };
    const clearAllPads = (funcName) => {
        const graphics = findObjs({
            _type: "graphic",
            imgsrc: IMAGES.blank
        });
        const pads = _.filter(graphics, (v) => v.get("name").includes(funcName));
        for (const pad of pads)
            removePad(pad.id);
    };
    const togglePad = (padRef, isActive, funcName = false) => {
        const padIDs = [];
        const imgObj = Media.GetImg(padRef);
        const dbStrings = [`PadRef: ${D.JS(padRef)} --> ${D.JS(imgObj ? imgObj.get("name") : "NO IMAGE")}`];
        if (VAL({graphicObj: imgObj}) && GRAPHICREGISTRY[imgObj.id])
            padIDs.push(GRAPHICREGISTRY[imgObj.id].id);
        else if (FUNCTIONS[padRef])
            padIDs.push(..._.filter(Object.keys(PADREGISTRY), (v) => PADREGISTRY[v].funcName === padRef));
        dbStrings.push(`... Found: ${D.JSL(_.map(padIDs, (v) => PADREGISTRY[v].name))}`);
        if (padIDs.length === 0)
            return VAL({string: funcName}) && THROW(`No pad found with ID: '${D.JSL(padRef)}'`, `${D.JSL(funcName)} > togglePad`);

        for (const pID of padIDs) {
            const [pad, partner] = [getObj("graphic", pID), getObj("graphic", PADREGISTRY[pID].partnerID)];
            dbStrings.push(`...PAD: ${pad ? pad.get("name") : "NONE"}<br>... PARTNER: ${partner ? partner.get("name") : "NONE"}<br>`);

            if (VAL({graphicObj: [pad, partner]}, undefined, true)) {
                pad.set({
                    layer: isActive && PADREGISTRY[pad.id].active === "on" ? "objects" : "walls"
                });
                dbStrings.push(
                    `... SETTING PAD to ${isActive && PADREGISTRY[pad.id].active === "on" ? "objects" : "walls"} --> ${pad.get("layer")}`
                );
                dbStrings.push(`... ... ${D.JSL(isActive)}, ${D.JSL(PADREGISTRY[pad.id].active)}`);
                partner.set({
                    layer: isActive && PADREGISTRY[partner.id].active === "on" ? "objects" : "walls"
                });
                dbStrings.push(
                    `... SETTING PARTNER to ${isActive && PADREGISTRY[partner.id].active === "on" ? "objects" : "walls"} --> ${partner.get(
                        "layer"
                    )}`
                );
                dbStrings.push(`... ... ${D.JSL(isActive)}, ${D.JSL(PADREGISTRY[partner.id].active)}`);
                if (isActive && PADREGISTRY[pad.id].active === "off" && PADREGISTRY[partner.id].active === "off") {
                    PADREGISTRY[pad.id].active = "on";
                    pad.set({layer: "objects"});
                }
                toFront(pad);
                toFront(partner);
            } else {
                dbStrings.push("... INVALID PAD/PARTNER.");
            }
            dbStrings.push("");
        }
        DB(dbStrings.join("<br>"), "togglePad");

        return true;
    };
    const syncPads = (imgRef) => {
        const imgData = Media.GetImgData(imgRef);
        if (VAL({list: imgData})) {
            const padPosData = {
                left: D.Int(imgData.left + PADREGISTRY[imgData.padID].deltaLeft),
                top: D.Int(imgData.top + PADREGISTRY[imgData.padID].deltaTop),
                width: D.Int(imgData.width + PADREGISTRY[imgData.padID].deltaWidth),
                height: D.Int(imgData.height + PADREGISTRY[imgData.padID].deltaHeight)
            };
            const pads = getPadPair(imgData.name);
            DB({pads, map: pads.map((x) => (x && "get" in x && x.get("name")) || (x && `??: ${D.JS(x)}`) || "NO OBJ")}, "syncPads");
            // DB({img: imgData.name, padPosData, padRegistrySTART: D.JSX(PADREGISTRY[imgData.padID]), graphicRegistrySTART: D.JSX(GRAPHICREGISTRY[imgData.id]), pads: D.JS(pads)}, "syncPads");
            STATE.REF.arePadsActive = false;
            Object.assign(PADREGISTRY[imgData.padID], padPosData);
            Object.assign(PADREGISTRY[imgData.partnerID], padPosData);
            Object.assign(GRAPHICREGISTRY[imgData.id].pad, padPosData);
            Object.assign(GRAPHICREGISTRY[imgData.id].partnerPad, padPosData);
            pads.forEach((x) => x.set(padPosData));
            setTimeout(() => {
                STATE.REF.arePadsActive = true;
                // DB({afterTimeout: STATE.REF.arePadsActive, padRegistry: D.JSX(PADREGISTRY[imgData.padID]), graphicRegistry: D.JSX(GRAPHICREGISTRY[imgData.id])}, "syncPads");
            }, 2000);
        }
    };
    // #endregion
    const fixPadRegistry = () => {
        for (const imgID of Object.keys(STATE.REF.byGraphic)) {
            const imgObj = getObj("graphic", imgID);
            const imgKey = Media.GetImgKey(imgObj);
            if (VAL({string: imgKey}, "DP INIT")) {
                Media.IMAGES[imgKey].padID = STATE.REF.byGraphic[imgID].id;
                Media.IMAGES[imgKey].partnerID = STATE.REF.byGraphic[imgID].pad.partnerID;
                STATE.REF.byGraphic[imgID].pad.name = STATE.REF.byGraphic[imgID].pad.name.replace(/(^\w*?)_Pad_\d*$/gu, `${imgKey}_$1_Pad`);
                STATE.REF.byGraphic[imgID].partnerPad.name = STATE.REF.byGraphic[imgID].partnerPad.name.replace(
                    /(^\w*?)_PartnerPad_\d*$/gu,
                    `${imgKey}_$1_PartnerPad`
                );
                STATE.REF.byPad[Media.IMAGES[imgKey].padID].name = STATE.REF.byGraphic[imgID].pad.name;
                STATE.REF.byPad[Media.IMAGES[imgKey].partnerID].name = STATE.REF.byGraphic[imgID].partnerPad.name;
            }
        }
    };
    const setPadDeltas = () => {
        for (const [padID, padData] of Object.entries(PADREGISTRY)) {
            const imgData = Media.GetImgData(padData.id);
            const deltaData = {
                deltaLeft: D.Int(padData.left - imgData.left),
                deltaTop: D.Int(padData.top - imgData.top),
                deltaWidth: D.Int(padData.width - imgData.width),
                deltaHeight: D.Int(padData.height - imgData.height)
            };
            Object.assign(PADREGISTRY[padID], deltaData);
            Object.assign(GRAPHICREGISTRY[padData.id].pad, deltaData);
            Object.assign(GRAPHICREGISTRY[padData.id].partnerPad, deltaData);
        }
    };

    return {
        CheckInstall: checkInstall,
        OnChatCall: onChatCall,
        OnGraphicChange: onGraphicChange,

        get PadsByGraphic() {
            return STATE.REF.byGraphic;
        },
        get PadsByID() {
            return STATE.REF.byPad;
        },

        MakePad: makePad,
        ClearAllPads: clearAllPads,
        GetGraphic: getGraphic,
        Toggle: togglePad,
        Sync: syncPads,
        DelPad: removePad
    };
})();

on("ready", () => {
    DragPads.CheckInstall();
    D.Log("DragPads Ready!");
});
void MarkStop("DragPads");
