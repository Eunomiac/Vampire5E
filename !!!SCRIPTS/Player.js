void MarkStart("Player")
const Player = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Player",
        CHATCOMMAND = null,
        GMONLY = false,

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
    // #endregion

    // #region LOCAL INITIALIZATION
    // eslint-disable-next-line no-empty-function
        initialize = () => {
        },
    // #endregion	

    // #region EVENT HANDLERS: (HANDLEINPUT)
        handleInput = (msg, who, call, args) => { 	// eslint-disable-line no-unused-vars
            let [charID, token, imgData, charData, famToken] = []
            switch (call) {
                case "!mvc":
                    MVC({name: who})
                    break
                case "!sense":
                    charID = Char.REGISTRY[_.findKey(Char.REGISTRY, v => v.playerID === msg.playerid)].id;
                    [token] = findObjs({
                        _pageid: D.PAGEID,
                        _type: "graphic",
                        _subtype: "token",
                        represents: charID
                    })
                    imgData = Media.GetImgData(token)
                // D.Alert(`ImgData: ${D.JS(token)}`)
                    if (imgData.unObfSrc !== "sense") {
                        Media.SetImgData(token, {unObfSrc: "sense"})
                        if (imgData.isObf)
                            Media.SetImg(token, `senseObf${imgData.isDaylighter ? "DL" : ""}`)
                        else
                            Media.SetImg(token, `sense${imgData.isDaylighter ? "DL" : ""}`)
                    } else {
                        Media.SetImgData(token, {unObfSrc: "base"})
                        if (imgData.isObf)
                            Media.SetImg(token, `obf${imgData.isDaylighter ? "DL" : ""}`)
                        else
                            Media.SetImg(token, `base${imgData.isDaylighter ? "DL" : ""}`)
                    }
                    break
                case "!awe": {
                    charID = Char.REGISTRY[_.findKey(Char.REGISTRY, v => v.playerID === msg.playerid)].id;
                    [token] = findObjs({
                        _pageid: D.PAGEID,
                        _type: "graphic",
                        _subtype: "token",
                        represents: charID
                    })
                    imgData = Media.GetImgData(token)
                    if (imgData.curSrc === "base")
                        Media.SetImg(token, "awe")
                    else
                        Media.SetImg(token, "base")
                    break
                }
                case "!hide":
                    charID = Char.REGISTRY[_.findKey(Char.REGISTRY, v => v.playerID === msg.playerid)].id;
                // D.Alert(`Char ID[${D.JS(_.findKey(Char.REGISTRY, v => v.playerID === msg.playerid))}] = ${D.JS(charID)}`);
                    [token] = findObjs({
                        _pageid: D.PAGEID,
                        _type: "graphic",
                        _subtype: "token",
                        represents: charID
                    })
                // D.Alert(`Token: ${D.JS(token)}`)
                    imgData = Media.GetImgData(token)
                // D.Alert(`ImgData: ${D.JS(token)}`)
                    if (imgData.isObf) {
                        Media.SetImg(token, `${imgData.unObfSrc || "base"}${imgData.isDaylighter ? "DL" : ""}`)
                        Media.SetImgData(token, {isObf: false})
                    } else if (imgData.unObfSrc === "sense") {
                        Media.SetImg(token, `senseObf${imgData.isDaylighter ? "DL" : ""}`)
                        Media.SetImgData(token, {isObf: true})
                    } else {
                        Media.SetImg(token, `obf${imgData.isDaylighter ? "DL" : ""}`)
                        Media.SetImgData(token, {isObf: true})
                    }
                    break
                case "!mask":
                    charID = Char.REGISTRY[_.findKey(Char.REGISTRY, v => v.playerID === msg.playerid)].id;
                    [token] = findObjs({
                        _pageid: D.PAGEID,
                        _type: "graphic",
                        _subtype: "token",
                        represents: charID
                    })
                    imgData = Media.GetImgData(token)
                    if (imgData.isDaylighter)
                        break
                // D.Alert(`ImgData: ${D.JS(token)}`)
                    if (imgData.unObfSrc === "mask") {
                        Media.SetImgData(token, {unObfSrc: "base"})
                        if (!imgData.isObf)
                            Media.SetImg(token, "base")
                    } else {
                        Media.SetImgData(token, {unObfSrc: "mask"})
                        if (!imgData.isObf)
                            Media.SetImg(token, "mask")
                    }
                    break
                case "!famulus":
                    if (C.ROOT.Char.isDaylighterSession)
                        break
                    charData = Char.REGISTRY[_.findKey(Char.REGISTRY, v => v.playerID === msg.playerid)]
                    charID = charData.id;
                    [token] = findObjs({
                        _pageid: D.PAGEID,
                        _type: "graphic",
                        _subtype: "token",
                        represents: charID
                    })
                    if (!charData.famulusTokenID)
                        break
                    famToken = Media.GetImg(charData.famulusTokenID)
                    if (famToken.get("layer") !== "objects")
                        Media.SetImgTemp(famToken, {
                            top: token.get("top") - 100,
                            left: token.get("left") + 100
                        })
                    toFront(famToken)
                    Media.ToggleImg(famToken, famToken.get("layer") !== "objects")
                    break
            // no default
            }
        },
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************
    
    // #region MVC: Minimally-Viable Character Design
        MVC = (params) => {
            const results = []
            for (const mvc of C.MVCVALS) {
                results.push(C.bHTML.div.title.start + mvc[0] + C.bHTML.div.title.stop)
                for (const [fType, ...mvcItems] of mvc.slice(1))
                    try {
                        results.push(C.bHTML.div[fType].start + _.shuffle(mvcItems)[0] + C.bHTML.div[fType].stop)
                    } catch (errObj) {
                        return THROW(`ERRORED returning '${D.JSL(fType)}' for '${D.JSL(mvcItems)}' of '${D.JSL(mvc)}'`, "MVC", errObj)
                    }

            }
            D.Chat(params.name, C.HTML.start + results.join("") + C.HTML.stop, " ")
            return true
        }
    // #endregion

    return {
        RegisterEventHandlers: regHandlers,
        CheckInstall: checkInstall
    }
})()

on("ready", () => {
    Player.RegisterEventHandlers()
    Player.CheckInstall()
    D.Log("Player Ready!")
})
void MarkStop("Player")