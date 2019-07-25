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
    const VAL = (varList, funcName, isArray = false) => D.Validate(varList, funcName, SCRIPTNAME, isArray), // eslint-disable-line no-unused-vars
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
        STATEREF.BLACKLIST = STATEREF.BLACKLIST || []
        STATEREF.CHARWIDTH = STATEREF.CHARWIDTH || {}
        STATEREF.DEBUGLOG = STATEREF.DEBUGLOG || []

        //delete state.VAMPIRE.DATA.CHARWIDTH
    }
    const TRACE = []
    let isTraceOnly = false
    // #endregion	

    // #region EVENT HANDLERS: (HANDLEINPUT)
    const handleInput = (msg, who, call, args) => { 	// eslint-disable-line no-unused-vars
        TRACE.push("handleInput")
        //DB(`MESSAGE (DATA): ${jStr(msg)}<br><br>handleInput(msg, ${jStr(who)}, ${jStr(call)}, ${jStr(args.join(", "))})`, "DATAinput")
        switch (call) {
            case "add": case "set":
                switch(args.shift().toLowerCase()) {
                    case "blacklist":
                        setBlackList(args)
                        break
                    case "watch": case "dbwatch": case "watchlist":
                        setWatchList(args)
                        break
                    /* no default */
                }
                break
            case "get":
                switch(args.shift().toLowerCase()) {
                    case "blacklist":
                        sendToGM(getBlackList(), "DEBUG BLACKLIST")
                        break
                    case "watch": case "dbwatch": case "watchlist":
                        sendToGM(getWatchList(), "DEBUG SETTINGS")
                        break
                    case "debug": case "log": case "dblog":
                        getDebugRecord()
                        break
                    /* no default */
                }
                break
            case "clear": case "reset":
                switch(args.shift().toLowerCase()) {
                    case "watch": case "dbwatch": case "watchlist":
                        setWatchList("clear")
                        break
                    case "blacklist":
                        setBlackList("clear")
                        break
                    case "debug": case "log": case "dblog":
                        Handouts.RemoveAll("Debug Log", "debug")
                        Handouts.RemoveAll("... DBLog", "debug")
                        STATEREF.DEBUGLOG = STATEREF.DEBUGLOG || []
                        break
                    /* no default */
                }
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
    const jStr = (data, isVerbose = false) => {
        /* Parses a value of any type via JSON.stringify, and then further styles it for display either
          in Roll20 chat, in the API console log, or both. */
            try {
                if (_.isUndefined(data))
                    return _.escape("<UNDEFINED>")
                const parser = val => {
                    if (val && val.get) {
                        if (isVerbose)
                            return JSON.stringify(val)
                        else
                            return `▌${data.get("_type") && data.get("_type").toUpperCase().slice(0, 3) || "OBJ"}</b>: ${data.get("name") || data.id || data}▐`
                    } else if (_.isArray(val)) {
                        const newArray = []
                        for (const v of val)
                            newArray.push(parser(v))
                        if (JSON.stringify(newArray).length < 200) 
                            return `[ ${_.map(newArray, v => _.isString(v) ? `"${v}"` : v).join(", ")} ]`.
                                replace(/\]"/gu, "]").replace(/"\[/gu, "[").
                                replace(/\[\s+\]/gu, "[]")
                        return [...newArray]
                    } else if (_.isObject(val) && !_.isEmpty(val)) {
                        const newVal = {}
                        _.each(val, (v, k) => {
                            newVal[k] = parser(v)
                        })  
                        if (JSON.stringify(newVal).length < 60)
                            return _.escape(JSON.stringify(newVal, null, 1).
                                replace(/\\n/g,"").
                                replace(/"([^(")"]+)":/g,"$1:")).
                                replace(/\}/gu, " }").
                                replace(/\s\s+/gu, " ")
                        return newVal
                    } else {
                        return val
                    }
                }

                const replacer = (k, v) => typeof v === "string" ? v.replace(/\\/gu, "") : v

                return JSON.stringify(parser(data), replacer, 4).
                    replace(/"\{/gu, "{").replace(/\}"/gu, "}").
                    replace(/(\s*?)"([^"]*?)"\s*?:/gu, "$1$2:"). // Removes quotes from keys of a list or object.
                    replace(/\\n/gu, "<br>"). // Converts line break code into '<br/>'
                    replace(/\\t/gu, ""). // Strips tab code
                    replace(/ (?= )/gu, "&nbsp;"). // Replaces any length of whitespace with one '&nbsp;'
                    replace(/@T@/gu, "&nbsp;&nbsp;&nbsp;&nbsp;"). // Converts custom '@T@' tab character to four spaces
                    replace(/"\[/gu, "[").replace(/\]"/gu, "]"). // Removes quotes from around array strings.
                    replace(/\\"/gu, "\""). // Escapes quote marks                
                    replace(/(^"|"$)/gu, "") // Removes quote marks from the beginning and end of the string
            } catch (errObj) {
                return JSON.stringify(errObj)
            }
        },
        jStrH = data => {
            /* Parses data as above, but removes raw line breaks instead of converting them to <br>.
                Line breaks must be specified in the code with '<br>' to be parsed as such.  */
            if (_.isUndefined(data))
                return _.escape("<UNDEFINED>")
            /* if (VAL({ string: data }))
                data = data.replace(/(\r\n|\n|\r)/gu, " ") */

            return jStr(VAL({ string: data }) ? data.replace(/<br\/?>/gu, "<br>") : data).
                replace(/<br\/>/gu, "").
                replace(/<br>/gu, "<br/>")
        },
        jStrL = data => {
            /* Parses data in a way that is appropriate to the console log, removing line breaks and redundant characters. */
            if (_.isUndefined(data))
                return "<UNDEFINED>"

            return jStrH(data).
                replace(/(\r\n|\n|\r|<br\/?>)/gu, " "). // Removes all line breaks
                replace(/(&nbsp;)+/gu, " "). // Converts &nbsp; back to whitespace
                replace(/(&amp;nbsp;)+/gu, " "). // Converts escaped &nbsp; to whitespace
                replace(/&quot;/gu, "'"). // Converts escaped double-quotes to single-quotes
                replace(/\\"\\"/gu, "'"). // Converts escaped double-quotes to single-quotes
                replace(/(<b>|<\/b>)/gu, ""). // Removes bold tagging
                replace(/&gt;/gu, ">").replace(/&lt;/gu, "<"). // Converts < and > back to symbols
                replace(/"/gu, "") // Removes all remaining double-quotes
        },
        jStrC = (data, isShortForm = false, properties = []) => {
			/* Parses data to show all HTML code raw, rather than parsing it for formatting.
				Can override this for specific tags by double-bracketing them (e.g. "<<b>>") */
            if (_.isUndefined(data))
                return _.escape("<UNDEFINED>")

            return `<pre>${_.escape(jStr(data, isShortForm, properties)).
                replace(/&gt;&gt;/gu, ">"). // Restores doubled right brackets to code.
                replace(/&lt;&lt;/gu, "<")}</pre>` // Restores doubled left brackets to code.
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
            THROW(`Attempt to capitalize non-string '${jStr(str)}'`, "capitalize")
            return str
        }
    // #endregion

    // #region CHAT MESSAGES: Formatting and sending chat messages to players & Storyteller
    const formatTitle = (funcName, scriptName, prefix = "") => `[${prefix}${VAL({string: funcName}) || VAL({string: scriptName}) ? " " : ""}${VAL({string: scriptName}) ? `${scriptName.toUpperCase()}` : ""}${VAL({string: [scriptName, funcName]}, null, true) ? ": " : ""}${funcName || ""}]`,
        formatLogLine = (msg, funcName, scriptName, prefix = "", isShortForm = false) => `${formatTitle(funcName, scriptName, prefix)} ${jStrL(msg, isShortForm, true)}`,
        sendChatMessage = (who, message = "", title) => {
            /* Whispers chat message to player given: display name OR player ID. 
                If no Title, message is sent without formatting. */
            const player = getPlayer(who) || who,
                html = title ? jStrH(C.CHATHTML.header(title) + C.CHATHTML.body(jStr(message))) : message
            if (player === "all" || !player)
                sendChat("", html)
            else if (Session.IsTesting)
                sendChat("", `/w Storyteller ${html}`)
            else
                sendChat("", `/w "${player.get("_displayname")}" ${html}`)
                
        },
        sendToGM = (msg, title = "[ALERT]") => sendChatMessage("Storyteller", msg, title)
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
    const looseMatch = (first, second) => {
            if (VAL({string: [first, second]}, "looseMatch", true))
                return first.toLowerCase() === second.toLowerCase()
            return false
        }, 
        fuzzyMatch = (first, second) => {
            if (VAL({string: [first, second]}, "fuzzyMatch", true))
                return first.toLowerCase().replace(/\W+/gu, "").includes(second.toLowerCase().replace(/\W+/gu, "")) ||
                second.toLowerCase().replace(/\W+/gu, "").includes(first.toLowerCase().replace(/\W+/gu, ""))
            return false
        },
        isIn = (needle, haystack = ALLSTATS) => {
            /* Looks for needle in haystack using fuzzy matching, then returns value as it appears in haystack. */
            try {
                const ndl = `\\b${needle}\\b`
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
        validate = (varList, funcName, scriptName, isArray = false) => {
            //TRACE.push(`VAL(${jStrL(_.keys(varList).join(", "))}, ${jStr(funcName)})`)
            // NOTE: To avoid accidental recursion, DO NOT use validate to confirm a type within the getter of that type.
            //		(E.g do not use VAL{char} inside any of the getChar() functions.)
            const [errorLines, valArray, charArray] = [[], [], []]
            _.each(varList, (val, cat) => {
                valArray.length = 0
                valArray.push(...isArray ? val : [val])
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
                            if (!_.isDate(TimeTracker.GetDate(v)))
                                errorLines.push(`Invalid date object: ${jStr(v && v.get && v.get("name") || v && v.id || v)}`)
                            break
                        case "msg": case "selection": case "selected":
                            if (!v || !v.selected || !v.selected[0])
                                errorLines.push("Invalid selection: Select objects first!")
                            break
                        case "char": case "charref":
                            if (!getChar(v, true))
                                errorLines.push(`Invalid character reference: ${jStr(v && v.get && v.get("name") || v && v.id || v, true)}`)
                            else
                                charArray.push(getChar(v, true))
                            break
                        case "charobj":
                            if (!v || !v.get || v.get("_type") !== "character")
                                errorLines.push(`Invalid character object: ${jStr(v && v.get && v.get("name") || v && v.id || v, true)}`)
                            else
                                charArray.push(v)
                            break
                        case "player": case "playerref":
                            if (!getPlayer(v, true))
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
                return THROW(`[From ${jStr(scriptName).toUpperCase()}:${jStr(funcName)}]
                                        
                                        ${errorLines.join("<br>")}`, "validate")
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
        setBlackList = keywords => {
            if (keywords === "clear") {
                STATEREF.BLACKLIST = []
            } else {
                const watchwords = _.flatten([keywords])
                _.each(watchwords, v => {
                    if (v.startsWith("!"))
                        STATEREF.BLACKLIST = _.without(STATEREF.BLACKLIST, v.slice(1))
                    else
                        STATEREF.BLACKLIST = _.uniq([...STATEREF.BLACKLIST, v])
                })
            }
            sendToGM(`Currently NOT logging debug information tagged with:<br><br>${jStr(STATEREF.BLACKLIST.join("<br>"))}`, formatTitle("setBlackList", SCRIPTNAME))
        },
        getBlackList = () => sendToGM(`${jStr(STATEREF.BLACKLIST)}`, "DEBUG BLACKLIST"),
        logDebugAlert = (msg, funcName, scriptName, prefix = "DB") => {
            if (Session.IsTesting || !Session.IsSessionActive) {                
                if (funcName) {
                    STATEREF.DEBUGLOG.push({
                        timeStamp: (new Date()).getTime(),
                        title: formatTitle(funcName, scriptName, prefix),
                        contents: msg
                    })
                    if (STATEREF.DEBUGLOG.length > 100) {
                        if (Handouts.Count("debug") > 20)
                            Handouts.RemoveAll("... DBLog", "debug")
                        getDebugRecord("... DBLog")
                    }                        
                }
                log(formatLogLine(msg, funcName, scriptName, prefix))
            }
        },
        throwError = (msg, funcName, scriptName, errObj) => sendDebugAlert(`${msg}${errObj ? `${errObj.name}<br>${errObj.message}<br><br>${errObj.stack}` : ""}`, funcName, scriptName, "ERROR"),
        sendDebugAlert = (msg, funcName, scriptName, prefix = "DB") => {
            if (!STATEREF.BLACKLIST.includes(funcName) && !STATEREF.BLACKLIST.includes(scriptName)) {
                const trace = TRACE.length ? `<span style="display: block; width: 100%; font-size: 10px; margin-top: -5px; background-color: ${C.COLORS.brightgrey}; color: ${C.COLORS.grey}; font-family: Voltaire; font-weight: bold;">${TRACE.join(" ► ")}</span>` : ""
                logDebugAlert(msg, funcName, scriptName, prefix)
                if (funcName && STATEREF.WATCHLIST.includes(funcName) || scriptName && STATEREF.WATCHLIST.includes(scriptName) || !funcName && !scriptName)
                    sendToGM(trace + (isTraceOnly ? "" : msg), formatTitle(funcName, scriptName, prefix))
            }
        },
        getDebugRecord = (title = "Debug Log", isClearing = false) => {
            const logLines = []
            let lastTimeStamp, lastTitle
            if (isClearing) {           
                Handouts.RemoveAll("Debug Log", "debug")
                Handouts.RemoveAll("... DBLog", "debug")
            }
            for (const logData of STATEREF.DEBUGLOG) {
                if (lastTimeStamp && logData.timeStamp - lastTimeStamp > 7200000) {
                    logLines.length = 0
                    Handouts.RemoveAll("Debug Log", "debug")
                    Handouts.RemoveAll("... DBLog", "debug")
                }
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
                if (lastTitle === logData.title)
                    logLines.push(C.HANDOUTHTML.bodyParagraph(jStr(logData.contents), {["border-top"]: `1px solid ${C.COLORS.black}`}))
                else
                    logLines.push(C.HANDOUTHTML.bodyParagraph(C.HANDOUTHTML.subTitle(logData.title.replace("DB ", "")) + jStr(logData.contents)))
                lastTimeStamp = logData.timeStamp
                lastTitle = logData.title
            }
            logLines.push("</div>")
            Handouts.Make(title, "debug", logLines.join(""))
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
                    //DB(`MSG Iteration:<br><br>Selected (${msg.selected.length}): ${jStr(msg.selected, true)}<br><br>Current V: ${jStr(v)}`, "getSelected")
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
                    if (_.find(_.values(Char.REGISTRY), v => v.name === name)) // If this is a registered character, return its short name.
                        return _.find(_.values(Char.REGISTRY), v => v.name === name).shortName
                    else if (name.includes("\""))		// If name contains quotes, remove everything except the quoted portion of the name.
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
            let [searchParams, traceRef, dbstring] = [[], "", ""]
            try {
                if (charRef.who) {
                    TRACE.push("getChars(msg)")
                    _.each(getSelected(charRef, "character"), charObj => { charObjs.add(charObj) })
                    dbstring += `REF: Msg.  RETURNING: ${jStr(...charObjs)}`
                    removeFirst(TRACE, "getChars(msg)")
                    return charObjs.size > 0 ? [...charObjs] : isSilent ? false : THROW("Must Select a Token!", "getChars")
                } else if (VAL({ array: charRef })) {
                    traceRef = `getChars([${jStr(charRef.length)}...])`
                    TRACE.push(traceRef)
                    searchParams = charRef
                    dbstring += `REF: [${jStr(...searchParams)}] `
                } else if (VAL({ string: charRef }) || VAL({ object: charRef }) || VAL({ number: charRef })) {
                    traceRef = "getChars(S/O/N)"
                    TRACE.push(traceRef)
                    searchParams.push(charRef)
                    dbstring += `REF: ${capitalize(jStr(typeof charRef), true)} `
                } else {
                    return isSilent ? false : THROW(`Invalid character reference: ${jStr(charRef)}`, "getChars")
                }
            } catch (errObj) {
                removeFirst(TRACE, traceRef)
                return isSilent ? false : THROW("", "getChars", errObj)
            }
            _.each(searchParams, v => {
                if (searchParams.length > 1)
                    dbstring += "<br>"
                // If parameter is a digit corresponding to a REGISTERED CHARACTER:
                if (VAL({ number: v }) && Char.REGISTRY[parseInt(v)]) {
                    charObjs.add(getObj("character", Char.REGISTRY[parseInt(v)].id))
                    dbstring += " ... Registry #: "
                    // If parameter is a CHARACTER OBJECT already: */
                } else if (VAL({ charObj: v })) {
                    charObjs.add(v)
                    dbstring += " ... CharObj "
                    // If parameter is a CHARACTER ID:
                } else if (VAL({ string: v }) && getObj("character", v)) {
                    charObjs.add(getObj("character", v))
                    dbstring += " ... CharID: "
                    // If parameters is a TOKEN OBJECT:
                } else if (VAL({ token: v }) && getObj("character", v.get("represents"))) {
                    charObjs.add(getObj("character", v.get("represents")))
                    dbstring += " ... Token: "
                    // If parameter is "all":
                } else if (v.toLowerCase() === "all") {
                    _.each(findObjs({ _type: "character" }), char => charObjs.add(char))
                    dbstring += ` ... "${jStr(v)}": `
                    // If parameter calls for REGISTERED CHARACTERS:
                } else if (v.toLowerCase() === "registered") {
                    _.each(Char.REGISTRY, charData => { if (!charData.name.toLowerCase().includes("Good Lad")) charObjs.add(getObj("character", charData.id)) })
                    dbstring += ` ... "${jStr(v)}": `
                    // If parameter is a SINGLE CHARACTER, assume it is an INITIAL and search the registry for it.
                } else if (VAL({string: v}) && v.length === 1) {
                    const charData = _.find(Char.REGISTRY, charData => charData.initial.toLowerCase() === v.toLowerCase())
                    if (charData)
                        charObjs.add(getObj("character", charData.id))
                    dbstring += ` ... "${jStr(v)}": `                    
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
                    dbstring += " ... String: "
                }
                dbstring += `${charObjs.size} Characters Found.`
            })
            if (!STATEREF.BLACKLIST.includes("getChars"))
                DB(dbstring, "getChars")
            removeFirst(TRACE, traceRef)
            return charObjs.size === 0 ?
                isSilent ? false : THROW(`No Characters Found using Search Parameters:<br>${jStr(searchParams)} in Character Reference<br>${jStr(charRef)}`, "getChars")
                : _.reject([...charObjs], v => v.get("name") === "Jesse, Good Lad That He Is")
        }, getChar = (charRef, isSilent = false) => getChars(charRef, isSilent)[0],
        getCharData = (charRef, isSilent = false) => {
            const charObj = getChar(charRef)
            if (VAL({charObj: charObj}, isSilent ? null : "getCharData"))
                return _.find(_.values(Char.REGISTRY), v => v.id === charObj.id)
            return false
        },
        getCharsProps = (charRefs, property, isSilent = false) => {
            const charObjs = getChars(charRefs, isSilent),
                propData = {}
            for (const char of charObjs)
                propData[char.id] = getCharData(char, isSilent)[property]
            return propData
        },
        getStat = (charRef, statName, isSilent = false) => {
            const charObj = getChar(charRef)
            let attrValueObj = null
            if (VAL({ charObj: charObj, string: statName }, isSilent ? null : "getStat")) {
                const attrObjs = _.filter(findObjs({ _type: "attribute", _characterid: charObj.id }), v => statName.includes("repeating") || !fuzzyMatch("repeating", v.get("name"))) // UNLESS "statName" includes "repeating_", don't return repeating fieldset attributes.
                //D.Alert(`All Attr Objs: ${D.JS(_.map(allAttrObjs, v => v.get("name")))}<br><br>Filtered Attr Objs: ${D.JS(_.map(attrObjs, v => v.get("name")))}`)
                // First try for a direct match, then a fuzzy match:
                attrValueObj = _.find(attrObjs, v => v.get("name").toLowerCase() === statName.toLowerCase()) || _.find(attrObjs, v => looseMatch(v.get("name"), statName))
                if (!attrValueObj) {
                    const attrNameObj = _.find(attrObjs, v => v.get("name").toLowerCase().endsWith("_name") && v.get("current").toLowerCase() === statName.toLowerCase())
                    if (attrNameObj)
                        attrValueObj = _.find(attrObjs, v => v.get("name") === attrNameObj.get("name").slice(0, -5))
                }
                DB(`AttrValueObj: ${D.JS(attrValueObj, true)}
                Boolean: ${Boolean(attrValueObj)}
                Current: ${D.JS(attrValueObj.get("current"))}
                So, returning: ${D.JS(attrValueObj ? [attrValueObj.get("current"), attrValueObj] : null, true)}`, "getStat")
            }
            return attrValueObj ? [attrValueObj.get("current"), attrValueObj] : null
        },
        getRepIDs = (charRef, section, rowFilter, isSilent = false) => {
            // rowRef: rowID (string), stat:value (list, with special "name" entry for shortname), array of either (array), or null (all)
            TRACE.push("getRepIDs")
            DB(`GetRepIDs(${jStr(charRef, true)}, ${section}, ${jStr(rowFilter)})`, "getRepIDs")
            const charObj = getChar(charRef, isSilent),
                getUniqIDs = attrObjs => _.uniq(_.map(attrObjs, v => v.get("name").match("repeating_[^_]*?_(.*?)_")[1]))
            let validRowIDs = [],
                [traceRef, dbstring] = ["", ""]
            if (VAL({ char: charObj, string: section }, "getRepIDs")) {
                const attrObjs = _.filter(findObjs({ _type: "attribute", _characterid: charObj.id }), v => v.get("name").toLowerCase().startsWith(section === "*" ? "repeating_" : `repeating_${section.toLowerCase()}_`))
                //D.Alert(`attrObjs: ${D.JS(_.map(attrObjs, v => v.get("name")))}`)
                const rowIDs = getUniqIDs(attrObjs)
                DB(`attrObjsInSection: ${jStr(_.map(attrObjs, v => parseRepStat(v.get("name"))[2]))}<br><br>rowIDsInSection: ${jStr(rowIDs)}`, "getRepIDs")
                if (VAL({ string: rowFilter })) {
                    traceRef = "RowRef-String"
                    TRACE.push(traceRef)
                    // RowRef is a rowID (string); use this to find row ID with a case insensitive reference and simply return that.
                    DB(`RowRef: STRING.  Valid Row IDs: ${jStr(_.find(rowIDs, v => v.toLowerCase() === rowFilter.toLowerCase()))}`, "getRepIDs")
                    return [_.find(rowIDs, v => v.toLowerCase() === rowFilter.toLowerCase())]
                } else if (VAL({ list: rowFilter })) {
                    traceRef = "RowRef-List"
                    TRACE.push(traceRef)
                    // RowRef is a key/value list of stat name and value to filter by. Only row IDs referring to ALL matching key/value pairs will be returned.
                    // If value === "*", any value is accepted (only checks for presence of stat name)
                    validRowIDs = [...rowIDs]
                    DB(`RowRef: LIST:<br><br>${jStr(rowFilter)}`, "getRepIDs")
                    TRACE.push("_F1_")
                    for (const rowData of _.pairs(rowFilter)) {
                        const [key, val] = rowData
                        DB(`RowData: ${key}, ${val}`, "getRepIDs")
                        // Check each row against this filter element: Must satisfy, or remove from validRowIDs
                        TRACE.push("_F2_")
                        for (const rowID of [...validRowIDs]) {
                            const attrObjsInRow = _.filter(attrObjs, v => v.get("name").toLowerCase().includes(rowID.toLowerCase()))
                            dbstring += `RowID: ${rowID}`
                            if (!_.find(attrObjsInRow, v => fuzzyMatch(v.get("name"), key) &&
                                (val === "*" || looseMatch(v.get("current").toString(), val.toString())))) {
                                // If no direct match is found, check if the row contains a "_name" attribute that matches the key.
                                const nameAttrObj = _.find(attrObjsInRow, v => v.get("name").endsWith("_name") &&
                                    looseMatch(v.get("current").toString(), key.toString()))
                                dbstring += " -- No Direct Match."
                                // If _name attribute exists, now find corresponding non-name attribute and compare its value to val.
                                if (nameAttrObj) {
                                    dbstring += `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${parseRepStat(nameAttrObj.get("name"))[2]} -- <b><u>EXISTS!</u></b>`
                                    if (!_.find(attrObjsInRow, v => looseMatch(v.get("name"), nameAttrObj.get("name").slice(0, -5)) &&
                                        (val === "*" || looseMatch(v.get("current").toString(), val.toString())))) {
                                        // If neither of these tests pass, remove the rowID from the list of valid row IDs.
                                        dbstring += ". . .  But Doesn't Match Value"
                                        validRowIDs = _.without(validRowIDs, rowID)
                                    } else {
                                        let obj = _.find(attrObjsInRow, v => looseMatch(v.get("name"), nameAttrObj.get("name").slice(0, -5)) &&
                                        (val === "*" || looseMatch(v.get("current").toString(), val.toString())))
                                        dbstring += `. . .  NAME+VALUE MATCH: VAL[${val}] = ${obj.get("current")}, VALNAME[${parseRepStat(obj.get("name"))[2]}], NAMEOBJ[${parseRepStat(nameAttrObj.get("name"))[2]}]`
                                    }
                                } else {
                                    dbstring += " No Name Attribute."
                                    validRowIDs = _.without(validRowIDs, rowID)
                                }
                            } else {
                                const matchedAttr = _.find(attrObjsInRow, v => fuzzyMatch(v.get("name"), key) && (val === "*" || looseMatch(v.get("current").toString(), val.toString())))
                                dbstring += ` -- DIRECT MATCH! ${matchedAttr.get("name")}: ${matchedAttr.get("current")}`
                            }
                            dbstring += "<br>"
                        }
                        DB(dbstring, "getRepIDs")
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
                DB(`Valid Row IDs: ${jStr(validRowIDs)}`, "getRepIDs")
                removeFirst(TRACE, traceRef)
            }
            removeFirst(TRACE, "getRepIDs")
            return _.uniq(validRowIDs)
        },
        getRepStats = (charRef, section, rowFilter, statName, groupBy, pickProperty, isSilent = false) => {
            const charObj = getChar(charRef)
            DB(`getRepStats(${jStr([charObj.get("name"), section, rowFilter, statName, groupBy, pickProperty])})`, "getRepStats")
            let finalRepData = []
            if (VAL({ charObj: charObj, string: section }, "getRepStats")) {
                // STEP ONE: USE THE ROW FILTER TO GET VALID ROW IDS TO SEARCH
                const filter = VAL({string: rowFilter}) ? rowFilter :
                        VAL({string: statName, list: rowFilter || {} }) ? Object.assign({ [statName]: "*" }, rowFilter || {}) :
                            rowFilter,
                    rowIDs = getRepIDs(charObj, section, filter, isSilent),
                    attrObjs = _.filter(findObjs({ _type: "attribute", _characterid: charObj.id }), v => v.get("name").match(`repeating_${section === "*" ? ".*?" : section}_(.*?)_`) &&
                                                                                                         rowIDs.includes(v.get("name").match(`repeating_${section === "*" ? ".*?" : section}_(.*?)_`)[1]))
                // STEP TWO: ITERATE THROUGH EACH ROW TO LOOK FOR REQUESTED STAT(S)
                for (const rowID of rowIDs) {
                    const rowAttrObjs = _.filter(attrObjs, v => v.get("name").toLowerCase().includes(rowID.toLowerCase())), // Select the attribute objects from this row.
                        attrNameObjs = _.filter(rowAttrObjs, v => v.get("name").toLowerCase().endsWith("_name")), // Select ALL row attribute objects that end with "_name"
                        attrNameData = _.compact(_.map(attrNameObjs, v => { // ... and compile their data by linking them to their value objects.
                            const data = {
                                charID: charObj.id,
                                rowID: rowID,
                                name: v.get("current"),
                                fullName: v.get("name").replace(/_name$/gu, ""),
                                obj: _.find(rowAttrObjs, vv => vv.get("name").toLowerCase() === v.get("name").toLowerCase().slice(0,-5))
                            }
                            if (data.obj) {
                                data.val = data.obj.get("current")
                                data.attrName = parseRepStat(data.obj.get("name"))[2]
                                DB(`NameData --> ValObject: NAME: ${data.name}, VAL: ${data.val}, OBJ: ${jStr(data.obj)}`, "getRepStats")
                                return data
                            } else {
                                return false
                            }
                        }))
                    // IF a STATNAME has been specified...
                    if (statName) {
                        const foundStat = 
                            _.find(attrNameData, v => looseMatch(parseRepStat(v.fullName)[2], statName.replace(/_name$/gu, ""))) || // FIRST match it against an EXACT ATTRIBUTE NAME already found above.
                            _.find(attrNameData, v => looseMatch(parseRepStat(v.name)[2], statName)) || // SECOND try to match with the EXACT "FOUND" NAME of a NAME/VALUE link.
                            _.find(rowAttrObjs, v => looseMatch(parseRepStat(v.get("name"))[2], statName)) || // NEXT, check to see if it EXACTLY matches any of the rowAttrObjs.
                            _.find(attrNameData, v => fuzzyMatch(parseRepStat(v.fullName)[2], statName.replace(/_name$/gu, ""))) || // FINALLY repeat the above but with fuzzy matching. match it against an EXACT ATTRIBUTE NAME already found above.
                            _.find(attrNameData, v => fuzzyMatch(parseRepStat(v.name)[2], statName)) || 
                            _.find(rowAttrObjs, v => fuzzyMatch(parseRepStat(v.get("name"))[2], statName))
                        if (foundStat) { // If a stat was found, change it to a data set if it isn't one already
                            finalRepData.push(foundStat.fullName ? foundStat : {
                                charID: charObj.id,
                                rowID: rowID,
                                name: parseRepStat(foundStat.get("name"))[2],
                                attrName: parseRepStat(foundStat.get("name"))[2],
                                fullName: foundStat.get("name"),
                                obj: foundStat,
                                val: foundStat.get("current")
                            })
                            DB(`FinalRepData: ${D.JS(finalRepData, true)}`, "getRepStats")
                        } else {
                            DB(`No matches to statName ${statName}`, "getRepStats")
                        }
                    // IF a STATEMENT has NOT been specified, return ALL the row attribute objects (after parsing them into data sets)
                    } else {
                        finalRepData.push(...attrNameData)
                        finalRepData.push(..._.map(rowAttrObjs, v => ({
                            charID: charObj.id,
                            rowID: rowID,
                            name: parseRepStat(v.get("name"))[2],
                            attrName: parseRepStat(v.get("name"))[2],
                            fullName: v.get("name"),
                            obj: v,
                            val: v.get("current")
                        })))
                    }
                }
                // Compactify the data to remove false values:
                finalRepData = _.compact(finalRepData)
                // Check for grouping and property-picking, and transform the data accordingly:
                if (VAL({ string: groupBy }) && ["rowID", "fullName", "attrName", "name", "val"].includes(groupBy)) {
                    finalRepData = _.groupBy(finalRepData, v => v[groupBy])
                    if (VAL({ string: pickProperty }) && ["fullName", "attrName", "name", "obj", "val"].includes(pickProperty))
                        finalRepData = _.mapObject(finalRepData, v => _.map(v, vv => vv[pickProperty]))
                } else if (VAL({ string: pickProperty }) && ["fullName", "attrName", "name", "obj", "val"].includes(pickProperty)) {
                    finalRepData = _.map(finalRepData, v => v[pickProperty])
                }
            }
            return finalRepData
        }, getRepStat = (charRef, section, rowFilter, statName, isSilent = false) => getRepStats(charRef, section, rowFilter, statName, null, null, isSilent)[0],
        getPlayerID = (playerRef, isSilent = false) => {
            TRACE.push("getPlayerID")
            // Returns a PLAYER ID given: display name, token object, character reference.
            let playerID = null
            try {
                if (VAL({object: playerRef}) && playerRef.get("_type") === "player") {
                    DB(`PlayerRef identified as Player Object: ${D.JS(playerRef, true)}<br><br>... returning ID: ${playerRef.id}`, "getPlayerID")
                    removeFirst(TRACE, "getPlayerID")
                    return playerRef.id
                }
                if (VAL({ char: playerRef })) {
                    const charObj = getChar(playerRef, true)
                    playerID = _.filter(charObj.get("controlledby").split(","), v => v !== "all")
                    DB(`PlayerRef identified as Character Object: ${D.JS(charObj.get("name"))}... "controlledby": ${D.JS(playerID)}`, "getPlayerID")
                    if (playerID.length > 1 && !isSilent)
                        THROW(`WARNING: Finding MULTIPLE player IDs connected to character reference '${jStr(playerRef)}': ${jStr(playerID)}`, "getPlayerID")
                    removeFirst(TRACE, "getPlayerID")
                    return playerID[0]
                }
                if (VAL({ string: playerRef })) {
                    DB(`PlayerRef identified as String: ${D.JS(playerRef)}`, "getPlayerID")
                    if (getObj("player", playerRef)) {
                        DB(`... String is Player ID. Returning ${D.JS(getObj("player", playerRef).id)}`, "getPlayerID")
                        return getObj("player", playerRef).id
                    } else if (findObjs({
                        _type: "player",
                        _displayname: playerRef
                    }, {caseInsensitive: true}).length > 0) {
                        DB(`... String is DISPLAY NAME. Found ${findObjs({
                            _type: "player",
                            _displayname: playerRef
                        }, {caseInsensitive: true}).length} Players.`, "getPlayerID")
                        return findObjs({
                            _type: "player",
                            _displayname: playerRef
                        }, {caseInsensitive: true})[0].id
                    } else if (findObjs({
                        _type: "player",
                        speakingas: playerRef
                    }, {caseInsensitive: true}).length > 0) {
                        DB(`... String is SPEAKING AS. Found ${findObjs({
                            _type: "player",
                            speakingas: playerRef
                        }, {caseInsensitive: true}).length} Players.`, "getPlayerID")
                        return findObjs({
                            _type: "player",
                            speakingas: playerRef
                        }, {caseInsensitive: true})[0].id
                    } else if (findObjs({
                        _type: "player",
                        _d20userid: playerRef
                    }, {caseInsensitive: true}).length > 0) {
                        DB(`... String is _d20userid. Found ${findObjs({
                            _type: "player",
                            _d20userid: playerRef
                        }, {caseInsensitive: true}).length} Players.`, "getPlayerID")
                        return findObjs({
                            _type: "player",
                            _d20userid: playerRef
                        }, {caseInsensitive: true})[0].id
                    }
                    return isSilent ? false : THROW(`Unable to find player connected to reference '${jStr(playerRef)}'`, "getPlayerID")
                }
                removeFirst(TRACE, "getPlayerID")
                return isSilent ? false : THROW(`Unable to find player connected to character token '${jStr(playerRef)}'`, "getPlayerID")
            } catch (errObj) {
                removeFirst(TRACE, "getPlayerID")
                return isSilent ? false : THROW(`Unable to find player connected to reference '${jStr(playerRef)}'.<br><br>${jStr(errObj)}`, "getPlayerID")
            }
        },
        getPlayer = (playerRef, isSilent = false) => {
            TRACE.push("getPlayer")
            let playerID = getPlayerID(playerRef, true)
            DB(`Searching for Player with Player Ref: ${playerRef}
                ... playerID: ${jStr(playerID)}
                .. String? ${VAL({string: playerID})}
                .. Player Object? ${jStr(getObj("player", playerID))}`, "getPlayer")
            if (VAL({ string: playerID }) && VAL({ object: getObj("player", playerID) })) {
                removeFirst(TRACE, "getPlayer")
                return getObj("player", playerID)
            }
            removeFirst(TRACE, "getPlayer")
            return isSilent ? false : THROW(`Unable to find a player object for reference '${jStr(playerRef)}`, "getPlayer")
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
        setRepStats = (charRef, section, rowID, statList, isSilent = false) => {
            const charObj = getChar(charRef, isSilent)
            if (VAL({ char: [charObj], string: [section], list: [statList] }, "setRepAttrs", true)) {
                const attrList = {}
                _.each(statList, (value, statName) => {
                    attrList[`repeating_${section}_${rowID}_${statName}`] = value
                })
                setAttrs(charObj.id, attrList)
            }
        }, setRepStat = (charRef, section, rowID, statName, statValue, isSilent = false) => setRepStats(charRef, section, rowID, { [statName]: statValue }, isSilent)
    // #endregion

    // #region Repeating Section Manipulation
    const parseRepStat = (repRef) => {
            const repStatName = VAL({ object: repRef }) ? repRef.get("name") : repRef
            if (VAL({ repname: repStatName })) {
                const nameParts = repStatName.split("_")
                nameParts.shift()
                return [nameParts.shift(), nameParts.shift(), nameParts.join("_")]
            }
            return [repStatName, repStatName, repStatName]
        },
        makeRepRow = (charRef, secName, attrs) => {            
            DB(`CharRef: ${D.JS(charRef)}, secName: ${secName}, Attrs: ${D.JS(attrs, true)}`, "makeRepRow")
            const IDa = 0,
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
                    DB(`Making Row Object: Name: ${prefix + k}, CharID: ${charID}`, "makeRepRow")
                    createObj("attribute", {
                        name: prefix + k,
                        max: "",
                        _characterid: charID,
                        current: v
                    })
                } else {
                    THROW(`Failure at makeRepRow(charRef, ${D.JSL(secName)}, ${D.JSL(attrs)})<br>...Prefix (${D.JSL(prefix)}) + K (${D.JSL(k)}) is NOT A STRING)`, "makeRepRow")
                }
            })
            //DB(`Setting Attributes: ${D.JS(attrList, true)}`, "makeRepRow")
            //setAttrs(charID, attrList)

            return rowID
        },
        deleteRepRow = (charRef, secName, rowID) => {
            if (VAL({char: [charRef], string: [secName, rowID]}, "deleteRepRow", true)) {
                const attrObjs = getRepStats(charRef, secName, rowID, null, null, "obj")
                DB(`AttrObjs to Delete: ${jStr(attrObjs, true)}`, "deleteRepRow")
                if (attrObjs.length === 0)
                    return THROW(`No row "repeating_${secName}_${rowID}" to delete for ${D.GetName(charRef)}.`, "deleteRepRow")
                _.each(attrObjs, v => v.remove())
                return true
            }
            return false
        },
        copyToRepSec = (charRef, sourceSec, sourceRowID, targetSec) => {
            const attrList = kvpMap(getRepStats(charRef, sourceSec, sourceRowID), (k, v) => v.name, v => v.val)
            DB(`CharRef: ${D.JS(charRef)}, SourceSec: ${sourceSec}, RowID: ${sourceRowID}, TargetSec: ${targetSec}<br>... AttrList: ${D.JS(attrList, true)}`, "copyToRepSec")
            makeRepRow(charRef, targetSec, attrList)
            deleteRepRow(charRef, sourceSec, sourceRowID)
        },
        sortRepSec = (charRef, secName, sortTrait, isDescending = false, transformFunc = v => v) => {
            const rowIDs = getRepIDs(charRef, secName),
                rowData = []
            //let dbString = ""
            for (const rowID of rowIDs) {
                //dbString += `<br><br><b>${rowID}</b><br>`
                const rowAttrData = getRepStats(charRef, secName, rowID),
                    theseVals = {rowID: rowID}
                for (const statData of rowAttrData)
                    theseVals[statData.attrName] = statData.val
                    //dbString += `... ${D.JS(statData.attrName, true)}: ${D.JS(theseVals[statData.attrName])}<br>`                
                theseVals.SORTER = transformFunc(theseVals[sortTrait])
                //dbString += `... SORTER: ${D.JS(theseVals.SORTER)}<br>`
                rowData.push(theseVals)
            }
            for (const rowID of rowIDs)                
                deleteRepRow(charRef, secName, rowID)
            //D.Alert(dbString, "sortRepSec")
            //D.Alert(D.JS(rowData, true), "sortRepSec")
            const sortedData = _.sortBy(rowData, "SORTER")
            if (isDescending)
                sortedData.reverse()
            //D.Alert(D.JS(sortedData, true), "sortRepSec")
            for (let i = 0; i < sortedData.length; i++) {
                const attrList = _.omit(sortedData[i], "SORTER", "rowID")
                makeRepRow(charRef, secName, attrList)                
            }
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

        get PAGEID() { return VALS.PAGEID() },
        get CELLSIZE() { return VALS.CELLSIZE() },

        CHARWIDTH: STATEREF.CHARWIDTH,
        JS: jStr, JSL: jStrL, JSH: jStrH, JSC: jStrC,
        NumToText: numToText, TextToNum: textToNum,
        Ordinal: ordinal,
        Capitalize: capitalize,

        Chat: sendChatMessage,
        Alert: sendToGM,

        RemoveFirst: removeFirst,
        KeyMapObj: kvpMap,
        ParseToObj: parseToObj,

        LooseMatch: looseMatch, // more strict than fuzzyMatch: case-insensitive matching but everything else is still required
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
        GetChars: getChars, GetChar: getChar, GetCharData: getCharData, GetCharVals: getCharsProps,
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