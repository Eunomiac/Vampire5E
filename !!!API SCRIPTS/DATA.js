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
        //DB(`MESSAGE (DATA): ${jStr(msg)}<br><br>handleInput(msg, ${jStr(who)}, ${jStr(call)}, ${jStr(args.join(", "))})`, "DATAinput")
        switch (call) {
            case "debug": case "log": case "dblog":
                getDebugRecord()
                break
            case "rep": { // !get rep section key1:val1,key2:val2 statName groupBy pickProperty  (can be "null")
                const [section, rowFilter, statName, groupBy, pickProperty] = args
                D.Alert(`${jStr(getRepStats(
                    msg,
                    section,
                    rowFilter === "null" || !rowFilter ? null : parseToObj(rowFilter),
                    statName === "null" ? null : statName,
                    groupBy === "null" ? null : groupBy,
                    pickProperty === "null" ? null : pickProperty
                ))}`, "Testing GetRepAttr")
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
                        returnObj = `${data.get("_type") || "object"}: ${data.get("name") || data.id || data}`
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
                return jStr(errObj)
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
                [intStrings, decStrings] = [[], []]
            while (intArray.length)
                intStrings.push(`${parseThreeDigits(intArray.shift())} ${C.NUMBERWORDS.tiers[intArray.length]}`.toLowerCase().trim())
            if (VAL({ number: decimals })) {
                decStrings.push(" point")
                for (const digit of decimals.split(""))
                    decStrings.push(C.NUMBERWORDS.low[parseInt(digit)])
            }
            return capitalize((isNegative ? "negative " : "") + intStrings.join(", ") + decStrings.join(" "), isTitleCase)
        },
        textToNum = (num) => {
            const [tenText, oneText] = num.split("-")
            if (VAL({ string: tenText }, "textToNum"))
                return Math.max(0, _.indexOf(_.map(C.NUMBERWORDS.tens, v => v.toLowerCase()), tenText.toLowerCase()) * 10, _.indexOf(_.map(C.NUMBERWORDS.low, v => v.toLowerCase()), tenText.toLowerCase())) +
                    VAL({ string: oneText }) ? Math.max(0, _.indexOf(_.map(C.NUMBERWORDS.low, v => v.toLowerCase()), oneText.toLowerCase())) : 0
            return 0
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
        }
    // #endregion

    // #region CHAT MESSAGES: Formatting and sending chat messages to players & Storyteller
    const formatTitle = (funcName, scriptName, prefix = "") => `[${prefix}${VAL({string: funcName}) || VAL({string: scriptName}) ? " " : ""}${VAL({string: scriptName}) ? `${scriptName.toUpperCase()}` : ""}${VAL({string: [scriptName, funcName]}) ? ": " : ""}${funcName || ""}]`,
        formatLogLine = (msg, funcName, scriptName, prefix = "", isShortForm = false) => `${formatTitle(funcName, scriptName, prefix)} ${jStrL(msg, isShortForm, true)}`,
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
        sendToGM = (msg, title = "[ALERT]") => sendToPlayer("Storyteller", msg, title)
    // #endregion

    // #region OBJECT MANIPULATION: Manipulating arrays, mapping objects
    const kvpMap = (obj, kFunc, vFunc) => {
            const newObj = {}
            _.each(obj, (v, k) => { newObj[kFunc ? kFunc(k, v) : k] = vFunc ? vFunc(v, k) : v })
            return newObj
        },
        removeFirst = (array, element) => array.splice(array.findIndex(v => v === element)),
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

    // #region SEARCH & VALIDATION: Match checking, Set membership checking, type validation. 
    const fuzzyMatch = (first, second) => {
            if (VAL({string: [first, second]}, "fuzzyMatch"))
                return first.toLowerCase().replace(/\W+/gu, "").includes(second.toLowerCase().replace(/\W+/gu, "")) ||
                second.toLowerCase().replace(/\W+/gu, "").includes(first.toLowerCase().replace(/\W+/gu, ""))
            return false
        },
        isIn = (needle, haystack = ALLSTATS) => {
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
            _.each(varList, (val, cat) => {
                valArray.length = 0
                valArray.push(...cat === "array" ? [val] : _.flatten([val]))
                _.each(valArray, v => {
                    let errorCheck = null
                    switch (cat.toLowerCase()) {
                        case "object":
                            if (!(v && v.get && v.id))
                                errorLines.push(`Invalid object: ${jStr(v && v.get && v.get("name") || v && v.id || v, true)}`)
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
                        case "date":
                            if (!_.isDate(v))
                                errorLines.push(`Invalid date object: ${jStr(v && v.get && v.get("name") || v && v.id || v)}`)
                            break
                        case "selection":
                            if (!v || !v.selected || !v.selected[0])
                                errorLines.push("Invalid selection: Select objects first!")
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
                        case "text": case "textref": /*
                            if (!Media.GetTextObj(v))
                                errorLines.push(`Invalid text reference: ${jStr(v && v.get && v.get("name") || v && v.id || v)}`)
                            break       */
                        // fall through
                        case "textobj":
                            if (!v || !v.get || v.get("_type") !== "text")
                                errorLines.push(`Invalid text object: ${jStr(v && v.get && v.get("name") || v && v.id || v)}`)
                            break
                        case "graphic": case "graphicref": case "image": case "imageref": /*
                            break       */
                        // fall through
                        case "graphicobj": case "imageobj": case "imgobj":
                            if (!v || !v.get || v.get("_type") !== "graphic")
                                errorLines.push(`Invalid graphic object: ${jStr(v && v.get && v.get("name") || v && v.id || v)}`)
                            break
                        case "attribute": case "attr": case "attributeobj": case "attrobj":
                            if (!v || !v.get || v.get("_type") !== "attribute")
                                errorLines.push(`Invalid attribute object: ${jStr(v && v.get && v.get("name") || v && v.id || v)}`)
                            break
                        case "token": case "tokenobj":
                            if (!v || !v.get || v.get("_subtype") !== "token" || v.get("represents") === "")
                                errorLines.push(`Invalid token object (not a token, or doesn't represent a character): ${jStr(v && v.get && v.get("name") || v && v.id || v)}`)
                            break
                        case "trait":
                            if (charArray.length) {
                                errorCheck = []
                                _.each(charArray, charObj => {
                                    if (!getStat(charObj, v, true))
                                        errorCheck.push(charObj.get("name"))
                                })
                                if (errorCheck.length)
                                    errorLines.push(`Invalid trait: ${jStr(v && v.get && v.get("name") || v && v.id || v)} ON ${errorCheck.length}/${varList["char"].length} character references:<br>${jStr(errorCheck)}`)
                            } else {
                                errorLines.push(`Must validate at least one character before validating traits: ${jStr(varList[cat])}.`)
                            }
                            break
                        case "reptrait":
                            if (charArray.length) {
                                errorCheck = []
                                let [section, rowID, statName] = []
                                if (_.isString(v) && v.match("^repeating_[^_]*?_[^_]*?_.+"))
                                    [section, rowID, statName] = parseRepStat(v)
                                else
                                    [section, statName] = _.isString(v) ? v.split(":") : []
                                if (statName) {
                                    _.each(charArray, charObj => {
                                        if (!getRepStat(charObj, section, rowID, statName, true))
                                            errorCheck.push(charObj.get("name"))
                                    })
                                    if (errorCheck.length)
                                        errorLines.push(`Invalid repeating trait: ${jStr(v && v.get && v.get("name") || v && v.id || v)} ON ${errorCheck.length}/${varList["char"].length} character references:<br>${jStr(errorCheck)}`)
                                } else {
                                    errorLines.push(`Bad form for repeating trait name: ${jStr(v)}. Must supply full name, or string in the form "section:statname".`)
                                }
                            } else {
                                errorLines.push(`Must validate at least one character before validating repeating traits: ${jStr(val)}.`)
                            }
                            break
                        case "repname":
                            if (!(_.isString(v) && v.match("^repeating_[^_]*?_(.*?)_")))
                                errorLines.push(`Invalid repeating attribute name: ${jStr(v)}`)
                            break
                        // no default
                    }
                })
            })
            //removeFirst(TRACE, `VAL(${jStrL(varList)}, ${jStr(funcName)})`)
            if (errorLines.length) {
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
        logDebugAlert = (msg, funcName, scriptName, prefix = "DB") => {
            if (funcName)
                STATEREF.DEBUGLOG.push({
                    timeStamp: (new Date()).getTime(),
                    title: formatTitle(funcName, scriptName, prefix),
                    contents: msg
                })
            log(formatLogLine(msg, funcName, scriptName, prefix))
        },
        throwError = (msg, funcName, scriptName, errObj) => sendDebugAlert(`${msg}${errObj ? `${errObj.name}<br>${errObj.message}<br><br>${errObj.stack}` : ""}`, funcName, scriptName, "ERROR"),
        sendDebugAlert = (msg, funcName, scriptName, prefix = "DB") => {
            const trace = TRACE.length ? `<span style="display: block; width: 100%; font-size: 10px; margin-top: -5px; background-color: #AAAAAA; color: grey; font-family: Voltaire; font-weight: bold;">${TRACE.join(" ► ")}</span>` : ""
            logDebugAlert(msg, funcName, scriptName, prefix)
            if (funcName && STATEREF.WATCHLIST.includes(funcName) || scriptName && STATEREF.WATCHLIST.includes(scriptName) || !funcName && !scriptName)
                sendToGM(trace + (isTraceOnly ? "" : msg), formatTitle(funcName, scriptName, prefix))
        },
        getDebugRecord = () => {
            const logLines = []
            let lastTimeStamp
            for (const logData of STATEREF.DEBUGLOG) {
                if (!lastTimeStamp || logData.timeStamp - lastTimeStamp > 1000) {
                    let [logDate, ampm] = [new Date(logData.timeStamp), "A.M."]
                    logDate.setUTCHours(logDate.getUTCHours() - 4)
                    if (logDate.getUTCHours() >= 12) {
                        ampm = "P.M."
                        if (logDate.getUTCHours() > 12)
                            logDate.setUTCHours(logDate.getUTCHours() - 12)
                    }
                    logLines.push("</div>", C.HANDOUTHTML.main(C.HANDOUTHTML.title((new Date(logDate)).toUTCString().replace("GMT", ampm))).replace("</div>", ""))
                }
                logLines.push(C.HANDOUTHTML.bodyParagraph(C.HANDOUTHTML.subTitle(logData.title.replace("DB ", "")) + jStr(logData.contents)))
                lastTimeStamp = logData.timeStamp
            }
            logLines.push("</div>")
            Handouts.Make("Debug Log", "debug", logLines.join(""))
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
        getName = (value, isShort = false) => {
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
                } else if (VAL({ charObj: v })) {
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
                } else if (v.toLowerCase() === "all") {
                    _.each(findObjs({ _type: "character" }), char => charObjs.add(char))
                    DB(`All Characters: ${jStr(v)}... ${charObjs.size} Characters Found.`, "getChars")
                    // If parameter calls for REGISTERED CHARACTERS:
                } else if (v.toLowerCase() === "registered") {
                    _.each(Char.REGISTRY, charData => { if (!charData.name.toLowerCase().includes("Good Lad")) charObjs.add(getObj("character", charData.id)) })
                    DB(`Registered Characters: ${jStr(v)}... ${charObjs.size} Characters Found.`, "getChars")
                    // If parameter is a STRING, assume it is a character name to fuzzy-match.
                } else if (VAL({ string: v })) {
                    let isCharFound = false
                    // FIRST look for REGISTERED CHARACTERS:
                    _.each(Char.REGISTRY, charData => {
                        const char = getObj("character", charData.id)
                        if (fuzzyMatch(char.get("name"), v)) {
                            isCharFound = true
                            charObjs.add(char)
                        }
                    })
                    // IF NONE FOUND, look at other characters:
                    if (!isCharFound)
                        _.each(findObjs({ _type: "character" }), char => {
                            if (fuzzyMatch(char.get("name"), v))
                                charObjs.add(char)
                        })
                    DB(`Character Name: ${jStr(v)}... ${charObjs.size} Characters Found.`, "getChars")
                }
            })
            removeFirst(TRACE, traceRef)
            return charObjs.size === 0 ?
                isSilent ? false : throwError(`No Characters Found using Search Parameters:<br><br>${jStr(searchParams)} in Character Reference<br><br>${jStr(charRef)}`, "getChars", SCRIPTNAME)
                : [...charObjs]		
        }, getChar = (charRef, isSilent = false) => getChars(charRef, isSilent)[0],
        getCharData = (charRef, isSilent = false) => {
            const charObj = getChar(charRef)
            if (VAL({charObj: charObj}, "getCharData"))
                return _.find(_.values(Char.REGISTRY), v => v.id === charObj.id)
            return false
        },
        getStat = (charRef, statName, isSilent = false) => {
            const charObj = getChar(charRef)
            let attrValueObj = null
            if (VAL({ charObj: charObj, string: statName }, "getStat")) {
                const attrObjs = _.filter(findObjs({ _type: "attribute", _characterid: charObj.id }), v => !fuzzyMatch(v.get("name"), "repeating")) // Don't get repeating fieldset attributes.
                attrValueObj = _.find(attrObjs, v => fuzzyMatch(v.get("name"), statName))
                if (!attrValueObj) {
                    const attrNameObj = _.find(attrObjs, v => v.get("name").toLowerCase().endsWith("_name") && fuzzyMatch(v.get("current"), statName))
                    if (attrNameObj)
                        attrValueObj = _.find(attrObjs, v => v.get("name") === attrNameObj.get("name").slice(0, -5))
                }
            }
            return attrValueObj ? [attrValueObj.get("current"), attrValueObj] : null
        },
        getRepIDs = (charRef, section, rowFilter, isSilent = false) => {
            // rowRef: rowID (string), stat:value (list, with special "name" entry for shortname), array of either (array), or null (all)
            TRACE.push("getRowIDs")
            DB(`GetRowIDs(${jStr(charRef, true)}, ${section}, ${jStrL(rowFilter)})`, "getRowIDs")
            const charObj = getChar(charRef, isSilent),
                getUniqIDs = attrObjs => _.uniq(_.map(attrObjs, v => v.get("name").match("repeating_[^_]*?_(.*?)_")[1]))
            let validRowIDs = [],
                [traceRef, dbstring] = ["", ""]
            if (VAL({ char: charObj, string: section }, "getRowIDs")) {
                const attrObjs = _.filter(findObjs({ _type: "attribute", _characterid: charObj.id }), v => v.get("name").toLowerCase().startsWith(section === "*" ? "repeating_" : `repeating_${section.toLowerCase()}_`))
                //D.Alert(`attrObjs: ${D.JS(_.map(attrObjs, v => v.get("name")))}`)
                const rowIDs = getUniqIDs(attrObjs)
                DB(`attrObjsInSection: ${jStr(_.map(attrObjs, v => v.get("name")))}<br>rowIDsInSection: ${jStr(rowIDs)}`, "getRowIDs")
                if (VAL({ string: rowFilter })) {
                    traceRef = "RowRef-String"
                    TRACE.push(traceRef)
                    // RowRef is a rowID (string); use this to find row ID with a case insensitive reference.
                    validRowIDs.push(_.find(rowIDs, v => v.toLowerCase() === rowFilter.toLowerCase()))
                    DB(`RowRef: STRING.  Valid Row IDs:<br><br>${jStr(validRowIDs)}`, "getRowIDs")
                } else if (VAL({ list: rowFilter })) {
                    traceRef = "RowRef-List"
                    TRACE.push(traceRef)
                    // RowRef is a key/value list of stat name and value to filter by. Only row IDs referring to ALL matching key/value pairs will be returned.
                    // If value === "*", any value is accepted (only checks for presence of stat name)
                    validRowIDs = [...rowIDs]
                    DB(`RowRef: LIST:<br><br>${jStr(rowFilter)}`, "getRowIDs")
                    TRACE.push("_F1_")
                    for (const rowData of _.pairs(rowFilter)) {
                        const [key, val] = rowData
                        DB(`RowData: ${key}, ${val}`, "getRowIDs")
                        // Check each row against this filter element: Must satisfy, or remove from validRowIDs
                        TRACE.push("_F2_")
                        for (const rowID of [...validRowIDs]) {
                            const attrObjsInRow = _.filter(attrObjs, v => v.get("name").toLowerCase().includes(rowID.toLowerCase()))
                            dbstring += `RowID: ${rowID}`
                            if (!_.find(attrObjsInRow, v => fuzzyMatch(v.get("name").toLowerCase(), key.toLowerCase()) &&
                                (val === "*" || fuzzyMatch(v.get("current").toString().toLowerCase(), val.toString().toLowerCase())))) {
                                // If no direct match is found, check if the row contains a "_name" attribute that matches the key.
                                const nameAttrObj = _.find(attrObjsInRow, v => v.get("name").endsWith("_name") &&
                                    fuzzyMatch(v.get("current").toString().toLowerCase(), key.toString().toLowerCase()))
                                dbstring += " -- No Direct Match."
                                // If _name attribute exists, now find corresponding non-name attribute and compare its value to val.
                                if (nameAttrObj) {
                                    dbstring += `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${parseRepStat(nameAttrObj.get("name"))[2]} -- <b><u>EXISTS!</u></b>`
                                    if (!_.find(attrObjsInRow, v => v.get("name").toLowerCase() === nameAttrObj.get("name").toLowerCase().slice(0, -5) &&
                                        (val === "*" || fuzzyMatch(v.get("current").toString().toLowerCase(), val.toString().toLowerCase())))) {
                                        // If neither of these tests pass, remove the rowID from the list of valid row IDs.
                                        dbstring += ". . .  But Doesn't Match Value"
                                        validRowIDs = _.without(validRowIDs, rowID)
                                    }
                                } else {
                                    dbstring += " No Name Attribute."
                                    validRowIDs = _.without(validRowIDs, rowID)
                                }
                            }
                            dbstring += "<br>"
                        }
                        DB(dbstring, "getRowIDs")
                        removeFirst(TRACE, "_F2_")
                    }
                    removeFirst(TRACE, "_F1_")
                } else if (VAL({ array: rowFilter })) {
                    traceRef = "RowRef-Array"
                    TRACE.push(traceRef)
                    // RowRef is an array of nested rowrefs, requiring recursion.
                    for (const ref of rowFilter)
                        validRowIDs.push(...getRepIDs(charRef, section, ref, isSilent))
                } else if (!rowFilter) {
                    traceRef = "RowRef-All"
                    TRACE.push(traceRef)
                    // No rowRef means the IDs of all section rows are returned.
                    validRowIDs.push(...rowIDs)
                }
                DB(`Valid Row IDs:<br><br>${jStr(validRowIDs)}`, "getRowIDs")
                removeFirst(TRACE, traceRef)
            }
            removeFirst(TRACE, "getRowIDs")
            return _.uniq(validRowIDs)
        },
        getRepStats = (charRef, section, rowFilter, statName, groupBy, pickProperty, isSilent = false) => {
            DB(`getRepStats(${jStrL([getChar(charRef).get("name"), section, rowFilter, statName, groupBy, pickProperty])})`, "getRepStats")
            const charObj = getChar(charRef)
            let rowData = []
            if (VAL({ charObj: charObj, string: section }, "getRepStats")) {
                const filter = VAL({ string: statName }) ? Object.assign({ [statName]: "*" }, rowFilter || {}) : rowFilter,
                    rowIDs = getRepIDs(charObj, section, filter, isSilent),
                    attrObjs = _.filter(findObjs({ _type: "attribute", _characterid: charObj.id }), v => v.get("name").match(`repeating_${section === "*" ? ".*?" : section}_(.*?)_`) &&
                        rowIDs.includes(v.get("name").match(`repeating_${section === "*" ? ".*?" : section}_(.*?)_`)[1]))
                for (const rowID of rowIDs) {
                    const rowAttrObjs = _.filter(attrObjs, v => v.get("name").includes(rowID)),
                        attrValueObjs = [],
                        attrNameObjs = { nameObj: _.find(rowAttrObjs, v => v.get("name").toLowerCase().endsWith("_name")) }
                    if (attrNameObjs.nameObj) {
                        attrNameObjs.name = attrNameObjs.nameObj.get("current")
                        attrNameObjs.valObj = _.find(rowAttrObjs, v => v.get("name").toLowerCase() === attrNameObjs.nameObj.get("name").toLowerCase().slice(0, -5))
                        if (_.isUndefined(attrNameObjs.valObj))
                            continue
                        attrNameObjs.val = attrNameObjs.valObj.get("current")
                        DB(`Name Object Found: ${jStr(attrNameObjs)}`, "getRepStats")
                    }
                    if (statName)
                        attrValueObjs[0] = _.find(rowAttrObjs, v => v.get("name").toLowerCase().includes(`_${rowID.toLowerCase()}_`) && fuzzyMatch(parseRepStat(v.get("name").toLowerCase())[2], statName.toLowerCase())) ||
                            attrNameObjs.name && fuzzyMatch(attrNameObjs.name.toLowerCase(), statName.toLowerCase()) && attrNameObjs.valObj
                    else
                        attrValueObjs.push(...rowAttrObjs)
                    DB(`AttrValueObjs: ${jStr(attrValueObjs)}`, "getRepStats")
                    for (const attrValueObj of _.compact(attrValueObjs))
                        rowData.push({
                            charID: charObj.id,
                            rowID: rowID,
                            fullName: attrValueObj.get("name"),
                            name: attrNameObjs.valObj && attrNameObjs.valObj.get("name") === attrValueObj.get("name") && attrNameObjs.name ||
                                attrValueObj.get("name").match("repeating_[^_]*?_[^_]*?_(.+)")[1],
                            obj: attrValueObj,
                            val: VAL({ number: attrValueObj.get("current") }) ? parseInt(attrValueObj.get("current")) : attrValueObj.get("current")
                        })
                }
            }
            rowData = _.sortBy(_.compact(rowData), v => v.name.length)
            if (VAL({ string: groupBy }) && ["rowID", "fullName", "name", "val"].includes(groupBy)) {
                rowData = _.groupBy(rowData, v => v[groupBy])
                if (VAL({ string: pickProperty }) && ["fullName", "name", "obj", "val"].includes(pickProperty))
                    rowData = _.mapObject(rowData, v => _.map(v, vv => vv[pickProperty]))
            } else if (VAL({ string: pickProperty }) && ["fullName", "name", "obj", "val"].includes(pickProperty)) {
                rowData = _.map(rowData, v => v[pickProperty])
            }
            return rowData
        }, getRepStat = (charRef, section, rowFilter, statName, isSilent = false) => getRepStats(charRef, section, rowFilter, statName, null, null, isSilent)[0],
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
        }
    // #endregion

    // #region SETTERS: Attributes
    const setStats = (charRef, statList) => {
            const charObj = getChar(charRef)
            if (VAL({ charObj: charObj, list: statList }, "setStats"))
                _.each(statList, (value, statName) => {
                    const [, attrObj] = getStat(charObj, statName)
                    if (VAL({ object: attrObj }, "setStats"))
                        attrObj.set("current", value)
                })

        }, setStat = (charRef, statName, statValue) => setStats(charRef, { [statName]: statValue }),
        setRepStats = (charRef, section, rowFilter, statList, isSilent = false) => {
            const charObj = getChar(charRef, isSilent)
            if (VAL({ char: charObj, string: section, list: [rowFilter, statList] }, "setRepAttrs"))
                _.each(statList, (value, statName) => {
                    const rowData = getRepStat(charObj, section, rowFilter, statName, isSilent)
                    if (VAL({ object: rowData && rowData.obj }, "setRepStat"))
                        rowData.obj.set("current", value)
                })

        }, setRepStat = (charRef, section, rowFilter, statName, statValue, isSilent = false) => setRepStats(charRef, section, rowFilter, { [statName]: statValue }, isSilent)
    // #endregion

    // #region Repeating Section Manipulation
    const parseRepStat = (repRef) => {
            const repStatName = VAL({ object: repRef }) ? repRef.get("name") : repRef
            if (VAL({ repname: repStatName }, "parseRepAttr")) {
                const nameParts = repStatName.split("_")
                nameParts.shift()
                return [nameParts.shift(), nameParts.shift(), nameParts.join("_")]
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
                return THROW(`Need valid charRef (${D.JSL(charRef)}), secName (${D.JSL(secName)}) and rowID (${D.JSL(rowID)}) to delete a repeating row.`, "deleteRepRow")
            const attrObjs = getRepStats(charRef, secName, rowID, null, null, "obj")
            DB(`AttrObjs to Delete:<br><br>${jStr(attrObjs)}`, "deleteRepRow")
            // D.Alert(`deleteRepRow(charRef, ${D.JS(secName)}, ${D.JS(rowID)})<br><br><b>AttrObjs:</b><br>${D.JS(_.map(attrObjs, v => v.get("name")))}`, "DATA:DeleteRepRow")
            if (attrObjs.length === 0)
                return THROW(`No row "repeating_${secName}_${rowID}" to delete for ${D.GetName(charRef)}.`, "deleteRepRow")
            //_.each(attrObjs, v => v.remove())
            return true
        },
        copyToRepSec = (charRef, sourceSec, sourceRowID, targetSec) => {
            const attrList = kvpMap(getRepStats(charRef, sourceSec, sourceRowID), (k, v) => v.name, v => v.val)
            // D.Alert(`copyToRepSec(charRef, ${D.JS(sourceSec)}, ${D.JS(sourceRowID)}, ${D.JS(targetSec)})<br><br><b>AttrList:</b><br>${D.JS(attrList)}`, "DATA:CopyToRepSec")
            makeRepRow(charRef, targetSec, attrList)
            deleteRepRow(charRef, sourceSec, sourceRowID)
        },
        sortRepSec = (charRef, secName, sortFunc) => {
            /* Sortfunc must have parameters (charRef, secName, rowID1, rowID2) and return
              POSITIVE INTEGER if row1 should be ABOVE row2. */
            // D.Log(`CharRef: ${D.JSL(charRef)}`)
            const rowIDs = getRepIDs(charRef, secName),
                sortTrigger = getRepStat(charRef, secName, null, "sorttrigger")
            // getStatData(charRef, [`repeating_${secName}_${rowIDs[0]}_sorttrigger`])
            // D.Alert(`RepOrder: ${D.JS(repOrderAttr)}<br><br>${rowIDs.length} Row IDs for ${secName}:<br><br>${D.JS(rowIDs)}`, "DATA.SortRepSec")
            rowIDs.sort((idA, idB) => sortFunc(charRef, secName, idA, idB))
            // D.Alert(`... SORTED?<br><br>${D.JS(rowIDs)}<br><br>TEST ATTR: ${D.JS(sortTrigger)}`, "DATA.SortRepSec")
            setAttrs(D.GetChar(charRef).id, { [`_reporder_repeating_${secName}`]: rowIDs.join(",") })
            setRepStat(charRef, secName, sortTrigger.rowID, "sorttrigger", sortTrigger.val === "false")
            // D.Alert(`sortRepSec(charRef, ${D.JS(secName)}, sortFunc)<br><br><b>RowIDs:</b><br>${D.JS(rowIDs)}<br><br><b>sortTrigger:</b><br>${D.JS(sortTrigger)}`, "DATA:SortRepSec")
            //setAttrs(D.GetChar(charRef).id, sortTrigger)

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
            _.each(getRepIDs(charRef, targetSec), id => {
                copyToRepSec(charRef, targetSec, id, sourceSec)
            })
            const sortedIDs = sortRepSec(charRef, sourceSec, sortFunc)
            // D.Alert(`@@@ FINISHED _.EACH COPYTOREPSEC @@@<br><br><b>sortedIDs:</b><br>${D.JS(sortedIDs)}`, "DATA:SplitRepSec")
            switch (mode) {
                case "split":
                    sortedIDs.splice(0, Math.ceil(sortedIDs.length / 2))
                    // D.Alert(`@@@ SPLIT: STARTING SPLIT. @@@<br><br><b>sortedIDs (NEW):</b><br>${D.JS(sortedIDs)}`, "DATA:SplitRepSec")
                    while (sortedIDs.length)
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
        }
    // #endregion

    // #region SPECIAL FX
    const runFX = (name, pos) => {
        // Runs one of the special effects defined above.
        spawnFxWithDefinition(pos.left, pos.top, C.FX[name])
    }
    // #endregion

    return {
        CheckInstall: checkInstall,
        RegisterEventHandlers: regHandlers,

        PAGEID: VALS.PAGEID,
        CELLSIZE: VALS.CELLSIZE,

        JS: jStr, JSL: jStrL, JSH: jStrH, JSC: jStrC,
        NumToText: numToText, TextToNum: textToNum,
        Ordinal: ordinal,
        Capitalize: capitalize,

        SendToPlayer: sendToPlayer,
        Alert: sendToGM,

        RemoveFirst: removeFirst,
        KeyMapObj: kvpMap,
        ParseToObj: parseToObj,

        FuzzyMatch: fuzzyMatch,
        IsIn: isIn,
        Validate: validate,

        SetDebugWatchList: setWatchList,
        GetDebugWatchList: getWatchList,
        Log: logDebugAlert,
        ThrowError: throwError,
        DBAlert: sendDebugAlert,
        GetDebugRecord: getDebugRecord,

        GMID: getGMID,
        GetSelected: getSelected,
        GetName: getName,
        GetChars: getChars, GetChar: getChar, GetCharData: getCharData,
        GetStat: getStat,
        GetRepIDs: getRepIDs,
        GetRepStats: getRepStats, GetRepStat: getRepStat,
        GetPlayerID: getPlayerID, GetPlayer: getPlayer,

        SetStat: setStat,
        SetRepStats: setRepStats, SetRepStat: setRepStat,

        ParseRepStat: parseRepStat,
        CopyToSec: copyToRepSec,
        SortRepSec: sortRepSec,
        SplitRepSec: splitRepSec,
        MakeRow: makeRepRow,
        DeleteRow: deleteRepRow,

        RunFX: runFX
    }
})()

on("ready", () => {
    D.CheckInstall()
    D.RegisterEventHandlers()
    D.Log("DATA Ready!")
})
void MarkStop("DATA")