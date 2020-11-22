void MarkStart("Char");
const Char = (() => {
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~** CLEAN DISABLE (UNCOMMENT TO DISABLE SCRIPT) ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*
    /* return {
        RegisterEventHandlers: () => false,
        CheckInstall:  () => false,
        REGISTRY: () => false,
        Damage:  () => false,
        AdjustTrait:  () => false,
        AdjustHunger:  () => false,
        DaySleep:  () => false,
        AwardXP:  () => false,
        LaunchProject:  () => false,
        SendHome:  () => false,
        SendBack:  () => false,
        PromptTraitSelect:  () => false,
        RefreshDisplays:  () => false,
        get SelectedChar() { return false },
        get SelectedTraits() { return false }
    } */
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~** START BOILERPLATE INITIALIZATION & CONFIGURATION ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~**
    // let PENDINGCHARCOMMAND
    const SCRIPTNAME = "Char";

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
        // PENDINGCHARCOMMAND = D.Clone(BLANKPENDINGCHARCOMMAND)

        STATE.REF.numCharsToValidate = STATE.REF.numCharsToValidate || 0;
        const charsToValidate = []; // D.GetChars("npc").slice(0, STATE.REF.numCharsToValidate);
        const attrNameChanges = [];
        const repAttrNameChanges = [];
        [].forEach((section) => {
            repAttrNameChanges.push(...[]);
        });
        const numAttrNameChanges = attrNameChanges.length;
        const numRepAttrNameChanges = repAttrNameChanges.length;
        const numCharsToValidate = charsToValidate.length;

        // charsToValidate.length = 0; D.Flag(`${numCharsToValidate} Chars Awaiting Validation`);

        const changeNextAttr = () => {
            if (attrNameChanges.length) {
                changeAttrName(...attrNameChanges.pop());
                D.Flag(`Attr Changed. ${attrNameChanges.length} / ${numAttrNameChanges} Remaining...`);
            } else if (repAttrNameChanges.length) {
                changeRepAttrName(...repAttrNameChanges.pop());
                D.Flag(`RepAttr Changed. ${repAttrNameChanges.length} / ${numRepAttrNameChanges} Remaining...`);
            } else if (charsToValidate.length) {
                const charObj = charsToValidate.pop();
                validateCharAttributes([charObj], true);
                STATE.REF.numCharsToValidate = charsToValidate.length;
                D.Flag(`${D.GetName(charObj)} OK! ${charsToValidate.length} / ${numCharsToValidate} Remaining...`);
            } else {
                D.Flag("ALL DONE!");
                return true;
            }
            setTimeout(() => changeNextAttr(), 3000);
            return false;
        };
        changeNextAttr();

        /* STATE.REF.registry = {
            TopLeft: {
                id: "-Lt3NYCcsMUqdijYCWEc",
                name: "Locke Ulrich",
                playerID: "-Ltvp919sIbaWTe0FbaF",
                playerName: "PixelPuzzler",
                tokenName: "Locke Ulrich",
                shortName: "Locke",
                initial: "L",
                quadrant: "TopLeft",
                docName: "L. Ulrich",
                isActive: true,
                spotlightPrompt: {
                    prompt: "Show us what happened on that fateful night years ago when you almost killed Bacchus Giovanni while acting out your duties as sheriff of Toronto.",
                    author: false,
                    id: "jdfsWveSUe",
                    isAwardingXP: false
                }
            },
            BotLeft: {
                id: "-Lt3NX_VzMz2GjiVS61h",
                name: "Dr. Arthur Roy",
                playerID: "-Ltu_6_IXWL9uhgmJpvQ",
                playerName: "banzai",
                tokenName: "Dr. Arthur Roy",
                shortName: "Roy",
                initial: "R",
                quadrant: "BotLeft",
                docName: "Dr. Roy",
                isActive: true,
                spotlightPrompt: {
                    prompt: "I want to see you actually performing a ritual; chanting, drawing pentagrams, whatever it is you do.",
                    author: "N",
                    id: "QpYqB4iIkf",
                    isAwardingXP: true
                }
            },
            BotRight: {
                id: "-Lt3NWi8bDHdWmo06gnm",
                name: "Ava Wong",
                playerID: "-Ltu_Bv374-umIX8wNhm",
                playerName: "TeatimeRationale",
                tokenName: "Ava Wong",
                shortName: "Ava",
                initial: "A",
                quadrant: "BotRight",
                docName: "A. Wong",
                isActive: true,
                spotlightPrompt: {
                    prompt: "Ava seems to consistently have a rough time of things. If it isn't possession and shadow people just squatting in your head rent free it's vomitting on Setites and being blackmailed. Ava deserves something fun, and I think just a small scene showing her enjoying herself so she doesn't literally explode could be interesting.",
                    author: "L",
                    id: "XDlsvVpxI6",
                    isAwardingXP: true
                }
            },
            MidRight: {
                id: "-Lt3NXv8ES_NsYiwvYW8",
                name: "Johannes Napier",
                playerID: "-Ltu_ABMK_SNmtU1TE4o",
                playerName: "Thaumaterge",
                tokenName: "Johannes Napier",
                shortName: "Napier",
                initial: "N",
                quadrant: "MidRight",
                docName: "Dr. Napier",
                isActive: true,
                spotlightPrompt: {
                    prompt: "An accident occurs in the middle of a very sensitive experiment--his Malkavian nature acts up once more, and the result is messy. Show us what happened, and how Napier deals with significant setbacks when they're caused by his own hand.",
                    author: "A",
                    id: "WOybCmsv7Y",
                    isAwardingXP: true
                }
            },
            TopRight: {
                id: "-LzZWGWH-yvOZB97qWq_",
                name: "Bacchus Giovanni",
                playerID: "-LzZU4s5ylON7iWLO-jK",
                playerName: "Hastur",
                tokenName: "Bacchus Giovanni",
                shortName: "Bacchus",
                initial: "B",
                quadrant: "TopRight",
                docName: "B. Giovanni",
                isActive: true,
                spotlightPrompt: {
                    prompt: "It is the early 1970's. Although Bacchus has long been separated from the old country, news has been disturbing. The Communist Brigate Rosse and the Fascist Golpe Borghese have turned to terror in order to grab attention for their causes. The Brigate Rosse are assassinating politicians while the Golpe Borghese have embarked on a campaign of bombing. Bacchus is extremely concerned with the events unfolding, as many bear a striking resemblance to Mussolini's rise to power. How does Bacchus respond?",
                    author: "R",
                    id: "WzXb9CQumP",
                    isAwardingXP: true
                }
            }
        }; */

        // delete STATE.REF.badAttrNames;
        STATE.REF.registry = STATE.REF.registry || {};
        STATE.REF.weeklyResources = STATE.REF.weeklyResources || {};
        STATE.REF.customStakes = STATE.REF.customStakes || {};
        STATE.REF.customStakes.coterie = STATE.REF.customStakes.coterie || [];
        STATE.REF.customStakes.personal
            = STATE.REF.customStakes.personal
            || D.KeyMapObj(
                STATE.REF.registry,
                (k, v) => v.initial,
                () => []
            );
        STATE.REF.projectDetails = STATE.REF.projectDetails || [];
        STATE.REF.tokenRecord = STATE.REF.tokenRecord || [];
        STATE.REF.traitSelection = STATE.REF.traitSelection || [];
        STATE.REF.tokenPowerData = STATE.REF.tokenPowerData || {all: {}};
        STATE.REF.charAlarms = STATE.REF.charAlarms || {};
        STATE.REF.badAttrNames = STATE.REF.badAttrNames || [];
        STATE.REF.badRepAttrNames = STATE.REF.badRepAttrNames || {};
        STATE.REF.allAttrObjsRefreshSecs = STATE.REF.allAttrObjsRefreshSecs || 10;

        D.GetChars("all").forEach((x) => new Character(x));

        MENUHTML.CharSelect = D.CommandMenuHTML({
            title: "Character Selection",
            rows: [
                {
                    type: "ButtonLine",
                    contents: [0, {name: "End Scene", command: "!sess scene", styles: {bgColor: C.COLORS.palegreen, color: C.COLORS.black}}, 0]
                },
                {
                    type: "ButtonLine",
                    contents: [
                        {
                            name: "All PCs",
                            command: "!reply select@registered, title@All Player Characters"
                        } /* height, lineHeight, width, fontFamily, margin, padding, fontSize, bgColor, color, border, fontWeight, textShadow, buttonHeight, buttonWidth, buttonPadding, buttonTransform */,
                        {name: "Scene PCs", command: "!reply select@scene|registered, title@Player Characters In Scene"},
                        {name: "Scene NPCs", command: "!reply select@scene|npc, title@NPCs In Scene"},
                        {name: "All Scene", command: "!reply select@scene, title@ALL In Scene"}
                    ],
                    buttonStyles: {
                        bgColor: C.COLORS.blue,
                        color: C.COLORS.black
                    }
                },
                ..._.chain(D.GetChars("registered"))
                    .map((x) => {
                        const charName = D.GetName(x, true);
                        return {
                            name: charName,
                            command: `!reply selectchar@${x.id}, title@${charName}`,
                            styles: {
                                bgColor: `~~~bgColor:${charName}~~~`,
                                color: C.COLORS.white
                            }
                        };
                    })
                    .groupBy((x, i) => Math.floor(i / 5))
                    .map((x) => ({
                        type: "ButtonLine",
                        contents: x.length <= 3 ? [0, ...x, 0] : x
                    }))
                    .value(),
                "~~~npcbuttonrows~~~"
            ]
        });
        MENUHTML.CharActionSingle = D.CommandMenuHTML({
            title: "~~~title~~~",
            rows: [
                {
                    type: "ButtonLine",
                    contents: [
                        {
                            name: "Reset Token",
                            command: "!char ~~~charIDString~~~ set token base",
                            styles: {bgColor: C.COLORS.darkgrey, color: C.COLORS.white}
                        },
                        {
                            name: "Pop Desire",
                            command: "!char ~~~charIDString~~~ set desire",
                            styles: {bgColor: C.COLORS.gold, color: C.COLORS.black}
                        },
                        {
                            name: "Send Home",
                            command: "!char ~~~charIDString~~~ send home",
                            styles: {bgColor: C.COLORS.black, color: C.COLORS.gold}
                        },
                        {
                            name: "Send Back",
                            command: "!char ~~~charIDString~~~ send back",
                            styles: {bgColor: C.COLORS.black, color: C.COLORS.gold}
                        }
                    ]
                },
                {
                    type: "ButtonLine",
                    contents: [
                        {
                            name: "Dyscrasia",
                            command: "!char ~~~charIDString~~~ set dyscrasias ?{Dyscrasia Title (blank to toggle off):}|?{Dyscrasia Text:}",
                            styles: {bgColor: C.COLORS.darkdarkred, color: C.COLORS.gold}
                        },
                        {
                            name: "Secret Roll",
                            command: "!char ~~~charIDString~~~ select trait",
                            styles: {bgColor: C.COLORS.purple, color: C.COLORS.white}
                        },
                        {
                            name: "Get Trait",
                            command: "!char ~~~charIDString~~~ get stat",
                            styles: {bgColor: C.COLORS.grey, color: C.COLORS.black}
                        },
                        {
                            name: "Compulsion",
                            command: "!char ~~~charIDString~~~ set compulsion ?{Compulsion Title (blank to toggle off):}|?{Compulsion Text:}",
                            styles: {bgColor: C.COLORS.darkdarkred, color: C.COLORS.brightred}
                        }
                    ]
                },
                {
                    type: "ButtonLine",
                    contents: [
                        {
                            name: "Resonance",
                            command: "!roll ~~~charIDString~~~ resonance",
                            styles: {bgColor: C.COLORS.black, color: C.COLORS.brightred}
                        },
                        {
                            name: "Roll As",
                            command: "!roll ~~~charIDString~~~ set pc",
                            styles: {bgColor: C.COLORS.purple, color: C.COLORS.white}
                        },
                        {
                            name: "Complic's",
                            command: "!comp ~~~charIDString~~~ start ?{Shortfall?}",
                            styles: {bgColor: C.COLORS.midgold, color: C.COLORS.black}
                        },
                        {
                            name: "Spotlight",
                            command: "!sess ~~~charIDString~~~ spotlight",
                            styles: {bgColor: C.COLORS.brightred, color: C.COLORS.black}
                        }
                    ]
                },
                {
                    type: "ButtonLine",
                    contents: [
                        {text: "Health:", styles: {width: `${Math.floor(C.CHATWIDTH * 0.16)}px`}},
                        {name: "S", command: "!char ~~~charIDString~~~ dmg health superficial", styles: {bgColor: C.COLORS.brightred}},
                        {name: "S+", command: "!char ~~~charIDString~~~ dmg health superficial+", styles: {bgColor: C.COLORS.brightred}},
                        {name: "A", command: "!char ~~~charIDString~~~ dmg health aggravated", styles: {bgColor: C.COLORS.red}},
                        {text: "&nbsp;", styles: {width: `${Math.floor(C.CHATWIDTH * 0.16)}px`}},
                        0,
                        0,
                        0
                    ],
                    styles: {textAlign: "left"}
                },
                {
                    type: "ButtonLine",
                    contents: [
                        {text: "Willpower:", styles: {width: `${Math.floor(C.CHATWIDTH * 0.16)}px`}},
                        {name: "S", command: "!char ~~~charIDString~~~ dmg willpower superficial", styles: {bgColor: C.COLORS.brightblue}},
                        {name: "S+", command: "!char ~~~charIDString~~~ dmg willpower superficial+", styles: {bgColor: C.COLORS.blue}},
                        {name: "A", command: "!char ~~~charIDString~~~ dmg willpower aggravated", styles: {bgColor: C.COLORS.darkblue}},
                        {text: "&nbsp;", styles: {width: `${Math.floor(C.CHATWIDTH * 0.16)}px`}},
                        {
                            name: "S",
                            command: "!char ~~~charIDString~~~ dmg willpower social_superficial",
                            styles: {bgColor: C.COLORS.brightpurple}
                        },
                        {
                            name: "S+",
                            command: "!char ~~~charIDString~~~ dmg willpower social_superficial+",
                            styles: {bgColor: C.COLORS.purple}
                        },
                        {
                            name: "A",
                            command: "!char ~~~charIDString~~~ dmg willpower social_aggravated",
                            styles: {bgColor: C.COLORS.darkpurple}
                        }
                    ],
                    styles: {textAlign: "left"}
                },
                {
                    type: "ButtonLine",
                    contents: [
                        {text: "Hunger:", styles: {width: `${Math.floor(C.CHATWIDTH * 0.16)}px`}},
                        {name: "+1", command: "!char ~~~charIDString~~~ change hunger 1", styles: {bgColor: C.COLORS.darkred}},
                        {name: "-1", command: "!char ~~~charIDString~~~ change hunger -1", styles: {bgColor: C.COLORS.darkred}},
                        {name: "Δ", command: "!char ~~~charIDString~~~ change hunger", styles: {bgColor: C.COLORS.red}},
                        {text: "Kill Slake:", styles: {width: `${Math.floor(C.CHATWIDTH * 0.16)}px`}},
                        {name: "-1", command: "!char ~~~charIDString~~~ change hungerkill -1", styles: {bgColor: C.COLORS.brightred}},
                        {name: "Δ", command: "!char ~~~charIDString~~~ change hungerkill", styles: {bgColor: C.COLORS.brightred}},
                        0
                    ],
                    styles: {textAlign: "left"}
                },
                {
                    type: "ButtonLine",
                    contents: [
                        {text: "XP:", styles: {width: `${Math.floor(C.CHATWIDTH * 0.16)}px`}},
                        {name: "1", command: "!char ~~~charIDString~~~ set xp 1 ?{Reason for Award?}", styles: {bgColor: C.COLORS.midgold}},
                        {name: "2", command: "!char ~~~charIDString~~~ set xp 2 ?{Reason for Award?}", styles: {bgColor: C.COLORS.midgold}},
                        {
                            name: "Δ",
                            command: "!char ~~~charIDString~~~ set xp ?{How Much XP?|3|4|5|6|7|8|9|10} ?{Reason for Award?}",
                            styles: {bgColor: C.COLORS.midgold}
                        },
                        {text: "Humanity:", styles: {width: `${Math.floor(C.CHATWIDTH * 0.16)}px`}},
                        {
                            name: "Stn",
                            command: "!char ~~~charIDString~~~ dmg stains",
                            styles: {bgColor: C.COLORS.black, color: C.COLORS.white}
                        },
                        {
                            name: "Hum",
                            command: "!char ~~~charIDString~~~ dmg humanity",
                            styles: {bgColor: C.COLORS.black, color: C.COLORS.white}
                        },
                        0
                    ],
                    styles: {textAlign: "left"}
                }
            ]
        });
        MENUHTML.CharActionGroup = D.CommandMenuHTML({
            title: "~~~title~~~",
            rows: [
                {
                    type: "ButtonLine",
                    contents: [
                        {
                            name: "Reset Token",
                            command: "!char ~~~charIDString~~~ set token base",
                            styles: {bgColor: C.COLORS.darkgrey, color: C.COLORS.white}
                        },
                        0,
                        {
                            name: "Send Home",
                            command: "!char ~~~charIDString~~~ send home",
                            styles: {bgColor: C.COLORS.black, color: C.COLORS.gold}
                        },
                        {
                            name: "Send Back",
                            command: "!char ~~~charIDString~~~ send back",
                            styles: {bgColor: C.COLORS.black, color: C.COLORS.gold}
                        }
                    ]
                },
                {
                    type: "ButtonLine",
                    contents: [
                        0,
                        {
                            name: "Secret Roll",
                            command: "!char ~~~charIDString~~~ select trait",
                            styles: {bgColor: C.COLORS.purple, color: C.COLORS.white}
                        },
                        {
                            name: "Get Trait",
                            command: "!char ~~~charIDString~~~ get stat",
                            styles: {bgColor: C.COLORS.grey, color: C.COLORS.black}
                        },
                        0
                    ]
                },
                {
                    type: "ButtonLine",
                    contents: [
                        {text: "Health:", styles: {width: `${Math.floor(C.CHATWIDTH * 0.16)}px`}},
                        {name: "S", command: "!char ~~~charIDString~~~ dmg health superficial", styles: {bgColor: C.COLORS.brightred}},
                        {name: "S+", command: "!char ~~~charIDString~~~ dmg health superficial+", styles: {bgColor: C.COLORS.brightred}},
                        {name: "A", command: "!char ~~~charIDString~~~ dmg health aggravated", styles: {bgColor: C.COLORS.red}},
                        {text: "&nbsp;", styles: {width: `${Math.floor(C.CHATWIDTH * 0.16)}px`}},
                        0,
                        0,
                        0
                    ],
                    styles: {textAlign: "left"}
                },
                {
                    type: "ButtonLine",
                    contents: [
                        {text: "Willpower:", styles: {width: `${Math.floor(C.CHATWIDTH * 0.16)}px`}},
                        {name: "S", command: "!char ~~~charIDString~~~ dmg willpower superficial", styles: {bgColor: C.COLORS.brightblue}},
                        {name: "S+", command: "!char ~~~charIDString~~~ dmg willpower superficial+", styles: {bgColor: C.COLORS.blue}},
                        {name: "A", command: "!char ~~~charIDString~~~ dmg willpower aggravated", styles: {bgColor: C.COLORS.darkblue}},
                        {text: "&nbsp;", styles: {width: `${Math.floor(C.CHATWIDTH * 0.16)}px`}},
                        {
                            name: "S",
                            command: "!char ~~~charIDString~~~ dmg willpower social_superficial",
                            styles: {bgColor: C.COLORS.brightpurple}
                        },
                        {
                            name: "S+",
                            command: "!char ~~~charIDString~~~ dmg willpower social_superficial+",
                            styles: {bgColor: C.COLORS.purple}
                        },
                        {
                            name: "A",
                            command: "!char ~~~charIDString~~~ dmg willpower social_aggravated",
                            styles: {bgColor: C.COLORS.darkpurple}
                        }
                    ],
                    styles: {textAlign: "left"}
                },
                {
                    type: "ButtonLine",
                    contents: [
                        {text: "Hunger:", styles: {width: `${Math.floor(C.CHATWIDTH * 0.16)}px`}},
                        {name: "+1", command: "!char ~~~charIDString~~~ change hunger 1", styles: {bgColor: C.COLORS.darkred}},
                        {name: "-1", command: "!char ~~~charIDString~~~ change hunger -1", styles: {bgColor: C.COLORS.darkred}},
                        {name: "Δ", command: "!char ~~~charIDString~~~ change hunger", styles: {bgColor: C.COLORS.red}},
                        {text: "Kill Slake:", styles: {width: `${Math.floor(C.CHATWIDTH * 0.16)}px`}},
                        {name: "-1", command: "!char ~~~charIDString~~~ change hungerkill -1", styles: {bgColor: C.COLORS.brightred}},
                        {name: "Δ", command: "!char ~~~charIDString~~~ change hungerkill", styles: {bgColor: C.COLORS.brightred}},
                        0
                    ],
                    styles: {textAlign: "left"}
                },
                {
                    type: "ButtonLine",
                    contents: [
                        {text: "XP:", styles: {width: `${Math.floor(C.CHATWIDTH * 0.16)}px`}},
                        {name: "1", command: "!char ~~~charIDString~~~ set xp 1 ?{Reason for Award?}", styles: {bgColor: C.COLORS.midgold}},
                        {name: "2", command: "!char ~~~charIDString~~~ set xp 2 ?{Reason for Award?}", styles: {bgColor: C.COLORS.midgold}},
                        {
                            name: "Δ",
                            command: "!char ~~~charIDString~~~ set xp ?{How Much XP?|3|4|5|6|7|8|9|10} ?{Reason for Award?}",
                            styles: {bgColor: C.COLORS.midgold}
                        },
                        {text: "Humanity:", styles: {width: `${Math.floor(C.CHATWIDTH * 0.16)}px`}},
                        {
                            name: "Stn",
                            command: "!char ~~~charIDString~~~ dmg stains",
                            styles: {bgColor: C.COLORS.black, color: C.COLORS.white}
                        },
                        {
                            name: "Hum",
                            command: "!char ~~~charIDString~~~ dmg humanity",
                            styles: {bgColor: C.COLORS.black, color: C.COLORS.white}
                        },
                        0
                    ],
                    styles: {textAlign: "left"}
                }
            ]
        });

        // STATE.REF.registry.BotLeft.spotlightPrompt.isAwardingXP = true;
        // STATE.REF.registry.BotRight.spotlightPrompt.isAwardingXP = true;
        // STATE.REF.registry.MidRight.spotlightPrompt.isAwardingXP = true;
        // STATE.REF.registry.TopRight.spotlightPrompt.isAwardingXP = true;

        // awareness/intelligence+investigation/wits+investigation;postrait:Auspex;+ Heightened Senses (<.>)
        //

        // Storyteller Override:
        // STATE.REF.registry.TopLeft.playerID = D.GetPlayerID("Storyteller")

        // Return Player Control:
        // STATE.REF.registry.TopLeft.playerID = "-LMGDQqIvyL87oIfrVDX"
        // STATE.REF.registry.BotLeft.playerID = "-LN6n-fR8cSNR2E_N_3q"
        // STATE.REF.registry.TopRight.playerID = "-LN7lNnjuWmFuvVPW76H"
        // STATE.REF.registry.BotRight.playerID = "-LMGDbZCKw4bZk8ztfNf"
    };
    // #endregion

    // #region EVENT HANDLERS: (HANDLEINPUT)
    const onChatCall = (call, args, objects, msg) => {
        DB({call, args, objects, msg}, "onChatCall");
        const charObjs = Listener.GetObjects(objects, "character");
        const syntax = [
            "<h3>SYNTAX:</h3>",
            "<b>!char get repstat &quot;&lt;lookupStat:lookupVal&gt;&quot; &lt;statName&gt;",
            "<b>!char set stat &lt;statName&gt; &lt;value&gt;",
            "!char set stat &quot;&lt;lookupStat:lookupVal&gt;&quot; &quot;&lt;setStat:setVal&gt;&quot;</b>",
            "('setStat' and 'statName' can be &quot;value&quot; to get/set a dot value)",
            "",
            "E.G.",
            "<i>!char get stat @B &quot;name:Haven (Cabbagetown)&quot; advantage_details</i>",
            "<i>!char set stat @L &quot;name:Haven (Cabbagetown)&quot; &quot;value:7&quot;</i>"
        ];
        switch (call) {
            case "launch": {
                const [margin, resultString, rowID] = args;
                if (rowID)
                    launchProject(D.Int(margin), resultString, charObjs[0], `repeating_project_${rowID}_`);
                else
                    launchProject(D.Int(margin), resultString);
                break;
            }
            case "class": {
                const charInsts = _.compact(charObjs.map((x) => Character.Get(x)));
                switch (D.LCase(call = args.shift())) {
                    case "get": {
                        switch (D.LCase(call = args.shift())) {
                            case "allstats": {
                                D.Flag("AllStats Called!");
                                const [charInst] = charInsts;
                                const [category, subStat, index] = args;
                                charInst.getAllStatObjs(category, subStat, index);
                                D.Alert(D.JS(_.pick(charInst.ObjsLIB, (v) => v.category === category), true), "!char get allstats");
                                break;
                            }
                            case "objs": {
                                const [charInst] = charInsts;
                                D.Alert(D.JS(charInst.ObjsLIB, true), `${charInst.name}'s Objects`);
                                break;
                            }
                            case "stat": {
                                let [index, subStat, ...statName] = args.reverse();
                                statName.reverse();
                                if (VAL({int: index}) && D.Int(index) > 0) {
                                    index = D.Int(index) - 1;
                                } else if (index && !VAL({int: index})) {
                                    statName.push(subStat);
                                    subStat = index;
                                    index = null;
                                }
                                if (subStat && !ATTRSUBSTATS.includes(subStat)) {
                                    statName.push(subStat);
                                    subStat = null;
                                }
                                const reportLines = [`<h3>${statName.join("  ")}${subStat !== null ? `::${subStat}` : ""}${index !== null ? `::${index + 1}` : ""}</h3>`];
                                charInsts.forEach((x) => {
                                    const statVal = x.GetStat(statName.join(" ").trim(), subStat, index);
                                    if (statVal !== false)
                                        reportLines.push(`${x.name}: ${statVal}`);
                                });
                                D.Alert(reportLines.join("<br>"), "!char get stat");
                                break;
                            }
                            // no default
                        }
                        break;
                    }
                    case "set": {
                        switch (D.LCase(call = args.shift())) {
                            case "stat": {
                                const [statName, subStatIndex, ...value] = args;
                                let [subStat, index] = subStatIndex.split(":");
                                if (subStat && !ATTRSUBSTATS.includes(subStat)) {
                                    value.unshift(subStatIndex);
                                    subStat = null;
                                    index = null;
                                }
                                if (index && VAL({int: index}))
                                    index = D.Int(index) - 1;
                                charInsts.forEach((x) => x.SetStat(statName, subStat, index, value.join(" ")));
                                break;
                            }
                            // no default
                        }
                        break;
                    }
                    default: {
                        charObjs.forEach((x) => new Character(x));
                        D.Flag("Character Classes Initialized");
                        break;
                    }
                }
                break;
            }
            case "reg": {
                switch (D.LCase((call = args.shift()))) {
                    case "tokenpower": {
                        const [charObj] = charObjs;
                        let charID = (VAL({charObj}) && charObj.id) || "all";
                        if (args[0] === "all") {
                            args.shift();
                            charID = "all";
                        }
                        const tokenSrc = args.shift();
                        const rollEffect = args.join(" ");
                        if (VAL({string: [tokenSrc, rollEffect]}, null, true)) {
                            STATE.REF.tokenPowerData[charID] = STATE.REF.tokenPowerData[charID] || {};
                            STATE.REF.tokenPowerData[charID][D.LCase(tokenSrc)] = rollEffect;
                            D.Alert(
                                `Token Powers for ${charID === "all" ? "ALL" : D.GetName(charObj)}:<br><br>${D.JS(STATE.REF.tokenPowerData[charID])}`,
                                "!char reg tokenpower"
                            );
                        }
                        break;
                    }
                    case "players": {
                        const allChars = _.compact(findObjs({_type: "character"}));
                        const allPlayers = _.compact(findObjs({_type: "player"})); // .filter(x => x.id !== D.GMID())
                        for (const playerObj of allPlayers) {
                            const charObj = allChars.find((x) => x.get("controlledby").includes(playerObj.id));
                            if (VAL({charObj})) {
                                const quad = _.findKey(REGISTRY, (v) => v.id === charObj.id);
                                if (VAL({string: quad})) {
                                    REGISTRY[quad].playerID = playerObj.id;
                                    REGISTRY[quad].playerName = playerObj.get("_displayname");
                                }
                                D.Alert(
                                    `Registering <b>${playerObj.get("_displayname")}</b> with <b>${charObj.get("name")}</b> at <b>${quad}</b>`,
                                    "!char reg players"
                                );
                            }
                        }
                        break;
                    }
                    case "char": {
                        const [shortName, initial, quadrant] = args;
                        if (VAL({selection: [msg], string: [shortName, initial, quadrant]}, "!char reg char", true))
                            registerChar(msg, shortName, initial, quadrant);
                        else
                            D.Alert("Select character tokens first!  Syntax: !char reg char <shortName> <initial> <quadrant>", "!char reg char");
                        break;
                    }
                    case "weekly":
                    case "resource":
                    case "weeklyresource": {
                        const [charObj] = charObjs;
                        const charData = D.GetCharData(charObj);
                        if (VAL({list: charData})) {
                            const resInitial = charData.initial;
                            const resAmount = D.Int(args.pop());
                            const resName = args.join(" ");
                            regResource(resInitial, resName, resAmount);
                        } else {
                            D.Alert("Invalid character.<br><br>Syntax: !char reg weekly <charRef> <resName> <resAmount>", "!char reg weekly");
                        }
                        Char.RefreshDisplays();
                        break;
                    }
                    case "stake": {
                        switch (D.LCase((call = args.shift()))) {
                            case "coterie": {
                                const [name, value, max, date] = args.join(" ").split("|");
                                STATE.REF.customStakes.coterie.push([name, D.Int(value), D.Int(max), date]);
                                break;
                            }
                            default: {
                                args.unshift(call);
                                const [charObj] = charObjs;
                                if (VAL({charObj}, "!char reg stake")) {
                                    const {initial} = D.GetCharData(charObj) || {initial: "X"};
                                    const [name, value, max, date] = args.join(" ").split("|");
                                    STATE.REF.customStakes.personal[initial] = STATE.REF.customStakes.personal[initial] || [];
                                    STATE.REF.customStakes.personal[initial].push([name, D.Int(value), D.Int(max), date]);
                                }
                                break;
                            }
                        }
                        Char.RefreshDisplays();
                        break;
                    }
                    default: {
                        D.Alert(
                            "Syntax:<br><br>!char reg <players/char/weekly/stake><br><br>!char reg char <shortName> <initial> <quadrant>",
                            "!char reg"
                        );
                        break;
                    }
                }
                break;
            }
            case "unreg": {
                switch (D.LCase((call = args.shift()))) {
                    case "char":
                        unregisterChar(args.shift());
                        break;
                    case "weekly":
                    case "resource":
                    case "weeklyresource": {
                        const [charObj] = charObjs;
                        const charData = D.GetCharData(charObj);
                        if (VAL({charObj}))
                            unregResource(charData.initial, D.Int(args.shift()));
                        else
                            D.Alert("Invalid character.<br><br>Syntax: !char unreg weekly <charRef> <rowNum>", "!char unreg weekly");
                        Char.RefreshDisplays();
                        break;
                    }
                    case "stake": {
                        switch (D.LCase((call = args.shift()))) {
                            case "coterie": {
                                const rowNum = args.pop();
                                if (VAL({number: rowNum})) {
                                    STATE.REF.customStakes.coterie[rowNum - 1] = false;
                                    STATE.REF.customStakes.coterie = _.compact(STATE.REF.customStakes.coterie);
                                }
                                break;
                            }
                            default: {
                                args.unshift(call);
                                const [charObj] = charObjs;
                                if (VAL({charObj}, "!char unreg stake")) {
                                    const {initial} = D.GetCharData(charObj) || {initial: "X"};
                                    const rowNum = args.pop();
                                    if (VAL({number: rowNum})) {
                                        STATE.REF.customStakes.personal[initial][rowNum - 1] = false;
                                        STATE.REF.customStakes.personal[initial] = _.compact(STATE.REF.customStakes.personal[initial]);
                                    }
                                }
                                break;
                            }
                        }
                        Char.RefreshDisplays();
                        break;
                    }
                    // no default
                }
                break;
            }
            case "get": {
                switch (D.LCase((call = args.shift()))) {
                    case "repstats": case "repsecs": case "repdata": {
                        if (args.length && args[0] in C.REPATTRS)
                            D.Alert([
                                D.JS(C.REPATTRS[args.shift()], true, true),
                                ...syntax
                            ].join("<br>"), "RepStat Data");
                        else
                            D.Alert([
                                D.JS(C.REPATTRS, true, true),
                                ...syntax
                            ].join("<br>"), "RepStat Data");
                        break;
                    }
                    case "badattrs": case "badstats": {
                        const [, badAttrs, badAttrsByRegExp] = findBadAttrs(true);
                        if (args[0] === "regexp")
                            D.Alert(D.JS(badAttrsByRegExp.map((x) => x[0]).sort()), `${badAttrsByRegExp.length} Unique Bad Attribute Names by RegExp`);
                        else
                            D.Alert(D.JS(badAttrs.map((x) => x[0]).sort()), `${badAttrs.length} Unique Bad Attribute Names`);
                        break;
                    }
                    case "goodattrs": case "goodstats": {
                        const [goodAttrs] = findBadAttrs(true);
                        D.Alert(D.JS(goodAttrs.map((x) => x[0]).sort()), `${goodAttrs.length} Unique Good Attribute Names`);
                        break;
                    }
                    case "allattrs": case "allstats": {
                        const allAttrs = getAllAttributes();
                        D.Alert(D.JS(allAttrs.map((x) => x[0]).sort()), `${allAttrs.length} Unique Attribute Names`);
                        break;
                    }
                    case "repstat": {
                        const [charObj] = charObjs;
                        if (VAL({charObj}, "!char get repstat"))
                            // !test repstats "Johannes Napier" advantage null "Haven (Harbord Village)"
                            // !char set stat <name>   OR   !char set stat <lookupStat:lookupVal>
                            if (args.length >= 1) {
                                const [statName, getStat] = args;
                                if (statName.includes(":")) { // This is a rep stat reference
                                    try {
                                        const [lookupStatName, lookupStatVal] = statName.split(":");
                                        const rowFilter = {[lookupStatName]: lookupStatVal};
                                        D.Alert(D.JS(D.GetRepStats(charObj, null, rowFilter, getStat)), "!char get repstat");
                                    } catch (errObj) {
                                        const alertLines = [
                                            "Can't find rep stat!",
                                            D.JS({statName, getStat, errObj}, true)
                                        ];
                                        D.Alert(D.JS(C.REPATTRS));
                                        D.Alert([...alertLines, ...syntax].join("<br>"), "ERROR: !char get repstat");
                                    }
                                    break;
                                }
                            }

                        D.Alert([
                            "Syntax Error!",
                            D.JS({charObj, args}),
                            ...syntax
                        ].join("<br>"), "!char get repstat");
                        break;
                    }
                    case "attr": {
                        const [charObj] = charObjs;
                        let attrObjs = findObjs({
                            _type: "attribute",
                            _characterid: charObj.id
                        });
                        switch (D.LCase((call = args.shift()))) {
                            default: {
                                attrObjs = attrObjs.filter((x) => D.LCase(x.get("name")) === D.LCase(call));
                            }
                            // falls through
                            case "all": {
                                D.Alert(
                                    D.JS(attrObjs.map((x) => [x.get("name"), x.get("current"), x.get("max"), x.id, x])),
                                    `Attribute Object(s) for ${D.GetName(charObj)}`
                                );
                                break;
                            }
                        }
                        break;
                    }
                    case "stat": {
                        DB({charObjs, args}, "traitSelectMenu");
                        if (args.length)
                            getTraitData(charObjs, args.shift(), args);
                        else
                            traitSelectMenu(
                                charObjs.map((x) => x.id),
                                "!char",
                                "get stat"
                            );
                        break;
                    }
                    case "projects": {
                        updateProjectsDoc();
                        break;
                    }
                    // no default
                }
                break;
            }
            case "lock":
            case "unlock": {
                const isLocking = call === "lock";
                switch (D.LCase((call = args.shift()))) {
                    case "weekly":
                    case "resource":
                    case "weeklyresource": {
                        if (args.length === 2) {
                            const init = D.GetCharData(charObjs[0]).initial;
                            const [rowNum, amount] = args.map((x) => D.Int(x));
                            const [curTot, curLock] = [
                                STATE.REF.weeklyResources[init][rowNum - 1][2],
                                STATE.REF.weeklyResources[init][rowNum - 1][3]
                            ];
                            const newLock = Math.max(0, Math.min(curTot, curLock + (isLocking ? amount : -amount)));
                            STATE.REF.weeklyResources[init][rowNum - 1][3] = newLock;
                        } else {
                            D.Alert(
                                "Syntax:<br><br><b>!char reg (initial) (name) (total)<br>!char unreg/set/lock/unlock (initial) (rowNum) [amount]<br>!char set weekly reset</b>"
                            );
                        }
                        displayResources();
                        break;
                    }
                    // no default
                }
                break;
            }
            case "set":
            case "add": {
                switch (D.LCase((call = args.shift()))) {
                    case "disabled":
                    case "disable": {
                        for (const charObj of charObjs.filter((x) => VAL({pc: x})))
                            REGISTRY[D.GetCharData(charObj).quadrant].isActive = args[0] === "on";
                        D.Alert(
                            D.JS(
                                D.KeyMapObj(
                                    D.Clone(REGISTRY),
                                    (k, v) => v.shortName,
                                    (v) => v.isActive
                                )
                            ),
                            "Character Activity Set"
                        );
                        break;
                    }
                    case "token": {
                        const tokenSrc = args.shift();
                        for (const charObj of charObjs) {
                            Media.SetToken(charObj.id, tokenSrc);
                            processTokenPowers(charObj.id);
                        }
                        break;
                    }
                    case "daysleep": {
                        setDaysleepAlarm();
                        break;
                    }
                    case "npc": {
                        const [charObj] = charObjs.filter((x) => VAL({pc: x}));
                        const [npcObj] = charObjs.filter((x) => VAL({npc: x}));
                        setCharNPC(charObj, npcObj || "base");
                        break;
                    }
                    case "tempstat": {
                        const [charObj] = charObjs;
                        const [statName, delta, repRowStatName] = args;
                        adjustTempStat(charObj, statName, D.Int(delta), repRowStatName);
                        break;
                    }
                    case "stat": {
                        const [charObj] = charObjs;
                        const attrList = {};
                        if (VAL({charObj}, "!char set stat")) {
                            // !test repstats "Johannes Napier" advantage null "Haven (Harbord Village)"
                            // !char set stat <name> <value>   OR   !char set stat <section> <lookupStat:lookupVal> <setStat:setVal>
                            if (args.length === 2) { // Simple Set Stat
                                const [statName, statVal] = args;
                                if (statName.includes(":")) { // This is a rep stat reference
                                    const repStatData = {};
                                    try {
                                        const [lookupStatName, lookupStatVal] = statName.split(":");
                                        const rowFilter = {[lookupStatName]: lookupStatVal};
                                        const [repStatName, repStatVal] = statVal.split(":");
                                        if (["val", "value"].includes(repStatName)) {
                                            const allRepStats = D.GetRepStats(charObj, null, rowFilter, null);
                                            const [sampleRepStat] = allRepStats;
                                            const section = sampleRepStat.section;
                                            const repStat = D.GetRepStat(charObj, null, rowFilter, section);
                                            DB({allRepStats, sampleRepStat, section, repStat}, "charSetStat");
                                            Object.assign(repStatData, D.GetRepStat(charObj, null, rowFilter, D.GetRepStats(charObj, null, rowFilter, null)[0].section), {repStatVal});
                                        } else {
                                            Object.assign(repStatData, D.GetRepStat(charObj, null, rowFilter, repStatName), {repStatVal});
                                        }
                                        DB({rowFilter, repStatName, repStatVal, repStatData}, "charSetStat");
                                    } catch (errObj) {
                                        const alertLines = [
                                            "Can't find rep stat!",
                                            D.JS({statName, statVal, repStatData, errObj}, true)
                                        ];
                                        D.Alert(D.JS(C.REPATTRS));
                                        D.Alert([...alertLines, ...syntax].join("<br>"), "ERROR: !char set stat");
                                        break;
                                    }
                                    DB({repStatData}, "charSetStat");
                                    attrList[repStatData.fullName] = repStatData.repStatVal;
                                } else {
                                    attrList[statName] = statVal;
                                }
                            } else {
                                D.Alert([
                                    "Syntax Error!",
                                    D.JS({charObj, args}),
                                    ...syntax
                                ].join("<br>"), "!char set stat");
                                break;
                            }
                            DB({attrList}, "charSetStat");
                            setAttrs(charObj.id, attrList);
                        } else {
                            D.Alert([
                                "Syntax Error!",
                                D.JS({charObj, args}),
                                ...syntax
                            ].join("<br>"), "!char set stat");
                        }
                        break;
                    }
                    case "stats":
                    case "attr":
                    case "attrs": {
                        const [charObj] = charObjs;
                        if (VAL({charObj}, "!char set stat")) {
                            const [statName, ...statVal] = args;
                            DB({statName, statVal}, "onChatCall");
                            D.SetStats(charObj.id, {[statName]: statVal.join(" ")});
                        } else {
                            D.Alert("Select a character or provide a character reference first!", "!char set stat");
                        }
                        break;
                    }
                    case "xp": {
                        DB(`!char xp COMMAND RECEIVED<br><br>Characters: ${D.JSL(_.map(charObjs, (v) => v.get("name")))}`, "!char set xp");
                        if (VAL({charObj: charObjs}, "!char set xp", true)) {
                            const amount = D.Int(args.shift());
                            for (const charObj of charObjs)
                                if (awardXP(charObj, amount, args.join(" ")))
                                    D.Alert(`${amount} XP awarded to ${D.GetName(charObj)}`, "!char set xp");
                                else
                                    D.Alert(`FAILED to award ${JSON.stringify(amount)} XP to ${JSON.stringify(D.GetName(charObj))}`, "!char set xp");
                        }
                        break;
                    }
                    case "weekly":
                    case "resource":
                    case "weeklyresource": {
                        switch (D.LCase((call = args.shift()))) {
                            case "reset": {
                                resetResources();
                                break;
                            }
                            default: {
                                args.unshift(call);
                                if (args.length === 2)
                                    adjustResource(charObjs[0], D.Int(args.shift()), D.Int(args.shift()));
                                else
                                    D.Alert(
                                        "Syntax:<br><br><b>!char reg (initial) (name) (total)<br>!char unreg/set/lock/unlock (initial) (rowNum) [amount]<br>!char set weekly reset</b>"
                                    );
                                break;
                            }
                        }
                        displayResources();
                        break;
                    }
                    case "desire": {
                        for (const charObj of charObjs)
                            resolveDesire(charObj);
                        break;
                    }
                    case "cols": {
                        const [colNum, shift] = args;
                        adjustDisplayCols(D.Int(colNum), D.Float(shift));
                        break;
                    }
                    case "dys":
                    case "dyscrasias": {
                        const [charObj] = charObjs;
                        const [dTitle, dText] = args.join(" ").split("|");
                        setDyscrasias(charObj, D.LCase(dTitle).length < 3 ? null : dTitle, dText);
                        break;
                    }
                    case "comp":
                    case "compulsion": {
                        const [charObj] = charObjs;
                        const [cTitle, cText] = args.join(" ").split("|");
                        setCompulsion(charObj, D.LCase(cTitle).length < 3 ? null : cTitle, cText);
                        break;
                    }
                    case "flag": {
                        const [charObj] = charObjs;
                        addCharFlag(charObj, args.join(" "));
                        break;
                    }
                    // no default
                }
                break;
            }
            case "clear": {
                switch (D.LCase((call = args.shift()))) {
                    case "tokenpowers": {
                        D.Alert(`Clearing Token Power Data:<br><br>${D.JS(STATE.REF.tokenPowerData)}`, "!char clear tokenpowers");
                        STATE.REF.tokenPowerData = {all: {}};
                        break;
                    }
                    case "npc": {
                        for (const charObj of charObjs)
                            setCharNPC(charObj, "base");
                        break;
                    }
                    case "flag": {
                        const [charObj] = charObjs;
                        delCharFlag(charObj, args.join(" "));
                        break;
                    }
                    // no default
                }
                break;
            }
            case "list": {
                switch (D.LCase((call = args.shift()))) {
                    case "reg":
                    case "registry":
                    case "registered": {
                        D.Alert(REGISTRY, "Registered Player Characters");
                        break;
                    }
                    case "ids":
                    case "charids": {
                        const msgStrings = [];
                        for (const charObj of findObjs({_type: "character"}))
                            msgStrings.push(
                                `${D.GetName(charObj)}<span style="color: ${C.COLORS.brightred}; font-weight:bold;">@T</span>${charObj.id}`
                            );
                        D.Alert(D.JS(msgStrings.join("<br>")));
                        break;
                    }
                    case "names": {
                        const msgStrings = [];
                        for (const charObj of findObjs({_type: "character"}))
                            msgStrings.push(charObj.get("name"));
                        msgStrings.sort();
                        D.Alert(D.JS(msgStrings.join("<br>")), "Character Names");
                        break;
                    }
                    // no default
                }
                break;
            }
            case "refresh": {
                updateProjectsDoc();
                updateAssetsDoc();
                displayDesires();
                displayResources();
                break;
            }
            case "daysleep": {
                const predatorPools = {
                    A: ["Charisma", "Subterfuge"],
                    B: ["Manipulation", "Persuasion", "Herd"],
                    L: ["Charisma", "Subterfuge"],
                    N: ["Intelligence", "Streetwise", "Herd (Bookies)"],
                    R: ["Manipulation", "Persuasion"]
                };
                const [charObj] = charObjs;
                const pool = predatorPools[D.GetCharData(charObj).initial];
                D.Call(`!char set stat @${D.GetCharData(charObj).initial} Hunger 0`);
                adjustDamage(charObj, "health", "superficial", -15);
                adjustDamage(charObj, "willpower", "superficial", -15);
                adjustHunger();
                setTimeout(() => {
                    D.Call(`!roll dice trait ${D.GetCharData(charObj).name}|${pool.join(",")}`);
                    D.Alert([
                        `<a href="!char @${D.GetCharData(charObj).initial} change Hunger 5">Total Fail</a>`,
                        `<a href="!char @${D.GetCharData(charObj).initial} change Hunger 4">Fail</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="!char @${D.GetCharData(charObj).initial} change Hunger 3">KILL or Bestial Fail</a>`,
                        `<a href="!char @${D.GetCharData(charObj).initial} change Hunger 3">Margin 0-1</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="!char @${D.GetCharData(charObj).initial} change Hunger 2">KILL</a>`,
                        `<a href="!char @${D.GetCharData(charObj).initial} change Hunger 2">Margin 2-4</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="!char @${D.GetCharData(charObj).initial} change Hunger 1">KILL</a>`,
                        `<a href="!char @${D.GetCharData(charObj).initial} change Hunger 1">Margin 5+</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="!char @${D.GetCharData(charObj).initial} change Hunger 0">KILL</a>`,
                        " ",
                        `<a href="!roll @${D.GetCharData(charObj).initial} resonance">RESONANCE</a>`
                    ].join("<br>"), "Hunger Results");
                }, 1000);
                break;
            }
            case "change": {
                const fullCommand = `!char ${(charObjs.length && charObjs.map((x) => x.id).join(",")) || ""} ${call} ${args.join(" ")}`;
                if (VAL({char: charObjs}, "!char change", true)) {
                    let isKilling = false;
                    switch (args.shift().toLowerCase()) {
                        case "hungerkill": {
                            isKilling = true;
                        }
                        // falls through
                        case "hunger": {
                            if (args.length)
                                for (const charObj of charObjs)
                                    adjustHunger(charObj, D.Int(args[0]), isKilling);
                            else
                                promptNumber(`${fullCommand} @@AMOUNT@@`);
                            break;
                        }
                        // no default
                    }
                }
                break;
            }
            case "dmg":
            case "damage":
            case "spend":
            case "heal": {
                if (VAL({char: charObjs}, "!char dmg", true)) {
                    const fullCommand = `!char ${(charObjs.length && charObjs.map((x) => x.id).join(",")) || ""} ${call} ${args.join(" ")}`;
                    const trait = args.shift().toLowerCase();
                    const dtype = ["hum", "humanity", "stain", "stains"].includes(trait) ? null : args.shift();
                    if (args.length) {
                        const dmg = (call === "heal" ? -1 : 1) * D.Int(args.shift());
                        for (const charObj of charObjs)
                            if (!adjustDamage(charObj, trait, dtype, dmg))
                                THROW(`FAILED to damage ${D.GetName(charObj)}`, "!char dmg");
                    } else {
                        promptNumber(`${fullCommand} @@AMOUNT@@`);
                    }
                }
                break;
            }
            case "process": {
                switch (D.LCase((call = args.shift()))) {
                    case "margins": {
                        addMarginToProjects(charObjs, args[0] === "true");
                        break;
                    }
                    case "boons": case "prestation": {
                        processPrestation();
                        break;
                    }
                    case "sheetattrs": {
                        D.Flag("Processing...");
                        validateCharAttributes(charObjs, args[0] === "true");
                        break;
                    }
                    case "defaults": {
                        populateDefaults(charObjs);
                        break;
                    }
                    case "npcstats": {
                        setNPCStats(args.shift());
                        break;
                    }
                    case "npchunger": {
                        const npcChars = D.GetChars("all")
                            .filter((x) => VAL({npc: x}))
                            .map((x) => [x.get("name"), x.id]);
                        const npcVamps = npcChars.filter((x) => getAttrByName(x[1], "clan").length > 2 && getAttrByName(x[1], "clan") !== "Ghoul");
                        const npcHungers = npcVamps.map((x) => [
                            x[1],
                            x[0],
                            Math.max(
                                D.Int(getAttrByName(x[1], "bp_slakekill")) + randomInteger(5 - D.Int(getAttrByName(x[1], "bp_slakekill"))) - 2,
                                D.Int(getAttrByName(x[1], "bp_slakekill"))
                            )
                        ]);
                        for (const hungerData of npcHungers)
                            setAttrs(hungerData[0], {hunger: hungerData[2]});
                        break;
                    }
                    case "changestat": {
                        changeAttrName(args.shift(), args.shift());
                        break;
                    }
                    case "changerepstat": {
                        changeRepAttrName(...args);
                        break;
                    }
                    // no default
                }
                break;
            }
            case "send": {
                switch (D.LCase((call = args.shift()))) {
                    case "home": {
                        sendCharsHome(charObjs.length ? charObjs : "registered");
                        break;
                    }
                    case "toggle": {
                        if (STATE.REF.tokenRecord.length)
                            restoreCharsPos(charObjs.length ? charObjs : undefined);
                        else
                            sendCharsHome(charObjs.length ? charObjs : undefined);
                        break;
                    }
                    case "district": {
                        const tokenObjs = D.GetSelected(msg, "token") || _.values(REGISTRY).map((x) => Media.GetImg(x.tokenName));
                        for (const tokenObj of tokenObjs)
                            Media.SetArea(tokenObj, `District${D.Capitalize(args[0])}`);
                        break;
                    }
                    case "site": {
                        break;
                    }
                    // no default
                }
                break;
            }
            case "select": {
                switch (D.LCase((call = args.shift()))) {
                    case "char": {
                        charSelectMenu();
                        break;
                    }
                    case "charnpc": {
                        charSelectMenu(true);
                        break;
                    }
                    case "player": {
                        playerSelectMenu();
                        break;
                    }
                    case "trait": {
                        if (args.length) {
                            const thisTrait = args.shift().toLowerCase();
                            if (STATE.REF.traitSelection.includes(thisTrait))
                                STATE.REF.traitSelection = _.without(STATE.REF.traitSelection, thisTrait);
                            else
                                STATE.REF.traitSelection.push(thisTrait);
                            Media.SetText(
                                "secretRollTraits",
                                STATE.REF.traitSelection.length === 0 ? " " : STATE.REF.traitSelection.join("\n"),
                                true
                            );
                        } else {
                            traitSelectMenu(
                                charObjs.map((x) => x.id),
                                "!char",
                                "select trait"
                            );
                        }
                        break;
                    }
                    case "registered":
                    case "npcs":
                    case "pcs":
                    case "sandbox": {
                        charActionMenu(call);
                        break;
                    }
                    default: {
                        // D.Alert(`Args: ${D.JS(args.join(","))}`)
                        if (charObjs.length)
                            charActionMenu(
                                charObjs.map((x) => x.id),
                                `Selected Characters (${charObjs.length})`
                            );
                        else
                            charSelectMenu();
                        break;
                    }
                }
                break;
            }
            case "toggle": {
                switch (D.LCase((call = args.shift()))) {
                    case "player": {
                        const [charObj] = charObjs;
                        togglePlayerChar(charObj, args[0] === "true" || (args[0] !== "false" && !isPlayerCharActive(charObj.id)));
                        break;
                    }
                    // no default
                }
            }
            // no default
        }
    };
    const onAttrChange = (call, attrObj, prevVal) => {
        switch (call) {
            case "hunger": {
                const charID = attrObj.get("_characterid");
                updateHunger(charID);
                checkCharAlarms(charID, "hunger", prevVal);
                break;
            }
            case "health_impair_toggle":
            case "willpower_impair_toggle":
            case "humanity_impair_toggle": {
                const charID = attrObj.get("_characterid");
                DB({charID, call, attrObj, prevVal}, "onAttrChange");
                checkCharAlarms(charID, call, prevVal);
                break;
            }
            case "desire":
            case "_reporder_repeating_desire": {
                displayDesires();
                break;
            }
            case "projectstake1":
            case "projectstake2":
            case "projectstake3":
            case "projectstake1_name":
            case "projectstake2_name":
            case "projectstake3_name": {
                updateAssetsDoc();
                break;
            }
            case "triggertimelinesort": {
                sortTimeline(attrObj.get("_characterid"));
                break;
            }
            // no default
        }
        /* const charInst = Character.Get(attrObj.get("_characterid"));
        if (charInst)
            charInst.Update(attrObj); */
    };
    const onAttrAdd = (call, attrObj) => {
        switch (call) {
            case "desire":
            case "_reporder_repeating_desire": {
                displayDesires({charID: attrObj.get("_characterid"), val: attrObj.get("current")});
                break;
            }
            case "projectstake1":
            case "projectstake2":
            case "projectstake3":
            case "projectstake1_name":
            case "projectstake2_name":
            case "projectstake3_name": {
                updateAssetsDoc();
                break;
            }
            case "triggertimelinesort": {
                sortTimeline(attrObj.get("_characterid"));
                break;
            }
            // no default
        }
        /* const charInst = Character.Get(attrObj.get("_characterid"));
        if (charInst)
            charInst.Update(attrObj); */
    };
    const onAttrDestroy = (call, attrObj) => {
        switch (call) {
            case "desire":
            case "_reporder_repeating_desire": {
                displayDesires({charID: attrObj.get("_characterid")});
                break;
            }
            // no default
        }
        /* const charInst = Character.Get(attrObj.get("_characterid"));
        if (charInst)
            charInst.Update(attrObj); */
    };
    const onCharAdd = (charObj) => {
        const charInst = new Character(charObj);
        validateCharAttributes([charObj], true);
    };
    // #endregion
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ END BOILERPLATE INITIALIZATION & CONFIGURATION ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // #region CLASS DEFINITIONS

    class Character {
        // #region ~ STATIC METHODS, GETTERS & SETTERS
        static Get(charRef) {
            const charObj = D.GetChar(charRef);
            return (charObj && charObj.id in this.LIB) ? this.LIB[charObj.id] : false;
        }

        // #region Instance Storage Libraries (Indexed by "id" property on Instance)
        static get LIB() { return this._CharLIB || {} }
        static set LIB(charInst) { this._CharLIB = Object.assign(this._CharLIB || {}, {[charInst.id]: charInst}) }
        // #endregion
        // #endregion

        // #region ~ BASIC GETTERS & SETTERS
        // INITIALIZATION
        get obj() { return this._obj }
        set obj(charObj) { this._obj = charObj }
        // READ-ONLY
        get id() { return this.obj.id }
        get name() { return this.obj.get("name") }
        get isPC() { return Boolean(Object.values(REGISTRY).find((x) => x.id === this.id)) }

        // ATTRIBUTE VALUES
        /*
        StatData objects stored in two-level object: '[category]: {[name]: {data}, [name]: {data}}'.
            Can either iterate through categories, or flatten an Object.values() call to search through all attributes by name
        Initialization doesn't fetch any objects.
            - get functions within each statData object will fetch/create objects if...
                (a) they aren't already set
                (b) the attribute object doesn't exist anymore
                (c) the attribute's name is in the this._attrsUpdateQueue array
                ... but one-at-a-time, as needed, instead of in bulk
                    ... maybe pre-initialize player characters at API restart
            - do attribute creation through setAttrs() function
            - statData also has get functions for names & ids of each object --> just return obj.get("name")/obj.id
                - do you have to use _.bind() or something to have 'this' within statData refer to statData and not to the class instance?
        Most of this can be completely isolated/compartmentalized within the private class scope
            - outside functions should only ever need to get or set data values --- don't need to expose objects to outside scope
            - make the get()s exposed to outside SUPER simple: only replies with SINGLE statData VALUE if statName/subStat/index is a match
                - can iterate through multiple statData queries as needed outside of the class
        */
        // #endregion

        // #region ~ CONSTRUCTOR
        constructor(charObj) {
            this.obj = charObj;
            Character.LIB = this;
            this._objsLIB = {};
        }
        // #endregion

        // #region ~ GETTERS
        // READ-ONLY
        get allAttrObjs() {
            if (!this._allAttrObjs) {
                this._allAttrObjs = findObjs({_type: "attribute", characterid: this.id})
                    .filter((x) => !_.any(ATTROBJSBLACKLIST, (pattern) => new RegExp(pattern).test(x)));

                setTimeout(() => { delete this._allAttrObjs }, STATE.REF.allAttrObjsRefreshSecs * 1000);
            }
            return this._allAttrObjs;
        }
        get baseAttrObjs() {
            if (!this._baseAttrObjs)
                this._baseAttrObjs = this.allAttrObjs.filter((x) => !x.get("name").startsWith("repeating_"));
            return this._baseAttrObjs;
        }

        // GENERAL

        // #endregion

        // #region ~ SETTERS

        // #endregion

        // #region ~ PRIVATE METHODS
        getRowRepAttrs(attrRef) {
            // Gets all attrObjs with same RowID as passed in attrName or attrObj
            const attrName = VAL({obj: attrRef}) ? attrRef.get("name") : attrRef;
            if (VAL({string: attrName}) && attrName.startsWith("repeating_")) {
                const [, section, rowID] = attrName.split("_");
                return D.GetRepStats(this.id, section, rowID, undefined, undefined, "obj");
            }
            return false;
        }
        findLinkedAttrObjs(attrObj, category = false) {
            // Returns libData object filled in with all attrObjs linked to passed-in attrObj
            //      Create objects when LINKEDSTATS has a defaultVal property.
            category = (category && category in LINKEDSTATS && category) || getCategory(attrObj);
            const valObjName = getValName(attrObj, category);
            const attrObjsLib = valObjName.startsWith("repeating_") ? this.getRowRepAttrs(attrObj) || {} : this.baseAttrObjs;
            const linkedAttrData = category && D.Clone(LINKEDSTATS[category]);
            const valObj = attrObjsLib.find((x) => x.get("name") === valObjName);
            const charID = this.id;
            const findAttrObj = (attrName, defaultVal) => {
                const attrNameTransforms = [
                    (name) => name,
                    (name) => D.LCase(name),
                    (name) => D.LCase(name).replace(/ /gu, "_")
                ];
                let obj, objName;
                while (!obj && attrNameTransforms.length) {
                    const nameTransform = attrNameTransforms.pop();
                    const thisAttrName = nameTransform(attrName);
                    obj = attrObjsLib.find((x) => nameTransform(x.get("name")) === thisAttrName);
                }
                if (!obj && !_.isUndefined(defaultVal))
                    obj = createObj("attribute", {
                        name: attrName,
                        current: defaultVal,
                        characterid: charID
                    });
                return VAL({obj}) && obj;
            };
            DB({attrObj, category, valObjName, linkedAttrData, valObj, charID}, "findLinkedAttrObjs");
            if (VAL({obj: valObj, list: linkedAttrData})) {
                const linkedAttrObjs = {val: valObj};
                for (const [subStat, statData] of Object.entries(_.omit(linkedAttrData, (v) => !(VAL({list: v}) && "type" in v)))) {
                    if ((valObjName.startsWith("repeating_") && statData.isBaseOnly)
                        || (!valObjName.startsWith("repeating_") && statData.isRepOnly))
                        continue;
                    if ("isInAttr" in statData)
                        if ("isMultiple" in statData && statData.isMultiple in linkedAttrObjs && VAL({obj: linkedAttrObjs[statData.isMultiple]})) {
                            const numAttrs = linkedAttrObjs[statData.isMultiple].get("current");
                            if (VAL({int: numAttrs}))
                                linkedAttrObjs[subStat] = _.compact(
                                    _.range(0, D.Int(numAttrs))
                                        .map((i) => findAttrObj(
                                            `${valObjName}${statData.isInAttr}${i + 1}`,
                                            statData.defaultVal
                                        ))
                                );
                        } else {
                            linkedAttrObjs[subStat] = findAttrObj(`${valObjName}${statData.isInAttr}`, statData.defaultVal) || undefined;
                        }
                    else
                        linkedAttrObjs[subStat] = valObj;
                }
                return linkedAttrObjs;
            }
            return false;
        }
        findStatObj(statName, subStat, index) {
            statName = D.LCase(statName);
            subStat = subStat ? D.LCase(subStat) : "val";
            DB({statName: `'${statName}'`, subStat, index}, "findStatObj");
            // Only two possibilities for a statName reference:
            //      1) D.LCase() match to attrObj.get("name")
            //      2) D.LCase() match to attrObj.get("name") === `${statName}_name`
            const attrRefObj = this.allAttrObjs.find((x) => D.LCase(x.get("name")) === statName.replace(/ /gu, "_")
                                                      || (x.get("name").endsWith("_name") && D.LCase(x.get("current")) === statName));
            DB({attrRefObj}, "findStatObj");
            // IF an object is found:
            if (VAL({obj: attrRefObj})) {
                // Determine the category
                const statCat = getCategory(attrRefObj);
                // Get or create the linked attribute objects
                const libData = Object.assign({category: statCat}, this.findLinkedAttrObjs(attrRefObj, statCat) || {});
                DB({statCat, libData}, "findStatObj");
                // Apply to _objsLIB ***IF*** both val and name objects found.
                if (VAL({obj: [libData.val, libData.name]}, undefined, true)
                    && (libData.val.id === libData.name.id || libData.name.get("current")))
                    this._objsLIB[statName] = libData;
            }
            // Finally, return desired subStat object
            let returnObj;
            if (statName in this._objsLIB && subStat in this._objsLIB[statName])
                returnObj = this._objsLIB[statName][subStat];
            if (VAL({int: index, array: returnObj}))
                returnObj = returnObj[D.Int(index)];
            return VAL({obj: returnObj}) && returnObj;
        }
        getStatObj(statName, subStat, index) {
            statName = D.LCase(statName);
            subStat = subStat ? D.LCase(subStat) : "val";
            let statObj = false;
            if (statName in this._objsLIB && subStat in this._objsLIB[statName]) {
                statObj = this._objsLIB[statName][subStat];
                if (VAL({int: index, array: statObj}))
                    statObj = statObj[index];
            }
            if (!VAL({obj: statObj}))
                statObj = this.findStatObj(statName, subStat, index);
            return VAL({obj: statObj}) && statObj;
        }
        // #endregion

        // #region ~ PUBLIC METHODS
        get ObjsLIB() { return this._objsLIB }
        GetStat(statName, subStat, index) {
            subStat = subStat || "val";
            DB({statName, subStat, index}, "GetStat");
            const valObj = this.getStatObj(statName, ["raw", "max"].includes(subStat) ? "val" : subStat, index);
            if (VAL({obj: valObj})) {
                let value = valObj.get(subStat === "max" ? "max" : "current");
                if (VAL({int: value}))
                    value = D.Int(value);
                if (subStat === "val") {
                    const modObj = this.getStatObj(statName, "mod") || {get: () => 0};
                    return value + D.Int(modObj.get("current"));
                }
                return value;
            }
            return false;
        }
        SetStat(statName, subStat, index, value) {
            subStat = subStat || "val";
            const valObj = this.getStatObj(statName, ["max"].includes(subStat) ? "val" : subStat, index);
            if (VAL({obj: valObj}))
                setAttrs(this.id, {[valObj.get("name")]: value});
        }
        // #endregion
    }
    // #region Roll & Char Effects Classes
    // class Effect {
    //     /* SETTING UP CLASS TEMPLATE: Replace "Effect" with name of class (e.g. "Asset") */
    //     // #region ~ STATIC METHODS, GETTERS & SETTERS
    //     static get ReqCats() {
    //         return { // initial arrays are OR.  Internal arrays are AND.
    //             attrcat: [], // valid attrCats = physical, social, mental, discipline
    //             attrval: [
    //                 [
    //                     ["attrName"]: "", // name of sheet attribute: checkFunc
    //                 ]
    //             ],
    //             charids: [], // list of valid chars this applies to
    //             location: [
    //                 [Districts: [], Sites: []]
    //             ],
    //             domaincontrol: [
    //                 ["District"]: [1, 2, 3]
    //             }
    //         }
    //     }
    //     // #region Instance Storage Libraries (Indexed by "id" property on Instance)
    //     static get LIB() {
    //         return this._EffectLIB;
    //     }
    //     static set LIB(effectInstance) {
    //         this._EffectLIB = Object.assign(this._EffectLIB || {}, {[effectInstance.id]: effectInstance});
    //     }
    //     // #endregion
    //     // #endregion

    //     // #region ~ BASIC GETTERS & SETTERS

    //     // #endregion

    //     // #region ~ CONSTRUCTOR
    //     constructor(effectID) {
    //         this._id = effectID;
    //         Effect.LIB = this;
    //         this._checks = [];
    //     }
    //     // #endregion

    //     // #region ~ GETTERS
    //     // READ-ONLY

    //     // GENERAL
    //     get Checks() { return this._checks) };
    //     // #endregion

    //     // #region ~ SETTERS

    //     // #endregion

    //     // #region ~ PRIVATE METHODS
    //     addReq(reqCat, checkData, groupID) {
    //         reqCat = D.LCase(reqCat);
    //         groupID = _.isNaN(groupID) ? this.effectGroups.length - 1 : D.Int(groupID);
    //         if (Object.keys(Effect.ReqCats).includes(reqCat)) {
    //             this.checks[groupID].push({[reqCat]: checkData});
    //     }

    //     // #endregion

    //     // #region ~ PUBLIC METHODS

    //     // #endregion
    // }
    // class RollEffect extends Effect {
    //     /* SETTING UP CLASS TEMPLATE: Replace "Effect" with name of class (e.g. "Asset") */
    //     // #region ~ STATIC METHODS, GETTERS & SETTERS
    //     // #region Instance Storage Libraries (Indexed by "id" property on Instance)
    //     static get LIB() {
    //         return this._EffectLIB;
    //     }
    //     static set LIB(effectInstance) {
    //         this._EffectLIB = Object.assign(this._EffectLIB || {}, {[effectInstance.id]: effectInstance});
    //     }
    //     // #endregion
    //     // #endregion

    //     // #region ~ BASIC GETTERS & SETTERS

    //     // #endregion

    //     // #region ~ CONSTRUCTOR
    //     constructor(effectID) {
    //         this._id = effectID;
    //         Effect.LIB = this;
    //     }
    //     // #endregion

    //     // #region ~ GETTERS
    //     // READ-ONLY

    //     // GENERAL

    //     // #endregion

    //     // #region ~ SETTERS

    //     // #endregion

    //     // #region ~ PRIVATE METHODS

    //     // #endregion

    //     // #region ~ PUBLIC METHODS

    //     // #endregion
    // }
    // class StatEffect extends Effect {
    //     // #region ~ STATIC METHODS, GETTERS & SETTERS
    //     static get ReqCats() {
    //         return [...super.ReqCats(), ""
    //     }
    //     // #region Instance Storage Libraries (Indexed by "id" property on Instance)
    //     // #endregion
    //     // #endregion

    //     // #region ~ BASIC GETTERS & SETTERS


    //     // #endregion

    //     // #region ~ CONSTRUCTOR
    //     constructor(statEffectID) {
    //         super(statEffectID);
    //     }
    //     // #endregion

    //     // #region ~ GETTERS
    //     // READ-ONLY
    //     get doesApply() {
    //         return doesEffectApply();
    //     }
    //     get name() {
    //         return this.data.fullName;
    //     }
    //     get resonance() {
    //         return this.data.resonance;
    //     }

    //     // GENERAL
    //     get data() {
    //         return this._data;
    //     }
    //     get rollEffects() {
    //         return this.data.rollEffects;
    //     }
    //     get statEffects() {
    //         return this.data.statEffects;
    //     }

    //     // #endregion

    //     // #region ~ SETTERS
    //     set effectReqs(v) {
    //         this._effectReqs = Object.assign({}, this._effectReqs, )
    //     }
    //     set position(v) {
    //         this._position = v; /* (subclasses will validate for proper position) */
    //     }

    //     // #endregion

    //     // #region ~ PRIVATE METHODS
    //     doesEffectApply() {

    //     }

    //     // #endregion

    //     // #region ~ PUBLIC METHODS

    //     Enter() {
    //         if (this.onEntryCall)
    //             D.Call(this.onEntryCall);
    //         // setSoundScape();
    //         // findCharsInLoc();
    //         // activateRollEffects();
    //         // activateStatEffects();
    //     }

    //     // #endregion
    // }
    // #endregion
    // #endregion

    const REGISTRY = STATE.REF.registry;
    const MENUHTML = {};
    const STATCATS = ["attributes", "skills", "disciplines", "advantages"];
    const ATTRIBUTES = {
        all: _.flatten(Object.values(C.ATTRIBUTES)).map((x) => D.LCase(x).replace(/ /gu, "_")),
        physical: C.ATTRIBUTES.physical.map((x) => D.LCase(x).replace(/ /gu, "_")),
        social: C.ATTRIBUTES.social.map((x) => D.LCase(x).replace(/ /gu, "_")),
        mental: C.ATTRIBUTES.mental.map((x) => D.LCase(x).replace(/ /gu, "_"))
    };
    const SKILLS = {
        all: _.flatten(Object.values(C.SKILLS)).map((x) => D.LCase(x).replace(/ /gu, "_")),
        physical: C.SKILLS.physical.map((x) => D.LCase(x).replace(/ /gu, "_")),
        social: C.SKILLS.social.map((x) => D.LCase(x).replace(/ /gu, "_")),
        mental: C.SKILLS.mental.map((x) => D.LCase(x).replace(/ /gu, "_"))
    };
    const DISCIPLINES = Object.keys(C.DISCIPLINES).map((x) => D.LCase(x).replace(/ /gu, "_"));

    const getSuffixes = (category) => {
        const catData = category
            ? LINKEDSTATS[category]
            : Object.values(LINKEDSTATS).reduce((obj, x) => Object.assign(obj, x), {});
        if (catData)
            return Object.values(
                _.omit(
                    _.mapObject(
                        _.pick(
                            catData, (statData) => VAL({list: statData}) && "isInAttr" in statData
                        ),
                        (statData) => {
                            if ("isMultiple" in statData && statData.isMultiple in catData)
                                return _.range(0, catData[statData.isMultiple].max || 0)
                                    .map((i) => `${statData.isInAttr}${i}`);
                            else if (!("isMultiple" in statData))
                                return statData.isInAttr;
                            return false;
                        }
                    ),
                    (v) => v === false
                )
            );
        return false;
    };
    const getCategory = (attrObj) => _.findKey(LINKEDSTATS, (v) => VAL({list: v}) && v.isMember(attrObj));
    const getValName = (attrRef, category) => {
        const attrName = VAL({obj: attrRef}) ? attrRef.get("name") : attrRef;
        const pattern = (getSuffixes(category) || []).map((x) => new RegExp(`${x}$`, "gu")).find((x) => x.test(attrName));
        DB({suffixes: getSuffixes(category), attrName, pattern}, "getValName");
        return pattern ? attrName.replace(pattern, "") : attrName;
    };
    const LINKEDSTATS = {
        attributes: {
            isMember: (attrObj) => ATTRIBUTES.all.includes(getValName(attrObj, "attributes")),
            val: {type: "int", defaultVal: 1, min: 0, max: 10},
            name: {type: "string"},
            mod: {isInAttr: "mod", type: "int", defaultVal: 0, min: -5, max: 10}
        },
        skills: {
            isMember: (attrObj) => SKILLS.all.includes(getValName(attrObj, "skills")),
            val: {type: "int", defaultVal: 0, min: 0, max: 10},
            name: {suffix: false},
            mod: {isInAttr: "mod", type: "int", defaultVal: 0, min: -5, max: 10},
            spec: {isInAttr: "_spec", defaultVal: ""}
        },
        disciplines: {
            isMember: (attrObj) => {
                const attrName = attrObj.get("name");
                return Boolean(attrName.startsWith("repeating_")
                    ? _.flatten(Object.values(Char.LINKEDSTATS.disciplines.repeatingValNames)).find((x) => attrName.includes(`_${x}_`))
                    : Char.LINKEDSTATS.disciplines.baseValNames.find((x) => attrName.startsWith(x)));
            },
            baseValNames: ["disc1", "disc2", "disc3"],
            repeatingValNames: {disc: ["discleft", "discmid", "discright"]},
            toggle: {isInAttr: "_toggle", type: "int", defaultVal: 1, min: 0, max: 1, isBaseOnly: true},
            val: {type: "int", defaultVal: 0, min: 0, max: 10},
            name: {isInAttr: "_name", type: "string", defaultVal: ""},
            mod: {isInAttr: "mod", type: "int", defaultVal: 0, min: -5, max: 10},
            powersToggle: {isInAttr: "_power_toggle", type: "int", defaultVal: 0, min: 0, max: 10},
            powers: {isMultiple: "powersToggle", isInAttr: "_power_", type: "string", defaultVal: ""}
        },
        advantages: {
            isMember: (attrObj) => {
                const attrName = attrObj.get("name");
                return Boolean(attrName.startsWith("repeating_")
                                && _.flatten(Object.values(Char.LINKEDSTATS.advantages.repeatingValNames)).find((x) => attrName.includes(`_${x}_`)));
            },
            repeatingValNames: {advantage: ["advantage"], negadvantage: ["negadvantage"]},
            val: {type: "int", defaultVal: 0, min: 0, max: 10},
            name: {isInAttr: "_name", type: "string", defaultVal: ""},
            mod: {isInAttr: "mod", type: "int", defaultVal: 0, min: -5, max: 10},
            type: {isInAttr: "_type", type: "string", defaultVal: ""},
            details: {isInAttr: "_details", type: "string", defaultVal: ""}
        }
    };
    const ATTRSUBSTATS = ["val", "raw", "max", "mod", "name", "spec", "toggle", "powerToggle", "powers", "type", "details"];
    const ATTROBJSBLACKLIST = [
        "null_\\d+",
        "bonus_\\d+"
    ];

    // #region JSON Text Blocks
    const NPCSTATS
        = "{\"Frederik Scheer, Seneschal\": { \"base\": {\"clan\": \"Tremere\", \"faction\": \"Camarilla\", \"blood_potency\": 6, \"humanity\": 3, \"stains\": 0 }, \"attributes\": { \"strength\": 3, \"dexterity\": 2, \"stamina\": 3, \"charisma\": 3, \"manipulation\": 3, \"composure\": 4, \"intelligence\": 6, \"wits\": 4, \"resolve\": 4 }, \"skills\": { \"6\": \"OCC\", \"5\": \"AWA INT POL INS SUB\", \"4\": \"MEL ACA INV\", \"3\": \"BRA LED ETI\", \"2\": \"PER\", \"1\": \"SCI\" }, \"clandiscs\": { \"disc1\": [\"Auspex\", 4], \"disc2\": [\"Dominate\", 5], \"disc3\": [\"Blood Sorcery\", 5] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"PRE OBF\", \"2\": \"\", \"1\": \"\" } },\"Baroness Monika Eulenberg\": { \"base\": {\"clan\": \"Malkavian\", \"faction\": \"Anarch\", \"blood_potency\": 3, \"humanity\": 6, \"stains\": 0 }, \"attributes\": { \"strength\": 1, \"dexterity\": 2, \"stamina\": 2, \"charisma\": 3, \"manipulation\": 4, \"composure\": 2, \"intelligence\": 4, \"wits\": 5, \"resolve\": 2 }, \"skills\": { \"6\": \"\", \"5\": \"INS AWA\", \"4\": \"SUB LED INV\", \"3\": \"LAR SUR POL\", \"2\": \"PER TEC ETI\", \"1\": \"ATH BRA MEL FIN\" }, \"clandiscs\": { \"disc1\": [\"Auspex\", 4], \"disc2\": [\"Dominate\", 3], \"disc3\": [\"Obfuscate\", 4] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"CEL\", \"1\": \"\" } },\"Ben Blinker\": { \"base\": {\"clan\": \"Malkavian\", \"faction\": \"Anarch\", \"blood_potency\": 2, \"humanity\": 6, \"stains\": 0 }, \"attributes\": { \"strength\": 2, \"dexterity\": 3, \"stamina\": 2, \"charisma\": 3, \"manipulation\": 4, \"composure\": 3, \"intelligence\": 2, \"wits\": 2, \"resolve\": 1 }, \"skills\": { \"6\": \"\", \"5\": \"PER\", \"4\": \"SUB\", \"3\": \"INS ATH\", \"2\": \"INV AWA STR\", \"1\": \"BRA STL DRV\" }, \"clandiscs\": { \"disc1\": [\"Auspex\", 0], \"disc2\": [\"Dominate\", 4], \"disc3\": [\"Obfuscate\", 2] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"Jane 'JD' Doe\": { \"base\": {\"clan\": \"Brujah\", \"faction\": \"Anarch\", \"blood_potency\": 2, \"humanity\": 7, \"stains\": 0 }, \"attributes\": { \"strength\": 4, \"dexterity\": 3, \"stamina\": 3, \"charisma\": 2, \"manipulation\": 3, \"composure\": 2, \"intelligence\": 2, \"wits\": 1, \"resolve\": 2 }, \"skills\": { \"6\": \"\", \"5\": \"BRA\", \"4\": \"\", \"3\": \"SUB INS\", \"2\": \"PRF STR ATH ETI LAR ACA POL PER\", \"1\": \"AWA MEL TEC FIN SUR FIR DRV MED INV\" }, \"clandiscs\": { \"disc1\": [\"Celerity\", 1], \"disc2\": [\"Presence\", 3], \"disc3\": [\"Potence\", 2] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"Sage Sam\": { \"base\": {\"clan\": \"Malkavian\", \"faction\": \"Anarch\", \"blood_potency\": 5, \"humanity\": 8, \"stains\": 0 }, \"attributes\": { \"strength\": 2, \"dexterity\": 4, \"stamina\": 2, \"charisma\": 1, \"manipulation\": 2, \"composure\": 2, \"intelligence\": 5, \"wits\": 4, \"resolve\": 2 }, \"skills\": { \"6\": \"\", \"5\": \"\", \"4\": \"OCC INS\", \"3\": \"STL ACA POL STR\", \"2\": \"ATH SUB FIN MED SCI\", \"1\": \"BRA LAR MEL INT LED PER SUR DRV TEC ETI\" }, \"clandiscs\": { \"disc1\": [\"Auspex\", 4], \"disc2\": [\"Dominate\", 1], \"disc3\": [\"Obfuscate\", 3] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"FOR\" } },\"Laz, Sheriff\": { \"base\": {\"clan\": \"Nosferatu\", \"faction\": \"Camarilla\", \"blood_potency\": 3, \"humanity\": 8, \"stains\": 0 }, \"attributes\": { \"strength\": 2, \"dexterity\": 2, \"stamina\": 4, \"charisma\": 1, \"manipulation\": 1, \"composure\": 3, \"intelligence\": 3, \"wits\": 3, \"resolve\": 5 }, \"skills\": { \"6\": \"\", \"5\": \"INV\", \"4\": \"AWA BRA INS\", \"3\": \"MEL STR\", \"2\": \"STE TEC ANK INT POL LED\", \"1\": \"ATH FIR SUR SUB\" }, \"clandiscs\": { \"disc1\": [\"Animalism\", 2], \"disc2\": [\"Obfuscate\", 4], \"disc3\": [\"Potence\", 3] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"Rosie\": { \"base\": {\"clan\": \"Nosferatu\", \"faction\": \"Anarch\", \"blood_potency\": 4, \"humanity\": 6, \"stains\": 0 }, \"attributes\": { \"strength\": 2, \"dexterity\": 1, \"stamina\": 2, \"charisma\": 3, \"manipulation\": 4, \"composure\": 5, \"intelligence\": 2, \"wits\": 4, \"resolve\": 2 }, \"skills\": { \"6\": \"\", \"5\": \"INS PER POL\", \"4\": \"SUB ACA ETI\", \"3\": \"ANK LED\", \"2\": \"STL\", \"1\": \"ATH MEL\" }, \"clandiscs\": { \"disc1\": [\"Animalism\", 4], \"disc2\": [\"Obfuscate\", 3], \"disc3\": [\"Potence\", 2] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"PRE\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"Wesley Richardson\": { \"base\": {\"clan\": \"Thin-Blooded\", \"faction\": \"Anarch\", \"blood_potency\": 0, \"humanity\": 9, \"stains\": 0 }, \"attributes\": { \"strength\": 2, \"dexterity\": 3, \"stamina\": 2, \"charisma\": 2, \"manipulation\": 2, \"composure\": 1, \"intelligence\": 4, \"wits\": 3, \"resolve\": 3 }, \"skills\": { \"6\": \"\", \"5\": \"OCC\", \"4\": \"SCI\", \"3\": \"TEC INS\", \"2\": \"AWA BRA STL\", \"1\": \"PER LED POL\" }, \"clandiscs\": { \"disc1\": [\"Alchemy\", 3], \"disc2\": [], \"disc3\": [] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"Calvin Wallace\": { \"base\": {\"clan\": \"Brujah\", \"faction\": \"Anarch\", \"blood_potency\": 1, \"humanity\": 7, \"stains\": 0 }, \"attributes\": { \"strength\": 2, \"dexterity\": 2, \"stamina\": 3, \"charisma\": 4, \"manipulation\": 3, \"composure\": 3, \"intelligence\": 2, \"wits\": 1, \"resolve\": 2 }, \"skills\": { \"6\": \"\", \"5\": \"\", \"4\": \"\", \"3\": \"PRF PER LED\", \"2\": \"INT AWA MEL POL SUB\", \"1\": \"ACA ETI INS STR BRA FIR INV\" }, \"clandiscs\": { \"disc1\": [\"Celerity\", 1], \"disc2\": [\"Presence\", 2], \"disc3\": [\"Potence\", 1] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"Professor Ethan Keen\": { \"base\": {\"clan\": \"Malkavian\", \"faction\": \"Anarch\", \"blood_potency\": 1, \"humanity\": 7, \"stains\": 0 }, \"attributes\": { \"strength\": 2, \"dexterity\": 2, \"stamina\": 1, \"charisma\": 1, \"manipulation\": 4, \"composure\": 2, \"intelligence\": 4, \"wits\": 2, \"resolve\": 4 }, \"skills\": { \"6\": \"\", \"5\": \"\", \"4\": \"INS\", \"3\": \"ACA OCC POL\", \"2\": \"FIN MED INV\", \"1\": \"STR SUB SUR\" }, \"clandiscs\": { \"disc1\": [\"Auspex\", 1], \"disc2\": [\"Dominate\", 1], \"disc3\": [\"Obfuscate\", 0] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"SOR PTN\" } },\"Damien Abanda\": { \"base\": {\"clan\": \"Toreador\", \"faction\": \"Anarch\", \"blood_potency\": 1, \"humanity\": 6, \"stains\": 0 }, \"attributes\": { \"strength\": 2, \"dexterity\": 3, \"stamina\": 2, \"charisma\": 4, \"manipulation\": 4, \"composure\": 2, \"intelligence\": 2, \"wits\": 2, \"resolve\": 1 }, \"skills\": { \"6\": \"\", \"5\": \"\", \"4\": \"ETI\", \"3\": \"PER SUB POL\", \"2\": \"INS LED INV FIN\", \"1\": \"ATH BRA MEL LAR INT AWA TEC\" }, \"clandiscs\": { \"disc1\": [\"Auspex\", 1], \"disc2\": [\"Celerity\", 2], \"disc3\": [\"Presence\", 3] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"J\": { \"base\": {\"clan\": \"Brujah\", \"faction\": \"Anarch\", \"blood_potency\": 2, \"humanity\": 6, \"stains\": 0 }, \"attributes\": { \"strength\": 4, \"dexterity\": 3, \"stamina\": 3, \"charisma\": 2, \"manipulation\": 1, \"composure\": 2, \"intelligence\": 3, \"wits\": 2, \"resolve\": 2 }, \"skills\": { \"6\": \"\", \"5\": \"\", \"4\": \"BRA\", \"3\": \"ATH STR LED\", \"2\": \"AWA INV MEL STL\", \"1\": \"DRV FIR LAR POL INS INT SUR\" }, \"clandiscs\": { \"disc1\": [\"Celerity\", 2], \"disc2\": [\"Presence\", 1], \"disc3\": [\"Potence\", 3] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"Stalker Todd\": { \"base\": {\"clan\": \"Gangrel\", \"faction\": \"Anarch\", \"blood_potency\": 2, \"humanity\": 5, \"stains\": 0 }, \"attributes\": { \"strength\": 3, \"dexterity\": 3, \"stamina\": 4, \"charisma\": 1, \"manipulation\": 2, \"composure\": 2, \"intelligence\": 2, \"wits\": 2, \"resolve\": 3 }, \"skills\": { \"6\": \"\", \"5\": \"\", \"4\": \"ATH\", \"3\": \"MEL STR INV\", \"2\": \"BRA STL SUR\", \"1\": \"ANK INT AWA\" }, \"clandiscs\": { \"disc1\": [\"Animalism\", 1], \"disc2\": [\"Fortitude\", 0], \"disc3\": [\"Protean\", 3] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"Reaper\": { \"base\": {\"clan\": \"Gangrel\", \"faction\": \"Anarch\", \"blood_potency\": 3, \"humanity\": 5, \"stains\": 0 }, \"attributes\": { \"strength\": 3, \"dexterity\": 5, \"stamina\": 2, \"charisma\": 2, \"manipulation\": 1, \"composure\": 2, \"intelligence\": 2, \"wits\": 2, \"resolve\": 3 }, \"skills\": { \"6\": \"\", \"5\": \"MEL\", \"4\": \"ATH\", \"3\": \"STR LAR\", \"2\": \"INS INT ANK\", \"1\": \"INV MED SUR\" }, \"clandiscs\": { \"disc1\": [\"Animalism\", 2], \"disc2\": [\"Fortitude\", 0], \"disc3\": [\"Protean\", 4] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"Leah Hawk\": { \"base\": {\"clan\": \"Gangrel\", \"faction\": \"Anarch\", \"blood_potency\": 2, \"humanity\": 6, \"stains\": 0 }, \"attributes\": { \"strength\": 3, \"dexterity\": 2, \"stamina\": 2, \"charisma\": 3, \"manipulation\": 4, \"composure\": 3, \"intelligence\": 2, \"wits\": 1, \"resolve\": 2 }, \"skills\": { \"6\": \"\", \"5\": \"\", \"4\": \"\", \"3\": \"PRF SUB INS\", \"2\": \"ATH MEL ANK INT INV\", \"1\": \"BRA LAR STL SUR PER AWA POL\" }, \"clandiscs\": { \"disc1\": [\"Animalism\", 2], \"disc2\": [\"Fortitude\", 1], \"disc3\": [\"Protean\", 1] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"Old Quentin\": { \"base\": {\"clan\": \"Malkavian\", \"faction\": \"Anarch\", \"blood_potency\": 4, \"humanity\": 7, \"stains\": 0 }, \"attributes\": { \"strength\": 2, \"dexterity\": 3, \"stamina\": 3, \"charisma\": 4, \"manipulation\": 6, \"composure\": 5, \"intelligence\": 3, \"wits\": 3, \"resolve\": 5 }, \"skills\": { \"6\": \"SUB\", \"5\": \"INS STL\", \"4\": \"ETI STR ACA AWA OCC\", \"3\": \"BRA MEL ATH INV\", \"2\": \"FIN POL LAR SUR ANK TEC\", \"1\": \"CRA MED LED SCI FIR DRV\" }, \"clandiscs\": { \"disc1\": [\"Auspex\", 4], \"disc2\": [\"Dominate\", 5], \"disc3\": [\"Obfuscate\", 5] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"PTN\", \"3\": \"FOR\", \"2\": \"CEL\", \"1\": \"ANI\" } },\"Maxwell 'Max' Floyd\": { \"base\": {\"clan\": \"Brujah\", \"faction\": \"Anarch\", \"blood_potency\": 2, \"humanity\": 5, \"stains\": 0 }, \"attributes\": { \"strength\": 3, \"dexterity\": 2, \"stamina\": 2, \"charisma\": 4, \"manipulation\": 2, \"composure\": 4, \"intelligence\": 2, \"wits\": 1, \"resolve\": 2 }, \"clandiscs\": { \"disc1\": [\"Celerity\", 2], \"disc2\": [\"Presence\", 2], \"disc3\": [\"Potence\", 4] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"Mr. Easy\": { \"base\": {\"clan\": \"Malkavian\", \"faction\": \"Anarch\", \"blood_potency\": 1, \"humanity\": 5, \"stains\": 0 }, \"attributes\": { \"strength\": 3, \"dexterity\": 3, \"stamina\": 2, \"charisma\": 1, \"manipulation\": 2, \"composure\": 2, \"intelligence\": 4, \"wits\": 3, \"resolve\": 2 }, \"clandiscs\": { \"disc1\": [\"Auspex\", 1], \"disc2\": [\"Dominate\", 0], \"disc3\": [\"Obfuscate\", 2] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"ANI\", \"1\": \"POT\" } },\"Twist\": { \"base\": {\"clan\": \"Nosferatu\", \"faction\": \"Anarch\", \"blood_potency\": 1, \"humanity\": 3, \"stains\": 0 }, \"attributes\": { \"strength\": 4, \"dexterity\": 3, \"stamina\": 3, \"charisma\": 1, \"manipulation\": 2, \"composure\": 2, \"intelligence\": 3, \"wits\": 2, \"resolve\": 2 }, \"clandiscs\": { \"disc1\": [\"Animalism\", 1], \"disc2\": [\"Obfuscate\", 1], \"disc3\": [\"Potence\", 1] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"PTN\" } },\"Jason\": { \"base\": {\"clan\": \"Gangrel\", \"faction\": \"Anarch\", \"blood_potency\": 2, \"humanity\": 6, \"stains\": 0 }, \"attributes\": { \"strength\": 4, \"dexterity\": 3, \"stamina\": 3, \"charisma\": 2, \"manipulation\": 1, \"composure\": 2, \"intelligence\": 2, \"wits\": 2, \"resolve\": 3 }, \"clandiscs\": { \"disc1\": [\"Animalism\", 0], \"disc2\": [\"Fortitude\", 2], \"disc3\": [\"Protean\", 4] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"POT\", \"1\": \"\" } },\"Wallflower\": { \"base\": {\"clan\": \"Gangrel\", \"faction\": \"Anarch\", \"blood_potency\": 1, \"humanity\": 6, \"stains\": 0 }, \"attributes\": { \"strength\": 3, \"dexterity\": 4, \"stamina\": 3, \"charisma\": 2, \"manipulation\": 1, \"composure\": 2, \"intelligence\": 2, \"wits\": 2, \"resolve\": 3 }, \"clandiscs\": { \"disc1\": [\"Animalism\", 0], \"disc2\": [\"Fortitude\", 3], \"disc3\": [\"Protean\", 1] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"Kit Edwards\": { \"base\": {\"clan\": \"Thin-Blooded\", \"faction\": \"Anarch\", \"blood_potency\": 0, \"humanity\": 6, \"stains\": 0 }, \"attributes\": { \"strength\": 4, \"dexterity\": 3, \"stamina\": 3, \"charisma\": 2, \"manipulation\": 3, \"composure\": 2, \"intelligence\": 1, \"wits\": 2, \"resolve\": 2 }, \"clandiscs\": { \"disc1\": [\"Alchemy\", 1], \"disc2\": [], \"disc3\": [] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"Toni Gomez\": { \"base\": {\"clan\": \"Thin-Blooded\", \"faction\": \"Anarch\", \"blood_potency\": 0, \"humanity\": 7, \"stains\": 0 }, \"attributes\": { \"strength\": 2, \"dexterity\": 2, \"stamina\": 3, \"charisma\": 3, \"manipulation\": 3, \"composure\": 2, \"intelligence\": 2, \"wits\": 4, \"resolve\": 1 }, \"clandiscs\": { \"disc1\": [\"Alchemy\", 1], \"disc2\": [], \"disc3\": [] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"Ren\": { \"base\": {\"clan\": \"Ministry\", \"faction\": \"Anarch\", \"blood_potency\": 5, \"humanity\": 6, \"stains\": 0 }, \"attributes\": { \"strength\": 1, \"dexterity\": 3, \"stamina\": 2, \"charisma\": 5, \"manipulation\": 3, \"composure\": 4, \"intelligence\": 2, \"wits\": 4, \"resolve\": 2 }, \"skills\": { \"6\": \"\", \"5\": \"INS PER SUB STR\", \"4\": \"STL ETI LED\", \"3\": \"OCC\", \"2\": \"SUR\", \"1\": \"POL MEL\" }, \"clandiscs\": { \"disc1\": [\"Obfuscate\", 2], \"disc2\": [\"Presence\", 4], \"disc3\": [\"Protean\", 3] }, \"otherdiscs\": { \"5\": \"AUS\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"CEL\" } },\"Tyler\": { \"base\": {\"clan\": \"Ministry\", \"faction\": \"Anarch\", \"blood_potency\": 3, \"humanity\": 6, \"stains\": 0 }, \"attributes\": { \"strength\": 2, \"dexterity\": 2, \"stamina\": 1, \"charisma\": 4, \"manipulation\": 3, \"composure\": 3, \"intelligence\": 3, \"wits\": 2, \"resolve\": 2 }, \"skills\": { \"6\": \"\", \"5\": \"INS\", \"4\": \"PER SUB\", \"3\": \"STL MEL\", \"2\": \"STR SUR\", \"1\": \"ATH BRA DRV\" }, \"clandiscs\": { \"disc1\": [\"Obfuscate\", 1], \"disc2\": [\"Presence\", 3], \"disc3\": [\"Protean\", 4] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"Alexandra\": { \"base\": {\"clan\": \"Ministry\", \"faction\": \"Anarch\", \"blood_potency\": 3, \"humanity\": 4, \"stains\": 0 }, \"attributes\": { \"strength\": 2, \"dexterity\": 2, \"stamina\": 1, \"charisma\": 4, \"manipulation\": 5, \"composure\": 3, \"intelligence\": 4, \"wits\": 2, \"resolve\": 2 }, \"skills\": { \"6\": \"\", \"5\": \"SUB ETI PER\", \"4\": \"INS STL\", \"3\": \"INT LAR\", \"2\": \"ATH STR\", \"1\": \"POL SUR\" }, \"clandiscs\": { \"disc1\": [\"Obfuscate\", 1], \"disc2\": [\"Presence\", 4], \"disc3\": [\"Protean\", 3] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"AUS\", \"2\": \"\", \"1\": \"\" } },\"Kai\": { \"base\": {\"clan\": \"Ministry\", \"faction\": \"Anarch\", \"blood_potency\": 3, \"humanity\": 9, \"stains\": 0 }, \"attributes\": { \"strength\": 2, \"dexterity\": 3, \"stamina\": 2, \"charisma\": 4, \"manipulation\": 3, \"composure\": 3, \"intelligence\": 2, \"wits\": 2, \"resolve\": 1 }, \"skills\": { \"6\": \"\", \"5\": \"PER\", \"4\": \"PRF \", \"3\": \"ETI INS\", \"2\": \"AWA SUB STL\", \"1\": \"BRA FIR DRV\" }, \"clandiscs\": { \"disc1\": [\"Obfuscate\", 0], \"disc2\": [\"Presence\", 4], \"disc3\": [\"Protean\", 2] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"Kingston 'King' Black\": { \"base\": {\"clan\": \"Brujah\", \"faction\": \"Anarch\", \"blood_potency\": 1, \"humanity\": 9, \"stains\": 0 }, \"attributes\": { \"strength\": 3, \"dexterity\": 3, \"stamina\": 3, \"charisma\": 2, \"manipulation\": 1, \"composure\": 2, \"intelligence\": 2, \"wits\": 2, \"resolve\": 4 }, \"skills\": { \"6\": \"\", \"5\": \"\", \"4\": \"MEL\", \"3\": \"INT ATH OCC\", \"2\": \"STR LED PER FIR\", \"1\": \"BRA ACA AWA ETI ANI TEC INV SUB\" }, \"clandiscs\": { \"disc1\": [\"Celerity\", 2], \"disc2\": [\"Presence\", 1], \"disc3\": [\"Potence\", 3] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"Mason Schmidt\": { \"base\": {\"clan\": \"Brujah\", \"faction\": \"Anarch\", \"blood_potency\": 2, \"humanity\": 7, \"stains\": 0 }, \"attributes\": { \"strength\": 3, \"dexterity\": 3, \"stamina\": 4, \"charisma\": 2, \"manipulation\": 1, \"composure\": 2, \"intelligence\": 2, \"wits\": 2, \"resolve\": 3 }, \"clandiscs\": { \"disc1\": [\"Celerity\", 2], \"disc2\": [\"Presence\", 1], \"disc3\": [\"Potence\", 1] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"Jack-be-Nimble\": { \"base\": {\"clan\": \"Nosferatu\", \"faction\": \"Anarch\", \"blood_potency\": 2, \"humanity\": 7, \"stains\": 0 }, \"attributes\": { \"strength\": 3, \"dexterity\": 4, \"stamina\": 3, \"charisma\": 1, \"manipulation\": 2, \"composure\": 2, \"intelligence\": 2, \"wits\": 3, \"resolve\": 2 }, \"clandiscs\": { \"disc1\": [\"Animalism\", 0], \"disc2\": [\"Obfuscate\", 3], \"disc3\": [\"Potence\", 0] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"CEL\" } },\"Amos Jax\": { \"base\": {\"clan\": \"Gangrel\", \"faction\": \"Anarch\", \"blood_potency\": 2, \"humanity\": 3, \"stains\": 0 }, \"attributes\": { \"strength\": 3, \"dexterity\": 3, \"stamina\": 4, \"charisma\": 2, \"manipulation\": 2, \"composure\": 2, \"intelligence\": 3, \"wits\": 1, \"resolve\": 2 }, \"clandiscs\": { \"disc1\": [\"Animalism\", 1], \"disc2\": [\"Fortitude\", 1], \"disc3\": [\"Protean\", 2] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"Yusef Shamsin\": { \"base\": {\"clan\": \"Nosferatu\", \"faction\": \"Anarch\", \"blood_potency\": 2, \"humanity\": 7, \"stains\": 0 }, \"attributes\": { \"strength\": 4, \"dexterity\": 3, \"stamina\": 4, \"charisma\": 3, \"manipulation\": 2, \"composure\": 3, \"intelligence\": 6, \"wits\": 3, \"resolve\": 4 }, \"clandiscs\": { \"disc1\": [\"Animalism\", 4], \"disc2\": [\"Obfuscate\", 2], \"disc3\": [\"Potence\", 2] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"Drake\": { \"base\": {\"clan\": \"Nosferatu\", \"faction\": \"Camarilla\", \"blood_potency\": 5, \"humanity\": 5, \"stains\": 0 }, \"attributes\": { \"strength\": 3, \"dexterity\": 4, \"stamina\": 3, \"charisma\": 3, \"manipulation\": 3, \"composure\": 4, \"intelligence\": 6, \"wits\": 2, \"resolve\": 4 }, \"clandiscs\": { \"disc1\": [\"Animalism\", 0], \"disc2\": [\"Obfuscate\", 5], \"disc3\": [\"Potence\", 3] }, \"otherdiscs\": { \"5\": \"CEL\", \"4\": \"SOR\", \"3\": \"FOR\", \"2\": \"\", \"1\": \"\" } },\"Alistair Etrata\": { \"base\": {\"clan\": \"Banu Haqim\", \"faction\": \"Camarilla\", \"blood_potency\": 6, \"humanity\": 4, \"stains\": 0 }, \"attributes\": { \"strength\": 4, \"dexterity\": 5, \"stamina\": 2, \"charisma\": 3, \"manipulation\": 2, \"composure\": 2, \"intelligence\": 4, \"wits\": 2, \"resolve\": 1 }, \"skills\": { \"6\": \"\", \"5\": \"MEL INS AWA POL\", \"4\": \"STL ACA OCC LED\", \"3\": \"ATH SUR INV SUB\", \"2\": \"ETI ANK\", \"1\": \"LAR\" }, \"clandiscs\": { \"disc1\": [\"Celerity\", 5], \"disc2\": [\"Obfuscate\", 3], \"disc3\": [\"Blood Sorcery\", 4] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"POT\", \"1\": \"FOR DOM\" } },\"Sinclair Rodriguez\": { \"base\": {\"clan\": \"Banu Haqim\", \"faction\": \"Camarilla\", \"blood_potency\": 4, \"humanity\": 6, \"stains\": 0 }, \"attributes\": { \"strength\": 2, \"dexterity\": 2, \"stamina\": 2, \"charisma\": 5, \"manipulation\": 3, \"composure\": 4, \"intelligence\": 3, \"wits\": 1, \"resolve\": 4 }, \"skills\": { \"6\": \"\", \"5\": \"LED POL SUB INS\", \"4\": \"PER ETI FIR\", \"3\": \"AWA\", \"2\": \"INT\", \"1\": \"MEL ATH\" }, \"clandiscs\": { \"disc1\": [\"Celerity\", 1], \"disc2\": [\"Obfuscate\", 0], \"disc3\": [\"Blood Sorcery\", 0] }, \"otherdiscs\": { \"5\": \"PRE\", \"4\": \"DOM\", \"3\": \"FOR\", \"2\": \"AUS\", \"1\": \"\" } },\"Prince Osborne Lowell\": { \"base\": {\"clan\": \"Ventrue\", \"faction\": \"Camarilla\", \"blood_potency\": 4, \"humanity\": 6, \"stains\": 0 }, \"attributes\": { \"strength\": 5, \"dexterity\": 4, \"stamina\": 2, \"charisma\": 2, \"manipulation\": 2, \"composure\": 2, \"intelligence\": 3, \"wits\": 1, \"resolve\": 4 }, \"skills\": { \"6\": \"\", \"5\": \"MEL\", \"4\": \"OCC INT STL\", \"3\": \"INS STR SUB INV\", \"2\": \"SUR ETI POL\", \"1\": \"ATH BRA LAR AWA\" }, \"clandiscs\": { \"disc1\": [\"Dominate\", 4], \"disc2\": [\"Fortitude\", 0], \"disc3\": [\"Presence\", 0] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"CEL\", \"2\": \"SOR\", \"1\": \"AUS POT\" } },\"Raphael Bishop\": { \"base\": {\"clan\": \"Tremere\", \"faction\": \"Camarilla\", \"blood_potency\": 4, \"humanity\": 5, \"stains\": 0 }, \"attributes\": { \"strength\": 2, \"dexterity\": 5, \"stamina\": 3, \"charisma\": 1, \"manipulation\": 2, \"composure\": 2, \"intelligence\": 4, \"wits\": 4, \"resolve\": 2 }, \"skills\": { \"6\": \"\", \"5\": \"MEL ATH STL\", \"4\": \"INS SUB AWA\", \"3\": \"INV STR\", \"2\": \"LAR\", \"1\": \"SUR BRA\" }, \"clandiscs\": { \"disc1\": [\"Auspex\", 0], \"disc2\": [\"Dominate\", 0], \"disc3\": [\"Blood Sorcery\", 0] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"OBF\", \"3\": \"ANI POT\", \"2\": \"\", \"1\": \"CEL FOR PTN\" } },\"Emily, the Dusk Rose\": { \"base\": {\"clan\": \"Nosferatu\", \"faction\": \"Camarilla\", \"blood_potency\": 3, \"humanity\": 5, \"stains\": 0 }, \"attributes\": { \"strength\": 1, \"dexterity\": 3, \"stamina\": 2, \"charisma\": 5, \"manipulation\": 2, \"composure\": 3, \"intelligence\": 2, \"wits\": 4, \"resolve\": 2 }, \"clandiscs\": { \"disc1\": [\"Animalism\", 2], \"disc2\": [\"Obfuscate\", 3], \"disc3\": [\"Potence\", 1] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"PRE\", \"1\": \"DOM\" } },\"The Aristocrat\": { \"base\": {\"clan\": \"Nosferatu\", \"faction\": \"Camarilla\", \"blood_potency\": 2, \"humanity\": 5, \"stains\": 0 }, \"attributes\": { \"strength\": 2, \"dexterity\": 2, \"stamina\": 1, \"charisma\": 4, \"manipulation\": 3, \"composure\": 2, \"intelligence\": 3, \"wits\": 3, \"resolve\": 2 }, \"clandiscs\": { \"disc1\": [\"Animalism\", 1], \"disc2\": [\"Obfuscate\", 1], \"disc3\": [\"Potence\", 4] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"PRE\", \"2\": \"AUS\", \"1\": \"\" } },\"Christianne\": { \"base\": {\"clan\": \"Toreador\", \"faction\": \"Camarilla\", \"blood_potency\": 2, \"humanity\": 6, \"stains\": 0 }, \"attributes\": { \"strength\": 2, \"dexterity\": 2, \"stamina\": 2, \"charisma\": 3, \"manipulation\": 4, \"composure\": 3, \"intelligence\": 3, \"wits\": 2, \"resolve\": 1 }, \"clandiscs\": { \"disc1\": [\"Auspex\", 0], \"disc2\": [\"Celerity\", 0], \"disc3\": [\"Presence\", 3] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"DOM\", \"3\": \"\", \"2\": \"\", \"1\": \"FOR\" } },\"Xavier Whitchurch\": { \"base\": {\"clan\": \"Ventrue\", \"faction\": \"Camarilla\", \"blood_potency\": 2 }, \"clandiscs\": { \"disc1\": [\"Dominate\", 3], \"disc2\": [\"Fortitude\", 0], \"disc3\": [\"Presence\", 1] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"Ian Rammond\": { \"base\": {\"clan\": \"Nosferatu\", \"faction\": \"Camarilla\", \"blood_potency\": 2 } },\"Terry\": { \"base\": {\"clan\": \"Nosferatu\", \"faction\": \"Camarilla\", \"blood_potency\": 2 } },\"Tommy\": { \"base\": {\"clan\": \"Nosferatu\", \"faction\": \"Camarilla\", \"blood_potency\": 1 } },\"I.Q.\": { \"base\": {\"clan\": \"Nosferatu\", \"faction\": \"Camarilla\", \"blood_potency\": 3, \"humanity\": 5, \"stains\": 0 }, \"attributes\": { \"strength\": 2, \"dexterity\": 3, \"stamina\": 2, \"charisma\": 2, \"manipulation\": 3, \"composure\": 1, \"intelligence\": 4, \"wits\": 3, \"resolve\": 2 }, \"skills\": { \"6\": \"\", \"5\": \"\", \"4\": \"OCC\", \"3\": \"MEL STL SUB\", \"2\": \"ATH LAR INT AWA\", \"1\": \"BRA SUR ETI INS STR INV POL\" }, \"clandiscs\": { \"disc1\": [\"Animalism\", 0], \"disc2\": [\"Obfuscate\", 0], \"disc3\": [\"Potence\", 2] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"OBV\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"Alexander\": { \"base\": {\"clan\": \"Lasombra\", \"faction\": \"Sabbat\", \"blood_potency\": 4, \"humanity\": 3, \"stains\": 0 }, \"attributes\": { \"strength\": 3, \"dexterity\": 3, \"stamina\": 4, \"charisma\": 1, \"manipulation\": 2, \"composure\": 2, \"intelligence\": 2, \"wits\": 2, \"resolve\": 3 }, \"clandiscs\": { \"disc1\": [\"Dominate\", 0], \"disc2\": [\"Oblivion\", 0], \"disc3\": [\"Potence\", 2] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"OBF\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"Sang-Froid\": { \"base\": {\"clan\": \"Nosferatu\", \"faction\": \"Sabbat\", \"blood_potency\": 3, \"humanity\": 6, \"stains\": 0 }, \"attributes\": { \"strength\": 4, \"dexterity\": 6, \"stamina\": 5, \"charisma\": 2, \"manipulation\": 3, \"composure\": 3, \"intelligence\": 5, \"wits\": 3, \"resolve\": 3 }, \"clandiscs\": { \"disc1\": [\"Animalism\", 0], \"disc2\": [\"Obfuscate\", 4], \"disc3\": [\"Potence\", 0] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"FOR\", \"2\": \"AUS\", \"1\": \"PTN\" } },\"The Piece-Taker\": { \"base\": {\"clan\": \"Banu Haqim\", \"faction\": \"Autarkis\", \"blood_potency\": 7, \"humanity\": 1, \"stains\": 0 }, \"attributes\": { \"strength\": 6, \"dexterity\": 5, \"stamina\": 5, \"charisma\": 3, \"manipulation\": 3, \"composure\": 3, \"intelligence\": 2, \"wits\": 3, \"resolve\": 4 }, \"skills\": { \"6\": \"MEL STL\", \"5\": \"ATH BRA SUB OCC INT STR\", \"4\": \"INV AWA\", \"3\": \"SUR ANK\", \"2\": \"LAR\", \"1\": \"INS\" }, \"clandiscs\": { \"disc1\": [\"Celerity\", 2], \"disc2\": [\"Obfuscate\", 5], \"disc3\": [\"Blood Sorcery\", 0] }, \"otherdiscs\": { \"5\": \"POT ANI\", \"4\": \"PTN\", \"3\": \"FOR\", \"2\": \"\", \"1\": \"\" } },\"The Island Devil\": { \"base\": {\"clan\": \"Nosferatu\", \"faction\": \"Autarkis\" } },\"Anita Morris\": { \"base\": {\"clan\": \"Tremere\", \"faction\": \"Camarilla\", \"blood_potency\": 1, \"humanity\": 7, \"stains\": 0 }, \"attributes\": { \"strength\": 2, \"dexterity\": 2, \"stamina\": 3, \"charisma\": 2, \"manipulation\": 1, \"composure\": 2, \"intelligence\": 4, \"wits\": 3, \"resolve\": 3 }, \"skills\": { \"6\": \"\", \"5\": \"SCI\", \"4\": \"OCC\", \"3\": \"ACA TEC\", \"2\": \"INV AWA MED\", \"1\": \"PER SUB STR\" }, \"clandiscs\": { \"disc1\": [\"Auspex\", 2], \"disc2\": [\"Dominate\", 0], \"disc3\": [\"Blood Sorcery\", 4] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"\", \"2\": \"\", \"1\": \"\" } },\"Agnes Bellanger\": { \"base\": {\"clan\": \"Toreador\", \"faction\": \"Camarilla\", \"blood_potency\": 5, \"humanity\": 5, \"stains\": 0 }, \"clandiscs\": { \"disc1\": [\"Auspex\", 5], \"disc2\": [\"Celerity\", 5], \"disc3\": [\"Presence\", 5] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"POT\", \"3\": \"FOR\", \"2\": \"DOM\", \"1\": \"\" } },\"Mylene 'the Puck' Hamelin\": { \"base\": {\"clan\": \"Ventrue\", \"faction\": \"Camarilla\", \"blood_potency\": 3, \"humanity\": 5, \"stains\": 0 }, \"clandiscs\": { \"disc1\": [\"Dominate\", 4], \"disc2\": [\"Fortitude\", 5], \"disc3\": [\"Presence\", 2] }, \"otherdiscs\": { \"5\": \"\", \"4\": \"\", \"3\": \"AUS\", \"2\": \"\", \"1\": \"ANI\" } }}";
    // #endregion

    // #region Register Characters & Token Image Alternates,
    const registerChar = (msg, shortName, initial, quadrant) => {
        if (D.GetSelected(msg).length > 1)
            return THROW("Please select only one token.", "registerChar");
        const charObj = D.GetChar(msg);
        const tokenObj = D.GetSelected(msg)[0];
        const charID = charObj.id;
        const charName = D.GetName(charObj);
        const playerID = D.GetPlayerID(charObj);
        const playerName = D.GetName(D.GetPlayer(playerID));
        if (!charObj)
            return THROW("No character found!", "registerChar");
        if (!tokenObj)
            return THROW("Please select a character token.", "registerChar");
        if (!D.IsIn(quadrant, Object.keys(C.QUADRANTS), true))
            return THROW(`Quadrant must be one of: ${Object.keys(C.QUADRANTS).join(", ")}.`, "registerChar");
        if (!Media.RegToken(tokenObj))
            return THROW("Token registration failed.", "registerChar");
        REGISTRY[quadrant] = {
            id: charID,
            name: charName,
            playerID,
            playerName,
            tokenName: charName,
            shortName,
            initial,
            quadrant
        };
        D.Alert(`${D.JSL(charName)} Registered to ${quadrant} quadrant:<br><br>${D.JS(REGISTRY[quadrant])}`, "registerChar");
        return true;
    };
    const unregisterChar = (nameRef) => {
        if (VAL({string: nameRef}, "unregisterChar")) {
            const regKey = _.findKey(REGISTRY, (v) => D.FuzzyMatch(v.name, nameRef));
            // D.Alert(`nameRef: ${nameRef}<br>regKey: ${D.JS(regKey)}`, "unregisterChar")
            if (REGISTRY[regKey])
                delete REGISTRY[regKey];
        }
    };
    // #endregion

    // #region SETTERS: Moving Tokens, Toggling Characters
    const sendCharsHome = (charRef = "registered") => {
        const charTokens = _.groupBy(_.compact(Media.GetTokens(charRef)), (v) => (VAL({pc: v}) && "pc") || "npc");
        DB({charRef, charTokens, mediaGet: Media.GetTokens(charRef)}, "sendCharsHome");

        STATE.REF.tokenRecord = charTokens && _.flatten(Object.values(charTokens)).map((x) => ({id: x.id, left: x.get("left"), top: x.get("top")}));
        for (const token of charTokens.pc || []) {
            const quad = D.GetCharData(token).quadrant;
            Media.ToggleImg(token, true);
            token.set("layer", "objects");
            Media.SetArea(token, `${quad}Token`);
        }
        for (const token of charTokens.npc || [])
            token.set("layer", "walls");
    };
    const restoreCharsPos = () => {
        for (const tokenData of STATE.REF.tokenRecord)
            (getObj("graphic", tokenData.id) || {set: () => false}).set({left: tokenData.left, top: tokenData.top, layer: "objects"});
        STATE.REF.tokenRecord = [];
    };
    const togglePlayerChar = (charRef, isActive) => {
        if (isActive === true || isActive === false) {
            const charData = D.GetCharData(charRef);
            const [tokenObj] = Media.GetTokens(charData.id);
            DB({charRef, charData, tokenObj}, "togglePlayerChar");
            REGISTRY[charData.quadrant].isActive = isActive;
            Media.ToggleImg(tokenObj, isActive, true);
            Media.SetImg(tokenObj, "base");
            Media.ToggleImg(`SignalLight${charData.quadrant}`, isActive);
            Media.ToggleImg(`Hunger${charData.quadrant}`, isActive);
            Media.ToggleImg(`TombstoneShroud${charData.quad}`, !isActive);
        }
    };
    const processTokenPowers = (charRef) => {
        const charID = (D.GetChar(charRef) || {id: false}).id;
        if (charID) {
            const tokenPowerData = Object.assign({}, STATE.REF.tokenPowerData.all || {}, STATE.REF.tokenPowerData[charID] || {});
            const tokenData = Media.GetTokenData(charID);
            const tokenSrc = tokenData && tokenData.curSrc;
            DB({charID, tokenPowerData, tokenData, tokenSrc}, "processTokenPowers");
            if (VAL({string: tokenSrc}))
                for (const [srcName, rollEffect] of Object.entries(tokenPowerData))
                    if (VAL({string: rollEffect}))
                        if (D.LCase(tokenSrc).includes(D.LCase(srcName)))
                            Roller.AddCharEffect(charID, rollEffect);
                        else
                            Roller.DelCharEffect(charID, rollEffect);
        }
    };
    const addCharFlag = (charRef, flagName, removeWhen, flagDisplayName, isGoodFlag = false) => {
        const charObj = D.GetChar(charRef);
        const charFlags = charObj && (D.GetStatVal(charRef, "charflags") || "").split("|");
        if (VAL({charObj, string: flagName})) {
            flagDisplayName = flagDisplayName || flagName;
            D.SetStat(charRef, _.uniq([...charFlags, flagName]).join("|"));
            if (VAL({string: removeWhen}))
                TimeTracker.SetAlarm(
                    removeWhen,
                    "delcharflag",
                    `Remove Flag from ${D.GetName(charObj)}:`,
                    "delcharflag",
                    [charObj.id, flagName, flagDisplayName, isGoodFlag ? "whiteMarble" : "blackMarble"],
                    false
                );
        }
    };
    const delCharFlag = (charRef, flagName) => {
        const charFlags = (D.GetStatVal(charRef, "charflags") || "").split("|");
        D.SetStat(charRef, _.without(charFlags, flagName).join("|"));
    };
    // #endregion

    // #region GETTERS: Checking Character Status, Character Chat Prompt
    const isPlayerCharActive = (charRef) => (D.GetCharData(charRef) || {isActive: null}).isActive;
    const playerSelectMenu = () => {
        D.CommandMenu(
            {
                title: "Player Select Menu",
                rows: [
                    ..._.chain(D.GetChars("allregistered").map((x) => D.GetCharData(x)))
                        .map((x) => ({
                            name: x.playerName,
                            command: `!reply selectplayer@${x.id}, title@${x.playerName}`,
                            styles: {bgColor: (x.isActive && C.COLORS.red) || C.COLORS.black}
                        }))
                        .groupBy((x, i) => Math.floor(i / 4))
                        .map((x) => ({
                            type: "ButtonLine",
                            contents: x.length < 3 ? [0, ...x, 0] : x,
                            buttonStyles: {
                                /* width: "23%", fontSize: "12px", bgColor: C.COLORS.midgold, buttonTransform: "none" */
                            }
                        }))
                        .value()
                ],
                blockStyles: {} /* color, bgGradient, bgColor, bgImage, border, margin, width, padding */
            },
            (commandString) => {
                // IMPORTANT: return 'C.REPLY.KEEPOPEN' if you want to hold this function open for more commands
                const params = D.ParseToObj(commandString, ",", "@"); // key:value pairs must be in key@pairs for this to work. Multiple commands comma-delimited.
                const titleString = params.title;
                if ("selectplayer" in params)
                    playerActionMenu(params.selectplayer, titleString);
            }
        );
    };
    const playerActionMenu = (playerCharID, title) => {
        D.CommandMenu({
            title: title || "Player Action (?)",
            rows: [
                {
                    type: "ButtonLine",
                    contents: [
                        0,
                        {
                            name: "Enable",
                            command: `!char ${playerCharID} toggle true`,
                            styles: {bgColor: (isPlayerCharActive(playerCharID) && C.COLORS.darkgrey) || C.COLORS.darkgreen}
                        },
                        {
                            name: "Disable",
                            command: `!char ${playerCharID} toggle false`,
                            styles: {bgColor: (isPlayerCharActive(playerCharID) && C.COLORS.darkred) || C.COLORS.darkgrey}
                        },
                        0
                    ],
                    buttonStyles: {
                        color: C.COLORS.black
                    } /* height, lineHeight, width, fontFamily, margin, padding, fontSize, bgColor, color, border, fontWeight, textShadow, buttonHeight, buttonWidth, buttonPadding, buttonTransform */,
                    styles: {} /* height, width, margin, textAlign */
                }
            ],
            blockStyles: {} /* color, bgGradient, bgColor, bgImage, border, margin, width, padding */
        });
    };
    const charSelectMenu = (isGettingNPCs = false) => {
        const npcButtonCode = isGettingNPCs
            ? _.chain(Session.SceneChars.filter((x) => VAL({npc: x})))
                .map((x) => {
                    const charName = D.GetName(x, true);
                    return {
                        name: charName,
                        command: `!reply selectchar@${x.id}, title@${charName}`,
                        styles: {
                            bgColor: C.COLORS.darkgrey,
                            color: C.COLORS.white
                        }
                    };
                })
                .groupBy((x, i) => Math.floor(i / 5))
                .map((x) => D.CommandMenuHTML({
                    type: "ButtonLine",
                    contents: x.length < 3 ? [0, ...x, 0] : x
                }))
                .value()
                .join("")
            : "";
        const menuCode = MENUHTML.CharSelect.replace(new RegExp("~~~bgColor:.*?~~~", "gui"), C.COLORS.black).replace(
            new RegExp("~~~npcbuttonrows~~~", "gui"),
            npcButtonCode
        );
        // for (const pc of D.GetChars("registered")) {
        //     const pcName = D.GetName(pc, true),
        //         isInScene = Session.IsInScene(pc)
        //     menuCode = menuCode.replace(new RegExp(`~~~bgColor:${pcName}~~~`, "gui"), isInScene ? C.COLORS.red : C.COLORS.black)
        // }
        D.CommandMenu(menuCode, (commandString) => {
            // IMPORTANT: return 'true' if you want to hold this function open for more commands
            const params = D.ParseToObj(commandString, ",", "@"); // key:value pairs must be in key@pairs for this to work. Multiple commands comma-delimited.
            const titleString = params.title;
            let charIDs = [];
            if ("select" in params) {
                const subParams = params.select.split(/%7C|\|/gu);
                const dbObj = {commandString, params, subParams: D.Clone(subParams), charIDs: [], titleString};
                while (subParams.length) {
                    const thisParam = subParams.shift();
                    const theseCharIDs = D.GetChars(thisParam).map((x) => x.id);
                    dbObj.subParams[thisParam] = theseCharIDs;
                    if (!charIDs.length)
                        charIDs.push(...theseCharIDs);
                    else
                        charIDs = _.intersection(charIDs, theseCharIDs);
                    dbObj.charIDs.push([...charIDs]);
                    if (!charIDs.length) {
                        dbObj.charIDs.push("<b>BREAKING</b>");
                        break;
                    }
                }
                DB(dbObj, "charSelectMenu");
                if (charIDs.length)
                    charActionMenu(charIDs, titleString);
                else
                    D.Alert("No such characters!", "Character Selection Menu");
            }
            if ("selectchar" in params) {
                charIDs.push(params.selectchar);
                DB({commandString, params, charIDs, titleString}, "charSelectMenu");
                charActionMenu(charIDs, D.GetName(charIDs[0]));
            }
        });
    };
    const charActionMenu = (charIDs, titleString) => {
        const isSingleChar = charIDs.length === 1;
        const charIDString = charIDs.join(",");
        const menuCode = (isSingleChar ? MENUHTML.CharActionSingle : MENUHTML.CharActionGroup)
            .replace(new RegExp("~~~title~~~", "gui"), titleString)
            .replace(new RegExp("~~~charIDString~~~", "gui"), charIDString);
        D.CommandMenu(menuCode);
    };
    const promptNumber = (fullCommand) => {
        if (VAL({string: fullCommand}, "promptNumber") && fullCommand.includes("@@AMOUNT@@"))
            D.CommandMenu({
                title: "Choose Amount",
                rows: [
                    {
                        type: "ButtonLine",
                        contents: [
                            5,
                            {name: "+1", command: fullCommand.replace(/@@AMOUNT@@/gu, "1")},
                            {name: "+2", command: fullCommand.replace(/@@AMOUNT@@/gu, "2")},
                            {name: "+3", command: fullCommand.replace(/@@AMOUNT@@/gu, "3")},
                            {name: "+4", command: fullCommand.replace(/@@AMOUNT@@/gu, "4")},
                            {name: "+5", command: fullCommand.replace(/@@AMOUNT@@/gu, "5")},
                            5
                        ],
                        buttonStyles: {bgColor: C.COLORS.darkgreen, fontSize: "14px", fontWeight: "bold"}
                    },
                    {
                        type: "ButtonLine",
                        contents: [
                            5,
                            {name: "+6", command: fullCommand.replace(/@@AMOUNT@@/gu, "6")},
                            {name: "+7", command: fullCommand.replace(/@@AMOUNT@@/gu, "7")},
                            {name: "+8", command: fullCommand.replace(/@@AMOUNT@@/gu, "8")},
                            {name: "+9", command: fullCommand.replace(/@@AMOUNT@@/gu, "9")},
                            {name: "+10", command: fullCommand.replace(/@@AMOUNT@@/gu, "10")},
                            5
                        ],
                        buttonStyles: {bgColor: C.COLORS.darkgreen, fontSize: "14px", fontWeight: "bold"}
                    },
                    {
                        type: "ButtonLine",
                        contents: [5, 0, 0, {name: 0, command: fullCommand.replace(/@@AMOUNT@@/gu, "0")}, 0, 0, 5],
                        buttonStyles: {bgColor: C.COLORS.brightgrey, fontSize: "14px", fontWeight: "bold"}
                    },
                    {
                        type: "ButtonLine",
                        contents: [
                            5,
                            {name: -1, command: fullCommand.replace(/@@AMOUNT@@/gu, "-1")},
                            {name: -2, command: fullCommand.replace(/@@AMOUNT@@/gu, "-2")},
                            {name: -3, command: fullCommand.replace(/@@AMOUNT@@/gu, "-3")},
                            {name: -4, command: fullCommand.replace(/@@AMOUNT@@/gu, "-4")},
                            {name: -5, command: fullCommand.replace(/@@AMOUNT@@/gu, "-5")},
                            5
                        ],
                        buttonStyles: {bgColor: C.COLORS.red, fontSize: "14px", fontWeight: "bold"}
                    },
                    {
                        type: "ButtonLine",
                        contents: [
                            5,
                            {name: -6, command: fullCommand.replace(/@@AMOUNT@@/gu, "-6")},
                            {name: -7, command: fullCommand.replace(/@@AMOUNT@@/gu, "-7")},
                            {name: -8, command: fullCommand.replace(/@@AMOUNT@@/gu, "-8")},
                            {name: -9, command: fullCommand.replace(/@@AMOUNT@@/gu, "-9")},
                            {name: -10, command: fullCommand.replace(/@@AMOUNT@@/gu, "-10")},
                            5
                        ],
                        buttonStyles: {bgColor: C.COLORS.red, fontSize: "14px", fontWeight: "bold"}
                    }
                ]
            });
    };
    const traitSelectMenu = (charIDs, call, argString) => {
        DB({charIDs, call, argString}, "traitSelectMenu");
        const charIDString = charIDs.join(",");
        const attributeTraits = _.object(
            _.flatten(_.zip(...Object.values(C.ATTRIBUTES))).map((x) => D.LCase(x).replace(/ /gu, "_")),
            _.flatten(_.zip(...Object.values(C.ATTRIBUTES))).map((x) => D.UCase(x))
        ); // attr:display name
        const skillTraits = _.object(
            _.flatten(_.zip(...Object.values(C.SKILLS))).map((x) => D.LCase(x).replace(/ /gu, "_")),
            _.flatten(_.zip(...Object.values(C.SKILLS))).map((x) => D.UCase(x))
        );
        const discTraits = _.object(
            _.flatten(Object.keys(C.DISCIPLINES)).map((x) => `&quot;${D.LCase(x)}&quot;`),
            _.flatten(Object.keys(C.DISCIPLINES)).map((x) => D.UCase(x))
        );
        const otherTraits = {
            disciplines: "DISCIPLINES",
            ["blood_potency"]: "BLOOD POT.",
            health: "HEALTH",
            willpower: "WILLPOWER",
            humanity: "HUMANITY",
            hunger: "HUNGER",
            resonance: "RESONANCE",
            xp_earnedtotal: "XP"
        };
        D.CommandMenu({
            title: "Trait Select",
            rows: [
                ..._.chain(attributeTraits)
                    .map((v, k) => ({name: v, command: `${call} ${charIDString} ${argString} ${k}`}))
                    .groupBy((x, i) => Math.floor(i / 3))
                    .map((x) => ({type: "ButtonLine", contents: x, buttonStyles: {bgColor: C.COLORS.brightgold, color: C.COLORS.black}}))
                    .value(),
                {type: "ButtonLine", contents: [0]},
                ..._.chain(skillTraits)
                    .map((v, k) => ({name: v, command: `${call} ${charIDString} ${argString} ${k}`}))
                    .groupBy((x, i) => Math.floor(i / 3))
                    .map((x) => ({type: "ButtonLine", contents: x, buttonStyles: {bgColor: C.COLORS.gold, color: C.COLORS.black}}))
                    .value(),
                {type: "ButtonLine", contents: [0]},
                ..._.chain(discTraits)
                    .map((v, k) => ({name: v, command: `${call} ${charIDString} ${argString} ${k}`}))
                    .groupBy((x, i) => Math.floor(i / 3))
                    .map((x) => ({type: "ButtonLine", contents: x, buttonStyles: {bgColor: C.COLORS.brightred, color: C.COLORS.black}}))
                    .value(),
                {type: "ButtonLine", contents: [0]},
                ..._.chain(otherTraits)
                    .map((v, k) => ({name: v, command: `${call} ${charIDString} ${argString} ${k}`}))
                    .groupBy((x, i) => Math.floor(i / 3))
                    .map((x) => ({type: "ButtonLine", contents: x, buttonStyles: {bgColor: C.COLORS.gold, color: C.COLORS.black}}))
                    .value(),
                argString === "select trait"
                    ? {
                        type: "ButtonLine",
                        contents: [
                            0,
                            0,
                            {
                                name: "ROLL!",
                                command: `!roll ${charIDString} secret selected`,
                                styles: {bgColor: C.COLORS.darkred, color: C.COLORS.gold}
                            },
                            0,
                            0
                        ]
                    }
                    : {type: "ButtonLine", contents: [0]}
            ],
            blockStyles: {padding: "0px 10px 0px 10p" /* color, bgGradient, bgColor, bgImage, border, margin, width, padding */}
        });
    };
    const getTraitData = (charRefs, traitName) => {
        const charOs = D.GetChars(charRefs);
        const returnLines = [];
        for (const charObj of charOs) {
            const traitVal = D.GetStatVal(charObj.id, traitName);
            if (traitVal || traitVal === 0) {
                const [name, value] = [
                    VAL({pc: charObj}) ? `<b>${D.GetName(charObj, true).toUpperCase()}</b>` : D.GetName(charObj, true),
                    VAL({number: traitVal})
                        ? (D.Int(traitVal) === 0 && "~")
                          || (D.Int(traitVal) > 10 && D.Int(traitVal))
                          || `${(D.Int(traitVal) >= 5 && "●●●●● ") || ""}${"●".repeat(D.Int(traitVal) % 5)}`
                        : D.JSL(traitVal)
                ];
                returnLines.push(`<div style="
                        display: inline-block;
                        width: 48%;
                        overflow: hidden;
                        margin-right: 2%;
                    "><span style="
                        display: inline-block;
                        width: 39%;
                        margin-right: 3%;
                        color: ${(value === "~" && C.COLORS.grey) || C.COLORS.white};
                    ">${name}</span><span style="
                        display: inline-block;
                        width: 58%;
                        margin-right: 0%;
                        color: ${(value === "~" && C.COLORS.grey) || C.COLORS.white};
                    ">${value}</span></div>`);
            }
        }
        D.Chat(
            "Storyteller",
            C.HTML.Block(
                [
                    C.HTML.Header(D.Capitalize(C.ATTRDISPLAYNAMES[D.LCase(traitName)] || traitName, true)),
                    C.HTML.Body(
                        Object.values(_.groupBy(returnLines, (x, i) => Math.floor(i / 2)))
                            .map((x) => x.join(""))
                            .join("<br>"),
                        {color: C.COLORS.white, fontWeight: "normal", fontFamily: "Voltaire", fontSize: "12px", textAlign: "left"}
                    )
                ].join("")
            )
        );
    };
    const charHasFlag = (charRef, flagName) => {
        const allCharFlags = (D.GetStatVal(charRef, "charflags") || "").split("|");
        return allCharFlags.includes(flagName);
    };
    const processPrestation = () => {
        const allCharNames = findObjs({_type: "character"}).map((x) => x.get("name"));
        const prestationData = {
            boonsOwing: [],
            boonsOwed: []
        };
        for (const charName of allCharNames) {
            const boonsOwed = Object.values(D.GetRepStats(charName, "boonsowed", null, null, "rowID"));
            const boonsOwing = Object.values(D.GetRepStats(charName, "boonsowing", null, null, "rowID"));
            for (const owedBoon of boonsOwed)
                prestationData.boonsOwed.push({
                    from: charName,
                    to: (owedBoon.find((x) => x.attrName === "boonowed_to") || {val: false}).val,
                    type: (owedBoon.find((x) => x.attrName === "boonowed_type") || {val: false}).val,
                    details: (owedBoon.find((x) => x.attrName === "boonowed_details") || {val: false}).val
                });
            for (const owingBoon of boonsOwing)
                prestationData.boonsOwing.push({
                    from: (owingBoon.find((x) => x.attrName === "boonowing_from") || {val: false}).val,
                    to: charName,
                    type: (owingBoon.find((x) => x.attrName === "boonowing_type") || {val: false}).val,
                    details: (owingBoon.find((x) => x.attrName === "boonowing_details") || {val: false}).val
                });
        }
        const checkData = D.Clone(prestationData);
        for (let i = 0; i < checkData.boonsOwed.length; i++) {
            const boonOwed = checkData.boonsOwed[i];
            const recipBoon = D.PullOut(checkData.boonsOwing, (x) => x.to === boonOwed.to
                && x.to === boonOwed.to
                && x.type === boonOwed.type);
            if (recipBoon)
                checkData.boonsOwed[i] = null;
        }
        checkData.boonsOwed = _.compact(checkData.boonsOwed);
        D.Alert([
            "<h3>OWED Boons Without Partners</h3>",
            ...checkData.boonsOwed.map((x) => `${x.from} --> ${x.to} (${x.type})<br>`),
            "<h3>OWING Boons Without Partners</h3>",
            ...checkData.boonsOwing.map((x) => `${x.from} --> ${x.to} (${x.type})<br>`)
        ], "Prestation Review");
    };
    // #endregion

    // #region Character-As-NPC Control
    const setCharNPC = (charRef, npcRef) => {
        const charObj = D.GetChar(charRef);
        const npcObj = (npcRef === "base" && "base") || D.GetChar(npcRef);
        const npcName = (npcRef === "base" && "base") || D.GetName(npcObj, true);
        if (VAL({string: npcName, pc: charObj}, "setCharNPC")) {
            const [quad] = _.values(D.GetCharVals(charObj, "quadrant"));
            const [pcTokenObj] = Media.GetTokens(charObj.id);
            if (npcName === "base") {
                delete REGISTRY[quad].isNPC;
                Media.ToggleImg(`Tombstone${quad}`, false);
                Media.ToggleImg(`TombstoneToken${quad}`, false);
                Media.ToggleText(`TombstoneName${quad}`, false);
                Media.SetArea(pcTokenObj, `${quad}Token`);
            } else if (VAL({npc: npcObj}, "!char set npc")) {
                let nameString = D.GetName(npcObj);
                if (Media.GetTextWidth(`TombstoneName${quad}`, nameString) > 200)
                    nameString = npcName;
                REGISTRY[quad].isNPC = npcObj.id;
                Media.SetImg(`TombstoneToken${quad}`, npcObj);
                DB({charRef, npcRef, quad, npcName, nameString}, "setCharNPC");
                Media.SetText(`TombstoneName${quad}`, nameString, true);
                Media.ToggleImg(`Tombstone${quad}`, true);
                Media.ToggleImg(`TombstoneToken${quad}`, true);
                Media.ToggleText(`TombstoneName${quad}`, true);
            }
        }
    };
    // #endregion

    // #region Awarding XP
    const awardXP = (charRef, award, reason) => {
        DB(`Award XP Parameters: charRef: ${D.JSL(charRef)}, Award: ${D.JSL(award)}<br>Reason: ${D.JSL(reason)}`, "awardXP");
        const charObj = D.GetChar(charRef);
        if (VAL({charObj}, "awardXP")) {
            DB(`Award XP Variable Declations: char: ${D.JSL(charObj.get("name"))}, SessionNum: ${D.JSL(Session.SessionNum)}`, "awardXP");
            DB(
                `Making Row with Parameters: ${D.JSL(charObj.id)}, Award: ${D.JSL(award)}, Session: ${D.NumToText(
                    Session.SessionNum
                )}<br>Reason: ${D.JSL(reason)}`,
                "awardXP"
            );
            const rowID = D.MakeRow(charObj.id, "earnedxpright", {
                xp_award: award,
                xp_session: D.NumToText(Session.SessionNum, true),
                xp_reason: reason
            });
            DB(`Award XP Variable Declations: char: ${D.JSL(charObj.get("name"))}, rowID: ${D.JSL(rowID)}`, "awardXP");
            if (rowID) {
                const [leftRowIDs, rightRowIDs] = [D.GetRepIDs(charObj.id, "earnedxp"), D.GetRepIDs(charObj.id, "earnedxpright")];
                while (rightRowIDs.length > leftRowIDs.length) {
                    D.CopyToSec(charObj.id, "earnedxpright", rightRowIDs[0], "earnedxp");
                    leftRowIDs.push(rightRowIDs.shift());
                }
                D.Chat(
                    charObj,
                    C.HTML.Block(
                        [
                            C.HTML.Body(`<b>FOR:</b> ${reason}`, C.STYLES.whiteMarble.body),
                            C.HTML.Header(`You Have Been Awarded ${D.NumToText(award, true)} XP.`, C.STYLES.whiteMarble.header)
                        ],
                        C.STYLES.whiteMarble.block
                    )
                );
                // D.Alert(`Sort Trigger Value: ${D.GetStatVal(charObj, "xpsorttrigger")}`)
                DB({xpsorttrigger: D.GetStatVal(charObj, "xpsorttrigger")}, "awardXP");
                D.SetStat(charObj, "xpsorttrigger", D.GetStatVal(charObj, "xpsorttrigger") === 1 ? 2 : 1);
                // D.Alert(`New Value: ${D.GetStatVal(charObj, "xpsorttrigger")}`)
                return true;
            }
        }
        return false;
    };
    // #endregion

    // #region Handouts & Displays: Desires, Advantages, Hunger & Weekly Resources
    const displayDesires = (addAttrData) => {
        for (const charData of _.values(REGISTRY)) {
            const desireObj = Media.GetText(`${charData.shortName}Desire`);
            if (VAL({textObj: desireObj})) {
                let desireVal = (D.GetRepStat(charData.id, "desire", "top", "desire") || {val: false}).val;
                DB({desireVal, for: charData.name, length: desireVal.length, addAttrData}, "displayDesires");
                if (D.LCase(desireVal).length < 3 && VAL({list: addAttrData}))
                    desireVal = "charID" in addAttrData && addAttrData.charID === charData.id && VAL({string: addAttrData.val}) && addAttrData.val;
                DB({desireVal, length: desireVal.length}, "displayDesires");
                if (D.LCase(desireVal).length < 3) {
                    desireVal = "(none)";
                    Media.SetTextData(desireObj, {color: C.COLORS.grey});
                } else {
                    Media.SetTextData(desireObj, {color: C.COLORS.gold});
                }
                Media.SetText(desireObj, desireVal);
            }
        }
    };
    const resolveDesire = (charRef) => {
        let desireObj;
        if (D.Int(D.GetStat(charRef, "willpower_bashing")[0]) === 0)
            D.Alert("Character has no damaged willpower to restore.", "Pop Desire");
        else
            try {
                desireObj = (D.GetRepStat(charRef, "desire", "top", "desire") || {obj: null}).obj;
                if (desireObj) {
                    desireObj.remove();
                    adjustDamage(charRef, "willpower", "superficial+", -1, false);
                    displayDesires();
                    D.Chat(
                        D.GetChar(charRef),
                        C.HTML.Block(
                            [
                                C.HTML.Header(
                                    "You have resolved your Desire!<br>One superficial Willpower restored.<br>What do you Desire next?",
                                    Object.assign({height: "auto"}, C.STYLES.whiteMarble.header)
                                )
                            ],
                            C.STYLES.whiteMarble.block
                        )
                    );
                } else {
                    D.Alert(`No Desire found for ${D.GetName(charRef)}`, "resolveDesire");
                }
            } catch (errObj) {
                D.Alert(`No Desire found for ${D.GetName(charRef)}`, "resolveDesire");
            }
    };
    const regResource = (charRef, name, amount) => {
        const initial = D.UCase((D.GetCharData(charRef) || {initial: false}).initial);
        if (initial !== "") {
            STATE.REF.weeklyResources[initial] = STATE.REF.weeklyResources[initial] || [];
            STATE.REF.weeklyResources[initial].push([name, 0, amount]);
        }
        displayResources();
    };
    const unregResource = (charRef, rowNum) => {
        const initial = D.UCase((D.GetCharData(charRef) || {initial: false}).initial);
        if (initial !== "")
            if (STATE.REF.weeklyResources[initial].length <= 1 && rowNum === 1)
                delete STATE.REF.weeklyResources[initial];
            else
                STATE.REF.weeklyResources[initial] = [
                    ..._.first(STATE.REF.weeklyResources[initial], rowNum - 1),
                    ..._.rest(STATE.REF.weeklyResources[initial], rowNum)
                ];
        displayResources();
    };
    const adjustDisplayCols = (colNum, shift) => [`Weekly_Char_Col${colNum}`, `Stakes_Coterie_Col${colNum}`, `Stakes_Char_Col${colNum}`].map(
        (x) => Media.IsRegistered(x) && Media.SetTextData(x, {left: Media.GetTextData(x).left + D.Float(shift)})
    );
    const adjustResource = (charRef, rowNum, amount) => {
        const initial = D.UCase((D.GetCharData(charRef) || {initial: false}).initial);
        if (initial !== "") {
            D.Alert(`Adjusting: ${initial}, ${rowNum}, ${amount}`);
            const entry = STATE.REF.weeklyResources[initial] && STATE.REF.weeklyResources[initial][rowNum - 1];
            if (entry)
                entry[1] = Math.max(0, Math.min(entry[2], entry[1] + amount));
            D.Chat(
                D.GetChar(initial),
                C.HTML.Block(
                    [
                        C.HTML.Header("Weekly Resource Updated", C.STYLES.whiteMarble.header),
                        C.HTML.Body(
                            amount < 0
                                ? `${entry[0]} restored by ${-1 * amount} to ${entry[2] - entry[1]}/${entry[2]}`
                                : `${Math.abs(amount)} ${entry[0]} spent, ${entry[2] - entry[1]} remaining.`,
                            C.STYLES.whiteMarble.body
                        )
                    ],
                    C.STYLES.whiteMarble.block
                )
            );
        }
        displayResources();
    };
    const resetResources = () => {
        _.each(STATE.REF.weeklyResources, (data, init) => {
            // D.Alert(`Init: ${D.JS(init)}, Data: ${D.JS(data, true)}<br>Map: ${D.JS(_.map(data, v => [v[0], 0, v[2]]))}`)
            STATE.REF.weeklyResources[init] = _.map(data, (v) => [v[0], 0, v[2], v[3] || 0]);
            D.Chat(
                D.GetChar(init),
                C.HTML.Block([C.HTML.Body("Your weekly resources have been refreshed.", C.STYLES.whiteMarble.body)], C.STYLES.whiteMarble.block)
            );
        });
        displayResources();
    };
    const displayResources = () => {
        // if (_.flatten(_.values(STATE.REF.weeklyResources)).length === 0) {
        //     Media.ToggleImg("weeklyResourcesHeader", false);
        //     Media.ToggleText("Weekly_Char_Col1", false);
        //     Media.ToggleText("Weekly_Char_Col2", false);
        //     Media.ToggleText("Weekly_Char_Col3", false);
        // } else {
        //     Media.ToggleImg("weeklyResourcesHeader", true);
        //     Media.ToggleText("Weekly_Char_Col1", true);
        //     Media.ToggleText("Weekly_Char_Col2", true);
        //     Media.ToggleText("Weekly_Char_Col3", true);
        //     /* STATE.REF.weeklyResources = {
        //             N: [
        //                 ["Herd (Bookies)", 0, 6],
        //                 ["Herd (Clinic)", 0, 4]
        //             ]
        //         } */
        //     const columns = {
        //         Col1: [],
        //         Col2: [],
        //         Col3: []
        //     };
        //     for (const init of _.sortBy(Object.keys(STATE.REF.weeklyResources))) {
        //         const data = _.sortBy(STATE.REF.weeklyResources[init], (x) => x[0]);
        //         columns.Col1.push(`[${init}]`, ...new Array(data.length - 1).fill(""));
        //         columns.Col2.push(...data.map((x) => x[0]));
        //         columns.Col3.push(
        //             ...data.map((x) => `${"●".repeat(x[2] - x[1] - (x[3] || 0))}${"○".repeat(x[1] || 0)}${"◊".repeat(x[3] || 0)}`.replace(/^(\S{5})/gu, "$1  "))
        //         );
        //     }
        //     for (const [col, lines] of Object.entries(columns))
        //         Media.SetText(`Weekly_Char_${col}`, lines.join("\n"));
        // }
        // /* Media.SetImgData("stakedAdvantagesHeader", {top: Media.GetImgData("weeklyResourcesHeader").top + 0.5 * Media.GetImgData("stakedAdvantagesHeader").height + Media.GetTextHeight("weeklyResources") + 20}, true)
        //     Media.SetTextData("stakedCoterieAdvantages", {top: Media.GetImgData("stakedAdvantagesHeader").top + 0.5 * Media.GetImgData("stakedAdvantagesHeader").height})
        //     Media.SetTextData("stakedAdvantages", {top: Media.GetImgData("stakedAdvantagesHeader").top + 0.5 * Media.GetImgData("stakedAdvantagesHeader").height})
        //     displayStakes() */
    };
    const updateAssetsDoc = () => {
        const [stakeData, coterieStakes] = [[], {}];
        const nameLookup = {};
        const sortedCharData = _.sortBy(
            _.values(
                D.KeyMapObj(_.values(REGISTRY), null, (v) => {
                    nameLookup[v.initial] = v.docName;
                    return {initial: v.initial, charObj: D.GetChar(v.id)};
                })
            ),
            "initial"
        );
        const coterieAdvantages = D.GetRepStats("A", "advantage", {advantage_type: "Coterie"}, null, "rowID", null);
        const coterieAdvs = D.KeyMapObj(coterieAdvantages, (k, v) => v.find((x) => x.name === "advantage_name").val, (v, k) => v.find((x) => x.name === "advantage").val);
        DB({coterieAdvs}, "updateAssetsDoc");
        // D.Alert(`Initials Sort: ${D.JS(initials)}`)
        for (const charData of sortedCharData) {
            const {initial, charObj} = charData;
            DB({"===== STARTING CHARACTER =====": D.JS(charObj)}, "updateAssetsDoc");
            const projectStakes = [];
            for (const attrName of ["projectstake1", "projectstake2", "projectstake3"])
                projectStakes.push(...D.GetRepStats(charObj, "project", {projectstakes_toggle: "1"}, attrName));
            DB({charObj, projectStakes}, "updateAssetsDoc");
            for (const stake of projectStakes) {
                const advMax = (D.GetRepStat(charObj, "advantage", null, stake.name) || {val: null}).val;
                const endDate = (D.GetRepStat(charObj, "project", stake.rowID, "projectenddate") || {val: null}).val;
                if (advMax && D.Int(stake.val) > 0 && TimeTracker.CurrentDate.getTime() < TimeTracker.GetDate(endDate).getTime())
                    if (stake.name in coterieAdvs) {
                        coterieStakes[stake.name] = {
                            name: stake.name,
                            total: ((coterieStakes[stake.name] && coterieStakes[stake.name].total) || 0) + D.Int(stake.val),
                            inits: _.uniq([...(coterieStakes[stake.name] || {inits: []}).inits, initial]),
                            dates: _.uniq([...(coterieStakes[stake.name] || {dates: []}).dates, endDate]),
                            dateStamp: [...(coterieStakes[stake.name] || {dateStamp: []}).dateStamp, TimeTracker.GetDate(endDate).getTime()],
                            endDate,
                            max: D.Int(advMax)
                        };
                        DB(Object.assign({}, coterieStakes[stake.name], {TYPE: "COTERIE STAKE"}), "updateAssetsDoc");
                    } else {
                        stakeData.push([initial, stake.name, Math.min(D.Int(stake.val), advMax), D.Int(advMax), endDate, []]);
                        DB({initial, name: stake.name, val: Math.min(D.Int(stake.val), advMax), max: D.Int(advMax), endDate, TYPE: "PERSONAL STAKE"}, "updateAssetsDoc");
                    }
            }
            for (const stake of STATE.REF.customStakes.personal[initial]) {
                const [name, val, max, dateStamp] = [stake[0], stake[1], stake[2], TimeTracker.GetDate(stake[3])];
                if (max && val > 0 && TimeTracker.CurrentDate.getTime() < dateStamp.getTime())
                    stakeData.push([initial, name, val, max, TimeTracker.FormatDate(dateStamp), []]);
                DB({initial, name, val, max, endDate: TimeTracker.FormatDate(dateStamp), TYPE: "CUSTOM STAKE"}, "updateAssetsDoc");
            }
            DB({"===== ENDING CHARACTER =====": D.JS(charObj)}, "updateAssetsDoc");
        }
        DB({"===== FINISHED ITERATING CHARACTERS =====": true}, "updateAssetsDoc");

        // Sorting Coterie Stakes
        stakeData.sort((a, b) => {
            if (a[0] !== b[0])
                return (a[0] < b[0] && -10000000) || 10000000;
            else
                return TimeTracker.GetDate(a[4]).getTime() - TimeTracker.GetDate(b[4]).getTime();
        });

        // Next, look for duplicated entries. If found, delete the LATER one, but change the dot symbols in the initial entry to show they're still held up.
        const filteredStakes = [];
        for (const stake of stakeData) {
            const filteredIndex = filteredStakes.findIndex((x) => x[0] === stake[0] && x[1] === stake[1]);
            if (filteredIndex > -1)
                filteredStakes[filteredIndex][5].push(stake[2]);
            else
                filteredStakes.push([...stake]);
        }
        /* stakeData: [
                    [ "L", "Resources", 5, 5, "Feb 8, 2020" ],
                    [ "L", "Retainer", 1, 3, "Jan 19, 2020" ],
                    [ "L", "Retainer", 1, 3, "Feb 8, 2020" ],
                    [ "L", "Retainer 2", 3, 3, "Feb 8, 2020" ],
                    [ "L", "Napier`s Bookies", 1, 6, "Jan 19, 2020" ],
                    [ "N", "Contacts (Ogden Stone)", 2, 2, "Apr 1, 2020" ],
                    [ "N", "Contacts (The Aristocrat)", 2, 3, "Jan 19, 2020" ],
                    [ "N", "Allies (Bookies)", 4, 6, "Feb 8, 2020" ],
                    [ "R", "Ava's Contacts (Anarchs)", 2, 2, "Sep 5, 2020" ]
                ] */

        // FIRST: if the initials are different, sort by those: initials always sort first.

        DB({coterieStakes, stakeData, filteredStakes}, "updateAssetsDoc");
        // Check for combining already-entered coterie stakes.
        for (const stake of STATE.REF.customStakes.coterie) {
            const [name, val, max, dateStamp] = [stake[0], stake[1], stake[2], TimeTracker.GetDate(stake[3])];
            if (max && val > 0 && TimeTracker.CurrentDate.getTime() < dateStamp.getTime())
                if (coterieStakes[name]) {
                    coterieStakes[name].total += val;
                    coterieStakes[name].dateStamp.push(dateStamp.getTime());
                    coterieStakes[name].max = max || coterieStakes[name].max;
                } else {
                    coterieStakes[name] = {
                        name,
                        total: val,
                        dateStamp: [dateStamp.getTime()],
                        max
                    };
                }
        }
        // Now, check for repeat personal stakes


        // DB(`Coterie Stakes: ${D.JSL(Object.keys(coterieStakes), true)}`, "updateAssetsDoc")
        // COTERIE STAKES
        const stakeLines = [];
        for (const cotData of Object.values(coterieStakes))
            stakeLines.push(
                C.HANDOUTHTML.EyesOnlyDoc.Line(
                    [
                        C.HANDOUTHTML.EyesOnlyDoc.LineHeader((stakeLines.length && " ") || "<b><u>COTERIE</u></b>", {vertAlign: "middle"}),
                        C.HANDOUTHTML.EyesOnlyDoc.LineBody(cotData.name, {width: "190px", vertAlign: "middle"}),
                        C.HANDOUTHTML.EyesOnlyDoc.LineBody(
                            "●".repeat(Math.max(0, cotData.max - cotData.total)) + "○".repeat(Math.max(0, cotData.total)),
                            {
                                width: "60px",
                                fontFamily: "Courier New",
                                fontSize: "12px",
                                vertAlign: "middle"
                            }
                        ),
                        C.HANDOUTHTML.EyesOnlyDoc.LineBody(cotData.endDate, {
                            width: "124px",
                            textAlign: "right",
                            vertAlign: "middle",
                            margin: "0px 5px 0px -5px"
                        })
                    ].join(""),
                    {bgColor: "rgba(100,0,0,0.1)"}
                )
            );
        let lastInitial = false;
        for (const persData of filteredStakes) {
            stakeLines.push(
                C.HANDOUTHTML.EyesOnlyDoc.Line(
                    [
                        C.HANDOUTHTML.EyesOnlyDoc.LineHeader((lastInitial === persData[0] && " ") || D.GetCharData(persData[0]).docName, {
                            vertAlign: "middle"
                        }),
                        C.HANDOUTHTML.EyesOnlyDoc.LineBody(persData[1], {width: "190px", vertAlign: "middle"}),
                        C.HANDOUTHTML.EyesOnlyDoc.LineBody(
                            "●".repeat(Math.max(0, persData[3] - persData[2] - _.reduce(persData[5], (tot = 0, n) => tot + n)))
                                + "○".repeat(Math.max(0, persData[2]))
                                + persData[5].map((x) => `/${"○".repeat(Math.max(0, x))}`).join(""),
                            {width: "60px", fontFamily: "Courier New", fontSize: "12px", vertAlign: "middle"}
                        ),
                        C.HANDOUTHTML.EyesOnlyDoc.LineBody(persData[4], {
                            width: "124px",
                            textAlign: "right",
                            vertAlign: "middle",
                            margin: "0px 5px 0px -5px"
                        })
                    ].join(""),
                    {
                        bgColor: stakeLines.length % 2 === 1 ? "rgba(0,0,0,0.1)" : "transparent",
                        border: lastInitial === persData[0] ? null : "border-top: 2px solid #550000;"
                    }
                )
            );
            [lastInitial] = persData;
        }
        // [initial, name, val, max, TimeTracker.FormatDate(dateStamp), []]
        // https://i.imgur.com/qAHrpPv.jpg (Assets)     https://i.imgur.com/LsrLDoN.jpg (Projects)
        Handouts.Set(
            "MEMO: Fielded Assets",
            undefined,
            C.HANDOUTHTML.EyesOnlyDoc.Block(stakeLines.join(""), {bgURL: "https://i.imgur.com/qAHrpPv.jpg"})
        );
    };
    const updateProjectsDoc = () => {
        const projectData = [];
        const projectDetails = [];
        for (const charObj of D.GetChars("registered"))
            projectData.push(...D.GetRepStats(charObj, "project", {projectlaunchroll_toggle: "2"}));
        for (const [rowID, projectAttrs] of Object.entries(_.groupBy(projectData, "rowID")))
            projectDetails.push({
                rowID,
                name: D.GetCharData(projectAttrs[0].charID).docName,
                goal: projectAttrs.find((x) => x.attrName === "projectscope_name").val,
                endDate: TimeTracker.GetDate(projectAttrs.find((x) => x.attrName === "projectenddate").val)
            });
        projectDetails.sort((a, b) => a.endDate - b.endDate);
        const projectLines = [];
        for (const projDetails of projectDetails)
            projectLines.push(
                C.HANDOUTHTML.EyesOnlyDoc.Line(
                    [
                        C.HANDOUTHTML.EyesOnlyDoc.LineHeader(projDetails.name),
                        C.HANDOUTHTML.EyesOnlyDoc.LineBody(
                            `${projDetails.goal}${C.HANDOUTHTML.EyesOnlyDoc.LineBodyRight(
                                `<b><u>COMPLETED ON</u>:</b> ${TimeTracker.FormatDate(projDetails.endDate)}`
                            )}`
                        )
                    ].join(""),
                    {bgColor: projectLines.length % 2 === 1 ? "rgba(0,0,0,0.1)" : "transparent"}
                )
            );
        Handouts.Set(
            "MEMO: Active Projects",
            undefined,
            C.HANDOUTHTML.EyesOnlyDoc.Block(projectLines.join(""), {bgURL: "https://i.imgur.com/LsrLDoN.jpg"})
        );
    };
    const updateHunger = (charRef) => {
        charRef = charRef || "registered";
        DB({charRef}, "updateHunger");
        for (const char of D.GetChars(charRef)) {
            const charData = D.GetCharData(char);
            const quad = charData.quadrant;
            const hunger = `${D.GetStatVal(char, "hunger")}`;
            if (hunger === "0") {
                Media.ToggleImg(`Hunger${quad}`, false);
            } else {
                Media.SetImg(`Hunger${quad}`, hunger);
                Media.ToggleImg(`Hunger${quad}`, true);
            }
        }
    };
    // #endregion

    // #region Manipulating Stats on Sheet, Alarms
    const parseDmgTypes = (max, bashing = 0, aggravated = 0, deltaBash = 0, deltaAgg = 0) => {
        if (VAL({number: [max, bashing, aggravated, deltaBash, deltaAgg]}, "parseDmgTypes", true)) {
            let [newBash, newAgg, deltaBashToGo, deltaAggToGo] = [bashing, aggravated, deltaBash, deltaAgg];
            if (deltaBash + deltaAgg > 0) {
                while (deltaAggToGo && newAgg < max) {
                    deltaAggToGo--;
                    newAgg++;
                    if (newAgg + newBash > max)
                        newBash--;
                }
                if (deltaAggToGo)
                    return [newBash, newAgg, true];
                while (deltaBashToGo && newAgg < max) {
                    deltaBashToGo--;
                    newBash++;
                    if (newBash + newAgg > max) {
                        newBash--;
                        newBash--;
                        newAgg++;
                    }
                }
            } else if (deltaBash + deltaAgg < 0) {
                while (deltaAggToGo < 0 && newAgg > 0) {
                    deltaAggToGo++;
                    newAgg--;
                    newBash++;
                }
                while (deltaBashToGo < 0 && newBash > 0) {
                    deltaBashToGo++;
                    newBash--;
                }
            }
            return [newBash, newAgg, deltaAggToGo + deltaBashToGo > 0];
        }
        return false;
    };
    const adjustTrait = (charRef, trait, amount, min = 0, max = Infinity, defaultTraitVal, deltaType, isChatting = true, messageOverride) => {
        // D.Alert(`Adjusting Trait: ${[charRef, trait, amount, min, max, defaultTraitVal, deltaType, isChatting].map(x => D.JS(x)).join(", ")}`)
        const charObj = D.GetChar(charRef);
        if (VAL({charObj: [charObj], trait: [trait], number: [amount]}, "adjustTrait", true)) {
            switch (trait.toLowerCase()) {
                case "stain":
                case "stains":
                case "humanity":
                case "hum":
                    min = 0;
                    max = 10;
                    break;
                // no default
            }
            const chatStyles = {
                block:
                    (trait === "humanity" && amount > 0) || (trait !== "humanity" && amount < 0)
                        ? Object.assign(C.STYLES.whiteMarble.block, {})
                        : Object.assign(C.STYLES.blackMarble.block, {}), // {width: "275px"},
                body:
                    (trait === "humanity" && amount > 0) || (trait !== "humanity" && amount < 0)
                        ? Object.assign(C.STYLES.whiteMarble.body, {fontSize: "12px"})
                        : Object.assign(C.STYLES.blackMarble.body, {fontSize: "12px"}), // {fontFamily: "Voltaire", fontSize: "14px", color: "rgb(255,50,50)"},
                banner:
                    (trait === "humanity" && amount > 0) || (trait !== "humanity" && amount < 0)
                        ? Object.assign(C.STYLES.whiteMarble.header, {fontSize: "12px"})
                        : Object.assign(C.STYLES.blackMarble.header, {fontSize: "12px"}), // {fontSize: "12px"},
                alert:
                    (trait === "humanity" && amount > 0) || (trait !== "humanity" && amount < 0)
                        ? Object.assign(C.STYLES.whiteMarble.header, {})
                        : Object.assign(C.STYLES.blackMarble.header, {}) // {}
            };
            const initTraitVal = VAL({number: D.Int(D.GetStatVal(charObj, trait))}) ? D.Int(D.GetStatVal(charObj, trait)) : defaultTraitVal || 0;
            const finalTraitVal = Math.min(max, Math.max(min, initTraitVal + D.Int(amount)));
            amount = finalTraitVal - initTraitVal;
            let [bannerString, bodyString, alertString, trackerString] = ["", "", null, ""];
            DB(
                `Adjusting Trait: (${D.JSL(trait)}, ${D.JSL(amount)}, ${D.JSL(min)}, ${D.JSL(max)}, ${D.JSL(defaultTraitVal)}, ${D.JSL(deltaType)})
                    ... Initial (${D.JS(initTraitVal)}) + Amount (${D.JS(amount)}) = Final (${D.JS(finalTraitVal)}))`,
                "adjustTrait"
            );
            switch (trait.toLowerCase()) {
                case "hunger": {
                    chatStyles.header = {margin: "0px"};
                    if (amount > 0)
                        bannerString = `Your hunger increases from ${D.NumToText(initTraitVal).toLowerCase()} to ${D.NumToText(
                            finalTraitVal
                        ).toLowerCase()}.`;
                    else if (amount < 0)
                        bannerString = `You slake your hunger by ${D.NumToText(Math.abs(amount)).toLowerCase()}.`;
                    break;
                }
                case "hum":
                case "humanity": {
                    if (amount > 0)
                        bannerString = `Your Humanity increases by ${D.NumToText(amount).toLowerCase()} to ${D.NumToText(
                            finalTraitVal
                        ).toLowerCase()}.`;
                    else if (amount < 0)
                        bannerString = `Your Humanity falls by ${D.NumToText(Math.abs(amount)).toLowerCase()} to ${D.NumToText(
                            finalTraitVal
                        ).toLowerCase()}.`;
                    break;
                }
                case "stain":
                case "stains": {
                    if (amount > 0)
                        bannerString = `You suffer ${D.NumToText(amount).toLowerCase()} stain${amount > 1 ? "s" : ""} to your Humanity.`;
                    else if (amount < 0)
                        bannerString = `${D.NumToText(Math.abs(finalTraitVal - initTraitVal))} stain${
                            Math.abs(amount) > 1 ? "s" : ""
                        } cleared from your Humanity.`;
                    break;
                }
                case "willpower_sdmg":
                case "willpower_sdmg_social": {
                    if (amount > 0) {
                        const [maxWP, curBashing, curAggravated] = [
                            D.Int(D.GetStat(charObj, "willpower_max")[0]),
                            D.Int(D.GetStat(charObj, "willpower_bashing")[0]),
                            D.Int(D.GetStat(charObj, "willpower_aggravated")[0])
                        ];
                        const [newBashing, newAggravated, isOverLimit] = parseDmgTypes(maxWP, curBashing, curAggravated, amount, 0);
                        DB(
                            `MaxWP: ${maxWP}, CurBash: ${curBashing}, CurAggr: ${curAggravated}<br>... Dealing ${amount} --> newBash: ${newBashing}, newAggr: ${newAggravated}`,
                            "adjustTrait"
                        );
                        switch (deltaType) {
                            case "superficial":
                                bannerString = `You suffer ${D.NumToText(Math.abs(amount)).toLowerCase()} (halved) superficial Willpower damage.`;
                                break;
                            case "superficial+":
                                bannerString = `You suffer ${D.NumToText(Math.abs(amount)).toLowerCase()} superficial Willpower damage.`;
                                break;
                            case "spent":
                                bannerString = `You spend ${D.NumToText(Math.abs(amount)).toLowerCase()} Willpower.`;
                                break;
                            // no default
                        }
                        if (isOverLimit || newAggravated === maxWP) {
                            bodyString = "YOU ARE COMPLETELY EXHAUSTED!";
                            alertString = "EXHAUSTED: -2 to Social & Mental rolls.<br>You cannot spend Willpower.";
                        } else if (newBashing + newAggravated === maxWP) {
                            bodyString = "Further strain will cause AGGRAVATED damage!";
                            alertString = "EXHAUSTED: -2 to Social & Mental rolls.";
                        }
                        trackerString = C.HTML.TrackerLine(maxWP - newBashing - newAggravated, newBashing, newAggravated, {
                            margin: alertString ? undefined : "-8px 0px 0px 0px"
                        });
                    } else if (Math.min(D.Int(D.GetStat(charObj, "willpower_bashing")[0]), Math.abs(amount))) {
                        bannerString = `You regain ${D.NumToText(
                            Math.min(D.Int(D.GetStat(charObj, "willpower_bashing")[0]), Math.abs(amount))
                        ).toLowerCase()} Willpower.`;
                    }
                    break;
                }
                case "willpower_admg":
                case "willpower_admg_social": {
                    if (amount > 0) {
                        const [maxWP, curBashing, curAggravated] = [
                            D.Int(D.GetStat(charObj, "willpower_max")[0]),
                            D.Int(D.GetStat(charObj, "willpower_bashing")[0]),
                            D.Int(D.GetStat(charObj, "willpower_aggravated")[0])
                        ];
                        const [newBashing, newAggravated, isOverLimit] = parseDmgTypes(maxWP, curBashing, curAggravated, 0, amount);
                        DB(
                            `MaxWP: ${maxWP}, CurBash: ${curBashing}, CurAggr: ${curAggravated}<br>... Dealing ${amount} --> newBash: ${newBashing}, newAggr: ${newAggravated}`,
                            "adjustTrait"
                        );
                        bannerString = `You suffer ${D.NumToText(Math.abs(amount)).toLowerCase()} AGGRAVATED Willpower damage!`;
                        if (isOverLimit || newAggravated === maxWP) {
                            bodyString = "YOU ARE COMPLETELY EXHAUSTED!";
                            alertString = "EXHAUSTED: -2 to Social & Mental rolls.<br>You cannot spend Willpower.";
                        } else if (newBashing + newAggravated === maxWP) {
                            bodyString = "Further strain will cause AGGRAVATED damage!";
                            alertString = "EXHAUSTED: -2 to Social & Mental rolls.";
                        }
                        trackerString = C.HTML.TrackerLine(maxWP - newBashing - newAggravated, newBashing, newAggravated, {
                            margin: alertString ? undefined : "-8px 0px 0px 0px"
                        });
                    } else if (Math.min(D.Int(D.GetStat(charObj, "willpower_aggravated")[0]), Math.abs(amount))) {
                        bannerString = `${D.NumToText(
                            Math.min(D.Int(D.GetStat(charObj, "willpower_aggravated")[0]), Math.abs(amount))
                        )} aggravated Willpower damage downgraded.`;
                    }
                    break;
                }
                case "health_sdmg": {
                    if (amount > 0) {
                        const [maxHealth, curBashing, curAggravated] = [
                            D.Int(D.GetStat(charObj, "health_max")[0]),
                            D.Int(D.GetStat(charObj, "health_bashing")[0]),
                            D.Int(D.GetStat(charObj, "health_aggravated")[0])
                        ];
                        const [newBashing, newAggravated, isOverLimit] = parseDmgTypes(maxHealth, curBashing, curAggravated, amount, 0);
                        DB(
                            `MaxHealth: ${maxHealth}, CurBash: ${curBashing}, CurAggr: ${curAggravated}<br>... Dealing ${amount} --> newBash: ${newBashing}, newAggr: ${newAggravated}`,
                            "adjustTrait"
                        );
                        switch (deltaType) {
                            case "superficial":
                                bannerString = `You suffer ${D.NumToText(Math.abs(amount)).toLowerCase()} (halved) superficial Health damage.`;
                                break;
                            case "superficial+":
                                bannerString = `You suffer ${D.NumToText(Math.abs(amount)).toLowerCase()} superficial Health damage.`;
                                break;
                            // no default
                        }
                        if (isOverLimit || newAggravated === maxHealth) {
                            alertString = "DARKNESS FALLS<br>You sink into torpor...";
                        } else if (newBashing + newAggravated === maxHealth) {
                            bodyString = "Further harm will cause AGGRAVATED damage!";
                            alertString = "WOUNDED: -2 to Physical rolls.";
                            if (curBashing + curAggravated + amount > maxHealth)
                                applyCripplingInjury(charObj.id, newAggravated);
                        }
                        trackerString = C.HTML.TrackerLine(maxHealth - newAggravated - newBashing, newBashing, newAggravated, {
                            margin: alertString ? undefined : "-8px 0px 0px 0px"
                        });
                    } else if (Math.min(D.Int(D.GetStat(charObj, "health_bashing")[0]), Math.abs(amount))) {
                        bannerString = `You heal ${D.NumToText(
                            Math.min(D.Int(D.GetStat(charObj, "health_bashing")[0]), Math.abs(amount))
                        ).toLowerCase()} superficial Health damage.`;
                    }
                    break;
                }
                case "health_admg": {
                    if (amount > 0) {
                        const [maxHealth, curBashing, curAggravated] = [
                            D.Int(D.GetStat(charObj, "health_max")[0]),
                            D.Int(D.GetStat(charObj, "health_bashing")[0]),
                            D.Int(D.GetStat(charObj, "health_aggravated")[0])
                        ];
                        const [newBashing, newAggravated, isOverLimit] = parseDmgTypes(maxHealth, curBashing, curAggravated, 0, amount);
                        DB(
                            `MaxHealth: ${maxHealth}, CurBash: ${curBashing}, CurAggr: ${curAggravated}<br>... Dealing ${amount} --> newBash: ${newBashing}, newAggr: ${newAggravated}<br>... IsOverLimit? ${D.JSL(
                                isOverLimit
                            )}`,
                            "adjustTrait"
                        );
                        bannerString = `You suffer ${D.NumToText(Math.abs(amount)).toLowerCase()} AGGRAVATED Health damage!`;
                        if (isOverLimit || newAggravated === maxHealth) {
                            alertString = "DARKNESS FALLS<br>You sink into torpor...";
                        } else if (newBashing + newAggravated === maxHealth) {
                            bodyString = "Further harm will cause AGGRAVATED damage!";
                            alertString = "WOUNDED: -2 to Physical rolls.";
                            if (curBashing + curAggravated + amount > maxHealth)
                                applyCripplingInjury(charObj.id, newAggravated);
                        }
                        trackerString = C.HTML.TrackerLine(maxHealth - newAggravated - newBashing, newBashing, newAggravated, {
                            margin: alertString ? undefined : "-8px 0px 0px 0px"
                        });
                    } else if (Math.min(D.Int(D.GetStat(charObj, "health_aggravated")[0]), Math.abs(amount))) {
                        bannerString = `${D.NumToText(
                            Math.min(D.Int(D.GetStat(charObj, "health_aggravated")[0]), Math.abs(amount))
                        )} aggravated Health damage downgraded.`;
                    }
                    break;
                }
                // no default
            }
            if (bannerString && isChatting)
                D.Chat(
                    charObj,
                    C.HTML.Block(
                        _.compact([
                            C.HTML.Header(bannerString, Object.assign({}, chatStyles.banner, {height: "25px", lineHeight: "25px"})),
                            bodyString ? C.HTML.Body(bodyString, chatStyles.body) : null,
                            trackerString || null,
                            alertString
                                ? C.HTML.Header(alertString, Object.assign(chatStyles.alert, alertString.includes("<br>") ? {height: "40px"} : {}))
                                : null
                        ]),
                        chatStyles.block
                    )
                );
            else if (messageOverride)
                D.Chat(
                    charObj,
                    C.HTML.Block(
                        _.compact([
                            C.HTML.Header(messageOverride, Object.assign({}, chatStyles.banner, {height: "25px", lineHeight: "25px"})),
                            trackerString || null
                        ]),
                        chatStyles.block
                    )
                );
            setAttrs(D.GetChar(charObj).id, {[trait.toLowerCase()]: finalTraitVal});
            if (trait.toLowerCase() === "hunger")
                updateHunger();
            return true;
        }
        return false;
    };
    const applyCripplingInjury = (charRef, aggDmg) => {
        const charObj = D.GetChar(charRef);
        if (VAL({charObj})) {
            const injuryRoll = randomInteger(10) + aggDmg;
            const injuryChatLines = [
                C.HTML.Header(`${D.GetName(charObj, true)} Suffers a Crippling Injury!`),
                C.HTML.Body(`Result: ${injuryRoll} (${aggDmg} Agg. + d10: ${injuryRoll - aggDmg})`)
            ];
            const injuryFuncs = {
                100: () => {
                    injuryChatLines.push(...[C.HTML.Header("Catastrophic Injury!"), C.HTML.Body(`${D.GetName(charObj, true)} falls into torpor!`)]);
                    D.Chat("all", C.HTML.Block(injuryChatLines.join("")));
                    return {};
                },
                12: () => {
                    D.CommandMenu(
                        {
                            title: "Limb Lost/Mangled",
                            rows: [
                                {
                                    type: "ButtonLine",
                                    contents: [
                                        {name: "Mangled Arm", command: "!reply mangledarm"},
                                        {name: "Mangled Leg", command: "!reply mangledleg"}
                                    ]
                                },
                                {
                                    type: "ButtonLine",
                                    contents: [
                                        {name: "Lost Arm", command: "!reply lostarm"},
                                        {name: "Lost Leg", command: "!reply lostleg"}
                                    ]
                                }
                            ]
                        },
                        (commandString) => {
                            // IMPORTANT: return 'true' if you want to hold this function open for more commands
                            switch (commandString) {
                                case "mangledarm": {
                                    injuryChatLines.push(
                                        ...[C.HTML.Header("Mangled Arm!"), C.HTML.Body("Actions Requiring Affected Arm are Impossible.")]
                                    );
                                    break;
                                }
                                case "mangledleg": {
                                    injuryChatLines.push(
                                        ...[C.HTML.Header("Mangled Leg!"), C.HTML.Body("Actions Requiring Affected Leg are Impossible.")]
                                    );
                                    break;
                                }
                                case "lostarm": {
                                    injuryChatLines.push(
                                        ...[C.HTML.Header("Severed Arm!"), C.HTML.Body("Actions Requiring Affected Arm are Impossible.")]
                                    );
                                    break;
                                }
                                case "lostleg": {
                                    injuryChatLines.push(
                                        ...[C.HTML.Header("Severed Leg!"), C.HTML.Body("Actions Requiring Affected Leg are Impossible.")]
                                    );
                                    break;
                                }
                                // no default
                            }
                            D.Chat("all", C.HTML.Block(injuryChatLines.join("")));
                        }
                    );
                    return {};
                },
                11: () => {
                    injuryChatLines.push(...[C.HTML.Header("Massive Wound!"), C.HTML.Body("-2 to All Rolls.<br>+1 Damage Taken.")]);
                    // Some Char function for temporary effects, increases damage by one.
                    Roller.AddCharEffect(charObj, "all;-2;- Massive Wound (<.>)");
                    addCharFlag(charObj.id, "incDmgTaken", false, false);
                    addCharAlarm(charObj.id, "health", ["offImpair"], {
                        funcName: "reminjury",
                        funcParams: [charObj.id, "all;-2;- Massive Wound (<.>)", "Your massive wound heals."]
                    });
                    D.Chat("all", C.HTML.Block(injuryChatLines.join("")));
                },
                10: () => {
                    D.CommandMenu(
                        {
                            title: "Broken or Blinded?",
                            rows: [
                                {
                                    type: "ButtonLine",
                                    contents: [
                                        {name: "Broken Arm", command: "!reply arm"},
                                        {name: "Broken Leg", command: "!reply leg"},
                                        {name: "Blinded", command: "!reply blind"}
                                    ]
                                }
                            ]
                        },
                        (commandString) => {
                            // IMPORTANT: return 'true' if you want to hold this function open for more commands
                            switch (commandString) {
                                case "arm": {
                                    injuryChatLines.push(...[C.HTML.Header("Broken Arm!"), C.HTML.Body("-3 to Rolls Using Affected Arm.")]);
                                    Roller.AddCharEffect(charObj, "brawl/firearms/melee;-3;- Broken Arm (<.>)");
                                    addCharAlarm(charObj.id, "health", ["offImpair"], {
                                        funcName: "reminjury",
                                        funcParams: [
                                            charObj.id,
                                            "brawl/firearms/melee;-3;- Broken Arm (<.>)",
                                            "Your broken arm knits itself back together."
                                        ]
                                    });
                                    break;
                                }
                                case "leg": {
                                    injuryChatLines.push(...[C.HTML.Header("Broken Leg!"), C.HTML.Body("-3 to Rolls Using Affected Leg.")]);
                                    Roller.AddCharEffect(charObj, "athletics/stealth;-3;- Broken Leg (<.>)");
                                    addCharAlarm(charObj.id, "health", ["offImpair"], {
                                        funcName: "reminjury",
                                        funcParams: [
                                            charObj.id,
                                            "athletics/stealth;-3;- Broken Leg (<.>)",
                                            "Your broken leg knits itself back together."
                                        ]
                                    });
                                    break;
                                }
                                case "blind": {
                                    injuryChatLines.push(...[C.HTML.Header("Blinded!"), C.HTML.Body("-3 to Rolls Requiring Vision.")]);
                                    Roller.AddCharEffect(charObj, "awareness/brawl/firearms/melee/drive/investigation;-3;- Blind (<.>)");
                                    Session.AddSceneAlarm({
                                        funcName: "reminjury",
                                        funcParams: [
                                            charObj.id,
                                            "awareness/brawl/firearms/melee/drive/investigation;-3;- Blind (<.>)",
                                            "You are no longer blinded."
                                        ]
                                    });
                                    break;
                                }
                                // no default
                            }
                            D.Chat("all", C.HTML.Block(injuryChatLines.join("")));
                        }
                    );
                },
                8: () => {
                    injuryChatLines.push(...[C.HTML.Header("Severe Head Trauma!"), C.HTML.Body("-1 to Physical Rolls.<br>-2 to Mental Rolls.")]);
                    Roller.AddCharEffect(charObj, "physical;-1;- Head Trauma (<.>)");
                    Roller.AddCharEffect(charObj, "mental;-2;- Head Trauma (<.>)");
                    addCharAlarm(charObj.id, "health", ["offImpair"], {
                        funcName: "reminjury",
                        funcParams: [charObj.id, "physical;-1;- Head Trauma (<.>)"]
                    });
                    addCharAlarm(charObj.id, "health", ["offImpair"], {
                        funcName: "reminjury",
                        funcParams: [charObj.id, "mental;-2;- Head Trauma (<.>)", "Your head trauma heals."]
                    });
                    D.Chat("all", C.HTML.Block(injuryChatLines.join("")));
                },
                6: () => {
                    injuryChatLines.push(...[C.HTML.Header("Stunned!"), C.HTML.Body("Spend one Willpower or lose a turn.")]);
                    D.Chat("all", C.HTML.Block(injuryChatLines.join("")));
                }
            };
            injuryFuncs[Object.keys(injuryFuncs).find((x) => injuryRoll <= x)]();
        }
    };
    const adjustDamage = (charRef, trait, dType, delta, isChatting = true, messageOverride) => {
        const amount
            = D.Int(delta) + (D.Int(delta) > 0 && charHasFlag(`inc${D.Capitalize(D.LCase(trait).replace(/wp/gu, "willpower"))}DmgTaken`) ? 1 : 0);
        const charObj = D.GetChar(charRef);
        const dmgType = dType;
        let [minVal, maxVal, targetVal, defaultVal, traitName, deltaType] = [0, 5, D.Int(amount), 0, "", ""];
        if (VAL({charObj: [charObj], number: [amount]}, "AdjustDamage", true)) {
            switch (trait.toLowerCase()) {
                case "hum":
                case "humanity":
                    [minVal, maxVal, targetVal, defaultVal, traitName] = [0, 10, D.Int(amount), 7, "humanity"];
                    break;
                case "stain":
                case "stains":
                    [minVal, maxVal, targetVal, defaultVal, traitName] = [0, 10, D.Int(amount), 0, "stains"];
                    break;
                case "health":
                case "willpower":
                case "wp": {
                    [minVal, maxVal, targetVal, defaultVal, traitName, deltaType] = [
                        -Infinity,
                        Infinity,
                        D.Int(amount) >= 0 && dmgType.endsWith("superficial") ? D.Int(Math.ceil(amount / 2)) : D.Int(amount),
                        0,
                        trait.toLowerCase()
                            + (["superficial", "superficial+", "spent"].includes(dmgType.replace(/social_/gu, "")) ? "_sdmg" : "_admg")
                            + (dmgType.includes("social") ? "_social" : ""),
                        dmgType.replace(/social_/gu, "")
                    ];
                    break;
                }
                // no default
            }
            // D.Alert(`Adjusting Damage: (${D.JS(trait)}, ${D.JS(dmgType)}, ${D.JS(amount)})`, "adjustDamage")
            const returnVal = adjustTrait(charRef, traitName, targetVal, minVal, maxVal, defaultVal, deltaType, isChatting, messageOverride);
            // if (amount < 0 && deltaType === "aggravated")
            // adjustTrait(charRef, traitName.replace(/_admg/gu, "_sdmg"), -1 * targetVal, minVal, maxVal, defaultVal, "superficial", false)
            return returnVal;
        }
        return false;
    };
    const adjustHunger = (charRef, amount, isKilling = false, isChatting = true) => {
        if (VAL({char: [charRef], number: [amount], trait: ["bp_slakekill"]}, "AdjustHunger", true))
            return adjustTrait(
                charRef,
                "hunger",
                D.Int(amount),
                isKilling || D.Int(amount) > 0 ? 0 : D.Int((D.GetStat(charRef, "bp_slakekill") && D.GetStat(charRef, "bp_slakekill")[0]) || 1),
                5,
                1,
                null,
                isChatting
            );
        return false;
    };
    const adjustTempStat = (charRef, statName, delta, repRowStatName) => {
        /*  ********************
            - Will have to log active temp stats in STATE, and include what they're from
                - So you don't keep increasing the delta by repeat calls every time Fielded Assets is updated
                - This func should include an "id" value to log the temp stat change to: that way it will overwrite when needed
                - Then another func can handle going through the STATE records, totalling the temp deltas, and setting the final charsheet value.
        *************************** */
        const charObj = D.GetChar(charRef);
        statName = `${statName}temp`.replace(/temptemp$/gu, "temp");
        const curStatDelta = D.Int(D.GetStatVal(charObj, statName, repRowStatName));
        const [curStatVal, masterStatAttr] = D.GetStat(charObj, statName.replace(/temp$/gu, ""), repRowStatName);
        DB({charObj, statName, delta, repRowStatName, curStatDelta, curStatVal, masterStatAttr}, "adjustTempStat");
        if (masterStatAttr) {
            const masterStatName = masterStatAttr.get("name");
            const tempStatName = `${masterStatName}temp`;
            const newTempStat = curStatDelta + delta;
            setAttrs(charObj.id, {[tempStatName]: newTempStat});
        }
    };
    const sortTimeline = (charRef) => {
        D.SortRepSec(charRef, "timeline", "tlsortby", true, (val) => val || -200);
    };
    const launchProject = (margin = 0, resultString = "SUCCESS", charRef, projectPrefix) => {
        const charObj = D.GetChar(charRef || Roller.LastProjectCharID);
        const p = (v) => `${projectPrefix || Roller.LastProjectPrefix}${v}`;
        const rowID = Roller.LastProjectPrefix.split("_")[2];
        const attrList = {};
        DB({margin, resultString, charObj, projectPrefix, rowID}, "launchProject");
        const [trait1name, trait1val, trait2name, trait2val, diff, scope] = [
            D.GetRepStat(charObj, "project", rowID, "projectlaunchtrait1_name").val,
            D.GetRepStat(charObj, "project", rowID, "projectlaunchtrait1").val,
            D.GetRepStat(charObj, "project", rowID, "projectlaunchtrait2_name").val,
            D.GetRepStat(charObj, "project", rowID, "projectlaunchtrait2").val,
            D.GetRepStat(charObj, "project", rowID, "projectlaunchdiff").val,
            D.GetRepStat(charObj, "project", rowID, "projectscope").val
        ];
        attrList[p("projectlaunchresultsummary")] = `${trait1name} (${trait1val}) + ${trait2name} (${trait2val}) vs. ${diff}: ${resultString}`;
        DB({margin, resultString, attrList}, "launchProject");
        attrList[p("projectlaunchroll_toggle")] = 2;
        attrList[p("projectlaunchresults")] = resultString;
        attrList[p("projectstakes_toggle")] = 1;
        attrList[p("projecttotalstake")] = D.Int(scope) + 1 - margin;
        attrList[p("projectmargin")] = D.Int(margin);
        attrList[p("projectmargindisplay")] = `(${D.Sign(D.Int(margin))})`;
        attrList[p("projectlaunchresultsmargin")] = `${D.Int(scope) + 1 - margin} Stake Required, (${D.Int(scope) + 1 - margin} to Go)`;
        D.Queue(setAttrs, [charObj.id, attrList], "LaunchProject");
        D.Queue(updateProjectsDoc, [], "LaunchProject", 0.1);
        D.Run("LaunchProject");
    };
    const addMarginToProjects = (charRefs, isWritingSheet = false) => {
        const charObjs = D.GetChars(charRefs);
        for (const charObj of charObjs) {
            const projectData = D.GetRepStats(charObj, "project", null, ["projectscope", "projecttotalstake", "projectlaunchresults"], "rowID");
            const attrList = {};
            const returnLines = [
                `<h3>Processing ${D.GetName(charObj, true)}'s Projects</h3>`
            ];
            for (const [rowID, statData] of Object.entries(projectData)) {
                if (statData.length === 3) {
                    const projectResult = statData.find((x) => x.attrName === "projectlaunchresults").val;
                    if (projectResult !== "CRITICAL WIN!") {
                        const projectScope = D.Int(statData.find((x) => x.attrName === "projectscope").val);
                        const projectTotalStake = D.Int(statData.find((x) => x.attrName === "projecttotalstake").val);
                        const projectMargin = D.Int(projectScope) + 1 - D.Int(projectTotalStake);
                        attrList[`repeating_project_${rowID}_projectmargin`] = projectMargin;
                        attrList[`repeating_project_${rowID}_projectmargindisplay`] = `(${D.Sign(projectMargin)})`;
                        continue;
                    }
                } else {
                    returnLines.push(`Excluding ${rowID}: ${statData[0].val}`);
                }
                returnLines.push(...[
                    statData.find((x) => x.attrName === "projectscope").name,
                    `     !char @${charObj.id} set stat repeating_project_${rowID}_projectmargin &lt;#&gt;`,
                    `     !char @${charObj.id} set stat repeating_project_${rowID}_projectmargindisplay "(+&lt;#&gt;)"`
                ]);
            }

            returnLines.push(...[
                "<h3>Setting Attributes:</h3>",
                D.JS(attrList),
                isWritingSheet
                    ? "<span style=\"color: red;\"><b>CHANGES WRITTEN TO SHEET</b></span>"
                    : "(<b>!char process margins true</b> to write to sheet)"
            ]);

            D.Alert(returnLines.join("<br>"), "Add Margin to Projects");

            if (isWritingSheet)
                setAttrs(charObj.id, attrList);
        }
    };
    const setCompulsion = (charRef, compulsionTitle, compulsionText) => {
        D.SetStats(charRef, {
            compulsion_toggle: (compulsionTitle && 1) || 0,
            compulsion: (compulsionTitle && `${D.UCase(compulsionTitle)} — ${D.Capitalize(compulsionText)}`) || ""
        });
    };
    const setDyscrasias = (charRef, dyscrasiasTitle, dyscrasiasText) => {
        const charObj = D.GetChar(charRef);
        if (VAL({charObj})) {
            D.SetStats(charRef, {
                dyscrasias_toggle: (dyscrasiasTitle && 1) || 0,
                dyscrasias: (dyscrasiasTitle && `${D.UCase(dyscrasiasTitle)} — ${D.Capitalize(dyscrasiasText)}`) || ""
            });
            if (dyscrasiasTitle)
                addCharAlarm(charObj.id, "hunger", ["onMax", "slake"], {
                    funcName: "remdyscrasia",
                    funcParams: [charObj.id]
                });
        }
    };
    const addCharAlarm = (charRef, traitName, triggerFlags, alarm) => {
        const charObj = D.GetChar(charRef);
        DB({charObj, traitName, triggerFlags, alarm}, "addCharAlarm");
        if (VAL({charObj})) {
            STATE.REF.charAlarms[charObj.id] = STATE.REF.charAlarms[charObj.id] || [];
            STATE.REF.charAlarms[charObj.id].push({
                traitName,
                triggerFlags,
                alarm
            });
        }
    };
    const checkCharAlarms = (charRef, traitName, prevVal) => {
        const charObj = D.GetChar(charRef);
        const traitVal = D.GetStatVal(charObj.id, traitName);
        DB({charObj, traitName, traitVal, prevVal}, "checkCharAlarms");
        if (VAL({charObj}))
            if (charObj.id in STATE.REF.charAlarms) {
                const traitCharAlarms = STATE.REF.charAlarms[charObj.id]
                    .map((x, i) => [i, x])
                    .filter((x) => x[1].traitName.startsWith(traitName.replace(/_.*$/gu, "")));
                const firingCharAlarms = [];
                if (traitCharAlarms.length) {
                    DB({traitName}, "checkCharAlarms");
                    switch (D.LCase(traitName)) {
                        case "hunger": {
                            const curVal = D.Int(traitVal);
                            prevVal = D.Int(prevVal);
                            if (curVal < 5 && prevVal === 5)
                                firingCharAlarms.push(...traitCharAlarms.filter((x) => x[1].triggerFlags.includes("offMax")));
                            else if (curVal === 5 && prevVal < 5)
                                firingCharAlarms.push(...traitCharAlarms.filter((x) => x[1].triggerFlags.includes("onMax")));
                            if (prevVal > curVal)
                                firingCharAlarms.push(...traitCharAlarms.filter((x) => x[1].triggerFlags.includes("slake")));
                            else if (prevVal < curVal)
                                firingCharAlarms.push(...traitCharAlarms.filter((x) => x[1].triggerFlags.includes("rouse")));
                            break;
                        }
                        case "health_impair_toggle":
                        case "willpower_impair_toggle":
                        case "humanity_impair_toggle": {
                            DB("Pushing Alarm...", "checkCharAlarms");
                            firingCharAlarms.push(
                                ...traitCharAlarms.filter((x) => x[1].triggerFlags.includes(D.Int(traitVal) === 1 ? "onImpair" : "offImpair"))
                            );
                            break;
                        }
                        default: {
                            DB("No Match!", "checkCharAlarms");
                            break;
                        }
                        // no default
                    }
                    DB({traitCharAlarms, firingCharAlarms}, "checkCharAlarms");
                    for (const [index, alarm] of firingCharAlarms) {
                        TimeTracker.Fire(alarm.alarm);
                        STATE.REF.charAlarms[charObj.id][index] = null;
                    }
                    STATE.REF.charAlarms[charObj.id] = _.compact(STATE.REF.charAlarms[charObj.id]);
                }
            }
    };
    // #endregion

    // #region Daysleep & Waking Up,
    const setDaysleepAlarm = () => {
        TimeTracker.SetAlarm("dusk", "daysleep", "Daysleep:", "daysleep", [], "dusk");
    };
    const refreshWillpower = (charRef) => {
        const adjustParams = {};
        if (charHasFlag(charRef, "oneWillpowerRefresh")) {
            adjustParams.amount = -1;
            adjustParams.message = "You refresh <b><u>ONE</u></b> point of Willpower:";
        } else if (charHasFlag(charRef, "minWillpowerRefresh")) {
            adjustParams.amount = -Math.min(D.GetStatVal(charRef, "composure"), D.GetStatVal(charRef, "resolve"));
            adjustParams.message = "You refresh <b><u>MINIMAL</u></b> Willpower:";
        } else {
            adjustParams.amount = -Math.max(D.GetStatVal(charRef, "composure"), D.GetStatVal(charRef, "resolve"));
            adjustParams.message = "You refresh your Willpower during daysleep:";
        }
        adjustDamage(charRef, "willpower", "superficial", adjustParams.amount, true, adjustParams.message);
    };
    const daysleep = () => {
        for (const char of D.GetChars("registered")) {
            const healWP = Math.max(D.Int(getAttrByName(char.id, "composure")), D.Int(getAttrByName(char.id, "resolve")));
            adjustDamage(char, "willpower", "superficial+", -1 * healWP);
        }
    };
    // #endregion

    // #region Populating Character Attributes & Validating Abilities
    /* ATTRIBUTES = {
        physical: ["Strength", "Dexterity", "Stamina"],
        social: ["Charisma", "Manipulation", "Composure"],
        mental: ["Intelligence", "Wits", "Resolve"]
    },
    SKILLS = {
        physical: ["Athletics", "Brawl", "Craft", "Drive", "Firearms", "Melee", "Larceny", "Stealth", "Survival"],
        social: ["Animal Ken", "Etiquette", "Insight", "Intimidation", "Leadership", "Performance", "Persuasion", "Streetwise", "Subterfuge"],
        mental: ["Academics", "Awareness", "Finance", "Investigation", "Medicine", "Occult", "Politics", "Science", "Technology"]
    },
    DISCIPLINES = ["Animalism", "Auspex", "Celerity", ...],
    TRACKERS = ["Willpower", "Health", "Humanity", "Blood Potency"], */
    const getAllAttributes = (isUniqueOnly = true) => {
        const allAttrNames = findObjs({_type: "attribute"}).map((x) => [x.get("name").replace(/^repeating_([^_]*)_[^_]*_(.*)/gu, "®_$1_$2"), x]);
        if (isUniqueOnly) {
            const uniqueAttrNames = [];
            for (const attrData of allAttrNames) {
                if (uniqueAttrNames.find((x) => x[0] === attrData[0]))
                    continue;
                uniqueAttrNames.push(attrData);
            }
            return uniqueAttrNames;
        }
        return allAttrNames;
    };
    const findBadAttrs = (isUniqueOnly = true) => {
        const badAttrStrings = [
            "[object Object]",
            "bp_slakebag",
            "_friends",
            "_flag_flag",
            "powertoggle",
            "collapsible_toggle",
            "flagnull",
            "flagbonus",
            "surgebonus",
            "surgenull",
            "resonancebonus",
            "resonancenull",
            "specialtybonus",
            "specialtynull",
            "namebonus",
            "namenull",
            "hungerbonus",
            "hungernull",
            "incapbonus",
            "incapnull",
            "detailsbonus",
            "detailsnull",
            "typebonus",
            "typenull",
            "modbonus",
            "modnull",
            "temp",
            "_1bonus",
            "_1null",
            "_2bonus",
            "_2null",
            "_3bonus",
            "_3null",
            "_kr_",
            "resonancebonus",
            "resonancenull",
            "rollarraybonus",
            "rollarraynull",
            "rolldiffbonus",
            "rolldiffnull",
            "rollmodbonus",
            "rollmodnull",
            "stainsbonus",
            "stainsnull",
            "topdisplaybonus",
            "topdisplaynull",
            "undefined",
            "Untitled",
            "aggDmg",
            "groupdetails",
            "health_maximum",
            "health_admg_social",
            "health_admg_socialtotal",
            "health_sdmg_social",
            "health_sdmg_socialtotal",
            "humanitybox",
            "incapacitation",
            "lastbox",
            "lastcollisions",
            "lasthumanity",
            "laststains",
            "mask_name",
            "repeatingprojectslist",
            "roll_array",
            "roll_params",
            "sandboxquadrant",
            "tab_type",
            "willpower_maximum",
            "domaincontrol_",
            "_ritualleft_ritualleft",
            "_ritualmid_ritualmid",
            "_ritualright_ritualright",
            "xp_arrowtoggle",
            "xp_initialtoggle",
            "xp_traittoggle",
            "xp_newtoggle",
            "blood_potency_maximum",
            "character_dobdoe"
        ];
        const badAttrRegExp = [
            "[A-Z]",
            "^summary$",
            "^bp$"
        ].map((x) => new RegExp(x, "gu"));
        const [goodAttrsList, badAttrsList] = [[], []];
        const [badAttrsByRegExp, badRepAttrsList] = [[], []];
        const [badAttrNamesState, badRepAttrsState] = [
            JSON.parse(STATE.REF.badAttrNames),
            JSON.parse(STATE.REF.badRepAttrNames)
        ];
        for (const attrData of getAllAttributes(isUniqueOnly)) {
            let isBadAttr = false;
            if (attrData[0].startsWith("®")) {
                const [, section, ...name] = attrData[0].split("_");
                if (section in badRepAttrsState && _.any(badRepAttrsState[section], (x) => x.name === name.join("_")))
                    isBadAttr = true;
            } else {
                if (badAttrNamesState.includes(attrData[0]))
                    isBadAttr = true;
            }
            if (!isBadAttr)
                for (const badAttrString of badAttrStrings)
                    if (attrData[0].includes(badAttrString) || attrData[0].toLowerCase() !== attrData[0]) {
                        isBadAttr = true;
                        break;
                    }
            if (!isBadAttr)
                for (const regExp of badAttrRegExp)
                    if (regExp.test(attrData[0])) {
                        isBadAttr = true;
                        badAttrsByRegExp.push(attrData);
                        break;
                    }
            if (isBadAttr) {
                if (attrData[0].startsWith("®")) {
                    const [, section, ...name] = attrData[0].split("_");
                    if (!(
                        isUniqueOnly
                        && badRepAttrsList.find((x) => x.section === section && x.name === name.join("_"))
                    ))
                        badRepAttrsList.push({
                            section,
                            name: name.join("_"),
                            attrObj: attrData[1]
                        });
                }
                badAttrsList.push(attrData);
            } else {
                goodAttrsList.push(attrData);
            }
        }
        const badAttrsToState = badAttrsList.filter((x) => !x[0].startsWith("®")).map((x) => x[0]).sort();
        STATE.REF.badAttrNames = JSON.stringify(badAttrsToState);
        // D.Alert(D.JS(badAttrsToState));
        // STATE.REF.badAttrNames = badAttrsList.filter((x) => !x[0].startsWith("®")).map((x) => x[0]).sort();
        /* STATE.REF.badRepAttrNames = D.Clone(STATE.REF.TESTBadRepAttrNamesBackup);
        STATE.REF.TESTBadRepAttrNamesBackup = _.mapObject(_.groupBy(badRepAttrsList.map((x) => _.omit(x, "attrObj")), "section"), (v) => v.map((x) => _.omit(x, "section")));
        const badRepAttrs = _.mapObject(_.groupBy(badRepAttrsList.map((x) => _.omit(x, "attrObj")), "section"), (v) => v.map((x) => _.omit(x, "section")));
        D.Merge(STATE.REF.badRepAttrNames, badRepAttrs, true, true); */
        STATE.REF.badRepAttrNames = JSON.stringify(_.mapObject(_.groupBy(badRepAttrsList.map((x) => _.omit(x, "attrObj")), "section"), (v) => v.map((x) => _.omit(x, "section"))));
        return [goodAttrsList, badAttrsList, badAttrsByRegExp];
    };
    const validateCharAttributes = (charRefs, isChangingSheet = false) => {
        const [reportLines, nameChanges] = [[], []];
        for (const charObj of D.GetChars(charRefs))
            try {
                if (VAL({charObj})) {
                    const allAttrObjs = findObjs({
                        _type: "attribute",
                        _characterid: charObj.id
                    });
                    const repOrderAttrObjs = allAttrObjs.filter((x) => x.get("name").startsWith("_reporder"));
                    const repAttrObjs = allAttrObjs.filter((x) => x.get("name").startsWith("repeating_"));
                    const nonRepAttrObjs = allAttrObjs.filter((x) => !x.get("name").startsWith("repeating_") && !x.get("name").startsWith("_reporder"));
                    const nonRepAttrValPairs = nonRepAttrObjs.map((x) => [x, x.get("name")]); // .map(x => [x, x.get("name").replace(/repeating_(.{1,3}).*?_(-.*?)_(.*?)$/gu, "$1_$3")])
                    const repAttrValTrips = repAttrObjs
                        .map((x) => [
                            x,
                            x
                                .get("name")
                                .split("_")
                                .slice(1)
                        ])
                        .map((x) => {
                            x[1].splice(1, 1);
                            return [x[0], x[1][0], x[1].slice(1).join("_")];
                        }); // [object, section, attrName]
                    for (const attrPair of nonRepAttrValPairs)
                        if (attrPair[1].length > 1 && attrPair[1] !== D.LCase(attrPair[1])) {
                            nameChanges.push(`${attrPair[1]} !== ${D.LCase(attrPair[1])}, setting name to <b>${D.LCase(attrPair[1])}</b>.`);
                            attrPair[1] = D.LCase(attrPair[1]);
                            if (isChangingSheet)
                                attrPair[0].set("name", D.LCase(attrPair[1]));
                        }
                    for (const repAttrTrip of repAttrValTrips) {
                        const [, section, id, ...splitName] = repAttrTrip[0].get("name").split("_");
                        const name = splitName.join("_");
                        const deltaRepAttr = {section: false, name: false};
                        if (section.length > 1 && section !== D.LCase(section)) {
                            deltaRepAttr.section = D.LCase(section);
                            repAttrTrip[1] = D.LCase(section);
                        }
                        if (name.length > 1 && name !== D.LCase(name)) {
                            deltaRepAttr.name = D.LCase(name);
                            repAttrTrip[2] = D.LCase(name);
                        }
                        if (deltaRepAttr.section || deltaRepAttr.name) {
                            const newName = `repeating_${deltaRepAttr.section || section}_${id}_${deltaRepAttr.name || name}`;
                            nameChanges.push(`${repAttrTrip[0].get("name")} !== <b>${newName}</b>, setting repAttr.'`);
                            if (isChangingSheet)
                                repAttrTrip[0].set("name", newName);
                        }
                    }

                    const obsoleteAttrValPairs = nonRepAttrValPairs.filter(
                        (x) => !Object.keys(C.SHEETATTRS)
                            .map((xx) => D.LCase(xx))
                            .includes(D.LCase(x[1]))
                    );
                    const obsoleteRepAttrValTrips = repAttrValTrips.filter(
                        (x) => {
                            const [, section, id, ...splitName] = x[0].get("name").split("_");
                            const name = splitName.join("_");
                            return !(section in C.REPATTRS && C.REPATTRS[section].includes(name));
                        }
                    );
                    const nonRepAttrNames = nonRepAttrValPairs.map((x) => D.LCase(x[1]));
                    const missingDefaultAttrTrips = _.omit(D.Clone(C.SHEETATTRS), (v, k) => nonRepAttrNames.includes(D.LCase(k).replace(/_max/gu, "")));

                    const dupeNameRecord = [];
                    const dupeRepAttrValTrips = [];
                    repAttrValTrips.forEach((x) => {
                        const fullName = x[0].get("name");
                        if (dupeNameRecord.includes(fullName))
                            dupeRepAttrValTrips.push(x);
                        else
                            dupeNameRecord.push(fullName);
                    });

                    // missingDefaultAttrTrips.marquee_toggle = 1;

                    if (isChangingSheet) {
                        setAttrs(charObj.id, missingDefaultAttrTrips);
                        for (const [attrObj] of obsoleteAttrValPairs)
                            if (VAL({object: attrObj}))
                                attrObj.remove();
                        for (const [attrObj] of obsoleteRepAttrValTrips)
                            if (VAL({object: attrObj}))
                                attrObj.remove();
                        for (const [attrObj] of dupeRepAttrValTrips)
                            if (VAL({object: attrObj}))
                                attrObj.remove();
                    }
                    reportLines.push(
                        ...[
                            `<h4>${D.GetName(charObj)}:</h4>`,
                            `${allAttrObjs.length} Attributes Found:`,
                            `... ${repOrderAttrObjs.length} '_reporder' Attributes,`,
                            `... ${repAttrValTrips.length} Repeating Attributes,`,
                            `... ... including ${dupeRepAttrValTrips.length} Duplicates,`,
                            `... ${nonRepAttrObjs.length} Non-Repeating, Non-RepOrder Attributes`,
                            `... ... ${nonRepAttrValPairs.length} Attribute Name/Value Pairs Compiled.`,
                            "",
                            "<b><u>NAMES CHANGED</u>:</b>",
                            `${nameChanges.length} Attributes With Uppercase Names:`,
                            D.JS(nameChanges),
                            "",
                            "<b><u>OBSOLETE ATTRIBUTES REMOVED</u>:</b>",
                            `${obsoleteAttrValPairs.length} OBSOLETE Attributes found and removed:`,
                            D.JS(obsoleteAttrValPairs.map((x) => x[1])),
                            "",
                            "<b><u>OBSOLETE REP-ATTRIBUTES REMOVED</u>:</b>",
                            `${obsoleteRepAttrValTrips.length} OBSOLETE Attributes found and removed:`,
                            D.JS(obsoleteRepAttrValTrips.map((x) => `<b>${x[1]}</b>: ${x[2]}`)),
                            "",
                            "<b><u>DUPLICATE REP-ATTRIBUTES REMOVED</u>:</b>",
                            `${dupeRepAttrValTrips.length} DUPLICATE Attributes found and removed:`,
                            D.JS(dupeRepAttrValTrips.map((x) => `<b>${x[1]}</b>: ${x[2]}`)),
                            "",
                            "<b><u>DEFAULT ATTRIBUTES APPLIED</u>:</b>",
                            D.JS(missingDefaultAttrTrips),
                            "",
                            /* "<b><u>_RepOrder Attributes</u>:</b>",
                            D.JS(repOrderAttrObjs.map(x => x.get("name").replace(/_reporder_(repeating_)?/gu, ""))),
                            "<b><u>Repeating Attributes</u>:</b>",
                            D.JS(repAttrGroupString),
                            "", */
                            (isChangingSheet && "<h4 style=\"color: red;\">SHEET HAS BEEN CHANGED!</h4>") || "<i>(No Changes to Sheet)</i>"
                        ]
                    );
                }
            } catch (errObj) {
                D.Alert(`ERROR: ${D.JS(errObj)}`, "validateCharAttributes");
            }
        D.Alert(reportLines.join("<br>"), "Character Attribute Validation");
    };
    const populateDefaults = (charRef) => {
        // Initializes (or resets) a given character with default values for all stats.
        // Can provide a number for charRef, in which case it will reset values of 10 characters starting from that index position in the keys of NPCSTATS.
        const attrList = {};
        const charIDs = [];
        const npcStats = JSON.parse(NPCSTATS);
        const npcDefaults = D.Clone(C.SHEETATTRS);
        _.each(npcDefaults, (v, k) => {
            attrList[k] = v;
        });
        if (_.isNaN(D.Int(charRef))) {
            charIDs.push(D.GetChar(charRef).id);
        } else {
            charIDs.push(...Object.keys(npcStats).slice(D.Int(charRef), D.Int(charRef) + 10));
            D.Alert(`Setting Defaults on characters ${D.Int(charRef)} - ${D.Int(charRef) + 10} of ${Object.keys(npcStats).length} ...`);
        }
        const reportLine = [];
        for (const charID of charIDs) {
            setAttrs(charID, attrList);
            reportLine.push(`Set Defaults on ${D.GetName(charID)}`);
            _.each(["discleft", "discmid", "discright"], (v) => {
                _.each(D.GetRepIDs(charID, v), (vv) => {
                    D.DeleteRow(charID, v, vv);
                });
            });
        }
        D.Alert(reportLine.join("<br>"), "CHARS: populateDefaults()");
    };
    const changeAttrName = (oldName, newName) => {
        const allChars = findObjs({
            _type: "character"
        });
        const attrList = {};
        for (const char of allChars) {
            attrList[char.get("name")] = [];
            const [attr] = findObjs({
                _type: "attribute",
                _characterid: char.id,
                name: oldName
            });
            if (attr) {
                attrList[char.get("name")].push({
                    [newName]: attr.get("current"),
                    [`${newName}_max`]: attr.get("max")
                });
                setAttrs(char.id, {
                    [newName]: attr.get("current"),
                    [`${newName}_max`]: attr.get("max")
                });
                // attr.remove();
            }
        }
        // D.Alert(D.JS(attrList));
    };
    const changeRepAttrName = (section, oldName, newName) => {
        const allChars = findObjs({
            _type: "character"
        });
        // const allChars = D.GetChars("registered");
        for (const char of allChars) {
            const deltaAttrs = {};
            for (const oldAttrObj of _.uniq(_.compact(D.GetRepStats(char, section, null, oldName, null, "obj"))))
                try {
                    const newNameFull = oldAttrObj.get("name").replace(new RegExp(`${oldName}$`), newName);
                    deltaAttrs[newNameFull] = oldAttrObj.get("current");
                    deltaAttrs[`${newNameFull}_max`] = oldAttrObj.get("max");
                } catch (errObj) {
                    // DB({char: char.get("name"), oldAttrObj, [`ERROR (${section}, ${oldName})`]: D.GetRepStats(char, section, null, oldName, null, "obj")}, "changeRepAttrName");
                    THROW("Error Report", "changeRepAttrName", errObj);
                    continue;
                }

            // DB({char: char.get("name"), deltaAttrs}, "changeRepAttrName");
            setAttrs(char.id, deltaAttrs);
        }
    };
    const setNPCStats = (charRef) => {
        // Applies NPCSTATS (output from the NPC Stats Google Sheet) to the given character reference, OR all characters in NPC stats.
        const charNames = [];
        const npcStats = JSON.parse(NPCSTATS);
        let errorLog = "";
        if (charRef)
            charNames.push(D.GetChar(charRef).get("name"));
        else
            charNames.push(...Object.keys(npcStats));

        for (const charName of charNames) {
            const charObj = D.GetChar(charName);
            const charID = (charObj || {id: false}).id;
            const attrList = {};
            const charData = npcStats[charName];
            if (charData.base)
                for (const attr of Object.keys(charData.base)) {
                    if (attr === "blood_potency")
                        attrList.hunger = C.BLOODPOTENCY[charData.base[attr]].bp_minhunger;
                    attrList[attr] = charData.base[attr];
                }
            if (charData.attributes) {
                for (const attribute of _.flatten(_.values(C.ATTRIBUTES)))
                    attrList[attribute.toLowerCase()] = 1;
                for (const attribute of Object.keys(charData.attributes))
                    attrList[attribute] = charData.attributes[attribute];
            }
            if (charData.skills) {
                const skillDupeCheck = _.compact(_.flatten(_.map(_.values(charData.skills), (v) => v.split(/\s+/gu))));
                if (_.uniq(skillDupeCheck).length !== skillDupeCheck.length)
                    errorLog += `<br>Duplicate Skill(s) on ${D.GetName(charID)}: ${_.sortBy(skillDupeCheck, (v) => v).join(" ")}`;
                else
                    for (const skillAbv of Object.keys(C.SKILLABBVS))
                        attrList[C.SKILLABBVS[skillAbv]] = D.Int(_.findKey(charData.skills, (v) => v.includes(skillAbv)));
            }
            if (charData.clandiscs)
                _.each(["disc1", "disc2", "disc3"], (discnum) => {
                    if (charData.clandiscs[discnum].length)
                        [attrList[`${discnum}_name`], attrList[discnum]] = charData.clandiscs[discnum];
                    else
                        [attrList[`${discnum}_name`], attrList[discnum]] = ["", 0];
                });
            const [repDiscs, rowCount] = [{}, {}];
            _.each(["discleft", "discmid", "discright"], (section) => {
                const sectionData = D.GetRepStats(charID, section, null, null, "rowID");
                rowCount[section] = Object.keys(sectionData).length;
                _.each(sectionData, (rowData, rowID) => {
                    const discData = _.find(rowData, (stat) => Object.keys(C.DISCIPLINES).includes(stat.name));
                    if (discData)
                        repDiscs[discData.name] = {
                            sec: section,
                            rowID,
                            val: D.Int(discData.val)
                        };
                    else
                        D.DeleteRow(charID, section, rowID);
                });
            });
            if (charData.otherdiscs) {
                const otherDiscs = [];
                const discDupeCheck = _.compact([
                    ..._.map(_.compact(_.values(charData.clandiscs)), (v) => v[0]),
                    ..._.flatten(_.map(_.compact(_.values(charData.otherdiscs)), (v) => _.map(v.split(/\s+/gu), (vv) => C.DISCABBVS[vv])))
                ]);
                if (_.uniq(discDupeCheck).length !== discDupeCheck.length) {
                    errorLog += `<br>Duplicate Discipline(s) on ${D.GetName(charID)}: ${_.sortBy(discDupeCheck, (v) => v).join(" ")}`;
                } else {
                    for (const discAbv of Object.keys(C.DISCABBVS)) {
                        const discName = C.DISCABBVS[discAbv];
                        if (Object.keys(repDiscs).includes(discName))
                            if (_.findKey(charData.otherdiscs, (v) => v.includes(discAbv)))
                                attrList[`repeating_${repDiscs[discName].sec}_${repDiscs[discName].rowID}_disc`] = D.Int(
                                    _.findKey(charData.otherdiscs, (v) => v.includes(discAbv))
                                );
                            else {
                                D.DeleteRow(charID, repDiscs[discName].sec, repDiscs[discName].rowID);
                                rowCount[repDiscs[discName].sec]--;
                            }
                        else if (_.findKey(charData.otherdiscs, (v) => v.includes(discAbv)))
                            otherDiscs.push([discName, D.Int(_.findKey(charData.otherdiscs, (v) => v.includes(discAbv)))]);
                    }
                    while (otherDiscs.length) {
                        const thisDisc = otherDiscs.pop();
                        const targetSec = _.min(
                            [
                                {sec: "discleft", num: rowCount.discleft},
                                {sec: "discmid", num: rowCount.discmid},
                                {sec: "discright", num: rowCount.discright}
                            ],
                            (v) => v.num
                        ).sec;
                        // D.Alert(`D.MakeRow(ID, ${targetSec}, {disc_name: ${thisDisc[0]}, disc: ${thisDisc[1]} })`)
                        rowCount[targetSec]++;
                        D.MakeRow(charID, targetSec, {disc_name: thisDisc[0], disc: thisDisc[1]});
                    }
                }
            }
            attrList.roll_array = "";
            attrList.rollpooldisplay = "";
            setAttrs(charID, attrList, {}, () => {
                // D.Alert("Callback Function Passed!")
                setAttrs(charID, {hunger: Math.max(1, D.Int(getAttrByName("bp_slakekill")))});
            });
            D.Alert(`ATTRLIST FOR ${D.GetName(charID)}:<br><br>${D.JS(attrList)}`);
        }
        D.Alert(`Error Log:<br>${D.JS(errorLog)}`, "CHARS: setNPCStats()");
    };
    // #endregion

    return {
        CheckInstall: checkInstall,
        OnChatCall: onChatCall,
        OnAttrChange: onAttrChange,
        OnAttrAdd: onAttrAdd,
        OnAttrDestroy: onAttrDestroy,
        OnCharAdd: onCharAdd,

        LINKEDSTATS,

        get REGISTRY() {
            return STATE.REF.registry;
        },
        TogglePC: togglePlayerChar,
        SetNPC: setCharNPC,
        ProcessTokenPowers: processTokenPowers,
        AddCharFlag: addCharFlag,
        DelCharFlag: delCharFlag,
        Damage: adjustDamage,
        AdjustTrait: adjustTrait,
        AdjustHunger: adjustHunger,
        AdjustStatMod: adjustTempStat,
        RefreshWillpower: refreshWillpower,
        DaySleep: daysleep,
        AwardXP: awardXP,
        LaunchProject: launchProject,
        SendHome: sendCharsHome,
        SendBack: restoreCharsPos,
        PromptTraitSelect: traitSelectMenu,
        RefreshDisplays: () => {
            displayDesires();
            displayResources();
            updateAssetsDoc();
            updateProjectsDoc();
            updateHunger();
        },
        get SelectedChar() {
            if (STATE.REF.charSelection) {
                const charObj = getObj("character", STATE.REF.charSelection);
                delete STATE.REF.charSelection;
                return charObj;
            } else {
                return false;
            }
        },
        get SelectedTraits() {
            const selTraits = [...STATE.REF.traitSelection];
            STATE.REF.traitSelection = [];
            Media.SetText("secretRollTraits", " ");
            return (selTraits.length && selTraits) || false;
        }
    };
})();

on("ready", () => {
    Char.CheckInstall();
    D.Log("Char Ready!");
});
void MarkStop("Char");
