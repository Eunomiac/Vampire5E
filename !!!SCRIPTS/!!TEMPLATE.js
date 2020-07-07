void MarkStart("XX_SCRIPTNAME_XX"); /* SETTING UP TEMPLATE: Replace "XX_SCRIPTNAME_XX" with name of script (e.g. "Chars") */
const XX_SCRIPTNAME_XX = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "XX_SCRIPTNAME_XX";

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
        STATE.REF.XX_SCRIPTNAME_XXLibrary = STATE.REF.XX_SCRIPTNAME_XXLibrary || {};
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

    // #region VERIABLE DECLARATIONS
    const PENDINGCHANGES = [];
    const LI = {
        get B() {
            return STATE.REF.XX_SCRIPTNAME_XXLibrary;
        }
    };

    // #endregion
    // #region CLASS DEFINITIONS
    class XX_CLASSNAME_XX {
        /* SETTING UP CLASS TEMPLATE: Replace "XX_CLASSNAME_XX" with name of class (e.g. "Asset") */
        // #region ~ STATIC METHODS, GETTERS & SETTERS
        // #region Instance Storage Libraries (Indexed by "id" property)
        static get LIB() {
            return this._XX_CLASSNAME_XXLIB;
        }
        static set LIB(v) {
            this._XX_CLASSNAME_XXLIB = Object.assign(this._XX_CLASSNAME_XXLIB || {}, {[v.id]: v});
        }
        // #endregion
        // #endregion

        // #region ~ BASIC GETTERS & SETTERS

        // #endregion

        // #region ~ CONSTRUCTOR
        constructor(assetRef) {}
        // #endregion

        // #region ~ GETTERS
        // READ-ONLY

        // GENERAL

        // #endregion

        // #region ~ SETTERS

        // #endregion

        // #region ~ PRIVATE METHODS

        // #endregion

        // #region ~ PUBLIC METHODS

        // #endregion
    }
    // #endregion
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
        CheckInstall: checkInstall,
        OnChatCall: onChatCall
    };
})();

on("ready", () => {
    XX_SCRIPTNAME_XX.CheckInstall();
    D.Log("XX_SCRIPTNAME_XX Ready!");
});
void MarkStop("XX_SCRIPTNAME_XX");
