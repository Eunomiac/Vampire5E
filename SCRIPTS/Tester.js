void MarkStart("Tester");
const Tester = (() => {
    // #region ▒░▒░▒░▒[FRONT] Boilerplate Namespacing & Initialization ▒░▒░▒░▒ ~
    const SCRIPTNAME = "Tester";

    // #region COMMON INITIALIZATION
    const STATE = {
        get REF() {
            return C.RO.OT[SCRIPTNAME];
        }
    }; // sub5 = _.partial(subtract, 5);
    // const VAL = _.partial(D.Validate, _, _, SCRIPTNAME, _);
    const VAL = _.partial(D.Validate, _, _, SCRIPTNAME, _); // (varList, funcName, isArray = false) => D.Validate(varList, funcName, SCRIPTNAME, isArray);
    const DB = _.throttle(_.partial(D.DBAlert, _, _, SCRIPTNAME), 1000, {trailing: true}); // (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME);
    const LOG = _.partial(D.Log, _, _, SCRIPTNAME); // (msg, funcName) => D.Log(msg, funcName, SCRIPTNAME);
    const THROW = _.partial(D.ThrowError, _, _, SCRIPTNAME, _); // (msg, funcName, errObj) => D.ThrowError(msg, funcName, SCRIPTNAME, errObj);

    const checkInstall = () => {
        C.RO.OT[SCRIPTNAME] = C.RO.OT[SCRIPTNAME] || {};
        initialize();
    };
    // #endregion

    // #region LOCAL INITIALIZATION
    const initialize = () => {
        STATE.REF.isLocWalking = STATE.REF.isLocWalking || false;
        STATE.REF.locWalkDuration = STATE.REF.locWalkDuration || 120;

        if (STATE.REF.isLocWalking)
            locationWalk();
    };

    const fuz = Fuzzy.Fix();
    // #endregion

    // #region EVENT HANDLERS: (HANDLEINPUT)
    let locWalkTimer = false;
    const onChatCall = (call, args, objects, msg) => {
        let isKilling, isWriting;
        switch (call) {
            case "params": {
                const params = D.ParseParams(args, ",");
                const paramTypes = D.KeyMapObj(params, null, (v) => `${v} -> ${typeof v}`);
                D.Show({params, paramTypes});
                break;
            }
            case "gmonline": {
                D.Flag(`${D.GMOnline}`);
                break;
            }
            case "locwalk": {
                if (STATE.REF.isLocWalking) {
                    STATE.REF.isLocWalking = false;
                    if (locWalkTimer) {
                        clearTimeout(locWalkTimer);
                        locWalkTimer = false;
                    }
                    D.Flag("Location Walking Stopped.");
                } else {
                    STATE.REF.isLocWalking = true;
                    const durSecs = args.length ? D.Int(args.pop()) : STATE.REF.locWalkDuration;
                    if (VAL({int: durSecs}) && durSecs >= 15)
                        STATE.REF.locWalkDuration = durSecs;
                    else
                        STATE.REF.locWalkDuration = 60;
                    locationWalk();
                }
                break;
            }
            case "effectshandout": {
                const parseRollEffectsHandout = () => {
                    const noteObj = Handouts.Get("Roll Effects");
                    if (noteObj)
                        noteObj.get("notes", (noteContents) => {
                            const noteRows = noteContents.match(/<tr>(.*?)<\/tr>/gu).map((x) => x
                                .replace(/<br><\/t(d|h)>/gu, "</t$1>")
                                .replace(/<br>/gu, "/")
                                .replace(/<\/td>/gu, "|")
                                .replace(/(<script(\s|\S)*?<\/script>)|(<style(\s|\S)*?<\/style>)|(<!--(\s|\S)*?-->)|(<\/?(\s|\S)*?>)/gu, ""));
                            const effects = [];
                            for (const noteRow of noteRows)
                                if (noteRow.length > 20 && noteRow.endsWith("|")) {
                                    const [isActive, scope, restrictions, mod, rollDisplay, sheetDisplay, offTrigger] = noteRow.split("|");
                                    effects.push({
                                        isActive: isActive === "X",
                                        scope: scope === "Global" ? "all" : D.GetChar(scope),
                                        restrictions: restrictions.split(/\//gu),
                                        mod: isNaN(mod) ? mod : D.Int(mod),
                                        rollDisplay: `${rollDisplay}`,
                                        sheetDisplay: `${sheetDisplay}`,
                                        offTrigger: (!offTrigger || offTrigger === "never") ? false : TimeTracker.GetDate(offTrigger)
                                    });
                                }

                            D.Show(effects);
                        });
                };
                parseRollEffectsHandout();
                break;
            }
            case "tokens": {
                const allTokens = _.sortBy(findObjs({
                    // _pageid: C.PAGES.GAME,
                    _type: "graphic"
                }).filter((x) => x.get("represents")), (x) => x.get("name")).map((x) => `${D.GetName(x)}: ${x.get("layer")} (${_.findKey(C.PAGES, (v) => v === x.get("_pageid"))})`);
                D.Alert([
                    "<h3>Token Objects</h3>",
                    ...allTokens
                ].join("<br>"), "!test tokens");
                break;
            }
            case "locationpos": {
                const reportLines = [];
                for (const [key, data] of Object.entries(Object.assign({}, Media.IMAGES, Media.TEXT))) {
                    reportLines.push(`[&quot;${key.replace(/_\d*$/gu, "")}&quot;, {left: ${D.Int(data.left, true)}, top: ${D.Int(data.top, true)}, height: ${D.Int(data.height, true)}, width: ${D.Int(data.width, true)} }],`);
                    if (VAL({list: data.srcs}))
                        reportLines.push(`\t[${Object.keys(data.srcs).map((x) => `&quot;${x}&quot;`).join(", ")}]`);
                }
                D.Alert(reportLines.join("<br>"), "Media Data");
                break;
            }
            case "getstat": case "getstatval": {
                let [charRef, statName, repRowStatName] = args;
                if (!statName) {
                    D.Alert([
                        "<b>SYNTAX:</b>",
                        "<br>!test getstat &lt;charRef&gt; &lt;statName&gt; &lt;repRowStatName&gt;"
                    ].join("<br>"), "!test getstat/getstatval");
                    break;
                }
                repRowStatName = repRowStatName === "null" ? null : repRowStatName;
                D.SetTempDebugWatch(["getStat"]);
                const statData = call === "getstatval" ? D.GetStatVal(charRef, statName, repRowStatName) : D.GetStat(charRef, statName, repRowStatName);
                D.Alert([
                    "<h4>Call:</h4>",
                    "D.GetStat(",
                    `     charRef: ${D.JS(charRef)}`,
                    `     statName: ${D.JS(statName)}`,
                    `     repRowStatName: ${D.JS(repRowStatName)}`,
                    ")",
                    "<h4>Return:</h4>",
                    D.JS(statData, true)
                ].join("<br>"), "Testing GetStat/GetStatVal");
                break;
            }
            case "repstats": {
                let [charRef, section, rowFilter, statName, groupBy, pickProperty] = args;
                if (!rowFilter) {
                    D.Alert([
                        "<h3>C.REPATTRS</h3>",
                        D.JS(C.REPATTRS, false, true),
                        " ",
                        "<b>SYNTAX:</b>",
                        "<b>!test repstats &lt;charRef&gt; &lt;section&gt; &lt;rowFilter&gt; &lt;statName&gt; &lt;groupBy&gt; &lt;pickProperty&gt;</b>",
                        "<i>!test repstats &quot;Johannes Napier&quot; advantage &quot;type:background&quot; &quot;Haven (Harbord Village)&quot;</i>",
                        "<i>!char set stat &lt;section&gt; &lt;lookupStat:lookupVal&gt; &lt;setStat:setVal&gt;</i>",
                        " ",
                        "<ul><li>Can skip a parameter with 'null'.",
                        "<li>rowFilter: string --- Either a RowID or &quot;top&quot; to get topmost entry.",
                        "<li>rowFilter: list --- {statName: statValue} to match row. ALL must match. Can set value to &quot;*&quot; to just check for existence of key.",
                        "<li>rowFilter: array --- Array of the above, linked via OR</ul>",
                        "Array Syntax: ' &quot;[&lt;item1&gt;, &lt;item2&gt;, &lt;item3&gt;]&quot; '",
                        "List Syntax: ' &quot;&lt;key&gt;:&lt;val&gt;, &lt;key&gt;:&lt;val&gt;&quot; '"
                    ].join("<br>"), "!test repstats");
                    break;
                }
                D.SetTempDebugWatch(["getRepStats", "getRepIDs"]);
                charRef = charRef === "null" ? null : D.GetChar(charRef);
                section = section === "null" ? null : section;
                statName = statName.startsWith("[") ? statName.replace(/[\[\]]/gu, "").split(/, ?/gu) : statName;
                statName = statName === "null" ? null : statName;
                groupBy = groupBy === "null" ? null : groupBy;
                pickProperty = pickProperty === "null" ? null : pickProperty;
                rowFilter = rowFilter.startsWith("[") ? rowFilter.replace(/[\[\]]/gu, "").split(/, ?/gu) : rowFilter;
                rowFilter = rowFilter.includes(":") ? D.ParseParams(rowFilter, ",") : rowFilter;
                rowFilter = rowFilter === "null" ? null : rowFilter;

                // !test repstats "Johannes Napier" advantage null "Haven (Harbord Village)"
                // !char set stat <name> <value>   OR   !char set stat <section> <name> <value>

                let repStatData = D.GetRepStats(charRef, section, rowFilter, statName, groupBy, pickProperty);
                if (!pickProperty)
                    if (VAL({array: repStatData}))
                        repStatData = repStatData.map((x) => _.omit(x, "obj"));
                    else if (VAL({list: repStatData}))
                        repStatData = D.KeyMapObj(repStatData, null, (v) => v.map((x) => _.omit(x, "obj")));
                D.Alert([
                    "<h4>Call:</h4>",
                    "D.GetRepStats(",
                    `     charRef: ${D.JS(charRef)}`,
                    `     section: ${D.JS(section)}`,
                    `     rowFilter: ${D.JS(rowFilter)}`,
                    `     statName: ${D.JS(statName)}`,
                    `     groupBy: ${D.JS(groupBy)}`,
                    `     pickProperty: ${D.JS(pickProperty)}`,
                    ")",
                    "<h4>Return:</h4>",
                    D.JS(repStatData, true)
                ].join("<br>"), "Testing Repstats");
                break;
            }
            case "jukeboxfolder": {
                D.Show(JSON.parse(Campaign().get("_jukeboxfolder")));
                break;
            }
            case "trackobjs": {
                D.Alert(findObjs({_type: "jukeboxtrack"}).map((x) => `<b>${x.id}:</b> ${x.get("title")}`).join("<br>"), "!test trackobjs");
                break;
            }
            case "timesync": {
                if (args[0] === "reset") {
                    STATE.REF.timeSync = false;
                    args.shift();
                }
                if (STATE.REF.timeSync) {
                    const MINCONVERTER = 1 / (60 * 1000);
                    const {startGameDate, startRealDate, secsPerMin} = STATE.REF.timeSync;
                    const [curGameDate, curRealDate] = [new Date(TimeTracker.CurrentDate), new Date()];
                    curRealDate.setUTCHours(curRealDate.getUTCHours() - 4);
                    const [deltaGameTime, deltaRealTime] = [
                        (curGameDate - startGameDate),
                        (curRealDate - startRealDate)
                    ];
                    const multiplier = 60 / secsPerMin;
                    const validDeltaGameTime = deltaRealTime * multiplier;
                    const validGameDate = new Date(startGameDate.getTime() + validDeltaGameTime);
                    D.Alert([
                        "<h4>Ending Time Sync Test</h4>",
                        `<b>Game Time:</b> ${TimeTracker.FormatTime(startGameDate)} - ${TimeTracker.FormatTime(curGameDate)}<br>`,
                        `<b>Real Time:</b> ${TimeTracker.FormatTime(startRealDate)} - ${TimeTracker.FormatTime(curRealDate)}<br>`,
                        `<b>Secs Per Min:</b> ${secsPerMin}<br>`,
                        `<b>Game Delta Mins:</b> ${D.Float(deltaGameTime * MINCONVERTER, 3)}<br>`,
                        `<b>Real Delta Mins:</b> ${D.Float(deltaRealTime * MINCONVERTER, 3)}<br>`,
                        `<b>Valid Game Delta Mins:</b> ${D.Float(validDeltaGameTime * MINCONVERTER, 3)}<br>`,
                        `<b>Valid Game Time:</b> ${TimeTracker.FormatTime(validGameDate)}<br>`,
                        `<b>Real Multiplier:</b> ${D.Float(deltaGameTime / deltaRealTime, 4)}<br>`,
                        `<b>Valid Multiplier:</b> ${(multiplier)}<br>`
                    ].join(""), "!test timesync");
                    STATE.REF.timeSync = false;
                } else {
                    const secsPerMin = D.Int(args[0]) || 60;
                    const curRealDate = new Date();
                    curRealDate.setUTCHours(curRealDate.getUTCHours() - 4);
                    const curDate = new Date(TimeTracker.CurrentDate);
                    curDate.setUTCHours(curRealDate.getUTCHours());
                    curDate.setUTCMinutes(curRealDate.getUTCMinutes());
                    STATE.REF.timeSync = {startGameDate: new Date(curDate), startRealDate: new Date(curRealDate), secsPerMin};
                    TimeTracker.CurrentDate = curDate;
                    TimeTracker.ToggleClock(true, secsPerMin);
                    TimeTracker.Fix();
                    D.Alert([
                        "<h4>Starting Time Sync Test</h4>",
                        `<b>Start Time:</b> ${TimeTracker.FormatTime(curDate)}<br>`,
                        `<b>Secs Per Min:</b> ${secsPerMin}<br>`
                    ].join(""), "!test timesync");
                }
                switch (D.LCase(call = args.shift())) {
                    case "case1": {
                        break;
                    }
                    // no default
                }

                break;
            }
            case "prompt": {
                switch (D.LCase((call = args.shift()))) {
                    case "get": {
                        const reportLines = {
                            PromptAuthors: state.VAMPIRE.Session.PromptAuthors,
                            isPromptingGeneric: state.VAMPIRE.Session.isPromptingGeneric,
                            arePromptsAssignable: state.VAMPIRE.Session.arePromptsAssignable
                        };
                        if ("character" in objects) {
                            const [charObj] = Listener.GetObjects(objects, "character");
                            const charData = D.GetCharData(charObj);
                            reportLines.SpotlightPrompts = state.VAMPIRE.Session.SpotlightPrompts[charData.initial];
                            reportLines.CharRegistry = charData;
                        } else {
                            reportLines.CharRegistry = D.KeyMapObj(
                                D.Clone(state.VAMPIRE.Char.registry),
                                (k, v) => v.initial,
                                (v) => _.pick(v, "spotlightPrompt")
                            );
                            reportLines.SpotlightPrompts = state.VAMPIRE.Session.SpotlightPrompts;
                        }
                        D.Show(reportLines);
                        break;
                    }
                    case "save": {
                        STATE.REF.SpotlightPromptsBackup = D.Clone(state.VAMPIRE.Session.SpotlightPrompts);
                        STATE.REF.SpotlightPromptsCharsBackup = D.KeyMapObj(D.Clone(state.VAMPIRE.Char.registry), null, (v) => _.pick(v, "spotlightPrompt"));
                        STATE.REF.PromptAuthors = D.Clone(state.VAMPIRE.Session.PromptAuthors);
                        D.Alert(
                            D.JS({
                                SpotlightPromptsBackup: STATE.REF.SpotlightPromptsBackup,
                                SpotlightPromptsCharsBackup: STATE.REF.SpotlightPromptsCharsBackup,
                                PromptAuthorsBackup: STATE.REF.PromptAuthors
                            }),
                            "!test prompt save"
                        );
                        break;
                    }
                    case "reset": {
                        state.VAMPIRE.Session.PromptAuthors = D.Clone(STATE.REF.PromptAuthors);
                        state.VAMPIRE.Session.SpotlightPrompts = D.Clone(STATE.REF.SpotlightPromptsBackup);
                        state.VAMPIRE.Char.registry = D.KeyMapObj(state.VAMPIRE.Char.registry, null, (v, k) => Object.assign(v, STATE.REF.SpotlightPromptsCharsBackup[k]));
                        D.Alert(
                            `Spotlight Prompt Data Reset:<br><br>${D.JS(
                                D.KeyMapObj(D.Clone(state.VAMPIRE.Char.registry), null, (v) => _.pick(v, "spotlightPrompt"))
                            )}`,
                            "!test prompt reset"
                        );
                        break;
                    }
                    // no default
                }
                break;
            }
            case "chars": {
                switch (D.LCase((call = args.shift()))) {
                    case "backup": {
                        for (const charObj of D.GetChars("registered")) {
                            const charAttrs = findObjs({
                                _type: "attribute",
                                _characterid: charObj.id
                            });
                            Handouts.Report(D.GetName(charObj), charAttrs, true);
                        }
                        break;
                    }
                    case "code": {
                        STATE.REF.CharCode = {};
                        for (const charObj of D.GetChars("registered"))
                            Handouts.ParseCode(D.GetName(charObj), STATE.REF.CharCode, D.GetName(charObj));
                        break;
                    }
                    // no default
                }
                break;
            }
            case "statelength": {
                const lengthVals = {};
                for (const [key, value] of Object.entries(state.VAMPIRE)) {
                    lengthVals[`*** ${D.UCase(key)} ***`] = JSON.stringify(value).length;
                    for (const [kkey, vvalue] of Object.entries(value))
                        lengthVals[`${key}.${kkey}`] = JSON.stringify(vvalue).length;
                }
                D.Alert(`${D.JS(lengthVals)}<br><br><b>TOTAL:${JSON.stringify(state.VAMPIRE).length}`, "State Variable Contents");
                break;
            }
            // no default
        }
        /* #region OLD TESTS
            case "allobjs": {
                const allObjs = findObjs({
                    _type: args[0]
                });
                D.Alert(D.JS(allObjs.map(x => `<b>${x.get("name")}</b>: ${x.get("layer") || ""}`)), "All Objects");
                break;
            }
        #endregion */
    };
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    const locationWalk = () => {
        if (!STATE.REF.isLocWalking)
            return false;
        const distName = _.sample(Object.keys(C.DISTRICTS));
        const siteName = _.sample(Object.keys(_.pick(C.SITES, (v) => (v.district === null || v.district.includes(distName)) && (Session.IsOutside || v.outside))));
        Session.SetLocation({DistrictCenter: [distName], SiteCenter: [siteName]});
        TimeTracker.SetWeatherOverride(_.sample(["xxZhw2", "xfZmx1", "bxzdv5", "bfzdg3", "cxzdw4", "cfZsx3", "pxZhh1", "pfZmw0", "sxzdw2", "sfzdx4", "txZsv3", "tfZhg0", "wxZmw0", "wfZsx1"]));
        if (locWalkTimer)
            clearTimeout(locWalkTimer);
        locWalkTimer = setTimeout(locationWalk, STATE.REF.locWalkDuration * 1000);
        return true;
    };

    return {
        CheckInstall: checkInstall,
        OnChatCall: onChatCall
    };
})();

on("ready", () => {
    Tester.CheckInstall();
    D.Log("Tester Ready!");
});
void MarkStop("Tester");
