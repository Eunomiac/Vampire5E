void MarkStart("DATA")
/* DATA.js, "DATA".  Exposed as "D" in the API sandbox.
   >>> DATA is both a library of handy resources for other scripts to use, and a master configuration file for your
   game.  You can find a list of all of the available methods at the end of the script.  Configuration is a bit
   trickier, but is contained in the CONFIGURATION and DECLARATIONS #regions. */

const D = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "DATA",
        CHATCOMMAND = "!data",
        GMONLY = true

    // #region COMMON INITIALIZATION
    const STATEREF = C.ROOT[SCRIPTNAME]	// eslint-disable-line no-unused-vars
    const VAL = (varList, funcName) => D.Validate(varList, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        DB = (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        LOG = (msg, funcName) => D.Log(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        THROW = (msg, funcName, errObj) => D.ThrowError(msg, funcName, SCRIPTNAME, errObj) // eslint-disable-line no-unused-vars

    const checkInstall = () => {
            C.ROOT[SCRIPTNAME] = C.ROOT[SCRIPTNAME] || {}
            initialize()
        },
        regHandlers = () => {
            on("chat:message", msg => {
                const args = msg.content.split(/\s+/u)
                if (msg.type === "api" && (!GMONLY || playerIsGM(msg.playerid)) && (!CHATCOMMAND || args.shift() === CHATCOMMAND)) {
                    const who = msg.who || "API",
                        call = args.shift()
                    handleInput(msg, who, call, args)
                }
            })
        }
    // #endregion

    // #region LOCAL INITIALIZATION
    const initialize = () => {
        STATEREF.WATCHLIST = STATEREF.WATCHLIST || []
        STATEREF.CHARWIDTH = STATEREF.CHARWIDTH || {}
        STATEREF.DEBUGLOG = STATEREF.DEBUGLOG || []
    }
    const TRACE = []
    let isTraceOnly = false
    // #endregion	

    // #region EVENT HANDLERS: (HANDLEINPUT)
    const handleInput = (msg, who, call, args) => { 	// eslint-disable-line no-unused-vars
        TRACE.push("handleInput")
        DB(`MESSAGE (DATA): ${jStr(msg)}<br><br>handleInput(msg, ${jStr(who)}, ${jStr(call)}, ${jStr(args.join(", "))})`, "DATAinput")
        switch (call) {
            case "debug": case "log": case "dblog":
                getDebugRecord()
                break
            case "rep": { // !get rep section rowRef
                const attrName = args.shift(),
                    rowRef = {section: "advantage", [attrName]: 2}
                D.Alert(`${jStr(getRepAttr(msg, rowRef, attrName))}`, "Testing GetRepAttr")
                break
            }
            case "char": {
                D.Alert(`${jStr(getChars(msg, true))}`, "Testing GetChars")
                break
            }
            case "toggle": {
                switch (args.shift().toLowerCase()) {
                    case "traceonly":
                        isTraceOnly = !isTraceOnly
                        D.Alert(`Trace Only Set to ${jStr(isTraceOnly)}`, "!data toggle traceonly")
                        break
                    // no default
                }
                break
            }
            // no default
        }
        removeFirst(TRACE, "handleInput")
    }
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    // DEPRECATED FUNCTIONS 

    const logEntry = (msg, title = "") => log(`[${jStrL(title)}]: ${jStrL(msg)}`),
        formatDebug = (msg, title) => {
            logEntry(msg, title)
            sendToGM(msg, title)
        }

    // #region DECLARATIONS: Reference Variables
    const VALS = {
        PAGEID: () => Campaign().get("playerpageid"),
        CELLSIZE: () => C.PIXELSPERSQUARE * getObj("page", Campaign().get("playerpageid")).get("snapping_increment")
    }
    // #endregion

    // #region DECLARATIONS: Dependent Variables
    const ALLSTATS = [
        ..._.flatten(_.values(C.ATTRIBUTES)),
        ..._.flatten(_.values(C.SKILLS)),
        ...C.DISCIPLINES,
        ...C.TRACKERS
    ]
    // #endregion

    // #region PARSING & STRING MANIPULATION: Converting data types to strings, formatting strings, converting strings into objects.
    const jStr = (data, isShortForm = false) => {
        /* Parses a value of any type via JSON.stringify, and then further styles it for display either
          in Roll20 chat, in the API console log, or both. */
            try {
                let returnObj
                if (_.isUndefined(data))
                    return _.escape("<UNDEFINED>")
                if (data && isShortForm)
                    if (VAL({ object: data }))
                        returnObj = `${data.get("_type") || "object"}: ${data.get("name") || data.id || jStr(data)}`
                    else
                        returnObj = data.name ? { name: data.name } : data.id ? { id: data.id } : data
                else
                    returnObj = data

                const replacer = (k, v) => typeof v === "string" ? v.replace(/\\/gu, "") : v

                return JSON.stringify(returnObj, replacer, 2).
                    replace(/(\s*?)"([^"]*?)"\s*?:/gu, "$1$2:"). // Removes quotes from keys of a list or object.
                    replace(/\\n/gu, "<br/>"). // Converts line break code into '<br/>'
                    replace(/\\t/gu, ""). // Strips tab code
                    replace(/ (?= )/gu, "&nbsp;"). // Replaces any length of whitespace with one '&nbsp;'
                    replace(/\\"/gu, "\""). // Escapes quote marks
                    replace(/(^"|"$)/gu, "") // Removes quote marks from the beginning and end of the string
            } catch (errObj) {
                return THROW("", "jStr", errObj)
            }
        },
        jStrH = (data, isShortForm = false) => {
            /* Parses data as above, but removes raw line breaks instead of converting them to <br>.
                Line breaks must be specified in the code with '<br>' to be parsed as such.  */
            if (_.isUndefined(data))
                return _.escape("<UNDEFINED>")
            if (VAL({ string: data }))
                data = data.replace(/\n/gu, "")

            return jStr(VAL({ string: data }) ? data.replace(/<br\/?>/gu, "<br>") : data, isShortForm).
                replace(/<br\/>/gu, "").
                replace(/<br>/gu, "<br/>")
        },
        jStrL = (data, isShortForm = false) => {
            /* Parses data in a way that is appropriate to the console log, removing line breaks and redundant characters. */
            if (_.isUndefined(data))
                return "<UNDEFINED>"

            return jStr(data, isShortForm).
                replace(/<br\/>/gu, ""). // Removes all line breaks
                replace(/(&nbsp;)+/gu, " "). // Converts &nbsp; back to whitespace
                replace(/\\"\\"/gu, "'"). // Converts escaped double-quotes to single-quotes
                replace(/"/gu, "") // Removes all remaining double-quotes
        },
        jStrC = (data, isShortForm = false) => {
			/* Parses data to show all HTML code raw, rather than parsing it for formatting.
				Can override this for specific tags by double-bracketing them (e.g. "<<b>>") */
            if (_.isUndefined(data))
                return _.escape("<UNDEFINED>")

            return _.escape(jStr(data, isShortForm)).
                replace(/&gt;&gt;/gu, ">"). // Restores doubled right brackets to code.
                replace(/&lt;&lt;/gu, "<") // Restores doubled left brackets to code.
        },
        numToText = (num, isTitleCase = false) => {
            const numString = `${jStr(num)}`,
                parseThreeDigits = v => {
                    let result = "",
                        digits = _.map(v.toString().split(""), v => parseInt(v))
                    if (digits.length === 3) {
                        let hundreds = digits.shift()
                        result += hundreds > 0 ? C.NUMBERWORDS.low[hundreds] + " hundred" : ""
                        if (digits[0] + digits[1] > 0)
                            result += " and "
                        else
                            return result.toLowerCase()
                    }
                    if (parseInt(digits.join("")) <= C.NUMBERWORDS.low.length)
                        result += C.NUMBERWORDS.low[parseInt(digits.join(""))]
                    else
                        result += C.NUMBERWORDS.tens[parseInt(digits.shift())] + (parseInt(digits[0]) > 0 ? "-" + C.NUMBERWORDS.low[parseInt(digits[0])] : "")
                    return result.toLowerCase()
                },
                isNegative = numString.charAt(0) === "-",
                [integers, decimals] = numString.replace(/[,|\s|-]/gu, "").split("."),
                intArray = _.map(integers.split("").reverse().join("").match(/.{1,3}/g), v => v.split("").reverse().join("")).reverse(),
                stringArray = []
            while (intArray.length > 0)
                stringArray.push(`${parseThreeDigits(intArray.shift())} ${C.NUMBERWORDS.tiers[intArray.length]}`.toLowerCase().trim())
            return capitalize((isNegative ? "negative " : "") + stringArray.join(", "), isTitleCase)
        },
        ordinal = (num, isFullText = false) => {
            /* Converts any number by adding its appropriate ordinal ("2nd", "3rd", etc.) */
            if (isFullText) {
                let [numText, suffix] = numToText(num).match(/.*?[-|\s](\w*?)$/u)
                return numText.replace(new RegExp(suffix + "$", "u"), "") + C.ORDINALSUFFIX[suffix] || suffix + "th"
            }
            const tNum = parseInt(num) - 100 * Math.floor(parseInt(num) / 100)
            if ([11, 12, 13].includes(tNum))
                return `${num}th`

            return `${num}${["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][num % 10]}`
        },
        capitalize = (str, isTitleCase = false) => {
            if (VAL({ string: str }, "capitalize"))
                if (isTitleCase)
                    return _.map(_.map(str.split(" "), v => v.slice(0, 1).toUpperCase() + v.slice(1)).join(" ").split("-"), v => v.slice(0, 1).toUpperCase() + v.slice(1)).join("-").replace(/And/gu, "and")
                else
                    return str.slice(0, 1).toUpperCase() + str.slice(1)
            THROW(`Attempt to capitalize non-string '${jStrL(str)}'`, "capitalize")
            return str
        },
        parseToObj = val => {
            /* Converts an array or comma-delimited string of parameters ("key:val, key:val, key:val") into an object. */
            const [obj, args] = [{}, []]
            if (VAL({ string: val }))
                args.push(...val.split(/,\s*?/ug))
            else if (VAL({ array: val }))
                args.push(...val)
            else
                return THROW(`Cannot parse value '${jStrC(val)}' to object.`, "parseToObj")

            for (const kvp of _.map(args, v => v.split(/\s*:\s*(?!\/)/u)))
                obj[kvp[0]] = parseInt(kvp[1]) || kvp[1]
            return obj
        }
    // #endregion

    // #region CHAT MESSAGES: Formatting and sending chat messages to players & Storyteller
    const formatTitle = (funcName, scriptName, prefix = "") => `[${prefix}${funcName || scriptName ? " " : ""}${scriptName ? `${scriptName.toUpperCase()}` : ""}${scriptName && funcName ? ": " : ""}${funcName || ""}]`,
        formatLogLine = (msg, funcName, scriptName, prefix = "", isShortForm = false) => `${formatTitle(funcName, scriptName, prefix)} ${jStrL(msg, isShortForm)}`,
        //sendToPlayer = (who, message = "", title = "") => {
            /* Whispers formatted chat message to player given: display name OR player ID. */
            /* const player = getObj("player", who) ?
                    getObj("player", who).get("_displayname") :
                    who,
                html = jStrH(C.CHATHTML.header(jStr(title)) + C.CHATHTML.body(jStr(message)))
            if (player === "all" || player === "")
                sendChat("", html)
            else if (VAL({ player: player }, "sendToPlayer"))
                sendChat("", `/w ${player.get("_displayname")} ${html}`)
        },
        sendToGM = (msg, title) => sendToPlayer("Storyteller", msg, title || "[ALERT]") */
        
        sendToPlayer = (who, message = "", title = "") => {
            /* Whispers formatted chat message to player given: display name OR player ID. */
            const player = getObj("player", who) ?
                    getObj("player", who).get("_displayname") :
                    who,
                html = jStrH(C.CHATHTML.header(jStr(title)) + C.CHATHTML.body(jStr(message)))
            if (player === "all" || player === "")
                sendChat("", html)
            else
                sendChat("", `/w ${player} ${html}`)
        },
        /* Styling and sending to the Storyteller via whisper (Alert) or to the API console (Log). */
        //logEntry = (msg, title = "") => log(`[${jLog(title)}]: ${jLog(msg)}`),
        sendToGM = (msg, title = "[ALERT]") => sendToPlayer("Storyteller", msg, title)
    // #endregion

    // #region OBJECT MANIPULATION: Manipulating arrays, mapping objects
    const kvpMap = (obj, kFunc, vFunc) => {
            const newObj = {}
            _.each(obj, (v, k) => { newObj[kFunc ? kFunc(k, v) : k] = vFunc ? vFunc(v, k) : v })
            return newObj
        },
        removeFirst = (array, element) => array.splice(array.findIndex(v => v === element))
    // #endregion

    // #region SEARCH & VALIDATION: Set membership checking, type validation. 
    const isIn = (needle, haystack = ALLSTATS) => {
        /* Looks for needle in haystack using fuzzy matching, then returns value as it appears in haystack. */
            try {
                const ndl = `\\b${needle.replace(/^g[0-9]/u, "")}\\b`
                if (VAL({ array: haystack })) {
                    const index = _.findIndex(_.flatten(haystack),
                                              v => v.match(new RegExp(ndl, "iu")) !== null ||
                        v.match(new RegExp(ndl.replace(/_/gu), "iu")) !== null)
                    return index === -1 ? false : _.flatten(haystack)[index]
                } else if (VAL({ list: haystack })) {
                    const index = _.findIndex(_.keys(haystack),
                                              v => v.match(new RegExp(ndl, "iu")) !== null ||
                        v.match(new RegExp(ndl.replace(/_/gu), "iu"))) !== null
                    return index === -1 ? false : _.keys(haystack)[index]
                } else if (VAL({ string: haystack }, "isIn")) {
                    return haystack.search(new RegExp(needle, "iu")) > -1 && haystack
                }
            } catch (errObj) {
                return THROW(`Error locating stat '${D.JSL(needle)}' in ${D.JSL(haystack)}'`, "isIn", errObj)
            }
            return false
        },
        validate = (varList, funcName, scriptName) => {
            //TRACE.push(`VAL(${jStrL(_.keys(varList).join(", "))}, ${jStr(funcName)})`)
            // NOTE: To avoid accidental recursion, DO NOT use validate to confirm a type within the getter of that type.
            //		(E.g do not use VAL{char} inside any of the getChar() functions.)
            const [errorLines, valArray, charArray] = [[], [], []]
            _.each(_.keys(varList), cat => {
                valArray.length = 0
                valArray.push(...cat === "array" ? [varList[cat]] : _.flatten([varList[cat]]))
                _.each(valArray, v => {
                    let errorCheck = null
                    switch (cat.toLowerCase()) {
                        case "object":
                            if (!(v && v.get && v.id))
                                errorLines.push(`Invalid object: ${jStr(v && v.get && v.get("name") || v && v.id || v, true)}`)
                            break
                        case "char": case "charref":
                            if (!getChar(v))
                                errorLines.push(`Invalid character reference: ${jStr(v && v.get && v.get("name") || v && v.id || v, true)}`)
                            else
                                charArray.push(getChar(v))
                            break
                        case "charobj":
                            if (!v || !v.get || v.get("_type") !== "character")
                                errorLines.push(`Invalid character object: ${jStr(v && v.get && v.get("name") || v && v.id || v, true)}`)
                            else
                                charArray.push(v)
                            break
                        case "player": case "playerref":
                            if (!getPlayer(v))
                                errorLines.push(`Invalid player reference: ${jStr(v && v.get && v.get("name") || v && v.id || v)}`)
                            break
                        case "playerobj":
                            if (!v || !v.get || v.get("_type") !== "player")
                                errorLines.push(`Invalid player object: ${jStr(v && v.get && v.get("name") || v && v.id || v, true)}`)
                            break
                        case "trait":
                            if (charArray.length > 0) {
                                errorCheck = []
                                _.each(charArray, charObj => {
                                    if (!getStat(charObj, v, false, true))
                                        errorCheck.push(charObj.get("name"))
                                })
                                if (errorCheck.length > 0)
                                    errorLines.push(`Invalid trait: ${jStr(v && v.get && v.get("name") || v && v.id || v)} ON ${errorCheck.length}/${varList["char"].length} character references:<br>${jStr(errorCheck)}`)
                            } else {
                                errorLines.push(`Must validate at least one character before validating traits: ${jStr(varList[cat])}.`)
                            }
                            break
                        case "number":
                            if (_.isNaN(parseInt(v)))
                                errorLines.push(`Invalid number: ${jStr(v)}`)
                            break
                        case "string":
                            if (!_.isString(v))
                                errorLines.push(`Invalid string: ${jStr(v)}`)
                            break
                        case "function":
                            if (!_.isFunction(v))
                                errorLines.push("Invalid function.")
                            break
                        case "array":
                            if (!_.isArray(v))
                                errorLines.push(`Invalid array: ${jStr(v)}`)
                            break
                        case "list":
                            if (!_.isObject(v) || _.isFunction(v) || _.isArray(v) || v && v.get && v.get("_type"))
                                errorLines.push(`Invalid list object: ${jStr(v && v.get && v.get("name") || v && v.id || v)}`)
                            break
                        case "text":
                            if (!v || !v.get || v.get("_type") !== "text")
                                errorLines.push(`Invalid text object: ${jStr(v && v.get && v.get("name") || v && v.id || v)}`)
                            break
                        case "graphic":
                            if (!v || !v.get || v.get("_type") !== "graphic")
                                errorLines.push(`Invalid graphic object: ${jStr(v && v.get && v.get("name") || v && v.id || v)}`)
                            break
                        case "attribute":
                            if (!v || !v.get || v.get("_type") !== "attribute")
                                errorLines.push(`Invalid attribute object: ${jStr(v && v.get && v.get("name") || v && v.id || v)}`)
                            break
                        case "token":
                            if (!v || !v.get || v.get("_subtype") !== "token" || v.get("represents") === "")
                                errorLines.push(`Invalid token object (not a token, or doesn't represent a character): ${jStr(v && v.get && v.get("name") || v && v.id || v)}`)
                            break
                        case "reprow":
                            if (charArray.length > 0) {
                                errorCheck = true
                                _.each(charArray, charObj => {
                                    if (getAttrs(charObj, v, false, true).length > 0)
                                        errorCheck = false
                                })
                                if (errorCheck)
                                    errorLines.push(`Invalid repeating row reference: ${jStr(v)}`)
                            } else {
                                errorLines.push(`Must validate at least one character before validating repeating rows: ${jStr(varList[cat])}.`)
                            }
                            break
                        case "selection":
                            if (!v || !v.selected || !v.selected[0])
                                errorLines.push("Invalid selection: Select objects first!")
                            break
                        // no default
                    }
                })
            })
            //removeFirst(TRACE, `VAL(${jStrL(varList)}, ${jStr(funcName)})`)
            if (errorLines.length > 0) {
                if (!funcName || !scriptName)
                    return false
                return throwError(`[From ${jStr(scriptName).toUpperCase()}:${jStr(funcName)}]
                                        
                                        ${errorLines.join("<br>")}`, "validate", SCRIPTNAME)
            }
            return true
        }
    // #endregion

    // #region DEBUGGING & ERROR MANAGEMENT
    const setWatchList = keywords => {
            if (keywords === "clear") {
                STATEREF.WATCHLIST = []
            } else {
                const watchwords = _.flatten([keywords])
                _.each(watchwords, v => {
                    if (v.startsWith("!"))
                        STATEREF.WATCHLIST = _.without(STATEREF.WATCHLIST, v.slice(1))
                    else
                        STATEREF.WATCHLIST = _.uniq([...STATEREF.WATCHLIST, v])
                })
            }
            sendToGM(`Currently displaying debug information tagged with:<br><br>${jStr(STATEREF.WATCHLIST.join("<br>"))}`, formatTitle("setWatchList", SCRIPTNAME))
        },
        getWatchList = () => sendToGM(`${jStr(STATEREF.WATCHLIST)}`, "DEBUG WATCH LIST"),
        logDebugAlert = (msg, funcName, scriptName, prefix = "DB") => STATEREF.DEBUGLOG.push(formatLogLine(msg, funcName, scriptName, prefix)),
        throwError = (msg, funcName, scriptName, errObj) => sendDebugAlert(`${msg}${errObj ? `${errObj.name}<br>${errObj.message}<br><br>${errObj.stack}` : ""}`, funcName, scriptName, "ERROR"),
        sendDebugAlert = (msg, funcName, scriptName, prefix = "DB") => {
            const trace = TRACE.length > 0 ? `<span style="display: block; width: 100%; font-size: 10px; margin-top: -5px; background-color: #AAAAAA; color: grey; font-family: Voltaire; font-weight: bold;">${jStr(TRACE.join(" ► "))}</span>` : ""
            logDebugAlert(msg, formatTitle(funcName, scriptName, prefix))
            if (funcName && STATEREF.WATCHLIST.includes(funcName) || scriptName && STATEREF.WATCHLIST.includes(scriptName) || !funcName && !scriptName)
                sendToGM(trace + (isTraceOnly ? "" : msg), formatTitle(funcName, scriptName, prefix))
        },
        getDebugRecord = () => {
            sendToGM(jStr(STATEREF.DEBUGLOG.join("<br>")), "DEBUG LOG")
            STATEREF.DEBUGLOG.length = 0
        }
    // #endregion

    // #region GETTERS: Object, Character and Player Data
    const getGMID = () => {
        /* Finds the first player who is GM. */
            const gmObj = _.find(findObjs({ _type: "player" }), v => playerIsGM(v.id))
            return gmObj ? gmObj.id : THROW("No GM found.", "getGMID")
        },
        getSelected = (msg, typeFilter = []) => {
            TRACE.push("getSelected")
            /* When given a message object, will return selected objects or false.
                Can set one or more types.  In addition to standard types, can include "token" and "character"
                    "token" --> Will only return selected graphic objects that represent a character.
                    "character" --> Will return character objects associated with selected tokens. */
            const selObjs = new Set(),
                types = _.flatten([typeFilter])
            if (VAL({ selection: msg }, "getSelected"))
                _.each(_.compact(msg.selected), v => {
                    DB(`MSG Iteration:<br><br>Selected (${msg.selected.length}): ${jStr(msg.selected, true)}<br><br>Current V: ${jStr(v)}`, "getSelected")
                    if (types.length === 0 || types.includes(v._type))
                        selObjs.add(getObj(v._type, v._id))
                    else if (v._type === "graphic" && VAL({ token: getObj("graphic", v._id) }))
                        if (types.includes("token"))
                            selObjs.add(getObj("graphic", v.id))
                        else if ((types.includes("char") || types.includes("character")) && VAL({ char: getObj("graphic", v._id) }))
                            selObjs.add(getObj("character", getObj("graphic", v._id).get("represents")))
                })
            removeFirst(TRACE, "getSelected")
            return selObjs.size > 0 ? [...selObjs] : THROW(`None of the selected objects are of type(s) '${jStrL(types)}'`, "getSelected")
        },
        getName = (value, isShort) => {
            // Returns the NAME of the Graphic, Character or Player (DISPLAYNAME) given: object or ID.
            const obj = VAL({ object: value }) && value ||
                VAL({ char: value }) && getChar(value) ||
                VAL({ player: value }) && getPlayer(value) ||
                VAL({ string: value }) && getObj("graphic", value)
            let name = VAL({ player: obj }) && obj.get("_displayname") ||
                VAL({ object: obj }, "getName") && obj.get("name")

            if (VAL({ string: name }, "getName")) {
                if (isShort)						// SHORTENING NAME:
                    if (name.includes("\""))		// If name contains quotes, remove everything except the quoted portion of the name.
                        name = name.replace(/.*?["]/iu, "").replace(/["].*/iu, "")
                    else							// Otherwise, remove the first word.				
                        name = name.replace(/.*\s/iu, "")
                return name.replace(/_/gu, " ")
            }
            return "(UNNAMED)"
        },
        getChars = (charRef, isSilent = false) => {
			/* Returns an ARRAY OF CHARACTERS given: "all", "registered", a character ID, a character Name,
				a token object, a message with selected tokens, OR an array of such parameters. */
            const charObjs = new Set()
            let [searchParams, traceRef] = [[], ""]
            DB(`charRef: ${jStr(charRef, true)}`, "getChars")
            try {
                if (charRef.who) {
                    TRACE.push("getChars(msg)")
                    _.each(getSelected(charRef, "character"), charObj => { charObjs.add(charObj) })
                    DB(`From Message:<br><br>${jStr(...charObjs, true)}`, "getChars")
                    removeFirst(TRACE, "getChars(msg)")
                    return charObjs.size > 0 ? [...charObjs] : isSilent ? false : THROW("Must Select a Token!", "getChars")
                } else if (VAL({ array: charRef })) {
                    traceRef = `getChars([${jStr(charRef.length)}...])`
                    TRACE.push(traceRef)
                    searchParams = charRef
                    DB(`Array (Search Params)<br><br>${jStr(...searchParams, true)}`, "getChars")
                } else if (VAL({ string: charRef }) || VAL({ object: charRef }) || VAL({ number: charRef })) {
                    traceRef = "getChars(S/O/N)"
                    TRACE.push(traceRef)
                    searchParams.push(charRef)
                    DB(`String, Object or Number (${jStr(charRef, true)})<br><br>${jStr(...searchParams, true)}`, "getChars")
                } else {
                    return isSilent ? false : THROW(`Invalid character reference: ${jStr(charRef)}`, "getChars")
                }
            } catch (errObj) {
                removeFirst(TRACE, traceRef)
                return isSilent ? false : THROW("", "getChars", errObj)
            }
            _.each(searchParams, v => {
                // If parameter is a digit corresponding to a REGISTERED CHARACTER:
                if (VAL({ number: v }) && Char.REGISTRY[parseInt(v)]) {
                    charObjs.add(getObj("character", Char.REGISTRY[parseInt(v)].id))
                    DB(`Registry Number: ${jStr(v)}... ${charObjs.size} Characters Found.`, "getChars")
                // If parameter is a CHARACTER OBJECT already: */
                } else if (VAL({ object: v }) && v.get("type") === "character") {
                    charObjs.add(v)
                    DB(`Character Object: ${jStr(v, true)}... ${charObjs.size} Characters Found.`, "getChars")
                // If parameter is a CHARACTER ID:
                } else if (VAL({ string: v }) && getObj("character", v)) {
                    charObjs.add(getObj("character", v))
                    DB(`Character ID: ${jStr(v)}... ${charObjs.size} Characters Found.`, "getChars")
                // If parameters is a TOKEN OBJECT:
                } else if (VAL({ token: v }) && getObj("character", v.get("represents"))) {
                    charObjs.add(getObj("character", v.get("represents")))
                    DB(`Token: ${jStr(v, true)}... ${charObjs.size} Characters Found.`, "getChars")
                // If parameter is "all":
                } else if (v === "all") {
                    _.each(findObjs({ _type: "character" }), char => charObjs.add(char))
                    DB(`All Characters: ${jStr(v)}... ${charObjs.size} Characters Found.`, "getChars")
                // If parameter calls for REGISTERED CHARACTERS:
                } else if (v === "registered") {
                    _.each(Char.REGISTRY, v => { charObjs.add(getObj("character", v.id)) })
                    DB(`Registered Characters: ${jStr(v)}... ${charObjs.size} Characters Found.`, "getChars")
                // If parameter is a CHARACTER NAME:
                } else if (VAL({ string: v })) {
                    _.each(findObjs({ _type: "character" }), char => {
                        if (char.get("name").toLowerCase().includes(v.toLowerCase()))
                            charObjs.add(char)
                    })
                    DB(`Character Name: ${jStr(v)}... ${charObjs.size} Characters Found.`, "getChars")
                }
            })
            removeFirst(TRACE, traceRef)
            return charObjs.size === 0 ?
                isSilent ? false : throwError(`No Characters Found using Search Parameters:<br><br>${jStr(searchParams)} in Character Reference<br><br>${jStr(charRef)}`, "getChars", SCRIPTNAME)
                : _.reject([...charObjs], v => { v.get("name").includes("Jesse,") }) // Filtering out my test character, "Jesse, Good Lad That He Is"                  		
        },
        getChar = (charRef, isSilent = false) => getChars(charRef, isSilent)[0],
        getRowIDs = (charRef, section, rowRef, isSilent = false) => {
            // rowRef: rowID (string), stat:value (list, with special "name" entry for shortname), array of either (array), or null (all)
            TRACE.push("getRowIDs")
            DB(`GetRowIDs(${jStr(charRef, true)}, ${section}, ${jStrL(rowRef)})`, "getRowIDs")
            const charObj = getChar(charRef, isSilent),
                getUniqIDs = attrObjs => _.uniq(_.map(attrObjs, v => v.get("name").match(`repeating_${section}_(.*?)_`)[1]))
            let validRowIDs = [],
                [traceRef, dbstring] = ["", ""]
            if (VAL({ char: charObj, string: section }, "getRowIDs")) {
                const attrObjsInSection = _.filter(findObjs({ _type: "attribute", _characterid: charObj.id }), v => v.get("name").toLowerCase().includes(`_${section.toLowerCase()}_`)),
                    rowIDsInSection = getUniqIDs(attrObjsInSection)
                DB(`attrObjsInSection: ${jStr(_.map(attrObjsInSection, v => v.get("name")))}<br>rowIDsInSection: ${jStr(rowIDsInSection)}`, "getRowIDs")
                if (VAL({ string: rowRef })) {
                    traceRef = "RowRef-String"
                    TRACE.push(traceRef)
                    // RowRef is a rowID (string); use this to find row ID with a case insensitive reference.
                    validRowIDs.push(_.find(rowIDsInSection, v => v.toLowerCase() === rowRef.toLowerCase()))
                    DB(`RowRef: STRING.  Valid Row IDs:<br><br>${jStr(validRowIDs)}`, "getRowIDs")
                } else if (VAL({ list: rowRef })) {
                    traceRef = "RowRef-List"
                    TRACE.push(traceRef)
                    // RowRef is a key/value list of stat name and value to filter by. Only row IDs referring to ALL matching key/value pairs will be returned.
                    validRowIDs = [...rowIDsInSection]
                    DB(`RowRef: LIST:<br><br>${jStr(rowRef)}`, "getRowIDs")
                    TRACE.push("_F1_")
                    for (const rowData of _.pairs(rowRef)) {
                        const [key, val] = rowData
                        DB(`RowData: ${key}, ${val}`, "getRowIDs")
                        // Check each row against this filter element: Must satisfy, or remove from validRowIDs
                        TRACE.push("_F2_")
                        for (const rowID of [...validRowIDs]) {
                            const attrObjsInRow = _.filter(attrObjsInSection, v => v.get("name").toLowerCase().includes(rowID.toLowerCase()))
                            dbstring += `RowID: ${rowID}`
                            if (!_.find(attrObjsInRow, v => v.get("name").toLowerCase().endsWith((key === "name" ? val : key).toLowerCase()) &&
                                (key === "name" || v.get("current").toString().toLowerCase() === val.toString().toLowerCase()))) {
                                // If no direct match is found, check if the row contains a "_name" attribute that matches the key.
                                const nameAttrObj = _.find(attrObjsInRow, v => v.get("name").endsWith("_name") &&
                                    v.get("current").toString().toLowerCase() === (key === "name" ? val : key).toString().toLowerCase())
                                dbstring += ` -- No Direct Match.<br>NameAttrObj: ${jStr(nameAttrObj, true)}`
                                // If _name attribute exists, now find corresponding non-name attribute and compare its value to val.
                                if (nameAttrObj) {
                                    dbstring += " -- <b><u>EXISTS!</u></b>"
                                    if (key !== "name" &&
                                        !_.find(attrObjsInRow, v => v.get("name").toLowerCase() === nameAttrObj.get("name").toLowerCase().slice(0, -5) &&
                                        v.get("current").toString().toLowerCase() === val.toString().toLowerCase())) {
                                        // If neither of these tests pass, remove the rowID from the list of valid row IDs.
                                        dbstring += "<br>... But Doesn't Match Value"
                                        validRowIDs = _.without(validRowIDs, rowID)
                                    }
                                } else {
                                    dbstring += "<br>No Name Attribute."
                                    validRowIDs = _.without(validRowIDs, rowID)
                                }
                            }
                            dbstring += "<br><br>"
                        }
                        DB(dbstring, "getRowIDs")
                        removeFirst(TRACE, "_F2_")
                    }
                    removeFirst(TRACE, "_F1_")
                } else if (VAL({ array: rowRef })) {
                    traceRef = "RowRef-Array"
                    TRACE.push(traceRef)
                    // RowRef is an array of nested rowrefs, requiring recursion.
                    for (const ref of rowRef)
                        validRowIDs.push(...getRowIDs(charRef, section, ref, isSilent))
                } else if (!rowRef) {
                    traceRef = "RowRef-All"
                    TRACE.push(traceRef)
                    // No rowRef means the IDs of all section rows are returned.
                    validRowIDs.push(...rowIDsInSection)
                }
                DB(`Valid Row IDs:<br><br>${jStr(validRowIDs)}`, "getRowIDs")
                removeFirst(TRACE, traceRef)
            }
            removeFirst(TRACE, "getRowIDs")
            return _.uniq(validRowIDs)
        },
        getAttr = (charRef, attrName, isSilent = false) => {

        },
        getRepAttr = (charRef, rowFilter = {}, attrName, isSilent = false) => {
            // rowRef = { section: <string>, rowRef: <number, ID, list of key/value filters, OR null for all>, attrName: <string OR null for all> }
            // returns array of list objects for each rowID: { charID: <id>, fullName: <fullName>, name: <shortName>, obj: <attrObject holding value>, current: <value> }
            const charObj = getChar(charRef)
            if (VAL({ char: charObj, string: rowFilter.section }, "getRepAttrs")) {
                const rowIDs = getRowIDs(charObj, rowFilter.section, Object.assign(rowFilter.rowRef || {}, {name: attrName}), isSilent),
                    attrObjs = _.filter(findObjs({ _type: "attribute", _characterid: charObj.id }), v => v.get("name").match(`repeating_${rowFilter.section}_(.*?)_`) && rowIDs.includes(v.get("name").match(`repeating_${rowFilter.section}_(.*?)_`)[1])),
                    attrData = []
                for (const rowID of rowIDs) {
                    let attrValueObj = _.find(attrObjs, v => v.get("name").toLowerCase().endsWith(attrName.toLowerCase()))
                    if (!attrValueObj) {
                        // If no direct match is found, instead grab the name of the "_name" attribute, and then return the stripped value attribute.
                        const attrNameObj = _.find(attrObjs, v => v.get("name").toLowerCase().endsWith("_name"))
                        attrValueObj = _.find(attrObjs, v => v.get("name").toLowerCase() === attrNameObj.get("name").toLowerCase().slice(0, -5))
                    }
                    if (attrValueObj) 
                        attrData.push({
                            charID: charObj.id,
                            rowID: rowID,
                            fullName: attrValueObj.get("name"),
                            name: attrName,
                            obj: attrValueObj,
                            current: attrValueObj.get("current")
                        })
                    
                }
                return attrData
            }
            return false
        },
        setRepAttrs = (charRef, attrData = [], isSilent = false) => {
            // attrData = array of { section: <string>, row: <number, ID, list of key/value filters that MUST resolve to one row>, attrName: string, attrValue: value }
            const charObj = getChar(charRef, isSilent)
            if (VAL({ char: charObj }, "setRepAttrs")) {
                const attrList = {}
                for (const data of _.flatten([attrData])) {
                    const rowID = getRowIDs(charObj, data.section, data.row, isSilent = false),
                        attrObj = findObjs({ _type: "attribute", _characterid: charObj.id, name: `repeating_${data.section}_${rowID[0]}_${data.attrName}` })
                    if (rowID.length === 1 && attrObj.length === 1)
                        attrList[attrObj[0].get("name")] = data.attrValue
                    else
                        THROW(`Invalid filter: '${jStr(data.row)}'.  Found ${rowID.length} rows and ${attrObj.length} attribute objects:<br><br>${jStr(rowID)}<br><br>${jStr(attrObj)}`, "setRepAttrs")
                }
                setAttrs(charObj.id, attrList)
            }
        },
        getStats = (charRef, searchPattern, isNumOnly = false, isSilent = false) => {
            const charObj = getChar(charRef)
            let attrObjs = []
            if (!charObj)
                return isSilent ? false : D.ThrowError(`Invalid character reference: ${D.JS(charRef)}`, "DATA:GetStats")
            if (_.isArray(searchPattern)) {
                let patterns = [...searchPattern]
                attrObjs.push(...getStats(charRef, patterns.shift(), isNumOnly, isSilent))
                for (const pattern of patterns)
                    attrObjs.push(..._.uniq(...attrObjs, ...getStats(charRef, pattern, isNumOnly, isSilent)))
            } else {
                // First, attempt to find the exact attribute name.
                attrObjs = findObjs({
                    _type: "attribute",
                    _characterid: getChar(charRef).id,
                    _name: searchPattern
                })
                // ... if not, try a fuzzier search, using the statName as a search parameter.
                if (attrObjs.length === 0)
                    attrObjs = _.filter(findObjs({
                        type: "attribute",
                        characterid: charObj.id
                    }), v => v.get("name").toLowerCase().includes(searchPattern.toLowerCase()) || searchPattern.toLowerCase().includes(v.get("name").toLowerCase()))
                // ... if not, see if 'statName' is included in the "..._name" value of a repeating attribute.
                if (attrObjs.length === 0) {
                    let nameStatsAll = getStats(charRef, ["repeating", "_name"]),
                        nameStats = _.filter(nameStatsAll, v => v.get("current").toLowerCase() === searchPattern.toLowerCase())
                    if (nameStats.length === 0)
                        nameStats = _.filter(nameStatsAll, v => v.get("current").toLowerCase().includes(searchPattern.toLowerCase()))
                    if (nameStats.length > 0)
                        for (const stat of nameStats)
                            attrObjs.push(...findObjs({
                                _type: "attribute",
                                _characterid: getChar(charRef).id,
                                _name: stat.get("name").replace(/_name/gu, "")
                            }))
                }
                // If only looking for numerical values, filter out non-numbers.
                if (attrObjs.length > 0 && isNumOnly)
                    attrObjs = _.filter(attrObjs, v => _.isNumber(parseInt(v.get("current"))) && !_.isNaN(parseInt(v.get("current"))))
            }
            if (attrObjs.length > 0)
                return attrObjs

            return isSilent ? false : D.ThrowError(`No attributes matched all search patterns: ${D.JS(searchPattern)}`, "DATA:GetStats")
        },
        getStat = (charRef, searchPattern, isNumOnly, isSilent = false) => getStats(charRef, searchPattern, isNumOnly, isSilent)[0],
        getStatData = (charRef, filterArray, isSilent = false) => {
            const attrList = {}
            _.each(getStats(charRef, filterArray, false, isSilent), v => {
                attrList[v.get("name")] = v.get("current")
            })
            return attrList
        },
        getStatVal = (charRef, trait) => {
            if (VAL({ char: [charRef], trait: [trait] }, "GetStatVal"))
                return getStatData(charRef, [trait])[trait]
            return false
        },
        getPlayerID = (playerRef, isSilent = false) => {
            TRACE.push("getPlayerID")
            // Returns a PLAYER ID given: display name, token object, character reference.
            let playerID = null
            try {
                if (VAL({ char: playerRef })) {
                    playerID = _.filter(playerRef.get("controlledby").split(","), v => v !== "all")
                    if (playerID.length > 1 && !isSilent)
                        throwError(`WARNING: Finding MULTIPLE player IDs connected to character reference '${jStr(playerRef)}':<br><br>${jStr(playerID)}`, "DATA: GetPlayerID")
                    removeFirst(TRACE, "getPlayerID")
                    return playerID[0]
                }
                if (VAL({ string: playerRef }))
                    try {
                        removeFirst(TRACE, "getPlayerID")
                        return findObjs({
                            _type: "player",
                            _displayname: playerRef
                        })[0].id
                    } catch (errObj) {
                        return isSilent ? false : throwError(`Unable to find player connected to player reference '${jStr(playerRef)}'`, "DATA: GetPlayerID")
                    }

                if (VAL({ token: playerRef }))
                    playerID = getPlayerID(playerRef.get("represents"))
                removeFirst(TRACE, "getPlayerID")
                return playerID || (isSilent ? false : throwError(`Unable to find player connected to character token '${jStr(playerRef)}'`, "DATA: GetPlayerID"))
            } catch (errObj) {
                removeFirst(TRACE, "getPlayerID")
                return isSilent ? false : throwError(`Unable to find player connected to reference '${jStr(playerRef)}'.<br><br>${jStr(errObj)}`, "DATA: GetPlayerID")
            }
        },
        getPlayer = (playerRef, isSilent = false) => {
            TRACE.push("getPlayer")
            if (VAL({ string: getPlayerID(playerRef, true) }) && VAL({ object: getObj("player", playerRef) })) {
                removeFirst(TRACE, "getPlayer")
                return getObj("player", playerRef)
            }
            removeFirst(TRACE, "getPlayer")
            return isSilent ? false : throwError(`Unable to find a player object for reference '${jStr(playerRef)}`, "getPlayerID")
        },
        getPlayerName = (playerRef, isSilent = false) => {
            TRACE.push("getPlayerName")
            if (VAL({player: getPlayer(playerRef, true)}, "getPlayerName")) {
                let displayName = getPlayer(playerRef, true).get("_displayname")
                removeFirst(TRACE, "getPlayerName")
                return displayName
            }
            removeFirst(TRACE, "getPlayerName")
            return isSilent ? false : THROW(`Unable to find a player name for reference '${jStr(playerRef)}`, "getPlayerName")
        },
        getTextWidth = (obj, text) => {
            const font = obj.get("font_family").split(" ")[0].replace(/[^a-zA-Z]/gu, ""),
                size = obj.get("font_size"),
                chars = text.split(""),
                fontRef = state.DATA.CHARWIDTH[font],
                charRef = fontRef && fontRef[size]
            let width = 0
            if (!fontRef || !charRef) {
                logEntry(`No font reference for '${font}' at size '${size}', attempting default`, "D.GETTEXTWIDTH")

                return text.length * (parseInt(obj.get("width")) / obj.get("text").length)
            }
            _.each(chars, char => {
                if (!charRef[char] && charRef[char] !== " " && charRef[char] !== 0)
                    logEntry(`... MISSING '${char}' in '${font}' at size '${size}'`)
                else
                    width += parseInt(charRef[char])
            })

            return width
        }
    // #endregion

    // #region Repeating Section Manipulation
    const isRepRow = (charRef, rowID) => getStats(charRef, [rowID]).length > 0,
        getRepRowIDs = (charRef, secName, isSilent = false) =>
            _.uniq(
                _.map(
                    _.keys(
                        _.pick(
                            getStatData(charRef, ["repeating", `${secName}_`], isSilent), (v, k) => k.startsWith(`repeating_${secName}_`)
                        )
                    ), k => k.replace(`repeating_${secName}_`, "").substr(0, 20)
                )
            ),
        getRepAttrObjs = (charRef, secName, isSilent = false) => _.pick(getStats(charRef, ["repeating", `${secName}_`], isSilent), v => v.get("name").startsWith(`repeating_${secName}`)),
        getRepAttrData = (charRef, secName, isSilent = false) => _.pick(getStatData(charRef, ["repeating", `${secName}_`], isSilent), (v, k) => k.startsWith(`repeating_${secName}_`)),
        parseRepAttr = (attrRef) => {
            let nameParts = (D.IsObj(attrRef, "attribute") ? attrRef.get("name") : attrRef).split("_")
            if (nameParts.length > 2)
                return {
                    section: nameParts[1],
                    rowID: nameParts[2],
                    stat: nameParts.slice(3).join("_")
                }
            return false

        },
        makeRepRow = (charRef, secName, attrs) => {
            const attrList = {},
                IDa = 0,
                IDb = [],
                charID = D.GetChar(charRef).id,
                characters = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz",
                generateUUID = (() => () => {
                    let IDc = (new Date()).getTime() + 0,
                        IDf = 7
                    const IDd = IDc === IDa,
                        IDe = new Array(8)
                    for (IDf; IDf >= 0; IDf--) {
                        IDe[IDf] = characters.charAt(IDc % 64)
                        IDc = Math.floor(IDc / 64)
                    }
                    IDc = IDe.join("")
                    if (IDd) {
                        for (IDf = 11; IDf >= 0 && IDb[IDf] === 63; IDf--)
                            IDb[IDf] = 0
                        IDb[IDf]++
                    } else {
                        for (IDf = 0; IDf < 12; IDf++)
                            IDb[IDf] = Math.floor(64 * Math.random())
                    }
                    for (IDf = 0; IDf < 12; IDf++)
                        IDc += characters.charAt(IDb[IDf])

                    return IDc
                })(),
                makeRowID = () => generateUUID().replace(/_/gu, "Z"),
                rowID = makeRowID(),
                prefix = `repeating_${secName}_${rowID}_`

            _.each(attrs, (v, k) => {
                if (_.isString(prefix + k) && (prefix + k).length > 12) {
                    createObj("attribute", {
                        name: prefix + k,
                        max: "",
                        _characterid: charID
                    })
                    attrList[prefix + k] = v
                } else {
                    throwError(`Failure at makeRepRow(charRef, ${D.JSL(secName)}, ${D.JSL(attrs)})<br><br>Prefix (${D.JSL(prefix)}) + K (${D.JSL(k)}) is NOT A STRING asd})`, "DATA: makeRepRow()")
                }
            })
            setAttrs(charID, attrList)

            return rowID
        },
        deleteRepRow = (charRef, secName, rowID) => {
            if (!D.GetChar(charRef) || !_.isString(secName) || !_.isString(rowID))
                return D.ThrowError(`Need valid charRef (${D.JSL(charRef)}), secName (${D.JSL(secName)}) and rowID (${D.JSL(rowID)}) to delete a repeating row.`, "DATA.DeleteRepRow")
            const attrObjs = getStats(charRef, [secName, rowID])
            // D.Alert(`deleteRepRow(charRef, ${D.JS(secName)}, ${D.JS(rowID)})<br><br><b>AttrObjs:</b><br>${D.JS(_.map(attrObjs, v => v.get("name")))}`, "DATA:DeleteRepRow")
            if (attrObjs.length === 0)
                return D.ThrowError(`No row "repeating_${secName}_${rowID}" to delete for ${D.GetName(charRef)}.`, "DATA.DeleteRepRow")
            _.each(attrObjs, v => v.remove())

            return true
        },
        copyToRepSec = (charRef, sourceSec, sourceRowID, targetSec) => {
            const attrList = kvpMap(getStatData(charRef, [sourceSec, sourceRowID]), k => k.replace(`repeating_${sourceSec}_${sourceRowID}_`, ""))
            // D.Alert(`copyToRepSec(charRef, ${D.JS(sourceSec)}, ${D.JS(sourceRowID)}, ${D.JS(targetSec)})<br><br><b>AttrList:</b><br>${D.JS(attrList)}`, "DATA:CopyToRepSec")
            makeRepRow(charRef, targetSec, attrList)
            deleteRepRow(charRef, sourceSec, sourceRowID)
        },
        sortRepSec = (charRef, secName, sortFunc) => {
            /* Sortfunc must have parameters (charRef, secName, rowID1, rowID2) and return
              POSITIVE INTEGER if row1 should be ABOVE row2. */
            // D.Log(`CharRef: ${D.JSL(charRef)}`)
            const rowIDs = getRepRowIDs(charRef, secName),
                sortTrigger = getStatData(charRef, [`repeating_${secName}_${rowIDs[0]}_sorttrigger`])
            // D.Alert(`RepOrder: ${D.JS(repOrderAttr)}<br><br>${rowIDs.length} Row IDs for ${secName}:<br><br>${D.JS(rowIDs)}`, "DATA.SortRepSec")
            rowIDs.sort((idA, idB) => sortFunc(charRef, secName, idA, idB))
            // D.Alert(`... SORTED?<br><br>${D.JS(rowIDs)}<br><br>TEST ATTR: ${D.JS(sortTrigger)}`, "DATA.SortRepSec")
            setAttrs(D.GetChar(charRef).id, { [`_reporder_repeating_${secName}`]: rowIDs.join(",") })
            sortTrigger[`repeating_${secName}_${rowIDs[0]}_sorttrigger`] = sortTrigger[`repeating_${secName}_${rowIDs[0]}_sorttrigger`] === "false"
            // D.Alert(`sortRepSec(charRef, ${D.JS(secName)}, sortFunc)<br><br><b>RowIDs:</b><br>${D.JS(rowIDs)}<br><br><b>sortTrigger:</b><br>${D.JS(sortTrigger)}`, "DATA:SortRepSec")
            setAttrs(D.GetChar(charRef).id, sortTrigger)

            return rowIDs
        },
        splitRepSec = (charRef, sourceSec, targetSec, sortFunc, mode = "split") => {
            /* Will combine values from both source and target sections, sort them, then evenly split
              them between the two sections.  Split modes include:
                  "split" (default) — the bottom half of results will be moved to targetSec
                  "even" — even-numbered rows will be moved to targetSec
              Sortfunc must have parameters (charRef, secName, rowID1, rowID2) and return
              POSITIVE INTEGER if row1 should be ABOVE row2.  */
            // D.Alert(`splitRepSec(charRef, ${D.JS(sourceSec)}, ${D.JS(targetSec)}, sortFunc, ${D.JS(mode)})`, "DATA:SplitRepSec")

            // D.Alert("@@@ STARTING _.EACH COPYTOREPSEC @@@", "DATA:SplitRepSec")
            _.each(getRepRowIDs(charRef, targetSec), id => {
                copyToRepSec(charRef, targetSec, id, sourceSec)
            })
            const sortedIDs = sortRepSec(charRef, sourceSec, sortFunc)
            // D.Alert(`@@@ FINISHED _.EACH COPYTOREPSEC @@@<br><br><b>sortedIDs:</b><br>${D.JS(sortedIDs)}`, "DATA:SplitRepSec")
            switch (mode) {
                case "split":
                    sortedIDs.splice(0, Math.ceil(sortedIDs.length / 2))
                    // D.Alert(`@@@ SPLIT: STARTING SPLIT. @@@<br><br><b>sortedIDs (NEW):</b><br>${D.JS(sortedIDs)}`, "DATA:SplitRepSec")
                    while (sortedIDs.length > 0)
                        copyToRepSec(charRef, sourceSec, sortedIDs.shift(), targetSec)
                    // D.Alert("@@@ SPLIT: FINISHED SPLIT.", "DATA:SplitRepSec")
                    break
                case "even":
                    // D.Alert("@@@ EVEN: STARTING EVEN.", "DATA:SplitRepSec")
                    for (let i = 0; i < sortedIDs.length; i++)
                        if (i % 2)
                            copyToRepSec(charRef, sourceSec, sortedIDs[i], targetSec)

                    // D.Alert("@@@ EVEN: FINISHED EVEN.", "DATA:SplitRepSec")
                    break
                // no default
            }
            return
        },
        getCaseRepID = (lowCaseID, charRef) => {
            // Given a lower-case row ID (from sheetworker), converts it to proper case.
            const charObj = getChar(charRef),
                attrObjs = _.filter(
                    findObjs(charObj ?
                        { type: "attribute", characterid: charObj.id } :
                        { type: "attribute" }),
                    v => v.get("name").
                        toLowerCase().
                        includes(lowCaseID.toLowerCase())
                )
            if (!attrObjs || attrObjs.length === 0)
                return throwError(`No attributes found with id '${JSON.stringify(lowCaseID)}${charObj ? `' for char '${getName(charObj)}` : ""}'`)

            return attrObjs[0].get("name").split("_")[2]
        }
    // #endregion

    // #region SPECIAL FX
    const runFX = (name, pos) => {
        // Runs one of the special effects defined above.
        spawnFxWithDefinition(pos.left, pos.top, C.FX[name])
    }
    // #endregion

    // #region INITIALIZATION

    // #endregion

    return {
        CheckInstall: checkInstall,
        RegisterEventHandlers: regHandlers,

        GMID: getGMID,

        PAGEID: VALS.PAGEID,
        CELLSIZE: VALS.CELLSIZE,

        JS: jStr,
        // D.JS(obj, isLog): Parses a string. If isLog, will not use HTML.
        JSL: jStrL,
        // D.JSL(obj):  Parses a string, for output to the console log.
        JSH: jStrH,

        JSC: jStrC,

        /* D.JSH(string):  Strips a multiline string of linebreaks, typically used for HTML
		code (so you can format your code) for easy reading without including the incidental
		linebreaks as <br> tags in a subsequent jStr call. */
        Ordinal: ordinal,
        // D.Ordinal(num): Returns ordinalized number (e.g. 1 -> "1st")
        Capitalize: capitalize,
        // D.Capitalize(str): Capitalizes the first character in the string.
        ParseToObj: parseToObj,

        KeyMapObj: kvpMap,

        /* D.ParseToObj(string): Returns object with parameters given by
								  a string of form 'key:val, key:val,' */
        GetSelected: getSelected,
        // D.GetSelected(msg): Returns selected objects in message.
        Validate: validate,
        /* D.Validate(varList, funcName, scriptName):  Validates variables passed to it via varList, and
			sends error message formatted with namespace and funcName.  VarList must be in form:
			{
				<category>: [<array of references>], ...
			} 
			Valid categories: 
				char, player, trait,  text, graphic, token, reprow,
				number, string, function, array, list  */
        Log: logEntry,
        // D.Log(msg, title): Formats log message, with title.
        IsIn: isIn,

        /* D.IsIn(needle, [haystack]): Returns formatted needle if found in
										haystack (= all traits by default) */
        GetName: getName,
        GetPlayer: getPlayer,
        GetPlayerID: getPlayerID,
        GetPlayerName: getPlayerName,

        /* D.GetName(id): Returns name of graphic, character or player's
							display name. If isShort, returns name without quoteparts
       						OR only last name if no quotes. */
        GetChars: getChars,

        /* D.GetChars(val): Returns array of matching characters, given
							"all", a chat message with selected token(s), character ID,
       						player ID, character name OR array of those params. */
        GetChar: getChar,

        /* D.GetChar(val): As above, but returns only the first character
		       				object found.*/
        GetStats: getStats,
        GetStat: getStat,
        GetStatData: getStatData,
        GetStatVal: getStatVal,

        /* D.GetStat(char, name):  Given any valid character value, returns the
									attribute object described by name. */
        IsRepRow: isRepRow,
        GetRepAttrObjs: getRepAttrObjs,
        GetRepAttrs: getRepAttrData,
        GetRepIDs: getRepRowIDs,
        ParseRepAttr: parseRepAttr,
        GetRepIDCase: getCaseRepID,
        CopyToSec: copyToRepSec,
        SortRepSec: sortRepSec,
        SplitRepSec: splitRepSec,

        /* D.GetPlayerID(val):  Returns player ID given: display name, token
                                    object, character object.*/
        NumToText: numToText,
        GetTextWidth: getTextWidth,

        /* D.GetTextWidth(obj, text):  Returns width of given text object if
			       					    it held supplied text. */
        MakeRow: makeRepRow,
        DeleteRow: deleteRepRow,

        /* D.MakeRow(charID/obj, secName, attrs):  Creates repeating fieldset row in
													secName with attrs for character
													given by object or ID.*/
        RunFX: runFX,

        /* D.RunFX(name, {top: y, left: x}):  Runs a special effect at
											   the given location. */
        ThrowError: throwError,
        // D.ThrowError(errObj, title, errObj): Logs an error and messages GM.
        GetDebugInfo: getWatchList,
        // D.GetDebugInfo(): Displays the debug level, alert level, and categories.
        SetDebugWatchList: setWatchList,

        DB: formatDebug,
        DBAlert: sendDebugAlert,

        Alert: sendToGM,
        // D.Alert(msg, title): Sends alert message to GM.
        SendToPlayer: sendToPlayer

        /* D.SendToPlayer(who, msg, title): Sends chat message as 'who' with
                                                message and title. Message can be an array of strings OR
                                                        objects, of form: { message: <message>, title: <title> } */
    }
})()

on("ready", () => {
    D.CheckInstall()
    D.RegisterEventHandlers()
    D.Log("Ready!", "DATA")
})
void MarkStop("DATA")