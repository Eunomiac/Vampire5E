const Roller = (() => {
    // ************************************** INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Roller",
        STATE = {get REF() { return state[SCRIPTNAME] }},
        checkInstall = () => {
            state[SCRIPTNAME] = state[SCRIPTNAME] || {}
            initialize()
        }, 
        initialize = () => {
            STATE.REF.frenzyRoll = STATE.REF.frenzyRoll || false
            STATE.REF.isRollerLocked = STATE.REF.isRollerLocked || false
        },
        SETTINGS = {
            chatWidth: 275
        },
        IMAGES = {
            blackMarble: "https://i.imgur.com/kBl8aTO.jpg"
        },
        COLORS = {
            white: "rgb(255, 255, 255)",
            black: "rgb(0, 0, 0)",
            brightgrey: "rgb(175, 175, 175)",
            grey: "rgb(130, 130, 130)",
            darkgrey: "rgb(80, 80, 80)",
            brightred: "rgb(255, 0, 0)",
            brightredmid: "rgb(225, 0, 0)",
            red: "rgb(200, 0, 0)",
            darkredmid: "rgb(175, 0, 0)",
            darkred: "rgb(150, 0, 0)",
            green: "rgb(0, 200, 0)",
            yellow: "rgb(200, 200, 0)",
            orange: "rgb(200, 100, 0)",
            brightpurple: "rgb(200, 100, 200)",
            purple: "rgb(150, 0, 150)",
            darkpurple: "rgb(100, 0, 100)",
            brightblue: "rgb(150, 150, 255)",
            blue: "rgb(100, 100, 255)",
            darkblue: "rgb(50, 50, 150)",
            cyan: "rgb(0, 255, 255)",
            gold: "#ffd700",
            fadedblack: "rgba(0, 0, 0, 0.2)",
            fadedgrey: "rgba(0, 0, 0, 0.1)",
            crimson: "rgb(220, 20, 60)",
            transparent: "rgba(0,0,0,0)",
            halfwhite: "rgba(255,255,255,0.5)",
            palegreen: "rgb(175, 255, 175)",
            paleblue: "rgb(175, 175, 255)",
            palered: "rgb(255, 175, 175)",
            palepurple: "rgb(255, 175, 255)"
        },

    // #region Utility Functions
        getGM = () => findObjs({_type: "player"}).filter(x => playerIsGM(x.id))[0],
        getPlayerChars = () => findObjs({_type: "character"}).
            filter(charObj => findObjs({_type: "player"}).
                map(playerObj => playerObj.id).
                filter(playerObj => playerObj !== getGM().id).
                includes(charObj.get("controlledby"))),
        getRandomString = () => _.sample("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""), 10).join(""),
        chat = (who, message) => {
            if (!who || who === "all")
                sendChat(getRandomString(), message)
            else if (typeof who === "string")
                who = [who]
            if (Array.isArray(who))
                for (const to of who)
                    if (to === "GM")
                        sendChat(getRandomString(), `/w ${getGM().get("displayname")} ${message}`)
                    else if (typeof to === "string")
                        sendChat(getRandomString(), `/w ${to} ${message}`)
        },
    // #endregion

    // #region HTML Chat Code
        HTML = {
            Prompt: (header, buttons) => `<div style="
                    display: block;
                    height: auto;
                    border: 4px ${COLORS.crimson} outset;
                    width: ${SETTINGS.chatWidth - 2*4}px;
                    background: url('${IMAGES.blackMarble}');
                    text-align: center;
                    position: relative;
                    margin-top: -25px;
                "><span style="
                    display: block;
                    font-size: 16px;
                    font-weight: bolder;
                    font-variant: small-caps;
                    margin-top: 4px;
                    margin-bottom: 12px;
                ">${header}</span>${Object.entries(buttons).map(x => `<a style="
                        height: 20px;
                        width: 20px;
                        display: inline-block;
                        border: 1px solid ${COLORS.white};
                        color: ${COLORS.white};
                        background-color: ${COLORS.darkred};
                        font-size: 10px;
                        line-height: 10px;
                        font-family: ${SETTINGS.buttonFont};
                        text-transform: uppercase;
                        text-align: center;
                        padding: 5%;
                        font-weight: normal;"
                    href="${x[1]}">${x[0]}</a>`)}</div>`,
            Roll: (params) => ""
        }
    // #endregion

    // #region EVENT HANDLERS: (HANDLE INPUT)
    on("chat:message", msg => {
        let [call, args] = msg.content.split(/\s+/u),
            rollType
        if (call === "!roll" && args.length > 1 && msg.type === "api" && (msg.who === "API" || msg.playerid === getGM().id))
            switch (call = args.shift().toLowerCase()) {
                case "frenzyinit": {	// !roll dice project @{character_name}|Politics:3,Resources:2|mod|diff|diffMod|rowID
                    lockRoller(true)
                    const charName = args.join(" ").split(/|/u)[0]
                    STATE.REF.frenzyRoll = `${charName}|`
                    chat("GM", HTML.Prompt(`Set Frenzy Difficulty for ${charName}`, {
                        1: "!roll frenzy 1",
                        2: "!roll frenzy 2",
                        3: "!roll frenzy 3",
                        4: "!roll frenzy 4",
                        5: "!roll frenzy 5"
                    }))
                    break
                } case "frenzy": { rollType = "frenzy"
                    lockRoller(false)
                    args = `${STATE.REF.frenzyRoll} ${args[0] || ""}`.split(" ")
                }
                /* falls through */
                case "disc": case "trait": { rollType = rollType || "trait" }
                /* falls through */
                case "rouse": case "rouseobv": { rollType = rollType || "rouse" }
                /* falls through */
                case "rouse2": case "rouse2obv": { rollType = rollType || "rouse2" }
                /* falls through */
                case "check": { rollType = rollType || "check" }
                /* falls through */
                case "willpower": { rollType = rollType || "willpower" }
                /* falls through */
                case "humanity": { rollType = rollType || "humanity" }
                /* falls through */
                case "remorse": { rollType = rollType || "remorse" }
                /* falls through */
                case "project": { rollType = rollType || "project" /* all continue below */
                    if (STATE.REF.isRollerLocked)
                        break
                    const params = args.join(" ").split("|").map(x => x.trim()),
                        charName = params.shift(),
                        charObj = findObjs({_type: "character"}).find(x => x.get("name").toLowerCase() === charName.toLowerCase())
                    makeNewRoll(charObj, rollType, params, {isDiscRoll: call === "disc", isOblivionRoll: call.includes("obv")})
                    delete STATE.REF.frenzyRoll
                    break
                }
                // no default
            }             
    })
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    // #region CONFIGURATION: Image Links, Color Schemes */
    const CHATSTYLES = {
            fullBox: `<div style="display: block;width: 259px;padding: 5px 5px;margin-left: -42px;margin-top: -25px; color: ${C.COLORS.white};font-family: bodoni svtytwo itc tt;font-size: 16px;border: 3px outset ${C.COLORS.darkred};background: url('http://imgsrv.roll20.net/?src=imgur.com/kBl8aTO.jpg') center no-repeat;position: relative;">`,
            space10: "<span style=\"display: inline-block; width: 10px;\"></span>",
            space30: "<span style=\"display: inline-block; width: 30px;\"></span>",
            space40: "<span style=\"display: inline-block; width: 40px;\"></span>",
            rollerName: `<div style="display: block; width: 100%; font-variant: small-caps; font-size: 16px; height: 15px; padding-bottom: 5px; border-bottom: 1px solid ${C.COLORS.white}; overflow: hidden;">`,
            mainRoll: `<div style="display: block; width: 100%; height: auto; padding: 3px 0px; border-bottom: 1px solid ${C.COLORS.white};"><span style="display: block; height: 16px; line-height: 16px; width: 100%; font-size: 14px; ">`,
            mainRollSub: "<span style=\"display: block; height: 12px; line-height: 12px; width: 100%; margin-left: 24px; font-size: 10px; font-variant: italic;\">",
            check: `<div style="display: block; width: 100%; height: auto; padding: 3px 0px; border-bottom: 1px solid ${C.COLORS.white};"><span style="display: block; height: 20px;  line-height: 20px; width: 100%; margin-left: 10%;">`,
            dicePool: "<div style=\"display: block; width: 100%; padding: 3px 0px; height: auto; \"><span style=\"display: block; height: 16px; width: 100%; margin-left: 5%; line-height: 16px; font-size: 14px;\">",
            resultBlock: "<div style=\"display: block; width: 100%; height: auto; \">",
            resultCount: "<div style=\"display: inline-block; width: YYYpx; margin-top:ZZZpx; vertical-align: top; text-align: right; height: 100%; \"><span style=\"display: inline-block; font-weight: normal; font-family: Verdana; text-shadow: none; height: 24px; line-height: 24px; vertical-align: middle; width: 40px; text-align: right; margin-right: 10px; font-size: 12px;\">",
            margin: "<div style=\"display: inline-block; width: YYYpx; vertical-align: top; margin-top:ZZZpx; text-align: left; height: 100%; \"><span style=\"display: inline-block; font-weight: normal; font-family: Verdana; text-shadow: none; height: 24px; line-height: 24px; vertical-align: middle; width: 40px; text-align: left; margin-left: 10px; font-size: 12px;\">",
            outcomeRed: `<div style="display: block; width: 100%; height: 20px; line-height: 20px; text-align: center; font-weight: bold;"><span style="color: ${C.COLORS.brightred}; display: block; width: 100%;  font-size: 22px; font-family: 'Bodoni SvtyTwo ITC TT';">`,
            outcomeRedSmall: `<div style="display: block; width: 100%; margin-top: 5px; height: 14px; line-height: 14px; text-align: center; font-weight: bold;"><span style="color: ${C.COLORS.brightred}; display: block; width: 100%;  font-size: 14px; font-family: 'Bodoni SvtyTwo ITC TT';">`,
            outcomePurple: `<div style="display: block; width: 100%; height: 20px; line-height: 20px; text-align: center; font-weight: bold;"><span style="color: ${C.COLORS.black}; display: block; width: 100%;  font-size: 22px; font-family: Voltaire; text-shadow: 0px 0px 2px rgb(255,255,255), 0px 0px 2px rgb(255,255,255), 0px 0px 2px rgb(255,255,255), 0px 0px 2px rgb(255,255,255), 0px 0px 2px rgb(255,255,255), 0px 0px 4px rgb(255,255,255), 0px 0px 4px rgb(255,255,255), 0px 0px 6px rgb(255,255,255), 0px 0px 6px rgb(200,100,200), 0px 0px 8px rgb(200,100,200), 0px 0px 10px rgb(200,100,200), 0px 0px 15px rgb(200,100,200);">`,
            outcomeOrange: "<div style=\"display: block; width: 100%; height: 20px; line-height: 20px; text-align: center; font-weight: bold;\"><span style=\"color: orange; display: block; width: 100%;  font-size: 22px; font-family: 'Bodoni SvtyTwo ITC TT';\">",
            outcomeWhite: `<div style="display: block; width: 100%; height: 20px; line-height: 20px; text-align: center; font-weight: bold;"><span style="color: ${C.COLORS.white}; display: block; width: 100%;  font-size: 22px; font-family: 'Bodoni SvtyTwo ITC TT';">`,
            outcomeWhiteSmall: `<div style="display: block; margin-top: 5px; width: 100%; height: 14px; line-height: 14px; text-align: center; font-weight: bold;"><span style="color: ${C.COLORS.white}; display: block; width: 100%;  font-size: 14px; font-family: 'Bodoni SvtyTwo ITC TT';">`,
            subOutcomeRed: `<div style="display: block; width: 100%; height: 10px; line-height: 10px; text-align: center; font-weight: bold;"><span style="color: ${C.COLORS.brightred}; display: block; width: 100%;  font-size: 12px; font-family: 'Bodoni SvtyTwo ITC TT';">`,
            subOutcomeOrange: "<div style=\"display: block; width: 100%; height: 20px; line-height: 20px; text-align: center; font-weight: bold;\"><span style=\"color: orange; display: block; width: 100%;  font-size: 12px; font-family: 'Bodoni SvtyTwo ITC TT';\">",
            subOutcomeWhite: `<div style="display: block; width: 100%; height: 10px; line-height: 10px; text-align: center; font-weight: bold;"><span style="color: ${C.COLORS.white}; display: block; width: 100%;  font-size: 12px; font-family: 'Bodoni SvtyTwo ITC TT';">`,
            resultDice: { // ♦◊
                colStart: "<div style=\"display: inline-block ; width: XXXpx ; height: auto; margin-bottom: 5px\">",
                lineStart: `<div style="display: block ; width: 100% ; height: 24px ; line-height: 20px ; text-align: center ; font-weight: bold ; text-shadow: 0px 0px 2px ${C.COLORS.white} , 0px 0px 2px ${C.COLORS.white} , 0px 0px 2px ${C.COLORS.white} , 0px 0px 2px ${C.COLORS.white} ; ">`,
                lineBreak: `</div><div style="display: block ; width: 100% ; height: 24px ; margin-top: -10px; line-height: 20px ; text-align: center ; font-weight: bold ; text-shadow: 0px 0px 2px ${C.COLORS.white} , 0px 0px 2px ${C.COLORS.white} , 0px 0px 2px ${C.COLORS.white} , 0px 0px 2px ${C.COLORS.white} ; ">`,
                BcL: `<span style="margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: ${C.COLORS.white}; display: inline-block; font-size: 18px; font-family: 'Arial';">♦</span><span style="width: 10px; text-align: center; height: 20px; vertical-align: middle; color: ${C.COLORS.white}; display: inline-block; font-size: 16px; font-family: 'Arial'; margin-left: -5px; text-shadow: none; ">+</span>`,
                BcR: `<span style="width: 10px; text-align: center; height: 20px; vertical-align: middle; color: ${C.COLORS.white}; display: inline-block; font-size: 16px; font-family: 'Arial'; margin-left: -5px; margin-right: -3px; text-shadow: none; ">+</span><span style="margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: ${C.COLORS.white}; display: inline-block; font-size: 18px; font-family: 'Arial';">♦</span>`,
                HcL: `<span style="margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: ${C.COLORS.brightred}; display: inline-block; font-size: 18px; font-family: 'Arial';">♦</span><span style="width: 10px; text-align: center; height: 20px; vertical-align: middle; color: ${C.COLORS.brightred}; display: inline-block; font-size: 16px; font-family: 'Arial'; margin-left: -5px; text-shadow: none; ">+</span>`,
                HcR: `<span style="width: 10px; text-align: center; height: 20px; vertical-align: middle; color: ${C.COLORS.brightred}; display: inline-block; font-size: 16px; font-family: 'Arial'; margin-left: -5px; margin-right: -3px; text-shadow: none; ">+</span><span style="margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: ${C.COLORS.brightred}; display: inline-block; font-size: 18px; font-family: 'Arial';">♦</span>`,
                Bc: `<span style="margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: ${C.COLORS.white}; display: inline-block; font-size: 18px; font-family: 'Arial';">♦</span>`,
                Hc: `<span style="margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: ${C.COLORS.brightred}; display: inline-block; font-size: 18px; font-family: 'Arial';">♦</span>`,
                Bs: `<span style="margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle; color: ${C.COLORS.white}; display: inline-block; font-size: 18px; font-family: 'Arial';">■</span>`,
                Hs: `<span style="margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle;color: ${C.COLORS.brightred}; display: inline-block; font-size: 18px; font-family: 'Arial';">■</span>`,
                Bf: `<span style="margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle;color: ${C.COLORS.white}; display: inline-block; font-size: 18px; font-family: 'Arial'; text-shadow: none;">■</span><span style="margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle;color: ${C.COLORS.black}; display: inline-block; margin-left: -12px; font-size: 18px; font-family: 'Arial'; margin-bottom: -4px; text-shadow: none;">×</span>`,
                Hf: `<span style="margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle;color: ${C.COLORS.brightred}; display: inline-block; font-size: 18px; font-family: 'Arial'; text-shadow: none;">■</span><span style="margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle;color: ${C.COLORS.black}; display: inline-block; margin-left: -12px; font-size: 18px; font-family: 'Arial'; margin-bottom: -4px; text-shadow: none;">×</span>`,
                Hb: `<span style="margin-right: 2px; width: 10px; text-align: center; color: ${C.COLORS.black}; height: 24px; vertical-align: middle; display: inline-block; font-size: 18px; font-family: 'Arial'; text-shadow: 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}; line-height: 22px;">♠</span>`,
                HcRb: `<span style="width: 10px; text-align: center; height: 20px; vertical-align: middle; color: ${C.COLORS.white}; display: inline-block; font-size: 16px; font-family: 'Arial'; margin-left: -5px; margin-right: -3px; text-shadow: none; ">+</span><span style="margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: ${C.COLORS.brightred}; display: inline-block; font-size: 18px; font-family: 'Arial';">♦</span>`,
                HcLb: `<span style="margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: ${C.COLORS.brightred}; display: inline-block; font-size: 18px; font-family: 'Arial';">♦</span><span style="width: 10px; text-align: center; height: 20px; vertical-align: middle; color: ${C.COLORS.white}; display: inline-block; font-size: 16px; font-family: 'Arial'; margin-left: -5px; text-shadow: none; ">+</span>`,
                BXc: `<span style="margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: ${C.COLORS.white}; display: inline-block; font-size: 18px; font-family: 'Arial';">♦</span>`,
                HXc: `<span style="margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: ${C.COLORS.brightred}; display: inline-block; font-size: 18px; font-family: 'Arial';">♦</span>`,
                BXs: `<span style="margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle; color: ${C.COLORS.white}; display: inline-block; font-size: 18px; font-family: 'Arial';">■</span>`,
                HXs: `<span style="margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle;color: ${C.COLORS.brightred}; display: inline-block; font-size: 18px; font-family: 'Arial';">□</span>`,
                HXb: `<span style="margin-right: 2px; width: 10px; text-align: center; color: ${C.COLORS.black}; height: 24px; vertical-align: middle; display: inline-block; font-size: 18px; font-family: 'Arial'; text-shadow: 0px 0px 2px ${C.COLORS.darkred}, 0px 0px 2px ${C.COLORS.darkred}, 0px 0px 2px ${C.COLORS.darkred}, 0px 0px 2px ${C.COLORS.darkred}, 0px 0px 2px ${C.COLORS.darkred}, 0px 0px 2px ${C.COLORS.darkred}, 0px 0px 2px ${C.COLORS.darkred}, 0px 0px 2px ${C.COLORS.darkred}, 0px 0px 2px ${C.COLORS.darkred}, 0px 0px 2px ${C.COLORS.darkred}, 0px 0px 2px ${C.COLORS.darkred}, 0px 0px 2px ${C.COLORS.darkred}; line-height: 22px;">♠</span>`,
                HCb: `<span style="margin-right: 2px; width: 10px; text-align: center; color: ${C.COLORS.darkred}; height: 24px; vertical-align: middle; display: inline-block; font-size: 18px; font-family: 'Arial'; text-shadow: 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}, 0px 0px 2px ${C.COLORS.brightred}; line-height: 22px;">♠</span>`,
                Of: `<span style="margin-right: 2px; width: 10px; text-align: center; color: ${C.COLORS.darkred}; height: 24px; vertical-align: middle; display: inline-block; font-size: 18px; font-family: 'Arial'; line-height: 22px; text-shadow: 0px 0px 2px rgb(255,255,255), 0px 0px 2px rgb(255,255,255), 0px 0px 2px rgb(255,255,255), 0px 0px 2px rgb(255,255,255), 0px 0px 2px rgb(255,255,255), 0px 0px 4px rgb(255,255,255), 0px 0px 4px rgb(255,255,255), 0px 0px 6px rgb(255,255,255), 0px 0px 6px rgb(200,100,200), 0px 0px 8px rgb(200,100,200), 0px 0px 10px rgb(200,100,200), 0px 0px 15px rgb(200,100,200);">●</span>`,
                Os: `<span style="margin-right: 2px; width: 10px; text-align: center; color: ${C.COLORS.black}; height: 24px; vertical-align: middle; display: inline-block; font-size: 18px; font-family: 'Arial'; text-shadow: 0px 0px 2px rgb(255,255,255), 0px 0px 2px rgb(255,255,255), 0px 0px 2px rgb(255,255,255), 0px 0px 2px rgb(255,255,255), 0px 0px 2px rgb(255,255,255), 0px 0px 4px rgb(255,255,255), 0px 0px 4px rgb(255,255,255), 0px 0px 6px rgb(255,255,255), 0px 0px 6px rgb(200,100,200), 0px 0px 8px rgb(200,100,200), 0px 0px 10px rgb(200,100,200), 0px 0px 15px rgb(200,100,200); line-height: 22px;">●</span>`,
                g: `<span style="margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle; color: ${C.COLORS.darkgrey}; display: inline-block; font-size: 18px; font-family: 'Arial';">♦</span>`
            }
        },
    // #endregion

    // #region Getting Information & Setting State Roll Record
        parseFlags = (charObj, rollType, params = {}, rollFlags) => {
            params.args = params.args || []
            const flagData = {
                    negFlagLines: [],
                    posFlagLines: [],
                    redFlagLines: [],
                    goldFlagLines: [],
                    flagDiceMod: 0
                },
                traitList = _.compact(
                    _.map((params && params.args && params.args[1] || _.isArray(params) && params[0] || _.isString(params) && params || "").split(","), v => v.replace(/:\d+/gu, "").replace(/_/gu, " "))
                ),
                bloodPot = D.Int(getAttrByName(charObj.id, "blood_potency")),
                charID = D.GetPlayer(charObj) ? Char.REGISTRY[_.findKey(Char.REGISTRY, v => v.playerID === D.GetPlayer(charObj).id)].id : charObj.id
            if (["rouse", "rouse2", "remorse", "check", "project", "secret", "humanity"].includes(rollType))
                return flagData
            if (D.Int(getAttrByName(charID, "applyspecialty")) > 0)
                flagData.posFlagLines.push([1, "Specialty (<.>)"])
            if (D.Int(getAttrByName(charID, "applyresonance")) > 0)
                flagData.posFlagLines.push([1, "Resonance (<.>)"])
            if (D.Int(getAttrByName(charID, "applybloodsurge")) > 0)
                flagData.posFlagLines.push([C.BLOODPOTENCY[bloodPot].bp_surge, "Blood Surge (<.>)"])
            if (rollFlags.isDiscRoll)
                flagData.posFlagLines.push([C.BLOODPOTENCY[bloodPot].bp_discbonus, "Discipline (<.>)"])

            const flagDefs = {posMods: "posFlagLines", negMods: "negFlagLines", goldMods: "goldFlagLines", redMods: "redFlagLines"}
            for (const [type, data] of Object.entries(STATE.REF.forcedMods))
                if (data.length)
                    flagData[flagDefs[type]].push(...data)

            _.each(_.compact(_.flatten([
                getAttrByName(charObj.id, "incap") ? getAttrByName(charObj.id, "incap").split(",") : [],
                params.args.length > 3 ? params.args[4].split(",") : "",
                params.args.length > 4 ? params.args[5].split(",") : ""
            ])), flag => {
                if (flag === "Health" && _.intersection(traitList, _.map(_.flatten([C.ATTRIBUTES.physical, C.SKILLS.physical]), v => v.toLowerCase())).length)
                    flagData.negFlagLines.push([-2, "Injured (<.>)"])
                else if (flag === "Willpower" && _.intersection(traitList, _.map(_.flatten([C.ATTRIBUTES.mental, C.ATTRIBUTES.social, C.SKILLS.mental, C.SKILLS.social]), v => v.toLowerCase())).length)
                    flagData.negFlagLines.push([-2, "Exhausted (<.>)"])
                else if (flag === "Humanity")
                    flagData.negFlagLines.push([-2, "Inhuman (<.>)"])
            })

            if (flagData.posFlagLines.length || flagData.negFlagLines.length || flagData.redFlagLines.length || flagData.goldFlagLines.length) {
                const zippedPos = _.compact([...flagData.posFlagLines, ...flagData.goldFlagLines]),
                    unzippedPos = _.unzip(zippedPos),
                    reducedPos = _.reduce(unzippedPos[0], (sum, mod) => sum + mod, 0),
                    zippedNeg = _.compact([...flagData.negFlagLines, ...flagData.redFlagLines]),
                    unzippedNeg = _.unzip(zippedNeg),
                    reducedNeg = _.reduce(unzippedNeg[0], (sum, mod) => sum + mod, 0)
                
                flagData.posFlagMod = reducedPos
                flagData.negFlagMod = reducedNeg
                flagData.flagDiceMod = reducedPos + reducedNeg
            }

            return flagData
        },
        parseTraits = (charObj, rollType, params = {}) => {
            let traits = _.compact((params && params.args && params.args[1] || _.isArray(params) && params[0] || _.isString(params) && params || "").split(","))
            
            const tFull = {
                traitList: [],
                traitData: {}
            }
            switch (rollType) {
                case "frenzy":
                    traits = ["willpower", "humanity"]
                    break
                case "humanity":
                case "remorse":
                    traits = ["humanity"]
                    break
                case "willpower":
                    traits = ["willpower"]
                    break
                default:
                    break
            }
            tFull.traitList = traits.map(v => v.replace(/:\d+/gu, ""))
            _.each(traits, trt => {
                if (trt.includes(":")) {
                    const tData = trt.split(":")
                    tFull.traitData[tData[0]] = {
                        display: D.Capitalize(tData[0].replace(/_/gu, " "), true),
                        value: D.Int(tData[1])
                    }
                    if (rollType === "frenzy" && tData[0] === "humanity") {
                        tFull.traitData.humanity.display = "⅓ Humanity"
                        tFull.traitData.humanity.value = Math.floor(tFull.traitData.humanity.value / 3)
                    } else if (rollType === "remorse" && tData[0] === "stains") {
                        tFull.traitData.humanity.display = "Human Potential"
                        tFull.traitData.humanity.value = 10 - tFull.traitData.humanity.value - D.Int(tData[1])
                        tFull.traitList = _.without(tFull.traitList, "stains")
                        delete tFull.traitData[tData[0]]
                    }
                } else if (D.Int(trt) || trt === "0") {
                    tFull.mod = D.Int(trt)
                    tFull.traitList = _.without(tFull.traitList, trt)
                } else {
                    tFull.traitData[trt] = {
                        display: D.IsIn(trt, undefined, true) || D.IsIn(trt.replace(/_/gu, " "), undefined, true) || getAttrByName(charObj.id, `${trt}_name`) || getAttrByName(charObj.id, `${trt.replace(/_/gu, " ")}_name`),
                        value: D.Int(getAttrByName(charObj.id, trt) || getAttrByName(charObj.id, trt.replace(/_/gu, " ")))
                    }
                    if (rollType === "frenzy" && trt === "humanity") {
                        tFull.traitData.humanity.display = "⅓ Humanity"
                        tFull.traitData.humanity.value = Math.floor(tFull.traitData.humanity.value / 3)
                    } else if (rollType === "remorse" && trt === "humanity") {
                        tFull.traitData.humanity.display = "Human Potential"
                        tFull.traitData.humanity.value = 10 -
                            tFull.traitData.humanity.value -
                            D.Int(getAttrByName(charObj.id, "stains"))
                    } else if (!tFull.traitData[trt].display) {
                        D.Chat(charObj, `Error determining NAME of trait '${D.JS(trt)}'.`, "ERROR: Dice Roller")
                    }
                }
            })
            // D.Alert(D.JS(tFull))

            return tFull
        },
        getRollData = (charObj, rollType, params, rollFlags) => {
            /* EXAMPLE RESULTS:
              {
                charID: "-LN4P73XRfqCcI8U6c-t",
                type: "project",
                hunger: 0,
                posFlagLines: [],
                negFlagLines: [],
                redFlagLines: [],
                goldFlagLines: [],
                dicePool: 0,
                traits: ["Politics", "Resources"],
                traitData: {
                        Politics: {
                            display: "Politics",
                        value: 5
                    },
                    Resources: {
                        display: "Resources",
                        value: 5
                    }
                },
                diffMod: 1,
                prefix: "repeating_project_-LQSF9eezKZpUhKBodBR_",
                charName: "Kingston \"King\" Black",
                mod: 0,
                diff: 3
              } */
            
            const flagData = parseFlags(charObj, rollType, params, rollFlags),
                traitData = parseTraits(charObj, rollType, params),
                rollData = {
                    charID: charObj.id,
                    type: rollType,
                    hunger: D.Int(getAttrByName(charObj.id, "hunger")),
                    posFlagLines: flagData.posFlagLines,
                    negFlagLines: flagData.negFlagLines,
                    redFlagLines: flagData.redFlagLines,
                    goldFlagLines: flagData.goldFlagLines,
                    dicePool: flagData.flagDiceMod,
                    traits: traitData.traitList,
                    traitData: traitData.traitData,
                    posFlagMod: flagData.posFlagMod || 0,
                    negFlagMod: flagData.negFlagMod || 0,
                    diffMod: 0,
                    prefix: "",
                    diff: null,
                    mod: null,
                    appliedRollEffects: [],                
                    isNPCRoll: rollFlags && rollFlags.isNPCRoll,
                    isOblivionRoll: rollFlags && rollFlags.isOblivionRoll,
                    isDiscRoll: rollFlags && rollFlags.isDiscRoll,
                    rollFlags
                }
            
            rollData.isOblivionRoll = rollFlags && rollFlags.isOblivionRoll
            
            rollData.charName = D.GetName(charObj)
            switch (rollType) {
                case "remorse":
                    rollData.diff = 0
                    rollData.mod = 0
                    break
                case "project":
                    [rollData.diff, rollData.mod, rollData.diffMod] = params.slice(0,3).map(x => D.Int(x))
                    rollData.prefix = ["repeating", "project", D.GetRepStat(charObj, "project", params[4]).rowID, ""].join("_")
                    STATE.REF.lastProjectPrefix = rollData.prefix
                    STATE.REF.lastProjectCharID = rollData.charID
                    
                    break
                case "secret":
                    rollData.diff = 0
                    rollData.mod = _.isNumber(traitData.mod) ? traitData.mod : 0
                    break
                case "frenzy":
                    [rollData.diff, rollData.mod] = params.slice(0,2).map(x => D.Int(x))
                    break
                default:
                    if (D.GetPlayer(charObj)) {
                        rollData.diff = rollData.diff === null ? D.Int(getAttrByName(Char.REGISTRY[_.findKey(Char.REGISTRY, v => v.playerID === D.GetPlayer(charObj).id)].id, "rolldiff")) : rollData.diff
                        rollData.mod = rollData.mod === null ? D.Int(getAttrByName(Char.REGISTRY[_.findKey(Char.REGISTRY, v => v.playerID === D.GetPlayer(charObj).id)].id, "rollmod")) : rollData.diff
                    } else {
                        rollData.diff = rollData.diff === null ? D.Int(getAttrByName(charObj.id, "rolldiff")) : rollData.diff
                        rollData.mod = rollData.mod === null ? D.Int(getAttrByName(charObj.id, "rollmod")) : rollData.mod
                    }
                    break
            }

            if (["remorse", "project", "humanity", "frenzy", "willpower", "check", "rouse", "rouse2"].includes(rollType))
                rollData.hunger = 0

            

            return rollData
        },
        getCurrentRoll = (isNPCRoll) => (isNPCRoll ? STATE.REF.NPC : STATE.REF).rollRecord[(isNPCRoll ? STATE.REF.NPC : STATE.REF).rollIndex],
        setCurrentRoll = (rollIndex, isNPCRoll, isDisplayOnly = false) => {
            const rollRef = isNPCRoll ? STATE.REF.NPC : STATE.REF
            rollRef.rollIndex = rollIndex
            if (isDisplayOnly)
                rollRef.rollRecord[rollIndex].rollData.notChangingStats = true
        },
        replaceRoll = (rollData, rollResults, rollIndex) => {
            const recordRef = rollResults.isNPCRoll ? STATE.REF.NPC : STATE.REF
            recordRef.rollIndex = rollIndex || recordRef.rollIndex
            recordRef.rollRecord[recordRef.rollIndex] = {
                rollData: _.clone(rollData),
                rollResults: _.clone(rollResults)
            }
        },
        recordRoll = (rollData, rollResults) => {
            const recordRef = rollResults.isNPCRoll ? STATE.REF.NPC : STATE.REF
            // Make sure appliedRollEffects in both rollData and rollResults contains all of the applied effects:
            rollData.appliedRollEffects = _.uniq([...rollData.appliedRollEffects, ...rollResults.appliedRollEffects])
            rollResults.appliedRollEffects = [...rollData.appliedRollEffects]
            recordRef.rollRecord.unshift({
                rollData: _.clone(rollData),
                rollResults: _.clone(rollResults)
            })
            recordRef.rollIndex = 0
            
            if (recordRef.rollRecord.length > 10)
                recordRef.rollRecord.pop()
        },
    // #endregion

    // #region Rolling Dice & Formatting Result
        buildDicePool = rollData => {
        /* MUST SUPPLY:
				  For Rouse & Checks:    rollData = { type }
				  For All Others:        rollData = { type, mod, << traits: [],
																traitData: { value, display }, hunger >> } */
        /* EXAMPLE RESULTS:
				{
				  charID: "-LN4P73XRfqCcI8U6c-t",
				  type: "project",
				  hunger: 0,
				  posFlagLines: [],
				  negFlagLines: [],
				  dicePool: 10,
				  traits: ["Politics", "Resources"],
				  traitData: {
					  Politics: {
						  display: "Politics",
						  value: 5
				  	  },
					  Resources: {
						  display: "Resources",
						  value: 5
					  }
				  },
				  diffMod: 1,
				  prefix: "repeating_project_-LQSF9eezKZpUhKBodBR_",
				  charName: "Kingston \"King\" Black",
				  mod: 0,
				  diff: 3,
				  basePool: 10,
				  hungerPool: 0
				} */
            rollData.hunger = rollData.hunger || 0
            rollData.basePool = 0
            rollData.hungerPool = 0
            rollData.dicePool = rollData.dicePool || 0
            switch (rollData.type) {
                case "rouse2":
                    rollData.dicePool++
                    rollData.hungerPool++
            /* falls through */
                case "rouse":
                    rollData.hungerPool++
                    rollData.basePool--
            /* falls through */
                case "check":
                    rollData.dicePool++
                    rollData.basePool++

                    return rollData
                default:
                    _.each(_.values(rollData.traitData), v => {
                        rollData.dicePool += D.Int(v.value)
                    })
                    rollData.dicePool += D.Int(rollData.mod)
                    break
            }
            if (rollData.traits.length === 0 && rollData.dicePool <= 0) {
                D.Chat(D.GetChar(rollData.charID), "You have no dice to roll!", "ERROR: Dice Roller")

                return false
            }
            rollData.hungerPool = Math.min(rollData.hunger, Math.max(1, rollData.dicePool))
            rollData.basePool = Math.max(1, rollData.dicePool) - rollData.hungerPool
            
            return rollData
        },
        rollDice = (rollData, addVals) => {
            /* MUST SUPPLY:
                rollData = { type, diff, basePool, hungerPool, << diffmod >> }
                  OR
                rollData = { type, diff, rerollAmt }  */
            /* EXAMPLE RESULTS:
              {
                total: 10,
                critPairs: { bb: 1, hb: 0, hh: 0 },
                B: { crits: 0, succs: 6, fails: 2 },
                H: { crits: 0, succs: 0, fails: 0, botches: 0 },
                rolls: [ "B7", "B5", "B7", "B10", "B8", "B8", "B7", "B7", "B5", "B10" ],
                diceVals: [ "BcL", "BcR", "Bs", "Bs", "Bs", "Bs", "Bs", "Bs", "Bf", "Bf" ],
                margin: 5,
                commit: 0
              } */                
            const forcedRolls = null, /* {
                B: [10, 10, 10, 8, 8, 8, 4, 4, 4, 4, 4, 4, 4],
                H: [1, 1, 1, 1]
            } */
                sortBins = [],
                roll = dType => {
                    const d10 = forcedRolls && forcedRolls[dType] && forcedRolls[dType].length ? forcedRolls[dType].shift() : randomInteger(10)
                    rollResults.rolls.push(dType + d10)
                    switch (d10) {
                        case 10:
                            rollResults[dType].crits++
                            rollResults.total++
                            break
                        case 9:
                        case 8:
                        case 7:
                        case 6:
                            rollResults[dType].succs++
                            rollResults.total++
                            break
                        case 5:
                        case 4:
                        case 3:
                        case 2:
                            rollResults[dType].fails++
                            break
                        case 1:
                            switch (dType) {
                                case "B":
                                    rollResults.B.fails++
                                    break
                                case "H":
                                    rollResults.H.botches++
                                    break
                                default:
                                    break
                            }
                            break
                        default:
                            break
                    }
                },
                rollResults = {
                    total: 0,
                    critPairs: {
                        bb: 0,
                        hb: 0,
                        hh: 0
                    },
                    B: {
                        crits: 0,
                        succs: 0,
                        fails: 0
                    },
                    H: {
                        crits: 0,
                        succs: 0,
                        fails: 0,
                        botches: 0
                    },
                    rolls: [],
                    diceVals: [],
                    appliedRollEffects: [],
                    wpCost: 1,
                    isNoWPReroll: ["rouse", "rouse2", "check", "project", "secret", "humanity", "willpower", "remorse"].includes(rollData.type)
                }

            if (rollData.rerollAmt || rollData.rerollAmt === 0)
                for (let i = 0; i < rollData.rerollAmt; i++)
                    roll("B")
            else
                _.each({
                    B: rollData.basePool,
                    H: rollData.hungerPool
                }, (v, dType) => {
                    for (let i = 0; i < D.Int(v); i++)
                        roll(dType)
                })


            _.each(addVals, val => {
                const dType = val.slice(0, 1)
                switch (val.slice(1, 3)) {
                    case "cR": case "cL": case "c": case "Xc":
                        rollResults[dType].crits++
                        rollResults.total++
                        break
                    case "s": case "Xs":
                        rollResults[dType].succs++
                        rollResults.total++
                        break
                    case "f":
                        rollResults[dType].fails++
                        break
                    case "b": case "Cb": case "Xb":
                        rollResults[dType].botches++
                        break
                    default:
                        break
                }
            })

            switch (rollData.type) {
                case "secret":
                case "trait":
                case "frenzy":
                    sortBins.push("H")
                /* falls through */
                case "remorse":
                case "humanity":
                case "willpower":
                case "project":
                    sortBins.push("B")
                    while (rollResults.B.crits + rollResults.H.crits >= 2) {
                        rollResults.commit = 0
                        while (rollResults.H.crits >= 2) {
                            rollResults.H.crits -= 2
                            rollResults.critPairs.hh++
                            rollResults.total += 2
                            rollResults.diceVals.push("HcL")
                            rollResults.diceVals.push("HcR")
                        }
                        if (rollResults.B.crits > 0 && rollResults.H.crits > 0) {
                            rollResults.B.crits--
                            rollResults.H.crits--
                            rollResults.critPairs.hb++
                            rollResults.total += 2
                            rollResults.diceVals.push("HcL")
                            rollResults.diceVals.push("BcR")
                        }
                        while (rollResults.B.crits >= 2) {
                            rollResults.B.crits -= 2
                            rollResults.critPairs.bb++
                            rollResults.total += 2
                            rollResults.diceVals.push("BcL")
                            rollResults.diceVals.push("BcR")
                        }
                    }
                    _.each(["crits", "succs", "fails", "botches"], bin => {
                        _.each(sortBins, v => {
                            for (let i = 0; i < rollResults[v][bin]; i++)
                                rollResults.diceVals.push(v + bin.slice(0, 1))
                        })
                    })
                    if (rollData.diff && rollData.diff !== 0 || rollData.diffMod > 0)
                        rollResults.margin = rollResults.total - rollData.diff
                    break
                case "rouse2":
                case "rouse":
                    if (rollData.isOblivionRoll) {
                        D.Alert(`Oblivion Roll: ${D.JS(rollResults.rolls)}`)
                        rollResults.diceVals = _.map(rollResults.rolls, rol =>
                            D.Int(rol.slice(1)) === 1 && "Of" ||
                            D.Int(rol.slice(1)) === 10 && "Os" ||
                            D.Int(rol.slice(1)) < 6 && "Hb" ||
                            "Bs")                        
                        D.Alert(`Oblivion Vals: ${D.JS(rollResults.diceVals)}`)
                    } else {
                        rollResults.diceVals = _.map(rollResults.rolls, rol => D.Int(rol.slice(1)) < 6 ? "Hb" : "Bs")
                    }
                    if (rollResults.diceVals.length > 1) {
                        // let newDiceVals = []
                        // Of Hb Os Bs
                        // if rollResults.diceVals.includes("")
                        const [res1, res2] = rollResults.diceVals
                        if (res1 === "Bs" || res2 === "Of")
                            rollResults.diceVals = [res2, res1]
                    }
                    break
                case "check":
                    rollResults.diceVals = _.map(rollResults.rolls, rol => D.Int(rol.slice(1)) < 6 ? "Hf" : "Bs")
                    break
                default:
                    break
            }
            if (!(rollResults.commit && rollResults.commit === 0)) {
                const scope = rollData.diff - rollData.diffMod - 2
                rollResults.commit = Math.max(1, scope + 1 - rollResults.margin)
            }
            
            return rollResults
        },
        displayDice = (rollData = {}, rollResults, split = 15, rollFlags = {}, isSmall = false) => {
            /* MUST SUPPLY:
             << rollData = { isReroll = true, isGMMod = true  } >>
                rollResults = { diceVals = [], total, << margin >> } */
            const dims = {
                    widthSide: 0,
                    widthMid: 0,
                    marginSide: 0
                },
                critCount = _.reduce(_.values(rollResults.critPairs), (tot, num) => tot + num, 0),
                splitAt = Math.ceil((rollResults.diceVals.length + critCount) /
                    Math.ceil((rollResults.diceVals.length + critCount) / split))
            let logLine = `${CHATSTYLES.resultBlock}${CHATSTYLES.resultCount}${rollFlags.isHidingResult ? "" : `${rollResults.total}:`}</span></div>${
                    CHATSTYLES.resultDice.colStart}${CHATSTYLES.resultDice.lineStart}`,
                counter = 0
            if (isSmall)
                logLine = CHATSTYLES.resultDice.lineStart
            if (rollData.isReroll) {
                _.each(rollResults, roll => roll)
            } else {                
                _.each(rollResults.diceVals, v => {
                    if (counter >= splitAt) {
                        dims.widthMid = Math.max(dims.widthMid, counter)
                        counter = 0
                        logLine += CHATSTYLES.resultDice.lineBreak
                        dims.marginSide += 7
                    }
                    logLine += CHATSTYLES.resultDice[v]
                    counter += v.includes("L") || v.includes("R") ? 1.5 : 1
                })
                dims.widthMid = 12 * Math.max(dims.widthMid, counter)
                dims.widthSide = (250 - dims.widthMid) / 2
                if (isSmall)
                    logLine += "</div>"
                else
                    logLine = [
                        logLine,
                        "</div></div>",
                        CHATSTYLES.margin,
                        typeof rollResults.margin === "number" ?
                            `(${rollResults.margin >= 0 ? "+" : "-"}${Math.abs(rollResults.margin)})` :
                            "",
                        "</span></div></div>"
                    ].join("").
                        replace(/XXX/gu, dims.widthMid).
                        replace(/YYY/gu, dims.widthSide).
                        replace(/ZZZ/gu, dims.marginSide)
            }
            chat("all", logLine)
        },
        displayRoll = (isLogging = true, isNPCRoll) => {
            /* MUST SUPPLY:
              [ALL]
                rollData = { type, charName, charID }
                rollResults = { total, diceVals: [] }
              [ALL Non-Checks]
                rollData = { mod, dicePool, traits: [], traitData: { value, display }, << diff >> }
                rollResults = { H: { botches }, critPairs: {hh, hb, bb}, << margin >> }
              [TRAIT ONLY]
                rollData = { posFlagLines, negFlagLines } */
            const {rollData, rollResults} = getCurrentRoll(isNPCRoll),
                rollFlags = rollData.rollFlags || {},
                deltaAttrs = {},
                [mainRollParts, mainRollLog, stRollParts, stRollLog] = [[], [], [], []],
                [posFlagLines, negFlagLines, redFlagLines, goldFlagLines] = [
                    _.union(rollData.posFlagLines || [], rollResults.posFlagLines || []),
                    _.union(rollData.negFlagLines || [], rollResults.negFlagLines || []),
                    _.union(rollData.redFlagLines || [], rollResults.redFlagLines || []),
                    _.union(rollData.goldFlagLines || [], rollResults.goldFlagLines || [])
                ],
                rollLines = {
                    rollerName: {
                        text: ""
                    },
                    mainRoll: {
                        text: ""
                    }
                },
                logLines = {
                    fullBox: CHATSTYLES.fullBox,
                    rollerName: "",
                    mainRoll: "",
                    mainRollSub: "",
                    difficulty: "",
                    resultDice: "",
                    margin: "",
                    outcome: "",
                    subOutcome: ""
                },
                stLines = {
                    fullBox: CHATSTYLES.fullBox,
                    rollerName: "",
                    mainRoll: "",
                    mainRollSub: "",
                    difficulty: "",
                    resultDice: "",
                    margin: "",
                    outcome: "",
                    subOutcome: ""
                },
                playerNPCLines = {
                    fullBox: CHATSTYLES.fullBox,
                    rollerName: "",
                    mainRoll: "",
                    mainRollSub: "",
                    difficulty: "",
                    resultDice: "",
                    margin: "",
                    outcome: "",
                    subOutcome: ""                    
                },
                p = v => rollData.prefix + v
            
            switch (rollData.type) {
                case "project": {
                    rollLines.subOutcome = {
                        text: ""
                    }
                }
                /* falls through */
                case "trait": {
                    // D.Alert(`posFlagLines.length: ${posFlagLines.length}<br>${D.JS(posFlagLines)}`)
                    if (posFlagLines.length && !rollFlags.isHidingDicePool && !rollFlags.isHidingTraits) {
                        rollLines.posMods = {
                            text: `+ ${posFlagLines.join(" + ")}`
                        }
                        if (rollFlags.isHidingTraitVals)
                            rollLines.posMods.text = rollLines.posMods.text.replace(/\(?[+-]*?[\d●~]+?\)?/gu, "")
                    }
                    if (negFlagLines.length && !(rollFlags.isHidingDicePool && rollFlags.isHidingTraits))
                        rollLines.negMods = {
                            text: `- ${negFlagLines.join(" - ")}`
                        }
                    if (redFlagLines.length)
                        rollLines.redMods = {
                            text: redFlagLines.join(", ")
                        }
                    if (goldFlagLines.length && !rollFlags.isHidingDicePool && !rollFlags.isHidingTraits) {
                        rollLines.goldMods = {
                            text: goldFlagLines.join(", ")
                        }
                        if (rollFlags.isHidingTraitVals)
                            rollLines.goldMods.text = rollLines.goldMods.text.replace(/\(?[+-]*?[\d●~]+?\)?/gu, "")
                    }
                }
                /* falls through */
                case "willpower":
                case "humanity": {
                    rollLines.margin = {
                        text: ""
                    }
                }
                /* falls through */
                case "frenzy": {
                    if (rollData.diff > 0)
                        rollLines.difficulty = {
                            text: ""
                        }
                }
                /* falls through */
                case "remorse":
                case "rouse2":
                case "rouse":
                case "check": {
                    rollLines.dicePool = {
                        text: ""
                    }
                    rollLines.resultCount = {
                        text: ""
                    }
                    rollLines.outcome = {
                        text: ""
                    }
                    rollLines.subOutcome = {
                        text: ""
                    }
                    break
                }
                default: {
                    return false
                }
            }

            for (const line of Object.keys(rollLines))
                if (getColor(rollData.type, line))
                    rollLines[line].color = getColor(rollData.type, line)

            for (const name of Object.keys(rollLines))
                switch (name) {
                    case "rollerName": {
                        const displayName = rollFlags.isHidingName ? "Someone" : rollData.charName
                        switch (rollData.type) {
                            case "remorse": {
                                rollLines.rollerName.text = `Does ${D.LCase(displayName)} feel remorse?`
                                stLines.rollerName = `${CHATSTYLES.rollerName}${rollData.charName} rolls remorse:</div>`
                                logLines.rollerName = `${CHATSTYLES.rollerName}${displayName} rolls remorse:</div>`
                                break
                            }
                            case "frenzy": {
                                rollLines.rollerName.text = `${displayName} and the Beast wrestle for control...`
                                stLines.rollerName = `${CHATSTYLES.rollerName}${rollData.charName} resists frenzy:</div>`
                                logLines.rollerName = `${CHATSTYLES.rollerName}${displayName} resists frenzy:</div>`
                                break
                            }
                            case "project": {                                
                                rollLines.rollerName.text = `${displayName} launches a Project:`
                                stLines.rollerName = `${CHATSTYLES.rollerName}${rollData.charName} launches a Project:</div>`
                                logLines.rollerName = `${CHATSTYLES.rollerName}${displayName} launches a Project:</div>`
                                break
                            }
                            case "trait":
                            case "willpower":
                            case "humanity": {
                                rollLines.rollerName.text = `${displayName} rolls:`
                                stLines.rollerName = `${CHATSTYLES.rollerName}${rollData.charName} rolls:</div>`
                                logLines.rollerName = `${CHATSTYLES.rollerName}${displayName} rolls:</div>`
                                break
                            }
                            default: {
                                rollLines.rollerName.text = `${displayName}:`
                                stLines.rollerName = `${CHATSTYLES.rollerName}${rollData.charName}:</div>`
                                logLines.rollerName = `${CHATSTYLES.rollerName}${displayName}:</div>`
                                break
                            }
                        }
                        playerNPCLines.rollerName = stLines.rollerName
                        break
                    }
                    case "mainRoll": {
                        switch (rollData.type) {
                            case "remorse": 
                            case "frenzy":
                            case "project":
                            case "trait":
                            case "willpower":
                            case "humanity": {
                                for (const trait of rollData.traits) {
                                    let dotline = "●".repeat(rollData.traitData[trait].value)
                                    switch (trait) {
                                        case "stains": {
                                            dotline = ""
                                        }
                                        /* falls through */
                                        case "humanity": {
                                            let stains = Math.max(D.Int(getAttrByName(rollData.charID, "stains")), 0),
                                                maxHumanity = 10
                                            if (rollData.type === "frenzy") {
                                                stains = Math.max(stains === 0 ? 0 : 1, Math.floor(stains / 3))
                                                maxHumanity = 4
                                            }
                                            if (rollData.type === "remorse")
                                                dotline = "◌".repeat(Math.max(maxHumanity - dotline.length - stains, 0)) + dotline + "◌".repeat(stains)
                                            else
                                                dotline += "◌".repeat(Math.max(maxHumanity - dotline.length - (stains || 0)), 0) + "‡".repeat(stains || 0)
                                            break
                                        }
                                        case "willpower": {
                                            dotline += "◌".repeat(Math.max(0, D.Int(getAttrByName(rollData.charID, "willpower_max")) - D.Int(rollData.traitData[trait].value)))
                                            break
                                        }
                                        default: {
                                            if (rollData.traitData[trait].value === 0)
                                                dotline = "~"
                                            break
                                        }
                                    }
                                    if (trait !== "stains") {
                                        if (rollFlags.isHidingTraitVals) {
                                            mainRollParts.push(`${rollData.traitData[trait].display}`)
                                            mainRollLog.push(`${rollData.traitData[trait].display}`)
                                        } else {
                                            mainRollParts.push(`${rollData.traitData[trait].display} (${dotline})`)
                                            mainRollLog.push(`${rollData.traitData[trait].display} (${rollData.traitData[trait].value})`)
                                        }
                                        stRollParts.push(`${rollData.traitData[trait].display} (${dotline})`)
                                        stRollLog.push(`${rollData.traitData[trait].display} (${rollData.traitData[trait].value})`)
                                    }
                                }
                                if (rollFlags.isHidingTraits) {
                                    rollLines.mainRoll.text = rollFlags.isHidingDicePool ? "Some Dice" : `${rollData.dicePool + -1 * (rollData.negFlagMod || 0)} Dice`
                                    logLines.mainRoll = CHATSTYLES.mainRoll + rollFlags.isHidingDicePool ? "Some Dice" : `${rollData.dicePool + -1 * (rollData.negFlagMod || 0)} Dice`
                                } else {
                                    rollLines.mainRoll.text = mainRollParts.join(" + ")
                                    logLines.mainRoll = CHATSTYLES.mainRoll + mainRollLog.join(" + ")
                                }
                                stLines.mainRoll = CHATSTYLES.mainRoll + stRollLog.join(" + ")
                                playerNPCLines.mainRoll = CHATSTYLES.mainRoll + stRollLog.join(" + ").replace(/\s\(\d*\)/gu, "")
                                if (rollData.mod && rollData.mod !== 0)
                                    if (rollData.traits.length === 0 && rollData.mod > 0) {
                                        rollLines.mainRoll.text = `${rollFlags.isHidingDicePool ? "Some" : rollData.mod} Dice`
                                        logLines.mainRoll = `${CHATSTYLES.mainRoll + (rollFlags.isHidingDicePool ? "Some" : rollData.mod)} Dice`
                                        stLines.mainRoll = `${CHATSTYLES.mainRoll + rollData.mod} Dice`
                                        playerNPCLines.mainRoll = `${CHATSTYLES.mainRoll + (rollFlags.isHidingDicePool ? "Some" : rollData.mod)} Dice`
                                    } else {
                                        logLines.mainRoll += rollFlags.isHidingTraits || rollFlags.isHidingDicePool ? "" : (rollData.mod < 0 ? " - " : " + ") + Math.abs(rollData.mod)
                                        rollLines.mainRoll.text += rollFlags.isHidingTraits || rollFlags.isHidingDicePool ? "" : (rollData.mod < 0 ? " - " : " + ") + Math.abs(rollData.mod)
                                        stLines.mainRoll += rollData.mod < 0 ? " - " : ` + ${ Math.abs(rollData.mod)}`
                                    }
                                if (rollData.type === "project")
                                    deltaAttrs[p("projectlaunchresultsummary")] = logLines.mainRoll
                                if (rollData.dicePool <= 0) {
                                    rollData.dicePool = 1
                                    if (!rollFlags.isHidingTraits && !rollFlags.isHidingDicePool) {
                                        logLines.mainRollSub = `${CHATSTYLES.mainRollSub}(One Die Minimum)</span>`
                                        rollLines.mainRoll.text += " (One Die Minimum)"
                                    }
                                    stLines.mainRollSub = `${CHATSTYLES.mainRollSub}(One Die Minimum)</span>`
                                    playerNPCLines.mainRollSub = `${CHATSTYLES.mainRollSub}(One Die Minimum)</span>`
                                }
                                break
                            }
                            case "rouse2": {
                                rollLines.mainRoll.text = " (Best of Two)"
                                logLines.mainRollSub = `${CHATSTYLES.mainRollSub}(Best of Two)</span>`
                                stLines.mainRollSub = logLines.mainRollSub
                                playerNPCLines.mainRollSub = logLines.mainRollSub
                            }
                            /* falls through */
                            case "rouse": {
                                logLines.mainRoll = `${CHATSTYLES.check}${rollData.isOblivionRoll ? "Oblivion " : ""}Rouse Check`
                                stLines.mainRoll = logLines.mainRoll
                                playerNPCLines.mainRoll = logLines.mainRoll
                                rollLines.mainRoll.text = `${rollData.isOblivionRoll ? "Oblivion " : ""}Rouse Check${rollLines.mainRoll.text}`
                                break
                            }
                            case "check": {
                                logLines.mainRoll = `${CHATSTYLES.check}Simple Check`
                                stLines.mainRoll = logLines.mainRoll
                                playerNPCLines.mainRoll = logLines.mainRoll
                                rollLines.mainRoll.text = "Simple Check"
                                break
                            }
                            // no default
                        }
                        break
                    }
                    case "dicePool": {
                        if (rollFlags.isHidingDicePool)
                            delete rollLines.dicePool
                        else
                            rollLines.dicePool.text = JSON.stringify(rollData.dicePool)
                        break
                    }
                    case "difficulty": {
                        if (rollData.diff || rollData.diffMod) {
                            stLines.difficulty = ` vs. ${rollData.diff}`
                            playerNPCLines.difficulty = stLines.difficulty
                            if (rollData.type === "project")
                                deltaAttrs[p("projectlaunchresultsummary")] += ` vs. Difficulty ${rollData.diff}`
                            if (rollFlags.isNPCRoll || rollFlags.isHidingDifficulty) {
                                Media.ToggleImg("RollerFrame_Diff", false)
                                delete rollLines.difficulty                             
                            } else {
                                Media.ToggleImg("RollerFrame_Diff", true)
                                rollLines.difficulty = {
                                    text: rollData.diff.toString()
                                }
                                logLines.difficulty = stLines.difficulty
                            }
                        }
                        break
                    }
                    case "resultCount": {
                        if (rollFlags.isHidingResult)
                            delete rollLines.resultCount
                        else
                            rollLines.resultCount.text = JSON.stringify(rollResults.total)
                        break
                    }
                    case "margin": {
                        if (rollResults.margin) {
                            stLines.margin = ` (${
                                rollResults.margin > 0 && "+" ||
                                    rollResults.margin === 0 && "" ||
                                    "-"}${
                                Math.abs(rollResults.margin)})${logLines.margin
                            }`
                            playerNPCLines.margin = logLines.margin
                            if (rollFlags.isHidingDifficulty || rollFlags.isHidingResult) {
                                delete rollLines.margin
                            } else {
                                rollLines.margin = {
                                    text: `${
                                        rollResults.margin > 0 && "+" ||
                                        rollResults.margin === 0 && "" ||
                                        "-"
                                    }${Math.abs(rollResults.margin)}`,
                                    color: getColor(rollData.type, "margin", rollResults.margin >= 0 ? "good" : "bad")
                                }
                                logLines.margin = stLines.margin
                            }
                        }
                        break
                    }
                    case "outcome": {
                        switch (rollData.type) {
                            case "project": {
                                if (rollResults.total === 0) {
                                    stLines.outcome = `${CHATSTYLES.outcomeRed}TOTAL FAILURE!</span></div>`
                                    stLines.subOutcome = `${CHATSTYLES.subOutcomeRed}Enemies Close In</span></div>`
                                    rollLines.outcome.text = "TOTAL FAILURE!"
                                    rollLines.subOutcome.text = "Your Enemies Close In..."
                                    rollLines.outcome.color = getColor(rollData.type, "outcome", "worst")
                                    rollLines.subOutcome.color = getColor(rollData.type, "subOutcome", "worst")
                                    deltaAttrs[p("projectlaunchresultsummary")] += ":   TOTAL FAIL"
                                    deltaAttrs[p("projectlaunchresults")] = "TOTAL FAIL"
                                    deltaAttrs[p("projectlaunchresultsmargin")] = "You've Angered Someone..."
                                } else if (rollResults.margin < 0) {
                                    stLines.outcome = `${CHATSTYLES.outcomeOrange}FAILURE!</span></div>`
                                    stLines.subOutcome = `${CHATSTYLES.subOutcomeOrange}+1 Difficulty to Try Again</span></div>`
                                    rollLines.outcome.text = "FAILURE!"
                                    rollLines.subOutcome.text = "+1 Difficulty to Try Again"
                                    rollLines.outcome.color = getColor(rollData.type, "outcome", "bad")
                                    rollLines.subOutcome.color = getColor(rollData.type, "subOutcome", "bad")
                                    delete deltaAttrs[p("projectlaunchresultsummary")]
                                    deltaAttrs[p("projectlaunchdiffmod")] = rollData.diffMod + 1
                                    deltaAttrs[p("projectlaunchdiff")] = rollData.diff + 1
                                } else if (rollResults.critPairs.bb > 0) {
                                    stLines.outcome = `${CHATSTYLES.outcomeWhite}CRITICAL WIN!</span></div>`
                                    stLines.subOutcome = `${CHATSTYLES.subOutcomeWhite}No Commit Needed!</span></div>`
                                    rollLines.outcome.text = "CRITICAL WIN!"
                                    rollLines.subOutcome.text = "No Commit Needed!"
                                    rollLines.outcome.color = getColor(rollData.type, "outcome", "best")
                                    rollLines.subOutcome.color = getColor(rollData.type, "subOutcome", "best")
                                    deltaAttrs[p("projectlaunchresultsummary")] += ":   CRITICAL WIN!"
                                    deltaAttrs[p("projectlaunchresults")] = "CRITICAL WIN!"
                                    deltaAttrs[p("projectlaunchresultsmargin")] = "No Stake Needed!"
                                } else {
                                    stLines.outcome = `${CHATSTYLES.outcomeWhite}SUCCESS!</span></div>`
                                    stLines.subOutcome = `${CHATSTYLES.subOutcomeWhite}Stake ${rollResults.commit} Dot${rollResults.commit > 1 ? "s" : ""}</span></div>`
                                    rollLines.outcome.text = "SUCCESS!"
                                    rollLines.subOutcome.text = `Stake ${rollResults.commit} Dot${rollResults.commit > 1 ? "s" : ""}`
                                    rollLines.outcome.color = getColor(rollData.type, "outcome", "best")
                                    rollLines.subOutcome.color = getColor(rollData.type, "subOutcome", "best")
                                    deltaAttrs[p("projecttotalstake")] = rollResults.commit
                                    deltaAttrs[p("projectlaunchresultsmargin")] = `(${rollResults.commit} Stake Required, ${rollResults.commit} to Go)`
                                    deltaAttrs[p("projectlaunchresultsummary")] += `:   ${rollResults.total} SUCCESS${rollResults.total > 1 ? "ES" : ""}!`
                                    deltaAttrs[p("projectlaunchresults")] = "SUCCESS!"
                                }
                                break
                            }
                            case "trait": {
                                if ((rollResults.total === 0 || D.Int(rollResults.margin) < 0) && rollResults.H.botches > 0) {
                                    stLines.outcome = `${CHATSTYLES.outcomeRed}BESTIAL FAILURE!</span></div>`
                                    rollLines.outcome.text = "BESTIAL FAILURE!"
                                    rollLines.outcome.color = getColor(rollData.type, "outcome", "worst")
                                    break
                                } else if (!rollResults.noMessyCrit && (!rollResults.margin || rollResults.margin >= 0) && rollResults.critPairs.hb + rollResults.critPairs.hh > 0) {
                                    rollLines.outcome.text = "MESSY CRITICAL!"
                                    stLines.outcome = `${CHATSTYLES.outcomeRed}MESSY CRITICAL!</span></div>`
                                    rollLines.outcome.color = getColor(rollData.type, "outcome", "worst")
                                    break
                                }
                            }
                            /* falls through */
                            case "willpower":
                            case "humanity": {
                                if (rollResults.total === 0) {
                                    stLines.outcome = `${CHATSTYLES.outcomeRed}TOTAL FAILURE!</span></div>`
                                    rollLines.outcome.text = "TOTAL FAILURE!"
                                    rollLines.outcome.color = getColor(rollData.type, "outcome", "worst")
                                } else if (rollResults.margin < 0) {
                                    stLines.outcome = `${CHATSTYLES.outcomeOrange}COSTLY SUCCESS?</span></div>`
                                    rollLines.outcome.text = "COSTLY SUCCESS?"
                                    rollLines.outcome.color = getColor(rollData.type, "outcome", "bad")
                                } else if (rollResults.critPairs.hh + rollResults.critPairs.bb + rollResults.critPairs.hb > 0) {
                                    stLines.outcome = `${CHATSTYLES.outcomeWhite}CRITICAL WIN!</span></div>`
                                    rollLines.outcome.text = "CRITICAL WIN!"
                                    rollLines.outcome.color = getColor(rollData.type, "outcome", "best")
                                } else {
                                    stLines.outcome = `${CHATSTYLES.outcomeWhite}SUCCESS!</span></div>`
                                    rollLines.outcome.text = "SUCCESS!"
                                    rollLines.outcome.color = getColor(rollData.type, "outcome", "good")
                                }
                                break
                            }
                            case "frenzy": {
                                if (rollResults.total === 0 || rollResults.margin < 0) {
                                    stLines.outcome = `${CHATSTYLES.outcomeRed}FRENZY!</span></div>`
                                    rollLines.outcome.text = "YOU FRENZY!"
                                    rollLines.outcome.color = getColor(rollData.type, "outcome", "worst")
                                } else if (rollResults.critPairs.bb > 0) {
                                    stLines.outcome = `${CHATSTYLES.outcomeWhite}RESISTED!</span></div>`
                                    rollLines.outcome.text = "RESISTED!"
                                    rollLines.outcome.color = getColor(rollData.type, "outcome", "best")
                                } else {
                                    stLines.outcome = `${CHATSTYLES.outcomeWhite}RESTRAINED...</span></div>`
                                    rollLines.outcome.text = "RESTRAINED..."
                                    rollLines.outcome.color = getColor(rollData.type, "outcome", "good")
                                }
                                break
                            }
                            case "remorse": {
                                deltaAttrs.stains = -1 * D.Int(getAttrByName(rollData.charID, "stains"))
                                if (rollResults.total === 0) {
                                    stLines.outcome = `${CHATSTYLES.outcomeRed}DEGENERATION</span></div>`
                                    rollLines.outcome.text = "YOUR HUMANITY FADES..."
                                    rollLines.outcome.color = getColor(rollData.type, "outcome", "bad")
                                    deltaAttrs.humanity = -1
                                } else {
                                    stLines.outcome = `${CHATSTYLES.outcomeWhite}ABSOLUTION</span></div>`
                                    rollLines.outcome.text = "YOU FIND ABSOLUTION!"
                                    rollLines.outcome.color = getColor(rollData.type, "outcome", "good")
                                }
                                break
                            }
                            case "rouse":
                            case "rouse2": {
                                if (rollResults.diceVals.length === 2 && rollResults.total > 0 && _.any(rollResults.diceVals, v => v.includes("O")) && _.any(rollResults.diceVals, v => v.includes("H"))) {
                                    stLines.outcome = `${CHATSTYLES.outcomePurple}HUMANITY or HUNGER?</span></div>`
                                    rollLines.outcome.text = "RESTRAINT AT A COST?"
                                    rollLines.subOutcome = {text: "Choose: Humanity or Hunger?"}
                                    rollLines.outcome.color = getColor(rollData.type, "outcome", "tainted")
                                    rollLines.subOutcome.color = getColor(rollData.type, "subOutcome", "tainted")
                                } else if (_.all(rollResults.diceVals, v => v.includes("O"))) {
                                    if (rollResults.total > 0) {
                                        stLines.outcome = `${CHATSTYLES.outcomePurple}RESTRAINED but TAINTED</span></div>`
                                        rollLines.outcome.text = "SMOTHERED..."
                                        rollLines.subOutcome = {text: "The Abyss drags you deeper..."}
                                        rollLines.outcome.color = getColor(rollData.type, "outcome", "grey")
                                        rollLines.subOutcome.color = getColor(rollData.type, "subOutcome", "tainted")
                                        deltaAttrs.stains = 1
                                    } else {
                                        stLines.outcome = `${CHATSTYLES.outcomePurple}ROUSED and TAINTED!</span></div>`
                                        rollLines.outcome.text = "THE HUNGRY DARK"                                        
                                        rollLines.subOutcome = {text: "The Abyss drags you deeper..."}
                                        rollLines.outcome.color = getColor(rollData.type, "outcome", "worst")
                                        rollLines.subOutcome.color = getColor(rollData.type, "subOutcome", "tainted")
                                        deltaAttrs.stains = 1
                                        Char.AdjustHunger(rollData.charID, -1)
                                    }
                                } else if (rollResults.total > 0) {
                                    stLines.outcome = `${CHATSTYLES.outcomeWhite}RESTRAINED</span></div>`
                                    rollLines.outcome.text = "RESTRAINED..."
                                    rollLines.outcome.color = getColor(rollData.type, "outcome", "good")
                                } else {
                                    stLines.outcome = `${CHATSTYLES.outcomeRed}ROUSED!</span></div>`
                                    rollLines.outcome.text = "HUNGER ROUSED!"
                                    rollLines.outcome.color = getColor(rollData.type, "outcome", "worst")
                                    Char.AdjustHunger(rollData.charID, -1)
                                }
                                break
                            }
                            case "check": {
                                if (rollResults.total > 0) {
                                    stLines.outcome = `${CHATSTYLES.outcomeWhite}PASS</span></div>`
                                    rollLines.outcome.text = "PASS"
                                    rollLines.outcome.color = getColor(rollData.type, "outcome", "good")
                                } else {
                                    stLines.outcome = `${CHATSTYLES.outcomeRed}FAIL</span></div>`
                                    rollLines.outcome.text = "FAIL"
                                    rollLines.outcome.color = getColor(rollData.type, "outcome", "worst")
                                }
                                break
                            }
                            default: {
                                THROW(`Unrecognized rollType: ${D.JSL(rollData.rollType)}`, "APPLYROLL: MID")
                                break
                            }
                        }
                        playerNPCLines.outcome = stLines.outcome
                        playerNPCLines.subOutcome = stLines.subOutcome
                        if (rollFlags.isHidingOutcome) {
                            delete rollLines.outcome
                            delete rollLines.subOutcome
                        } else {
                            logLines.outcome = stLines.outcome
                            logLines.subOutcome = stLines.subOutcome
                        }
                        break
                    }
                    // no default
                }

            if (!rollLines.difficulty || !rollData.diff && !rollData.diffMod)
                Media.ToggleImg("RollerFrame_Diff", false)
            if ((logLines.mainRoll + logLines.difficulty).replace(/<div.*?span.*?>/gu, "").length > 40)
                for (const abbv of _.keys(C.ATTRABBVS))
                    logLines.mainRoll = logLines.mainRoll.replace(new RegExp(C.ATTRABBVS[abbv], "gui"), abbv)
            if ((logLines.mainRoll + logLines.difficulty).replace(/<div.*?span.*?>/gu, "").length > 40)
                for (const abbv of _.keys(C.SKILLABBVS))
                    logLines.mainRoll = logLines.mainRoll.replace(new RegExp(C.SKILLABBVS[abbv], "gui"), abbv)
            if ((stLines.mainRoll + stLines.difficulty).replace(/<div.*?span.*?>/gu, "").length > 40)
                for (const abbv of _.keys(C.ATTRABBVS)) {
                    stLines.mainRoll = stLines.mainRoll.replace(new RegExp(C.ATTRABBVS[abbv], "gui"), abbv)
                    playerNPCLines.mainRoll = playerNPCLines.mainRoll.replace(new RegExp(C.ATTRABBVS[abbv], "gui"), abbv)
                }
            if ((stLines.mainRoll + stLines.difficulty).replace(/<div.*?span.*?>/gu, "").length > 40)
                for (const abbv of _.keys(C.SKILLABBVS)) {
                    stLines.mainRoll = stLines.mainRoll.replace(new RegExp(C.SKILLABBVS[abbv], "gui"), abbv)
                    playerNPCLines.mainRoll = playerNPCLines.mainRoll.replace(new RegExp(C.SKILLABBVS[abbv], "gui"), abbv)
                }
            logLines.mainRoll = `${logLines.mainRoll + logLines.difficulty}</span>${logLines.mainRollSub}</div>`
            stLines.mainRoll = `${stLines.mainRoll + stLines.difficulty}</span>${stLines.mainRollSub}</div>`
            playerNPCLines.mainRoll = `${playerNPCLines.mainRoll + playerNPCLines.difficulty}</span>${playerNPCLines.mainRollSub}</div>`

            logLines.resultDice = displayDice(rollData, rollResults, 13, rollFlags)
            stLines.resultDice = displayDice(rollData, rollResults, 13, {
                isHidingName: false,
                isHidingTraits: false,
                isHidingTraitVals: false,
                isHidingDicePool: false,
                isHidingDifficulty: false,
                isHidingResult: false,
                isHidingOutcome: false
            })
            playerNPCLines.resultDice = displayDice(rollData, rollResults, 13, {
                isHidingName: false,
                isHidingTraits: false,
                isHidingTraitVals: true,
                isHidingDicePool: true,
                isHidingDifficulty: false,
                isHidingResult: false,
                isHidingOutcome: false
            })

            const logString = `${logLines.fullBox}${logLines.rollerName}${logLines.mainRoll}${logLines.resultDice}${
                    rollFlags.isHidingOutcome ? "" : logLines.outcome + logLines.subOutcome
                }</div>`,
                stString = `${stLines.fullBox}${stLines.rollerName}${stLines.mainRoll}${stLines.resultDice}${stLines.outcome}${stLines.subOutcome}</div>`,
                playerNPCString = `${playerNPCLines.fullBox}${playerNPCLines.rollerName}${playerNPCLines.mainRoll}${playerNPCLines.resultDice}${playerNPCLines.outcome}${playerNPCLines.subOutcome}</div>`
            

            for (const line of SETTINGS.textKeys)
                if (rollLines[line] && rollLines[line].text) {
                    Media.SetText(line, rollLines[line].text, true)
                    Media.SetTextData(line, {color: rollLines[line].color || COLORSCHEMES.base[line]})
                } else {
                    Media.ToggleText(line, false)
                }

            const [topMidRefs, botMidRefs] = [[],[]]
            for (let i = 1; i <= SETTINGS.frame.mids.qty; i++) {
                topMidRefs.push(`RollerFrame_TopMid_${i}`)
                botMidRefs.push(`RollerFrame_BottomMid_${i}`)   
            }

            Media.Spread(
                "RollerFrame_Left",
                "RollerFrame_TopEnd",
                topMidRefs,
                SETTINGS.frame.leftBuffer + Math.max(
                    Media.GetTextWidth("mainRoll"),
                    SETTINGS.shifts.negMods.left + (Media.IsActive("negMods") && Media.GetTextWidth("negMods")) || 0
                ),
                SETTINGS.frame.mids.minSpread,
                SETTINGS.frame.mids.maxSpread
            )
            
            if (!rollResults.isNPCRoll) {
                const diceCats = ["rouse", "rouse2", "check"].includes(rollData.type) ? ["Big", "Main"] : ["Main", "Big"]
                let filteredDice = [...rollResults.diceVals]
                if (rollFlags.isHidingDicePool && rollFlags.isHidingResult)
                    filteredDice = []
                else if (rollFlags.isHidingDicePool)
                    filteredDice = rollResults.diceVals.filter(x => !["Bf", "Hb", "Hf", "BXc", "BXs", "HXc", "HXs", "HXb", "HCb"].includes(x)).map(x => x.replace(/H/gu, "B"))
                else if (rollFlags.isHidingResult)
                    filteredDice = rollResults.diceVals.map(() => "Bf")
                setDieCat(diceCats[0], filteredDice, rollData.type)
                setDieCat(diceCats[1], [])
                
                if (filteredDice.length) {             
                    Media.SetImg("RollerFrame_Left", "topBottom")
                    Media.ToggleImg("RollerFrame_BottomEnd", true)
                    Media.Spread(
                        "RollerFrame_Left",
                        "RollerFrame_BottomEnd",
                        botMidRefs,
                        SETTINGS.frame.leftBuffer + filteredDice.length * SETTINGS.dice[diceCats[0]].spread,
                        SETTINGS.frame.mids.minSpread,
                        SETTINGS.frame.mids.maxSpread
                    )
                } else {
                    Media.SetImg("RollerFrame_Left", "top")
                    for (const midRef of botMidRefs)
                        Media.ToggleImg(midRef, false)
                    Media.ToggleImg("RollerFrame_BottomEnd", false)
                }
                
                D.RunFX("bloodBolt", Media.GetTextData("resultCount"))
            }            

            for (const line of SETTINGS.textKeys)
                if (rollLines[line] && rollLines[line].text)
                    Media.SetTextData(line, {shiftTop: SETTINGS.shifts[line].top, shiftLeft: SETTINGS.shifts[line].left})
            
            if (_.values(deltaAttrs).length && !rollData.notChangingStats) {
                
                for (const attrName of _.keys(deltaAttrs))
                    if (attrName === "humanity" || attrName === "stains") {
                        Char.AdjustTrait(rollData.charID, attrName, deltaAttrs[attrName], 0, 10)
                        delete deltaAttrs[attrName]
                    }
                setAttrs(rollData.charID, deltaAttrs)
            }

            if (isLogging)
                D.Chat("all", logString, undefined, D.RandomString(3))
            if (rollFlags.isHidingResult || rollFlags.isHidingOutcome || rollFlags.isHidingDicePool || rollFlags.isHidingDifficulty) {
                D.Chat("Storyteller", stString, undefined, D.RandomString(3))
                if (VAL({object: D.GetPlayer(rollData.charID)}))
                    D.Chat(D.GetPlayer(rollData.charID), playerNPCString, undefined, D.RandomString(3))
            }

            return deltaAttrs
        },
        makeNewRoll = (charObj, rollType, params = [], rollFlags = {}) => {
            if (parseInt(getAttrByName(charObj.id, "applybloodsurge")) > 0)                
                quickRouseCheck(charObj, false, false, true)
            const rollData = buildDicePool(getRollData(charObj, rollType, params, rollFlags))
            recordRoll(rollData, rollDice(rollData, null, rollFlags))
            displayDice(rollData, rollResults)
        },
        wpReroll = (dieCat, isNPCRoll) => {
            clearInterval(rerollFX);
            [isRerollFXOn, rerollFX] = [false, null]
            const rollRecord = getCurrentRoll(isNPCRoll),
                rollData = _.clone(rollRecord.rollData),
                rolledDice = D.KeyMapObj(STATE.REF.diceVals[dieCat], null, (v, k) => { return !STATE.REF.selected[dieCat].includes(D.Int(k)) && v || false }),
                charObj = getObj("character", rollData.charID)
            
            rollData.rerollAmt = STATE.REF.selected[dieCat].length
            const rollResults = rollDice(rollData, _.compact(_.values(rolledDice)))
            rollResults.wpCost = rollRecord.rollResults.wpCost
            rollResults.wpCostAfterReroll = rollRecord.rollResults.wpCostAfterReroll

            if (charObj) {
                Char.Damage(charObj, "willpower", "spent", rollResults.wpCost)
                if (VAL({number: rollResults.wpCostAfterReroll})) {
                    if (rollResults.wpCost === 0 && rollResults.wpCostAfterReroll > 0)
                        rollResults.goldFlagLines = _.reject(rollResults.goldFlagLines, v => v.includes("Free Reroll"))
                    rollResults.wpCost = rollRecord.rollResults.wpCostAfterReroll
                    delete rollResults.wpCostAfterReroll
                }
            }

            replaceRoll(rollData, rollResults)
            displayRoll(true, isNPCRoll)
            // Media.SetText("goldMods", Media.GetTextData("goldMods").text.replace(/District Bonus \(Free Reroll\)/gu, ""))
            lockRoller(false)
            DragPads.Toggle("wpReroll", false)
        },
        lockRoller = lockToggle => { STATE.REF.isRollerLocked = lockToggle === true },
        quickRouseCheck = (charRef, isDoubleRouse = false, isOblivionRouse = false, isPublic = false) => {
            const results = isDoubleRouse ? _.sortBy([randomInteger(10), randomInteger(10)]).reverse() : [randomInteger(10)],
                deltaAttrs = {stain: undefined, hunger: false}
            let [header, body] = [
                `${isPublic ? `${D.GetName(charRef)}'s `: ""}${isDoubleRouse ? "Double " : ""}Rouse Check: ${results[0]}${isDoubleRouse ? `, ${results[1]}` : ""}`,
                ""
            ]
            if (isOblivionRouse)
                if (isDoubleRouse && (
                    results[0] === 10 && results[1] === 1 || results[0] === results[1] && [1,10].includes(results[0])
                ) || 
                    !isDoubleRouse && (
                        results[0] === 10 || results[0] === 1
                    ))
                    deltaAttrs.stain = true
                else if (isDoubleRouse && results[0] === 10 && results[1] <= 5)
                    deltaAttrs.stain = null
            if (results[0] <= 5)
                deltaAttrs.hunger = true
            if (deltaAttrs.hunger) {
                body = C.CHATHTML.Body("Hunger Roused.")
                Char.AdjustHunger(charRef, 1, false, false)
            } else if (deltaAttrs.stain !== null) {
                body = C.CHATHTML.Body("Restrained.", {color: C.COLORS.white})
            }
            if (deltaAttrs.stain === true) {
                body += C.CHATHTML.Body("The Abyss drags you deeper.", {color: C.COLORS.darkpurple, textShadow: "0px 0px 2px white, 0px 0px 2px white, 0px 0px 2px white, 0px 0px 2px white"})
                Char.AdjustTrait(charRef, "stains", 1, 0, 10, 0, null, false)
            } else if (deltaAttrs.stain === null) {
                body += C.CHATHTML.Body("Choose: Your Soul or your Beast?", {color: C.COLORS.darkpurple, textShadow: "0px 0px 2px white, 0px 0px 2px white, 0px 0px 2px white, 0px 0px 2px white"})
            } else if (isOblivionRouse) {
                body += C.CHATHTML.Body("Your humanity remains.", {color: C.COLORS.white, textShadow: `0px 0px 2px ${C.COLORS.darkpurple}, 0px 0px 2px ${C.COLORS.darkpurple}, 0px 0px 2px ${C.COLORS.darkpurple}, 0px 0px 2px ${C.COLORS.darkpurple}`})
            }
            D.Chat(isPublic && "all" || charRef, C.CHATHTML.Block([
                C.CHATHTML.Header(header),
                body].join("")))
        }
    // #endregion

    return {
        CheckInstall: checkInstall,
        Reroll: wpReroll,
        Lock: lockRoller,
        QuickRouse: quickRouseCheck
    }
})()

on("ready", () => {
    Roller.CheckInstall()
    log("Dice Roller Ready!")
})