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
    }
    // #endregion	

    // #region EVENT HANDLERS: (HANDLEINPUT)
    const handleInput = (msg, who, call, args) => { 	// eslint-disable-line no-unused-vars
        let [isKilling, isWriting] = [false, false]
        switch (call) {
            case "killimg":
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