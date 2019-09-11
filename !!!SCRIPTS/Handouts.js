void MarkStart("Handouts")
const Handouts = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Handouts",
        CHATCOMMAND = "!handouts",
        GMONLY = true

    // #region COMMON INITIALIZATION
    const STATEREF = C.ROOT[SCRIPTNAME]	// eslint-disable-line no-unused-vars
    const VAL = (varList, funcName, isArray = false) => D.Validate(varList, funcName, SCRIPTNAME, isArray), // eslint-disable-line no-unused-vars
        DB = (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        LOG = (msg, funcName) => D.Log(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        THROW = (msg, funcName, errObj) => D.ThrowError(msg, funcName, SCRIPTNAME, errObj) // eslint-disable-line no-unused-vars

    const checkInstall = () => {
            C.ROOT[SCRIPTNAME] = C.ROOT[SCRIPTNAME] || {}
            initialize()
        },
        regHandlers = () => {
            on("chat:message", msg => {
                const args = msg.content.split(/\s+/u)
                if (msg.type === "api" && (!GMONLY || playerIsGM(msg.playerid) || msg.playerid === "API") && (!CHATCOMMAND || args.shift() === CHATCOMMAND)) {
                    const who = msg.who || "API",
                        call = args.shift()
                    handleInput(msg, who, call, args)
                }
            })
        }
    // #endregion

    // #region LOCAL INITIALIZATION
    const initialize = () => {
        STATEREF.noteCounts = STATEREF.noteCounts || { projects: 0 }
    }
    // #endregion	

    // #region EVENT HANDLERS: (HANDLEINPUT)
    const handleInput = (msg, who, call, args) => { 	// eslint-disable-line no-unused-vars
        // const
        switch (call) {
            case "get":
                switch (args.shift().toLowerCase()) {
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
    }
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    // #region GETTERS: Retrieving Notes, Data
    const getCount = category => STATEREF.noteCounts[category],
        getHandoutObj = (title, charRef) => {
            const notes = findObjs({
                _type: "handout",
                name: title
            })
            notes[0].get("notes", (note) => { log(note) })

            if (charRef)
                return _.filter(notes, v => v.get("inplayerjournals").includes(D.GetPlayerID(charRef)))[0]
            else
                return notes[0]
        },
        getProjectData = (charRef) => {
            const projAttrs = D.GetRepStats(charRef, "project", null, null, "rowID"),
                projData = []
            //D.Alert(`Project Attributes: ${D.JS(projAttrs)}`)
            _.each(projAttrs, (attrDatas, rowID) => {
                const rowData = { rowID }
                _.each(attrDatas, attrData => {
                    rowData[attrData.name] = attrData.val
                })
                projData.push(rowData)
            })
            return projData
        },
        getPrestationData = (charRef) => {
            const prestationAttrs = {
                    boonsOwed: D.GetRepStats(charRef, "boonsowed", null, null, "rowID"),
                    boonsOwing: D.GetRepStats(charRef, "boonsowing", null, null, "rowID")
                },
                prestationData = {
                    boonsOwed: [],
                    boonsOwing: []
                }
            //D.Alert(`Project Attributes: ${D.JS(projAttrs)}`)
            _.each(["boonsOwed", "boonsOwing"], cat => {
                _.each(prestationAttrs[cat], (attrDatas, rowID) => {
                    const rowData = { rowID }
                    _.each(attrDatas, attrData => {
                        rowData[attrData.name] = attrData.val
                    })
                    prestationData[cat].push(rowData)
                })
            })

            /* const groupedData = {
                boonsOwed: D.KeyMapObj(_.groupBy(prestationData.boonsOwed.map(x => ({to: x.boonowed_to, type: x.boonowed_type, details: x.boonowed_details})), x => x.to), null, x => x.map(xx => ({type: xx.type, details: xx.details}))),
                boonsOwing: D.KeyMapObj(_.groupBy(prestationData.boonsOwing.map(x => ({from: x.boonowing_from, type: x.boonowing_type, details: x.boonowing_details})), x => x.from), null, x => x.map(xx => ({type: xx.type, details: xx.details})))
            } */
            const groupedData = `<h2>OWED:</h2>${_.map(D.KeyMapObj(_.groupBy(prestationData.boonsOwed.map(x => ({to: x.boonowed_to, type: x.boonowed_type, details: x.boonowed_details})), x => x.to), null, x => x.map(xx => `<b>${xx.type.toUpperCase()}</b>: ${xx.details}`)), (v, k) => `<h3>${k}</h3><ul><li>${v.join("<li>")}</ul>`).join("")
            }<h2>OWING:</h2>${_.map(D.KeyMapObj(_.groupBy(prestationData.boonsOwing.map(x => ({from: x.boonowing_from, type: x.boonowing_type, details: x.boonowing_details})), x => x.from), null, x => x.map(xx => `<b>${xx.type.toUpperCase()}</b>: ${xx.details}`)), (v, k) => `<h3>${k}</h3><ul><li>${v.join("<li>")}</ul>`).join("")}`
            
            
          /*  _.values(D.KeyMapObj({
                boonsOwed: ,
                boonsOwing: 
            }, null, v => D.KeyMapObj(v, null, (vv, kk) => `<h3>${kk}</h3><ul>${vv.map(x => `<li>${x}</li>`).join("")}</ul>`))) */

            D.Alert(`Prestation Data for ${D.GetChar(charRef).get("name")}:<br>${D.JS(groupedData)}`, "Prestation Data")
            
            return groupedData
        }
    // #endregion

    // #region SETTERS: Setting Notes, Deleting Handouts, Appending to Handouts
    const makeHandoutObj = (title, category, contents) => {
            if (category)
                STATEREF.noteCounts[category] = STATEREF.noteCounts[category] ? STATEREF.noteCounts[category] + 1 : 1
            const noteObj = createObj("handout", { name: `${title} ${category && STATEREF.noteCounts[category] && STATEREF.noteCounts[category] > 1 ? STATEREF.noteCounts[category] - 1 : ""}` })
            if (contents)
                noteObj.set("notes", C.HANDOUTHTML.main(D.JS(contents)))
            return noteObj
        },
        delHandoutObjs = (titleRef, category) => {
            for (const handout of _.filter(findObjs({_type: "handout", inplayerjournals: "", archived: false}), v => D.FuzzyMatch(v.get("name"), titleRef)))
                handout.remove()
            if (category)
                STATEREF.noteCounts[category] = 0
        },
        delHandoutObj = (title, category) => {
            const handoutObj = _.find(findObjs({_type: "handout", inplayerjournals: "", archived: false}), v => v.get("name").toLowerCase().startsWith(title.toLowerCase()))
            if (VAL({object: handoutObj})) {
                if (category && STATEREF.noteCounts[category]) {
                    let matcher = handoutObj.get("name").match(/\d+$/u)
                    if (matcher && parseInt(matcher[0]) === STATEREF.noteCounts[category])
                        STATEREF.noteCounts[category]--
                }
                handoutObj.remove()
            }                
        }
    // #endregion

    // #region CHARACTER SHEET SUMMARIES

    const summarizeProjects = (title, charObjs) => {
            delHandoutObjs("Project Summary", "projects")
            const noteObj = makeHandoutObj(title, "projects"),
                noteSections = []
            for (const char of charObjs) {
                const charLines = []
                for (let projectData of getProjectData(char)) {
                    //D.Alert(D.JS(projectData), "Project Data")
                    /* for (const item of ["projectdetails", "projectgoal", "projectstartdate", "projectincnum", "projectincunit", "projectenddate", "projectinccounter", "projectscope_name", "projectscope", ]) {
                        projectData[item] = projectData[item] || ""
                    } */
                    if (projectData.projectenddate && TimeTracker.GetDate(projectData.projectenddate) < TimeTracker.CurrentDate)
                        continue
                    const projLines = []
                    let projGoal = ""
                    if (parseInt(projectData.projectscope) > 0)
                        projGoal += `${"●".repeat(parseInt(projectData.projectscope))} `
                    if (projectData.projectscope_name && projectData.projectscope_name.length > 2)
                        projGoal += projectData.projectscope_name
                    projLines.push(C.HANDOUTHTML.projects.goal(projGoal))
                    if (projectData.projectgoal && projectData.projectgoal.length > 2)
                        projLines.push(`${C.HANDOUTHTML.projects.tag("HOOK:")}${C.HANDOUTHTML.projects.hook(projectData.projectgoal)}`)
                    if (projectData.projectdetails && projectData.projectdetails.length > 2)
                        projLines.push(C.HANDOUTHTML.smallNote(projectData.projectdetails))
                    let [stakeCheck, teamworkCheck] = [false, false]
                    for (const stakeVar of ["projectstake1_name", "projectstake1", "projectstake2_name", "projectstake2", "projectstake3_name", "projectstake3"])
                        if (projectData[stakeVar] && (!_.isNaN(parseInt(projectData[stakeVar])) && parseInt(projectData[stakeVar]) > 0 || projectData[stakeVar].length > 2))
                            stakeCheck = true
                    if ((parseInt(projectData.projectteamwork1) || 0) + (parseInt(projectData.projectteamwork2) || 0) + (parseInt(projectData.projectteamwork3) || 0) > 0)
                        teamworkCheck = true
                    if (teamworkCheck)
                        projLines.push(`${C.HANDOUTHTML.projects.tag("TEAMWORK:", C.COLORS.blue)}${C.HANDOUTHTML.projects.teamwork("●".repeat((parseInt(projectData.projectteamwork1) || 0) + (parseInt(projectData.projectteamwork2) || 0) + (parseInt(projectData.projectteamwork3) || 0) || 0))}`)
                    if (stakeCheck) {
                        const stakeStrings = []
                        for (let i = 1; i <= 3; i++) {
                            const [attr, val] = [projectData[`projectstake${i}_name`], parseInt(projectData[`projectstake${i}`])]
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
                        if (parseInt(projectData.projectinccounter) > 0)
                            projLines.push(`<br>${C.HANDOUTHTML.projects.daysLeft(`(${parseInt(projectData.projectincnum) * parseInt(projectData.projectinccounter)} ${projectData.projectincunit.slice(0, -1)}(s) left)`)}`)
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
            //noteObj.set("notes", "This works!")
            noteObj.set("notes", C.HANDOUTHTML.main(noteSections.join("<br>")))
            return noteObj
        },
        summarizePrestation = (title, charObjs) => {
            delHandoutObjs("Prestation Summary", "prestation")
            const noteObj = makeHandoutObj(title, "prestation"),
                noteSections = []
            for (const charObj of charObjs) {
                const charLines = {
                        boonsOwed: [],
                        boonsOwing: []
                    },
                    prestationData = getPrestationData(charObj)                    
                //D.Alert(`Prestation Data for ${charObj.get("name")}:<br><b>OWED:</b><br>${D.JS(prestationData.boonsOwed)}<br><br><b>OWING:</b><br>${D.JS(prestationData.boonsOwing)}`, "Prestation Data")
                continue
                for (const cat of ["boonsOwed", "boonsOwing"]) {
                    for (let boonData of prestationData[cat]) {
                        /* for (const item of ["projectdetails", "projectgoal", "projectstartdate", "projectincnum", "projectincunit", "projectenddate", "projectinccounter", "projectscope_name", "projectscope", ]) {
                            projectData[item] = projectData[item] || ""
                        } */
                        if (prestationData.projectenddate && TimeTracker.GetDate(prestationData.projectenddate) < TimeTracker.CurrentDate)
                            continue
                        const projLines = []
                        let projGoal = ""
                        if (parseInt(prestationData.projectscope) > 0)
                            projGoal += `${"●".repeat(parseInt(prestationData.projectscope))} `
                        if (prestationData.projectscope_name && prestationData.projectscope_name.length > 2)
                            projGoal += prestationData.projectscope_name
                        projLines.push(C.HANDOUTHTML.projects.goal(projGoal))
                        if (prestationData.projectgoal && prestationData.projectgoal.length > 2)
                            projLines.push(`${C.HANDOUTHTML.projects.tag("HOOK:")}${C.HANDOUTHTML.projects.hook(prestationData.projectgoal)}`)
                        if (prestationData.projectdetails && prestationData.projectdetails.length > 2)
                            projLines.push(C.HANDOUTHTML.smallNote(prestationData.projectdetails))
                        let [stakeCheck, teamworkCheck] = [false, false]
                        for (const stakeVar of ["projectstake1_name", "projectstake1", "projectstake2_name", "projectstake2", "projectstake3_name", "projectstake3"])
                            if (prestationData[stakeVar] && (!_.isNaN(parseInt(prestationData[stakeVar])) && parseInt(prestationData[stakeVar]) > 0 || prestationData[stakeVar].length > 2))
                                stakeCheck = true
                        if ((parseInt(prestationData.projectteamwork1) || 0) + (parseInt(prestationData.projectteamwork2) || 0) + (parseInt(prestationData.projectteamwork3) || 0) > 0)
                            teamworkCheck = true
                        if (teamworkCheck)
                            projLines.push(`${C.HANDOUTHTML.projects.tag("TEAMWORK:", C.COLORS.blue)}${C.HANDOUTHTML.projects.teamwork("●".repeat((parseInt(prestationData.projectteamwork1) || 0) + (parseInt(prestationData.projectteamwork2) || 0) + (parseInt(prestationData.projectteamwork3) || 0) || 0))}`)
                        if (stakeCheck) {
                            const stakeStrings = []
                            for (let i = 1; i <= 3; i++) {
                                const [attr, val] = [prestationData[`projectstake${i}_name`], parseInt(prestationData[`projectstake${i}`])]
                                if (attr && attr.length > 2 && !_.isNaN(val))
                                    stakeStrings.push(`${attr} ${"●".repeat(val)}`)
                            }
                            projLines.push(`${C.HANDOUTHTML.projects.tag("STAKED:")}${C.HANDOUTHTML.projects.stake(stakeStrings.join(", "))}`)
                            if (!teamworkCheck)
                                projLines.push(`${C.HANDOUTHTML.projects.tag("")}${C.HANDOUTHTML.projects.teamwork("")}`)
                        } else if (teamworkCheck) {
                            projLines.push(`${C.HANDOUTHTML.projects.tag("")}${C.HANDOUTHTML.projects.stake("")}`)
                        }          
                        if (prestationData.projectlaunchresults && prestationData.projectlaunchresults.length > 2)
                            if (prestationData.projectlaunchresults.includes("CRITICAL"))
                                projLines.push(C.HANDOUTHTML.projects.critSucc("CRITICAL"))
                            else
                                projLines.push(C.HANDOUTHTML.projects.succ(`Success (+${prestationData.projectlaunchresultsmargin})`))
                        else
                            projLines.push(C.HANDOUTHTML.projects.succ(""))
                        if (prestationData.projectenddate) {
                            projLines.push(C.HANDOUTHTML.projects.endDate(`Ends ${prestationData.projectenddate.toUpperCase()}`))
                            if (parseInt(prestationData.projectinccounter) > 0)
                                projLines.push(`<br>${C.HANDOUTHTML.projects.daysLeft(`(${parseInt(prestationData.projectincnum) * parseInt(prestationData.projectinccounter)} ${prestationData.projectincunit.slice(0, -1)}(s) left)`)}`)
                        }
                        if (projLines.length === 1 && projLines[0] === C.HANDOUTHTML.projects.goal(""))
                            continue
                        charLines.push(C.HANDOUTHTML.main(projLines.join("")))
                    }
                }
                if (charLines.length === 0)
                    continue
                charLines.unshift(C.HANDOUTHTML.projects.charName(D.GetName(charObj).toUpperCase()))
                noteSections.push(charLines.join(""))
            }
        }
    // #endregion


    return {
        RegisterEventHandlers: regHandlers,
        CheckInstall: checkInstall,

        Make: makeHandoutObj,
        Remove: delHandoutObj,
        RemoveAll: delHandoutObjs,
        Get: getHandoutObj,
        Count: getCount
    }
})()

on("ready", () => {
    Handouts.RegisterEventHandlers()
    Handouts.CheckInstall()
    D.Log("Handouts Ready!")
})
void MarkStop("Handouts")