void MarkStart("TimeTracker");
const TimeTracker = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "TimeTracker";

    // #region COMMON INITIALIZATION
    const STATE = {get REF() { return C.RO.OT[SCRIPTNAME] }};
    const VAL = (varList, funcName, isArray = false) => D.Validate(varList, funcName, SCRIPTNAME, isArray);
    const DB = (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME);
    const LOG = (msg, funcName) => D.Log(msg, funcName, SCRIPTNAME);
    const THROW = (msg, funcName, errObj) => D.ThrowError(msg, funcName, SCRIPTNAME, errObj);
    const ONSTACK = (isThrottlingStackLog = false) => D.ONSTACK(ONSTACK, isThrottlingStackLog);
    const OFFSTACK = (funcID) => D.OFFSTACK(funcID);
    /* {
            const obj = {}
            let funcID = D.RandomString(20)
            const filterFunc = (fID) => (x) => x[0] === fID
            while (D.STACKLOG.filter(filterFunc(funcID)).length) 
                funcID = D.RandomString(20)
            Error.captureStackTrace(obj, ONSTACK)
            D.STACKLOG.push([funcID, D.ParseStack(obj).shift()])
            return OFFSTACK(funcID) && funcID
        },
        OFFSTACK = (funcID) => {
            const funcID = ONSTACK()
            D.PullOut(D.STACKLOG, v => v[0] === funcID)
        }, */

    const checkInstall = () => {
        const funcID = ONSTACK();
        C.RO.OT[SCRIPTNAME] = C.RO.OT[SCRIPTNAME] || {};
        initialize();
        OFFSTACK(funcID);
    };
    // #endregion

    // #region LOCAL INITIALIZATION
    const initialize = () => {
        const funcID = ONSTACK();

        STATE.REF.TweenStart = 0;
        STATE.REF.TweenTarget = 0;
        STATE.REF.TweenAutoIgnoreAlarms = STATE.REF.TweenAutoIgnoreAlarms || [];
        STATE.REF.TweenAutoDeferAlarms = STATE.REF.TweenAutoDeferAlarms || [];
        STATE.REF.TweenDeferredAlarms = STATE.REF.TweenDeferredAlarms || [];

        STATE.REF.dateObj = STATE.REF.currentDate ? new Date(STATE.REF.currentDate) : null;
        STATE.REF.nextSessionDate = STATE.REF.nextSessionDate || (new Date(new Date().toLocaleString("en-US", {timezone: "America/New_York"}))).getTime();
        STATE.REF.lastDate = STATE.REF.lastDate || 0;
        STATE.REF.weatherOverride = STATE.REF.weatherOverride || {};
        STATE.REF.timeZoneOffset = D.Int((new Date()).toLocaleString("en-US", {hour: "2-digit", hour12: false, timeZone: "America/New_York"}));
        STATE.REF.weatherData = STATE.REF.weatherData || RAWWEATHERDATA;            
        // STATE.REF.weatherData = RAWWEATHERDATA

        STATE.REF.Alarms = STATE.REF.Alarms || [];

        
        if (!STATE.REF.dateObj) {
            D.Alert("Date Object Missing! Setting to default date.<br><br>Use !time set [year] [month] [day] [hour] [minute] to correct.", "TimeTracker");
            STATE.REF.dateObj = new Date(2019, 11, 1, 18, 55);
            STATE.REF.currentDate = STATE.REF.dateObj.getTime();
        }
        
        if (Object.keys(STATE.REF.weatherOverride).length)
            D.Alert(`Weather Override in effect: ${D.JS(STATE.REF.weatherOverride)}<br><b>!time set weather</b> to clear.`, "Alert: Weather Override");

        // STATE.REF.weatherData[1][29] = ['xfCxxx', 'xfCxxx', 'xfCxsx', 'xfDxxx', 'xfExsx', 'cfExbx', 'tfFxww', 'tfFxgw', 'tfGxgw', 'tfGxww', 'pfGxww', 'wxFxbw', 'wxFxsw', 'wxFxbw', 'wxFxww', 'wxExbw', 'wxExbw', 'wxExbw', 'wxExww', 'wxDxww', 'wxDxbw', 'wxDxbw', 'wxDxgw', 'cxDxwx']
        // STATE.REF.weatherData[2][30] = ['wxDxww', 'wxDxbw', 'wxDxbw', 'wxDxgw', 'cxDxwx', 'cxBxhx', 'cxBxwx', 'cxBxwx', 'cxBxbx', 'cxCxwx', 'cxDxhx', 'cxDxwx', 'cxDxwx', 'cxExwx', 'wxExgw', 'pxDxhw', 'txDxvw', 'txDxhw', 'txCxhw', 'pxBxww', 'wxBxbw', 'cxAxsx', 'cx0xxf', 'cx0xsf']
            
        // STATE.REF.weatherData[0][24] = ['bxAxwf', 'bx0xhf', 'bxaxgf', 'bxbxg1', 'sxbxh1', 'bxcxh1', 'bxexw1', 'xxfxw1', 'xxgxw1', 'xxgxb1', 'xxexb1', 'cxdxw1', 'sxbxg1', 'sxaxg1', 'cxaxw1', 'xxaxb1', 'cxaxb1', 'cfaxx1', 'cfbxx1', 'cfbxx1', 'cfcxx1', 'cfcxx1', 'xfdxx1', 'xxexb1']
        // STATE.REF.weatherData[0][25] = ['xxexw1', 'xffxx1', 'cfexx1', 'sfexx1', 'bxexh1', 'bxexw1', 'sxexb1', 'cxexs1', 'cxexx1', 'cxdxx1', 'sxbxb1', 'bxaxw1', 'bxAxg1', 'bxAxg2', 'bxAxg2', 'bxAxg2', 'bxAxg2', 'bxAxg2', 'bxAxg2', 'bxAxw2', 'bxBxb2', 'sxBxs2', 'sxBxs2', 'sxBxx3']
        // STATE.REF.weatherData[0][20] = ["cxHxg5", "cxHxg5", "wxGxg5", "pxGxw5", "txGxg5", "txGxg5", "txHxg4", "pxHxw4", "wxHxb4", "cxHxb4", "cxIxb4", "cxJxs4", "cxJxb4", "cxKxs4", "cxKxb4", "cxKxs3", "wxKxw3", "pxJxw3", "txJxg3", "pxIxg3", "pxHxg3", "pxGxg2", "wxGxw2", "cxGxb2"]
        // STATE.REF.weatherData[0][21] = ["xxFxs2", "cxFxx2", "cxExx2", "cxExx2", "cxExx2", "cxExx2", "cxExx2", "sxDxb2", "bxDxb2", "bxExw3", "wxGxb2", "cxIxb2", "xxJxs2", "cxJxs2", "cxIxs2", "cxJxs2", "cxJxs2", "cxHxs2", "xfGxs2", "xfGxx2", "xfGxs2", "xfGxx2", "pfGxs1", "pfGxb1"]
        // STATE.REF.weatherData[0][20] = ["cxHxg5", "cxHxg5", "wxGxg5", "pxGxw5", "txGxg5", "txGxg5", "txHxg4", "pxHxw4", "wxHxb4", "cxHxb4", "cxIxb4", "cxJxs4", "cxJxb4", "cxKxs4", "cxKxb4", "cxKxs3", "wxKxw3", "pxJxw3", "txJxg3", "txIxg2", "txHxg1", "txGxgw", "txGxww", "txGxbw"]
        // STATE.REF.weatherData[0][21] = ["txFxsw", "txFxxw", "txExxw", "txExxw", "xxExxf", "xxExxf", "xxExxf", "sxDxb1", "bxDxb2", "bxExw3", "wxGxb2", "cxIxb2", "xxJxs2", "cxJxs2", "cxIxs2", "cxJxs2", "cxJxs2", "cxHxs2", "xfGxs2", "xfGxx2", "xfGxs2", "xfGxx2", "pfGxs1", "pfGxb1"]

        OFFSTACK(funcID);
    };
    // #endregion	

    // #region EVENT HANDLERS: (HANDLEINPUT)
    const onChatCall = (call, args) => {
        const funcID = ONSTACK(); 
        let isForcing = false;
        switch (call) {
            case "alarmfunc": {
                const funcName = args.shift();
                const funcParamString = args.join(" ");
                confirmAlarm(funcName, funcParamString);
                break;
            }
            case "weatherfind": {
                const [eventType, eventCode] = args.map(x => D.Int(x) || x);
                D.Alert(D.JS(getNextWeatherEvent(eventType, eventCode)));
                break;
            }
            case "codecheck": {
                const [month, day, hour] = args.map(x => D.Int(x));
                convertWeatherDataToCode(getWeatherData(month, day, hour));
                break;
            }
            case "moon": {
                if (!args.length) {
                    syncCountdown(false, true);
                } else if (args[0] === "stop") {
                    isCountdownFrozen = false;
                    syncCountdown();
                } else {
                    if (args[1])
                        MOON.maxTop = VAL({number: args[1]}) ? D.Int(args[1]) : MOON.maxTop;
                    if (args[2])
                        MOON.minTop = VAL({number: args[2]}) ? D.Int(args[2]) : MOON.minTop;
                    if (args[3])
                        MOON.daysToWait = VAL({number: args[3]}) ? D.Int(args[3]) : MOON.daysToWait;
                    isCountdownFrozen = false;
                    if (VAL({number: args[0]}))
                        syncCountdown({daysIn: D.Float(args[0])}, true);
                    else
                        syncCountdown({}, true);
                    isCountdownFrozen = true;
                }
                break;                    
            }
            case "get": {
                switch (D.LCase(call = args.shift())) {
                    case "alarms": {
                        displayNextAlarms();
                        displayPastAlarms();
                        break;
                    }
                    case "code": {
                        switch (D.LCase(call = args.shift())) {
                            case "day": {
                                const [month, date] = args.map(x => D.Int(x));
                                if (date)
                                    D.Alert(`STATE.REF.weatherData[${month}][${date}] = ['${STATE.REF.weatherData[month][date].join("', '")}']`, "Day's Weather Codes");
                                break;
                            }
                            default: D.Alert(`${STATE.REF.weatherData[STATE.REF.dateObj.getUTCMonth()][STATE.REF.dateObj.getUTCDate()][STATE.REF.dateObj.getUTCHours()]}`, "Weather Code"); break;
                        }
                        break;
                    }
                    case "weather": {
                        scanWeatherData(args[0] === "raw");
                        break;
                    }
                    case "report": {
                        if (args[0] && D.Int(args[0]) >= 0 && D.Int(args[0]) <= 11)
                            updateWeatherHandout(D.Int(args[0]));
                        break;
                    }
                    // no default
                }
                break;
            }
            case "set": {
                switch (D.LCase(call = args.shift())) {
                    case "alarm": {
                        const [dateRef, alarmName, alarmLabel, alarmFuncName, alarmFuncParams, alarmRecur] = args.join(" ").replace(/"/gu, "").split("|");
                        if (!(dateRef && alarmName && alarmLabel && alarmFuncName))
                            D.Alert([
                                "<h3>Alarm Syntax</h3>",
                                "<b>!time set alarm</b> dateRef<b>|</b>name<b>|</b>label<b>|</b>funcName<b>|</b>funcParams<b>|</b>recurring",
                                "  - dateString: 'dawn'/'dusk'/'nextfullnight'/'noon'/'[#] [unit]'",
                                "  - name: Name of the alarm",
                                "  - label: Descriptor to appear in the GM chat confirmation box",
                                "  - funcName: The name of the function as defined in ALARMFUNCS",
                                "  - funcParams: An '@'-delim'd list of args to pass to funcName",
                                "  - recurring: date string for recurrance interval"
                            ].join("<br>"), "!time set alarm");
                        else
                            D.Alert(`Alarm Set:<br><br>${D.JS(setAlarm(dateRef, alarmName, alarmLabel, alarmFuncName, alarmFuncParams.split("@").map(x => typeof x === "string" ? x.replace(/:\*:AT:\*:/gu, "@") : x), alarmRecur))}`, "!time set alarm");
                        break;
                    }
                    case "weath": case "weather": {
                        D.Alert("Weather Running!");
                        setManualWeather(args[0] && args[0] + (args[0].length === 1 ? "x" : ""), args[1] && D.Int(args[1]), args[2], args[3]);
                        break;
                    }
                    case "session": {
                        const params = Listener.ParseParams(args);
                        setNextSessionDate(params);
                        D.Alert(`Next Session Date: <b>${D.JS(formatDateString(new Date(STATE.REF.nextSessionDate), true))}</b><br>Last Session Date: <b>${D.JS(formatDateString(new Date(STATE.REF.lastSessionDate), true))}</b>`);
                        break;
                    }
                    case "lastsession": {
                        const params = Listener.ParseParams(args);
                        const lastDateObj = new Date(STATE.REF.nextSessionDate);
                        if (VAL({dateObj: lastDateObj})) {
                            lastDateObj.setMonth(D.Int(params.month));
                            lastDateObj.setDate(D.Int(params.date || params.day));
                            lastDateObj.setHours(D.Int(params.hour));
                            lastDateObj.setMinutes(D.Int(params.minute || 0));
                            STATE.REF.lastSessionDate = lastDateObj.getTime();
                            D.Alert(`Next Session Date: <b>${D.JS(formatDateString(new Date(STATE.REF.nextSessionDate), true))}</b><br>Last Session Date: <b>${D.JS(formatDateString(new Date(STATE.REF.lastSessionDate), true))}</b>`);
                        } else {
                            D.Alert(`Not a date object: ${D.JS(lastDateObj)}`, "!time set lastsession");
                        }
                        break;
                    }
                    case "force": {
                        call = args.shift();
                        isForcing = true;
                    }
                    // falls through
                    default: {
                        // D.Alert("Default Running!")
                        args.unshift(call);
                        // D.Alert(`Args: ${D.JS(args)}<br>Date: ${new Date(Date.UTC(..._.map(args, v => D.Int(v))))}<br>Date: ${new Date(Date.UTC(..._.map(args, v => D.Int(v))))}`)
                        const delta = Math.ceil(((new Date(Date.UTC(..._.map(args, v => D.Int(v))))).getTime() - STATE.REF.dateObj.getTime()) / (1000 * 60));
                        tweenClock(addTime(STATE.REF.dateObj, delta, "m"));
                        if (isForcing)
                            state[C.GAMENAME].Session.dateRecord = null;
                        break;
                    }
                }
                break;
            }
            case "add": {
                switch (D.LCase(call = args.shift())) {
                    case "force": {
                        call = args.shift();
                        isForcing = true;
                    }
                    // falls through
                    default: {
                        const [delta, unit] = parseToDeltaTime(call, ...args);
                        tweenClock(addTime(STATE.REF.dateObj, D.Float(delta), D.LCase(unit)));
                        if (isForcing)
                            state[C.GAMENAME].Session.dateRecord = null;
                        break;
                    }
                }
                break;
            }
            case "process": {
                switch (D.LCase(call = args.shift())) {
                    case "ground": case "groundcover": {
                        const params = D.KeyMapObj(Listener.ParseParams(args), null, v => D.Float(v, 2));
                        D.Alert(`Mapping Args: ${D.JS(params)}`);
                        parseCodesForGroundCover(params.meltMult, params);
                        break;
                    }
                    case "stormscore": {
                        parseCodesForStormScore();                            
                        break;
                    }
                    case "upgradeweather": {
                        upgradeAllWeather();
                        break;
                    }
                        // no default
                }
                break;                    
            }
            case "start": {
                toggleClock(true, parseInt(args[0]) || 60);
                break;
            }
            case "stop": {
                toggleClock(false);
                break;
            }
            case "fix": fixTimeStatus(); break;
            case "reset": {
                switch (D.LCase(call = args.shift())) {
                    case "alarms": {
                        STATE.REF.Alarms = [];
                        break;
                    }
                    case "weatherdata": {
                        STATE.REF.weatherData = D.Clone(RAWWEATHERDATA);
                        break;
                    }
                        // no default
                }
                break;
            }
            case "test": {
                switch (D.LCase(call = args.shift())) {
                    case "datestring": {
                        const [dateStart, dateStrings] = args.join(" ").split("|");
                        const dateObj = getDateObj(dateStart === "now" ? STATE.REF.dateObj : dateStart) || addTime(STATE.REF.dateObj, ...parseToDeltaTime(dateStart), false);
                        if (VAL({dateObj})) {
                            const testCases = dateStrings === "all" ? ["nextfullweek", "nextfullnight", "dawn", "dusk", "midnight", "noon", "nextweek", "endofweek"] : dateStrings.split("@");
                            const reportLines = [];
                            for (const testCase of testCases)
                                reportLines.push(`<b>${D.JS(testCase)}:</b> ${formatDateString(getDateFromDateString(dateObj, testCase, false), true)}`);
                            D.Alert(`<h3>Test Cases:</h3>${reportLines.join("<br>")}`, "!time test datestring");
                        } else {
                            D.Alert(`Invalid dateStart (${D.JS(dateStart)}) OR dateStrings (${D.JS(dateStrings)})<br><br><b>Syntax:</b> !time test datestring &lt;dateRef&gt;|&lt;dateStrings (@-delim)&gt;`, "!time test datestrings");
                        }
                        break;
                    }
                    case "date": {
                        const curDateObj = new Date(new Date().toLocaleString("en-US", {timeZone: "America/New_York"}));
                        const sessDateObj = new Date(curDateObj);                        
                        sessDateObj.setDate(curDateObj.getDate() - curDateObj.getDay() + 7);
                        sessDateObj.setHours(19);
                        sessDateObj.setMinutes(30);
                        sessDateObj.setSeconds(0);

                        let secsLeft = (sessDateObj - curDateObj)/1000; 
                        
                        if (secsLeft >= 7*24*60*60)
                            secsLeft -= 7*24*60*60;

                        const secsProgress = [secsLeft];                    
                        const daysLeft = Math.floor(secsLeft / (24 * 60 * 60));

                        secsLeft -= daysLeft * 24 * 60 * 60;
                        secsProgress.push(secsLeft);
                        const hoursLeft = Math.floor(secsLeft / (60 * 60));
                        secsLeft -= hoursLeft * 60 * 60;
                        secsProgress.push(secsLeft);
                        const minsLeft = Math.floor(secsLeft / 60);
                        secsLeft -= minsLeft * 60;
                        secsProgress.push(secsLeft);

                        const returnLines = [
                            `Current Date: ${curDateObj.toString()}`,
                            `Session Date: ${sessDateObj.toString()}`,
                            `Days: ${daysLeft}, Hours: ${hoursLeft}, Minutes: ${minsLeft}, Seconds: ${secsLeft}`,
                            `Seconds Progress: [${secsProgress.join(", ")}]`
                        ];
                        D.Alert(returnLines.join("<br>"), "Date Test");
                        break;
                    }
                    // no default
                }
                break;
            }
            case "weatherreport": {
                const transitionStrings = [
                    "<tr><td style=\"width:100px; text-align:right; text-align-last:right;\"></td><td style=\"width:60px; text-align:right; text-align-last:right;\"></td></tr>",
                    `<tr><td style="text-align:right; text-align-last:right;">DAY -> Night1</td><td style="text-align:right; text-align-last:right;">${getTime(TWILIGHT[STATE.REF.dateObj.getMonth()][1], 0, true)}</td></tr>`,
                    `<tr><td style="text-align:right; text-align-last:right;">Night1 -> Night2</td><td style="text-align:right; text-align-last:right;">${getTime(_.findKey(IMAGETIMES, v => v === "night1"), 0, true)}</td></tr>`,
                    `<tr><td style="text-align:right; text-align-last:right;">Night2 -> Night3</td><td style="text-align:right; text-align-last:right;">${getTime(_.findKey(IMAGETIMES, v => v === "night2"), 0, true)}</td></tr>`,
                    `<tr><td style="text-align:right; text-align-last:right;">Night3 -> Night4</td><td style="text-align:right; text-align-last:right;">${getTime(_.findKey(IMAGETIMES, v => v === "night3"), 0, true)}</td></tr>`,
                    `<tr><td style="text-align:right; text-align-last:right;">Night4 -> Night5</td><td style="text-align:right; text-align-last:right;">${getTime(_.findKey(IMAGETIMES, v => v === "night4"), 0, true)}</td></tr>`,
                    `<tr><td style="text-align:right; text-align-last:right;">-> Predawn5</td><td style="text-align:right; text-align-last:right;">${getTime(TWILIGHT[STATE.REF.dateObj.getMonth()][0], -120, true)}</td></tr>`,
                    `<tr><td style="text-align:right; text-align-last:right;">-> Predawn4</td><td style="text-align:right; text-align-last:right;">${getTime(TWILIGHT[STATE.REF.dateObj.getMonth()][0], -30, true)}</td></tr>`,
                    `<tr><td style="text-align:right; text-align-last:right;">-> Predawn3</td><td style="text-align:right; text-align-last:right;">${getTime(TWILIGHT[STATE.REF.dateObj.getMonth()][0], -20, true)}</td></tr>`,
                    `<tr><td style="text-align:right; text-align-last:right;">-> Predawn2</td><td style="text-align:right; text-align-last:right;">${getTime(TWILIGHT[STATE.REF.dateObj.getMonth()][0], -10, true)}</td></tr>`,
                    `<tr><td style="text-align:right; text-align-last:right;">-> Predawn1</td><td style="text-align:right; text-align-last:right;">${getTime(TWILIGHT[STATE.REF.dateObj.getMonth()][0], -5, true)}</td></tr>`,
                    `<tr><td style="text-align:right; text-align-last:right;">Predawn1 -> DAY</td><td style="text-align:right; text-align-last:right;">${getTime(TWILIGHT[STATE.REF.dateObj.getMonth()][0], 0, true)}</td></tr>`
                ];
                // const transitionStrings = ["Testing"]
                D.Alert(D.JSH([
                    `<h3>WEATHER REPORT</h3>${displayWeatherReport()}`,
                    `<h3>HORIZON TRANSITIONS</h3><table>${transitionStrings.join("")}</table>`,
                    "<b>!time</b> commands are 'add', 'set', 'run' and 'stop'.",
                    "",
                    "<b>!time set [year] [month] [day] [hour] [min]</b>",
                    "<b>!time set weather [event] [tC] [w] [humid]</b><table><tr><td style=\"width:18%;\">[EVENT]</td><td style=\"width:29%;\">x: Clear</td><td style=\"width:29%;\">b: Blizzard</td><td style=\"width:29%;\">c: Overcast</td></tr><tr><td style=\"width:18%;\"></td><td style=\"width:29%;\">f: Foggy</td><td style=\"width:29%;\">p: Downpour</td><td style=\"width:29%;\">s: Snowing</td></tr><tr><td style=\"width:18%;\"></td><td style=\"width:29%;\">t: Storm</td><td style=\"width:29%;\">w: Drizzle</td></tr><tr><td style=\"width:18%;\"></td><td style=\"width:29%;\"></td><td style=\"width:29%;\"><i>(+f for foggy)</i></td></tr>",
                    "<tr><td style=\"width:18%;\">[WIND]</td><td style=\"width:29%;\">x: Still</td><td style=\"width:29%;\">s: Soft</td><td style=\"width:29%;\">b: Breezy</td></tr><tr><td style=\"width:18%;\"></td><td style=\"width:29%;\">w: Blustery</td><td style=\"width:29%;\">g: Driving</td><td style=\"width:29%;\">h: Howling</td></tr><tr><td style=\"width:18%;\"></td><td style=\"width:29%;\"></td><td style=\"width:29%;\">v: Roaring</td></tr>",
                    "<tr><td style=\"width:18%;\">[HUMID]</td><td style=\"width:29%;\">x: null</td><td style=\"width:29%;\">d: Dry</td><td style=\"width:29%;\">h: Humid</td></tr><tr><td style=\"width:18%;\"></td><td style=\"width:29%;\"></td><td style=\"width:29%;\">m: Muggy</td><td style=\"width:29%;\">s: Swelter</td></tr></table>"
                ].join("<br>")), "TIMETRACKER");
                break;
            }
            default: {
                D.Alert(D.JSH([
                    "<b>!time</b> commands are 'add', 'set', 'run' and 'stop'.",
                    "",
                    "",
                    "<b>!time set [year] [month] [day] [hour] [min]</b>",
                    "",
                    "<b>!time set weather [event] [tC] [w] [humid]</b>",
                    "<table><tr><td style=\"width:18%;\">[EVENT]</td><td style=\"width:29%;\">x: Clear</td><td style=\"width:29%;\">b: Blizzard</td><td style=\"width:29%;\">c: Overcast</td></tr><tr><td style=\"width:18%;\"></td><td style=\"width:29%;\">f: Foggy</td><td style=\"width:29%;\">p: Downpour</td><td style=\"width:29%;\">s: Snowing</td></tr><tr><td style=\"width:18%;\"></td><td style=\"width:29%;\">t: Storm</td><td style=\"width:29%;\">w: Drizzle</td></tr><tr><td style=\"width:18%;\"></td><td style=\"width:29%;\"></td><td style=\"width:29%;\"><i>(+f for foggy)</i></td></tr>",
                    "",
                    "",
                    "<tr><td style=\"width:18%;\">[WIND]</td><td style=\"width:29%;\">x: Still</td><td style=\"width:29%;\">s: Soft</td><td style=\"width:29%;\">b: Breezy</td></tr><tr><td style=\"width:18%;\"></td><td style=\"width:29%;\">w: Blustery</td><td style=\"width:29%;\">g: Driving</td><td style=\"width:29%;\">h: Howling</td></tr><tr><td style=\"width:18%;\"></td><td style=\"width:29%;\"></td><td style=\"width:29%;\">v: Roaring</td></tr>",
                    "",
                    "",
                    "<tr><td style=\"width:18%;\">[HUMID]</td><td style=\"width:29%;\">x: null</td><td style=\"width:29%;\">d: Dry</td><td style=\"width:29%;\">h: Humid</td></tr><tr><td style=\"width:18%;\"></td><td style=\"width:29%;\"></td><td style=\"width:29%;\">m: Muggy</td><td style=\"width:29%;\">s: Swelter</td></tr></table>"
                ].join("<br>")), "TIMETRACKER");
                break;
            }
        }
        OFFSTACK(funcID);
    };
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    const ALARMFUNCS = {
        daysleep: () => {
            D.Chat(C.HTML.Block([
                C.HTML.Header("You Awaken at Dusk:"),
                C.HTML.Body([
                    "You rouse your Hunger to wake,",
                    "and to heal aggravated Health damage.",
                    "You refresh your Willpower."
                ].join("<br>"))
            ].join("")));
            for (const charObj of D.GetChars("registered")) {
                Roller.QuickRouse(charObj, false, false);
                Char.RefreshWillpower(charObj);
            }
        },
        delrolleffect: (charRef, effectString) => {
            const charObj = D.GetChar(charRef);
            if (VAL({charObj, string: effectString}))
                if (!Roller.DelCharEffect(charObj.id, effectString))
                    Roller.DelGlobalEffect(effectString);
        },
        delcharflag: (charRef, flagName, flagDisplayName, chatStyle) => {
            const charObj = D.GetChar(charRef);
            if (VAL({charObj})) {
                D.Chat(charObj.id, C.HTML.Block([
                    C.HTML.Header(`${flagDisplayName} cleared from your character.`, C.STYLES[chatStyle].header)
                ].join(""), C.STYLES[chatStyle].block));
                D.Call(`!char ${charObj.id} clear flag ${flagName}`);
            } else {
                THROW(`No Character Found for ${D.JS(charRef)}`, "delcharflag");
            }
        },
        reminjury: (charRef, effectString, chatMsg) => {
            const charObj = D.GetChar(charRef);
            if (VAL({charObj})) {
                if (chatMsg)
                    D.Chat(charObj.id, C.HTML.Block(C.HTML.Header(chatMsg, C.STYLES.whiteMarble.header), C.STYLES.whiteMarble.block));
                D.Call(`!roll effect del char ${charObj.id} ${effectString}`);
            } else {
                THROW(`No Character Found for ${D.JS(charRef)}`, "reminjury");
            }
        },
        remdyscrasia: (charRef) => {
            const charObj = D.GetChar(charRef);
            if (VAL({charObj})) {
                D.Chat(charObj.id, C.HTML.Block(C.HTML.Header("Your dyscrasia fades.")));
                D.Call(`!char ${charObj.id} set stat dyscrasias_toggle:0`);
            } else {
                THROW(`No Character Found for ${D.JS(charRef)}`, "remdyscrasia");
            }
        }
    };
    let [timeTimer, secTimer] = [null, null],
        [isTweeningClock, isFastTweeningClock, isTickingClock, isCountdownFrozen, weatherDataMemo] = [false, false, false, false, false],
        isCountdownRunning = true,
        [secondsLeft, numReturns] = [0, 0],
        countdownRecord = [];

    // #region CLASSES
    /* class Alarm {
        constructor (name, triggerRef, actions, displayOnFire, displayTo) {
            displayTo = D.LCase(displayTo) === "all" ? ["all"] : _.compact([..._.flatten([displayTo]), "Storyteller"])
            actions = _.compact([..._.flatten([actions])])
            if (VAL({string: [name, triggerRef, displayOnFire]}, "Alarm Constructor", true) &&
                VAL({string: [actions, displayTo]}, "Alarm Constructor", false)) {
                    this._name = name
                    this._actions = [...actions]
                    this._displayOnFire = displayOnFire
                    this._displayTo = [...displayTo]
                    const [triggerType, ...triggerParams] = triggerRef.split(":")



                    switch (D.LCase(triggerRef)) {
                        case "scene": {

                            break
                        }
                        case "a"
                    }
                }


        }
    } */
    // #endregion

    // #region Configuration
    const OLDRAWWEATHERDATA = [ /* eslint-disable-line no-unused-vars */
        ["f",
         ["xxoxs", "xxoxs", "xxnxx", "xxoxx", "xxoxx", "xxoxx", "xxnxs", "cxoxs", "sxoxs", "sxnxx", "cxhxb", "cxexb", "cxdxb", "cxdxw", "sxcxs", "bxdxw", "xxfxb", "xxfxb", "xxgxw", "xxgxw", "xxhxb", "xxjxs", "xxlxs", "xxlxs"],
         ["sxkxx", "sxkxx", "sxjxs", "sxjxx", "cxjxx", "sxexs", "sxdxs", "cxcxw", "bxdxw", "bxexw", "bxexw", "bxcxw", "bxcxw", "cxbxw", "bxbxg", "bxbxw", "cxbxg", "cxbxb", "sxcxb", "bxexw", "sxexb", "sxfxs", "cxfxs", "cxfxs"],
         ["cxfxb", "cxgxs", "cxgxs", "cxhxb", "cxgxb", "cxfxw", "cxfxw", "cxfxb", "cxexb", "cxexs", "cxcxb", "cxbxw", "cxbxw", "cxaxw", "cxaxw", "cxaxw", "sxaxb", "sxaxs", "bxbxw", "sxbxb", "sxcxb", "sxcxs", "sxcxs", "sxcxs"],
         ["sxcxs", "sxcxs", "sxcxs", "sxcxs", "sxcxs", "sxdxs", "sxdxs", "xxexw", "xxfxw", "bxgxw", "bxgxg", "bxgxw", "bxgxg", "bxgxg", "bxgxh", "bxgxg", "bxhxh", "bxixg", "bxkxg", "bxlxh", "bxmxg", "bxnxh", "xxoxh", "xxoxh"],
         ["xxpxh", "xxqxw", "xxqxg", "xxqxw", "xxqxg", "xxqxw", "xxpxw", "xxqxw", "xxqxb", "xxpxw", "xxoxg", "xxnxg", "bxmxw", "bxlxg", "bxlxg", "bxkxw", "xxkxw", "bxlxw", "sxlxs", "sxlxs", "bxlxw", "sxmxb", "sxnxb", "bxoxg"],
         ["sxpxb", "xxqxb", "xxqxb", "xxrxs", "xxrxs", "xxrxb", "xxrxb", "xxsxb", "xxsxb", "xxrxb", "xxqxs", "xxpxs", "xxoxb", "xxnxg", "xxmxb", "xxlxw", "xxlxb", "xxlxs", "xxmxs", "xxmxs", "xxnxs", "xxnxx", "xxnxx", "xxpxx"],
         ["xxpxx", "xxoxs", "xxoxs", "sxmxx", "sxmxx", "sxlxx", "sxmxx", "cxjxs", "cxixs", "cxhxb", "bxgxw", "sxfxb", "bxexw", "cxexw", "cxdxw", "cxcxw", "cxcxw", "cxcxb", "cxbxb", "sxbxb", "sxaxs", "sx0xs", "cxBxb", "pxBxw"],
         ["pxCxb", "cxCxb", "bxCxw", "sxCxb", "sxCxb", "sxDxb", "sxCxb", "bxCxw", "sxDxb", "sxDxs", "sxExb", "sxFxb", "sxGxs", "cxGxb", "cxHxw", "cxHxb", "cxHxb", "cxHxb", "cxHxs", "cxHxw", "cxHxb", "cxHxw", "sxGxs", "sxGxb"],
         ["sxFxs", "cxFxs", "sxFxs", "sxFxs", "sxFxb", "sxExb", "sxExs", "cxExs", "cxExs", "cxExb", "cxExs", "cxExs", "cxExs", "sxExs", "sxExb", "sxExs", "cxExs", "cxDxs", "cxDxs", "sxDxx", "sxDxx", "sxDxx", "cxCxx", "cxDxx"],
         ["cxDxs", "cxDxs", "cxDxs", "cxDxs", "xxBxs", "xx0xs", "xxBxs", "xx0xs", "xxAxx", "xxCxs", "xxExb", "xxExb", "xxFxb", "cxGxb", "cxGxb", "wxFxs", "wfFxb", "wfFxb", "wfGxs", "wfGxs", "wfHxs", "xfGxx", "xfHxx", "xfHxs"],
         ["wfHxx", "wfIxs", "xfIxx", "xfIxs", "xfHxx", "xfHxx", "xfLxs", "cxMxs", "wxMxs", "wxNxb", "cxNxs", "cxOxs", "cxPxb", "cxPxg", "cxPxs", "wxQxs", "wxPxs", "wxPxs", "wfPxb", "wfPxs", "wfPxb", "wfPxw", "wfPxw", "wfPxg"],
         ["wfPxw", "wfPxw", "wfPxw", "wfQxb", "wxQxs", "wxQxb", "wxRxw", "wxQxs", "wfNxg", "wxJxw", "wfHxh", "wfGxv", "pfExh", "pxCxv", "bxAxh", "bxaxw", "bxbxw", "bxcxg", "bxdxh", "cxdxh", "bxexh", "bxexw", "cxexg", "bxfxg"],
         ["bxfxw", "cxgxh", "cxgxv", "cxgxg", "cxhxg", "cxhxg", "cxixg", "cxixb", "cxixw", "cxjxw", "xxixw", "xxixg", "xxhxg", "xxhxg", "xxgxw", "xxgxw", "xxhxh", "xxhxb", "xxhxb", "xxhxs", "xxixs", "xxjxs", "xxjxx", "xxjxx"],
         ["xxkxs", "xxkxs", "xxkxs", "xxkxs", "xxkxx", "xxlxs", "xxlxs", "xxlxx", "xxlxx", "xxjxx", "cxfxs", "cxdxs", "cxbxs", "cxaxs", "cx0xs", "cxaxs", "cxaxs", "cxbxs", "cxbxs", "cxcxs", "cxbxs", "cxbxs", "cxbxb", "cxbxb"],
         ["cxbxw", "cxcxb", "cxcxw", "cxcxw", "cxcxb", "sxbxb", "bxcxw", "bxdxw", "bxexw", "bxexg", "bxfxw", "bxfxw", "bxexg", "bxexw", "sxdxb", "sxdxb", "sxdxs", "sxdxb", "sxdxb", "bxdxw", "sxdxb", "sxdxb", "sxdxs", "sxdxs"],
         ["sxdxs", "sxdxs", "sxcxs", "sxcxs", "sxdxs", "sxdxs", "sxcxs", "sxcxx", "sxcxs", "sxcxx", "sxaxx", "sx0xs", "sx0xs", "cxBxs", "cxBxs", "cxBxb", "cxBxs", "cxBxx", "cxAxs", "cx0xs", "sx0xx", "sx0xs", "sxaxs", "sxaxs"],
         ["sxbxs", "sxcxs", "sxcxs", "sxdxs", "sxdxs", "sxdxs", "sxfxs", "xxfxx", "xxgxs", "xxfxs", "xxdxs", "xxbxw", "xxaxb", "cx0xs", "cx0xw", "cx0xb", "xx0xb", "xxaxb", "xxbxb", "xxbxw", "xxbxg", "xxaxg", "xxaxb", "xxbxw"],
         ["xxaxw", "xxbxw", "xxbxb", "xxbxs", "xxcxs", "xxcxs", "xxcxw", "sxcxb", "bxbxw", "sxbxb", "sxbxb", "sxaxs", "sxaxs", "sx0xb", "sx0xs", "sx0xs", "cxAxs", "bf0xw", "sx0xb", "sx0xs", "sx0xs", "sxAxs", "cxAxs", "cxAxs"],
         ["cxAxs", "xx0xs", "xxAxs", "xxAxs", "cxAxs", "cxAxs", "cxBxs", "cxBxb", "cxBxs", "cxBxw", "cxCxb", "cxDxb", "cxDxb", "xxExb", "xxFxw", "xxGxb", "cxGxb", "cxFxb", "cxFxs", "cxFxb", "cxFxb", "cxGxw", "cxGxw", "cxHxw"],
         ["cxHxg", "cxHxg", "cxGxw", "cxGxs", "cxGxs", "cxGxs", "cxHxs", "cxHxs", "cxHxs", "cxHxb", "cxIxb", "cxJxs", "cxJxb", "cxKxs", "cxKxb", "cxKxs", "cxKxb", "cxJxs", "cxJxs", "xxIxs", "xxHxs", "xxGxs", "xxGxs", "xxGxs"],
         ["xxFxs", "cxFxx", "cxExx", "cxExx", "cxExx", "cxExx", "cxExx", "cxDxs", "cxDxx", "cxExx", "xxGxx", "xxIxs", "xxJxs", "cxJxs", "cxIxs", "cxJxs", "cxJxs", "cxHxs", "xfGxs", "xfGxx", "xfGxs", "xfGxx", "wfGxx", "wfGxs"],
         ["wfGxx", "wfGxx", "wfGxs", "wfHxs", "wfHxs", "wfHxs", "wfHxs", "wfHxs", "wfGxs", "wfGxb", "wfGxb", "wfHxb", "wfHxw", "wfHxb", "wfGxw", "wfFxg", "xfFxg", "xfFxw", "xfFxb", "xfGxw", "xfFxs", "xfFxb", "wfFxb", "wfFxb"],
         ["wfGxs", "xfGxs", "wfHxs", "wfHxs", "wfIxs", "xfIxx", "xfIxs", "xfIxs", "xfIxs", "xfIxs", "xfJxs", "xfKxs", "xfLxw", "cxKxb", "cxKxb", "cxJxg", "wxJxb", "wxIxw", "sxGxb", "cxExw", "cxDxw", "bxCxw", "cxBxw", "sxAxb"],
         ["bxAxw", "bx0xh", "bxaxg", "bxbxg", "cxbxg", "bxcxg", "bxexw", "xxfxw", "xxgxw", "xxgxb", "xxexb", "xxdxb", "xxbxb", "xxaxb", "xxaxb", "xxaxb", "cxaxb", "cxaxw", "cxbxw", "cxbxw", "cxcxw", "cxcxb", "xxdxb", "xxexb"],
         ["xxexw", "xxfxw", "xxexb", "xxexs", "cxexb", "cxexs", "cxexs", "cxexs", "cxexx", "cxdxx", "cxbxs", "cxaxs", "cxAxs", "cxAxs", "cxAxs", "cxAxs", "cxAxs", "sxAxs", "sxAxs", "sxAxs", "sxBxs", "sxBxs", "sxBxs", "sxBxx"],
         ["sxCxx", "cxCxx", "cxBxs", "cxBxx", "cxBxs", "cxBxs", "cxBxs", "xxAxx", "xxBxs", "xxExb", "cxExb", "cxGxw", "cxGxw", "cxGxw", "cxHxb", "cxHxb", "xxHxs", "xxGxb", "xxGxb", "xxFxs", "xxExs", "xxExx", "xxDxx", "xxDxx"],
         ["xxGxs", "cxKxb", "cxKxs", "cxJxs", "cxKxs", "cxLxs", "cxLxs", "cxKxs", "cxMxb", "cxNxb", "cxNxw", "cxOxw", "cxOxg", "cxNxg", "wxNxw", "wxLxw", "cxLxw", "cxLxw", "cxLxw", "cxLxb", "cxLxs", "cxKxs", "xxJxs", "xxIxs"],
         ["xxGxs", "xxGxs", "xxExx", "xxDxs", "xxExs", "xxCxx", "xxCxx", "xxDxs", "xxDxx", "xxGxx", "xxHxs", "xxIxs", "xxIxs", "cxIxs", "cxHxb", "cxGxs", "cxGxb", "cxFxs", "cxExs", "xxDxs", "xxDxs", "xxDxs", "cxDxs", "cxDxs"],
         ["cxCxx", "xxBxs", "xxAxs", "xxBxs", "cxCxs", "cxCxs", "cxBxs", "cxBxs", "cxBxs", "cxBxs", "cxBxs", "sxCxs", "sxCxb", "cxDxb", "bxCxw", "sxBxb", "sxBxb", "sxAxb", "sxAxs", "sxAxb", "bx0xw", "sx0xb", "bx0xw", "sxaxb"],
         ["bxaxw", "sxbxb", "bxbxw", "bxcxw", "bxdxw", "bxdxw", "bxexg", "bxexw", "bxfxw", "bxfxw", "xxexw", "xxexg", "xxexg", "xxexw", "xxexw", "xxdxh", "xxdxw", "xxexb", "xxfxs", "xxfxs", "xxfxx", "xxgxs", "xxgxx", "xxhxs"],
         ["xxhxx", "xxhxx", "xxhxx", "xxixx", "xxjxs", "xxjxx", "xxjxx", "cxgxs", "cxexs", "sxaxb", "sxaxb", "sx0xb", "bxAxg", "cxBxb", "cxCxb", "cxDxw", "cxExb", "cxFxb", "cxFxb", "cxGxb", "cxGxs", "cxHxs", "cxGxs", "cxGxs"]
        ],
        ["b", 
         ["cxAxx", "cxbxs", "cxbxx", "cxbxx", "cx0xs", "cx0xs", "cxAxs", "cxBxb", "cxBxs", "cxBxs", "xxDxs", "xxFxw", "xxFxw", "cxExw", "cxDxg", "bxaxh", "bxbxw", "bxcxw", "bxexg", "xxexw", "xxfxw", "xxgxw", "xxgxb", "xxhxb"],
         ["xxhxb", "xxixs", "xxhxs", "sxhxb", "sxhxb", "bxlxw", "bxmxw", "xxnxw", "xxoxw", "xxoxg", "xxoxw", "xxmxb", "xxmxw", "xxkxb", "xxkxw", "xxjxw", "xxixs", "xxjxb", "xxjxs", "sxixb", "sxixs", "bxixw", "sxixb", "sxixb"],
         ["sxhxb", "cxhxb", "sxhxb", "sxhxb", "cxhxb", "cxhxw", "sxhxb", "cxhxb", "cxixb", "sxhxb", "sxgxb", "sxfxb", "sxdxb", "sxdxb", "sxdxb", "sxcxs", "bxcxw", "bxcxw", "sxcxb", "sxcxb", "bxbxw", "sxbxb", "sxaxb", "bxaxw"],
         ["sxaxs", "cxaxs", "cx0xs", "cxAxs", "sx0xb", "sx0xs", "sx0xs", "sx0xs", "sx0xs", "sxAxs", "sxAxx", "sxAxs", "sxBxs", "sxCxs", "sxCxs", "sxCxs", "sxCxs", "sx0xb", "bxcxg", "bxexh", "bxexg", "bxfxg", "bxgxh", "bxhxg"],
         ["bxhxg", "bxixg", "bxjxw", "bxkxw", "sxlxb", "sxlxs", "sxmxs", "sxlxx", "sxkxs", "sxjxs", "cxixs", "cxgxw", "sxgxb", "bxgxw", "sxfxb", "sxgxb", "xxgxb", "xxgxb", "xxgxs", "cxgxs", "cxfxs", "cxfxb", "cxfxb", "cxgxb"],
         ["cxgxs", "cxgxs", "cxgxb", "sxgxs", "sxgxs", "sxgxs", "sxgxs", "sxgxs", "sxgxs", "sxgxb", "cxfxs", "cxexs", "cxdxs", "xxcxs", "xxcxb", "xxcxs", "cxcxs", "cxdxb", "sxdxs", "xxexs", "xxfxs", "xxgxs", "xxgxs", "xxhxx"],
         ["xxixx", "cxixs", "cxixx", "cxixx", "cxhxs", "cxgxs", "sxgxs", "sxfxs", "sxfxs", "sxfxs", "sxexs", "bxfxw", "bxfxw", "sxfxb", "bxexw", "bxdxw", "bxdxg", "bxexw", "sxfxb", "xxfxs", "xxfxs", "xxgxs", "xxhxs", "xxhxs"],
         ["xxixs", "xxixs", "xxjxs", "xxkxx", "xxkxx", "xxmxx", "sxkxx", "sxixx", "sxixx", "sxhxx", "sxgxs", "sxfxb", "sxexs", "cxexs", "sxfxb", "bxfxw", "cxfxs", "cxfxb", "cxgxs", "xxgxs", "xxgxs", "xxgxs", "xxgxs", "xxhxs"],
         ["xxgxs", "xxgxs", "xxhxs", "xxhxs", "xxhxs", "xxgxs", "xxgxs", "cxgxs", "cxgxs", "sxfxs", "sxfxs", "sxexs", "sxexs", "sxdxs", "sxdxs", "sxdxs", "sxdxs", "sxdxs", "sxdxs", "sxdxs", "sxdxs", "sxdxs", "sxdxs", "sxdxb"],
         ["sxdxs", "cxdxs", "xfdxs", "xfexs", "xfexs", "xfexs", "xfexs", "xfexs", "xfexs", "sxdxs", "sxdxs", "sxcxs", "sxcxs", "sxcxb", "sxcxs", "sxcxs", "sxcxb", "sxcxs", "sxdxs", "cxdxs", "cxdxs", "cxdxs", "cxdxs", "cxexs"],
         ["cxexs", "cxfxs", "cxfxs", "cxfxs", "cxexs", "cxdxs", "cxdxs", "cxdxb", "cxdxs", "cxdxb", "cxdxb", "cxdxs", "xxdxs", "xfcxb", "sfbxs", "sfaxs", "cxaxx", "xfaxs", "sxaxs", "cxaxs", "cxaxs", "cxaxb", "cxbxb", "cxbxs"],
         ["cxaxb", "cxaxb", "cxaxb", "cxcxs", "xxdxs", "xxexs", "xxexs", "xxexs", "xxexs", "sxdxs", "xxcxs", "xxcxw", "xxcxb", "cxcxw", "cxcxb", "cxcxb", "cxdxb", "cxdxs", "cxexs", "xxfxs", "xxgxs", "xxgxs", "xxhxs", "xxgxs"],
         ["xxhxs", "xxixs", "xxjxx", "xxmxx", "xxmxx", "xxmxx", "xxmxx", "xxnxx", "xxmxx", "xxjxx", "cxgxs", "cxexs", "sxdxs", "cxcxb", "cxcxs", "cxcxs", "cxcxb", "cxcxs", "cxcxs", "cxbxs", "cxbxs", "cxbxs", "cxaxs", "cxbxx"],
         ["cxcxx", "cxcxs", "cxcxx", "cxcxx", "cxaxs", "cx0xs", "cx0xs", "xx0xs", "xf0xs", "xfAxs", "xxCxb", "xxDxs", "xxFxs", "xxGxw", "xxGxb", "xxGxb", "xxGxw", "xxGxs", "xxFxs", "xxFxb", "xxExb", "xxExb", "xxExs", "xxExx"],
         ["xxDxs", "cxExs", "xfExs", "xfExs", "xfExs", "xfExs", "xfFxs", "xfFxb", "xfFxb", "xfGxw", "cxHxw", "cxIxw", "cxIxs", "cxIxs", "cxJxb", "cxJxb", "cxJxb", "cxJxb", "cxIxs", "cxHxs", "cxHxs", "cxGxs", "cxGxs", "cxFxb"],
         ["cxFxb", "cxExs", "cxDxs", "cxDxs", "cxCxs", "cxCxb", "cxCxs", "cxCxb", "cxCxw", "bx0xg", "cx0xg", "cxaxw", "cxaxh", "xxaxh", "xxaxg", "xxbxh", "xxbxw", "xxaxw", "xxbxs", "xxcxs", "xxdxs", "xxdxs", "xxexs", "xxexs"],
         ["xxexs", "xxexs", "xxexs", "xxfxx", "xxgxx", "xxgxx", "xxhxx", "xxixx", "xxhxx", "xxdxs", "cx0xb", "cx0xw", "cx0xw", "cx0xw", "cx0xb", "cx0xw", "cx0xw", "cx0xb", "cx0xb", "cx0xs", "cx0xb", "cx0xs", "cx0xs", "cx0xs"],
         ["cx0xs", "sx0xs", "sx0xs", "sx0xs", "cx0xs", "sx0xs", "sxAxs", "sxAxs", "sxBxs", "sxBxs", "cxDxb", "cxDxw", "cxDxb", "cxDxs", "cxDxs", "cxExb", "xxExb", "xxCxw", "xxCxb", "xxBxw", "xxBxs", "xxBxs", "cxBxs", "cxAxb"],
         ["cxAxs", "cxAxs", "cxAxs", "cxAxs", "cxAxs", "cxAxs", "cxaxs", "cxaxs", "cx0xx", "cxCxs", "cxDxs", "cxFxs", "cxFxs", "wfExs", "wfDxs", "wfDxx", "wfDxs", "xfDxs", "wfDxs", "wfDxx", "wfDxx", "wfDxx", "wfDxs", "wfExs"],
         ["wfExx", "wfFxx", "xfFxx", "xfFxs", "xfFxx", "xfFxs", "xfFxs", "wfFxx", "wfFxx", "wfFxx", "wfGxx", "wfHxx", "wfIxs", "wfMxs", "wfMxs", "wxOxb", "cxQxb", "cxQxb", "cxQxs", "cxQxs", "cxPxs", "cxOxs", "cxOxs", "cxPxs"],
         ["cxQxw", "cxPxs", "cxPxs", "cxOxs", "cxOxx", "cxKxx", "wxMxx", "wxExg", "wxDxg", "wxDxw", "wxCxw", "wxDxw", "wxDxw", "wxCxw", "wxCxg", "wxDxw", "cxCxw", "cxBxb", "cxBxb", "xxAxs", "xxAxs", "xxAxs", "xx0xs", "xx0xb"],
         ["xxaxb", "xxaxw", "xxaxb", "xxaxs", "cxaxs", "cxaxs", "cxaxs", "cxaxs", "cxaxs", "cx0xs", "cxAxb", "cxAxs", "cxAxs", "cxBxs", "cxBxs", "cxCxs", "cxCxb", "cxCxs", "cxBxs", "xxAxs", "xxAxs", "xx0xs", "cx0xs", "cx0xb"],
         ["cx0xs", "cx0xs", "cxaxb", "cxaxs", "cxaxb", "cxaxw", "cxaxs", "cxAxb", "cxAxw", "wfBxb", "wfCxw", "wfCxb", "wfDxs", "wfDxs", "wfExs", "wfExs", "wfFxx", "wfFxs", "xfFxs", "cxGxs", "cxHxs", "cxGxs", "cxGxs", "cxGxs"],
         ["cxGxb", "cxGxs", "wxFxw", "wxExs", "cxExs", "cxExs", "cxDxs", "cxCxs", "cxBxb", "cxBxb", "cxCxb", "cxCxb", "cxDxs", "cxExs", "cxExs", "cxFxs", "xxFxs", "xxFxs", "xxExs", "xxCxs", "xxCxs", "xxCxs", "cxBxb", "cxCxb"],
         ["cxCxg", "wxCxg", "wxBxg", "wxBxg", "wxBxh", "wxCxg", "wfCxg", "wfDxg", "wfDxs", "wfFxs", "cxGxs", "cxLxb", "cxMxw", "xxMxg", "xxMxg", "xxLxw", "xxLxw", "xxJxg", "xxIxw", "xxHxb", "xxGxb", "xxFxb", "xxFxb", "xxExb"],
         ["xxExs", "xxExs", "xxDxs", "xxDxs", "xxCxx", "xxBxx", "xxAxx", "xxBxs", "xxCxs", "xxExb", "cxExb", "cxGxb", "cxGxb", "xxHxw", "xxHxs", "xxIxb", "xxIxs", "xxHxb", "xxGxs", "xxFxs", "xxExs", "xxDxx", "xxCxx", "xxCxs"],
         ["xxCxs", "xx0xx", "xxaxx", "xx0xx", "xxBxs", "xx0xx", "xx0xx", "xx0xx", "xxCxs", "xxFxs", "xxHxs", "xxKxb", "xxMxb", "xxNxw", "xxOxg", "xxOxg", "xxOxw", "xxNxw", "xxLxb", "cxKxw", "cxKxb", "cxJxs", "cxJxs", "cxJxs"],
         ["cxIxs", "cxIxs", "cxIxs", "cxFxs", "cxGxs", "cxFxx", "cxDxx", "cxFxs", "cxFxs", "cxIxs", "cxIxs", "cxKxs", "cxLxs", "xxNxb", "xxPxb", "xxQxw", "cxQxb", "cxOxw", "cxKxw", "xxGxw", "xxDxw", "xxDxw", "cxDxw", "cxDxs"],
         ["cxIxs", "cxIxs", "cxIxs", "cxFxs", "cxGxs", "cxFxx", "cxDxx", "cxFxs", "cxFxs", "cxIxs", "cxIxs", "cxKxs", "cxLxs", "xxNxb", "xxPxb", "xxQxw", "cxQxb", "cxOxw", "cxKxw", "xxGxw", "xxDxw", "xxDxw", "cxDxw", "cxDxs"]
        ],
        ["a",
         ["cxCxw", "cxCxb", "cxBxb", "cxBxb", "cxBxs", "cxAxx", "cxaxs", "cxAxs", "cxBxs", "cxBxs", "cxCxw", "cxDxs", "cxDxb", "cxExw", "cxExb", "cxDxb", "cxCxb", "cxCxs", "cxCxs", "cxDxs", "cxExb", "cxDxb", "cxDxw", "bxCxg"],
         ["bxBxw", "bxAxg", "bxAxw", "bx0xg", "cxAxw", "cxAxg", "cxAxg", "cx0xw", "cxAxw", "cxAxh", "cxAxg", "cxBxg", "cxCxh", "cxCxh", "cxCxh", "cxCxg", "cxBxg", "cxBxw", "cxAxg", "xxAxw", "xx0xw", "xx0xb", "xx0xw", "xxaxb"],
         ["xxaxb", "xxaxb", "xxbxb", "xxbxw", "xxbxs", "xxbxb", "xxcxw", "xxcxb", "xxbxw", "xx0xg", "xx0xg", "xxBxg", "xxBxg", "xxCxg", "xxDxg", "xxDxg", "xxDxg", "xxCxw", "xxAxg", "xx0xw", "xxaxw", "xxaxw", "xxaxw", "xx0xg"],
         ["xxaxg", "xxaxw", "xxbxb", "xxbxs", "xxcxg", "xxcxw", "xxdxw", "xxdxw", "xxcxw", "xxbxg", "xxaxg", "xx0xw", "xxAxg", "xxAxg", "xxBxg", "xxBxg", "xxAxg", "xx0xg", "xxaxg", "xxbxw", "xxbxw", "xxbxb", "xxbxw", "xxbxw"],
         ["xxcxw", "xxdxg", "xxdxg", "xxdxg", "xxexb", "xxexb", "xxfxb", "xxfxb", "xxexs", "xxcxw", "xxbxw", "xxaxs", "xx0xs", "cxBxs", "cxBxs", "cxBxb", "cxBxs", "cxBxs", "cxAxb", "xx0xs", "xxaxs", "xxaxs", "xxbxx", "xxbxx"],
         ["xxbxx", "cxbxx", "cxbxx", "cxaxs", "cxaxs", "sxaxs", "sxaxs", "cxaxs", "sxaxb", "bx0xw", "sx0xb", "bx0xw", "bx0xw", "cx0xw", "cx0xw", "cxAxg", "bxAxw", "bxAxw", "sxAxs", "sxAxb", "sxBxs", "sxBxb", "cxBxs", "cxBxs"],
         ["cxAxs", "xx0xs", "xx0xs", "xxAxs", "cxAxs", "cxAxs", "cxAxs", "xfAxs", "xfAxs", "xfBxb", "cxCxb", "cxCxb", "cxDxb", "cxCxs", "cxCxb", "sxCxs", "sxCxb", "wxCxs", "wxCxs", "xfBxs", "sfBxb", "xfBxs", "xfBxs", "xfBxs"],
         ["xfAxb", "cx0xs", "cx0xb", "cxaxb", "cxaxb", "cxaxb", "cxbxs", "cxbxs", "cxbxs", "cxbxs", "cxbxs", "cxaxs", "cxaxs", "cx0xs", "cx0xs", "cx0xs", "cx0xs", "cx0xs", "cx0xs", "cxaxs", "cxaxx", "cxaxs", "cxaxs", "cxbxs"],
         ["sxaxb", "bxaxw", "sxaxb", "sxaxs", "cxaxs", "sxaxs", "sx0xs", "sx0xs", "sx0xs", "sxAxs", "cxAxb", "cxBxg", "bxBxw", "bxBxw", "sxCxb", "bxAxw", "bxBxw", "sxAxb", "sx0xb", "cx0xw", "sxaxs", "sxaxs", "xxaxb", "xxaxs"],
         ["xxbxs", "xxbxs", "xxbxs", "xxbxs", "cxbxs", "cxbxs", "cxbxs", "cxbxs", "cxbxs", "cxaxb", "cx0xw", "cx0xw", "cxAxw", "cx0xw", "cxBxw", "cxAxw", "cxAxb", "cxAxw", "cx0xw", "cxaxw", "cxbxb", "cxbxs", "xxcxs", "xxcxs"],
         ["xxcxs", "cxcxs", "cxbxs", "sxbxs", "cxbxs", "cxdxs", "cxdxs", "xxdxs", "xxcxs", "xxbxw", "cxaxb", "cx0xw", "cxAxb", "cxBxb", "cxBxs", "cxBxw", "xxBxw", "xxBxw", "xx0xb", "xxaxs", "xxbxs", "xxbxs", "xxcxs", "xxcxs"],
         ["xxcxs", "xxdxb", "xxdxs", "xxcxs", "cxbxb", "cxbxb", "cxbxs", "cxbxb", "sxbxs", "sxaxs", "cxaxs", "cxaxs", "sx0xx", "sx0xx", "sx0xx", "sx0xs", "cxaxs", "sxaxx", "sxbxx", "sxbxx", "sxbxx", "sxbxs", "cxbxs", "sxbxs"],
         ["sxbxs", "sxbxs", "sxbxs", "sxbxs", "sxbxs", "sxbxs", "sxbxs", "sxcxs", "sxbxs", "bxaxw", "cx0xb", "cx0xb", "cxAxb", "cxBxb", "cxBxw", "cxBxg", "cxAxw", "cxAxg", "cx0xw", "bxaxw", "bxaxw", "sxaxb", "bx0xg", "sxaxb"],
         ["sxaxb", "sxaxb", "sxaxs", "bxaxw", "cxaxw", "bxbxw", "bxbxg", "bxbxg", "bxbxg", "bxbxw", "bxaxg", "bxaxg", "bx0xh", "cx0xg", "cx0xg", "cx0xh", "cxAxw", "cxAxw", "cx0xw", "cxaxw", "cxbxb", "cxbxs", "cxbxs", "cxcxs"],
         ["cxcxs", "xxdxs", "xxcxx", "xxdxs", "xxdxx", "xxdxx", "xxdxx", "xxdxs", "xxaxs", "xx0xb", "cxBxw", "cxCxs", "cxDxb", "xxDxb", "xxDxw", "xxDxw", "cxDxw", "cxBxb", "cx0xg", "xxaxw", "xxaxw", "xxaxb", "sxaxb", "sxbxb"],
         ["sxbxs", "sxbxb", "bxcxw", "bxexw", "bxexw", "bxfxg", "bxgxg", "bxgxw", "bxgxg", "bxgxh", "bxexg", "bxdxg", "bxdxw", "bxcxw", "sxcxb", "bxaxw", "xx0xw", "xx0xw", "xxaxw", "xxbxs", "xxcxb", "xxcxb", "xxdxs", "xxdxs"],
         ["xxdxs", "xxdxs", "xxexs", "xxexs", "xxexs", "xxexs", "xxcxs", "xxcxs", "xxaxs", "xxAxg", "xxBxw", "xxCxh", "xxCxw", "xxDxg", "xxCxw", "xxCxg", "xxCxw", "xxAxg", "xxaxg", "xxbxg", "xxcxw", "xxdxb", "xxdxs", "xxdxs"],
         ["xxdxs", "cxdxs", "cxdxs", "cxdxx", "cxdxx", "cxcxs", "cxcxs", "cxcxs", "cxaxs", "cxAxs", "xxCxs", "xxDxs", "xxFxs", "cxGxs", "cxHxs", "cxFxs", "cxFxs", "cxExs", "cxDxs", "xxCxs", "xxBxb", "xx0xw", "xx0xb", "xx0xb"],
         ["xxaxb", "xxbxs", "xxcxb", "xxdxs", "xxfxb", "xxgxs", "xxgxs", "xxhxs", "xxfxs", "xxexs", "xxdxs", "xxbxx", "xxaxx", "xxaxs", "xxAxx", "xxAxb", "xxAxs", "xxAxb", "xx0xb", "xxaxs", "xxbxs", "xxcxs", "xxdxs", "xxexs"],
         ["xxfxs", "xxexs", "xxfxs", "xxfxs", "xxfxs", "xxexs", "xxexb", "xxexs", "xxdxb", "xxbxb", "xxaxb", "xxAxw", "xxBxw", "xxCxb", "xxCxs", "xxDxb", "cxCxs", "cxBxs", "cxAxs", "xx0xs", "xxaxs", "xxbxs", "xxbxs", "xxcxs"],
         ["xxbxs", "xxbxs", "xxcxb", "xxcxw", "xxcxw", "xxdxs", "xxexs", "cxexb", "cxdxb", "cxaxb", "cx0xb", "cxBxb", "cxCxw", "cxDxw", "cxExg", "cxExw", "cxFxw", "cxExw", "cxCxw", "cxCxw", "cx0xw", "cx0xb", "xxaxb", "xxaxw"],
         ["xxaxb", "xxaxb", "xxbxb", "xxcxb", "xxcxb", "xxcxb", "xxdxb", "cxdxb", "cxcxw", "cxaxw", "cxAxw", "cxBxg", "cxBxw", "cxDxw", "cxDxb", "cxCxg", "cxCxw", "cxBxw", "cxAxw", "xx0xs", "xxaxw", "xxaxb", "xxaxb", "xxbxs"],
         ["xxbxb", "xxbxb", "xxbxw", "xxbxb", "xxcxs", "xxcxs", "xxdxs", "xxcxb", "xxbxw", "xx0xw", "cxAxg", "cxBxg", "cxCxw", "xxCxg", "xxDxg", "xxDxw", "xxDxg", "xxCxw", "xxAxw", "xx0xb", "xxaxw", "xxaxw", "xxaxs", "xxaxs"],
         ["xxbxs", "xxbxs", "xxcxw", "xxcxb", "xxdxw", "xxdxw", "xxexb", "xxexg", "xxdxw", "xxcxg", "xxbxw", "xxaxb", "xxAxw", "xxAxw", "xxAxw", "xxBxw", "xxBxg", "xxAxw", "xx0xw", "xxaxw", "xxbxw", "xxcxb", "xxcxw", "xxdxs"],
         ["xxexb", "xxexs", "xxfxs", "xxgxb", "xxgxb", "xxgxw", "xxgxb", "xxgxs", "xxdxb", "xxbxs", "xx0xs", "xxBxw", "xxCxs", "xxCxb", "xxDxs", "xxExb", "xxExb", "xxDxs", "xxCxs", "xxAxs", "xxAxs", "xx0xs", "xxaxx", "xxbxs"],
         ["xxcxx", "xxcxs", "xxaxs", "xxaxs", "xxaxs", "xxbxs", "xxbxs", "xxaxs", "xxaxs", "xxCxs", "xxExb", "xxGxb", "xxGxw", "xxHxw", "xxIxg", "xxHxw", "xxHxg", "xxGxw", "xxFxw", "xxExw", "xxExw", "xxExw", "cxExw", "cxExw"],
         ["cxDxs", "cxDxs", "cxExs", "cxExs", "cxDxs", "cxDxs", "cxDxb", "cxDxw", "cxExw", "wxExb", "wxDxb", "wxDxw", "wxCxb", "wxCxw", "wfCxb", "wfCxs", "wfDxs", "wfDxs", "wfDxs", "wfExs", "xfExx", "xfFxx", "xfFxs", "xfExs"],
         ["xfExs", "xfExs", "xfExw", "xfDxw", "cxCxs", "cxCxw", "cxCxb", "cxCxs", "cxCxb", "cxDxs", "cxExs", "cxFxs", "cxGxx", "cxHxs", "cxHxx", "cxIxs", "cxIxs", "cxGxs", "cxGxs", "cxExs", "cxDxs", "cxDxx", "xxBxx", "xxBxx"],
         ["xxAxx", "xxAxs", "xxAxx", "xf0xx", "xfAxx", "xfCxx", "xfCxx", "xfCxs", "xfDxx", "xfExs", "xfExs", "wfFxs", "wfFxs", "wfGxs", "wfGxs", "wfGxb", "wxFxb", "wxFxs", "wxFxb", "wxFxw", "wxExb", "wxExb", "wxExb", "wxExw"],
         ["wxDxw", "wxDxb", "wxDxb", "wxDxg", "cxDxw", "cxBxh", "cxBxw", "cxBxw", "cxBxb", "cxCxw", "cxDxh", "cxDxw", "cxDxw", "cxExw", "cxExw", "cxDxw", "cxDxw", "cxDxb", "cxCxb", "cxBxs", "cxBxs", "cxAxs", "cx0xx", "cx0xs"],
         ["cxaxx", "cxaxs", "cxaxx", "cxbxx", "cxAxs", "cx0xs", "cx0xs", "xx0xs", "xxCxb", "xxExw", "xxGxb", "xxHxw", "xxHxw", "cxHxg", "cxHxg", "cxHxw", "cxHxh", "wxFxg", "wxFxw", "wxFxw", "wxGxw", "pxHxs", "cxHxw", "cxExw"]
        ],
        ["C",
         ["cxbxh", "cxdxg", "cxexg", "cxexg", "cxexb", "cxfxw", "cxgxb", "xxfxs", "xxexb", "xxexb", "cxcxb", "cxcxb", "cxbxw", "cxbxs", "cxaxw", "cxbxb", "cxaxb", "cxbxw", "cxcxw", "cxdxs", "cxdxs", "cxdxx", "cxdxx", "cxdxx"],
         ["cxexx", "xxfxx", "xxgxx", "xxfxx", "cxfxx", "cxgxx", "cxgxx", "xxfxs", "xxdxx", "xxcxs", "xxbxs", "xx0xs", "xxAxs", "xxBxw", "xxCxb", "xxCxs", "cxDxb", "cxCxb", "cxBxs", "cxAxs", "cxAxs", "cx0xs", "cx0xx", "cxaxs"],
         ["cxbxs", "cxbxx", "cxbxx", "cxbxs", "cxcxs", "cxbxs", "cxbxs", "cxbxs", "cxaxs", "cxaxw", "cx0xb", "cxAxw", "cxAxw", "cxAxw", "cxAxg", "cx0xg", "wxaxb", "wfaxb", "wfaxw", "wfaxw", "wfaxw", "wxaxw", "wfaxb", "wfaxs"],
         ["wfaxb", "wxaxb", "wfaxb", "wf0xs", "wf0xs", "wf0xs", "wfAxs", "cxAxw", "cx0xg", "cx0xg", "cxAxv", "cxAxh", "cxaxv", "cxbxv", "cxdxv", "bxexv", "bxexg", "bxexw", "bxfxg", "cxgxh", "cxgxw", "bxgxw", "bxgxw", "bxgxw"],
         ["sxgxb", "cxgxs", "cxgxb", "cxhxs", "xxhxs", "sxixb", "sxjxs", "xxjxs", "xxhxs", "xxgxs", "cxfxw", "cxdxb", "cxdxw", "cxcxw", "bxdxw", "bxcxw", "xxcxs", "xxcxb", "xxcxb", "xxdxs", "xxdxs", "xxdxx", "cxdxs", "cxexs"],
         ["cxexx", "xxexs", "xxfxx", "xxexs", "cxfxx", "cxfxx", "cxexx", "cxdxs", "sxcxs", "sxcxs", "sxcxs", "sxcxs", "sxdxs", "sxcxs", "sxcxs", "sxbxs", "bxAxg", "bx0xw", "bxbxw", "xxbxw", "xxdxb", "xxdxb", "cxexw", "cxfxw"],
         ["cxfxb", "xxgxw", "xxgxg", "xxgxw", "xxhxb", "xxhxs", "xxixs", "cxhxb", "sxgxb", "sxfxb", "cxexb", "cxdxb", "cxdxs", "cxdxb", "cxdxs", "cxdxb", "cxdxb", "cxdxb", "cxexw", "cxexb", "cxfxs", "cxfxs", "cxfxs", "cxfxs"],
         ["cxfxs", "cxfxs", "cxfxs", "cxfxs", "xxgxs", "xxgxw", "xxhxs", "xxgxs", "xxfxw", "xxfxw", "cxexw", "bxexw", "bxdxw", "cxdxb", "cxcxw", "cxcxw", "xxcxg", "xxcxb", "xxdxw", "xxexb", "xxfxb", "xxgxs", "xxgxs", "xxhxs"],
         ["xxhxs", "cxhxs", "cxhxs", "cxhxx", "cxhxx", "cxhxx", "cxhxs", "cxgxs", "cxgxs", "cxdxx", "cxcxs", "cxaxs", "cxaxs", "cx0xs", "cx0xb", "cx0xs", "cx0xs", "cx0xs", "cxaxs", "cxbxs", "cxcxx", "cxcxs", "cxdxs", "cxdxs"],
         ["cxdxs", "cxdxs", "cxdxx", "sxdxs", "cxexs", "cxexx", "cxexx", "xxdxs", "xxbxs", "xxaxs", "xx0xs", "xxAxs", "xxAxs", "cxAxb", "cxAxw", "cx0xb", "cxAxb", "cxAxs", "cxAxs", "xxaxs", "xxaxx", "xxcxx", "xxcxx", "xxbxs"],
         ["xxcxs", "cxcxs", "cxdxs", "cxdxs", "cxcxs", "cxcxs", "cxbxs", "xxbxs", "xx0xs", "xxAxb", "cxBxw", "sxAxb", "sxAxs", "cxBxb", "wxAxb", "wxAxs", "wx0xb", "wx0xs", "wxAxs", "xxAxs", "xxaxs", "xxaxx", "xxbxs", "xxbxx"],
         ["xxexx", "xffxx", "xffxx", "xffxx", "xfgxs", "xffxx", "xfexx", "pfcxs", "wfbxs", "wfbxb", "wfaxb", "wfaxw", "wf0xs", "wf0xb", "wfAxb", "xfCxs", "cxExx", "cxHxs", "cxHxs", "xxFxs", "xxGxs", "xxCxg", "cxAxg", "cxAxb"],
         ["cx0xw", "cx0xg", "cxaxw", "cxbxs", "cxbxb", "cxbxs", "cxbxs", "cxaxs", "cxaxs", "cx0xs", "cxAxs", "wxAxs", "wxAxb", "wxAxs", "wxBxs", "wxBxs", "wxBxs", "wxAxs", "wxAxs", "wfAxs", "wfAxs", "wf0xs", "cx0xs", "wf0xs"],
         ["wf0xs", "wf0xb", "wf0xb", "wf0xg", "cxaxb", "wxaxw", "wxaxw", "cxbxw", "pxbxw", "bxcxg", "bxdxw", "bxdxw", "sxexb", "bfexg", "sxfxb", "bxgxg", "bxhxg", "bxhxw", "bxhxw", "sxhxb", "bxhxg", "bxhxw", "cxhxw", "cxgxw"],
         ["cxhxw", "cxgxw", "cxgxb", "cxgxw", "cxgxw", "cxgxw", "bxgxw", "sxgxb", "bxgxw", "bxfxw", "bxfxg", "bxexw", "bxexh", "bxexg", "pxexg", "pxdxg", "pxdxg", "pxdxh", "wxdxh", "pxdxg", "pfdxg", "pfcxg", "pfcxg", "wfcxg"],
         ["wfcxg", "wfcxh", "wfcxh", "wfcxg", "wfbxg", "wfbxg", "wxbxg", "wfbxg", "wfbxw", "wxbxw", "wxaxw", "wxaxw", "wfaxs", "wxaxs", "sxaxx", "sxaxs", "sxaxb", "wxaxs", "wfbxs", "wxbxs", "sfbxs", "sfbxs", "sfbxs", "sxbxs"],
         ["sxbxs", "cxbxs", "cxcxs", "cxcxb", "cxdxs", "cxdxs", "cxdxs", "sxdxb", "sxdxb", "sxcxb", "cxcxb", "sxdxb", "sxdxb", "sxdxb", "sxcxb", "bxcxw", "sxbxb", "sxbxb", "sxbxb", "cxbxw", "sxbxb", "sxbxb", "sxbxb", "sxcxs"],
         ["sxcxs", "cxbxs", "cxbxs", "cxbxs", "cxbxs", "cxbxs", "cxbxs", "cxaxs", "cxaxs", "cx0xb", "sx0xs", "sx0xb", "sxAxb", "cxAxb", "cxAxs", "cxAxs", "cx0xs", "cx0xs", "cxaxb", "cxbxb", "cxbxs", "cxbxs", "cxbxs", "cxbxs"],
         ["cxbxs", "cxbxw", "cxcxs", "cxcxs", "cxcxs", "cxcxs", "cxcxb", "cxcxw", "cxcxg", "cxbxg", "bxbxw", "bxbxw", "bxbxw", "cxaxg", "cx0xw", "cxaxh", "cxaxg", "cxaxg", "cxaxg", "cxbxw", "cxbxb", "cxbxs", "cxbxb", "cxcxg"],
         ["cxdxb", "xxdxs", "xxdxs", "xxexs", "xxexb", "xxexb", "xxdxw", "xxdxw", "xxdxw", "xxbxw", "xxaxw", "xx0xb", "xx0xb", "xxBxs", "xxBxs", "xxCxb", "xxCxw", "xxBxw", "xxAxw", "xx0xb", "xxaxs", "xxaxs", "xxbxs", "xxbxs"],
         ["xxbxx", "xxcxs", "xxcxs", "xxcxx", "xxdxx", "xxexx", "xxexx", "cx0xs", "cxDxs", "cxExs", "xxFxs", "xxGxs", "xxHxb", "xxHxs", "xxJxs", "xxJxb", "xxJxb", "xxJxb", "xxIxb", "xxGxs", "xxFxs", "xxDxs", "xxCxx", "xxBxs"],
         ["xx0xx", "xxaxx", "xxaxx", "xxbxx", "xxbxx", "xxcxx", "xxcxx", "xxBxx", "xxExs", "xxHxx", "xxIxx", "xxJxx", "xxKxs", "xxLxs", "xxLxs", "xxMxs", "xxMxb", "xxMxs", "xxLxs", "xxJxs", "xxIxx", "xxFxx", "xxDxs", "xxBxs"],
         ["xxAxx", "xxAxx", "xx0xx", "xxbxs", "xxbxs", "xxbxs", "xx0xs", "xxDxx", "xxHxs", "xxJxb", "xxKxw", "xxLxb", "xxMxw", "xxMxw", "xxMxw", "xxNxb", "xxNxb", "xxNxb", "xxMxs", "cxKxs", "cxJxx", "cxIxs", "cxGxs", "cxHxx"],
         ["cxFxx", "cxExs", "cxDxx", "cxDxx", "cxDxx", "cxCxx", "cxCxs", "cxExx", "cxHxx", "cxKxs", "cxKxw", "cxLxs", "cxMxs", "cxMxw", "cxMxb", "cxMxs", "cxMxb", "cxJxb", "wxHxs", "wxGxx", "wxGxs", "wxFxx", "wfFxx", "wfFxs"],
         ["wfFxs", "wfFxs", "wfFxb", "wfExs", "wfExs", "wfFxs", "wfFxw", "wfExb", "wfExs", "wfExb", "wfExs", "wfExs", "wfFxs", "wfFxs", "wfGxs", "wfGxs", "wfGxs", "wfExw", "wfDxb", "wxBxw", "wxAxg", "wxAxw", "cxAxg", "cx0xw"],
         ["cx0xb", "wx0xw", "wx0xw", "wx0xw", "wx0xw", "wx0xw", "wx0xw", "cxAxw", "cxBxb", "cxDxg", "xxFxw", "xxGxb", "xxHxw", "xxIxs", "xxJxw", "xxKxb", "xxLxb", "xxLxs", "xxKxs", "xxIxs", "xxGxs", "xxFxx", "xxFxs", "xxCxx"],
         ["xxBxx", "xxAxx", "xxAxx", "xx0xx", "xxaxx", "xxaxx", "xxaxx", "cxAxx", "cxDxx", "cxGxx", "cxIxs", "cxJxb", "cxJxs", "cxKxs", "cxKxs", "cxLxs", "cxKxb", "cxJxs", "cxHxs", "cxGxs", "cxGxb", "cxFxw", "cxFxb", "wxExx"],
         ["wxExs", "wxExs", "wxDxs", "wxDxs", "cxCxs", "cxCxs", "cxCxs", "cxCxb", "cxCxw", "wxBxb", "cxBxw", "cxBxb", "cxBxw", "cxBxw", "cxAxw", "cxAxg", "cxAxg", "cx0xg", "cxbxg", "cxbxg", "cxbxw", "cxbxw", "cxbxg", "cxbxb"],
         ["cxbxw", "cxbxw", "cxbxb", "cxbxb", "cxbxg", "bxbxg", "bxbxw", "cxaxb", "cx0xb", "cxBxw", "xxBxh", "xxCxg", "xxDxg", "xxExg", "xxExg", "xxExh", "xxExh", "xxDxh", "xxDxg", "xxCxh", "xxBxw", "xxBxw", "xxBxb", "xxAxw"],
         ["xxAxw", "xxAxb", "xxAxw", "xxAxb", "xx0xb", "xxAxb", "xxBxw", "xxDxw", "xxExw", "xxGxw", "xxIxw", "xxKxw", "xxLxw", "xxMxg", "xxNxw", "xxOxw", "xxOxw", "xxOxs", "xxOxs", "xxMxs", "xxLxs", "xxJxs", "xxGxs", "xxFxx"]
        ],
        ["Q",
         ["xxjxx", "xxkxs", "xxmxx", "xxlxx", "xxlxs", "xxlxx", "xxkxx", "cxhxx", "cxexx", "cxcxx", "xxBxs", "xxFxs", "xxDxw", "cxFxw", "cxFxg", "cxHxw", "xxI0b", "xxJ0w", "xxHxw", "xxGxw", "xxExs", "xxDxs", "xxCxs", "xxCxs"],
         ["xxBxs", "xxCxs", "xxCxs", "xxBxs", "xxBxs", "xxAxs", "xxAxs", "xxCxs", "xxExs", "xxGxb", "cxHxw", "cxIxw", "wxHxw", "cxHxw", "cxH0s", "cxJxg", "cxJxw", "cxJxb", "cxIxs", "cxHxs", "cxHxs", "cxCxs", "xxBxx", "xxAxx"],
         ["xx0xx", "cx0xx", "txCxg", "wxAxs", "cx0xs", "wxAxs", "wxaxs", "cx0xs", "cxBxs", "cxCxs", "cxDxw", "cxDxw", "wxBxs", "wxBxs", "wfAxs", "wxAxs", "wfaxw", "wxcxb", "wxdxs", "cxdxs", "cxdxs", "cxdxs", "cxfxw", "cxgxb"],
         ["cxgxs", "cxgxs", "cxgxs", "cxgxx", "cxgxs", "wfhxs", "wxhxs", "xfgxs", "wfgxb", "xfgxs", "xffxs", "xfdxs", "xfaxs", "cxExw", "cxGxg", "txaxv", "cxFxh", "cxexv", "cxgxh", "cxgxw", "cxgxg", "cxhxw", "xxhxs", "xxixs"],
         ["xxixs", "xxhxs", "xxhxs", "xxhxs", "xxhxs", "xxixs", "xxgxs", "cxfxs", "cxcxs", "cx0xs", "xxBxw", "xxDxb", "xxExb", "xxGxw", "xxGxb", "xxGxw", "cxFxs", "cxFxs", "cxDxs", "cxDxs", "cxBxs", "cxAxs", "xx0xs", "xxbxx"],
         ["xxcxx", "xxdxx", "xxexx", "xxexs", "cxfxx", "cxfxs", "cxexs", "cxcxs", "cxaxs", "cx0xs", "cx0xs", "cxaxb", "cxaxb", "cx0xs", "cxAxs", "cxAxs", "cx0xb", "cx0xs", "wx0xs", "cxaxs", "cxbxb", "cxbxs", "cxcxs", "cxdxs"],
         ["cxdxs", "cxexs", "cxgxs", "cxhxs", "cxgxs", "cxgxs", "cxhxs", "xxfxb", "xxexb", "xxcxs", "xxbxs", "xxbxs", "xxaxs", "xxaxs", "xxaxb", "xxaxx", "xx0xs", "xx0xs", "xxaxb", "xxbxs", "xxdxs", "xxexx", "xxgxx", "xxhxx"],
         ["xxixx", "xxjxx", "xxkxs", "xxkxx", "xxkxx", "xxlxx", "xxkxx", "xxgxx", "xxgxx", "xxaxs", "xxAxs", "xxBxs", "xxBxb", "xxCxs", "xxCxs", "xxCxs", "xxCxx", "xxCxs", "xxBxs", "xxaxs", "xxcxs", "xxdxs", "xxfxx", "xxfxx"],
         ["xxfxs", "xxgxx", "xxhxx", "xxhxs", "xxhxx", "xxixs", "xxgxx", "xxcxs", "xxaxs", "xx0xs", "cxAxs", "cxCxs", "cxDxs", "cxFxs", "cxGxb", "cxHxw", "cxGxb", "cxCxb", "cxCxs", "cxAxs", "cxaxb", "cxbxs", "xxcxs", "xxcxs"],
         ["xxbxx", "cxcxs", "cxcxs", "cxaxs", "cxaxs", "wxaxw", "wxaxw", "cxaxs", "cxAxb", "cxCxw", "cxAxw", "cxBxg", "cxAxg", "cxAxg", "cxAxg", "cxAxw", "cxAxb", "cxaxg", "cxcxw", "xxcxg", "xxexw", "xxgxw", "xxixw", "xxjxw"],
         ["xxkxb", "xxlxs", "xxlxw", "xxlxb", "cxlxw", "cxlxs", "cxlxs", "xxkxb", "xxkxs", "xxixs", "cxixs", "cxgxs", "cxgxs", "cxfxs", "cxexb", "cxexs", "cxexx", "cxfxs", "cxgxs", "cxgxs", "cxgxs", "cxhxs", "cxhxx", "cxhxx"],
         ["cxixs", "cxkxs", "cxjxx", "cxjxs", "cxjxs", "cxjxs", "cxjxs", "cxixs", "cxhxs", "cxgxs", "cxfxs", "cxdxs", "cxcxx", "cxaxs", "cxbxs", "cx0xs", "xxaxw", "xxbxb", "xxbxs", "cxdxs", "cxexs", "cxexx", "cxfxx", "cxgxs"],
         ["cxhxs", "cxixs", "cxjxx", "cxjxs", "cxjxx", "cxjxx", "cxixs", "cxhxs", "cxexs", "cxdxs", "xxbxb", "xxbxw", "xx0xw", "xx0xw", "xx0xb", "xx0xs", "xxBxs", "xxBxs", "xxBxs", "xxaxb", "xxcxs", "xxexs", "xxexs", "xxexx"],
         ["xxfxx", "xxgxs", "xxhxx", "xxhxx", "xxhxx", "xxjxx", "xxgxx", "xxdxx", "xx0xs", "xxBxs", "cxDxb", "cxExs", "cxExw", "cxFxw", "cxFxw", "cxFxs", "cxExb", "cxExb", "cxDxw", "cxCxb", "cxBxs", "cxBxs", "cxBxx", "cxCxs"],
         ["cxBxs", "cxAxs", "wx0xs", "tfaxs", "wfaxs", "xfaxs", "wf0xx", "wfaxb", "wxbxs", "wxbxs", "wxaxx", "wxaxs", "wx0xs", "cxAxs", "cxCxs", "cxCxb", "xxBxw", "xxBxw", "xxBxw", "cxaxb", "cxcxs", "cxdxs", "xxexs", "xxfxs"],
         ["xxfxs", "xxgxs", "xxhxs", "xxhxs", "xxixx", "xxjxs", "xxhxs", "xxfxb", "xxexb", "xxdxb", "xxcxs", "xxbxs", "xxaxs", "xxAxs", "xxCxs", "xxDxs", "xxFxb", "xxExw", "xxExw", "cxCxw", "cx0xw", "cxbxw", "xxcxb", "xxcxb"],
         ["xxdxb", "xxdxs", "xxexs", "xxfxb", "xxfxs", "xxexs", "xxdxs", "xx0xb", "xxAxw", "xxBxb", "xxCxw", "xxDxs", "xxExb", "xxFxb", "xxFxs", "xxFxb", "xxFxb", "xxFxw", "xxCxw", "cx0xw", "cxbxb", "cxcxb", "cxcxb", "cxdxb"],
         ["cxdxs", "xxdxb", "xxexb", "xxfxs", "xxgxb", "xxixs", "xxhxs", "cxgxw", "cxexw", "cxdxg", "cxcxg", "cxbxw", "cxaxw", "cx0xw", "cxaxw", "cxaxw", "cxaxw", "cxaxw", "cxaxw", "cxbxb", "cxcxs", "cxdxs", "cxdxs", "cxcxs"],
         ["cxcxw", "cxcxb", "cxcxw", "cxcxw", "cxcxb", "wxexb", "wxfxb", "wxfxs", "wxexw", "wffxw", "wffxb", "xffxs", "xffxs", "wffxs", "wffxs", "xfexs", "cxcxs", "cxcxs", "cxcxs", "cxcxs", "cxcxs", "cxcxx", "cxcxx", "wxcxx"],
         ["wxcxs", "cxbxs", "cxaxs", "cxbxg", "cxdxb", "cxdxw", "cxdxs", "cxdxb", "cxcxs", "cxbxs", "cxbxb", "cxbxw", "cxaxb", "cx0xs", "cxAxs", "cxBxw", "xxBxw", "xxAxg", "xx0xw", "xxbxg", "xxdxb", "xxfxs", "xxfxs", "xxgxs"],
         ["xxhxs", "xxjxs", "xxkxs", "xxlxs", "xxjxx", "xxkxs", "xxkxs", "xxfxs", "xxcxs", "xxaxx", "cxBxx", "cxCxs", "cxDxs", "xxExb", "xxFxs", "xxExs", "cxDxs", "cxDxs", "cxCxs", "cxCxx", "cxCxx", "cxAxs", "cx0xs", "cxAxs"],
         ["cxAxs", "cxAxs", "cxaxs", "wxcxs", "wxdxs", "wxfxs", "wxfxs", "cxfxs", "wxexs", "wxcxs", "cxdxb", "xfdxs", "xfdxs", "cxdxs", "cxbxx", "cxaxs", "wxaxs", "wfbxs", "wfaxs", "cxaxs", "cxaxs", "cxbxs", "cxbxs", "cxcxs"],
         ["cxcxs", "cxdxg", "cxexs", "cxfxs", "xxfxx", "xxexx", "xxcxb", "xxaxs", "xxAxs", "xxBxw", "xxDxb", "xxExw", "xxFxw", "xxGxw", "xxGxg", "xxGxg", "cxGxs", "cxFxg", "cxFxw", "xxDxb", "xxBxs", "xx0xs", "xx0xs", "xxaxs"],
         ["xxaxx", "xxcxx", "xxdxx", "xxexx", "xxexx", "xxfxx", "xxdxx", "xx0xs", "xxBxx", "xxExs", "xxHxs", "xxIxs", "xxJ0s", "xxKxs", "xxJxb", "xxJxb", "xxK0b", "xxKxw", "xxJ0w", "cxI0s", "cxGxs", "cxFxs", "cxExs", "cxDxs"],
         ["cxCxs", "xxBxs", "xxAxs", "xxAxs", "cxAxs", "cxBxs", "cxBxs", "xxDxs", "xxFxs", "xxHxs", "xxJxs", "xxJxs", "xxKxb", "xxLxb", "xxMxb", "xxMxb", "xxNxb", "xxMxb", "xxMxb", "xxKxb", "xxJxw", "xxHxs", "xxGxs", "xxFxs"],
         ["xxFxs", "xxExs", "xxBxs", "xxBxx", "cxAxx", "cxAxx", "cxBxx", "cxDxs", "cxExx", "cxGxx", "cxH0x", "cxI0x", "cxI0w", "cxJ0b", "cxK0b", "cxK0b", "cxJ0s", "wxCxw", "wxBxs", "cxCxs", "cxCxs", "cxBxx", "cxCxs", "cxAxs"],
         ["cx0xs", "xxaxs", "xxbxx", "xxaxs", "xxaxs", "xxaxx", "xx0xs", "xf0xs", "xfAxs", "xfCxs", "xxExs", "xxFxs", "xxH0s", "xxJ0b", "xxI0b", "xxK0s", "xxJ0b", "xxHxb", "xxFxb", "xxExb", "xxCxs", "xxBxs", "xxAxs", "xxAxs"],
         ["xx0xs", "xf0xs", "xfaxs", "xfbxs", "xfbxx", "xfbxs", "xfaxx", "xxCxs", "xxHxb", "xxI0b", "xxJ0g", "xxJ0w", "xxL0g", "xxL0b", "xxL0w", "xxM0b", "xxM0b", "xxL0w", "xxK0b", "cxJ0b", "cxH0s", "cxGxx", "xxGxx", "xxExs"],
         ["xxCxx", "xxCxs", "xxBxs", "xxBxs", "xxAxs", "xxAxs", "xxCxs", "xxDxs", "xxFxb", "xxHxs", "xxI0s", "xxI0w", "xxI0b", "xxJ0b", "xxJ0b", "xxJ0w", "xxJ0b", "xxI0w", "xxGxb", "xxFxs", "xxDxs", "xxCxs", "xxBxs", "xxAxs"],
         ["xxAxs", "xx0xx", "xxAxs", "xxAxs", "xxAxs", "xxAxs", "xxBxs", "xxCxb", "xxDxs", "xxFxs", "xxGxs", "xxHxs", "xxI0b", "cxJ0s", "cxK0b", "cxJ0b", "xxJ0b", "xxK0w", "xxJ0b", "cxH0s", "cxGxs", "cxFxs", "cxGxs", "cxHxs"],
         ["cxGxb", "cxGxw", "cxFxb", "cxFxs", "cxDxs", "cxExs", "cxDxs", "wxDxs", "wxExb", "wxExw", "cxGxg", "cxI0g", "cxK0g", "cxL0g", "cxL0g", "cxL0g", "xxL0b", "xxJ0b", "xxJ0s", "wxFxs", "wxFxs", "wxExx", "cxExs", "cxDxs"]
        ],
        ["S",
         ["cxAxs", "xxAxx", "xxAxs", "xxAxx", "xxAxs", "xx0xs", "xxAxs", "cxCxs", "cxDxx", "cxDxw", "cxCxb", "cxExb", "cxExw", "cxExb", "cxG0s", "cxG0s", "cxG0g", "cxExg", "cxDxw", "xxCxw", "xx0xw", "xxaxb", "xxcxb", "xxcxw"],
         ["xxcxw", "xxdxw", "xxexb", "xxdxw", "cxexw", "cxexb", "cxfxb", "cxfxb", "cxfxw", "cxexs", "cxdxs", "cxbxs", "cx0xs", "cxBxs", "cxCxs", "cxDxb", "xxExs", "xxCxs", "xxBxs", "xx0xs", "xxbxs", "xxcxs", "xxdxs", "xxdxx"],
         ["xxdxs", "xxexs", "xxexs", "xxfxs", "xxfxx", "xxdxs", "xxcxs", "cxcxs", "cxcxb", "cxcxs", "cxcxs", "cx0xw", "cxaxs", "cxaxw", "cxAxw", "cx0xb", "wxaxs", "wfaxs", "wfaxb", "cxbxs", "wxbxs", "tfbxs", "cxbxx", "cxcxx"],
         ["cxcxx", "cxcxx", "cxcxs", "cxcxs", "cxdxs", "cxdxs", "wxdxs", "cxexb", "cxdxb", "cxcxb", "cxcxb", "cxbxb", "cxaxs", "cxcxb", "cxbxw", "cxdxb", "cxcxb", "cxbxg", "cxbxb", "cxbxs", "cxdxb", "cxexs", "wxfxs", "wxgxs"],
         ["wxgxs", "cxgxs", "cxhxs", "cxhxs", "cxhxs", "cxixs", "cxhxb", "cxhxb", "cxfxb", "cxgxw", "cxfxb", "cxgxw", "cxfxw", "cxfxw", "cxfxb", "cxhxw", "cxhxw", "cxgxw", "cxhxw", "cxhxb", "cxhxw", "cxhxb", "cxixb", "cxixs"],
         ["cxixs", "cxixs", "cxixs", "cxixs", "cxixs", "cxixs", "cxixb", "cxhxb", "cxhxs", "cxhxs", "cxgxs", "cxgxs", "cxfxs", "cxexs", "cxexs", "cxdxx", "cxcxx", "cxdxb", "cxdxb", "cxexs", "cxfxs", "cxgxs", "xxgxs", "xxgxs"],
         ["xxgxs", "cxgxs", "cxgxs", "cxgxs", "cxgxs", "wxgxx", "wxfxs", "cxexs", "cxdxs", "cxbxs", "cxaxs", "cxAxs", "cxBxs", "xxCxs", "xxExs", "xxCxs", "cxCxs", "cxCxb", "cxCxs", "cxBxs", "cxAxx", "cxaxx", "xxbxs", "xxcxs"],
         ["xxexs", "xxexs", "xxexs", "xxfxs", "xxfxb", "xxgxs", "xxexs", "cxcxs", "cxaxs", "cxAxs", "xxBxs", "xxCxs", "xxCxs", "xxBxb", "xxBxs", "xxCxs", "xxDxx", "xxDxx", "xxCxs", "xxBxs", "xx0xx", "xx0xs", "xxcxs", "xxdxs"],
         ["xxexs", "xxfxx", "xxfxs", "xxgxs", "cxgxx", "cxfxx", "cxdxx", "cxbxx", "cxaxs", "cxAxx", "cxBxs", "cxCxs", "cxCxs", "cxDxs", "cxExs", "cxDxs", "cxDxs", "cxDxs", "cxCxs", "cxCxx", "cxCxx", "cx0xx", "cxaxx", "cxbxx"],
         ["cxbxx", "cxcxs", "cxbxs", "cxbxs", "cxcxs", "cxcxs", "cxbxb", "xxaxb", "xx0xb", "xxAxb", "xxBxw", "xxBxw", "xxBxw", "cxBxw", "cxBxw", "cxCxw", "cxAxw", "cxBxb", "cxAxb", "cx0xs", "cxaxs", "cxcxs", "xxcxs", "xxfxx"],
         ["xxgxx", "xxgxx", "xxhxx", "xxhxs", "xxhxs", "xxixs", "xxfxs", "xxbxs", "xx0xb", "xxAxs", "xxBxs", "xxCxb", "xxCxw", "xxCxs", "xxCxw", "xxCxw", "xxBxw", "xxBxs", "xxBxb", "xx0xs", "xxaxs", "xxcxs", "xxdxs", "xxdxs"],
         ["xxgxx", "xxixx", "xxixx", "xxixx", "xxixs", "xxixx", "xxfxx", "xxcxx", "xx0xs", "xxBxs", "xxDxs", "xxExx", "xxExs", "cxFxs", "cxFxs", "cxG0w", "cxG0w", "cxG0b", "cxG0b", "cxFxs", "cxDxs", "cxCxs", "cxBxs", "cxAxs"],
         ["cxAxx", "cxAxx", "cxAxx", "cxAxs", "cxAxs", "wf0xs", "wfaxx", "wxaxs", "wx0xs", "wxAxs", "cxBxs", "cxExb", "cxH0s", "cxH0w", "cxJ0w", "wxI0w", "xxExg", "xxExg", "xxCxg", "xxAxw", "xx0xh", "xxaxw", "xxbxw", "xxbxs"],
         ["xxbxb", "xxbxb", "xxcxb", "xxcxb", "xxdxs", "xxcxb", "xxcxg", "xxcxw", "xxbxw", "xx0xw", "xxAxg", "xxAxv", "xxBxh", "xxDxg", "xxDxh", "xxDxh", "xxDxg", "xxDxg", "xxCxg", "xxBxw", "xx0xs", "xxaxs", "xxcxs", "xxdxs"],
         ["xxexs", "xxexs", "xxfxs", "xxfxx", "xxfxx", "xxfxx", "xxdxx", "xxbxs", "xxAxs", "xxBxs", "xxCxs", "xxExx", "xxF0s", "xxF0s", "xxG0b", "xxG0s", "cxG0s", "cxG0s", "cxFxs", "xxDxs", "xxBxs", "xxAxs", "xx0xs", "xxaxs"],
         ["xxaxx", "xxbxx", "xxcxx", "xxexx", "xxfxs", "xxfxx", "xxdxx", "cxcxx", "cxAxs", "cxDxs", "cxG0s", "cxHxs", "cxIxs", "xxIxs", "xxKxs", "xxKxb", "xxJxw", "xxIxw", "xxHxb", "cxGxs", "cxFxs", "cxExs", "cxDxx", "cxBxx"],
         ["cxBxx", "xxAxx", "xxaxx", "xxbxx", "xxbxx", "xxbxx", "xx0xx", "xxCxs", "xxFxs", "xxI0s", "cxJ0b", "cxJ0s", "cxK0w", "cxM0b", "cxL0b", "cxL0w", "xxM0w", "xxL0w", "xxK0w", "cxJ0g", "cxH0s", "cxG0s", "xxG0s", "xxH0s"],
         ["xxH0s", "cxG0s", "cxG0s", "cxF0s", "xxFxs", "xxFxs", "xxG0s", "cxI0s", "cxJ0w", "cxL0b", "txL0g", "txG0s", "txJ0s", "cxI0b", "cxI0s", "cxJ0b", "cxI0b", "cxI0s", "cxH0w", "cxFxw", "cxCxg", "cxBxg", "cxBxb", "cx0xw"],
         ["cxaxb", "xxbxs", "xxbxs", "xxbxs", "xxbxs", "xxcxb", "xxbxb", "xxaxb", "xxaxw", "xx0xs", "xx0xs", "xxBxs", "xxCxx", "xxDxs", "xxExx", "xxExs", "cxExb", "cxCxs", "cxCxs", "cxBxs", "cxAxx", "cx0xs", "cx0xx", "cxaxs"],
         ["cxcxs", "xxexs", "xxexx", "xxexs", "xxexs", "xxdxs", "xxcxs", "cxcxs", "cxbxs", "cxaxs", "cxaxs", "cxCxx", "cxExs", "cxExx", "cxGxs", "cxG0s", "xxH0b", "xxH0s", "xxExb", "cxDxs", "cxBxs", "cxBxs", "cxBxs", "cxAxs"],
         ["cx0xs", "xxbxb", "xxbxb", "xxcxs", "xxcxs", "xxcxs", "xxcxb", "xxcxb", "xxbxb", "xx0xb", "cx0xs", "cx0xs", "cxCxs", "xxDxs", "xxDxs", "xxExs", "xxDxs", "xxBxs", "xxAxs", "xx0xs", "xxaxs", "xxbxs", "xxcxx", "xxexs"],
         ["xxgxs", "xxfxs", "xxhxx", "xxhxs", "xxgxs", "xxhxx", "xxexx", "xxbxb", "xxaxw", "xx0xw", "cx0xw", "cxBxb", "cxCxw", "cxCxw", "cxExw", "cxDxw", "cxCxg", "cxAxs", "cxAxb", "cxAxs", "cxAxb", "cxAxb", "wx0xb", "wxcxs"],
         ["wxcxs", "cxbxs", "cxbxs", "pxbxb", "wxcxs", "wxbxs", "wxbxs", "cxbxs", "cxbxs", "wxcxb", "pxbxs", "pxbxb", "pxbxb", "cxbxb", "wxbxs", "wxbxs", "cxaxs", "cx0xs", "cx0xs", "cxaxs", "cxbxs", "cxbxs", "cxbxs", "cxbxs"],
         ["cxbxx", "cxbxx", "cxbxx", "xfbxx", "xfbxx", "wfbxx", "wfbxs", "wfbxs", "wfbxs", "wxbxs", "wxbxs", "wxbxs", "wxaxs", "wxaxx", "wxaxs", "wx0xs", "cxAxs", "cxBxs", "cxBxs", "cxBxb", "cx0xb", "cxbxb", "xxcxs", "xxdxs"],
         ["xxdxs", "xxexs", "xxexs", "xxexb", "xxfxw", "xxfxs", "xxexs", "xxdxb", "xxcxb", "xxaxb", "xx0xb", "xx0xs", "xxAxw", "xxBxb", "xxBxs", "xxCxs", "xxCxw", "xxDxs", "xxCxb", "xxCxs", "xxAxs", "xxbxs", "xxdxs", "xxexs"],
         ["xxfxs", "xxhxs", "xxgxs", "xxgxx", "xxixx", "xxixs", "xxgxx", "cxdxs", "cx0xs", "cxBxb", "cxBxb", "cxCxw", "cxCxb", "cxCxb", "cxCxb", "cxCxs", "cxDxb", "cxCxb", "cxBxb", "cxAxs", "cx0xs", "cx0xs", "cxaxs", "cxaxs"],
         ["cxaxs", "cxaxs", "cxaxs", "cxaxx", "wxaxx", "wfbxs", "wfcxs", "cxbxs", "wfaxs", "wxaxs", "wfaxb", "xfaxs", "xf0xs", "cx0xs", "cxAxs", "cxBxs", "cxBxb", "cxAxs", "cxAxs", "wx0xs", "wx0xs", "wx0xs", "cx0xs", "xf0xs"],
         ["xf0xx", "cx0xs", "xf0xs", "xf0xs", "xf0xx", "xf0xs", "xfAxx", "xfAxx", "xfBxb", "xfBxw", "cxBxb", "cxExw", "cxF0w", "xxH0w", "xxI0b", "xxJ0s", "xxJ0b", "xxK0s", "xxJ0b", "xxH0s", "xxF0s", "xxExs", "xxDxs", "xxCxs"],
         ["xxBxs", "xxBxs", "xxAxs", "xx0xs", "xxaxx", "xxAxs", "xxCxs", "xxExs", "xxG0s", "xxH0s", "xxI0s", "xxJ0b", "xxK0s", "cxL0b", "cxM0s", "cxM0s", "cxN0s", "cxM0b", "cxK0g", "cxI0w", "cxH0s", "cxF0s", "xxFxs", "xxExs"],
         ["xxDxs", "xxDxs", "xxCxs", "xxDxx", "xxCxx", "xxBxs", "xxCxs", "cxExb", "cxG0s", "cxI0s", "xxJ0s", "xxM0b", "xxN0s", "cxO0w", "cxQ0b", "cxQ0b", "cxP0b", "cxP0s", "cxM0b", "cxM0b", "cxK0b", "cxJ0s", "xxI0s", "xxH0s"]
        ],
        ["W",
         ["xxD0s", "xxC0x", "xxAxs", "xxAxs", "xxAxs", "xxAxs", "xxAxs", "xxC0s", "xxE0s", "xxG0s", "xxI0s", "xxJ0b", "xxJ0w", "xxK0w", "xxK0w", "xxK0w", "xxK0w", "xxJ0w", "xxI0w", "xxH0b", "xxG0s", "xxE0s", "xxD0s", "xxD0s"],
         ["xxC0s", "xxB0s", "xxBxs", "xxAxs", "xxBxs", "xxAxs", "xxC0s", "xxD0s", "xxF0s", "xxH0b", "xxI0w", "xxH0b", "xxJ0w", "cxH0s", "cxJ0b", "cxJ0b", "cxI0b", "cxG0w", "cxG0b", "xxE0w", "xxB0b", "xx0xs", "xxaxs", "xxbxs"],
         ["xxcxs", "xxdxx", "xxdxx", "xxdxx", "xxexx", "xxexs", "xxcxx", "xx0xs", "xxB0s", "xxE0s", "xxF0s", "xxG0s", "xxH0b", "xxG0b", "xxH0s", "xxG0s", "xxH0s", "xxH0s", "xxG0s", "xxFxs", "xxDxs", "xxC0s", "xxAxs", "xxaxx"],
         ["xxcxs", "xxdxx", "xxcxx", "xxexx", "xxexx", "xxexs", "xxbxs", "xx0xs", "xxC0b", "xxD0b", "xxF0b", "xxF0b", "xxG0b", "xxG0s", "xxH0s", "xxI0s", "xxJ0s", "xxJ0s", "xxI0b", "xxH0s", "xxF0s", "xxD0s", "xxC0x", "xxBxx"],
         ["xx0xs", "xx0xx", "xxaxx", "xxbxx", "xxbxx", "xxaxs", "xx0xx", "cxC0s", "cxE0s", "cxG0s", "cxI0s", "cxI0b", "cxJ0s", "cxJ0b", "cxI0b", "cxK0w", "cxI0w", "tfaxg", "tfBxx", "txAxs", "tx0xs", "tx0xs", "xx0xs", "xx0xb"],
         ["xxaxw", "xxcxw", "xxdxb", "xxexw", "xxexw", "xxfxw", "xxexw", "xxdxw", "xxdxg", "xxcxw", "xxcxg", "xxbxg", "xxbxw", "xxaxw", "xx0xw", "xx0xw", "xx0xb", "xxaxw", "xxbxg", "xxcxw", "xxdxb", "xxexs", "xxgxs", "xxgxs"],
         ["xxgxs", "xxgxs", "xxixs", "xxjxs", "xxjxs", "xxixs", "xxhxx", "xxdxs", "xxbxx", "xxaxx", "xxAxs", "xxAxs", "xxC0s", "xxC0s", "xxCxw", "xxC0w", "xxC0b", "xxC0s", "xxBxs", "xxAxb", "xxaxs", "xxbxs", "xxcxx", "xxcxs"],
         ["xxfxx", "xxgxx", "xxhxx", "xxhxx", "cxixs", "cxixx", "cxgxx", "xxcxx", "xx0xx", "xxBxs", "xxCxs", "xxCxs", "xxDxs", "xxExs", "xxF0s", "xxF0b", "xxF0b", "xxE0w", "xxExw", "xxCxw", "xxBxs", "xx0xs", "xx0xs", "xxaxs"],
         ["xxbxx", "xxcxx", "xxdxs", "xxexs", "xxgxx", "xxfxx", "xxexs", "xxbxs", "xxAxs", "xxC0s", "xxE0s", "xxG0b", "xxG0b", "xxH0b", "xxI0s", "xxI0b", "xxI0b", "xxIxb", "xxIxs", "xxGxs", "xxE0s", "xxD0s", "xxB0s", "xxBxs"],
         ["xxAxs", "xx0xs", "xx0xs", "xxaxs", "cx0xs", "cx0xs", "cxaxg", "wxaxb", "wxAxw", "wxBxb", "xxC0s", "xxDxb", "xxE0b", "xxExb", "xxExb", "xxE0w", "cxD0w", "cxD0g", "cxBxg", "xxAxw", "xxaxb", "xxbxw", "xxcxs", "xxdxb"],
         ["xxdxs", "xxexs", "xxfxs", "xxfxs", "xxgxs", "xxgxs", "xxexs", "xxcxs", "xxaxs", "xxAxs", "xxBxb", "xxAxb", "xxC0b", "xxC0w", "xxC0b", "xxC0s", "xxD0b", "xxC0b", "xxC0s", "xxB0s", "xx0xs", "xxaxs", "xxcxs", "xxcxs"],
         ["xxdxs", "xxdxs", "xxfxs", "xxfxs", "xxfxs", "xxfxx", "xxexx", "xxbxx", "xxAxs", "xxBxs", "cxDxs", "cxDxs", "cxExs", "cxExs", "cxExs", "cxF0s", "cxFxs", "cxExb", "cxDxs", "cxDxs", "cxBxs", "cxBxs", "cx0xs", "cxAxs"],
         ["cxAxs", "cxAxs", "cxaxx", "cxaxx", "cxbxs", "cxbxs", "cxbxx", "cx0xs", "cxBxs", "cxD0s", "xxE0s", "xxF0b", "xxG0b", "cxG0s", "cxF0b", "cxF0w", "cxE0b", "cxG0w", "cxFxw", "xxE0w", "xxC0s", "xxB0s", "cxB0s", "cxBxs"],
         ["cxBxs", "cx0xx", "cxBxs", "cxAxs", "cxBxs", "cxAxx", "cxAxs", "cxBxx", "cxAxs", "cxBxs", "cxC0x", "cxC0x", "cxD0x", "cxC0s", "wxD0x", "wxD0s", "cxD0s", "cxD0s", "cxD0s", "cxC0s", "cxAxs", "cx0xx", "xxaxx", "xxaxx"],
         ["xxaxx", "xxbxx", "xxcxx", "xxcxx", "xxdxx", "xxdxx", "xxbxs", "xx0xs", "xxAxs", "xxC0x", "cxD0x", "cxE0s", "cxF0x", "cxF0s", "cxH0s", "cxH0x", "xxH0s", "xxH0s", "xxH0s", "cxF0s", "cxC0s", "cxBxs", "xxAxx", "xxAxx"],
         ["xxaxx", "xxaxx", "xxbxx", "xxbxx", "xxbxx", "xxcxx", "xxbxs", "xx0xx", "xxD0s", "xxF0s", "cxG0s", "cxF0s", "tx0xs", "txAxb", "tx0xx", "wxaxs", "cx0xs", "cx0xs", "tx0xs", "wxbxw", "wxbxx", "wxbxx", "cxbxx", "cxaxs"],
         ["cxaxs", "cxaxs", "cxbxs", "cxcxs", "xxcxs", "xxdxs", "xxcxs", "xxcxs", "xxaxb", "xx0xw", "xx0xw", "xxAxw", "xxAxb", "xxAxw", "xxB0b", "xxBxb", "xxBxw", "xxAxw", "xx0xg", "xxaxw", "xxcxw", "xxdxw", "xxdxb", "xxexb"],
         ["xxfxs", "xxfxs", "xxgxs", "xxgxs", "xxhxs", "xxhxs", "xxgxs", "xxfxb", "xxexs", "xxdxx", "xxcxs", "xxbxs", "xxbxs", "xxaxs", "xx0xs", "xx0xs", "xxAxs", "xxAxs", "xxAxs", "xxaxs", "xxcxs", "xxcxs", "xxexs", "xxfxx"],
         ["xxixs", "xxixs", "xxhxx", "xxixx", "xxjxs", "xxixs", "xxhxs", "xxexs", "xxcxs", "xxbxs", "xxaxs", "xxAxs", "xxAxx", "xxBxx", "xxB0s", "xxC0s", "xxCxs", "xxCxs", "xxBxs", "xxBxs", "xx0xs", "xxaxs", "xxcxs", "xxdxs"],
         ["xxexs", "xxgxs", "xxhxs", "xxhxs", "xxhxx", "xxgxx", "xxexs", "xxcxs", "xx0xs", "xxBxb", "xxB0b", "xxC0b", "xxD0w", "cxD0g", "cxE0w", "cxE0b", "cxE0g", "cxD0w", "cxD0w", "cxC0w", "cxAxb", "cxAxs", "cxC0b", "cxBxs"],
         ["cxBxb", "cxAxb", "cx0xb", "cx0xs", "cx0xb", "cxaxb", "cxaxb", "cxaxb", "cx0xw", "cxAxw", "cxAxg", "cxBxw", "cx0xg", "cx0xg", "cxAxg", "cxC0w", "cxBxg", "cxBxw", "cxBxg", "cxAxb", "cx0xb", "cxaxb", "wxbxb", "wxbxb"],
         ["wxdxw", "wxexs", "wxexs", "wxexs", "wxfxs", "wxfxs", "wxexs", "wffxb", "wffxw", "wffxw", "cxexb", "wfdxb", "wfdxb", "wfdxb", "wfaxs", "wfaxb", "cxbxs", "cxaxb", "cxaxs", "cxaxs", "cxbxx", "cxcxs", "xxcxs", "xxdxs"],
         ["xxdxx", "wxbxs", "wxcxs", "wxcxs", "cxcxx", "xfcxs", "xfcxs", "xxbxs", "xxaxs", "xxAxb", "cxAxb", "cxAxb", "cxAxb", "cxC0b", "cxC0w", "cxBxb", "cxAxs", "cxB0b", "cxBxb", "cx0xb", "cxaxb", "cxaxs", "cxaxs", "cxaxs"],
         ["cxbxs", "cxbxs", "cxbxs", "cxbxs", "xxbxs", "xxbxs", "xxbxs", "cx0xs", "cxBxb", "cxBxb", "cxB0w", "cxD0w", "cxD0w", "cxD0w", "cxE0b", "cxF0w", "cxF0w", "cxE0b", "wxAxs", "txaxs", "wxaxx", "wx0xs", "cx0xs", "cxaxs"],
         ["cxaxs", "cxaxs", "cxaxx", "cxaxx", "cxaxs", "xfbxs", "xfbxb", "cxbxs", "cxaxs", "cxaxs", "cx0xs", "cx0xs", "cxBxs", "xxC0s", "xxD0b", "xxD0w", "xxD0w", "xxD0w", "xxC0b", "xxBxb", "xx0xb", "xxbxs", "xxcxs", "xxcxx"],
         ["xxdxs", "xxexx", "xxfxx", "xxfxx", "xxfxx", "xxgxx", "xxfxx", "xxbxs", "xx0xs", "xxB0s", "cxC0s", "cxD0w", "cxC0b", "cxC0w", "cxD0w", "txB0w", "cxbxs", "cx0xs", "cxAxw", "cxbxs", "cxbxs", "cxcxs", "cxbxs", "cxbxx"],
         ["cxdxs", "xxdxx", "xxexx", "xxexx", "xxexs", "xxexx", "xxexx", "xxdxs", "xxbxs", "xx0xs", "xx0xb", "xxAxb", "xxAxs", "xxB0b", "xxBxb", "xxC0b", "xxC0w", "xxCxb", "xx0xb", "xx0xs", "xxaxs", "xxbxs", "wxexs", "wxexs"],
         ["wxfxx", "xxfxx", "xxgxx", "xxgxx", "xxgxx", "xxgxs", "xxgxs", "xxfxs", "xxexs", "xxcxs", "cxcxs", "wxcxs", "wxcxs", "xxbxs", "xxaxw", "xxbxb", "cxbxb", "cxcxb", "cxcxw", "cxdxs", "cxfxs", "cxgxs", "xxgxx", "xxgxx"],
         ["xxhxx", "xxixx", "xxixx", "xxixx", "xxixx", "xxjxx", "xxjxx", "xxfxx", "xxdxx", "xxaxs", "xx0xs", "xxAxs", "xxBxb", "cxaxb", "cxBxb", "cxAxb", "txcxb", "txfxw", "txdxs", "xxdxx", "xxexx", "xxfxx", "xxgxx", "xxhxx"],
         ["xxgxx", "xxhxx", "xxhxx", "xxixx", "xxixx", "xxixx", "xxhxx", "cxexx", "cxcxx", "cxaxs", "cx0xx", "cxBxx", "cxBxs", "txaxs", "txbxs", "wxaxx", "cxAxs", "cxAxs", "cx0xs", "cxaxs", "cxcxx", "cxdxs", "cxexs", "cxdxx"],
         ["cxexx", "cxexx", "cxexx", "cxfxx", "cxfxx", "cxgxx", "cxfxx", "xxcxs", "xxbxs", "xxaxs", "cxAxs", "cxAxs", "cxBxb", "cxAxs", "cxAxs", "cxAxs", "cxAxb", "cxAxb", "cx0xb", "cx0xs", "cxaxs", "cxaxs", "cxaxs", "cxaxs"]
        ],
        ["V",
         ["cx0xs", "cx0xs", "cxaxs", "cxaxs", "cxaxs", "cxaxs", "cxaxs", "cx0xs", "cxAxb", "cxAxw", "cxBxb", "cxCxw", "cxCxg", "cxCxw", "cxCxw", "cxCxw", "cxD0w", "cxCxb", "wxAxb", "cxBxs", "cxAxs", "cxAxs", "cx0xs", "cx0xs"],
         ["cxaxs", "cxaxs", "cxbxs", "cxcxs", "xxcxs", "xxcxs", "xxcxs", "cxbxs", "cxaxs", "cxAxx", "cxC0s", "cxD0s", "cxE0s", "cxE0s", "cxE0b", "cxE0b", "cxE0w", "cxD0w", "cxC0b", "cxCxs", "cxBxs", "cxAxs", "cxAxs", "cx0xs"],
         ["cx0xx", "cxbxx", "cxcxx", "cxcxx", "cxdxx", "cxdxs", "cxdxx", "cxbxx", "cx0xx", "cxBxx", "cxCxs", "cxC0s", "cxE0s", "cxE0s", "cxF0b", "cxF0b", "cxE0s", "cxD0b", "cxD0b", "xxBxs", "txAxs", "txAxs", "xxaxs", "xxaxs"],
         ["xxbxx", "xxbxx", "xxcxx", "xxcxx", "xfdxx", "xfdxs", "xfcxx", "xfbxx", "xf0xs", "xfCxs", "xxE0s", "xxE0x", "xxF0x", "cxG0s", "cxF0s", "cxG0s", "xxH0s", "xxH0s", "xxG0s", "xxF0s", "xxC0x", "xxCxx", "xxAxx", "xx0xx"],
         ["xx0xx", "xxaxx", "xxaxx", "xxbxx", "xxbxx", "xxcxx", "xxbxx", "xx0xs", "xxBxs", "xxE0s", "xxF0s", "xxH0s", "xxI0s", "cxI0b", "cxI0b", "cxI0s", "cxJ0b", "cxJ0b", "cxJ0w", "xxH0s", "xxG0b", "xxF0s", "xxE0s", "xxD0s"],
         ["xxD0s", "xxC0s", "xxBxs", "xxBxs", "xxBxs", "xxAxs", "xxBxs", "xxC0s", "xxE0s", "xxF0s", "xxH0b", "xxI0b", "xxJ0b", "cxJ0s", "wxCxw", "tx0xb", "wxAxs", "wxCxx", "wxC0s", "cxCxs", "cxAxs", "cxAxs", "cxAxx", "cxAxs"],
         ["cxaxs", "cx0xs", "cx0xs", "cxaxx", "cxaxs", "cxaxx", "cxaxx", "xx0xs", "xx0xs", "xxAxs", "cxBxx", "cxC0s", "cxD0s", "cxE0x", "cxE0s", "cxE0s", "cxD0s", "cxD0b", "cxC0s", "cxCxs", "cxCxs", "wxAxs", "cx0xs", "cx0xs"],
         ["cxaxs", "cxaxs", "cxaxx", "cxaxx", "cxaxs", "cxaxs", "wxaxs", "wfaxs", "wfaxx", "wf0xx", "wx0xs", "wxAxx", "wxBxs", "wxBxs", "wxAxx", "wxCxx", "cxCxx", "pxBxx", "pxCxs", "cxAxb", "cxaxs", "cx0xs", "xxbxs", "xxbxs"],
         ["xxcxx", "xxdxs", "xxdxs", "xxexx", "xxexx", "xxfxx", "xxdxx", "xxcxx", "xx0xs", "xxAxs", "xxCxs", "xxD0s", "xxE0b", "cxE0s", "cxE0b", "cxF0b", "cxE0b", "cxF0s", "txaxs", "cxAxs", "cxaxs", "cxaxs", "cxbxs", "cxaxs"],
         ["cxbxs", "xxcxs", "xxdxs", "xxexs", "xxfxx", "xxgxs", "xxfxs", "xxdxs", "xxbxs", "xx0xs", "xxAxs", "xxAxb", "xxBxs", "xxBxs", "xxCxs", "xxCxs", "xxBxs", "xxBxx", "xxBxs", "xxAxs", "xxaxs", "xxaxs", "xxcxx", "xxdxx"],
         ["xxexx", "xxexx", "xxgxx", "xxgxx", "xxhxs", "xxgxs", "xxfxx", "xxcxx", "xx0xx", "xxBxx", "xxCxx", "xxC0s", "xxC0x", "xxD0x", "xxE0s", "xxE0b", "cxD0b", "cxDxs", "cxBxs", "cxAxs", "cx0xs", "cxaxs", "cxaxx", "cxbxx"],
         ["cxbxs", "cxcxs", "cxcxx", "cxcxx", "cxdxs", "cxdxs", "cxcxx", "xxbxs", "xx0xs", "xxBxs", "xxC0s", "xxD0s", "xxC0s", "xxE0s", "xxD0s", "xxE0b", "xxE0b", "xxD0s", "xxD0s", "xxBxs", "xxBxx", "xx0xx", "xxaxs", "xxbxs"],
         ["xxdxs", "xxbxx", "xxcxx", "xxdxs", "xxdxs", "xxdxs", "xxcxs", "cxaxs", "cxAxs", "cxD0s", "cxC0s", "cxC0s", "cxD0s", "cxD0s", "cxD0s", "cxD0s", "cxE0x", "cxD0s", "cxD0s", "cxC0s", "cxBxs", "cxBxs", "wxAxs", "wx0xs"],
         ["wxaxs", "cxaxs", "cxaxs", "cxaxs", "cxbxs", "cxaxs", "cxbxb", "cx0xs", "cx0xs", "cxAxs", "cxBxb", "cxE0s", "cxE0s", "xxG0s", "xxG0s", "xxG0s", "xxG0s", "xxG0s", "xxF0b", "cxE0s", "cxCxs", "cxBxs", "xxBxs", "xxAxx"],
         ["xx0xs", "xx0xx", "xxaxx", "xxaxx", "xxaxs", "xxbxx", "xxaxx", "xxBxs", "xxC0s", "xxE0b", "xxF0s", "xxG0s", "xxH0s", "cxH0s", "cxH0s", "cxH0b", "cxH0b", "cxH0w", "cxG0b", "xxF0b", "xxE0s", "xxD0s", "xxCxs", "xxBxx"],
         ["xxAxx", "xxAxx", "xxbxs", "xxbxx", "xxcxs", "xxcxx", "xxbxx", "xxaxs", "xxAxx", "xxD0s", "xxE0s", "xxF0s", "xxG0s", "cxH0w", "cxG0w", "cxG0b", "cxF0w", "cxC0s", "cxC0s", "cxCxs", "cxBxs", "cxBxs", "cxBxs", "cxBxs"],
         ["wxAxs", "wxAxs", "wf0xs", "wx0xs", "wx0xs", "xx0xs", "xx0xs", "pfAxs", "pfAxs", "pfBxs", "cxD0b", "wxCxs", "wxF0s", "cxE0b", "wxBxs", "txAxs", "wxAxx", "wxAxs", "wx0xs", "wx0xs", "wxaxs", "wxaxs", "wxaxs", "wxaxs"],
         ["wxaxx", "cxbxs", "cxbxs", "cxbxs", "cxcxs", "cxcxs", "cxdxs", "xxcxs", "xxbxb", "xxaxs", "cx0xs", "cx0xs", "cxAxs", "cxAxs", "cxAxs", "cxAxs", "xxAxs", "xxAxs", "xxAxs", "xxaxs", "xxaxs", "xxaxx", "cxbxs", "cxcxs"],
         ["cxdxx", "xxfxs", "xxfxx", "xxfxx", "xxfxx", "xxfxx", "xxfxs", "cxdxs", "cxbxs", "cx0xs", "cx0xs", "cxBxs", "cxBxb", "cxAxb", "cxBxs", "cxBxs", "cxBxs", "cxAxb", "cx0xs", "xxaxs", "xxbxx", "xxcxs", "xxcxs", "xxdxx"],
         ["xxdxx", "xxfxs", "xxexs", "xxfxx", "xxexx", "xxexx", "xxexx", "xxcxs", "xxaxs", "xx0xw", "cxAxs", "cxBxs", "cxCxw", "cxBxb", "cxCxb", "cxBxb", "cxAxb", "cxAxs", "cxAxs", "cx0xs", "cx0xs", "cxaxb", "xxaxs", "xxaxs"],
         ["xxbxs", "cxaxs", "cxaxs", "cxaxs", "cxbxs", "cxbxs", "cxbxs", "wxaxs", "wfbxs", "wfbxb", "pfbxs", "pfaxs", "pf0xb", "cx0xw", "wxAxb", "wxAxb", "cxBxb", "cxAxs", "cxAxs", "cx0xs", "cx0xs", "cx0xs", "cx0xs", "cxbxb"],
         ["cxcxw", "cxcxb", "cxcxs", "cxdxs", "wxdxs", "wxdxs", "wxdxs", "wxcxs", "wxcxs", "wxcxw", "cxdxw", "cxdxw", "cxbxw", "cxdxw", "cxexw", "cxbxw", "xxcxw", "xxcxg", "xxdxb", "xxexs", "xxfxs", "xxfxs", "xxgxs", "xxgxs"],
         ["xxhxx", "xxgxs", "xxhxs", "xxgxs", "xxgxs", "xxhxx", "xxfxs", "xxexs", "xxbxs", "xxaxs", "xx0xb", "xxAxb", "xxCxs", "xxCxb", "xxDxb", "xxDxs", "cxCxb", "cxDxb", "cxCxb", "xxAxs", "xx0xs", "xxaxs", "xxbxs", "xxbxs"],
         ["xxcxs", "xxdxx", "xxexx", "xxexx", "xxhxx", "xxgxx", "xxgxx", "xxdxx", "xxaxx", "xxAxx", "xxCxs", "xxC0s", "xxCxb", "xxD0s", "xxC0s", "xxD0w", "cxD0b", "cxCxw", "cxAxb", "cx0xs", "cxaxs", "cxaxs", "cxaxs", "cxaxs"],
         ["cxaxs", "cxbxs", "cxbxs", "cxbxs", "cxbxs", "cxbxs", "cxbxs", "cxaxs", "cxAxw", "cxAxb", "cxBxb", "cxBxb", "cxAxb", "cxAxw", "wxaxb", "wxbxs", "cxbxs", "cx0xs", "cx0xs", "cx0xs", "cxaxb", "cx0xs", "cx0xs", "wxaxs"],
         ["wxbxs", "cxbxs", "cxbxs", "cxbxs", "xxbxs", "xxbxs", "xfbxs", "cxaxs", "cx0xs", "cxBxb", "cxBxs", "cxD0b", "cxD0s", "xxE0s", "xxF0b", "xxF0s", "xxF0s", "xxE0s", "xxE0s", "xxBxs", "xx0xs", "xxaxx", "xxaxx", "xxbxs"],
         ["xxbxx", "xxcxx", "xxcxx", "xxcxx", "cxcxx", "cxbxx", "cxcxx", "wxbxs", "wfbxs", "wxaxs", "cxBxs", "cxBxb", "cxBxs", "cxBxs", "cxBxs", "cxE0s", "cxD0s", "cxE0s", "cxE0s", "xxD0s", "xxD0s", "xxD0s", "cxD0s", "cxC0s"],
         ["cxCxs", "cxBxs", "cxBxs", "cxBxs", "cxBxs", "cxBxs", "cxBxs", "cxCxs", "cxD0b", "cxE0b", "cxE0b", "cxF0b", "cxF0b", "cxH0b", "cxH0b", "cxH0b", "cxG0b", "cxG0b", "cxG0s", "xxE0s", "xxE0s", "xxCxs", "xxCxx", "xxBxs"],
         ["xxBxs", "xxBxs", "xxCxs", "xxCxs", "cxAxs", "cx0xs", "cx0xs", "xxBxs", "xxC0w", "xxD0w", "cxE0b", "cxD0b", "cxD0s", "cxF0b", "cxE0s", "cxD0b", "xxE0b", "xxE0s", "xxBxg", "cx0xs", "cxaxs", "wxaxb", "cxcxs", "cxdxb"],
         ["cxexs", "xxexs", "xxexb", "xxfxs", "xxgxs", "xxgxs", "xxhxb", "xxgxb", "xxgxw", "wxgxb", "wxgxb", "wxexs", "wxexs", "cxdxs", "cxdxs", "cxdxs", "cxdxs", "cxdxs", "cxdxs", "cxexs", "cxdxx", "cxexx", "xxhxs", "xxixx"],
         ["xxixx", "xxhxs", "xxgxx", "xxgxs", "cxfxs", "cxfxs", "cxfxs", "cxfxs", "cxexs", "cxcxs", "cxbxs", "cxbxs", "cxaxs", "xxaxs", "xxAxs", "xx0xs", "xx0xs", "xxaxs", "xxaxs", "xxcxs", "xxdxs", "xxexs", "xxexx", "xxhxs"]
        ],
        ["R",
         ["xxcxx", "xxcxx", "xxdxx", "xxdxx", "cxdxx", "cxdxx", "xfdxx", "xfaxx", "xfAxs", "xfCxx", "cxExs", "cxG0s", "cxH0b", "cxI0b", "cxI0b", "cxJ0w", "cxI0s", "cxI0b", "cxFxs", "cxExs", "cxExs", "cxDxs", "xxDxx", "xxExs"],
         ["xxExs", "cxDxs", "cxDxs", "cxDxs", "cxDxs", "cxDxs", "cxDxs", "cxExs", "cxFxs", "cxH0s", "cxH0s", "cxJ0b", "cxI0b", "cxI0b", "cxJ0b", "cxJ0b", "cxI0s", "cxH0s", "cxI0s", "cxH0s", "cxG0s", "cxG0s", "xxG0s", "xxGxx"],
         ["xxFxs", "xxFxs", "xxExs", "xxDxs", "cxDxs", "cxExs", "cxExs", "cxFxs", "cxG0b", "cxI0s", "xxJ0b", "xxL0s", "xxL0b", "cxM0s", "cxM0b", "cxK0b", "cxK0b", "cxJ0b", "cxH0s", "cxGxs", "cxFxs", "cxExx", "xxCxs", "xxCxs"],
         ["xxCxx", "xxAxx", "xxAxs", "xxAxx", "xx0xx", "xf0xs", "xf0xx", "xxBxx", "xxDxx", "xxFxs", "cxGxs", "cxH0s", "cxH0s", "cxI0s", "cxJ0s", "cxJ0s", "xxK0b", "xxJ0b", "xxH0b", "xxFxs", "xxExs", "xxExs", "xxDxs", "xxDxx"],
         ["xxCxx", "xxCxx", "xxCxx", "xxBxx", "xxBxx", "xxAxx", "xxAxx", "xxDxx", "xxG0s", "xxJ0s", "xxL0s", "xxN0s", "xxN0w", "wxI0s", "wxM0s", "wxO0w", "xxN0w", "xxN0b", "xxM0b", "xxK0s", "xxK0w", "xxJ0s", "xxI0s", "wxG0w"],
         ["wxFxs", "wxExs", "wxCxs", "wxCxb", "cxCxw", "cxBxb", "cxBxb", "wxBxs", "wxCxb", "wxCxs", "cxDxb", "cxExb", "cxExs", "cxFxs", "cxFxs", "cxFxb", "cxFxb", "cxExb", "cxDxb", "cxBxs", "cx0xs", "cxaxs", "cxaxb", "cxbxs"],
         ["cxbxs", "xxcxs", "xxcxs", "xxdxs", "cxdxs", "cxcxs", "cxdxs", "cxbxs", "cx0xs", "cxBxs", "cxBxs", "cxDxs", "cxCxs", "cxExb", "cxExx", "cxExs", "cxCxb", "cxBxs", "cxBxs", "cxAxb", "cxaxs", "cxbxs", "cxbxs", "cxcxs"],
         ["cxbxs", "cxcxs", "cxcxb", "cxdxs", "cxexb", "cxfxs", "cxgxs", "cxgxs", "cxfxs", "cxexw", "cxdxs", "cxdxb", "cxcxs", "cxcxs", "cxbxs", "cxbxs", "cxbxb", "cxbxs", "cxcxs", "cxexs", "cxfxs", "cxgxs", "cxgxs", "cxgxs"],
         ["cxgxs", "xxhxs", "xxhxs", "xxixs", "cxixs", "cxixs", "cxixs", "cxhxb", "cxgxs", "cxfxb", "cxexb", "cxdxg", "cxcxw", "cxcxw", "cxcxg", "cxcxg", "cxdxw", "cxdxb", "cxexb", "cxexb", "cxfxb", "cxfxb", "cxfxs", "cxfxs"],
         ["cxexb", "cxexw", "cxexs", "wxexb", "wxexs", "wxdxb", "wxexw", "wxexg", "wfexw", "wfexg", "wfexg", "wffxg", "wfexg", "wfexw", "wfexw", "wfexg", "wfexw", "wfexw", "wfdxb", "wfdxb", "wfcxs", "wfcxs", "wfcxs", "wfbxs"],
         ["wfbxx", "wfbxx", "wfbxs", "wfcxs", "cxcxs", "cxcxs", "cxcxs", "cxcxb", "cxcxb", "cxcxb", "cxaxb", "cxaxs", "cx0xs", "cx0xs", "cx0xs", "cxAxs", "cxAxs", "cxAxs", "cx0xs", "xxbxs", "xxcxx", "xxdxx", "xxexx", "xxexx"],
         ["xxexx", "xxfxx", "xxgxx", "xxgxx", "xxgxs", "xxgxs", "xxgxx", "xxexx", "xxaxx", "xxAxs", "xxBxs", "xxDxs", "xxDxx", "cxExs", "cxExs", "cxExb", "xxExb", "xxDxb", "xxBxs", "xxAxs", "xx0xx", "xxaxx", "xxcxs", "xxcxs"],
         ["xxbxx", "xfaxs", "xfaxs", "xfcxs", "xxdxx", "xxcxs", "xxcxs", "xxbxs", "xxAxs", "xxCxb", "xxExb", "xxFxb", "xxFxb", "xxGxb", "xxGxb", "xxG0b", "xxGxb", "xxFxb", "xxExs", "xxDxs", "xxCxs", "xxBxs", "xxBxs", "xxAxs"],
         ["xxAxx", "xxaxs", "xxaxs", "xxaxx", "xxaxs", "xx0xx", "xx0xx", "cxAxs", "cxCxs", "cxExs", "xxH0s", "xxH0s", "xxI0s", "cxI0s", "cxK0s", "cxJ0s", "cxI0b", "cxH0w", "cxFxs", "xxExs", "xxDxs", "xxDxs", "xxBxs", "xxBxs"],
         ["xxBxx", "cxBxs", "cxAxs", "cxAxs", "cxBxx", "cxBxx", "cxAxx", "xxCxx", "xxExx", "xxGxx", "xxI0s", "xxJ0s", "xxI0s", "cxJ0x", "cxI0s", "cxJ0s", "xxJ0s", "xxI0s", "xxGxs", "xxFxs", "xxExx", "xxCxs", "xxDxx", "xxCxs"],
         ["xxCxs", "xxBxs", "xxCxx", "xxAxs", "xxBxx", "xxAxx", "xx0xs", "xxBxx", "xxExs", "xxGxx", "xxH0s", "xxJ0s", "xxK0s", "xxK0s", "xxK0s", "xxK0s", "xxK0s", "xxI0b", "xxGxs", "xxExs", "xxDxs", "xxDxs", "xxCxx", "xxAxx"],
         ["xxAxx", "xxAxx", "xx0xx", "xx0xx", "xxaxx", "xf0xx", "xf0xx", "xfAxx", "xfBxx", "xfCxx", "cxGxx", "cxH0x", "cxJ0s", "cxJ0s", "cxI0b", "cxH0b", "xxH0s", "xxH0b", "xxFxs", "xxExs", "xxDxs", "xxCxx", "xxCxs", "xxCxx"],
         ["xxBxx", "xx0xx", "xx0xx", "xxAxx", "xxBxx", "xxBxx", "xxAxx", "xxBxs", "xxCxb", "xxCxs", "cxExs", "cxFxw", "cxGxb", "xxG0b", "xxH0b", "xxG0s", "xxFxw", "xxCxw", "xxAxb", "xxaxb", "xxcxw", "xxcxs", "xxcxs", "xxcxs"],
         ["xxcxb", "cxcxs", "cxcxb", "cxcxb", "xxdxs", "xxexs", "xxexs", "xxdxs", "xxdxs", "xxbxs", "xxbxs", "xxaxx", "xxAxx", "xxBxs", "xxBxs", "xxCxb", "xxBxs", "xxBxs", "xx0xs", "cxbxs", "cxbxx", "cxdxx", "xxdxx", "xxexs"],
         ["xxdxs", "xxdxs", "xxexs", "xxexx", "xxexs", "xxexx", "xxfxx", "cxexs", "cxcxs", "cxbxb", "cxaxb", "cx0xb", "cx0xb", "cx0xw", "wx0xb", "wxaxs", "cxaxb", "cxaxb", "cxaxs", "cxaxb", "cxbxs", "cxbxb", "cxbxs", "cx0xs"],
         ["cx0xw", "cx0xb", "cx0xb", "cx0xs", "cx0xx", "cxAxs", "cxAxs", "xxBxs", "xxFxs", "xxI0b", "xxK0w", "xxM0b", "xxM0h", "xxM0g", "xxM0g", "xxL0h", "txK0g", "txFxw", "txFxg", "xxExg", "xxBxg", "xxAxw", "xxaxw", "xxcxw"],
         ["xxexg", "xxexw", "xxfxw", "xxgxw", "xxhxs", "xxhxb", "xxixs", "cxixs", "cxhxw", "cxgxb", "cxfxw", "cxexb", "cxexb", "cxcxx", "cxbxx", "cxaxs", "cxaxs", "cxcxb", "cxexb", "xxgxs", "xxfxx", "xxhxx", "xxixs", "xxixx"],
         ["xxjxx", "xxjxx", "xxkxs", "xxkxx", "xxlxs", "xxkxx", "xxlxs", "xxjxx", "xxgxx", "xxdxx", "xxbxx", "xxaxx", "xx0xx", "xxAxs", "xxBxs", "xxAxb", "xx0xs", "xxaxs", "xxcxs", "xxdxs", "xxexs", "xxfxs", "xxgxs", "xxgxs"],
         ["xxgxs", "xxhxb", "xxixs", "xxixs", "cxixb", "cxixb", "cxixb", "cxixb", "cxixb", "cxhxb", "cxfxb", "cxdxw", "cxbxw", "cxaxg", "cx0xw", "cxaxb", "cx0xw", "cxaxw", "cxaxw", "cxaxb", "cx0xb", "cx0xb", "cx0xw", "wxaxb"],
         ["wxcxs", "wxcxb", "wfcxw", "wfbxb", "wfcxb", "wxcxb", "wfcxs", "wxbxb", "wfbxs", "wfbxs", "wfaxb", "wf0xs", "xf0xs", "cxAxb", "cxBxb", "wxBxs", "wfBxb", "wfBxb", "wfBxb", "cxBxb", "cxCxb", "cxCxs", "wxCxw", "wxBxb"],
         ["wxCxw", "cxBxw", "cxCxb", "cxCxs", "wxCxs", "wxCxs", "wxCxs", "cxCxs", "cxCxs", "cxCxb", "cxAxg", "cxAxb", "cx0xw", "cxBxw", "cx0xw", "cx0xg", "cxaxb", "cx0xs", "cxbxb", "xxdxb", "xxexb", "xxfxs", "xxgxx", "xxgxx"],
         ["xxgxx", "cxgxx", "cxgxx", "cxgxx", "xxhxs", "xxhxs", "xxjxx", "cxjxx", "cxgxx", "cxdxs", "cxcxx", "cxbxs", "cxaxs", "cxaxs", "cxaxb", "cxbxb", "cxbxs", "cxcxs", "cxdxb", "cxdxs", "cxexs", "cxexs", "cxexs", "cxfxx"],
         ["cxfxx", "cxgxx", "cxgxx", "cxhxx", "cxhxs", "cxhxx", "cxhxx", "cxixx", "cxdxs", "cxaxs", "xx0xs", "xxBxw", "xxCxb", "xxDxw", "xxDxb", "xxCxw", "cx0xs", "cxcxb", "wxdxw", "cxexs", "wxfxs", "wxgxs", "wxgxs", "wxgxs"],
         ["wxgxx", "wxhxs", "wxhxs", "wxhxs", "xxixs", "xxjxs", "xxjxs", "xxixs", "xxhxs", "xxfxs", "xxdxs", "xxdxb", "xxcxs", "cxcxs", "cxcxs", "cxbxb", "xxbxb", "xxdxb", "xxexs", "xxfxs", "xxgxs", "xxhxs", "xxixs", "xxixs"],
         ["xxjxs", "cxixx", "cxixs", "cxixs", "cxixx", "wxixx", "wxixx", "cxhxx", "cxhxx", "cxfxs", "cxfxs", "cxfxs", "cxfxs", "cxfxs", "cxfxs", "cxfxx", "cxfxs", "cxgxs", "cxgxs", "cxhxs", "cxhxs", "wxhxs", "wfixs", "wfixs"]
        ],
        ["H",
         ["wfAxs", "wfAxs", "wfAxs", "wx0xs", "wf0xs", "wf0xs", "wx0xs", "wx0xs", "wx0xs", "wx0xs", "cxAxb", "cxAxb", "cxAxb", "cxBxs", "wxAxs", "wxAxs", "cxBxs", "cxAxs", "cxAxs", "cxAxs", "wxAxs", "wxAxs", "cxAxs", "cxBxs"],
         ["cxBxs", "cxBxs", "cxAxb", "wxAxs", "wxAxs", "wfAxs", "wfAxs", "wfAxs", "wfAxs", "wxAxs", "cxBxs", "wfBxs", "wfCxs", "xfCxs", "xfDxs", "xfDxx", "wfDxs", "wfDxs", "wfCxs", "cxCxs", "cxCxs", "cxCxs", "cxCxs", "cxCxs"],
         ["cxCxs", "cxCxs", "cxCxs", "cxCxs", "cxCxs", "cxCxx", "cxCxs", "cxCxx", "cxCxx", "cxDxx", "cxExs", "cxExs", "cxFxs", "cxFxs", "cxGxs", "cxGxb", "cxGxb", "cxGxb", "cxGxs", "cxGxs", "cxGxs", "cxGxs", "cxGxs", "cxGxx"],
         ["cxGxs", "cxHxs", "cxJxs", "cxKxb", "cxMxs", "cxMxb", "cxMxs", "wxMxs", "wxJxg", "wxIxw", "xxJxg", "xxKxw", "xxIxh", "xxHxh", "xxGxg", "xxGxw", "xxFxg", "xxDxg", "xxCxb", "xxBxb", "xxAxb", "xx0xs", "xx0xb", "xxaxs"],
         ["xxbxs", "xxcxs", "xxdxs", "xxdxs", "xxdxs", "xxdxs", "xxexs", "cxdxs", "cxaxb", "cx0xw", "cxAxb", "cxAxw", "cxBxw", "cxCxb", "cxBxb", "cxBxb", "cxCxs", "cxBxs", "cxBxs", "cxAxs", "cxAxb", "cxAxs", "cxAxs", "cxAxs"],
         ["cxAxs", "cxAxs", "cxBxs", "cxAxs", "wxAxs", "wxAxs", "wxAxs", "wxAxs", "wxAxs", "wxBxx", "wxBxs", "xfCxs", "wfDxx", "wfExs", "wfFxs", "xfFxs", "xfFxx", "xfGxs", "xfFxx", "xfFxs", "xfGxs", "xfGxx", "xfHxs", "xfHxs"],
         ["xfGxs", "wxFxs", "wfExs", "wfExb", "cxExb", "cxExs", "cxExs", "cxExs", "cxExs", "cxFxs", "wfExs", "wfExs", "wfExs", "cxExs", "cxExs", "cxExs", "wfDxs", "wfDxs", "xfDxs", "cxDxs", "wxDxs", "wxDxs", "cxCxs", "cxCxs"],
         ["cxBxs", "cxBxs", "cxAxs", "cxAxs", "cxAxb", "cxAxs", "cxAxb", "cxAxs", "cxAxs", "cxAxs", "cxCxs", "txCxw", "xfDxw", "wfDxs", "xfDxs", "xfExs", "xfExs", "xfExs", "xfExs", "xfExs", "xfExs", "xfExs", "xfFxs", "xfFxx"],
         ["xfFxx", "xfFxx", "xfFxx", "xfExx", "xfExx", "xfExs", "xfExx", "xfFxx", "xfHxx", "xfKxs", "xxOxs", "xxQ0s", "xxS0s", "xxS0s", "xxT0b", "xxT0b", "xxS0s", "xxR0b", "xxPxs", "xxOxs", "xxNxs", "xxNxs", "xxMxx", "xxLxs"],
         ["xxJxx", "xxJxs", "xxJxs", "xxJxs", "xxJxs", "xxJxs", "xxJxs", "cxKxs", "cxMxs", "cxNxs", "xxPxb", "xxQ0b", "xxR0b", "cxR0w", "cxS0b", "cxS0w", "xxR0w", "xxQxs", "xxNxs", "cxLxs", "cxLxs", "cxLxs", "cxMxs", "wxMxb"],
         ["wxMxb", "cxMxs", "cxMxb", "cxMxs", "cxMxs", "cxMxs", "cxMxs", "cxMxs", "cxMxs", "cxMxw", "cxNxb", "cxLxw", "cxKxb", "cxIxw", "cxIxs", "cxGxb", "cxFxg", "cxExs", "cxExw", "cxDxb", "cxDxw", "cxCxb", "cxCxb", "cxBxw"],
         ["cx0xb", "xxaxb", "xxaxs", "xxbxs", "cxbxb", "cxbxb", "cxbxs", "xxbxb", "xxaxb", "xx0xw", "xxAxw", "xxBxw", "xxBxw", "cxBxb", "cxBxb", "cxBxb", "cxBxb", "cxAxb", "cx0xs", "cxaxs", "wxaxs", "wxbxs", "wxbxs", "wxbxs"],
         ["wxcxs", "wxcxs", "wxcxs", "wxcxs", "cxcxs", "cxcxs", "cxcxs", "cxcxs", "cxbxs", "cxaxs", "cx0xb", "cx0xb", "cx0xb", "cxAxw", "cxBxs", "cxAxb", "cxAxb", "cxAxs", "cx0xs", "cx0xs", "cxaxs", "cxcxs", "xxdxx", "xxdxs"],
         ["xxdxs", "xxgxx", "xxgxx", "xxgxx", "xxgxx", "xxgxx", "xxgxx", "cxgxx", "cxdxx", "cx0xx", "xxDxs", "xxExw", "xxFxb", "xxGxb", "xxFxb", "xxFxb", "xxFxb", "xxExs", "xxDxs", "xxBxs", "xxAxx", "xxaxx", "xxbxx", "xxcxx"],
         ["xxcxx", "cxcxs", "cxcxs", "cxbxx", "xfaxx", "wx0xx", "wxAxx", "wfAxs", "wfBxx", "wfCxs", "wfDxs", "wfDxs", "wfDxs", "cxExg", "cxDxw", "cxCxw", "cxBxg", "cxAxw", "wx0xg", "xxbxw", "xxcxb", "xxdxw", "xxdxs", "xxdxs"],
         ["xxdxb", "xxdxs", "xxexs", "xxdxb", "xxexs", "xxfxs", "xxfxs", "xxexs", "xxdxb", "xxcxs", "cxaxw", "cxaxw", "cx0xw", "cxBxw", "cxCxb", "cxCxw", "cxCxb", "cxCxs", "cxBxb", "cxAxs", "cxAxs", "cxAxb", "cxAxs", "cxAxs"],
         ["cxAxs", "xx0xs", "xxaxs", "xxaxs", "cxaxs", "cxaxs", "cxaxs", "cxaxs", "wxaxs", "wxbxw", "xxbxs", "xxaxb", "wxdxs", "wxcxg", "wxaxg", "wxbxg", "wxbxg", "wxcxw", "wxdxb", "xxexb", "xxexs", "xxfxb", "xxexw", "sxgxb"],
         ["sxgxb", "sxgxs", "sxgxs", "sxgxs", "xxhxs", "xxhxs", "xxhxs", "cxhxs", "cxgxx", "cxgxx", "cxexx", "cxdxs", "cxcxs", "xxcxs", "xxaxb", "xx0xb", "xx0xw", "xxaxs", "xxbxb", "xxcxs", "xxcxs", "xxcxb", "xxcxb", "xxdxs"],
         ["xxdxs", "xxcxs", "xxcxs", "xxbxs", "xxbxs", "xxbxs", "xxbxs", "cxbxb", "cxaxb", "cx0xw", "cxBxb", "cxCxb", "cxDxs", "cxGxb", "cxGxs", "cxGxs", "cxFxw", "cxExw", "cxDxs", "cxDxs", "cxDxb", "cxCxw", "wxCxg", "wxBxg"],
         ["wxBxw", "cxAxw", "cxBxb", "wxBxs", "xxAxw", "xx0xs", "xx0xs", "xx0xs", "xxAxs", "xxBxw", "cxCxb", "cxDxb", "cxCxb", "cxDxb", "cxCxw", "cxCxb", "cxCxb", "cxBxs", "cxaxb", "cxbxw", "cxbxb", "cxbxw", "cxdxw", "cxexb"],
         ["cxdxw", "cxexw", "cxgxg", "cxgxb", "cxhxw", "cxhxs", "cxixs", "cxhxs", "cxgxb", "cxfxs", "cxfxs", "cxexb", "cxexb", "cxdxw", "cxcxs", "cxcxb", "cxcxs", "cxdxs", "cxdxs", "cxexs", "cxdxs", "cxexs", "cxexs", "cxexs"],
         ["cxexs", "cxdxb", "cxdxb", "cxexs", "cxdxs", "cxdxs", "cxexs", "cxdxs", "cxcxs", "cxaxs", "cx0xs", "cxBxs", "cxCxs", "cxBxs", "cxBxs", "cxBxs", "cxBxs", "cxAxs", "cxaxs", "xxcxs", "xxcxs", "xxfxx", "xxfxx", "xxgxx"],
         ["xxgxx", "xxhxx", "xxhxx", "xxixx", "cxhxx", "wxfxs", "wfexs", "xfcxx", "xfcxx", "xfaxs", "cxaxs", "cxaxs", "cx0xb", "cxAxb", "wxAxs", "wxaxw", "cx0xg", "cxbxb", "wxcxw", "cxcxb", "cxcxs", "cxdxb", "wxexb", "wxexb"],
         ["wxexs", "cxexs", "cxexb", "cxexb", "cxexb", "cxfxb", "cxfxb", "cxexb", "cxexb", "cxdxw", "cxdxw", "cxdxw", "cxcxw", "cxcxw", "cxdxw", "cxdxw", "cxdxw", "cxexs", "cxexb", "cxfxs", "cxfxs", "cxfxs", "cxfxs", "cxfxs"],
         ["cxfxs", "cxfxs", "cxgxs", "cxgxs", "cxgxs", "cxgxs", "cxfxs", "cxfxs", "cxfxs", "cxexs", "xxcxs", "xxbxs", "xxaxs", "cxaxx", "cxaxs", "cx0xx", "cxaxs", "cxaxx", "cxcxs", "cxdxx", "cxdxx", "cxexs", "cxdxx", "cxdxx"],
         ["cxdxs", "cxdxx", "cxdxx", "cxdxs", "cxdxs", "cxdxs", "cxdxs", "cxdxs", "cxdxs", "cxcxs", "cxcxs", "wxbxw", "wxbxb", "cxaxw", "cxaxw", "cxbxw", "cxbxw", "cxcxw", "cxcxw", "cxcxb", "cxdxw", "cxdxs", "cxdxb", "cxdxw"],
         ["cxdxb", "cxdxw", "wxdxb", "wxdxb", "cxdxw", "sxexb", "sxfxb", "sxgxb", "sxgxb", "sxexb", "cxdxw", "cxbxw", "cxaxw", "cxbxg", "cxbxw", "wxcxb", "wxexb", "wxfxb", "sxfxb", "sfgxs", "sfgxb", "sfgxs", "sfgxs", "sxgxs"],
         ["sxhxx", "sfhxs", "sxgxs", "sxgxs", "sfhxs", "sfgxx", "sfgxx", "cxgxx", "cxgxx", "cxfxs", "cxfxs", "cxexs", "cxexs", "cxdxs", "cxcxs", "cxbxs", "cxcxs", "cxcxs", "cxcxx", "cxcxs", "cxcxs", "wxcxx", "wxcxx", "wfcxs"],
         ["wfdxs", "cxdxs", "cxdxs", "cxdxs", "cxdxs", "cxdxs", "wxcxs", "wxcxs", "wxcxs", "wxdxs", "cxcxs", "wxbxb", "wxcxw", "cxbxs", "cx0xw", "cx0xw", "cx0xw", "cxaxw", "cxbxw", "cxbxs", "cxbxs", "cxexs", "xxfxx", "xxfxx"],
         ["xxgxx", "xxhxx", "xxhxx", "xxhxx", "xxhxs", "xxgxs", "xxgxs", "xxixx", "xxfxx", "xxcxs", "xxaxs", "xx0xs", "xxBxs", "xxCxs", "xxDxs", "xxDxs", "xxBxs", "xxAxs", "xx0xs", "xxaxs", "xxaxs", "xxaxs", "cx0xs", "wxaxx"],
         ["wxaxs", "cxaxs", "cxaxb", "wxaxs", "wxaxs", "wx0xs", "wx0xs", "wf0xs", "pf0xs", "wfAxs", "wfBxs", "wfBxs", "wfCxs", "xfDxs", "wfDxs", "wxDxb", "cxDxs", "cxCxs", "cxAxs", "xx0xs", "xxaxs", "xxbxs", "xxcxs", "xxcxx"]
        ],
        ["A",
         ["xxCxx", "xxDxx", "xxDxx", "xxDxx", "cxDxs", "cxDxx", "cxDxs", "cxDxx", "cxDxx", "cxExx", "wxFxx", "wxFxs", "wxFxs", "wfFxs", "wxFxs", "wfFxx", "wfFxx", "wfFxs", "wxFxs", "wxExs", "wxExs", "pxExs", "wxDxb", "wxDxb"],
         ["wxCxw", "wfCxb", "wxCxg", "wxCxb", "cxCxs", "cxCxs", "wfCxb", "wfBxw", "wfBxb", "wfCxb", "wfCxs", "wfDxs", "wfDxs", "wfDxs", "wfDxs", "wfDxs", "cxDxs", "cxDxs", "cxDxs", "cxCxs", "cxCxs", "cxCxs", "cxCxs", "wxCxs"],
         ["wxCxs", "cxCxs", "cxCxs", "wxCxx", "wxBxs", "wxBxs", "wxBxs", "wxAxs", "wxAxs", "wxCxb", "cxDxw", "cxExb", "cxExg", "cxExw", "cxDxw", "cxExb", "cxExs", "cxDxb", "cxCxs", "cxCxb", "cxCxs", "cxCxs", "cxBxs", "cxAxs"],
         ["cx0xs", "xx0xs", "xx0xs", "xxaxs", "xxaxs", "xxbxx", "xxcxx", "xxdxx", "xxaxx", "xxBxs", "xxDxs", "xxExs", "xxExs", "cxExb", "cxExw", "cxDxw", "cxDxg", "cxDxw", "cxDxb", "cxDxw", "cxDxw", "cxCxb", "cxCxb", "cxCxb"],
         ["cxDxs", "cxDxs", "cxFxb", "cxFxs", "cxFxs", "wxExs", "wxExb", "wxFxs", "wxFxb", "wfFxb", "wfGxs", "wfGxs", "wfHxs", "cxIxs", "cxIxs", "wfIxs", "cxIxs", "cxIxs", "cxHxs", "cxHxs", "cxHxs", "cxHxs", "cxHxs", "cxHxs"],
         ["cxHxs", "cxGxs", "cxGxs", "cxHxb", "wxHxs", "wxGxs", "wxGxw", "wxHxg", "wxHxg", "wxHxw", "wxHxb", "wfHxs", "wfLxw", "cxOxh", "cxMxh", "cxLxg", "wxKxg", "wxKxb", "wxJxg", "cxIxh", "cxIxg", "wxIxg", "wxHxw", "wxGxb"],
         ["wxGxw", "wxGxw", "wxGxw", "wxGxs", "cxFxb", "cxFxs", "cxFxb", "cxFxb", "cxFxb", "cxGxw", "cxGxw", "cxGxw", "cxFxw", "cxFxw", "cxCxb", "cxDxw", "cxExb", "cxCxb", "cxDxw", "cxDxw", "cxCxb", "cxCxw", "cxCxw", "cxCxb"],
         ["cxCxb", "cxCxw", "cxCxb", "cxCxs", "cxCxb", "cxCxb", "cxCxs", "cxCxs", "cxCxs", "cxDxb", "cxDxs", "wxCxs", "wxDxb", "cxDxb", "cxExs", "cxExs", "cxDxb", "cxDxb", "cxDxs", "cxCxs", "cxCxs", "cxBxs", "xxAxs", "xxaxx"],
         ["xxaxx", "cxbxs", "cxaxx", "cxbxs", "cxbxx", "cxaxx", "cxAxs", "cxAxs", "cxAxw", "sxAxb", "sx0xb", "sf0xb", "sf0xb", "sfaxs", "sx0xb", "wxAxw", "wfAxw", "wfAxb", "wxBxb", "wxBxs", "wxBxs", "wxBxb", "cxBxb", "cxBxw"],
         ["cxAxb", "xxAxw", "xx0xw", "xxaxg", "cxbxw", "cxbxg", "cxcxg", "xxcxw", "xxcxw", "xxbxg", "cxbxg", "cxaxh", "bxaxg", "cx0xb", "cxAxg", "cx0xw", "cx0xw", "cx0xb", "cx0xb", "xxbxb", "xxbxs", "sxbxs", "xxcxs", "xxcxs"],
         ["xxcxs", "cxbxb", "sxbxs", "sxcxs", "sxcxs", "sxcxs", "sxcxs", "cxcxs", "cxcxs", "cx0xs", "cxAxs", "cxAxs", "cxBxs", "cxBxs", "sxBxs", "sxAxs", "cxAxx", "cxAxx", "cxAxs", "cxBxs", "cxAxs", "cxAxs", "cxaxx", "cx0xs"],
         ["cx0xs", "cx0xs", "cx0xs", "cx0xx", "cx0xx", "cx0xs", "cx0xs", "cxAxs", "cxAxs", "cxCxx", "cxCxs", "cxExs", "cxExs", "cxExs", "cxExs", "cxExs", "cxDxs", "cxDxs", "cxDxs", "cxDxs", "cxCxx", "cxBxx", "wxBxx", "wxBxs"],
         ["wfAxs", "sf0xx", "sfaxx", "sfaxx", "sfaxx", "sf0xx", "sx0xs", "sx0xs", "sx0xb", "bxaxw", "cxaxw", "cxaxb", "cxbxb", "sxbxb", "sxbxb", "sxbxs", "sxbxs", "sxbxs", "sxbxs", "cxbxb", "cxcxw", "cxcxs", "cxdxb", "cxdxw"],
         ["cxexb", "xxfxs", "xxfxs", "xxgxs", "cxgxx", "cxgxs", "sxhxs", "sxhxs", "sxhxs", "sxgxs", "sxgxs", "sxgxx", "sxexx", "cxcxs", "cxbxs", "cxcxs", "sxexb", "sxfxb", "sxgxx", "xxgxs", "xxgxx", "xxgxx", "cxgxs", "cxhxx"],
         ["cxgxs", "cxgxs", "cxgxs", "cxgxs", "cxfxb", "cxfxb", "cxfxs", "cxexb", "cxexb", "cxdxw", "cxdxb", "cxaxg", "cxaxg", "cxaxw", "cxaxw", "cxaxb", "sxaxs", "bxbxw", "sxbxb", "sxbxb", "bxbxw", "sxaxb", "sxaxb", "sxaxb"],
         ["sxaxs", "sxaxs", "sxaxs", "sxaxs", "sxaxs", "sxaxs", "sxaxs", "sfaxs", "sxaxs", "sxaxs", "sxaxs", "sx0xb", "sx0xb", "sx0xs", "sxAxb", "bxAxw", "bx0xw", "bx0xw", "sx0xs", "sx0xs", "wf0xs", "wf0xs", "wf0xb", "xfAxs"],
         ["xfAxs", "cxAxs", "cxAxs", "cxAxs", "cxAxs", "sf0xs", "wx0xs", "cx0xb", "cx0xb", "cx0xs", "cx0xs", "cxAxb", "cxAxb", "cx0xw", "cx0xs", "cx0xw", "cxaxs", "cxbxs", "cxbxx", "xxcxs", "xxcxs", "xxcxs", "xxcxs", "xxdxs"],
         ["xxdxs", "cxdxs", "cxexx", "cxfxx", "cxgxx", "cxfxx", "cxfxx", "cxfxx", "cxfxx", "cxdxx", "cxcxx", "cxbxx", "cxaxs", "cx0xx", "cx0xs", "cx0xs", "cx0xs", "cx0xs", "cx0xs", "cx0xs", "cx0xs", "cx0xx", "cx0xs", "cx0xs"],
         ["cxbxx", "cxcxx", "cxdxs", "cxdxs", "cxcxs", "cxdxs", "cxcxs", "cxcxs", "cxcxs", "cxbxs", "xx0xs", "xxBxx", "xxBxs", "cxBxs", "cxBxs", "cxCxs", "cxBxs", "cxAxx", "cxAxs", "cxAxx", "cxAxx", "cxaxs", "cxaxx", "cxaxx"],
         ["cxbxx", "cxaxx", "sxaxx", "sx0xx", "sx0xs", "sx0xs", "sxbxb", "sxbxb", "bxcxw", "sxcxb", "cxcxb", "cxbxw", "cxcxb", "cxbxw", "cxcxs", "cxdxs", "xxdxb", "xxexs", "xxexs", "cxexs", "cxexs", "cxexb", "cxdxb", "cxdxb"],
         ["sxdxs", "cxdxs", "cxcxb", "cxbxs", "sxbxb", "sxbxb", "bx0xw", "bxbxw", "bxbxg", "bxcxw", "cxcxg", "cxexw", "cxfxh", "sxgxb", "sxhxb", "bxgxw", "bxixw", "sxkxs", "sxkxs", "sxkxb", "sxlxb", "sxmxs", "xxnxs", "xxoxb"],
         ["xxpxs", "xxpxs", "xxpxs", "xxpxs", "xxpxs", "xxpxs", "xxoxs", "xxnxs", "xxmxs", "xxlxs", "xxlxb", "xxkxb", "xxjxs", "xxixs", "xxixs", "xxhxs", "xxixx", "xxjxs", "xxkxs", "xxkxx", "xxlxs", "xxmxs", "xxoxs", "xxoxx"],
         ["xxnxx", "cxmxx", "cxhxb", "cxgxb", "cxgxb", "cxgxb", "cxfxs", "cxfxs", "cxfxb", "cxexb", "cxexs", "cxcxs", "cxaxb", "xx0xs", "xx0xb", "xx0xb", "cx0xs", "cxbxs", "cxcxs", "xxcxs", "xxdxx", "xxdxx", "cxdxx", "cxdxx"],
         ["cxdxx", "cxdxx", "cxcxs", "cxdxx", "cxcxs", "cxdxs", "cxcxx", "cxdxs", "cxcxs", "cxaxs", "cx0xs", "wxAxb", "wxAxw", "wx0xw", "wf0xb", "wfBxb", "wfBxb", "wfBxs", "wfBxs", "wfBxs", "wfCxs", "wfCxs", "wfCxs", "wfDxs"],
         ["wfDxs", "wfExs", "wfExs", "wfExs", "cxExs", "cxDxs", "wxDxs", "cxDxs", "cxDxs", "cxDxb", "cxExb", "cxFxs", "cxFxb", "cxExb", "cxExs", "cxExs", "cxDxs", "cxDxs", "cxDxs", "cxCxx", "cxCxs", "cxCxs", "cxCxx", "cxBxx"],
         ["cxBxs", "cxAxs", "cxBxs", "cxBxs", "cxBxs", "cxBxs", "cxBxb", "wfBxb", "wxBxw", "wfCxg", "wfCxw", "wfCxb", "wfDxg", "wfDxg", "wfDxw", "wfDxb", "wfDxs", "wfDxs", "wfExs", "wfCxs", "wxBxs", "wxAxs", "wxAxs", "wxAxb"],
         ["wx0xs", "sx0xs", "bx0xw", "sxAxb", "cx0xb", "cx0xb", "sx0xb", "sx0xs", "sxaxb", "sxaxb", "bxaxw", "bx0xw", "sx0xb", "bx0xg", "bx0xw", "sxaxb", "bxbxw", "bxbxw", "bxbxw", "sxbxb", "bxcxw", "sxcxb", "sxcxb", "sxcxb"],
         ["sxcxb", "bxcxw", "sxcxb", "sxcxb", "cxcxb", "cxcxb", "sxbxb", "bxbxw", "sxbxb", "bxbxw", "bxaxw", "bx0xw", "bx0xw", "bxAxw", "bxAxg", "bxAxw", "cx0xw", "cx0xb", "cx0xb", "cx0xb", "cx0xb", "cx0xb", "xx0xs", "xx0xs"],
         ["sxaxs", "sxaxs", "sxaxs", "sxaxs", "cxaxs", "cxaxs", "cx0xs", "cx0xs", "cx0xs", "cxAxs", "cxAxs", "cx0xb", "cx0xb", "cx0xs", "cx0xs", "cxAxs", "cxAxs", "cx0xs", "cx0xs", "cx0xx", "cx0xs", "cx0xs", "cx0xs", "cx0xx"],
         ["cxaxs", "cxaxs", "cxaxs", "cxaxs", "cxaxs", "cxaxx", "cxaxx", "cxaxs", "cxaxs", "cxaxs", "sxaxs", "sx0xx", "sx0xs", "sx0xs", "sx0xs", "sx0xs", "cx0xx", "cx0xs", "cx0xs", "cx0xs", "cx0xx", "cx0xs", "cxAxx", "cxAxs"]
        ],
        ["a",
         ["cxBxx", "cxBxs", "cxBxs", "cxBxx", "cxAxx", "cxAxx", "xfAxs", "xfAxx", "xfAxs", "xfBxs", "cxCxs", "cxCxs", "cxCxb", "cxDxw", "cxDxw", "cxDxw", "cxDxg", "cxDxw", "cxDxg", "wxCxg", "wxCxg", "wxCxw", "wxCxh", "wxDxg"],
         ["wfDxw", "wfDxw", "wfDxw", "wfDxg", "wfExw", "wfExw", "wxExw", "wfExw", "wfFxb", "xfFxw", "xfFxs", "xfGxs", "xfGxs", "cxHxs", "cxIxs", "cxJxs", "xxKxs", "xxHxx", "xxGxx", "wfFxx", "txHxs", "wxIxs", "cxGxs", "cxGxx"],
         ["cxHxs", "wxHxs", "wxHxs", "wfGxw", "wxFxw", "wxFxb", "wxFxw", "cxDxb", "cxCxw", "cxBxw", "cxBxb", "cxBxw", "cxAxw", "bxAxw", "sxAxs", "sxAxb", "sxAxs", "sxAxs", "bxAxw", "cxAxs", "bx0xw", "bx0xw", "cx0xw", "cxaxs"],
         ["cxbxs", "cxaxs", "cxbxb", "cxbxw", "cxcxw", "cxdxb", "cxdxs", "cxdxb", "cxdxb", "cxdxs", "cxcxs", "cxcxs", "cxbxs", "xxbxs", "xx0xs", "xx0xs", "xx0xs", "xxbxs", "xxbxs", "xxcxs", "xxcxx", "xxdxx", "xxdxx", "xxexx"],
         ["xxexx", "xxfxx", "xxfxx", "xxfxx", "xxgxx", "xxgxs", "xxfxx", "cxfxs", "cxexx", "cxdxx", "cxcxs", "cxaxx", "cxAxs", "cxAxs", "cxBxs", "cxBxs", "cxBxs", "cxAxs", "cxAxs", "cxAxs", "cxAxs", "cxAxs", "sxAxs", "sx0xs"],
         ["sx0xb", "sx0xs", "sx0xb", "sx0xb", "sxaxb", "sxaxb", "sxaxs", "cxaxb", "cxaxb", "cx0xb", "cxAxb", "cxBxb", "sxBxb", "sxBxs", "sxBxb", "sxBxs", "sxBxs", "sx0xs", "sx0xs", "bxaxw", "sxaxs", "sxaxb", "xxbxb", "xxcxs"],
         ["sxcxs", "sxexb", "sxexs", "sxgxs", "sxgxs", "sxgxs", "sxixs", "sxixs", "sxixx", "sxhxs", "xxgxs", "xxfxs", "xxexs", "xxexs", "xxdxs", "xxexx", "cxexs", "cxfxs", "cxfxs", "cxfxs", "cxexs", "cxexs", "cxexs", "cxexs"],
         ["cxexs", "sxexs", "sxfxs", "sxfxs", "sxfxx", "sxfxx", "sxfxx", "xxfxx", "xxgxs", "xxexs", "cxbxs", "bxaxw", "sx0xb", "xxAxb", "xxAxb", "xx0xs", "cx0xs", "cx0xs", "cx0xb", "cxaxs", "cxbxs", "cxbxb", "sxaxs", "sxaxs"],
         ["sxaxs", "cxbxb", "cxbxs", "cxbxs", "cxcxs", "cxcxb", "cxdxs", "xxexs", "xxexs", "xxcxs", "xxbxw", "xxaxs", "xxAxw", "xxAxw", "xxAxs", "xxAxs", "cx0xb", "cxaxb", "cxaxs", "cxaxs", "cx0xs", "cx0xs", "cx0xs", "cx0xs"],
         ["cx0xs", "cx0xs", "cx0xs", "cx0xx", "cx0xx", "cx0xx", "cx0xs", "cx0xs", "cx0xx", "cx0xs", "cxAxx", "cxAxx", "cxAxx", "cxBxs", "cxBxs", "cxAxs", "sxAxs", "sxAxs", "sxAxx", "cxBxs", "cxAxs", "cxAxs", "cxAxb", "cx0xb"],
         ["cx0xs", "cx0xs", "cxaxb", "cxbxs", "sxbxb", "sxbxs", "sxbxs", "sxbxs", "sxaxs", "sxaxs", "sxaxs", "sxaxs", "sxaxb", "sxaxs", "sxaxs", "sxaxs", "sx0xs", "sx0xs", "sxaxs", "sx0xs", "sx0xs", "sx0xs", "sx0xs", "sx0xs"],
         ["sxAxs", "cxAxs", "cxAxs", "cx0xs", "cx0xs", "cxaxx", "cxaxs", "xxcxs", "xxdxs", "xxbxs", "xxaxs", "xxaxs", "xx0xs", "cx0xb", "sx0xb", "bx0xw", "cx0xw", "cxAxw", "cxAxw", "cx0xw", "cx0xb", "cxaxw", "cxaxb", "cxbxw"],
         ["cxbxw", "sxbxs", "sxaxb", "sxaxs", "sxaxs", "sxbxb", "sxaxs", "xfaxs", "xfaxs", "xfaxs", "xf0xs", "xf0xs", "xf0xs", "xfBxs", "xfBxs", "xfCxs", "cxBxs", "cxBxs", "cxBxs", "cxBxs", "cxBxs", "cxAxs", "cxAxs", "cxAxs"],
         ["cx0xx", "xxaxx", "xxaxx", "xxaxx", "xfaxs", "xf0xx", "xf0xx", "wxAxs", "wfBxx", "wfBxx", "wfCxx", "wfCxx", "wfDxs", "xfExs", "xfExs", "xfExs", "xfExs", "xfExs", "xfExx", "xfFxs", "xfExs", "xfDxs", "cxDxx", "xfDxs"],
         ["xfCxs", "xfBxx", "xfAxs", "xfAxs", "xfAxs", "xfAxx", "xf0xx", "xfAxx", "xfAxx", "xfBxx", "cxBxx", "cxCxs", "cxDxs", "cxDxs", "cxDxs", "cxDxs", "cxDxs", "cxBxs", "cxBxs", "cxBxs", "cxAxx", "cxAxs", "cxAxs", "cxAxs"],
         ["cx0xs", "cx0xs", "cx0xs", "cxaxs", "cxaxs", "cx0xs", "cx0xs", "cxaxs", "cx0xs", "cx0xs", "cxBxs", "cxBxs", "cxCxs", "cxDxs", "cxFxs", "cxExs", "cxDxb", "cxCxs", "cxBxs", "cxBxs", "cxBxs", "cxBxs", "cxBxs", "cxCxs"],
         ["cxCxs", "cxBxs", "cxAxs", "cxBxs", "cxBxs", "cxAxs", "cxAxs", "cxBxs", "cxBxs", "cxCxs", "cxCxb", "cxCxs", "cxCxs", "cxCxb", "cxCxs", "cxCxw", "cxCxb", "cxBxg", "cxAxg", "cx0xw", "cxaxs", "cx0xs", "cxaxs", "cxaxs"],
         ["cxaxb", "cxbxb", "cxcxb", "cxcxb", "cxdxw", "cxfxs", "sxfxs", "cxexs", "sxexs", "sxexs", "sxexb", "sxdxs", "sxcxs", "xxbxs", "xxbxs", "xxaxs", "xxaxx", "xxcxs", "xxcxx", "xxdxs", "xxdxx", "xxexs", "xxexx", "xxfxx"],
         ["xxexx", "cxexx", "cxaxs", "cxaxs", "xxaxb", "xxaxb", "xxaxs", "xxaxs", "xxbxs", "xxbxs", "cxCxs", "cxDxs", "cxExs", "cxFxs", "cxFxb", "cxFxs", "cxExs", "cxExs", "cxDxs", "xxCxs", "xxBxs", "xxBxs", "xxCxs", "xxBxs"],
         ["xxBxx", "xxaxx", "xxaxx", "xxbxx", "xxbxx", "xxaxx", "xxbxx", "cx0xx", "cx0xx", "cxBxs", "cxCxs", "cxDxs", "cxExs", "cxDxs", "cxExx", "cxFxs", "cxExs", "cxExx", "cxDxx", "cxDxs", "cxCxx", "wxCxx", "wxCxs", "wxDxs"],
         ["wxCxs", "wxDxb", "wxDxw", "wfDxs", "wfDxs", "wfExs", "wfExx", "wfDxs", "wfDxs", "wfDxs", "wfDxs", "wfDxs", "wfExs", "xfExs", "xfExs", "xfDxw", "cxDxg", "cxCxw", "cxCxb", "cxCxw", "cxBxg", "cxAxw", "cxAxw", "cx0xg"],
         ["cx0xw", "cxaxg", "cxaxh", "cxaxg", "cxbxg", "cxbxv", "cxbxg", "bxbxg", "bxbxg", "bxbxg", "cxaxw", "cxaxs", "cxaxb", "cx0xb", "cxaxb", "cxaxw", "cxaxw", "cxaxb", "cxbxw", "cxbxs", "cxbxs", "cxbxs", "cxbxs", "cxbxs"],
         ["cxaxs", "cxaxs", "cxaxs", "cxaxs", "cxaxs", "cxaxs", "cxaxx", "cxaxx", "cxaxx", "cxaxs", "cx0xs", "cx0xs", "sx0xs", "sxAxs", "sx0xb", "sx0xs", "sxaxb", "sxaxs", "sxaxs", "sxaxs", "wxaxs", "sxaxs", "sxaxx", "wfaxx"],
         ["sfaxx", "sfaxx", "xfaxx", "xfaxx", "cx0xx", "sx0xs", "sxAxs", "sxAxs", "sxAxs", "sxAxs", "sxAxs", "sxAxs", "sxBxs", "sxBxs", "sxBxb", "sxBxs", "cxBxs", "cxBxb", "cx0xb", "xx0xb", "xx0xb", "xx0xb", "cx0xs", "cx0xs"],
         ["cxaxx", "cxaxs", "cxaxs", "sxaxs", "cxbxs", "cxbxs", "cxbxs", "cxbxs", "cxcxs", "cxcxx", "xxbxs", "xxaxs", "xxAxs", "cxAxs", "cxAxx", "sxAxx", "cx0xx", "cx0xs", "sx0xs", "cx0xs", "cx0xs", "cx0xs", "cx0xs", "cx0xs"],
         ["cx0xs", "cxaxs", "cxbxs", "cxbxx", "xxbxs", "xxbxs", "xxaxs", "cxaxs", "cx0xs", "cx0xs", "cxAxs", "sxAxs", "sxAxb", "cxBxs", "cxBxs", "cxCxs", "cxAxw", "cx0xb", "cx0xb", "cxaxs", "cxaxb", "cxbxb", "cxcxs", "cxdxb"],
         ["cxfxs", "xxgxs", "xxgxs", "xxhxs", "xxhxs", "xxhxs", "xxhxs", "cxhxb", "cxgxs", "cxfxb", "cxexb", "cxdxb", "cxdxw", "cxcxb", "cxcxw", "cxbxw", "cxbxw", "cxbxw", "cxaxg", "cxaxg", "cxaxw", "px0xw", "cxAxb", "wxBxw"],
         ["wfCxs", "wfCxs", "wfDxs", "wfDxs", "xfDxs", "xfExs", "wfExs", "wfFxx", "wfIxb", "wfIxb", "wfIxb", "wfJxb", "wfKxs", "cxKxs", "cxLxs", "cxLxs", "cxLxs", "cxLxs", "cxLxb", "xxKxb", "xxJxs", "xxJxs", "cxHxw", "cxFxs"],
         ["cxExw", "cxDxg", "cxCxb", "cxBxb", "cxAxg", "cxaxw", "cxbxw", "cxbxg", "bxcxg", "bxcxw", "cxdxg", "cxdxw", "cxcxw", "cxdxw", "cxdxw", "cxcxs", "xxdxs", "xxexs", "xxfxs", "xxgxs", "xxgxs", "xxgxx", "cxgxs", "cxfxx"],
         ["cxfxs", "cxexs", "sxfxs", "sxfxx", "sxexx", "sxfxs", "sxexs", "cxexs", "sxexs", "sxdxx", "sxcxx", "sxaxs", "sx0xs", "cx0xs", "cx0xs", "cxBxs", "cxAxs", "cxAxs", "cx0xs", "cx0xs", "cx0xs", "cx0xs", "cx0xs", "cx0xs"],
         ["cxbxs", "xxaxs", "xxcxx", "cxdxx", "cxexs", "cxexs", "sxexx", "bxexw", "bxexw", "bxexg", "xxexw", "xxfxw", "xxgxw", "xxgxb", "xxhxb", "xxhxb", "xxixs", "xxhxs", "sxhxb", "sxhxb", "bxlxw", "bxmxw", "xxnxw", "xxoxw"]
        ]
    ];
    const RAWWEATHERDATA = [
        ["f",
         ["xxoxs1", "xxoxs1", "xxnxx1", "xxoxx1", "xxoxx1", "xxoxx1", "xxnxs1", "cxoxs1", "sxoxs1", "sxnxx1", "cxhxb1", "cxexb1", "cxdxb1", "cxdxw1", "sxcxs1", "bxdxw1", "xxfxb1", "xxfxb1", "xxgxw1", "xxgxw1", "xxhxb1", "xxjxs1", "xxlxs1", "xxlxs1"],
         ["sxkxx1", "sxkxx1", "sxjxs1", "sxjxx1", "cxjxx1", "sxexs1", "sxdxs1", "cxcxw1", "bxdxw1", "bxexw2", "bxexw2", "bxcxw2", "bxcxw2", "cxbxw2", "bxbxg2", "bxbxw2", "cxbxg2", "cxbxb2", "sxcxb2", "bxexw2", "sxexb2", "sxfxs2", "cxfxs2", "cxfxs2"],
         ["cxfxb2", "cxgxs2", "cxgxs2", "cxhxb2", "cxgxb2", "cxfxw2", "cxfxw2", "cxfxb2", "cxexb2", "cxexs2", "cxcxb2", "cxbxw2", "cxbxw2", "cxaxw2", "cxaxw2", "cxaxw2", "sxaxb2", "sxaxs2", "bxbxw2", "sxbxb3", "sxcxb3", "sxcxs3", "sxcxs3", "sxcxs3"],
         ["sxcxs3", "sxcxs3", "sxcxs3", "sxcxs3", "sxcxs3", "sxdxs3", "sxdxs3", "xxexw3", "xxfxw3", "bxgxw3", "bxgxg3", "bxgxw3", "bxgxg3", "bxgxg4", "bxgxh4", "bxgxg4", "bxhxh4", "bxixg4", "bxkxg4", "bxlxh4", "bxmxg4", "bxnxh4", "xxoxh4", "xxoxh4"],
         ["xxpxh4", "xxqxw4", "xxqxg4", "xxqxw4", "xxqxg4", "xxqxw4", "xxpxw4", "xxqxw4", "xxqxb4", "xxpxw4", "xxoxg4", "xxnxg4", "bxmxw4", "bxlxg5", "bxlxg5", "bxkxw5", "xxkxw5", "bxlxw5", "sxlxs5", "sxlxs5", "bxlxw5", "sxmxb5", "sxnxb5", "bxoxg5"],
         ["sxpxb5", "xxqxb5", "xxqxb5", "xxrxs5", "xxrxs5", "xxrxb5", "xxrxb5", "xxsxb5", "xxsxb5", "xxrxb5", "xxqxs5", "xxpxs5", "xxoxb5", "xxnxg5", "xxmxb5", "xxlxw5", "xxlxb5", "xxlxs5", "xxmxs5", "xxmxs5", "xxnxs5", "xxnxx5", "xxnxx5", "xxpxx5"],
         ["xxpxx5", "xxoxs5", "xxoxs5", "sxmxx5", "sxmxx5", "sxlxx5", "sxmxx5", "cxjxs5", "cxixs5", "cxhxb5", "bxgxw5", "sxfxb5", "bxexw5", "cxexw5", "cxdxw5", "cxcxw5", "cxcxw5", "cxcxb5", "cxbxb5", "sxbxb5", "sxaxs5", "sx0xs5", "cxBxb5", "pxBxw5"],
         ["pxCxb5", "cxCxb5", "bxCxw5", "sxCxb5", "sxCxb5", "sxDxb5", "sxCxb5", "bxCxw5", "sxDxb5", "sxDxs5", "sxExb5", "sxFxb5", "sxGxs5", "cxGxb5", "cxHxw5", "cxHxb5", "cxHxb5", "cxHxb5", "cxHxs5", "cxHxw5", "cxHxb5", "cxHxw5", "sxGxs5", "sxGxb5"],
         ["sxFxs5", "cxFxs5", "sxFxs5", "sxFxs5", "sxFxb5", "sxExb5", "sxExs5", "cxExs5", "cxExs5", "cxExb5", "cxExs5", "cxExs5", "cxExs5", "sxExs5", "sxExb5", "sxExs5", "cxExs5", "cxDxs5", "cxDxs5", "sxDxx5", "sxDxx5", "sxDxx5", "cxCxx5", "cxDxx5"],
         ["cxDxs5", "cxDxs5", "cxDxs5", "cxDxs5", "xxBxs5", "xx0xs5", "xxBxs5", "xx0xs5", "xxAxx5", "xxCxs5", "xxExb5", "xxExb5", "xxFxb5", "cxGxb5", "cxGxb5", "wxFxs5", "wfFxb5", "wfFxb5", "wfGxs5", "wfGxs5", "wfHxs5", "xfGxx5", "xfHxx5", "xfHxs5"],
         ["wfHxx5", "wfIxs5", "xfIxx5", "xfIxs5", "xfHxx5", "xfHxx5", "xfLxs5", "cxMxs5", "wxMxs5", "wxNxb5", "cxNxs5", "cxOxs5", "cxPxb5", "cxPxg4", "cxPxs4", "wxQxs4", "wxPxs4", "wxPxs4", "wfPxb3", "wfPxs3", "wfPxb3", "wfPxw3", "wfPxw3", "wfPxg3"],
         ["wfPxw2", "wfPxw2", "wfPxw2", "wfQxb2", "wxQxs2", "wxQxb2", "wxRxw1", "wxQxs1", "wfNxg1", "wxJxw1", "wfHxh1", "wfGxv1", "pfExh1", "pxCxv1", "bxAxh1", "bxaxw1", "bxbxw1", "bxcxg1", "bxdxh1", "cxdxh1", "bxexh1", "bxexw1", "cxexg1", "bxfxg2"],
         ["bxfxw2", "cxgxh2", "cxgxv2", "cxgxg2", "cxhxg2", "cxhxg2", "cxixg2", "cxixb2", "cxixw2", "cxjxw2", "xxixw2", "xxixg2", "xxhxg2", "xxhxg2", "xxgxw2", "xxgxw2", "xxhxh2", "xxhxb2", "xxhxb2", "xxhxs2", "xxixs2", "xxjxs2", "xxjxx2", "xxjxx2"],
         ["xxkxs2", "xxkxs2", "xxkxs2", "xxkxs2", "xxkxx2", "xxlxs2", "xxlxs2", "xxlxx2", "xxlxx2", "xxjxx2", "cxfxs2", "cxdxs2", "cxbxs2", "cxaxs2", "cx0xs2", "cxaxs2", "cxaxs2", "cxbxs2", "cxbxs2", "cxcxs2", "cxbxs2", "cxbxs2", "cxbxb2", "cxbxb2"],
         ["cxbxw2", "cxcxb2", "cxcxw2", "cxcxw2", "cxcxb2", "sxbxb2", "bxcxw2", "bxdxw2", "bxexw2", "bxexg2", "bxfxw2", "bxfxw2", "bxexg2", "bxexw3", "sxdxb3", "sxdxb3", "sxdxs3", "sxdxb3", "sxdxb3", "bxdxw3", "sxdxb3", "sxdxb3", "sxdxs3", "sxdxs3"],
         ["sxdxs3", "sxdxs3", "sxcxs3", "sxcxs3", "sxdxs3", "sxdxs3", "sxcxs3", "sxcxx3", "sxcxs4", "sxcxx4", "sxaxx4", "sx0xs4", "sx0xs4", "cxBxs4", "cxBxs4", "cxBxb4", "cxBxs4", "cxBxx4", "cxAxs4", "cx0xs4", "sx0xx4", "sx0xs4", "sxaxs4", "sxaxs4"],
         ["sxbxs4", "sxcxs4", "sxcxs4", "sxdxs4", "sxdxs4", "sxdxs4", "sxfxs4", "xxfxx4", "xxgxs4", "xxfxs4", "xxdxs4", "xxbxw4", "xxaxb4", "cx0xs4", "cx0xw4", "cx0xb4", "xx0xb4", "xxaxb4", "xxbxb4", "xxbxw4", "xxbxg4", "xxaxg4", "xxaxb4", "xxbxw4"],
         ["xxaxw4", "xxbxw4", "xxbxb4", "xxbxs4", "xxcxs4", "xxcxs4", "xxcxw4", "sxcxb4", "bxbxw4", "sxbxb4", "sxbxb5", "sxaxs5", "sxaxs5", "sx0xb5", "sx0xs5", "sx0xs5", "cxAxs5", "bf0xw5", "sx0xb5", "sx0xs5", "sx0xs5", "sxAxs5", "cxAxs5", "cxAxs5"],
         ["cxAxs5", "xx0xs5", "xxAxs5", "xxAxs5", "cxAxs5", "cxAxs5", "cxBxs5", "cxBxb5", "cxBxs5", "cxBxw5", "cxCxb5", "cxDxb5", "cxDxb5", "xxExb5", "xxFxw5", "xxGxb5", "cxGxb5", "cxFxb5", "cxFxs5", "cxFxb5", "cxFxb5", "cxGxw5", "cxGxw5", "cxHxw5"],
         ["cxHxg5", "cxHxg5", "cxGxw5", "cxGxs5", "cxGxs4", "cxGxs4", "cxHxs4", "cxHxs4", "cxHxs4", "cxHxb4", "cxIxb4", "cxJxs4", "cxJxb4", "cxKxs4", "cxKxb4", "cxKxs3", "cxKxb3", "cxJxs3", "cxJxs3", "xxIxs3", "xxHxs3", "xxGxs3", "xxGxs3", "xxGxs3"],
         ["xxFxs3", "cxFxx3", "cxExx3", "cxExx3", "cxExx3", "cxExx3", "cxExx3", "cxDxs3", "cxDxx3", "cxExx3", "xxGxx3", "xxIxs3", "xxJxs2", "cxJxs2", "cxIxs2", "cxJxs2", "cxJxs2", "cxHxs2", "xfGxs2", "xfGxx2", "xfGxs2", "xfGxx2", "wfGxx2", "wfGxs2"],
         ["wfGxx2", "wfGxx2", "wfGxs1", "wfHxs1", "wfHxs1", "wfHxs1", "wfHxs1", "wfHxs1", "wfGxs1", "wfGxb1", "wfGxb1", "wfHxb1", "wfHxw1", "wfHxb1", "wfGxw1", "wfFxg1", "xfFxg1", "xfFxw1", "xfFxb1", "xfGxw1", "xfFxs1", "xfFxb1", "wfFxb1", "wfFxb1"],
         ["wfGxs1", "xfGxsx", "wfHxsw", "wfHxsw", "wfIxsw", "xfIxxx", "xfIxsx", "xfIxsx", "xfIxsx", "xfIxsx", "xfJxsx", "xfKxsx", "xfLxwx", "cxKxbx", "cxKxbx", "cxJxgx", "wxJxbw", "wxIxww", "sxGxbx", "cxExwf", "cxDxwf", "bxCxwf", "cxBxwf", "sxAxbf"],
         ["bxAxwf", "bx0xhf", "bxaxgf", "bxbxgf", "cxbxgf", "bxcxgf", "bxexwf", "xxfxwf", "xxgxwf", "xxgxbf", "xxexbf", "xxdxbf", "xxbxbf", "xxaxbf", "xxaxbf", "xxaxbf", "cxaxbf", "cxaxwf", "cxbxwf", "cxbxwf", "cxcxwf", "cxcxbf", "xxdxbf", "xxexbf"],
         ["xxexwf", "xxfxwf", "xxexbf", "xxexsf", "cxexbf", "cxexsf", "cxexsf", "cxexsf", "cxexxf", "cxdxxf", "cxbxsf", "cxaxsf", "cxAxsf", "cxAxsf", "cxAxsf", "cxAxsf", "cxAxsf", "sxAxsf", "sxAxsf", "sxAxsf", "sxBxs1", "sxBxs1", "sxBxs1", "sxBxx1"],
         ["sxCxx1", "cxCxx1", "cxBxs1", "cxBxx1", "cxBxs1", "cxBxs1", "cxBxs1", "xxAxx1", "xxBxs1", "xxExb1", "cxExb1", "cxGxw1", "cxGxw1", "cxGxw1", "cxHxbx", "cxHxbx", "xxHxsx", "xxGxbx", "xxGxbx", "xxFxsx", "xxExsf", "xxExxf", "xxDxxf", "xxDxxf"],
         ["xxGxsx", "cxKxbx", "cxKxsx", "cxJxsx", "cxKxsx", "cxLxsx", "cxLxsx", "cxKxsx", "cxMxbx", "cxNxbx", "cxNxwx", "cxOxwx", "cxOxgx", "cxNxgx", "wxNxww", "wxLxww", "cxLxwx", "cxLxwx", "cxLxwx", "cxLxbx", "cxLxsx", "cxKxsx", "xxJxsx", "xxIxsx"],
         ["xxGxsx", "xxGxsx", "xxExxf", "xxDxsf", "xxExsf", "xxCxxf", "xxCxxf", "xxDxsf", "xxDxxf", "xxGxxx", "xxHxsx", "xxIxsx", "xxIxsx", "cxIxsx", "cxHxbx", "cxGxsx", "cxGxbx", "cxFxsx", "cxExsf", "xxDxsf", "xxDxsf", "xxDxsf", "cxDxsf", "cxDxsf"],
         ["cxCxxf", "xxBxsf", "xxAxsf", "xxBxsf", "cxCxsf", "cxCxsf", "cxBxsf", "cxBxsf", "cxBxsf", "cxBxsf", "cxBxsf", "sxCxsf", "sxCxbf", "cxDxbf", "bxCxwf", "sxBxbf", "sxBxbf", "sxAxbf", "sxAxsf", "sxAxbf", "bx0xwf", "sx0xbf", "bx0xwf", "sxaxbf"],
         ["bxaxwf", "sxbxbf", "bxbxw1", "bxcxw1", "bxdxw1", "bxdxw1", "bxexg1", "bxexw1", "bxfxw1", "bxfxw1", "xxexw1", "xxexg1", "xxexg1", "xxexw1", "xxexw1", "xxdxh1", "xxdxw1", "xxexb1", "xxfxs1", "xxfxs1", "xxfxx1", "xxgxs1", "xxgxx1", "xxhxs1"],
         ["xxhxx1", "xxhxx1", "xxhxx1", "xxixx1", "xxjxs1", "xxjxx1", "xxjxx1", "cxgxs1", "cxexs1", "sxaxb1", "sxaxb1", "sx0xb1", "bxAxg1", "cxBxb1", "cxCxb1", "cxDxw1", "cxExb1", "cxFxb1", "cxFxb1", "cxGxb1", "cxGxs1", "cxHxs1", "cxGxs1", "cxGxs1"]],
        ["b",
         ["cxAxx1", "cxbxs1", "cxbxx1", "cxbxx1", "cx0xs1", "cx0xs1", "cxAxs1", "cxBxb1", "cxBxs1", "cxBxs1", "xxDxs1", "xxFxw1", "xxFxw1", "cxExw1", "cxDxg1", "bxaxh1", "bxbxw1", "bxcxw1", "bxexg1", "xxexw1", "xxfxw1", "xxgxw1", "xxgxb1", "xxhxb1"],
         ["xxhxb1", "xxixs1", "xxhxs1", "sxhxb1", "sxhxb1", "bxlxw1", "bxmxw1", "xxnxw1", "xxoxw1", "xxoxg1", "xxoxw1", "xxmxb1", "xxmxw1", "xxkxb1", "xxkxw1", "xxjxw1", "xxixs1", "xxjxb1", "xxjxs1", "sxixb1", "sxixs1", "bxixw2", "sxixb2", "sxixb2"],
         ["sxhxb2", "cxhxb2", "sxhxb2", "sxhxb2", "cxhxb2", "cxhxw2", "sxhxb2", "cxhxb2", "cxixb2", "sxhxb2", "sxgxb2", "sxfxb2", "sxdxb2", "sxdxb2", "sxdxb2", "sxcxs2", "bxcxw2", "bxcxw2", "sxcxb2", "sxcxb3", "bxbxw3", "sxbxb3", "sxaxb3", "bxaxw3"],
         ["sxaxs3", "cxaxs3", "cx0xs3", "cxAxs3", "sx0xb3", "sx0xs3", "sx0xs3", "sx0xs3", "sx0xs3", "sxAxs3", "sxAxx3", "sxAxs3", "sxBxs3", "sxCxs3", "sxCxs3", "sxCxs3", "sxCxs4", "sx0xb4", "bxcxg4", "bxexh4", "bxexg4", "bxfxg4", "bxgxh4", "bxhxg4"],
         ["bxhxg4", "bxixg4", "bxjxw4", "bxkxw5", "sxlxb5", "sxlxs5", "sxmxs5", "sxlxx5", "sxkxs5", "sxjxs5", "cxixs5", "cxgxw5", "sxgxb5", "bxgxw5", "sxfxb5", "sxgxb5", "xxgxb5", "xxgxb5", "xxgxs5", "cxgxs5", "cxfxs5", "cxfxb5", "cxfxb5", "cxgxb5"],
         ["cxgxs5", "cxgxs5", "cxgxb5", "sxgxs5", "sxgxs5", "sxgxs5", "sxgxs5", "sxgxs5", "sxgxs5", "sxgxb5", "cxfxs5", "cxexs5", "cxdxs5", "xxcxs5", "xxcxb5", "xxcxs5", "cxcxs5", "cxdxb5", "sxdxs5", "xxexs5", "xxfxs5", "xxgxs5", "xxgxs5", "xxhxx5"],
         ["xxixx5", "cxixs5", "cxixx5", "cxixx5", "cxhxs5", "cxgxs5", "sxgxs5", "sxfxs5", "sxfxs5", "sxfxs5", "sxexs5", "bxfxw5", "bxfxw5", "sxfxb5", "bxexw5", "bxdxw5", "bxdxg5", "bxexw5", "sxfxb5", "xxfxs5", "xxfxs5", "xxgxs5", "xxhxs5", "xxhxs5"],
         ["xxixs5", "xxixs5", "xxjxs5", "xxkxx5", "xxkxx5", "xxmxx5", "sxkxx5", "sxixx5", "sxixx5", "sxhxx5", "sxgxs5", "sxfxb5", "sxexs5", "cxexs5", "sxfxb5", "bxfxw5", "cxfxs5", "cxfxb5", "cxgxs5", "xxgxs5", "xxgxs5", "xxgxs5", "xxgxs5", "xxhxs5"],
         ["xxgxs5", "xxgxs5", "xxhxs5", "xxhxs5", "xxhxs5", "xxgxs5", "xxgxs5", "cxgxs5", "cxgxs5", "sxfxs5", "sxfxs5", "sxexs5", "sxexs5", "sxdxs5", "sxdxs5", "sxdxs5", "sxdxs5", "sxdxs5", "sxdxs5", "sxdxs5", "sxdxs5", "sxdxs5", "sxdxs5", "sxdxb5"],
         ["sxdxs5", "cxdxs5", "xfdxs5", "xfexs5", "xfexs5", "xfexs5", "xfexs5", "xfexs5", "xfexs5", "sxdxs5", "sxdxs5", "sxcxs5", "sxcxs5", "sxcxb5", "sxcxs5", "sxcxs5", "sxcxb5", "sxcxs5", "sxdxs5", "cxdxs5", "cxdxs5", "cxdxs5", "cxdxs5", "cxexs5"],
         ["cxexs5", "cxfxs5", "cxfxs5", "cxfxs5", "cxexs5", "cxdxs5", "cxdxs5", "cxdxb5", "cxdxs5", "cxdxb5", "cxdxb5", "cxdxs5", "xxdxs5", "xfcxb5", "sfbxs5", "sfaxs5", "cxaxx5", "xfaxs5", "sxaxs5", "cxaxs5", "cxaxs5", "cxaxb5", "cxbxb5", "cxbxs5"],
         ["cxaxb5", "cxaxb5", "cxaxb5", "cxcxs5", "xxdxs5", "xxexs5", "xxexs5", "xxexs5", "xxexs5", "sxdxs5", "xxcxs5", "xxcxw5", "xxcxb5", "cxcxw5", "cxcxb5", "cxcxb5", "cxdxb5", "cxdxs5", "cxexs5", "xxfxs5", "xxgxs5", "xxgxs5", "xxhxs5", "xxgxs5"],
         ["xxhxs5", "xxixs5", "xxjxx5", "xxmxx5", "xxmxx5", "xxmxx5", "xxmxx5", "xxnxx5", "xxmxx5", "xxjxx5", "cxgxs5", "cxexs5", "sxdxs5", "cxcxb5", "cxcxs5", "cxcxs5", "cxcxb5", "cxcxs5", "cxcxs5", "cxbxs5", "cxbxs5", "cxbxs5", "cxaxs5", "cxbxx5"],
         ["cxcxx5", "cxcxs5", "cxcxx5", "cxcxx5", "cxaxs5", "cx0xs5", "cx0xs5", "xx0xs5", "xf0xs5", "xfAxs5", "xxCxb5", "xxDxs5", "xxFxs5", "xxGxw5", "xxGxb5", "xxGxb5", "xxGxw5", "xxGxs5", "xxFxs5", "xxFxb5", "xxExb5", "xxExb5", "xxExs5", "xxExx5"],
         ["xxDxs5", "cxExs5", "xfExs5", "xfExs5", "xfExs5", "xfExs5", "xfFxs5", "xfFxb5", "xfFxb5", "xfGxw5", "cxHxw5", "cxIxw5", "cxIxs5", "cxIxs5", "cxJxb5", "cxJxb5", "cxJxb5", "cxJxb5", "cxIxs5", "cxHxs5", "cxHxs4", "cxGxs4", "cxGxs4", "cxFxb4"],
         ["cxFxb4", "cxExs4", "cxDxs4", "cxDxs4", "cxCxs4", "cxCxb4", "cxCxs4", "cxCxb4", "cxCxw3", "bx0xg4", "cx0xg4", "cxaxw4", "cxaxh4", "xxaxh4", "xxaxg4", "xxbxh4", "xxbxw4", "xxaxw4", "xxbxs4", "xxcxs4", "xxdxs4", "xxdxs4", "xxexs4", "xxexs4"],
         ["xxexs4", "xxexs4", "xxexs4", "xxfxx4", "xxgxx4", "xxgxx4", "xxhxx4", "xxixx4", "xxhxx4", "xxdxs4", "cx0xb4", "cx0xw4", "cx0xw4", "cx0xw4", "cx0xb4", "cx0xw4", "cx0xw4", "cx0xb4", "cx0xb4", "cx0xs4", "cx0xb4", "cx0xs4", "cx0xs4", "cx0xs4"],
         ["cx0xs4", "sx0xs4", "sx0xs4", "sx0xs4", "cx0xs4", "sx0xs4", "sxAxs4", "sxAxs4", "sxBxs4", "sxBxs4", "cxDxb4", "cxDxw4", "cxDxb4", "cxDxs4", "cxDxs4", "cxExb4", "xxExb3", "xxCxw3", "xxCxb3", "xxBxw3", "xxBxs3", "xxBxs3", "cxBxs3", "cxAxb3"],
         ["cxAxs3", "cxAxs3", "cxAxs3", "cxAxs3", "cxAxs3", "cxAxs3", "cxaxs3", "cxaxs3", "cx0xx3", "cxCxs3", "cxDxs3", "cxFxs3", "cxFxs3", "wfExs3", "wfDxs3", "wfDxx3", "wfDxs3", "xfDxs3", "wfDxs2", "wfDxx2", "wfDxx2", "wfDxx2", "wfDxs2", "wfExs2"],
         ["wfExx2", "wfFxx2", "xfFxx2", "xfFxs2", "xfFxx2", "xfFxs1", "xfFxs1", "wfFxx1", "wfFxx1", "wfFxx1", "wfGxx1", "wfHxx1", "wfIxs1", "wfMxsw", "wfMxsw", "wxOxbw", "cxQxbx", "cxQxbx", "cxQxsx", "cxQxsx", "cxPxsx", "cxOxsx", "cxOxsx", "cxPxsx"],
         ["cxQxwx", "cxPxsx", "cxPxsx", "cxOxsx", "cxOxxx", "cxKxxx", "wxMxxw", "wxExgw", "wxDxgw", "wxDxww", "wxCxww", "wxDxww", "wxDxww", "wxCxww", "wxCxgw", "wxDxww", "cxCxwx", "cxBxbx", "cxBxbx", "xxAxsf", "xxAxsf", "xxAxsf", "xx0xsf", "xx0xbf"],
         ["xxaxbf", "xxaxwf", "xxaxbf", "xxaxsf", "cxaxsf", "cxaxsf", "cxaxsf", "cxaxsf", "cxaxsf", "cx0xsf", "cxAxbf", "cxAxsf", "cxAxsf", "cxBxsx", "cxBxsx", "cxCxsx", "cxCxbx", "cxCxsx", "cxBxsx", "xxAxsf", "xxAxsf", "xx0xsf", "cx0xsf", "cx0xbf"],
         ["cx0xsf", "cx0xsf", "cxaxbf", "cxaxsf", "cxaxbf", "cxaxwf", "cxaxsf", "cxAxbf", "cxAxwf", "wfBxbw", "wfCxww", "wfCxbw", "wfDxsw", "wfDxsw", "wfExsw", "wfExsw", "wfFxxw", "wfFxsw", "xfFxsx", "cxGxsx", "cxHxsx", "cxGxsx", "cxGxsx", "cxGxsx"],
         ["cxGxbx", "cxGxsx", "wxFxww", "wxExsw", "cxExsx", "cxExsx", "cxDxsx", "cxCxsx", "cxBxbx", "cxBxbx", "cxCxbx", "cxCxbx", "cxDxsx", "cxExsx", "cxExsx", "cxFxsx", "xxFxsx", "xxFxsx", "xxExsx", "xxCxsx", "xxCxsx", "xxCxsx", "cxBxbx", "cxCxbx"],
         ["cxCxgx", "wxCxgw", "wxBxgw", "wxBxgw", "wxBxhw", "wxCxgw", "wfCxgw", "wfDxgw", "wfDxsw", "wfFxsw", "cxGxsx", "cxLxbx", "cxMxwx", "xxMxgx", "xxMxgx", "xxLxwx", "xxLxwx", "xxJxgx", "xxIxwx", "xxHxbx", "xxGxbx", "xxFxbx", "xxFxbx", "xxExbx"],
         ["xxExsx", "xxExsx", "xxDxsx", "xxDxsx", "xxCxxx", "xxBxxx", "xxAxxf", "xxBxsx", "xxCxsx", "xxExbx", "cxExbx", "cxGxbx", "cxGxbx", "xxHxwx", "xxHxsx", "xxIxbx", "xxIxsx", "xxHxbx", "xxGxsx", "xxFxsx", "xxExsx", "xxDxxx", "xxCxxx", "xxCxsx"],
         ["xxCxsx", "xx0xxf", "xxaxxf", "xx0xxf", "xxBxsx", "xx0xxf", "xx0xxf", "xx0xxf", "xxCxsx", "xxFxsx", "xxHxsx", "xxKxbx", "xxMxbx", "xxNxwx", "xxOxgx", "xxOxgx", "xxOxwx", "xxNxwx", "xxLxbx", "cxKxwx", "cxKxbx", "cxJxsx", "cxJxsx", "cxJxsx"],
         ["cxIxsx", "cxIxsx", "cxIxsx", "cxFxsx", "cxGxsx", "cxFxxx", "cxDxxx", "cxFxsx", "cxFxsx", "cxIxsx", "cxIxsx", "cxKxsx", "cxLxsx", "xxNxbx", "xxPxbx", "xxQxwx", "cxQxbx", "cxOxwx", "cxKxwx", "xxGxwx", "xxDxwx", "xxDxwx", "cxDxwx", "cxDxsx"],
         ["cxIxsx", "cxIxsx", "cxIxsx", "cxFxsx", "cxGxsx", "cxFxxx", "cxDxxx", "cxFxsx", "cxFxsx", "cxIxsx", "cxIxsx", "cxKxsx", "cxLxsx", "xxNxbx", "xxPxbx", "xxQxwx", "cxQxbx", "cxOxwx", "cxKxwx", "xxGxwx", "xxDxwx", "xxDxwx", "cxDxwx", "cxDxsx"]],
        ["a",
         ["cxCxwx", "cxCxbx", "cxBxbx", "cxBxbx", "cxBxsx", "cxAxxx", "cxaxsf", "cxAxsx", "cxBxsx", "cxBxsx", "cxCxwx", "cxDxsx", "cxDxbx", "cxExwx", "cxExbx", "cxDxbx", "cxCxbx", "cxCxsx", "cxCxsx", "cxDxsx", "cxExbx", "cxDxbx", "cxDxwx", "bxCxgx"],
         ["bxBxwx", "bxAxgx", "bxAxwx", "bx0xgf", "cxAxwx", "cxAxgx", "cxAxgx", "cx0xwf", "cxAxwx", "cxAxhx", "cxAxgx", "cxBxgx", "cxCxhx", "cxCxhx", "cxCxhx", "cxCxgx", "cxBxgx", "cxBxwx", "cxAxgx", "xxAxwx", "xx0xwf", "xx0xbf", "xx0xwf", "xxaxbf"],
         ["xxaxbf", "xxaxbf", "xxbxbf", "xxbxwf", "xxbxsf", "xxbxbf", "xxcxwf", "xxcxbf", "xxbxwf", "xx0xgf", "xx0xgf", "xxBxgx", "xxBxgx", "xxCxgx", "xxDxgx", "xxDxgx", "xxDxgx", "xxCxwx", "xxAxgx", "xx0xwf", "xxaxwf", "xxaxwf", "xxaxwf", "xx0xgf"],
         ["xxaxgf", "xxaxwf", "xxbxbf", "xxbxsf", "xxcxgf", "xxcxwf", "xxdxwf", "xxdxwf", "xxcxwf", "xxbxgf", "xxaxgf", "xx0xwf", "xxAxgx", "xxAxgx", "xxBxgx", "xxBxgx", "xxAxgx", "xx0xgf", "xxaxgf", "xxbxwf", "xxbxwf", "xxbxbf", "xxbxwf", "xxbxwf"],
         ["xxcxwf", "xxdxgf", "xxdxgf", "xxdxgf", "xxexbf", "xxexbf", "xxfxbf", "xxfxbf", "xxexsf", "xxcxwf", "xxbxwf", "xxaxsf", "xx0xsf", "cxBxsx", "cxBxsx", "cxBxbx", "cxBxsx", "cxBxsx", "cxAxbx", "xx0xsf", "xxaxsf", "xxaxsf", "xxbxxf", "xxbxxf"],
         ["xxbxxf", "cxbxxf", "cxbxxf", "cxaxsf", "cxaxsf", "sxaxsf", "sxaxsf", "cxaxsf", "sxaxbf", "bx0xwf", "sx0xbf", "bx0xwf", "bx0xwf", "cx0xwf", "cx0xwf", "cxAxgx", "bxAxwx", "bxAxwx", "sxAxsx", "sxAxbx", "sxBxsx", "sxBxbx", "cxBxsx", "cxBxsx"],
         ["cxAxsx", "xx0xsf", "xx0xsf", "xxAxsx", "cxAxsx", "cxAxsx", "cxAxsx", "xfAxsx", "xfAxsx", "xfBxbx", "cxCxbx", "cxCxbx", "cxDxbx", "cxCxsx", "cxCxbx", "sxCxsx", "sxCxbx", "wxCxsw", "wxCxsw", "xfBxsx", "sfBxbx", "xfBxsx", "xfBxsx", "xfBxsx"],
         ["xfAxbx", "cx0xsf", "cx0xbf", "cxaxbf", "cxaxbf", "cxaxbf", "cxbxsf", "cxbxsf", "cxbxsf", "cxbxsf", "cxbxsf", "cxaxsf", "cxaxsf", "cx0xsf", "cx0xsf", "cx0xsf", "cx0xsf", "cx0xsf", "cx0xsf", "cxaxsf", "cxaxxf", "cxaxsf", "cxaxsf", "cxbxsf"],
         ["sxaxbf", "bxaxwf", "sxaxbf", "sxaxsf", "cxaxsf", "sxaxsf", "sx0xsf", "sx0xsf", "sx0xsf", "sxAxsx", "cxAxbx", "cxBxgx", "bxBxwx", "bxBxwx", "sxCxbx", "bxAxwx", "bxBxw1", "sxAxb1", "sx0xb1", "cx0xw1", "sxaxs1", "sxaxs1", "xxaxb1", "xxaxs1"],
         ["xxbxs1", "xxbxs1", "xxbxs1", "xxbxs1", "cxbxs1", "cxbxs1", "cxbxs1", "cxbxs1", "cxbxs1", "cxaxb1", "cx0xw1", "cx0xw1", "cxAxw1", "cx0xw1", "cxBxw1", "cxAxw1", "cxAxb1", "cxAxw1", "cx0xw1", "cxaxw1", "cxbxb1", "cxbxs1", "xxcxs1", "xxcxs1"],
         ["xxcxs1", "cxcxs1", "cxbxs1", "sxbxs1", "cxbxs1", "cxdxs1", "cxdxs1", "xxdxs1", "xxcxs1", "xxbxw1", "cxaxb1", "cx0xw1", "cxAxb1", "cxBxb1", "cxBxs1", "cxBxw1", "xxBxwx", "xxBxwx", "xx0xbf", "xxaxsf", "xxbxsf", "xxbxsf", "xxcxsf", "xxcxsf"],
         ["xxcxsf", "xxdxbf", "xxdxsf", "xxcxsf", "cxbxbf", "cxbxbf", "cxbxsf", "cxbxbf", "sxbxsf", "sxaxs1", "cxaxs1", "cxaxs1", "sx0xx1", "sx0xx1", "sx0xx1", "sx0xs1", "cxaxs1", "sxaxx1", "sxbxx1", "sxbxx1", "sxbxx1", "sxbxs1", "cxbxs1", "sxbxs1"],
         ["sxbxs1", "sxbxs1", "sxbxs1", "sxbxs1", "sxbxs1", "sxbxs1", "sxbxs1", "sxcxs1", "sxbxs1", "bxaxw2", "cx0xb2", "cx0xb2", "cxAxb2", "cxBxb2", "cxBxw1", "cxBxg1", "cxAxw1", "cxAxg1", "cx0xw1", "bxaxw2", "bxaxw2", "sxaxb2", "bx0xg2", "sxaxb2"],
         ["sxaxb2", "sxaxb2", "sxaxs2", "bxaxw2", "cxaxw2", "bxbxw2", "bxbxg2", "bxbxg2", "bxbxg2", "bxbxw3", "bxaxg3", "bxaxg3", "bx0xh3", "cx0xg3", "cx0xg3", "cx0xh3", "cxAxw3", "cxAxw3", "cx0xw3", "cxaxw3", "cxbxb3", "cxbxs3", "cxbxs3", "cxcxs3"],
         ["cxcxs3", "xxdxs3", "xxcxx3", "xxdxs3", "xxdxx3", "xxdxx3", "xxdxx3", "xxdxs3", "xxaxs3", "xx0xb3", "cxBxw3", "cxCxs3", "cxDxb3", "xxDxb3", "xxDxw2", "xxDxw2", "cxDxw2", "cxBxb2", "cx0xg2", "xxaxw2", "xxaxw2", "xxaxb2", "sxaxb2", "sxbxb2"],
         ["sxbxs2", "sxbxb2", "bxcxw2", "bxexw3", "bxexw3", "bxfxg3", "bxgxg3", "bxgxw3", "bxgxg3", "bxgxh3", "bxexg3", "bxdxg3", "bxdxw3", "bxcxw4", "sxcxb4", "bxaxw4", "xx0xw4", "xx0xw4", "xxaxw4", "xxbxs4", "xxcxb4", "xxcxb4", "xxdxs4", "xxdxs4"],
         ["xxdxs4", "xxdxs4", "xxexs4", "xxexs4", "xxexs4", "xxexs4", "xxcxs4", "xxcxs4", "xxaxs4", "xxAxg4", "xxBxw4", "xxCxh4", "xxCxw4", "xxDxg3", "xxCxw3", "xxCxg3", "xxCxw3", "xxAxg3", "xxaxg3", "xxbxg3", "xxcxw3", "xxdxb3", "xxdxs3", "xxdxs3"],
         ["xxdxs3", "cxdxs3", "cxdxs3", "cxdxx3", "cxdxx3", "cxcxs3", "cxcxs3", "cxcxs3", "cxaxs3", "cxAxs3", "xxCxs3", "xxDxs3", "xxFxs3", "cxGxs3", "cxHxs3", "cxFxs3", "cxFxs2", "cxExs2", "cxDxs2", "xxCxs2", "xxBxb2", "xx0xw2", "xx0xb2", "xx0xb2"],
         ["xxaxb2", "xxbxs2", "xxcxb2", "xxdxs2", "xxfxb2", "xxgxs2", "xxgxs2", "xxhxs2", "xxfxs2", "xxexs2", "xxdxs2", "xxbxx2", "xxaxx2", "xxaxs2", "xxAxx2", "xxAxb2", "xxAxs2", "xxAxb2", "xx0xb2", "xxaxs2", "xxbxs2", "xxcxs2", "xxdxs2", "xxexs2"],
         ["xxfxs2", "xxexs2", "xxfxs2", "xxfxs2", "xxfxs2", "xxexs2", "xxexb2", "xxexs2", "xxdxb2", "xxbxb2", "xxaxb2", "xxAxw2", "xxBxw2", "xxCxb2", "xxCxs2", "xxDxb2", "cxCxs2", "cxBxs2", "cxAxs2", "xx0xs2", "xxaxs2", "xxbxs2", "xxbxs2", "xxcxs2"],
         ["xxbxs2", "xxbxs2", "xxcxb2", "xxcxw2", "xxcxw2", "xxdxs2", "xxexs2", "cxexb2", "cxdxb2", "cxaxb2", "cx0xb2", "cxBxb2", "cxCxw1", "cxDxw1", "cxExg1", "cxExw1", "cxFxw1", "cxExw1", "cxCxw1", "cxCxw1", "cx0xw1", "cx0xb1", "xxaxb1", "xxaxw1"],
         ["xxaxb1", "xxaxb1", "xxbxb1", "xxcxb1", "xxcxb1", "xxcxb1", "xxdxb1", "cxdxb1", "cxcxw1", "cxaxw1", "cxAxw1", "cxBxg1", "cxBxw1", "cxDxw1", "cxDxbx", "cxCxgx", "cxCxwx", "cxBxwx", "cxAxwx", "xx0xsf", "xxaxwf", "xxaxbf", "xxaxbf", "xxbxsf"],
         ["xxbxbf", "xxbxbf", "xxbxwf", "xxbxbf", "xxcxsf", "xxcxsf", "xxdxsf", "xxcxbf", "xxbxwf", "xx0xwf", "cxAxgx", "cxBxgx", "cxCxwx", "xxCxgx", "xxDxgx", "xxDxwx", "xxDxgx", "xxCxwx", "xxAxwx", "xx0xbf", "xxaxwf", "xxaxwf", "xxaxsf", "xxaxsf"],
         ["xxbxsf", "xxbxsf", "xxcxwf", "xxcxbf", "xxdxwf", "xxdxwf", "xxexbf", "xxexgf", "xxdxwf", "xxcxgf", "xxbxwf", "xxaxbf", "xxAxwx", "xxAxwx", "xxAxwx", "xxBxwx", "xxBxgx", "xxAxwx", "xx0xwf", "xxaxwf", "xxbxwf", "xxcxbf", "xxcxwf", "xxdxsf"],
         ["xxexbf", "xxexsf", "xxfxsf", "xxgxbf", "xxgxbf", "xxgxwf", "xxgxbf", "xxgxsf", "xxdxbf", "xxbxsf", "xx0xsf", "xxBxwx", "xxCxsx", "xxCxbx", "xxDxsx", "xxExbx", "xxExbx", "xxDxsx", "xxCxsx", "xxAxsx", "xxAxsx", "xx0xsf", "xxaxxf", "xxbxsf"],
         ["xxcxxf", "xxcxsf", "xxaxsf", "xxaxsf", "xxaxsf", "xxbxsf", "xxbxsf", "xxaxsf", "xxaxsf", "xxCxsx", "xxExbx", "xxGxbx", "xxGxwx", "xxHxwx", "xxIxgx", "xxHxwx", "xxHxgx", "xxGxwx", "xxFxwx", "xxExwx", "xxExwx", "xxExwx", "cxExwx", "cxExwx"],
         ["cxDxsx", "cxDxsx", "cxExsx", "cxExsx", "cxDxsx", "cxDxsx", "cxDxbx", "cxDxwx", "cxExwx", "wxExbw", "wxDxbw", "wxDxww", "wxCxbw", "wxCxww", "wfCxbw", "wfCxsw", "wfDxsw", "wfDxsw", "wfDxsw", "wfExsw", "xfExxx", "xfFxxx", "xfFxsx", "xfExsx"],
         ["xfExsx", "xfExsx", "xfExwx", "xfDxwx", "cxCxsx", "cxCxwx", "cxCxbx", "cxCxsx", "cxCxbx", "cxDxsx", "cxExsx", "cxFxsx", "cxGxxx", "cxHxsx", "cxHxxx", "cxIxsx", "cxIxsx", "cxGxsx", "cxGxsx", "cxExsx", "cxDxsx", "cxDxxx", "xxBxxx", "xxBxxx"],
         ["xxAxxx", "xxAxsx", "xxAxxx", "xf0xxf", "xfAxxx", "xfCxxx", "xfCxxx", "xfCxsx", "xfDxxx", "xfExsx", "xfExsx", "wfFxsw", "wfFxsw", "wfGxsw", "wfGxsw", "wfGxbw", "wxFxbw", "wxFxsw", "wxFxbw", "wxFxww", "wxExbw", "wxExbw", "wxExbw", "wxExww"],
         ["wxDxww", "wxDxbw", "wxDxbw", "wxDxgw", "cxDxwx", "cxBxhx", "cxBxwx", "cxBxwx", "cxBxbx", "cxCxwx", "cxDxhx", "cxDxwx", "cxDxwx", "cxExwx", "cxExwx", "cxDxwx", "cxDxwx", "cxDxbx", "cxCxbx", "cxBxsx", "cxBxsx", "cxAxsx", "cx0xxf", "cx0xsf"],
         ["cxaxxf", "cxaxsf", "cxaxxf", "cxbxxf", "cxAxsx", "cx0xsf", "cx0xsf", "xx0xsf", "xxCxbx", "xxExwx", "xxGxbx", "xxHxwx", "xxHxwx", "cxHxgx", "cxHxgx", "cxHxwx", "cxHxhx", "wxFxgw", "wxFxww", "wxFxww", "wxGxww", "pxHxsw", "cxHxwx", "cxExwx"]],
        ["C",
         ["cxbxhx", "cxdxgf", "cxexgf", "cxexgf", "cxexbf", "cxfxwf", "cxgxbf", "xxfxsf", "xxexbf", "xxexbf", "cxcxbx", "cxcxbx", "cxbxwx", "cxbxsx", "cxaxwx", "cxbxbx", "cxaxbx", "cxbxwx", "cxcxwx", "cxdxsf", "cxdxsf", "cxdxxf", "cxdxxf", "cxdxxf"],
         ["cxexxf", "xxfxxf", "xxgxxf", "xxfxxf", "cxfxxf", "cxgxxf", "cxgxxf", "xxfxsf", "xxdxxf", "xxcxsx", "xxbxsx", "xx0xsx", "xxAxsx", "xxBxwx", "xxCxbx", "xxCxsx", "cxDxbx", "cxCxbx", "cxBxsx", "cxAxsx", "cxAxsx", "cx0xsx", "cx0xxx", "cxaxsx"],
         ["cxbxsx", "cxbxxx", "cxbxxx", "cxbxsx", "cxcxsx", "cxbxsx", "cxbxsx", "cxbxsx", "cxaxsx", "cxaxwx", "cx0xbx", "cxAxwx", "cxAxwx", "cxAxwx", "cxAxgx", "cx0xgx", "wxaxbw", "wfaxbw", "wfaxww", "wfaxww", "wfaxww", "wxaxww", "wfaxbw", "wfaxsw"],
         ["wfaxbw", "wxaxbw", "wfaxbw", "wf0xsw", "wf0xsw", "wf0xsw", "wfAxsw", "cxAxwx", "cx0xgx", "cx0xgx", "cxAxvx", "cxAxhx", "cxaxvx", "cxbxvx", "cxdxvf", "bxexvf", "bxexgf", "bxexwf", "bxfxgf", "cxgxhf", "cxgxwf", "bxgxwf", "bxgxwf", "bxgxwf"],
         ["sxgxbf", "cxgxsf", "cxgxbf", "cxhxsf", "xxhxsf", "sxixbf", "sxjxsf", "xxjxsf", "xxhxsf", "xxgxsf", "cxfxwf", "cxdxbf", "cxdxwf", "cxcxwx", "bxdxwf", "bxcxw1", "xxcxs1", "xxcxb1", "xxcxb1", "xxdxs1", "xxdxs1", "xxdxx1", "cxdxs1", "cxexs1"],
         ["cxexx1", "xxexs1", "xxfxx1", "xxexs1", "cxfxx1", "cxfxx1", "cxexx1", "cxdxs1", "sxcxs1", "sxcxs1", "sxcxs1", "sxcxs1", "sxdxs1", "sxcxs1", "sxcxs1", "sxbxs1", "bxAxg1", "bx0xw1", "bxbxw1", "xxbxw1", "xxdxb1", "xxdxb1", "cxexw1", "cxfxw1"],
         ["cxfxb1", "xxgxw1", "xxgxg1", "xxgxw1", "xxhxb1", "xxhxs1", "xxixs1", "cxhxb1", "sxgxb1", "sxfxb1", "cxexb1", "cxdxb1", "cxdxs1", "cxdxb1", "cxdxs1", "cxdxb1", "cxdxb1", "cxdxb1", "cxexw1", "cxexb1", "cxfxs1", "cxfxs1", "cxfxs1", "cxfxs1"],
         ["cxfxs1", "cxfxs1", "cxfxs1", "cxfxs1", "xxgxs1", "xxgxw1", "xxhxs1", "xxgxs1", "xxfxw1", "xxfxw1", "cxexw1", "bxexw1", "bxdxw1", "cxdxb1", "cxcxw1", "cxcxw1", "xxcxg1", "xxcxb1", "xxdxw1", "xxexb1", "xxfxb1", "xxgxs1", "xxgxs1", "xxhxs1"],
         ["xxhxs1", "cxhxs1", "cxhxs1", "cxhxx1", "cxhxx1", "cxhxx1", "cxhxs1", "cxgxs1", "cxgxs1", "cxdxx1", "cxcxs1", "cxaxs1", "cxaxs1", "cx0xs1", "cx0xb1", "cx0xs1", "cx0xs1", "cx0xs1", "cxaxs1", "cxbxs1", "cxcxx1", "cxcxs1", "cxdxs1", "cxdxs1"],
         ["cxdxs1", "cxdxs1", "cxdxx1", "sxdxs1", "cxexs1", "cxexx1", "cxexx1", "xxdxs1", "xxbxs1", "xxaxs1", "xx0xs1", "xxAxsx", "xxAxsx", "cxAxbx", "cxAxwx", "cx0xbx", "cxAxbx", "cxAxsx", "cxAxsx", "xxaxsx", "xxaxxx", "xxcxxx", "xxcxxx", "xxbxsx"],
         ["xxcxsx", "cxcxsx", "cxdxsf", "cxdxsf", "cxcxsx", "cxcxsx", "cxbxsx", "xxbxsx", "xx0xsx", "xxAxbx", "cxBxwx", "sxAxbx", "sxAxsx", "cxBxbx", "wxAxbw", "wxAxsw", "wx0xbw", "wx0xsw", "wxAxsw", "xxAxsx", "xxaxsx", "xxaxxx", "xxbxsx", "xxbxxx"],
         ["xxexxf", "xffxxf", "xffxxf", "xffxxf", "xfgxsf", "xffxxf", "xfexxf", "pfcxsw", "wfbxsw", "wfbxbw", "wfaxbw", "wfaxww", "wf0xsw", "wf0xbw", "wfAxbw", "xfCxsx", "cxExxx", "cxHxsx", "cxHxsx", "xxFxsx", "xxGxsx", "xxCxgx", "cxAxgx", "cxAxbx"],
         ["cx0xwx", "cx0xgx", "cxaxwx", "cxbxsx", "cxbxbx", "cxbxsx", "cxbxsx", "cxaxsx", "cxaxsx", "cx0xsx", "cxAxsx", "wxAxsw", "wxAxbw", "wxAxsw", "wxBxsw", "wxBxsw", "wxBxsw", "wxAxsw", "wxAxsw", "wfAxsw", "wfAxsw", "wf0xsw", "cx0xsx", "wf0xsw"],
         ["wf0xsw", "wf0xbw", "wf0xbw", "wf0xgw", "cxaxbx", "wxaxww", "wxaxww", "cxbxwx", "pxbxww", "bxcxgx", "bxdxwf", "bxdxwf", "sxexbf", "bfexgf", "sxfxbf", "bxgxgf", "bxhxgf", "bxhxwf", "bxhxwf", "sxhxbf", "bxhxg1", "bxhxw1", "cxhxw1", "cxgxw1"],
         ["cxhxw1", "cxgxw1", "cxgxb1", "cxgxw1", "cxgxw1", "cxgxw1", "bxgxw1", "sxgxb1", "bxgxw1", "bxfxw1", "bxfxg1", "bxexw1", "bxexh1", "bxexg1", "pxexg1", "pxdxg1", "pxdxg1", "pxdxh1", "wxdxh1", "pxdxg1", "pfdxg1", "pfcxg1", "pfcxg1", "wfcxg1"],
         ["wfcxg1", "wfcxh1", "wfcxh1", "wfcxg1", "wfbxg1", "wfbxg1", "wxbxg1", "wfbxg1", "wfbxw1", "wxbxw1", "wxaxw1", "wxaxw1", "wfaxs1", "wxaxs1", "sxaxx1", "sxaxs1", "sxaxb1", "wxaxs1", "wfbxs1", "wxbxs1", "sfbxs1", "sfbxs1", "sfbxs1", "sxbxs1"],
         ["sxbxs1", "cxbxs1", "cxcxs1", "cxcxb1", "cxdxs1", "cxdxs1", "cxdxs1", "sxdxb1", "sxdxb1", "sxcxb1", "cxcxb1", "sxdxb1", "sxdxb1", "sxdxb1", "sxcxb1", "bxcxw1", "sxbxb1", "sxbxb1", "sxbxb2", "cxbxw1", "sxbxb2", "sxbxb2", "sxbxb2", "sxcxs2"],
         ["sxcxs2", "cxbxs2", "cxbxs2", "cxbxs2", "cxbxs1", "cxbxs1", "cxbxs1", "cxaxs1", "cxaxs1", "cx0xb1", "sx0xs1", "sx0xb1", "sxAxb1", "cxAxb1", "cxAxs1", "cxAxs1", "cx0xs1", "cx0xs1", "cxaxb1", "cxbxb1", "cxbxs1", "cxbxs1", "cxbxsx", "cxbxsx"],
         ["cxbxsx", "cxbxwx", "cxcxsx", "cxcxsx", "cxcxsx", "cxcxsx", "cxcxbx", "cxcxwx", "cxcxgx", "cxbxgx", "bxbxwx", "bxbxwx", "bxbxw1", "cxaxgx", "cx0xwx", "cxaxhx", "cxaxgx", "cxaxgx", "cxaxgx", "cxbxwx", "cxbxbx", "cxbxsx", "cxbxbx", "cxcxgx"],
         ["cxdxbf", "xxdxsf", "xxdxsf", "xxexsf", "xxexbf", "xxexbf", "xxdxwf", "xxdxwf", "xxdxwf", "xxbxwx", "xxaxwx", "xx0xbx", "xx0xbx", "xxBxsx", "xxBxsx", "xxCxbx", "xxCxwx", "xxBxwx", "xxAxwx", "xx0xbx", "xxaxsx", "xxaxsx", "xxbxsx", "xxbxsx"],
         ["xxbxxx", "xxcxsx", "xxcxsx", "xxcxxx", "xxdxxf", "xxexxf", "xxexxf", "cx0xsx", "cxDxsx", "cxExsx", "xxFxsx", "xxGxsx", "xxHxbx", "xxHxsx", "xxJxsx", "xxJxbx", "xxJxbx", "xxJxbx", "xxIxbx", "xxGxsx", "xxFxsx", "xxDxsx", "xxCxxx", "xxBxsx"],
         ["xx0xxx", "xxaxxx", "xxaxxx", "xxbxxx", "xxbxxx", "xxcxxx", "xxcxxx", "xxBxxx", "xxExsx", "xxHxxx", "xxIxxx", "xxJxxx", "xxKxsx", "xxLxsx", "xxLxsx", "xxMxsx", "xxMxbx", "xxMxsx", "xxLxsx", "xxJxsx", "xxIxxx", "xxFxxx", "xxDxsx", "xxBxsx"],
         ["xxAxxx", "xxAxxx", "xx0xxx", "xxbxsx", "xxbxsx", "xxbxsx", "xx0xsx", "xxDxxx", "xxHxsx", "xxJxbx", "xxKxwx", "xxLxbx", "xxMxwx", "xxMxwx", "xxMxwx", "xxNxbx", "xxNxbx", "xxNxbx", "xxMxsx", "cxKxsx", "cxJxxx", "cxIxsx", "cxGxsx", "cxHxxx"],
         ["cxFxxx", "cxExsx", "cxDxxx", "cxDxxx", "cxDxxx", "cxCxxx", "cxCxsx", "cxExxx", "cxHxxx", "cxKxsx", "cxKxwx", "cxLxsx", "cxMxsx", "cxMxwx", "cxMxbx", "cxMxsx", "cxMxbx", "cxJxbx", "wxHxsw", "wxGxxw", "wxGxsw", "wxFxxw", "wfFxxw", "wfFxsw"],
         ["wfFxsw", "wfFxsw", "wfFxbw", "wfExsw", "wfExsw", "wfFxsw", "wfFxww", "wfExbw", "wfExsw", "wfExbw", "wfExsw", "wfExsw", "wfFxsw", "wfFxsw", "wfGxsw", "wfGxsw", "wfGxsw", "wfExww", "wfDxbw", "wxBxww", "wxAxgw", "wxAxww", "cxAxgx", "cx0xwx"],
         ["cx0xbx", "wx0xww", "wx0xww", "wx0xww", "wx0xww", "wx0xww", "wx0xww", "cxAxwx", "cxBxbx", "cxDxgx", "xxFxwx", "xxGxbx", "xxHxwx", "xxIxsx", "xxJxwx", "xxKxbx", "xxLxbx", "xxLxsx", "xxKxsx", "xxIxsx", "xxGxsx", "xxFxxx", "xxFxsx", "xxCxxx"],
         ["xxBxxx", "xxAxxx", "xxAxxx", "xx0xxx", "xxaxxx", "xxaxxx", "xxaxxx", "cxAxxx", "cxDxxx", "cxGxxx", "cxIxsx", "cxJxbx", "cxJxsx", "cxKxsx", "cxKxsx", "cxLxsx", "cxKxbx", "cxJxsx", "cxHxsx", "cxGxsx", "cxGxbx", "cxFxwx", "cxFxbx", "wxExxw"],
         ["wxExsw", "wxExsw", "wxDxsw", "wxDxsw", "cxCxsx", "cxCxsx", "cxCxsx", "cxCxbx", "cxCxwx", "wxBxbw", "cxBxwx", "cxBxbx", "cxBxwx", "cxBxwx", "cxAxwx", "cxAxgx", "cxAxgx", "cx0xgx", "cxbxgx", "cxbxgx", "cxbxwx", "cxbxwx", "cxbxgx", "cxbxbx"],
         ["cxbxwx", "cxbxwx", "cxbxbx", "cxbxbx", "cxbxgx", "bxbxgx", "bxbxwx", "cxaxbx", "cx0xbx", "cxBxwx", "xxBxhx", "xxCxgx", "xxDxgx", "xxExgx", "xxExgx", "xxExhx", "xxExhx", "xxDxhx", "xxDxgx", "xxCxhx", "xxBxwx", "xxBxwx", "xxBxbx", "xxAxwx"],
         ["xxAxwx", "xxAxbx", "xxAxwx", "xxAxbx", "xx0xbx", "xxAxbx", "xxBxwx", "xxDxwx", "xxExwx", "xxGxwx", "xxIxwx", "xxKxwx", "xxLxwx", "xxMxgx", "xxNxwx", "xxOxwx", "xxOxwx", "xxOxsx", "xxOxsx", "xxMxsx", "xxLxsx", "xxJxsx", "xxGxsx", "xxFxxx"]],
        ["Q",
         ["xxjxxx", "xxkxsx", "xxmxxx", "xxlxxx", "xxlxsx", "xxlxxx", "xxkxxx", "cxhxxx", "cxexxx", "cxcxxx", "xxBxsx", "xxFxsx", "xxDxwx", "cxFxwx", "cxFxgx", "cxHxwx", "xxI0bx", "xxJ0wx", "xxHxwx", "xxGxwx", "xxExsx", "xxDxsx", "xxCxsx", "xxCxsx"],
         ["xxBxsx", "xxCxsx", "xxCxsx", "xxBxsx", "xxBxsx", "xxAxsx", "xxAxsx", "xxCxsx", "xxExsx", "xxGxbx", "cxHxwx", "cxIxwx", "wxHxww", "cxHxwx", "cxH0sx", "cxJxgx", "cxJxwx", "cxJxbx", "cxIxsx", "cxHxsx", "cxHxsx", "cxCxsx", "xxBxxx", "xxAxxx"],
         ["xx0xxx", "cx0xxx", "txCxgw", "wxAxsw", "cx0xsx", "wxAxsw", "wxaxsw", "cx0xsx", "cxBxsx", "cxCxsx", "cxDxwx", "cxDxwx", "wxBxsw", "wxBxsw", "wfAxsw", "wxAxsw", "wfaxww", "wxcxbw", "wxdxsw", "cxdxsx", "cxdxsx", "cxdxsx", "cxfxwx", "cxgxbx"],
         ["cxgxsx", "cxgxsx", "cxgxsx", "cxgxxx", "cxgxsx", "wfhxsw", "wxhxsw", "xfgxsx", "wfgxbw", "xfgxsx", "xffxsx", "xfdxsx", "xfaxsx", "cxExwx", "cxGxgx", "txaxvw", "cxFxhx", "cxexvx", "cxgxhx", "cxgxwx", "cxgxgx", "cxhxwx", "xxhxsx", "xxixsx"],
         ["xxixsx", "xxhxsx", "xxhxsx", "xxhxsx", "xxhxsx", "xxixsx", "xxgxsx", "cxfxsx", "cxcxsx", "cx0xsx", "xxBxwx", "xxDxbx", "xxExbx", "xxGxwx", "xxGxbx", "xxGxwx", "cxFxsx", "cxFxsx", "cxDxsx", "cxDxsx", "cxBxsx", "cxAxsx", "xx0xsx", "xxbxxx"],
         ["xxcxxx", "xxdxxx", "xxexxx", "xxexsx", "cxfxxx", "cxfxsx", "cxexsx", "cxcxsx", "cxaxsx", "cx0xsx", "cx0xsx", "cxaxbx", "cxaxbx", "cx0xsx", "cxAxsx", "cxAxsx", "cx0xbx", "cx0xsx", "wx0xsw", "cxaxsx", "cxbxbx", "cxbxsx", "cxcxsx", "cxdxsx"],
         ["cxdxsx", "cxexsx", "cxgxsx", "cxhxsx", "cxgxsx", "cxgxsx", "cxhxsx", "xxfxbx", "xxexbx", "xxcxsx", "xxbxsx", "xxbxsx", "xxaxsx", "xxaxsx", "xxaxbx", "xxaxxx", "xx0xsx", "xx0xsx", "xxaxbx", "xxbxsx", "xxdxsx", "xxexxx", "xxgxxx", "xxhxxx"],
         ["xxixxx", "xxjxxx", "xxkxsx", "xxkxxx", "xxkxxx", "xxlxxx", "xxkxxx", "xxgxxx", "xxgxxx", "xxaxsx", "xxAxsx", "xxBxsx", "xxBxbx", "xxCxsx", "xxCxsx", "xxCxsx", "xxCxxx", "xxCxsx", "xxBxsx", "xxaxsx", "xxcxsx", "xxdxsx", "xxfxxx", "xxfxxx"],
         ["xxfxsx", "xxgxxx", "xxhxxx", "xxhxsx", "xxhxxx", "xxixsx", "xxgxxx", "xxcxsx", "xxaxsx", "xx0xsx", "cxAxsx", "cxCxsx", "cxDxsx", "cxFxsx", "cxGxbx", "cxHxwx", "cxGxbx", "cxCxbx", "cxCxsx", "cxAxsx", "cxaxbx", "cxbxsx", "xxcxsx", "xxcxsx"],
         ["xxbxxx", "cxcxsx", "cxcxsx", "cxaxsx", "cxaxsx", "wxaxww", "wxaxww", "cxaxsx", "cxAxbx", "cxCxwx", "cxAxwx", "cxBxgx", "cxAxgx", "cxAxgx", "cxAxgx", "cxAxwx", "cxAxbx", "cxaxgx", "cxcxwx", "xxcxgx", "xxexwx", "xxgxwx", "xxixwx", "xxjxwx"],
         ["xxkxbx", "xxlxsx", "xxlxwx", "xxlxbx", "cxlxwx", "cxlxsx", "cxlxsx", "xxkxbx", "xxkxsx", "xxixsx", "cxixsx", "cxgxsx", "cxgxsx", "cxfxsx", "cxexbx", "cxexsx", "cxexxx", "cxfxsx", "cxgxsx", "cxgxsx", "cxgxsx", "cxhxsx", "cxhxxx", "cxhxxx"],
         ["cxixsx", "cxkxsx", "cxjxxx", "cxjxsx", "cxjxsx", "cxjxsx", "cxjxsx", "cxixsx", "cxhxsx", "cxgxsx", "cxfxsx", "cxdxsx", "cxcxxx", "cxaxsx", "cxbxsx", "cx0xsx", "xxaxwx", "xxbxbx", "xxbxsx", "cxdxsx", "cxexsx", "cxexxx", "cxfxxx", "cxgxsx"],
         ["cxhxsx", "cxixsx", "cxjxxx", "cxjxsx", "cxjxxx", "cxjxxx", "cxixsx", "cxhxsx", "cxexsx", "cxdxsx", "xxbxbx", "xxbxwx", "xx0xwx", "xx0xwx", "xx0xbx", "xx0xsx", "xxBxsx", "xxBxsx", "xxBxsx", "xxaxbx", "xxcxsx", "xxexsx", "xxexsx", "xxexxx"],
         ["xxfxxx", "xxgxsx", "xxhxxx", "xxhxxx", "xxhxxx", "xxjxxx", "xxgxxx", "xxdxxx", "xx0xsx", "xxBxsx", "cxDxbx", "cxExsx", "cxExwx", "cxFxwx", "cxFxwx", "cxFxsx", "cxExbx", "cxExbx", "cxDxwx", "cxCxbx", "cxBxsx", "cxBxsx", "cxBxxx", "cxCxsx"],
         ["cxBxsx", "cxAxsx", "wx0xsw", "tfaxsw", "wfaxsw", "xfaxsx", "wf0xxw", "wfaxbw", "wxbxsw", "wxbxsw", "wxaxxw", "wxaxsw", "wx0xsw", "cxAxsx", "cxCxsx", "cxCxbx", "xxBxwx", "xxBxwx", "xxBxwx", "cxaxbx", "cxcxsx", "cxdxsx", "xxexsx", "xxfxsx"],
         ["xxfxsx", "xxgxsx", "xxhxsx", "xxhxsx", "xxixxx", "xxjxsx", "xxhxsx", "xxfxbx", "xxexbx", "xxdxbx", "xxcxsx", "xxbxsx", "xxaxsx", "xxAxsx", "xxCxsx", "xxDxsx", "xxFxbx", "xxExwx", "xxExwx", "cxCxwx", "cx0xwx", "cxbxwx", "xxcxbx", "xxcxbx"],
         ["xxdxbx", "xxdxsx", "xxexsx", "xxfxbx", "xxfxsx", "xxexsx", "xxdxsx", "xx0xbx", "xxAxwx", "xxBxbx", "xxCxwx", "xxDxsx", "xxExbx", "xxFxbx", "xxFxsx", "xxFxbx", "xxFxbx", "xxFxwx", "xxCxwx", "cx0xwx", "cxbxbx", "cxcxbx", "cxcxbx", "cxdxbx"],
         ["cxdxsx", "xxdxbx", "xxexbx", "xxfxsx", "xxgxbx", "xxixsx", "xxhxsx", "cxgxwx", "cxexwx", "cxdxgx", "cxcxgx", "cxbxwx", "cxaxwx", "cx0xwx", "cxaxwx", "cxaxwx", "cxaxwx", "cxaxwx", "cxaxwx", "cxbxbx", "cxcxsx", "cxdxsx", "cxdxsx", "cxcxsx"],
         ["cxcxwx", "cxcxbx", "cxcxwx", "cxcxwx", "cxcxbx", "wxexbw", "wxfxbw", "wxfxsw", "wxexww", "wffxww", "wffxbw", "xffxsx", "xffxsx", "wffxsw", "wffxsw", "xfexsx", "cxcxsx", "cxcxsx", "cxcxsx", "cxcxsx", "cxcxsx", "cxcxxx", "cxcxxx", "wxcxxw"],
         ["wxcxsw", "cxbxsx", "cxaxsx", "cxbxgx", "cxdxbx", "cxdxwx", "cxdxsx", "cxdxbx", "cxcxsx", "cxbxsx", "cxbxbx", "cxbxwx", "cxaxbx", "cx0xsx", "cxAxsx", "cxBxwx", "xxBxwx", "xxAxgx", "xx0xwx", "xxbxgx", "xxdxbx", "xxfxsx", "xxfxsx", "xxgxsx"],
         ["xxhxsx", "xxjxsx", "xxkxsx", "xxlxsx", "xxjxxx", "xxkxsx", "xxkxsx", "xxfxsx", "xxcxsx", "xxaxxx", "cxBxxx", "cxCxsx", "cxDxsx", "xxExbx", "xxFxsx", "xxExsx", "cxDxsx", "cxDxsx", "cxCxsx", "cxCxxx", "cxCxxx", "cxAxsx", "cx0xsx", "cxAxsx"],
         ["cxAxsx", "cxAxsx", "cxaxsx", "wxcxsw", "wxdxsw", "wxfxsw", "wxfxsw", "cxfxsx", "wxexsw", "wxcxsw", "cxdxbx", "xfdxsx", "xfdxsx", "cxdxsx", "cxbxxx", "cxaxsx", "wxaxsw", "wfbxsw", "wfaxsw", "cxaxsx", "cxaxsx", "cxbxsx", "cxbxsx", "cxcxsx"],
         ["cxcxsx", "cxdxgx", "cxexsx", "cxfxsx", "xxfxxx", "xxexxx", "xxcxbx", "xxaxsx", "xxAxsx", "xxBxwx", "xxDxbx", "xxExwx", "xxFxwx", "xxGxwx", "xxGxgx", "xxGxgx", "cxGxsx", "cxFxgx", "cxFxwx", "xxDxbx", "xxBxsx", "xx0xsx", "xx0xsx", "xxaxsx"],
         ["xxaxxx", "xxcxxx", "xxdxxx", "xxexxx", "xxexxx", "xxfxxx", "xxdxxx", "xx0xsx", "xxBxxx", "xxExsx", "xxHxsx", "xxIxsx", "xxJ0sx", "xxKxsx", "xxJxbx", "xxJxbx", "xxK0bx", "xxKxwx", "xxJ0wx", "cxI0sx", "cxGxsx", "cxFxsx", "cxExsx", "cxDxsx"],
         ["cxCxsx", "xxBxsx", "xxAxsx", "xxAxsx", "cxAxsx", "cxBxsx", "cxBxsx", "xxDxsx", "xxFxsx", "xxHxsx", "xxJxsx", "xxJxsx", "xxKxbx", "xxLxbx", "xxMxbx", "xxMxbx", "xxNxbx", "xxMxbx", "xxMxbx", "xxKxbx", "xxJxwx", "xxHxsx", "xxGxsx", "xxFxsx"],
         ["xxFxsx", "xxExsx", "xxBxsx", "xxBxxx", "cxAxxx", "cxAxxx", "cxBxxx", "cxDxsx", "cxExxx", "cxGxxx", "cxH0xx", "cxI0xx", "cxI0wx", "cxJ0bx", "cxK0bx", "cxK0bx", "cxJ0sx", "wxCxww", "wxBxsw", "cxCxsx", "cxCxsx", "cxBxxx", "cxCxsx", "cxAxsx"],
         ["cx0xsx", "xxaxsx", "xxbxxx", "xxaxsx", "xxaxsx", "xxaxxx", "xx0xsx", "xf0xsx", "xfAxsx", "xfCxsx", "xxExsx", "xxFxsx", "xxH0sx", "xxJ0bx", "xxI0bx", "xxK0sx", "xxJ0bx", "xxHxbx", "xxFxbx", "xxExbx", "xxCxsx", "xxBxsx", "xxAxsx", "xxAxsx"],
         ["xx0xsx", "xf0xsx", "xfaxsx", "xfbxsx", "xfbxxx", "xfbxsx", "xfaxxx", "xxCxsx", "xxHxbx", "xxI0bx", "xxJ0gx", "xxJ0wx", "xxL0gx", "xxL0bx", "xxL0wx", "xxM0bx", "xxM0bx", "xxL0wx", "xxK0bx", "cxJ0bx", "cxH0sx", "cxGxxx", "xxGxxx", "xxExsx"],
         ["xxCxxx", "xxCxsx", "xxBxsx", "xxBxsx", "xxAxsx", "xxAxsx", "xxCxsx", "xxDxsx", "xxFxbx", "xxHxsx", "xxI0sx", "xxI0wx", "xxI0bx", "xxJ0bx", "xxJ0bx", "xxJ0wx", "xxJ0bx", "xxI0wx", "xxGxbx", "xxFxsx", "xxDxsx", "xxCxsx", "xxBxsx", "xxAxsx"],
         ["xxAxsx", "xx0xxx", "xxAxsx", "xxAxsx", "xxAxsx", "xxAxsx", "xxBxsx", "xxCxbx", "xxDxsx", "xxFxsx", "xxGxsx", "xxHxsx", "xxI0bx", "cxJ0sx", "cxK0bx", "cxJ0bx", "xxJ0bx", "xxK0wx", "xxJ0bx", "cxH0sx", "cxGxsx", "cxFxsx", "cxGxsx", "cxHxsx"],
         ["cxGxbx", "cxGxwx", "cxFxbx", "cxFxsx", "cxDxsx", "cxExsx", "cxDxsx", "wxDxsw", "wxExbw", "wxExww", "cxGxgx", "cxI0gx", "cxK0gx", "cxL0gx", "cxL0gx", "cxL0gx", "xxL0bx", "xxJ0bx", "xxJ0sx", "wxFxsw", "wxFxsw", "wxExxw", "cxExsx", "cxDxsx"]],
        ["S",
         ["cxAxsx", "xxAxxx", "xxAxsx", "xxAxxx", "xxAxsx", "xx0xsx", "xxAxsx", "cxCxsx", "cxDxxx", "cxDxwx", "cxCxbx", "cxExbx", "cxExwx", "cxExbx", "cxG0sx", "cxG0sx", "cxG0gx", "cxExgx", "cxDxwx", "xxCxwx", "xx0xwx", "xxaxbx", "xxcxbx", "xxcxwx"],
         ["xxcxwx", "xxdxwx", "xxexbx", "xxdxwx", "cxexwx", "cxexbx", "cxfxbx", "cxfxbx", "cxfxwx", "cxexsx", "cxdxsx", "cxbxsx", "cx0xsx", "cxBxsx", "cxCxsx", "cxDxbx", "xxExsx", "xxCxsx", "xxBxsx", "xx0xsx", "xxbxsx", "xxcxsx", "xxdxsx", "xxdxxx"],
         ["xxdxsx", "xxexsx", "xxexsx", "xxfxsx", "xxfxxx", "xxdxsx", "xxcxsx", "cxcxsx", "cxcxbx", "cxcxsx", "cxcxsx", "cx0xwx", "cxaxsx", "cxaxwx", "cxAxwx", "cx0xbx", "wxaxsw", "wfaxsw", "wfaxbw", "cxbxsx", "wxbxsw", "tfbxsw", "cxbxxx", "cxcxxx"],
         ["cxcxxx", "cxcxxx", "cxcxsx", "cxcxsx", "cxdxsx", "cxdxsx", "wxdxsw", "cxexbx", "cxdxbx", "cxcxbx", "cxcxbx", "cxbxbx", "cxaxsx", "cxcxbx", "cxbxwx", "cxdxbx", "cxcxbx", "cxbxgx", "cxbxbx", "cxbxsx", "cxdxbx", "cxexsx", "wxfxsw", "wxgxsw"],
         ["wxgxsw", "cxgxsx", "cxhxsx", "cxhxsx", "cxhxsx", "cxixsx", "cxhxbx", "cxhxbx", "cxfxbx", "cxgxwx", "cxfxbx", "cxgxwx", "cxfxwx", "cxfxwx", "cxfxbx", "cxhxwx", "cxhxwx", "cxgxwx", "cxhxwx", "cxhxbx", "cxhxwx", "cxhxbx", "cxixbx", "cxixsx"],
         ["cxixsx", "cxixsx", "cxixsx", "cxixsx", "cxixsx", "cxixsx", "cxixbx", "cxhxbx", "cxhxsx", "cxhxsx", "cxgxsx", "cxgxsx", "cxfxsx", "cxexsx", "cxexsx", "cxdxxx", "cxcxxx", "cxdxbx", "cxdxbx", "cxexsx", "cxfxsx", "cxgxsx", "xxgxsx", "xxgxsx"],
         ["xxgxsx", "cxgxsx", "cxgxsx", "cxgxsx", "cxgxsx", "wxgxxw", "wxfxsw", "cxexsx", "cxdxsx", "cxbxsx", "cxaxsx", "cxAxsx", "cxBxsx", "xxCxsx", "xxExsx", "xxCxsx", "cxCxsx", "cxCxbx", "cxCxsx", "cxBxsx", "cxAxxx", "cxaxxx", "xxbxsx", "xxcxsx"],
         ["xxexsx", "xxexsx", "xxexsx", "xxfxsx", "xxfxbx", "xxgxsx", "xxexsx", "cxcxsx", "cxaxsx", "cxAxsx", "xxBxsx", "xxCxsx", "xxCxsx", "xxBxbx", "xxBxsx", "xxCxsx", "xxDxxx", "xxDxxx", "xxCxsx", "xxBxsx", "xx0xxx", "xx0xsx", "xxcxsx", "xxdxsx"],
         ["xxexsx", "xxfxxx", "xxfxsx", "xxgxsx", "cxgxxx", "cxfxxx", "cxdxxx", "cxbxxx", "cxaxsx", "cxAxxx", "cxBxsx", "cxCxsx", "cxCxsx", "cxDxsx", "cxExsx", "cxDxsx", "cxDxsx", "cxDxsx", "cxCxsx", "cxCxxx", "cxCxxx", "cx0xxx", "cxaxxx", "cxbxxx"],
         ["cxbxxx", "cxcxsx", "cxbxsx", "cxbxsx", "cxcxsx", "cxcxsx", "cxbxbx", "xxaxbx", "xx0xbx", "xxAxbx", "xxBxwx", "xxBxwx", "xxBxwx", "cxBxwx", "cxBxwx", "cxCxwx", "cxAxwx", "cxBxbx", "cxAxbx", "cx0xsx", "cxaxsx", "cxcxsx", "xxcxsx", "xxfxxx"],
         ["xxgxxx", "xxgxxx", "xxhxxx", "xxhxsx", "xxhxsx", "xxixsx", "xxfxsx", "xxbxsx", "xx0xbx", "xxAxsx", "xxBxsx", "xxCxbx", "xxCxwx", "xxCxsx", "xxCxwx", "xxCxwx", "xxBxwx", "xxBxsx", "xxBxbx", "xx0xsx", "xxaxsx", "xxcxsx", "xxdxsx", "xxdxsx"],
         ["xxgxxx", "xxixxx", "xxixxx", "xxixxx", "xxixsx", "xxixxx", "xxfxxx", "xxcxxx", "xx0xsx", "xxBxsx", "xxDxsx", "xxExxx", "xxExsx", "cxFxsx", "cxFxsx", "cxG0wx", "cxG0wx", "cxG0bx", "cxG0bx", "cxFxsx", "cxDxsx", "cxCxsx", "cxBxsx", "cxAxsx"],
         ["cxAxxx", "cxAxxx", "cxAxxx", "cxAxsx", "cxAxsx", "wf0xsw", "wfaxxw", "wxaxsw", "wx0xsw", "wxAxsw", "cxBxsx", "cxExbx", "cxH0sx", "cxH0wx", "cxJ0wx", "wxI0ww", "xxExgx", "xxExgx", "xxCxgx", "xxAxwx", "xx0xhx", "xxaxwx", "xxbxwx", "xxbxsx"],
         ["xxbxbx", "xxbxbx", "xxcxbx", "xxcxbx", "xxdxsx", "xxcxbx", "xxcxgx", "xxcxwx", "xxbxwx", "xx0xwx", "xxAxgx", "xxAxvx", "xxBxhx", "xxDxgx", "xxDxhx", "xxDxhx", "xxDxgx", "xxDxgx", "xxCxgx", "xxBxwx", "xx0xsx", "xxaxsx", "xxcxsx", "xxdxsx"],
         ["xxexsx", "xxexsx", "xxfxsx", "xxfxxx", "xxfxxx", "xxfxxx", "xxdxxx", "xxbxsx", "xxAxsx", "xxBxsx", "xxCxsx", "xxExxx", "xxF0sx", "xxF0sx", "xxG0bx", "xxG0sx", "cxG0sx", "cxG0sx", "cxFxsx", "xxDxsx", "xxBxsx", "xxAxsx", "xx0xsx", "xxaxsx"],
         ["xxaxxx", "xxbxxx", "xxcxxx", "xxexxx", "xxfxsx", "xxfxxx", "xxdxxx", "cxcxxx", "cxAxsx", "cxDxsx", "cxG0sx", "cxHxsx", "cxIxsx", "xxIxsx", "xxKxsx", "xxKxbx", "xxJxwx", "xxIxwx", "xxHxbx", "cxGxsx", "cxFxsx", "cxExsx", "cxDxxx", "cxBxxx"],
         ["cxBxxx", "xxAxxx", "xxaxxx", "xxbxxx", "xxbxxx", "xxbxxx", "xx0xxx", "xxCxsx", "xxFxsx", "xxI0sx", "cxJ0bx", "cxJ0sx", "cxK0wx", "cxM0bx", "cxL0bx", "cxL0wx", "xxM0wx", "xxL0wx", "xxK0wx", "cxJ0gx", "cxH0sx", "cxG0sx", "xxG0sx", "xxH0sx"],
         ["xxH0sx", "cxG0sx", "cxG0sx", "cxF0sx", "xxFxsx", "xxFxsx", "xxG0sx", "cxI0sx", "cxJ0wx", "cxL0bx", "txL0gw", "txG0sw", "txJ0sw", "cxI0bx", "cxI0sx", "cxJ0bx", "cxI0bx", "cxI0sx", "cxH0wx", "cxFxwx", "cxCxgx", "cxBxgx", "cxBxbx", "cx0xwx"],
         ["cxaxbx", "xxbxsx", "xxbxsx", "xxbxsx", "xxbxsx", "xxcxbx", "xxbxbx", "xxaxbx", "xxaxwx", "xx0xsx", "xx0xsx", "xxBxsx", "xxCxxx", "xxDxsx", "xxExxx", "xxExsx", "cxExbx", "cxCxsx", "cxCxsx", "cxBxsx", "cxAxxx", "cx0xsx", "cx0xxx", "cxaxsx"],
         ["cxcxsx", "xxexsx", "xxexxx", "xxexsx", "xxexsx", "xxdxsx", "xxcxsx", "cxcxsx", "cxbxsx", "cxaxsx", "cxaxsx", "cxCxxx", "cxExsx", "cxExxx", "cxGxsx", "cxG0sx", "xxH0bx", "xxH0sx", "xxExbx", "cxDxsx", "cxBxsx", "cxBxsx", "cxBxsx", "cxAxsx"],
         ["cx0xsx", "xxbxbx", "xxbxbx", "xxcxsx", "xxcxsx", "xxcxsx", "xxcxbx", "xxcxbx", "xxbxbx", "xx0xbx", "cx0xsx", "cx0xsx", "cxCxsx", "xxDxsx", "xxDxsx", "xxExsx", "xxDxsx", "xxBxsx", "xxAxsx", "xx0xsx", "xxaxsx", "xxbxsx", "xxcxxx", "xxexsx"],
         ["xxgxsx", "xxfxsx", "xxhxxx", "xxhxsx", "xxgxsx", "xxhxxx", "xxexxx", "xxbxbx", "xxaxwx", "xx0xwx", "cx0xwx", "cxBxbx", "cxCxwx", "cxCxwx", "cxExwx", "cxDxwx", "cxCxgx", "cxAxsx", "cxAxbx", "cxAxsx", "cxAxbx", "cxAxbx", "wx0xbw", "wxcxsw"],
         ["wxcxsw", "cxbxsx", "cxbxsx", "pxbxbw", "wxcxsw", "wxbxsw", "wxbxsw", "cxbxsx", "cxbxsx", "wxcxbw", "pxbxsw", "pxbxbw", "pxbxbw", "cxbxbx", "wxbxsw", "wxbxsw", "cxaxsx", "cx0xsx", "cx0xsx", "cxaxsx", "cxbxsx", "cxbxsx", "cxbxsx", "cxbxsx"],
         ["cxbxxx", "cxbxxx", "cxbxxx", "xfbxxx", "xfbxxx", "wfbxxw", "wfbxsw", "wfbxsw", "wfbxsw", "wxbxsw", "wxbxsw", "wxbxsw", "wxaxsw", "wxaxxw", "wxaxsw", "wx0xsw", "cxAxsx", "cxBxsx", "cxBxsx", "cxBxbx", "cx0xbx", "cxbxbx", "xxcxsx", "xxdxsx"],
         ["xxdxsx", "xxexsx", "xxexsx", "xxexbx", "xxfxwx", "xxfxsx", "xxexsx", "xxdxbx", "xxcxbx", "xxaxbx", "xx0xbx", "xx0xsx", "xxAxwx", "xxBxbx", "xxBxsx", "xxCxsx", "xxCxwx", "xxDxsx", "xxCxbx", "xxCxsx", "xxAxsx", "xxbxsx", "xxdxsx", "xxexsx"],
         ["xxfxsx", "xxhxsx", "xxgxsx", "xxgxxx", "xxixxx", "xxixsx", "xxgxxx", "cxdxsx", "cx0xsx", "cxBxbx", "cxBxbx", "cxCxwx", "cxCxbx", "cxCxbx", "cxCxbx", "cxCxsx", "cxDxbx", "cxCxbx", "cxBxbx", "cxAxsx", "cx0xsx", "cx0xsx", "cxaxsx", "cxaxsx"],
         ["cxaxsx", "cxaxsx", "cxaxsx", "cxaxxx", "wxaxxw", "wfbxsw", "wfcxsw", "cxbxsx", "wfaxsw", "wxaxsw", "wfaxbw", "xfaxsx", "xf0xsx", "cx0xsx", "cxAxsx", "cxBxsx", "cxBxbx", "cxAxsx", "cxAxsx", "wx0xsw", "wx0xsw", "wx0xsw", "cx0xsx", "xf0xsx"],
         ["xf0xxx", "cx0xsx", "xf0xsx", "xf0xsx", "xf0xxx", "xf0xsx", "xfAxxx", "xfAxxx", "xfBxbx", "xfBxwx", "cxBxbx", "cxExwx", "cxF0wx", "xxH0wx", "xxI0bx", "xxJ0sx", "xxJ0bx", "xxK0sx", "xxJ0bx", "xxH0sx", "xxF0sx", "xxExsx", "xxDxsx", "xxCxsx"],
         ["xxBxsx", "xxBxsx", "xxAxsx", "xx0xsx", "xxaxxx", "xxAxsx", "xxCxsx", "xxExsx", "xxG0sx", "xxH0sx", "xxI0sx", "xxJ0bx", "xxK0sx", "cxL0bx", "cxM0sx", "cxM0sx", "cxN0sx", "cxM0bx", "cxK0gx", "cxI0wx", "cxH0sx", "cxF0sx", "xxFxsx", "xxExsx"],
         ["xxDxsx", "xxDxsx", "xxCxsx", "xxDxxx", "xxCxxx", "xxBxsx", "xxCxsx", "cxExbx", "cxG0sx", "cxI0sx", "xxJ0sx", "xxM0bx", "xxN0sx", "cxO0wx", "cxQ0bx", "cxQ0bx", "cxP0bx", "cxP0sx", "cxM0bx", "cxM0bx", "cxK0bx", "cxJ0sx", "xxI0sx", "xxH0sx"]],
        ["W",
         ["xxD0sx", "xxC0xx", "xxAxsx", "xxAxsx", "xxAxsx", "xxAxsx", "xxAxsx", "xxC0sx", "xxE0sx", "xxG0sx", "xxI0sx", "xxJ0bx", "xxJ0wx", "xxK0wx", "xxK0wx", "xxK0wx", "xxK0wx", "xxJ0wx", "xxI0wx", "xxH0bx", "xxG0sx", "xxE0sx", "xxD0sx", "xxD0sx"],
         ["xxC0sx", "xxB0sx", "xxBxsx", "xxAxsx", "xxBxsx", "xxAxsx", "xxC0sx", "xxD0sx", "xxF0sx", "xxH0bx", "xxI0wx", "xxH0bx", "xxJ0wx", "cxH0sx", "cxJ0bx", "cxJ0bx", "cxI0bx", "cxG0wx", "cxG0bx", "xxE0wx", "xxB0bx", "xx0xsx", "xxaxsx", "xxbxsx"],
         ["xxcxsx", "xxdxxx", "xxdxxx", "xxdxxx", "xxexxx", "xxexsx", "xxcxxx", "xx0xsx", "xxB0sx", "xxE0sx", "xxF0sx", "xxG0sx", "xxH0bx", "xxG0bx", "xxH0sx", "xxG0sx", "xxH0sx", "xxH0sx", "xxG0sx", "xxFxsx", "xxDxsx", "xxC0sx", "xxAxsx", "xxaxxx"],
         ["xxcxsx", "xxdxxx", "xxcxxx", "xxexxx", "xxexxx", "xxexsx", "xxbxsx", "xx0xsx", "xxC0bx", "xxD0bx", "xxF0bx", "xxF0bx", "xxG0bx", "xxG0sx", "xxH0sx", "xxI0sx", "xxJ0sx", "xxJ0sx", "xxI0bx", "xxH0sx", "xxF0sx", "xxD0sx", "xxC0xx", "xxBxxx"],
         ["xx0xsx", "xx0xxx", "xxaxxx", "xxbxxx", "xxbxxx", "xxaxsx", "xx0xxx", "cxC0sx", "cxE0sx", "cxG0sx", "cxI0sx", "cxI0bx", "cxJ0sx", "cxJ0bx", "cxI0bx", "cxK0wx", "cxI0wx", "tfaxgw", "tfBxxw", "txAxsw", "tx0xsw", "tx0xsw", "xx0xsx", "xx0xbx"],
         ["xxaxwx", "xxcxwx", "xxdxbx", "xxexwx", "xxexwx", "xxfxwx", "xxexwx", "xxdxwx", "xxdxgx", "xxcxwx", "xxcxgx", "xxbxgx", "xxbxwx", "xxaxwx", "xx0xwx", "xx0xwx", "xx0xbx", "xxaxwx", "xxbxgx", "xxcxwx", "xxdxbx", "xxexsx", "xxgxsx", "xxgxsx"],
         ["xxgxsx", "xxgxsx", "xxixsx", "xxjxsx", "xxjxsx", "xxixsx", "xxhxxx", "xxdxsx", "xxbxxx", "xxaxxx", "xxAxsx", "xxAxsx", "xxC0sx", "xxC0sx", "xxCxwx", "xxC0wx", "xxC0bx", "xxC0sx", "xxBxsx", "xxAxbx", "xxaxsx", "xxbxsx", "xxcxxx", "xxcxsx"],
         ["xxfxxx", "xxgxxx", "xxhxxx", "xxhxxx", "cxixsx", "cxixxx", "cxgxxx", "xxcxxx", "xx0xxx", "xxBxsx", "xxCxsx", "xxCxsx", "xxDxsx", "xxExsx", "xxF0sx", "xxF0bx", "xxF0bx", "xxE0wx", "xxExwx", "xxCxwx", "xxBxsx", "xx0xsx", "xx0xsx", "xxaxsx"],
         ["xxbxxx", "xxcxxx", "xxdxsx", "xxexsx", "xxgxxx", "xxfxxx", "xxexsx", "xxbxsx", "xxAxsx", "xxC0sx", "xxE0sx", "xxG0bx", "xxG0bx", "xxH0bx", "xxI0sx", "xxI0bx", "xxI0bx", "xxIxbx", "xxIxsx", "xxGxsx", "xxE0sx", "xxD0sx", "xxB0sx", "xxBxsx"],
         ["xxAxsx", "xx0xsx", "xx0xsx", "xxaxsx", "cx0xsx", "cx0xsx", "cxaxgx", "wxaxbw", "wxAxww", "wxBxbw", "xxC0sx", "xxDxbx", "xxE0bx", "xxExbx", "xxExbx", "xxE0wx", "cxD0wx", "cxD0gx", "cxBxgx", "xxAxwx", "xxaxbx", "xxbxwx", "xxcxsx", "xxdxbx"],
         ["xxdxsx", "xxexsx", "xxfxsx", "xxfxsx", "xxgxsx", "xxgxsx", "xxexsx", "xxcxsx", "xxaxsx", "xxAxsx", "xxBxbx", "xxAxbx", "xxC0bx", "xxC0wx", "xxC0bx", "xxC0sx", "xxD0bx", "xxC0bx", "xxC0sx", "xxB0sx", "xx0xsx", "xxaxsx", "xxcxsx", "xxcxsx"],
         ["xxdxsx", "xxdxsx", "xxfxsx", "xxfxsx", "xxfxsx", "xxfxxx", "xxexxx", "xxbxxx", "xxAxsx", "xxBxsx", "cxDxsx", "cxDxsx", "cxExsx", "cxExsx", "cxExsx", "cxF0sx", "cxFxsx", "cxExbx", "cxDxsx", "cxDxsx", "cxBxsx", "cxBxsx", "cx0xsx", "cxAxsx"],
         ["cxAxsx", "cxAxsx", "cxaxxx", "cxaxxx", "cxbxsx", "cxbxsx", "cxbxxx", "cx0xsx", "cxBxsx", "cxD0sx", "xxE0sx", "xxF0bx", "xxG0bx", "cxG0sx", "cxF0bx", "cxF0wx", "cxE0bx", "cxG0wx", "cxFxwx", "xxE0wx", "xxC0sx", "xxB0sx", "cxB0sx", "cxBxsx"],
         ["cxBxsx", "cx0xxx", "cxBxsx", "cxAxsx", "cxBxsx", "cxAxxx", "cxAxsx", "cxBxxx", "cxAxsx", "cxBxsx", "cxC0xx", "cxC0xx", "cxD0xx", "cxC0sx", "wxD0xw", "wxD0sw", "cxD0sx", "cxD0sx", "cxD0sx", "cxC0sx", "cxAxsx", "cx0xxx", "xxaxxx", "xxaxxx"],
         ["xxaxxx", "xxbxxx", "xxcxxx", "xxcxxx", "xxdxxx", "xxdxxx", "xxbxsx", "xx0xsx", "xxAxsx", "xxC0xx", "cxD0xx", "cxE0sx", "cxF0xx", "cxF0sx", "cxH0sx", "cxH0xx", "xxH0sx", "xxH0sx", "xxH0sx", "cxF0sx", "cxC0sx", "cxBxsx", "xxAxxx", "xxAxxx"],
         ["xxaxxx", "xxaxxx", "xxbxxx", "xxbxxx", "xxbxxx", "xxcxxx", "xxbxsx", "xx0xxx", "xxD0sx", "xxF0sx", "cxG0sx", "cxF0sx", "tx0xsw", "txAxbw", "tx0xxw", "wxaxsw", "cx0xsx", "cx0xsx", "tx0xsw", "wxbxww", "wxbxxw", "wxbxxw", "cxbxxx", "cxaxsx"],
         ["cxaxsx", "cxaxsx", "cxbxsx", "cxcxsx", "xxcxsx", "xxdxsx", "xxcxsx", "xxcxsx", "xxaxbx", "xx0xwx", "xx0xwx", "xxAxwx", "xxAxbx", "xxAxwx", "xxB0bx", "xxBxbx", "xxBxwx", "xxAxwx", "xx0xgx", "xxaxwx", "xxcxwx", "xxdxwx", "xxdxbx", "xxexbx"],
         ["xxfxsx", "xxfxsx", "xxgxsx", "xxgxsx", "xxhxsx", "xxhxsx", "xxgxsx", "xxfxbx", "xxexsx", "xxdxxx", "xxcxsx", "xxbxsx", "xxbxsx", "xxaxsx", "xx0xsx", "xx0xsx", "xxAxsx", "xxAxsx", "xxAxsx", "xxaxsx", "xxcxsx", "xxcxsx", "xxexsx", "xxfxxx"],
         ["xxixsx", "xxixsx", "xxhxxx", "xxixxx", "xxjxsx", "xxixsx", "xxhxsx", "xxexsx", "xxcxsx", "xxbxsx", "xxaxsx", "xxAxsx", "xxAxxx", "xxBxxx", "xxB0sx", "xxC0sx", "xxCxsx", "xxCxsx", "xxBxsx", "xxBxsx", "xx0xsx", "xxaxsx", "xxcxsx", "xxdxsx"],
         ["xxexsx", "xxgxsx", "xxhxsx", "xxhxsx", "xxhxxx", "xxgxxx", "xxexsx", "xxcxsx", "xx0xsx", "xxBxbx", "xxB0bx", "xxC0bx", "xxD0wx", "cxD0gx", "cxE0wx", "cxE0bx", "cxE0gx", "cxD0wx", "cxD0wx", "cxC0wx", "cxAxbx", "cxAxsx", "cxC0bx", "cxBxsx"],
         ["cxBxbx", "cxAxbx", "cx0xbx", "cx0xsx", "cx0xbx", "cxaxbx", "cxaxbx", "cxaxbx", "cx0xwx", "cxAxwx", "cxAxgx", "cxBxwx", "cx0xgx", "cx0xgx", "cxAxgx", "cxC0wx", "cxBxgx", "cxBxwx", "cxBxgx", "cxAxbx", "cx0xbx", "cxaxbx", "wxbxbw", "wxbxbw"],
         ["wxdxww", "wxexsw", "wxexsw", "wxexsw", "wxfxsw", "wxfxsw", "wxexsw", "wffxbw", "wffxww", "wffxww", "cxexbx", "wfdxbw", "wfdxbw", "wfdxbw", "wfaxsw", "wfaxbw", "cxbxsx", "cxaxbx", "cxaxsx", "cxaxsx", "cxbxxx", "cxcxsx", "xxcxsx", "xxdxsx"],
         ["xxdxxx", "wxbxsw", "wxcxsw", "wxcxsw", "cxcxxx", "xfcxsx", "xfcxsx", "xxbxsx", "xxaxsx", "xxAxbx", "cxAxbx", "cxAxbx", "cxAxbx", "cxC0bx", "cxC0wx", "cxBxbx", "cxAxsx", "cxB0bx", "cxBxbx", "cx0xbx", "cxaxbx", "cxaxsx", "cxaxsx", "cxaxsx"],
         ["cxbxsx", "cxbxsx", "cxbxsx", "cxbxsx", "xxbxsx", "xxbxsx", "xxbxsx", "cx0xsx", "cxBxbx", "cxBxbx", "cxB0wx", "cxD0wx", "cxD0wx", "cxD0wx", "cxE0bx", "cxF0wx", "cxF0wx", "cxE0bx", "wxAxsw", "txaxsw", "wxaxxw", "wx0xsw", "cx0xsx", "cxaxsx"],
         ["cxaxsx", "cxaxsx", "cxaxxx", "cxaxxx", "cxaxsx", "xfbxsx", "xfbxbx", "cxbxsx", "cxaxsx", "cxaxsx", "cx0xsx", "cx0xsx", "cxBxsx", "xxC0sx", "xxD0bx", "xxD0wx", "xxD0wx", "xxD0wx", "xxC0bx", "xxBxbx", "xx0xbx", "xxbxsx", "xxcxsx", "xxcxxx"],
         ["xxdxsx", "xxexxx", "xxfxxx", "xxfxxx", "xxfxxx", "xxgxxx", "xxfxxx", "xxbxsx", "xx0xsx", "xxB0sx", "cxC0sx", "cxD0wx", "cxC0bx", "cxC0wx", "cxD0wx", "txB0ww", "cxbxsx", "cx0xsx", "cxAxwx", "cxbxsx", "cxbxsx", "cxcxsx", "cxbxsx", "cxbxxx"],
         ["cxdxsx", "xxdxxx", "xxexxx", "xxexxx", "xxexsx", "xxexxx", "xxexxx", "xxdxsx", "xxbxsx", "xx0xsx", "xx0xbx", "xxAxbx", "xxAxsx", "xxB0bx", "xxBxbx", "xxC0bx", "xxC0wx", "xxCxbx", "xx0xbx", "xx0xsx", "xxaxsx", "xxbxsx", "wxexsw", "wxexsw"],
         ["wxfxxw", "xxfxxx", "xxgxxx", "xxgxxx", "xxgxxx", "xxgxsx", "xxgxsx", "xxfxsx", "xxexsx", "xxcxsx", "cxcxsx", "wxcxsw", "wxcxsw", "xxbxsx", "xxaxwx", "xxbxbx", "cxbxbx", "cxcxbx", "cxcxwx", "cxdxsx", "cxfxsx", "cxgxsx", "xxgxxx", "xxgxxx"],
         ["xxhxxx", "xxixxx", "xxixxx", "xxixxx", "xxixxx", "xxjxxx", "xxjxxx", "xxfxxx", "xxdxxx", "xxaxsx", "xx0xsx", "xxAxsx", "xxBxbx", "cxaxbx", "cxBxbx", "cxAxbx", "txcxbw", "txfxww", "txdxsw", "xxdxxx", "xxexxx", "xxfxxx", "xxgxxx", "xxhxxx"],
         ["xxgxxx", "xxhxxx", "xxhxxx", "xxixxx", "xxixxx", "xxixxx", "xxhxxx", "cxexxx", "cxcxxx", "cxaxsx", "cx0xxx", "cxBxxx", "cxBxsx", "txaxsw", "txbxsw", "wxaxxw", "cxAxsx", "cxAxsx", "cx0xsx", "cxaxsx", "cxcxxx", "cxdxsx", "cxexsx", "cxdxxx"],
         ["cxexxx", "cxexxx", "cxexxx", "cxfxxx", "cxfxxx", "cxgxxx", "cxfxxx", "xxcxsx", "xxbxsx", "xxaxsx", "cxAxsx", "cxAxsx", "cxBxbx", "cxAxsx", "cxAxsx", "cxAxsx", "cxAxbx", "cxAxbx", "cx0xbx", "cx0xsx", "cxaxsx", "cxaxsx", "cxaxsx", "cxaxsx"]],
        ["V",
         ["cx0xsx", "cx0xsx", "cxaxsx", "cxaxsx", "cxaxsx", "cxaxsx", "cxaxsx", "cx0xsx", "cxAxbx", "cxAxwx", "cxBxbx", "cxCxwx", "cxCxgx", "cxCxwx", "cxCxwx", "cxCxwx", "cxD0wx", "cxCxbx", "wxAxbw", "cxBxsx", "cxAxsx", "cxAxsx", "cx0xsx", "cx0xsx"],
         ["cxaxsx", "cxaxsx", "cxbxsx", "cxcxsx", "xxcxsx", "xxcxsx", "xxcxsx", "cxbxsx", "cxaxsx", "cxAxxx", "cxC0sx", "cxD0sx", "cxE0sx", "cxE0sx", "cxE0bx", "cxE0bx", "cxE0wx", "cxD0wx", "cxC0bx", "cxCxsx", "cxBxsx", "cxAxsx", "cxAxsx", "cx0xsx"],
         ["cx0xxx", "cxbxxx", "cxcxxx", "cxcxxx", "cxdxxx", "cxdxsx", "cxdxxx", "cxbxxx", "cx0xxx", "cxBxxx", "cxCxsx", "cxC0sx", "cxE0sx", "cxE0sx", "cxF0bx", "cxF0bx", "cxE0sx", "cxD0bx", "cxD0bx", "xxBxsx", "txAxsw", "txAxsw", "xxaxsx", "xxaxsx"],
         ["xxbxxx", "xxbxxx", "xxcxxx", "xxcxxx", "xfdxxx", "xfdxsx", "xfcxxx", "xfbxxx", "xf0xsx", "xfCxsx", "xxE0sx", "xxE0xx", "xxF0xx", "cxG0sx", "cxF0sx", "cxG0sx", "xxH0sx", "xxH0sx", "xxG0sx", "xxF0sx", "xxC0xx", "xxCxxx", "xxAxxx", "xx0xxx"],
         ["xx0xxx", "xxaxxx", "xxaxxx", "xxbxxx", "xxbxxx", "xxcxxx", "xxbxxx", "xx0xsx", "xxBxsx", "xxE0sx", "xxF0sx", "xxH0sx", "xxI0sx", "cxI0bx", "cxI0bx", "cxI0sx", "cxJ0bx", "cxJ0bx", "cxJ0wx", "xxH0sx", "xxG0bx", "xxF0sx", "xxE0sx", "xxD0sx"],
         ["xxD0sx", "xxC0sx", "xxBxsx", "xxBxsx", "xxBxsx", "xxAxsx", "xxBxsx", "xxC0sx", "xxE0sx", "xxF0sx", "xxH0bx", "xxI0bx", "xxJ0bx", "cxJ0sx", "wxCxww", "tx0xbw", "wxAxsw", "wxCxxw", "wxC0sw", "cxCxsx", "cxAxsx", "cxAxsx", "cxAxxx", "cxAxsx"],
         ["cxaxsx", "cx0xsx", "cx0xsx", "cxaxxx", "cxaxsx", "cxaxxx", "cxaxxx", "xx0xsx", "xx0xsx", "xxAxsx", "cxBxxx", "cxC0sx", "cxD0sx", "cxE0xx", "cxE0sx", "cxE0sx", "cxD0sx", "cxD0bx", "cxC0sx", "cxCxsx", "cxCxsx", "wxAxsw", "cx0xsx", "cx0xsx"],
         ["cxaxsx", "cxaxsx", "cxaxxx", "cxaxxx", "cxaxsx", "cxaxsx", "wxaxsw", "wfaxsw", "wfaxxw", "wf0xxw", "wx0xsw", "wxAxxw", "wxBxsw", "wxBxsw", "wxAxxw", "wxCxxw", "cxCxxx", "pxBxxw", "pxCxsw", "cxAxbx", "cxaxsx", "cx0xsx", "xxbxsx", "xxbxsx"],
         ["xxcxxx", "xxdxsx", "xxdxsx", "xxexxx", "xxexxx", "xxfxxx", "xxdxxx", "xxcxxx", "xx0xsx", "xxAxsx", "xxCxsx", "xxD0sx", "xxE0bx", "cxE0sx", "cxE0bx", "cxF0bx", "cxE0bx", "cxF0sx", "txaxsw", "cxAxsx", "cxaxsx", "cxaxsx", "cxbxsx", "cxaxsx"],
         ["cxbxsx", "xxcxsx", "xxdxsx", "xxexsx", "xxfxxx", "xxgxsx", "xxfxsx", "xxdxsx", "xxbxsx", "xx0xsx", "xxAxsx", "xxAxbx", "xxBxsx", "xxBxsx", "xxCxsx", "xxCxsx", "xxBxsx", "xxBxxx", "xxBxsx", "xxAxsx", "xxaxsx", "xxaxsx", "xxcxxx", "xxdxxx"],
         ["xxexxx", "xxexxx", "xxgxxx", "xxgxxx", "xxhxsx", "xxgxsx", "xxfxxx", "xxcxxx", "xx0xxx", "xxBxxx", "xxCxxx", "xxC0sx", "xxC0xx", "xxD0xx", "xxE0sx", "xxE0bx", "cxD0bx", "cxDxsx", "cxBxsx", "cxAxsx", "cx0xsx", "cxaxsx", "cxaxxx", "cxbxxx"],
         ["cxbxsx", "cxcxsx", "cxcxxx", "cxcxxx", "cxdxsx", "cxdxsx", "cxcxxx", "xxbxsx", "xx0xsx", "xxBxsx", "xxC0sx", "xxD0sx", "xxC0sx", "xxE0sx", "xxD0sx", "xxE0bx", "xxE0bx", "xxD0sx", "xxD0sx", "xxBxsx", "xxBxxx", "xx0xxx", "xxaxsx", "xxbxsx"],
         ["xxdxsx", "xxbxxx", "xxcxxx", "xxdxsx", "xxdxsx", "xxdxsx", "xxcxsx", "cxaxsx", "cxAxsx", "cxD0sx", "cxC0sx", "cxC0sx", "cxD0sx", "cxD0sx", "cxD0sx", "cxD0sx", "cxE0xx", "cxD0sx", "cxD0sx", "cxC0sx", "cxBxsx", "cxBxsx", "wxAxsw", "wx0xsw"],
         ["wxaxsw", "cxaxsx", "cxaxsx", "cxaxsx", "cxbxsx", "cxaxsx", "cxbxbx", "cx0xsx", "cx0xsx", "cxAxsx", "cxBxbx", "cxE0sx", "cxE0sx", "xxG0sx", "xxG0sx", "xxG0sx", "xxG0sx", "xxG0sx", "xxF0bx", "cxE0sx", "cxCxsx", "cxBxsx", "xxBxsx", "xxAxxx"],
         ["xx0xsx", "xx0xxx", "xxaxxx", "xxaxxx", "xxaxsx", "xxbxxx", "xxaxxx", "xxBxsx", "xxC0sx", "xxE0bx", "xxF0sx", "xxG0sx", "xxH0sx", "cxH0sx", "cxH0sx", "cxH0bx", "cxH0bx", "cxH0wx", "cxG0bx", "xxF0bx", "xxE0sx", "xxD0sx", "xxCxsx", "xxBxxx"],
         ["xxAxxx", "xxAxxx", "xxbxsx", "xxbxxx", "xxcxsx", "xxcxxx", "xxbxxx", "xxaxsx", "xxAxxx", "xxD0sx", "xxE0sx", "xxF0sx", "xxG0sx", "cxH0wx", "cxG0wx", "cxG0bx", "cxF0wx", "cxC0sx", "cxC0sx", "cxCxsx", "cxBxsx", "cxBxsx", "cxBxsx", "cxBxsx"],
         ["wxAxsw", "wxAxsw", "wf0xsw", "wx0xsw", "wx0xsw", "xx0xsx", "xx0xsx", "pfAxsw", "pfAxsw", "pfBxsw", "cxD0bx", "wxCxsw", "wxF0sw", "cxE0bx", "wxBxsw", "txAxsw", "wxAxxw", "wxAxsw", "wx0xsw", "wx0xsw", "wxaxsw", "wxaxsw", "wxaxsw", "wxaxsw"],
         ["wxaxxw", "cxbxsx", "cxbxsx", "cxbxsx", "cxcxsx", "cxcxsx", "cxdxsx", "xxcxsx", "xxbxbx", "xxaxsx", "cx0xsx", "cx0xsx", "cxAxsx", "cxAxsx", "cxAxsx", "cxAxsx", "xxAxsx", "xxAxsx", "xxAxsx", "xxaxsx", "xxaxsx", "xxaxxx", "cxbxsx", "cxcxsx"],
         ["cxdxxx", "xxfxsx", "xxfxxx", "xxfxxx", "xxfxxx", "xxfxxx", "xxfxsx", "cxdxsx", "cxbxsx", "cx0xsx", "cx0xsx", "cxBxsx", "cxBxbx", "cxAxbx", "cxBxsx", "cxBxsx", "cxBxsx", "cxAxbx", "cx0xsx", "xxaxsx", "xxbxxx", "xxcxsx", "xxcxsx", "xxdxxx"],
         ["xxdxxx", "xxfxsx", "xxexsx", "xxfxxx", "xxexxx", "xxexxx", "xxexxx", "xxcxsx", "xxaxsx", "xx0xwx", "cxAxsx", "cxBxsx", "cxCxwx", "cxBxbx", "cxCxbx", "cxBxbx", "cxAxbx", "cxAxsx", "cxAxsx", "cx0xsx", "cx0xsx", "cxaxbx", "xxaxsx", "xxaxsx"],
         ["xxbxsx", "cxaxsx", "cxaxsx", "cxaxsx", "cxbxsx", "cxbxsx", "cxbxsx", "wxaxsw", "wfbxsw", "wfbxbw", "pfbxsw", "pfaxsw", "pf0xbw", "cx0xwx", "wxAxbw", "wxAxbw", "cxBxbx", "cxAxsx", "cxAxsx", "cx0xsx", "cx0xsx", "cx0xsx", "cx0xsx", "cxbxbx"],
         ["cxcxwx", "cxcxbx", "cxcxsx", "cxdxsx", "wxdxsw", "wxdxsw", "wxdxsw", "wxcxsw", "wxcxsw", "wxcxww", "cxdxwx", "cxdxwx", "cxbxwx", "cxdxwx", "cxexwx", "cxbxwx", "xxcxwx", "xxcxgx", "xxdxbx", "xxexsx", "xxfxsx", "xxfxsx", "xxgxsx", "xxgxsx"],
         ["xxhxxx", "xxgxsx", "xxhxsx", "xxgxsx", "xxgxsx", "xxhxxx", "xxfxsx", "xxexsx", "xxbxsx", "xxaxsx", "xx0xbx", "xxAxbx", "xxCxsx", "xxCxbx", "xxDxbx", "xxDxsx", "cxCxbx", "cxDxbx", "cxCxbx", "xxAxsx", "xx0xsx", "xxaxsx", "xxbxsx", "xxbxsx"],
         ["xxcxsx", "xxdxxx", "xxexxx", "xxexxx", "xxhxxx", "xxgxxx", "xxgxxx", "xxdxxx", "xxaxxx", "xxAxxx", "xxCxsx", "xxC0sx", "xxCxbx", "xxD0sx", "xxC0sx", "xxD0wx", "cxD0bx", "cxCxwx", "cxAxbx", "cx0xsx", "cxaxsx", "cxaxsx", "cxaxsx", "cxaxsx"],
         ["cxaxsx", "cxbxsx", "cxbxsx", "cxbxsx", "cxbxsx", "cxbxsx", "cxbxsx", "cxaxsx", "cxAxwx", "cxAxbx", "cxBxbx", "cxBxbx", "cxAxbx", "cxAxwx", "wxaxbw", "wxbxsw", "cxbxsx", "cx0xsx", "cx0xsx", "cx0xsx", "cxaxbx", "cx0xsx", "cx0xsx", "wxaxsw"],
         ["wxbxsw", "cxbxsx", "cxbxsx", "cxbxsx", "xxbxsx", "xxbxsx", "xfbxsx", "cxaxsx", "cx0xsx", "cxBxbx", "cxBxsx", "cxD0bx", "cxD0sx", "xxE0sx", "xxF0bx", "xxF0sx", "xxF0sx", "xxE0sx", "xxE0sx", "xxBxsx", "xx0xsx", "xxaxxx", "xxaxxx", "xxbxsx"],
         ["xxbxxx", "xxcxxx", "xxcxxx", "xxcxxx", "cxcxxx", "cxbxxx", "cxcxxx", "wxbxsw", "wfbxsw", "wxaxsw", "cxBxsx", "cxBxbx", "cxBxsx", "cxBxsx", "cxBxsx", "cxE0sx", "cxD0sx", "cxE0sx", "cxE0sx", "xxD0sx", "xxD0sx", "xxD0sx", "cxD0sx", "cxC0sx"],
         ["cxCxsx", "cxBxsx", "cxBxsx", "cxBxsx", "cxBxsx", "cxBxsx", "cxBxsx", "cxCxsx", "cxD0bx", "cxE0bx", "cxE0bx", "cxF0bx", "cxF0bx", "cxH0bx", "cxH0bx", "cxH0bx", "cxG0bx", "cxG0bx", "cxG0sx", "xxE0sx", "xxE0sx", "xxCxsx", "xxCxxx", "xxBxsx"],
         ["xxBxsx", "xxBxsx", "xxCxsx", "xxCxsx", "cxAxsx", "cx0xsx", "cx0xsx", "xxBxsx", "xxC0wx", "xxD0wx", "cxE0bx", "cxD0bx", "cxD0sx", "cxF0bx", "cxE0sx", "cxD0bx", "xxE0bx", "xxE0sx", "xxBxgx", "cx0xsx", "cxaxsx", "wxaxbw", "cxcxsx", "cxdxbx"],
         ["cxexsx", "xxexsx", "xxexbx", "xxfxsx", "xxgxsx", "xxgxsx", "xxhxbx", "xxgxbx", "xxgxwx", "wxgxbw", "wxgxbw", "wxexsw", "wxexsw", "cxdxsx", "cxdxsx", "cxdxsx", "cxdxsx", "cxdxsx", "cxdxsx", "cxexsx", "cxdxxx", "cxexxx", "xxhxsx", "xxixxx"],
         ["xxixxx", "xxhxsx", "xxgxxx", "xxgxsx", "cxfxsx", "cxfxsx", "cxfxsx", "cxfxsx", "cxexsx", "cxcxsx", "cxbxsx", "cxbxsx", "cxaxsx", "xxaxsx", "xxAxsx", "xx0xsx", "xx0xsx", "xxaxsx", "xxaxsx", "xxcxsx", "xxdxsx", "xxexsx", "xxexxx", "xxhxsx"]],
        ["R",
         ["xxcxxx", "xxcxxx", "xxdxxx", "xxdxxx", "cxdxxx", "cxdxxx", "xfdxxx", "xfaxxx", "xfAxsx", "xfCxxx", "cxExsx", "cxG0sx", "cxH0bx", "cxI0bx", "cxI0bx", "cxJ0wx", "cxI0sx", "cxI0bx", "cxFxsx", "cxExsx", "cxExsx", "cxDxsx", "xxDxxx", "xxExsx"],
         ["xxExsx", "cxDxsx", "cxDxsx", "cxDxsx", "cxDxsx", "cxDxsx", "cxDxsx", "cxExsx", "cxFxsx", "cxH0sx", "cxH0sx", "cxJ0bx", "cxI0bx", "cxI0bx", "cxJ0bx", "cxJ0bx", "cxI0sx", "cxH0sx", "cxI0sx", "cxH0sx", "cxG0sx", "cxG0sx", "xxG0sx", "xxGxxx"],
         ["xxFxsx", "xxFxsx", "xxExsx", "xxDxsx", "cxDxsx", "cxExsx", "cxExsx", "cxFxsx", "cxG0bx", "cxI0sx", "xxJ0bx", "xxL0sx", "xxL0bx", "cxM0sx", "cxM0bx", "cxK0bx", "cxK0bx", "cxJ0bx", "cxH0sx", "cxGxsx", "cxFxsx", "cxExxx", "xxCxsx", "xxCxsx"],
         ["xxCxxx", "xxAxxx", "xxAxsx", "xxAxxx", "xx0xxx", "xf0xsx", "xf0xxx", "xxBxxx", "xxDxxx", "xxFxsx", "cxGxsx", "cxH0sx", "cxH0sx", "cxI0sx", "cxJ0sx", "cxJ0sx", "xxK0bx", "xxJ0bx", "xxH0bx", "xxFxsx", "xxExsx", "xxExsx", "xxDxsx", "xxDxxx"],
         ["xxCxxx", "xxCxxx", "xxCxxx", "xxBxxx", "xxBxxx", "xxAxxx", "xxAxxx", "xxDxxx", "xxG0sx", "xxJ0sx", "xxL0sx", "xxN0sx", "xxN0wx", "wxI0sw", "wxM0sw", "wxO0ww", "xxN0wx", "xxN0bx", "xxM0bx", "xxK0sx", "xxK0wx", "xxJ0sx", "xxI0sx", "wxG0ww"],
         ["wxFxsw", "wxExsw", "wxCxsw", "wxCxbw", "cxCxwx", "cxBxbx", "cxBxbx", "wxBxsw", "wxCxbw", "wxCxsw", "cxDxbx", "cxExbx", "cxExsx", "cxFxsx", "cxFxsx", "cxFxbx", "cxFxbx", "cxExbx", "cxDxbx", "cxBxsx", "cx0xsx", "cxaxsx", "cxaxbx", "cxbxsx"],
         ["cxbxsx", "xxcxsx", "xxcxsx", "xxdxsx", "cxdxsx", "cxcxsx", "cxdxsx", "cxbxsx", "cx0xsx", "cxBxsx", "cxBxsx", "cxDxsx", "cxCxsx", "cxExbx", "cxExxx", "cxExsx", "cxCxbx", "cxBxsx", "cxBxsx", "cxAxbx", "cxaxsx", "cxbxsx", "cxbxsx", "cxcxsx"],
         ["cxbxsx", "cxcxsx", "cxcxbx", "cxdxsx", "cxexbx", "cxfxsx", "cxgxsx", "cxgxsx", "cxfxsx", "cxexwx", "cxdxsx", "cxdxbx", "cxcxsx", "cxcxsx", "cxbxsx", "cxbxsx", "cxbxbx", "cxbxsx", "cxcxsx", "cxexsx", "cxfxsx", "cxgxsx", "cxgxsx", "cxgxsx"],
         ["cxgxsx", "xxhxsx", "xxhxsx", "xxixsx", "cxixsx", "cxixsx", "cxixsx", "cxhxbx", "cxgxsx", "cxfxbx", "cxexbx", "cxdxgx", "cxcxwx", "cxcxwx", "cxcxgx", "cxcxgx", "cxdxwx", "cxdxbx", "cxexbx", "cxexbx", "cxfxbx", "cxfxbx", "cxfxsx", "cxfxsx"],
         ["cxexbx", "cxexwx", "cxexsx", "wxexbw", "wxexsw", "wxdxbw", "wxexww", "wxexgw", "wfexww", "wfexgw", "wfexgw", "wffxgw", "wfexgw", "wfexww", "wfexww", "wfexgw", "wfexww", "wfexww", "wfdxbw", "wfdxbw", "wfcxsw", "wfcxsw", "wfcxsw", "wfbxsw"],
         ["wfbxxw", "wfbxxw", "wfbxsw", "wfcxsw", "cxcxsx", "cxcxsx", "cxcxsx", "cxcxbx", "cxcxbx", "cxcxbx", "cxaxbx", "cxaxsx", "cx0xsx", "cx0xsx", "cx0xsx", "cxAxsx", "cxAxsx", "cxAxsx", "cx0xsx", "xxbxsx", "xxcxxx", "xxdxxx", "xxexxx", "xxexxx"],
         ["xxexxx", "xxfxxx", "xxgxxx", "xxgxxx", "xxgxsx", "xxgxsx", "xxgxxx", "xxexxx", "xxaxxx", "xxAxsx", "xxBxsx", "xxDxsx", "xxDxxx", "cxExsx", "cxExsx", "cxExbx", "xxExbx", "xxDxbx", "xxBxsx", "xxAxsx", "xx0xxx", "xxaxxx", "xxcxsx", "xxcxsx"],
         ["xxbxxx", "xfaxsx", "xfaxsx", "xfcxsx", "xxdxxx", "xxcxsx", "xxcxsx", "xxbxsx", "xxAxsx", "xxCxbx", "xxExbx", "xxFxbx", "xxFxbx", "xxGxbx", "xxGxbx", "xxG0bx", "xxGxbx", "xxFxbx", "xxExsx", "xxDxsx", "xxCxsx", "xxBxsx", "xxBxsx", "xxAxsx"],
         ["xxAxxx", "xxaxsx", "xxaxsx", "xxaxxx", "xxaxsx", "xx0xxx", "xx0xxx", "cxAxsx", "cxCxsx", "cxExsx", "xxH0sx", "xxH0sx", "xxI0sx", "cxI0sx", "cxK0sx", "cxJ0sx", "cxI0bx", "cxH0wx", "cxFxsx", "xxExsx", "xxDxsx", "xxDxsx", "xxBxsx", "xxBxsx"],
         ["xxBxxx", "cxBxsx", "cxAxsx", "cxAxsx", "cxBxxx", "cxBxxx", "cxAxxx", "xxCxxx", "xxExxx", "xxGxxx", "xxI0sx", "xxJ0sx", "xxI0sx", "cxJ0xx", "cxI0sx", "cxJ0sx", "xxJ0sx", "xxI0sx", "xxGxsx", "xxFxsx", "xxExxx", "xxCxsx", "xxDxxx", "xxCxsx"],
         ["xxCxsx", "xxBxsx", "xxCxxx", "xxAxsx", "xxBxxx", "xxAxxx", "xx0xsx", "xxBxxx", "xxExsx", "xxGxxx", "xxH0sx", "xxJ0sx", "xxK0sx", "xxK0sx", "xxK0sx", "xxK0sx", "xxK0sx", "xxI0bx", "xxGxsx", "xxExsx", "xxDxsx", "xxDxsx", "xxCxxx", "xxAxxx"],
         ["xxAxxx", "xxAxxx", "xx0xxx", "xx0xxx", "xxaxxx", "xf0xxx", "xf0xxx", "xfAxxx", "xfBxxx", "xfCxxx", "cxGxxx", "cxH0xx", "cxJ0sx", "cxJ0sx", "cxI0bx", "cxH0bx", "xxH0sx", "xxH0bx", "xxFxsx", "xxExsx", "xxDxsx", "xxCxxx", "xxCxsx", "xxCxxx"],
         ["xxBxxx", "xx0xxx", "xx0xxx", "xxAxxx", "xxBxxx", "xxBxxx", "xxAxxx", "xxBxsx", "xxCxbx", "xxCxsx", "cxExsx", "cxFxwx", "cxGxbx", "xxG0bx", "xxH0bx", "xxG0sx", "xxFxwx", "xxCxwx", "xxAxbx", "xxaxbx", "xxcxwx", "xxcxsx", "xxcxsx", "xxcxsx"],
         ["xxcxbx", "cxcxsx", "cxcxbx", "cxcxbx", "xxdxsx", "xxexsx", "xxexsx", "xxdxsx", "xxdxsx", "xxbxsx", "xxbxsx", "xxaxxx", "xxAxxx", "xxBxsx", "xxBxsx", "xxCxbx", "xxBxsx", "xxBxsx", "xx0xsx", "cxbxsx", "cxbxxx", "cxdxxx", "xxdxxx", "xxexsx"],
         ["xxdxsx", "xxdxsx", "xxexsx", "xxexxx", "xxexsx", "xxexxx", "xxfxxx", "cxexsx", "cxcxsx", "cxbxbx", "cxaxbx", "cx0xbx", "cx0xbx", "cx0xwx", "wx0xbw", "wxaxsw", "cxaxbx", "cxaxbx", "cxaxsx", "cxaxbx", "cxbxsx", "cxbxbx", "cxbxsx", "cx0xsx"],
         ["cx0xwx", "cx0xbx", "cx0xbx", "cx0xsx", "cx0xxx", "cxAxsx", "cxAxsx", "xxBxsx", "xxFxsx", "xxI0bx", "xxK0wx", "xxM0bx", "xxM0hx", "xxM0gx", "xxM0gx", "xxL0hx", "txK0gw", "txFxww", "txFxgw", "xxExgx", "xxBxgx", "xxAxwx", "xxaxwx", "xxcxwx"],
         ["xxexgx", "xxexwx", "xxfxwx", "xxgxwx", "xxhxsx", "xxhxbx", "xxixsx", "cxixsx", "cxhxwx", "cxgxbx", "cxfxwx", "cxexbx", "cxexbx", "cxcxxx", "cxbxxx", "cxaxsx", "cxaxsx", "cxcxbx", "cxexbx", "xxgxsx", "xxfxxx", "xxhxxx", "xxixsx", "xxixxx"],
         ["xxjxxx", "xxjxxx", "xxkxsx", "xxkxxx", "xxlxsx", "xxkxxx", "xxlxsx", "xxjxxx", "xxgxxx", "xxdxxx", "xxbxxx", "xxaxxx", "xx0xxx", "xxAxsx", "xxBxsx", "xxAxbx", "xx0xsx", "xxaxsx", "xxcxsx", "xxdxsx", "xxexsx", "xxfxsx", "xxgxsx", "xxgxsx"],
         ["xxgxsx", "xxhxbx", "xxixsx", "xxixsx", "cxixbx", "cxixbx", "cxixbx", "cxixbx", "cxixbx", "cxhxbx", "cxfxbx", "cxdxwx", "cxbxwx", "cxaxgx", "cx0xwx", "cxaxbx", "cx0xwx", "cxaxwx", "cxaxwx", "cxaxbx", "cx0xbx", "cx0xbx", "cx0xwx", "wxaxbw"],
         ["wxcxsw", "wxcxbw", "wfcxww", "wfbxbw", "wfcxbw", "wxcxbw", "wfcxsw", "wxbxbw", "wfbxsw", "wfbxsw", "wfaxbw", "wf0xsw", "xf0xsx", "cxAxbx", "cxBxbx", "wxBxsw", "wfBxbw", "wfBxbw", "wfBxbw", "cxBxbx", "cxCxbx", "cxCxsx", "wxCxww", "wxBxbw"],
         ["wxCxww", "cxBxwx", "cxCxbx", "cxCxsx", "wxCxsw", "wxCxsw", "wxCxsw", "cxCxsx", "cxCxsx", "cxCxbx", "cxAxgx", "cxAxbx", "cx0xwx", "cxBxwx", "cx0xwx", "cx0xgx", "cxaxbx", "cx0xsx", "cxbxbx", "xxdxbx", "xxexbx", "xxfxsx", "xxgxxx", "xxgxxx"],
         ["xxgxxx", "cxgxxx", "cxgxxx", "cxgxxx", "xxhxsx", "xxhxsx", "xxjxxx", "cxjxxx", "cxgxxx", "cxdxsx", "cxcxxx", "cxbxsx", "cxaxsx", "cxaxsx", "cxaxbx", "cxbxbx", "cxbxsx", "cxcxsx", "cxdxbx", "cxdxsx", "cxexsx", "cxexsx", "cxexsx", "cxfxxx"],
         ["cxfxxx", "cxgxxx", "cxgxxx", "cxhxxx", "cxhxsx", "cxhxxx", "cxhxxx", "cxixxx", "cxdxsx", "cxaxsx", "xx0xsx", "xxBxwx", "xxCxbx", "xxDxwx", "xxDxbx", "xxCxwx", "cx0xsx", "cxcxbx", "wxdxww", "cxexsx", "wxfxsw", "wxgxsw", "wxgxsw", "wxgxsw"],
         ["wxgxxw", "wxhxsw", "wxhxsw", "wxhxsw", "xxixsx", "xxjxsx", "xxjxsx", "xxixsx", "xxhxsx", "xxfxsx", "xxdxsx", "xxdxbx", "xxcxsx", "cxcxsx", "cxcxsx", "cxbxbx", "xxbxbx", "xxdxbx", "xxexsx", "xxfxsx", "xxgxsx", "xxhxsx", "xxixsx", "xxixsx"],
         ["xxjxsx", "cxixxx", "cxixsx", "cxixsx", "cxixxx", "wxixxw", "wxixxw", "cxhxxx", "cxhxxx", "cxfxsx", "cxfxsx", "cxfxsx", "cxfxsx", "cxfxsx", "cxfxsx", "cxfxxx", "cxfxsx", "cxgxsx", "cxgxsx", "cxhxsx", "cxhxsx", "wxhxsw", "wfixsw", "wfixsw"]],
        ["H",
         ["wfAxsw", "wfAxsw", "wfAxsw", "wx0xsw", "wf0xsw", "wf0xsw", "wx0xsw", "wx0xsw", "wx0xsw", "wx0xsw", "cxAxbx", "cxAxbx", "cxAxbx", "cxBxsx", "wxAxsw", "wxAxsw", "cxBxsx", "cxAxsx", "cxAxsx", "cxAxsx", "wxAxsw", "wxAxsw", "cxAxsx", "cxBxsx"],
         ["cxBxsx", "cxBxsx", "cxAxbx", "wxAxsw", "wxAxsw", "wfAxsw", "wfAxsw", "wfAxsw", "wfAxsw", "wxAxsw", "cxBxsx", "wfBxsw", "wfCxsw", "xfCxsx", "xfDxsx", "xfDxxx", "wfDxsw", "wfDxsw", "wfCxsw", "cxCxsx", "cxCxsx", "cxCxsx", "cxCxsx", "cxCxsx"],
         ["cxCxsx", "cxCxsx", "cxCxsx", "cxCxsx", "cxCxsx", "cxCxxx", "cxCxsx", "cxCxxx", "cxCxxx", "cxDxxx", "cxExsx", "cxExsx", "cxFxsx", "cxFxsx", "cxGxsx", "cxGxbx", "cxGxbx", "cxGxbx", "cxGxsx", "cxGxsx", "cxGxsx", "cxGxsx", "cxGxsx", "cxGxxx"],
         ["cxGxsx", "cxHxsx", "cxJxsx", "cxKxbx", "cxMxsx", "cxMxbx", "cxMxsx", "wxMxsw", "wxJxgw", "wxIxww", "xxJxgx", "xxKxwx", "xxIxhx", "xxHxhx", "xxGxgx", "xxGxwx", "xxFxgx", "xxDxgx", "xxCxbx", "xxBxbx", "xxAxbx", "xx0xsx", "xx0xbx", "xxaxsx"],
         ["xxbxsx", "xxcxsx", "xxdxsx", "xxdxsx", "xxdxsx", "xxdxsx", "xxexsx", "cxdxsx", "cxaxbx", "cx0xwx", "cxAxbx", "cxAxwx", "cxBxwx", "cxCxbx", "cxBxbx", "cxBxbx", "cxCxsx", "cxBxsx", "cxBxsx", "cxAxsx", "cxAxbx", "cxAxsx", "cxAxsx", "cxAxsx"],
         ["cxAxsx", "cxAxsx", "cxBxsx", "cxAxsx", "wxAxsw", "wxAxsw", "wxAxsw", "wxAxsw", "wxAxsw", "wxBxxw", "wxBxsw", "xfCxsx", "wfDxxw", "wfExsw", "wfFxsw", "xfFxsx", "xfFxxx", "xfGxsx", "xfFxxx", "xfFxsx", "xfGxsx", "xfGxxx", "xfHxsx", "xfHxsx"],
         ["xfGxsx", "wxFxsw", "wfExsw", "wfExbw", "cxExbx", "cxExsx", "cxExsx", "cxExsx", "cxExsx", "cxFxsx", "wfExsw", "wfExsw", "wfExsw", "cxExsx", "cxExsx", "cxExsx", "wfDxsw", "wfDxsw", "xfDxsx", "cxDxsx", "wxDxsw", "wxDxsw", "cxCxsx", "cxCxsx"],
         ["cxBxsx", "cxBxsx", "cxAxsx", "cxAxsx", "cxAxbx", "cxAxsx", "cxAxbx", "cxAxsx", "cxAxsx", "cxAxsx", "cxCxsx", "txCxww", "xfDxwx", "wfDxsw", "xfDxsx", "xfExsx", "xfExsx", "xfExsx", "xfExsx", "xfExsx", "xfExsx", "xfExsx", "xfFxsx", "xfFxxx"],
         ["xfFxxx", "xfFxxx", "xfFxxx", "xfExxx", "xfExxx", "xfExsx", "xfExxx", "xfFxxx", "xfHxxx", "xfKxsx", "xxOxsx", "xxQ0sx", "xxS0sx", "xxS0sx", "xxT0bx", "xxT0bx", "xxS0sx", "xxR0bx", "xxPxsx", "xxOxsx", "xxNxsx", "xxNxsx", "xxMxxx", "xxLxsx"],
         ["xxJxxx", "xxJxsx", "xxJxsx", "xxJxsx", "xxJxsx", "xxJxsx", "xxJxsx", "cxKxsx", "cxMxsx", "cxNxsx", "xxPxbx", "xxQ0bx", "xxR0bx", "cxR0wx", "cxS0bx", "cxS0wx", "xxR0wx", "xxQxsx", "xxNxsx", "cxLxsx", "cxLxsx", "cxLxsx", "cxMxsx", "wxMxbw"],
         ["wxMxbw", "cxMxsx", "cxMxbx", "cxMxsx", "cxMxsx", "cxMxsx", "cxMxsx", "cxMxsx", "cxMxsx", "cxMxwx", "cxNxbx", "cxLxwx", "cxKxbx", "cxIxwx", "cxIxsx", "cxGxbx", "cxFxgx", "cxExsx", "cxExwx", "cxDxbx", "cxDxwx", "cxCxbx", "cxCxbx", "cxBxwx"],
         ["cx0xbx", "xxaxbx", "xxaxsx", "xxbxsx", "cxbxbx", "cxbxbx", "cxbxsx", "xxbxbx", "xxaxbx", "xx0xwx", "xxAxwx", "xxBxwx", "xxBxwx", "cxBxbx", "cxBxbx", "cxBxbx", "cxBxbx", "cxAxbx", "cx0xsx", "cxaxsx", "wxaxsw", "wxbxsw", "wxbxsw", "wxbxsw"],
         ["wxcxsw", "wxcxsw", "wxcxsw", "wxcxsw", "cxcxsx", "cxcxsx", "cxcxsx", "cxcxsx", "cxbxsx", "cxaxsx", "cx0xbx", "cx0xbx", "cx0xbx", "cxAxwx", "cxBxsx", "cxAxbx", "cxAxbx", "cxAxsx", "cx0xsx", "cx0xsx", "cxaxsx", "cxcxsx", "xxdxxx", "xxdxsx"],
         ["xxdxsx", "xxgxxx", "xxgxxx", "xxgxxx", "xxgxxx", "xxgxxx", "xxgxxx", "cxgxxx", "cxdxxx", "cx0xxx", "xxDxsx", "xxExwx", "xxFxbx", "xxGxbx", "xxFxbx", "xxFxbx", "xxFxbx", "xxExsx", "xxDxsx", "xxBxsx", "xxAxxx", "xxaxxx", "xxbxxx", "xxcxxx"],
         ["xxcxxx", "cxcxsx", "cxcxsx", "cxbxxx", "xfaxxx", "wx0xxw", "wxAxxw", "wfAxsw", "wfBxxw", "wfCxsw", "wfDxsw", "wfDxsw", "wfDxsw", "cxExgx", "cxDxwx", "cxCxwx", "cxBxgx", "cxAxwx", "wx0xgw", "xxbxwx", "xxcxbx", "xxdxwx", "xxdxsx", "xxdxsx"],
         ["xxdxbx", "xxdxsx", "xxexsx", "xxdxbx", "xxexsx", "xxfxsx", "xxfxsx", "xxexsx", "xxdxbx", "xxcxsx", "cxaxwx", "cxaxwx", "cx0xwx", "cxBxwx", "cxCxbx", "cxCxwx", "cxCxbx", "cxCxsx", "cxBxbx", "cxAxsx", "cxAxsx", "cxAxbx", "cxAxsx", "cxAxsx"],
         ["cxAxsx", "xx0xsx", "xxaxsx", "xxaxsx", "cxaxsx", "cxaxsx", "cxaxsx", "cxaxsx", "wxaxsw", "wxbxww", "xxbxsx", "xxaxbx", "wxdxsw", "wxcxgw", "wxaxgw", "wxbxgw", "wxbxgw", "wxcxww", "wxdxbw", "xxexbx", "xxexsx", "xxfxbx", "xxexwx", "sxgxbx"],
         ["sxgxbx", "sxgxsx", "sxgxsx", "sxgxsx", "xxhxsx", "xxhxsx", "xxhxsx", "cxhxsx", "cxgxxx", "cxgxxx", "cxexxx", "cxdxsx", "cxcxsx", "xxcxsx", "xxaxbx", "xx0xbx", "xx0xwx", "xxaxsx", "xxbxbx", "xxcxsx", "xxcxsx", "xxcxbx", "xxcxbx", "xxdxsx"],
         ["xxdxsx", "xxcxsx", "xxcxsx", "xxbxsx", "xxbxsx", "xxbxsx", "xxbxsx", "cxbxbx", "cxaxbx", "cx0xwx", "cxBxbx", "cxCxbx", "cxDxsx", "cxGxbx", "cxGxsx", "cxGxsx", "cxFxwx", "cxExwx", "cxDxsx", "cxDxsx", "cxDxbx", "cxCxwx", "wxCxgw", "wxBxgw"],
         ["wxBxww", "cxAxwx", "cxBxbx", "wxBxsw", "xxAxwx", "xx0xsx", "xx0xsx", "xx0xsx", "xxAxsx", "xxBxwx", "cxCxbx", "cxDxbx", "cxCxbx", "cxDxbx", "cxCxwx", "cxCxbx", "cxCxbx", "cxBxsx", "cxaxbx", "cxbxwx", "cxbxbx", "cxbxwx", "cxdxwx", "cxexbx"],
         ["cxdxwx", "cxexwx", "cxgxgx", "cxgxbx", "cxhxwx", "cxhxsx", "cxixsf", "cxhxsx", "cxgxbx", "cxfxsx", "cxfxsx", "cxexbx", "cxexbx", "cxdxwx", "cxcxsx", "cxcxbx", "cxcxsx", "cxdxsx", "cxdxsx", "cxexsx", "cxdxsx", "cxexsx", "cxexsx", "cxexsx"],
         ["cxexsx", "cxdxbx", "cxdxbx", "cxexsx", "cxdxsx", "cxdxsx", "cxexsx", "cxdxsx", "cxcxsx", "cxaxsx", "cx0xsx", "cxBxsx", "cxCxsx", "cxBxsx", "cxBxsx", "cxBxsx", "cxBxsx", "cxAxsx", "cxaxsx", "xxcxsx", "xxcxsx", "xxfxxx", "xxfxxx", "xxgxxx"],
         ["xxgxxx", "xxhxxx", "xxhxxx", "xxixxf", "cxhxxx", "wxfxsw", "wfexsw", "xfcxxx", "xfcxxx", "xfaxsx", "cxaxsx", "cxaxsx", "cx0xbx", "cxAxbx", "wxAxsw", "wxaxww", "cx0xgx", "cxbxbx", "wxcxww", "cxcxbx", "cxcxsx", "cxdxbx", "wxexbw", "wxexbw"],
         ["wxexsw", "cxexsx", "cxexbx", "cxexbx", "cxexbx", "cxfxbx", "cxfxbx", "cxexbx", "cxexbx", "cxdxwx", "cxdxwx", "cxdxwx", "cxcxwx", "cxcxwx", "cxdxwx", "cxdxwx", "cxdxwx", "cxexsx", "cxexbx", "cxfxsx", "cxfxsx", "cxfxsx", "cxfxsx", "cxfxsx"],
         ["cxfxsx", "cxfxsx", "cxgxsx", "cxgxsx", "cxgxsx", "cxgxsx", "cxfxsx", "cxfxsx", "cxfxsx", "cxexsx", "xxcxsx", "xxbxsx", "xxaxsx", "cxaxxx", "cxaxsx", "cx0xxx", "cxaxsx", "cxaxxx", "cxcxsx", "cxdxxx", "cxdxxx", "cxexsx", "cxdxxx", "cxdxxx"],
         ["cxdxsx", "cxdxxx", "cxdxxx", "cxdxsx", "cxdxsx", "cxdxsx", "cxdxsx", "cxdxsx", "cxdxsx", "cxcxsx", "cxcxsx", "wxbxww", "wxbxbw", "cxaxwx", "cxaxwx", "cxbxwx", "cxbxwx", "cxcxwx", "cxcxwx", "cxcxbx", "cxdxwx", "cxdxsx", "cxdxbx", "cxdxwx"],
         ["cxdxbx", "cxdxwx", "wxdxbw", "wxdxbw", "cxdxwx", "sxexbx", "sxfxbx", "sxgxbx", "sxgxbx", "sxexbx", "cxdxwx", "cxbxwx", "cxaxwx", "cxbxgx", "cxbxwx", "wxcxbw", "wxexbw", "wxfxbw", "sxfxbx", "sfgxsx", "sfgxbx", "sfgxsx", "sfgxsx", "sxgxsx"],
         ["sxhxxx", "sfhxsx", "sxgxsx", "sxgxsx", "sfhxsx", "sfgxxx", "sfgxxx", "cxgxxx", "cxgxxx", "cxfxsx", "cxfxsx", "cxexsx", "cxexsx", "cxdxsx", "cxcxsx", "cxbxsx", "cxcxsx", "cxcxsx", "cxcxxx", "cxcxsx", "cxcxsx", "wxcxxw", "wxcxxw", "wfcxsw"],
         ["wfdxsw", "cxdxsx", "cxdxsx", "cxdxsx", "cxdxsx", "cxdxsx", "wxcxsw", "wxcxsw", "wxcxsw", "wxdxsw", "cxcxsx", "wxbxbw", "wxcxww", "cxbxsx", "cx0xwx", "cx0xwx", "cx0xwx", "cxaxwx", "cxbxwx", "cxbxsx", "cxbxsx", "cxexsx", "xxfxxx", "xxfxxx"],
         ["xxgxxx", "xxhxxx", "xxhxxx", "xxhxxx", "xxhxsx", "xxgxsx", "xxgxsx", "xxixxf", "xxfxxx", "xxcxsx", "xxaxsx", "xx0xsx", "xxBxsx", "xxCxsx", "xxDxsx", "xxDxsx", "xxBxsx", "xxAxsx", "xx0xsx", "xxaxsx", "xxaxsx", "xxaxsx", "cx0xsx", "wxaxxw"],
         ["wxaxsw", "cxaxsx", "cxaxbx", "wxaxsw", "wxaxsw", "wx0xsw", "wx0xsw", "wf0xsw", "pf0xsw", "wfAxsw", "wfBxsw", "wfBxsw", "wfCxsw", "xfDxsx", "wfDxsw", "wxDxbw", "cxDxsx", "cxCxsx", "cxAxsx", "xx0xsx", "xxaxsx", "xxbxsx", "xxcxsx", "xxcxxx"]],
        ["A",
         ["xxCxxx", "xxDxxx", "xxDxxx", "xxDxxx", "cxDxsx", "cxDxxx", "cxDxsx", "cxDxxx", "cxDxxx", "cxExxx", "wxFxxw", "wxFxsw", "wxFxsw", "wfFxsw", "wxFxsw", "wfFxxw", "wfFxxw", "wfFxsw", "wxFxsw", "wxExsw", "wxExsw", "pxExsw", "wxDxbw", "wxDxbw"],
         ["wxCxww", "wfCxbw", "wxCxgw", "wxCxbw", "cxCxsx", "cxCxsx", "wfCxbw", "wfBxww", "wfBxbw", "wfCxbw", "wfCxsw", "wfDxsw", "wfDxsw", "wfDxsw", "wfDxsw", "wfDxsw", "cxDxsx", "cxDxsx", "cxDxsx", "cxCxsx", "cxCxsx", "cxCxsx", "cxCxsx", "wxCxsw"],
         ["wxCxsw", "cxCxsx", "cxCxsx", "wxCxxw", "wxBxsw", "wxBxsw", "wxBxsw", "wxAxsw", "wxAxsw", "wxCxbw", "cxDxwx", "cxExbx", "cxExgx", "cxExwx", "cxDxwx", "cxExbx", "cxExsx", "cxDxbx", "cxCxsx", "cxCxbx", "cxCxsx", "cxCxsx", "cxBxsx", "cxAxsx"],
         ["cx0xsx", "xx0xsx", "xx0xsx", "xxaxsx", "xxaxsx", "xxbxxf", "xxcxxf", "xxdxxf", "xxaxxx", "xxBxsx", "xxDxsx", "xxExsx", "xxExsx", "cxExbx", "cxExwx", "cxDxwx", "cxDxgx", "cxDxwx", "cxDxbx", "cxDxwx", "cxDxwx", "cxCxbx", "cxCxbx", "cxCxbx"],
         ["cxDxsx", "cxDxsx", "cxFxbx", "cxFxsx", "cxFxsx", "wxExsw", "wxExbw", "wxFxsw", "wxFxbw", "wfFxbw", "wfGxsw", "wfGxsw", "wfHxsw", "cxIxsx", "cxIxsx", "wfIxsw", "cxIxsx", "cxIxsx", "cxHxsx", "cxHxsx", "cxHxsx", "cxHxsx", "cxHxsx", "cxHxsx"],
         ["cxHxsx", "cxGxsx", "cxGxsx", "cxHxbx", "wxHxsw", "wxGxsw", "wxGxww", "wxHxgw", "wxHxgw", "wxHxww", "wxHxbw", "wfHxsw", "wfLxww", "cxOxhx", "cxMxhx", "cxLxgx", "wxKxgw", "wxKxbw", "wxJxgw", "cxIxhx", "cxIxgx", "wxIxgw", "wxHxww", "wxGxbw"],
         ["wxGxww", "wxGxww", "wxGxww", "wxGxsw", "cxFxbx", "cxFxsx", "cxFxbx", "cxFxbx", "cxFxbx", "cxGxwx", "cxGxwx", "cxGxwx", "cxFxwx", "cxFxwx", "cxCxbx", "cxDxwx", "cxExbx", "cxCxbx", "cxDxwx", "cxDxwx", "cxCxbx", "cxCxwx", "cxCxwx", "cxCxbx"],
         ["cxCxbx", "cxCxwx", "cxCxbx", "cxCxsx", "cxCxbx", "cxCxbx", "cxCxsx", "cxCxsx", "cxCxsx", "cxDxbx", "cxDxsx", "wxCxsw", "wxDxbw", "cxDxbx", "cxExsx", "cxExsx", "cxDxbx", "cxDxbx", "cxDxsx", "cxCxsx", "cxCxsx", "cxBxsx", "xxAxsx", "xxaxxx"],
         ["xxaxxx", "cxbxsf", "cxaxxx", "cxbxsf", "cxbxxf", "cxaxxx", "cxAxsx", "cxAxsx", "cxAxwx", "sxAxbx", "sx0xbx", "sf0xbx", "sf0xbx", "sfaxsx", "sx0xbx", "wxAxww", "wfAxww", "wfAxbw", "wxBxbw", "wxBxsw", "wxBxsw", "wxBxbw", "cxBxbx", "cxBxwx"],
         ["cxAxbx", "xxAxwx", "xx0xwx", "xxaxgx", "cxbxwf", "cxbxgf", "cxcxgf", "xxcxwf", "xxcxwf", "xxbxgf", "cxbxgf", "cxaxhx", "bxaxgx", "cx0xbx", "cxAxgx", "cx0xwx", "cx0xwx", "cx0xbx", "cx0xbx", "xxbxbf", "xxbxsf", "sxbxsf", "xxcxsf", "xxcxsf"],
         ["xxcxsf", "cxbxbf", "sxbxsf", "sxcxsf", "sxcxsf", "sxcxsf", "sxcxsf", "cxcxsf", "cxcxsf", "cx0xsx", "cxAxsx", "cxAxsx", "cxBxsx", "cxBxsx", "sxBxsx", "sxAxsx", "cxAxxx", "cxAxxx", "cxAxsx", "cxBxsx", "cxAxsx", "cxAxsx", "cxaxxx", "cx0xsx"],
         ["cx0xsx", "cx0xsx", "cx0xsx", "cx0xxx", "cx0xxx", "cx0xsx", "cx0xsx", "cxAxsx", "cxAxsx", "cxCxxx", "cxCxsx", "cxExsx", "cxExsx", "cxExsx", "cxExsx", "cxExsx", "cxDxsx", "cxDxsx", "cxDxsx", "cxDxsx", "cxCxxx", "cxBxxx", "wxBxxw", "wxBxsw"],
         ["wfAxsw", "sf0xxx", "sfaxxx", "sfaxxx", "sfaxxx", "sf0xxx", "sx0xsx", "sx0xsx", "sx0xbx", "bxaxwx", "cxaxwx", "cxaxbx", "cxbxbf", "sxbxbf", "sxbxbf", "sxbxsf", "sxbxsf", "sxbxsf", "sxbxsf", "cxbxbf", "cxcxwf", "cxcxsf", "cxdxbf", "cxdxwf"],
         ["cxexbf", "xxfxsf", "xxfxsf", "xxgxsf", "cxgxxf", "cxgxsf", "sxhxsf", "sxhxsf", "sxhxsf", "sxgxs1", "sxgxs1", "sxgxx1", "sxexx1", "cxcxs1", "cxbxs1", "cxcxs1", "sxexb1", "sxfxb1", "sxgxx1", "xxgxs1", "xxgxx1", "xxgxx1", "cxgxs1", "cxhxx1"],
         ["cxgxs1", "cxgxs1", "cxgxs1", "cxgxs1", "cxfxb1", "cxfxb1", "cxfxs1", "cxexb1", "cxexb1", "cxdxw1", "cxdxb1", "cxaxg1", "cxaxg1", "cxaxw1", "cxaxw1", "cxaxb1", "sxaxs1", "bxbxw1", "sxbxb1", "sxbxb1", "bxbxw1", "sxaxb1", "sxaxb1", "sxaxb1"],
         ["sxaxs1", "sxaxs1", "sxaxs1", "sxaxs2", "sxaxs2", "sxaxs2", "sxaxs2", "sfaxs2", "sxaxs2", "sxaxs2", "sxaxs2", "sx0xb2", "sx0xb2", "sx0xs2", "sxAxb2", "bxAxw2", "bx0xw2", "bx0xw2", "sx0xs2", "sx0xs2", "wf0xs2", "wf0xs2", "wf0xb2", "xfAxs2"],
         ["xfAxs2", "cxAxs2", "cxAxs2", "cxAxs2", "cxAxs2", "sf0xs2", "wx0xs2", "cx0xb2", "cx0xb2", "cx0xs2", "cx0xs2", "cxAxb2", "cxAxb1", "cx0xw1", "cx0xs1", "cx0xw1", "cxaxs1", "cxbxs1", "cxbxx1", "xxcxs1", "xxcxs1", "xxcxs1", "xxcxs1", "xxdxs1"],
         ["xxdxs1", "cxdxs1", "cxexx1", "cxfxx1", "cxgxx1", "cxfxx1", "cxfxx1", "cxfxx1", "cxfxx1", "cxdxx1", "cxcxx1", "cxbxx1", "cxaxs1", "cx0xx1", "cx0xs1", "cx0xs1", "cx0xs1", "cx0xs1", "cx0xs1", "cx0xs1", "cx0xs1", "cx0xx1", "cx0xs1", "cx0xs1"],
         ["cxbxx1", "cxcxx1", "cxdxs1", "cxdxs1", "cxcxs1", "cxdxs1", "cxcxs1", "cxcxs1", "cxcxs1", "cxbxs1", "xx0xs1", "xxBxx1", "xxBxsx", "cxBxsx", "cxBxsx", "cxCxsx", "cxBxsx", "cxAxxx", "cxAxsx", "cxAxxx", "cxAxxx", "cxaxsx", "cxaxxx", "cxaxxx"],
         ["cxbxxf", "cxaxxx", "sxaxxx", "sx0xxx", "sx0xsx", "sx0xsx", "sxbxbf", "sxbxbf", "bxcxwf", "sxcxbf", "cxcxbf", "cxbxwf", "cxcxbf", "cxbxwf", "cxcxsf", "cxdxsf", "xxdxbf", "xxexsf", "xxexsf", "cxexsf", "cxexsf", "cxexbf", "cxdxbf", "cxdxbf"],
         ["sxdxsf", "cxdxsf", "cxcxbf", "cxbxsf", "sxbxbf", "sxbxbf", "bx0xwx", "bxbxw1", "bxbxg1", "bxcxw1", "cxcxg1", "cxexw1", "cxfxh1", "sxgxb1", "sxhxb1", "bxgxw1", "bxixw1", "sxkxs1", "sxkxs1", "sxkxb1", "sxlxb1", "sxmxs1", "xxnxs1", "xxoxb1"],
         ["xxpxs1", "xxpxs1", "xxpxs1", "xxpxs1", "xxpxs1", "xxpxs1", "xxoxs1", "xxnxs1", "xxmxs1", "xxlxs1", "xxlxb1", "xxkxb1", "xxjxs1", "xxixs1", "xxixs1", "xxhxs1", "xxixx1", "xxjxs1", "xxkxs1", "xxkxx1", "xxlxs1", "xxmxs1", "xxoxs1", "xxoxx1"],
         ["xxnxx1", "cxmxx1", "cxhxb1", "cxgxb1", "cxgxb1", "cxgxb1", "cxfxs1", "cxfxs1", "cxfxb1", "cxexb1", "cxexs1", "cxcxs1", "cxaxb1", "xx0xs1", "xx0xb1", "xx0xb1", "cx0xs1", "cxbxs1", "cxcxs1", "xxcxs1", "xxdxx1", "xxdxx1", "cxdxx1", "cxdxx1"],
         ["cxdxx1", "cxdxx1", "cxcxs1", "cxdxx1", "cxcxs1", "cxdxs1", "cxcxx1", "cxdxs1", "cxcxs1", "cxaxs1", "cx0xs1", "wxAxb1", "wxAxw1", "wx0xw1", "wf0xb1", "wfBxb1", "wfBxb1", "wfBxsw", "wfBxsw", "wfBxsw", "wfCxsw", "wfCxsw", "wfCxsw", "wfDxsw"],
         ["wfDxsw", "wfExsw", "wfExsw", "wfExsw", "cxExsx", "cxDxsx", "wxDxsw", "cxDxsx", "cxDxsx", "cxDxbx", "cxExbx", "cxFxsx", "cxFxbx", "cxExbx", "cxExsx", "cxExsx", "cxDxsx", "cxDxsx", "cxDxsx", "cxCxxx", "cxCxsx", "cxCxsx", "cxCxxx", "cxBxxx"],
         ["cxBxsx", "cxAxsx", "cxBxsx", "cxBxsx", "cxBxsx", "cxBxsx", "cxBxbx", "wfBxbw", "wxBxww", "wfCxgw", "wfCxww", "wfCxbw", "wfDxgw", "wfDxgw", "wfDxww", "wfDxbw", "wfDxsw", "wfDxsw", "wfExsw", "wfCxsw", "wxBxsw", "wxAxsw", "wxAxsw", "wxAxbw"],
         ["wx0xsw", "sx0xsx", "bx0xwx", "sxAxbx", "cx0xbx", "cx0xbx", "sx0xbx", "sx0xsx", "sxaxbx", "sxaxbx", "bxaxwx", "bx0xwx", "sx0xbx", "bx0xgx", "bx0xwx", "sxaxbx", "bxbxwf", "bxbxwf", "bxbxw1", "sxbxb1", "bxcxw1", "sxcxb1", "sxcxb1", "sxcxb1"],
         ["sxcxb1", "bxcxw1", "sxcxb1", "sxcxb1", "cxcxb1", "cxcxb1", "sxbxb1", "bxbxw1", "sxbxb1", "bxbxw1", "bxaxw2", "bx0xw2", "bx0xw2", "bxAxw2", "bxAxg2", "bxAxw2", "cx0xw2", "cx0xb2", "cx0xb2", "cx0xb2", "cx0xb2", "cx0xb2", "xx0xs2", "xx0xs2"],
         ["sxaxs2", "sxaxs2", "sxaxs2", "sxaxs2", "cxaxs2", "cxaxs2", "cx0xs2", "cx0xs2", "cx0xs2", "cxAxs2", "cxAxs1", "cx0xb1", "cx0xb1", "cx0xs1", "cx0xs1", "cxAxs1", "cxAxs1", "cx0xs1", "cx0xs1", "cx0xx1", "cx0xs1", "cx0xs1", "cx0xs1", "cx0xx1"],
         ["cxaxs1", "cxaxs1", "cxaxs1", "cxaxs1", "cxaxs1", "cxaxx1", "cxaxx1", "cxaxs1", "cxaxs1", "cxaxs1", "sxaxs1", "sx0xx1", "sx0xs1", "sx0xs1", "sx0xs1", "sx0xs1", "cx0xx1", "cx0xs1", "cx0xs1", "cx0xs1", "cx0xx1", "cx0xs1", "cxAxx1", "cxAxs1"]],
        ["a",
         ["cxBxxx", "cxBxsx", "cxBxsx", "cxBxxx", "cxAxxx", "cxAxxx", "xfAxsx", "xfAxxx", "xfAxsx", "xfBxsx", "cxCxsx", "cxCxsx", "cxCxbx", "cxDxwx", "cxDxwx", "cxDxwx", "cxDxgx", "cxDxwx", "cxDxgx", "wxCxgw", "wxCxgw", "wxCxww", "wxCxhw", "wxDxgw"],
         ["wfDxww", "wfDxww", "wfDxww", "wfDxgw", "wfExww", "wfExww", "wxExww", "wfExww", "wfFxbw", "xfFxwx", "xfFxsx", "xfGxsx", "xfGxsx", "cxHxsx", "cxIxsx", "cxJxsx", "xxKxsx", "xxHxxx", "xxGxxx", "wfFxxw", "txHxsw", "wxIxsw", "cxGxsx", "cxGxxx"],
         ["cxHxsx", "wxHxsw", "wxHxsw", "wfGxww", "wxFxww", "wxFxbw", "wxFxww", "cxDxbx", "cxCxwx", "cxBxwx", "cxBxbx", "cxBxwx", "cxAxwx", "bxAxwx", "sxAxsx", "sxAxbx", "sxAxsx", "sxAxsx", "bxAxwx", "cxAxsx", "bx0xwf", "bx0xwf", "cx0xwf", "cxaxsf"],
         ["cxbxsf", "cxaxsf", "cxbxbf", "cxbxwf", "cxcxwf", "cxdxbf", "cxdxsf", "cxdxbf", "cxdxbf", "cxdxsf", "cxcxsf", "cxcxsf", "cxbxsf", "xxbxsf", "xx0xsf", "xx0xsf", "xx0xsf", "xxbxsf", "xxbxsf", "xxcxsf", "xxcxxf", "xxdxxf", "xxdxxf", "xxexxf"],
         ["xxexxf", "xxfxxf", "xxfxxf", "xxfxxf", "xxgxxf", "xxgxsf", "xxfxxf", "cxfxsf", "cxexxf", "cxdxxf", "cxcxsf", "cxaxxf", "cxAxsx", "cxAxsx", "cxBxsx", "cxBxsx", "cxBxsx", "cxAxsx", "cxAxsx", "cxAxsx", "cxAxsx", "cxAxsx", "sxAxsx", "sx0xsf"],
         ["sx0xbf", "sx0xsf", "sx0xbf", "sx0xbf", "sxaxbf", "sxaxbf", "sxaxsf", "cxaxbf", "cxaxbf", "cx0xbf", "cxAxbx", "cxBxbx", "sxBxbx", "sxBxsx", "sxBxbx", "sxBxs1", "sxBxs1", "sx0xs1", "sx0xs1", "bxaxw1", "sxaxs1", "sxaxb1", "xxbxb1", "xxcxs1"],
         ["sxcxs1", "sxexb1", "sxexs1", "sxgxs1", "sxgxs1", "sxgxs1", "sxixs1", "sxixs1", "sxixx1", "sxhxs1", "xxgxs1", "xxfxs1", "xxexs1", "xxexs1", "xxdxs1", "xxexx1", "cxexs1", "cxfxs1", "cxfxs1", "cxfxs1", "cxexs1", "cxexs1", "cxexs1", "cxexs1"],
         ["cxexs1", "sxexs1", "sxfxs1", "sxfxs2", "sxfxx2", "sxfxx2", "sxfxx2", "xxfxx2", "xxgxs2", "xxexs2", "cxbxs2", "bxaxw2", "sx0xb2", "xxAxb2", "xxAxb2", "xx0xs2", "cx0xs2", "cx0xs2", "cx0xb2", "cxaxs2", "cxbxs2", "cxbxb2", "sxaxs2", "sxaxs2"],
         ["sxaxs2", "cxbxb2", "cxbxs2", "cxbxs2", "cxcxs2", "cxcxb2", "cxdxs2", "xxexs2", "xxexs2", "xxcxs2", "xxbxw2", "xxaxs2", "xxAxw2", "xxAxw2", "xxAxs2", "xxAxs2", "cx0xb2", "cxaxb2", "cxaxs2", "cxaxs2", "cx0xs2", "cx0xs2", "cx0xs2", "cx0xs2"],
         ["cx0xs2", "cx0xs2", "cx0xs2", "cx0xx2", "cx0xx2", "cx0xx2", "cx0xs2", "cx0xs2", "cx0xx2", "cx0xs2", "cxAxx2", "cxAxx2", "cxAxx2", "cxBxs2", "cxBxs2", "cxAxs2", "sxAxs2", "sxAxs2", "sxAxx2", "cxBxs2", "cxAxs2", "cxAxs2", "cxAxb2", "cx0xb2"],
         ["cx0xs2", "cx0xs2", "cxaxb2", "cxbxs2", "sxbxb2", "sxbxs2", "sxbxs2", "sxbxs2", "sxaxs2", "sxaxs2", "sxaxs2", "sxaxs2", "sxaxb2", "sxaxs2", "sxaxs3", "sxaxs3", "sx0xs3", "sx0xs3", "sxaxs3", "sx0xs3", "sx0xs3", "sx0xs3", "sx0xs3", "sx0xs3"],
         ["sxAxs3", "cxAxs3", "cxAxs3", "cx0xs3", "cx0xs3", "cxaxx3", "cxaxs3", "xxcxs3", "xxdxs3", "xxbxs3", "xxaxs3", "xxaxs3", "xx0xs3", "cx0xb3", "sx0xb3", "bx0xw3", "cx0xw3", "cxAxw3", "cxAxw3", "cx0xw3", "cx0xb3", "cxaxw3", "cxaxb3", "cxbxw3"],
         ["cxbxw3", "sxbxs3", "sxaxb3", "sxaxs3", "sxaxs3", "sxbxb3", "sxaxs3", "xfaxs3", "xfaxs3", "xfaxs3", "xf0xs3", "xf0xs3", "xf0xs3", "xfBxs3", "xfBxs3", "xfCxs3", "cxBxs3", "cxBxs3", "cxBxs3", "cxBxs3", "cxBxs3", "cxAxs3", "cxAxs3", "cxAxs3"],
         ["cx0xx3", "xxaxx3", "xxaxx3", "xxaxx3", "xfaxs3", "xf0xx3", "xf0xx3", "wxAxs3", "wfBxx3", "wfBxx3", "wfCxx3", "wfCxx3", "wfDxs3", "xfExs3", "xfExs2", "xfExs2", "xfExs2", "xfExs2", "xfExx2", "xfFxs2", "xfExs2", "xfDxs2", "cxDxx2", "xfDxs1"],
         ["xfCxs1", "xfBxx1", "xfAxs1", "xfAxs1", "xfAxs1", "xfAxx1", "xf0xx1", "xfAxx1", "xfAxx1", "xfBxx1", "cxBxx1", "cxCxs1", "cxDxs1", "cxDxs1", "cxDxs1", "cxDxs1", "cxDxs1", "cxBxs1", "cxBxs1", "cxBxs1", "cxAxx1", "cxAxs1", "cxAxs1", "cxAxs1"],
         ["cx0xs1", "cx0xs1", "cx0xs1", "cxaxs1", "cxaxs1", "cx0xs1", "cx0xs1", "cxaxs1", "cx0xs1", "cx0xs1", "cxBxsx", "cxBxsx", "cxCxsx", "cxDxsx", "cxFxsx", "cxExsx", "cxDxbx", "cxCxsx", "cxBxsx", "cxBxsx", "cxBxsx", "cxBxsx", "cxBxsx", "cxCxsx"],
         ["cxCxsx", "cxBxsx", "cxAxsx", "cxBxsx", "cxBxsx", "cxAxsx", "cxAxsx", "cxBxsx", "cxBxsx", "cxCxsx", "cxCxbx", "cxCxsx", "cxCxsx", "cxCxbx", "cxCxsx", "cxCxwx", "cxCxbx", "cxBxgx", "cxAxgx", "cx0xwf", "cxaxsf", "cx0xsf", "cxaxsf", "cxaxsf"],
         ["cxaxbf", "cxbxbf", "cxcxbf", "cxcxbf", "cxdxwf", "cxfxsf", "sxfxsf", "cxexsf", "sxexsf", "sxexsf", "sxexbf", "sxdxsf", "sxcxsf", "xxbxsf", "xxbxsf", "xxaxsf", "xxaxxf", "xxcxsf", "xxcxxf", "xxdxsf", "xxdxxf", "xxexsf", "xxexxf", "xxfxxf"],
         ["xxexxf", "cxexxf", "cxaxsf", "cxaxsf", "xxaxbf", "xxaxbf", "xxaxsf", "xxaxsf", "xxbxsf", "xxbxsf", "cxCxsx", "cxDxsx", "cxExsx", "cxFxsx", "cxFxbx", "cxFxsx", "cxExsx", "cxExsx", "cxDxsx", "xxCxsx", "xxBxsx", "xxBxsx", "xxCxsx", "xxBxsx"],
         ["xxBxxx", "xxaxxf", "xxaxxf", "xxbxxf", "xxbxxf", "xxaxxf", "xxbxxf", "cx0xxf", "cx0xxf", "cxBxsx", "cxCxsx", "cxDxsx", "cxExsx", "cxDxsx", "cxExxx", "cxFxsx", "cxExsx", "cxExxx", "cxDxxx", "cxDxsx", "cxCxxx", "wxCxxw", "wxCxsw", "wxDxsw"],
         ["wxCxsw", "wxDxbw", "wxDxww", "wfDxsw", "wfDxsw", "wfExsw", "wfExxw", "wfDxsw", "wfDxsw", "wfDxsw", "wfDxsw", "wfDxsw", "wfExsw", "xfExsx", "xfExsx", "xfDxwx", "cxDxgx", "cxCxwx", "cxCxbx", "cxCxwx", "cxBxgx", "cxAxwx", "cxAxwx", "cx0xgf"],
         ["cx0xwf", "cxaxgf", "cxaxhf", "cxaxgf", "cxbxgf", "cxbxvf", "cxbxgf", "bxbxgf", "bxbxgf", "bxbxgf", "cxaxwf", "cxaxsf", "cxaxbf", "cx0xbf", "cxaxbf", "cxaxwf", "cxaxwf", "cxaxbf", "cxbxwf", "cxbxsf", "cxbxsf", "cxbxsf", "cxbxsf", "cxbxsf"],
         ["cxaxsf", "cxaxsf", "cxaxsf", "cxaxsf", "cxaxsf", "cxaxsf", "cxaxxf", "cxaxxf", "cxaxxf", "cxaxsf", "cx0xsf", "cx0xsf", "sx0xsf", "sxAxsx", "sx0xbf", "sx0xsf", "sxaxbf", "sxaxsf", "sxaxsf", "sxaxsf", "wxaxsw", "sxaxsf", "sxaxxf", "wfaxxw"],
         ["sfaxxf", "sfaxxf", "xfaxxf", "xfaxxf", "cx0xxf", "sx0xsf", "sxAxs1", "sxAxs1", "sxAxs1", "sxAxs1", "sxAxs1", "sxAxs1", "sxBxs1", "sxBxs1", "sxBxb1", "sxBxs1", "cxBxs1", "cxBxb1", "cx0xb1", "xx0xb1", "xx0xb1", "xx0xb1", "cx0xs1", "cx0xs1"],
         ["cxaxx1", "cxaxs1", "cxaxs1", "sxaxs1", "cxbxs1", "cxbxs1", "cxbxs1", "cxbxs1", "cxcxs1", "cxcxx1", "xxbxs1", "xxaxs1", "xxAxs1", "cxAxs1", "cxAxx1", "sxAxx1", "cx0xx1", "cx0xs1", "sx0xs1", "cx0xs1", "cx0xs1", "cx0xs1", "cx0xs1", "cx0xs1"],
         ["cx0xs1", "cxaxs1", "cxbxs1", "cxbxx1", "xxbxs1", "xxbxs1", "xxaxs1", "cxaxs1", "cx0xs1", "cx0xs1", "cxAxs1", "sxAxs1", "sxAxb1", "cxBxs1", "cxBxs1", "cxCxs1", "cxAxw1", "cx0xb1", "cx0xb1", "cxaxs1", "cxaxb1", "cxbxb1", "cxcxs1", "cxdxb1"],
         ["cxfxs1", "xxgxs1", "xxgxs1", "xxhxs1", "xxhxs1", "xxhxs1", "xxhxs1", "cxhxb1", "cxgxs1", "cxfxb1", "cxexb1", "cxdxb1", "cxdxw1", "cxcxb1", "cxcxw1", "cxbxw1", "cxbxw1", "cxbxw1", "cxaxg1", "cxaxg1", "cxaxw1", "px0xw1", "cxAxb1", "wxBxw1"],
         ["wfCxs1", "wfCxs1", "wfDxs1", "wfDxs1", "xfDxsx", "xfExsx", "wfExsw", "wfFxxw", "wfIxbw", "wfIxbw", "wfIxbw", "wfJxbw", "wfKxsw", "cxKxsx", "cxLxsx", "cxLxsx", "cxLxsx", "cxLxsx", "cxLxbx", "xxKxbx", "xxJxsx", "xxJxsx", "cxHxwx", "cxFxsx"],
         ["cxExwx", "cxDxgx", "cxCxbx", "cxBxbx", "cxAxgx", "cxaxwf", "cxbxwf", "cxbxgf", "bxcxgf", "bxcxwf", "cxdxgf", "cxdxwf", "cxcxwf", "cxdxwf", "cxdxwf", "cxcxsf", "xxdxsf", "xxexsf", "xxfxsf", "xxgxsf", "xxgxsf", "xxgxxf", "cxgxsf", "cxfxxf"],
         ["cxfxsf", "cxexsf", "sxfxsf", "sxfxxf", "sxexxf", "sxfxsf", "sxexsf", "cxexsf", "sxexsf", "sxdxxf", "sxcxxf", "sxaxsf", "sx0xsf", "cx0xsf", "cx0xsf", "cxBxsx", "cxAxsx", "cxAxsx", "cx0xsf", "cx0xsf", "cx0xsf", "cx0xsf", "cx0xsf", "cx0xsf"],
         ["cxbxsf", "xxaxsf", "xxcxxf", "cxdxxf", "cxexsf", "cxexsf", "sxexxf", "bxexwf", "bxexwf", "bxexgf", "xxexwf", "xxfxwf", "xxgxwf", "xxgxbf", "xxhxbf", "xxhxbf", "xxixsf", "xxhxsf", "sxhxb1", "sxhxb1", "bxlxw1", "bxmxw1", "xxnxw1", "xxoxw1"]]
    ];
    const CLOCKSPEED = 50;
    const TWEENDURS = [15, 40, 60, 600, 1440, 3000, 5000, 7000, 8000, 9000, 10000, Infinity];
    const RUNNINGFASTAT = 1500000;
    const DAYSOFWEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const TWILIGHT = [
        ["7:44", "17:12"],
        ["7:11", "17:51"],
        ["7:22", "19:28"],
        ["6:26", "20:06"],
        ["5:48", "20:40"],
        ["5:35", "21:01"],
        ["5:54", "20:52"],
        ["5:48", "20:40"],
        ["6:26", "20:06"],
        ["7:22", "19:28"],
        ["7:11", "17:51"],
        ["7:44", "17:12"]
    ];
    const IMAGETIMES = {
        "0:00": "night2",
        "1:30": "night3",
        "3:00": "night4",
        [-120]: "night5",
        [-30]: "predawn5",
        [-20]: "predawn4",
        [-10]: "predawn3",
        [-5]: "predawn2",
        "dawn": "predawn1",
        "dusk": "day",
        "22:30": "night1",
        "24:00": "night2"  
    };
    const WEATHERCODES = [
        {x: "Clear", b: "Blizzard", c: "Overcast", f: "Foggy", p: "Downpour", s: "Snowing", t: "Thunderstorm", w: "Drizzle"},
        {x: null, d: "Dry", h: "Humid", m: "Muggy", s: "Sweltering"},
        {x: ["Still", "Still"], s: ["Soft Breeze", "Cutting Breeze"], b: ["Breezy", "Biting Wind"], w: ["Blustery", "High Winds"], g: ["High Winds", "Driving Winds"], h: ["Howling Winds", "Howling Winds"], v: ["Roaring Winds", "Roaring Winds"]}
    ];
    const WINTERTEMP = 25;
    const WEATHERTEMP = ["z", "y", "x", "w", "v", "u", "t", "s", "r", "q", "p", "o", "n", "m", "l", "k", "j", "i", "h", "g", "f", "e", "d", "c", "b", "a", "0", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    const MONTHTEMP = ["f", "b", "a", "C", "Q", "S", "W", "V", "R", "H", "A", "a"];
    const MOON = {
        minTop: 932, // 1300,
        maxTop: 262, // 630, 
        daysToWaitTill: 5,
        daysToWaitTillWater: 4.25
    };
    // #endregion

    // #region Derivative Stats
    const TWILIGHTMINS = _.map(TWILIGHT, v => _.map(v, v2 => 60 * D.Int(v2.split(":")[0]) + D.Int(v2.split(":")[1])));
    // #endregion

    // #region Date & Time Functions
    const getDateObj = dateRef => {
        const funcID = ONSTACK(); // Takes almost any date format and converts it into a Date object.
        let returnDate;
        const curDateString = formatDateString(new Date(STATE.REF.dateObj));
        DB({dateRef, stateCurDate: STATE.REF.dateObj, curDate: new Date(STATE.REF.dateObj), curDateString: formatDateString(new Date(STATE.REF.dateObj))}, "parseToDateObj");
        if (VAL({dateObj: dateRef})) {
            DB({["DATE OBJECT!"]: dateRef, isItReally: dateRef instanceof Date}, "parseToDateObj");
            return OFFSTACK(funcID) && dateRef;
        } else if (VAL({string: dateRef})) {
            if (!String(dateRef).match(/\D/gu)) {// if everything is a number, assume it's a seconds-past-1970 thing                
                DB({["SECS-PAST-1970 STRING!"]: dateRef}, "parseToDateObj");
                return OFFSTACK(funcID) && new Date(parseInt(dateRef));
            }
            if (dateRef !== "") {
                DB({["OTHER STRING!"]: dateRef}, "parseToDateObj");
                // first, see if it includes a time stamp and separate that out:
                const [dateString, timeString] = Object.assign([curDateString, ""], dateRef.match(/([^:\n\r]+\d{2}?(?!:))?\s?(\S*:{1}.*)?/u).slice(1).map((x,i) => i === 0 && !x ? curDateString : x));
                const parsedDateString = _.compact(dateString.match(/^(?:([\d]*)-?(\d*)-?(\d*)|(?:([\d]+)?(?:[^\w\d])*?([\d]+)?[^\w\d]*?(?:([\d]+)|(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))?\w*?[^\w\d]*?([\d]+){1,2}\w*?[^\w\d]*?(\d+)))$/imuy)).slice(1);
                let month, day, year;
                while (parsedDateString.length)
                    switch (parsedDateString.length) {
                        case 3: {
                            year = D.PullOut(parsedDateString, v => v > 31);
                            month = D.PullOut(parsedDateString, v => VAL({string: v}) || v <= 12 && parsedDateString.filter(x => x <= 12).length === 1);
                            if (parsedDateString.length === 3)
                                [month, day, year] = parsedDateString;
                            break;
                        }
                        case 2: {
                            year = year || D.PullOut(parsedDateString, v => v > 31);
                            month = month || D.PullOut(parsedDateString, v => VAL({string: v}) || v <= 12 && parsedDateString.filter(x => x <= 12).length === 1);                                
                            if (VAL({number: year}))
                                day = day || D.PullOut(parsedDateString, v => v > 12);
                            if (parsedDateString.length === 2) {
                                month = month || parsedDateString.shift();
                                day = day || parsedDateString.shift();
                                year = year || parsedDateString.length && parsedDateString.shift();
                            }
                            break;
                        }
                        case 1: {
                            year = year || parsedDateString.pop();
                            month = month || parsedDateString.pop();
                            day = day || parsedDateString.pop();
                            break;
                        }
                            // no default
                    }
                if (!["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].includes(month.toLowerCase()))
                    month = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"][month - 1];
                if (`${year}`.length < 3)
                    year = parseInt(year) + 2000;
                day = parseInt(day);                  
                returnDate = new Date([year, ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].indexOf(month.toLowerCase())+1, day]);

                // Now, the time component (if any)
                if (VAL({dateObj: returnDate, string: timeString})) {
                    const [time, aMpM] = (timeString.match(/([^A-Z\s]+)(?:\s+)?(\S+)?/u) || [false, false, false]).slice(1);
                    const [hour, min, sec] = `${D.JSL(time)}`.split(":").map(v => D.Int(v));
                    const totalSeconds = (hour + (D.LCase(aMpM).includes("p") && 12))*60*60 + min*60 + sec;
                    returnDate.setUTCSeconds(returnDate.getUTCSeconds() + totalSeconds);
                    DB({["OTHER STRING!"]: dateRef, dateString, timeString, parsedDateString, day, month, year, time, aMpM, hour, min, sec, totalSeconds, returnDate}, "parseToDateObj");  
                } else {
                    DB({["OTHER STRING!"]: dateRef, dateString, timeString, parsedDateString, day, month, year, returnDate}, "parseToDateObj");  
                }
                return OFFSTACK(funcID) && returnDate;
            }
        } else {
            if (!_.isDate(dateRef))                    
                returnDate = new Date(dateRef);
            if (!_.isDate(returnDate))
                returnDate = new Date(D.Int(dateRef));
            if (!_.isDate(returnDate) && VAL({string: returnDate}))
                return OFFSTACK(funcID) && getDateObj(returnDate);
        }
        return OFFSTACK(funcID) && false;
    };
    const parseToDeltaTime = (...args) => {
        const funcID = ONSTACK(); // Takes a number and a unit of time and converts it to the standard [delta (digit), unit (y/mo/w/d/h/m)] format for adding time. 
        const matchPatterns = [
            new RegExp("-?\\d+(\\.?\\d+)?", "gu"),
            new RegExp("[A-Za-z]{1,2}", "u")
        ];
        const [delta, unit] = matchPatterns.map(x => (_.flatten([args]).join("").replace(/\s/gu, "").match(x) || [false]).pop());
        DB({args, delta, unit}, "parseToDeltaTime");
        return OFFSTACK(funcID) && [D.Float(delta), D.LCase(unit)];
    };
    const getTime = (timeRef, deltaMins, isParsingString = false) => {
        const funcID = ONSTACK(); // Takes a time reference ad
        deltaMins = deltaMins || 0;
        const timeNums = VAL({string: timeRef}) ? _.map(timeRef.split(":"), v => D.Int(v)) : timeRef;
        let totMins = timeNums[0] * 60 + timeNums[1] + deltaMins;
        if (totMins < 0)
            totMins += 24 * 60 * Math.ceil(Math.abs(totMins) / (24 * 60));
        const totHours = Math.floor(totMins / 60);
        if (isParsingString)
            return OFFSTACK(funcID) && `${totHours % 12 || 12}:${totMins - 60 * totHours < 10 ? "0" : ""}${totMins - 60 * totHours} ${totHours % 24 >= 12 ? "P.M." : "A.M."}`;
        return OFFSTACK(funcID) && [totHours % 24, totMins - 60 * totHours];
    };
    const getTimeInMin = dateRef => Math.floor(getDateObj(dateRef).getTime() / (1000 * 60));
    const getDateFromDateString = (dateObj = new Date(STATE.REF.dateObj), dateString, isChangingDateObj = false) => {
        const funcID = ONSTACK();
        if (VAL({dateObj, string: dateString})) {
            DB({dateObj, dateString}, "getDateFromDateString");
            const [dateVal, dateFlag] = dateString.split(":");
            const workingDate = isChangingDateObj && dateObj || new Date(dateObj);
            switch (dateVal) {
                case "nextfullweek": {
                    addTime(workingDate, 7, "d", true);
                }
                // falls through
                case "nextfullnight": {
                    if (!isDateInDay(workingDate))
                        addTime(workingDate, 1, "d", true);
                }
                // falls through
                case "dawn": setToFutureTime(workingDate, ...getTime(TWILIGHT[workingDate.getMonth()][0])); break;
                case "dusk": setToFutureTime(workingDate, ...getTime(TWILIGHT[workingDate.getMonth()][1])); break;
                case "midnight": setToFutureTime(workingDate, 0, 0); break;
                case "noon": setToFutureTime(workingDate, 12, 0); break;
                case "nextweek": addTime(workingDate, 7, "d", true); break;
                case "endofweek": setToFutureWeekday(workingDate, 0); break;
                default: {
                    const parsedDate = getDateObj(dateVal);
                    if (VAL({dateObj: parsedDate})) {
                        workingDate.setTime(parsedDate.getTime());
                    } else {
                        const [delta, unit] = parseToDeltaTime(dateVal);
                        if (VAL({number: [delta, unit]}, undefined, true))
                            addTime(workingDate, delta, unit, true);
                    }
                    break;
                }
            }
            if (VAL({string: dateFlag}))
                getDateFromDateString(workingDate, dateFlag, true);
            return OFFSTACK(funcID) && workingDate;
        } else {
            D.Alert(`Invalid date object (${D.JS(dateObj)}) OR dateString (${D.JS(dateString)})`, "getDateFromDateString()");
        }
        return OFFSTACK(funcID) && dateObj;    
    };
    const formatTimeString = date => {
        const funcID = ONSTACK();
        if (date.getUTCHours() === 0 || date.getUTCHours() === 12)
            return OFFSTACK(funcID) && `12:${date.getUTCMinutes()} ${date.getUTCHours() === 0 ? "A.M." : "P.M."}`;
        else if (date.getUTCHours() > 12)
            return OFFSTACK(funcID) && `${date.getUTCHours() - 12}:${date.getUTCMinutes()} P.M.`;
        else
            return OFFSTACK(funcID) && `${date.getUTCHours()}:${date.getUTCMinutes()} A.M.`;
    };       
    const formatDateString = (date, isIncludingTime = false) => {
        const funcID = ONSTACK();
        date = VAL({dateObj: date}) && date || getDateObj(date);
        return OFFSTACK(funcID) && `${
            ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][date.getMonth()]
        } ${
            date.getUTCDate()
        }, ${
            date.getUTCFullYear()
        }${
            isIncludingTime ? `, ${formatTimeString(date).replace(/:(\d\s)/gu, ":0$1")}` : ""
        }`; };
    const addTime = (dateRef, delta, unit, isChangingOriginal = false) => {
        const funcID = ONSTACK();
        const dateObj = getDateObj(dateRef);
        DB({dateRef, dateRefType: typeof dateRef, isDate: _.isDate(dateRef), dateObj, delta, unit}, "addTime");
        if (VAL({date: dateRef}, "addTime")) {
            const newDate = new Date(getDateObj(dateObj));
            [delta, unit] = parseToDeltaTime(delta, unit);
            switch (unit) {
                case "y": newDate.setUTCFullYear(newDate.getUTCFullYear() + delta); break;
                case "mo": newDate.setUTCMonth(newDate.getUTCMonth() + delta); break;
                case "w": newDate.setUTCDate(newDate.getUTCDate() + 7 * delta); break;
                case "d": newDate.setUTCDate(newDate.getUTCDate() + delta); break;
                case "h": newDate.setUTCHours(newDate.getUTCHours() + delta); break;
                case "m": newDate.setUTCMinutes(newDate.getUTCMinutes() + delta); break;
                    // no default
            }
            if (isChangingOriginal && dateRef instanceof Date)
                dateRef.setTime(newDate.getTime());
            return OFFSTACK(funcID) && newDate;
        }
        return OFFSTACK(funcID) && false;          
    };
    const setToFutureTime = (dateRef, hours, mins) => {
        const funcID = ONSTACK();
        const dateObj = getDateObj(dateRef || STATE.REF.dateObj);
        const targetDateObj = new Date(dateObj);
        targetDateObj.setUTCHours(hours);
        targetDateObj.setUTCMinutes(mins);   
        targetDateObj.setUTCSeconds(0);
        targetDateObj.setUTCMilliseconds(0);      
        while (targetDateObj.getTime() <= dateObj.getTime())
            addTime(targetDateObj, 1, "d", true);
        if (dateRef instanceof Date) {
            dateRef.setTime(targetDateObj.getTime());
            return OFFSTACK(funcID) && dateRef;
        } else {
            return OFFSTACK(funcID) && targetDateObj;
        }
    };
    const setToFutureWeekday = (dateRef, weekday, hours = 0, mins = 1) => {
        const funcID = ONSTACK();
        const curDateObj = getDateObj(dateRef || STATE.REF.dateObj);
        const targetDateObj = new Date(curDateObj);
        targetDateObj.setUTCHours(hours);
        targetDateObj.setUTCMinutes(mins);
        targetDateObj.setUTCSeconds(0);
        targetDateObj.setUTCMilliseconds(0);
        addTime(targetDateObj, weekday - curDateObj.getUTCDay(), "d", true);
        while (targetDateObj.getTime() <= curDateObj.getTime())
            addTime(targetDateObj, 1, "w", true);
        if (dateRef instanceof Date) {
            dateRef.setTime(targetDateObj.getTime());
            return OFFSTACK(funcID) && dateRef;
        } else {
            return OFFSTACK(funcID) && targetDateObj;
        }
    };
    const getHorizonTimeString = (dateRef) => {
        const funcID = ONSTACK();
        dateRef = getDateObj(dateRef || STATE.REF.dateObj);
        const [dawn, dusk] = TWILIGHTMINS[dateRef.getMonth()];
        const imgTimes = _.object(_.map(Object.keys(IMAGETIMES), k => {
            const fID = ONSTACK();
            if (k.includes(":"))
                return OFFSTACK(fID) && 60 * D.Int(k.split(":")[0]) + D.Int(k.split(":")[1]);
            else if (k === "dawn")
                return OFFSTACK(fID) && dawn;
            else if (k === "dusk")
                return OFFSTACK(fID) && dusk;
            return OFFSTACK(fID) && dawn + D.Int(k);
        }), _.values(IMAGETIMES));
        const curTime = 60 * dateRef.getUTCHours() + dateRef.getUTCMinutes();
        const curHoriz = imgTimes[_.find(Object.keys(imgTimes), v => curTime <= v)];
        // DB(`WeatherData: ${D.JS(weatherData)}`, "getHorizon")
        // D.Alert(`Daylighter Check: ${C.RO.OT.Chars.isDaylighterSession} vs. ${C.RO.OT.Chars.isDaylighterSession}, imgSrc: ${curHoriz}`)
        if (Session.Mode === "Daylighter" && curHoriz === "day")
            return OFFSTACK(funcID) && "daylighters";
        return OFFSTACK(funcID) && curHoriz;
    };
    const isDateInDay = (dateRef) => getHorizonTimeString(dateRef).includes("day");
    const isTimeInDay = (monthNum, hourNum, minNum) => {
        const funcID = ONSTACK();
        const twilightTimes = TWILIGHT[monthNum];
        const totalMins = hourNum * 60 + minNum;
        const [dawnMins, duskMins] = twilightTimes.map(x => D.Int(x.replace(/:\d+/gu, "")) * 60 + D.Int(x.replace(/\d+:/gu, "")));
        return OFFSTACK(funcID) && totalMins >= dawnMins && totalMins < duskMins;            
    };
    const getDaysInMonth = (monthNum) => STATE.REF.weatherData[monthNum].length - 1;
    const setNextSessionDate = (dateOverride = { }) => {
        const funcID = ONSTACK();
        DB({dateOverride}, "setNextSessionDate"); // {day: 1, hour: 3, minute: 30}
        const curRealDateObj = new Date(new Date().toLocaleString("en-US", {timezone: "America/New_York"}));
        const sessDateObj = new Date(curRealDateObj);
        const daysOut = 7 - (curRealDateObj.getDay() === 0 ? 7 : curRealDateObj.getDay());
        sessDateObj.setDate(curRealDateObj.getDate() + daysOut);
        sessDateObj.setHours(19);
        sessDateObj.setMinutes(30);
        sessDateObj.setSeconds(0);
        sessDateObj.setMilliseconds(0);
        for (const [k, v] of Object.entries(dateOverride))
            switch (D.LCase(k)) {
                case "year": {
                    sessDateObj.setFullYear(v);
                    break;
                }
                case "month": {
                    sessDateObj.setMonth(v);
                    break;
                }
                case "day": case "date": {
                    sessDateObj.setDate(v);
                    break;
                }
                case "hour": {
                    sessDateObj.setHours(v);
                    break;
                }
                case "minute": {
                    sessDateObj.setMinutes(v);
                    break;
                }
                    // no default
            }
        if (sessDateObj.getTime() <= curRealDateObj.getTime())
            sessDateObj.setDate(sessDateObj.getDate() + 7);
        STATE.REF.nextSessionDate = sessDateObj.getTime();
        syncCountdown();
        return OFFSTACK(funcID) && (sessDateObj - curRealDateObj)/1000 - 60;
    };        
    const getRandomEventTriggers = (fullDuration, numTriggers, tickSpeed = 100) => {
        const funcID = ONSTACK();
        fullDuration *= fullDuration < 1000 && 1000 || 1;
        fullDuration -= tickSpeed;
        const numTicks = D.Int(fullDuration / tickSpeed);
        const timeLine = (new Array(numTicks)).fill(0);
        const sampler = timeLine.map((x, i) => i);
        numTriggers--;
        while (numTriggers) {
            timeLine[D.PullIndex(sampler, randomInteger(sampler.length))] = 1;
            numTriggers--;
        }
        return OFFSTACK(funcID) && timeLine.join("").split("1").map(x => (x.length + 1) * tickSpeed);
    };
    // #endregion
    
    
        
    const getAlarmsBetween = (dateRef, deltaTimeInMin=0) => {
        const dateObj = getDateObj(dateRef);
        const timeInMin = getTimeInMin(dateObj);
        const [startTime, endTime] = [timeInMin, timeInMin + deltaTimeInMin].sort((a, b) => a - b);
        return STATE.REF.Alarms.filter(x => x.time <= endTime && (startTime === endTime || x.time > startTime));
    };
    const isMatchingAlarm = (alarmA, alarmB) => D.JS(Object.values(_.omit(alarmA, "id"))) === D.JS(Object.values(_.omit(alarmB, "id")));
    const setAlarm = (dateRef, alarmName, alarmDesc, alarmFuncName, alarmFuncParams = [], recur = false) => {
        const thisAlarm = {
            name: alarmName,
            desc: alarmDesc,
            funcName: alarmFuncName,
            funcParams: alarmFuncParams,
            recur
        };
        if (D.LCase(dateRef) === "scene")
            return Session.AddSceneAlarm(thisAlarm);
        const thisDateObj = VAL({string: dateRef}) ? getDateFromDateString(undefined, dateRef) : getDateObj(dateRef);  
        if (VAL({date: thisDateObj}, "setAlarm")) {
            thisAlarm.time = getTimeInMin(thisDateObj);
            const curAlarms = getAlarmsBetween(dateRef);
            const curAlarmIDs = Object.values(STATE.REF.Alarms).map(x => x.id);
            if (curAlarms.filter(x => isMatchingAlarm(x, thisAlarm)).length)
                return false;
            do
                thisAlarm.id = D.RandomString();
            while (curAlarmIDs.includes(thisAlarm.id));
            STATE.REF.Alarms = [...STATE.REF.Alarms, thisAlarm].sort((a,b) => a.time - b.time);
            return thisAlarm;
        }   
        return false;      
    };
    const fireAlarm = (alarm) => {
        if ("name" in alarm && "desc" in alarm) 
            D.Chat("Storyteller", D.CommandMenuHTML({
                rows: [
                    {
                        type: "ButtonLine",
                        contents: [
                            {text: `${D.UCase(alarm.name)}: ${D.JS(alarm.desc)} - `, styles: { }}, /* height, width, fontFamily, fontSize, bgColor, color, margin, textAlign, textIndent, padding, lineHeight */
                            0,
                            {name: "Confirm", command: `!time alarmfunc ${D.LCase(alarm.funcName)} ${alarm.funcParams.join("|@firealarm@|")}`, styles: { }} /* height, lineHeight, width, fontFamily, margin, padding, fontSize, bgColor, color, border, fontWeight, textShadow, buttonHeight, buttonWidth, buttonPadding, buttonTransform */
                        ],
                        buttonStyles: { }, /* height, lineHeight, width, fontFamily, margin, padding, fontSize, bgColor, color, border, fontWeight, textShadow, buttonHeight, buttonWidth, buttonPadding, buttonTransform */
                        styles: { } /* height, width, margin, textAlign */
                    }
                ]
            }));
        else 
            confirmAlarm(alarm.funcName, alarm.funcParams);
            
        if (alarm.recur)
            recurAlarm(alarm);
    };
    const confirmAlarm = (funcName, funcParams) => {
        if (funcName in ALARMFUNCS) {
            funcParams = VAL({string: funcParams}) ? funcParams.split(/\|@firealarm@\|/gui) : funcParams;
            ALARMFUNCS[funcName](...funcParams);
        } else {
            D.Alert(`'${D.LCase(funcName)}' Alarm Function Not Found.`, "TIMETRACKER: Confirm Alarm");
        }
    };
    const recurAlarm = (alarm) => {};

    // #region CLOCK: Toggling, Ticking, Setting Clock Text    
    const toggleClock = (activeState, secsPerMin) => {
        const funcID = ONSTACK();
        isTickingClock = Boolean(activeState);
        STATE.REF.secsPerMin = secsPerMin || STATE.REF.secsPerMin;

        if (activeState) {
            if (STATE.REF.TweenTarget) {
                tweenClock(STATE.REF.TweenTarget);
            } else {
                clearInterval(timeTimer);
                timeTimer = setInterval(tickClock, D.Int(STATE.REF.secsPerMin) * 1000);
            }
        } else {
            isTickingClock = false;
            isFastTweeningClock = false;
        }
        OFFSTACK(funcID);
    };
    const updateClockObj = () => {
        const funcID = ONSTACK();
        // dateObj = dateObj || new Date(D.Int(STATE.REF.currentDate))
        // DB(`Setting Current Date; Checking Alarms.<br>LastDateStep: ${D.JSL(STATE.REF.lastDateStep)}`, "setCurrentDate")
        if (Media.HasForcedState("TimeTracker")) return OFFSTACK(funcID) && false;
        if (Session.Mode === "Downtime")
            Media.SetText("TimeTracker", `${
                DAYSOFWEEK[STATE.REF.dateObj.getUTCDay()]}, ${
                MONTHS[STATE.REF.dateObj.getUTCMonth()]} ${
                D.Ordinal(STATE.REF.dateObj.getUTCDate())}, ${
                STATE.REF.dateObj.getUTCFullYear()}`);
        else            
            Media.SetText("TimeTracker", `${
                DAYSOFWEEK[STATE.REF.dateObj.getUTCDay()]}, ${
                MONTHS[STATE.REF.dateObj.getUTCMonth()]} ${
                D.Ordinal(STATE.REF.dateObj.getUTCDate())} ${
                STATE.REF.dateObj.getFullYear()}, ${
                (STATE.REF.dateObj.getUTCHours() % 12).toString().replace(/^0/gu, "12")}:${
                STATE.REF.dateObj.getUTCMinutes() < 10 ? "0" : ""}${STATE.REF.dateObj.getUTCMinutes().toString()} ${
                Math.floor(STATE.REF.dateObj.getUTCHours() / 12) === 0 ? "AM" : "PM"}`);
        STATE.REF.lastDateStep = STATE.REF.dateObj.getTime();
        STATE.REF.currentDate = STATE.REF.dateObj.getTime();
        return OFFSTACK(funcID) && true;
    };
    const isUpdatingChars = () => {
        const lastDate = new Date(STATE.REF.lastDate);
        return STATE.REF.dateObj.getUTCFullYear() !== lastDate.getUTCFullYear() ||
                   STATE.REF.dateObj.getMonth() !== lastDate.getMonth() ||
                   STATE.REF.dateObj.getUTCDate() !== lastDate.getUTCDate();
    };
    const isUpdatingWeather = () => {
        const lastDate = new Date(STATE.REF.lastDate);            
        return STATE.REF.dateObj.getUTCFullYear() !== lastDate.getUTCFullYear() ||
                   STATE.REF.dateObj.getMonth() !== lastDate.getMonth() ||
                   STATE.REF.dateObj.getUTCDate() !== lastDate.getUTCDate() ||
                   STATE.REF.dateObj.getUTCHours() !== lastDate.getUTCHours();
    };
    const continueClockTween = () => {
        const funcID = ONSTACK();
        const easeFunction = () => {
            const fID = ONSTACK();
            if (!isTweeningClock)
                return OFFSTACK(fID) && pauseClockTween() && false;
            if (Math.abs(STATE.REF.TweenCurTime) >= Math.abs(STATE.REF.TweenDuration))
                return OFFSTACK(fID) && stopClockTween() && true;
            const newDelta = -1 * STATE.REF.TweenDelta / 2 * (Math.cos(Math.PI * STATE.REF.TweenCurTime / STATE.REF.TweenDuration) - 1);
            isFastTweeningClock = Math.abs(newDelta - STATE.REF.TweenLastTime) > RUNNINGFASTAT;
            STATE.REF.TweenLastTime = newDelta;
            STATE.REF.dateObj.setTime(STATE.REF.TweenStart + newDelta);
            updateClockObj();
            STATE.REF.TweenCurTime += CLOCKSPEED;
            return OFFSTACK(fID) && undefined;
        };
        if (STATE.REF.TweenStart && STATE.REF.TweenTarget) {
            isTweeningClock = true;
            clearInterval(timeTimer);
            timeTimer = setInterval(easeFunction, CLOCKSPEED);
            DB({
                TweenStart: formatDateString(STATE.REF.TweenStart, true),
                TweenTarget: formatDateString(STATE.REF.TweenTarget, true),
                TweenDelta: `~ ${D.Round((STATE.REF.TweenDelta || 0)/3600/1000, 2)} h`,
                TweenDuration: STATE.REF.TweenDuration,
                TweenCurTime: STATE.REF.TweenCurTime,
                TweenLastTime: `~ ${D.Round((STATE.REF.TweenLastTime || 0)/3600/1000, 2)} h`,
                currentDate: formatDateString(STATE.REF.dateObj, true),
                lastDate: formatDateString(STATE.REF.lastDate, true)
            }, "continueClockTween");
        }
        OFFSTACK(funcID);
    };
    const startClockTween = (targetDateObj) => {
        const funcID = ONSTACK();
        isTickingClock = false;
        STATE.REF.TweenStart = STATE.REF.dateObj.getTime();
        STATE.REF.TweenTarget = targetDateObj.getTime();
        STATE.REF.TweenDelta = STATE.REF.TweenTarget - STATE.REF.TweenStart;
        STATE.REF.TweenDuration = (_.findIndex(TWEENDURS, v => STATE.REF.TweenDelta / 60000 <= v) + 1) * 1000;
        STATE.REF.TweenCurTime = 0;
        STATE.REF.TweenLastTime = 0;
        continueClockTween();
        OFFSTACK(funcID);
    };
    const pauseClockTween = () => {
        isTweeningClock = false;
        clearInterval(timeTimer);
        timeTimer = null;
        STATE.REF.currentDate = STATE.REF.dateObj.getTime();            
        DB({currentDate: formatDateString(STATE.REF.currentDate, true), isUpdatingWeather: isUpdatingWeather()}, "pauseClockTween");
        if (isUpdatingWeather())
            setWeather();
        setHorizon();
    };
    const stopClockTween = () => {
        const funcID = ONSTACK();
        pauseClockTween();
        STATE.REF.dateObj.setTime(STATE.REF.TweenTarget);
        isFastTweeningClock = false;
        if (isUpdatingChars()) {
            D.GetChars("allregistered").map(x => setAttrs(x.id, {date_today: STATE.REF.currentDate.toString()}));
            Char.RefreshDisplays();
        }
        DB({dateObj: formatDateString(STATE.REF.dateObj, true), lastDateBeforeSetting: formatDateString(STATE.REF.lastDate, true), isUpdatingChars: isUpdatingChars()}, "stopClockTween");
        STATE.REF.lastDate = STATE.REF.dateObj.getTime();
        setTimeout(fixTimeStatus, 1000);
        delete STATE.REF.TweenTarget;
        delete STATE.REF.TweenStart;
        STATE.REF.TweenCurTime = 0;
        OFFSTACK(funcID);
    };
    const tweenClock = (finalDate) => {
        const funcID = ONSTACK();
        if (STATE.REF.TweenStart && STATE.REF.TweenTarget)
            continueClockTween();
        else
            startClockTween(getDateObj(finalDate));
        OFFSTACK(funcID);
    };
    const tickClock = () => {
        const funcID = ONSTACK();
        if (isTickingClock) {
            const lastHour = STATE.REF.dateObj.getUTCHours();
            STATE.REF.dateObj.setUTCMinutes(STATE.REF.dateObj.getUTCMinutes() + 1);
            updateClockObj();
            if (STATE.REF.dateObj.getUTCHours() !== lastHour)
                setWeather();
            setHorizon();
        }
        OFFSTACK(funcID);
    };
    // #endregion

    // #region COUNTDOWN: Toggling, Ticking, Setting Coundown Text        
    const syncCountdown = (isTesting = false) => {
        const funcID = ONSTACK();
        // if (isCountdownFrozen)
        //   return OFFSTACK(funcID) &&         
        const realDateObj = new Date(new Date().toLocaleString("en-US", {timeZone: "America/New_York"}));
        const nextSessDateObj = new Date(STATE.REF.nextSessionDate || realDateObj);
        const lastSessDateObj = new Date(STATE.REF.lastSessionDate || realDateObj);
        const maxSecs = Math.max((nextSessDateObj - lastSessDateObj)/1000, 7*24*60*60, (nextSessDateObj - realDateObj)/1000);
        const waitSecsMoon = maxSecs - MOON.daysToWaitTill * 24*60*60;
        const waitSecsWater = maxSecs - MOON.daysToWaitTillWater * 24*60*60;
        const totalSecsLeft = VAL({list: isTesting, number: isTesting.daysIn}) ? maxSecs - isTesting.daysIn*24*60*60 : (nextSessDateObj - realDateObj)/1000 - 60;
        const totalSecsIn = maxSecs - totalSecsLeft;
        const moonUpPercent = Math.min(1, D.Float(Math.max(0, totalSecsIn - waitSecsMoon) / (maxSecs - waitSecsMoon)));
        const waterRedPercent = Math.min(1, D.Float(Math.max(0, totalSecsIn - waitSecsWater) / (maxSecs - waitSecsWater)));
        const moonTop = MOON.minTop + (MOON.maxTop - MOON.minTop)*moonUpPercent;
        const waterSource = `red${D.Int(6*waterRedPercent, true)}`;
            
        let secsLeft = totalSecsLeft;
            
        if (secsLeft < 0) {
            STATE.REF.lastSessionDate = nextSessDateObj.getTime();
            secsLeft = setNextSessionDate();
        }
        if (secsLeft < 60 && !isTesting)
            Session.ToggleTesting(false);
                
        const daysLeft = Math.floor(secsLeft / (24 * 60 * 60));
        secsLeft -= daysLeft * 24 * 60 * 60;
        const hoursLeft = Math.floor(secsLeft / (60 * 60));
        secsLeft -= hoursLeft * 60 * 60;
        const minsLeft = Math.floor(secsLeft / 60);
        secsLeft -= minsLeft * 60;

        // D.Alert(D.JS({isCountdownFrozen, maxSecs, totalSecsLeft, totalSecsIn, ["daysToWait MOON"]: MOON.daysToWaitTill, waitSecsMoon, moonUpPercent, moonTop, ["daysToWait WATER"]: MOON.daysToWaitTillWater, waitSecsWater, waterRedPercent, waterSource}), "syncCountdown")
        if (VAL({list: isTesting})) {               
            Media.SetImgData("SplashMoon_1", {top: moonTop}, true);
            Media.SetImg("SplashWater", waterSource);
            isCountdownRunning = false;
        } else if (isCountdownRunning) {
            countdownRecord = [daysLeft, hoursLeft, minsLeft, moonTop, waterSource];

            Media.SetImgData("SplashMoon_1", {top: moonTop}, true);
            Media.SetImg("SplashWater", waterSource);
            // tickCountdown()
            updateCountdownObj();

            startCountdownTimer(secsLeft);
        }
        OFFSTACK(funcID);
    };
    const startCountdownTimer = () => {
        const funcID = ONSTACK();
        if (isCountdownFrozen)
            return OFFSTACK(funcID);
        clearInterval(secTimer);
        secondsLeft = (new Date()).getSeconds();
        secTimer = setInterval(function countdownTimer() {
            const fID = ONSTACK();
            if (isCountdownFrozen)
                return OFFSTACK(fID);
            secondsLeft = 59 - (new Date()).getSeconds();
            if (secondsLeft <= 0)
                syncCountdown();
            else
                updateCountdownObj();
            return OFFSTACK(fID);
        }, 1000); 
        return OFFSTACK(funcID);           
    };
    const updateCountdownObj = () => {
        const funcID = ONSTACK();
        if (isCountdownFrozen || Media.HasForcedState("Countdown")) return OFFSTACK(funcID) && false;
        const isInBlackout = (startBlackout = {days: 0, hours: 0, minutes: 2}, endBlock = {days: 0, hours: 2, minutes: 0}) => {
            const fID = ONSTACK();
            const nextSessionObj = new Date(STATE.REF.nextSessionDate); 
            const lastSessionObj = new Date(STATE.REF.lastSessionDate);
            const maxMins = (nextSessionObj - lastSessionObj) / 60000;
            const startMinsBack = (startBlackout.days * 24 + startBlackout.hours) * 60 + startBlackout.minutes;
            const endMinsAfter = (endBlock.days * 24 + endBlock.hours) * 60 + endBlock.minutes;
            const curMins = (countdownRecord[0] * 24 + countdownRecord[1]) * 60 + countdownRecord[2];
            // DB({countdownRecord, nextSessionObj, lastSessionObj, maxMins, startMinsBack, endMinsAfter, curMins}, "updateCountdownObj")
            // if (curMins <= startMinsBack || curMins >= maxMins - endMinsAfter)
            //    DB({countdownRecord, nextSessionObj, lastSessionObj, maxMins, startMinsBack, endMinsAfter, curMins}, "updateCountdownText")
            return OFFSTACK(fID) && curMins <= startMinsBack || curMins >= maxMins - endMinsAfter;
        };
        if (isInBlackout({days: 0, hours: 0, minutes: 2}, {days: 0, hours: 2, minutes: 0})) {
            Media.ToggleText("Countdown", false);
            Media.SetTextData("NextSession", {shiftTop: -110});
        } else {
            Media.ToggleText("Countdown", true);
            Media.SetTextData("NextSession", {shiftTop: 0});
            Media.SetImgData("SplashMoon_1", {top: countdownRecord[3]}, true);                
            Media.SetImg("SplashWater", countdownRecord[4]);
            Media.SetText("Countdown", [...countdownRecord.slice(0, 3), secondsLeft].map(x => `${x.toString().length === 1 && "0" || ""}${x}`).join(":"));
        }
        return OFFSTACK(funcID);
    };
    // #endregion

    // #region HORIZON & WEATHER: Getting Weather Events & Horizon Image, Setting Img Objects 
    const getTempFromCode = code => WEATHERTEMP.indexOf(code) - 26;
    const convertTempToCode = (tempC, monthNum) => WEATHERTEMP[tempC - getTempFromCode(MONTHTEMP[monthNum]) + 26];
    const convertWeatherDataToCode = (weatherData) => {
        const funcID = ONSTACK();
        const weatherCodes = Object.values({
            event: weatherData.event,
            foggy: weatherData.isFoggy && weatherData.event !== "f" || "x",
            temp: convertTempToCode(weatherData.tempC, weatherData.month), // getTemp(weatherCode[2]) = tempC - monthTemp
            wind: weatherData.wind,
            humid: weatherData.humidity,
            ground: weatherData.groundCover
        }).join("");
        D.Alert(`Converted data to '${weatherCodes}' = '${weatherData.weatherCode}'?<br><br>${D.JS(weatherData)}`, "BIG TEST");
        OFFSTACK(funcID);
    };
    const getWeatherCode = (dateRefs) => {
        return dateRefs ?
            STATE.REF.weatherData[dateRefs[0]][dateRefs[1]][dateRefs[2]] : 
            STATE.REF.weatherData[STATE.REF.dateObj.getUTCMonth()][STATE.REF.dateObj.getUTCDate()][STATE.REF.dateObj.getUTCHours()];
    };
    const getWeatherData = (monthNum, dateNum, hourNum, numUpgrades = 0, isGettingRawData = false) => {
        const funcID = ONSTACK();
        const dateObj = new Date(STATE.REF.dateObj);
        monthNum = VAL({number: monthNum}) ? monthNum : dateObj.getUTCMonth();
        dateNum = VAL({number: dateNum}) ? dateNum : dateObj.getUTCDate();
        hourNum = VAL({number: hourNum}) ? hourNum : dateObj.getUTCHours();
        try {
            const weatherCode = (isGettingRawData && RAWWEATHERDATA || STATE.REF.weatherData)[monthNum][dateNum][hourNum];
            const weatherData = upgradeWeatherSeverity({
                month: monthNum,
                date: dateNum,
                hour: hourNum,
                weatherCode,
                event: weatherCode.charAt(0),
                isFoggy: weatherCode.charAt(1) === "f",
                tempC: getTempFromCode(MONTHTEMP[monthNum]) + getTempFromCode(weatherCode.charAt(2)),
                humidity: weatherCode.charAt(3),
                wind: weatherCode.charAt(4),
                groundCover: weatherCode.charAt(5),
                isDay: isTimeInDay(monthNum, hourNum, 30),
                isRaining: ["w", "p", "t"].includes(weatherCode.charAt(0))
            }, numUpgrades);               
            return OFFSTACK(funcID) && weatherData;
        } catch(errObj) {
            return OFFSTACK(funcID) && false;
        }
    };  
    const getNextWeatherEvent = (eventType, event) => {
        const funcID = ONSTACK();
        const startMonth = STATE.REF.dateObj.getMonth();
        let startYear = STATE.REF.dateObj.getFullYear(),
            startDay = STATE.REF.dateObj.getDate(),
            startHour = STATE.REF.dateObj.getHours();
        const matchFunc = (fullCode, monthNum) => {
            const fID = ONSTACK();
            switch (D.LCase(eventType)) {
                case "event":
                    return OFFSTACK(fID) && event === fullCode.charAt(event === "f" ? 1 : 0);
                case "temp": case "temperature": case "tempC":
                    return OFFSTACK(fID) && fullCode.charAt(2) === convertTempToCode(event, monthNum);
                case "humid":
                    return OFFSTACK(fID) && fullCode.charAt(3) === event;
                case "wind":
                    return OFFSTACK(fID) && fullCode.charAt(4) === event;
                default:
                    return OFFSTACK(fID) && false;
            }
        };                 
        for (let mI = 0; mI < 12; mI++) {
            const m = (mI + startMonth) % 12;
            if (mI > 0 && m === 0)
                startYear++;
            for (let d = startDay; d < STATE.REF.weatherData[m].length; d++)
                try {
                    const hourMatch = _.findIndex(STATE.REF.weatherData[m][d], (v, k) => {
                        const fID = ONSTACK(); 
                        return OFFSTACK(fID) && matchFunc(v, m) && (k <= 5 || k >= 20); });
                    if (hourMatch >= startHour)
                        return OFFSTACK(funcID) && {year: startYear, month: m, day: d, hour: hourMatch, weatherCode: STATE.REF.weatherData[m][d][hourMatch]};
                    startHour = 0;
                } catch (errObj) {
                    D.Alert(`Error at ${mI} ${d}: ${D.JS(errObj)}`, "ERROR");
                }
            startDay = 1;
        }
        return OFFSTACK(funcID) && false;
    };
    const getGroundCover = (code) => {
        code = code || getWeatherCode();
        if (VAL({string: code}) && code.length === 6) {
            const groundChar = code.charAt(5);
            switch (groundChar) {
                case "x":
                    return "blank";
                case "f":
                    return "frost";
                case "w":
                    return "wet";
                default:
                    return `snow${groundChar}`;
            }
        }
        return "blank";
    };      
    const setHorizon = (weatherData) => {
        const funcID = ONSTACK();
        DB({weatherData, hasForcedState: Media.HasForcedState("Horizon")}, "setHorizon");
        if (Media.HasForcedState("Horizon")) return OFFSTACK(funcID) && false;
        weatherData = weatherData || weatherDataMemo || {event: "x"};
        let horizWeather = "";
        switch (weatherData.event.charAt(0)) {
            case "x":
                horizWeather = "clear";
                break;
            case "b":
            case "t":
            case "p":
                horizWeather = "stormy";
                break;
            default:
                horizWeather = "cloudy";
                break;
        }
        const horizonSrc = `${getHorizonTimeString()}${horizWeather}`;
        const horizonData = Media.GetImgData("Horizon_1");
        DB({horizonSrc}, "setHorizon");
        if (isFastTweeningClock && (
            !horizonSrc.includes("day") && horizonData.curSrc.includes("day") ||
                horizonSrc.includes("day") && !horizonData.curSrc.includes("day")
        ) ||
                !isFastTweeningClock) {
            Media.SetImg("Horizon_1", horizonSrc);
            Media.SetImg("Foreground", D.Int(horizonSrc.replace(/\D/gu, "")) > 3 ? "dark" : "bright");
        }
        return OFFSTACK(funcID) && true;
    };
    const setWeather = (isReturningDataOnly = false) => {
        const funcID = ONSTACK();
        const weatherData = Object.assign({}, getWeatherData(), STATE.REF.weatherOverride);
        const getFogSrc = () => {
            const fID = ONSTACK();
            switch (getHorizonTimeString()) {
                case "night1":
                case "night2":
                case "night3":
                    return OFFSTACK(fID) && "darkfog"; // "brightfog"
                case "day":
                    return OFFSTACK(fID) && "blank";
                default:
                    return OFFSTACK(fID) && "darkfog";
            }
        };
        const getSnowSrc = (degree) => {
            const fID = ONSTACK();
            switch (getHorizonTimeString()) {
                case "night1":
                case "night2":
                case "night3":
                    return OFFSTACK(fID) && `bright${degree.toLowerCase()}snow`;
                default:
                    return OFFSTACK(fID) && `dark${degree.toLowerCase()}snow`;
            }
        };
        const forecastLines = [];
        // D.Alert(`Weather Code: ${D.JS(weatherCode)}<br>Month Temp: ${D.JS(getTemp(MONTHTEMP[dateObj.getUTCMonth()]))}<br><br>Delta Temp: ${D.JS(getTemp(weatherCode.charAt(2)))} (Code: ${weatherCode.charAt(2)})`)
        DB({weatherData}, "setWeather");
        if (isReturningDataOnly)
            return OFFSTACK(funcID) && weatherData;
        weatherDataMemo = D.Clone(weatherData);

        if (!Media.HasForcedState("tempC")) {
            Media.ToggleText("tempC", true);
            Media.ToggleText("tempF", true);
            Media.SetText("tempC", `${weatherData.tempC}°C`);
            Media.SetText("tempF", `(${Math.round(Math.round(9 / 5 * weatherData.tempC + 32))}°F)`);
        }
        for (const lightningAnim of ["WeatherLightning_1", "WeatherLightning_2"])
            Media.Kill(lightningAnim);
            
        // WEATHER MAIN
        switch (weatherData.event.charAt(0)) {
            // x: "Clear", b: "Blizzard", c: "Overcast", p: "Downpour", s: "Snowing", t: "Thunderstorm", w: "Drizzle"
            case "b": {
                if (!Media.HasForcedState("WeatherMain")) {Media.ToggleImg("WeatherMain", true); Media.SetImg("WeatherMain", getSnowSrc("heavy"))}
                break;
            }
            case "c": {
                if (!Media.HasForcedState("WeatherMain")) Media.ToggleImg("WeatherMain", false);
                break;
            }
            case "p": {
                if (!Media.HasForcedState("WeatherMain")) {Media.ToggleImg("WeatherMain", true); Media.SetImg("WeatherMain", "heavyrain")}
                break;
            }
            case "s": {
                if (!Media.HasForcedState("WeatherMain")) {Media.ToggleImg("WeatherMain", true); Media.SetImg("WeatherMain", getSnowSrc("light"))}
                break;
            }
            case "t": {
                if (!Media.HasForcedState("WeatherMain")) {Media.ToggleImg("WeatherMain", true); Media.SetImg("WeatherMain", "heavyrain")}
                Media.Pulse(["WeatherLightning_1", "WeatherLightning_2"], 45, 75, 15);
                break;
            } 
            case "w": {
                if (!Media.HasForcedState("WeatherMain")) {Media.ToggleImg("WeatherMain", true); Media.SetImg("WeatherMain", "lightrain")}
                break;
            } 
            case "x": {
                if (!Media.HasForcedState("WeatherMain")) {Media.ToggleImg("WeatherMain", true); Media.SetImg("WeatherMain", "blank")}
                break;
            }
                    // no default
        }

        // WEATHER GROUND
        if (!Media.HasForcedState("WeatherGround"))
            if (getGroundCover(weatherData.weatherCode) === "blank") {
                Media.ToggleImg("WeatherGround", false);
            } else {
                Media.ToggleImg("WeatherGround", true);
                Media.SetImg("WeatherGround", getGroundCover(weatherData.weatherCode));
            }

        // WEATHER FOG
        if (!Media.HasForcedState("WeatherFog"))
            if (weatherData.isFoggy) {
                Media.ToggleImg("WeatherFog", true);
                Media.SetImg("WeatherFog", getFogSrc());
            } else {
                Media.ToggleImg("WeatherFog", false);
            }
        forecastLines.push((weatherData.event === "x" || weatherData.event === "c") && weatherData.isFoggy ? WEATHERCODES[0].f : WEATHERCODES[0][weatherData.event]);
        if (weatherData.humidity !== "x")
            forecastLines.push(WEATHERCODES[1][weatherData.humidity]);
        forecastLines.push(weatherData.tempC < WINTERTEMP ? WEATHERCODES[2][weatherData.wind][1] : WEATHERCODES[2][weatherData.wind][0]);
        if (!Media.HasForcedState("weather")) {
            Media.ToggleText("weather", true);
            Media.SetText("weather", `${forecastLines.join(" ♦ ")}`);
        }
        if (!Media.HasForcedState("WeatherFrost"))
            if (weatherData.tempC <= 0) {
                Media.ToggleImg("WeatherFrost", true);
                Media.SetImg("WeatherFrost", `frost${weatherData.tempC < -12 && "3" || weatherData.tempC < -6 && "2" || "1"}`); 
            } else {
                Media.ToggleImg("WeatherFrost", false);
            }
        Soundscape.Sync();
        return OFFSTACK(funcID) && weatherData;
    };
    const setManualWeather = (event, tempC, wind, humidity) => {
        const funcID = ONSTACK();
        const weatherData = {};
        if (tempC || tempC === 0)
            weatherData.tempC = tempC;
        if (event) {
            weatherData.event = event;
            if (weatherData.event.length === 1)
                weatherData.event += "x";
        }
        if (wind)
            weatherData.wind = wind;
        if (humidity)
            weatherData.humidity = humidity;
        STATE.REF.weatherOverride = weatherData;
        setWeather();
        OFFSTACK(funcID);
    };
    // #endregion

    // #region DATA ANALYSIS, PROCESSING & DISPLAY: Various Functions to Manipulate or Display Weather, Time & Alarm Data
    const displayWeatherReport = () => {
        const funcID = ONSTACK();
        // const weatherCode = STATE.REF.weatherData[dateObj.getUTCMonth()][dateObj.getUTCDate()][dateObj.getUTCHours()],switch(weatherCode.charAt(0)) {
        // x: "Clear", b: "Blizzard", c: "Overcast", f: "Foggy", p: "Downpour", s: "Snowing", t: "Thunderstorm", w: "Drizzle"
        const weatherMatches = {
            x: null,
            b: null,
            c: null,
            f: null,
            p: null,
            s: null,
            t: null,
            w: null
        };
        const weatherStrings = {};
        const weatherCodes = {x: "CLR", b: "BLZ", c: "OCST", f: "FOG", p: "DPR", s: "SNW", t: "TST", w: "DRZ"};
        for (const code of Object.keys(weatherMatches)) {
            weatherMatches[code] = getNextWeatherEvent("event", code);
            if (weatherMatches[code])
                weatherStrings[code] = {
                    date: `<b>${MONTHS[weatherMatches[code].month].slice(0, 3)} ${weatherMatches[code].day}, ${weatherMatches[code].hour > 12 ? `${weatherMatches[code].hour - 12} PM` : `${weatherMatches[code].hour} AM`}</b>`,
                    command: `<span style="width: 40px; display: inline-block;"><a href="!time set ${weatherMatches[code].year} ${weatherMatches[code].month} ${weatherMatches[code].day} ${weatherMatches[code].hour}">${weatherCodes[code]}</a></span>`
                };
            else
                weatherStrings[code] = {
                    date: "<Not Found>",
                    command: "<span style=\"width: 40px; display: inline-block; background-color: grey;\">"
                };
        }
        return OFFSTACK(funcID) && _.values(weatherStrings).map(x => `<div style="display: inline-block; width: 45%; margin: 2px 3% 0px 0px; height: auto;">${x.command} ${x.date}</div>`).join("");
    };
    const getDayScore = (monthNum, dateNum, hourNum) => STATE.REF.stormScores[monthNum][Math.max(dateNum || 0, 1)][hourNum];
    const singleHourCell = (monthNum, dateNum, hourNum, isUpgrading = false, isRaw = false) => {
        const funcID = ONSTACK();
        if (dateNum < 1)
            return OFFSTACK(funcID) && "";
        let weatherData, colors, eventSymbol, groundCover, groundCoverPercent;
        try {
            const TEMPCOLORS = D.KeyMapObj({
                [30]: "darkred",
                [25]: "orangered",
                [20]: "orange",
                [10]: "khaki",
                [0]: "green",
                [-5]: "darkcyan",
                [-12]: "blue",
                [-20]: "darkblue"
            }, null, v => [C.COLORS[v], C.COLORS[v].replace(/1\)/gu, "0.1)")]);
            const dayScore = getDayScore(monthNum, dateNum, hourNum);
            weatherData = getWeatherData(monthNum, dateNum, hourNum, isUpgrading ? Math.floor(dayScore/100) : 0, isRaw);
            if (!weatherData)
                return OFFSTACK(funcID) && "";    
            const tempKeys = Object.keys(TEMPCOLORS).sort();
            const tempIndex = tempKeys.findIndex(x => x > weatherData.tempC);
            const tempKey = tempKeys[tempIndex === -1 ? tempKeys.length - 1 : tempIndex];
            const colorData = weatherData.tempC <= -20 ? TEMPCOLORS[-20] : TEMPCOLORS[tempKey];
            colors = {
                strong: colorData[0],
                weak: colorData[1]
            };
            eventSymbol = {
                x: `${weatherData.isFoggy && `<span style="color: ${C.COLORS.grey};">` || "<span>"}${weatherData.isDay && "<span style=\"font-size: 12px;display: block;margin-bottom: -14px;\">◯</span>" || "☽"}</span>`, // †▲▼†‡
                f: `${weatherData.isFoggy && `<span style="color: ${C.COLORS.grey};">` || "<span>"}${weatherData.isDay && "<span style=\"font-size: 12px;display: block;margin-bottom: -14px;\">◯</span>" || "☽"}</span>`,
                b: `<span style="
                            color: white;
                            text-shadow: 0px 0px 4px black, 0px 0px 4px black, 0px 0px 4px black, 0px 0px 4px black, 0px 0px 4px black, 0px 0px 4px black, 0px 0px 4px black, 0px 0px 4px black, 0px 0px 4px black, 0px 0px 4px black;
                        ">❆</span>`, // ⁂ 
                c: "☁", // ≈
                p: `<span style="
                        color: cyan;
                        text-shadow: 0px 0px 4px navy, 0px 0px 4px navy, 0px 0px 4px navy, 0px 0px 4px navy, 0px 0px 4px navy, 0px 0px 4px navy, 0px 0px 4px navy, 0px 0px 4px navy, 0px 0px 4px navy, 0px 0px 4px navy;
                        "><b>☂</b></span>`, 
                s: "❄", 
                t: "<span style=\"display: block; background-color: #000055; margin-top: 2px; margin-bottom: -16px;\">⚡</span>", // ❂❍❄❆
                w: "☂"
            }[weatherData.event]; // ꜛ��
            groundCover = {
                snow5: 50,
                snow4: 40,
                snow3: 30,
                snow2: 20,
                snow1: 10,
                blank: 0,
                wet: 0,
                frost: 0
            }[getGroundCover(weatherData.weatherCode)];
            groundCoverPercent = D.Int(groundCover * 2 - 10);
            return OFFSTACK(funcID) && `<div style="
                    display: inline-block;
                    height: 29px;
                    width: 29px;
                    margin: 0px;
                    padding: 0px;
                    font-size: 0px;
                    vertical-align: top;
                "><div style="
                        display: block;
                        height: 25px;
                        width: 25px;
                        margin-left: 2px;
                        margin-bottom: -27px;
                    "><div style="
                            display: inline-block;
                            width: 100%;
                            height: ${100 - groundCoverPercent}%;
                        "></div>
                      <div style="
                            display: inline-block;
                            width: 100%;
                            height: ${groundCoverPercent}%;
                            background-color: ${colors.strong.replace(/1\)/gu, "0.5)")};
                            border-top: 2px dotted ${colors.strong};
                        "></div>
                </div><div style="
                        display: block;
                        height: 25px;
                        width: 25px;
                        border: 2px solid ${colors.strong};
                        border-radius: 5px;
                        box-shadow: ${weatherData.isFoggy ? "0px 0px 10px 6px inset rgba(0,0,0,0.5)" : "none"};
                        background-color: ${weatherData.event === "t" && "#000055" || colors.weak};
                        font-size: 16px;
                        font-family: Voltaire;
                        line-height: 14px;
                        text-align: center;
                        text-align-last: center;
                        color: ${C.COLORS.black};
                        margin: 0px;
                        padding: 0px;
                    ">${eventSymbol}<br>${isUpgrading ? `<span style="font-size: 10px; display: block; ${dayScore >= 100 ? `font-family: 'Courier New'; font-size: 12px; font-weight: bold; color: ${C.COLORS.brightred};` : `color: ${C.COLORS.black};`}">${dayScore >= 100 ? "▲".repeat(Math.floor(dayScore/100)) : dayScore}</span>` : `<span style="font-size: 10px; display: block; color: ${C.COLORS.black};">${weatherData.tempC}</span>`}</div></div>`;
        } catch(errObj) {
            DB({weatherData, groundCoverPercent, colors, eventSymbol}, "singleHourCell");
            return OFFSTACK(funcID) && `<div style="
                            display: inline-block;
                            height: 29px;
                            width: 29px;
                            margin: 0px;
                            padding: 0px;
                            font-size: 0px;
                            vertical-align: top;
                        "><div style="
                            display: block;
                            height: 25px;
                            width: 25px;
                            border: 2px solid black;
                            border-radius: 5px;
                            background-color: grey;
                            font-size: 14px;
                            font-family: 'Times New Roman';
                            line-height: 14px;
                            text-align: center;
                            text-align-last: center;
                            font-weight: bold;
                            color: ${C.COLORS.brightred};
                            margin: 0px;
                            padding: 0px;
                        ">E</div>
                    </div>`;
        }
    };
    const singleDayRow = (monthNum, dateNum, isUpgrading = false, isRaw = false) => {
        const funcID = ONSTACK();
        if (dateNum === 0)
            return OFFSTACK(funcID) && "";
        const hourCells = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23].map(x => singleHourCell(monthNum, dateNum, x, isUpgrading, isRaw));
        return OFFSTACK(funcID) && `<div style="
                    display: block;
                    height: 31px;
                    width: 100%;
                    margin: 0px;
                    padding: 0px;
                    text-align: left;
                    text-align-last: left;
                    font-size: 0px;
            "><div style="
            display: inline-block;
            height: 29px;
            width: 29px;
            margin: 0px;
            padding: 0px;
            font-size: 18px;
            font-family: Voltaire;
            text-align: right;
            text-align-last: right;
            margin-right: 5px;
            margin-left: -5px;
        ">${D.Ordinal(dateNum, false)}</div>${hourCells.join("")}</div>`;
    };
    const singleMonthBlock = (monthNum, isUpgrading = false, isRaw = false) => {
        const funcID = ONSTACK();
        // D.Alert(D.JS(D.Clone(STATE.REF.weatherData[monthNum]).slice(1)))            
        const hourSpans = [
            " ",
            ...["12", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"].map(x => `${x} AM`),
            ...["12", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"].map(x => `${x} PM`)
        ].map(x => `<div style="
                    display: inline-block;
                    height: 100%;
                    width: 27px;
                    text-align: center;
                    text-align-last: center;
                    font-family: Voltaire;
                    font-size: 12px;
                    line-height: 22px;
                    color: ${x === " " ? C.COLORS.black : isTimeInDay(monthNum, D.Int(x.replace(/ \w\w$/gu, "").replace(/12/gu, 0)) + (x.includes("PM") && 12 || 0), 30) && C.COLORS.darkpurple || C.COLORS.gold};
                    background-color: ${x === " " ? "transparent" : isTimeInDay(monthNum, D.Int(x.replace(/ \w\w$/gu, "").replace(/12/gu, 0)) + (x.includes("PM") && 12 || 0), 30) && C.COLORS.palegold || C.COLORS.darkblue};
                    border-right: ${x === " " ? "1px solid white" : "1px solid black"};
                    border-left: ${x === " " ? "1px solid white" : "1px solid black"};
                    ">${x}</div>`);
        const headerRow = `<div style="
                    display: block;
                    height: 20px;
                    width: 900px;
                    margin-bottom: 7px;
                ">${hourSpans.join("")}</div>`;
        const dayRows = (new Array(STATE.REF.weatherData[monthNum].length)).fill("").map((x, i) => singleDayRow(monthNum, i, isUpgrading, isRaw));
        // dayRows = D.Clone(STATE.REF.weatherData[monthNum]).slice(1).map((x, i) => singleDayRow(monthNum, i))
        return OFFSTACK(funcID) && `<div style="
                    display: block;
                    width: 900px;
                    height: auto;
                    margin: 0px;
                    padding: 0px;
            ">${headerRow}${dayRows.slice(1).join("")}</div>`;
    };
    const upgradeWeatherSeverity = (weatherData, numUpgrades) => {
        if (!numUpgrades)
            return weatherData;
        if (numReturns <= 5 && randomInteger(10) === 2) {
            numReturns++;
            DB({weatherData, numUpgrades}, "upgradeWeatherSeverity");
        }
        const eventUpgrades = {
            x: ["c", "c"],
            b: ["t", "b"],
            c: ["w", "s"],
            p: ["t", "s"],
            s: ["p", "b"],
            t: ["t", "b"],
            w: ["p", "s"]
        };
        const windUpgrades = {
            x: "s",
            s: "b",
            b: "w",
            w: "g",
            g: "h",
            h: "v",
            v: "v"
        };
        while (numUpgrades > 0) {
            weatherData.event = eventUpgrades[weatherData.event][weatherData.tempC > 0 ? 0 : 1];
            weatherData.wind = windUpgrades[weatherData.wind];
            weatherData.weatherCode = weatherData.weatherCode.replace(/.(...).(.?)/gu, `${weatherData.event}$1${weatherData.wind}$2`);
            numUpgrades--;
        }
        return weatherData;
    };
    const upgradeAllWeather = () => {
        for (let month = 0; month <= 11; month++)
            for (let day = 1; day <= getDaysInMonth(month); day++)
                for (let hour = 0; hour <= 23; hour++) {
                    const weatherData = getWeatherData(month, day, hour);
                    const dayScore = getDayScore(month, day, hour);
                    const numUpgrades = Math.floor(dayScore/100);
                    const newWeatherData = upgradeWeatherSeverity(weatherData, numUpgrades);
                    STATE.REF.weatherData[month][day][hour] = newWeatherData.weatherCode;
                    STATE.REF.stormScores[month][day][hour] = 0;
                }
    };
    const updateWeatherHandout = (monthNum) => {
        const funcID = ONSTACK();
        // Handouts.RemoveAll(MONTHS[monthNum])
        Handouts.Set(`${D.UCase(MONTHS[monthNum])} (Raw)`, undefined, `<h2>${MONTHS[monthNum]}</h2>${singleMonthBlock(monthNum, false, true)}`, true);
        Handouts.Set(`${D.UCase(MONTHS[monthNum])} (Current)`, undefined, `<h2>${MONTHS[monthNum]}</h2>${singleMonthBlock(monthNum, false, false)}`, true);
        OFFSTACK(funcID);
    };
    const parseCodesForGroundCover = (meltRate = 0.3, upRates = {}, maxCover = 60) => {
        const funcID = ONSTACK(); 
        const defaultUpRates = {x: 0, c: 0, w: -0.3, p: -0.7, t: -1, s: 0.3, b: 1.2};
        upRates = Object.assign({}, defaultUpRates, upRates);
        D.Alert(`Processing Ground Cover for:<br>... meltRate: ${meltRate}<br>... upRates: ${D.JS(upRates)}`, "Parse Codes for Ground Cover");
        let runningGroundCover = 0;
        for (const monthRange of [[6, 11], [0, 5]])
            for (let month = monthRange[0]; month <= monthRange[1]; month++) 
                for (let day = 1; day <= getDaysInMonth(month); day++) 
                    for (let hour = 0; hour <= 23; hour++) {
                        const weatherData = getWeatherData(month, day, hour);
                        let {weatherCode} = weatherData;
                        weatherCode = weatherCode.slice(0, 5);
                        runningGroundCover += upRates[weatherData.event] - Math.sqrt(Math.max(0, weatherData.tempC) * meltRate);
                        runningGroundCover = Math.min(Math.max(runningGroundCover, 0),maxCover);
                        const groundCoverLevel = Math.min(5, Math.floor(runningGroundCover/10));
                        if (groundCoverLevel === 0)
                            if (["t","p","w"].includes(weatherData.event))
                                weatherCode += "w";
                            else if (weatherData.tempC < 0)
                                weatherCode += "f";
                            else
                                weatherCode += "x";
                        else
                            weatherCode += groundCoverLevel;
                        STATE.REF.weatherData[month][day][hour] = weatherCode;
                    }
        
        D.Alert(`${D.JS(STATE.REF.weatherData[0][1].join(", "))}<br><h4>Ground Codes Added!</h4>`, "Parse Codes for Ground Cover");
        OFFSTACK(funcID);
    };        
    const parseCodesForStormScore = (eventPoints = {c: 2, p: 15, d: 20, t: 20}, seekHours = 10) => {
        const funcID = ONSTACK();
        delete STATE.REF.stormScores;
        const [stormScoreData, stormScoreReport] = [{}, {}];
        for (let month = 0; month <= 11; month++) {
            stormScoreData[month] = {};
            // stormScoreReport[month] = {}
            for (let day = 1; day <= getDaysInMonth(month); day++) {
                stormScoreData[month][day] = [];
                for (let hour = 0; hour <= 23; hour++) {
                    let thisHourScore = 0;
                    for (let seekCount = -1*seekHours; seekCount <= seekHours; seekCount++) {
                        let [seekHour, seekDay, seekMonth] = [hour + seekCount, day, month];
                        if (seekHour < 0) {
                            seekHour += 24;
                            seekDay--;
                        } else if (seekHour > 23) {
                            seekHour -= 24;
                            seekDay++;
                        }
                        if (seekDay < 1) {
                            seekMonth = seekMonth === 0 ? 11 : seekMonth - 1;
                            seekDay = getDaysInMonth(seekMonth);
                        } else if (seekDay > getDaysInMonth(seekMonth)) {
                            seekMonth = seekMonth === 11 ? 0 : seekMonth + 1;
                            seekDay = 1;
                        }
                        const weatherData = getWeatherData(seekMonth, seekDay, seekHour);
                        thisHourScore += eventPoints[weatherData.event] || 0;
                    }
                    stormScoreData[month][day].push(thisHourScore);
                }
                // stormScoreReport[month][day] = stormScoreData[month][day].join(", ")
            }
        }
        for (let multCount = 0; multCount < 3; multCount++) {
            const theseSeekHours = [2, 1, 1][multCount];
            const theseStormScores = D.Clone(stormScoreData);
            for (let month = 0; month <= 11; month++) {
                // maxSeekStormScoreData[month] = maxSeekStormScoreData[month] || {}
                stormScoreReport[month] = {};
                for (let day = 1; day <= getDaysInMonth(month); day++) {
                    // maxSeekStormScoreData[month][day] = maxSeekStormScoreData[month][day] || []
                    for (let hour = 0; hour <= 23; hour++) {
                        let deltaScore = 100;
                        const thisHourScore = D.Int(theseStormScores[month][day][hour]);
                        for (let seekCount = -1*theseSeekHours; seekCount <= theseSeekHours; seekCount++) {
                            let [seekHour, seekDay, seekMonth] = [hour + seekCount, day, month];
                            if (seekHour < 0) {
                                seekHour += 24;
                                seekDay--;
                            } else if (seekHour > 23) {
                                seekHour -= 24;
                                seekDay++;
                            }
                            if (seekDay < 1) {
                                seekMonth = seekMonth === 0 ? 11 : seekMonth - 1;
                                seekDay = getDaysInMonth(seekMonth);
                            } else if (seekDay > getDaysInMonth(seekMonth)) {
                                seekMonth = seekMonth === 11 ? 0 : seekMonth + 1;
                                seekDay = 1;
                            }
                            if (theseStormScores[seekMonth][seekDay][seekHour] < 100 * multCount ||
                                    multCount === 0 && theseStormScores[seekMonth][seekDay][seekHour] > thisHourScore) {
                                deltaScore = 0;
                                break;
                            }
                        }
                        stormScoreData[month][day][hour] = thisHourScore + deltaScore;
                    }
                    stormScoreReport[month][day] = stormScoreData[month][day].join(", ");
                }
            }
        }

        // NEXT STEP:
        //    Seek through again, with seekHours at 0.5-0.75 the previous one: Any hour with ALL >100 hours on both sides gets ANOTHER +100 added to its score
        //    Repeat with seekHours shrunk again, looking for an hour with ALL >200 hours on both sides --> A third +100 to their score
        //    Then, each hour gets upgraded one level for every 100 points it has.
        STATE.REF.stormScores = D.Clone(stormScoreData);
        D.Alert(D.JS(stormScoreReport), "Storm Scores");
        OFFSTACK(funcID);
    };
    const scanWeatherData = () => { // x: "Clear", b: "Blizzard", c: "Overcast", f: "Foggy", p: "Downpour", s: "Snowing", t: "Thunderstorm", w: "Drizzle"
        //  {x: ["Still", "Still"], s: ["Soft Breeze", "Cutting Breeze"], b: ["Breezy", "Biting Wind"], w: ["Blustery", "High Winds"], g: ["High Winds", "Driving Winds"], h: ["Howling Winds", "Howling Winds"], v: ["Roaring Winds", "Roaring Winds"]}
        let totCodes = 0;
        const rawTally = {
            event: {
                x: [0,0],
                b: [0,0],
                c: [0,0],
                p: [0,0],
                s: [0,0],
                t: [0,0],
                w: [0,0]
            },
            wind: {
                x: [0,0],
                s: [0,0],
                b: [0,0],
                w: [0,0],
                g: [0,0],
                h: [0,0],
                v: [0,0]
            }
        };
        const curTally = {
            event: {
                x: [0,0],
                b: [0,0],
                c: [0,0],
                p: [0,0],
                s: [0,0],
                t: [0,0],
                w: [0,0]
            },
            wind: {
                x: [0,0],
                s: [0,0],
                b: [0,0],
                w: [0,0],
                g: [0,0],
                h: [0,0],
                v: [0,0]
            }
        };
        for (let month = 0; month <= 11; month++)
            for (let day = 1; day <= getDaysInMonth(month); day++)
                for (let hour = 0; hour <= 23; hour++) {
                    const rawWeatherData = getWeatherData(month, day, hour, 0, true);
                    const weatherData = getWeatherData(month, day, hour);
                    if (weatherData.isDay)
                        continue;
                    rawTally.event[rawWeatherData.event][rawWeatherData.isFoggy ? 1 : 0]++;
                    rawTally.wind[rawWeatherData.wind][rawWeatherData.tempC > 0 ? 0 : 1]++;
                    curTally.event[weatherData.event][weatherData.isFoggy ? 1 : 0]++;
                    curTally.wind[weatherData.wind][weatherData.tempC > 0 ? 0 : 1]++;
                    totCodes++;
                }
        D.Alert([
            "<h4>Weather Events (Night Only)</h4>",
            "<table style=\"width: 300px; border: 3px solid black;\"><tr style=\"background-color: black; color: white;\"><th style=\"width: 20%; padding-bottom: 4px;\">Event</th><th style=\"width: 2%; padding-bottom: 4px; text-align: center;\" colspan=\"3\">%</th><th style=\"width: 2%; padding-bottom: 4px; text-align: center;\" colspan=\"3\">Qty</th><th style=\"width: 2%; padding-bottom: 4px; text-align: center;\" colspan=\"3\">w/Fog</th></tr>",
            D.JS(Object.values(D.KeyMapObj(rawTally.event, null, (v, k) => `<tr><td style="border-right: 1px solid black;">${WEATHERCODES[0][k]}</td><td style="text-align: right;">${D.Int(100*(v[0] + v[1])/totCodes, true)}%</td><td style="text-align: center;">►</td><td style="width: 25px; text-align: right; border-right: 1px solid black;">${D.Int(100*(curTally.event[k][0] + curTally.event[k][1])/totCodes, true)}%</td><td style="text-align: right; width: 25px;">${v[0] + v[1]}</td><td style="text-align: center;">►</td><td style="width: 25px; text-align: right; border-right: 1px solid black;">${curTally.event[k][0] + curTally.event[k][1]}</td><td style="text-align: right;">${v[1]}</td><td style="text-align: center;">►</td><td style="width: 25px; text-align: right;">${curTally.event[k][1]}</td></tr>`)).join("")),
            "</table><br>",
            "<h4>Wind Speeds (Night Only)</h4>",
            "<table style=\"width: 300px; border: 3px solid black;\"><tr style=\"background-color: black; color: white;\"><th style=\"width: 20%; padding-bottom: 4px;\">Winds</th><th style=\"width: 2%; padding-bottom: 4px; text-align: center;\" colspan=\"3\">%</th><th style=\"width: 2%; padding-bottom: 4px; text-align: center;\" colspan=\"3\">Qty</th><th style=\"width: 2%; padding-bottom: 4px; text-align: center;\" colspan=\"3\">Winter</th></tr>",
            D.JS(Object.values(D.KeyMapObj(rawTally.wind, null, (v, k) => `<tr><td style="border-right: 1px solid black;">${WEATHERCODES[2][k][1]}</td><td style="text-align: right;">${D.Int(100*(v[0] + v[1])/totCodes, true)}%</td><td style="text-align: center;">►</td><td style="width: 25px; text-align: right; border-right: 1px solid black;">${D.Int(100*(curTally.wind[k][0] + curTally.wind[k][1])/totCodes, true)}%</td><td style="text-align: right; width: 25px;">${v[0] + v[1]}</td><td style="text-align: center;">►</td><td style="width: 25px; text-align: right; border-right: 1px solid black;">${curTally.wind[k][0] + curTally.wind[k][1]}</td><td style="text-align: right;">${v[1]}</td><td style="text-align: center;">►</td><td style="width: 25px; text-align: right;">${curTally.wind[k][1]}</td></tr>`)).join("")),
            "</table>"
        ].join(""), "ScanWeatherData");
    };
    const displayNextAlarms = () => {
        const funcID = ONSTACK();
        // D.Alert([
        //     "<h3>Next Alarms</h3>",
        //     D.JS(_.map(STATE.REF.Alarms.Ahead, v => `${D.JS(v.name)}: ${formatDateString(new Date(v.time), true)}<br>... to: ${D.JSL(v.displayTo)}`)),
        //     "<h3>Next Full Alarm</h3>",
        //     STATE.REF.Alarms.Ahead.length && D.JS(Object.assign(D.Clone(STATE.REF.Alarms.Ahead[0]), {message: D.SumHTML(STATE.REF.Alarms.Ahead[0].message)})) || "NONE"
        // ].join(""), "Upcoming Alarms")
        OFFSTACK(funcID);
    };
    const displayPastAlarms = () => {
        const funcID = ONSTACK();
        // D.Alert([
        //     "<h3>Past Alarms</h3>",
        //     D.JS(_.map(STATE.REF.Alarms.Behind, v => `${D.JS(v.name)}: ${formatDateString(new Date(v.time), true)}<br>... to: ${D.JSL(v.displayTo)}`)),
        //     "<h3>Next Past Alarm</h3>",
        //     STATE.REF.Alarms.Behind.length && D.JS(Object.assign(D.Clone(STATE.REF.Alarms.Behind[0]), {message: D.SumHTML(STATE.REF.Alarms.Behind[0].message)})) || "NONE"
        // ].join(""), "Past Alarms")
        OFFSTACK(funcID);
    };
    // #endregion

    // #region Alarms
    // dateRef: "dawn"/"dusk"/"nextfullnight"/"noon"/"[#] [unit]"   can include multiple with "+"  (use "|" delimiting for chat arg, then set helper macro)
    // name: Name of the alarm
    // message: fully HTML coded message sent when alarm fires (and unfires)
    // actions: ARRAY of functions OR chat strings (can be api commands) to be run when alarm fires
    // revActions: ARRAY as above, run when alarm "unfires" instead
    // recurring: if LIST {years: #, months: #, weeks: #, days: #, hours: #, mins: #}, will repeat alarm at that interval
    // isConditional: if true, will stop clock and confirm with GM before firing
    // regAlarm = () => {

    // },
    // setAttrAlarm = (charRef, attrName, triggerFunc, name, message, actions = [], displayTo = []) => {

    // },
    // setSceneAlarm = (charRef, name, message, actions = [], displayTo = []) => {

    // },
    // setTimeAlarm = (triggerRef, name, message, actions = [], displayTo = [], revActions = [], recurring = false, isConditional = false) => {
    //     const funcID = ONSTACK()
    //     // STEP ONE: FIGURE OUT WHEN THE ALARM SHOULD FIRE.
    //     if (triggerRef.split(":").length > 2)
    //         return OFFSTACK(funcID) && D.Alert(`DateRef '${D.JS(triggerRef)} has too many terms.<br>(A ':' should only appear between the timeRef and the modifying flag)`, "setAlarm")
    //     const workingDate = new Date(STATE.REF.dateObj)
    //     if (VAL({string: triggerRef}) && triggerRef !== "scene")
    //         getDateFromDateString(workingDate, triggerRef, true)
    //     if (VAL({string: actions})) // Actions can be a comma-delimited list of chat commands.
    //         actions = actions.split(/\s*,\s*/gu)
    //     if (VAL({string: revActions})) // Reverse actions can be as above.
    //         revActions = revActions.split(/\s*,\s*/gu)
    //     if (VAL({string: displayTo})) // List of players who receive the alarm is comma-delimited.
    //         displayTo = displayTo.split(/\s*,\s*/gu)
    //     displayTo.push("Storyteller") // Storyteller is added automatically.
    //     DB(`Actions: ${D.JSL(actions.map(x => typeof x))}`, "setAlarm")
    //     if (VAL({string: isConditional}))
    //         isConditional = isConditional.toLowerCase().includes("true")            
    //     const thisAlarm = {
    //         name,
    //         message, // Message sent to [displayTo] = "all" or display names
    //         actions, // Array of functions (no parameters) and/or chat strings run when alarm fired
    //         revActions, // Array as above, run when alarm "unfires" instead
    //         recurring: VAL({string: recurring}) && recurring || null, // Date string to recur on (i.e. "dawn", "endofweek", etc.)
    //         displayTo: _.uniq(_.flatten([displayTo])),
    //         time: workingDate.getTime(),
    //         dateString: formatDateString(workingDate),
    //         isConditional: VAL({bool: isConditional}) && isConditional
    //     }
    //     if (triggerRef === "scene") {
    //         Session.AddSceneAlarm(thisAlarm)
    //         return OFFSTACK(funcID) && true
    //     } else if (VAL({number: thisAlarm.time}, "setAlarm")) {
    //         STATE.REF.Alarms.Ahead.push(D.Clone(thisAlarm))
    //         STATE.REF.Alarms.Ahead = _.sortBy(STATE.REF.Alarms.Ahead, "time")
    //         return OFFSTACK(funcID) && true
    //     }
    //     return OFFSTACK(funcID) && false         
    // },
    // checkAlarm = (lastDateStep, thisDateStep) => {
    //     const funcID = ONSTACK()
    //     if (D.Int(thisDateStep/1000/60) !== STATE.REF.lastAlarmCheck) {
    //         STATE.REF.lastAlarmCheck = D.Int(thisDateStep/1000/60)
    //         while (lastDateStep < thisDateStep && STATE.REF.Alarms.Ahead[0] && STATE.REF.Alarms.Ahead[0].time >= lastDateStep && STATE.REF.Alarms.Ahead[0].time <= thisDateStep)
    //             fireNextAlarm()
    //         while (lastDateStep > thisDateStep && STATE.REF.Alarms.Behind[0] && STATE.REF.Alarms.Behind[0].time <= lastDateStep && STATE.REF.Alarms.Behind[0].time >= thisDateStep)
    //             unfireLastAlarm()
    //     }
    //     OFFSTACK(funcID)
    // },
    // checkCondition = alarm => {
    //     const funcID = ONSTACK()
    //     pauseClockTween()
    //     alarm = D.Clone(alarm)
    //     alarm.conditionOK = true
    //     const alarmEscrow = D.Clone(alarm)
    //     alarm.wasIgnored = true
    //     if ((alarm.revActions || []).length && alarm.time)
    //         STATE.REF.Alarms.Behind.unshift(D.Clone(alarm))
    //     const replyFunc = reply => {
    //         const fID = ONSTACK()
    //         if ((alarm.revActions || []).length && alarm.time)
    //             STATE.REF.Alarms.Behind.shift()
    //         if (reply.includes("stop"))
    //             setTimeout(() => {
    //                 STATE.REF.Alarms.AutoAbort = _.without(STATE.REF.Alarms.AutoAbort, alarmEscrow.name)
    //                 STATE.REF.Alarms.AutoDefer = _.without(STATE.REF.Alarms.AutoDefer, alarmEscrow.name)
    //             }, 6000)
    //         if (reply.includes("defer")) {
    //             fireAlarm(alarmEscrow, false, true)
    //             if (reply.includes("stop"))
    //                 STATE.REF.Alarms.AutoDefer.push(alarmEscrow.name)
    //         } else if (reply.includes("false")) {
    //             fireAlarm(alarmEscrow, true)
    //             if (reply.includes("stop"))
    //                 STATE.REF.Alarms.AutoAbort.push(alarmEscrow.name)
    //         } else {
    //             fireAlarm(alarmEscrow)
    //         }
    //         continueClockTween()
    //         OFFSTACK(fID)
    //     }
    //     D.Prompt( // Locks Dice Roller, Stops & Starts Clock
    //         C.HTML.Block([
    //             C.HTML.Header(`Fire Alarm '${D.JS(alarm.name)}'?`),
    //             C.HTML.Body(`<b>MESSAGE SUMMARY:</b><br>${D.JS(D.SumHTML(alarm.message))}`, {bgColor: C.COLORS.white, border: `3px inset ${C.COLORS.darkgrey}`, width: "95%", margin: "7px 0px 0px 2.5%", fontFamily: "Verdana", fontSize: "10px", lineHeight: "14px", textShadow: "none", color: C.COLORS.black, fontWeight: "normal", textAlign: "left"}),
    //             C.HTML.ButtonLine([
    //                 C.HTML.Button("Fire", "!reply confirm true", {width: "16%", margin: "0px 1% 0px 0px"}),
    //                 C.HTML.Button("Ignore", "!reply confirm false", {width: "16%", margin: "0px 1% 0px 0px"}),
    //                 C.HTML.Button("Ignore Any", "!reply confirm stopfalse", {width: "21%", margin: "0px 1% 0px 0px"}),
    //                 C.HTML.Button("Defer", "!reply confirm defer", {width: "16%", margin: "0px 1% 0px 0px"}),
    //                 C.HTML.Button("Defer Any", "!reply confirm deferstop", {width: "21%", margin: "0px 1% 0px 0px"})
    //             ].join(""), {height: "36px"})
    //         ].join("<br>")),
    //         replyFunc
    //     )
    //     OFFSTACK(funcID)
    // },
    // unfireAlarm = (alarm) => {
    //     const funcID = ONSTACK()
    //     delete alarm.conditionOK
    //     if (!alarm.wasIgnored)
    //         for (const revAction of alarm.revActions)
    //             if (VAL({function: revAction}))
    //                 revAction()
    //             else if (VAL({string: revAction}))
    //                 sendChat("", revAction)
    //     delete alarm.wasIgnored
    //     STATE.REF.Alarms.Ahead.unshift(D.Clone(alarm))
    //     STATE.REF.Alarms.Ahead = _.sortBy(STATE.REF.Alarms.Ahead, "time")
    //     OFFSTACK(funcID)
    // },
    // fireNextAlarm = (isAborting = false, isDeferring = false) => {
    //     const funcID = ONSTACK(),
    //         thisAlarm = STATE.REF.Alarms.Ahead.shift()
    //     DB({FiringAlarm: thisAlarm, AutoAbort: STATE.REF.Alarms.AutoAbort, AutoAbortThisAlarm: STATE.REF.Alarms.AutoAbort.includes(thisAlarm.name)}, "fireNextAlarm")
    //     if (Session.IsTesting || Session.IsSessionActive)
    //         fireAlarm(thisAlarm, isAborting, isDeferring)  
    //     OFFSTACK(funcID)          
    // },
    // unfireLastAlarm = () => {
    //     const funcID = ONSTACK(),
    //         thisAlarm = STATE.REF.Alarms.Behind.shift()
    //     DB({UnfiringAlarm: thisAlarm, message: D.SumHTML(thisAlarm.message)}, "unfireLastAlarm")   
    //     if (Session.IsTesting || Session.IsSessionActive)           
    //         unfireAlarm(thisAlarm)
    //     OFFSTACK(funcID)
    // },
    // #endregion

    const fixTimeStatus = () => {
        const funcID = ONSTACK();
        isCountdownFrozen = false;
        isTweeningClock = false;
        isFastTweeningClock = false;
        if (Session.IsSessionActive && (!Session.IsTesting || Session.IsFullTest)) {
            isCountdownRunning = false;
            isTickingClock = true;
        } else {
            isCountdownRunning = true;
            isTickingClock = false;
        }
        updateClockObj();
        setHorizon(setWeather());
        syncCountdown();
        toggleClock(Session.IsSessionActive && (!Session.IsTesting || Session.IsFullTest), 60);
        Char.RefreshDisplays();
        OFFSTACK(funcID);
    };

    return {
        CheckInstall: checkInstall,
        OnChatCall: onChatCall,

        Fix: fixTimeStatus,
        
        ALARMFUNCS,
        ToggleClock: (v) => { toggleClock(v, 60) },
        Pause: pauseClockTween, Resume: continueClockTween,
        Fire: (alarm) => fireAlarm(alarm, false, false, false),

        get CurrentDate() { return new Date(STATE.REF.dateObj) },
        GetDate: getDateObj,
        get TempC () { return getTempFromCode(MONTHTEMP[STATE.REF.dateObj.getUTCMonth()]) + getTempFromCode(getWeatherCode().charAt(2)) },
        set CurrentDate(dateRef) {
            if (dateRef)
                STATE.REF.dateObj = getDateObj(dateRef);
        },
        FormatDate: formatDateString,
        IsDay: isDateInDay,
        get IsClockRunning() { return isTweeningClock || isFastTweeningClock || isTickingClock },
        get WeatherCode () { return getWeatherCode() },
        get IsRaining() { return getWeatherData().isRaining },
        StopAllTimers: () => {
            isCountdownFrozen = true;
            isCountdownRunning = false;
            isTweeningClock = false;
            isFastTweeningClock = false;
            isTickingClock = false;
        },

        GetRandomTimeline: getRandomEventTriggers,

        SetAlarm: setAlarm
    };
})();

on("ready", () => {
    TimeTracker.CheckInstall();
    D.Log("TimeTracker Ready!");
});
void MarkStop("TimeTracker");