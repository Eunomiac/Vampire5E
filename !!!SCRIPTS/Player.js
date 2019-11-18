void MarkStart("Player")
const Player = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Player",

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
    // eslint-disable-next-line no-empty-function
        initialize = () => {
        },
    // #endregion	

    // #region EVENT HANDLERS: (HANDLEINPUT)
        onChatCall = (call, args, objects, msg) => { 	// eslint-disable-line no-unused-vars
            switch (call) {
                case "!mvc": {
                    MVC({name: msg.who})
                    break
                }
                case "!token": {
                    const charObj = D.GetChar(msg.playerid)
                    if (VAL({pc: charObj}))
                        Media.CombineTokenSrc(charObj.id, D.Capitalize(args.shift()))
                    break
                }
                case "!famulus": {
                    if (C.RO.OT.Char.isDaylighterSession)
                        break
                    const charData = Char.REGISTRY[_.findKey(Char.REGISTRY, v => v.playerID === msg.playerid)],
                        charID = charData.id,
                        [charToken] = findObjs({
                            _pageid: D.PAGEID,
                            _type: "graphic",
                            _subtype: "token",
                            represents: charID
                        })
                    if (!charData.famulusTokenID)
                        break
                    const famToken = Media.GetImg(charData.famulusTokenID)
                    if (famToken.get("layer") !== "objects")
                        Media.SetImgTemp(famToken, {
                            top: charToken.get("top") - 100,
                            left: charToken.get("left") + 100
                        })
                    toFront(famToken)
                    Media.ToggleImg(famToken, famToken.get("layer") !== "objects")
                    break
                }
            // no default
            }
        },
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************
    
    // #region MVC: Minimally-Viable Character Design
        MVC = (params) => {
            const results = []
            for (const mvc of C.MVCVALS) {
                results.push(C.HTML.MVC.title(mvc[0]))
                for (const [fType, ...mvcItems] of mvc.slice(1))
                    try {
                        results.push(C.HTML.MVC[fType](_.shuffle(mvcItems)[0]))
                    } catch (errObj) {
                        return THROW(`ERRORED returning '${D.JSL(fType)}' for '${D.JSL(mvcItems)}' of '${D.JSL(mvc)}'`, "MVC", errObj)
                    }

            }
            D.Chat(params.name, C.HTML.MVC.fullBox(results.join("")), " ")
            return true
        }
    // #endregion

    return {
        CheckInstall: checkInstall,
        OnChatCall: onChatCall
    }
})()

on("ready", () => {
    Player.CheckInstall()
    D.Log("Player Ready!")
})
void MarkStop("Player")