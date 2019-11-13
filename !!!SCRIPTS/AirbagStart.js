let airIndex = new Error();
// ===============================================================================
// AIRBAG - API Crash Handler
//
// Version 1.3.2
//
// By: github.com/VoltCruelerz
//
// Forked by github.come/Eunomiac:
//	- chat message is now HTML formatted for easier reading/clarity
//	- log message parsed for easier reading
//	- ALL line references in the stack trace are converted to local
// ===============================================================================
// ===============================================================================

// Whether or not the code is operational
let codebaseRunning = false;

// System States
const rezMsg = "[API IS STARTING]";
const runMsg = "[API OPERATIONAL]";

// Log for Airbag
const airLog = (logMsg, chatMsg, dbMsg) => {
        log(logMsg);
        sendChat("Airbag", `/w gm ${chatMsg || logMsg}`);
        if (state && state.VAMPIRE && state.VAMPIRE.DATA && state.VAMPIRE.DATA.DEBUGLOG)
            state.VAMPIRE.DATA.DEBUGLOG.push({
                timeStamp: (new Date()).getTime(),
                title: "[AIRBAG RAW STACK TRACE]",
                contents: dbMsg
            })
    };

// HTML Styles for Reporting
const HTML = {
    ChatBox: content => `<div style="${[
            "display: block;",
            "width: auto;",
            "padding: 5px 5px;",
            "margin: -30px 0px 0px -42px;",
            "border: 3px outset rgb(255, 0, 0);",
            "background-color: rgb(120, 0, 0);",
            "position: relative;"
        ].join(" ")}">${content}</div>`,
    TitleBox: content => `<div style="${[
            "display: block;",
            "height: auto;",
            "width: 90%;",
            "line-height: 23px;",
            "margin: 0px 5%;",
            "font-family: 'copperplate gothic';",
            "font-variant: small-caps;",
            "font-size: 16px;",
            "text-align: center;",
            "text-align-last: center;",
            "background-color: rgb(80, 80, 80);",
            "color: rgb(255, 255, 255);",
            "position: relative;"
        ].join(" ")}">${content}</div>`,
    StackBox: content => `<div style="${[
            "display: block;",
            "width: auto;",
            "padding: 5px 0px 5px 3px;",
            "font-family: input, verdana, sans-serif;",
            "font-size: 9px;",
            "background-color: rgb(255, 255, 255);",
            "border: 2px solid rgb(0,0,0);",
            "line-height: 14px;",
            "position: relative;"
        ].join(" ")}">${content}</div>`,
    MessageBox: content => `<div style="${[
            "display: block;",
            "width: auto;",
            "padding: 5px 0px 5px 3px;",
            "font-family: voltaire, verdana, sans-serif;",
            "font-size: 12px;",
            "text-align: center;",
            "text-align-last: center;",
            "background-color: rgb(200, 200, 200);",
            "border: 2px solid rgb(0,0,0);",
            "line-height: 14px;",
            "color: black;",
            "position: relative;"
        ].join(" ")}">${content}</div>`
}

// ===========================================================================
// Line number Handling
// ===========================================================================

// Denote the occupation ranges of the installed scripts that Airbag insulates
let scriptRanges = [],
    scriptNames = []

// Line Number Parser
const GetScriptLine = (traceable, markMode) => {
    const match = (traceable && traceable.stack || "").match(/apiscript.js:(\d+)/g) || ["", ""];
    if (markMode) {
        return parseInt(match[1].split(':')[1]) || 0;
    }
    return parseInt(match[0].split(':')[1]) || 0;
};

// The last range entry that was added
let lastStart = {
    Name: 'AirbagStart',
    StartLine: GetScriptLine(airIndex, false),
    StopLine: -1
};

// Manual insert since Airbag can't use its own MarkStart function
scriptRanges.push(lastStart);

// Available for dependent scripts.
const MarkStart = (scriptName) => {
    scriptNames.push(scriptName)
    let index = new Error();
    let line = GetScriptLine(index, true);
    lastStart = {
        Name: scriptName,
        StartLine: line,
        StopLine: -1
    };
    scriptRanges.push(lastStart);
};

// Available for dependent scripts
const MarkStop = (scriptName) => {
    let index = new Error();
    let line = GetScriptLine(index, true);
    lastStart.StopLine = line;
};

