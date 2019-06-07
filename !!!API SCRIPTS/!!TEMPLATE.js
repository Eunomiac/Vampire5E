/* SETTING UP TEMPLATE:
    1) Replace "<SCRIPTNAME>" with name of script (e.g. "Char")
    2) Replace "<SCRIPTCOMMAND>" with api chat command trigger (e.g. "!char")
    3) Delete these instructions, so "void MarkStart()" is the very first line.
*/
void MarkStart("<SCRIPTNAME>")
const <SCRIPTNAME> = (() => {
	// ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
	const SCRIPTNAME = "<SCRIPTNAME>",
		 CHATCOMMAND = "<SCRIPTCOMMAND>",
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
					(GMONLY && !playerIsGM(msg.playerid)) ||
					(CHATCOMMAND && args.shift() !== CHATCOMMAND))
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
	<SCRIPTNAME>.RegisterEventHandlers()
	<SCRIPTNAME>.CheckInstall()
	D.Log("Ready!", "<SCRIPTNAME>")
} )
void MarkStop("<SCRIPTNAME>")