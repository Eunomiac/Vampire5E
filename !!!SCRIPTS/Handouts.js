void MarkStart("Handouts")
const Handouts = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Handouts",

    // #region COMMON INITIALIZATION
        STATE = {get REF() { return C.RO.OT[SCRIPTNAME] }},	// eslint-disable-line no-unused-vars
        VAL = (varList, funcName, isArray = false) => D.Validate(varList, funcName, SCRIPTNAME, isArray), // eslint-disable-line no-unused-vars
        DB = (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        LOG = (msg, funcName) => D.Log(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        THROW = (msg, funcName, errObj) => D.ThrowError(msg, funcName, SCRIPTNAME, errObj), // eslint-disable-line no-unused-vars

        checkInstall = () => {
            C.RO.OT[SCRIPTNAME] = C.RO.OT[SCRIPTNAME] || {}
        },
    // #endregion

    // #region LOCAL INITIALIZATION
        preInitialize = () => {
            STATE.REF.noteCounts = STATE.REF.noteCounts || {projects: 0, debug: 0}
        },
    // #endregion	

    // #region EVENT HANDLERS: (HANDLEINPUT)
        onChatCall = (call, args, objects, msg) => { 	// eslint-disable-line no-unused-vars
            switch (call) {
                case "get":
                    switch (D.LCase(call = args.shift())) {
                        case "projects": {
                            summarizeProjects("Project Summary", D.GetChars("registered"))
                            break
                        }
                        case "prestation": {
                            summarizePrestation("Prestation Summary", D.GetChars("registered"))
                            break
                        }
                    // no default
                    }
                    break
            // no default
            }
        },
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    // #region GETTERS: Retrieving Notes, Data
        getCount = category => STATE.REF.noteCounts && STATE.REF.noteCounts[category] || 0,
        getHandoutObj = (title, charRef) => {
            const notes = findObjs({
                _type: "handout",
                name: title
            })
            // notes[0].get("notes", (note) => { log(note) })

            if (charRef)
                return _.filter(notes, v => v.get("inplayerjournals").includes(D.GetPlayerID(charRef)))[0]
            else
                return notes[0]
        },
        getProjectData = (charRef) => {
            const projAttrs = D.GetRepStats(charRef, "project", null, null, "rowID"),
                projData = []
            // D.Alert(`Project Attributes: ${D.JS(projAttrs)}`)
            _.each(projAttrs, (attrDatas, rowID) => {
                const rowData = {rowID}
                _.each(attrDatas, attrData => {
                    rowData[attrData.name] = attrData.val
                })
                projData.push(rowData)
            })
            return projData
        },
        getPrestationData = (charRef) => {
            const prestationAttrs = {
                    boonsowed: D.GetRepStats(charRef, "boonsowed", null, null, "rowID"),
                    boonsowing: D.GetRepStats(charRef, "boonsowing", null, null, "rowID")
                },
                prestationData = {
                    boonsowed: [],
                    boonsowing: []
                }
            // D.Alert(`Project Attributes: ${D.JS(projAttrs)}`)
            _.each(["boonsowed", "boonsowing"], cat => {
                _.each(prestationAttrs[cat], (attrDatas, rowID) => {
                    const rowData = {rowID}
                    _.each(attrDatas, attrData => {
                        rowData[attrData.name] = attrData.val
                    })
                    prestationData[cat].push(rowData)
                })
            })

            /* const groupedData = {
                boonsowed: D.KeyMapObj(_.groupBy(prestationData.boonsowed.map(x => ({to: x.boonowed_to, type: x.boonowed_type, details: x.boonowed_details})), x => x.to), null, x => x.map(xx => ({type: xx.type, details: xx.details}))),
                boonsowing: D.KeyMapObj(_.groupBy(prestationData.boonsowing.map(x => ({from: x.boonowing_from, type: x.boonowing_type, details: x.boonowing_details})), x => x.from), null, x => x.map(xx => ({type: xx.type, details: xx.details})))
            } */
            const groupedData = `<h2>OWED:</h2>${_.map(D.KeyMapObj(_.groupBy(prestationData.boonsowed.map(x => ({to: x.boonowed_to, type: x.boonowed_type, details: x.boonowed_details})), x => x.to), null, x => x.map(xx => `<b>${xx.type.toUpperCase()}</b>: ${xx.details}`)), (v, k) => `<h3>${k}</h3><ul><li>${v.join("<li>")}</ul>`).join("")
            }<h2>OWING:</h2>${_.map(D.KeyMapObj(_.groupBy(prestationData.boonsowing.map(x => ({from: x.boonowing_from, type: x.boonowing_type, details: x.boonowing_details})), x => x.from), null, x => x.map(xx => `<b>${xx.type.toUpperCase()}</b>: ${xx.details}`)), (v, k) => `<h3>${k}</h3><ul><li>${v.join("<li>")}</ul>`).join("")}`
            
            
          /*  _.values(D.KeyMapObj({
                boonsowed: ,
                boonsowing: 
            }, null, v => D.KeyMapObj(v, null, (vv, kk) => `<h3>${kk}</h3><ul>${vv.map(x => `<li>${x}</li>`).join("")}</ul>`))) */

            D.Alert(`Prestation Data for ${D.GetChar(charRef).get("name")}:<br>${D.JS(groupedData)}`, "Prestation Data")
            
            return groupedData
        },
    // #endregion

    // #region SETTERS: Setting Notes, Deleting Handouts, Appending to Handouts
        makeHandoutObj = (title, category, contents, isRawCode = false) => {
            if (category)
                STATE.REF.noteCounts[category] = getCount(category) + 1
            const noteObj = createObj("handout", {name: `${title} ${category && getCount(category) > 1 ? getCount(category) - 1 : ""}`})
            if (contents)
                noteObj.set("notes", C.HANDOUTHTML.main(isRawCode && contents || D.JS(contents)))
            return noteObj
        },
        updateHandout = (title, category, contents, isRawCode = false) => {
            const handoutObj = getHandoutObj(title)
            if (VAL({object: handoutObj}))
                handoutObj.set("notes", isRawCode && contents || D.JS(contents))
        },
        delHandoutObjs = (titleRef, category) => {
            for (const handout of _.filter(findObjs({_type: "handout", inplayerjournals: "", archived: false}), v => D.FuzzyMatch(v.get("name"), titleRef)))
                handout.remove()
            if (category)
                STATE.REF.noteCounts[category] = 0
        },
        delHandoutObj = (title, category) => {
            const handoutObj = _.find(findObjs({_type: "handout", inplayerjournals: "", archived: false}), v => v.get("name").toLowerCase().startsWith(title.toLowerCase()))
            if (VAL({object: handoutObj})) {
                if (category && STATE.REF.noteCounts[category]) {
                    const matcher = handoutObj.get("name").match(/\d+$/u)
                    if (matcher && D.Int(matcher[0]) === getCount(category))
                        STATE.REF.noteCounts[category] = getCount(category) - 1
                }
                handoutObj.remove()
            }                
        },
    // #endregion

    // #region CHARACTER SHEET SUMMARIES

        summarizeProjects = (title, charObjs) => {
            delHandoutObjs("Project Summary", "projects")
            const noteObj = makeHandoutObj(title, "projects"),
                noteSections = []
            for (const char of charObjs) {
                const charLines = []
                for (const projectData of getProjectData(char)) {
                    // D.Alert(D.JS(projectData), "Project Data")
                    /* for (const item of ["projectdetails", "projectgoal", "projectstartdate", "projectincnum", "projectincunit", "projectenddate", "projectinccounter", "projectscope_name", "projectscope", ]) {
                        projectData[item] = projectData[item] || ""
                    } */
                    if (projectData.projectenddate && TimeTracker.GetDate(projectData.projectenddate) < TimeTracker.CurrentDate)
                        continue
                    const projLines = []
                    let projGoal = ""
                    if (D.Int(projectData.projectscope) > 0)
                        projGoal += `${"●".repeat(D.Int(projectData.projectscope))} `
                    if (projectData.projectscope_name && projectData.projectscope_name.length > 2)
                        projGoal += projectData.projectscope_name
                    projLines.push(C.HANDOUTHTML.projects.goal(projGoal))
                    if (projectData.projectgoal && projectData.projectgoal.length > 2)
                        projLines.push(`${C.HANDOUTHTML.projects.tag("HOOK:")}${C.HANDOUTHTML.projects.hook(projectData.projectgoal)}`)
                    if (projectData.projectdetails && projectData.projectdetails.length > 2)
                        projLines.push(C.HANDOUTHTML.smallNote(projectData.projectdetails))
                    let [stakeCheck, teamworkCheck] = [false, false]
                    for (const stakeVar of ["projectstake1_name", "projectstake1", "projectstake2_name", "projectstake2", "projectstake3_name", "projectstake3"])
                        if (projectData[stakeVar] && (!_.isNaN(D.Int(projectData[stakeVar])) && D.Int(projectData[stakeVar]) > 0 || projectData[stakeVar].length > 2))
                            stakeCheck = true
                    teamworkCheck = D.Int(projectData.projectteamwork1) + D.Int(projectData.projectteamwork2) + D.Int(projectData.projectteamwork3) > 0
                    if (teamworkCheck)
                        projLines.push(`${C.HANDOUTHTML.projects.tag("TEAMWORK:", C.COLORS.blue)}${C.HANDOUTHTML.projects.teamwork("●".repeat(D.Int(projectData.projectteamwork1) + D.Int(projectData.projectteamwork2) + D.Int(projectData.projectteamwork3)))}`)
                    if (stakeCheck) {
                        const stakeStrings = []
                        for (let i = 1; i <= 3; i++) {
                            const [attr, val] = [projectData[`projectstake${i}_name`], D.Int(projectData[`projectstake${i}`])]
                            if (attr && attr.length > 2 && !_.isNaN(val))
                                stakeStrings.push(`${attr} ${"●".repeat(val)}`)
                        }
                        projLines.push(`${C.HANDOUTHTML.projects.tag("STAKED:")}${C.HANDOUTHTML.projects.stake(stakeStrings.join(", "))}`)
                        if (!teamworkCheck)
                            projLines.push(`${C.HANDOUTHTML.projects.tag("")}${C.HANDOUTHTML.projects.teamwork("")}`)
                    } else if (teamworkCheck) {
                        projLines.push(`${C.HANDOUTHTML.projects.tag("")}${C.HANDOUTHTML.projects.stake("")}`)
                    }          
                    if (projectData.projectlaunchresults && projectData.projectlaunchresults.length > 2)
                        if (projectData.projectlaunchresults.includes("CRITICAL"))
                            projLines.push(C.HANDOUTHTML.projects.critSucc("CRITICAL"))
                        else
                            projLines.push(C.HANDOUTHTML.projects.succ(`Success (+${projectData.projectlaunchresultsmargin})`))
                    else
                        projLines.push(C.HANDOUTHTML.projects.succ(""))
                    if (projectData.projectenddate) {
                        projLines.push(C.HANDOUTHTML.projects.endDate(`Ends ${projectData.projectenddate.toUpperCase()}`))
                        if (D.Int(projectData.projectinccounter) > 0)
                            projLines.push(`<br>${C.HANDOUTHTML.projects.daysLeft(`(${D.Int(projectData.projectincnum) * D.Int(projectData.projectinccounter)} ${projectData.projectincunit.slice(0, -1)}(s) left)`)}`)
                    }
                    if (projLines.length === 1 && projLines[0] === C.HANDOUTHTML.projects.goal(""))
                        continue
                    charLines.push(C.HANDOUTHTML.main(projLines.join("")))
                }
                if (charLines.length === 0)
                    continue
                charLines.unshift(C.HANDOUTHTML.projects.charName(D.GetName(char).toUpperCase()))
                noteSections.push(charLines.join(""))
            }
            // noteObj.set("notes", "This works!")
            noteObj.set("notes", C.HANDOUTHTML.main(noteSections.join("<br>")))
            return noteObj
        },
        summarizePrestation = (title, charObjs) => {
            delHandoutObjs("Prestation Summary", "prestation")
            const // noteObj = makeHandoutObj(title, "prestation"),
                noteSections = []
            for (const charObj of charObjs) {
                const charLines = {
                        boonsowed: [],
                        boonsowing: []
                    },
                    prestationData = getPrestationData(charObj)                    
                // D.Alert(`Prestation Data for ${charObj.get("name")}:<br><b>OWED:</b><br>${D.JS(prestationData.boonsowed)}<br><br><b>OWING:</b><br>${D.JS(prestationData.boonsowing)}`, "Prestation Data")
                continue
                for (const cat of ["boonsowed", "boonsowing"]) 
                    for (const boonData of prestationData[cat]) {
                        /* for (const item of ["projectdetails", "projectgoal", "projectstartdate", "projectincnum", "projectincunit", "projectenddate", "projectinccounter", "projectscope_name", "projectscope", ]) {
                            projectData[item] = projectData[item] || ""
                        } */
                        if (boonData.projectenddate && TimeTracker.GetDate(boonData.projectenddate) < TimeTracker.CurrentDate)
                            continue
                        const projLines = []
                        let projGoal = ""
                        if (D.Int(boonData.projectscope) > 0)
                            projGoal += `${"●".repeat(D.Int(boonData.projectscope))} `
                        if (boonData.projectscope_name && boonData.projectscope_name.length > 2)
                            projGoal += boonData.projectscope_name
                        projLines.push(C.HANDOUTHTML.projects.goal(projGoal))
                        if (boonData.projectgoal && boonData.projectgoal.length > 2)
                            projLines.push(`${C.HANDOUTHTML.projects.tag("HOOK:")}${C.HANDOUTHTML.projects.hook(boonData.projectgoal)}`)
                        if (boonData.projectdetails && boonData.projectdetails.length > 2)
                            projLines.push(C.HANDOUTHTML.smallNote(boonData.projectdetails))
                        /*
                        let [stakeCheck, teamworkCheck] = [false, false]
                        for (const stakeVar of ["projectstake1_name", "projectstake1", "projectstake2_name", "projectstake2", "projectstake3_name", "projectstake3"])
                            if (boonData[stakeVar] && (!_.isNaN(D.Int(boonData[stakeVar])) && D.Int(boonData[stakeVar]) > 0 || boonData[stakeVar].length > 2))
                                stakeCheck = true
                        teamworkCheck = D.Int(boonData.projectteamwork1) + D.Int(boonData.projectteamwork2) + D.Int(boonData.projectteamwork3) > 0
                        if (teamworkCheck)
                            projLines.push(`${C.HANDOUTHTML.projects.tag("TEAMWORK:", C.COLORS.blue)}${C.HANDOUTHTML.projects.teamwork("●".repeat(D.Int(projectData.projectteamwork1) + D.Int(projectData.projectteamwork2) + D.Int(projectData.projectteamwork3)))}`)
                        if (stakeCheck) {
                            const stakeStrings = []
                            for (let i = 1; i <= 3; i++) {
                                const [attr, val] = [boonData[`projectstake${i}_name`], D.Int(boonData[`projectstake${i}`])]
                                if (attr && attr.length > 2 && !_.isNaN(val))
                                    stakeStrings.push(`${attr} ${"●".repeat(val)}`)
                            }
                            projLines.push(`${C.HANDOUTHTML.projects.tag("STAKED:")}${C.HANDOUTHTML.projects.stake(stakeStrings.join(", "))}`)
                            if (!teamworkCheck)
                                projLines.push(`${C.HANDOUTHTML.projects.tag("")}${C.HANDOUTHTML.projects.teamwork("")}`)
                        } else if (teamworkCheck) {
                            projLines.push(`${C.HANDOUTHTML.projects.tag("")}${C.HANDOUTHTML.projects.stake("")}`)
                        }          
                        if (boonData.projectlaunchresults && boonData.projectlaunchresults.length > 2)
                            if (boonData.projectlaunchresults.includes("CRITICAL"))
                                projLines.push(C.HANDOUTHTML.projects.critSucc("CRITICAL"))
                            else
                                projLines.push(C.HANDOUTHTML.projects.succ(`Success (+${boonData.projectlaunchresultsmargin})`))
                        else
                            projLines.push(C.HANDOUTHTML.projects.succ(""))
                        if (boonData.projectenddate) {
                            projLines.push(C.HANDOUTHTML.projects.endDate(`Ends ${boonData.projectenddate.toUpperCase()}`))
                            if (D.Int(boonData.projectinccounter) > 0)
                                projLines.push(`<br>${C.HANDOUTHTML.projects.daysLeft(`(${D.Int(boonData.projectincnum) * D.Int(boonData.projectinccounter)} ${boonData.projectincunit.slice(0, -1)}(s) left)`)}`)
                        }
                        if (projLines.length === 1 && projLines[0] === C.HANDOUTHTML.projects.goal(""))
                            continue
                        charLines.push(C.HANDOUTHTML.main(projLines.join("")))
                        */
                    }
                
                if (charLines.length === 0)
                    continue
                charLines.unshift(C.HANDOUTHTML.projects.charName(D.GetName(charObj).toUpperCase()))
                noteSections.push(charLines.join(""))
            }
        }
    // #endregion


    return {
        PreInitialize: preInitialize,
        CheckInstall: checkInstall,
        OnChatCall: onChatCall,

        Make: makeHandoutObj,
        Set: updateHandout,
        Remove: delHandoutObj,
        RemoveAll: delHandoutObjs,
        Get: getHandoutObj,
        Count: getCount
    }
})()

on("ready", () => {
    Handouts.CheckInstall()
    D.Log("Handouts Ready!")
})
void MarkStop("Handouts")