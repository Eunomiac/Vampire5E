const Images = (() => {
	// #region CONFIGURATION
	const IMGDATA = {
			   blank: "https://s3.amazonaws.com/files.d20.io/images/63990142/MQ_uNU12WcYYmLUMQcbh0w/thumb.png?1538455511",
			district: {x: 100, y: 100, h: 400, w: 600},
			    site: {x: 100, y: 100, h: 400, w: 600}
		},
		// #endregion

		// #region GETTERS: Image Object & Data Retrieval
		getImageObj = (val, cat) => {
			let [imgObj] = D.GetSelected(val)
			try {
				if ((!imgObj || !imgObj.get("_type") === "graphic") && state[D.GAMENAME].Images.registry[cat] )
					imgObj = getObj("graphic", state[D.GAMENAME].Images.registry[cat].id)
			} catch (errObj) {
				return D.ThrowError(`${D.JSL(errObj)}`, "[ERROR] IMAGES: Get")
			}

			return imgObj
		},

		getImageData = (val, cat) => {
			let imgData = null
			try {
				if (_.isString(val) && state[D.GAMENAME].Images.registry[val] ) {
					imgData = state[D.GAMENAME].Images.registry[val]
				} else if (D.IsObj(val)) {
					const imgObj = (val.selected && D.GetSelected(val)[0] ) || val
					if (imgObj.get("type") !== "graphic")
						return D.ThrowError(`Object '${imgObj}' is not an image object.`, "IMAGES: GetData")
					for (const cats of state[D.GAMENAME].Images.registry[cat] ) {
						if (state[D.GAMENAME].Images.registry[cats].id === imgObj.id)
							imgData = state[D.GAMENAME].Images.registry[cats]
					}
				}
			} catch (errObj) {
				return D.ThrowError(`Cannot locate image with search value '${D.JS(val)}'`, "IMAGES: GetData")
			}

			return imgData
		},
		// #endregion

		// #region SETTERS: Registering & Manipulating Image Objects
		regImage = (imgObj, cat, params = {} ) => {
			const imgSrcs = (params.entries && _.pick(params, v => v.startsWith("http"))) || {}
			state[D.GAMENAME].Images.registry[cat] = {
				id: imgObj.id || state[D.GAMENAME].Images.registry[cat].id,
				category: cat,
				pos: {
					x: params.x || imgObj.get("left") || state[D.GAMENAME].Images.registry[cat].x || (IMGDATA[cat] && IMGDATA[cat].x) || 200,
					y: params.y || imgObj.get("top") || state[D.GAMENAME].Images.registry[cat].y || (IMGDATA[cat] && IMGDATA[cat].y) || 200,
					h: params.h || imgObj.get("height") || state[D.GAMENAME].Images.registry[cat].h || (IMGDATA[cat] && IMGDATA[cat].h) || 100,
					w: params.w || imgObj.get("width") || state[D.GAMENAME].Images.registry[cat].w || (IMGDATA[cat] && IMGDATA[cat].w) || 100
				},
				srcs: (
					imgSrcs.entries ?
						imgSrcs :
						state[D.GAMENAME].Images.registry[cat] && state[D.GAMENAME].Images.registry[cat].srcs
				) || {}
			}
			D.Alert(`Host obj for image category '${D.JS(cat)}' registered: ${D.JS(state[D.GAMENAME].Images.registry[cat] )}`, "IMAGES: regImage")

			return true
		},

		addSrc = (imgVal, cat, name) => {
			try {
				const imgObj = getImageObj(imgVal),
					imgSrc = getImageObj(imgVal).get("imgsrc")
						.replace(/\w*?(?=\.png)/u, "thumb")
				// D.Alert(`Retrieved Image Object (${D.JSL(D.IsObj(imgObj))}): ${D.JSL(imgObj)}`, "IMAGES: addSrc")
				if (imgObj && state[D.GAMENAME].Images.registry[cat] ) {
					state[D.GAMENAME].Images.registry[cat].srcs[name] = imgSrc
					D.Alert(`Image '${D.JS(name)}' added to category '${D.JS(cat)}'.<br><br>Source: ${D.JS(imgSrc)}`)
				}
			} catch (errObj) {
				D.ThrowError(`Bad arguments: ${errObj}`, "IMAGES: addSrc")
			}
		},

		setImage = (cat, imgsrc) => {
			const imgObj = getImageObj( {}, cat)
			imgObj.set("imgsrc", imgsrc)
		},
		// #endregion

		// #region MACRO BUILDING: Building Selection Macros for Images
		buildMacro = (gmID, name, cats) => {
			let action = "!img set ?{Choose Image Category"
			for (const cat of cats) {
				if (state[D.GAMENAME].Images.registry[cat] ) {
					action += `| ${D.Capitalize(cat)}, ?{Choose ${D.Capitalize(cat)}`
					for (const imgName of _.sortBy(_.keys(state[D.GAMENAME].Images.registry[cat].srcs), k => k))
						action += ` &amp;#124;${D.Capitalize(imgName)}&amp;#44; ${D.Capitalize(cat)} ${state[D.GAMENAME].Images.registry[cat].srcs[imgName]}`
					action += ` &amp;#124;-- blank --&amp;#44; ${D.Capitalize(cat)} ${IMGDATA.blank} &amp;#125; `
				} else {
					D.Alert(`Bad Cat: ${D.JSL(cat)}`, "BUILDMACRO ITERATOR")
				}
			}
			action += "}"

			createObj("macro", {
				_playerid: gmID,
				name,
				action,
				visibleto: gmID
			} )
		},
		// #endregion

		// #region Event Handlers (handleInput)
		handleInput = function (msg) {
			if (msg.type !== "api" || !playerIsGM(msg.playerid))
				return

			const args = msg.content.split(/\s+/u)
			let [name, cat, imgObj] = [null, null, null]
			if (args.shift() !== "!img")
				return

			switch (args.shift().toLowerCase()) {
			case "reg":
			case "register":
				imgObj = getImageObj(msg)
				if (imgObj) {
					cat = args.shift()
					if (cat === null)
						D.Alert("Syntax: !img reg <cat> [<params = imgName:imgSrc, imgName : imgSrc>]", "IMAGES, !img reg")
					else
						regImage(imgObj, cat, D.ParseToObj(args.join(" ")))
				} else {
					D.Alert("Select an image object first!", "IMAGES, !img reg")
				}
				break
			case "reset":
				delete state[D.GAMENAME].Images
				Images.CheckInstall()
				break
			case "add":
			case "addsrc":
				cat = args.shift()
				name = args.shift()
				addSrc(msg, cat, name)
				break
			case "set":
				cat = args.shift()
				setImage(cat, args.shift())
				break
			case "macro":
				name = args.shift()
				cat = args.join(" ").split(/,\s*?/gu)
				buildMacro(msg.playerid, name, cat)
				break
			case "getData":
				imgObj = getImageObj(msg)
				if (imgObj) {
					D.Alert(getImageData(imgObj), "IMAGES, !img getData")
				} else {
					name = args.shift()
					if (name && state[D.GAMENAME].Images.registry[name] )
						D.Alert(D.JS(state[D.GAMENAME].Images.registry[name] ), `IMAGES: '${D.JS(name)}'`)
					else
						D.Alert("Syntax: !img get [<category> <name>] (or select an image object)", "IMAGES, !img getData")
				}
				break
			default:
				break
			}
		},
		// #endregion

		// #region Public Functions: RegisterEventHandlers
		regHandlers = function () {
			on("chat:message", handleInput)
		},

		checkInstall = () => {
			state[D.GAMENAME].Images = state[D.GAMENAME].Images || {}
			state[D.GAMENAME].Images.registry = state[D.GAMENAME].Images.registry || {}
		}
	// #endregion

	return {
		RegisterEventHandlers: regHandlers,
		CheckInstall: checkInstall,
		Get: getImageObj,
		GetData: getImageData
	}
} )()

on("ready", () => {
	Images.RegisterEventHandlers()
	Images.CheckInstall()
	D.Log("Ready!", "Images")
} )