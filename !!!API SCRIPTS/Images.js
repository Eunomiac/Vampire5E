const Images = (() => {
	let imgRecord = false,
		imgResize = false
	const imgResizeDims = {height: 100, width: 100},
		// #region CONFIGURATION
		STATEREF = state[D.GAMENAME].Images,
		REGISTRY = STATEREF.registry,
		IMGDATA = {
			blank: "https://s3.amazonaws.com/files.d20.io/images/63990142/MQ_uNU12WcYYmLUMQcbh0w/thumb.png?1538455511",
			default: {
				x: 100,
				y: 100,
				h: 400,
				w: 600
			},
			district: {
				x: 100,
				y: 100,
				h: 594,
				w: 861
			},
			site: {
				x: 100,
				y: 100,
				h: 515,
				w: 701
			},
			token: {
				h: 210,
				w: 165
			}
		},
		// #endregion

		// #region GETTERS: Image Object & Data Retrieval
		getImageKey = imgRef => {
			try {
				const imgName =
					D.IsObj(imgRef, "graphic") ?
						imgRef.get("name") :
						D.IsObj(getObj("graphic", imgRef)) ?
							getObj("graphic", imgRef).get("name") :
							_.isString(imgRef) ?
								imgRef :
								D.GetSelected(imgRef) ?
									D.GetSelected(imgRef)[0].get("name") :
									null
				if (imgName && _.find(_.keys(REGISTRY), v => v.toLowerCase().startsWith(imgName.toLowerCase()))) {
					return _.keys(REGISTRY)[
						_.findIndex(_.keys(REGISTRY), v => v.toLowerCase().startsWith(imgName.toLowerCase()))
					]
				}

				return D.ThrowError(`Image reference '${imgRef}' does not refer to a registered image object.`, "IMAGES: GetImageKey")
			} catch (errObj) {
				return D.ThrowError(`Cannot locate image with search value '${D.JS(imgRef)}'`, "IMAGES GetImageKey", errObj)
			}
		},
		getImageObj = imgRef => {
			try {
				const imgObj = D.IsObj(imgRef, "graphic") ?
					imgRef :
					_.isString(imgRef) ?
						getImageKey(imgRef) ?
							getObj("graphic", REGISTRY[getImageKey(imgRef)].id) :
							getObj("graphic", imgRef) || null :
						D.GetSelected(imgRef) ?
							D.GetSelected(imgRef)[0] :
							null

				return imgObj
			} catch (errObj) {
				return D.ThrowError(`IMGREF: ${D.JS(imgRef)}`, "IMAGES.getImageObj", errObj)
			}
		},
		getImageData = imgRef => {
			try {
				if (getImageKey(imgRef))
					return REGISTRY[getImageKey(imgRef)]

				return D.ThrowError(`Image reference '${imgRef}' does not refer to a registered image object.`, "IMAGES: GetData")
			} catch (errObj) {
				return D.ThrowError(`Cannot locate image with search value '${D.JS(imgRef)}'`, "IMAGES.getImageData", errObj)
			}
		},
		// #endregion

		// #region SETTERS: Registering & Manipulating Image Objects
		addImgSrc = (imgSrcRef, imgName, srcName) => {
			try {
				const imgSrc = (_.isString(imgSrcRef) && imgSrcRef.includes("http") ?
					imgSrcRef :
					getImageObj(imgSrcRef).get("imgsrc") || "")
					.replace(/\w*?(?=\.png)/u, "thumb")
				if (imgSrc !== "" && REGISTRY[imgName] ) {
					REGISTRY[imgName].srcs[srcName] = imgSrc
					D.Alert(`Image '${D.JS(srcName)}' added to category '${D.JS(imgName)}'.<br><br>Source: ${D.JS(imgSrc)}`)
				}
			} catch (errObj) {
				D.ThrowError("", "IMAGES.addImgSrc", errObj)
			}
		},
		regImage = (imgObj, imgName, options = {} ) => {
			// D.Alert(`Options for '${D.JS(imgName)}': ${D.JS(options)}`, "IMAGES: regImage")
			if (D.IsObj(imgObj, "graphic")) {
				const imgSrcs = (options.entries && _.pick(options, v => v.startsWith("http"))) || {},
					baseName = imgName.replace(/(_|\d|#)+$/gu, "").toLowerCase(),
					name = `${imgName.replace(/(_|\d|#)+$/gu, "")}_${_.filter(_.keys(REGISTRY), k => k.includes(imgName.replace(/(_|\d|#)+$/gu, ""))).length + 1}`,
					params = {
						left: options.left || imgObj.get("left") || REGISTRY[name].left || (IMGDATA[baseName] && IMGDATA[baseName].left),
						top: options.top || imgObj.get("top") || REGISTRY[name].top || (IMGDATA[baseName] && IMGDATA[baseName].top),
						height: options.height || imgObj.get("height") || REGISTRY[name].height || (IMGDATA[baseName] && IMGDATA[baseName].height),
						width: options.width || imgObj.get("width") || REGISTRY[name].width || (IMGDATA[baseName] && IMGDATA[baseName].width)
					}
				// D.Alert(`Params for '${D.JS(imgName)}': ${D.JS(params)}`, "IMAGES: regImage")
				if (!params.left || !params.top || !params.height || !params.width)
					return D.ThrowError("Must supply position & dimension to register image.", "IMAGES:RegImage")
				REGISTRY[name] = {
					id: imgObj.id,
					name,
					left: params.left,
					top: params.top,
					height: params.height,
					width: params.width,
					activeLayer: params.activeLayer || "map",
					startActive: params.startActive || false,
					srcs: {}
				}
				imgObj.set( {name, showname: false} )
				if (!REGISTRY[name].startActive)
					imgObj.set( {imgsrc: IMGDATA.blank, layer: "gmlayer"} )
				for (const srcName of _.keys(imgSrcs))
					addImgSrc(imgSrcs[srcName], srcName)

				D.Alert(`Host obj for '${D.JS(name)}' registered: ${D.JS(REGISTRY[name] )}`, "IMAGES: regImage")

				return getImageData(name)
			}

			return D.ThrowError(`Invalid img object '${D.JSL(imgObj)}'`, "IMAGES: regImage")
		},
		makeImage = (imgName = "", params = {} ) => {
			const dataRef = IMGDATA[imgName] || IMGDATA.default,
				imgObj = createObj("graphic", {
					_pageid: params._pageID || D.PAGEID(),
					imgsrc: params.imgsrc || IMGDATA.blank,
					left: params.left || dataRef.left,
					top: params.top || dataRef.top,
					width: params.width || dataRef.width,
					height: params.height || dataRef.height,
					layer: params.layer || "objects",
					isdrawing: params.isDrawing !== false,
					controlledby: params.controlledby || "",
					showname: params.showname === true
				} )
			regImage(imgObj, imgName)

			return imgObj
		},
		setImage = (imgRef, srcRef) => {
			if (getImageData(imgRef)) {
				const imgObj = getImageObj(imgRef)
				let stateRef = REGISTRY[getImageData(imgRef).name]
				if (imgObj) {
					if (stateRef && stateRef.srcs) {
						if (_.isString(stateRef.srcs) && REGISTRY[getImageData(stateRef.srcs).name] )
							stateRef = REGISTRY[getImageData(stateRef.srcs).name]
						if (stateRef.srcs[srcRef] )
							imgObj.set("imgsrc", stateRef.srcs[srcRef] )
						else if (_.values(stateRef.srcs).includes(srcRef))
							imgObj.set("imgsrc", srcRef)
						else if (_.isString(IMGDATA[srcRef] ))
							imgObj.set("imgsrc", IMGDATA[srcRef] )
						else
							return D.ThrowError(`No image source '${D.JSL(srcRef)}' found for image object '${D.JSL(imgRef)}'`, "Images: setImage()")
					} else {
						return D.ThrowError(`Image object '${D.JSL(imgRef)}' is unregistered or is missing 'srcs' property`, "Images: setImage()")
					}

					return imgObj
				}

				return D.ThrowError(`Invalid image object '${D.JSL(imgObj)}'`, "Images: setImage()")
			}

			return D.ThrowError(`Invalid category '${D.JSL(imgRef)}'`, "Images: setImage()")
		},
		toggleImage = (imgRef, isActive, srcRef) => {
			const imgObj = getImageObj(imgRef),
				imgData = getImageData(imgRef)
			if (imgObj && isActive) {
				imgObj.set("layer", imgData.activeLayer)
				if (srcRef)
					setImage(imgRef, srcRef)
			} else if (imgObj && !isActive) {
				imgObj.set("layer", "gmlayer")
				setImage(imgRef, "blank")
			}
		},
		removeImage = imgRef => {
			const imgObj = getImageObj(imgRef),
				imgData = getImageData(imgRef)
			if (imgObj) {
				imgObj.remove()
				delete REGISTRY[imgData.name]

				return true
			} else if (imgData && REGISTRY[imgData.name] ) {
				delete REGISTRY[imgData.name]

				return true
			}

			return D.ThrowError(`Invalid image reference ${D.JSL(imgRef)}`, "IMAGES: removeImage")
		},
		cleanRegistry = () => {
			for (const imgName of _.keys(REGISTRY)) {
				if (!getImageObj(imgName))
					removeImage(imgName)
			}
		},
		// #endregion

		// #region MACRO BUILDING: Building Selection Macros for Images
		buildMacro = (macroName, imgNames) => {
			let action = "!img set ?{Choose Image Category"
			for (const imgName of imgNames) {
				if (REGISTRY[imgName] ) {
					action += `| ${D.Capitalize(imgName)}, ?{Choose ${D.Capitalize(imgName)}`
					for (const srcName of _.sortBy(_.keys(REGISTRY[imgName].srcs), k => k))
						action += ` &amp;#124;${D.Capitalize(srcName)}&amp;#44; ${D.Capitalize(srcName)} ${REGISTRY[srcName].srcs[srcName]}`
					action += ` &amp;#124;-- blank --&amp;#44; ${D.Capitalize(imgName)} ${IMGDATA.blank} &amp;#125; `
				} else {
					D.Alert(`Bad Image Name: ${D.JSL(imgName)}`, "BUILDMACRO ITERATOR")
				}
			}
			action += "}"

			createObj("macro", {
				_playerid: D.GMID(),
				macroName,
				action,
				visibleto: D.GMID()
			} )
		},
		// #endregion

		// #region Event Handlers (handleAdd, handleInput)
		handleAdd = obj => {
			if (imgRecord)
				D.Log(obj.get("imgsrc"), "IMG")
			if (imgResize)
				obj.set(imgResizeDims)
		},
		handleInput = msg => {
			const args = msg.content.split(/\s+/u),
				imgNames = []
			if (msg.type !== "api" || !playerIsGM(msg.playerid) || args.shift() !== "!img")
				return
			let [srcName, imgName, imgObj] = [null, null, null]
			switch (args.shift().toLowerCase()) {
			case "reg":
			case "register":
				imgObj = getImageObj(msg)
				if (imgObj) {
					imgName = args.shift()
					if (imgName)
						regImage(imgObj, imgName, D.ParseToObj(args.join(" ")))
					else
						D.Alert("Syntax: !img reg <hostName> [<params = imgName:imgSrc, imgName : imgSrc>]", "IMAGES: !img reg")
				} else {
					D.Alert("Select an image object first!", "IMAGES: !img reg")
				}
				break
			case "removeall":
				for (imgName of _.keys(REGISTRY))
					imgNames.push(imgName)
					// Falls through
			case "remove":
				if (imgNames.length === 0)
					imgNames.push(args.shift())
				if (imgNames.filter(v => v).length > 0) {
					for (imgName of imgNames)
						removeImage(imgName)
				} else {
					D.Alert("No hostnames provided.<br><br>Syntax: !img remove <hostName> OR !img removeAll")
				}
				break
			case "clean":
				cleanRegistry()
				break
			case "add":
			case "addsrc":
				[imgName, srcName] = args
				if (imgName && REGISTRY[imgName] ) {
					if (srcName)
						addImgSrc(msg, imgName, srcName)
					else
						D.Alert(`Invalid image name '${D.JS(srcName)}'`, "IMAGES: !img addsrc")
				} else {
					D.Alert(`Host name '${D.JS(imgName)}' not registered.`, "IMAGES: !img addsrc")
				}
				break
			case "set":
				setImage(args.shift(), args.shift())
				break
			case "on":
				toggleImage(args.shift(), true)
				break
			case "off":
				toggleImage(args.shift(), false)
				break
			case "setlocation":
				setImage("District", args.shift())
				setImage("Site", args.shift())
				break
			case "macro":
				srcName = args.shift()
				imgName = args.join(" ").split(/,\s*?/gu)
				buildMacro(srcName, imgName)
				break
			case "getdata":
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
			case "toggleadd":
				imgRecord = !imgRecord
				if (imgRecord)
					D.Alert("Logging image data as they are added to the sandbox.", "IMAGES, !img toggleAdd")
				else
					D.Alert("Image logging disabled.", "IMAGES, !img toggleAdd")
				break
			case "toggleresize":
				imgResize = !imgResize
				if (imgResize) {
					if (args.length === 1 && IMGDATA[args[0]] ) {
						imgResizeDims.height = IMGDATA[args[0]].h
						imgResizeDims.width = IMGDATA[args[0]].w
					} else if (args.length === 2) {
						_.each(args.join("").split(","), v => {
							imgResizeDims[v.split(":")[0]] = _.isNumber(v.split(":")[1] ) ? parseInt(v.split(":")[1] ) : v.split(":")[1]
						} )
					} else {
						D.Alert("Must supply either a valid IMGDATA key OR \"height:&lt;height&gt;, width:&lt;width&gt;\"", "IMAGES, !img toggleResize")
						break
					}
					D.Alert(`New images automatically resized to height: ${imgResizeDims.height}, width: ${imgResizeDims.width}.`, "IMAGES, !img toggleResize")
				} else {
					D.Alert("Image resizing disabled.", "IMAGES, !img toggleResize")
				}
				break
			case "fixregistry":
				for (const imgRef of _.keys(REGISTRY)) {
					if (imgRef.includes("wpReroll") || imgRef.includes("selectDie")) {
						REGISTRY[imgRef].activeLayer = "objects"
						REGISTRY[imgRef].startActive = false
					} else if (imgRef.includes("District")) {
						REGISTRY[imgRef].activeLayer = "map"
						REGISTRY[imgRef].startActive = false
					}
					if (imgRef.includes("DistrictCenter"))
						REGISTRY[imgRef].startActive = true
					toggleImage(imgRef, REGISTRY[imgRef].startActive)
				}
				break
			default:
				break
			}
		},
		// #endregion

		// #region Public Functions: RegisterEventHandlers
		regHandlers = () => {
			on("add:graphic", handleAdd)
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
		Remove: removeImage,
		Set: setImage,
		Toggle: toggleImage
	}
} )()

on("ready", () => {
	Images.RegisterEventHandlers()
	Images.CheckInstall()
	D.Log("Ready!", "Images")
} )