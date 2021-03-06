void MarkStart("Player");
const Player = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Player";

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
    const initialize = () => {};
    // #endregion

    // #region EVENT HANDLERS: (HANDLEINPUT)
    const onChatCall = (call, args, objects, msg) => {
        switch (call) {
            case "!huntkill": { // !huntkill <charInitial> <margin> <initialHunger> <isKilling: true/false>
                const charObj = D.GetChar(args.shift());
                const margin = D.Int(args.shift());
                const hunger = Math.max(0, D.Int(args.shift()) - (args[0] === "true" ? 1 : 0));
                if (args[0] === "true")
                    D.Flag(`${D.GetName(charObj, true)} KILLS for Hunger ${hunger}!`);
                setAttrs(charObj.id, {hunger});
                Char.UpdateHunger();
                if (margin >= 0)
                    Roller.ResChoice(charObj, margin);
                break;
            }
            case "!reschoice": { // !reschoice <charID> <margin> <choice>
                const charObj = D.GetChar(args.shift());
                const margin = D.Int(args.shift());
                const desiredFlavor = args.shift();
                const mods = {};

                if (D.GetRepStats(charObj, "advantage", {type: "merit"}, "Bloodhound").length)
                    mods.bloodhound = true;
                const [flavor, temperament] = Roller.Resonance(charObj, desiredFlavor, margin, "jumpHunt", [], mods);
                if (["intense", "acute"].includes(temperament))
                    setAttrs(charObj.id, {resonance: D.Capitalize(flavor)});
                else
                    setAttrs(charObj.id, {resonance: ""});
                break;
            }
            case "!endmonologue": {
                Session.EndMonologue();
                break;
            }
            case "!prompt": {
                switch (D.LCase((call = args.shift()))) {
                    case "submit": {
                        const [toChar, ...promptText] = args;
                        Session.SubmitPrompt(toChar, msg.playerid, promptText.join(" "));
                        break;
                    }
                    case "review": {
                        Session.ReviewPrompts(msg.playerid);
                        break;
                    }
                    case "delete": {
                        const [toChar, promptID] = args;
                        Session.DeletePrompt(toChar, msg.playerid, promptID);
                        break;
                    }
                    case "get": {
                        Session.GetPrompt(msg.playerid);
                        break;
                    }
                    // no default
                }
                // !spotprompt <toInitial> <fromInitial> <promptText>

                break;
            }
            case "!mvc": {
                MVC(msg.playerid);
                break;
            }
            case "!token": {
                const charObj = D.GetChar(msg.playerid);
                if (VAL({pc: charObj})) {
                    Media.CombineTokenSrc(charObj.id, D.Capitalize(args.shift()));
                    Char.ProcessTokenPowers(charObj.id);
                }
                break;
            }
            case "link":
            case "!links": {
                D.Chat(
                    msg.playerid,
                    C.HTML.Block(
                        [
                            C.HTML.Header("VAMPIRE: Toronto By Night Resources", {margin: "0px"}),
                            C.HTML.Body("(Each link opens in a new tab.)", {fontSize: "14px", lineHeight: "14px", margin: "5px 0px"}),
                            C.HTML.ButtonLine(
                                [
                                    C.HTML.Button("Chronicle Logs", "https://drive.google.com/open?id=1UYxbCeoSi6zEtX534FG-umh5CMzsE7_F", {
                                        width: "33%",
                                        color: "white",
                                        bgColor: C.COLORS.darkblue
                                    }),
                                    C.HTML.Button(
                                        "Districts & Sites",
                                        "https://docs.google.com/spreadsheets/d/1ol1JOQNZER7QGsmBoeVXbKFNmCjYvKc-xibXtS3sFKk/edit?usp=sharing",
                                        {width: "33%", color: "white", bgColor: C.COLORS.darkgreen}
                                    )
                                ].join("")
                            ),
                            C.HTML.ButtonLine(
                                [
                                    C.HTML.Button("Rules & Reference", "https://drive.google.com/open?id=1QMAPnl7wYMpXVyp-BYbi_c-gl1V20UTe", {
                                        width: "33%",
                                        color: "white"
                                    }),
                                    C.HTML.Button("House Rules", "https://drive.google.com/open?id=18v4b45LEQwfx5Kw-qLVd-sFnQ2tnj4CR", {
                                        width: "33%",
                                        color: "white"
                                    })
                                ].join("")
                            )
                        ].join(""),
                        undefined,
                        D.RandomString(3)
                    )
                );
                break;
            }
            // no default
        }
    };
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    // #region MVC: Minimally-Viable Character Design
    const MVC = (playerID) => {
        const results = [];
        for (const mvc of C.MVCVALS) {
            results.push(C.HTML.MVC.title(mvc[0]));
            for (const [fType, ...mvcItems] of mvc.slice(1))
                try {
                    results.push(C.HTML.MVC[fType](_.shuffle(mvcItems)[0]));
                } catch (errObj) {
                    return THROW(`ERRORED returning '${D.JSL(fType)}' for '${D.JSL(mvcItems)}' of '${D.JSL(mvc)}'`, "MVC", errObj);
                }
        }
        D.Chat(playerID, C.HTML.MVC.fullBox(results.join("")), undefined, false, true);
        return true;
    };
    // #endregion

    return {
        CheckInstall: checkInstall,
        OnChatCall: onChatCall
    };
})();

on("ready", () => {
    Player.CheckInstall();
    D.Log("Player Ready!");
});
void MarkStop("Player");
