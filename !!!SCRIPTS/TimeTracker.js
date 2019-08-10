void MarkStart("TimeTracker")
const TimeTracker = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "TimeTracker",
        CHATCOMMAND = "!time",
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
                if (msg.type === "api" && (!GMONLY || playerIsGM(msg.playerid) || msg.playerid === "API") && (!CHATCOMMAND || args.shift() === CHATCOMMAND)) {
                    const who = msg.who || "API",
                        call = args.shift()
                    handleInput(msg, who, call, args)
                }
            })
        },
        soundReady = () => { D.Log(`${SCRIPTNAME} Ready!`) }
    // #endregion

    // #region LOCAL INITIALIZATION
    const initialize = () => {        
        STATEREF.dateObj = STATEREF.currentDate ? new Date(STATEREF.currentDate) : null
        STATEREF.Alarms = STATEREF.Alarms || {}
        STATEREF.Alarms.Ahead = STATEREF.Alarms.Ahead || []
        STATEREF.Alarms.Behind = STATEREF.Alarms.Behind || []
        STATEREF.lastDate = STATEREF.lastDate || 0
        STATEREF.weatherOverride = STATEREF.weatherOverride || {}

        if (!STATEREF.dateObj) {
            D.Alert("Date Object Missing! Setting to default date.<br><br>Use !time set [year] [month] [day] [hour] [minute] to correct.", "TimeTracker")
            STATEREF.dateObj = new Date(2019, 11, 1, 18, 55)
            STATEREF.currentDate = STATEREF.dateObj.getTime()
            setCurrentDate()
        }

        if (Session.IsSessionActive)
            startClock()
            //startAirLights()
           
    }
    // #endregion	

    // #region EVENT HANDLERS: (HANDLEINPUT)
    const handleInput = (msg, who, call, args) => {
        let [delta, unit] = [null, null]
        switch ((call || "").toLowerCase()) {
            case "get":
                switch (args.shift().toLowerCase()) {
                    case "alarms":
                        getNextAlarms()
                        getPastAlarms()
                        break
                    /* no default */
                }
                break
            case "set":
                if (args[0] === "weather") {
                    setManualWeather(args[1] && args[1] + (args[1].length === 1 ? "x" : ""), args[2] && parseInt(args[2]), args[3], args[4])
                    break
                }
                unit = "m"
                delta = Math.ceil(((new Date(Date.UTC(..._.map(args, v => parseInt(v))))).getTime() - STATEREF.dateObj.getTime()) / (1000 * 60))
                //D.Alert(`Changing Date by ${D.JS(delta)} minutes.`)
            /* falls through */
            case "add":
                delta = delta || parseFloat(args.shift())
                unit = unit || args.shift().toLowerCase()
                tweenClock(addTime(STATEREF.dateObj, delta, unit))
                return
            case "setalarm": // !time setalarm 2 d alarmName message ending in a pipe|space-delim'd list of people to display to
                setAlarm(addTime(STATEREF.dateObj, parseInt(args.shift()), args.shift()), args.shift(), args.join(" ").split("|")[0], null, args.join(" ").split("|")[1].split(" "))
                break
            case "run":
                startClock()
                break
            case "stop":
                stopClock()
                break            
            case "stoplights":
                isAirlights = false
                break
            case "testground":
                //D.Alert("Received, Testing...")
                getGroundCover(true, ...args)
                break
            case "testalarm":
                setAlarm(args.shift())
                break
            case "testfirealarm":
                fireNextAlarm()
                break
            case "weatherreport": {
                const transitionStrings = [
                    `<tr><td style="width:100px; text-align:right; text-align-last:right;">DAY -> Night1</td><td style="width:60px; text-align:right; text-align-last:right;">${getTime(TWILIGHT[STATEREF.dateObj.getMonth()][1], 0, true)}</td></tr>`,
                    `<tr><td style="text-align:right; text-align-last:right;">Night1 -> Night2</td><td style="text-align:right; text-align-last:right;">${getTime(_.findKey(IMAGETIMES, v => v === "night1"), 0, true)}</td></tr>`,
                    `<tr><td style="text-align:right; text-align-last:right;">Night2 -> Night3</td><td style="text-align:right; text-align-last:right;">${getTime(_.findKey(IMAGETIMES, v => v === "night2"), 0, true)}</td></tr>`,
                    `<tr><td style="text-align:right; text-align-last:right;">Night3 -> Night4</td><td style="text-align:right; text-align-last:right;">${getTime(_.findKey(IMAGETIMES, v => v === "night3"), 0, true)}</td></tr>`,
                    `<tr><td style="text-align:right; text-align-last:right;">Night4 -> Night5</td><td style="text-align:right; text-align-last:right;">${getTime(_.findKey(IMAGETIMES, v => v === "night4"), 0, true)}</td></tr>`,
                    `<tr><td style="text-align:right; text-align-last:right;">-> Predawn5</td><td style="text-align:right; text-align-last:right;">${getTime(TWILIGHT[STATEREF.dateObj.getMonth()][0], -120, true)}</td></tr>`,
                    `<tr><td style="text-align:right; text-align-last:right;">-> Predawn4</td><td style="text-align:right; text-align-last:right;">${getTime(TWILIGHT[STATEREF.dateObj.getMonth()][0], -30, true)}</td></tr>`,
                    `<tr><td style="text-align:right; text-align-last:right;">-> Predawn3</td><td style="text-align:right; text-align-last:right;">${getTime(TWILIGHT[STATEREF.dateObj.getMonth()][0], -20, true)}</td></tr>`,
                    `<tr><td style="text-align:right; text-align-last:right;">-> Predawn2</td><td style="text-align:right; text-align-last:right;">${getTime(TWILIGHT[STATEREF.dateObj.getMonth()][0], -10, true)}</td></tr>`,
                    `<tr><td style="text-align:right; text-align-last:right;">-> Predawn1</td><td style="text-align:right; text-align-last:right;">${getTime(TWILIGHT[STATEREF.dateObj.getMonth()][0], -5, true)}</td></tr>`,
                    `<tr><td style="text-align:right; text-align-last:right;">Predawn1 -> DAY</td><td style="text-align:right; text-align-last:right;">${getTime(TWILIGHT[STATEREF.dateObj.getMonth()][0], 0, true)}</td></tr>`
                ]
                D.Alert(D.JSH(`
<b><u>WEATHER REPORT</u></b>
<br><br>
${getWeatherReport().join("<br>")}
<br><br>
<b><u>HORIZON TRANSITIONS</u></b>
<br><br>
<table>${transitionStrings.join("")}</table>
<br><br>
<b>!time</b> commands are 'add', 'set', 'run' and 'stop'.
<br><br>
To set: <b>!time set [year] [month] [day] [hour] [min]</b>
<br><br>
Weather: <b>!time set weather [event] [tempC] [wind] [humidity]</b><table><tr><td style="width:18%;">[EVENT]</td><td style="width:29%;">x: Clear</td><td style="width:29%;">b: Blizzard</td><td style="width:29%;">c: Overcast</td></tr><tr><td style="width:18%;"></td><td style="width:29%;">f: Foggy</td><td style="width:29%;">p: Downpour</td><td style="width:29%;">s: Snowing</td></tr><tr><td style="width:18%;"></td><td style="width:29%;">t: Thunderstorm</td><td style="width:29%;">w: Drizzle</td></tr><tr><td style="width:18%;"></td><td style="width:29%;"></td><td style="width:29%;"><i>(+f for foggy)</i></td></tr>
<br><tr><td><br></td></tr><tr><td style="width:18%;">[WIND]</td><td style="width:29%;">x: Still</td><td style="width:29%;">s: Soft Breeze</td><td style="width:29%;">b: Breezy</td></tr><tr><td style="width:18%;"></td><td style="width:29%;">w: Blustery</td><td style="width:29%;">g: Driving Winds</td><td style="width:29%;">h: Howling Winds</td></tr><tr><td style="width:18%;"></td><td style="width:29%;"></td><td style="width:29%;">v: Roaring Winds</td></tr>
<br><tr><td><br></td></tr><tr><td style="width:18%;">[HUMID]</td><td style="width:29%;">x: null</td><td style="width:29%;">d: Dry</td><td style="width:29%;">h: Humid</td></tr><tr><td style="width:18%;"></td><td style="width:29%;"></td><td style="width:29%;">m: Muggy</td><td style="width:29%;">s: Sweltering</td></tr></table>`), "TIMETRACKER")
                break
            }
            default:
                D.Alert(D.JSH(`<b>!time</b> commands are 'add', 'set', 'run' and 'stop'.
<br><br>
To set: <b>!time set [year] [month] [day] [hour] [min]</b>
<br><br>
Weather: <b>!time set weather [event] [tempC] [wind] [humidity]</b><table><tr><td style="width:18%;">[EVENT]</td><td style="width:29%;">x: Clear</td><td style="width:29%;">b: Blizzard</td><td style="width:29%;">c: Overcast</td></tr><tr><td style="width:18%;"></td><td style="width:29%;">f: Foggy</td><td style="width:29%;">p: Downpour</td><td style="width:29%;">s: Snowing</td></tr><tr><td style="width:18%;"></td><td style="width:29%;">t: Thunderstorm</td><td style="width:29%;">w: Drizzle</td></tr><tr><td style="width:18%;"></td><td style="width:29%;"></td><td style="width:29%;"><i>(+f for foggy)</i></td></tr>
<br><tr><td><br></td></tr><tr><td style="width:18%;">[WIND]</td><td style="width:29%;">x: Still</td><td style="width:29%;">s: Soft Breeze</td><td style="width:29%;">b: Breezy</td></tr><tr><td style="width:18%;"></td><td style="width:29%;">w: Blustery</td><td style="width:29%;">g: Driving Winds</td><td style="width:29%;">h: Howling Winds</td></tr><tr><td style="width:18%;"></td><td style="width:29%;"></td><td style="width:29%;">v: Roaring Winds</td></tr>
<br><tr><td><br></td></tr><tr><td style="width:18%;">[HUMID]</td><td style="width:29%;">x: null</td><td style="width:29%;">d: Dry</td><td style="width:29%;">h: Humid</td></tr><tr><td style="width:18%;"></td><td style="width:29%;"></td><td style="width:29%;">m: Muggy</td><td style="width:29%;">s: Sweltering</td></tr></table>`), "TIMETRACKER")
                return
        }
    }
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************


    let timeTimer = null,
        [isRunning, isRunningFast, isAirlights, isTimeRunning] = [false, false, true, false]

    // #region Configuration
    const [airLights, airTimes] = [{}, {}],
        CLOCKSPEED = 50,
        TWEENDURS = [15, 40, 60, 600, 1440, 3000, 5000, 7000, 8000, 9000, 10000, Infinity],
        RUNNINGFASTAT = 1500000,
        DAYSOFWEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        TWILIGHT = [
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
        ],
        IMAGETIMES = {
            "1:00": "night2",
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
        },
        AIRLIGHTS = {
            AirLightLeft_1: ["on:0", "on:7000", "half:100", "off:100", "half:100", "off:100", "half:100", "off:100"],
            AirLightMid_1: ["on:0", "on:5000", "off:500"],
            AirLightTop_1: ["on:0", "on:60000", "off:1000", "on:1000", "off:1000", "on:1000", "off:1000", "on:1000", "off:1000", "on:1000", "off:1000"],
            /* AirLightCN_1: ["off:0", "off:10000", "on:1000", "off:1000"],
              AirLightCN_2: ["off:2000", "off:10000", "on:1000", "off:1000"],
              AirLightCN_3: ["off:6000", "off:10000", "on:1000", "off:1000"], */
            AirLightCN_4: ["on:0", "on:2000", "off:2000"],
            AirLightCN_5: ["on:100", "on:2000", "off:2000"]
        },
        WEATHERCODES = [
            { x: "Clear", b: "Blizzard", c: "Overcast", f: "Foggy", p: "Downpour", s: "Snowing", t: "Thunderstorm", w: "Drizzle" },
            { x: null, d: "Dry", h: "Humid", m: "Muggy", s: "Sweltering" },
            { x: ["Still", "Still"], s: ["Soft Breeze", "Cutting Breeze"], b: ["Breezy", "Biting Wind"], w: ["Blustery", "High Winds"], g: ["High Winds", "Driving Winds"], h: ["Howling Winds", "Howling Winds"], v: ["Roaring Winds", "Roaring Winds"] }
        ],
        WINTERTEMP = 25,
        WEATHERDATA = [
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
             ["cxDxs", "cxDxs", "cxDxs", "cxDxs", "xxBxs", "xx0xs", "xxBxs", "xx0xs", "xxAxx", "xxCxs", "xxExb", "xxExb", "xxFxb", "cxGxb", "cxGxb", "wxFxs", "wfFxb", "wfFxb", "wfGxs", "wfGxs", "wfHxs", "fxGxx", "fxHxx", "fxHxs"],
             ["wfHxx", "wfIxs", "fxIxx", "fxIxs", "fxHxx", "fxHxx", "fxLxs", "cxMxs", "wxMxs", "wxNxb", "cxNxs", "cxOxs", "cxPxb", "cxPxg", "cxPxs", "wxQxs", "wxPxs", "wxPxs", "wfPxb", "wfPxs", "wfPxb", "wfPxw", "wfPxw", "wfPxg"],
             ["wfPxw", "wfPxw", "wfPxw", "wfQxb", "wxQxs", "wxQxb", "wxRxw", "wxQxs", "wfNxg", "wxJxw", "wfHxh", "wfGxv", "pfExh", "pxCxv", "bxAxh", "bxaxw", "bxbxw", "bxcxg", "bxdxh", "cxdxh", "bxexh", "bxexw", "cxexg", "bxfxg"],
             ["bxfxw", "cxgxh", "cxgxv", "cxgxg", "cxhxg", "cxhxg", "cxixg", "cxixb", "cxixw", "cxjxw", "xxixw", "xxixg", "xxhxg", "xxhxg", "xxgxw", "xxgxw", "xxhxh", "xxhxb", "xxhxb", "xxhxs", "xxixs", "xxjxs", "xxjxx", "xxjxx"],
             ["xxkxs", "xxkxs", "xxkxs", "xxkxs", "xxkxx", "xxlxs", "xxlxs", "xxlxx", "xxlxx", "xxjxx", "cxfxs", "cxdxs", "cxbxs", "cxaxs", "cx0xs", "cxaxs", "cxaxs", "cxbxs", "cxbxs", "cxcxs", "cxbxs", "cxbxs", "cxbxb", "cxbxb"],
             ["cxbxw", "cxcxb", "cxcxw", "cxcxw", "cxcxb", "sxbxb", "bxcxw", "bxdxw", "bxexw", "bxexg", "bxfxw", "bxfxw", "bxexg", "bxexw", "sxdxb", "sxdxb", "sxdxs", "sxdxb", "sxdxb", "bxdxw", "sxdxb", "sxdxb", "sxdxs", "sxdxs"],
             ["sxdxs", "sxdxs", "sxcxs", "sxcxs", "sxdxs", "sxdxs", "sxcxs", "sxcxx", "sxcxs", "sxcxx", "sxaxx", "sx0xs", "sx0xs", "cxBxs", "cxBxs", "cxBxb", "cxBxs", "cxBxx", "cxAxs", "cx0xs", "sx0xx", "sx0xs", "sxaxs", "sxaxs"],
             ["sxbxs", "sxcxs", "sxcxs", "sxdxs", "sxdxs", "sxdxs", "sxfxs", "xxfxx", "xxgxs", "xxfxs", "xxdxs", "xxbxw", "xxaxb", "cx0xs", "cx0xw", "cx0xb", "xx0xb", "xxaxb", "xxbxb", "xxbxw", "xxbxg", "xxaxg", "xxaxb", "xxbxw"],
             ["xxaxw", "xxbxw", "xxbxb", "xxbxs", "xxcxs", "xxcxs", "xxcxw", "sxcxb", "bxbxw", "sxbxb", "sxbxb", "sxaxs", "sxaxs", "sx0xb", "sx0xs", "sx0xs", "cxAxs", "bf0xw", "sx0xb", "sx0xs", "sx0xs", "sxAxs", "cxAxs", "cxAxs"],
             ["cxAxs", "xx0xs", "xxAxs", "xxAxs", "cxAxs", "cxAxs", "cxBxs", "cxBxb", "cxBxs", "cxBxw", "cxCxb", "cxDxb", "cxDxb", "xxExb", "xxFxw", "xxGxb", "cxGxb", "cxFxb", "cxFxs", "cxFxb", "cxFxb", "cxGxw", "cxGxw", "cxHxw"],
             ["cxHxg", "cxHxg", "cxGxw", "cxGxs", "cxGxs", "cxGxs", "cxHxs", "cxHxs", "cxHxs", "cxHxb", "cxIxb", "cxJxs", "cxJxb", "cxKxs", "cxKxb", "cxKxs", "cxKxb", "cxJxs", "cxJxs", "xxIxs", "xxHxs", "xxGxs", "xxGxs", "xxGxs"],
             ["xxFxs", "cxFxx", "cxExx", "cxExx", "cxExx", "cxExx", "cxExx", "cxDxs", "cxDxx", "cxExx", "xxGxx", "xxIxs", "xxJxs", "cxJxs", "cxIxs", "cxJxs", "cxJxs", "cxHxs", "fxGxs", "fxGxx", "fxGxs", "fxGxx", "wfGxx", "wfGxs"],
             ["wfGxx", "wfGxx", "wfGxs", "wfHxs", "wfHxs", "wfHxs", "wfHxs", "wfHxs", "wfGxs", "wfGxb", "wfGxb", "wfHxb", "wfHxw", "wfHxb", "wfGxw", "wfFxg", "fxFxg", "fxFxw", "fxFxb", "fxGxw", "fxFxs", "fxFxb", "wfFxb", "wfFxb"],
             ["wfGxs", "fxGxs", "wfHxs", "wfHxs", "wfIxs", "fxIxx", "fxIxs", "fxIxs", "fxIxs", "fxIxs", "fxJxs", "fxKxs", "fxLxw", "cxKxb", "cxKxb", "cxJxg", "wxJxb", "wxIxw", "sxGxb", "cxExw", "cxDxw", "bxCxw", "cxBxw", "sxAxb"],
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
             ["sxdxs", "cxdxs", "fxdxs", "fxexs", "fxexs", "fxexs", "fxexs", "fxexs", "fxexs", "sxdxs", "sxdxs", "sxcxs", "sxcxs", "sxcxb", "sxcxs", "sxcxs", "sxcxb", "sxcxs", "sxdxs", "cxdxs", "cxdxs", "cxdxs", "cxdxs", "cxexs"],
             ["cxexs", "cxfxs", "cxfxs", "cxfxs", "cxexs", "cxdxs", "cxdxs", "cxdxb", "cxdxs", "cxdxb", "cxdxb", "cxdxs", "xxdxs", "fxcxb", "sfbxs", "sfaxs", "cxaxx", "fxaxs", "sxaxs", "cxaxs", "cxaxs", "cxaxb", "cxbxb", "cxbxs"],
             ["cxaxb", "cxaxb", "cxaxb", "cxcxs", "xxdxs", "xxexs", "xxexs", "xxexs", "xxexs", "sxdxs", "xxcxs", "xxcxw", "xxcxb", "cxcxw", "cxcxb", "cxcxb", "cxdxb", "cxdxs", "cxexs", "xxfxs", "xxgxs", "xxgxs", "xxhxs", "xxgxs"],
             ["xxhxs", "xxixs", "xxjxx", "xxmxx", "xxmxx", "xxmxx", "xxmxx", "xxnxx", "xxmxx", "xxjxx", "cxgxs", "cxexs", "sxdxs", "cxcxb", "cxcxs", "cxcxs", "cxcxb", "cxcxs", "cxcxs", "cxbxs", "cxbxs", "cxbxs", "cxaxs", "cxbxx"],
             ["cxcxx", "cxcxs", "cxcxx", "cxcxx", "cxaxs", "cx0xs", "cx0xs", "xx0xs", "fx0xs", "fxAxs", "xxCxb", "xxDxs", "xxFxs", "xxGxw", "xxGxb", "xxGxb", "xxGxw", "xxGxs", "xxFxs", "xxFxb", "xxExb", "xxExb", "xxExs", "xxExx"],
             ["xxDxs", "cxExs", "fxExs", "fxExs", "fxExs", "fxExs", "fxFxs", "fxFxb", "fxFxb", "fxGxw", "cxHxw", "cxIxw", "cxIxs", "cxIxs", "cxJxb", "cxJxb", "cxJxb", "cxJxb", "cxIxs", "cxHxs", "cxHxs", "cxGxs", "cxGxs", "cxFxb"],
             ["cxFxb", "cxExs", "cxDxs", "cxDxs", "cxCxs", "cxCxb", "cxCxs", "cxCxb", "cxCxw", "bx0xg", "cx0xg", "cxaxw", "cxaxh", "xxaxh", "xxaxg", "xxbxh", "xxbxw", "xxaxw", "xxbxs", "xxcxs", "xxdxs", "xxdxs", "xxexs", "xxexs"],
             ["xxexs", "xxexs", "xxexs", "xxfxx", "xxgxx", "xxgxx", "xxhxx", "xxixx", "xxhxx", "xxdxs", "cx0xb", "cx0xw", "cx0xw", "cx0xw", "cx0xb", "cx0xw", "cx0xw", "cx0xb", "cx0xb", "cx0xs", "cx0xb", "cx0xs", "cx0xs", "cx0xs"],
             ["cx0xs", "sx0xs", "sx0xs", "sx0xs", "cx0xs", "sx0xs", "sxAxs", "sxAxs", "sxBxs", "sxBxs", "cxDxb", "cxDxw", "cxDxb", "cxDxs", "cxDxs", "cxExb", "xxExb", "xxCxw", "xxCxb", "xxBxw", "xxBxs", "xxBxs", "cxBxs", "cxAxb"],
             ["cxAxs", "cxAxs", "cxAxs", "cxAxs", "cxAxs", "cxAxs", "cxaxs", "cxaxs", "cx0xx", "cxCxs", "cxDxs", "cxFxs", "cxFxs", "wfExs", "wfDxs", "wfDxx", "wfDxs", "fxDxs", "wfDxs", "wfDxx", "wfDxx", "wfDxx", "wfDxs", "wfExs"],
             ["wfExx", "wfFxx", "fxFxx", "fxFxs", "fxFxx", "fxFxs", "fxFxs", "wfFxx", "wfFxx", "wfFxx", "wfGxx", "wfHxx", "wfIxs", "wfMxs", "wfMxs", "wxOxb", "cxQxb", "cxQxb", "cxQxs", "cxQxs", "cxPxs", "cxOxs", "cxOxs", "cxPxs"],
             ["cxQxw", "cxPxs", "cxPxs", "cxOxs", "cxOxx", "cxKxx", "wxMxx", "wxExg", "wxDxg", "wxDxw", "wxCxw", "wxDxw", "wxDxw", "wxCxw", "wxCxg", "wxDxw", "cxCxw", "cxBxb", "cxBxb", "xxAxs", "xxAxs", "xxAxs", "xx0xs", "xx0xb"],
             ["xxaxb", "xxaxw", "xxaxb", "xxaxs", "cxaxs", "cxaxs", "cxaxs", "cxaxs", "cxaxs", "cx0xs", "cxAxb", "cxAxs", "cxAxs", "cxBxs", "cxBxs", "cxCxs", "cxCxb", "cxCxs", "cxBxs", "xxAxs", "xxAxs", "xx0xs", "cx0xs", "cx0xb"],
             ["cx0xs", "cx0xs", "cxaxb", "cxaxs", "cxaxb", "cxaxw", "cxaxs", "cxAxb", "cxAxw", "wfBxb", "wfCxw", "wfCxb", "wfDxs", "wfDxs", "wfExs", "wfExs", "wfFxx", "wfFxs", "fxFxs", "cxGxs", "cxHxs", "cxGxs", "cxGxs", "cxGxs"],
             ["cxGxb", "cxGxs", "wxFxw", "wxExs", "cxExs", "cxExs", "cxDxs", "cxCxs", "cxBxb", "cxBxb", "cxCxb", "cxCxb", "cxDxs", "cxExs", "cxExs", "cxFxs", "xxFxs", "xxFxs", "xxExs", "xxCxs", "xxCxs", "xxCxs", "cxBxb", "cxCxb"],
             ["cxCxg", "wxCxg", "wxBxg", "wxBxg", "wxBxh", "wxCxg", "wfCxg", "wfDxg", "wfDxs", "wfFxs", "cxGxs", "cxLxb", "cxMxw", "xxMxg", "xxMxg", "xxLxw", "xxLxw", "xxJxg", "xxIxw", "xxHxb", "xxGxb", "xxFxb", "xxFxb", "xxExb"],
             ["xxExs", "xxExs", "xxDxs", "xxDxs", "xxCxx", "xxBxx", "xxAxx", "xxBxs", "xxCxs", "xxExb", "cxExb", "cxGxb", "cxGxb", "xxHxw", "xxHxs", "xxIxb", "xxIxs", "xxHxb", "xxGxs", "xxFxs", "xxExs", "xxDxx", "xxCxx", "xxCxs"],
             ["xxCxs", "xx0xx", "xxaxx", "xx0xx", "xxBxs", "xx0xx", "xx0xx", "xx0xx", "xxCxs", "xxFxs", "xxHxs", "xxKxb", "xxMxb", "xxNxw", "xxOxg", "xxOxg", "xxOxw", "xxNxw", "xxLxb", "cxKxw", "cxKxb", "cxJxs", "cxJxs", "cxJxs"],
             ["cxIxs", "cxIxs", "cxIxs", "cxFxs", "cxGxs", "cxFxx", "cxDxx", "cxFxs", "cxFxs", "cxIxs", "cxIxs", "cxKxs", "cxLxs", "xxNxb", "xxPxb", "xxQxw", "cxQxb", "cxOxw", "cxKxw", "xxGxw", "xxDxw", "xxDxw", "cxDxw", "cxDxs"]
            ],
            ["a",
             ["cxCxw", "cxCxb", "cxBxb", "cxBxb", "cxBxs", "cxAxx", "cxaxs", "cxAxs", "cxBxs", "cxBxs", "cxCxw", "cxDxs", "cxDxb", "cxExw", "cxExb", "cxDxb", "cxCxb", "cxCxs", "cxCxs", "cxDxs", "cxExb", "cxDxb", "cxDxw", "bxCxg"],
             ["bxBxw", "bxAxg", "bxAxw", "bx0xg", "cxAxw", "cxAxg", "cxAxg", "cx0xw", "cxAxw", "cxAxh", "cxAxg", "cxBxg", "cxCxh", "cxCxh", "cxCxh", "cxCxg", "cxBxg", "cxBxw", "cxAxg", "xxAxw", "xx0xw", "xx0xb", "xx0xw", "xxaxb"],
             ["xxaxb", "xxaxb", "xxbxb", "xxbxw", "xxbxs", "xxbxb", "xxcxw", "xxcxb", "xxbxw", "xx0xg", "xx0xg", "xxBxg", "xxBxg", "xxCxg", "xxDxg", "xxDxg", "xxDxg", "xxCxw", "xxAxg", "xx0xw", "xxaxw", "xxaxw", "xxaxw", "xx0xg"],
             ["xxaxg", "xxaxw", "xxbxb", "xxbxs", "xxcxg", "xxcxw", "xxdxw", "xxdxw", "xxcxw", "xxbxg", "xxaxg", "xx0xw", "xxAxg", "xxAxg", "xxBxg", "xxBxg", "xxAxg", "xx0xg", "xxaxg", "xxbxw", "xxbxw", "xxbxb", "xxbxw", "xxbxw"],
             ["xxcxw", "xxdxg", "xxdxg", "xxdxg", "xxexb", "xxexb", "xxfxb", "xxfxb", "xxexs", "xxcxw", "xxbxw", "xxaxs", "xx0xs", "cxBxs", "cxBxs", "cxBxb", "cxBxs", "cxBxs", "cxAxb", "xx0xs", "xxaxs", "xxaxs", "xxbxx", "xxbxx"],
             ["xxbxx", "cxbxx", "cxbxx", "cxaxs", "cxaxs", "sxaxs", "sxaxs", "cxaxs", "sxaxb", "bx0xw", "sx0xb", "bx0xw", "bx0xw", "cx0xw", "cx0xw", "cxAxg", "bxAxw", "bxAxw", "sxAxs", "sxAxb", "sxBxs", "sxBxb", "cxBxs", "cxBxs"],
             ["cxAxs", "xx0xs", "xx0xs", "xxAxs", "cxAxs", "cxAxs", "cxAxs", "fxAxs", "fxAxs", "fxBxb", "cxCxb", "cxCxb", "cxDxb", "cxCxs", "cxCxb", "sxCxs", "sxCxb", "wxCxs", "wxCxs", "fxBxs", "sfBxb", "fxBxs", "fxBxs", "fxBxs"],
             ["fxAxb", "cx0xs", "cx0xb", "cxaxb", "cxaxb", "cxaxb", "cxbxs", "cxbxs", "cxbxs", "cxbxs", "cxbxs", "cxaxs", "cxaxs", "cx0xs", "cx0xs", "cx0xs", "cx0xs", "cx0xs", "cx0xs", "cxaxs", "cxaxx", "cxaxs", "cxaxs", "cxbxs"],
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
             ["cxDxs", "cxDxs", "cxExs", "cxExs", "cxDxs", "cxDxs", "cxDxb", "cxDxw", "cxExw", "wxExb", "wxDxb", "wxDxw", "wxCxb", "wxCxw", "wfCxb", "wfCxs", "wfDxs", "wfDxs", "wfDxs", "wfExs", "fxExx", "fxFxx", "fxFxs", "fxExs"],
             ["fxExs", "fxExs", "fxExw", "fxDxw", "cxCxs", "cxCxw", "cxCxb", "cxCxs", "cxCxb", "cxDxs", "cxExs", "cxFxs", "cxGxx", "cxHxs", "cxHxx", "cxIxs", "cxIxs", "cxGxs", "cxGxs", "cxExs", "cxDxs", "cxDxx", "xxBxx", "xxBxx"],
             ["xxAxx", "xxAxs", "xxAxx", "fx0xx", "fxAxx", "fxCxx", "fxCxx", "fxCxs", "fxDxx", "fxExs", "fxExs", "wfFxs", "wfFxs", "wfGxs", "wfGxs", "wfGxb", "wxFxb", "wxFxs", "wxFxb", "wxFxw", "wxExb", "wxExb", "wxExb", "wxExw"],
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
             ["xxexx", "fxfxx", "fxfxx", "fxfxx", "fxgxs", "fxfxx", "fxexx", "pfcxs", "wfbxs", "wfbxb", "wfaxb", "wfaxw", "wf0xs", "wf0xb", "wfAxb", "fxCxs", "cxExx", "cxHxs", "cxHxs", "xxFxs", "xxGxs", "xxCxg", "cxAxg", "cxAxb"],
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
             ["cxgxs", "cxgxs", "cxgxs", "cxgxx", "cxgxs", "wfhxs", "wxhxs", "fxgxs", "wfgxb", "fxgxs", "fxfxs", "fxdxs", "fxaxs", "cxExw", "cxGxg", "txaxv", "cxFxh", "cxexv", "cxgxh", "cxgxw", "cxgxg", "cxhxw", "xxhxs", "xxixs"],
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
             ["cxBxs", "cxAxs", "wx0xs", "tfaxs", "wfaxs", "fxaxs", "wf0xx", "wfaxb", "wxbxs", "wxbxs", "wxaxx", "wxaxs", "wx0xs", "cxAxs", "cxCxs", "cxCxb", "xxBxw", "xxBxw", "xxBxw", "cxaxb", "cxcxs", "cxdxs", "xxexs", "xxfxs"],
             ["xxfxs", "xxgxs", "xxhxs", "xxhxs", "xxixx", "xxjxs", "xxhxs", "xxfxb", "xxexb", "xxdxb", "xxcxs", "xxbxs", "xxaxs", "xxAxs", "xxCxs", "xxDxs", "xxFxb", "xxExw", "xxExw", "cxCxw", "cx0xw", "cxbxw", "xxcxb", "xxcxb"],
             ["xxdxb", "xxdxs", "xxexs", "xxfxb", "xxfxs", "xxexs", "xxdxs", "xx0xb", "xxAxw", "xxBxb", "xxCxw", "xxDxs", "xxExb", "xxFxb", "xxFxs", "xxFxb", "xxFxb", "xxFxw", "xxCxw", "cx0xw", "cxbxb", "cxcxb", "cxcxb", "cxdxb"],
             ["cxdxs", "xxdxb", "xxexb", "xxfxs", "xxgxb", "xxixs", "xxhxs", "cxgxw", "cxexw", "cxdxg", "cxcxg", "cxbxw", "cxaxw", "cx0xw", "cxaxw", "cxaxw", "cxaxw", "cxaxw", "cxaxw", "cxbxb", "cxcxs", "cxdxs", "cxdxs", "cxcxs"],
             ["cxcxw", "cxcxb", "cxcxw", "cxcxw", "cxcxb", "wxexb", "wxfxb", "wxfxs", "wxexw", "wffxw", "wffxb", "fxfxs", "fxfxs", "wffxs", "wffxs", "fxexs", "cxcxs", "cxcxs", "cxcxs", "cxcxs", "cxcxs", "cxcxx", "cxcxx", "wxcxx"],
             ["wxcxs", "cxbxs", "cxaxs", "cxbxg", "cxdxb", "cxdxw", "cxdxs", "cxdxb", "cxcxs", "cxbxs", "cxbxb", "cxbxw", "cxaxb", "cx0xs", "cxAxs", "cxBxw", "xxBxw", "xxAxg", "xx0xw", "xxbxg", "xxdxb", "xxfxs", "xxfxs", "xxgxs"],
             ["xxhxs", "xxjxs", "xxkxs", "xxlxs", "xxjxx", "xxkxs", "xxkxs", "xxfxs", "xxcxs", "xxaxx", "cxBxx", "cxCxs", "cxDxs", "xxExb", "xxFxs", "xxExs", "cxDxs", "cxDxs", "cxCxs", "cxCxx", "cxCxx", "cxAxs", "cx0xs", "cxAxs"],
             ["cxAxs", "cxAxs", "cxaxs", "wxcxs", "wxdxs", "wxfxs", "wxfxs", "cxfxs", "wxexs", "wxcxs", "cxdxb", "fxdxs", "fxdxs", "cxdxs", "cxbxx", "cxaxs", "wxaxs", "wfbxs", "wfaxs", "cxaxs", "cxaxs", "cxbxs", "cxbxs", "cxcxs"],
             ["cxcxs", "cxdxg", "cxexs", "cxfxs", "xxfxx", "xxexx", "xxcxb", "xxaxs", "xxAxs", "xxBxw", "xxDxb", "xxExw", "xxFxw", "xxGxw", "xxGxg", "xxGxg", "cxGxs", "cxFxg", "cxFxw", "xxDxb", "xxBxs", "xx0xs", "xx0xs", "xxaxs"],
             ["xxaxx", "xxcxx", "xxdxx", "xxexx", "xxexx", "xxfxx", "xxdxx", "xx0xs", "xxBxx", "xxExs", "xxHxs", "xxIxs", "xxJ0s", "xxKxs", "xxJxb", "xxJxb", "xxK0b", "xxKxw", "xxJ0w", "cxI0s", "cxGxs", "cxFxs", "cxExs", "cxDxs"],
             ["cxCxs", "xxBxs", "xxAxs", "xxAxs", "cxAxs", "cxBxs", "cxBxs", "xxDxs", "xxFxs", "xxHxs", "xxJxs", "xxJxs", "xxKxb", "xxLxb", "xxMxb", "xxMxb", "xxNxb", "xxMxb", "xxMxb", "xxKxb", "xxJxw", "xxHxs", "xxGxs", "xxFxs"],
             ["xxFxs", "xxExs", "xxBxs", "xxBxx", "cxAxx", "cxAxx", "cxBxx", "cxDxs", "cxExx", "cxGxx", "cxH0x", "cxI0x", "cxI0w", "cxJ0b", "cxK0b", "cxK0b", "cxJ0s", "wxCxw", "wxBxs", "cxCxs", "cxCxs", "cxBxx", "cxCxs", "cxAxs"],
             ["cx0xs", "xxaxs", "xxbxx", "xxaxs", "xxaxs", "xxaxx", "xx0xs", "fx0xs", "fxAxs", "fxCxs", "xxExs", "xxFxs", "xxH0s", "xxJ0b", "xxI0b", "xxK0s", "xxJ0b", "xxHxb", "xxFxb", "xxExb", "xxCxs", "xxBxs", "xxAxs", "xxAxs"],
             ["xx0xs", "fx0xs", "fxaxs", "fxbxs", "fxbxx", "fxbxs", "fxaxx", "xxCxs", "xxHxb", "xxI0b", "xxJ0g", "xxJ0w", "xxL0g", "xxL0b", "xxL0w", "xxM0b", "xxM0b", "xxL0w", "xxK0b", "cxJ0b", "cxH0s", "cxGxx", "xxGxx", "xxExs"],
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
             ["cxbxx", "cxbxx", "cxbxx", "fxbxx", "fxbxx", "wfbxx", "wfbxs", "wfbxs", "wfbxs", "wxbxs", "wxbxs", "wxbxs", "wxaxs", "wxaxx", "wxaxs", "wx0xs", "cxAxs", "cxBxs", "cxBxs", "cxBxb", "cx0xb", "cxbxb", "xxcxs", "xxdxs"],
             ["xxdxs", "xxexs", "xxexs", "xxexb", "xxfxw", "xxfxs", "xxexs", "xxdxb", "xxcxb", "xxaxb", "xx0xb", "xx0xs", "xxAxw", "xxBxb", "xxBxs", "xxCxs", "xxCxw", "xxDxs", "xxCxb", "xxCxs", "xxAxs", "xxbxs", "xxdxs", "xxexs"],
             ["xxfxs", "xxhxs", "xxgxs", "xxgxx", "xxixx", "xxixs", "xxgxx", "cxdxs", "cx0xs", "cxBxb", "cxBxb", "cxCxw", "cxCxb", "cxCxb", "cxCxb", "cxCxs", "cxDxb", "cxCxb", "cxBxb", "cxAxs", "cx0xs", "cx0xs", "cxaxs", "cxaxs"],
             ["cxaxs", "cxaxs", "cxaxs", "cxaxx", "wxaxx", "wfbxs", "wfcxs", "cxbxs", "wfaxs", "wxaxs", "wfaxb", "fxaxs", "fx0xs", "cx0xs", "cxAxs", "cxBxs", "cxBxb", "cxAxs", "cxAxs", "wx0xs", "wx0xs", "wx0xs", "cx0xs", "fx0xs"],
             ["fx0xx", "cx0xs", "fx0xs", "fx0xs", "fx0xx", "fx0xs", "fxAxx", "fxAxx", "fxBxb", "fxBxw", "cxBxb", "cxExw", "cxF0w", "xxH0w", "xxI0b", "xxJ0s", "xxJ0b", "xxK0s", "xxJ0b", "xxH0s", "xxF0s", "xxExs", "xxDxs", "xxCxs"],
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
             ["xxdxx", "wxbxs", "wxcxs", "wxcxs", "cxcxx", "fxcxs", "fxcxs", "xxbxs", "xxaxs", "xxAxb", "cxAxb", "cxAxb", "cxAxb", "cxC0b", "cxC0w", "cxBxb", "cxAxs", "cxB0b", "cxBxb", "cx0xb", "cxaxb", "cxaxs", "cxaxs", "cxaxs"],
             ["cxbxs", "cxbxs", "cxbxs", "cxbxs", "xxbxs", "xxbxs", "xxbxs", "cx0xs", "cxBxb", "cxBxb", "cxB0w", "cxD0w", "cxD0w", "cxD0w", "cxE0b", "cxF0w", "cxF0w", "cxE0b", "wxAxs", "txaxs", "wxaxx", "wx0xs", "cx0xs", "cxaxs"],
             ["cxaxs", "cxaxs", "cxaxx", "cxaxx", "cxaxs", "fxbxs", "fxbxb", "cxbxs", "cxaxs", "cxaxs", "cx0xs", "cx0xs", "cxBxs", "xxC0s", "xxD0b", "xxD0w", "xxD0w", "xxD0w", "xxC0b", "xxBxb", "xx0xb", "xxbxs", "xxcxs", "xxcxx"],
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
             ["xxbxx", "xxbxx", "xxcxx", "xxcxx", "fxdxx", "fxdxs", "fxcxx", "fxbxx", "fx0xs", "fxCxs", "xxE0s", "xxE0x", "xxF0x", "cxG0s", "cxF0s", "cxG0s", "xxH0s", "xxH0s", "xxG0s", "xxF0s", "xxC0x", "xxCxx", "xxAxx", "xx0xx"],
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
             ["wxbxs", "cxbxs", "cxbxs", "cxbxs", "xxbxs", "xxbxs", "fxbxs", "cxaxs", "cx0xs", "cxBxb", "cxBxs", "cxD0b", "cxD0s", "xxE0s", "xxF0b", "xxF0s", "xxF0s", "xxE0s", "xxE0s", "xxBxs", "xx0xs", "xxaxx", "xxaxx", "xxbxs"],
             ["xxbxx", "xxcxx", "xxcxx", "xxcxx", "cxcxx", "cxbxx", "cxcxx", "wxbxs", "wfbxs", "wxaxs", "cxBxs", "cxBxb", "cxBxs", "cxBxs", "cxBxs", "cxE0s", "cxD0s", "cxE0s", "cxE0s", "xxD0s", "xxD0s", "xxD0s", "cxD0s", "cxC0s"],
             ["cxCxs", "cxBxs", "cxBxs", "cxBxs", "cxBxs", "cxBxs", "cxBxs", "cxCxs", "cxD0b", "cxE0b", "cxE0b", "cxF0b", "cxF0b", "cxH0b", "cxH0b", "cxH0b", "cxG0b", "cxG0b", "cxG0s", "xxE0s", "xxE0s", "xxCxs", "xxCxx", "xxBxs"],
             ["xxBxs", "xxBxs", "xxCxs", "xxCxs", "cxAxs", "cx0xs", "cx0xs", "xxBxs", "xxC0w", "xxD0w", "cxE0b", "cxD0b", "cxD0s", "cxF0b", "cxE0s", "cxD0b", "xxE0b", "xxE0s", "xxBxg", "cx0xs", "cxaxs", "wxaxb", "cxcxs", "cxdxb"],
             ["cxexs", "xxexs", "xxexb", "xxfxs", "xxgxs", "xxgxs", "xxhxb", "xxgxb", "xxgxw", "wxgxb", "wxgxb", "wxexs", "wxexs", "cxdxs", "cxdxs", "cxdxs", "cxdxs", "cxdxs", "cxdxs", "cxexs", "cxdxx", "cxexx", "xxhxs", "xxixx"],
             ["xxixx", "xxhxs", "xxgxx", "xxgxs", "cxfxs", "cxfxs", "cxfxs", "cxfxs", "cxexs", "cxcxs", "cxbxs", "cxbxs", "cxaxs", "xxaxs", "xxAxs", "xx0xs", "xx0xs", "xxaxs", "xxaxs", "xxcxs", "xxdxs", "xxexs", "xxexx", "xxhxs"]
            ],
            ["R",
             ["xxcxx", "xxcxx", "xxdxx", "xxdxx", "cxdxx", "cxdxx", "fxdxx", "fxaxx", "fxAxs", "fxCxx", "cxExs", "cxG0s", "cxH0b", "cxI0b", "cxI0b", "cxJ0w", "cxI0s", "cxI0b", "cxFxs", "cxExs", "cxExs", "cxDxs", "xxDxx", "xxExs"],
             ["xxExs", "cxDxs", "cxDxs", "cxDxs", "cxDxs", "cxDxs", "cxDxs", "cxExs", "cxFxs", "cxH0s", "cxH0s", "cxJ0b", "cxI0b", "cxI0b", "cxJ0b", "cxJ0b", "cxI0s", "cxH0s", "cxI0s", "cxH0s", "cxG0s", "cxG0s", "xxG0s", "xxGxx"],
             ["xxFxs", "xxFxs", "xxExs", "xxDxs", "cxDxs", "cxExs", "cxExs", "cxFxs", "cxG0b", "cxI0s", "xxJ0b", "xxL0s", "xxL0b", "cxM0s", "cxM0b", "cxK0b", "cxK0b", "cxJ0b", "cxH0s", "cxGxs", "cxFxs", "cxExx", "xxCxs", "xxCxs"],
             ["xxCxx", "xxAxx", "xxAxs", "xxAxx", "xx0xx", "fx0xs", "fx0xx", "xxBxx", "xxDxx", "xxFxs", "cxGxs", "cxH0s", "cxH0s", "cxI0s", "cxJ0s", "cxJ0s", "xxK0b", "xxJ0b", "xxH0b", "xxFxs", "xxExs", "xxExs", "xxDxs", "xxDxx"],
             ["xxCxx", "xxCxx", "xxCxx", "xxBxx", "xxBxx", "xxAxx", "xxAxx", "xxDxx", "xxG0s", "xxJ0s", "xxL0s", "xxN0s", "xxN0w", "wxI0s", "wxM0s", "wxO0w", "xxN0w", "xxN0b", "xxM0b", "xxK0s", "xxK0w", "xxJ0s", "xxI0s", "wxG0w"],
             ["wxFxs", "wxExs", "wxCxs", "wxCxb", "cxCxw", "cxBxb", "cxBxb", "wxBxs", "wxCxb", "wxCxs", "cxDxb", "cxExb", "cxExs", "cxFxs", "cxFxs", "cxFxb", "cxFxb", "cxExb", "cxDxb", "cxBxs", "cx0xs", "cxaxs", "cxaxb", "cxbxs"],
             ["cxbxs", "xxcxs", "xxcxs", "xxdxs", "cxdxs", "cxcxs", "cxdxs", "cxbxs", "cx0xs", "cxBxs", "cxBxs", "cxDxs", "cxCxs", "cxExb", "cxExx", "cxExs", "cxCxb", "cxBxs", "cxBxs", "cxAxb", "cxaxs", "cxbxs", "cxbxs", "cxcxs"],
             ["cxbxs", "cxcxs", "cxcxb", "cxdxs", "cxexb", "cxfxs", "cxgxs", "cxgxs", "cxfxs", "cxexw", "cxdxs", "cxdxb", "cxcxs", "cxcxs", "cxbxs", "cxbxs", "cxbxb", "cxbxs", "cxcxs", "cxexs", "cxfxs", "cxgxs", "cxgxs", "cxgxs"],
             ["cxgxs", "xxhxs", "xxhxs", "xxixs", "cxixs", "cxixs", "cxixs", "cxhxb", "cxgxs", "cxfxb", "cxexb", "cxdxg", "cxcxw", "cxcxw", "cxcxg", "cxcxg", "cxdxw", "cxdxb", "cxexb", "cxexb", "cxfxb", "cxfxb", "cxfxs", "cxfxs"],
             ["cxexb", "cxexw", "cxexs", "wxexb", "wxexs", "wxdxb", "wxexw", "wxexg", "wfexw", "wfexg", "wfexg", "wffxg", "wfexg", "wfexw", "wfexw", "wfexg", "wfexw", "wfexw", "wfdxb", "wfdxb", "wfcxs", "wfcxs", "wfcxs", "wfbxs"],
             ["wfbxx", "wfbxx", "wfbxs", "wfcxs", "cxcxs", "cxcxs", "cxcxs", "cxcxb", "cxcxb", "cxcxb", "cxaxb", "cxaxs", "cx0xs", "cx0xs", "cx0xs", "cxAxs", "cxAxs", "cxAxs", "cx0xs", "xxbxs", "xxcxx", "xxdxx", "xxexx", "xxexx"],
             ["xxexx", "xxfxx", "xxgxx", "xxgxx", "xxgxs", "xxgxs", "xxgxx", "xxexx", "xxaxx", "xxAxs", "xxBxs", "xxDxs", "xxDxx", "cxExs", "cxExs", "cxExb", "xxExb", "xxDxb", "xxBxs", "xxAxs", "xx0xx", "xxaxx", "xxcxs", "xxcxs"],
             ["xxbxx", "fxaxs", "fxaxs", "fxcxs", "xxdxx", "xxcxs", "xxcxs", "xxbxs", "xxAxs", "xxCxb", "xxExb", "xxFxb", "xxFxb", "xxGxb", "xxGxb", "xxG0b", "xxGxb", "xxFxb", "xxExs", "xxDxs", "xxCxs", "xxBxs", "xxBxs", "xxAxs"],
             ["xxAxx", "xxaxs", "xxaxs", "xxaxx", "xxaxs", "xx0xx", "xx0xx", "cxAxs", "cxCxs", "cxExs", "xxH0s", "xxH0s", "xxI0s", "cxI0s", "cxK0s", "cxJ0s", "cxI0b", "cxH0w", "cxFxs", "xxExs", "xxDxs", "xxDxs", "xxBxs", "xxBxs"],
             ["xxBxx", "cxBxs", "cxAxs", "cxAxs", "cxBxx", "cxBxx", "cxAxx", "xxCxx", "xxExx", "xxGxx", "xxI0s", "xxJ0s", "xxI0s", "cxJ0x", "cxI0s", "cxJ0s", "xxJ0s", "xxI0s", "xxGxs", "xxFxs", "xxExx", "xxCxs", "xxDxx", "xxCxs"],
             ["xxCxs", "xxBxs", "xxCxx", "xxAxs", "xxBxx", "xxAxx", "xx0xs", "xxBxx", "xxExs", "xxGxx", "xxH0s", "xxJ0s", "xxK0s", "xxK0s", "xxK0s", "xxK0s", "xxK0s", "xxI0b", "xxGxs", "xxExs", "xxDxs", "xxDxs", "xxCxx", "xxAxx"],
             ["xxAxx", "xxAxx", "xx0xx", "xx0xx", "xxaxx", "fx0xx", "fx0xx", "fxAxx", "fxBxx", "fxCxx", "cxGxx", "cxH0x", "cxJ0s", "cxJ0s", "cxI0b", "cxH0b", "xxH0s", "xxH0b", "xxFxs", "xxExs", "xxDxs", "xxCxx", "xxCxs", "xxCxx"],
             ["xxBxx", "xx0xx", "xx0xx", "xxAxx", "xxBxx", "xxBxx", "xxAxx", "xxBxs", "xxCxb", "xxCxs", "cxExs", "cxFxw", "cxGxb", "xxG0b", "xxH0b", "xxG0s", "xxFxw", "xxCxw", "xxAxb", "xxaxb", "xxcxw", "xxcxs", "xxcxs", "xxcxs"],
             ["xxcxb", "cxcxs", "cxcxb", "cxcxb", "xxdxs", "xxexs", "xxexs", "xxdxs", "xxdxs", "xxbxs", "xxbxs", "xxaxx", "xxAxx", "xxBxs", "xxBxs", "xxCxb", "xxBxs", "xxBxs", "xx0xs", "cxbxs", "cxbxx", "cxdxx", "xxdxx", "xxexs"],
             ["xxdxs", "xxdxs", "xxexs", "xxexx", "xxexs", "xxexx", "xxfxx", "cxexs", "cxcxs", "cxbxb", "cxaxb", "cx0xb", "cx0xb", "cx0xw", "wx0xb", "wxaxs", "cxaxb", "cxaxb", "cxaxs", "cxaxb", "cxbxs", "cxbxb", "cxbxs", "cx0xs"],
             ["cx0xw", "cx0xb", "cx0xb", "cx0xs", "cx0xx", "cxAxs", "cxAxs", "xxBxs", "xxFxs", "xxI0b", "xxK0w", "xxM0b", "xxM0h", "xxM0g", "xxM0g", "xxL0h", "txK0g", "txFxw", "txFxg", "xxExg", "xxBxg", "xxAxw", "xxaxw", "xxcxw"],
             ["xxexg", "xxexw", "xxfxw", "xxgxw", "xxhxs", "xxhxb", "xxixs", "cxixs", "cxhxw", "cxgxb", "cxfxw", "cxexb", "cxexb", "cxcxx", "cxbxx", "cxaxs", "cxaxs", "cxcxb", "cxexb", "xxgxs", "xxfxx", "xxhxx", "xxixs", "xxixx"],
             ["xxjxx", "xxjxx", "xxkxs", "xxkxx", "xxlxs", "xxkxx", "xxlxs", "xxjxx", "xxgxx", "xxdxx", "xxbxx", "xxaxx", "xx0xx", "xxAxs", "xxBxs", "xxAxb", "xx0xs", "xxaxs", "xxcxs", "xxdxs", "xxexs", "xxfxs", "xxgxs", "xxgxs"],
             ["xxgxs", "xxhxb", "xxixs", "xxixs", "cxixb", "cxixb", "cxixb", "cxixb", "cxixb", "cxhxb", "cxfxb", "cxdxw", "cxbxw", "cxaxg", "cx0xw", "cxaxb", "cx0xw", "cxaxw", "cxaxw", "cxaxb", "cx0xb", "cx0xb", "cx0xw", "wxaxb"],
             ["wxcxs", "wxcxb", "wfcxw", "wfbxb", "wfcxb", "wxcxb", "wfcxs", "wxbxb", "wfbxs", "wfbxs", "wfaxb", "wf0xs", "fx0xs", "cxAxb", "cxBxb", "wxBxs", "wfBxb", "wfBxb", "wfBxb", "cxBxb", "cxCxb", "cxCxs", "wxCxw", "wxBxb"],
             ["wxCxw", "cxBxw", "cxCxb", "cxCxs", "wxCxs", "wxCxs", "wxCxs", "cxCxs", "cxCxs", "cxCxb", "cxAxg", "cxAxb", "cx0xw", "cxBxw", "cx0xw", "cx0xg", "cxaxb", "cx0xs", "cxbxb", "xxdxb", "xxexb", "xxfxs", "xxgxx", "xxgxx"],
             ["xxgxx", "cxgxx", "cxgxx", "cxgxx", "xxhxs", "xxhxs", "xxjxx", "cxjxx", "cxgxx", "cxdxs", "cxcxx", "cxbxs", "cxaxs", "cxaxs", "cxaxb", "cxbxb", "cxbxs", "cxcxs", "cxdxb", "cxdxs", "cxexs", "cxexs", "cxexs", "cxfxx"],
             ["cxfxx", "cxgxx", "cxgxx", "cxhxx", "cxhxs", "cxhxx", "cxhxx", "cxixx", "cxdxs", "cxaxs", "xx0xs", "xxBxw", "xxCxb", "xxDxw", "xxDxb", "xxCxw", "cx0xs", "cxcxb", "wxdxw", "cxexs", "wxfxs", "wxgxs", "wxgxs", "wxgxs"],
             ["wxgxx", "wxhxs", "wxhxs", "wxhxs", "xxixs", "xxjxs", "xxjxs", "xxixs", "xxhxs", "xxfxs", "xxdxs", "xxdxb", "xxcxs", "cxcxs", "cxcxs", "cxbxb", "xxbxb", "xxdxb", "xxexs", "xxfxs", "xxgxs", "xxhxs", "xxixs", "xxixs"],
             ["xxjxs", "cxixx", "cxixs", "cxixs", "cxixx", "wxixx", "wxixx", "cxhxx", "cxhxx", "cxfxs", "cxfxs", "cxfxs", "cxfxs", "cxfxs", "cxfxs", "cxfxx", "cxfxs", "cxgxs", "cxgxs", "cxhxs", "cxhxs", "wxhxs", "wfixs", "wfixs"]
            ],
            ["H",
             ["wfAxs", "wfAxs", "wfAxs", "wx0xs", "wf0xs", "wf0xs", "wx0xs", "wx0xs", "wx0xs", "wx0xs", "cxAxb", "cxAxb", "cxAxb", "cxBxs", "wxAxs", "wxAxs", "cxBxs", "cxAxs", "cxAxs", "cxAxs", "wxAxs", "wxAxs", "cxAxs", "cxBxs"],
             ["cxBxs", "cxBxs", "cxAxb", "wxAxs", "wxAxs", "wfAxs", "wfAxs", "wfAxs", "wfAxs", "wxAxs", "cxBxs", "wfBxs", "wfCxs", "fxCxs", "fxDxs", "fxDxx", "wfDxs", "wfDxs", "wfCxs", "cxCxs", "cxCxs", "cxCxs", "cxCxs", "cxCxs"],
             ["cxCxs", "cxCxs", "cxCxs", "cxCxs", "cxCxs", "cxCxx", "cxCxs", "cxCxx", "cxCxx", "cxDxx", "cxExs", "cxExs", "cxFxs", "cxFxs", "cxGxs", "cxGxb", "cxGxb", "cxGxb", "cxGxs", "cxGxs", "cxGxs", "cxGxs", "cxGxs", "cxGxx"],
             ["cxGxs", "cxHxs", "cxJxs", "cxKxb", "cxMxs", "cxMxb", "cxMxs", "wxMxs", "wxJxg", "wxIxw", "xxJxg", "xxKxw", "xxIxh", "xxHxh", "xxGxg", "xxGxw", "xxFxg", "xxDxg", "xxCxb", "xxBxb", "xxAxb", "xx0xs", "xx0xb", "xxaxs"],
             ["xxbxs", "xxcxs", "xxdxs", "xxdxs", "xxdxs", "xxdxs", "xxexs", "cxdxs", "cxaxb", "cx0xw", "cxAxb", "cxAxw", "cxBxw", "cxCxb", "cxBxb", "cxBxb", "cxCxs", "cxBxs", "cxBxs", "cxAxs", "cxAxb", "cxAxs", "cxAxs", "cxAxs"],
             ["cxAxs", "cxAxs", "cxBxs", "cxAxs", "wxAxs", "wxAxs", "wxAxs", "wxAxs", "wxAxs", "wxBxx", "wxBxs", "fxCxs", "wfDxx", "wfExs", "wfFxs", "fxFxs", "fxFxx", "fxGxs", "fxFxx", "fxFxs", "fxGxs", "fxGxx", "fxHxs", "fxHxs"],
             ["fxGxs", "wxFxs", "wfExs", "wfExb", "cxExb", "cxExs", "cxExs", "cxExs", "cxExs", "cxFxs", "wfExs", "wfExs", "wfExs", "cxExs", "cxExs", "cxExs", "wfDxs", "wfDxs", "fxDxs", "cxDxs", "wxDxs", "wxDxs", "cxCxs", "cxCxs"],
             ["cxBxs", "cxBxs", "cxAxs", "cxAxs", "cxAxb", "cxAxs", "cxAxb", "cxAxs", "cxAxs", "cxAxs", "cxCxs", "txCxw", "fxDxw", "wfDxs", "fxDxs", "fxExs", "fxExs", "fxExs", "fxExs", "fxExs", "fxExs", "fxExs", "fxFxs", "fxFxx"],
             ["fxFxx", "fxFxx", "fxFxx", "fxExx", "fxExx", "fxExs", "fxExx", "fxFxx", "fxHxx", "fxKxs", "xxOxs", "xxQ0s", "xxS0s", "xxS0s", "xxT0b", "xxT0b", "xxS0s", "xxR0b", "xxPxs", "xxOxs", "xxNxs", "xxNxs", "xxMxx", "xxLxs"],
             ["xxJxx", "xxJxs", "xxJxs", "xxJxs", "xxJxs", "xxJxs", "xxJxs", "cxKxs", "cxMxs", "cxNxs", "xxPxb", "xxQ0b", "xxR0b", "cxR0w", "cxS0b", "cxS0w", "xxR0w", "xxQxs", "xxNxs", "cxLxs", "cxLxs", "cxLxs", "cxMxs", "wxMxb"],
             ["wxMxb", "cxMxs", "cxMxb", "cxMxs", "cxMxs", "cxMxs", "cxMxs", "cxMxs", "cxMxs", "cxMxw", "cxNxb", "cxLxw", "cxKxb", "cxIxw", "cxIxs", "cxGxb", "cxFxg", "cxExs", "cxExw", "cxDxb", "cxDxw", "cxCxb", "cxCxb", "cxBxw"],
             ["cx0xb", "xxaxb", "xxaxs", "xxbxs", "cxbxb", "cxbxb", "cxbxs", "xxbxb", "xxaxb", "xx0xw", "xxAxw", "xxBxw", "xxBxw", "cxBxb", "cxBxb", "cxBxb", "cxBxb", "cxAxb", "cx0xs", "cxaxs", "wxaxs", "wxbxs", "wxbxs", "wxbxs"],
             ["wxcxs", "wxcxs", "wxcxs", "wxcxs", "cxcxs", "cxcxs", "cxcxs", "cxcxs", "cxbxs", "cxaxs", "cx0xb", "cx0xb", "cx0xb", "cxAxw", "cxBxs", "cxAxb", "cxAxb", "cxAxs", "cx0xs", "cx0xs", "cxaxs", "cxcxs", "xxdxx", "xxdxs"],
             ["xxdxs", "xxgxx", "xxgxx", "xxgxx", "xxgxx", "xxgxx", "xxgxx", "cxgxx", "cxdxx", "cx0xx", "xxDxs", "xxExw", "xxFxb", "xxGxb", "xxFxb", "xxFxb", "xxFxb", "xxExs", "xxDxs", "xxBxs", "xxAxx", "xxaxx", "xxbxx", "xxcxx"],
             ["xxcxx", "cxcxs", "cxcxs", "cxbxx", "fxaxx", "wx0xx", "wxAxx", "wfAxs", "wfBxx", "wfCxs", "wfDxs", "wfDxs", "wfDxs", "cxExg", "cxDxw", "cxCxw", "cxBxg", "cxAxw", "wx0xg", "xxbxw", "xxcxb", "xxdxw", "xxdxs", "xxdxs"],
             ["xxdxb", "xxdxs", "xxexs", "xxdxb", "xxexs", "xxfxs", "xxfxs", "xxexs", "xxdxb", "xxcxs", "cxaxw", "cxaxw", "cx0xw", "cxBxw", "cxCxb", "cxCxw", "cxCxb", "cxCxs", "cxBxb", "cxAxs", "cxAxs", "cxAxb", "cxAxs", "cxAxs"],
             ["cxAxs", "xx0xs", "xxaxs", "xxaxs", "cxaxs", "cxaxs", "cxaxs", "cxaxs", "wxaxs", "wxbxw", "xxbxs", "xxaxb", "wxdxs", "wxcxg", "wxaxg", "wxbxg", "wxbxg", "wxcxw", "wxdxb", "xxexb", "xxexs", "xxfxb", "xxexw", "sxgxb"],
             ["sxgxb", "sxgxs", "sxgxs", "sxgxs", "xxhxs", "xxhxs", "xxhxs", "cxhxs", "cxgxx", "cxgxx", "cxexx", "cxdxs", "cxcxs", "xxcxs", "xxaxb", "xx0xb", "xx0xw", "xxaxs", "xxbxb", "xxcxs", "xxcxs", "xxcxb", "xxcxb", "xxdxs"],
             ["xxdxs", "xxcxs", "xxcxs", "xxbxs", "xxbxs", "xxbxs", "xxbxs", "cxbxb", "cxaxb", "cx0xw", "cxBxb", "cxCxb", "cxDxs", "cxGxb", "cxGxs", "cxGxs", "cxFxw", "cxExw", "cxDxs", "cxDxs", "cxDxb", "cxCxw", "wxCxg", "wxBxg"],
             ["wxBxw", "cxAxw", "cxBxb", "wxBxs", "xxAxw", "xx0xs", "xx0xs", "xx0xs", "xxAxs", "xxBxw", "cxCxb", "cxDxb", "cxCxb", "cxDxb", "cxCxw", "cxCxb", "cxCxb", "cxBxs", "cxaxb", "cxbxw", "cxbxb", "cxbxw", "cxdxw", "cxexb"],
             ["cxdxw", "cxexw", "cxgxg", "cxgxb", "cxhxw", "cxhxs", "cxixs", "cxhxs", "cxgxb", "cxfxs", "cxfxs", "cxexb", "cxexb", "cxdxw", "cxcxs", "cxcxb", "cxcxs", "cxdxs", "cxdxs", "cxexs", "cxdxs", "cxexs", "cxexs", "cxexs"],
             ["cxexs", "cxdxb", "cxdxb", "cxexs", "cxdxs", "cxdxs", "cxexs", "cxdxs", "cxcxs", "cxaxs", "cx0xs", "cxBxs", "cxCxs", "cxBxs", "cxBxs", "cxBxs", "cxBxs", "cxAxs", "cxaxs", "xxcxs", "xxcxs", "xxfxx", "xxfxx", "xxgxx"],
             ["xxgxx", "xxhxx", "xxhxx", "xxixx", "cxhxx", "wxfxs", "wfexs", "fxcxx", "fxcxx", "fxaxs", "cxaxs", "cxaxs", "cx0xb", "cxAxb", "wxAxs", "wxaxw", "cx0xg", "cxbxb", "wxcxw", "cxcxb", "cxcxs", "cxdxb", "wxexb", "wxexb"],
             ["wxexs", "cxexs", "cxexb", "cxexb", "cxexb", "cxfxb", "cxfxb", "cxexb", "cxexb", "cxdxw", "cxdxw", "cxdxw", "cxcxw", "cxcxw", "cxdxw", "cxdxw", "cxdxw", "cxexs", "cxexb", "cxfxs", "cxfxs", "cxfxs", "cxfxs", "cxfxs"],
             ["cxfxs", "cxfxs", "cxgxs", "cxgxs", "cxgxs", "cxgxs", "cxfxs", "cxfxs", "cxfxs", "cxexs", "xxcxs", "xxbxs", "xxaxs", "cxaxx", "cxaxs", "cx0xx", "cxaxs", "cxaxx", "cxcxs", "cxdxx", "cxdxx", "cxexs", "cxdxx", "cxdxx"],
             ["cxdxs", "cxdxx", "cxdxx", "cxdxs", "cxdxs", "cxdxs", "cxdxs", "cxdxs", "cxdxs", "cxcxs", "cxcxs", "wxbxw", "wxbxb", "cxaxw", "cxaxw", "cxbxw", "cxbxw", "cxcxw", "cxcxw", "cxcxb", "cxdxw", "cxdxs", "cxdxb", "cxdxw"],
             ["cxdxb", "cxdxw", "wxdxb", "wxdxb", "cxdxw", "sxexb", "sxfxb", "sxgxb", "sxgxb", "sxexb", "cxdxw", "cxbxw", "cxaxw", "cxbxg", "cxbxw", "wxcxb", "wxexb", "wxfxb", "sxfxb", "sfgxs", "sfgxb", "sfgxs", "sfgxs", "sxgxs"],
             ["sxhxx", "sfhxs", "sxgxs", "sxgxs", "sfhxs", "sfgxx", "sfgxx", "cxgxx", "cxgxx", "cxfxs", "cxfxs", "cxexs", "cxexs", "cxdxs", "cxcxs", "cxbxs", "cxcxs", "cxcxs", "cxcxx", "cxcxs", "cxcxs", "wxcxx", "wxcxx", "wfcxs"],
             ["wfdxs", "cxdxs", "cxdxs", "cxdxs", "cxdxs", "cxdxs", "wxcxs", "wxcxs", "wxcxs", "wxdxs", "cxcxs", "wxbxb", "wxcxw", "cxbxs", "cx0xw", "cx0xw", "cx0xw", "cxaxw", "cxbxw", "cxbxs", "cxbxs", "cxexs", "xxfxx", "xxfxx"],
             ["xxgxx", "xxhxx", "xxhxx", "xxhxx", "xxhxs", "xxgxs", "xxgxs", "xxixx", "xxfxx", "xxcxs", "xxaxs", "xx0xs", "xxBxs", "xxCxs", "xxDxs", "xxDxs", "xxBxs", "xxAxs", "xx0xs", "xxaxs", "xxaxs", "xxaxs", "cx0xs", "wxaxx"],
             ["wxaxs", "cxaxs", "cxaxb", "wxaxs", "wxaxs", "wx0xs", "wx0xs", "wf0xs", "pf0xs", "wfAxs", "wfBxs", "wfBxs", "wfCxs", "fxDxs", "wfDxs", "wxDxb", "cxDxs", "cxCxs", "cxAxs", "xx0xs", "xxaxs", "xxbxs", "xxcxs", "xxcxx"]
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
             ["sxaxs", "sxaxs", "sxaxs", "sxaxs", "sxaxs", "sxaxs", "sxaxs", "sfaxs", "sxaxs", "sxaxs", "sxaxs", "sx0xb", "sx0xb", "sx0xs", "sxAxb", "bxAxw", "bx0xw", "bx0xw", "sx0xs", "sx0xs", "wf0xs", "wf0xs", "wf0xb", "fxAxs"],
             ["fxAxs", "cxAxs", "cxAxs", "cxAxs", "cxAxs", "sf0xs", "wx0xs", "cx0xb", "cx0xb", "cx0xs", "cx0xs", "cxAxb", "cxAxb", "cx0xw", "cx0xs", "cx0xw", "cxaxs", "cxbxs", "cxbxx", "xxcxs", "xxcxs", "xxcxs", "xxcxs", "xxdxs"],
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
             ["cxBxx", "cxBxs", "cxBxs", "cxBxx", "cxAxx", "cxAxx", "fxAxs", "fxAxx", "fxAxs", "fxBxs", "cxCxs", "cxCxs", "cxCxb", "cxDxw", "cxDxw", "cxDxw", "cxDxg", "cxDxw", "cxDxg", "wxCxg", "wxCxg", "wxCxw", "wxCxh", "wxDxg"],
             ["wfDxw", "wfDxw", "wfDxw", "wfDxg", "wfExw", "wfExw", "wxExw", "wfExw", "wfFxb", "fxFxw", "fxFxs", "fxGxs", "fxGxs", "cxHxs", "cxIxs", "cxJxs", "xxKxs", "xxHxx", "xxGxx", "wfFxx", "txHxs", "wxIxs", "cxGxs", "cxGxx"],
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
             ["cxbxw", "sxbxs", "sxaxb", "sxaxs", "sxaxs", "sxbxb", "sxaxs", "fxaxs", "fxaxs", "fxaxs", "fx0xs", "fx0xs", "fx0xs", "fxBxs", "fxBxs", "fxCxs", "cxBxs", "cxBxs", "cxBxs", "cxBxs", "cxBxs", "cxAxs", "cxAxs", "cxAxs"],
             ["cx0xx", "xxaxx", "xxaxx", "xxaxx", "fxaxs", "fx0xx", "fx0xx", "wxAxs", "wfBxx", "wfBxx", "wfCxx", "wfCxx", "wfDxs", "fxExs", "fxExs", "fxExs", "fxExs", "fxExs", "fxExx", "fxFxs", "fxExs", "fxDxs", "cxDxx", "fxDxs"],
             ["fxCxs", "fxBxx", "fxAxs", "fxAxs", "fxAxs", "fxAxx", "fx0xx", "fxAxx", "fxAxx", "fxBxx", "cxBxx", "cxCxs", "cxDxs", "cxDxs", "cxDxs", "cxDxs", "cxDxs", "cxBxs", "cxBxs", "cxBxs", "cxAxx", "cxAxs", "cxAxs", "cxAxs"],
             ["cx0xs", "cx0xs", "cx0xs", "cxaxs", "cxaxs", "cx0xs", "cx0xs", "cxaxs", "cx0xs", "cx0xs", "cxBxs", "cxBxs", "cxCxs", "cxDxs", "cxFxs", "cxExs", "cxDxb", "cxCxs", "cxBxs", "cxBxs", "cxBxs", "cxBxs", "cxBxs", "cxCxs"],
             ["cxCxs", "cxBxs", "cxAxs", "cxBxs", "cxBxs", "cxAxs", "cxAxs", "cxBxs", "cxBxs", "cxCxs", "cxCxb", "cxCxs", "cxCxs", "cxCxb", "cxCxs", "cxCxw", "cxCxb", "cxBxg", "cxAxg", "cx0xw", "cxaxs", "cx0xs", "cxaxs", "cxaxs"],
             ["cxaxb", "cxbxb", "cxcxb", "cxcxb", "cxdxw", "cxfxs", "sxfxs", "cxexs", "sxexs", "sxexs", "sxexb", "sxdxs", "sxcxs", "xxbxs", "xxbxs", "xxaxs", "xxaxx", "xxcxs", "xxcxx", "xxdxs", "xxdxx", "xxexs", "xxexx", "xxfxx"],
             ["xxexx", "cxexx", "cxaxs", "cxaxs", "xxaxb", "xxaxb", "xxaxs", "xxaxs", "xxbxs", "xxbxs", "cxCxs", "cxDxs", "cxExs", "cxFxs", "cxFxb", "cxFxs", "cxExs", "cxExs", "cxDxs", "xxCxs", "xxBxs", "xxBxs", "xxCxs", "xxBxs"],
             ["xxBxx", "xxaxx", "xxaxx", "xxbxx", "xxbxx", "xxaxx", "xxbxx", "cx0xx", "cx0xx", "cxBxs", "cxCxs", "cxDxs", "cxExs", "cxDxs", "cxExx", "cxFxs", "cxExs", "cxExx", "cxDxx", "cxDxs", "cxCxx", "wxCxx", "wxCxs", "wxDxs"],
             ["wxCxs", "wxDxb", "wxDxw", "wfDxs", "wfDxs", "wfExs", "wfExx", "wfDxs", "wfDxs", "wfDxs", "wfDxs", "wfDxs", "wfExs", "fxExs", "fxExs", "fxDxw", "cxDxg", "cxCxw", "cxCxb", "cxCxw", "cxBxg", "cxAxw", "cxAxw", "cx0xg"],
             ["cx0xw", "cxaxg", "cxaxh", "cxaxg", "cxbxg", "cxbxv", "cxbxg", "bxbxg", "bxbxg", "bxbxg", "cxaxw", "cxaxs", "cxaxb", "cx0xb", "cxaxb", "cxaxw", "cxaxw", "cxaxb", "cxbxw", "cxbxs", "cxbxs", "cxbxs", "cxbxs", "cxbxs"],
             ["cxaxs", "cxaxs", "cxaxs", "cxaxs", "cxaxs", "cxaxs", "cxaxx", "cxaxx", "cxaxx", "cxaxs", "cx0xs", "cx0xs", "sx0xs", "sxAxs", "sx0xb", "sx0xs", "sxaxb", "sxaxs", "sxaxs", "sxaxs", "wxaxs", "sxaxs", "sxaxx", "wfaxx"],
             ["sfaxx", "sfaxx", "fxaxx", "fxaxx", "cx0xx", "sx0xs", "sxAxs", "sxAxs", "sxAxs", "sxAxs", "sxAxs", "sxAxs", "sxBxs", "sxBxs", "sxBxb", "sxBxs", "cxBxs", "cxBxb", "cx0xb", "xx0xb", "xx0xb", "xx0xb", "cx0xs", "cx0xs"],
             ["cxaxx", "cxaxs", "cxaxs", "sxaxs", "cxbxs", "cxbxs", "cxbxs", "cxbxs", "cxcxs", "cxcxx", "xxbxs", "xxaxs", "xxAxs", "cxAxs", "cxAxx", "sxAxx", "cx0xx", "cx0xs", "sx0xs", "cx0xs", "cx0xs", "cx0xs", "cx0xs", "cx0xs"],
             ["cx0xs", "cxaxs", "cxbxs", "cxbxx", "xxbxs", "xxbxs", "xxaxs", "cxaxs", "cx0xs", "cx0xs", "cxAxs", "sxAxs", "sxAxb", "cxBxs", "cxBxs", "cxCxs", "cxAxw", "cx0xb", "cx0xb", "cxaxs", "cxaxb", "cxbxb", "cxcxs", "cxdxb"],
             ["cxfxs", "xxgxs", "xxgxs", "xxhxs", "xxhxs", "xxhxs", "xxhxs", "cxhxb", "cxgxs", "cxfxb", "cxexb", "cxdxb", "cxdxw", "cxcxb", "cxcxw", "cxbxw", "cxbxw", "cxbxw", "cxaxg", "cxaxg", "cxaxw", "px0xw", "cxAxb", "wxBxw"],
             ["wfCxs", "wfCxs", "wfDxs", "wfDxs", "fxDxs", "fxExs", "wfExs", "wfFxx", "wfIxb", "wfIxb", "wfIxb", "wfJxb", "wfKxs", "cxKxs", "cxLxs", "cxLxs", "cxLxs", "cxLxs", "cxLxb", "xxKxb", "xxJxs", "xxJxs", "cxHxw", "cxFxs"],
             ["cxExw", "cxDxg", "cxCxb", "cxBxb", "cxAxg", "cxaxw", "cxbxw", "cxbxg", "bxcxg", "bxcxw", "cxdxg", "cxdxw", "cxcxw", "cxdxw", "cxdxw", "cxcxs", "xxdxs", "xxexs", "xxfxs", "xxgxs", "xxgxs", "xxgxx", "cxgxs", "cxfxx"],
             ["cxfxs", "cxexs", "sxfxs", "sxfxx", "sxexx", "sxfxs", "sxexs", "cxexs", "sxexs", "sxdxx", "sxcxx", "sxaxs", "sx0xs", "cx0xs", "cx0xs", "cxBxs", "cxAxs", "cxAxs", "cx0xs", "cx0xs", "cx0xs", "cx0xs", "cx0xs", "cx0xs"],
             ["cxbxs", "xxaxs", "xxcxx", "xxdxx", "xxexs", "xxexs", "xxexx", "cxdxx", "cxcxx", "cxbxx", "cx0xx", "cxBxs", "cxCxs", "cxCxs", "cxCxs", "wxCxs", "wxCxs", "wfCxs", "wfCxb", "wfCxb", "wfCxb", "wfDxb", "wfDxw", "wfExw"]
            ]
        ],
        WEATHERTEMP = ["z", "y", "x", "w", "v", "u", "t", "s", "r", "q", "p", "o", "n", "m", "l", "k", "j", "i", "h", "g", "f", "e", "d", "c", "b", "a", "0", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
        MONTHTEMP = ["f", "b", "a", "C", "Q", "S", "W", "V", "R", "H", "A", "a"]
    // #endregion

    // #region Derivative Stats
    const TWILIGHTMINS = _.map(TWILIGHT, v => _.map(v, v2 => 60 * parseInt(v2.split(":")[0]) + parseInt(v2.split(":")[1])))
    // #endregion

    // #region Date Functions
    const getDate = dateRef => {
            if (_.isDate(dateRef))
                return new Date(dateRef)
            if (parseInt(dateRef))
                return new Date(parseInt(dateRef))
            if (_.isString(dateRef) && dateRef !== "") {
                const strArray = _.compact(dateRef.split(/[\s,]+?/gu))
                return new Date(`${strArray[2]}-${["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].indexOf(strArray[0].slice(0, 3).toLowerCase()) + 1}-${strArray[1]}`)
            }
            return dateRef
        },
        getTime = (timeRef, deltaMins, isParsingString = false) => {
            const timeVals = [],
                timeNums = VAL({string: timeRef}) ? _.map(timeRef.split(":"), v => parseInt(v) || 0) : timeRef
            let totMins = timeNums[0] * 60 + timeNums[1] + deltaMins
            if (totMins < 0)
                totMins += 24 * 60 * Math.ceil(Math.abs(totMins) / (24 * 60))
            const totHours = Math.floor(totMins / 60)
            if (isParsingString)
                return `${totHours % 12 || 12}:${totMins - 60 * totHours < 10 ? "0" : ""}${totMins - 60 * totHours} ${totHours % 24 >= 12 ? "P.M." : "A.M."}`
            return [totHours % 24, totMins - 60 * totHours]
        },
        formatTimeString = date => {
            if (date.getUTCHours() === 0 || date.getUTCHours() === 12)
                return `12:${date.getUTCMinutes()} ${date.getUTCHours() === 0 ? "A.M." : "P.M."}`
            else if (date.getUTCHours() > 12)
                return `${date.getUTCHours() - 12}:${date.getUTCMinutes()} P.M.`
            else
                return `${date.getUTCHours()}:${date.getUTCMinutes()} A.M.`
        },
        formatDString = (date, isIncludingTime = false) => `${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][date.getMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}${isIncludingTime ? `, ${formatTimeString(date)}` : ""}`,
        isValidDString = str => _.isString(str) && Boolean(str.match(/\w\w\w\s\d\d?,\s\d\d\d\d/gu)),
        fixDate = () => {
            setHorizon(true)
            setWeather()
            const groundCover = getGroundCover()
            //D.Alert(`Setting Ground Cover: ${groundCover}`)
            Media.Set("WeatherGround", groundCover)
            //Media.OrderImages("map", true)
        },
        addTime = (dateRef, delta, unit) => {
            if (VAL({date: dateRef}, "addTime")) {
                const newDate = new Date(getDate(dateRef))
                if (unit.toLowerCase().slice(0, 1) === "y")
                    newDate.setUTCFullYear(newDate.getUTCFullYear() + delta)
                else if (unit.toLowerCase().includes("mo"))
                    newDate.setUTCMonth(newDate.getUTCMonth() + delta)
                else if (unit.toLowerCase().slice(0, 1) === "w")
                    newDate.setUTCDate(newDate.getUTCDate() + 7 * delta)
                else if (unit.toLowerCase().slice(0, 1) === "d")
                    newDate.setUTCDate(newDate.getUTCDate() + delta)
                else if (unit.toLowerCase().slice(0, 1) === "h")
                    newDate.setUTCHours(newDate.getUTCHours() + delta)
                else if (unit.toLowerCase().includes("m"))
                    newDate.setUTCMinutes(newDate.getUTCMinutes() + delta)
                return newDate
            }
            return false            
        },
        getHorizon = () => {
            const [dawn, dusk] = TWILIGHTMINS[STATEREF.dateObj.getMonth()],
                imgTimes = _.object(_.map(_.keys(IMAGETIMES), k => {
                    if (k.includes(":"))
                        return 60 * parseInt(k.split(":")[0]) + parseInt(k.split(":")[1])
                    else if (k === "dawn")
                        return dawn
                    else if (k === "dusk")
                        return dusk

                    return dawn + parseInt(k)
                }), _.values(IMAGETIMES)),
                curTime = 60 * STATEREF.dateObj.getUTCHours() + STATEREF.dateObj.getUTCMinutes(),
                curHoriz = imgTimes[_.find(_.keys(imgTimes), v => curTime <= v)]
            //D.Alert(`Daylighter Check: ${C.ROOT.Chars.isDaylighterSession} vs. ${C.ROOT.Chars.isDaylighterSession}, imgSrc: ${curHoriz}`)
            if (Session.IsDaylighterSession && curHoriz === "day")
                return "daylighters"
            else
                return curHoriz
        },
        isDay = () => getHorizon().includes("day"),
        setHorizon = (isForced = false) => {
            let imgSrcName = getHorizon()
            if (isRunningFast) {
                if (imgSrcName.includes("night") && STATEREF.lastHorizon !== "night") 
                    //Media.OrderImages(["Horizon_1", "Horizon_2"], true)
                    STATEREF.lastHorizon = "night"
                else if (!imgSrcName.includes("night") && STATEREF.lastHorizon.includes("night")) 
                    //Media.OrderImages(["Horizon_2", "Horizon_1"], true)
                    STATEREF.lastHorizon = "day"
                
            } else if (isForced || imgSrcName !== STATEREF.lastHorizon) {
                STATEREF.lastHorizon = imgSrcName
                //Media.OrderImages("map", true)
                Media.Set("Horizon_1", imgSrcName)
            }
        },
        setCurrentDate = () => {
            // dateObj = dateObj || new Date(parseInt(STATEREF.currentDate))
            checkAlarm(STATEREF.lastDateStep, STATEREF.dateObj.getTime())
            Media.SetText("TimeTracker", `${
                DAYSOFWEEK[STATEREF.dateObj.getUTCDay()]}, ${
                MONTHS[STATEREF.dateObj.getUTCMonth()]} ${
                D.Ordinal(STATEREF.dateObj.getUTCDate())}, ${
                (STATEREF.dateObj.getUTCHours() % 12).toString().replace(/^0/gu, "12")}:${
                STATEREF.dateObj.getUTCMinutes() < 10 ? "0" : ""}${STATEREF.dateObj.getUTCMinutes().toString()} ${
                Math.floor(STATEREF.dateObj.getUTCHours() / 12) === 0 ? "AM" : "PM"}`)
            STATEREF.lastDateStep = STATEREF.dateObj.getTime()
            STATEREF.currentDate = STATEREF.dateObj.getTime()
        },
        setIsRunning = runStatus => {
            DB("*** CALLED ***", "setIsRunning")
            isRunning = runStatus
            //Media.OrderImages("map", true)
            if (isRunning) {
                //Media.LayerImages(_.reject(Media.IMAGELAYERS.map, v => v.includes("Horizon")), "objects")
            } else {
                //Media.LayerImages(_.reject(Media.IMAGELAYERS.map, v => v.includes("Horizon")), "map")
                const lastDate = new Date(parseInt(STATEREF.lastDate)),
                    groundCover = getGroundCover()
                STATEREF.currentDate = STATEREF.dateObj.getTime()
                DB(`Characters: ${D.JS(_.map(D.GetChars("registered")), v => v.get("name"))}`, "setIsRunning")
                DB(`DateObj.year = ${D.JS(STATEREF.dateObj.getUTCFullYear())} vs. lastDate.year = ${D.JS(lastDate.getUTCFullYear())
                }<br>DateObj.month = ${D.JS(STATEREF.dateObj.getMonth())} vs. lastDate.month = ${D.JS(lastDate.getMonth())
                }<br>DateObj.date = ${D.JS(STATEREF.dateObj.getUTCDate())} vs. lastDate.date = ${D.JS(lastDate.getUTCDate())}`, "setIsRunning")
                if (
                    STATEREF.dateObj.getUTCFullYear() !== lastDate.getUTCFullYear() ||
                    STATEREF.dateObj.getMonth() !== lastDate.getMonth() ||
                    STATEREF.dateObj.getUTCDate() !== lastDate.getUTCDate()
                ) {
                    DB(`Setting date_today Attributes on Registered Characters to ${D.JS(STATEREF.dateObj.getTime().toString())}`)
                    _.each(D.GetChars("registered"), char => setAttrs(char.id, {
                        date_today: STATEREF.currentDate.toString()
                    }))
                    Char.RefreshDisplays()
                }
                if (
                    STATEREF.dateObj.getUTCFullYear() !== lastDate.getUTCFullYear() ||
                    STATEREF.dateObj.getMonth() !== lastDate.getMonth() ||
                    STATEREF.dateObj.getUTCDate() !== lastDate.getUTCDate() ||
                    STATEREF.dateObj.getUTCHours() !== lastDate.getUTCHours()
                ) {
                    //D.Alert("Setting Weather")
                    setWeather()
                    //D.Alert(`Setting Ground Cover to ${groundCover}`)
                    Media.Set("WeatherGround", groundCover)
                }
                DB(`Setting lastDate (${D.JS(STATEREF.lastDate)}) to currentDate (${D.JS(STATEREF.currentDate)}).`, "setIsRunning")
                STATEREF.lastDate = STATEREF.dateObj.getTime()
                setHorizon()
            }
        },
        setIsRunningFast = runStatus => {
            if (runStatus && !isRunningFast) {
                isRunningFast = runStatus
                Media.Set("WeatherMain", "blank")
                Media.Set("WeatherClouds", "blank")
                Media.Set("WeatherFog", "blank")
                Media.Set("ComplicationMat", "blank")
                Media.Set("Horizon_1", "night3")
                //Media.OrderImages(["Horizon_2", "Horizon_1"], true)
                //STATEREF.lastHorizon = "day"
            } else if (!runStatus && isRunningFast) {
                isRunningFast = runStatus
            }
        },
        easeInOutSine = (curTime, startVal, deltaVal, duration) => -deltaVal / 2 * (Math.cos(Math.PI * curTime / duration) - 1) + startVal,
        tweenClock = finalDate => {
            let [curTime, lastTime] = [0, 0]
            const deltaTime = finalDate - STATEREF.dateObj,
                duration = (_.findIndex(TWEENDURS, v => deltaTime / 60000 <= v) + 1) * 1000,
                startTime = STATEREF.dateObj.getTime(),
                easeSet = () => {
                    if (Math.abs(curTime) >= Math.abs(duration)) {
                        clearInterval(timeTimer)
                        setIsRunning(false)
                        setIsRunningFast(false)
                        //D.Alert("Is Running: FALSE")
                        setTimeout(fixDate, 1000)
                    }
                    const newDelta = easeInOutSine(curTime, 0, deltaTime, duration)
                    setIsRunningFast(Math.abs(newDelta - lastTime) > RUNNINGFASTAT)
                    lastTime = newDelta
                    STATEREF.dateObj.setTime(startTime + newDelta)
                    setCurrentDate()
                    curTime += CLOCKSPEED
                }
            setIsRunning(true)
            timeTimer = setInterval(easeSet, CLOCKSPEED)
        },
        tickClock = () => {
            if (isTimeRunning) {
                const lastHour = STATEREF.dateObj.getUTCHours()
                STATEREF.dateObj.setUTCMinutes(STATEREF.dateObj.getUTCMinutes() + 1)
                if (STATEREF.dateObj.getUTCHours() !== lastHour)
                    setWeather()
                setCurrentDate()
                setHorizon()
            }
        },
        startClock = (secsPerMin = 60) => {
            clearInterval(timeTimer)
            isTimeRunning = true
            timeTimer = setInterval(tickClock, parseInt(secsPerMin) * 1000)
            //D.Alert(`Auto clock ticking ENABLED at:
			
			//!time set ${STATEREF.dateObj.getUTCFullYear()} ${STATEREF.dateObj.getUTCMonth() + 1} ${STATEREF.dateObj.getUTCDate()} ${STATEREF.dateObj.getUTCHours()}:${STATEREF.dateObj.getUTCMinutes()}`, "TIMETRACKER !TIME")
        },
        stopClock = () => {
            clearInterval(timeTimer)
            timeTimer = null
            isTimeRunning = false
            //D.Alert("Auto clock ticking DISABLED", "TIMETRACKER !TIME")
        }
    //#endregion

    // #region Weather Functions 
    const getTemp = code => WEATHERTEMP.indexOf(code) - 26,
        setManualWeather = (event, tempC, wind, humidity) => {
            const weatherData = {}
            if (tempC || tempC === 0)
                weatherData.tempC = tempC
            if (event) {
                weatherData.event = event
                if (weatherData.event.length === 1)
                    weatherData.event += "x"
            }
            if (wind)
                weatherData.wind = wind
            if (humidity)
                weatherData.humidity = humidity
            STATEREF.weatherOverride = weatherData
            setWeather()
        },
        setWeather = () => {
            const weatherCode = WEATHERDATA[STATEREF.dateObj.getUTCMonth()][STATEREF.dateObj.getUTCDate()][STATEREF.dateObj.getUTCHours()],
                weatherData = {},
                getCloudSrc = () => {
                    switch (getHorizon()) {
                        case "night1":
                            return "night1clouds"
                        case "daylighters":
                        case "day":
                            // return "dayclouds"
                            return "blank"
                        case "predawn5":
                        case "predawn4":
                        case "predawn3":
                        case "predawn2":
                        case "predawn1":
                        case "night5":
                            return "darkclouds"
                        default:
                            return `brightclouds${randomInteger(3)}`
                    }
                }
            let forecastLines = []
            //D.Alert(`Weather Code: ${D.JS(weatherCode)}<br>Month Temp: ${D.JS(getTemp(MONTHTEMP[dateObj.getUTCMonth()]))}<br><br>Delta Temp: ${D.JS(getTemp(weatherCode.charAt(2)))} (Code: ${weatherCode.charAt(2)})`)
            weatherData.tempC = STATEREF.weatherOverride.tempC || getTemp(MONTHTEMP[STATEREF.dateObj.getUTCMonth()]) + getTemp(weatherCode.charAt(2))
            Media.SetText("tempC", `${weatherData.tempC}°C`)
            Media.SetText("tempF", `(${Math.round(Math.round(9 / 5 * weatherData.tempC + 32))}°F)`)
            weatherData.event = STATEREF.weatherOverride.event || (getHorizon() === "day" || getHorizon() === "daylighters" ? "xx" : weatherCode.slice(0,2))
            weatherData.humidity = STATEREF.weatherOverride.humidity || weatherCode.charAt(3)
            weatherData.wind = STATEREF.weatherOverride.wind || weatherCode.charAt(4)
            switch (weatherData.event.charAt(0)) {
                // x: "Clear", b: "Blizzard", c: "Overcast", f: "Foggy", p: "Downpour", s: "Snowing", t: "Thunderstorm", w: "Drizzle"
                case "b":
                    Media.Set("WeatherMain", "heavysnow")
                    Media.Set("WeatherFog", "blank")
                    Media.Set("WeatherClouds", "stormy")
                    break
                case "c":
                    Media.Set("WeatherMain", "blank")
                    Media.Set("WeatherFog", "blank")
                    Media.Set("WeatherClouds", getCloudSrc())
                    break
                case "f":
                    Media.Set("WeatherMain", "blank")
                    Media.Set("WeatherFog", "fog")
                    Media.Set("WeatherClouds", getCloudSrc())
                    break
                case "p":
                    Media.Set("WeatherMain", "heavyrain")
                    Media.Set("WeatherFog", "blank")
                    Media.Set("WeatherClouds", getCloudSrc())
                    break
                case "s":
                    Media.Set("WeatherMain", "lightsnow")
                    Media.Set("WeatherFog", "blank")
                    Media.Set("WeatherClouds", getCloudSrc())
                    break
                case "t":
                    Media.Set("WeatherMain", "heavyrain")
                    Media.Set("WeatherFog", "blank")
                    Media.Set("WeatherClouds", "stormy")
                    // Lightning Animations
                    break
                case "w":
                    Media.Set("WeatherMain", "lightrain")
                    Media.Set("WeatherFog", "blank")
                    Media.Set("WeatherClouds", getCloudSrc())
                    break
                case "x":
                    Media.Set("WeatherMain", "blank")
                    Media.Set("WeatherClouds", "blank")
                    if (getHorizon() !== "day" && weatherData.event.charAt(1) === "f")
                        Media.Set("WeatherFog", "fog")
                    else
                        Media.Set("WeatherFog", "blank")
                    break
                //no default
            }
            forecastLines.push(weatherData.event === "xf" ? WEATHERCODES[0][weatherData.event.charAt(1)] : WEATHERCODES[0][weatherData.event.charAt(0)])
            if (weatherData.humidity !== "x")
                forecastLines.push(WEATHERCODES[1][weatherData.humidity])
            forecastLines.push(weatherData.tempC < WINTERTEMP ? WEATHERCODES[2][weatherData.wind][1] : WEATHERCODES[2][weatherData.wind][0])
            Media.SetText("weather", `${forecastLines.join(" ♦ ")}`)
            Media.Set("WeatherFrost", weatherData.tempC > 0 ? "blank" : weatherData.tempC > -6 ? "frost1" : weatherData.tempC > -12 ? "frost2" : "frost3")
        },
        getGroundCover = (isTesting = false, downVal = 0.3, upb = 1, ups = 0.5) => {
            //D.Alert(`IsTesting = ${D.JS(isTesting)}`)
            const weatherCode = WEATHERDATA[STATEREF.dateObj.getUTCMonth()][STATEREF.dateObj.getUTCDate()][STATEREF.dateObj.getUTCHours()]
            if (STATEREF.dateObj.getUTCMonth() >= 3 && STATEREF.dateObj.getUTCMonth() <= 9)
                return "blank"
            if (isDay() && Session.IsDaylighterSession)
                if (getTemp(MONTHTEMP[STATEREF.dateObj.getUTCMonth()]) + getTemp(WEATHERDATA[STATEREF.dateObj.getUTCMonth()][STATEREF.dateObj.getUTCDate()][STATEREF.dateObj.getUTCHours()].charAt(2)) < 1)
                    return "frost"
                else
                    return "blank"

            const checkDate = new Date(STATEREF.dateObj)
            let groundCover = 0,
                testString = ""
            checkDate.setUTCDate(checkDate.getUTCDate() - 60)

            // START DEBUG TESTING CODE
            for (let i = -60; i <= 0; i++) {
                checkDate.setUTCDate(checkDate.getUTCDate() + 1)
                const dayCodes = WEATHERDATA[checkDate.getUTCMonth()][checkDate.getUTCDate()]
                testString += `${MONTHS[checkDate.getUTCMonth()].slice(0, 3)} ${checkDate.getUTCDate()}: `
                for (let j = 0; j < (i === 0 ? checkDate.getUTCHours() : 24); j++) {
                    const [weatherCode, , tempCode] = dayCodes[j].split(""),
                        tempC = getTemp(tempCode)
                    if (weatherCode === "b")
                        groundCover += parseFloat(upb)
                    else if (weatherCode === "s")
                        groundCover += parseFloat(ups)
                    else if (tempC > -5)
                        groundCover -= Math.sqrt(Math.max(0, tempC * downVal))
                    groundCover = Math.round(Math.max(0, groundCover))
                    let testStyles = "box-sizing: border-box; display: inline-block; text-align: center; width: 30px;"
                    if (groundCover === 0)
                        testStyles += " color: #999999; font-weight: normal; font-style: italic;"
                    else if (groundCover > 50)
                        testStyles += " background-color: #F88;"
                    else if (groundCover > 40)
                        testStyles += " background-color: #FC8;"
                    else if (groundCover > 30)
                        testStyles += " background-color: #FF8;"
                    else if (groundCover > 20)
                        testStyles += " background-color: #AEF;"
                    else if (groundCover > 10)
                        testStyles += " background-color: #ACF;"
                    else
                        testStyles += " background-color: #AAF;"
                    testString += `<span style="${testStyles}">${D.JS(groundCover)}</span>`
                }
                testString += "<br>"
            }
            if (isTesting)
                D.Alert(`${testString}<br><br>!testground down10, down0, downneg5, upb, ups`, "GROUND COVER")
            // END DEBUG TESTING CODE

            if (groundCover > 50)
                return "snow5"
            else if (groundCover > 40)
                return "snow4"
            else if (groundCover > 30)
                return "snow3"
            else if (groundCover > 20)
                return "snow2"
            else if (groundCover > 10)
                return "snow1"
            else if ("wtp".includes(weatherCode.charAt(0)))
                return "wet"
            else if (getTemp(MONTHTEMP[STATEREF.dateObj.getUTCMonth()]) + getTemp(WEATHERDATA[STATEREF.dateObj.getUTCMonth()][STATEREF.dateObj.getUTCDate()][STATEREF.dateObj.getUTCHours()].charAt(2)) < 1)
                return "frost"
            else
                return "blank"
        },
        getWeatherReport = () => {
            // const weatherCode = WEATHERDATA[dateObj.getUTCMonth()][dateObj.getUTCDate()][dateObj.getUTCHours()],switch(weatherCode.charAt(0)) {
            // x: "Clear", b: "Blizzard", c: "Overcast", f: "Foggy", p: "Downpour", s: "Snowing", t: "Thunderstorm", w: "Drizzle"
            const weatherStrings = {}
            //let debugString = ""
            for (const code of ["x", "b", "c", "f", "p", "s", "t", "w"]) {
                let startYear = STATEREF.dateObj.getFullYear(),
                    startMonth = STATEREF.dateObj.getMonth(),
                    startDay = STATEREF.dateObj.getDate(),
                    startHour = STATEREF.dateObj.getHours()
                //debugString += dateObj + "<br>"
                //debugString += `<br><br>${code}: [${startYear}-${startMonth}-${startDay}-${startHour}]`
                while (_.isUndefined(weatherStrings[WEATHERCODES[0][code]])) {
                    //debugString += `<br><br>CYCLE START: [${startYear}-${startMonth}-${startDay}-${startHour}]`
                    for (let m = startMonth; m < 12; m++) {
                        //debugString += `<br>Month: ${m}, `
                        for (let d = startDay; d < WEATHERDATA[m].length; d++) {
                            //debugString += `${d} = [${D.JS(WEATHERDATA[m][d].join(", "))}]<br>... MATCH = ${_.findIndex(WEATHERDATA[m][d], (v, k) => { return v.charAt(0) === code && (k <= 5 || k >= 20) })}, StartHour = ${startHour}<br>`
                            let hourMatch = _.findIndex(WEATHERDATA[m][d], (v, k) => { return v.charAt(0) === code && (k <= 5 || k >= 20) })
                            if (hourMatch >= startHour) {
                                //debugString += "... MATCHED!<br>"
                                weatherStrings[WEATHERCODES[0][code]] = `${MONTHS[m].slice(0, 3)} ${d}, ${hourMatch > 12 ? `${hourMatch - 12} PM` : `${hourMatch} AM`}<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>!time set ${startYear} ${m} ${d} ${hourMatch}</b>`
                                break
                            }
                            startHour = 0
                        }
                        if (!_.isUndefined(weatherStrings[WEATHERCODES[0][code]]))
                            break
                        startDay = 1
                    }
                    startMonth = 0
                    startYear++
                }
            }
            return _.map(weatherStrings, (v, k) => `${k}: ${v}`)
        }
    //#endregion

    // #region Alarms
    const setAlarm = (dateString, name, message, actions = [], displayTo = [], revActions = []) => {
            const [curDate, curMins] = [STATEREF.dateObj, 60 * STATEREF.dateObj.getUTCHours() + STATEREF.dateObj.getUTCMinutes()]
            let [targetDate, targetMins] = [new Date(STATEREF.dateObj), curMins]
            displayTo.push("Storyteller")
            if (VAL({string: dateString})) {
                switch (dateString.toLowerCase()) {
                    case "dawn":
                        targetMins = TWILIGHTMINS[curDate.getUTCMonth()][0]             
                        break
                    case "nextfullnight":
                    case "dusk":
                        targetMins = TWILIGHTMINS[curDate.getUTCMonth()][1]   
                        break
                    case "noon":
                        targetMins = 12 * 60
                        break
                    /* no default */
                }
                targetDate.setUTCHours(0)
                if (curMins >= targetMins)
                    targetDate.setUTCDate(targetDate.getUTCDate() + 1)
                targetDate.setUTCMinutes(targetMins)
                if (dateString.toLowerCase() === "nextfullnight") {
                    targetDate.setUTCDate(targetDate.getUTCDate() + 1)
                    targetDate.setUTCHours(0)
                    targetDate.setUTCMinutes(TWILIGHTMINS[curDate.getUTCMonth()][0])
                }
            } else if (VAL({date: dateString}, "setAlarm")) {
                targetDate = getDate(dateString)
            } else {
                return false
            }
            STATEREF.Alarms.Ahead.push({
                time: targetDate.getTime(),
                name,
                message,
                actions,
                revActions,
                displayTo: _.uniq(displayTo)
            })
            STATEREF.Alarms.Ahead = _.sortBy(STATEREF.Alarms.Ahead, "time")
            D.Alert(`Sorted: ${D.JS(_.map(STATEREF.Alarms.Ahead, v => new Date(v.time).toDateString()))}`)
            return true
            //D.Alert(`curMins: ${curMins}, targetMins: ${targetMins}<br>Next ${dateString} is ${formatDString(targetDate, true)}`)            
        },
        checkAlarm = (lastDateStep, thisDateStep) => {
            if (lastDateStep < thisDateStep && STATEREF.Alarms.Ahead[0]) {
                if (STATEREF.Alarms.Ahead[0].time >= lastDateStep && STATEREF.Alarms.Ahead[0].time <= thisDateStep)
                    fireNextAlarm()
            } else if (lastDateStep > thisDateStep && STATEREF.Alarms.Behind[0]) {
                if (STATEREF.Alarms.Behind[0].time <= lastDateStep && STATEREF.Alarms.Behind[0].time >= thisDateStep)
                    unfireLastAlarm()
            }
        },
        getNextAlarms = () => D.Alert(`Next Alarms: ${D.JS(_.map(STATEREF.Alarms.Ahead, v => `${D.JS(v.name)}: ${formatDString(new Date(v.time), true)}<br>... ${D.JS(v.message)}<br>... to: ${D.JSL(v.displayTo)}`))}`, "Upcoming Alarms"),
        getPastAlarms = () => D.Alert(`Past Alarms: ${D.JS(_.map(STATEREF.Alarms.Behind, v => `${D.JS(v.name)}: ${formatDString(new Date(v.time), true)}<br>... ${D.JS(v.message)}<br>... to: ${D.JSL(v.displayTo)}`))}`, "Past Alarms"),
        fireNextAlarm = () => {
            const thisAlarm = STATEREF.Alarms.Ahead.shift()
            if (Session.IsTesting || Session.IsSessionActive) {
                for (const action of thisAlarm.actions)
                    if (VAL({function: action}))
                        action()
                    else if (VAL({string: action}))
                        sendChat("", action)
                if (thisAlarm.displayTo.includes("all")) {
                    sendChat("Alarm", thisAlarm.message)
                } else {
                    for (const player of thisAlarm.displayTo)
                        sendChat("Alarm", `/w ${D.GetName(player)} ${thisAlarm.message}`)
                    D.Alert(`${thisAlarm.message}<br><br>Sent To: ${D.JS(thisAlarm.displayTo)}`, "TimeTracker: ALARM")
                }
            }
            STATEREF.Alarms.Behind.unshift(thisAlarm)
        },
        unfireLastAlarm = () => {
            const thisAlarm = STATEREF.Alarms.Behind.shift()
            if (Session.IsTesting || Session.IsSessionActive) {
                D.Alert(`Unfiring Alarm: ${D.JS(thisAlarm)}`, "unfireLastAlarm")
                STATEREF.Alarms.Ahead.unshift(thisAlarm)
            }
        }
    // #endregion

    // #region Airplane Lights
    const tickAirLight = (alight, isStartup) => {
            if (!isAirlights || (getHorizon() === "day" || getHorizon() === "daylighters")) {
                for (const alight of _.keys(airLights)) {
                    clearTimeout(airLights[alight])
                    delete airLights[alight]
                }
                for (const alight of _.keys(AIRLIGHTS))
                    Media.Set(alight, "off")

            } else {
                const curTime = airTimes[alight].shift()
                const [curSrc, curDur] = _.map(curTime.split(":"), v => _.isNaN(parseInt(v)) ? v : parseInt(v))
                if (!isStartup)
                    airTimes[alight].push(curTime)
                if (curSrc !== Media.GetData(alight).curSrc)
                    Media.Set(alight, curSrc)
                airLights[alight] = setTimeout(() => { tickAirLight(alight) }, curDur)
            }
        },
        stopAirLights = () => {
            isAirlights = false
        },
        startAirLights = () => {
            stopAirLights()
            isAirlights = true
            for (const alight of _.keys(AIRLIGHTS)) {
                airTimes[alight] = [...AIRLIGHTS[alight]]
                tickAirLight(alight, true)
            }
        }
    // #endregion

    return {
        RegisterEventHandlers: regHandlers,
        CheckInstall: checkInstall,
        SoundReady: soundReady,

        StartClock: startClock,
        StopClock: stopClock,
        StartLights: startAirLights,
        StopLights: stopAirLights,
        get CurrentDate() { return new Date(STATEREF.dateObj) },
        GetDate: getDate,
        FormatDate: formatDString,
        Fix: fixDate,
        IsDay: isDay,
        IsValidDate: isValidDString
    }
})()
void MarkStop("TimeTracker")