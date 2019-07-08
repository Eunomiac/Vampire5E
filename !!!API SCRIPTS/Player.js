/* SETTING UP TEMPLATE:
    1) Replace "Player" with name of script (e.g. "Chars")
    2) Replace "null" with api chat command trigger (e.g. "!char")
    3) Delete these instructions, so "void MarkStart()" is the very first line.
*/
void MarkStart("Player")
const Player = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Player",
        CHATCOMMAND = null,
        GMONLY = true
        
    // #region COMMON INITIALIZATION
    const STATEREF = C.ROOT[SCRIPTNAME]	// eslint-disable-line no-unused-vars
    const VAL = (varList, funcName) => D.Validate(varList, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
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
                if (msg.type === "api" && (!GMONLY || playerIsGM(msg.playerid)) && (!CHATCOMMAND || args.shift() === CHATCOMMAND)) {
                    const who = D.GetPlayerName(msg) || "API",
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
        // const 
        switch (call) {
            case "":

                break
            default: break
        }
    }
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    /*
    *
    *
    *
    * 
    * 
    * 
    * 
    * 
    * 
    *   SCRIPT BODY
    * 
    * 
    * 
    * 
    * 
    * 
    * 
    * 
    */

    return {
        RegisterEventHandlers: regHandlers,
        CheckInstall: checkInstall
    }
} )()

on("ready", () => {
    Player.RegisterEventHandlers()
    Player.CheckInstall()
    D.Log("Player Ready!")
} )
void MarkStop("Player")