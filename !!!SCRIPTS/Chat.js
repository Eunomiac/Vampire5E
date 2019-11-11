void MarkStart("Chat")
/* Chat.js, "Chat".  No exposure to other scripts in the API.
   >>> Chat is a library of commands that can be triggered from within roll20 chat.  You can view the properties
   of selected objects and the state variable; run text-sizing tests to be used in scripts like Roller;   is both a
   library of handy resources for other scripts to use, and a master configuration file for your game.  You can find
   a list of all of the available methods at the end of the script.  Configuration is a bit trickier, but is contained
   to the CONFIGURATION and DECLARATIONS #regions. Strictly a utility script: Doesn't set things or return information
   to other API objects — use DATA and SET for that. */

const Chat = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Chat",

    // #region COMMON INITIALIZATION
        STATEREF = C.ROOT[SCRIPTNAME],	// eslint-disable-line no-unused-vars
        VAL = (varList, funcName, isArray = false) => D.Validate(varList, funcName, SCRIPTNAME, isArray), // eslint-disable-line no-unused-vars
        DB = (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        LOG = (msg, funcName) => D.Log(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        THROW = (msg, funcName, errObj) => D.ThrowError(msg, funcName, SCRIPTNAME, errObj), // eslint-disable-line no-unused-vars

        checkInstall = () => {
            C.ROOT[SCRIPTNAME] = C.ROOT[SCRIPTNAME] || {}
        },
    // #endregion

    // #region EVENT HANDLERS: (HANDLEINPUT)
        onChatCall = (call, args, objects, msg) => { 	// eslint-disable-line no-unused-vars
            const params = {}
            let [obj, attrList] = [{}, {}],
                [objsToKill, returnVals, theseArgs] = [[], [], []],
                [objType, objID, pattern] = ["", "", ""]
            switch (call) {
                case "!get": {
                    switch (D.LCase(call = args.shift())) {
                        case "text": {
                            switch (D.LCase(call = args.shift())) {
                                case "check": {
                                    if (msg.selected && msg.selected.length) {
                                        [obj] = findObjs({
                                            _id: msg.selected[0]._id
                                        });
                                        ((font = obj.get("font_family").split(" "), size = obj.get("font_size")) => {
                                            D.Alert(`There are ${_.values(state.DATA.CHARWIDTH[font][size]).length} entries.`, `${D.JS(font).toUpperCase()} ${D.JS(size)}`)
                                        })()
                                    }
                                    break
                                }
                                // no default
                            }
                            break
                        }
                        default: {
                            if (D.GetSelected(msg))
                                [obj] = D.GetSelected(msg)
                            else
                                for (let i = 1; i < args.length; i++) {
                                    [obj] = findObjs({
                                        _id: args[i]
                                    })
                                    if (obj) {
                                        args.splice(i, 1)
                                        break
                                    }
                                }
                            switch (call) {
                                case "pages":
                                    if (!getPages())
                                        sendHelpMsg()
                                    break
                                case "data":
                                    if (!getSelected(obj, true))
                                        sendHelpMsg()
                                    break
                                case "id":
                                    D.Alert(obj.id)
                                    break
                                case "name":
                                    if (!getName(obj))
                                        sendHelpMsg()
                                    break
                                case "gm":
                                    D.Alert(`The player ID of the GM is ${D.GMID()}`, "!GET GM")
                                    break
                                case "img":
                                    if (!getImg(obj))
                                        sendHelpMsg()
                                    break
                                case "chars":
                                case "allchars":
                                    if (!getAllChars())
                                        sendHelpMsg()
                                    break
                                case "char": {
                                    if (!getChar(obj, args[0] !== "id"))
                                        sendHelpMsg()
                                    break
                                }
                                case "pos": case "position":
                                    if (!getPos(obj))
                                        sendHelpMsg()
                                    break
                                case "attrs":
                                    if (!getCharAttrs(args.shift() || obj))
                                        sendHelpMsg()
                                    break
                                case "attr":
                                    if (!getCharAttrs(obj, _.compact(args.join(" ").replace(/(\[|,)/gu, "").replace(/\s+/gu, "|").
                                        split("|"))))
                                        sendHelpMsg()
                                    break
                                case "prop":
                                case "property":
                                    if (!getProperty(obj, args.shift()))
                                        sendHelpMsg()
                                    break
                                case "state":
                                    if (!getStateData(args))
                                        sendHelpMsg()
                                    break
                                case "statekeys":
                                    if (!getStateData(args, true))
                                        sendHelpMsg()
                                    break
                                case "statevals": { // !get statevals name, id|VAMPIRE Media ...
                                    returnVals = args.join(" ").split("|")[0].replace(/\s+/gu, "").split(",")
                                    theseArgs = args.join(" ").split("|")[1].split(/\s+/gu)
                                    if (!getStateData(theseArgs, returnVals))
                                        sendHelpMsg()
                                    break
                                }
                                case "page":
                                    D.Alert(D.JS(Campaign().get("playerpageid")), "Page ID")
                                    break
                                default:
                                    sendHelpMsg()
                                    break
                            }
                            break
                        }
                        // no default
                    }
                    break
                }
                case "!set": {
                    switch (D.LCase(call = args.shift())) {
                        case "pos": case "position":
                            if (D.GetSelected(msg)) {
                                let [left, top] = [args.shift(), args.shift()]
                                left = D.Int(left) || null
                                top = D.Int(top) || null
                                for (const selObj of D.GetSelected(msg)) {
                                    if (left)
                                        selObj.set({left})
                                    if (top)
                                        selObj.set({top})
                                }
                            }
                            break
                        case "dim": case "dims": case "dimensions": {
                            if (D.GetSelected(msg)) {
                                const [width, height] = [args.shift(), args.shift()].map(x => D.Int(x) || null)
                                for (const selObj of D.GetSelected(msg)) {
                                    if (width)
                                        selObj.set({width})
                                    if (height)
                                        selObj.set({height})
                                }
                            }
                            break
                        }
                        case "params":
                            if (msg.selected && msg.selected[0])
                                for (const objData of msg.selected) {
                                    obj = getObj(objData._type, objData._id)
                                    if (obj) {
                                        attrList = args.join(" ").split(/|\s*/gu)
                                        _.each(attrList, v => {
                                            params[v.split(":")[0]] = D.Int(v.split(":")[1]) || v.split(":")[1]
                                        })
                                        obj.set(params)
                                    }
                                }

                            break
                        case "text": {
                            switch (args.shift().toLowerCase()) {
                                case "prep": {
                                    const font = VAL({number: args[0]}) ? ["Candal", "Contrail One", "Arial", "Patrick Hand", "Shadows Into Light"][D.Int(args.shift())] : args.shift(),
                                        sizes = _.map(args, v => D.Int(v)) || [12, 14, 16, 18, 20, 22, 26, 32, 40, 56, 72]                        
                                    prepText(font, sizes)
                                    break
                                }
                                case "res": case "resolve": {
                                    if (!msg.selected || !msg.selected[0])
                                        break
                                    resolveText(D.GetSelected(msg, "text"))
                                    break
                                } case "upper": {
                                    if (!msg.selected || !msg.selected[0])
                                        break
                                    caseText(msg.selected, "upper")
                                    break
                                } case "lower": {
                                    if (!msg.selected || !msg.selected[0])
                                        break
                                    caseText(msg.selected, "lower")
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
                case "!clear": {
                    switch (D.LCase(call = args.shift())) {
                        case "obj":
                            [objType, pattern] = [args.shift(), args.shift()]
                            objsToKill = _.filter(findObjs({
                                _pageid: Campaign().get("playerpageid"),
                                _type: objType
                            }), v => v && v.get("name").includes(pattern))
                            for (obj of objsToKill)
                                obj.remove()
                            break
                        case "state":
                            if (!clearStateData(args))
                                sendHelpMsg()
                            break
                        // no default
                    }
                    break
                }
                case "!find": {
                    switch (D.LCase(call = args.shift())) {
                        case "obj":
                        case "object":
                            [objType, objID] = [args.shift(), args.shift()]
                            if (!objType || !objID) {
                                sendHelpMsg()
                                break
                            }
                            D.Alert(D.JS(getObj(objType, objID)), "Object(s) Found")
                            break
                        case "text": {
                            D.Alert(`Found ${D.GetSelected(msg, "text").length} objects.`)
                            break
                        }
                        default:
                            sendHelpMsg()
                            break
                    }
                    break
                }
            // no default
            }
        },
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************
    // #region HELP MESSAGE	
        HELPMESSAGE = D.JSH(
            `<div style="display: block; margin-bottom: 10px;">
				Various commands to query information from the Roll20 tabletop and state variable. <b>If a command relies on a "selected token", make sure the token is associated with a character sheet (via the token's setting menu).</b>
			</div>
			<div style="display: block; margin-bottom: 10px;">
				<h3 style="font-variant: small-caps;">Commands</h3>
				<div style="padding-left:10px;">
					<h4 style="font-variant: small-caps;">!GET:</h4>
					<ul>
						<li style="margin-bottom: 4px; background-color: ${C.COLORS.fadedblack};">
							<span style="font-weight: bolder; font-family: serif;">
								!get data
							</span> - Gets a JSON stringified list of all the object's properties
						</li>
						<li style="margin-bottom: 4px; background-color: ${C.COLORS.fadedgrey};">
							<span style="font-weight: bolder; font-family: serif;">
								!get char
							</span> - Gets the name, character ID, and player ID represented by the selected token.
						</li>
						<li style="margin-bottom: 4px; background-color: ${C.COLORS.fadedblack};">
							<span style="font-weight: bolder; font-family: serif;">
								!get chars
							</span> - Gets the names and IDs of all character objects
						</li>
						<li style="margin-bottom: 4px; background-color: ${C.COLORS.fadedgrey};">
							<span style="font-weight: bolder; font-family: serif;">
								!get gm
							</span> - Gets the player ID of the GM.
						</li>
						<li style="margin-bottom: 4px; background-color: ${C.COLORS.fadedblack};">
							<span style="font-weight: bolder; font-family: serif;">
								!get img
							</span> - Gets the graphic ID and img source of the selected graphic.
						</li>
						<li style="margin-bottom: 4px; background-color: ${C.COLORS.fadedgrey};">
							<span style="font-weight: bolder; font-family: serif;">
								!get pos
							</span> - Gets the position and dimensions of the selected object, in both grid and pixel units.
						</li>
						<li style="margin-bottom: 4px; background-color: ${C.COLORS.fadedblack};">
							<span style="font-weight: bolder; font-family: serif;">
								!get attrs
							</span> - Gets all attribute objects attached to the selected character token.<br>
							<span style="font-weight: bolder; font-family: serif;">
								!get attr attr1 [attr2] [attr3]...
							</span> - Gets only the specified attributes attached to the selected character token.
						</li>
						<li style="margin-bottom: 4px; background-color: ${C.COLORS.fadedgrey};">
							<span style="font-weight: bolder; font-family: serif;">
								!get prop [&lt;id&gt;] &lt;property&gt;
							</span> - Gets the contents of the specified property on the selected object, or the object ID.
						</li>
						<li style="margin-bottom: 4px; background-color: ${C.COLORS.fadedblack};">
							<span style="font-weight: bolder; font-family: serif;">
								!get state [&lt;namespace&gt;]
							</span> - Gets a stringified list of all items in the given state namespace.  You can omit the first parameter; if you do, it is assumed to be "${C.GAMENAME}".
						</li>
						<li style="margin-bottom: 4px; background-color: ${C.COLORS.fadedgrey};">
							<span style="font-weight: bolder; font-family: serif;">
								!get page
							</span> - Gets the page ID the player tab is set to.
						</li>
						<li style="margin-bottom: 4px; background-color: ${C.COLORS.fadedblack};">
							<span style="font-weight: bolder; font-family: serif;">
								!get debug
							</span> - Gets the current debug settings.
						</li>
					</ul>
					<h4 style="font-variant: small-caps;">!SET:</h4>
					<ul>
						<li style="margin-bottom: 4px; background-color: ${C.COLORS.fadedblack};">
							<span style="font-weight: bolder; font-family: serif;">
								!set dblvl
							</span> - 
						</li>
						<li style="margin-bottom: 4px; background-color: ${C.COLORS.fadedgrey};">
							<span style="font-weight: bolder; font-family: serif;">
								!set dbfilter
							</span> - 
						</li>
						<li style="margin-bottom: 4px; background-color: ${C.COLORS.fadedblack};">
							<span style="font-weight: bolder; font-family: serif;">
								!set size height:#, width:#
							</span> - Sets the size of all selected objects to the given dimensions.
						</li>
					</ul>
					<h4 style="font-variant: small-caps;">!CLEAR:</h4>
					<ul>
						<li style="margin-bottom: 4px; background-color: ${C.COLORS.fadedblack};">
							<span style="font-weight: bolder; font-family: serif;">
								!clear dbfilter
							</span> - 
						</li>
						<li style="margin-bottom: 4px; background-color: ${C.COLORS.fadedgrey};">
							<span style="font-weight: bolder; font-family: serif;">
								!clear obj &lt;type&gt; &lt;pattern&gt;
							</span> - Removes all objects of the given type that contain &lt;pattern&gt; in the name.
						</li>
						<li style="margin-bottom: 4px; background-color: ${C.COLORS.fadedblack};">
							<span style="font-weight: bolder; font-family: serif;">
								!clear state [&lt;namespace&gt;]
							</span> - Clears the given state values.
						</li>
					</ul>
					<h4 style="font-variant: small-caps;">!TEXT:</h4>
					<ul>
						<li style="margin-bottom: 4px; background-color: ${C.COLORS.fadedblack};">
							<span style="font-weight: bolder; font-family: serif;">
								!set text prep &lt;character&gt;
							</span> - Sets all selected text strings to 20 copies of the given character.  (Use with !set text resolve to get the necessary information for measuring text widths.)
						</li>
						<li style="margin-bottom: 4px; background-color: ${C.COLORS.fadedgrey};">
							<span style="font-weight: bolder; font-family: serif;">
								!set text resolve
							</span> - Measures the width of selected text strings (prepared with !set text prep).
						</li>
						<li style="margin-bottom: 4px; background-color: ${C.COLORS.fadedblack};">
							<span style="font-weight: bolder; font-family: serif;">
								!get text check
							</span> - Checks recorded width data for text in the selected formats.
						</li>
						<li style="margin-bottom: 4px; background-color: ${C.COLORS.fadedgrey};">
							<span style="font-weight: bolder; font-family: serif;">
								!set text upper/lower
							</span> - Changes the case of selected text object(s).
						</li>
					</ul>
				</div>
			</div>`
        ),
        sendHelpMsg = () => D.Alert(HELPMESSAGE, "HELP: Chat Functions"),
    // #endregion

    // #region Get Data Functions
        getPages = () => {
            const pageObjs = findObjs({_type: "page"}),
                msgLines = []
            for (const pageObj of pageObjs)
                msgLines.push(`Page '${pageObj.get("name")}' = '${pageObj.id}'`)
            D.Alert(msgLines.join("<br>"), "getPages")
            return true
        },
        getSelected = (obj, isGettingAll) => {
            if (!VAL({object: obj}))
                return false
            D.Alert(isGettingAll ? D.JS(obj, true) : obj.id)

            return true
        },
        getImg = obj => {
            if (!VAL({graphicObj: obj}))
                return false
            D.Alert(`<b>ID:</b> ${obj.id}<br/><b>SRC:</b> ${obj.get("imgsrc").replace("max", "thumb")}`, "Image Data")

            return true
        },
        getAllChars = () => {
            const allCharObjs = findObjs({
                    _type: "character"
                }),
                allCharIDs = allCharObjs.map(v => ({
                    name: v.get("name"),
                    id: v.id
                })),
                sortedAttrs = _.sortBy(allCharIDs, "id"),
                attrsLines = []
            _.each(sortedAttrs, attrInfo => {
                attrsLines.push(`${attrInfo.id}: ${attrInfo.name}`)
            })
            D.Alert(attrsLines.join("<br/>"), "All Characters")

            return true
        },
        getChar = (obj, isGettingAll = false) => {
            if (!VAL({token: obj}))
                return false
            try {
                const charObj = getObj("character", obj.get("represents")),
                    name = charObj.get("name"),
                    playerID = charObj.get("controlledby").replace("all,", "")
                if (isGettingAll)
                    D.Alert(D.JS(charObj, true), "Character Data")
                else
                    D.Alert(`<b>Name:</b> ${name}<br/><b>CharID:</b> ${charObj.id}<br/><b>PlayerID:</b> ${playerID}`, "Character Data")
            } catch (errObj) {
                return THROW("", "getChar", errObj)
            }

            return true
        },
        getName = obj => {
            if (!VAL({object: obj}))
                return false
            D.Alert(`<b>Name:</b> ${D.JS(obj.get("name"))}`, "Object Name")
            return true
        },
        getCharAttrs = (obj, filter = []) => {
            if (!obj)
                return false
            let sortedAttrs = []
            const allAttrObjs = _.uniq(findObjs({
                    _type: "attribute",
                    _characterid: typeof obj === "string" ? obj : obj.get("represents")
                })),
                allAttrs = allAttrObjs.map(v => ({
                    name: v.get("name").replace(/^repeating_/gu, "@@@").replace(/@@@([^_]+)_[^_]{15}([^_]{4})[^_]+_(.*)/gu, "®$1_$2_$3"),
                    current: v.get("current"),
                    id: v.id
                })),
                attrsLines = []
            if (filter.length)
                sortedAttrs = _.sortBy(_.pick(_.uniq(allAttrs), v => filter.includes(v.name)), "name")
            else
                sortedAttrs = _.sortBy(_.uniq(allAttrs), "name")
            _.each(sortedAttrs, attrInfo => {
                attrsLines.push(`${attrInfo.name} (${attrInfo.id.slice(10, 14)}): ${attrInfo.current}`)
            })
            D.Alert(`${attrsLines.join("<br/>")}<br/><br/>Num Objs: ${allAttrObjs.length}, Attrs: ${allAttrs.length}, Sorted: ${sortedAttrs.length}, Lines: ${attrsLines.length}`, `Attributes For ${D.GetName(obj)}`)

            return true
        },
        getPos = obj => {
            if (!obj)
                return false
            const gridInfo = `<b>Center:</b> ${obj.get("left") / D.CELLSIZE}, ${obj.get("top") / D.CELLSIZE
                }<br/> <b>Left:</b> ${(obj.get("left") - 0.5 * obj.get("width")) / D.CELLSIZE
                }<br/> <b>Top:</b> ${(obj.get("top") - 0.5 * obj.get("height")) / D.CELLSIZE
                }<br/> <b>Dimensions:</b> ${obj.get("width") / D.CELLSIZE} x ${obj.get("height") / D.CELLSIZE}`,
                pixelInfo = ` Center (Base Left, Top):</b> ${obj.get("left")}, ${obj.get("top")
                }<br/> <b>Left Edge:</b> ${obj.get("left") - 0.5 * obj.get("width")
                }<br/> <b>Top Edge:</b> ${obj.get("top") - 0.5 * obj.get("height")
                }<br/> <b>Dimensions (Width x Height):</b> ${obj.get("width")} x ${obj.get("height")}`
            D.Alert(`<b><u>GRID</u>:</b><br/>${gridInfo}<br/><b><u>PIXELS</u>:</b><br/>${pixelInfo}`, "Position Data")

            return true
        },
        getProperty = (obj, property) => {
            if (!property || !obj)
                return false
            const propString = obj.get(property, function tellInfo(v) {
                D.Alert(v, `${obj.get("_type").toUpperCase()} '${obj.get("name")}' - ${property}`)

                return v
            })
            if (propString)
                D.Alert(D.JS(propString), `${obj.get("_type").toUpperCase()} '${obj.get("name")}' - ${property}`)

            return true
        },
        getStateData = (namespace, returnVals) => {
            let [stateInfo, isVerbose] = [state, false]
            // if (namespace[0] !== C.GAMENAME)
              //  namespace.unshift(C.GAMENAME)
            if (namespace[0] === "full") {
                isVerbose = true
                namespace.shift()
            }
            const title = `state.${namespace.join(".")}`
            // eslint-disable-next-line no-unmodified-loop-condition
            while (namespace && namespace.length)
                stateInfo = stateInfo[namespace.shift()]
            if (returnVals) {
                const returnInfo = {}
                _.each(stateInfo, (data, key) => {
                    const returnData = {}
                    _.each(_.isString(returnVals) ? returnVals.split(",") : returnVals, val => {
                        returnData[val] = data[val]
                    })
                    returnInfo[key] = _.clone(returnData)
                })
                D.Alert(D.JS(returnInfo, isVerbose), title)
            } else { D.Alert(D.JS(stateInfo, isVerbose), title) }

            return true
        },
        clearStateData = namespace => {
            let stateInfo = state
            if (namespace[0] !== C.GAMENAME)
                namespace.unshift(C.GAMENAME)
            const title = `Clearing state.${namespace.join(".")}`
            // eslint-disable-next-line no-unmodified-loop-condition
            while (namespace && namespace.length > 1)
                stateInfo = stateInfo[namespace.shift()]

            D.Alert(`DELETED ${namespace[0]} of ${D.JS(stateInfo)}`, title)
            delete stateInfo[namespace.shift()]
            // stateInfo = ""

            return true
        },
    // #endregion

    // #region Text Length Testing
        prepText = (font, sizes) => {
            const [textObjs, newTextObjs] = [
                findObjs({_pageid: C.TEXTPAGEID, _type: "text"}),
                {}
            ]
            let [left, top] = [300, 100]
            for (const obj of textObjs)
                obj.remove()
            newTextObjs[font] = {}
            for (const size of sizes) {
                newTextObjs[font][size] = []
                for (const char of C.TEXTCHARS.split("")) {
                    newTextObjs[font][size].push(createObj("text", {
                        _pageid: C.TEXTPAGEID,
                        top,
                        left,
                        text: char.repeat(40),
                        font_size: size,
                        font_family: font,
                        color: "rgb(255,255,255)",
                        layer: "objects"
                    }))
                    top += 25
                    if (top > 3400) {
                        left += 100
                        top = 100
                    }
                }
            }
            D.Alert(`Created ${C.TEXTCHARS.split("").length} x ${sizes.length} = ${C.TEXTCHARS.split("").length * sizes.length} text objects.<br><br>Move the text object(s) around, and type '!set text res' while all are selected when you have.`)
        },
        resolveText = objs => {
            let font, trueFont
            for (const obj of objs) {
                const width = obj.get("width"),
                    height = obj.get("height"),
                    char = obj.get("text").charAt(0),
                    size = obj.get("font_size")
                trueFont = obj.get("font_family");
                [font] = trueFont.split(" ")
                D.CHARWIDTH[font] = D.CHARWIDTH[font] || {}
                D.CHARWIDTH[font][size] = D.CHARWIDTH[font][size] || {}
                D.CHARWIDTH[font][size][char] = D.Int(width * 100 / 40) / 100
                D.CHARWIDTH[font][size].lineHeight = D.Int(height * 10) / 10
            }
            if (trueFont !== font)
                D.CHARWIDTH[trueFont] = D.CHARWIDTH[font]
            const charCount = {}
            for (const fontName of _.keys(D.CHARWIDTH)) {
                charCount[fontName] = {}
                for (const fontSize of _.keys(D.CHARWIDTH[fontName])) {
                    charCount[fontName][fontSize] = `${_.keys(D.CHARWIDTH[fontName][fontSize]).length}: `
                    const colorList = ["red", "blue", "green", "purple"]
                    for (const char of ["M", "t", " ", "0"])
                        charCount[fontName][fontSize] += `<span style="color: ${C.COLORS[colorList.pop()]};"><b>${char}</b>: ${D.Int(D.CHARWIDTH[fontName][fontSize][char] * 100)/100}</span>, `
                    charCount[fontName][fontSize] = `${charCount[fontName][fontSize].slice(0, -2) }<br><b>Line Height: ${D.CHARWIDTH[fontName][fontSize].lineHeight}</b>`
                }
            }
            D.Alert(D.JS(charCount), "CHARACTER WIDTH TALLY")
        },
        caseText = (objs, textCase) => {
            objs.forEach(obj => {
                obj.set("text", textCase === "upper" ? obj.get("text").toUpperCase() : obj.get("text").toLowerCase())
            })
        }
    // #endregion

    return {
        CheckInstall: checkInstall,
        OnChatCall: onChatCall
    }
})()

on("ready", () => {
    Chat.CheckInstall()
    D.Log("Chat Ready!")
})
void MarkStop("Chat")