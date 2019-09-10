void MarkStart("Tester")
const Tester = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Tester",
        CHATCOMMAND = "!test",
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
        }
    // #endregion

    // #region LOCAL INITIALIZATION
    const initialize = () => { // eslint-disable-line no-empty-function
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
    }
    
    const fuz = Fuzzy.Fix()
    // #endregion	

    // #region EVENT HANDLERS: (HANDLEINPUT)
    const handleInput = (msg, who, call, args) => { 	// eslint-disable-line no-unused-vars
        let [isKilling, isWriting] = [false, false]
        switch (call) {
            case "exist": {
                if (args[1])
                    D.Alert(`${args[0].toUpperCase()} Object with ID ${args[1]}: ${Boolean(getObj(args[0], args[1])) && "Exists" || "Does NOT Exist"}`)
                break
            }
            case "fuzzy": {
                switch(args.shift().toLowerCase()) {
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
                    tokenObjs = _.compact(_.values(charDatas).map(x => (findObjs({_pageid: D.PAGEID, _type: "graphic", _subtype: "token", represents: x.id}) || [null])[0]))
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
                ]
                const tableFunc = arr => {
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
                            return new Date(parseInt(str))
                        if (_.isString(str) && str !== "") {
                            let [month, day, year] = _.compact(str.match(/([\d]+)[^\w\d]*?([\d]+)[^\w\d]*?([\d]+)|(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*[^\w\d]*?([\d]+){1,2}\w*?[^\w\d]*?(\d+)/imuy)).slice(1)                
                            if (!month || !day || !year)
                                return str
                            if (!["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].includes(month.toLowerCase()) && month > 12)
                                [day, month] = [month, day]
                            if (!["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].includes(month.toLowerCase()))
                                month = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"][month - 1]
                            if (`${year}`.length < 3)
                                year = parseInt(year) + 2000
                            day = parseInt(day)
                            return new Date([year, ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].indexOf(month.toLowerCase())+1, day])
                        }
                        return str
                    },
                    isValidDString = str => {
                        const dateTest = parseDString(str)
                        return Boolean(str && dateTest && Object.prototype.toString.call(dateTest) === "[object Date]" && !isNaN(dateTest))
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
                D.Alert(playerObjs.map(x => `${x.get("displayname")}: ${x.id}`))
                break
            } case "killimg":
                isKilling = true
                // falls through
            case "images": {
                const regData = _.values(state[C.GAMENAME].Media.imageregistry),
                    [reportLines, missingImgData, unregImgObjs] = [ [], [], [] ],
                    allImgObjs = findObjs({
                        _type: "graphic",
                        _pageid: D.PAGEID
                    })
                reportLines.push(
                    `${allImgObjs.length} graphic objects found.`,
                    `${_.keys(state[C.GAMENAME].Media.imageregistry).length} registered graphic objects.`,
                    ""
                )
                // First, verify that all registered objects are present.
                for (const imgData of regData)
                    if (!allImgObjs.map(x => x.id).includes(imgData.id))
                        missingImgData.push(imgData)
                if (missingImgData.length)
                    reportLines.push(
                        `${missingImgData.length} registered images missing:`,
                        ...missingImgData.map(x => ` ...     ${x.name} (${x.id})`),
                        ""
                    )
                // Next, find images that aren't registered:
                for (const imgObj of allImgObjs)
                    if (!regData.map(x => x.id).includes(imgObj.id))
                        unregImgObjs.push(imgObj)
                if (unregImgObjs.length)
                    reportLines.push(
                        `${unregImgObjs.length} unregistered graphic objects found:`,
                        ...unregImgObjs.map(x => ` ...     <b>${x.get("name")}</b> (${x.id}) on ${x.get("layer")}<br> ...      ...     ${x.get("imgsrc")}<br>`),
                        ""
                    )
                if (isKilling) {
                    const urlsToKill = [
                        "KCTmLOcXQkAZZUZkbd4wOQ",
                        "MQ_uNU12WcYYmLUMQcbh0w"
                    ]
                    let count = 0
                    for (const url of urlsToKill) {
                        const imgObjs = unregImgObjs.filter(x => x.get("imgsrc").includes(url))
                        count += imgObjs.length
                        for (const imgObj of imgObjs)
                            imgObj.remove()
                    }
                    reportLines.push(`${count} graphic objects removed.`)
                }
                D.Alert(reportLines.join("<br>"), "Image Survey & Verification")
                break
            }
            case "killtext":
                isKilling = true
                // falls through
            case "writetext":
                isWriting = !isKilling
                // falls through
            case "text": {
                const regData = _.values(state[C.GAMENAME].Media.textregistry),
                    [reportLines, missingTextData, unregTextObjs] = [ [], [], [] ],
                    allTextObjs = findObjs({
                        _type: "text",
                        _pageid: D.PAGEID
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
                                color: C.COLORS.yellow,
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
        RegisterEventHandlers: regHandlers,
        CheckInstall: checkInstall
    }
} )()

on("ready", () => {
    Tester.RegisterEventHandlers()
    Tester.CheckInstall()
    D.Log("Tester Ready!")
} )
void MarkStop("Tester")