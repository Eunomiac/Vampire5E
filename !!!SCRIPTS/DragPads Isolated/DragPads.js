const DragPads = (() => {
    // #region **** CUSTOM FUNCTION DEFINITIONS ****

    /* A dragpad can be configured to trigger a custom function by choosing "Custom Function" when prompted
        during setup, then giving that function a name. When the dragpad is triggered, the specified function
        (defined here) will be called with the parameters (playerID, graphicID, startPos, endPos), where...
            playerID = The ID of the player who triggered the dragpad.
            graphicID = The ID of the graphic object assigned to the dragpad, if any. (You will have the option
                        of assigning a graphic object to the dragpad during setup.)
            startPos = An OBJECT with properties 'left' and 'top', describing the start position of the dragpad.
            endPos = An OBJECT with properties 'left' and 'top', describing the end position of the dragpad.
       
       Several utility functions exist to convert these parameters into values that may be more helpful to the
        custom functionality you desire (e.g. retrieving character and graphic objects, common derivations from
        the startPos and endPos data); see #region UTILITY FUNCTIONS.
       
       An example custom function is provided, showing how each parameter may be used. */

    const sampleFuncMoveImage = (playerID, graphicID, startPos, endPos) => {
        /* Using several UTILITY FUNCTIONS, this function will move the graphic object associated with
         the dragpad a distance equal to how far the dragpad itself was moved, in one of four cardinal
         directions (i.e. 'up', 'left', 'right' or 'down'), depending on the direction dragged */
        const charObj = getCharObj(playerID),
            graphicObj = getGraphicObj(graphicID),
            direction = getCardinalDirection(startPos, endPos),
            distance = getDistance(startPos, endPos),
            graphicPos = {
                left: graphicObj.get("left"),
                top: graphicObj.get("top")
            };
        if (charObj) { // Confirm the player who moved the dragpad is a genuine player, with control of a character.
            switch (direction) { // Adjust the position of the graphic object based on the direction moved.
                case "up": graphicPos.top -= distance; break;
                case "down": graphicPos.top += distance; break;
                case "left": graphicPos.left -= distance; break;
                case "right": graphicPos.left += distance; break;
                // no default
            }
            graphicObj.set(graphicPos); // Assign the new position to the graphic object.
        }
    }       
    // #endregion

    // #region INITIALIZATION
    const checkInstall = () => {},
        registerHandlers = () => {
            on("chat:message", msg => {
                if (!(msg.content.startsWith("!dpad") && (playerIsGM(msg.playerid) || msg.playerid === "API")))
                    return false
                let [call, ...args] = msg.content.split(/\s/gu).slice(1)
                const selectedPads = msg.selected.filter(x => isDragPad(x))
                try {
                    switch ((call || "").toLowerCase()) {
                    case "create": createDragPad(args); break;
                    case "toggle": {
                        [call, ...args] = args.map((x, i) => i === 0 ? [{on: true, off: false}[x], x].filter(xx => ["boolean", "string"].includes(typeof xx)).sort((a,b) => [true, false].includes(a) && 10, 1) : [undefined, x])
                        toggleDragpads(call, args)
                        break;
                    }
                    break;
                    throw `Must reference dragPad by function name OR select dragpad to toggle.`
                }
                } catch (err) {
                    alertGM("Error Toggling Dragpad: You must name the DragPad by its associated function OR select it before attempting to toggle it.")
                    break
                }
                    case "show": showDragPads(args); break;
                    case "hide": hideDragPads(args); break;
                    
                    
                    {
                        switch((call || "").toLowerCase()) {
                            case "all": showDragPads
                        }
                    }
                            
                            
                            toggle args.push("TOGGLING ON!"); break;
                            case "off": args.push("TOGGLING OFF!"); break;
                            default: {
                                if (args.length) {
                                    args.push("TOGGLING!"); break;
                                } else {
                                    args.push("ERROR: NO PAD SPECIFIED"); break;
                                }
                                break;
                            }
                        }
                        break;
                    }
                    default: {
                        args.push("ERROR: SYNTAX PROBLEM, MISSING CALL"); break;
                    }
                    } 




                switch ((call || "").toLowerCase()) {
                    case "create": createDragPad(msg); break;
                    case "toggle": {
                        [call, ...args] = [["on", "off"].includes(args[0]) ? args.shift() : null, ...args]

                        const padRef = args.filter() [["on", "off"].includes(call) ? "" : call, ...args]
                        [call, ...args] = args.map(x => x.toLowerCase())
                        const padRef = {on: true, off: false}[call], ...args].join(" ")
                        switch (call) {
                            case "on": toggleDragPad(padRef, true); break;
                            case "off": toggleDragPad(padRef, false); break;
                            default: toggleDragPad(`${call} ${padRef}`)
                        }
                        switch ((call = args.shift() || "").toLowerCase()) {
                            case "on": call = true; 
                            case "off": call = call === true ? true : false;
                            default: {
                                if (typeof call === "boolean")
                                    toggleDragPad(args.join(" "), call)
                                else
                                    toggleDragPad(call)
                            }
                        }
                    } 

                    case "find": {
                        const funcName = args.shift(),
                            padData = _.filter(_.values(PADREGISTRY), v => v.funcName === funcName),
                            padObjs = _.map(padData, v => getObj("graphic", v.partnerID)),
                            padLayer = _.map(padObjs, v => `${v.get("name")}: ${v.get("layer")}`)
                        D.Alert(`Pad Data:<br><br>${D.JS(padLayer)}`, "!dpad find")
                        break     
                    }               
                    case "make": { // !dpad <funcName> <imgKey OR select img> [top:100 left:100 height:100 width:100 deltaHeight:-50 deltaWidth:-50 deltaTop:-50 deltaLeft:-50 startActive:true]
                        const funcName = args.shift(),
                            hostObj = D.GetSelected(msg) && D.GetSelected(msg)[0] || Media.GetImg(args.shift())
                        if (VAL({graphicObj: hostObj}, "!dpad make")) {
                            D.Alert(`Host Object Retrieved: ${D.JS(hostObj.get("name"))}<br>Making Drag Pads...`, "!dpad make")
                            makePad(hostObj, funcName, args.join(", ")) // deltaHeight:-28 width:-42 left:0 top:0
                        }
                        break
                    }
                    case "on": case "off": {
                        togglePad(args.shift(), call === "on")
                        break
                    }
                    case "show": {
                        const padFilter = args.shift().toLowerCase()
                        _.each(PADREGISTRY, (v, padID) => {
                            const padObj = getObj("graphic", padID)
                            if (padFilter === "all" || padObj && D.LCase(padObj.get("name")).includes(padFilter)) {                            
                                padObj.set("imgsrc", "https://s3.amazonaws.com/files.d20.io/images/64184544/CnzRwB8CwKGg-0jfjCkT6w/thumb.png?1538736404")
                                padObj.set("layer", "gmlayer")
                            }
                        })
                        break
                    }
                    case "hide": {
                        _.each(PADREGISTRY, (v, padID) => {
                            const padObj = getObj("graphic", padID)
                            if (padObj) {
                                padObj.set("imgsrc", IMAGES.blank)
                                if (v.active === "on" &&
                                    (Media.GetImgData(v.name).startActive === true || Media.GetImgData(PADREGISTRY[v.partnerID].name).startActive === true))
                                    padObj.set("layer", "objects")
                            }
                        })
                        break
                    }
                    case "kill": {
                        const funcName = args.shift(),
                            imgKeys = []
                        for (const padID of Object.keys(PADREGISTRY))
                            if (funcName === "allpads" || PADREGISTRY[padID].funcName === funcName) {
                                const padObj = getObj("graphic", padID)
                                imgKeys.push(PADREGISTRY[padID].name)
                                if (padObj)
                                    padObj.remove()
                                delete GRAPHICREGISTRY[PADREGISTRY[padID].id]
                                delete PADREGISTRY[padID]
                            }
                        for (const imgKey of imgKeys)
                            Media.RemoveImg(imgKey)
                        break
                    }
                    case "reset": {
                        const [padObjs, padNames, padData, graphicList, reportStrings] = [[], [], [], [], []]
                        switch (D.LCase(call = args.shift())) {
                            case "confirm": {
                                STATE.REF.byPad = {}
                                STATE.REF.byGraphic = {}
                                _.each(_.flatten(padObjs), pad => {
                                    if (Media.IsRegistered(pad))
                                        Media.RemoveImg(pad, true)
                                    pad.remove()
                                })
                                _.each(graphicList, padName => {
                                    Media.RemoveImg(padName, true)
                                })
                                _.each(padData, data => {
                                    const hostObj = getObj("graphic", data.hostID) || getObj("text", data.hostID)
                                    makePad(hostObj, data.funcName, data.options)
                                })
                                D.Alert([
                                    "<h3>Current Image Registry</h3>",
                                    ...Object.keys(Media.IMAGES)
                                ].join("<br>"), "!dpad reset confirm")
                                break
                            }
                            default: {
                                for (const [hostID, data] of Object.entries(GRAPHICREGISTRY)) {
                                    const hostObj = getObj("graphic", hostID) || getObj("text", hostID),
                                        padObjPair = [getObj("graphic", data.id), getObj("graphic", data.pad.partnerID)]
                                    padObjs.push([padObjPair[0] || null, padObjPair[1] || null, data.pad.funcName])
                                    padNames.push([`${data.pad.name}${padObjPair[0] && "" || " -> MISSING!"}`, `${data.partnerPad.name}${padObjPair[1] && "" || " -> MISSING!"}`])
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
                                        })
                                    else
                                        reportStrings.push(`'${Media.GetImgKey(hostID) || "&lt;UNREGISTERED&gt;"}' (${hostID}) for <b>${D.JSL(data.pad.name)}</b>`)
                                }
                                if (reportStrings.length)
                                    reportStrings.unshift("<h3>Missing Graphic Objects</h3>")
                                reportStrings.unshift(...[
                                    "<h3>Initial Image Registry</h3>",
                                    ...Object.keys(GRAPHICREGISTRY).map(x => Media.GetImgKey(x) || Media.GetTextKey(x) || `MISSING: ${GRAPHICREGISTRY[x].pad.name}`)
                                ])
                                reportStrings.push(`<h3>${padObjs.length} Pad Objects Found</h3>`)
                                reportStrings.push(...padObjs.map(x => `${
                                    x[0] && PADREGISTRY[x[0].id] && PADREGISTRY[x[0].id].name || 
                                        VAL({object: x[0]}) && `(${x[0].get("name")})` ||
                                        `(${D.JS(x[2])})`
                                }${
                                    x[0] ? "" : ` <b>&lt;NO PAD</b> (${D.JS(x[0])})<b>&gt;</b>`
                                }${
                                    x[1] ? "" : ` --> <b>&lt;NO PARTNER</b> (${D.JS(x[1])})<b>&gt;</b>`
                                }`))
                                _.each(Media.IMAGES, (imgData, imgName) => {
                                    if (imgName.includes("Pad_") && !_.any(_.flatten(padNames), x => x.includes(imgName)))
                                        graphicList.push(imgName)
                                })
                                if (graphicList.length)
                                    reportStrings.push(...[
                                        `<h3>${graphicList.length} Unconnected Pad Objects</h3>`,
                                        ...graphicList
                                    ])
                                reportStrings.push("<b>!dpad reset confirm</b> to prune registries.")
                                D.Alert(reportStrings.join("<br>"), "!dpad reset")
                                break
                            }
                        }
                        break                    
                    }
                    case "list": {
                        const padNames = []
                        _.each(GRAPHICREGISTRY, v => {
                            padNames.push(v.pad.name)
                        })
                        D.Alert([
                            "<h3>Registered Drag Pads</h3>",
                            ...padNames
                        ].join("<br>"))
                        break
                    }
                // no default
                }


                                if (msg.type === "api") {
                    const scriptData = SCRIPTCALLS.MESSAGE[call]
                    msg.who = msg.who || "API"
                    if (scriptData && scriptData.script && VAL({function: scriptData.script.OnChatCall}) && (!scriptData.gmOnly || playerIsGM(msg.playerid) || msg.playerid === "API") ) {
                        const [objects, returnArgs] = parseMessage(args, msg, SCRIPTCALLS.MESSAGE[call].needsObjects !== false)
                        DB({call, args, objects, returnArgs}, "regHandlers")
                        call = scriptData.singleCall && returnArgs.shift() || call
                        if (D.WatchList.includes("Listen"))
                            D.Poke([
                                `<b>${msg.content}</b>`,
                                `CALL: ${call}`,
                                `ARGS: ${returnArgs.join(" ")}`,
                                `OBJECTS: ${D.JS(objects)}`
                            ].join("<br>"), "LISTENER RESULTS")
                        scriptData.script.OnChatCall(call, returnArgs, objects, msg)
                    }
                }
                return true
            })
        }
    // #endregion

    // #region CHAT MESSAGES & CHAT CONTROL BUTTONS

    // #endregion

    // #region DRAGPAD CREATION & BASIC BEHAVIOUR

    // #endregion



    // #region UTILITY FUNCTIONS
    Several utility functions exist to convert
    this ID into other, potentially more-useful objects:
     - getCharObjs(playerID) --> Returns an ARRAY of characters controlled by that player.
         - 'getCharObj(playerID)' will return a SINGLE character object directly: this is more
           convenient to use, but assumes that player controls only ONE character
     - getTokenObjs(playerID) --> Returns an ARRAY of all token objects in the Sandbox that
       represent a character controlled by that player.
         - Can send a character ID or a character object instead, in which case the ARRAY will
           contain only those tokens representing the specified character.
    
           - getGraphicObj(graphicID) --> Returns the graphic OBJECT itself.
    // #region 
})

on("chat:message", msg => {

})
on("change:graphic", (imgObj, prevData) => {

})