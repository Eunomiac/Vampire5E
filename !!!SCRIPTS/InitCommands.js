void MarkStart("InitCommands");
const InitCommands = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SKIPINITIALIZATION = false; // Set true to temporarily skip all initializations of scripts.
    const SCRIPTNAME = "InitCommands";

    // #region COMMON INITIALIZATION
    const STATE = {
        get REF() {
            return C.RO.OT[SCRIPTNAME];
        }
    };
    const VAL = (varList, funcName, isArray = false) => D.Validate(varList, funcName, SCRIPTNAME, isArray);
    const DB = (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME);
    const LOG = (msg, funcName) => D.Log(msg, funcName, SCRIPTNAME);
    const THROW = (msg, funcName, errObj) => D.ThrowError(msg, funcName, SCRIPTNAME, errObj);

    const checkInstall = () => {
        C.RO.OT[SCRIPTNAME] = C.RO.OT[SCRIPTNAME] || {};
        initialize();
    };
    // #endregion

    // #region LOCAL INITIALIZATION
    const initialize = () => {
        if (!SKIPINITIALIZATION) {
            D.Flag("Initializing API...");
            Media.ToggleImg("Horizon-CNTower-Underlay_1", true);
            const delayTime = Session.IsTesting ? 1 : 2000;
            Listener.Lock();
            setTimeout(() => {
                D.Flag("... Fixing TimeTracker ...");
                if (TimeTracker && TimeTracker.Fix)
                    TimeTracker.Fix(true);
                setTimeout(() => {
                    D.Flag("... Fixing Soundscape ...");
                    if (Soundscape && Soundscape.Sync)
                        Soundscape.Sync();
                    setTimeout(() => {
                        D.Flag("... Fixing Character Displays ...");
                        if (Char && Char.RefreshDisplays)
                            Char.RefreshDisplays();
                        setTimeout(() => {
                            D.Flag("Initialization Complete!");
                            Listener.Unlock();
                        }, delayTime);
                    }, delayTime);
                }, delayTime);
            }, delayTime);
        } else {
            D.Flag("SKIPPING INITIALIZATION (SEE SCRIPT)");
        }
    };
    // #endregion

    // #region EVENT HANDLERS: (HANDLEINPUT)
    const onChatCall = (call, args, objects, msg) => {
        switch (call) {
            case "":
                break;
            // no default
        }
    };
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    const preInitialization = () => {
        if (!SKIPINITIALIZATION)
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
});
void MarkStop("InitCommands");
