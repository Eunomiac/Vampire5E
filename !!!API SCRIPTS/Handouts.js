void MarkStart("Handouts")
const Handouts = (() => {	
    // #region INITIALIZATION
    const SCRIPTNAME = "Handouts",
		    STATEREF = C.ROOT[SCRIPTNAME]	// eslint-disable-line no-unused-vars
    const VAL = (varList, funcName) => D.Validate(varList, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
		   DB = (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME) // eslint-disable-line no-unused-vars
    // #endregion

    // #region Configuration
    const HTMLStyle = {
        divwrapper: "display: block; width: 600px;",
        charName: "display: block; width: 600px; font-size: 32px; color: rgb(99,00,00); font-family: Voltaire; font-variant: small-caps;",
        projectGoal: "display: block; width: 600px; height: 24px; background-color: rgb( 206 , 198 , 206 ); font-size: 16px; color: black; font-family: 'Alice Regular'; font-weight: bold; font-variant: small-caps; border-bottom: 1px solid black; border-top: 1px solid black;",
        smallNote: "display:block; width: 580px; font-size: 10px; font-family: Goudy; margin-left: 20px;",
        subheader: "display:inline-block; width: 60px; font-size: 14px; color: black; font-family: Voltaire; font-variant: small-caps; font-weight: bold; text-align: right; margin-right: 10px;",
        projectScope: "display:inline-block; width: 530px; font-size: 12px; color: black; font-family: 'Alice Regular'; vertical-align: top; padding-top: 2px;",
        critSucc: "display: inline-block; width: 300px; font-size: 20px; color: purple; font-family: Voltaire; font-weight: bold;",
        succ: "display: inline-block; width: 300px; font-size: 20px; color: black; font-family: goodfish; font-weight: bold;",
        endDate: "display: inline-block; width: 300px; font-size: 20px; color: black; font-family: Voltaire; font-weight: bold; text-align: right;",
        daysleft: "display: inline-block; width: 600px; font-size: 14px; color: black; font-family: 'Alice Regular'; font-style: italic; text-align: right;",
        projectStake: "display: inline-block; width: 530px; font-family: 'Alice Regular';",
        forcedStake: "display: inline-block; width: 530px; font-family: 'Alice Regular'; color: #990000; font-weight: bold;",
        teamwork: "display: inline-block; width: 530px; font-family: 'Alice Regular'; color: blue; font-weight: bold;"
    }
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
    const makeHandoutObj = (title, category) => {
        if (category)
            STATEREF.noteCounts[category] = STATEREF.noteCounts[category] ? STATEREF.noteCounts[category] + 1 : 1
        const noteObj = createObj("handout", {name: title})
        return noteObj		
    }
    // #endregion

    // #region PROJECT SUMMARIES

    const summarizeProjects = (title, charObjs) => {
        const noteObj = makeHandoutObj(title, "projects"),
            noteSections = []
        for (const char of charObjs) {
            let thisCharSec = `<span style="${HTMLStyle.charName}">${D.GetName(char).toUpperCase()}</span>`
            for (let projectData of getProjectData(char)) {
                //D.Alert(D.JS(projectData), "Project Data")
                /* for (const item of ["projectdetails", "projectgoal", "projectstartdate", "projectincnum", "projectincunit", "projectenddate", "projectinccounter", "projectscope_name", "projectscope", ]) {
					projectData[item] = projectData[item] || ""
				} */
                if (projectData.projectenddate && TimeTracker.ParseDate(projectData.projectenddate) < TimeTracker.CurrentDate())
                    continue
                let thisSection = `<div style="${HTMLStyle.divwrapper}"><span style="${HTMLStyle.projectGoal}">`
                if (parseInt(projectData.projectscope) > 0)
                    thisSection += `${"●".repeat(parseInt(projectData.projectscope))} `
                if (projectData.projectscope_name && projectData.projectscope_name.length > 2)
                    thisSection += projectData.projectscope_name
                thisSection += "</span>"
                if (projectData.projectgoal && projectData.projectgoal.length > 2)
                    thisSection += `<span style="${HTMLStyle.subheader}">HOOK:</span><span style="${HTMLStyle.projectScope}">${projectData.projectgoal}</span>`
                if (projectData.projectdetails && projectData.projectdetails.length > 2)
                    thisSection += `<span style="${HTMLStyle.smallNote}">${projectData.projectdetails}</span>`
                if (projectData.projectforcedstake1_name && projectData.projectforcedstake1_name.length > 2) 
                    thisSection += `<span style="${HTMLStyle.subheader} color: #990000;">FORCED:</span><span style="${HTMLStyle.forcedStake}">${projectData.projectforcedstake1_name} ${"●".repeat(parseInt(projectData.projectforcedstake1) || 0)}</span>`
                if ((parseInt(projectData.projectteamwork1)||0) + (parseInt(projectData.projectteamwork2)||0) + (parseInt(projectData.projectteamwork3)||0) > 0)
                    thisSection += `<span style="${HTMLStyle.subheader} color: #0000FF;">TEAMWORK:</span><span style="${HTMLStyle.teamwork}">${"●".repeat((parseInt(projectData.projectteamwork1)||0) + (parseInt(projectData.projectteamwork2)||0) + (parseInt(projectData.projectteamwork3)||0) || 0)}</span>`
                if (projectData.projectlaunchresults && projectData.projectlaunchresults.length > 2)
                    thisSection += `<span style="${projectData.projectlaunchresults.includes("CRITICAL") ? HTMLStyle.critSucc : HTMLStyle.succ}">${projectData.projectlaunchresults.includes("CRITICAL") ? "CRITICAL" : `Success (+${projectData.projectlaunchresultsmargin})`}</span>`
                else
                    thisSection += `<span style="${HTMLStyle.succ}"></span>`
                if (projectData.projectenddate) 
                    thisSection += `<span style="${HTMLStyle.endDate}">Ends ${projectData.projectenddate.toUpperCase()}</span>${parseInt(projectData.projectinccounter) > 0 ? `<br><span style="${HTMLStyle.daysleft}">${parseInt(projectData.projectincnum) * parseInt(projectData.projectinccounter)} ${projectData.projectincunits} left)</span>` : ""}`
					//thisSection += `<span style="display: block;">CUR: ${JSON.stringify(TimeTracker.CurrentDate())}, END: ${JSON.stringify(TimeTracker.ParseDate(projectData.projectenddate))}, BOOL: ${Boolean(TimeTracker.ParseDate(projectData.projectenddate) < TimeTracker.CurrentDate())}`
				
                let stakeCheck = false
                for (const stakeVar of ["projectstake1_name", "projectstake1", "projectstake2_name", "projectstake2", "projectstake3_name", "projectstake3"])
                    if (projectData[stakeVar] && (!_.isNaN(parseInt(projectData[stakeVar])) && parseInt(projectData[stakeVar]) > 0 || projectData[stakeVar].length > 2)) 
                        stakeCheck = true
						//thisSection += `<span style="display: block;">${stakeVar} Triggered Table: Number = ${parseInt(projectData[stakeVar])}, String = ${projectData[stakeVar]}</span>`
											
                if (stakeCheck) {
                    thisSection += `<span style="${HTMLStyle.subheader}">STAKED:</span><span style="${HTMLStyle.projectStake}">`
                    let stakeStrings = []
                    for (let i = 1; i <= 3; i++) {
                        const [attr, val] = [projectData[`projectstake${i}_name`], parseInt(projectData[`projectstake${i}`])]
                        if (attr && attr.length > 2 && !_.isNaN(val))
                            stakeStrings.push(`${attr} ${"●".repeat(val)}`)
                    }
                    thisSection += `${stakeStrings.join(", ")}</span>`
                }
                thisSection += "</div>"
                if (thisSection === `<div style="${HTMLStyle.divwrapper}"><span style="${HTMLStyle.projectGoal}"></span>`)
                    continue
                thisCharSec += thisSection
            }
            if (thisCharSec === `<span style="${HTMLStyle.charName}">${D.GetName(char).toUpperCase()}</span>`)
                continue
            noteSections.push(thisCharSec)
        }
        //noteObj.set("notes", "This works!")
        noteObj.set("notes", `<div style="${HTMLStyle.divwrapper}">${noteSections.join("<br>")}</div>`)
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
        CheckInstall: checkInstall
    }
} )()

on("ready", () => {
    Handouts.RegisterEventHandlers()
    Handouts.CheckInstall()
    D.Log("Ready!", "Handouts")
} )
void MarkStop("Handouts")