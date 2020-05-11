void MarkStart("InitCommands");
const InitCommands = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "InitCommands";

    // #region COMMON INITIALIZATION
    const STATE = {get REF() { return C.RO.OT[SCRIPTNAME] }};	// eslint-disable-line no-unused-vars
    const VAL = (varList, funcName, isArray = false) => D.Validate(varList, funcName, SCRIPTNAME, isArray); // eslint-disable-line no-unused-vars
    const DB = (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME); // eslint-disable-line no-unused-vars
    const LOG = (msg, funcName) => D.Log(msg, funcName, SCRIPTNAME); // eslint-disable-line no-unused-vars
    const THROW = (msg, funcName, errObj) => D.ThrowError(msg, funcName, SCRIPTNAME, errObj); // eslint-disable-line no-unused-vars

    const checkInstall = () => {
        C.RO.OT[SCRIPTNAME] = C.RO.OT[SCRIPTNAME] || {};
        initialize();
    };
    // #endregion

    // #region LOCAL INITIALIZATION
    const initialize = () => { // eslint-disable-line no-empty-function
        D.Flag("Initializing API...");
        Listener.Lock();
        setTimeout(() => {
            D.Flag("... Fixing TimeTracker ...");
            if (TimeTracker && TimeTracker.Fix)
                TimeTracker.Fix();
            setTimeout(() => {
                D.Flag("... Fixing Soundscape ...");
                if (Soundscape && Soundscape.Sync)
                    Soundscape.Sync(true);
                setTimeout(() => {
                    D.Flag("... Fixing Character Displays ...");
                    if (Char && Char.RefreshDisplays)
                        Char.RefreshDisplays();
                    setTimeout(() => {
                        D.Flag("Initialization Complete!");
                        Listener.Unlock();
                    }, Session.IsTesting ? 500 : 2000);
                }, Session.IsTesting ? 500 : 2000);
            }, Session.IsTesting ? 500 : 2000);
        }, Session.IsTesting ? 500 : 2000);
    };
    // #endregion	

    // #region EVENT HANDLERS: (HANDLEINPUT)
    const onChatCall = (call, args, objects, msg) => { // eslint-disable-line no-unused-vars
        switch (call) {
            case "":
                break;
            // no default
        }
    };
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    const preInitialization = () => {
        Handouts.PreInitialize();
    };

    return {
        PreInitialization: preInitialization,
        CheckInstall: checkInstall,
        OnChatCall: onChatCall
    };
})();

on("ready", () => {
    InitCommands.CheckInstall();
    D.Log("InitCommands Ready!");
} );
void MarkStop("InitCommands");