void MarkStart("Chat");
/* Chat.js, "Chat".  No exposure to other scripts in the API.
   >>> Chat is a library of commands that can be triggered from within roll20 chat.  You can view the properties
   of selected objects and the state variable; run text-sizing tests to be used in scripts like Roller;   is both a
   library of handy resources for other scripts to use, and a master configuration file for your game.  You can find
   a list of all of the available methods at the end of the script.  Configuration is a bit trickier, but is contained
   to the CONFIGURATION and DECLARATIONS #regions. Strictly a utility script: Doesn't set things or return information
   to other API objects — use DATA and SET for that. */

const Chat = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Chat";

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

    const initialize = () => {
        STATE.REF.FontTypes = STATE.REF.FontTypes || [...FONTDATA.types];
        STATE.REF.FontSizes = STATE.REF.FontSizes || [...FONTDATA.sizes];
    };
    // #endregion

    // #region EVENT HANDLERS: (HANDLEINPUT)
    const onChatCall = (call, args, objects, msg) => {
        const params = {};
        let [obj, attrList] = [{}, {}],
            [objsToKill, returnVals, theseArgs] = [[], [], []],
            [objType, objID, pattern] = ["", "", ""];
        switch (call) {
            case "!state": {
                if (!getStateData(args, true))
                    sendHelpMsg();
                break;
            }
            case "!get": {
                switch (D.LCase((call = args.shift()))) {
                    case "text": {
                        switch (D.LCase((call = args.shift()))) {
                            case "check": {
                                if (msg.selected && msg.selected.length) {
                                    [obj] = findObjs({
                                        _id: msg.selected[0]._id
                                    });
                                    ((font = obj.get("font_family").split(" "), size = obj.get("font_size")) => {
                                        D.Alert(
                                            `There are ${_.values(state.DATA.CHARWIDTH[font][size]).length} entries.`,
                                            `${D.JS(font).toUpperCase()} ${D.JS(size)}`
                                        );
                                    })();
                                }
                                break;
                            }
                            // no default
                        }
                        break;
                    }
                    case "data": {
                        const [type, ref] = args;
                        DB({args, type, ref}, "getData");
                        if (type && ref) {
                            let thisObj = getObj(type, ref);
                            if (!thisObj)
                                thisObj = findObjs({_type: type, name: ref}).pop();
                            if (!thisObj)
                                thisObj = findObjs({_type: type, title: ref}).pop();
                            D.Alert(D.JS(thisObj, true), "!get data");
                        } else if (!getSelected(obj, true)) {
                            sendHelpMsg();
                        }
                        break;
                    }
                    case "byidonly": {
                        const thisObj = findObjs({_id: args[0]});
                        if (thisObj)
                            D.Alert(D.JS(thisObj, true), "!get byidonly");
                        else
                            D.Alert(`No object with id ${args[0]} found.`, "!get byidonly");
                        break;
                    }
                    case "typelist": {
                        const [type, val] = args;
                        let theseObjs = findObjs({_type: type});
                        if (val)
                            theseObjs = theseObjs.map((x) => `<b>${val}</b>: ${x.get(val) || x[val] || "&lt;???&gt;"} - ${x.id}`);
                        else
                            theseObjs = theseObjs.map((x) => x.id);
                        D.Alert([
                            `<h3>All ${D.Capitalize(type)} Objects:</h3>`,
                            ...theseObjs
                        ].join("<br>"), "!get typelist");
                        break;
                    }
                    default: {
                        if (D.GetSelected(msg))
                            [obj] = D.GetSelected(msg);
                        else
                            for (let i = 1; i < args.length; i++) {
                                [obj] = findObjs({
                                    _id: args[i]
                                });
                                if (obj) {
                                    args.splice(i, 1);
                                    break;
                                }
                            }
                        switch (call) {
                            case "pages":
                                if (!getPages())
                                    sendHelpMsg();
                                break;
                            case "id":
                                D.Alert(obj.id);
                                break;
                            case "name":
                                if (!getName(obj))
                                    sendHelpMsg();
                                break;
                            case "gm":
                                D.Alert(`The player ID of the GM is ${D.GMID()}`, "!GET GM");
                                break;
                            case "img":
                                if (!getImg(obj))
                                    sendHelpMsg();
                                break;
                            case "chars":
                            case "allchars":
                                if (!getAllChars())
                                    sendHelpMsg();
                                break;
                            case "char": {
                                if (!getChar(obj, args[0] !== "id"))
                                    sendHelpMsg();
                                break;
                            }
                            case "pos":
                            case "position":
                                if (!getPos(obj))
                                    sendHelpMsg();
                                break;
                            case "attrs":
                                if (!getCharAttrs(args.shift() || obj))
                                    sendHelpMsg();
                                break;
                            case "attr":
                                if (
                                    !getCharAttrs(
                                        obj,
                                        _.compact(
                                            args
                                                .join(" ")
                                                .replace(/(\[|,)/gu, "")
                                                .replace(/\s+/gu, "|")
                                                .split("|")
                                        )
                                    )
                                )
                                    sendHelpMsg();
                                break;
                            case "prop":
                            case "property":
                                if (!getProperty(obj, args.shift()))
                                    sendHelpMsg();
                                break;
                            case "state":
                                if (!getStateData(args))
                                    sendHelpMsg();
                                break;
                            case "statekeys":
                                if (!getStateData(args, true))
                                    sendHelpMsg();
                                break;
                            case "statevals": {
                                // !get statevals name, id|VAMPIRE Media ...
                                returnVals = args
                                    .join(" ")
                                    .split("|")[0]
                                    .replace(/\s+/gu, "")
                                    .split(",");
                                theseArgs = args
                                    .join(" ")
                                    .split("|")[1]
                                    .split(/\s+/gu);
                                if (!getStateData(theseArgs, returnVals))
                                    sendHelpMsg();
                                break;
                            }
                            case "page":
                                D.Alert(D.JS(Campaign().get("playerpageid")), "Page ID");
                                break;
                            default:
                                sendHelpMsg();
                                break;
                        }
                        break;
                    }
                    // no default
                }
                break;
            }
            case "!set": {
                switch (D.LCase((call = args.shift()))) {
                    case "pos":
                    case "position":
                        if (D.GetSelected(msg)) {
                            let [left, top] = args,
                                [deltaLeft, deltaTop] = [0, 0];
                            if (D.LCase(left) === "x")
                                left = null;
                            if (D.LCase(left) === "c")
                                left = C.SANDBOX.left;
                            if (D.LCase(left).startsWith("+")) {
                                deltaLeft = D.Round(D.LCase(left).replace(/\D/gu, ""), 2);
                                left = null;
                            }
                            if (D.LCase(left).startsWith("-")) {
                                deltaLeft = -D.Round(D.LCase(left).replace(/\D/gu, ""), 2);
                                left = null;
                            }
                            if (D.LCase(top) === "x")
                                top = null;
                            if (D.LCase(top) === "c")
                                top = C.SANDBOX.top;
                            if (D.LCase(top).startsWith("+")) {
                                deltaTop = D.Round(D.LCase(top).replace(/\D/gu, ""), 2);
                                top = null;
                            }
                            if (D.LCase(top).startsWith("-")) {
                                deltaTop = -D.Round(D.LCase(top).replace(/\D/gu, ""), 2);
                                top = null;
                            }
                            DB({args, top, left, deltaTop, deltaLeft}, "setPosition");
                            for (const selObj of D.GetSelected(msg)) {
                                if (deltaLeft)
                                    left = D.Float(selObj.get("left")) + deltaLeft;
                                if (deltaTop)
                                    top = D.Float(selObj.get("top")) + deltaTop;
                                if (left !== null)
                                    selObj.set({left});
                                if (top !== null)
                                    selObj.set({top});
                            }
                        }
                        break;
                    case "dim":
                    case "dims":
                    case "dimensions": {
                        if (D.GetSelected(msg)) {
                            let [width, height] = args;
                            // let [deltaWidth, deltaHeight] = [0, 0];
                            if (D.LCase(width) === "x")
                                width = null;
                            if (D.LCase(width) === "f")
                                width = C.SANDBOX.width;
                            // if (D.LCase(width).startsWith("+")) {
                            //     width = null;
                            //     deltaWidth = D.Round(D.LCase(width).replace(/\D/gu, ""), 2);
                            // }
                            // if (D.LCase(width).startsWith("-")) {
                            //     width = null;
                            //     deltaWidth = -D.Round(D.LCase(width).replace(/\D/gu, ""), 2);
                            // }
                            if (D.LCase(height) === "x")
                                height = null;
                            if (D.LCase(height) === "f")
                                height = C.SANDBOX.height;
                            // if (D.LCase(height).startsWith("+")) {
                            //     height = null;
                            //     deltaHeight = D.Round(D.LCase(height).replace(/\D/gu, ""), 2);
                            // }
                            // if (D.LCase(height).startsWith("-")) {
                            //     height = null;
                            //     deltaHeight = -D.Round(D.LCase(height).replace(/\D/gu, ""), 2);
                            // }
                            DB({height, width}, "setDimensions");
                            for (const selObj of D.GetSelected(msg)) {
                                if (width === null && height !== null)
                                    width = (selObj.get("width") * height) / selObj.get("height");
                                if (height === null && width !== null)
                                    height = (selObj.get("height") * width) / selObj.get("width");
                                // if (deltaWidth)
                                //     width = D.Float(selObj.get("width")) + deltaWidth;
                                // if (deltaHeight)
                                //     height = D.Float(selObj.get("height")) + deltaHeight;
                                if (width !== null)
                                    selObj.set({width});
                                if (height !== null)
                                    selObj.set({height});
                            }
                        }
                        break;
                    }
                    case "params":
                        if (msg.selected && msg.selected[0])
                            for (const objData of msg.selected) {
                                obj = getObj(objData._type, objData._id);
                                if (obj) {
                                    attrList = args.join(" ").split(/|\s*/gu);
                                    _.each(attrList, (v) => {
                                        params[v.split(":")[0]] = D.Int(v.split(":")[1]) || v.split(":")[1];
                                    });
                                    obj.set(params);
                                }
                            }

                        break;
                    case "text": {
                        switch (args.shift().toLowerCase()) {
                            case "prepall": {
                                STATE.REF.FontTypes = [...FONTDATA.types];
                                STATE.REF.FontSizes = [...FONTDATA.sizes];
                                STATE.REF.Chars = C.TEXTCHARS;
                                prepText(STATE.REF.FontTypes.shift());
                                break;
                            }
                            case "prep": {
                                STATE.REF.FontTypes = [...FONTDATA.types];
                                STATE.REF.FontSizes = [...FONTDATA.sizes];
                                STATE.REF.Chars = Object.values(D.MissingTextChars).join("");
                                prepText();
                                break;
                            }
                            case "res":
                            case "resolve": {
                                resolveText();
                                break;
                            }
                            case "upper": {
                                if (!msg.selected || !msg.selected[0])
                                    break;
                                caseText(msg.selected, "upper");
                                break;
                            }
                            case "lower": {
                                if (!msg.selected || !msg.selected[0])
                                    break;
                                caseText(msg.selected, "lower");
                                break;
                            }
                            // no default
                        }
                        break;
                    }
                    // no default
                }
                break;
            }
            case "!clear": {
                switch (D.LCase((call = args.shift()))) {
                    case "obj":
                        [objType, pattern] = [args.shift(), args.shift()];
                        objsToKill = _.filter(
                            findObjs({
                                _pageid: Campaign().get("playerpageid"),
                                _type: objType
                            }),
                            (v) => v && v.get("name").includes(pattern)
                        );
                        for (obj of objsToKill)
                            obj.remove();
                        break;
                    case "state":
                        if (!clearStateData(args))
                            sendHelpMsg();
                        break;
                    // no default
                }
                break;
            }
            case "!find": {
                switch (D.LCase((call = args.shift()))) {
                    case "obj":
                    case "object":
                        [objType, objID] = [args.shift(), args.shift()];
                        if (!objType || !objID) {
                            sendHelpMsg();
                            break;
                        }
                        D.Alert(D.JS(getObj(objType, objID)), "Object(s) Found");
                        break;
                    case "text": {
                        D.Alert(`Found ${D.GetSelected(msg, "text").length} objects.`);
                        break;
                    }
                    default:
                        sendHelpMsg();
                        break;
                }
                break;
            }
            // no default
        }
    };
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************
    // #region DECLARATIONS
    const FONTDATA = {
        types: ["Candal", "Contrail One", "Arial", "Patrick Hand", "Shadows Into Light"],
        sizes: [12, 14, 16, 18, 20, 22, 26, 32, 40, 56, 72, 100]
    };
    const ALERTBLACKLIST = ["weatherData"];
    const sendHelpMsg = () => {
        D.Alert("Syntax Failure.", "CHAT.API");
    };
    // #endregion

    // #region Get Data Functions
    const getPages = () => {
        const pageObjs = findObjs({_type: "page"});
        const msgLines = [];
        for (const pageObj of pageObjs)
            msgLines.push(`Page '${pageObj.get("name")}' = '${pageObj.id}'`);
        D.Alert(msgLines.join("<br>"), "getPages");
        return true;
    };
    const getSelected = (obj, isGettingAll) => {
        if (!VAL({object: obj}))
            return false;
        D.Alert(isGettingAll ? D.JS(obj, true) : obj.id);

        return true;
    };
    const getImg = (obj) => {
        if (!VAL({graphicObj: obj}))
            return false;
        D.Alert(`<b>ID:</b> ${obj.id}<br/><b>SRC:</b> ${obj.get("imgsrc").replace("max", "thumb")}`, "Image Data");

        return true;
    };
    const getAllChars = () => {
        const allCharObjs = findObjs({
            _type: "character"
        });
        const allCharIDs = allCharObjs.map((v) => ({
            name: v.get("name"),
            id: v.id
        }));
        const sortedAttrs = _.sortBy(allCharIDs, "id");
        const attrsLines = [];
        _.each(sortedAttrs, (attrInfo) => {
            attrsLines.push(`${attrInfo.id}: ${attrInfo.name}`);
        });
        D.Alert(attrsLines.join("<br/>"), "All Characters");

        return true;
    };
    const getChar = (obj, isGettingAll = false) => {
        if (!VAL({token: obj}))
            return false;
        try {
            const charObj = getObj("character", obj.get("represents"));
            const name = charObj.get("name");
            const playerID = charObj.get("controlledby").replace("all,", "");
            if (isGettingAll)
                D.Alert(D.JS(charObj, true), "Character Data");
            else
                D.Alert(`<b>Name:</b> ${name}<br/><b>CharID:</b> ${charObj.id}<br/><b>PlayerID:</b> ${playerID}`, "Character Data");
        } catch (errObj) {
            return THROW("", "getChar", errObj);
        }

        return true;
    };
    const getName = (obj) => {
        if (!VAL({object: obj}))
            return false;
        D.Alert(`<b>Name:</b> ${D.JS(obj.get("name"))}`, "Object Name");
        return true;
    };
    const getCharAttrs = (obj, filter = []) => {
        if (!obj)
            return false;
        let sortedAttrs = [];
        const allAttrObjs = _.uniq(
            findObjs({
                _type: "attribute",
                _characterid: typeof obj === "string" ? obj : obj.get("represents")
            })
        );
        const allAttrs = allAttrObjs.map((v) => ({
            name: v
                .get("name")
                .replace(/^repeating_/gu, "@@@")
                .replace(/@@@([^_]+)_[^_]{15}([^_]{4})[^_]+_(.*)/gu, "®$1_$2_$3"),
            current: v.get("current"),
            id: v.id
        }));
        const attrsLines = [];
        if (filter.length)
            sortedAttrs = _.sortBy(
                _.pick(_.uniq(allAttrs), (v) => filter.includes(v.name)),
                "name"
            );
        else
            sortedAttrs = _.sortBy(_.uniq(allAttrs), "name");
        _.each(sortedAttrs, (attrInfo) => {
            attrsLines.push(`${attrInfo.name} (${attrInfo.id.slice(10, 14)}): ${attrInfo.current}`);
        });
        D.Alert(
            `${attrsLines.join("<br/>")}<br/><br/>Num Objs: ${allAttrObjs.length}, Attrs: ${allAttrs.length}, Sorted: ${sortedAttrs.length}, Lines: ${
                attrsLines.length
            }`,
            `Attributes For ${D.GetName(obj)}`
        );

        return true;
    };
    const getPos = (obj) => {
        if (!obj)
            return false;
        const posInfo = [
            "<div style='display: block; width: 100%; height: auto; margin: 0px; padding: 0px; text-align: center; text-align-last: center; font-size: 12px; font-family: \"Century Gothic\";'>",
            `<div style="display: block; margin: 0px; padding: 0px; width: 100%; height: 20px; text-align:center; text-align-last: center; font-weight: bold; line-height: 20px;">${D.Round(obj.get("top") - 0.5 * obj.get("height"), 2)}</div>`,
            "<div style='display: block; margin: 0px; padding: 0px; width: 100%; height: auto;'>",
            `<div style="display: inline-block; margin: 0px; padding: 0px; width: 25%; height: 110px; line-height: 110px; text-align: center; text-align-last: center; font-weight: bold;">${D.Round(obj.get("left") - 0.5 * obj.get("width"), 2)}</div>`,
            `<div style="display: inline-block; margin: 0px; padding: 0px; width: 49%; background-color: #FFFFCC; border: 1px dotted black; text-align: center; text-align-last: center; vertical-align: middle; padding-top: 40px; padding-bottom: 40px;"><b>${D.Round(obj.get("left"), 2)}</b>, <b>${D.Round(obj.get("top"), 2)}</b><br>(<b>${D.Round(obj.get("width"), 2)}</b> x <b>${D.Round(obj.get("height"), 2)}</b>)</div>`,
            `<div style="display: inline-block; margin: 0px; padding: 0px; width: 25%; height: 110px; line-height: 110px; text-align: center; text-align-last: center; font-weight: bold;">${D.Round(obj.get("left") + 0.5 * obj.get("width"), 2)}</div>`,
            "</div>",
            `<div style="display: block; margin: 0px; padding: 0px; width: 100%; height: 20px; text-align:center; text-align-last: center; font-weight: bold; line-height: 20px;">${D.Round(obj.get("top") + 0.5 * obj.get("height"), 2)}</div>`,
            "</div>",
            "<div style='font-size: 0px;font-family: \"Century Gothic\";'>",
            `<div style="display: block; margin: 0px; padding: 0px; width: 100%; height: 20px; text-align:left; text-align-last: left;  line-height: 20px;font-size: 12px;font-family: Voltaire;border-bottom: 1px solid black;background-color: rgba(0,0,0,0.2);border-top: 1px solid black;">!set pos &lt;left (${D.Int(obj.get("left"))})&gt; &lt;top ((${D.Int(obj.get("top"))}))&gt;</div>`,
            "<div style=\"display: inline-block; width: 48%;vertical-align: top;font-size: 10px;border-right: 1px solid black;padding: 2px;\"><b>&nbsp;\"X\":</b> Keep existing.<br><b>\"+#\":</b> Move right / down.<br></div>",
            "<div style=\"display: inline-block; width: 48%;vertical-align: top;font-size: 10px;padding: 2px;\"><b>&nbsp;\"C\":</b> Center.<br><b>\"-#\":</b> Move left / up.<br></div>",
            "</div>",
            "<div style='font-size: 0px;font-family: \"Century Gothic\";'>",
            `<div style="display: block; margin: 0px; padding: 0px; width: 100%; height: 20px; text-align:left; text-align-last: left; line-height: 20px;font-size: 12px;font-family: Voltaire;border-bottom: 1px solid black;background-color: rgba(0,0,0,0.2);border-top: 1px solid black;">!set dim &lt;width ((${D.Int(obj.get("width"))}))&gt; &lt;height((${D.Int(obj.get("height"))}))&gt;</div>`,
            "<div style=\"display: inline-block; width: 48%;vertical-align: top;font-size: 10px;border-right: 1px solid black;padding: 2px;\"><b>&nbsp;\"X\":</b> Keep existing ratio.<br></div>",
            "<div style=\"display: inline-block; width: 48%;vertical-align: top;font-size: 10px;padding: 2px;\"><b>&nbsp;\"F\":</b> Max Size.<br></div>",
            "</div>"
        ];
        D.Alert(posInfo.join(""), `${obj.get("name") || ""} Position Data `);
        return true;
    };
    const getProperty = (obj, property) => {
        if (!property || !obj)
            return false;
        const propString = obj.get(property, (v) => {
            D.Alert(v, `${obj.get("_type").toUpperCase()} '${obj.get("name")}' - ${property}`);
            return v;
        });
        if (propString)
            D.Alert(D.JS(propString), `${obj.get("_type").toUpperCase()} '${obj.get("name")}' - ${property}`);

        return true;
    };
    const sendKeyValMenu = (obj, keyButtonPrefix, valButtonPrefix, title = "Object Display") => {
        D.Alert(Object.keys(obj).map((x, i) => `<div style="display: block; margin: 0px 0px; width: 100%; background-color: ${i % 2 === 0 ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.1)"};">
        <div style="display: inline-block; height: 10px; margin-right: 2px; line-height: 12px; width: 30px; background-color: rgba(0, 0, 255, 0.3); border: 1px solid blue; text-align: center; text-align-last: center;">
        <a style="display: inline-block; width: 100%; color: black; padding: 0px; border: none; background-color: transparent;" href="${keyButtonPrefix} ${x}">KEYS</a>
        </div>
        <div style="display: inline-block; height: 10px; margin-right: 2px; line-height: 12px; width: 30px; background-color: rgba(255, 0, 0, 0.3); border: 1px solid red; text-align: center; text-align-last: center;">
        <a style="display: inline-block; width: 100%; color: black; padding: 0px; border: none; background-color: transparent;" href="${valButtonPrefix} ${x}">FULL</a>
        </div>
        <div style="display: inline-block; width: 182px; font-weight: bold; background-color: transparent; height: 14px; line-height: 14px;">${x}</div>
        </div>`).join(""), title);
    };
    const getStateData = (namespace, returnVals) => {
        let [stateInfo, lastKey, isVerbose] = [state, "state", false];
        // if (namespace[0] !== C.GAMENAME)
        //  namespace.unshift(C.GAMENAME)
        if (namespace[0] === "full") {
            isVerbose = true;
            namespace.shift();
        }
        if (namespace[0] !== C.GAMENAME)
            if (SCRIPTS.includes(namespace[0]))
                namespace.unshift(C.GAMENAME);
            else
                D.Alert(
                    "Syntax:<br><br><b>!get state {SCRIPTNAME} {key} {key}...<br><b>!get statekeys {SCRIPTNAME} {key} {key}...<br><b>!get statevals {val},{val}|{SCRIPTNAME} {key} {key}...</b>",
                    "!get state"
                );

        const title = `state.${namespace.join(".")}`;
        const commandPrefixes = [`!get statekeys ${namespace.join(" ")} `, `!get state ${namespace.join(" ")} `];
        while (namespace && namespace.length) {
            lastKey = namespace.shift();
            stateInfo = stateInfo[lastKey];
        }
        if (!VAL({jsobj: stateInfo}))
            stateInfo = {[lastKey]: stateInfo};
        if (returnVals) {
            const returnInfo = {};
            _.each(stateInfo, (data, key) => {
                if (ALERTBLACKLIST.includes(key)) {
                    returnInfo[key] = "<b><u>(HIDDEN)</u></b>";
                } else {
                    const returnData = {};
                    _.each(_.isString(returnVals) ? returnVals.split(",") : returnVals, (val) => {
                        returnData[val] = data[val];
                    });
                    returnInfo[key] = _.clone(returnData);
                }
            });
            if (returnVals === true)
                sendKeyValMenu(stateInfo, commandPrefixes[0], commandPrefixes[1], title);
            else
                D.Show(returnInfo, title); // D.Alert(D.JS(returnInfo, isVerbose), title);
        } else {
            stateInfo = D.KeyMapObj(stateInfo, undefined, (v, k) => (ALERTBLACKLIST.includes(k) && "<b><u>(HIDDEN)</u></b>") || v);
            D.Show(stateInfo, title);
        }
        return true;
    };
    const clearStateData = (namespace) => {
        let stateInfo = state;
        if (namespace[0] !== C.GAMENAME)
            namespace.unshift(C.GAMENAME);
        const title = `Clearing state.${namespace.join(".")}`;
        while (namespace && namespace.length > 1)
            stateInfo = stateInfo[namespace.shift()];

        D.Alert(`DELETED ${namespace[0]} of ${D.JS(stateInfo)}`, title);
        delete stateInfo[namespace.shift()];
        // stateInfo = ""

        return true;
    };
    // #endregion

    // #region Text Length Testing
    const prepText = (fonts) => {
        const isDoingAll = STATE.REF.Chars.length < 10;
        fonts = (fonts && _.flatten([fonts])) || STATE.REF.FontTypes;
        if (STATE.REF.FontSizes.length) {
            const sizes = (isDoingAll && STATE.REF.FontSizes.splice(0, STATE.REF.FontSizes.length)) || STATE.REF.FontSizes.splice(0, 6);
            const [textObjs, newTextObjs] = [findObjs({_pageid: D.THISPAGEID, _type: "text", layer: "objects"}), {}];
            let [left, top] = [300, 100];
            for (const obj of textObjs)
                obj.remove();
            for (const font of fonts) {
                newTextObjs[font] = {};
                for (const size of sizes) {
                    newTextObjs[font][size] = [];
                    for (const char of STATE.REF.Chars.split("")) {
                        newTextObjs[font][size].push(
                            createObj("text", {
                                _pageid: D.THISPAGEID,
                                top,
                                left,
                                text: char.repeat(40),
                                font_size: size,
                                font_family: font,
                                color: "rgb(255,255,255)",
                                layer: "objects"
                            })
                        );
                        top += 25;
                        if (top > 3400) {
                            left += 100;
                            top = 100;
                        }
                    }
                }
            }
            D.Alert(
                `Created ${fonts.length} x ${STATE.REF.Chars.split("").length} x ${sizes.length} = ${
                    fonts.length * STATE.REF.Chars.split("").length * sizes.length
                } text objects.<br><br>Move the text object(s) around, then type '!set text res' when you have.`
            );
        }
    };
    const resolveText = () => {
        const textObjs = findObjs({_pageid: D.THISPAGEID, _type: "text", layer: "objects"});
        const textSizes = [];
        let font, trueFont;
        for (const obj of textObjs) {
            const width = obj.get("width");
            const height = obj.get("height");
            const char = obj.get("text").charAt(0);
            const size = obj.get("font_size");
            trueFont = obj.get("font_family");
            [font] = trueFont.split(" ");
            D.CHARWIDTH[font] = D.CHARWIDTH[font] || {};
            D.CHARWIDTH[font][size] = D.CHARWIDTH[font][size] || {};
            D.CHARWIDTH[font][size][char] = D.Int((width * 100) / 40) / 100;
            D.CHARWIDTH[font][size].lineHeight = D.Int(height * 10) / 10;
            if (!textSizes.includes(size))
                textSizes.push(size);
        }
        if (trueFont !== font)
            D.CHARWIDTH[trueFont] = D.CHARWIDTH[font];
        const [charList, charCounts] = [[], []];
        const testChars = ["M", "t", " ", "0"];
        const testColors = ["red", "blue", "green", "purple"];
        const reportTableRows = [];
        for (const fontName of Object.keys(D.CHARWIDTH)) {
            if (!FONTDATA.types.includes(D.Capitalize(fontName)))
                continue;
            reportTableRows.push(
                ...[
                    `<tr style="border: 2px solid black;"><th colspan = "${3
                        + testChars.length}"><h4 style="text-align: left; background-color: #555555; color: white; text-indent: 10px;">${D.Capitalize(
                        fontName
                    )}</h4></th></tr>`,
                    `<tr style="height: 20px; font-size: 12px; background-color: #AAAAAA; border: 2px solid black; border-bottom: 1px solid black; line-height: 16px;"><th style="width: 30px; text-align: right;">S</th><th style="width: 30px; text-align: right;">#</th>${testChars.map(
                        (x) => `<th style="width: 50px; text-align: right;">[${x.replace(/\s/gu, "&nbsp;")}]</th>`
                    )}<th style="width: 50px; text-align: right; font-size: 8px; line-height: 8px;padding-right: 5px;">Line<br>Height</th><tr>`
                ]
            );
            for (const fontSize of Object.keys(D.CHARWIDTH[fontName])) {
                charCounts.unshift(Object.keys(D.CHARWIDTH[fontName][fontSize]).filter((x) => x.length === 1).length);
                reportTableRows.push(
                    `<tr style="border-left: 2px solid black; border-right: 2px solid black;"><td style="text-align: right;">${fontSize}</td><td style="text-align: right;">${
                        charCounts[0]
                    }</td>${_.zip(testColors, testChars).map(
                        (x) => `<td style="color: ${x[0]}; text-align: right;">${D.Round(D.CHARWIDTH[fontName][fontSize][x[1]], 2, true)}</td>`
                    )}<td style="padding-right: 5px; text-align: right;"">${D.Round(D.CHARWIDTH[fontName][fontSize].lineHeight, 2, true)}</td></tr>`
                );
                if (charList.length === 0)
                    charList.push(...Object.keys(D.CHARWIDTH[fontName][fontSize]).filter((x) => x.length === 1));
            }
            if (_.uniq(charCounts).length !== 1)
                reportTableRows.push(
                    ...[
                        `<tr style="border-left: 2px solid black; border-right: 2px solid black;><td colSpan = "${3
                            + testChars.length}" style = "background-color: red, color: white, font-weight: bold;">Character Count Mismatch!</td></tr>`,
                        `<tr style="border-left: 2px solid black; border-right: 2px solid black;><td colSpan = "${3
                            + testChars.length}" style = "background-color: #FFBBBB;">${_.uniq(charCounts).join(", ")}</td></tr>`
                    ]
                );
            reportTableRows.push(`<tr style="height: 10px;"><td colspan="${3 + testChars.length}" style="border-top: 2px solid black;"></td></tr>`);
        }
        if (STATE.REF.FontSizes.length) {
            D.Alert(`Completed sizes ${D.JSL(textSizes)}.  Continuing with larger sizes.`, `Resolving '${D.JSL(trueFont)}`);
            prepText(trueFont);
        } else if (STATE.REF.FontTypes.length) {
            STATE.REF.FontSizes = [...FONTDATA.sizes];
            D.Alert(
                `Completed sizes ${D.JSL(textSizes)}.  ${D.Capitalize(trueFont)} <b>DONE!</b><br>Proceeding to ${D.Capitalize(
                    STATE.REF.FontTypes[0]
                )}`,
                `Resolving '${D.JSL(trueFont)}`
            );
            prepText(STATE.REF.FontTypes.shift());
        } else {
            for (const textObj of textObjs)
                textObj.remove();
            for (const missingChar of D.MissingTextChars)
                if (STATE.REF.Chars.split("").includes(missingChar))
                    D.MissingTextChars = `!${missingChar}`;
            D.Chat(
                "Storyteller",
                C.HTML.Block(
                    C.HTML.Body(
                        [
                            "<h4 style=\"text-align: center; background-color: black; color: white; border-bottom: 2px solid black;\">Text Width Calibration Complete!</h3>",
                            `<h4 style="display: block; text-align: center; width: 90%; margin-left: 5%; margin-top: 10px;">${charList.length} Characters Analyzed:</h5>`,
                            `<h5 style="display: block; text-align: center; width: 100%; font-size: 10px; background-color: #DFCCFF;">${_.escape(
                                [..._.compact(charList)].sort().join(" ")
                            )}</h5>`,
                            `<table style="width: 98%; margin-left: 1%; font-size: 10px;">${reportTableRows.join("")}</table>`,
                            `<h4 style="text-align: center; padding-bottom: 20px;">DATA.MissingTextChars revised to:<br>${D.JSL(
                                D.MissingTextChars
                            )}</h4>`
                        ].join(""),
                        {
                            color: C.COLORS.black,
                            bgColor: C.COLORS.white,
                            width: "100%",
                            margin: "0px",
                            fontFamily: "Verdana",
                            fontSize: "0px",
                            lineHeight: "16px",
                            fontWeight: "normal",
                            textAlign: "left",
                            textShadow: "none"
                        }
                    ),
                    {width: "100%", border: "2px solid black"}
                )
            );
        }
    };
    const caseText = (objs, textCase) => {
        objs.forEach((obj) => {
            obj.set("text", textCase === "upper" ? obj.get("text").toUpperCase() : obj.get("text").toLowerCase());
        });
    };
    // #endregion

    return {
        CheckInstall: checkInstall,
        OnChatCall: onChatCall
    };
})();

on("ready", () => {
    Chat.CheckInstall();
    D.Log("Chat Ready!");
});
void MarkStop("Chat");
