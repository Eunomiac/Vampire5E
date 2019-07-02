/* SETTING UP TEMPLATE:
    1) Replace "XX_SCRIPTNAME_XX" with name of script (e.g. "Char")
    2) Replace "XX_SCRIPTCOMMAND_XX" with api chat command trigger (e.g. "!char")
    3) Delete these instructions, so "void MarkStart()" is the very first line.
*/
void MarkStart("XX_SCRIPTNAME_XX")
const XX_SCRIPTNAME_XX = (() => { 
	// ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "XX_SCRIPTNAME_XX",
		 CHATCOMMAND = "XX_SCRIPTCOMMAND_XX",
			  GMONLY = true
			  
	// #region COMMON INITIALIZATION
    const STATEREF = state[D.GAMENAME][SCRIPTNAME]	// eslint-disable-line no-unused-vars
    const VAL = (varList, funcName) => D.Validate(varList, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
		   DB = (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
		  LOG = (msg, funcName) => D.Log(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
		  THROW = (msg, funcName, errObj) => D.ThrowError(msg, funcName, SCRIPTNAME, errObj) // eslint-disable-line no-unused-vars

    const checkInstall = () => {
            state[D.GAMENAME] = state[D.GAMENAME] || {}
            state[D.GAMENAME][SCRIPTNAME] = state[D.GAMENAME][SCRIPTNAME] || {}
            initialize()
        },
        regHandlers = () => {
            on("chat:message", msg => {
                if (msg.type !== "api" ||
					GMONLY && !playerIsGM(msg.playerid) ||
					CHATCOMMAND && args.shift() !== CHATCOMMAND)
                    return
                const who = D.GetPlayerName(msg) || "API",
					 args = msg.content.split(/\s+/u),
					 call = args.shift()
                handleInput(msg, who, call, args)
            })
        }
	// #endregion

	// #region LOCAL INITIALIZATION
    const initialize = () => {
    }
	// #endregion	
	
	// let / const
	// *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

	// #region GETTERS: Retrieving 

	// #endregion

	// #region SETTERS: Setting 

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

    return {
        RegisterEventHandlers: regHandlers,
        CheckInstall: checkInstall
    }
} )()

on("ready", () => {
    XX_SCRIPTNAME_XX.RegisterEventHandlers()
    XX_SCRIPTNAME_XX.CheckInstall()
    D.Log("Ready!", "XX_SCRIPTNAME_XX")
} )
void MarkStop("XX_SCRIPTNAME_XX")