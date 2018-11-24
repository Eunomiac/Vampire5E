const Images = (() => {
	// #region CONFIGURATION
	const STATEREF = state[D.GAMENAME].Images,
		  REGISTRY = STATEREF.registry,
		   IMGDATA = {
			   blank: "https://s3.amazonaws.com/files.d20.io/images/63990142/MQ_uNU12WcYYmLUMQcbh0w/thumb.png?1538455511",
			 default: {x: 100, y: 100, h: 400, w: 600},
			district: {x: 100, y: 100, h: 400, w: 600},
			    site: {x: 100, y: 100, h: 400, w: 600}
		},
		// #endregion

		// #region GETTERS: Image Object & Data Retrieval
		getImageObj = imgRef => {
			let [imgObj] = D.GetSelected(imgRef)
			try {
				if (!D.IsObj(imgObj, "graphic") && _.isString(imgRef)) {
					if (REGISTRY[imgRef] )
						imgObj = getObj("graphic", REGISTRY[imgRef].id)
					else
						imgObj = getObj("graphic", imgRef)
				}
			} catch (errObj) {
				return D.ThrowError(`${D.JSL(errObj)}`, "[ERROR] IMAGES: Get")
			}

			return imgObj
		},

		getImageData = (val, cat) => {
			let imgData = null
			try {
				if (_.isString(val) && REGISTRY[val] ) {
					imgData = REGISTRY[val]
				} else if (D.IsObj(val)) {
					const imgObj = (val.selected && D.GetSelected(val)[0] ) || val
					if (imgObj.get("type") !== "graphic")
						return D.ThrowError(`Object '${imgObj}' is not an image object.`, "IMAGES: GetData")
					for (const cats of REGISTRY[cat] ) {
						if (REGISTRY[cats].id === imgObj.id)
							imgData = REGISTRY[cats]
					}
				}
			} catch (errObj) {
				return D.ThrowError(`Cannot locate image with search value '${D.JS(val)}'`, "IMAGES: GetData")
			}

			return imgData
		},
		// #endregion

		// #region SETTERS: Registering & Manipulating Image Objects
		addImgSrc = (imgSrcRef, hostName, imgName) => {
			try {
				const imgSrc = (_.isString(imgSrcRef) && imgSrcRef.includes("http") ?
					imgSrcRef :
					getImageObj(imgSrcRef).get("imgsrc") || "")
					.replace(/\w*?(?=\.png)/u, "thumb")
				if (imgSrc !== "" && REGISTRY[hostName] ) {
					REGISTRY[hostName].srcs[imgName] = imgSrc
					D.Alert(`Image '${D.JS(imgName)}' added to category '${D.JS(hostName)}'.<br><br>Source: ${D.JS(imgSrc)}`)
				}
			} catch (errObj) {
				D.ThrowError(`Bad arguments: ${errObj}`, "IMAGES: addSrc")
			}
		},

		regImage = (hostObj, hostName, params = {} ) => {
			if (D.IsObj(hostObj) && hostObj.get("_type" === "graphic")) {
				const imgSrcs = (params.entries && _.pick(params, v => v.startsWith("http"))) || {}
				REGISTRY[hostName] = {
					id: hostObj.id,
					category: hostName,
					pos: {
						x: params.x || hostObj.get("left") || REGISTRY[hostName].x || (IMGDATA[hostName] && IMGDATA[hostName].x) || 200,
						y: params.y || hostObj.get("top") || REGISTRY[hostName].y || (IMGDATA[hostName] && IMGDATA[hostName].y) || 200,
						h: params.h || hostObj.get("height") || REGISTRY[hostName].h || (IMGDATA[hostName] && IMGDATA[hostName].h) || 100,
						w: params.w || hostObj.get("width") || REGISTRY[hostName].w || (IMGDATA[hostName] && IMGDATA[hostName].w) || 100
					},
					srcs: {}
				}
				for (const imgName of _.keys(imgSrcs))
					addImgSrc(imgSrcs[imgName], imgName)

				D.Alert(`Host obj for '${D.JS(hostName)}' registered: ${D.JS(REGISTRY[hostName] )}`, "IMAGES: regImage")

				return REGISTRY[hostName]
			}

			return D.ThrowError(`Invalid img object '${D.JSL(hostObj)}'`, "IMAGES: regImage")
		},

		makeImage = (hostName, params = {} ) => {
			const dataRef = IMGDATA[hostName] || IMGDATA.default,
			       imgObj = createObj("graphic", {
					imgsrc: params.imgsrc || IMGDATA.blank,
					left: params.x || dataRef.x,
					top: params.y || dataRef.y,
					width: params.width || dataRef.width,
					height: params.height || dataRef.height,
					layer: params.layer || "objects",
					isdrawing: true,
					name: params.name || "",
					controlledby: params.controlledby || ""
				   } )
			regImage(imgObj, hostName)
		},

		setImage = (hostName, imgName) => {
			if (REGISTRY[hostName] ) {
				const stateRef = REGISTRY[hostName],
					    imgObj = getImageObj( {}, hostName)
				if (imgObj) {
					if (stateRef.srcs) {
						if (stateRef.srcs[imgName] )
							imgObj.set("imgsrc", stateRef.srcs[imgName] )
						else
							return D.ThrowError(`No image '${D.JSL(imgName)}' found in category '${D.JSL(hostName)}'`, "Images: setImage()")
					} else {
						return D.ThrowError(`Category '${D.JSL(hostName)}' is missing 'srcs' property`, "Images: setImage()")
					}

					return imgObj
				}

				return D.ThrowError(`Invalid image object '${D.JSL(imgObj)}'`, "Images: setImage()")
			}

			return D.ThrowError(`Invalid category '${D.JSL(hostName)}'`, "Images: setImage()")
		},

		removeImage = hostName => {
			if (hostName && REGISTRY[hostName] ) {
				const hostObj = getObj("graphic", REGISTRY[hostName].id)
				if (D.IsObj(hostObj, "graphic"))
					hostObj.remove()
				delete REGISTRY[hostName]

				return true
			}

			return D.ThrowError(`Invalid host name ${D.JSL(hostName)}`, "IMAGES: removeImage")
		},
		// #endregion

		// #region MACRO BUILDING: Building Selection Macros for Images
		buildMacro = (gmID, macroName, hostNames) => {
			let action = "!img set ?{Choose Image Category"
			for (const hostName of hostNames) {
				if (REGISTRY[hostName] ) {
					action += `| ${D.Capitalize(hostName)}, ?{Choose ${D.Capitalize(hostName)}`
					for (const imgName of _.sortBy(_.keys(REGISTRY[hostName].srcs), k => k))
						action += ` &amp;#124;${D.Capitalize(imgName)}&amp;#44; ${D.Capitalize(hostName)} ${REGISTRY[hostName].srcs[imgName]}`
					action += ` &amp;#124;-- blank --&amp;#44; ${D.Capitalize(hostName)} ${IMGDATA.blank} &amp;#125; `
				} else {
					D.Alert(`Bad Host Name: ${D.JSL(hostName)}`, "BUILDMACRO ITERATOR")
				}
			}
			action += "}"

			createObj("macro", {
				_playerid: gmID,
				macroName,
				action,
				visibleto: gmID
			} )
		},
		// #endregion

		// #region Event Handlers (handleInput)
		handleInput = function (msg) {
			const args = msg.content.split(/\s+/u),
			 hostNames = []
			if (msg.type !== "api" || !playerIsGM(msg.playerid) || args.shift() !== "!img")
				return
			let [imgName, hostName, imgObj] = [null, null, null]
			switch (args.shift().toLowerCase()) {
			case "reg":
			case "register":
				imgObj = getImageObj(msg)
				if (imgObj) {
					hostName = args.shift()
					if (hostName)
						regImage(imgObj, hostName, D.ParseToObj(args.join(" ")))
					else
						D.Alert("Syntax: !img reg <hostName> [<params = imgName:imgSrc, imgName : imgSrc>]", "IMAGES: !img reg")
				} else {
					D.Alert("Select an image object first!", "IMAGES: !img reg")
				}
				break
			case "removeAll":
				for (hostName of _.keys(REGISTRY))
					hostNames.push(hostName)
				// Falls through
			case "remove":
				if (hostNames.length === 0)
					hostNames.push(args.shift())
				if (hostNames.filter(v => v).length > 0) {
					for (hostName of hostNames)
						removeImage(hostName)
				} else {
					D.Alert("No hostnames provided.<br><br>Syntax: !img remove <hostName> OR !img removeAll")
				}
				break
			case "add":
			case "addsrc":
				[hostName, imgName] = args
				if (hostName && REGISTRY[hostName] ) {
					if (imgName)
						addImgSrc(msg, hostName, imgName)
					else
						D.Alert(`Invalid image name '${D.JS(imgName)}'`, "IMAGES: !img addsrc")
				} else {
					D.Alert(`Host name '${D.JS(hostName)}' not registered.`, "IMAGES: !img addsrc")
				}
				break
			case "set":
				hostName = args.shift()
				setImage(hostName, args.shift())
				break
			case "macro":
				imgName = args.shift()
				hostName = args.join(" ").split(/,\s*?/gu)
				buildMacro(msg.playerid, imgName, hostName)
				break
			case "getData":
				imgObj = getImageObj(msg)
				if (imgObj) {
					D.Alert(getImageData(imgObj), "IMAGES, !img getData")
				} else {
					imgName = args.shift()
					if (imgName && REGISTRY[imgName] )
						D.Alert(D.JS(REGISTRY[imgName] ), `IMAGES: '${D.JS(imgName)}'`)
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
		GetData: getImageData,
		MakeImage: makeImage,
		Register: regImage,
		Remove: removeImage
	}
} )()

on("ready", () => {
	Images.RegisterEventHandlers()
	Images.CheckInstall()
	D.Log("Ready!", "Images")
} )