// Prints the list of scripts and their line number ranges
// (called at end of AirbagStop)
const printScriptRanges = () => {
    scriptRanges.forEach((range) => {
        const msg = range.StopLine > 0
            ? `[${range.StartLine}, ${range.StopLine}]` 
            : `[${range.StartLine}, ???]`;
        log('Airbag Handling ' + range.Name + ': ' + msg);
    });
};

// Converts a global line number to a local one
const ConvertGlobalLineToLocal = (gline) => {
    let prevRange = {
        Name: 'PREV_RANGE',
        StartLine: -1,
        StopLine: -1
    };
    for(var i = 0; i < scriptRanges.length; i++) {
        let curRange = scriptRanges[i];
        // Checking equals in both directions because of minification
        if (gline >= prevRange.StartLine && gline <= curRange.StartLine) {
            if (prevRange.StartLine === prevRange.StopLine) {
                log(`Airbag has detected a minified file for ${prevRange.Name}.  Line estimation may be inaccurate.`);
            }
            let localLine = gline - prevRange.StartLine + 1;
            // Check to see if there was an unmarked script in between
            // If an author didn't flag the end of the file, blame them
            if (prevRange.StopLine === -1 || prevRange.StopLine >= gline) {
                //log(`Global[${gline}] => ${prevRange.Name}[${localLine}]`);
                return {
                    Name: prevRange.Name,
                    Line: localLine
                };
            } else {
                //log(`Global[${gline}] => UNKNOWN SCRIPT between ${prevRange.Name} and ${curRange.Name} at 'local' line ${localLine}`);
                return {
                    Name: prevRange.Name,
                    Line: localLine
                };
            }
        }
        prevRange = curRange;
    }
    return {
        Name: 'Unknown Script',
        Line: -1
    };
};

// ===========================================================================
// Function shadows
// ===========================================================================
const airOn = on;
const airSetTimeout = setTimeout;
const airSetInterval = setInterval;
const airClearTimeout = clearTimeout;
const airClearInterval = clearInterval;

// On Registrations
let onRegistrations = [];// Erased after Airbag deployed
let onRegisteredTypes = [];// NOT erased after Airbag deployed (if it was, we'd get double-registrations)
// Builds a handler for the specified type
const getAirbagOnHandler = (eventType) => {
    // The master handler that wraps the registrations of the scripts
    const airbagOnHandler = (...handlerArgs) => {
        let type = eventType;
        try{
            // Iterate over the registrations.  If they match the type,
            // execute them.
            onRegistrations.forEach((registration) => {
                if (registration.Type === type) {
                    registration.UserHandler.apply(null, Array.prototype.slice.call(handlerArgs));
                }
            });
        } catch (e) {
            handleCrash(e);
        }
    };
    return airbagOnHandler;
}

// Delay registrations
let airDelays = [];
let airIntervals = [];
// Attempt to perform the delayed function
const airDelayHandler = (func, params) => {
    if (!codebaseRunning) return;
    try {
        (func || (() => null)).apply(null, Array.prototype.slice.call(params));
    } catch(e) {
        handleCrash(e);
    }
};

// Airbag codebase reboot command handler
on('chat:message', (msg) => {
    if (msg.type !== 'api') return;
    if (msg.content !== '!airbag') return;
    codebase();
});

