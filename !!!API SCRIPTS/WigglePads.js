var WigglePads = WigglePads || (function () {
    

    //#region FUNCTIONS: Put functions linked by name to wiggle pads here.  Each will be passed an object of form:
    //    {  id: <id of graphic object beneath> }
    const FUNCTIONS = {
        selectDie: function (data) {
            var dieId;
            var diceCats = ["diceList", "bigDice"];
            var dieCat = "";
            do {
                dieCat = diceCats.pop();
                dieId = _.findIndex(state[D.GAMENAME].Roller[dieCat], function (die) { return die.id == data.id; });
            } while (dieId == -1);
            Roller.Select(dieId, dieCat);   //(dieNum, dieCat, dieVal, params)
            
        },
        wpReroll: function (data) {
            var diceCats = ["diceList", "bigDice"];
            var dieCat = 0;
            do {
                dieCat = diceCats.pop();
                dieCat = state[D.GAMENAME].Roller.selected[dieCat] && state[D.GAMENAME].Roller.selected[dieCat].length > 0 ? dieCat : 0;
            } while (dieCat == 0);
            Roller.Reroll(dieCat);
            
        },
        signalLight: function (data) {
            let light = findObjs({ _type: "graphic", _id: data.id })[0];
            if (!light)
                return D.ThrowError("No signal light found with id " + JSON.stringify(data.id) + ".");
            if (light.get("imgsrc") == IMAGES.blank)
                light.set("imgsrc", IMAGES.signalLight)
            else
                light.set("imgsrc", IMAGES.blank)
            
        }
    };
    //#endregion

    //#region CONFIGURATION
    const IMAGES = {
        blank:       "https://s3.amazonaws.com/files.d20.io/images/63990142/MQ_uNU12WcYYmLUMQcbh0w/thumb.png?1538455511",
        signalLight: "https://s3.amazonaws.com/files.d20.io/images/66320080/pUJEq-Vo-lx_-Nn16TvhYQ/thumb.png?1541372292" // 455 x 514
    }
    //#endregion

    //#region Pad Management
    var makePad = function (obj, name, params) {
        D.DB("PARAMS: " + D.JSL(params), "WIGGLEPADS: makePad()", 2);
        params = params || "height:0 width:0 x:0 y:0";
        let options = {};
        _.each(params.split(" "), function (pair) {
            pair = pair.split(":");
            options[pair[0]] = pair[1];
        });
        D.DB("DERIVED OPTIONS: " + D.JSL(options), "WIGGLEPADS: makePad()", 2);
        let pad = createObj("graphic", {
            name:         "WP_" + name + "_" + obj.id,
            _pageid:      obj.get("_pageid"),
            imgsrc:       IMAGES.blank,
            left:         obj.get("left") + parseInt(options.x ? options.x : 0),
            top:          obj.get("top") + parseInt(options.y ? options.y : 0),
            width:        obj.get("width") + parseInt(options.width ? options.width : 0),
            height:       obj.get("height") + parseInt(options.height ? options.height : 0),
            layer:        "objects",
            isdrawing:    true,
            controlledby: "all",
            showname:     false
        });
        state[D.GAMENAME].WigglePads.byPad[pad.id] = {
            id:          obj.id,
            funcName:    name,
            left:        pad.get("left"),
            top:         pad.get("top"),
            width:       pad.get("width"),
            height:      pad.get("height"),
            deltaLeft:   parseInt(options.x ? options.x : 0),
            deltaTop:    parseInt(options.y ? options.y : 0),
            deltaHeight: parseInt(options.height ? options.height : 0),
            deltaWidth:  parseInt(options.width ? options.width : 0)
        };
        D.DB("STATE ENTRIES: [BYPAD] " + D.JSL(state[D.GAMENAME].WigglePads.byPad[pad.id]), "WIGGLEPADS: makePad()", 2);
        state[D.GAMENAME].WigglePads.byGraphic[obj.id] = {
            id:  pad.id,
            pad: state[D.GAMENAME].WigglePads.byPad[pad.id]
        };
        D.DB(".............: [BYGFX] " + D.JSL(state[D.GAMENAME].WigglePads.byGraphic[obj.id]), "WIGGLEPADS: makePad()", 2);
        D.Alert("Created Pad #" + D.JS(_.values(state[D.GAMENAME].WigglePads.byPad).length) + " for function " + D.JS(name) + "()", "WIGGLEPADS: makePad()");
    };

    var setPad = function (graphicId, params) {
        if (!state[D.GAMENAME].WigglePads.byGraphic[graphicId])
            return D.ThrowError("Bad graphic ID: '" + D.JS(graphicId) + "'; Can't set params: '" + D.JS(params) + "'", "WIGGLEPADS: setPad()");
        var pad = findObjs({ _id: state[D.GAMENAME].WigglePads.byGraphic[graphicId].id })[0];
        if (!pad) 
            return D.ThrowError("No pad found with ID: '" + D.JS(graphicId) + "'; Can't set params: '" + D.JS(params) + "'", "WIGGLEPADS: setPad()");
        
        pad.set(params);
    }
    //#endregion

    //#region Event Handlers (handleInput)
    const handleMove = function (obj, prev) {
        if (obj.get("layer") == "gmlayer" || !state[D.GAMENAME].WigglePads.byPad[obj.id])
            return false;
        obj.set({ layer: "gmlayer" });
        const objData = state[D.GAMENAME].WigglePads.byPad[obj.id];
        obj.set({ left: objData.left, top: objData.top });
        if (!FUNCTIONS[objData.funcName])
            return false;
        FUNCTIONS[objData.funcName]({ id: objData.id });
        obj.set({ layer: "objects" })
    };

    var handleInput = function (msg) {
        if (msg.type !== "api" || !playerIsGM(msg.playerid))
            return;
        let who = (getObj('player', msg.playerid) || { get: () =>'API' }).get('_displayname');
        let args = msg.content.split(/\s+/);
        switch (args.shift()) {
            case '!wpad':
                if (!msg.selected || !msg.selected[0])
                    return D.ThrowError("Select a graphic or text object first!");
                var obj = findObjs({ _id: msg.selected[0]._id })[0];
                let funcName = args.shift();
                let params = args.join(" ");  // height:-28 width:-42 x:0 y:0
                makePad(obj, funcName, params);
                break;
            case '!showpads':
                _.each(state[D.GAMENAME].WigglePads.byPad, function (k, id) {
                    let pad = getObj("graphic", id);
                    if (!pad)
                        {D.ThrowError("No pad with id '" + D.JSL(id) + "'", "!ShowPads");}
                    else {
                        pad.set("imgsrc", "https://s3.amazonaws.com/files.d20.io/images/64184544/CnzRwB8CwKGg-0jfjCkT6w/thumb.png?1538736404");
                        pad.set("layer", "gmlayer");
                    }
                });
                break;
            case '!hidepads':
                _.each(state[D.GAMENAME].WigglePads.byPad, function (k, id) {
                    let pad = getObj("graphic", id);
                    if (!pad)
                        {D.ThrowError("No pad with id '" + D.JSL(id) + "'", "!ShowPads");}
                    else {
                        pad.set("imgsrc", IMAGES.blank);
                        pad.set("layer", "objects");
                    }
                });
                break;
            case '!resetpads':
                _.each(state[D.GAMENAME].WigglePads.byGraphic, function (v, k) {
                    let graphic = getObj("graphic", k) || getObj("text", k);
                    if (!graphic) {
                        D.ThrowError("No graphic with id '" + D.JSL(k) + "' for function '" + D.JSL(v.pad.funcName), "!resetPads");
                        state[D.GAMENAME].WigglePads.byPad = _.omit(state[D.GAMENAME].WigglePads.byPad, v.id);
                        state[D.GAMENAME].WigglePads.byPad = _.omit(state[D.GAMENAME].WigglePads.byGraphic, k);
                        return;
                    }
                    let pad = getObj("graphic", v.id);
                    if (pad)
                        pad.remove();
                    let params = "height:" + (v.pad.deltaHeight || 0) + " width:" + (v.pad.deltaWidth || 0) + " x:" + (v.pad.deltaLeft || 0) + " y:" + (v.pad.deltaTop || 0);
                    state[D.GAMENAME].WigglePads.byPad = _.omit(state[D.GAMENAME].WigglePads.byPad, v.id);
                    state[D.GAMENAME].WigglePads.byPad = _.omit(state[D.GAMENAME].WigglePads.byGraphic, k);
                    makePad(graphic, v.pad.funcName, params);
                });
                D.Alert("Pads Reset!", "!resetpads");
                break;
            case '!wpCLEAR':
                _.each(state[D.GAMENAME].WigglePads.byGraphic, function (v) {
                    let pad = getObj("graphic", v.id);
                    if (pad)
                        pad.remove();
                });
                _.each(state[D.GAMENAME].WigglePads.byPad, function (k, id) {
                    let pad = getObj("graphic", id);
                    if (pad)
                        pad.remove();
                });
                delete state[D.GAMENAME].WigglePads;
                checkInstall();
                break;
            default:
                break;
        }
    };

    //#endregion

    //#region Public Functions: registerEventHandlers, tapSpite
    const registerEventHandlers = function () {
        on('chat:message', handleInput);
        on('change:graphic', handleMove);
    };

    const checkInstall = function () {
        state[D.GAMENAME] = state[D.GAMENAME] || {};
        state[D.GAMENAME].WigglePads = state[D.GAMENAME].WigglePads || { byPad: {}, byGraphic: {} };
    };

    return {
        RegisterEventHandlers: registerEventHandlers,
        CheckInstall:          checkInstall,
        MakePad:               makePad,
        Set:                   setPad
    };
    //#endregion
})();

on("ready", function () {
    
    WigglePads.RegisterEventHandlers();
    WigglePads.CheckInstall();
    D.Log("WigglePads: Ready!");
});
