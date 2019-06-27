/* SETTING UP TEMPLATE:
    1) Replace "SCRIPTNAME" with name of script (e.g. "Chars")
    2) Replace "SCRIPTCOMMAND" with api chat command trigger (e.g. "!char")
    3) Delete these instructions, so "void MarkStart()" is the very first line.
*/
void MarkStart("SCRIPTNAME")
const SCRIPTNAME = (() => {
	// #region Configuration
    const STATEREF = state[D.GAMENAME].SCRIPTNAME
	// #endregion

	// #region GETTERS: Retrieving 

	// #endregion

	// #region SETTERS: Setting 

	// #endregion

	// #region Event Handlers (handleInput)
    const handleInput = msg => {
        if (msg.type !== "api" || !playerIsGM(msg.playerid))
            return
		/* API chat command parameters can contain spaces, but multiple parameters must be comma-delimited.
			e.g. "!test subcommand1 subcommand2 param1 with spaces, param2,param3" */
        const [command, ...args] = msg.content.split(/\s+/u),
            getParams = argArray => _.map(argArray.join(" ").replace(/\\,/gu, "@@@").split(","), v => v.trim().replace(/@@@/gu, ","))
			//[] = []
        let params = []
			
        switch (command.toLowerCase()) {
            case "SCRIPTCOMMAND":
                switch(args.shift().toLowerCase()) {
                    case "subcommand1":
                        switch(args.shift().toLowerCase()) {
                            case "subcommand2":
                                params = getParams(args)
                                break
				// no default
                        }
                        break
			// no default
                }
                break
		// no default
        }
    }
	// #endregion

	// #region Public Functions: regHandlers
    const regHandlers = () => {
            on("chat:message", handleInput)
        },
        checkInstall = () => {
            state[D.GAMENAME] = state[D.GAMENAME] || {}
            state[D.GAMENAME].SCRIPTNAME = state[D.GAMENAME].SCRIPTNAME || {}
        }
	// #endregion

    return {
        RegisterEventHandlers: regHandlers,
        CheckInstall: checkInstall
    }
} )()

on("ready", () => {
    SCRIPTNAME.RegisterEventHandlers()
    SCRIPTNAME.CheckInstall()
    D.Log("Ready!", "SCRIPTNAME")
} )
void MarkStop("SCRIPTNAME")