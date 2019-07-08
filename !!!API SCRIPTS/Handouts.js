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
            noteObj.set("notes", `<div style="${C.HANDOUTHTML.projects.main}">${D.JS(contents)}</div>`)
        return noteObj		
    }
    // #endregion

    // #region PROJECT SUMMARIES

    const summarizeProjects = (title, charObjs) => {
        const noteObj = makeHandoutObj(title, "projects"),
            noteSections = []
        for (const char of charObjs) {
            let thisCharSec = `<span style="${C.HANDOUTHTML.projects.charName}">${D.GetName(char).toUpperCase()}</span>`
            for (let projectData of getProjectData(char)) {
                //D.Alert(D.JS(projectData), "Project Data")
                /* for (const item of ["projectdetails", "projectgoal", "projectstartdate", "projectincnum", "projectincunit", "projectenddate", "projectinccounter", "projectscope_name", "projectscope", ]) {
					projectData[item] = projectData[item] || ""
				} */
                if (projectData.projectenddate && TimeTracker.ParseDate(projectData.projectenddate) < TimeTracker.CurrentDate())
                    continue
                let thisSection = `<div style="${C.HANDOUTHTML.projects.main}"><span style="${C.HANDOUTHTML.projects.goal}">`
                if (parseInt(projectData.projectscope) > 0)
                    thisSection += `${"●".repeat(parseInt(projectData.projectscope))} `
                if (projectData.projectscope_name && projectData.projectscope_name.length > 2)
                    thisSection += projectData.projectscope_name
                thisSection += "</span>"
                if (projectData.projectgoal && projectData.projectgoal.length > 2)
                    thisSection += `<span style="${C.HANDOUTHTML.projects.tag}">HOOK:</span><span style="${C.HANDOUTHTML.projects.hook}">${projectData.projectgoal}</span>`
                if (projectData.projectdetails && projectData.projectdetails.length > 2)
                    thisSection += `<span style="${C.HANDOUTHTML.smallNote}">${projectData.projectdetails}</span>`
                if (projectData.projectforcedstake1_name && projectData.projectforcedstake1_name.length > 2) 
                    thisSection += `<span style="${C.HANDOUTHTML.projects.tag} color: #990000;">FORCED:</span><span style="${C.HANDOUTHTML.projects.forcedStake}">${projectData.projectforcedstake1_name} ${"●".repeat(parseInt(projectData.projectforcedstake1) || 0)}</span>`
                if ((parseInt(projectData.projectteamwork1)||0) + (parseInt(projectData.projectteamwork2)||0) + (parseInt(projectData.projectteamwork3)||0) > 0)
                    thisSection += `<span style="${C.HANDOUTHTML.projects.tag} color: #0000FF;">TEAMWORK:</span><span style="${C.HANDOUTHTML.projects.teamwork}">${"●".repeat((parseInt(projectData.projectteamwork1)||0) + (parseInt(projectData.projectteamwork2)||0) + (parseInt(projectData.projectteamwork3)||0) || 0)}</span>`
                if (projectData.projectlaunchresults && projectData.projectlaunchresults.length > 2)
                    thisSection += `<span style="${projectData.projectlaunchresults.includes("CRITICAL") ? C.HANDOUTHTML.projects.critSucc : C.HANDOUTHTML.projects.succ}">${projectData.projectlaunchresults.includes("CRITICAL") ? "CRITICAL" : `Success (+${projectData.projectlaunchresultsmargin})`}</span>`
                else
                    thisSection += `<span style="${C.HANDOUTHTML.projects.succ}"></span>`
                if (projectData.projectenddate) 
                    thisSection += `<span style="${C.HANDOUTHTML.projects.endDate}">Ends ${projectData.projectenddate.toUpperCase()}</span>${parseInt(projectData.projectinccounter) > 0 ? `<br><span style="${C.HANDOUTHTML.projects.daysLeft}">${parseInt(projectData.projectincnum) * parseInt(projectData.projectinccounter)} ${projectData.projectincunits} left)</span>` : ""}`
					//thisSection += `<span style="display: block;">CUR: ${JSON.stringify(TimeTracker.CurrentDate())}, END: ${JSON.stringify(TimeTracker.ParseDate(projectData.projectenddate))}, BOOL: ${Boolean(TimeTracker.ParseDate(projectData.projectenddate) < TimeTracker.CurrentDate())}`
				
                let stakeCheck = false
                for (const stakeVar of ["projectstake1_name", "projectstake1", "projectstake2_name", "projectstake2", "projectstake3_name", "projectstake3"])
                    if (projectData[stakeVar] && (!_.isNaN(parseInt(projectData[stakeVar])) && parseInt(projectData[stakeVar]) > 0 || projectData[stakeVar].length > 2)) 
                        stakeCheck = true
						//thisSection += `<span style="display: block;">${stakeVar} Triggered Table: Number = ${parseInt(projectData[stakeVar])}, String = ${projectData[stakeVar]}</span>`
											
                if (stakeCheck) {
                    thisSection += `<span style="${C.HANDOUTHTML.projects.tag}">STAKED:</span><span style="${C.HANDOUTHTML.projects.stake}">`
                    let stakeStrings = []
                    for (let i = 1; i <= 3; i++) {
                        const [attr, val] = [projectData[`projectstake${i}_name`], parseInt(projectData[`projectstake${i}`])]
                        if (attr && attr.length > 2 && !_.isNaN(val))
                            stakeStrings.push(`${attr} ${"●".repeat(val)}`)
                    }
                    thisSection += `${stakeStrings.join(", ")}</span>`
                }
                thisSection += "</div>"
                if (thisSection === `<div style="${C.HANDOUTHTML.projects.main}"><span style="${C.HANDOUTHTML.projects.goal}"></span>`)
                    continue
                thisCharSec += thisSection
            }
            if (thisCharSec === `<span style="${C.HANDOUTHTML.projects.charName}">${D.GetName(char).toUpperCase()}</span>`)
                continue
            noteSections.push(thisCharSec)
        }
        //noteObj.set("notes", "This works!")
        noteObj.set("notes", `<div style="${C.HANDOUTHTML.projects.main}">${noteSections.join("<br>")}</div>`)
        return noteObj
    }
    // #endregion

    // #region Event Handlers (handleInput)
    const handleInput = msg => {
        if (msg.type !== "api" || !playerIsGM(msg.playerid))
            return
        /* API chat command parameters can contain spaces, but multiple parameters must be comma-delimited.
                e.g. "!test subcommand1 subcommand2 param1 with spaces, param2,param3" */
        const [command, ...args] = msg.content.split(/\s+/u),
            getParams = argArray => _.map(argArray.join(" ").replace(/\\,/gu, "@@@").split(","), v => v.trim().replace(/@@@/gu, ","))
        let params = []
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

        Make: makeHandoutObj
    }
} )()

on("ready", () => {
    Handouts.RegisterEventHandlers()
    Handouts.CheckInstall()
    D.Log("Handouts Ready!")
} )
void MarkStop("Handouts")