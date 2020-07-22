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
        STATE.REF.noteCounts = STATE.REF.noteCounts || {projects: 0, debug: 0};
        STATE.REF.categoryLogs = STATE.REF.categoryLogs || {projects: [], debug: [], callLogs: []};
        // STATE.REF.categoryLogs.callLogs = [];
    };
    // #endregion

    // #region EVENT HANDLERS: (HANDLEINPUT)
    const onChatCall = (call, args, objects, msg) => {
        switch (call) {
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
                    case "projects": {
                        // summarizeProjects("Project Summary", D.GetChars("registered"));
                        break;
                    }
                    case "prestation": {
                        // summarizePrestation("Prestation Summary", D.GetChars("registered"));
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
    const getHandoutCode = (titleRef, storageRef, storageKey) => {
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
    const getHandoutObj = (titleRef, charRef) => findObjs({_type: "handout"}).filter(
        (x) => D.LCase(x.get("name")).includes(D.LCase(titleRef)) && (!charRef || x.get("inplayerjournals").includes(D.GetPlayerID(charRef)))
    )[0];
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
        if (category) {
            STATE.REF.categoryLogs[category] = STATE.REF.categoryLogs[category] || [];
            while (getCount(category) >= (categoryMax[category] || categoryMax["default"]))
                delHandoutObj(STATE.REF.categoryLogs[category][0], category);
            title += ` ${getCatNum(category)}`;
            STATE.REF.categoryLogs[category].push(title);
        } else {
            delHandoutObj(title);
        }
        const noteObj = createObj("handout", {name: title});
        if (contents)
            updateHandout(title, category, contents, isWritingGM, isVerbose, isRawCode);
        return noteObj;
    };
    const makeSimpleHandoutObj = (title, contents, isVerbose = false) => makeHandoutObj(title, false, contents, true, isVerbose);
    const updateHandout = (title, category, contents, isWritingGM = false, isVerbose = false, isRawCode = false) => {
        const handoutObj = getHandoutObj(title);
        const noteData = {
            notes: isRawCode ? C.HANDOUTHTML.main(contents) : C.HANDOUTHTML.main(D.JS(contents, isVerbose)),
            gmnotes: typeof contents === "string" ? contents : JSON.stringify(contents)
        };
        if (handoutObj) {
            handoutObj.set("notes", noteData.notes);
            if (isWritingGM)
                handoutObj.set("gmnotes", noteData.gmnotes);
        } else {
            makeHandoutObj(title, category, contents, isWritingGM, isVerbose, isRawCode);
        }
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
            const compromises = D.GetRepStats(charObj, "beliefs", null, "conviction", null, "val");
            const convictions = D.GetRepStats(charObj, "beliefs", null, "touchstone_name", null, "val");
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
        const fullCode = tables.join("");
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
    // #endregion

    // #region CHARACTER SHEET SUMMARIES

    /*
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
                if (projectData.projectenddate && TimeTracker.GetDate(projectData.projectenddate) < TimeTracker.CurrentDate) continue;
                const projLines = [];
                let projGoal = "";
                if (D.Int(projectData.projectscope) > 0) projGoal += `${"●".repeat(D.Int(projectData.projectscope))} `;
                if (projectData.projectscope_name && projectData.projectscope_name.length > 2) projGoal += projectData.projectscope_name;
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
                        projectData[stakeVar] &&
                        ((!_.isNaN(D.Int(projectData[stakeVar])) && D.Int(projectData[stakeVar]) > 0) || projectData[stakeVar].length > 2)
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
                        if (attr && attr.length > 2 && !_.isNaN(val)) stakeStrings.push(`${attr} ${"●".repeat(val)}`);
                    }
                    projLines.push(`${C.HANDOUTHTML.projects.tag("STAKED:")}${C.HANDOUTHTML.projects.stake(stakeStrings.join(", "))}`);
                    if (!teamworkCheck) projLines.push(`${C.HANDOUTHTML.projects.tag("")}${C.HANDOUTHTML.projects.teamwork("")}`);
                } else if (teamworkCheck) {
                    projLines.push(`${C.HANDOUTHTML.projects.tag("")}${C.HANDOUTHTML.projects.stake("")}`);
                }
                if (projectData.projectlaunchresults && projectData.projectlaunchresults.length > 2)
                    if (projectData.projectlaunchresults.includes("CRITICAL")) projLines.push(C.HANDOUTHTML.projects.critSucc("CRITICAL"));
                    else projLines.push(C.HANDOUTHTML.projects.succ(`Success (+${projectData.projectlaunchresultsmargin})`));
                else projLines.push(C.HANDOUTHTML.projects.succ(""));
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
                if (projLines.length === 1 && projLines[0] === C.HANDOUTHTML.projects.goal("")) continue;
                charLines.push(C.HANDOUTHTML.main(projLines.join("")));
            }
            if (charLines.length === 0) continue;
            charLines.unshift(C.HANDOUTHTML.projects.charName(D.GetName(char).toUpperCase()));
            noteSections.push(charLines.join(""));
        }
        // noteObj.set("notes", "This works!")
        noteObj.set("notes", C.HANDOUTHTML.main(noteSections.join("<br>")));
        return noteObj;
    };
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
        ParseCode: getHandoutCode,
        Count: getCount,

        UpdateReferenceHandouts: () => {
            updateCharSummary();
            updateCharDetails();
        }
    };
})();

on("ready", () => {
    Handouts.CheckInstall();
    D.Log("Handouts Ready!");
});
void MarkStop("Handouts");
