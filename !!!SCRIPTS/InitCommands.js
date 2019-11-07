void MarkStart("InitCommands")
const InitCommands = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "InitCommands",

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
    // #endregion

    // #region LOCAL INITIALIZATION
        initialize = () => { // eslint-disable-line no-empty-function
            return 
            if (Roll20AM && Roll20AM.StopSound)
                Roll20AM.StopSound("all")
            if (Media && Media.InitAnims())
                Media.InitAnims()
            setTimeout(() => {
                if (TimeTracker && TimeTracker.Fix)
                    TimeTracker.Fix()
                setTimeout(() => {
                    if (Media && Media.UpdateSoundScape)
                        Media.UpdateSoundscape()
                    D.Alert("Initialization Complete!", "INITIALIZATION")
                }, 2000)
            }, 2000)
        },
    // #endregion	

    // #region EVENT HANDLERS: (HANDLEINPUT)
        onChatCall = (call, args, objects, msg) => { // eslint-disable-line no-unused-vars
            switch (call) {
                case "":
                    break
            // no default
            }
        },
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

        preInitialization = () => {
            Handouts.PreInitialize()
        }

    return {
        PreInitialization: preInitialization,
        CheckInstall: checkInstall,
        OnChatCall: onChatCall
    }
} )()

on("ready", () => {
    InitCommands.CheckInstall()
    D.Log("InitCommands Ready!")
} )
void MarkStop("InitCommands")