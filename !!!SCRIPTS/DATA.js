void MarkStart("DATA")
/* DATA.js, "DATA".  Exposed as "D" in the API sandbox.
   >>> DATA is both a library of handy resources for other scripts to use, and a master configuration file for your
   game.  You can find a list of all of the available methods at the end of the script.  Configuration is a bit
   trickier, but is contained in the CONFIGURATION and DECLARATIONS #regions. */

const D = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "DATA",

    // #region COMMON INITIALIZATION
        STATEREF = C.ROOT[SCRIPTNAME],	// eslint-disable-line no-unused-vars
        VAL = (varList, funcName, isArray = false) => D.Validate(varList, funcName, SCRIPTNAME, isArray), // eslint-disable-line no-unused-vars
        DB = (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        LOG = (msg, funcName) => D.Log(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        THROW = (msg, funcName, errObj) => D.ThrowError(msg, funcName, SCRIPTNAME, errObj), // eslint-disable-line no-unused-vars

        checkInstall = () => {
            C.ROOT[SCRIPTNAME] = C.ROOT[SCRIPTNAME] || {}
            initialize()
        },
    // #endregion

    // #region LOCAL INITIALIZATION
        initialize = () => {
            STATEREF.WATCHLIST = STATEREF.WATCHLIST || []
            STATEREF.BLACKLIST = STATEREF.BLACKLIST || []
            STATEREF.CHARWIDTH = STATEREF.CHARWIDTH || {}
            STATEREF.DEBUGLOG = STATEREF.DEBUGLOG || []

        // Initialize STATSDICT Fuzzy Dictionary
            STATEREF.STATSDICT = Fuzzy.Fix()
            for (const str of [
                ..._.flatten(_.values(C.ATTRIBUTES)),
                ..._.flatten(_.values(C.SKILLS)),
                ...C.DISCIPLINES,
                ...C.TRACKERS,
                ...C.MISCATTRS
            ])
                STATEREF.STATSDICT.add(str)

        // Initialize PCDICT Fuzzy Dictionary and PCLIST Strict Lookup
            STATEREF.PCDICT = Fuzzy.Fix()
            STATEREF.PCLIST = []
            for (const name of _.values(Char.REGISTRY).map(x => x.name)) {
                STATEREF.PCDICT.add(name)
                STATEREF.PCLIST.push(name)
            }

        // Initialize NPCDICT Fuzzy Dictionary
            STATEREF.NPCDICT = Fuzzy.Fix()
            STATEREF.NPCLIST = []
            for (const name of getChars("all").map(x => x.get("name")).filter(x => !_.values(Char.REGISTRY).map(xx => xx.name).includes(x))) {
                STATEREF.NPCDICT.add(name)
                STATEREF.NPCLIST.push(name)
            }
        },
    // #endregion	

    // #region EVENT HANDLERS: (HANDLEINPUT)
        onChatCall = (call, args, objects, msg) => { 	// eslint-disable-line no-unused-vars
            switch (call) {
                case "!data": {
                    switch (call = (args.shift() || "").toLowerCase()) {
                        case "add": case "set": {
                            switch(call = (args.shift() || "").toLowerCase()) {
                                case "blacklist":
                                    setBlackList(args)
                                    break
                                case "watch": case "dbwatch": case "watchlist":
                                    setWatchList(args)
                                    break
                        // no default
                            }
                            break
                        }
                        case "get": {
                            switch(call = (args.shift() || "").toLowerCase()) {
                                case "blacklist":
                                    sendToGM(getBlackList(), "DEBUG BLACKLIST")
                                    break
                                case "watch": case "dbwatch": case "watchlist":
                                    sendToGM(getWatchList(), "DEBUG SETTINGS")
                                    break
                                case "debug": case "log": case "dblog":
                                    getDebugRecord()
                                    break
                        // no default
                            }
                            break
                        }
                        case "clear": case "reset": {
                            switch(call = (args.shift() || "").toLowerCase()) {
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
                        // no default
                            }
                            break
                        }
                        case "refresh": {
                            switch(call = (args.shift() || "").toLowerCase()) {
                                case "shortnames": {
                                    refreshShortNames()
                                    break
                                }
                                case "tokensrcs": {
                                    refreshShortNames()
                                    const srcData = {}
                                    for (const charObj of D.GetChars("all")) {
                                        const nameKey = getName(charObj, true)
                                        charObj.get("_defaulttoken", function(defToken) {
                                            const imgMatch = D.JS(defToken).match(/imgsrc:(.*?),/u)
                                            if (imgMatch && imgMatch.length)
                                                srcData[nameKey] = imgMatch[1].replace(/med\.png/gu, "thumb.png")
                                        })
                                    }
                                    setTimeout(() => {
                                        state[C.GAMENAME].Media.TokenSrcs = {}
                                        for (const srcRef of _.keys(srcData))
                                            state[C.GAMENAME].Media.TokenSrcs[srcRef] = srcData[srcRef]
                                        D.Alert(`Finished! Media Token Sources updated to:<br><br>${D.JS(state[C.GAMENAME].Media.TokenSrcs)}`, "!data refresh tokensrcs")
                                    }, 2000)
                                    break
                                }
                            // no default
                            }
                        }
                // no default
                    }
                    break
                }
                case "!reply": {
                    if (args.length) 
                        receivePrompt(args.join(" "))
                    else
                        receivePrompt("")
                    break
                }
            // no default
            }               
        }
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    let [PROMPTFUNC, PROMPTCLOCK] = [null, false]
    // #region DECLARATIONS: Reference Variables, Temporary Storage Variables
    const VALS = {
            PAGEID: () => Campaign().get("playerpageid"),
            CELLSIZE: () => C.PIXELSPERSQUARE * getObj("page", Campaign().get("playerpageid")).get("snapping_increment")
        },
        FunctionQueue = [],
    // #endregion

    // #region DECLARATIONS: Dependent Variables
        ALLSTATS = [
            ..._.flatten(_.values(C.ATTRIBUTES)),
            ..._.flatten(_.values(C.SKILLS)),
            ...C.DISCIPLINES,
            ...C.TRACKERS
        ],
    // #endregion

    // #region ASYNC FUNCTION HANDLING: Function Queing, Running
    /* const $binCheck = (tracker) => {        
        switch (tracker.toLowerCase()) {
            case "health": break
            default:
                return false
        }
        return cback => {
            getAttrs(attrs, ATTRS => {
                cback(null, attrList)
            })
        }
    },
    doTracker = (tracker, eInfo = {sourceAttribute: ""}, cback) => {
        const attrList = {},
            $funcs = []
        switch (tracker.toLowerCase()) {
            case "health":
            case "willpower":
                $funcs.push($binCheck(tracker))
                break
            case "blood potency":
                $funcs.push(cbk => { getAttrs(["clan", "blood_potency"], ATTRS => { cbk(null, attrList) }) } )
                break
            case "humanity":
                $funcs.push(cbk => { getAttrs(["stains", "humanity", "incap"], ATTRS => { cbk(null, attrList) }) } )
                break
            default: return
        }
        $funcs.push($set)
        run$($funcs, cback ? () => cback(null) : undefined)
    },
    $doTracker = (tracker, eInfo) => cback => doTracker(tracker, eInfo, cback), */
        queueFunc = (func, args = [], waitSecs = 3) => {
            // D.Alert(`QueFunc: ${D.JS(func)}, ${D.JS(args)}`)
            try {
                if (_.isUndefined(func) || _.isUndefined(args)) {
                    D.Alert(`Either func or args is undefined: ${D.JS(func)}, ${D.JS(args)}`)
                } else if (!_.isFunction(func)) {
                    D.Alert(`${D.JS(func)} with args ${D.JS(args)} is not a function!`, "queueFunc")
                } else {
                    const funcWrapper = (cback) => {
                        func(...args)
                        setTimeout(cback, waitSecs * 1000)
                    }
                    FunctionQueue.push(funcWrapper)
                }
            } catch (errObj) {
                D.Alert(`QueFunc Error on ${D.JS(func)}, ${D.JS(args)}`)
            }
        },
        runFuncQueue = (cback) => {
            let current = 0
            const done = (empty, ...args) => {
                    const end = () => {
                        const newArgs = args ? [].concat(empty, args) : [empty]
                        if (cback)
                            cback(...newArgs)
                    }
                    end()
                },
                each = (empty, ...args) => {
                    if (++current >= FunctionQueue.length || empty)
                        done(empty, args)
                    else
                        FunctionQueue[current].apply(undefined, [].concat(args, each))
                }

            if (FunctionQueue.length) {
                FunctionQueue[0](each)
            } else {
                done(null)
                FunctionQueue.length = 0
            }
        },
    // #endregion

    // #region PARSING & STRING MANIPULATION: Converting data types to strings, formatting strings, converting strings into objects.
        jStr = (data, isVerbose = false) => {
        /* Parses a value of any type via JSON.stringify, and then further styles it for display either
          in Roll20 chat, in the API console log, or both. */
            try {
                const typeColor = type => {
                        switch ((type || "").toLowerCase()) {
                            case "character": return C.COLORS.yellow
                            case "graphic": return C.COLORS.palegreen
                            case "text": return C.COLORS.paleblue
                            case "player": return C.COLORS.palepurple
                            default: return C.COLORS.palegrey
                        }
                    }, 
                    replacer = (k, v) => {
                        let returnVal = v
                        if (!isVerbose && (
                            k.slice(0, 3).toLowerCase() === "obj" ||
                            v && (v.get || v._type)
                        )) {
                            const type = v.get && v.get("_type") || v._type || "O"
                            let name = v.get && v.get("name") || v.name || "(Unnamed)"
                            if (name === "(Unnamed)" && type === "text") {
                                const textString = v.get && v.get("text")
                                if (textString.length > 15)
                                    name = `${textString.slice(0, 15)}...`
                                else if (textString)
                                    name = textString
                            }
                            returnVal = `@@NAMESTART${typeColor(type)}@@${name}@@NAMEEND@@`
                            // returnVal = `<b>&lt;OBJ: ${v.get && v.get("name") || v.name || v.get && v.get("_type") || v._type}&gt;</b>`
                        } else if (_.isUndefined(v)) {
                            returnVal = "<b>&lt;UNDEFINED&gt;</b>"
                        } else if (_.isNull(v)) {
                            returnVal = "<b>NULL</b>"
                        } else if (_.isNaN(v)) {
                            returnVal = "<b>&lt;NaN&gt;</b>"
                        } else if (_.isFunction(v)) {
                            returnVal = "<b>&lt;FUNCTION&gt;</b>"
                        } else if (_.isArray(v)) {
                            if (v.join("").length < 100)
                                returnVal = `[ ${v.map(x => replacer(k, x)).join(", ")} ]`.replace(/\[\s+\]/gu, "[]")
                            else
                                returnVal = `[ ${v.map(x => replacer(k, x))} ]`
                        } else if (_.isObject(v) && JSON.stringify(v).length < 100) {
                            const listDelver = (list) => {
                                const returns = []
                                for (const key of _.keys(list))
                                    returns.push(`${key}: ${replacer(key, list[key])}`.replace(/\s\s*/gu, " "))
                                // returns.push(`${key}: ${_.isObject(list[key]) || _.isArray(list[key]) ? listDelver(list[key]) : replacer(key, list[key])}`)
                                    // (_.isString(list[key]) && `"${list[key]}"` : list[key].toString()}"`}}`)
                                return `{ ${returns.join(", ")} }`.replace(/\{\s+\}/gu, "{}")
                            }
                            returnVal = listDelver(v)
                        } else if (_.isNumber(v)) {
                            returnVal = v.toString()
                        } else if (_.isString(v)) {
                            returnVal = `&quot;${v}&quot;`
                        }
                        if (_.isString(returnVal) && !returnVal.includes("<div") && !returnVal.includes("<span"))
                            returnVal = returnVal.replace(/"/gu, "") // Removes all double-quotes from non-HTML coded strings.
                        if (_.isString(returnVal))
                            returnVal = `${returnVal}`.
                                replace(/[\t\\]/gu, ""). // Strips tabs and escape slashes.
                                replace(/\n/gu, "<br/>"). // Converts line breaks into HTML breaks.
                                replace(/(\s)\s+/gu, "$1"). // Removes excess whitespace.            
                                replace(/(^"*|"*$)/gu, "") // Removes quotes from beginning and end of string.  
                        return returnVal 
                    },

                    finalString = JSON.stringify(data, replacer, 4).
                        replace(/"\{/gu, "{").replace(/\}"/gu, "}").
                        replace(/(\s*?)"([^"]*?)"\s*?:/gu, "$1$2:"). // Removes quotes from keys of a list or object.
                        replace(/ (?= )/gu, "&nbsp;"). // Replaces any length of whitespace with one '&nbsp;'
                        replace(/@T@/gu, "&nbsp;&nbsp;&nbsp;&nbsp;"). // Converts custom '@T@' tab character to four spaces
                        replace(/"\[/gu, "[").replace(/\]"/gu, "]"). // Removes quotes from around array strings.
                        replace(/\\"/gu, "\""). // Escapes quote marks                
                        replace(/(^"*|"*$)/gu, ""). // Removes quote marks from the beginning and end of the string  
                        replace(/>&quot;/gu, ">").replace(/&quot;</gu, "<"). // Removes quotes from within entire HTML tags.
                        replace(/&amp;quot;/gu, "\"").
                        replace(/&quot;\/w/gu, "/w"). // Fix whisper.
                        replace(/@@NAMESTART(.*?)@@/gu, "<span style=\"background-color: $1;\"><b>&lt;</b>").
                        replace(/@@NAMEEND@@/gu, "<b>&gt;</b></span>")

                return finalString// .replace(/@B@/gu, "<b>").replace(/@b@/gu, "</b>") // Encodes bolding from replacer function.  
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

            return jStr(VAL({string: data}) ? data.replace(/<br\/?>/gu, "<br>") : data).
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
        parseParams = (args, delim = " ") => _.object((VAL({array: args}) ? args.join(" ") : args).split(new RegExp(`,?${delim}+`, "gu")).filter(x => x.includes(":")).map(x => x.trim().split(":"))),
        parseCharSelect = (call, args) => {                
            let charObjs, charIDString
            if (["registered", "sandbox", "pcs", "npcs"].includes(call.toLowerCase())) {
                charObjs = getChars(call)
                charIDString = call.toLowerCase()
            } else {
                charObjs = _.compact(call.split(",").map(x => getObj("character", x.trim())))     
                charIDString = call
            }  
            if (VAL({charObj: charObjs}, null, true)) {
                // D.Alert("Characters Found!")
                call = args[0] ? args.shift() : call
            } else {
                charObjs = undefined
                charIDString = ""
            }
            // D.Alert(`${(charObjs || []).length} Characters Retrieved: ${(charObjs || []).map(x => D.GetName(x)).join("<br>")}<br>Call: ${call}<br>Args: ${args.join(" ")}`)
            return [charObjs, charIDString, call, args]
        },
        summarizeHTML = (htmlString = "") => ((htmlString.match(/.*?>([^<>]+)<.*?/g) || [""]).pop().match(/.*?>([^<>]+)<.*?/) || [""]).pop(),
        numToText = (num, isTitleCase = false) => {
            const numString = `${jStr(num)}`,
                parseThreeDigits = v => {
                    const digits = _.map(v.toString().split(""), vv => parseInt(vv))
                    let result = ""                        
                    if (digits.length === 3) {
                        const hundreds = digits.shift()
                        result += hundreds > 0 ? `${C.NUMBERWORDS.low[hundreds] } hundred` : ""
                        if (digits[0] + digits[1] > 0)
                            result += " and "
                        else
                            return result.toLowerCase()
                    }
                    if (parseInt(digits.join("")) <= C.NUMBERWORDS.low.length)
                        result += C.NUMBERWORDS.low[parseInt(digits.join(""))]
                    else
                        result += C.NUMBERWORDS.tens[parseInt(digits.shift())] + (parseInt(digits[0]) > 0 ? `-${ C.NUMBERWORDS.low[parseInt(digits[0])]}` : "")
                    return result.toLowerCase()
                },
                isNegative = numString.charAt(0) === "-",
                [integers, decimals] = numString.replace(/[,|\s|-]/gu, "").split("."),
                intArray = _.map(integers.split("").reverse().join("").match(/.{1,3}/g), v => v.split("").reverse().join("")).reverse(),
                [intStrings, decStrings] = [[], []]
            while (intArray.length)
                intStrings.push(`${parseThreeDigits(intArray.shift())} ${C.NUMBERWORDS.tiers[intArray.length]}`.toLowerCase().trim())
            if (VAL({number: decimals})) {
                decStrings.push(" point")
                for (const digit of decimals.split(""))
                    decStrings.push(C.NUMBERWORDS.low[parseInt(digit)])
            }
            return capitalize((isNegative ? "negative " : "") + intStrings.join(", ") + decStrings.join(" "), isTitleCase)
        },
        textToNum = (num) => {
            const [tenText, oneText] = num.split("-")
            if (VAL({string: tenText}, "textToNum"))
                return Math.max(0, _.indexOf(_.map(C.NUMBERWORDS.tens, v => v.toLowerCase()), tenText.toLowerCase()) * 10, _.indexOf(_.map(C.NUMBERWORDS.low, v => v.toLowerCase()), tenText.toLowerCase())) +
                    VAL({string: oneText}) ? Math.max(0, _.indexOf(_.map(C.NUMBERWORDS.low, v => v.toLowerCase()), oneText.toLowerCase())) : 0
            return 0
        },
        ordinal = (num, isFullText = false) => {
            /* Converts any number by adding its appropriate ordinal ("2nd", "3rd", etc.) */
            if (isFullText) {
                const [numText, suffix] = numToText(num).match(/.*?[-|\s](\w*?)$/u)
                return numText.replace(new RegExp(`${suffix }$`, "u"), "") + C.ORDINALSUFFIX[suffix] || `${suffix }th`
            }
            const tNum = parseInt(num) - 100 * Math.floor(parseInt(num) / 100)
            if ([11, 12, 13].includes(tNum))
                return `${num}th`

            return `${num}${["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][num % 10]}`
        },
        capitalize = (str, isTitleCase = false) => {
            if (VAL({string: str}, "capitalize"))
                if (isTitleCase)
                    return _.map(_.map(str.split(" "), v => v.slice(0, 1).toUpperCase() + v.slice(1)).join(" ").split("-"), v => v.slice(0, 1).toUpperCase() + v.slice(1)).join("-").replace(/And/gu, "and")
                else
                    return str.slice(0, 1).toUpperCase() + str.slice(1)
            THROW(`Attempt to capitalize non-string '${jStr(str)}'`, "capitalize")
            return str
        },
        clone = (obj) => {
            if (_.isObject(obj) && _.keys(obj).length) {
                const objToString = JSON.stringify(obj)
                if (_.isString(objToString))
                    return JSON.parse(objToString)
            }
            return {}
        },
    // #endregion

    // #region CHAT MESSAGES: Formatting and sending chat messages to players & Storyteller
        formatTitle = (funcName, scriptName, prefix = "") => `[${prefix}${VAL({string: funcName}) || VAL({string: scriptName}) ? " " : ""}${VAL({string: scriptName}) ? `${scriptName.toUpperCase()}` : ""}${VAL({string: [scriptName, funcName]}, null, true) ? ": " : ""}${funcName || ""}]`,
        formatLogLine = (msg, funcName, scriptName, prefix = "", isShortForm = false) => `${formatTitle(funcName, scriptName, prefix)} ${jStrL(msg, isShortForm, true)}`,
        sendChatMessage = (who, message = "", title) => {
            /* Whispers chat message to player given: display name OR player ID. 
                If no Title, message is sent without formatting. */
            const player = getPlayer(who) || who,
                html = title ? jStrH(C.CHATHTML.alertHeader(title) + C.CHATHTML.alertBody(jStr(message))) : message
            if (player === "all" || !player)
                sendChat("", html)
            else if (Session.IsTesting)
                sendChat("", `/w Storyteller ${html}`)
            else
                sendChat("", `/w "${player.get("_displayname")}" ${html}`)
                
        },
        sendToGM = (msg, title = "[ALERT]") => sendChatMessage("Storyteller", msg, title),
        promptGM = (menuHTML, replyFunc) => {
            if (VAL({string: menuHTML, func: replyFunc}, "promptGM")) {
                if (TimeTracker.IsClockRunning) {
                    DB(`Time Running: Stopping Clock at ${D.JS(TimeTracker.CurrentDate)}`, "promptGM")
                    STATEREF.PROMPTCLOCK = true
                    TimeTracker.StopClock()
                }
                Roller.Lock(true)
                sendChatMessage(getGMID(), menuHTML)
                PROMPTFUNC = replyFunc
            }
        },
        receivePrompt = replyString => {
            if (VAL({string: replyString, function: PROMPTFUNC}, "receivePrompt")) {
                PROMPTFUNC(replyString)
                PROMPTFUNC = null
                if (STATEREF.PROMPTCLOCK) {
                    TimeTracker.StartClock()
                    STATEREF.PROMPTCLOCK = false
                }
                Roller.Lock(false)
            }
        },
    // #endregion

    // #region OBJECT MANIPULATION: Manipulating arrays, mapping objects
        kvpMap = (obj, kFunc, vFunc) => {
            const newObj = {}
            _.each(obj, (v, k) => { newObj[kFunc ? kFunc(k, v) : k] = vFunc ? vFunc(v, k) : v })
            return newObj
        },
        removeFirst = (array, element) => array.splice(array.findIndex(v => v === element)),
        parseToObj = val => {
            /* Converts an array or comma-delimited string of parameters ("key:val, key:val, key:val") into an object. */
            const [obj, args] = [{}, []]
            if (VAL({string: val}))
                args.push(...val.split(/,\s*?/ug))
            else if (VAL({array: val}))
                args.push(...val)
            else
                return THROW(`Cannot parse value '${jStrC(val)}' to object.`, "parseToObj")

            for (const kvp of _.map(args, v => v.split(/\s*:\s*(?!\/)/u)))
                obj[kvp[0].toString().trim()] = parseInt(kvp[1]) || kvp[1]
            return obj
        },
    // #endregion

    // #region SEARCH & VALIDATION: Match checking, Set membership checking, type validation. 
        looseMatch = (first, second) => {
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
        isInExact = (needle, haystack = ALLSTATS) => {
            // D.Alert(JSON.stringify(haystack))
            // Looks for needle in haystack using fuzzy matching, then returns value as it appears in haystack. 
            try {
                // STEP ZERO: VALIDATE NEEDLE & HAYSTACK
                      // NEEDLE --> Must be STRING
                      // HAYSTACK --> Can be ARRAY, LIST or STRING 
                if (VAL({string: needle}) || VAL({number: needle})) {
                    // STEP ONE: BUILD HAYSTACK.
                        // HAYSTACK = ARRAY? --> HAY = ARRAY
                        // HAYSTACK = LIST? ---> HAY = ARRAY (_.keys(H))
                        // HAYSTACK = STRING? -> HAY = H
                    
                    if (haystack && haystack.gramSizeLower)
                        return isIn(needle, haystack)
                    const hayType = VAL({array: haystack}) && "array" ||
                                    VAL({list: haystack}) && "list" ||
                                    VAL({string: haystack}) && "string"                             
                    let ndl = needle.toString(),
                        hay, match
                    switch (hayType) {
                        case "array":
                            hay = [...haystack]
                            break
                        case "list":
                            hay = _.keys(haystack)
                            break
                        case "string":
                            hay = haystack
                            break
                        default:
                            return THROW(`Haystack must be a string, a list or an array (${typeof haystack}): ${JSON.stringify(haystack)}`, "IsIn")
                    }
                    // STEP TWO: SEARCH HAY FOR NEEDLE USING PROGRESSIVELY MORE FUZZY MATCHING. SKIP "*" STEPS IF ISFUZZYMATCHING IS FALSE.
                            // STRICT: Search for exact match, case sensitive.
                            // LOOSE: Search for exact match, case insensitive.
                            // *START: Search for match with start of haystack strings, case insensitive.
                            // *END: Search for match with end of haystack strings, case insensitive.
                            // *INCLUDE: Search for match of needle anywhere in haystack strings, case insensitive.
                            // *REVERSE INCLUDE: Search for match of HAYSTACK strings inside needle, case insensitive.
                            // FUZZY: Start again after stripping all non-word characters. 
                    if (hayType === "array" || hayType === "list") {
                        for (let i = 0; i <= 1; i++) {
                            let thisNeedle = ndl,
                                thisHay = hay
                            match = _.findIndex(thisHay, v => thisNeedle === v) + 1 // Adding 1 means "!match" passes on failure return of -1.
                            if (match) break                            
                            thisHay = _.map(thisHay, v => (v || v === 0) && (VAL({string: v}) || VAL({number: v}) ? v.toString().toLowerCase() : v) || "§¥£")
                            thisNeedle = thisNeedle.toString().toLowerCase()
                            match = _.findIndex(thisHay, v => thisNeedle === v) + 1
                            if (match) break
                            // Now strip all non-word characters and try again from the top.
                            ndl = ndl.replace(/\W+/gu, "")
                            hay = _.map(hay, v => VAL({string: v}) || VAL({number: v}) ? v.toString().replace(/\W+/gu, "") : v)
                        }
                        return match && hayType === "array" ? haystack[match - 1] : haystack[_.keys(haystack)[match - 1]]
                    } else {
                        for (let i = 0; i <= 1; i++) {
                            match = hay === ndl && ["", hay]
                            if (match) break
                            const thisNeedleRegExp = new RegExp(`^(${ndl})$`, "iu")
                            match = hay.match(thisNeedleRegExp)
                            if (match) break
                            // Now strip all non-word characters and try again from the top.
                            ndl = ndl.replace(/\W+/gu, "")
                            hay = hay.replace(/\W+/gu, "")
                        }
                        return match && match[1]
                    }
                }
                return THROW(`Needle must be a string: ${D.JS(needle)}`, "isIn")
            } catch (errObj) {
                return THROW(`Error locating '${D.JSL(needle)}' in ${D.JSL(haystack)}'`, "isIn", errObj)
            }
        },
        isIn = (needle, haystack, isExact = false) => {
            let dict
            if (isExact)
                return isInExact(needle, haystack)
            if (!haystack) {
                dict = STATEREF.STATSDICT
            } else if (haystack.add) {
                dict = haystack
            } else {
                dict = Fuzzy.Fix()
                for (const str of haystack)
                    dict.add(str)
            }
            const result = dict.get(needle)
            return result && result[0][1]
        },
        /* eslint-disable-next-line no-unused-vars */
        /* isntIn = (needle, haystack = ALLSTATS, isFuzzyMatching = true) => {
            // Looks for needle in haystack using fuzzy matching, then returns value as it appears in haystack. 
            try {
                // STEP ZERO: VALIDATE NEEDLE & HAYSTACK
                      // NEEDLE --> Must be STRING
                      // HAYSTACK --> Can be ARRAY, LIST or STRING 
                if (VAL({string: needle}) || VAL({number: needle})) {
                    // STEP ONE: BUILD HAYSTACK.
                        // HAYSTACK = ARRAY? --> HAY = ARRAY
                        // HAYSTACK = LIST? ---> HAY = ARRAY (_.keys(H))
                        // HAYSTACK = STRING? -> HAY = H
                    const hayType = VAL({array: haystack}) && "array" ||
                                    VAL({list: haystack}) && "list" ||
                                    VAL({string: haystack}) && "string"                                    
                    let ndl = needle.toString(),
                        hay, match
                    switch (hayType) {
                        case "array":
                            hay = [...haystack]
                            break
                        case "list":
                            hay = _.keys(haystack)
                            break
                        case "string":
                            hay = haystack
                            break
                        default:
                            return THROW(`Haystack must be a string, a list or an array: ${D.JS(haystack)}`, "IsIn")
                    }
                    // STEP TWO: SEARCH HAY FOR NEEDLE USING PROGRESSIVELY MORE FUZZY MATCHING. SKIP "*" STEPS IF ISFUZZYMATCHING IS FALSE.
                            // STRICT: Search for exact match, case sensitive.
                            // LOOSE: Search for exact match, case insensitive.
                            // *START: Search for match with start of haystack strings, case insensitive.
                            // *END: Search for match with end of haystack strings, case insensitive.
                            // *INCLUDE: Search for match of needle anywhere in haystack strings, case insensitive.
                            // *REVERSE INCLUDE: Search for match of HAYSTACK strings inside needle, case insensitive.
                            // FUZZY: Start again after stripping all non-word characters. 
                    if (hayType === "array" || hayType === "list") {
                        for (let i = 0; i <= 1; i++) {
                            let thisNeedle = ndl,
                                thisHay = hay
                            match = _.findIndex(thisHay, v => thisNeedle === v) + 1 // Adding 1 means "!match" passes on failure return of -1.
                            if (match) break                            
                            thisHay = _.map(thisHay, v => (v || v === 0) && (VAL({string: v}) || VAL({number: v}) ? v.toString().toLowerCase() : v) || "§¥£")
                            thisNeedle = thisNeedle.toString().toLowerCase()
                            match = _.findIndex(thisHay, v => thisNeedle === v) + 1
                            if (match) break
                            if (isFuzzyMatching)
                                match = _.findIndex(thisHay, v => v.startsWith(thisNeedle)) + 1
                            if (match) break
                            if (isFuzzyMatching)
                                match = _.findIndex(thisHay, v => v.endsWith(thisNeedle)) + 1
                            if (match) break
                            if (isFuzzyMatching)
                                match = _.findIndex(thisHay, v => v.includes(thisNeedle)) + 1
                            if (match) break
                            if (isFuzzyMatching)
                                match = _.findIndex(thisHay, v => thisNeedle.includes(v)) + 1
                            if (match) break
                            // Now strip all non-word characters and try again from the top.
                            ndl = ndl.replace(/\W+/gu, "")
                            hay = _.map(hay, v => VAL({string: v}) || VAL({number: v}) ? v.toString().replace(/\W+/gu, "") : v)
                        }
                        return match && hayType === "array" ? haystack[match - 1] : haystack[_.keys(haystack)[match - 1]]
                    } else {
                        for (let i = 0; i <= 1; i++) {
                            match = hay === ndl && ["", hay]
                            if (match) break
                            let thisNeedleRegExp = new RegExp(`^(${ndl})$`, "iu")
                            match = hay.match(thisNeedleRegExp)
                            if (match) break
                            if (isFuzzyMatching) {
                                thisNeedleRegExp = new RegExp(`^(${ndl})`, "iu")
                                match = hay.match(thisNeedleRegExp) 
                            }
                            if (match) break                            
                            if (isFuzzyMatching) {
                                thisNeedleRegExp = new RegExp(`(${ndl})$`, "iu")
                                match = hay.match(thisNeedleRegExp) 
                            }
                            if (match) break                           
                            if (isFuzzyMatching) {
                                thisNeedleRegExp = new RegExp(`(${ndl})`, "iu")
                                match = hay.match(thisNeedleRegExp) 
                            }
                            if (match) break                           
                            if (isFuzzyMatching) {
                                let thisHayRegExp = new RegExp(`(${hay})`, "iu")
                                match = ndl.match(thisHayRegExp) 
                            }
                            if (match) break
                            // Now strip all non-word characters and try again from the top.
                            ndl = ndl.replace(/\W+/gu, "")
                            hay = hay.replace(/\W+/gu, "")
                        }
                        return match && match[1]
                    }
                }
                return THROW(`Needle must be a string: ${D.JS(needle)}`, "isIn")
            } catch (errObj) {
                return THROW(`Error locating '${D.JSL(needle)}' in ${D.JSL(haystack)}'`, "isIn", errObj)
            }
        }, */
        validate = (varList, funcName, scriptName, isArray = false) => {
            // NOTE: To avoid accidental recursion, DO NOT use validate to confirm a type within the getter of that type.
            //		(E.g do not use VAL{char} inside any of the getChar() functions.)
            const [errorLines, valArray, charArray] = [[], [], []]
            let detailsMsg
            if (_.isArray(funcName))
                [funcName, detailsMsg] = funcName
            _.each(varList, (val, cat) => {
                valArray.length = 0
                valArray.push(...isArray ? val : [val])
                if (isArray && valArray.length === 0)
                    errorLines.push("No values to check in array.")
                else
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
                                if (!_.isString(v) && !_.isNumber(v))
                                    errorLines.push(`Invalid string: ${jStr(v)}`)
                                break
                            case "func": case "function":
                                if (!_.isFunction(v))
                                    errorLines.push("Invalid function.")
                                break
                            case "bool": case "boolean":
                                if (v !== true && v !== false)
                                    errorLines.push(`Invalid boolean: ${jStr(v)}`)
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
                                if (_.isNaN((TimeTracker.GetDate(v) || {getTime: () => false}).getTime()))
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
                            case "playerchar": case "playercharref": case "pcref": case "pc":
                                if (!getChar(v, true))
                                    errorLines.push(`Invalid character reference: ${jStr(v && v.get && v.get("name") || v && v.id || v, true)}`)
                                else if (!_.values(Char.REGISTRY).map(x => x.id).includes(getChar(v, true).id))
                                    errorLines.push(`Character reference is not a player character: ${jStr(v && v.get && v.get("name") || v && v.id || v, true)}`)
                                break                                               
                            case "npc": case "npcref": case "spc": case "spcref":
                                if (!getChar(v, true))
                                    errorLines.push(`Invalid character reference: ${jStr(v && v.get && v.get("name") || v && v.id || v, true)}`)
                                else if (_.values(Char.REGISTRY).map(x => x.id).includes(getChar(v, true).id))
                                    errorLines.push(`Character reference is not a non-player character: ${jStr(v && v.get && v.get("name") || v && v.id || v, true)}`)
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
                                        errorLines.push(`Invalid trait: ${jStr(v && v.get && v.get("name") || v && v.id || v)} ON ${errorCheck.length}/${(varList && varList["char"] || []).length} character references:<br>${jStr(errorCheck)}`)
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
            if (errorLines.length) {
                if (!funcName || !scriptName)
                    return false
                if (detailsMsg)
                    return THROW(`[From ${jStr(scriptName).toUpperCase()}:${jStr(funcName)}]<br><b>MSG</b>: ${detailsMsg}<br>... ${errorLines.join("<br>... ")}`, "validate")
                return THROW(`[From ${jStr(scriptName).toUpperCase()}:${jStr(funcName)}]<br>... ${errorLines.join("<br>... ")}`, "validate")
            }
            return true
        },
        /*
        validate = (varList, funcName, scriptName, isArray = false) => {
            const [errorLines, valArray, charArray] = [[], [], []]
            _.each(varList, (val, cat) => {
                valArray.length = 0
                valArray.push(...isArray ? val : [val])
                if (isArray && valArray.length === 0)
                    errorLines.push("No values to check in array.")
                else
                    _.each(valArray, v => {
                        let charRefs = [],
                            errorCheck = null
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
                                if (!_.isString(v) && !_.isNumber(v))
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
                                if (!(_.isDate(v) || _.isDate(parseInt(v)))) {
                                    const splitDate = _.compact(v.split(/[\s,]+?/gu))
                                    if (!_.isDate(new Date(`${splitDate[2]}-${["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].indexOf(splitDate[0].slice(0, 3).toLowerCase()) + 1}-${splitDate[1]}`)))
                                        errorLines.push(`Invalid date reference: ${jStr(v && v.get && v.get("name") || v && v.id || v)}`)
                                }
                                break
                            case "msg": case "selection": case "selected":
                                if (!v || !v.selected || !v.selected[0])
                                    errorLines.push("Invalid selection: Select objects first!")
                                break
                            case "char": case "charref":
                            case "playerchar": case "playercharref": case "pcref": case "pc":
                            case "npc": case "npcref": case "spc": case "spcref": {
                                const charCounts = []
                                let vRef
                                try {
                                    if (v && v.selected && v.selected[0] && v.selected[0]._type === "graphic")
                                        vRef = getObj("graphic", v.selected[0]._id )
                                    else
                                        vRef = v
                                    if (vRef)
                                        if (vRef.get && vRef.get("_type") === "character")
                                            charRefs.push(vRef)
                                        else if (_.isString(vRef) && vRef.length)
                                            if (
                                                ["topleft", "botleft", "topright", "botright", "all", "registered", "sandbox"].includes(vRef.toLowerCase()) ||
                                                vRef.length === 1 && _.find(Char.REGISTRY, data => data.initial.toLowerCase() === vRef.toLowerCase())
                                            ) {
                                                charRefs.push(vRef)
                                            } else {
                                                charRefs.push(..._.compact([getObj("character", vRef)]))
                                                if (!charRefs.length) {
                                                    const allChars = findObjs({_type: "character"})
                                                    charRefs.push(...allChars.filter(x => x.get("name").toLowerCase() === vRef.toLowerCase()))                                                
                                                }
                                            }
                                        else if (vRef.get && vRef.get("represents"))
                                            charRefs.push(..._.compact([getObj("character", vRef.get("represents"))]))
                                    charCounts[0] = charRefs.length
                                } catch (errObj) {
                                    errorLines.push(`(val({${cat.toLowerCase()}: ${jStr(v && v.get && v.get("name") && `OBJ:${v.get("name")}` || v && v.id || v, true)} [${charCounts.join(", ")}]) <b>${errObj.name}</b>: ${errObj.message}`)
                                } finally {
                                    if (charRefs.length)
                                        switch(cat.toLowerCase()) {
                                            case "playerchar": case "playercharref": case "pcref": case "pc": {
                                                charRefs = _.uniq(charRefs.map(x => _.isString(x) && x.replace(/all/gu, "registered").replace(/sandbox/gu, "activepc") || x)).filter(x =>
                                                    _.isString(x) && ["topleft", "botleft", "topright", "botright", "registered", "activepc"].includes(x.toLowerCase()) ||
                                                    x.get && x.get("_type") === "character" && _.values(Char.REGISTRY).filter(xx => xx.id === x.id).length
                                                )
                                                charCounts[1] = charRefs.length
                                                break
                                            }
                                            case "npc": case "npcref": case "spc": case "spcref": {
                                                charRefs = _.uniq(charRefs.map(x => _.isString(x) && x.replace(/all/gu, "allnpc").replace(/sandbox/gu, "activenpc") || x)).filter(x => !(
                                                    _.isString(x) && ["topleft", "botleft", "topright", "botright", "registered", "activepc"].includes(x.toLowerCase()) ||
                                                    x.get && x.get("_type") === "character" && _.values(Char.REGISTRY).filter(xx => xx.id === x.id).length
                                                ))
                                                charCounts[1] = charRefs.length
                                                break
                                            }
                                            // no default
                                        }                                    
                                    if (charRefs.length)
                                        charArray.push(...charRefs)
                                    else
                                        errorLines.push(`Invalid ${cat.toLowerCase()} reference: ${jStr(v && v.get && v.get("name") || v && v.id || v, true)} [${charCounts.join(", ")}]`)
                                }                                
                                break                                
                            }
                            case "charobj":
                                if (!v || !v.get || v.get("_type") !== "character")
                                    errorLines.push(`Invalid character object: ${jStr(v && v.get && v.get("name") || v && v.id || v, true)}`)
                                else
                                    charArray.push(v)
                                break
                            case "player": case "playerref": {
                                let playerRef 
                                try {
                                    if (v && v.get) {
                                        switch(v.get("_type")) {
                                            case "player": {
                                                playerRef = v
                                                break
                                            }
                                            case "character":
                                            case "graphic": {
                                                playerRef = v.get("controlledby").split(",").filter(x => !["all", "storyteller", D.GMID].includes(x.toLowerCase()))
                                                if (!playerRef.length)
                                                    playerRef = undefined
                                                break
                                            }
                                            // no default
                                        }
                                    } else if (_.isString(v)) {
                                        playerRef = getObj("player", playerRef)
                                        if (!playerRef) 
                                            playerRef = _.find(findObjs({_type: "player"}), x => 
                                                x.get("_displayname") === v || 
                                                x.get("speakingas") === v ||
                                                x.get("_d20userid") === v
                                            )
                                    }
                                } catch(errObj) {
                                    errorLines.push(`(val({${cat.toLowerCase()}: ${jStr(v && v.get && v.get("name") || v && v.id || v, true)}) <b>${errObj.name}</b>: ${errObj.message}`)
                                } finally {
                                    if (!playerRef)
                                        errorLines.push(`Invalid player reference: ${jStr(v && v.get && v.get("name") || v && v.id || v)}`)
                                }
                                break
                            }
                            case "playerobj":
                                if (!v || !v.get || v.get("_type") !== "player")
                                    errorLines.push(`Invalid player object: ${jStr(v && v.get && v.get("name") || v && v.id || v, true)}`)
                                break
                            case "text": case "textref": 
                            //    if (!Media.GetText(v))
                             //       errorLines.push(`Invalid text reference: ${jStr(v && v.get && v.get("name") || v && v.id || v)}`)
                            //    break      
                            // fall through
                            case "textobj":
                                if (!v || !v.get || v.get("_type") !== "text")
                                    errorLines.push(`Invalid text object: ${jStr(v && v.get && v.get("name") || v && v.id || v)}`)
                                break
                            case "graphic": case "graphicref": case "image": case "imageref": 
                              //  break       
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
                                if (!_.find(ALLSTATS, x => x.toLowerCase() === v))
                                    errorLines.push(`Invalid trait: ${jStr(v && v.get && v.get("name") || v && v.id || v)}`)
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
            if (errorLines.length) {
                if (!funcName || !scriptName)
                    return false
                return THROW(`[From ${jStr(scriptName).toUpperCase()}:${jStr(funcName)}]<br>... ${errorLines.join("<br>... ")}`, "validate")
            }
            return true
        }, */
    // #endregion

    // #region DEBUGGING & ERROR MANAGEMENT
        setWatchList = keywords => {
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
                logDebugAlert(msg, funcName, scriptName, prefix)
                if (funcName && STATEREF.WATCHLIST.includes(funcName) || scriptName && STATEREF.WATCHLIST.includes(scriptName) || !funcName && !scriptName)
                    sendToGM(msg, formatTitle(funcName, scriptName, prefix))
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
                    const logDate = new Date(logData.timeStamp)
                    let ampm = "A.M."
                    logDate.setUTCHours(logDate.getUTCHours() - 4)
                    if (logDate.getUTCHours() >= 12) {
                        ampm = "P.M."
                        if (logDate.getUTCHours() > 12)
                            logDate.setUTCHours(logDate.getUTCHours() - 12)
                    }
                    logLines.push("</div>", C.HANDOUTHTML.main(C.HANDOUTHTML.title((new Date(logDate)).toUTCString().replace("GMT", ampm))).replace("</div>", ""))
                }
                if (lastTitle === logData.title)
                    logLines.push(C.HANDOUTHTML.bodyParagraph(jStr(logData.contents), {"border-top": `1px solid ${C.COLORS.black}`}))
                else
                    logLines.push(C.HANDOUTHTML.bodyParagraph(C.HANDOUTHTML.subTitle(logData.title.replace("DB ", "")) + jStr(logData.contents)))
                lastTimeStamp = logData.timeStamp
                lastTitle = logData.title
            }
            logLines.push("</div>")
            Handouts.Make(title, "debug", logLines.join(""))
            STATEREF.DEBUGLOG.length = 0
        },
    // #endregion

    // #region GETTERS: Object, Character and Player Data
        getGMID = () => {
        /* Finds the first player who is GM. */
            const gmObj = _.find(findObjs({_type: "player"}), v => playerIsGM(v.id))
            return gmObj ? gmObj.id : THROW("No GM found.", "getGMID")
        },
        getSelected = (msg, typeFilter = []) => {
            /* When given a message object, will return selected objects or false.
                Can set one or more types.  In addition to standard types, can include "token" and "character"
                    "token" --> Will only return selected graphic objects that represent a character.
                    "character" --> Will return character objects associated with selected tokens. */
            const selObjs = new Set(),
                types = _.flatten([typeFilter])
            if (VAL({selection: msg}))
                _.each(_.compact(msg.selected), v => {
                    // DB(`MSG Iteration:<br><br>Selected (${msg.selected.length}): ${jStr(msg.selected, true)}<br><br>Current V: ${jStr(v)}`, "getSelected")
                    if (types.length === 0 || types.includes(v._type))
                        selObjs.add(getObj(v._type, v._id))
                    else if (v._type === "graphic" && VAL({token: getObj("graphic", v._id)}))
                        if (types.includes("token"))
                            selObjs.add(getObj("graphic", v.id))
                        else if ((types.includes("char") || types.includes("character")) && VAL({char: getObj("graphic", v._id)}))
                            selObjs.add(getObj("character", getObj("graphic", v._id).get("represents")))
                })
            if (selObjs.size === 0)
                THROW(`None of the selected objects are of type(s) '${jStrL(types)}'`, "getSelected")
            return [...selObjs] 
        },
        refreshShortNames = () => {
            STATEREF.shortNames = []
            for (const charObj of getChars("all"))
                STATEREF.shortNames.push(getName(charObj, true))
        },
        getName = (value, isShort = false, isCheckingShort = false) => {
            // Returns the NAME of the Graphic, Character or Player (DISPLAYNAME) given: object or ID.
            const obj = VAL({object: value}) && value ||
                VAL({char: value}) && getChar(value) ||
                VAL({player: value}) && getPlayer(value) ||
                VAL({string: value}) && getObj("graphic", value)
            let name = VAL({player: obj}) && obj.get("_displayname") ||
                VAL({object: obj}, "getName") && obj.get("name")

            if (VAL({string: name}, "getName")) {
                if (isShort) {
                    let shortName = name				// SHORTENING NAME:
                    if (_.find(_.values(Char.REGISTRY), v => v.name === shortName)) { // If this is a registered character, return its short name.
                        return _.find(_.values(Char.REGISTRY), v => v.name === shortName).shortName
                    } else if (shortName.includes("\"")) {		// If name contains quotes, remove everything except the quoted portion of the name.
                        shortName = name.replace(/.*?["]/iu, "").replace(/["].*/iu, "")
                    } else {					// Otherwise, remove the first word.				
                        shortName = name.replace(/.*\s/iu, "")
                        // Now, check for any duplicates, with "isCheckingShort" set to true to avoid infinite recursion; if found, return full name.
                        if (STATEREF.shortNames.filter(x => x === shortName).length > 1)
                            shortName = name
                    }
                    name = shortName
                }
                return name.replace(/_/gu, " ")
            }
            return "(UNNAMED)"
        },
        getChars = (charRef, isSilent = false, isFuzzyMatching = false) => {
			/* Returns an ARRAY OF CHARACTERS given: "all", "registered", a character ID, a character Name,
				a token object, a message with selected tokens, OR an array of such parameters. */
            const charObjs = new Set()
            let [searchParams, dbstring] = [[], ""]
            try {
                if (charRef.who) {
                    _.each(getSelected(charRef, "character"), charObj => { charObjs.add(charObj) })
                    dbstring += `REF: Msg.  RETURNING: ${jStr(...charObjs)}`
                    if (charObjs.size > 0)
                        return [...charObjs]
                    return isSilent && THROW("Must Select a Token!", "getChars")
                } else if (VAL({array: charRef})) {
                    searchParams = charRef
                    dbstring += `REF: [${jStr(...searchParams)}] `
                } else if (VAL({string: charRef}) || VAL({object: charRef}) || VAL({number: charRef})) {
                    searchParams.push(charRef)
                    dbstring += `REF: ${capitalize(jStr(typeof charRef), true)} `
                } else {
                    return isSilent ? false : THROW(`Invalid character reference: ${jStr(charRef)}`, "getChars")
                }
            } catch (errObj) {
                return isSilent ? false : THROW("", "getChars", errObj)
            }
            _.each(searchParams, v => {
                if (searchParams.length > 1)
                    dbstring += "<br>"
                // If parameter is a digit corresponding to a REGISTERED CHARACTER:
                if (VAL({string: v}) && ["TopLeft", "BotLeft", "TopRight", "BotRight"].includes(v)) {
                    charObjs.add(getObj("character", Char.REGISTRY[v].id))
                    dbstring += " ... Registry #: "
                    // If parameter is a CHARACTER OBJECT already: */
                } else if (VAL({charObj: v})) {
                    charObjs.add(v)
                    dbstring += " ... CharObj "
                    // If parameter is a CHARACTER ID:
                } else if (VAL({string: v}) && getObj("character", v)) {
                    charObjs.add(getObj("character", v))
                    dbstring += " ... CharID: "
                    // If parameters is a TOKEN OBJECT:
                } else if (VAL({token: v}) && getObj("character", v.get("represents"))) {
                    charObjs.add(getObj("character", v.get("represents")))
                    dbstring += " ... Token: "                    
                } else if (VAL({string: v})) {
                        // If parameter is "all":
                    if (v.toLowerCase() === "all") {
                        _.each(findObjs({_type: "character"}), char => charObjs.add(char))
                        dbstring += ` ... "${jStr(v)}": `
                        // If parameter calls for REGISTERED CHARACTERS:
                    } else if (v.toLowerCase() === "registered") {
                        _.each(Char.REGISTRY, charData => { if (!charData.name.toLowerCase().includes("Good Lad")) charObjs.add(getObj("character", charData.id)) })
                        dbstring += ` ... "${jStr(v)}": `
                        // If parameter is "sandbox", calls for all characters with tokens in the sandbox (do player characters first)
                    } else if (v.toLowerCase() === "activepc") {
                        _.each(Char.REGISTRY, charData => { if (charData.isActive && !charData.name.toLowerCase().includes("Good Lad")) charObjs.add(getObj("character", charData.id)) })
                        dbstring += ` ... "${jStr(v)}": `
                        // If parameter is "sandbox", calls for all characters with tokens in the sandbox (do player characters first)
                    } else if (v.toLowerCase() === "sandbox") {
                        _.each(Media.GetContainedChars("Sandbox", {padding: 50}), vv => charObjs.add(vv))
                        dbstring += ` ... "${jStr(v)}": `                    
                        // If parameter is a SINGLE LETTER, assume it is an INITIAL and search the registry for it.
                    } else if (v.length === 1) {
                        const charData = _.find(Char.REGISTRY, data => data.initial.toLowerCase() === v.toLowerCase())
                        if (charData)
                            charObjs.add(getObj("character", charData.id))
                        dbstring += ` ... "${jStr(v)}": `                    
                        // If parameter is a STRING, assume it is a character name to fuzzy-match UNLESS isStrict is true.
                    } else {
                        const charName = isFuzzyMatching ? D.IsIn(v, STATEREF.PCLIST, true) || D.IsIn(v, STATEREF.NPCDICT, false) :
                                D.IsIn(v, STATEREF.PCLIST, true) || D.IsIn(v, STATEREF.NPCLIST, true),
                            charObj = charName && (findObjs({_type: "character", name: charName}) || [])[0]
                        if (charObj)
                            charObjs.add(charObj)
                        dbstring += " ... String: "
                    }
                }
                dbstring += `${charObjs.size} Characters Found.`
            })
            if (!STATEREF.BLACKLIST.includes("getChars"))
                DB(dbstring, "getChars")
            if (charObjs.size === 0)
                return !isSilent && THROW(`No Characters Found using Search Parameters:<br>${jStr(searchParams)} in Character Reference<br>${jStr(charRef)}`, "getChars")
            return _.reject([...charObjs], v => v.get("name") === "Jesse, Good Lad That He Is")
        }, getChar = (charRef, isSilent = false) => Char.SelectedChar || (getChars(charRef, isSilent) || [false])[0],
        getCharData = (charRef) => {
            const charObj = getChar(charRef)
            if (VAL({playerchar: charObj}, "getCharData"))
                return _.find(_.values(Char.REGISTRY), v => v.id === charObj.id)
            else if (VAL({npc: charObj}, "getCharData"))
                return {
                    id: charObj.id,
                    name: charObj.get("name"),
                    playerID: getGMID(),
                    playerName: "Storyteller",
                    tokenName: null,
                    shortName: charObj.get("name"),
                    initial: null,
                    quadrant: null
                }
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
            const charObj = getChar(charRef),
                isGettingMax = statName.endsWith("_max"),
                stat = statName.replace(/_max$/gu, "")
            let attrValueObj = null,
                attrValue = null
            if (VAL({charObj, string: stat}, isSilent ? null : "getStat")) {
                const attrObjs = _.filter(findObjs({_type: "attribute", _characterid: charObj.id}), v => stat.includes("repeating") || !fuzzyMatch("repeating", v.get("name"))) // UNLESS "statName" includes "repeating_", don't return repeating fieldset attributes.
                // D.Alert(`All Attr Objs: ${D.JS(_.map(allAttrObjs, v => v.get("name")))}<br><br>Filtered Attr Objs: ${D.JS(_.map(attrObjs, v => v.get("name")))}`)
                // First try for a direct match, then a fuzzy match:
                attrValueObj = _.find(attrObjs, v => v.get("name").toLowerCase() === stat.toLowerCase()) || _.find(attrObjs, v => looseMatch(v.get("name"), stat))
                if (!attrValueObj) {
                    const attrNameObj = _.find(attrObjs, v => v.get("name").toLowerCase().endsWith("_name") && v.get("current").toLowerCase() === stat.toLowerCase())
                    if (attrNameObj)
                        attrValueObj = _.find(attrObjs, v => v.get("name") === attrNameObj.get("name").slice(0, -5))
                }
                if (attrValueObj) {
                    attrValue = attrValueObj.get(isGettingMax ? "max" : "current")
                    if (!_.isNaN(parseInt(attrValue)))
                        attrValue = parseInt(attrValue)
                }
                DB(`StatName: ${D.JS(stat)}
                AttrValueObj: ${D.JS(attrValueObj, true)}
                Boolean: ${Boolean(attrValueObj)}
                Current: ${D.JS(attrValueObj && attrValueObj.get(isGettingMax ? "max" : "current"))}
                So, returning: ${D.JS(attrValueObj ? [attrValueObj.get(isGettingMax ? "max" : "current"), attrValueObj] : null, true)}`, "getStat")
            }
            return attrValueObj ? [attrValue, attrValueObj] : null
        },
        getStatVal = (charRef, statName, isSilent = false) => (getStat(charRef, statName, isSilent) || [false])[0],
        getRepIDs = (charRef, section, rowFilter, isSilent = false) => {
            // rowRef: rowID (string), stat:value (list, with special "name" entry for shortname), array of either (array), or null (all)
            DB(`GetRepIDs(${jStr(charRef, true)}, ${section}, ${jStr(rowFilter)})`, "getRepIDs")
            const charObj = getChar(charRef, isSilent),
                getUniqIDs = attrObjs => _.uniq(_.map(attrObjs, v => v.get("name").match("repeating_[^_]*?_(.*?)_")[1]))
            let validRowIDs = [],
                dbstring = ""
            if (VAL({char: charObj, string: section}, "getRepIDs")) {
                const attrObjs = _.filter(findObjs({_type: "attribute", _characterid: charObj.id}), v => v.get("name").toLowerCase().startsWith(section === "*" ? "repeating_" : `repeating_${section.toLowerCase()}_`)),
                // D.Alert(`attrObjs: ${D.JS(_.map(attrObjs, v => v.get("name")))}`)
                    rowIDs = getUniqIDs(attrObjs)
                DB(`attrObjsInSection: ${jStr(_.map(attrObjs, v => parseRepStat(v.get("name"))[2]))}<br><br>rowIDsInSection: ${jStr(rowIDs)}`, "getRepIDs")
                if (VAL({string: rowFilter})) {
                    // RowRef is a string. Check to see if it's a flag ("top"); if not, assume it's a rowid.
                    if (rowFilter === "top")
                        return [_.find(rowIDs, v => v.toLowerCase() === (getStatVal(charObj, `_reporder_repeating_${section}`) || "").split(",")[0].toLowerCase())]
                    DB(`RowRef: STRING (${rowFilter}).  Valid Row IDs: ${jStr(_.find(rowIDs, v => v.toLowerCase() === rowFilter.toLowerCase()))}`, "getRepIDs")
                    return [_.find(rowIDs, v => v.toLowerCase() === rowFilter.toLowerCase())]
                } else if (VAL({list: rowFilter})) {
                    // RowRef is a key/value list of stat name and value to filter by. Only row IDs referring to ALL matching key/value pairs will be returned.
                    // If value === "*", any value is accepted (only checks for presence of stat name)
                    validRowIDs = [...rowIDs]
                    DB(`RowRef: LIST:<br><br>${jStr(rowFilter)}`, "getRepIDs")
                    for (const rowData of _.pairs(rowFilter)) {
                        const [key, val] = rowData
                        DB(`RowData: ${key}, ${val}`, "getRepIDs")
                        // Check each row against this filter element: Must satisfy, or remove from validRowIDs
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
                                        const obj = _.find(attrObjsInRow, v => looseMatch(v.get("name"), nameAttrObj.get("name").slice(0, -5)) &&
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
                    }
                } else if (VAL({array: rowFilter})) {
                    // RowRef is an array of nested rowrefs, requiring recursion.
                    for (const ref of rowFilter)
                        validRowIDs.push(...getRepIDs(charRef, section, ref, isSilent))
                } else if (!rowFilter) {
                    // No rowRef means the IDs of all section rows are returned.
                    validRowIDs.push(...rowIDs)
                }
                DB(`Valid Row IDs: ${jStr(validRowIDs)}`, "getRepIDs")
            }
            return _.uniq(validRowIDs)
        },
        getRepStats = (charRef, section, rowFilter = {}, statName, groupBy, pickProperty, isSilent = false) => {
            const charObj = getChar(charRef)
            // D.Alert(`CharRef: ${D.JS(charRef)}, CharObj: ${D.JS(charObj)}`)
            DB(`getRepStats(${jStr([charObj.get("name"), section, rowFilter, statName, groupBy, pickProperty])})`, "getRepStats")
            let finalRepData = []
            if (VAL({charObj, string: section}, "getRepStats")) {
                // STEP ONE: USE THE ROW FILTER TO GET VALID ROW IDS TO SEARCH
                const filter = VAL({string: statName, list: rowFilter}) ? Object.assign({[statName]: "*"}, rowFilter) :
                        rowFilter,
                    rowIDs = _.compact(getRepIDs(charObj, section, filter, isSilent)),
                    attrObjs = []
                if (filter === "top" && !rowIDs.length)
                    rowIDs.push(..._.compact(getRepIDs(charObj, section, null, isSilent)))
                attrObjs.push(..._.filter(findObjs({_type: "attribute", _characterid: charObj.id}), v => v.get("name").match(`repeating_${section === "*" ? ".*?" : section}_(.*?)_`) &&
                    rowIDs.includes(v.get("name").match(`repeating_${section === "*" ? ".*?" : section}_(.*?)_`)[1])))
                // STEP TWO: ITERATE THROUGH EACH ROW TO LOOK FOR REQUESTED STAT(S)
                for (const rowID of rowIDs) {
                    const rowAttrObjs = _.filter(attrObjs, v => v.get("name").toLowerCase().includes(rowID.toLowerCase())), // Select the attribute objects from this row.
                        attrNameObjs = _.filter(rowAttrObjs, v => v.get("name").toLowerCase().endsWith("_name")), // Select ALL row attribute objects that end with "_name"
                        attrNameData = _.compact(_.map(attrNameObjs, v => { // ... and compile their data by linking them to their value objects.
                            const data = {
                                charID: charObj.id,
                                rowID,
                                name: v.get("current"),
                                fullName: v.get("name").replace(/_name$/gu, ""),
                                obj: _.find(rowAttrObjs, vv => vv.get("name").toLowerCase() === v.get("name").toLowerCase().slice(0,-5))
                            }
                            if (data.obj) {
                                data.val = data.obj.get("current");
                                [,,data.attrName] = parseRepStat(data.obj.get("name"))
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
                                rowID,
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
                            rowID,
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
                if (VAL({string: groupBy}) && ["rowID", "fullName", "attrName", "name", "val"].includes(groupBy)) {
                    finalRepData = _.groupBy(finalRepData, v => v[groupBy])
                    if (VAL({string: pickProperty}) && ["fullName", "attrName", "name", "obj", "val"].includes(pickProperty)) {
                        const pickData = {}
                        _.each(finalRepData, (v, k) => {
                            pickData[k] = _.map(v, vv => vv[pickProperty])
                        })
                        finalRepData = pickData
                    }
                } else if (VAL({string: pickProperty}) && ["fullName", "attrName", "name", "obj", "val"].includes(pickProperty)) {
                    finalRepData = _.map(finalRepData, v => v[pickProperty])
                }
            }
            return finalRepData
        }, getRepStat = (charRef, section, rowFilter, statName, isSilent = false) => getRepStats(charRef, section, rowFilter, statName, null, null, isSilent)[0],
        getPlayerID = (playerRef, isSilent = false) => {
            // Returns a PLAYER ID given: display name, token object, character reference.
            let playerID = null
            try {
                if (VAL({object: playerRef}) && playerRef.get("_type") === "player") {
                    DB(`PlayerRef identified as Player Object: ${D.JS(playerRef, true)}<br><br>... returning ID: ${playerRef.id}`, "getPlayerID")
                    return playerRef.id
                }
                if (VAL({string: playerRef})) {
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
                }                
                if (VAL({char: playerRef})) {
                    const playerCharData = _.values(Char.REGISTRY)
                    let charObj = getChar(playerRef, true)                    
                    for (const charData of playerCharData)
                        if (charData.isNPC === charObj.id) {
                            charObj = getChar(charData.id)
                            break
                        }
                    playerID = _.filter(charObj.get("controlledby").split(","), v => v !== "all")
                    DB(`PlayerRef identified as Character Object: ${D.JS(charObj.get("name"))}... "controlledby": ${D.JS(playerID)}`, "getPlayerID")
                    if (playerID.length > 1 && !isSilent)
                        THROW(`WARNING: Finding MULTIPLE player IDs connected to character reference '${jStr(playerRef)}': ${jStr(playerID)}`, "getPlayerID")
                    return playerID[0]
                }
                return isSilent ? false : THROW(`Unable to find player connected to reference '${jStr(playerRef)}'`, "getPlayerID")
            } catch (errObj) {
                return isSilent ? false : THROW(`Unable to find player connected to reference '${jStr(playerRef)}'.<br><br>${jStr(errObj)}`, "getPlayerID")
            }
        },
        getPlayer = (playerRef, isSilent = false) => {
            const playerID = getPlayerID(playerRef, true)
            if (VAL({string: playerID}) && VAL({object: getObj("player", playerID)})) 
                return getObj("player", playerID)
            else 
                DB(`Searching for Player with Player Ref: ${playerRef}
                ... playerID: ${jStr(playerID)}
                .. String? ${VAL({string: playerID})}
                .. Player Object? ${jStr(getObj("player", playerID))}`, "getPlayer")
            
            return isSilent ? false : THROW(`Unable to find a player object for reference '${jStr(playerRef)}`, "getPlayer")
        },
    // #endregion

    // #region SETTERS: Attributes
        setStats = (charRef, statList) => {
            const charObj = getChar(charRef)
            if (VAL({charObj, list: statList}, "setStats"))
                setAttrs(charObj.id, statList)
        }, setStat = (charRef, statName, statValue) => setStats(charRef, {[statName]: statValue}),
        setRepStats = (charRef, section, rowID, statList, isSilent = false) => {
            const charObj = getChar(charRef, isSilent)
            if (VAL({char: [charObj], string: [section], list: [statList]}, "setRepAttrs", true)) {
                const attrList = {}
                _.each(statList, (value, statName) => {
                    attrList[`repeating_${section}_${rowID}_${statName}`] = value
                })
                setAttrs(charObj.id, attrList)
            }
        }, setRepStat = (charRef, section, rowID, statName, statValue, isSilent = false) => setRepStats(charRef, section, rowID, {[statName]: statValue}, isSilent),
    // #endregion

    // #region Repeating Section Manipulation
        parseRepStat = (repRef) => {
            const repStatName = VAL({object: repRef}) ? repRef.get("name") : repRef
            if (VAL({repname: repStatName})) {
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
            // DB(`Setting Attributes: ${D.JS(attrList, true)}`, "makeRepRow")
            // setAttrs(charID, attrList)

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
            // let dbString = ""
            for (const rowID of rowIDs) {
                // dbString += `<br><br><b>${rowID}</b><br>`
                const rowAttrData = getRepStats(charRef, secName, rowID),
                    theseVals = {rowID}
                for (const statData of rowAttrData)
                    theseVals[statData.attrName] = statData.val
                    // dbString += `... ${D.JS(statData.attrName, true)}: ${D.JS(theseVals[statData.attrName])}<br>`                
                theseVals.SORTER = transformFunc(theseVals[sortTrait])
                // dbString += `... SORTER: ${D.JS(theseVals.SORTER)}<br>`
                rowData.push(theseVals)
            }
            for (const rowID of rowIDs)                
                deleteRepRow(charRef, secName, rowID)
            // D.Alert(dbString, "sortRepSec")
            // D.Alert(D.JS(rowData, true), "sortRepSec")
            const sortedData = _.sortBy(rowData, "SORTER")
            if (isDescending)
                sortedData.reverse()
            // D.Alert(D.JS(sortedData, true), "sortRepSec")
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
            
        },
    // #endregion

    // #region SPECIAL FX
        runFX = (name, pos) => {
        // Runs one of the special effects defined above.
            spawnFxWithDefinition(pos.left, pos.top, C.FX[name])
        }
    // #endregion

    return {
        CheckInstall: checkInstall,
        OnChatCall: onChatCall,

        get STATSDICT() { return STATEREF.STATSDICT },
        get PCDICT() { return STATEREF.PCDICT },
        get NPCDICT() { return STATEREF.NPCDICT },

        get PAGEID() { return VALS.PAGEID() },
        get CELLSIZE() { return VALS.CELLSIZE() },

        Queue: queueFunc, Run: runFuncQueue,
        CHARWIDTH: STATEREF.CHARWIDTH,
        JS: jStr, JSL: jStrL, JSH: jStrH, JSC: jStrC,
        ParseParams: parseParams,
        ParseCharSelection: parseCharSelect,
        SumHTML: summarizeHTML,
        NumToText: numToText, TextToNum: textToNum,
        Ordinal: ordinal,
        Capitalize: capitalize,
        Clone: clone,

        Chat: sendChatMessage,
        Alert: sendToGM,
        Poke: (msg, title = "[ALERT]") => {
            if (Session.IsTesting)
                sendToGM(msg, title)
        },
        Prompt: promptGM,

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
        GetStat: getStat, GetStatVal: getStatVal,
        GetRepIDs: getRepIDs,
        GetRepStats: getRepStats, GetRepStat: getRepStat,
        GetPlayerID: getPlayerID, GetPlayer: getPlayer,

        SetStat: setStat, SetStats: setStats,
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
    D.Log("DATA Ready!")
})
void MarkStop("DATA")