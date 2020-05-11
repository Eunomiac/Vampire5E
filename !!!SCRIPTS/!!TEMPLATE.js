/* SETTING UP TEMPLATE:
    1) Replace "XX_SCRIPTNAME_XX" with name of script (e.g. "Chars")
    2) Replace "XX_SCRIPTCOMMAND_XX" with api chat command trigger (e.g. "!char")
    3) Delete these instructions, so "void MarkStart()" is the very first line.
*/
void MarkStart("XX_SCRIPTNAME_XX");
const XX_SCRIPTNAME_XX = (() => {
// ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "XX_SCRIPTNAME_XX";

    // #region COMMON INITIALIZATION
    const STATE = {get REF() { return C.RO.OT[SCRIPTNAME] }};
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
} )();

on("ready", () => {
    XX_SCRIPTNAME_XX.CheckInstall();
    D.Log("XX_SCRIPTNAME_XX Ready!");
} );
void MarkStop("XX_SCRIPTNAME_XX");