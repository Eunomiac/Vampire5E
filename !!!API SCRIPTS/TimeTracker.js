const TimeTracker = (() => {
	let [timeTimer, dateObj, trackerObj] = [null, null, null],
		[isRunning, isRunningFast] = [false, false]
	// #region Configuration
	const CLOCKSPEED = 50,
		TWEENDURS = [15, 40, 60, 600, 1440, 3000, 5000, 7000, 8000, 9000, 10000, Infinity],
		RUNNINGFASTAT = 1500000,
		DAYSOFWEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		TWILIGHT = [
			["7:44", "17:12"],
			["7:11", "17:51"],
			["7:22", "19:28"],
			["6:26", "20:06"],
			["5:48", "20:40"],
			["5:35", "21:01"],
			["5:54", "20:52"],
			["5:48", "20:40"],
			["6:26", "20:06"],
			["7:22", "19:28"],
			["7:11", "17:51"],
			["7:44", "17:12"]
		],
		IMAGETIMES = {
			"2:00": "night3",
			"3:30": "night4",
			[-90]: "night5",
			[-60]: "predawn5",
			[-30]: "predawn4",
			[-15]: "predawn3",
			[-5]: "predawn2",
			"dawn": "predawn1",
			"dusk": "day",
			"21:30": "night1",
			"23:00": "night2",
			"24:00": "night3"
		},
		// #endregion

		// #region Derivative Stats
		TWILIGHTMINS = _.map(TWILIGHT, v => _.map(v, v2 => 60 * parseInt(v2.split(":")[0] ) + parseInt(v2.split(":")[1] ))),
		// #endregion

		// #region Date Functions
		setHorizon = () => {
			/* D.Log(`Date Obj? ${Boolean(dateObj)}, state val: ${D.JSL(state[D.GAMENAME].TimeTracker.currentDate)}`)
			   dateObj = dateObj || new Date(state[D.GAMENAME].TimeTracker.currentDate) */
			let imgSrcName = ""
			// D.Log(`DATE OBJECT: ${D.JSL(dateObj)}`)
			const [dawn, dusk] = TWILIGHTMINS[dateObj.getMonth()],
				imgTimes = _.object(_.map(_.keys(IMAGETIMES), k => {
					if (k.includes(":"))
						return 60 * parseInt(k.split(":")[0] ) + parseInt(k.split(":")[1] )
					else if (k === "dawn")
						return dawn
					else if (k === "dusk")
						return dusk

					return dawn + parseInt(k)
				} ), _.values(IMAGETIMES)),
				curTime = 60 * dateObj.getUTCHours() + dateObj.getUTCMinutes()
			imgSrcName = imgTimes[_.find(_.keys(imgTimes), v => curTime <= v)]
			if (isRunningFast)
				imgSrcName = imgSrcName.includes("night") ? "night2" : "day"
			if (imgSrcName !== state[D.GAMENAME].TimeTracker.lastHorizon) {
				state[D.GAMENAME].TimeTracker.lastHorizon = imgSrcName
				Images.Set("Horizon", imgSrcName)
			}
		},
		setCurrentDate = () => {
			// dateObj = dateObj || new Date(parseInt(state[D.GAMENAME].TimeTracker.currentDate))
			trackerObj.set("text", `${
				DAYSOFWEEK[dateObj.getUTCDay()]}, ${
				MONTHS[dateObj.getUTCMonth()]} ${
				D.Ordinal(dateObj.getUTCDate())}, ${
				(dateObj.getUTCHours() % 12).toString().replace(/^0/gu, "12")}:${
				dateObj.getUTCMinutes() < 10 ? "0" : ""}${dateObj.getUTCMinutes().toString()} ${
				Math.floor(dateObj.getUTCHours() / 12) === 0 ? "AM" : "PM"}`)
			if (!isRunning) {
				const lastDate = new Date(parseInt(state[D.GAMENAME].TimeTracker.currentDate))
				state[D.GAMENAME].TimeTracker.currentDate = dateObj.getTime()
				if (
					dateObj.getUTCFullYear() !== lastDate.getUTCFullYear() ||
					dateObj.getMonth() !== lastDate.getMonth() ||
					dateObj.getUTCDate() !== lastDate.getUTCDate()
				) {
					_.each(D.GetChars("registered"), char => setAttrs(char.id, {
						date_today: dateObj.getTime().toString()
					} ))
				}
			}
			setHorizon()
		},
		easeInOutSine = (curTime, startVal, deltaVal, duration) => -deltaVal / 2 *
			(Math.cos(Math.PI * curTime / duration) - 1) +
			startVal,
		// eslint-disable-next-line no-unused-vars
		easeInOutQuad = (curTime, startVal, deltaVal, duration) => {
			let cTime = curTime
			cTime /= duration / 2
			if (cTime < 1)
				return deltaVal / 2 * cTime * cTime + startVal
			cTime--

			return -deltaVal / 2 * (cTime * (cTime - 2) - 1) + startVal
		},
		tweenClock = finalDate => {
			let [curTime, lastTime] = [0, 0]
			const deltaTime = finalDate - dateObj,
				duration = (_.findIndex(TWEENDURS, v => deltaTime / 60000 <= v) + 1) * 1000,
				startTime = dateObj.getTime(),
				easeSet = () => {
					if (curTime >= duration) {
						clearInterval(timeTimer)
						isRunning = false
						isRunningFast = false
						// D.Log("Is Running: FALSE")
					}
					const newDelta = easeInOutSine(curTime, 0, deltaTime, duration)
					isRunningFast = newDelta - lastTime > RUNNINGFASTAT
					// D.Log(`Setting Date.  lastTime = ${newDelta - lastTime}, IsRunning = ${isRunning}, IsRunningFast = ${isRunningFast}`)
					lastTime = newDelta
					dateObj.setTime(startTime + newDelta)
					setCurrentDate()
					curTime += CLOCKSPEED
				}
			isRunning = true
			timeTimer = setInterval(easeSet, CLOCKSPEED)
		},
		tickClock = () => {
			dateObj.setUTCMinutes(dateObj.getUTCMinutes() + 1)
			setCurrentDate()
		},
		// #endregion

		// #region Event Handlers (handleInput)
		handleInput = msg => {
			if (msg.type !== "api" || !playerIsGM(msg.playerid))
				return
			const args = msg.content.split(/\s+/u)
			let [date2, delta, unit, hour, min] = [null, null, null, null, null]
			switch (args.shift().toLowerCase()) {
			case "!time":
				if (!state[D.GAMENAME].TimeTracker.timeText) {
					D.Alert("Register a text object first, with '!regTime'", "TIMETRACKER")
					break
				} else if (!Images.GetData("Horizon")) {
					D.Alert("Register an image object first, with '!img reg Horizon'", "TIMETRACKER")
					break
				}

				/* dateObj = dateObj || new Date(state[D.GAMENAME].TimeTracker.currentDate)
				   params = args.slice(1).join(" ").toUpperCase() */
				switch (args.shift().toLowerCase()) {
				case "add":
					delta = parseInt(args.shift())
					unit = args.shift().toLowerCase()
					date2 = new Date(dateObj)
					// params = _.compact(args.join(" ").split(" "))
					if (unit.slice(0, 1) === "y")
						date2.setUTCFullYear(date2.getUTCFullYear() + delta)
					else if (unit.includes("mo"))
						date2.setUTCMonth(date2.getUTCMonth() + delta)
					else if (unit.slice(0, 1) === "w")
						date2.setUTCDate(date2.getUTCDate() + 7 * delta)
					else if (unit.slice(0, 1) === "d")
						date2.setUTCDate(date2.getUTCDate() + delta)
					else if (unit.slice(0, 1) === "h")
						date2.setUTCHours(date2.getUTCHours() + delta)
					else if (unit.includes("m"))
						date2.setUTCMinutes(date2.getUTCMinutes() + delta)
					tweenClock(date2)

					return
				case "set": //   !time set 2018-07-14T20:12
					if (args.length === 4) {
						dateObj.setUTCFullYear(parseInt(args.shift()))
						dateObj.setUTCMonth(parseInt(args.shift()) - 1)
						dateObj.setUTCDate(parseInt(args.shift()));
						[hour, min] = args.shift().split(":")
						dateObj.setUTCHours(parseInt(hour))
						dateObj.setUTCMinutes(parseInt(min))
						D.Alert(`Date set to ${D.JSL(dateObj.toString())}`)
					} else {
						D.Alert("Syntax: !time set year month1-12 day 24-hour:min", "TIMETRACKER !SET")
					}
					break
				case "run": // Sets time to slowly move forward in real time.
					clearInterval(timeTimer)
					timeTimer = setInterval(tickClock, (parseInt(args.shift()) || 60) * 1000)
					D.Alert(`Auto clock ticking ENABLED at:<br><br>!time set ${dateObj.getUTCFullYear()} ${dateObj.getUTCMonth() + 1} ${dateObj.getUTCDate()} ${dateObj.getUTCHours()}:${dateObj.getUTCMinutes()}`, "TIMETRACKER !TIME")
					break
				case "stop":
					clearInterval(timeTimer)
					timeTimer = null
					D.Alert("Auto clock ticking DISABLED", "TIMETRACKER !TIME")
					break
				default:
					D.ThrowError("Commands are 'add', 'set', 'run' and 'stop'.")

					return
				}
				setCurrentDate()
				break
			case "!regtime":
				if (!msg.selected || !msg.selected[0] ) {
					D.ThrowError("Select an object, then '!regTime / !regHorizon'.")
				} else {
					state[D.GAMENAME].TimeTracker.timeText = msg.selected[0]._id
					D.Alert(`Registered Time Text as: ${D.JS(state[D.GAMENAME].TimeTracker.timeText)}`)
				}
				break
			case "!reghorizon":
				if (!msg.selected || !msg.selected[0] ) {
					D.ThrowError("Select an object, then '!regTime / !regHorizon'.")
				} else {
					state[D.GAMENAME].TimeTracker.horizonImage = msg.selected[0]._id
					D.Alert(`Registered Horizon Image as: ${D.JS(state[D.GAMENAME].TimeTracker.horizonImage)}`)
				}
				break
			default:
				break
			}
		},
		// #endregion

		// #region Public Functions: regHandlers, tapSpite
		regHandlers = () => on("chat:message", handleInput),
		checkInstall = () => {
			state[D.GAMENAME] = state[D.GAMENAME] || {}
			state[D.GAMENAME].TimeTracker = state[D.GAMENAME].TimeTracker || {};
			[trackerObj] = findObjs( {
				_id: state[D.GAMENAME].TimeTracker.timeText
			} )
			dateObj = new Date(state[D.GAMENAME].TimeTracker.currentDate)
		}
	// #endregion

	return {
		RegisterEventHandlers: regHandlers,
		CheckInstall: checkInstall
	}
} )()

on("ready", () => {
	TimeTracker.RegisterEventHandlers()
	TimeTracker.CheckInstall()
	D.Log("Ready!", "TimeTracker")
} )