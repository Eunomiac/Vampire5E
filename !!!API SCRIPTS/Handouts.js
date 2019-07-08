void MarkStart("Handouts")
const Handouts = (() => {	
    // #region INITIALIZATION
    const SCRIPTNAME = "Handouts",
		    STATEREF = C.ROOT[SCRIPTNAME]	// eslint-disable-line no-unused-vars
    const VAL = (varList, funcName) => D.Validate(varList, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
		   DB = (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME) // eslint-disable-line no-unused-vars
    // #endregion

    // #region GETTERS: Retrieving Notes, Data
    const getHandoutObj = (title, charRef) => {
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
                const rowData = {rowID}
                _.each(attrDatas, attrData => {
                    rowData[attrData.name] = attrData.val
                })
                projData.push(rowData)
            })
            return projData
        }
    // #endregion

    // #region SETTERS: Setting Notes
    const makeHandoutObj = (title, category, contents) => {
        if (category)
            STATEREF.noteCounts[category] = STATEREF.noteCounts[category] ? STATEREF.noteCounts[category] + 1 : 1
        const noteObj = createObj("handout", {name: `${title} ${category && STATEREF.noteCounts[category] ? STATEREF.noteCounts[category] - 1 : ""}`})
        if (contents)
            noteObj.set("notes", C.HANDOUTHTML.projects.main(D.JS(contents)))
        return noteObj		
    }
    // #endregion

    // #region PROJECT SUMMARIES

    const summarizeProjects = (title, charObjs) => {
        const noteObj = makeHandoutObj(title, "projects"),
            noteSections = []
        for (const char of charObjs) {
            const charLines = []
            for (let projectData of getProjectData(char)) {
                //D.Alert(D.JS(projectData), "Project Data")
                /* for (const item of ["projectdetails", "projectgoal", "projectstartdate", "projectincnum", "projectincunit", "projectenddate", "projectinccounter", "projectscope_name", "projectscope", ]) {
					projectData[item] = projectData[item] || ""
				} */
                if (projectData.projectenddate && TimeTracker.ParseDate(projectData.projectenddate) < TimeTracker.CurrentDate())
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
                if ((parseInt(projectData.projectteamwork1)||0) + (parseInt(projectData.projectteamwork2)||0) + (parseInt(projectData.projectteamwork3)||0) > 0)
                    projLines.push(`${C.HANDOUTHTML.projects.tag("TEAMWORK:", "0000FF")}${C.HANDOUTHTML.projects.teamwork("●".repeat((parseInt(projectData.projectteamwork1)||0) + (parseInt(projectData.projectteamwork2)||0) + (parseInt(projectData.projectteamwork3)||0) || 0))}`)
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
                        projLines.push(`<br>${C.HANDOUTHTML.projects.daysLeft(`(${parseInt(projectData.projectincnum) * parseInt(projectData.projectinccounter)} ${projectData.projectincunits} left)`)}`)				
                }
                let stakeCheck = false
                for (const stakeVar of ["projectstake1_name", "projectstake1", "projectstake2_name", "projectstake2", "projectstake3_name", "projectstake3"])
                    if (projectData[stakeVar] && (!_.isNaN(parseInt(projectData[stakeVar])) && parseInt(projectData[stakeVar]) > 0 || projectData[stakeVar].length > 2)) 
                        stakeCheck = true
						//thisSection += `<span style="display: block;">${stakeVar} Triggered Table: Number = ${parseInt(projectData[stakeVar])}, String = ${projectData[stakeVar]}</span>`					
                if (stakeCheck) {
                    const stakeStrings = []
                    for (let i = 1; i <= 3; i++) {
                        const [attr, val] = [projectData[`projectstake${i}_name`], parseInt(projectData[`projectstake${i}`])]
                        if (attr && attr.length > 2 && !_.isNaN(val))
                            stakeStrings.push(`${attr} ${"●".repeat(val)}`)
                    }                    
                    projLines.push(`${C.HANDOUTHTML.projects.tag("STAKED:")}${C.HANDOUTHTML.projects.stake(stakeStrings.join(", "))}`)
                }
                if (projLines.length === 1 && projLines[0] === C.HANDOUTHTML.projects.goal(""))
                    continue
                charLines.push(C.HANDOUTHTML.projects.main(projLines.join("")))
            }
            if (charLines.length === 0)
                continue
            charLines.unshift(C.HANDOUTHTML.projects.charName(D.GetName(char).toUpperCase()))
            noteSections.push(charLines.join(""))
        }
        //noteObj.set("notes", "This works!")
        noteObj.set("notes", C.HANDOUTHTML.projects.main(noteSections.join("<br>")))
        return noteObj
    }
    // #endregion

    // #region Event Handlers (handleInput)
    const handleInput = msg => {
        if (msg.type !== "api" || !playerIsGM(msg.playerid))
            return
        /* API chat command parameters can contain spaces, but multiple parameters must be comma-delimited.
                e.g. "!test subcommand1 subcommand2 param1 with spaces, param2,param3" */
        const [command, ...args] = msg.content.split(/\s+/u)
        switch (command.toLowerCase()) {
            case "!handouts":
                if (!args[0])
                    D.ThrowError("Syntax: !handouts get [projects/contents/...]")
                else
                    switch(args.shift().toLowerCase()) {
                        case "get":
                            switch(args.shift().toLowerCase()) {
                                case "projects":
                                    summarizeProjects("Project Summary", D.GetChars("registered"))
                                    break
                                // no default
                            }
                            break
                        // no default
                    }
                break
            // no default
        }
    }
    // #endregion

    // #region Public Functions: regHandlers
    const regHandlers = () => {
            on("chat:message", handleInput)
        },
        checkInstall = () => {
            C.ROOT = C.ROOT || {}
            C.ROOT.Handouts = C.ROOT.Handouts || {}
            C.ROOT.Handouts.noteCounts = C.ROOT.Handouts.noteCounts || { projects: 0 }
        }
    // #endregion

    return {
        RegisterEventHandlers: regHandlers,
        CheckInstall: checkInstall,

        Make: makeHandoutObj,
        GetHandout: getHandoutObj
    }
} )()

on("ready", () => {
    Handouts.RegisterEventHandlers()
    Handouts.CheckInstall()
    D.Log("Handouts Ready!")
} )
void MarkStop("Handouts")