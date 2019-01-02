const TimeTracker = (() => {
	let timeTimer = null
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
		setHorizon = (date, horizon) => {
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
			// D.Alert(`DAWN: ${D.JSL(dawn)}<br>DUSK: ${D.JSL(dusk)}<br>LATE: ${D.JSL(lateNight)}<br>PREDAWN[0]: ${D.JSL(new Date(new Date(dawn).setUTCMinutes(dawn.getUTCMinutes() + HORIZONS.predawn[0] )))}<br><br>CURRENT: ${D.JSL(date)}`, "TIMETRACKER: SETHORIZON()")
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
		setCurrentDate = (date, tracker, horizon) => {
			tracker.set("text", `${
				DAYSOFWEEK[date.getUTCDay()]}, ${
				MONTHS[date.getUTCMonth()]} ${
				D.Ordinal(date.getUTCDate())}, ${
				(date.getUTCHours() % 12).toString().replace(/^0/gu, "12")}:${
				date.getUTCMinutes() < 10 ? "0" : ""}${date.getUTCMinutes().toString()} ${
				Math.floor(date.getUTCHours() / 12) === 0 ? "AM" : "PM"}`)
			const lastDate = new Date(parseInt(state[D.GAMENAME].TimeTracker.currentDate))
			D.Log(`Last Date: ${D.JSL(lastDate)}`)
			state[D.GAMENAME].TimeTracker.currentDate = date.getTime().toString()
			D.Log(`New Date: ${D.JSL(lastDate)}`)
			if (
				date.getUTCFullYear() !== lastDate.getUTCFullYear() ||
				date.getMonth() !== lastDate.getMonth() ||
				date.getUTCDate() !== lastDate.getUTCDate()
			) {
				D.Log(`Chars Received: ${D.GetChars("registered").length}`)
				_.each(D.GetChars("registered"), char => setAttrs(char.id, {
					date_today: date.getTime().toString()
				} ))
			}
			setHorizon(date, horizon)
		},
		tickClock = (date, tracker, horizon) => {
			date.setUTCMinutes(date.getUTCMinutes() + 1)
			setCurrentDate(date, tracker, horizon)
		},
		// #endregion

		// #region Event Handlers (handleInput)
		handleInput = msg => {
			if (msg.type !== "api" || !playerIsGM(msg.playerid))
				return
			const args = msg.content.split(/\s+/u),
				{
					currentDate
				} = state[D.GAMENAME].TimeTracker
			let [tracker, horizon] = [
					[],
					[],
					[]
				],
				[date, delta, unit, hour, min] = [null, null, null, null, null]
			switch (args.shift().toLowerCase()) {
			case "!time":
				if (!state[D.GAMENAME].TimeTracker.timeText) {
					D.Alert("Register a text object first, with '!regTime'", "TIMETRACKER")
					break
				} else if (!state[D.GAMENAME].TimeTracker.horizonImage) {
					D.Alert("Register an image object first, with '!regHorizon'", "TIMETRACKER")
					break
				}
				[tracker] = findObjs( {
					_id: state[D.GAMENAME].TimeTracker.timeText
				} );
				[horizon] = findObjs( {
					_id: state[D.GAMENAME].TimeTracker.horizonImage
				} )
				date = new Date(parseInt(currentDate))
				// params = args.slice(1).join(" ").toUpperCase()
				switch (args.shift().toLowerCase()) {
				case "add":
					delta = parseInt(args.shift())
					unit = args.shift().toLowerCase()
					// params = _.compact(args.join(" ").split(" "))
					if (unit.slice(0, 1) === "y")
						date.setUTCFullYear(date.getUTCFullYear() + delta)
					else if (unit.includes("mo"))
						date.setUTCMonth(date.getUTCMonth() + delta)
					else if (unit.slice(0, 1) === "w")
						date.setUTCDate(date.getUTCDate() + 7 * delta)
					else if (unit.slice(0, 1) === "d")
						date.setUTCDate(date.getUTCDate() + delta)
					else if (unit.slice(0, 1) === "h")
						date.setUTCHours(date.getUTCHours() + delta)
					else if (unit.includes("m"))
						date.setUTCMinutes(date.getUTCMinutes() + delta)
					break
				case "set": //   !time set 2018-07-14T20:12
					if (args.length === 4) {
						date.setUTCFullYear(parseInt(args.shift()))
						date.setUTCMonth(parseInt(args.shift()) - 1)
						date.setUTCDate(parseInt(args.shift()));
						[hour, min] = args.shift().split(":")
						date.setUTCHours(parseInt(hour))
						date.setUTCMinutes(parseInt(min))
						D.Alert(`Date set to ${D.JSL(date.toString())}`)
					} else {
						D.Alert("Syntax: !time set year month1-12 day 24-hour:min", "TIMETRACKER !SET")
					}
					break
				case "run": // Sets time to slowly move forward in real time.
					clearInterval(timeTimer)
					timeTimer = setInterval(tickClock, (parseInt(args.shift()) || 60) * 1000, date, tracker, horizon)
					D.Alert(`Auto clock ticking ENABLED at:<br><br>!time set ${date.getUTCFullYear()} ${date.getUTCMonth() + 1} ${date.getUTCDate()} ${date.getUTCHours()}:${date.getUTCMinutes()}`, "TIMETRACKER !TIME")
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
				setCurrentDate(date, tracker, horizon)
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
			state[D.GAMENAME].TimeTracker = state[D.GAMENAME].TimeTracker || {}
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