// Halt codebase()'s operations, cancel async tasks, and alert user
const handleCrash = (e) => {
    log('Handling Crash...');
    codebaseRunning = false;
    
    // Kill all internal on() registrations
    onRegistrations = [];

    // Cancel all delayed operations
    airDelays.forEach((delayRef) => {
        airClearTimeout(delayRef);
    });
    airDelays = [];

    // Flush gc
    globalconfig = {};

    let globalLine = GetScriptLine(e, false);
    let src = ConvertGlobalLineToLocal(globalLine);

    let stackLines = _.map((e && e.stack || "").split(/\n|apiscript\.js/gu), v => {
		if (v.startsWith(":")) {
			const globalLineNum = parseInt(v.match(/^:(\d+):/u)[1]) || 0,
				  localLine = ConvertGlobalLineToLocal(globalLineNum)
			return v.replace(/^:\d+:/gu, `@@${localLine.Name}:${localLine.Line}:`).trim()
		}
		return v.trim()
    })

    const rawErrorMsg = _.compact([
        "[AIRBAG",
        src.Line > 0 ? `at ${src.Name}:${src.Line}]` : "]",
        `▌${e.message}▐`,
        `STACK: ${stackLines.join(" ").replace(/\s@@/gu, " ").replace(/[^\s\(]+underscore\.js:/gu, "_:").replace(/\(\s+/gu, "(")}`
    ]).join(" ").replace(/\n/gu, "")

    const debugErrorMsg = _.compact([
        `<b>[AIRBAG ${src.Line > 0 ? `at ${src.Name}:${src.Line}]` : "]"}</b>`,
        `▌${e.message}▐`,
        "<b>STACK:</b>",
        stackLines.join("<br>").replace(/<br>@@/gu, "")
    ]).join("<br>").replace(/\n/gu, "")
    
    const concatLines = stackLines.join("\n").replace(/\n/gu, "<br>").replace(/<br>@@/gu, "").split("<br>"),
        filteredStackLines = []
    
    for (const line of concatLines) {
        let lineCheck = false
        if (!line.startsWith("at"))
            lineCheck = true
        else
            for (const scriptName of scriptNames.filter(x => x !== "AirbagStop"))
                if (line.toLowerCase().includes(scriptName.toLowerCase())) {
                    lineCheck = true
                    break
                }   
        if (lineCheck)
            filteredStackLines.push(line)
    }

    filteredStackLines.shift()
    filteredStackLines[0] = `<br>${filteredStackLines[0]}`

    const styledErrorMsg = HTML.ChatBox(_.compact([
        HTML.TitleBox(`AIRBAG DEPLOYED${src.Line > 0 ? ` at<br>${src.Name}: ${src.Line}` : ""}`),
        HTML.MessageBox(e.message),
        HTML.StackBox(filteredStackLines.join("\n")).
            replace(/\n/gu, "<br>").
            replace(/<br>@@/gu, "").
            replace(/<br>at\b/gu, "<br><i><span style=\"color: rgb(150, 150, 150); display: inline-block; width: auto; \"> @ </span></i>").
            replace(/[^\s\(]+underscore\.js:(\d*?):/gu, "<span style=\"color: rgb(0,0,255);\">_</span>@@<span style=\"color: rgb(0,0,255);\">$1</span>@@").
            replace(/[^\s\(]+firebase-node\.js:(\d*?):/gu, "<span style=\"color: rgb(0,195,0);\">firebase</span>@@<span style=\"color: rgb(0,195,0);\">$1</span>@@").
            replace(/\/home\/node\/d20-api-server\/api\.js/gu, "API").
            replace(/(\(?)([^:\.\s]*?):(\d*?):/gu, "$1<b><span style=\"color: rgb(255,0,0)\">$2</span>:<span style=\"color: rgb(255,0,0)\">$3</span></b>:").
            replace(/@@/gu, ":").
            replace(/relative;">\s*?<br>/gu, "relative;\">"),
        HTML.TitleBox("[ REBOOT API ](!airbag)")
    ]).join(""))

    airLog(rawErrorMsg, styledErrorMsg, debugErrorMsg);
}

// ===========================================================================
// Code Base
// ===========================================================================
let codebase = () => {
    if (codebaseRunning) return;
    codebaseRunning = true;
    airLog(rezMsg);

    // ===========================================================================
    // Function shadows
    // ===========================================================================

    // ===========================================================================
    // on(type, handler)
    // DESC: Register in Airbag's internal list that the script wanted to subscribe
    //       to the event in question.
    const on = (type, userHandler) => {
        // Add a new registration
        let registration = {
            Type: type,
            UserHandler: userHandler 
        };
        onRegistrations.push(registration);
    
        // Airbag registers for the events on behalf of the script calling on() if
        // it hasn't already registered to this type.
        if (!onRegisteredTypes[type]) {
            log('Airbag is Registering on ' + type + ' for the first time.');
            onRegisteredTypes[type] = true;
            let handler = getAirbagOnHandler(type);
            airOn(type, handler);
        }
    };

    // ===========================================================================
    // setTimeout(func, delay, ...params)
    // DESC: Schedule Airbag's timeout handler
    const setTimeout = (func, delay, ...params) => {
        let delayRef = airSetTimeout(airDelayHandler, delay, func, params);
        airDelays.push(delayRef);
        return delayRef;
    };

    // ===========================================================================
    // setTimeout(func, delay, ...params)
    // DESC: remove from Airbag's memory, then clear the schedule
    const clearTimeout = (delayRef) => {
        airDelays = airDelays.filter(item => item !== delayRef);
        airClearTimeout(delayRef);
    };
    
    try {
        MarkStop('AirbagStart');