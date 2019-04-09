void MarkStart("Media")
const Images = (() => {
	let imgRecord = false,
		imgResize = false
	const SCRIPTNAME = "Images",
		imgResizeDims = {height: 100, width: 100},
		// #region CONFIGURATION
		STATEREF = state[D.GAMENAME][SCRIPTNAME],
		REGISTRY = STATEREF.registry,
		SANDBOX = {
			height: 2680,
			width: 1664
		},
		IMGDATA = {
			blank: "https://s3.amazonaws.com/files.d20.io/images/63990142/MQ_uNU12WcYYmLUMQcbh0w/thumb.png?1538455511",
			default: {
				x: 100,
				y: 100,
				h: 400,
				w: 600
			},
			district: {
				x: 1367,
				y: 1000,
				h: 604,
				w: 896,
			},
			districtLeft: {
				x: 925,
				y: 983,
				h: 556,
				w: 805
			},			
			districtRight: {
				x: 1742,
				y: 983,
				h: 556,
				w: 806
			},
			site: {
				x: 1374,
				y: 1382,
				h: 515,
				w: 701,
			},			
			siteLeft: {
				x: 978,
				y: 1377,
				h: 515,
				w: 701,
			},
			siteRight: {
				x: 1690,
				y: 1377,
				h: 515,
				w: 701,
			},
			token: {
				h: 210,
				w: 165
			}
		},
		IMAGELAYERS = {
			map: [
				"SignalLightTopLeft", "SignalLightTopRight", "SignalLightBotLeft", "SignalLightBotRight",
				"rollerDie_bigDice_1",
				"rollerDie_bigDice_2",
				"rollerDie_diceList_1",
				"rollerDie_diceList_2",
				"rollerDie_diceList_3",
				"rollerDie_diceList_4",
				"rollerDie_diceList_5",
				"rollerDie_diceList_6",
				"rollerDie_diceList_7",
				"rollerDie_diceList_8",
				"rollerDie_diceList_9",
				"rollerDie_diceList_10",
				"rollerDie_diceList_11",
				"rollerDie_diceList_12",
				"rollerDie_diceList_13",
				"rollerDie_diceList_14",
				"rollerDie_diceList_15",
				"rollerDie_diceList_16",
				"rollerDie_diceList_17",
				"rollerDie_diceList_18",
				"rollerDie_diceList_19",
				"rollerDie_diceList_20",
				"rollerDie_diceList_21",
				"rollerDie_diceList_22",
				"rollerDie_diceList_23",
				"rollerDie_diceList_24",
				"rollerDie_diceList_25",
				"rollerDie_diceList_26",
				"rollerDie_diceList_27",
				"rollerDie_diceList_28",
				"rollerDie_diceList_29",
				"rollerDie_diceList_30",
				"rollerImage_diffFrame",
				"rollerImage_bottomEnd",
				"rollerImage_topEnd",
				"rollerImage_bottomMid_9",
				"rollerImage_bottomMid_8",
				"rollerImage_bottomMid_7",
				"rollerImage_bottomMid_6",
				"rollerImage_bottomMid_5",
				"rollerImage_bottomMid_4",
				"rollerImage_bottomMid_3",
				"rollerImage_bottomMid_2",
				"rollerImage_bottomMid_1",
				"rollerImage_topMid_9",
				"rollerImage_topMid_8",
				"rollerImage_topMid_7",
				"rollerImage_topMid_6",
				"rollerImage_topMid_5",
				"rollerImage_topMid_4",
				"rollerImage_topMid_3",
				"rollerImage_topMid_2",
				"rollerImage_topMid_1",
				"rollerImage_frontFrame",
				"SiteCenter",
				"SiteLeft",
				"SiteRight",
				"DistrictCenter",
				"DistrictLeft",
				"DistrictRight",
				"WeatherFrost",
				"WeatherFog",
				"WeatherMain",
				//"WeatherLightning_1", //"WeatherLightning_2", "WeatherLightning_3", "WeatherLightning_4", "WeatherLightning_5",
				"WeatherGround",
				"WeatherClouds",
				"AirLightLeft", "AirLightMid", "AirLightTop", "AirLightCN_4", "AirLightCN_5",
				"HungerTopLeft", "HungerTopRight", "HungerBotLeft", "HungerBotRight",
				"Horizon_1",
				"Horizon_2"
			],
			objects: [		
				"YusefShamsinToken",
				"AvaWongToken",
				"JohannesNapierToken",
				"Dr.ArthurRoyToken"
			]
		},
		// #endregion

		// #region GETTERS: Image Object & Data Retrieval
		isRegImg = imgRef => Boolean(getImageKey(imgRef)),
		getImageKey = (imgRef, isSilent = false) => {
			try {
				const imgName =
					D.IsObj(imgRef, "graphic") ?
						imgRef.get("name") :
						D.IsObj(getObj("graphic", imgRef)) ?
							getObj("graphic", imgRef).get("name") :
							_.isString(imgRef) ?
								(REGISTRY[D.JSL(imgRef) + "_1"] ? imgRef + "_1" : imgRef) :
								D.GetSelected(imgRef) ?
									D.GetSelected(imgRef)[0].get("name") :
									false
				// D.Alert(`IsObj? ${D.IsObj(imgRef, "graphic")}
				// Getting Name: ${imgRef.get("name")}`, "IMAGE NAME")
				if (!imgName) {
					return !isSilent && D.ThrowError(`Cannot find name of image from reference '${D.JSL(imgRef, true)}'`, "IMAGES: GetImageKey")
				} else if (_.find(_.keys(REGISTRY), v => v.toLowerCase().startsWith(imgName.toLowerCase()))) {
					return _.keys(REGISTRY)[
						_.findIndex(_.keys(REGISTRY), v => v.toLowerCase().startsWith(imgName.toLowerCase()))
					]
				} else {
					return !isSilent && D.ThrowError(`Cannot find image with name '${D.JSL(imgName)}' from reference ${D.JSL(imgRef, true)}`, "IMAGES: GetImageKey")
				}
			} catch (errObj) {
				return !isSilent && D.ThrowError(`Cannot locate image with search value '${D.JSL(imgRef, true)}'`, "IMAGES GetImageKey", errObj)
			}
		},
		/* getImageKeys = imgRefs => {
			const imageRefs = D.GetSelected(imgRefs) || imgRefs,
				imgKeys = []
			for (const imgRef of imageRefs) {
				imgKeys.push(getImageKey(imgRef))
			}
			return imgKeys
		}, */
		/* getImageName = imgRef => getImageKey(imgRef), */
		/* getImageNames = imgRefs => getImageKeys(imgRefs), */
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
		getImageObjs = imgRefs => {
			const imageRefs = D.GetSelected(imgRefs) || imgRefs,
				imgObjs = []
			//D.Alert(`Image Refs: ${D.JS(imgRefs)}`)
			for (const imgRef of imageRefs)
				imgObjs.push(getImageObj(imgRef))
			
			//D.Alert(`Image Objs: ${D.JS(imgObjs)}`)
			return imgObjs
		},
		getImageData = imgRef => {
			const funcName = "getImageData"
			try {
				if (getImageKey(imgRef)) {
					return REGISTRY[getImageKey(imgRef)]
				} else if (getImageObj(imgRef)) {
					const imgObj = getImageObj(imgRef)
					D.DBAlert(`Retrieving data for UNREGISTERED Image Object ${D.JSL(imgRef)}`, funcName, SCRIPTNAME)

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
		/* getImageDatas = imgRefs => {
			const imageRefs = D.GetSelected(imgRefs) || imgRefs,
				 imageDatas = []
			for (const imgRef of imageRefs) {
				imageDatas.push(getImageData(imgRef))
			}
			return imageDatas
		},	*/	
		getImageBounds = (imgRef, params = {}) => {
			if (D.IsObj(getImageObj(imgRef))) {
				const imgData = Object.assign(getImageData(imgRef), params)
				return {
					topY: imgData.top - 0.5 * imgData.height,
					bottomY: imgData.top + 0.5 * imgData.height,
					leftX: imgData.left - 0.5 * imgData.width,
					rightX: imgData.left + 0.5 * imgData.width
				}
			//D.Log(`[BOUNDS]: ${D.JSL(bounds)}`)
			} 
			return D.ThrowError(`Image reference '${imgRef}' does not refer to a registered image object.`, "IMAGES: GetBounds")
		},
		getImageSrc = imgRef => getImageData(imgRef) ? getImageData(imgRef).curSrc : false,
		/* getImageSrcs = imgRef => getImageData(imgRef) ? getImageData(imgRef).srcs : false, */
		isImageActive = imgRef => {
			if (getImageObj(imgRef) && getImageObj(imgRef).get("layer") === getImageData(imgRef).activeLayer)
				return true
			return false
		},
		// #endregion

		// #region SETTERS: Registering & Manipulating Image Objects
		addImgSrc = (imgSrcRef, imgName, srcName) => {
			try {
				const imgSrc = (_.isString(imgSrcRef) && imgSrcRef.includes("http") ?
					imgSrcRef :
					getImageObj(imgSrcRef).get("imgsrc") || "").replace(/\w*?(?=\.\w+?\?)/u, "thumb")
				if (imgSrc !== "" && isRegImg(imgName) ) {
					REGISTRY[getImageKey(imgName)].srcs[srcName] = imgSrc
					D.Alert(`Image '${D.JS(srcName)}' added to category '${D.JS(imgName)}'.<br><br>Source: ${D.JS(imgSrc)}`)
				}
			} catch (errObj) {
				D.ThrowError("", "IMAGES.addImgSrc", errObj)
			}
		},
		regImage = (imgRef, imgName, srcName, activeLayer, startActive, options = {}, isSilent = false) => {
		// D.Alert(`Options for '${D.JS(imgName)}': ${D.JS(options)}`, "IMAGES: regImage")
			const imgObj = getImageObj(imgRef)
			if (D.IsObj(imgObj, "graphic")) {
				if (!(imgRef && imgName && srcName && activeLayer && startActive !== null))
					return D.ThrowError("Must supply all parameters for regImage.", "IMAGES: RegImage")
				const baseName = imgName.replace(/(_|\d|#)+$/gu, "").toLowerCase(),
					name = `${imgName.replace(/(_|\d|#)+$/gu, "")}_${_.filter(_.keys(REGISTRY), k => k.includes(imgName.replace(/(_|\d|#)+$/gu, ""))).length + 1}`,
					params = {
						left: options.left || imgObj.get("left") || REGISTRY[name].left || (IMGDATA[baseName] && IMGDATA[baseName].left),
						top: options.top || imgObj.get("top") || REGISTRY[name].top || (IMGDATA[baseName] && IMGDATA[baseName].top),
						height: options.height || imgObj.get("height") || REGISTRY[name].height || (IMGDATA[baseName] && IMGDATA[baseName].height),
						width: options.width || imgObj.get("width") || REGISTRY[name].width || (IMGDATA[baseName] && IMGDATA[baseName].width)
					}
				if (!params.left || !params.top || !params.height || !params.width)
					return D.ThrowError("Must supply position & dimension to register image.", "IMAGES:RegImage")
				imgObj.set( {name, showname: false} )
				REGISTRY[name] = {
					id: imgObj.id,
					name,
					left: params.left,
					top: params.top,
					height: params.height,
					width: params.width,
					activeLayer: activeLayer,
					startActive: Boolean(startActive),
					srcs: {}
				}
				if (D.GetChar(imgObj)) {
					REGISTRY[name].activeLayer = "objects"
					REGISTRY[name].startActive = true
					addImgSrc(imgObj.get("imgsrc").replace(/med/gu, "thumb"), name, "base")
					setImage(name, "base")
				} else {
					addImgSrc(imgObj.get("imgsrc").replace(/med/gu, "thumb"), name, srcName)
					setImage(name, srcName)
				}
				if (!REGISTRY[name].startActive) {
					setImage(name, "blank")
					layerImages([name], "gmlayer")
				} else {
					layerImages([name], REGISTRY[name].activeLayer)
				}
				if (!isSilent)
					D.Alert(`Host obj for '${D.JS(name)}' registered: ${D.JS(REGISTRY[name] )}`, "IMAGES: regImage")

				return getImageData(name)
			}

			return D.ThrowError(`Invalid img reference '${D.JSL(imgRef)}'`, "IMAGES: regImage")
		},
		makeImage = (imgName = "", params = {}, isSilent = false ) => {
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
				} ),
				activeLayer = params.activeLayer || "gmlayer",
				isStartingActive = Boolean(params.startActive) === false ? false : true,
				options = _.omit(params, ["activeLayer", "startActive"])
			regImage(imgObj, imgName, params.imgsrc ? "base" : "blank", activeLayer, isStartingActive, options, isSilent)

			return imgObj
		},
		setImage = (imgRef, srcRef, isSilent = false) => {
			//D.Alert(`Getting ${D.JS(srcRef)} for ${D.JS(imgRef)} --> ${D.JS(REGISTRY[getImageData(imgRef).name].srcs[srcRef])}`, "IMAGES:SetImage")
			if (isRegImg(imgRef)) {
				const imgObj = getImageObj(imgRef),
					 imgName = getImageKey(imgRef)
				//D.Alert(`Image Name: ${D.JS(imgName)}`)
				let stateRef = REGISTRY[imgName],
					srcURL = srcRef
				//D.Alert(D.JS(REGISTRY[getImageData(imgRef).name]))
				if (imgObj && stateRef) {
				//D.Alert(`Getting ${D.JS(stateRef.srcs)} --> ${D.JS(srcRef)} --> ${D.JS(stateRef.srcs[srcRef])}`, "IMAGES:SetImage")
					if (_.isString(stateRef.srcs) && REGISTRY[getImageKey(stateRef.srcs)] )
						stateRef = REGISTRY[getImageKey(stateRef.srcs)]
					if (stateRef.srcs[srcRef] )
						srcURL = stateRef.srcs[srcRef]	
					else if (_.values(stateRef.srcs).includes(srcRef) && srcRef.includes("http")) {
						srcURL = srcRef
					} else if (_.isString(IMGDATA[srcRef] ))
						srcURL = IMGDATA[srcRef]
					else
						return isSilent ? D.ThrowError(`Image object '${D.JSL(imgRef)}' is unregistered or is missing 'srcs' property`, "Images: setImage()") : false
								
					imgObj.set("imgsrc", srcURL )
					if (srcRef === "blank")
						imgObj.set("layer", "walls")
					else
						imgObj.set("layer", getImageData(imgRef).activeLayer)
					REGISTRY[getImageData(imgRef).name].curSrc = srcRef
					return imgObj
				}

				return D.ThrowError(`Invalid image object '${D.JSL(imgObj)}'`, "Images: setImage()")
			}

			return D.ThrowError(`Invalid category '${D.JSL(imgRef)}'`, "Images: setImage()")
		},
		setImgParams = (imgRef, params) => {
			const imgObj = getImageObj(imgRef)
			imgObj.set(params)
			return imgObj
		},
		sortImages = (imgRefs, modes = "", anchors = []) => {
			const imgObjs = getImageObjs(imgRefs),
				sortModes = _.flatten([modes]),
				    imgData = _.map(imgObjs, obj => {
					const params = {
						id: obj.id,
						obj,
						height: parseInt(obj.get("height")),
						width: parseInt(obj.get("width")),
						top: parseInt(obj.get("top")),
						left: parseInt(obj.get("left"))
					}
					return Object.assign(params, getImageBounds(obj, params))
				} ),
				[minX, maxX] = (v => [v[0].left, v.slice(-1)[0].left + v.slice(-1)[0].width] )(
					_.sortBy(imgData, v => v.left + v.width)
				),
				[minY, maxY] = (v => [v[0].top, v.slice(-1)[0].top + v.slice(-1)[0].height] )(
					_.sortBy(imgData, v => v.top + v.height)
				),
				[centerX, centerY] = [maxX - minX, maxY - minY]
			let [sortedArray, anchorArray, bounds] = [ [], [], [] ],
				anchorRef = "best"
			for (var i = 0; i < sortModes.length; i++) {
				anchorRef = anchors[i] || anchorRef
				let [spacer, counter] = [0, 0],
					[sorted, revSorted] = [[], []]
				switch(sortModes[i]) {
				case "distvert":
					sorted = _.sortBy(imgData, "top")
					bounds = [sorted[0].top, sorted.slice(-1)[0].top]
					spacer = (bounds[1] - bounds[0] ) / (sorted.length - 1)
					for (const iData of sorted) {
						revSorted.unshift(setImgParams(iData.id, {top: bounds[0] + counter * spacer}, true ))
						counter++
					}
					for (const obj of revSorted)
						toFront(obj)
					break
				case "disthoriz":
					sorted = _.sortBy(imgData, "left")
					bounds = [sorted[0].left, sorted.slice(-1)[0].left]
					spacer = (bounds[1] - bounds[0] ) / (sorted.length - 1)
					for (const iData of sorted) {
					//D.Alert(`Setting image ${D.JS(iData)}`)
						revSorted.unshift(setImgParams(iData.id, {left: bounds[0] + counter * spacer}, true ))
						counter++
					}
					for (const obj of revSorted)
						toFront(obj)
					//D.Alert(`Bounds: ${D.JS(bounds)}, Spacer: ${D.JS(spacer)}`)
					break
				default:
					switch (anchorRef.toLowerCase()) {
					case "best":
						switch (sortModes[i]) {
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
				}
				anchorArray.push(sorted.shift())
				sortedArray.push(sorted)		
			}
			
			return [sortedArray, anchorArray]
		},
		alignImages = (imgRefs, alignModes = "center", anchorRefs = "best") => {
			const aModes = alignModes.split(","),
				   aRefs = anchorRefs.split(","),
				[sortedArray, anchorArray] = sortImages(imgRefs, aModes, aRefs)
			for (let i = 0; i < sortedArray.length; i++) {
				const [sorted, anchor] = [sortedArray[i], anchorArray[i]]
				switch (aModes[i].toLowerCase()) {			
				// D.Alert(`ANCHOR: ${D.JS(anchor)}`)
				case "farleft":				
					for (const iData of sorted) {
						iData.obj.set( {
							left: 0.5 * iData.width
						} )
					}
					break
				case "farright":				
					for (const iData of sorted) {
						iData.obj.set( {
							left: SANDBOX.width - 0.5 * iData.width
						} )
					}
					break
				case "fartop":				
					for (const iData of sorted) {
						iData.obj.set( {
							top: 0.5 * iData.height
						} )
					}
					break
				case "farbottom":				
					for (const iData of sorted) {
						iData.obj.set( {
							top: SANDBOX.height - 0.5 * iData.height
						} )
					}
					break
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
			}			
		},
		positionImages = (imgRefs, ...params) => {
			const imgObjs = getImageObjs(imgRefs)
			for (const imgObj of imgObjs) {
				const attrList = {}		
				for (const param of params)
					if (!isNaN(parseInt(param.split(":")[1])))
						attrList[param.split(":")[0]] = parseInt(param.split(":")[1])
				setImgParams(imgObj, attrList)
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
				imgObj.set("layer", "walls")
				setImage(imgRef, "blank")
			}
		},
		toggleToken = (imgRef, newSrc, toggleRef) => {
			const imgKey = getImageKey(imgRef),
				imgData = getImageData(imgKey),
				prevSrc = imgData.prevSrc,
				curSrc = imgData.curSrc
			REGISTRY[imgKey].prevSrc = REGISTRY[imgKey].curSrc
			if (newSrc === curSrc) {
				if (toggleRef === "prev" && prevSrc) {
					Images.Set(imgKey, prevSrc)
					REGISTRY[imgKey].curSrc = prevSrc
				} else if (_.keys(imgData.srcs).includes(toggleRef)) {
					Images.Set(imgKey, toggleRef)
					REGISTRY[imgKey].curSrc = toggleRef
				} else {
					Images.Set(imgKey, "base")
					REGISTRY[imgKey].curSrc = "base"
				}
			} else {
				Images.Set(imgKey, newSrc)
				REGISTRY[imgKey].curSrc = newSrc
			}
		},
		removeImage = (imgRef, isRegOnly) => {
			const imgObj = getImageObj(imgRef),
				imgData = getImageData(imgRef)
			if (imgObj && !isRegOnly) {
				imgObj.remove()
				delete REGISTRY[imgData.name]
				return true
			} else if (imgData && REGISTRY[imgData.name] ) {
				delete REGISTRY[imgData.name]
				return true
			} else if (_.isString(imgRef) && REGISTRY[imgRef]) {
				delete REGISTRY[imgRef]
				return true
			}
			return D.ThrowError(`Invalid image reference ${D.JSL(imgRef)}`, "IMAGES: removeImage")
		},
		removeImages = (imgString, isRegOnly) => {
			const imgNames = _.filter(_.keys(REGISTRY), v => v.includes(imgString))
			for (const imgName of imgNames) {
				removeImage(imgName, isRegOnly)
			}
		},
		cleanRegistry = () => {
			for (const imgName of _.keys(REGISTRY)) {
				if (!getImageObj(imgName))
					removeImage(imgName)
			}
		},
		orderImages = (imgRefs, isToBack = false) => {
			const imgObjs = getImageObjs(imgRefs)
			//D.Alert(`Retrieved Images: ${D.JS(imgObjs)}`)
			//D.Alert(`Retrieved Images: ${D.JS(getImageKeys(imgObjs))}`)
			if (!isToBack)
				imgObjs.reverse()
			for (const imgObj of imgObjs) {
				if (D.IsObj(imgObj, "graphic")) {
					if (isToBack)
						toBack(imgObj)
					else
						toFront(imgObj)
				} else {
					D.Alert(`Not an image object: ${D.JS(imgObj)}`, "IMAGES: OrderImages")
				}
			}
		},
		layerImages = (imgRefs, layer) => {
			const imgObjs = getImageObjs(imgRefs)
			orderImages(IMAGELAYERS.objects)
			for (const imgObj of imgObjs) {
				if (D.IsObj(imgObj, "graphic"))
					imgObj.set({layer: layer})
				else 
					D.Alert(`No image found for reference ${D.JS(imgObj)}`, "IMAGES: OrderImages")
			}
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
			let [srcName, imgName, imgObj, imgLayer, imgData, isStartActive] = [null, null, null, null, null, null],
				params = {}
			switch (args.shift().toLowerCase()) {
			case "reg":
			case "register":
				imgObj = getImageObj(msg)
				if (imgObj) {
					[imgName, srcName, imgLayer, isStartActive] = [args.shift(), args.shift(), args.shift(), args.shift()]
					if (imgName && srcName && imgLayer && isStartActive)
						regImage(imgObj, imgName, srcName, imgLayer, isStartActive, D.ParseToObj(args.join(" ")))
					else
						D.Alert("Syntax: !img reg &lt;hostName&gt; &lt;currentSourceName&gt; &lt;activeLayer&gt; &lt;isStartingActive&gt; [params]", "IMAGES: !img reg")
				} else {
					D.Alert("Select an image object first!", "IMAGES: !img reg")
				}
				break
			case "repo":
			case "reposition":
				imgObj = getImageObj(msg)
				if (isRegImg(msg)) {
					[imgObj, imgName] = [getImageObj(msg), getImageKey(msg)]
					REGISTRY[imgName].top = parseInt(imgObj.get("top"))
					REGISTRY[imgName].left = parseInt(imgObj.get("left"))
					REGISTRY[imgName].height = parseInt(imgObj.get("height"))
					REGISTRY[imgName].width = parseInt(imgObj.get("width"))
					D.Alert(`Image ${imgName} repositioned:<br><br>${D.JS(REGISTRY[imgName] )}`)
				} else {
					D.Alert("Unable to retrieve an image to reposition", "IMAGES: !img repo")
				}
				break
			case "layer":
				imgLayer = args.pop()
				layerImages(args.length > 0 ? args : msg, imgLayer)
				break
			case "tofront":
				orderImages(args.length > 0 ? args : msg)
				break
			case "toback":
				orderImages(args.length > 0 ? args : msg, true)
				break
			case "removeall":
				for (imgName of _.keys(REGISTRY))
					if (!args[0] || imgName.toLowerCase().includes((args.join(" ").toLowerCase())))
						imgNames.push(imgName)
			/* falls through */
			case "remove":
				if (imgNames.length > 0)
					for (imgName of imgNames)
						removeImage(imgName)
				else if (args[0])
					removeImage(args.join(" "))
				else 
					D.Alert("No hostnames provided.<br><br>Syntax: !img remove <hostName> OR !img removeAll")
				break
			case "clearall":
				for (imgName of _.keys(REGISTRY))
					if (!args[0] || imgName.toLowerCase().includes((args.join(" ").toLowerCase())))
						imgNames.push(imgName)
			/* falls through */
			case "clear":
				if (imgNames.length > 0)
					for (imgName of imgNames)
						removeImage(imgName, true)
				else if (args[0])
					removeImage(args.join(" "), true)
				else 
					D.Alert("No hostnames provided.<br><br>Syntax: !img clear <hostName> OR !img clearAll")
				break
			case "clean":
				cleanRegistry()
				break
			case "add":
			case "addsrc":
				[imgName, srcName] = args
				if (isRegImg(imgName)) {
					imgName = getImageKey(imgName)
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
				if (isRegImg(imgName))
					setImage(imgName, srcName)
				else
					D.Alert(`Image name ${D.JS(imgName)} is not registered.`, "IMAGES: !img setsrc")
				break
			case "set":
				if (getImageData(args[0]))
					imgObj = getImageObj(args.shift())
				else if (getImageObj(msg))
					imgObj = getImageObj(msg)
				else
					return D.ThrowError("Bad image reference.")
				for (const param of args) {
					params[param.split(":")[0]] = param.split(":")[1]
				}
				setImgParams(imgObj, params)
				break
			case "setlocation":
			case "setloc":
				for (const param of args) {
					if (param.includes(":same")) {
						const targetHost = param.split(":")[0] + "_1",
							targetType = targetHost.includes("District") ? "District" : "Site"
						let imgSrc = getImageSrc(targetHost)
						if (!isImageActive(targetHost))
							switch (targetHost) {
							case "DistrictLeft_1":
							case "SiteLeft_1":
							case "DistrictRight_1":
							case "SiteRight_1":
								imgSrc = getImageSrc(targetType + "Center_1")
								break
							case "DistrictCenter_1":
							case "SiteCenter_1":
								imgSrc = getImageSrc(targetType + "Left_1")
								break
							default: break
							}
						setImage(targetHost, imgSrc)
					} else {
						setImage(...param.split(":"))
					}
				}
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
			case "pos":
			case "position":
				if (D.GetSelected(msg))
					positionImages(msg, ...args)
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
			case "getalldata":
				imgData = _.map(REGISTRY, v => `${v.name}: ${v.startActive ? v.activeLayer.toUpperCase() : v.activeLayer.toLowerCase()} ${_.isObject(v.srcs) ? _.keys(v.srcs) : v.srcs}`)
				D.Alert(D.JS(imgData), "IMAGES, !img getAllData")
				break
			case "getimgnames":
			case "getimagenames":
			case "getnames":
				D.Alert(`<b>IMAGE NAMES:</b><br><br>${D.JS(_.keys(state[D.GAMENAME].Images.registry))}`)
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
					params = args.join("").split(",")
					if (params.length === 1 && IMGDATA[params[0]] ) {
						imgResizeDims.height = IMGDATA[params[0]].h
						imgResizeDims.width = IMGDATA[params[0]].w
					} else if (params.length === 2) {
						_.each(params, v => {
							if (!isNaN(parseInt(v.split(":")[1])))
								imgResizeDims[v.split(":")[0]] = parseInt(v.split(":")[1])
						} )
					} else {
						D.Alert("Must supply either a valid IMGDATA key (token, district, districtLeft, districtRight, site, siteLeft, siteRight) OR \"height:<height>, width:<width>\"", "IMAGES, !img toggleResize")
						imgResize = false
						break
					}
					D.Alert(`New images automatically resized to height: ${imgResizeDims.height}, width: ${imgResizeDims.width}.`, "IMAGES, !img toggleResize")
				} else {
					D.Alert("Image resizing disabled.", "IMAGES, !img toggleResize")
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
		GetKey: getImageKey,
		GetData: getImageData,
		GetSrc: getImageSrc,
		MakeImage: makeImage,
		Register: regImage,
		AddSrc: addImgSrc,
		Remove: removeImage,
		RemoveAll: removeImages,
		Set: setImage,
		Toggle: toggleImage,
		ToggleToken: toggleToken,
		OrderImages: orderImages,
		LayerImages: layerImages,
		IMAGELAYERS: IMAGELAYERS
	}
} )()

on("ready", () => {
	Images.RegisterEventHandlers()
	Images.CheckInstall()
	D.Log("Ready!", "Images")
} )
void MarkStop("Media")