void MarkStart("Tester")
const Tester = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Tester",

    // #region COMMON INITIALIZATION
        STATE = {get REF() { return C.RO.OT[SCRIPTNAME] }},	// eslint-disable-line no-unused-vars
        VAL = (varList, funcName, isArray = false) => D.Validate(varList, funcName, SCRIPTNAME, isArray), // eslint-disable-line no-unused-vars
        DB = (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        LOG = (msg, funcName) => D.Log(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        THROW = (msg, funcName, errObj) => D.ThrowError(msg, funcName, SCRIPTNAME, errObj), // eslint-disable-line no-unused-vars

        checkInstall = () => {
            C.RO.OT[SCRIPTNAME] = C.RO.OT[SCRIPTNAME] || {}
            initialize()
        },
    // #endregion

    // #region LOCAL INITIALIZATION
        initialize = () => { // eslint-disable-line no-empty-function
            const advNames = [
                "Haven (Harbord Appt.)",
                "Haven (Warding)",
                "Haven (Surgery)",
                "Domain (Portillion)",
                "Status (Anarchs)",
                "Mawla (Baroness)",
                "Mawla (Scientists)",
                "Dr. Netchurch",
                "Dr. Netchurch",
                "Dr Netchurch",
                "Herd (Mobile Clinic)",
                "Herd (Bookies)",
                "Allies (Bookies)",
                "Contacts (Ogden Stone)",
                "Contacts (The Aristocrat)",
                "Mask: John Pierce",
                "Enemy (Underwood)",
                "Addict (Painkillers)",
                "Known Corpse",
                "Adversary (Seneschal)"                
            ]
            for (const adv of advNames)
                fuz.add(adv)
        },
    
        fuz = Fuzzy.Fix(),
    // #endregion	

    // #region EVENT HANDLERS: (HANDLEINPUT)
        onChatCall = (call, args, objects, msg) => { 	// eslint-disable-line no-unused-vars
            let isKilling, isWriting
            switch (call) {
                case "boundnums": {
                    const REPLY = [],
                        boundNum = (num, minVal, maxVal) => Math.max(Math.min(num, maxVal), minVal),
                        modNum = (num, mod) => num % mod,
                        wrapNum = (num, leftVal, rightVal) => num - boundNum(num, leftVal, rightVal),
                        cycleNum = (num, minVal, maxVal) => {
                            while (num > maxVal)
                                num += maxVal - minVal
                            while (num < minVal)
                                num += maxVal - minVal
                            return num
                        }
                    for (const test of [-5, -2, 0, 2, 5, 8, 20, 200])
                        REPLY.push(`
                            bNum(${test}) = ${boundNum(test, 5, 15)}, ${cycleNum(test, 5, 15)}, ${wrapNum(test, 5, 15)};
                            numModBound: ${modNum(test, boundNum(test, 5, 15))} / ${modNum(boundNum(test, 5, 15), test)}
                            numModRange: ${modNum(test, 10)} / ${modNum(10, test)}
                            numModMin: ${modNum(test, 5)} / ${modNum(5, test)}
                            numModMin: ${modNum(test, 15)} / ${modNum(15, test)}
                            wrapNumModBound: ${modNum(wrapNum(test, 5, 15), boundNum(test, 5, 15))} / ${modNum(boundNum(test, 5, 15), wrapNum(test, 5, 15))}
                            wrapNumModRange: ${modNum(wrapNum(test, 5, 15), 10)} / ${modNum(10, wrapNum(test, 5, 15))}
                            wrapNumModMin: ${modNum(wrapNum(test, 5, 15), 5)} / ${modNum(5, wrapNum(test, 5, 15))}
                            wrapNumModMin: ${modNum(wrapNum(test, 5, 15), 15)} / ${modNum(15, wrapNum(test, 5, 15))}
                        `)
                    D.Alert(D.JS(REPLY))
                    break
                }
                case "handout": {       
                    Handouts.Make("Test Run", "Test", C.HANDOUTHTML.EyesOnlyDoc.Block(
                        C.HANDOUTHTML.EyesOnlyDoc.Line([
                            C.HANDOUTHTML.EyesOnlyDoc.LineHeader("B. Giovanni"),
                            C.HANDOUTHTML.EyesOnlyDoc.LineBody(`This is the goal of my project! This is the goal of my project! This is the goal of my project! This is the goal of my project! This is the goal of my project! ${C.HANDOUTHTML.EyesOnlyDoc.LineBodyRight("<b><u>COMPLETED ON</u>:</b> Dec. 27, 2020)")}`)
                        ].join(""), {bgColor: "rgba(0,0,0,0.1)"})
                    ))
                    
                    /*
                    `<div style="
                    display: block;
                    width: 540px;
                    height: 800px;
                    margin-left: -30px;
                    background: url('https://i.imgur.com/LsrLDoN.jpg') no-repeat top;
                    background-size: 100%;
                    ">
                        <div style="
                        display: inline-block;
                        height: 100%;
                        width: 449px;
                        margin-left: 63px;
                        margin-right: 30px;
                        margin-top: 185px;
                        ">
                            <div style="
                            display: inline-block;
                            height: auto;
                            width: 100%;
                            background-color: rgba(0,0,0,0.1);
                            padding-left: 6px;
                            margin-bottom: 5px;
                            ">
                                <div style="
                                display: inline-block;
                                width: 75px;
                                height: auto;
                                font-family: TypewriterScribbled;
                                font-size: 10px;
                                text-align: left;
                                vertical-align: top;
                                line-height: 11px;
                                text-align-last: left;
                                ">B. Giovanni</div>
                                <div style="
                                display: inline-block;
                                width: 370px;
                                height: auto;
                                font-family: TypewriterScribbled;
                                font-size: 10px;
                                line-height: 11px;
                                text-align: left;
                                text-align-last: left;
                                ">This is the goal of my project! This is the goal of my project! This is the goal of my project! This is the goal of my project! This is the goal of my project!
                                    <div style="
                                    display: inline-block;
                                    text-align: right;
                                    text-align-last: right;
                                    width: 100%;
                                    "><b><u>COMPLETED ON</u>:</b> Dec. 27, 2020</div>
                                </div>
                            </div>
                        </div>
                    </div>`
                    */
                    break
                }
                case "randtimeline": {
                    const [fullDuration, numTriggers, tickSpeed] = args,
                        timeLine = TimeTracker.GetRandomTimeline(D.Float(fullDuration), D.Int(numTriggers), D.Int(tickSpeed) || 100),
                        triggerCount = timeLine.length,
                        totalTime = timeLine.reduce((tot = 0, x) => tot + x)
                    D.Alert(D.JS({timeLine, triggerCount, totalTime}), "Random Timeline Test")
                    break
                }
                case "session": {
                    D.Alert(D.JS(Session[args.shift()]), "Session Test")
                    break
                }
                case "getchars": {
                    D.Alert(D.JS(D.GetChars(args.shift())), "D.GetChars Test")
                    break
                }
                case "page": {
                    D.Alert(D.GetPageID(args.join(" ")), `Page ID of '${args.join(" ")}'`)
                    break
                }
                case "sound": {
                    const soundObjs = _.uniq(findObjs({_type: "jukeboxtrack"})),
                        soundObjsData = _.sortBy(soundObjs.map(x => ({
                            title: x.get("title"),
                            id: x.id,
                            status: {isPlaying: x.get("playing"), isSStop: x.get("softstop"), isLoop: x.get("loop")}
                        })), "title"),
                        soundReport = soundObjsData.map(x => `<tr><td><b>${x.title}</b></td><td style="background-color: ${x.status.isPlaying ? "rgba(0, 255, 0, 0.5)" : "white"};">${x.status.isLoop ? "<b><u>LOOP</u></b>" : ""} ${x.status.isSStop ? "(S)" : ""}</td><td style="font-family: Voltaire; font-size: 12px;">${x.id}</td></tr>`),
                        playingSounds = soundReport.filter(x => x.includes("255, 0")),
                        reportLines = []
                    if (args.length) {
                        const soundName = (args[0] === "stop" ? args.slice(1) : args).join(" "),
                            soundObj = soundObjs.find(x => x.get("title") === soundName)
                        if (args[0] === "stop")
                            soundObj.set({playing:false,softstop:false})
                        reportLines.push(...[
                            `<h4>${soundName}</h4>`,
                            D.JS(soundObj, true)
                        ])
                    }
                    reportLines.push(...[
                        "<h4>Playing Sounds</h4>",
                        `<table><tr><th style="width: 100px;">Title</th><th style="width: 45px;">Status</th><th style="width: 140px;">ID</th></tr>${playingSounds.join("")}</table>`
                    ])
                    D.Alert(reportLines.join(""), "Sound Test")
                    break
                }
                case "days": {
                    const singleCell = () => {
                            const tempColor = [150 + randomInteger(100), 100, 100, 1],
                                tempColorString = `rgba(${tempColor.join(", ")})`,
                                eventSymbol = _.sample(["<span style=\"color: #999999;\"><i>c</i></span>", "o", "<i>d</i>", "p", "<b>T</b>", "ѕ", "<b>S</b>", "f"], 1).join(""),
                                pointValue = ((randVal = 25 - randomInteger(50)) => `${randVal < 0 ? "-" : "+"}${Math.abs(randVal)}`)(),
                                groundCoverAmount = randomInteger(5) * 10
                            return `<div style="
                                display: inline-block;
                                width: 20px;
                                height: 40px;
                                padding: 0px;
                                margin: 0px;
                                font-size: 0px;
                                border: none;
                                background-color: ${tempColorString};
                            ">
                            <div style="
                                display: inline-block;
                                width: 20px;
                                height: 20px;
                                padding: 0px;
                                margin: 0px;
                                font-family: 'Times New Roman';
                                font-size: 12px;
                                text-align: center;
                                line-height: 19px;
                                ">${eventSymbol}</div>
                            <div style="
                                display: inline-block;
                                width: 20px;
                                height: 20px;
                                padding: 0px;
                                margin: 0px;
                                font-family: Voltaire;
                                font-size: 12px;
                                text-align: center;
                                font-weight: bold;
                                line-height: 18px;
                                background-image: linear-gradient(${D.RGBtoHEX(tempColor)}, ${D.RGBtoHEX(tempColor)} ${100 - groundCoverAmount}%, #444444 ${groundCoverAmount}%);
                                ">${pointValue}</div>
                            </div>`
                        },
                        oneDay = []
                    for (let i = 0; i < 24; i++) 
                        oneDay.push(singleCell(i+1))	

                    D.Alert(oneDay.join(""))
                    break
                }
                case "allobjs": {
                    const allObjs = findObjs({
                        _type: args[0]
                    })
                    D.Alert(D.JS(allObjs.map(x => `<b>${x.get("name")}</b>: ${x.get("layer") || ""}`)), "All Objects")
                    break
                }
                case "buttons": {
                    /* MENU DATA:
                    {
                        title: <string>
                        rows: [
                            Each element represents a full-width horizontal <div> block, contained with "block".
                            Elements should be of the form:
                                {
                                    type: <string: "Title", "Header", "Body", "ButtonLine", "ButtonSubheader">
                                    contents: <
                                        for TITLE, HEADLINE, TEXT: <string>
                                        for BUTTONS: <array: each element represents a line of buttons, of form:
                                                        <list: {name, command, [styles]}>   >
                                    [buttonStyles]: <list of styles to apply to ALL of the buttons in a ButtonLine
                                    [styles]: <list of styles for the div, to override the defaults, where keys are style tags and values are the settings>
                                } 
                        ]
                        [blockStyles:] <override C.HTML.Block 'options' parameter.
                    }
                    */
                    
                    const frenzyCharObj = D.GetChar("L")
                    D.CommandMenu({
                        rows: [
                            {type: "Header", contents: `Set Frenzy Diff for ${D.JSL(D.GetName(frenzyCharObj, true))}`},
                            {type: "ButtonLine", contents: [
                                20,                                
                                {name: "1", command: "!roll dice frenzy 1"},
                                {name: "2", command: "!roll dice frenzy 2"},
                                {name: "3", command: "!roll dice frenzy 3"},
                                {name: "4", command: "!roll dice frenzy 4"},
                                {name: "5", command: "!roll dice frenzy 5"},
                                20
                            ], styles: {bgColor: C.COLORS.darkred}}
                        ]
                    })
                    break
                }
                case "gm": {
                    D.Alert(D.GMID())
                    break
                }
                case "pcs": {
                    D.Alert(D.JS(D.GetChars("registered").map(x => x.get("name"))))
                    break
                }
                case "spread": {
                    const leftRef = "spreadTest_Left_1",
                        endRef = "spreadTest_End_1",
                        midRefs = ["spreadTest_Mid_1", "spreadTest_Mid_2", "spreadTest_Mid_3", "spreadTest_Mid_4", "spreadTest_Mid_5", "spreadTest_Mid_6"]
                    Media.Spread(leftRef, endRef, midRefs, D.Int(args.shift()) || 800, D.Int(args.shift()) || 50, D.Int(args.shift()) || 150)
                    break
                }
                case "macro": {
                    const macroName = args.shift(),
                        macroObjs = findObjs({_type: "macro", _playerid: D.GMID()}),
                        [macroObj] = macroObjs.filter(x => x.get("name") === macroName) 
                    if (macroObj)
                        D.Alert(`${D.JS(macroObj.get("action"))}<br><br>Length: ${D.JS(macroObj.get("action").length)}`, `MACRO: ${D.JS(macroObj.get("name"))}`)
                    else
                        D.Alert(`Couldn't find macro '${D.JS(macroName)}'<br>Available macros:<br><br>${D.JS(macroObjs.map(x => x.get("name")).join(", "))}`)
                    break
                }
                case "tokenget": {
                    const returnStrings = []
                    for (const charObj of D.GetChars("all"))
                        charObj.get("_defaulttoken", defToken => {
                            const imgMatch = D.JS(defToken).match(/imgsrc:(.*?),/u)
                            if (imgMatch && imgMatch.length) {
                                returnStrings.push(`<b>${D.JS(D.GetName(charObj, true))}</b>: ${D.JS(imgMatch[1].replace(/med\.png/gu, "thumb.png"))}`)
                                D.Alert(`${returnStrings.length} Strings Found`)
                            }                      
                        })
                    setTimeout(() => D.Alert(returnStrings.join("<br>")), 2000)
                    break
                }
                case "home": {
                    Char.SendHome()
                    break
                }
                case "charlocs": {
                    const loc = args.shift() || undefined
                    D.Alert(`Chars In '${D.JS(loc)}':<br><br>${D.JS(Session.CharsIn(loc).map(x => x.get("name")))}`)
                    break
                }
                case "funcqueue": {
                    const funcs = [
                            (first, second) => {
                                D.Alert(`Function 1: ${first}, ${second}`)   
                            },
                            (third, fourth) => {
                                D.Alert(`Function 2: ${third}, ${fourth}`)
                            },
                            (fifth, sixth) => {
                                D.Alert(`Function 3: ${fifth}, ${sixth}`)
                            }
                        ],
                        params = [
                            ["one", "two"],
                            ["three", "four"],
                            ["five", "six"]
                        ]
                    D.Queue(funcs[0], params[2])
                    D.Queue(funcs[1], params[1])
                    D.Queue(funcs[2], params[0])
                    D.Run()
                    break
                }
                case "exist": {
                    if (args[1])
                        D.Alert(`${args[0].toUpperCase()} Object with ID ${args[1]}: ${Boolean(getObj(args[0], args[1])) && "Exists" || "Does NOT Exist"}`)
                    break
                }
                case "fuzzy": {
                    switch(D.LCase(call = args.shift())) {
                        case "stat": {
                            D.Alert(D.JS(D.IsIn(args.join(" "))))
                            break
                        }
                        case "char": {
                            D.Alert(D.JS(D.GetChars(args.join(" ")) && D.GetChars(args.join(" "))[0].get("name")))
                            break
                        }
                    // no default
                    }                
                    break
                }
                case "pos": {
                    const charDatas = D.GetChars("registered").map(x => D.GetCharData(x)),
                        tokenObjs = _.compact(_.values(charDatas).map(x => (findObjs({_pageid: D.MAINPAGEID, _type: "graphic", _subtype: "token", represents: x.id}) || [null])[0]))
                    D.Alert(D.JS(tokenObjs, true))
                    break
                }
                case "date": {
                    const dateStrings = [
                            "apply",
                            null,
                            21,
                            () => 30,
                            [1, 2, 3],
                            {is: "not", a: "date"},
                            "30-4-2000",
                            "06/22/1827",
                            "Jan. 07, 2087",
                            "Feb 23rd: 1919",
                            "March 1st, 2111",
                            "December 30th 100",
                            "December 30 10"
                        ],
                        tableFunc = arr => {
                            let tableRow = "<tr>"
                            for (let i = 0; i < arr.length; i++)
                                tableRow += `<td style="width:100px;">${_.isUndefined(arr[i]) ? "UN" : arr[i]}</td>`
                            tableRow += "<tr>"
                            return tableRow
                        },
                        parseDString = str => {
                            if (!str || !str.match)
                                return str
                            if (!str.match(/\D/gu))
                                return new Date(D.Int(str))
                            if (_.isString(str) && str !== "") {
                                let [month, day, year] = _.compact(str.match(/([\d]+)[^\w\d]*?([\d]+)[^\w\d]*?([\d]+)|(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*[^\w\d]*?([\d]+){1,2}\w*?[^\w\d]*?(\d+)/imuy)).slice(1)                
                                if (!month || !day || !year)
                                    return str
                                if (!["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].includes(month.toLowerCase()) && month > 12)
                                    [day, month] = [month, day]
                                if (!["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].includes(month.toLowerCase()))
                                    month = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"][month - 1]
                                if (`${year}`.length < 3)
                                    year = D.Int(year) + 2000
                                day = D.Int(day)
                                return new Date([year, ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].indexOf(month.toLowerCase())+1, day])
                            }
                            return str
                        },
                        isValidDString = str => {
                            const dateTest = parseDString(str)
                            return Boolean(str && dateTest && Object.prototype.toString.call(dateTest) === "[object Date]" && !_.isNaN(dateTest))
                        },   
                        returnLines = ["<table><tr><th style=\"width:100px;\">INPUT</th><th style=\"width:100px;\">OUTPUT</th></tr>"]
                    for (const dString of dateStrings)
                        if (isValidDString(dString))                   
                            returnLines.push(tableFunc([dString, TimeTracker.FormatDate(parseDString(dString))]))
                    returnLines.push("</table>")
                    D.Alert(returnLines.join(""))
                    break
                }
                case "players": {
                    const playerObjs = findObjs({
                        _type: "player"
                    })
                    sendChat("", `/w Storyteller ${playerObjs.map(x => `${x.get("displayname")}: ${x.id}<br>`)}`)
                    break
                } 
                case "contimages": {
                    const imgObjs = Media.GetContents(args.shift(), {padding: 50})
                    D.Alert(`Contained Images: ${imgObjs.map(v => v.get("name"))}`, "!test contimages")
                    break
                }            
                case "contchars": {
                    const charObjs = D.GetChars("sandbox")
                    D.Alert(`Contained Chars: ${charObjs.map(v => v.get("name"))}`, "!test contchars")
                    break
                }
                case "bounds": {
                    D.Alert(`Boundaries:<br>${D.JS(Media.GetBounds(Media.GetImg(msg) || args.shift()))}`)
                    break
                }
                case "token": {
                    const tokenObj = Media.GetImg(msg),
                        charObj = D.GetChar(tokenObj)
                    D.Alert(`Token: ${D.JS(tokenObj)}<br>Char: ${D.JS(charObj)}`, "!test token")
                    break
                }
                case "killtext": {
                    isKilling = true
                }
                // falls through
                case "writetext": {
                    isWriting = !isKilling
                }
                // falls through
                case "text": {
                    const regData = _.values(state[C.GAMENAME].Media.textregistry),
                        [reportLines, missingTextData, unregTextObjs] = [ [], [], [] ],
                        allTextObjs = findObjs({
                            _type: "text",
                        })
                    reportLines.push(
                        `${allTextObjs.length} text objects found.`,
                        `${_.keys(state[C.GAMENAME].Media.textregistry).length} registered text objects.`,
                        ""
                    )
                // First, verify that all registered objects are present.
                    for (const textData of regData)
                        if (!allTextObjs.map(x => x.id).includes(textData.id))
                            missingTextData.push(textData)
                    if (missingTextData.length)
                        reportLines.push(
                            `${missingTextData.length} registered text objects missing:`,
                            ...missingTextData.map(x => ` ...     ${x.name} (${x.id}) "${x.text}"`),
                            ""
                        )
                // Next, find text objects that aren't registered:
                    for (const textObj of allTextObjs)
                        if (!regData.map(x => x.id).includes(textObj.id))
                            unregTextObjs.push(textObj)
                    if (unregTextObjs.length)
                        reportLines.push(
                            `${unregTextObjs.length} unregistered text objects found:`,
                            ...unregTextObjs.map(x => ` ...     ${x.get("layer").toUpperCase()}: *${x.get("text")}* (${x.get("text").length} chars)<br> ...      ...     (${x.get("left")}, ${x.get("top")}) Size: ${x.get("font_size")}, Color: ${x.get("color")}<br> ...      ...     ${x.id}<br>`),
                            ""
                        )
                    if (isWriting)
                        for (const textObj of unregTextObjs)
                            if (textObj.get("text").length < 5)
                                textObj.set({
                                    color: C.COLORS.brightgold,
                                    text: `XX ${textObj.id} XX`,
                                    font_family: "Candal",
                                    font_size: 25
                                })
                    if (isKilling)
                        for (const textObj of unregTextObjs)
                            textObj.remove()                
                    D.Alert(reportLines.join("<br>"), "Text Survey & Verification")
                    break
                }
            // no default
            }
        }
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    return {
        CheckInstall: checkInstall,
        OnChatCall: onChatCall
    }
} )()

on("ready", () => {
    Tester.CheckInstall()
    D.Log("Tester Ready!")
} )
void MarkStop("Tester")