void MarkStart("Handouts")
const Handouts = (() => {
	// #region Configuration
	const STATEREF = state[D.GAMENAME].Handouts,
		HTMLStyle = {
			divwrapper: "display: block; width: 600px;",
			charName: "display: block; width: 100%; font-size: 32px; color: rgb(99,00,00); font-family: Voltaire; font-variant: small-caps;",
			projectGoal: "display: block; width: 100%; background-color: rgb( 206 , 198 , 206 ); font-size: 16px; color: black; font-family: 'Alice Regular'; font-weight: bold; font-variant: small-caps; border-bottom: 1px solid black; border-top: 1px solid black;",
			smallNote: "display:block; width: 33%; font-size: 10px; font-family: Goudy; margin-left: 20px;",
			subheader: "display:inline-block; width: 10%; font-size: 14px; color: black; font-family: Voltaire; font-variant: small-caps; font-weight: bold; text-align: right; margin-right: 10px;",
			projectScope: "display:inline-block; width: 100%; margin-right: -25%; font-size: 12px; color: black; font-family: 'Alice Regular'; vertical-align: top; padding-top: 2px;",
			critSucc: "display: inline-block; width: 50%; font-size: 20px; color: purple; font-family: Voltaire; font-weight: bold;",
			succ: "display: inline-block; width: 50%; font-size: 20px; color: black; font-family: goodfish; font-weight: bold;",
			endDate: "display: inline-block; width: 50%; font-size: 20px; margin-right: -10%; color: black; font-family: Voltaire; font-weight: bold; text-align: right;",
			daysleft: "display: inline-block; width: 100%; font-size: 14px; color: black; font-family: 'Alice Regular'; font-style: italic; text-align: right;",
			stakeTable: "display: block; border: none;",
			stakeTableHeader: "border: none; padding: 0px 8px; text-align: center; width: 15%; background-color: rgb(206,198,206);",
			stakeTableCell: "border: none; padding: 0px 8px; text-align: center; width: 15%;"
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
			const projAttrs = D.GetRepAttrs(charRef, "project", true),
				projRowIDs = D.GetRepIDs(charRef, "project", true),
				projData = []
			//D.Alert(`Project Attributes: ${D.JS(projAttrs)}`)
			for (const rowID of projRowIDs) {
				let thisData = {
					rowID
				}
				let testData = {
					rowID
				}
				//D.Alert(_.map(projAttrs, (v, k) => D.ParseRepAttr(k).stat))
				for (const attrKey of _.keys(projAttrs)) {
					testData[D.ParseRepAttr(attrKey).stat] = projAttrs[attrKey]
				}
				for (const attrKey of _.filter(_.keys(projAttrs), v => D.ParseRepAttr(v).rowID.toLowerCase().includes(rowID.toLowerCase()))) {
					thisData[D.ParseRepAttr(attrKey).stat] = projAttrs[attrKey]
				}
				//D.Alert(D.JS(testData), "TEST DATA")
				projData.push(thisData)
			}
			return projData
		},
		getNoteContents = (title, charRef) => {
			let contents = ""
			getHandoutObj(title, charRef).get("notes", (note) => { contents = note })
			return contents
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
				for (const item of ["projectdetails", "projectgoal", "projectstartdate", "projectincnum", "projectincunit", "projectenddate", "projectinccounter", "projectscope_name", "projectscope", "projectforcedstake1_name", "projectforcedstake1", "projectteamwork1", "projectteamwork2", "projectteamwork3", "projectlaunchresults", "projecttotalstake", "projectstake1_name", "projectstake1", "projectstake2_name", "projectstake2", "projectstake3_name", "projectstake3"]) {
					projectData[item] = projectData[item] || ""
				}	
				let thisSection = `<div style="${HTMLStyle.divwrapper}">
					<span style="${HTMLStyle.projectGoal}">${projectData.projectgoal}</span>`
				if (projectData.projectdetails && projectData.projectdetails.length > 2)
					thisSection += `
					<span style="${HTMLStyle.smallNote}">(See Project Details)</span>`
				thisSection += `
				<span style="${HTMLStyle.subheader}">SCOPE:<br>${"●".repeat(parseInt(projectData.projectscope) || 0)}</span><span style="${HTMLStyle.projectScope}">${projectData.projectscope_name}</span>
				<span style="${projectData.projectlaunchresults.includes("CRITICAL") ? HTMLStyle.critSucc : HTMLStyle.succ}">${projectData.projectlaunchresults.includes("CRITICAL") ? "CRITICAL" : (projectData.projectlaunchresults !== "" ? `Success (+${projectData.projectlaunchresultsmargin})` : "")}</span>
				<span style="${HTMLStyle.endDate}">Ends ${projectData.projectenddate.toUpperCase()}</span><br>${parseInt(projectData.projectinccounter) > 0 ? (`<span style="${HTMLStyle.daysleft}">${parseInt(projectData.projectincnum) * parseInt(projectData.projectinccounter)} ${projectData.projectincunits} left)</span>`) : ""}
				<table style="${HTMLStyle.stakeTable}">
					<tr>
						<th style="${HTMLStyle.stakeTableHeader}">Trait</th><th style="${HTMLStyle.stakeTableHeader}">Amount</th><th style="${HTMLStyle.stakeTableHeader}">Trait</th><th style="${HTMLStyle.stakeTableHeader}">Amount</th>
					`
				let stakes = []
				if (parseInt(projectData.projectstake1) > 0)
					stakes.push(["stake", projectData.projectstake1_name, parseInt(projectData.projectstake1)|| 0])
				if (parseInt(projectData.projectstake2) > 0)
					stakes.push(["stake", projectData.projectstake2_name, parseInt(projectData.projectstake2)|| 0])
				if (parseInt(projectData.projectstake3) > 0)
					stakes.push(["stake", projectData.projectstake3_name, parseInt(projectData.projectstake3)|| 0])
				if (parseInt(projectData.forcedstake1) > 0)
					stakes.push(["forced", projectData.forcedstake1_name, parseInt(projectData.forcedstake1)|| 0])
				if ((parseInt(projectData.projectteamwork1)||0) + (parseInt(projectData.projectteamwork1)||0) + (parseInt(projectData.projectteamwork1)||0) > 0)
					stakes.push(["teamwork", "Teamwork", (parseInt(projectData.projectteamwork1)||0) + (parseInt(projectData.projectteamwork1)||0) + (parseInt(projectData.projectteamwork1)||0)])
				for (let i = 0; i < stakes.length; i++) {
					if (i % 2 === 0)
						thisSection += `</tr>
						<tr>
						`
					thisSection += `<td style="${HTMLStyle.stakeTableCell}">${stakes[i][1]}</td><td style="${HTMLStyle.stakeTableCell}">${"●".repeat(stakes[i][2])}</td>`
				}
				thisSection += `</tr>
				</table>
				</div>`
				
				thisCharSec += thisSection
			}
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
			switch(args.shift().toLowerCase()) {
			case "get":
				switch(args.shift().toLowerCase()) {
				case "projects":
					summarizeProjects("Project Summary", D.GetChars("registered"))
					break
				case "contents":
					params = getParams(args)
					D.Alert(getNoteContents(params[0]), `HANDOUTS: Getting Note ${D.JS(params[0])}`)
					D.Log(getNoteContents(params[0]))
					D.Alert(D.JS(getNoteContents(params[0])))
					D.Log(D.JSL(getNoteContents(params[0])))					
					D.Alert(D.JSL(getNoteContents(params[0])))
					D.Alert(D.JSH(getNoteContents(params[0])))
					break
				default: break
				}
				break
			default: break
			}
			break
		default: break
		}
	}
	// #endregion

	// #region Public Functions: regHandlers
	const regHandlers = () => {
			on("chat:message", handleInput)
		},
		checkInstall = () => {
			state[D.GAMENAME] = state[D.GAMENAME] || {}
			state[D.GAMENAME].Handouts = state[D.GAMENAME].Handouts || {}
			state[D.GAMENAME].Handouts.noteCounts = state[D.GAMENAME].Handouts.noteCounts || { projects: 0 }
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