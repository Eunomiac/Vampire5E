const Images = (() => {
	// #region CONFIGURATION
	const STATEREF = state[D.GAMENAME].Images,
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
				h: 400,
				w: 600
			},
			site: {
				x: 100,
				y: 100,
				h: 400,
				w: 600
			}
		},
		// #endregion

		// #region GETTERS: Image Object & Data Retrieval
		getImageObj = imgRef => {
			try {
				const imgObj = D.IsObj(imgRef, "graphic") ?
					imgRef :
					_.isString(imgRef) ?
						REGISTRY[imgRef] ?
							getObj("graphic", REGISTRY[imgRef].id) :
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
				const imgName = D.IsObj(imgRef, "graphic") ?
					imgRef.get("name") :
					_.isString(imgRef) ?
						imgRef :
						D.GetSelected(imgRef) ?
							D.GetSelected(imgRef)[0].get("name") :
							null
				if (imgName && REGISTRY[imgName] )
					return REGISTRY[imgName]

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
		regImage = (imgObj, imgName, params = {} ) => {
			if (D.IsObj(imgObj, "graphic")) {
				const imgSrcs = (params.entries && _.pick(params, v => v.startsWith("http"))) || {},
					baseName = imgName.replace(/(_|\d|#)+$/gu, "").toLowerCase(),
					name = `${imgName.replace(/(_|\d|#)+$/gu, "")}_${_.filter(_.keys(REGISTRY), k => k.includes(imgName.replace(/(_|\d|#)+$/gu, ""))).length + 1}`
				D.Alert(`BaseName: ${baseName}, FullName: ${name}`)
				REGISTRY[name] = {
					id: imgObj.id,
					name,
					left: params.left || imgObj.get("left") || REGISTRY[name].left || (IMGDATA[baseName] && IMGDATA[baseName].left) || 200,
					top: params.top || imgObj.get("top") || REGISTRY[name].top || (IMGDATA[baseName] && IMGDATA[baseName].top) || 200,
					height: params.height || imgObj.get("height") || REGISTRY[name].height || (IMGDATA[baseName] && IMGDATA[baseName].height) || 100,
					width: params.width || imgObj.get("width") || REGISTRY[name].width || (IMGDATA[baseName] && IMGDATA[baseName].width) || 100,
					srcs: {}
				}
				for (const srcName of _.keys(imgSrcs))
					addImgSrc(imgSrcs[srcName], srcName)

				D.Alert(`Host obj for '${D.JS(name)}' registered: ${D.JS(REGISTRY[name] )}`, "IMAGES: regImage")

				return getImageData(name)
			}

			return D.ThrowError(`Invalid img object '${D.JSL(imgObj)}'`, "IMAGES: regImage")
		},
		makeImage = (imgName = "", params = {} ) => {
			const dataRef = IMGDATA[imgName] || IMGDATA.default,
				name = imgName.replace(/#+/gu, _.filter(_.keys(IMGDATA), k => k.includes(imgName.replace(/#+/gu, ""))).length + 1),
				imgObj = createObj("graphic", {
					_pageid: params.pageID || D.PAGEID(),
					name,
					imgsrc: params.imgsrc || IMGDATA.blank,
					left: params.left || dataRef.width,
					top: params.height || dataRef.height,
					width: params.width || dataRef.width,
					height: params.height || dataRef.height,
					layer: params.layer || "objects",
					isdrawing: params.isDrawing !== false,
					controlledby: params.controlledby || "",
					showname: params.showname === true
				} )
			regImage(imgObj, name)

			return imgObj
		},
		setImage = (imgRef, srcRef) => {
			if (getImageData(imgRef)) {
				const stateRef = REGISTRY[getImageData(imgRef).name],
					imgObj = getImageObj(imgRef)
				if (imgObj) {
					if (stateRef.srcs) {
						if (stateRef.srcs[srcRef] )
							imgObj.set("imgsrc", stateRef.srcs[srcRef] )
						else if (_.values(stateRef.srcs).includes(srcRef))
							imgObj.set("imgsrc", srcRef)
						else
							return D.ThrowError(`No image source '${D.JSL(srcRef)}' found for image object '${D.JSL(imgRef)}'`, "Images: setImage()")
					} else {
						return D.ThrowError(`Image object '${D.JSL(imgRef)}' is missing 'srcs' property`, "Images: setImage()")
					}

					return imgObj
				}

				return D.ThrowError(`Invalid image object '${D.JSL(imgObj)}'`, "Images: setImage()")
			}

			return D.ThrowError(`Invalid category '${D.JSL(imgRef)}'`, "Images: setImage()")
		},
		removeImage = imgRef => {
			const imgObj = getImageObj(imgRef),
				imgData = getImageData(imgRef)
			if (imgObj) {
				imgObj.remove()
				delete REGISTRY[imgData.name]

				return true
			} else if (imgData && REGISTRY[imgData.name]) {
				delete REGISTRY[imgData.name]

				return true
			}

			return D.ThrowError(`Invalid image reference ${D.JSL(imgRef)}`, "IMAGES: removeImage")
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

		// #region Event Handlers (handleInput)
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
			case "removeAll":
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
			case "setlocation":
				setImage("District", args.shift())
				setImage("Site", args.shift())
				break
			case "macro":
				srcName = args.shift()
				imgName = args.join(" ").split(/,\s*?/gu)
				buildMacro(srcName, imgName)
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
		regHandlers = () => {
			on("chat:message", handleInput)
		},

		checkInstall = () => {
			state[D.GAMENAME].Images = state[D.GAMENAME].Images || {}
			state[D.GAMENAME].Images.registry = state[D.GAMENAME].Images.registry || {}
			delete state[D.GAMENAME].Images.registry.District_
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
	// D.Log("Ready!", "Images")
} )