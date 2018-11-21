const TimeTracker = (() => {
	// #region Configuration
	const IMAGES = {
			day: "https://s3.amazonaws.com/files.d20.io/images/66268397/qtmx8f4z8jcvK2sEGaxl5A/thumb.jpg?1541330279",
			night: "https://s3.amazonaws.com/files.d20.io/images/66268396/ZI7kzQ3i8TH9dANaYBDPlA/thumb.jpg?1541330279",
			latenight: "https://s3.amazonaws.com/files.d20.io/images/66268394/y4ITk2QTo_ifYKZWhTXiGg/thumb.jpg?1541330278",
			predawn: [
				"https://s3.amazonaws.com/files.d20.io/images/66268399/ZCbXqDFScIhdXGwoWq8C8g/thumb.jpg?1541330279",
				"https://s3.amazonaws.com/files.d20.io/images/66268393/a3N45dEewo9234IcrNQh2Q/thumb.jpg?1541330279",
				"https://s3.amazonaws.com/files.d20.io/images/66268395/65zluFmgkw_5V2WXanLaqQ/thumb.jpg?1541330280",
				"https://s3.amazonaws.com/files.d20.io/images/66268398/_mHzoQDP6323ZTWApHnjsw/thumb.jpg?1541330279",
				"https://s3.amazonaws.com/files.d20.io/images/66268400/F5YhSKEOvgAV8ZF2HpdHUQ/thumb.jpg?1541330280"
			],
			dawn: "https://s3.amazonaws.com/files.d20.io/images/66268397/qtmx8f4z8jcvK2sEGaxl5A/thumb.jpg?1541330279"
		},
	 DAYSOFWEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	 MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	 NIGHT = [
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
	 HORIZONS = {
			latenight: "1:00",
			predawn: [-90, -60, -30, -15, -5]
		},
		// #endregion

		// #region Date Functions
		setHorizon = function (date, horizon) {
			const nighttime = _.map(NIGHT[date.getMonth()], v => [parseInt(v.split(":")[0] ), parseInt(v.split(":")[1] )] ),
			 dawn = new Date((new Date(date)).setUTCHours(nighttime[0][0], nighttime[0][1] )),
			 dusk = new Date((new Date(date)).setUTCHours(nighttime[1][0], nighttime[1][1] )),
			 lateNight = new Date((new Date(date)).setUTCHours(
				 parseInt(HORIZONS.latenight.split(":")[0] ),
				 parseInt(HORIZONS.latenight.split(":")[1] )
				 ))
			if (date.getUTCHours() > 10)
				dawn.setUTCDate(date.getUTCDate() + 1)
			if (date.getUTCHours() < 14 && lateNight.getUTCHours() > 14)
				lateNight.setUTCDate(date.getUTCDate() - 1)
			if (date.getUTCHours() > 14 && lateNight.getUTCHours() < 14)
				lateNight.setUTCDate(date.getUTCDate() + 1)
			if (date.getUTCHours() < 14)
				dusk.setUTCDate(date.getUTCDate() - 1)
			// D.Log("DAWN: " + D.JSL(dawn) + "<br>DUSK: " + D.JSL(dusk) + "<br>LATE: " + D.JSL(lateNight) + "<br>PREDAWN[0]: " + D.JSL(new Date(new Date(dawn).setUTCMinutes(dawn.getUTCMinutes() + HORIZONS.predawn[0]))) + "<br><br>CURRENT: " + D.JSL(date), "TIMETRACKER: SETHORIZON()");
			if (date < dusk || date > dawn) {
				horizon.set("imgsrc", IMAGES.day)
			} else if (date < lateNight) {
				horizon.set("imgsrc", IMAGES.night)
			} else if (date < new Date(dawn).setUTCMinutes(dawn.getUTCMinutes() + HORIZONS.predawn[0] )) {
				horizon.set("imgsrc", IMAGES.latenight)
			} else {
				for (let i = HORIZONS.predawn.length; i > 0; i--) {
					if (date >= new Date(dawn).setUTCMinutes(dawn.getUTCMinutes() + HORIZONS.predawn[i - 1] )) {
						horizon.set("imgsrc", IMAGES.predawn[i - 1] )
						break
					}
				}
			}
		},

	 setCurrentDate = function (date, tracker, horizon) {
			tracker.set("text", `${DAYSOFWEEK[date.getUTCDay()]}, ${
				MONTHS[date.getMonth()]} ${
				D.Ordinalize(date.getUTCDate())}, ${
				(date.getUTCHours() % 12).toString().replace(/^0:/gu, "")}:${
				date.getUTCMinutes() < 10 ? "0" : ""}${date.getUTCMinutes().toString()} ${
				Math.floor(date.getUTCHours() / 12) === 0 ? "AM" : "PM"}`)
			const lastDate = new Date(parseInt(state[D.GAMENAME].TimeTracker.currentDate))
			state[D.GAMENAME].TimeTracker.currentDate = date.getTime().toString()
			if (
				date.getUTCFullYear() !== lastDate.getUTCFullYear() ||
      date.getMonth() !== lastDate.getMonth() ||
      date.getUTCDate() !== lastDate.getUTCDate()
			)
				_.each(D.GetChars("registered"), char => setAttrs(char.id, {todaysdate: date.getTime().toString()} ))
			setHorizon(date, horizon)
		},
		// #endregion

		// #region Event Handlers (handleInput)
		handleInput = function (msg) {
			if (msg.type !== "api" || !playerIsGM(msg.playerid))
				return
			const args = msg.content.split(/\s+/u),
				currentDate = state[D.GAMENAME].TimeTracker.currentDate
			let [tracker, horizon, params] = [[], [], []],
				[date, delta, unit] = [null, null, null]
			switch (args.shift().toLowerCase()) {
			case "!time":
				if (!state[D.GAMENAME].TimeTracker.timeText) {
					D.Alert("Register a text object first, with '!reg time'", "TIMETRACKER")
					break
				} else if (!state[D.GAMENAME].TimeTracker.horizonImage) {
					D.Alert("Register an image object first, with '!reg horizon'", "TIMETRACKER")
					break
				}
				tracker = findObjs( {_id: state[D.GAMENAME].TimeTracker.timeText} )[0]
				horizon = findObjs( {_id: state[D.GAMENAME].TimeTracker.horizonImage} )[0]
				params = args.slice(1).join(" ")
					.toUpperCase()
				switch (args.shift().toLowerCase()) {
				case "add":
					params = _.compact(params.split(" "))
					date = new Date(parseInt(currentDate))
					delta = parseInt(params.shift())
					unit = params.shift().toLowerCase()
					if (unit.slice(0, 1) === "y")
						date.setUTCFullYear(date.getUTCFullYear() + delta)
					else if (unit.includes("mo"))
						date.setUTCMonth(date.getMonth() + delta)
					else if (unit.slice(0, 1) === "w")
						date.setUTCDate(date.getUTCDate() + 7 * delta)
					else if (unit.slice(0, 1) === "d")
						date.setUTCDate(date.getUTCDate() + delta)
					else if (unit.slice(0, 1) === "h")
						date.setUTCHours(date.getUTCHours() + delta)
					else if (unit.includes("m"))
						date.setUTCMinutes(date.getUTCMinutes() + delta)
					break
				case "set": //   !time set 2018-07-09T01:12
					date = new Date(params)
					break
				default:
					D.ThrowError("Commands are 'add' and 'set'.")

					return
				}
				setCurrentDate(date, tracker, horizon)
				break
			case "!reg":
				if (!msg.selected || !msg.selected[0] ) {
					D.ThrowError("Select an object, then '!reg <time/horizon>'.")
				} else {
					switch (args.shift().toLowerCase()) {
					case "time":
						state[D.GAMENAME].TimeTracker.timeText = msg.selected[0]._id
						break
					case "horiz":
					case "horizon":
					case "hor":
						state[D.GAMENAME].TimeTracker.horizonImage = msg.selected[0]._id
						break
					default:
						break
					}
				}
				break
			default:
				break
			}
		},

		// #endregion

		// #region Public Functions: regHandlers, tapSpite
	 regHandlers = function () {
			on("chat:message", handleInput)
		},

	 checkInstall = function () {
			state[D.GAMENAME] = state[D.GAMENAME] || {}
			state[D.GAMENAME].TimeTracker = state[D.GAMENAME].TimeTracker || {}
		}

	return {
		RegisterEventHandlers: regHandlers,
		CheckInstall: checkInstall
	}
	// #endregion
} )()

on("ready", () => {
	TimeTracker.RegisterEventHandlers()
	TimeTracker.CheckInstall()
	D.Log("Ready!", "TimeTracker")
} )