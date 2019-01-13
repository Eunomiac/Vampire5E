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
				if (getImageKey(imgRef)) {
					return REGISTRY[getImageKey(imgRef)]
				} else if (getImageObj(imgRef)) {
					const imgObj = getImageObj(imgRef)
					D.Alert(`Retrieving data for UNREGISTERED Image Object ${D.JSL(imgRef)}`, "IMAGES: GetData")

					return {
						id: imgObj.id,
						name: imgObj.get("name"),
						left: parseInt(imgObj.get("left")),
						top: parseInt(imgObj.get("top")),
						height: parseInt(imgObj.get("height")),
						width: parseInt(imgObj.get("width")),
						activeLayer: imgObj.get("activeLayer")
					}
				}

				return D.ThrowError(`Image reference '${imgRef}' does not refer to a registered image object.`, "IMAGES: GetData")
			} catch (errObj) {
				return D.ThrowError(`Cannot locate image with search value '${D.JS(imgRef)}'`, "IMAGES.getImageData", errObj)
			}
		},
		getBounds = imgData => {
			const bounds = {
				topY: imgData.top - 0.5 * imgData.height,
				bottomY: imgData.top + 0.5 * imgData.height,
				leftX: imgData.left - 0.5 * imgData.width,
				rightX: imgData.left + 0.5 * imgData.width
			}
			D.Log(`[BOUNDS]: ${D.JSL(bounds)}`)

			return bounds
		},
		getImageSrcs = imgRef => {
			try {
				if (getImageKey(imgRef)) {
					if (_.isString(getImageData(imgRef).srcs))
						return getImageSrcs(getImageData(imgRef).srcs)

					return getImageData(imgRef).srcs
				}

				return D.ThrowError(`Image reference '${imgRef}' does not refer to a registered image object.`, "IMAGES: GetSrcs")
			} catch (errObj) {
				return D.ThrowError(`Cannot locate image with search value '${D.JS(imgRef)}'`, "IMAGES: GetSrcs", errObj)
			}
		},
		// #endregion

		// #region SETTERS: Registering & Manipulating Image Objects
		addImgSrc = (imgSrcRef, imgName, srcName) => {
			try {
				const imgSrc = (_.isString(imgSrcRef) && imgSrcRef.includes("http") ?
					imgSrcRef :
					getImageObj(imgSrcRef).get("imgsrc") || "").replace(/\w*?(?=\.\w+?\?)/u, "thumb")
				if (imgSrc !== "" && REGISTRY[imgName] ) {
					REGISTRY[imgName].srcs[srcName] = imgSrc
					D.Alert(`Image '${D.JS(srcName)}' added to category '${D.JS(imgName)}'.<br><br>Source: ${D.JS(imgSrc)}`)
				}
			} catch (errObj) {
				D.ThrowError("", "IMAGES.addImgSrc", errObj)
			}
		},
		addGenSrc = (imgSrcRef, srcName) => {
			try {
				REGISTRY.Sources[srcName] = (_.isString(imgSrcRef) && imgSrcRef.includes("http") ?
					imgSrcRef :
					getImageObj(imgSrcRef).get("imgsrc") || "").replace(/\w*?(?=\.\w+?\?)/u, "thumb")
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
					startActive: Boolean(params.startActive || false),
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
				if (imgObj && stateRef) {
					if (_.isString(stateRef.srcs) && REGISTRY[getImageData(stateRef.srcs).name] )
						stateRef = REGISTRY[getImageData(stateRef.srcs).name]
					if (stateRef.srcs[srcRef] )
						imgObj.set("imgsrc", stateRef.srcs[srcRef] )
					else if (_.values(stateRef.srcs).includes(srcRef))
						imgObj.set("imgsrc", srcRef)
					else if (_.isString(IMGDATA[srcRef] ))
						imgObj.set("imgsrc", IMGDATA[srcRef] )
					else if (_.isString(srcRef) && REGISTRY.Sources[srcRef] )
						imgObj.set("imgsrc", REGISTRY.Sources[srcRef] )
					else
						return D.ThrowError(`Image object '${D.JSL(imgRef)}' is unregistered or is missing 'srcs' property`, "Images: setImage()")

					return imgObj
				}

				return D.ThrowError(`Invalid image object '${D.JSL(imgObj)}'`, "Images: setImage()")
			}

			return D.ThrowError(`Invalid category '${D.JSL(imgRef)}'`, "Images: setImage()")
		},
		setImgParams = (imgRef, params) => {
			const imgObj = getImageObj(imgRef)
			imgObj.set(params)
		},
		alignImages = (imgRefs, alignMode = "center", anchorRef = "best") => {
			const imgObjs = D.GetSelected(imgRefs) || _.map(imgRefs, v => getImageObj(v)),
				  imgData = _.map(imgObjs, obj => {
					 const tData = {
						id: obj.id,
						obj,
						height: parseInt(obj.get("height")),
						width: parseInt(obj.get("width")),
						top: parseInt(obj.get("top")),
						left: parseInt(obj.get("left"))
					}
					Object.assign(tData, getBounds(tData))

					return tData
				  } ),
				  [minX, maxX] = (v => [v[0].left, v.slice(-1)[0].left + v.slice(-1)[0].width] )(
					  _.sortBy(imgData, v => v.left + v.width)
				  ),
				  [minY, maxY] = (v => [v[0].top, v.slice(-1)[0].top + v.slice(-1)[0].height] )(
					  _.sortBy(imgData, v => v.top + v.height)
				  ),
				  [centerX, centerY] = [maxX - minX, maxY - minY]
			let [sorted, anchor] = [{}, {}],
				bounds = [],
				[counter, spacer] = [0, 0]
			Object.assign(imgData, getBounds(imgData))
			switch (alignMode.toLowerCase()) {
			case "distvert":
				sorted = _.sortBy(imgData, "top")
				bounds = [imgData[0].top, imgData.slice(-1)[0].top]
				spacer = (bounds[1] - bounds[0] ) / (imgData.length - 1)
				for (const iData of imgData) {
					setImgParams(iData.id, {top: bounds[0] + counter * spacer} )
					counter++
				}
				break
			case "disthoriz":
				sorted = _.sortBy(imgData, "left")
				bounds = [imgData[0].left, imgData.slice(-1)[0].left]
				spacer = (bounds[1] - bounds[0] ) / (imgData.length - 1)
				for (const iData of imgData) {
					setImgParams(iData.id, {left: bounds[0] + counter * spacer} )
					counter++
				}
				break
			default:
				switch (anchorRef.toLowerCase()) {
				case "best":
					switch (alignMode.toLowerCase()) {
					case "centerX":
						sorted = _.sortBy(imgData, v => Math.pow(v.left - centerX, 2))
						break
					case "centerY":
						sorted = _.sortBy(imgData, v => Math.pow(v.top - centerY, 2))
						break
					case "resize":
						sorted = _.sortBy(imgData, v => -(v.height * v.width))
						break
					case "left":
					case "leftedge":
						sorted = _.sortBy(imgData, "leftX")
						break
					case "right":
					case "rightedge":
						sorted = _.sortBy(imgData, "rightX").reverse()
						break
					case "top":
					case "topedge":
						sorted = _.sortBy(imgData, "topY")
						break
					case "bottom":
					case "bottomedge":
						sorted = _.sortBy(imgData, "bottomY").reverse()
						break
					default: break
					}
					break
				case "left":
				case "leftmost":
					sorted = _.sortBy(imgData, "leftX")
					break
				case "top":
				case "topmost":
					sorted = _.sortBy(imgData, "topY")
					break
				case "right":
				case "rightmost":
					sorted = _.sortBy(imgData, "rightX").reverse()
					break
				case "bottom":
				case "bot":
				case "botmost":
				case "bottommost":
					sorted = _.sortBy(imgData, "bottomY").reverse()
					break
				default: break
				}
				anchor = sorted.shift()
				// D.Alert(`ANCHOR: ${D.JS(anchor)}`)
				switch (alignMode.toLowerCase()) {
				case "resize":
					for (const iData of sorted) {
						iData.obj.set( {
							height: anchor.height,
							width: anchor.width
						} )
					}
					break
				case "centerX":
					for (const iData of sorted)
						iData.obj.set( {left: anchor.left} )
					break
				case "centerY":
					for (const iData of sorted)
						iData.obj.set( {top: anchor.top} )
					break
				case "left":
				case "leftedge":
					for (const iData of sorted)
						iData.obj.set( {left: anchor.leftX + 0.5 * iData.width} )
					break
				case "right":
				case "rightedge":
					for (const iData of sorted)
						iData.obj.set( {left: anchor.rightX - 0.5 * iData.width} )
					break
				case "top":
				case "topedge":
					for (const iData of sorted)
						iData.obj.set( {top: anchor.topY + 0.5 * iData.height} )
					break
				case "bottom":
				case "bottomedge":
					for (const iData of sorted)
						iData.obj.set( {top: anchor.bottomY - 0.5 * iData.height} )
					break
				default: break
				}
				break
			}
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
		buildMacro = (name, chatTrigger, imgData) => {
			/* imgData should be an object whose keys are the names of host images, and values are
				the <x> in "Select <X>" shown in the macro query. */
			let action = `img ${chatTrigger}`
			for (const hostName of _.map(_.keys(imgData), v => v.trim())) {
				if (getImageKey(hostName)) {
					action += ` ${hostName}:?{${imgData[hostName]}|--blank--,blank`
					for (const srcName of _.keys(getImageSrcs(hostName)).sort())
						action += `|${srcName},${srcName}`
					action += "}"
				}
			}
			createObj("macro", {
				_playerid: D.GMID(),
				name,
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
			let [srcName, imgName, imgObj, macroName, chatTrigger] = [null, null, null, null, null, null],
				params = {}
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
			case "repo":
			case "reposition":
				imgObj = getImageObj(msg)
				if (imgObj && imgObj.get && imgObj.get("name") && REGISTRY[imgObj.get("name")] ) {
					REGISTRY[imgObj.get("name")].top = parseInt(imgObj.get("top"))
					REGISTRY[imgObj.get("name")].left = parseInt(imgObj.get("left"))
					REGISTRY[imgObj.get("name")].height = parseInt(imgObj.get("height"))
					REGISTRY[imgObj.get("name")].width = parseInt(imgObj.get("width"))
					D.Alert(`Image ${imgObj.get("name")} repositioned:<br><br>${D.JS(REGISTRY[imgObj.get("name")] )}`)
				} else {
					D.Alert("Unable to retrieve an image to reposition", "IMAGES: !img repo")
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
				if (!srcName) {
					addGenSrc(msg, imgName)
				} else if (imgName && REGISTRY[imgName] ) {
					if (!_.isObject(REGISTRY[imgName].srcs))
						REGISTRY[imgName].srcs = {}
					if (srcName)
						addImgSrc(msg, imgName, srcName)
					else
						D.Alert(`Invalid image name '${D.JS(srcName)}'`, "IMAGES: !img addsrc")
				} else {
					D.Alert(`Host name '${D.JS(imgName)}' not registered.`, "IMAGES: !img addsrc")
				}
				break
			case "setsrc":
				[imgName, srcName] = args
				if (imgName && REGISTRY[imgName] ) {
					REGISTRY[imgName].srcs = {}
					if (srcName.split(",").length > 1) {
						for (params of srcName.split(","))
							REGISTRY[imgName].srcs[params.split(":")[0]] = params.split(":")[1]
					} else if (srcName.includes(":")) {
						REGISTRY[imgName].srcs[srcName.split(":")[0]] = srcName.split(":")[1]
					} else {
						REGISTRY[imgName].srcs = srcName
					}
				} else {
					D.Alert(`No image registered under ${imgName}`)
				}
				break
			case "set":
				for (const param of args)
					setImage(...param.split(":"))
				break
			case "on":
				for (const param of args)
					toggleImage(param, true)
				break
			case "off":
				for (const param of args)
					toggleImage(param, false)
				break
			case "toggle":
				for (const param of args)
					toggleImage(param.split(":")[1], param.split(":")[0] === "on")
				break
			case "align":
				if (D.GetSelected(msg))
					alignImages(msg, ...args)
				break
			case "copy":
				imgObj = getImageObj(args.shift())
				srcName = imgObj.get("imgsrc")
				imgObj = getImageObj(args.shift())
				imgObj.set("imgsrc", srcName)
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
			case "buildmacro":
				[macroName, chatTrigger] = [args.shift(), args.shift()]
				// D.Alert(`MacroName: ${macroName}, ChatTrigger: ${chatTrigger}`)
				for (const param of _.map(args.join(" ").split(","), v => v.trim()))
					params[param.split(":")[0]] = param.split(":")[1]
				buildMacro(macroName, chatTrigger, params)
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
			state[D.GAMENAME].Images.registry.Sources = state[D.GAMENAME].Images.registry.Sources || {}

			/* state[D.GAMENAME].Images.registry.HungerTopRight_1.srcs = {
				1: "https://s3.amazonaws.com/files.d20.io/images/71118365/_0IwXUktqOjlN6wwqDOnYg/thumb.png?1547377423",
				2: "https://s3.amazonaws.com/files.d20.io/images/71118367/OlzHIFWN5lw4uBwp2_Jcrg/thumb.png?1547377423",
				3: "https://s3.amazonaws.com/files.d20.io/images/71118364/CZU5WbJIIeHxrd3OlGf8yw/thumb.png?1547377426",
				4: "https://s3.amazonaws.com/files.d20.io/images/71118363/D9QYrkfkCIiKF6C_Q38ndA/thumb.png?1547377424",
				5: "https://s3.amazonaws.com/files.d20.io/images/71131744/wtnAdRNzqjuAM3K4D6BRDg/thumb.png?1547391569"
			}
			state[D.GAMENAME].Images.registry.HungerBotRight_1.srcs = "HungerTopRight"
			state[D.GAMENAME].Images.registry.HungerTopLeft_1.srcs = {
				1: "https://s3.amazonaws.com/files.d20.io/images/71135541/E31TUpR-EtMYCCBve6I9tw/thumb.png?1547394656",
				2: "https://s3.amazonaws.com/files.d20.io/images/71135540/1UBrj7N1QlZLclYYeO3Ygg/thumb.png?1547394656",
				3: "https://s3.amazonaws.com/files.d20.io/images/71135539/rKAr6-5zPPbCZQpbQHBJxA/thumb.png?1547394659",
				4: "https://s3.amazonaws.com/files.d20.io/images/71135537/NdR2yr9pfIn8SlxHFtGZ4Q/thumb.png?1547394658",
				5: "https://s3.amazonaws.com/files.d20.io/images/71135538/Nlnh0i70TsCbkGypUdv3Pw/thumb.png?1547394658"
			}
			state[D.GAMENAME].Images.registry.HungerBotLeft_1.srcs = "HungerTopLeft" */
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