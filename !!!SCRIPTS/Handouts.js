void MarkStart("Handouts");
const Handouts = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Handouts";

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
    };
    // #endregion

    // #region LOCAL INITIALIZATION
    const preInitialize = () => {
        // delete STATE.REF.categoryLogs;
        STATE.REF.registry = STATE.REF.registry || {};
        STATE.REF.noteCounts = STATE.REF.noteCounts || {projects: 0, debug: 0};
        STATE.REF.categoryLogs = STATE.REF.categoryLogs || {projects: [], debug: [], callLogs: []};
        // STATE.REF.categoryLogs.callLogs = [];

        /* const handOutTitles = [
            "Character Stat Summary",
            "Character Details",
            "MEMO: Active Projects",
            "MEMO: Fielded Assets",
            "Ava Wong",
            "Bacchus Giovanni",
            "Dr. Arthur Roy",
            "Johannes Napier",
            "Locke Ulrich",
            "C",
            "D",
            "LISTENER",
            "FUZZY",
            "CHAR",
            "MEDIA",
            "PLAYER",
            "SESSION",
            "LOCATIONS",
            "TIMETRACKER",
            "DRAGPADS",
            "ROLLER",
            "SOUNDSCAPE",
            "COMPLICATIONS",
            "HANDOUTS",
            "CHAT",
            "TESTER",
            "INITCOMMANDS",
            "JANUARY (Current)",
            "FEBRUARY (Current)",
            "MARCH (Current)",
            "APRIL (Current)",
            "MAY (Current)",
            "JUNE (Current)",
            "JULY (Current)",
            "AUGUST (Current)",
            "SEPTEMBER (Current)",
            "OCTOBER (Current)",
            "NOVEMBER (Current)",
            "DECEMBER (Current)",
            "JANUARY (Raw)",
            "FEBRUARY (Raw)",
            "MARCH (Raw)",
            "APRIL (Raw)",
            "MAY (Raw)",
            "JUNE (Raw)",
            "JULY (Raw)",
            "AUGUST (Raw)",
            "SEPTEMBER (Raw)",
            "OCTOBER (Raw)",
            "NOVEMBER (Raw)",
            "DECEMBER (Raw)",
            "Soundscape Log"
        ];
        for (const title of handOutTitles) {
            const noteObj = getHandoutObj(title);
            STATE.REF.registry[title] = noteObj && noteObj.id;
        } */
    };
    // #endregion

    // #region EVENT HANDLERS: (HANDLEINPUT)
    const onChatCall = (call, args, objects, msg) => {
        switch (call) {
            case "test": {
                switch (D.LCase(call = args.shift())) {
                    case "addrow": {
                        addTableRow("Roll Effects", args);
                        break;
                    }
                    case "delrow": {
                        delTableRow("Roll Effects", args.join(" "));
                        break;
                    }
                    // no default
                }
                break;
            }
            case "kill": {
                let category;
                switch (D.LCase((call = args.shift()))) {
                    case "cat": case "category": {
                        category = args.shift();
                    }
                    // falls through
                    case "all": {
                        delHandoutObjs(args.join(" "), category);
                        if (category && category in STATE.REF.categoryLogs)
                            STATE.REF.categoryLogs[category] = [];
                        break;
                    }
                    // no default
                }
                break;
            }
            case "get":
                switch (D.LCase((call = args.shift()))) {
                    case "code": {
                        const handoutObj = getHandoutObj(args.join(" "));
                        if (handoutObj)
                            handoutObj.get("notes", (notes) => {
                                D.Alert(_.escape(notes), "Alert(notes, title, false, true)", false, true);
                            });
                        else
                            D.Flag(`No Handout Found with Name '${D.JSL(args.join(" "))}'`);
                        break;
                    }
                    case "projects": {
                        // summarizeProjects("Project Summary", D.GetChars("registered"));
                        break;
                    }
                    case "prestation": {
                        // summarizePrestation("Prestation Summary", D.GetChars("registered"));
                        break;
                    }
                    case "objectives": {
                        updateObjectiveHandout();
                        break;
                    }
                    case "charsummary": {
                        updateCharDetails();
                        updateCharSummary();
                        break;
                    }
                    // no default
                }
                break;
            // no default
        }
    };
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    // #region CONFIGURATION
    const categoryMax = {
        default: 5,
        debug: 10,
        callLogs: 20
    };
    // #endregion

    // #region GETTERS: Retrieving Notes, Data
    const getCount = (category) => (STATE.REF.categoryLogs[category] || []).length;
    const getCatNum = (category) => D.Int(D.LCase(D.Last(STATE.REF.categoryLogs[category])).replace(/^.*? (\d*)$/gu, "$1")) + 1;
    const parseHandoutGMCode = (titleRef, storageRef, storageKey) => {
        if (storageRef && storageKey) {
            const handoutObj = getHandoutObj(titleRef);
            if (handoutObj)
                handoutObj.get("gmnotes", (notes) => {
                    storageRef[storageKey] = JSON.parse(notes);
                    D.Flag("Code Parsed!");
                });
        } else {
            D.Flag("Must provide a storage reference and a key to store the code!");
        }
    };
    const parseHandoutTable = (titleRef, callback) => {
        const handoutObj = getHandoutObj(titleRef);
        const parseRow = (rowString, headerCells = []) => {
            const cells = (rowString.match(/<t\w>.*?<\/t\w>/gu) || []).map((x) => x.replace(/^<t\w>(.*?)(<br>)?\s*<\/t\w>/gu, "$1").replace(/<br>|<p>|<\/p>/gu, ""));
            if (cells && cells.length && cells.length === headerCells.length)
                return _.object(headerCells, cells);
            return cells;
        };
        if (handoutObj) {
            const tableData = {headerCells: [], rowCells: []};
            handoutObj.get("notes", (notes) => {
                const [headerRowString] = (notes.match(/<thead>.*?<\/thead>/gu) || [""]).map((x) => x.replace(/^<thead><tr>(.*?)<\/tr><\/thead>/gu, "$1"));
                if (headerRowString)
                    tableData.headerCells = parseRow(headerRowString);
                const [bodyRowStrings] = (notes.match(/<tbody>.*?<\/tbody>/gu) || [""]).map((x) => x.replace(/^<tbody><tr>(.*?)<\/tr><\/tbody>/gu, "$1").split("</tr><tr>"));
                if (bodyRowStrings && bodyRowStrings.length)
                    tableData.rowCells = bodyRowStrings.map((x) => parseRow(x, tableData.headerCells));
                if (VAL({function: callback}))
                    callback(tableData);
            });
        } else {
            D.Flag(`No Handout Found with Title "${D.JS(titleRef)}"`);
            return [];
        }
    };
    const getHandoutObj = (titleRef, charRef) => {
        if (titleRef in STATE.REF.registry)
            return getObj("handout", STATE.REF.registry[titleRef]);
        return findObjs({_type: "handout"}).filter(
            (x) => D.LCase(x.get("name")).includes(D.LCase(titleRef)) && (!charRef || x.get("inplayerjournals").includes(D.GetPlayerID(charRef)))
        )[0];
    };
    const getProjectData = (charRef) => {
        const projAttrs = D.GetRepStats(charRef, "project", null, null, "rowID");
        const projData = [];
        // D.Alert(`Project Attributes: ${D.JS(projAttrs)}`)
        _.each(projAttrs, (attrDatas, rowID) => {
            const rowData = {rowID};
            _.each(attrDatas, (attrData) => {
                rowData[attrData.name] = attrData.val;
            });
            projData.push(rowData);
        });
        return projData;
    };
    const getPrestationData = (charRef) => {
        const prestationAttrs = {
            boonsowed: D.GetRepStats(charRef, "boonsowed", null, null, "rowID"),
            boonsowing: D.GetRepStats(charRef, "boonsowing", null, null, "rowID")
        };
        const prestationData = {
            boonsowed: [],
            boonsowing: []
        };
        // D.Alert(`Project Attributes: ${D.JS(projAttrs)}`)
        _.each(["boonsowed", "boonsowing"], (cat) => {
            _.each(prestationAttrs[cat], (attrDatas, rowID) => {
                const rowData = {rowID};
                _.each(attrDatas, (attrData) => {
                    rowData[attrData.name] = attrData.val;
                });
                prestationData[cat].push(rowData);
            });
        });

        /* const groupedData = {
                boonsowed: D.KeyMapObj(_.groupBy(prestationData.boonsowed.map(x => ({to: x.boonowed_to, type: x.boonowed_type, details: x.boonowed_details})), x => x.to), null, x => x.map(xx => ({type: xx.type, details: xx.details}))),
                boonsowing: D.KeyMapObj(_.groupBy(prestationData.boonsowing.map(x => ({from: x.boonowing_from, type: x.boonowing_type, details: x.boonowing_details})), x => x.from), null, x => x.map(xx => ({type: xx.type, details: xx.details})))
            } */
        const groupedData = `<h2>OWED:</h2>${_.map(
            D.KeyMapObj(
                _.groupBy(
                    prestationData.boonsowed.map((x) => ({to: x.boonowed_to, type: x.boonowed_type, details: x.boonowed_details})),
                    (x) => x.to
                ),
                null,
                (x) => x.map((xx) => `<b>${xx.type.toUpperCase()}</b>: ${xx.details}`)
            ),
            (v, k) => `<h3>${k}</h3><ul><li>${v.join("<li>")}</ul>`
        ).join("")}<h2>OWING:</h2>${_.map(
            D.KeyMapObj(
                _.groupBy(
                    prestationData.boonsowing.map((x) => ({from: x.boonowing_from, type: x.boonowing_type, details: x.boonowing_details})),
                    (x) => x.from
                ),
                null,
                (x) => x.map((xx) => `<b>${xx.type.toUpperCase()}</b>: ${xx.details}`)
            ),
            (v, k) => `<h3>${k}</h3><ul><li>${v.join("<li>")}</ul>`
        ).join("")}`;

        /*  _.values(D.KeyMapObj({
                boonsowed: ,
                boonsowing:
            }, null, v => D.KeyMapObj(v, null, (vv, kk) => `<h3>${kk}</h3><ul>${vv.map(x => `<li>${x}</li>`).join("")}</ul>`))) */

        D.Alert(`Prestation Data for ${D.GetChar(charRef).get("name")}:<br>${D.JS(groupedData)}`, "Prestation Data");

        return groupedData;
    };
    // #endregion

    // #region SETTERS: Setting Notes, Deleting Handouts, Appending to Handouts
    const makeHandoutObj = (title, category, contents, isWritingGM = false, isVerbose = false, isRawCode = false) => {
        let noteObj;
        if (category) {
            STATE.REF.categoryLogs[category] = STATE.REF.categoryLogs[category] || [];
            while (getCount(category) >= (categoryMax[category] || categoryMax["default"]))
                delHandoutObj(STATE.REF.categoryLogs[category][0], category);
            title += ` ${getCatNum(category)}`;
            STATE.REF.categoryLogs[category].push(title);
        } else if (title in STATE.REF.registry && STATE.REF.registry[title]) {
            noteObj = getObj("handout", STATE.REF.registry[title].id);
        }
        if (!noteObj) {
            delHandoutObj(title);
            noteObj = createObj("handout", {name: title});
        }
        STATE.REF.registry[title] = noteObj.id;
        if (contents)
            updateHandout(title, category, contents, isWritingGM, isVerbose, isRawCode);
        return noteObj;
    };
    const makeSimpleHandoutObj = (title, contents, isVerbose = false) => makeHandoutObj(title, false, contents, true, isVerbose);
    const updateHandout = (title, category, contents, isWritingGM = false, isVerbose = false, isRawCode = false) => {
        const handoutObj = getHandoutObj(title);
        const isShiftingUp = handoutObj && handoutObj.get("avatar");
        const noteData = {};
        if (isRawCode === true)
            noteData.notes = `<div style="display: block; width: 545px; margin-left: -30px; font-family: 'Fira Code'; font-size: 8px;">${contents}</div>`;
        else if (isRawCode === "full")
            noteData.notes = contents;
        else
            noteData.notes = C.HANDOUTHTML.main(D.JS(contents, isVerbose), isShiftingUp);
        if (handoutObj) {
            handoutObj.set("notes", noteData.notes);
            if (isWritingGM)
                handoutObj.set("gmnotes", typeof contents === "string" ? contents : JSON.stringify(contents));
        } else {
            makeHandoutObj(title, category, contents, isWritingGM, isVerbose, isRawCode);
        }
    };
    const buildTableHTML = (tableData = {}) => {
        // tableData: {headerCells: [], rowCells: [[]]}
        const htmlCode = ["<table class=\"userscript-table userscript-table-bordered\">"];
        if ("headerCells" in tableData)
            htmlCode.push(...[
                "<thead><tr>",
                ...tableData.headerCells.map((x) => `<th>${x}</th>`),
                "</tr></thead>"
            ]);
        if ("rowCells" in tableData) {
            htmlCode.push("<tbody>");
            tableData.rowCells.forEach((row) => {
                htmlCode.push(...[
                    "<tr>",
                    ...Object.values(row).map((x) => `<td>${x}</td>`),
                    "</tr>"
                ]);
            });
            htmlCode.push("</tbody>");
        }
        htmlCode.push("</table>");
        return htmlCode.join("");
    };
    const updateHandoutTable = (title, tableData) => {
        const handoutObj = getHandoutObj(title);
        if (handoutObj)
            handoutObj.get("notes", (notes) => {
                handoutObj.set("notes", notes.replace(/<table .*?<\/table>/u, buildTableHTML(tableData)));
            });
    };
    const addTableRow = (title, cells) => {
        const handoutObj = getHandoutObj(title);
        if (handoutObj)
            parseHandoutTable(title, (tableData) => {
                DB({tableData}, "addTableRow");
                tableData.rowCells.push(_.object(tableData.headerCells, cells));
                DB({tableData}, "addTableRow");
                updateHandoutTable(title, tableData);
            });
    };
    const delTableRow = (title, cellRef) => {
        const handoutObj = getHandoutObj(title);
        if (handoutObj)
            parseHandoutTable(title, (tableData) => {
                DB({tableData, cellRef}, "delTableRow");
                tableData.rowCells = tableData.rowCells.filter((v) => !_.any(Object.values(v), (vv) => vv.includes(cellRef)));
                DB({tableData}, "delTableRow");
                updateHandoutTable(title, tableData);
            });
    };
    const delHandoutObjs = (titleRef, category) => {
        const handoutObjs = findObjs({_type: "handout"}).filter((x) => (!category || STATE.REF.categoryLogs[category].includes(x.get("name"))) && D.LCase(x.get("name")).includes(D.LCase(titleRef)));
        handoutObjs.forEach((x) => delHandoutObj(x.get("name"), category));
    };
    const delHandoutObj = (titleRef, category) => {
        const handoutObj = findObjs({_type: "handout", inplayerjournals: "", archived: false}).find((x) => D.LCase(x.get("name")).includes(D.LCase(titleRef)));
        if (VAL({object: handoutObj})) {
            if (category && STATE.REF.categoryLogs[category].includes(handoutObj.get("name")))
                D.PullOut(STATE.REF.categoryLogs[category], (v) => v === handoutObj.get("name"));
            handoutObj.remove();
        }
    };
    // #endregion

    // #region HANDOUTS: Specific Handouts
    const parseRollEffects = (handoutRef, stateRef = state.VAMPIRE.Location, ...stateKeys) => {
        stateKeys = stateKeys && stateKeys.length ? stateKeys : ["rollEffects", "general"];
        if (handoutRef && stateRef && stateKeys.length) {
            const lastKey = stateKeys.pop();
            while (stateKeys.length) {
                const thisKey = stateKeys.shift();
                stateRef[thisKey] = stateRef[thisKey] || {};
                stateRef = stateRef[thisKey];
            }
            parseHandoutTable(handoutRef, (tableData) => {
                const rollEffectsData = tableData.rowCells.filter((x) => x["On?"] === "X").map((x) => _.omit(x, "On?"));
                if (!_.isEmpty(rollEffectsData))
                    stateRef[lastKey] = rollEffectsData.map((x) => {
                        const scopeExclusions = [];
                        const rollEffect = Object.assign(
                            {scope: ["all"], sheetnote: ""},
                            D.KeyMapObj(
                                _.pick(x, (v) => v !== ""),
                                (k) => {
                                    switch (k) {
                                        case "Ends": return "endDate";
                                        default: return D.LCase(k);
                                    }
                                },
                                (v, k) => {
                                    switch (k) {
                                        case "Scope": {
                                            const charRefs = v.split("/");
                                            scopeExclusions.push(..._.flatten(charRefs
                                                .filter((xx) => xx.startsWith("NOT:"))
                                                .map((xx) => xx.slice(4))
                                                .map((xx) => D.GetChars(xx).map((xxx) => xxx.id))));
                                            const charInclusions = _.flatten(charRefs
                                                .filter((xx) => !xx.startsWith("NOT:"))
                                                .map((xx) => {
                                                    if (xx === "all")
                                                        return "all";
                                                    if (xx === "npc") {
                                                        scopeExclusions.push(...D.GetChars("pc").map((xxx) => xxx.id));
                                                        return "all";
                                                    }
                                                    return D.GetChars(xx).map((xxx) => xxx.id);
                                                }));
                                            if (!charInclusions.length)
                                                return ["all"];
                                            return charInclusions;
                                        }
                                        case "Ends": return TimeTracker.GetDate(v, false).getTime();
                                        default: return v;
                                    }
                                }
                            )
                        );
                        if (scopeExclusions.length)
                            rollEffect.scopeExclusions = scopeExclusions;
                        return rollEffect;
                    });
                else if (lastKey in stateRef)
                    delete stateRef[lastKey];
            });
        } else {
            D.Flag("Must provide state reference!");
        }
    };
    const updateCharSummary = () => {
        const html = C.HANDOUTHTML.TraitSummaryDoc;
        const colorScheme = {
            physical: [
                "rgba(255,234,230,1)",
                "rgba(255,219,211,1)",
                "rgba(255,203,192,1)",
                "rgba(107,19,0,1)"
            ],
            social: [
                "rgba(237,254,228,1)",
                "rgba(223,251,208,1)",
                "rgba(208,248,187,1)",
                "rgba(33,93,0,1)"
            ],
            mental: [
                "rgba(234,229,252,1)",
                "rgba(217,209,246,1)",
                "rgba(198,186,238,1)",
                "rgba(59,34,146,1)"
            ],
            disciplines: [
                "rgba(225,225,225,1)",
                "rgba(175,175,175,1)",
                "rgba(175,175,175,1)",
                "rgba(20,20,20,1)"
            ],
            trackers: [
                "rgba(225,225,225,1)",
                "rgba(175,175,175,1)",
                "rgba(175,175,175,1)",
                "rgba(20,20,20,1)"
            ]
        };
        const charObjs = D.GetChars("registered");
        // Initial Header
        const tableRows = [
            html.HeaderRow([
                html.HeaderCell("ATTRIBUTES"),
                ...charObjs.map((x) => html.HeaderCell(D.GetName(x, true)))
            ].join(""), C.COLORS.darkdarkgrey)
        ];
        // Attribute Lines
        for (const [attrCat, attributes] of Object.entries(C.ATTRIBUTES)) {
            const colors = colorScheme[attrCat].slice(0, 3);
            for (const attribute of attributes) {
                const rowCells = [html.HeaderCell(attribute)];
                for (const charObj of charObjs) {
                    const attrVal = D.GetStatVal(charObj, attribute);
                    rowCells.push(html.Cell([
                        html.SymbolSpan([
                            html.Symbols.DotFull.repeat(attrVal),
                            html.Symbols.DotEmpty.repeat(5 - attrVal)
                        ].join("")),
                        html.SpecialtySpan(" ")
                    ].join("")));
                }
                tableRows.push(html.Row(rowCells.join(""), colors.pop()));
            }
        }
        // Skill Lines
        for (const [skillCat, skills] of Object.entries(C.SKILLS)) {
            const colors = colorScheme[skillCat];
            tableRows.push(html.HeaderRow([
                html.HeaderCell(`SKILLS: ${D.UCase(skillCat)}`),
                ...charObjs.map((x) => html.HeaderCell(D.GetName(x, true)))
            ].join(""), colors.pop()));
            colors.shift();
            for (const skill of skills) {
                const rowCells = [html.HeaderCell(skill)];
                for (const charObj of charObjs) {
                    const skillVal = D.GetStatVal(charObj, skill.replace(/ /gu, "_"));
                    const specVal = D.GetStatVal(charObj, `${skill}_spec`.replace(/ /gu, "_")).replace(/\s*?,\s*?/gu, "<br>");
                    rowCells.push(html.Cell([
                        html.SymbolSpan([
                            html.Symbols.DotFull.repeat(skillVal),
                            html.Symbols.DotEmpty.repeat(5 - skillVal)
                        ].join("")),
                        html.SpecialtySpan(specVal)
                    ].join("")));
                }
                tableRows.push(html.Row(rowCells.join(""), colors[0]));
                colors.unshift(colors.pop());
            }
        }
        // Trackers
        const trackerColors = colorScheme.trackers;
        tableRows.push(html.HeaderRow([
            html.HeaderCell("TRACKERS:"),
            ...charObjs.map((x) => html.HeaderCell(D.GetName(x, true)))
        ].join(""), trackerColors.pop()));
        trackerColors.pop();
        //      Health & Willpower
        for (const tracker of ["Health", "Willpower"]) {
            const rowCells = [html.HeaderCell(tracker)];
            for (const charObj of charObjs) {
                const trackerLine = (new Array(17)).fill(false);
                let [aggDmg, supDmg, total] = [
                        D.GetStatVal(charObj, `${D.LCase(tracker)}_aggravated`),
                        D.GetStatVal(charObj, `${D.LCase(tracker)}_bashing`),
                        D.GetStatVal(charObj, `${D.LCase(tracker)}_max`)
                    ],
                    isTwoRows = false;
                for (let i = 0; i < trackerLine.length; i++)
                    if (i === 5) {
                        trackerLine[i] = "&nbsp;";
                    } else if (i === 11) {
                        trackerLine[i] = "<br>";
                        isTwoRows = true;
                    } else if (aggDmg > 0) {
                        aggDmg--;
                        total--;
                        trackerLine[i] = html.Symbols.BoxAggro;
                    } else if (supDmg > 0) {
                        supDmg--;
                        total--;
                        trackerLine[i] = html.Symbols.BoxSuper;
                    } else if (total > 0) {
                        total--;
                        trackerLine[i] = html.Symbols.BoxEmpty;
                    } else {
                        trackerLine.length = i;
                        break;
                    }
                if (isTwoRows)
                    trackerLine.forEach((x, i) => { trackerLine[i] = x.replace(/margin-top: 3px/gu, "margin-top: 2px;") });
                rowCells.push(html.TrackerCell([
                    html.SymbolSpan(trackerLine.join("")).replace(/margin-top: 1px/gu, "margin-bottom: 2px;")
                ].join("")));
            }
            tableRows.push(html.Row(rowCells.join(""), trackerColors[0]));
            trackerColors.unshift(trackerColors.pop());
        }
        //      Blood Potency
        const rowCells = [html.HeaderCell("Blood Potency")];
        for (const charObj of charObjs) {
            const [currentBP, maxBP] = [
                D.GetStatVal(charObj, "blood_potency"),
                D.GetStatVal(charObj, "blood_potency_max")
            ];
            rowCells.push(html.TrackerCell([
                html.SymbolSpan([
                    html.Symbols.DotBPFull.repeat(currentBP),
                    html.Symbols.DotBPEmpty.repeat(maxBP - currentBP)
                ].join(""))
            ].join("")));
        }
        tableRows.push(html.Row(rowCells.join(""), trackerColors[0]));
        trackerColors.unshift(trackerColors.pop());
        rowCells.length = 0;
        //      Humanity
        rowCells.push(html.HeaderCell("Humanity"));
        for (const charObj of charObjs) {
            const [curHumanity, curStains] = [
                D.GetStatVal(charObj, "humanity"),
                D.GetStatVal(charObj, "stains")
            ];
            rowCells.push(html.TrackerCell([
                html.SymbolSpan([
                    html.Symbols.BoxHumanity.repeat(curHumanity),
                    html.Symbols.BoxHumStain.repeat(Math.max(0, curHumanity + curStains - 10)),
                    html.Symbols.BoxEmpty.repeat(Math.max(0, 10 - curHumanity - curStains)),
                    html.Symbols.BoxStain.repeat(curStains)
                ].join(""))
            ].join("")));
        }
        tableRows.push(html.Row(rowCells.join(""), trackerColors[0]));
        // Disciplines
        const discColors = colorScheme.disciplines;
        tableRows.push(html.HeaderRow([
            html.HeaderCell("DISCIPLINES:"),
            ...charObjs.map((x) => html.HeaderCell(D.GetName(x, true)))
        ].join(""), discColors.pop()));
        discColors.pop();
        for (const disc of Object.keys(C.DISCIPLINES)) {
            rowCells.length = 0;
            rowCells.push(html.HeaderCell(disc));
            let areAllZero = true;
            for (const charObj of charObjs) {
                const attrData = D.GetStat(charObj, disc);
                if (attrData) {
                    const [skillVal, attrObj] = attrData;
                    const discPowerLines = [];
                    if (skillVal > 0) {
                        areAllZero = false;
                        const statPrefix = attrObj.get("name");
                        for (let i = 1; i <= skillVal; i++)
                            discPowerLines.push(`${html.Symbols.DotFull} ${D.GetStatVal(charObj, `${statPrefix}_power_${i}`)}`);
                        /* if (attrObj.get("name").startsWith("repeating")) {
                            const [section, rowID, statName] = D.ParseRepStat(attrObj);
                            for (let i = 1; i <= skillVal; i++)
                                discPowerLines.push(`${html.Symbols.DotFull} ${D.GetRepStats(charObj, section, rowID, `disc_power_${i}`, null, "val").pop()}`);
                        } else {
                            const statPrefix = attrObj.get("name");
                        } */
                    }
                    rowCells.push(html.Cell(discPowerLines.map((x) => html.PowerSpan(x)).join("")));
                } else {
                    rowCells.push(html.Cell(" "));
                }
            }
            if (!areAllZero) {
                tableRows.push(html.Row(rowCells.join(""), discColors[0]));
                discColors.unshift(discColors.pop());
            }
        }

        // Assemble Full Table Code
        const fullCode = [
            "<div style=\"display: block; height: 20px; font-family: 'Fira Code'; font-weight: bold; font-size: 10px;\">To Update: '!handouts get charsummary'</div>",
            html.Table(tableRows.join(""))
        ].join("");
        updateHandout("Character Stat Summary", null, fullCode);
    };
    const updateCharDetails = () => {
        const html = C.HANDOUTHTML.DetailsSummaryDoc;
        const masterColorScheme = [
            "rgba(0,0,0,0.1);",
            "rgba(0,0,0,0);"
        ];
        let colorScheme = D.Clone(masterColorScheme);
        const tables = [];
        const tableRows = [];
        const rowCells = [];
        const cellLines = [];
        const charObjs = D.GetChars("registered");

        // === CONVICTIONS & COMPROMISES ===
        tableRows.length = 0;
        rowCells.length = 0;
        cellLines.length = 0;
        colorScheme = D.Clone(masterColorScheme);

        // Tenets Line
        tableRows.push(html.SubtitleRow(html.SubtitleCell(C.TENETS.join("&nbsp;&nbsp;♦&nbsp;&nbsp;"), 3)));
        // Initial Header
        tableRows.push(html.HeaderRow([
            html.HeaderCell("CONVICTIONS", 2),
            html.HeaderCell("Compromised Tenets")
        ].join("")));

        // Convictions & Compromises
        for (const charObj of charObjs) {
            rowCells.length = 0;
            rowCells.push(html.RowFirstCell(D.GetName(charObj, true)));
            const compromises = ["compromise_1", "compromise_2", "compromise_3"].map((x) => D.GetStatVal(charObj, x));
            const convictions = ["conviction_1", "conviction_2", "conviction_3"].map((x) => D.GetStatVal(charObj, x));
            const lineColors = D.Clone(masterColorScheme);
            cellLines.length = 0;
            convictions.forEach((x) => {
                cellLines.push(html.CellLine(x, lineColors[0]));
                lineColors.unshift(lineColors.pop());
            });
            rowCells.push(html.Cell(cellLines.join(""), "middle"));
            cellLines.length = 0;
            compromises.forEach((x, i) => {
                if (x) {
                    cellLines.push(html.CellLine(`${C.TENETS[i]}<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${x}`, lineColors[0]));
                    lineColors.unshift(lineColors.pop());
                }
            });
            rowCells.push(html.Cell(cellLines.join("")));
            tableRows.push(html.Row(rowCells.join(""), colorScheme[0]));
            colorScheme.unshift(colorScheme.pop());
        }
        tables.push(html.Table(tableRows.join("")));


        // === COMPULSIONS & DYSCRASIAS ===
        tableRows.length = 0;
        rowCells.length = 0;
        cellLines.length = 0;
        colorScheme = D.Clone(masterColorScheme);

        // Initial Header
        tableRows.push(html.HeaderRow([html.HeaderCell("COMPULSIONS & DYSCRASIAS", 2)]));
        // Compulsions & Dyscrasias
        for (const charObj of charObjs) {
            rowCells.length = 0;
            cellLines.length = 0;
            rowCells.push([html.RowFirstCell(D.GetName(charObj, true))]);
            if (!D.Int(D.GetStatVal(charObj, "compulsion_toggle")) && !D.Int(D.GetStatVal(charObj, "dyscrasias_toggle")))
                continue;
            let numLines = 0;
            if (D.Int(D.GetStatVal(charObj, "compulsion_toggle"))) {
                const [compulsionTitle, compulsionDetails] = (D.GetStatVal(charObj, "compulsion") || "").split("—").map((x) => x.trim());
                if (compulsionDetails) {
                    cellLines.push(html.CellLine([
                        html.CellTitleSpan(compulsionTitle),
                        compulsionDetails
                    ].join(""), C.COLORS.palered));
                    numLines += Math.ceil(compulsionDetails.length / 105) + 1.8;
                }
            }
            if (D.Int(D.GetStatVal(charObj, "dyscrasias_toggle"))) {
                const [dyscrasiaTitle, dyscrasiaDetails] = (D.GetStatVal(charObj, "dyscrasias") || "").split("—").map((x) => x.trim());
                if (dyscrasiaDetails) {
                    cellLines.push(html.CellLine([
                        html.CellTitleSpan(dyscrasiaTitle),
                        dyscrasiaDetails
                    ].join(""), C.COLORS.brightgrey));
                    numLines += Math.ceil(dyscrasiaDetails.length / 105) + 1.8;
                }
            }
            rowCells.push(html.LongTextCell(cellLines.join(""), Math.max(numLines, 1)));
            tableRows.push(html.Row(rowCells.join(""), colorScheme[0]));
            colorScheme.unshift(colorScheme.pop());
        }
        tables.push(html.Table(tableRows.join("")));

        // === AMBITION ===
        tableRows.length = 0;
        rowCells.length = 0;
        cellLines.length = 0;
        colorScheme = D.Clone(masterColorScheme);

        // Initial Header
        tableRows.push(html.HeaderRow([html.HeaderCell("AMBITION", 2)]));
        // Ambitions
        for (const charObj of charObjs) {
            rowCells.length = 0;
            rowCells.push([html.RowFirstCell(D.GetName(charObj, true))]);
            const ambition = D.GetStatVal(charObj, "ambition") || "&nbsp;";
            const numLines = Math.ceil(ambition.length / 105);
            rowCells.push(html.LongTextCell(ambition, numLines));
            tableRows.push(html.Row(rowCells.join(""), colorScheme[0]));
            colorScheme.unshift(colorScheme.pop());
        }
        tables.push(html.Table(tableRows.join("")));

        // === HUMANITY MARKS ===
        tableRows.length = 0;
        rowCells.length = 0;
        cellLines.length = 0;
        colorScheme = D.Clone(masterColorScheme);

        // Initial Header
        tableRows.push(html.HeaderRow([html.HeaderCell("DEGENERATION MARKS", 2)]));
        // Marks
        for (const charObj of charObjs) {
            rowCells.length = 0;
            rowCells.push(html.RowFirstCell(D.GetName(charObj, true)));
            const markDetails = D.GetStatVal(charObj, "deathmarks");
            if (markDetails) {
                const numLines = Math.ceil(markDetails.length / 105);
                rowCells.push(html.LongTextCell(markDetails, numLines));
                tableRows.push(html.Row(rowCells.join(""), colorScheme[0]));
                colorScheme.unshift(colorScheme.pop());
            }
        }
        tables.push(html.Table(tableRows.join("")));

        // === MASK ===
        tableRows.length = 0;
        rowCells.length = 0;
        cellLines.length = 0;
        colorScheme = D.Clone(masterColorScheme);

        // Initial Header
        tableRows.push(html.HeaderRow([html.HeaderCell("MASK", 2)]));
        // Mask Details
        for (const charObj of charObjs) {
            rowCells.length = 0;
            rowCells.push(html.RowFirstCell(D.GetName(charObj, true)));
            const maskName = D.GetStatVal(charObj, "maskname");
            const maskDetails = D.GetStatVal(charObj, "mask");
            if (!maskDetails && !maskName)
                continue;
            const numLines = Math.ceil((maskDetails || "&nbsp;").length / 105) + 1.6;
            rowCells.push(html.LongTextCell([
                html.CellTitleSpan(maskName || "&nbsp;"),
                maskDetails || "&nbsp;"
            ].join(""), numLines));
            tableRows.push(html.Row(rowCells.join(""), colorScheme[0]));
            colorScheme.unshift(colorScheme.pop());
        }
        tables.push(html.Table(tableRows.join("")));

        // === PREDATOR ===
        tableRows.length = 0;
        rowCells.length = 0;
        cellLines.length = 0;
        colorScheme = D.Clone(masterColorScheme);

        // Initial Header
        tableRows.push(html.HeaderRow([
            html.HeaderCell("PREDATOR TYPE", 3)
        ].join("")));
        // Predator Type Details
        for (const charObj of charObjs) {
            rowCells.length = 0;
            rowCells.push(html.RowFirstCell(D.GetName(charObj, true)));
            const predatorType = D.GetStatVal(charObj, "predator") || "&nbsp;";
            const predatorRoll = (C.PREDTYPES[predatorType] || []).join(" + ");
            rowCells.push(html.BigTextCell(predatorType.replace(/_/gu, " ")), html.BigTextCell(predatorRoll));
            tableRows.push(html.Row(rowCells.join(""), colorScheme[0]));
            colorScheme.unshift(colorScheme.pop());
        }
        tables.push(html.Table(tableRows.join("")));

        // Assemble Full Table Code
        const fullCode = [
            "<div style=\"display: block; height: 20px; font-family: 'Fira Code'; font-weight: bold; font-size: 10px;\">To Update: '!handouts get charsummary'</div>",
            ...tables
        ].join("");
        updateHandout("Character Details", null, fullCode);

        /*
        for (const [attrCat, attributes] of Object.entries(C.ATTRIBUTES)) {
            const colors = colorScheme[attrCat].slice(0, 3);
            for (const attribute of attributes) {
                const rowCells = [html.HeaderCell(attribute)];
                for (const charObj of charObjs) {
                    const attrVal = D.GetStatVal(charObj, attribute);
                    rowCells.push(html.Cell([
                        html.SymbolSpan([
                            html.Symbols.DotFull.repeat(attrVal),
                            html.Symbols.DotEmpty.repeat(5 - attrVal)
                        ].join("")),
                        html.SpecialtySpan(" ")
                    ].join("")));
                }
                tableRows.push(html.Row(rowCells.join(""), colors.pop()));
            }
        }
        // Skill Lines
        for (const [skillCat, skills] of Object.entries(C.SKILLS)) {
            const colors = colorScheme[skillCat];
            tableRows.push(html.HeaderRow([
                html.HeaderCell(`SKILLS: ${D.UCase(skillCat)}`),
                ...charObjs.map((x) => html.HeaderCell(D.GetName(x, true)))
            ].join(""), colors.pop()));
            colors.shift();
            for (const skill of skills) {
                const rowCells = [html.HeaderCell(skill)];
                for (const charObj of charObjs) {
                    const skillVal = D.GetStatVal(charObj, skill.replace(/ /gu, "_"));
                    const specVal = D.GetStatVal(charObj, `${skill}_spec`.replace(/ /gu, "_")).replace(/\s*?,\s*?/gu, "<br>");
                    rowCells.push(html.Cell([
                        html.SymbolSpan([
                            html.Symbols.DotFull.repeat(skillVal),
                            html.Symbols.DotEmpty.repeat(5 - skillVal)
                        ].join("")),
                        html.SpecialtySpan(specVal)
                    ].join("")));
                }
                tableRows.push(html.Row(rowCells.join(""), colors[0]));
                colors.unshift(colors.pop());
            }
        }
        // Trackers
        const trackerColors = colorScheme.trackers;
        tableRows.push(html.HeaderRow([
            html.HeaderCell("TRACKERS:"),
            ...charObjs.map((x) => html.HeaderCell(D.GetName(x, true)))
        ].join(""), trackerColors.pop()));
        trackerColors.pop();
        //      Health & Willpower
        for (const tracker of ["Health", "Willpower"]) {
            const rowCells = [html.HeaderCell(tracker)];
            for (const charObj of charObjs) {
                const trackerLine = (new Array(17)).fill(false);
                let [aggDmg, supDmg, total] = [
                        D.GetStatVal(charObj, `${D.LCase(tracker)}_aggravated`),
                        D.GetStatVal(charObj, `${D.LCase(tracker)}_bashing`),
                        D.GetStatVal(charObj, `${D.LCase(tracker)}_max`)
                    ],
                    isTwoRows = false;
                for (let i = 0; i < trackerLine.length; i++)
                    if (i === 5) {
                        trackerLine[i] = "&nbsp;";
                    } else if (i === 11) {
                        trackerLine[i] = "<br>";
                        isTwoRows = true;
                    } else if (aggDmg > 0) {
                        aggDmg--;
                        total--;
                        trackerLine[i] = html.Symbols.BoxAggro;
                    } else if (supDmg > 0) {
                        supDmg--;
                        total--;
                        trackerLine[i] = html.Symbols.BoxSuper;
                    } else if (total > 0) {
                        total--;
                        trackerLine[i] = html.Symbols.BoxEmpty;
                    } else {
                        trackerLine.length = i;
                        break;
                    }
                if (isTwoRows)
                    trackerLine.forEach((x, i) => { trackerLine[i] = x.replace(/margin-top: 3px/gu, "margin-top: 2px;") });
                rowCells.push(html.TrackerCell([
                    html.SymbolSpan(trackerLine.join("")).replace(/margin-top: 1px/gu, "margin-bottom: 2px;")
                ].join("")));
            }
            tableRows.push(html.Row(rowCells.join(""), trackerColors[0]));
            trackerColors.unshift(trackerColors.pop());
        }
        //      Blood Potency
        const rowCells = [html.HeaderCell("Blood Potency")];
        for (const charObj of charObjs) {
            const [currentBP, maxBP] = [
                D.GetStatVal(charObj, "blood_potency"),
                D.GetStatVal(charObj, "blood_potency_max")
            ];
            rowCells.push(html.TrackerCell([
                html.SymbolSpan([
                    html.Symbols.DotBPFull.repeat(currentBP),
                    html.Symbols.DotBPEmpty.repeat(maxBP - currentBP)
                ].join(""))
            ].join("")));
        }
        tableRows.push(html.Row(rowCells.join(""), trackerColors[0]));
        trackerColors.unshift(trackerColors.pop());
        rowCells.length = 0;
        //      Humanity
        rowCells.push(html.HeaderCell("Humanity"));
        for (const charObj of charObjs) {
            const [curHumanity, curStains] = [
                D.GetStatVal(charObj, "humanity"),
                D.GetStatVal(charObj, "stains")
            ];
            rowCells.push(html.TrackerCell([
                html.SymbolSpan([
                    html.Symbols.BoxHumanity.repeat(curHumanity),
                    html.Symbols.BoxHumStain.repeat(Math.max(0, curHumanity + curStains - 10)),
                    html.Symbols.BoxEmpty.repeat(Math.max(0, 10 - curHumanity - curStains)),
                    html.Symbols.BoxStain.repeat(curStains)
                ].join(""))
            ].join("")));
        }
        tableRows.push(html.Row(rowCells.join(""), trackerColors[0]));
        // Disciplines
        const discColors = colorScheme.disciplines;
        tableRows.push(html.HeaderRow([
            html.HeaderCell("DISCIPLINES:"),
            ...charObjs.map((x) => html.HeaderCell(D.GetName(x, true)))
        ].join(""), discColors.pop()));
        discColors.pop();
        for (const disc of Object.keys(C.DISCIPLINES)) {
            rowCells.length = 0;
            rowCells.push(html.HeaderCell(disc));
            let areAllZero = true;
            for (const charObj of charObjs) {
                const attrData = D.GetStat(charObj, disc);
                if (attrData) {
                    const [skillVal, attrObj] = attrData;
                    const discPowerLines = [];
                    if (skillVal > 0) {
                        areAllZero = false;
                        if (attrObj.get("name").startsWith("repeating")) {
                            const [section, rowID, statName] = D.ParseRepStat(attrObj);
                            for (let i = 1; i <= skillVal; i++)
                                discPowerLines.push(`${html.Symbols.DotFull} ${D.GetRepStats(charObj, section, rowID, `discpower_${i}`, null, "val").pop()}`);
                        } else {
                            const statPrefix = attrObj.get("name");
                            for (let i = 1; i <= skillVal; i++)
                                discPowerLines.push(`${html.Symbols.DotFull} ${D.GetStatVal(charObj, `${statPrefix}_${i}`)}`);
                        }
                    }
                    rowCells.push(html.Cell(discPowerLines.map((x) => html.PowerSpan(x)).join("")));
                } else {
                    rowCells.push(html.Cell(" "));
                }
            }
            if (!areAllZero) {
                tableRows.push(html.Row(rowCells.join(""), discColors[0]));
                discColors.unshift(discColors.pop());
            }
        }

        // Assemble Full Table Code
        const fullCode = html.Table(tableRows.join(""));
        updateHandout("Character Stat Summary", null, fullCode);
        */
    };
    const updateObjectiveHandout = () => {
        // #region Config: HTML Styles
        const handoutWidth = 540;
        const HTML = {
            main: (content) => `<div style="
                display: block;
                height: auto; width: ${handoutWidth}px;
                margin-left: -30px;
                ">${content}</div>`,
            h3: (content, bgColor, fontColor = "white") => `<h3 style="
                width: 100%;
                background-color: ${bgColor};
                font-family: 'Cinzel Decorative'; color: ${fontColor};
                text-indent: 10px;
                ">${content}</h3>`,
            block: (content) => `<div style="
                display: block;
                width: 100%;
                margin: 5px 0;
                padding: 0;
                ">${content}</div>`,
            row: (content) => `<div style="
                display: block;
                width: 100%;
                margin: 5px 0px;
                padding-bottom: 5px;
                border-bottom: 1px solid black;
                ">${content}</div>`,
            box: (content) => `<div style="
                display: inline-block;
                width: 28px;
                vertical-align: top;
                ">${content}</div>`,
            init: (content, bgColor, fontColor = "white") => `<span style="
                display: inline-block;
                height: 18px; width: 18px;
                margin-top: -2px;
                vertical-align: top;
                font-family: Oswald; color: ${fontColor}; font-weight: bold; line-height: 17px; text-align: center;
                background-color: ${bgColor};
                border: 1px solid black;
                ">${content}</span>`,
            summary: (content) => `<div style="
                display: inline-block;
                width: ${handoutWidth - 28}px;
                font-family: 'Cormorant Garamond'; font-weight: bold; font-size: 16px; line-height: 18px;
                ">${content}</div>`,
            details: (content) => `<div style="
                display: inline-block;
                width: ${handoutWidth - 40}px;
                margin: 5px 0px 5px 40px;
                font-family: 'Voltaire'; font-size: 12px; line-height: 14px;
                ">${content}</div>`,
            buttons: {
                refresh: () => `<span style="
                display: block;
                height: 11px; width: 70px;
                margin: 0 4px 0 auto;
                "><a style="
                    display: inline-block;
                    height: 20px; width: 100%;
                    font-family: Oswald; color: ${C.COLORS.darkred}; font-size: 16px; font-weight: bold; line-height: 18px; text-align: center;
                    text-decoration: none; text-transform: uppercase;
                    background-color: ${C.COLORS.palepalered};
                    border-radius: 10px; border: 2px solid ${C.COLORS.darkred};
                " href="!handouts get objectives">Refresh</a>
                </span>`,
                flagReviewed: (label, command, bgColor, fontColor) => `<span style="
                    display: inline-block;
                    height: 18px; width: 18px;
                    margin-top: 1px; margin-bottom: -1px;
                    vertical-align: top;                
                    "><a style="
                        display: inline-block;
                        height: 100%; width: 100%;
                        font-family: Oswald; color: ${fontColor}; font-size: 16px; font-weight: bold; line-height: 17px; text-align: center;
                        text-decoration: none;
                        background-color: ${bgColor};
                        border-radius: 50%; border: 1px solid black;
                    " href="${command}">${label}</a>
                    </span>`
            }
        };
        const initColors = {
            A: [C.COLORS.black, C.COLORS.brightbrightgrey],
            B: [C.COLORS.brightbrightgrey, C.COLORS.black],
            L: [C.COLORS.darkpurple, C.COLORS.brightgold],
            N: [C.COLORS.red, C.COLORS.white],
            R: [C.COLORS.darkred, C.COLORS.lightred]
        };
        // #endregion
        // #region Step One: Compile FieldSet Data
        const objectiveData = Char.GetObjectives();
        DB({objectives: D.JS(objectiveData)}, "updateObjectiveHandout");
        const priorityLines = [HTML.buttons.refresh()];
        const priorityStrings = {
            Hypothetical: 1,
            "Still Scheming": 2,
            "Awaiting Comment": 3,
            Ready: 4,
            ASAP: 5
        };
        Object.entries(priorityStrings).reverse().forEach(([priority, i]) => {
            const priorityData = objectiveData.filter((data) => data.priority === i);
            if (priorityData.length) {
                priorityLines.push(HTML.h3(priority, i >= 3 ? C.COLORS.darkred : C.COLORS.white, i >= 3 ? C.COLORS.white : C.COLORS.darkred,));
                const objRows = [];
                priorityData.forEach((objective) => {
                    const objRow = [];
                    objRow.push(HTML.box([
                        HTML.init(objective.init, ...initColors[objective.init]),
                        HTML.buttons.flagReviewed("✔", `!char set scheme ${objective.rowID} reviewed ?{Comment:}`, C.COLORS.palepalegreen, C.COLORS.darkgreen)
                    ].join(""))); // !prompt submit ?{Who is this prompt for?|Bacchus,B|Napier,N|Dr. Roy,R|Locke,L|Myself!,A} ?{What do you want to see during this player's spotlight? (Write the prompt as if you're speaking to the player directly.)}
                    objRow.push(HTML.summary(objective.summary));
                    if (objective.details)
                        objRow.push(HTML.details(objective.details));
                    if (objective.comments)
                        objRow.push(HTML.details(objective.comments));
                    objRows.push(HTML.row(objRow.join("")));
                });
                objRows[objRows.length - 1] = objRows[objRows.length - 1].replace(/border[^;]*;/u, "border: none;");
                priorityLines.push(HTML.block(objRows.join("")));
            }
        });
        updateHandout("Objectives Summary", null, HTML.main(priorityLines.join("")), false, false, "full");
        // #endregion
    };
    // #endregion

    // #region CHARACTER SHEET SUMMARIES
    /*


    priorityLines = [];


    */
    const summarizeProjects = (title, charObjs) => {
        delHandoutObjs("Project Summary", "projects");
        const noteObj = makeHandoutObj(title, "projects");
        const noteSections = [];
        for (const char of charObjs) {
            const charLines = [];
            for (const projectData of getProjectData(char)) {
                // D.Alert(D.JS(projectData), "Project Data")
                // for (const item of ["projectdetails", "projectgoal", "projectstartdate", "projectincnum", "projectincunit", "projectenddate", "projectinccounter", "projectscope_name", "projectscope", ]) {
                //        projectData[item] = projectData[item] || ""
                //    }
                if (projectData.projectenddate && TimeTracker.GetDate(projectData.projectenddate) < TimeTracker.CurrentDate)
                    continue;
                const projLines = [];
                let projGoal = "";
                if (D.Int(projectData.projectscope) > 0)
                    projGoal += `${"●".repeat(D.Int(projectData.projectscope))} `;
                if (projectData.projectscope_name && projectData.projectscope_name.length > 2)
                    projGoal += projectData.projectscope_name;
                projLines.push(C.HANDOUTHTML.projects.goal(projGoal));
                if (projectData.projectgoal && projectData.projectgoal.length > 2)
                    projLines.push(`${C.HANDOUTHTML.projects.tag("HOOK:")}${C.HANDOUTHTML.projects.hook(projectData.projectgoal)}`);
                if (projectData.projectdetails && projectData.projectdetails.length > 2)
                    projLines.push(C.HANDOUTHTML.smallNote(projectData.projectdetails));
                let [stakeCheck, teamworkCheck] = [false, false];
                for (const stakeVar of [
                    "projectstake1_name",
                    "projectstake1",
                    "projectstake2_name",
                    "projectstake2",
                    "projectstake3_name",
                    "projectstake3"
                ])
                    if (
                        projectData[stakeVar]
                        && ((!_.isNaN(D.Int(projectData[stakeVar])) && D.Int(projectData[stakeVar]) > 0) || projectData[stakeVar].length > 2)
                    )
                        stakeCheck = true;
                teamworkCheck = D.Int(projectData.projectteamwork1) + D.Int(projectData.projectteamwork2) + D.Int(projectData.projectteamwork3) > 0;
                if (teamworkCheck)
                    projLines.push(
                        `${C.HANDOUTHTML.projects.tag("TEAMWORK:", C.COLORS.blue)}${C.HANDOUTHTML.projects.teamwork(
                            "●".repeat(
                                D.Int(projectData.projectteamwork1) + D.Int(projectData.projectteamwork2) + D.Int(projectData.projectteamwork3)
                            )
                        )}`
                    );
                if (stakeCheck) {
                    const stakeStrings = [];
                    for (let i = 1; i <= 3; i++) {
                        const [attr, val] = [projectData[`projectstake${i}_name`], D.Int(projectData[`projectstake${i}`])];
                        if (attr && attr.length > 2 && !_.isNaN(val))
                            stakeStrings.push(`${attr} ${"●".repeat(val)}`);
                    }
                    projLines.push(`${C.HANDOUTHTML.projects.tag("STAKED:")}${C.HANDOUTHTML.projects.stake(stakeStrings.join(", "))}`);
                    if (!teamworkCheck)
                        projLines.push(`${C.HANDOUTHTML.projects.tag("")}${C.HANDOUTHTML.projects.teamwork("")}`);
                } else if (teamworkCheck) {
                    projLines.push(`${C.HANDOUTHTML.projects.tag("")}${C.HANDOUTHTML.projects.stake("")}`);
                }
                if (projectData.projectlaunchresults && projectData.projectlaunchresults.length > 2)
                    if (projectData.projectlaunchresults.includes("CRITICAL"))
                        projLines.push(C.HANDOUTHTML.projects.critSucc("CRITICAL"));
                    else
                        projLines.push(C.HANDOUTHTML.projects.succ(`Success (+${projectData.projectlaunchresultsmargin})`));
                else
                    projLines.push(C.HANDOUTHTML.projects.succ(""));
                if (projectData.projectenddate) {
                    projLines.push(C.HANDOUTHTML.projects.endDate(`Ends ${projectData.projectenddate.toUpperCase()}`));
                    if (D.Int(projectData.projectinccounter) > 0)
                        projLines.push(
                            `<br>${C.HANDOUTHTML.projects.daysLeft(
                                `(${D.Int(projectData.projectincnum) * D.Int(projectData.projectinccounter)} ${projectData.projectincunit.slice(
                                    0,
                                    -1
                                )}(s) left)`
                            )}`
                        );
                }
                if (projLines.length === 1 && projLines[0] === C.HANDOUTHTML.projects.goal(""))
                    continue;
                charLines.push(C.HANDOUTHTML.main(projLines.join("")));
            }
            if (charLines.length === 0)
                continue;
            charLines.unshift(C.HANDOUTHTML.projects.charName(D.GetName(char).toUpperCase()));
            noteSections.push(charLines.join(""));
        }
        // noteObj.set("notes", "This works!")
        noteObj.set("notes", C.HANDOUTHTML.main(noteSections.join("<br>")));
        return noteObj;
    };
    /*
    const summarizePrestation = (title, charObjs) => {
        delHandoutObjs("Prestation Summary", "prestation");
        const // noteObj = makeHandoutObj(title, "prestation"),
            noteSections = [];
        for (const charObj of charObjs) {
            const charLines = {
                boonsowed: [],
                boonsowing: []
            };
            const prestationData = getPrestationData(charObj);
            // D.Alert(`Prestation Data for ${charObj.get("name")}:<br><b>OWED:</b><br>${D.JS(prestationData.boonsowed)}<br><br><b>OWING:</b><br>${D.JS(prestationData.boonsowing)}`, "Prestation Data")
            continue;
            for (const cat of ["boonsowed", "boonsowing"])
                for (const boonData of prestationData[cat]) {
                    // for (const item of ["projectdetails", "projectgoal", "projectstartdate", "projectincnum", "projectincunit", "projectenddate", "projectinccounter", "projectscope_name", "projectscope", ]) {
                    //        projectData[item] = projectData[item] || ""
                    //    }
                    if (boonData.projectenddate && TimeTracker.GetDate(boonData.projectenddate) < TimeTracker.CurrentDate) continue;
                    const projLines = [];
                    let projGoal = "";
                    if (D.Int(boonData.projectscope) > 0) projGoal += `${"●".repeat(D.Int(boonData.projectscope))} `;
                    if (boonData.projectscope_name && boonData.projectscope_name.length > 2) projGoal += boonData.projectscope_name;
                    projLines.push(C.HANDOUTHTML.projects.goal(projGoal));
                    if (boonData.projectgoal && boonData.projectgoal.length > 2)
                        projLines.push(`${C.HANDOUTHTML.projects.tag("HOOK:")}${C.HANDOUTHTML.projects.hook(boonData.projectgoal)}`);
                    if (boonData.projectdetails && boonData.projectdetails.length > 2)
                        projLines.push(C.HANDOUTHTML.smallNote(boonData.projectdetails));
                        // let [stakeCheck, teamworkCheck] = [false, false]
                        // for (const stakeVar of ["projectstake1_name", "projectstake1", "projectstake2_name", "projectstake2", "projectstake3_name", "projectstake3"])
                        //     if (boonData[stakeVar] && (!_.isNaN(D.Int(boonData[stakeVar])) && D.Int(boonData[stakeVar]) > 0 || boonData[stakeVar].length > 2))
                        //         stakeCheck = true
                        // teamworkCheck = D.Int(boonData.projectteamwork1) + D.Int(boonData.projectteamwork2) + D.Int(boonData.projectteamwork3) > 0
                        // if (teamworkCheck)
                        //     projLines.push(`${C.HANDOUTHTML.projects.tag("TEAMWORK:", C.COLORS.blue)}${C.HANDOUTHTML.projects.teamwork("●".repeat(D.Int(projectData.projectteamwork1) + D.Int(projectData.projectteamwork2) + D.Int(projectData.projectteamwork3)))}`)
                        // if (stakeCheck) {
                        //     const stakeStrings = []
                        //     for (let i = 1; i <= 3; i++) {
                        //         const [attr, val] = [boonData[`projectstake${i}_name`], D.Int(boonData[`projectstake${i}`])]
                        //         if (attr && attr.length > 2 && !_.isNaN(val))
                        //             stakeStrings.push(`${attr} ${"●".repeat(val)}`)
                        //     }
                        //     projLines.push(`${C.HANDOUTHTML.projects.tag("STAKED:")}${C.HANDOUTHTML.projects.stake(stakeStrings.join(", "))}`)
                        //     if (!teamworkCheck)
                        //         projLines.push(`${C.HANDOUTHTML.projects.tag("")}${C.HANDOUTHTML.projects.teamwork("")}`)
                        // } else if (teamworkCheck) {
                        //     projLines.push(`${C.HANDOUTHTML.projects.tag("")}${C.HANDOUTHTML.projects.stake("")}`)
                        // }
                        // if (boonData.projectlaunchresults && boonData.projectlaunchresults.length > 2)
                        //     if (boonData.projectlaunchresults.includes("CRITICAL"))
                        //         projLines.push(C.HANDOUTHTML.projects.critSucc("CRITICAL"))
                        //     else
                        //         projLines.push(C.HANDOUTHTML.projects.succ(`Success (+${boonData.projectlaunchresultsmargin})`))
                        // else
                        //     projLines.push(C.HANDOUTHTML.projects.succ(""))
                        // if (boonData.projectenddate) {
                        //     projLines.push(C.HANDOUTHTML.projects.endDate(`Ends ${boonData.projectenddate.toUpperCase()}`))
                        //     if (D.Int(boonData.projectinccounter) > 0)
                        //         projLines.push(`<br>${C.HANDOUTHTML.projects.daysLeft(`(${D.Int(boonData.projectincnum) * D.Int(boonData.projectinccounter)} ${boonData.projectincunit.slice(0, -1)}(s) left)`)}`)
                        // }
                        // if (projLines.length === 1 && projLines[0] === C.HANDOUTHTML.projects.goal(""))
                        //     continue
                        // charLines.push(C.HANDOUTHTML.main(projLines.join("")))
                }

            if (charLines.length === 0) continue;
            charLines.unshift(C.HANDOUTHTML.projects.charName(D.GetName(charObj).toUpperCase()));
            noteSections.push(charLines.join(""));
        }
    }; */
    // #endregion

    return {
        PreInitialize: preInitialize,
        CheckInstall: checkInstall,
        OnChatCall: onChatCall,

        Make: makeHandoutObj,
        Report: makeSimpleHandoutObj,
        Set: updateHandout,
        Remove: delHandoutObj,
        RemoveAll: delHandoutObjs,
        Get: getHandoutObj,
        ParseCode: parseHandoutGMCode,
        Count: getCount,

        UpdateReferenceHandouts: () => {
            updateCharSummary();
            updateCharDetails();
        },
        UpdateRollEffects: () => {
            parseRollEffects("Location Effects", state.VAMPIRE.Roller, "newRollEffects", "location");
            parseRollEffects("Roll Effects", state.VAMPIRE.Roller, "newRollEffects", "general");
        },
        UpdateObjectiveHandout: updateObjectiveHandout
    };
})();

on("ready", () => {
    Handouts.CheckInstall();
    D.Log("Handouts Ready!");
});
void MarkStop("Handouts");
