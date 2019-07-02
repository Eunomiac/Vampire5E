/* eslint-disable */
let airIndex = new Error();
// ===============================================================================
// AIRBAG - API Crash Handler
//
// Version 1.3.2
//
// By: github.com/VoltCruelerz
// ===============================================================================

// Whether or not the code is operational
let codebaseRunning = false;

// System States
const rezMsg = "[API IS STARTING]";
const runMsg = "[API OPERATIONAL]";

// Log for Airbag
const airLog = (msg) => {
    log(msg);
    sendChat("Airbag", '/w gm ' + msg);
};


// ===========================================================================
// Line number Handling
// ===========================================================================

// Denote the occupation ranges of the installed scripts that Airbag insulates
let scriptRanges = [];

// Line Number Parser
const GetScriptLine = (traceable, markMode) => {
    const match = traceable.stack.match(/apiscript.js:(\d+)/g);
    if (markMode) {
        return parseInt(match[1].split(':')[1]);
    }
    return parseInt(match[0].split(':')[1]);
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
    for (var i = 0; i < scriptRanges.length; i++) {
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
        try {
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
        func.apply(null, Array.prototype.slice.call(params));
    } catch (e) {
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

    let properties =
        'MSG: ' + e.message + '\n' +
        '\n====================\n' +
        'STK: ' + e.stack + '\n' +
        '\n====================\n';

    if (src.Line > 0) {
        properties = 'SRC: ' + src.Name + ':' + src.Line + '\n' +
            '\n====================\n' + properties;
    }

    const errMsg = "[AIRBAG DEPLOYED]\n" + properties + "[Reboot API](!airbag)";
    airLog(errMsg);
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