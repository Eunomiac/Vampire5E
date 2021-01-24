const DragPads = (() => {
    // #region COMMON INITIALIZATION
    const checkInstall = () => {
        
        initialize();
    };
    // #endregion

    // #region LOCAL INITIALIZATION
    const initialize = () => {
        if ("DragPads" in state && state.DragPads.author !== "Eunomiac") {
            alertGM(" The 'DragPads' namespace is already in use! Aborting DragPad Initialization.", "DRAGPADS ERROR: NAMESPACE CONFLICT");
            return;
        }
        state.DragPads = state.DragPads || {author: "Eunomiac"};
        state.DragPads.registry = state.DragPads.registry || {byPad: {}, byPartner: {}, byGraphic: {}};
        state.DragPads.users = {players: {}};
        findObjs({_type: "player"}).forEach((playerObj) => {
            const playerData = {id: playerObj.id, displayName: playerObj.displayName};
            if (playerIsGM(playerData.id)) {
                if (state.DragPads.primaryGM) {
                    if (state.DragPads.primaryGM.id === playerData.id) {
                        state.DragPads.users.GM = playerData;
                    } else {
                        state.DragPads.users.players[playerData.id] = playerData;
                    }
                } else if ("GM" in state.DragPads.users) {
                    alertGM(`Multiple users have been given GM permissions.\nAssuming '${state.DragPads.users.GM.displayName}' is primary GM.\nType <b>!dpad change GM</b> to choose a different primary GM.`, "Too Many GMs!");
                } else {
                    state.DragPads.users.players[playerData.id] = playerData;
                }
            }
        });
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
    
    // #region CONSTANTS
    const HTML = {
        Block: (content) => `<div style="
                    display: block;
                    margin: -35px 0px -7px -42px;
                    height: auto;
                    min-height: 30px;
                    min-width: 267px;
                    font-size: 0px;
                    width: auto;
                    text-align: center;
                    border: 2px solid rgba(0, 0, 0, 1);
                    padding: 0px;
                    position: relative
                ">${content}</div>`,
        Header: (content) => `<h1 style="
                    display: block;
                    height: auto;
                    line-height: 30px;
                    width: auto;
                    margin: 0px;
                    padding: 0px 5px;
                    text-align: left;
                    color: rgba(255, 255, 255, 1);
                    font-family: Verdana, sans-serif;
                    font-weight: normal;
                    font-size: 16px;
                    text-transform: none;
                    background-color: rgba(80, 80, 80, 1);
                    border: none;
                    text-shadow: none;
                    box-shadow: none;
                    overflow: hidden
                ">${content}</h1>`,
        Body: (content) => `<div style="
                    display: block;
                    height: auto;
                    width: auto;
                    line-height: 14px;
                    margin: 0px;
                    padding: 5px;
                    color: rgba(0, 0, 0, 1);
                    background-color: rgba(255, 255, 255, 1);
                    font-size: 10px;
                    text-align: left;
                    font-family: 'Arial Narrow', sans-serif;
                    font-weight: normal;
                    text-shadow: none;
                    box-shadow: none;
                    border: none
                ">${content}</div>`
    };
    // #endregion

    // #region UTILITY FUNCTIONS
    const getSelectedGraphics = (msg) => msg.selected
        .filter((sel) => sel && sel._type === "graphic")
        .map((sel) => getObj("graphic", sel._id));

    const sendChatMessage = (playerID, message, title = "[DragPads Alert]") => {
        if (playerID === "all" || !playerID) {
            sendChat(randomString(3), HTML.Block([
                HTML.Header(title),
                HTML.Body(message)
            ].join("")));
        } else {
            sendChat(randomString(3), `/w "${USERS.PLAYERS[playerID].displayName} ${HTML.Block([
                HTML.Header(title),
                HTML.Body(message)
            ].join(""))}`);
        }
    };
    const alertGM = (msg, title = "[ALERT]") => sendChatMessage(USERS.GM.id, msg, title);

    const clone = (obj) => {
        try { return JSON.parse(JSON.stringify(obj)) }
        catch { return {...obj} }
    };

    const mapObj = (obj, keyFunc = (x) => x, valFunc = undefined) => {
        // obj = clone(obj);
        [valFunc, keyFunc] = [valFunc, keyFunc].filter((x) => typeof x === "function");
        keyFunc = keyFunc || function(k) {return k};
        const newObj = {};
        Object.entries(obj).forEach(([key, val]) => {
            newObj[keyFunc(key, val)] = valFunc(val, key);
        });
        return newObj;
    };

    const filterObj = (obj, filterFunc = () => true) => {
        // obj = clone(obj);
        const newObj = {};
        Object.entries(obj).forEach(([key, val]) => {
            if (filterFunc(key, val))
                newObj[key] = val;
        });
        return newObj;
    }
    // #endregion

    /* REGISTRATION FORMAT 
    [padID] = {
        padID,
        partnerID,
        graphicID,
        padPosition: {top, left, height, width},
        isReady (whether this is the pad that's currently on the object layer),
        isActive (whether this pad is toggled on),
        authorizedPlayers: false (for GM), true (for all), or array of player IDs for selection
        // If image should change:
        baseImage,
        altImages: []
        // If pos/dim should change:
        basePosition: {top, left, height, width},
        altPosition: {top, left, height, width},
        isPadFollowing
    }
    */

    // #region ACCESSORS
    const STATE = {get REF() { return state.DragPads }};
    const PADS = {
        get byPad() { return STATE.REF.registry.byPad },
        get byPartner() { return mapObj(STATE.REF.registry.byPad, (__, v) => v.partnerID, (v) => v) },
        get byGraphic() { 
            return {
                ready: mapObj(STATE.REF.registry.byGraphic, (v) => v.find((padID) => STATE.REF.registry.byPad[padID].isReady)),
                reserve: mapObj(STATE.REF.registry.byGraphic, (v) => v.find((padID) => !STATE.REF.registry.byPad[padID].isReady)),
            };
        }
    };
    const USERS = {
        get GM() { return STATE.REF.users.GM },
        get PLAYERS() { return STATE.REF.users.PLAYERS }
    };
    // #endregion

    // #region REGISTERING PADS
    

    // #endregion

    

})();

on("chat:message", msg => {

})
on("change:graphic", (imgObj, prevData) => {

})