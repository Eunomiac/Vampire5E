/*
?{Name of Query|
   Label 1, ?{value1&#124;
      Label 1A&#44; ?{value1A&amp;#124;
         Label 1Ai&amp;#44; value1Ai &amp;#124;
         Label 1Aii&amp;#44; value1Aii
      &amp;#125; &#124;
      Label 1B&#44; ?{value1B&amp;#124;
         Label 1Bi&amp;#44; value1Bi &amp;#124;
         Label 1Bii&amp;#44; value1Bii
      &amp;#125;
   &#125; |

   Label 2, ?{value2&#124;value2&#125;
}
*/
/* ChatFuncs.js, "ChatFuncs".  No exposure to other scripts in the API.
   >>> ChatFuncs is a library of commands that can be triggered from within roll20 chat.  You can view the properties
   of selected objects and the state variable; run text-sizing tests to be used in scripts like Roller;   is both a
   library of handy resources for other scripts to use, and a master configuration file for your game.  You can find
   a list of all of the available methods at the end of the script.  Configuration is a bit trickier, but is contained
   to the CONFIGURATION and DECLARATIONS #regions. Strictly a utility script: Doesn't set things or return information
   to other API objects --- use DATA and SET for that. */

const Images = (() => {
	/* #region CONFIGURATION
	   state[D.GAMENAME].Images = state[D.GAMENAME].Images || {registry: {} } */
	const STATEREF = state[D.GAMENAME].Images,
		  REGISTRY = STATEREF.registry,
		   IMGDATA = {
			   blank: "https://s3.amazonaws.com/files.d20.io/images/63990142/MQ_uNU12WcYYmLUMQcbh0w/thumb.png?1538455511",
			district: {x: 100, y: 100, h: 400, w: 600},
			    site: {x: 100, y: 100, h: 400, w: 600}
		},
		// #endregion

		// #region GETTERS: Image Object & Data Retrieval
		getImageObj = v => {
			try {
				if (v.selected && D.GetSelected(v)[0].get("type") === "image")
					return D.GetSelected(v)[0]

				return getObj("image", REGISTRY[v].id)
			} catch (errObj) {
				return D.ThrowError(`getImage(${D.JS(v)}) failed: No image registered.<br><br>${D.JS(errObj)}`, "IMAGES: Get")
			}
		},

		getImageData = v => {
			if (_.isString(v) && REGISTRY[v] ) {
				return REGISTRY[v]
			} else if (v !== null && typeof v === "object") {
				const imgObj = (v.selected && D.GetSelected(v)[0] ) || v
				if (imgObj.get("type") !== "image")
					return D.ThrowError(`Object '${imgObj}' is not an image object.`, "IMAGES: GetData")
				for (const name of REGISTRY) {
					if (REGISTRY[name].id === imgObj.id)
						return REGISTRY[name]
				}
			}

			return D.ThrowError(`Cannot locate image with search value '${D.JS(v)}'`, "IMAGES: GetData")
		},
		// #endregion


		// #region SETTERS: Registering & Manipulating Image Objects
		regImage = (imgObj, name, params = {} ) => {
			const cat = params.category || "",
			  imgSrcs = _.pick(params, v => v.startsWith("http"))
			REGISTRY[name] = {
				id: imgObj.id || REGISTRY[name].id,
				name,
				category: cat,
				pos: {
					x: params.x || imgObj.get("left") || REGISTRY[name].x || (IMGDATA[cat] && IMGDATA[cat].x) || 200,
					y: params.y || imgObj.get("top") || REGISTRY[name].y || (IMGDATA[cat] && IMGDATA[cat].y) || 200,
					h: params.h || imgObj.get("height") || REGISTRY[name].h || (IMGDATA[cat] && IMGDATA[cat].h) || 100,
					w: params.w || imgObj.get("width") || REGISTRY[name].w || (IMGDATA[cat] && IMGDATA[cat].w) || 100
				},
				srcs: imgSrcs.length > 0 ? imgSrcs : REGISTRY[name].srcs || {default: (imgObj && imgObj.get("imgsrc")) || IMGDATA.blank, blank: IMGDATA.blank}
			}
			D.Alert(`Image ${D.JS(name)} registered: ${D.JS(REGISTRY[name] )}`, "IMAGES: regImage")

			return true
		},

		addSrcs = (val, params = {} ) => {
			/* Version where you can select an object, have the image source extracted from
			there, and then added to a different image object referenced by name */
			const imgData = getImageData(val)
			Object.assign(REGISTRY[imgData.name].srcs, _.pick(params, v => v.startsWith("http")))
			D.Alert(`Image ${imgData.name} Sources:<br><br>${REGISTRY[imgData.name].srcs}`)
		},
		// #endregion

		// #region Event Handlers (handleInput)
		handleInput = function (msg) {
			if (msg.type !== "api" || !playerIsGM(msg.playerid))
				return

			const args = msg.content.split(/\s+/u)
			let [name, imgObj] = [null, null]
			if (args.shift() !== "!img")
				return

			switch (args.shift().toLowerCase()) {
			case "reg":
			case "register":
				imgObj = getImageObj(msg)
				if (imgObj) {
					name = args.shift()
					if (name === null || args.length !== 1)
						D.Alert("Syntax: !img reg <name> [category:category, imgName:imgSrc, imgName : imgSrc]", "IMAGES, !img reg")
					else
						regImage(imgObj, name, D.ParseToObj(args.join(" ")))
				} else {
					D.Alert("Select an image object first!", "IMAGES, !img reg")
				}
				break
			case "add":
			case "addsrc":
				break
			case "get":
				imgObj = getImageObj(msg)
				if (imgObj) {
					D.Alert(getImageData(imgObj), "IMAGES, !img get")
				} else {
					name = args.shift()
					if (name && REGISTRY[name] )
						D.Alert(D.JS(REGISTRY[name] ), `IMAGES: '${D.JS(name)}'`)
					else
						D.Alert("Syntax: !img get [<category> <name>] (or select an image object)", "IMAGES, !img get")
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