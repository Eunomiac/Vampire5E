var Roller = Roller || (function () {
	'use strict';

	//#region CONFIGURATION: Image Links, Color Schemes
	const POSITIONS = {
		diceFrame: { top: 207, left: 175 },
		bloodCloudFX: {top: 185, left: 74.75 },
		bloodBoltFX: { top: 185, left: 74.75 },
		smokeBomb: { top: 301, left: 126 }
	};
	const IMAGES = {
		dice: {
			blank: "https://s3.amazonaws.com/files.d20.io/images/63990142/MQ_uNU12WcYYmLUMQcbh0w/thumb.png?1538455511",
			selected: "https://s3.amazonaws.com/files.d20.io/images/64173198/T0qdnbmLUCnrs9WlxoGwww/thumb.png?1538710883",
			Bf: "https://s3.amazonaws.com/files.d20.io/images/64173205/DOUwwGcobI4eyu1Wb8ZDxg/thumb.png?1538710883",
			Bs: "https://s3.amazonaws.com/files.d20.io/images/64173203/ZS04TJE6VRI8_Q-HaJ0r4g/thumb.png?1538710883",
			Bc: "https://s3.amazonaws.com/files.d20.io/images/64173206/Fbt_6j-k_1oRKPxTKdnIWQ/thumb.png?1538710883",
			BcL: "https://s3.amazonaws.com/files.d20.io/images/64173208/cIP4B1Y14gVdYrS3YPYNbQ/thumb.png?1538710883",
			BcR: "https://s3.amazonaws.com/files.d20.io/images/64173199/1thrJQz9Hmzv0tQ6awSOGw/thumb.png?1538710883",
			Hb: "https://s3.amazonaws.com/files.d20.io/images/64173201/mYkpkP6l9WX9BKt5fjTrtw/thumb.png?1538710883",
			Hf: "https://s3.amazonaws.com/files.d20.io/images/64173204/AacOfDpF2jMCn1pYPmqlUQ/thumb.png?1538710882",
			Hs: "https://s3.amazonaws.com/files.d20.io/images/64173209/D_4ljxj59UYXPNmgXaZbhA/thumb.png?1538710883",
			Hc: "https://s3.amazonaws.com/files.d20.io/images/64173202/xsEkLc9DcOslpQoUJwpHMQ/thumb.png?1538710883",
			HcL: "https://s3.amazonaws.com/files.d20.io/images/64173200/cBsoLkAu15XWexFSNUxoHA/thumb.png?1538710883",
			HcR: "https://s3.amazonaws.com/files.d20.io/images/64173207/Se7RHT2fJDg2qMGo_x5UhQ/thumb.png?1538710883"
		},
		blank: "https://s3.amazonaws.com/files.d20.io/images/63990142/MQ_uNU12WcYYmLUMQcbh0w/thumb.png?1538455511",
		diffFrame: "https://s3.amazonaws.com/files.d20.io/images/64184544/CnzRwB8CwKGg-0jfjCkT6w/thumb.png?1538736404",
		frontFrame: "https://s3.amazonaws.com/files.d20.io/images/64756368/mUTW1L_8xESxARXGKBm6cw/thumb.png?1539408973",
		topMids: ["https://s3.amazonaws.com/files.d20.io/images/64683716/nPNGOLxzJ8WU0BzLNisuwg/thumb.png?1539327926", "https://s3.amazonaws.com/files.d20.io/images/64683714/VPzeYN8xpO_cPmqg1rgFRQ/thumb.png?1539327926", "https://s3.amazonaws.com/files.d20.io/images/64683715/xUCVS7pOmfS3ravsS2Vzpw/thumb.png?1539327926"],
		bottomMids: ["https://s3.amazonaws.com/files.d20.io/images/64683769/yVNOcNMVgUjGybRBVq3rTQ/thumb.png?1539328057", "https://s3.amazonaws.com/files.d20.io/images/64683709/8JFF_j804fT92-JBncWJyw/thumb.png?1539327927", "https://s3.amazonaws.com/files.d20.io/images/64683711/upnHr36sBnFYuQpkxoVm_A/thumb.png?1539327926" ],
		topEnd: "https://s3.amazonaws.com/files.d20.io/images/64683713/4IwPjcY7x5ZCLJ9ey2lICA/thumb.png?1539327926",
		bottomEnd: "https://s3.amazonaws.com/files.d20.io/images/64683710/rJDVNhm6wMNhmQx1uIp13w/thumb.png?1539327926"
	};
	const STATECATS = {
		dice: ["diceList", "bigDice"],
		graphic: ["imgList", "diceList", "bigDice"],
		text: ["textList"],
		path: ["shapeList"]
	};
	const COLORS = {
		white: "rgb(255, 255, 255)",
		brightgrey: "rgb(175, 175, 175)",
		grey: "rgb(130, 130, 130)",
		darkgrey: "rgb(80, 80, 80)",
		brightred: "rgb(255, 0, 0)",
		red: "rgb(200, 0, 0)",
		darkred: "rgb(150, 0, 0)",
		green: "rgb(0, 200, 0)",
		yellow: "rgb(200, 200, 0)",
		orange: "rgb(200, 100, 0)",
		brightpurple: "rgb(200, 0, 200)",
		purple: "rgb(150, 0, 150)",
		darkpurple: "rgb(100, 0, 100)",
		brightblue: "rgb(150, 150, 255)",
		blue: "rgb(100, 100, 255)",
		darkblue: "rgb(50, 50, 150)",
		cyan: "rgb(0, 255, 255)"
	}
	const COLORSCHEMES = {
		trait: {
			rollerName: COLORS.white,
			mainRoll: COLORS.white,
			posMods: COLORS.white,
			negMods: COLORS.brightred,
			summary: COLORS.white,
			difficulty: COLORS.white,
			resultCount: COLORS.white,
			margin: {
				good: COLORS.white,
				bad: COLORS.brightred
			},
			outcome: {
				best: COLORS.white,
				good: COLORS.white,
				bad: COLORS.orange,
				worst: COLORS.brightred,
			}
		},
		willpower: {
			rollerName: COLORS.white,
			mainRoll: COLORS.white,
			posMods: COLORS.white,
			negMods: COLORS.brightred,
			summary: COLORS.white,
			difficulty: COLORS.white,
			resultCount: COLORS.white,
			margin: {
				good: COLORS.white,
				bad: COLORS.brightred
			},
			outcome: {
				best: COLORS.white,
				good: COLORS.white,
				bad: COLORS.orange,
				worst: COLORS.brightred,
			}
		},
		humanity: {
			rollerName: COLORS.white,
			mainRoll: COLORS.white,
			posMods: COLORS.white,
			negMods: COLORS.brightred,
			summary: COLORS.white,
			difficulty: COLORS.white,
			resultCount: COLORS.white,
			margin: {
				good: COLORS.white,
				bad: COLORS.brightred
			},
			outcome: {
				best: COLORS.white,
				good: COLORS.white,
				bad: COLORS.orange,
				worst: COLORS.brightred,
			}
		},
		frenzy: {
			rollerName: COLORS.white,
			mainRoll: COLORS.white,
			posMods: COLORS.white,
			negMods: COLORS.brightred,
			summary: COLORS.white,
			difficulty: COLORS.white,
			resultCount: COLORS.white,
			outcome: {
				best: COLORS.white,
				good: COLORS.white,
				bad: COLORS.orange,
				worst: COLORS.brightred,
			}
		},
		remorse: {
			rollerName: COLORS.white,
			mainRoll: COLORS.white,
			summary: COLORS.white,
			difficulty: COLORS.white,
			resultCount: COLORS.white,
			outcome: {
				best: COLORS.white,
				good: COLORS.white,
				bad: COLORS.orange,
				worst: COLORS.brightred,
			}
		},
		rouse: {
			rollerName: COLORS.white,
			mainRoll: COLORS.white,
			outcome: {
				best: COLORS.white,
				good: COLORS.white,
				bad: COLORS.brightred,
				worst: COLORS.brightred,
			}
		},
		rouse2: {
			rollerName: COLORS.white,
			mainRoll: COLORS.white,
			outcome: {
				best: COLORS.white,
				good: COLORS.white,
				bad: COLORS.brightred,
				worst: COLORS.brightred,
			}
		},
		check: {
			rollerName: COLORS.white,
			mainRoll: COLORS.white,
			outcome: {
				best: COLORS.white,
				good: COLORS.white,
				bad: COLORS.brightred,
				worst: COLORS.brightred,
			}
		},
	};
	const CHATSTYLES = {
		fullBox: "<div style=\"display: block; width: 250px; padding: 5px 5px; margin-left: -38px; margin-top: -22px; margin-bottom: -5px; color: white; font-variant: small-caps; font-family: 'Bodoni SvtyTwo ITC TT'; text-align: left; font-size: 16px;  border: 3px outset darkred; background: url('https://imgur.com/kBl8aTO.jpg') center no-repeat;\">",
		rollerName: "<div style=\"display: block; width: 100%; font-size: 12px; height: 10px; padding: 3px 0px; border-bottom: 1px solid white;\">",
		mainRoll: "<div style=\"display: block; width: 100%; height: auto; padding: 3px 0px; border-bottom: 1px solid white;\"><span style=\"display: block; height: 16px; line-height: 16px; width: 100%; font-size: 14px;\">",
		mainRollSub: "<span style=\"display: block; height: 12px; line-height: 12px; width: 100%; margin-left: 24px; font-size: 10px; font-variant: italic;\">",
		check: "<div style=\"display: block; width: 100%; height: auto; padding: 3px 0px; border-bottom: 1px solid white;\"><span style=\"display: block; height: 20px;  line-height: 20px; width: 100%; margin-left: 10%;\">",
		summary: "<div style=\"display: block; width: 100%; padding: 3px 0px; height: auto; \"><span style=\"display: block; height: 16px; width: 100%; margin-left: 5%; line-height: 16px; font-size: 14px;\">",
		resultCount: "<span style=\"display: inline-block; font-weight: normal; font-family: Verdana; text-shadow: none; height: 24px; line-height: 24px; vertical-align: middle; width: 30px; text-align: right; margin-right: 10px; font-size: 12px;\">",
		margin: "<span style=\"display: inline-block; font-weight: normal; font-family: Verdana; text-shadow: none; height: 24px; line-height: 24px; vertical-align: middle; width: 30px; text-align: left; margin-left: 10px; font-size: 12px;\">",
		outcomeRed: "<div style=\"display: block; width: 100%; height: 20px; line-height: 20px; text-align: center; font-weight: bold;\"><span style=\"color: red; display: block; width: 100%;  font-size: 22px; font-family: 'Bodoni SvtyTwo ITC TT';\">",
		outcomeOrange: "<div style=\"display: block; width: 100%; height: 20px; line-height: 20px; text-align: center; font-weight: bold;\"><span style=\"color: orange; display: block; width: 100%;  font-size: 22px; font-family: 'Bodoni SvtyTwo ITC TT';\">",
		outcomeWhite: "<div style=\"display: block; width: 100%; height: 20px; line-height: 20px; text-align: center; font-weight: bold;\"><span style=\"color: white; display: block; width: 100%;  font-size: 22px; font-family: 'Bodoni SvtyTwo ITC TT';\">",
		resultDice: { //♦◊
			start: "<div style=\"display: block; width: 100%; height: 24px; line-height: 20px; text-align: center; font-weight: bold; text-shadow: 0px 0px 2px white, 0px 0px 2px white, 0px 0px 2px white, 0px 0px 2px white; margin-bottom: 5px;\">",
			BcL: "<span style=\"margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: white; display: inline-block; font-size: 18px; font-family: 'Arial';\">♦</span><span style=\"width: 10px; text-align: center; height: 20px; vertical-align: middle; color: white; display: inline-block; font-size: 16px; font-family: 'Arial'; margin-left: -5px; text-shadow: none; \">+</span>",
			BcR: "<span style=\"width: 10px; text-align: center; height: 20px; vertical-align: middle; color: white; display: inline-block; font-size: 16px; font-family: 'Arial'; margin-left: -5px; margin-right: -3px; text-shadow: none; \">+</span><span style=\"margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: white; display: inline-block; font-size: 18px; font-family: 'Arial';\">♦</span>",
			HcL: "<span style=\"margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: red; display: inline-block; font-size: 18px; font-family: 'Arial';\">♦</span><span style=\"width: 10px; text-align: center; height: 20px; vertical-align: middle; color: red; display: inline-block; font-size: 16px; font-family: 'Arial'; margin-left: -5px; text-shadow: none; \">+</span>",
			HcR: "<span style=\"width: 10px; text-align: center; height: 20px; vertical-align: middle; color: red; display: inline-block; font-size: 16px; font-family: 'Arial'; margin-left: -5px; margin-right: -3px; text-shadow: none; \">+</span><span style=\"margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: red; display: inline-block; font-size: 18px; font-family: 'Arial';\">♦</span>",
			Bc: "<span style=\"margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: white; display: inline-block; font-size: 18px; font-family: 'Arial';\">♦</span>",
			Hc: "<span style=\"margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: red; display: inline-block; font-size: 18px; font-family: 'Arial';\">♦</span>",
			Bs: "<span style=\"margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle; color: white; display: inline-block; font-size: 18px; font-family: 'Arial';\">■</span>",
			Hs: "<span style=\"margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle;color: red; display: inline-block; font-size: 18px; font-family: 'Arial';\">■</span>",
			Bf: "<span style=\"margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle;color: white; display: inline-block; font-size: 18px; font-family: 'Arial'; text-shadow: none;\">■</span><span style=\"margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle;color: black; display: inline-block; margin-left: -12px; font-size: 18px; font-family: 'Arial'; margin-bottom: -4px; text-shadow: none;\">×</span>",
			Hf: "<span style=\"margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle;color: red; display: inline-block; font-size: 18px; font-family: 'Arial'; text-shadow: none;\">■</span><span style=\"margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle;color: black; display: inline-block; margin-left: -12px; font-size: 18px; font-family: 'Arial'; margin-bottom: -4px; text-shadow: none;\">×</span>",
			Hb: "<span style=\"margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle; color: black; display: inline-block; font-size: 18px; font-family: 'Arial'; text-shadow: 0px 0px 2px red, 0px 0px 2px red, 0px 0px 2px red, 0px 0px 2px red, 0px 0px 2px red, 0px 0px 2px red, 0px 0px 2px red, 0px 0px 2px red, 0px 0px 2px red, 0px 0px 2px red, 0px 0px 2px red, 0px 0px 2px red; line-height: 22px;\">♠</span>"
		}
	}
	var isRerollFXOn = false;
	var rerollFX;
	//#endregion

	//#region Build Dice Frame
	const initFrame = function () {
		var imageList = [];
		imageList.push(makeImg(
			"frontFrame",
			IMAGES.frontFrame,
			POSITIONS.diceFrame.top,
			POSITIONS.diceFrame.left,
			333,
			300));
		for (var i = 0; i < 9; i++) {
			imageList.push(makeImg(
				"topMid" + i,
				IMAGES.topMids[i - 3 * Math.floor(i / 3)],
				POSITIONS.diceFrame.top - 116.5,
				POSITIONS.diceFrame.left + 75 + (75 * i),
				101,
				300));
			imageList.push(makeImg(
				"bottomMid" + i,
				IMAGES.bottomMids[i - 3 * Math.floor(i / 3)],
				POSITIONS.diceFrame.top + 45,
				POSITIONS.diceFrame.left + 75 + (75 * i),
				233,
				300));
		}
		imageList.push(makeImg(
			"topEnd",
			IMAGES.topEnd,
			POSITIONS.diceFrame.top - 116.5,
			POSITIONS.diceFrame.left + 75 + (75 * 9),
			101,
			300));
		imageList.push(makeImg(
			"bottomEnd",
			IMAGES.bottomEnd,
			POSITIONS.diceFrame.top + 45,
			POSITIONS.diceFrame.left + 75 + (75 * 9),
			233,
			300));
		imageList.reverse();
		//log(JSON.stringify(imageList));
		//return;
		for (var i = 0; i < imageList.length; i++) {
			toBack(imageList[i]);
		}
		toBack(getObj("graphic", state[D.GAMENAME].Roller.imgList.Background.id));
		return;
	};

	const scaleFrame = function (row, width) {
		var stretchWidth = Math.max(width, 120);
		var imgs = [getObj("graphic", state[D.GAMENAME].Roller.imgList[row + "End"].id)];
		var blanks = [];
		var midCount = 0;
		while (stretchWidth > (225 * (imgs.length - 1))) {
			imgs.push(getObj("graphic", state[D.GAMENAME].Roller.imgList[row + "Mid" + midCount].id));
			midCount++;
			if (midCount >= IMAGES[row + "Mids"].length * 3) {
				//D.Alert("Need " + (midCount - imgs.length + 2) + " more mid sections for " + row);
				break;
			}
		}
		while (midCount < IMAGES[row + "Mids"].length * 3) {
			blanks.push(getObj("graphic", state[D.GAMENAME].Roller.imgList[row + "Mid" + midCount].id));
			midCount++;
		}
		var stretchPer = stretchWidth / imgs.length;
		log(row + " stretchWidth: " + stretchWidth + ", imgs Length: " + imgs.length + ", x225: " + (imgs.length * 225) + ", stretch per: " + stretchPer);
		log(row + " midCount: " + midCount + ", blanks length: " + blanks.length);
		var endImg = imgs.shift();
		var left = POSITIONS.diceFrame.left + 120;
		log(row + "Start at " + POSITIONS.diceFrame.left + ", + 120 to " + left);
		for (var i = 0; i < imgs.length; i++) {
			log("Setting " + row + "Mid" + i + " to " + left);
			imgs[i].set({
				left: left,
				imgsrc: IMAGES[row + "Mids"][i - 3 * Math.floor(i / 3)],
			});
			left += stretchPer;
		}
		log("Setting " + row + "End to " + left);
		endImg.set("left", left);
		for (var i = 0; i < blanks.length; i++) {
			log("Blanking Img #" + imgs.length + i);
			blanks[i].set("imgsrc", IMAGES.blank);;
		}
	}
	//#endregion

	//#region Graphic & Text Control
	const makeImg = function (name, imgsrc, top, left, height, width) {
		var img = createObj("graphic", {
			_pageid: D.PAGEID(),
			imgsrc: imgsrc,
			top: top,
			left: left,
			width: width,
			height: height,
			layer: "map",
			isdrawing: true
		});
		registerImg(img, name);
		toFront(img);
		return img;
	};

	const reposition = function (sel) {
		if (sel == null)
			return;
		_.each(sel, function (s) {
			let obj = findObjs({ _id: s._id })[0];
			_.find(_.pick(state[D.GAMENAME].Roller, STATECATS[obj.get("type")]), function (v1, k1) {
				return _.find(v1, function (v2, k2) {
					if (v2.id == obj.id) {
						state[D.GAMENAME].Roller[k1][k2].left = obj.get("left");
						state[D.GAMENAME].Roller[k1][k2].top = obj.get("top");
						state[D.GAMENAME].Roller[k1][k2].height = obj.get("height");
						state[D.GAMENAME].Roller[k1][k2].width = obj.get("width");
						D.Alert("Repositioned '" + obj.id + "' at [" + D.JS(k1) + "/" + D.JS (k2) + "] to: " + D.JS(state[D.GAMENAME].Roller[k1][k2]), "ROLLER: reposition()");
						return true;
					} else
						return false;
				});
			});
		});
		return;
	};

	const registerDie = function (obj, category, isResetting) {
		category = category || "diceList";
		state[D.GAMENAME].Roller[category] = isResetting ? [] : state[D.GAMENAME].Roller[category] || [];
		if (obj == null)
			return;
		obj.set({
			imgsrc: IMAGES.dice.blank,
			layer: "map",
			isdrawing: true,
			name: "rollerDie_" + state[D.GAMENAME].Roller[category].length + "_" + category,
			controlledby: ""
		});
		state[D.GAMENAME].Roller[category].push({
			id: obj.id,
			top: obj.get("top"),
			left: obj.get("left"),
			width: obj.get("width")
		});
		WigglePads.MakePad(obj, "selectDie", "height:-28 width:-42 x:0 y:0");
		D.Alert("Registered die #" + state[D.GAMENAME].Roller[category].length + ": " + D.JS(state[D.GAMENAME].Roller[category]) + ", Added WigglePad #" + _.values(state[D.GAMENAME].WigglePads.byPad).length, "ROLLER: registerDie()");
		return;
	};

	const registerText = function (obj, objName, params) {
		params = params || {};
		state[D.GAMENAME].Roller.textList = params.isResetting ? {} : state[D.GAMENAME].Roller.textList || {};
		if (obj == null)
			return;
		obj.set({
			layer: "map",
			name: "rollerText_" + objName,
			controlledby: ""
		});
		state[D.GAMENAME].Roller.textList[objName] = {
			id: obj.id,
			top: obj.get("top"),
			left: obj.get("left"),
			height: obj.get("height"),
			width: obj.get("width")
		}
		D.Alert("Registered text box '" + objName + ": " + D.JS(state[D.GAMENAME].Roller.textList), "ROLLER: registerText()");
		return;
	};

	const registerImg = function (obj, objName, params) {
		params = params || {};
		if (_.isString(params)) {
			let kvpairs = params.split(",");
			params = { images: [] };
			_.each(kvpairs, function (kvp) {
				if (kvp.includes("|")) {
					let kv = kvp.split("|");
					params[kv[0]] = kv[1];
				} else
					params.images.push(kvp);
			});
		}
		if (state[D.GAMENAME].Roller.imgList[objName]) {
			let remObj = getObj("graphic", state[D.GAMENAME].Roller.imgList[objName].id);
			if (remObj)
				remObj.remove();
		}
		if (obj == null)
			return;
		obj.set({
			layer: "map",
			name: "rollerImage_" + objName,
			controlledby: ""
		});
		state[D.GAMENAME].Roller.imgList[objName] = {
			id: obj.id,
			top: obj.get("top"),
			left: obj.get("left"),
			height: obj.get("height"),
			width: obj.get("width"),
			imgsrc: params.images && params.images[0] || obj.get("imgsrc"),
			images: params.images || [obj.get("imgsrc")]
		};
		D.Alert("Registered image '" + objName + ": " + D.JS(state[D.GAMENAME].Roller.imgList), "ROLLER: registerImg()");
		return;
	};

	const registerShape = function (obj, objName, params) {
		params = params || {};
		state[D.GAMENAME].Roller.shapeList = params.isResetting ? {} : state[D.GAMENAME].Roller.shapeList || {};
		if (obj == null)
			return;
		obj.set({
			layer: "map",
			name: "rollerShape_" + objName,
			controlledby: ""
		});
		state[D.GAMENAME].Roller.shapeList[objName] = {
			id: obj.id,
			type: obj.get("_type"),
			subType: params.subType || "line",
			top: obj.get("top"),
			left: obj.get("left"),
			height: obj.get("height"),
			width: obj.get("width")
		};
		D.Alert("Registered shape '" + objName + ": " + D.JS(state[D.GAMENAME].Roller.shapeList), "ROLLER: registerShape()");
		return;

	}

	const setDie = function (dieNum, dieCat, dieVal, params) {
		params = params || {};
		dieCat = dieCat || "diceList";
		var dieParams = {
			id: state[D.GAMENAME].Roller[dieCat][dieNum].id
		};
		var die = getObj("graphic", dieParams.id);
		if (!die) {
			return D.ThrowError("ROLLER: SETDIE(" + dieNum + ", " + dieCat + ", " + dieVal + ") >> No die registered.");
		}
		if (dieVal !== "selected") {
			state[D.GAMENAME].Roller[dieCat][dieNum].value = dieVal;
			state[D.GAMENAME].Roller.selected[dieCat] = _.without(state[D.GAMENAME].Roller.selected[dieCat], dieNum);
		}
		if (dieVal == "blank" || dieVal.includes("H"))
			WigglePads.Set(dieParams.id, { layer: "map" });
		else
			WigglePads.Set(dieParams.id, { layer: "objects" });
		dieParams.imgsrc = IMAGES.dice[dieVal];
		_.each(["top", "left", "width"], function(dir) {
			if (die.get(dir) != state[D.GAMENAME].Roller[dieCat][dieNum][dir] || (params.shift && params.shift[dir]))
				dieParams[dir] = state[D.GAMENAME].Roller[dieCat][dieNum][dir] + (params.shift && params.shift[dir] ? params.shift[dir] : 0);
		});
		//D.DB("Setting '" + D.JSL(dieVal) + "' in " + D.JSL(dieCat) + " to '" + D.JSL(dieParams) + "'", "ROLLER: setDie()", 4);
		die.set(dieParams);
		return die;
	};

	const selectDie = function (dieNum, dieCat) {
		if (state[D.GAMENAME].Roller.selected[dieCat].includes(dieNum)) {
			setDie(dieNum, dieCat, state[D.GAMENAME].Roller[dieCat][dieNum].value);
			state[D.GAMENAME].Roller.selected[dieCat] = _.without(state[D.GAMENAME].Roller.selected[dieCat], dieNum);
		} else {
			setDie(dieNum, dieCat, "selected");
			state[D.GAMENAME].Roller.selected[dieCat].push(dieNum);
			if (state[D.GAMENAME].Roller.selected[dieCat].length > 3)
				selectDie(state[D.GAMENAME].Roller.selected[dieCat][0], dieCat);
		}
		if (state[D.GAMENAME].Roller.selected[dieCat].length > 0 && !isRerollFXOn) {
			isRerollFXOn = true;
			D.RunFX("bloodCloud", POSITIONS.bloodCloudFX);
			rerollFX = setInterval(D.RunFX, 1800, "bloodCloud", POSITIONS.bloodCloudFX);
		} else if (state[D.GAMENAME].Roller.selected[dieCat].length == 0) {
			isRerollFXOn = false;
			clearInterval(rerollFX);
			rerollFX = null;
		}
	};

	const setImg = function (objName, image) {
		let obj = getObj("graphic", state[D.GAMENAME].Roller.imgList[objName].id);
		if (!obj)
			return D.ThrowError("ROLLER: SETIMG(" + objName + ") >> No such image registered.");
		//D.DB("Setting image '" + D.JSL(objName) + "' to " + D.JSL(image) + " = '" + D.JSL(IMAGES[image]) + "'", "ROLLER: setImg()", 4);
		obj.set("imgsrc", IMAGES[image]);
		return;
	}

	const blankAllDice = function () {
		_.each(STATECATS.dice, function (cat) {
			_.each(_.keys(state[D.GAMENAME].Roller[cat]), function (die) {
				setDie(die, cat, "blank");
			});
		});
		return;
	};

	const setText = function (objName, params) {
		if (!state[D.GAMENAME].Roller.textList[objName])
			return D.ThrowError("No text object registered with name '" + D.JS(objName) + "'.", "ROLLER: setText()");
		let obj = getObj("text", state[D.GAMENAME].Roller.textList[objName].id);
		if (!obj)
			return D.ThrowError("Failure to recover object '" + D.JS(objName) + "': " + D.JS(state[D.GAMENAME].Roller.textList), "ROLLER: setText()");
		var width = state[D.GAMENAME].Roller.textList[objName].width;
		var left = state[D.GAMENAME].Roller.textList[objName].left;
		if (params.justified && params.justified == "left") {
			params.width = D.GetTextWidth(obj, params.text);
			params.left = left + params.width / 2 - width / 2;
		} else if (params.justified && params.justified == "center")
			params.left = left;
		if (params.shift) {
			let anchorObj = getObj("text", state[D.GAMENAME].Roller.textList[params.shift.anchor].id);
			let anchorWidth = parseInt(anchorObj.get("width"));
			let anchorLeft = parseInt(anchorObj.get("left"));
			switch (params.shift.anchorSide) {
				case "right":
					params.left = anchorLeft + (0.5 * anchorWidth) + (0.5 * params.width) + parseInt(params.shift.amount);
					//D.DB("Shifting " + D.JSL(objName) + " right by " + D.JSL(params.shift.amount) + " from " + D.JSL(anchorLeft) + " to " + D.JSL(params.left), "ROLLER: setText()", 2);
					break;
			}
		}
		if (_.isNaN(params.left) || _.isNaN(params.width))
			return D.ThrowError("Bad left or width given for '" + D.JS(objName) + "': " + D.JS(params), "ROLLER: setText()");
		obj.set(_.omit(params, ["justified", "shift"]));
		return params;
	};

	const setColor = function (line, type, params, level) {
		if (!COLORSCHEMES[type])
			D.ThrowError("No Color Scheme for type '" + D.JS(type) + "'");
		else if (!COLORSCHEMES[type][line])
			D.ThrowError("No Color Scheme for line '" + D.JS(line) + "' in '" + D.JS(type) + "'");
		else if (level && !COLORSCHEMES[type][line][level])
			D.ThrowError("No Level '" + D.JS(level) + "' for '" + D.JS(line) + "' in '" + D.JS(type) + "'");
		else if (!level && !_.isString(COLORSCHEMES[type][line]))
			D.ThrowError("Must provide Level for '" + D.JS(line) + "' in '" + D.JS(type) + "'");
		else
			params.color = level ? COLORSCHEMES[type][line][level] : COLORSCHEMES[type][line];
		return params;
	}

	//#endregion

	//#region Getting Information (Specialty)
	const getSpecialty = function (charObj, skillName) {
		const attrTypeObjs = filterObjs(function (obj) {
			if (obj.get("_type") === "attribute"
				&& obj.get("_characterid") === charObj.id
				&& obj.get("name").includes("spec")
				&& obj.get("name").includes(skillName))
				return true;
			else return false;
		});
		let attrLabels = [];
		if (attrTypeObjs.length === 0)
			return false;
		else {
			_.each(attrTypeObjs, function (attrTypeObj) {
				attrLabels.push(filterObjs(function (obj) {
					if (obj.get("_type") === "attribute"
						&& obj.get("_characterid") == charObj.id
						&& obj.get("name").includes(attrTypeObj.get("name").replace("type", "label")))
						return true;
					else return false;
				})[0].get("current"));
			});
		}
		//D.DB("Spec AttrLabels = " + D.JSL(attrLabels) + ", Returning: '" + D.JSL(attrLabels.join("sss|").split("|")) + "'", "ROLLER: getSpecialty()", 3);
		return attrLabels.join("sss|").split("|");
	};

	const getRollParams = function (charObj) {
		var attrs = {
			hunger: parseInt(getAttrByName(charObj.id, "Hunger")),
			diff: parseInt(getAttrByName(charObj.id, "rollDiff")),
			mod: parseInt(getAttrByName(charObj.id, "rollMod")),
			flags: []
		};
		if (parseInt(getAttrByName(charObj.id, "applySpecialty")) > 0)
			attrs.flags.push("S");
		if (parseInt(getAttrByName(charObj.id, "applyBloodSurge")) > 0)
			attrs.flags.push("B" + D.BLOODPOTENCY[parseInt(getAttrByName(charObj.id, "BloodPotency")) || 0].bloodSurge);
		if (parseInt(getAttrByName(charObj.id, "applyDiscipline")) > 0)
			attrs.flags.push("D" + D.BLOODPOTENCY[parseInt(getAttrByName(charObj.id, "BloodPotency")) || 0].bloodDiscBonus);
		if (parseInt(getAttrByName(charObj.id, "applyResonant")) > 0)
			attrs.flags.push("R");
		attrs.flags = _.compact(_.union(attrs.flags, getAttrByName(charObj.id, "incapacitation").split(",")));
		//D.DB("FLAG ATTRS: " + D.JSL(attrs), "ROLLER: getRollParams()", 3);
		return attrs;
	};
	//#endregion

	//#region Rolling Dice & Formatting Result

	const makeGroupSheetRoll = function (rollType, params) {
		D.DB("RECEIVED PARAMS: " + D.JSL(params), "ROLLER: makeGroupSheetRoll()", 1);
		var rollData = {
			charName: params[0],
			type: rollType,
			traitData: [],
			hunger: parseInt(params[2]) || 0,
			diff: parseInt(params[3]) || 0,
			mod: parseInt(params[4]) || 0,
			posFlagLines: [],
			negFlagLines: [],
			dicePool: 0,
			hungerPool: 0,
			basePool: 0
		}

		D.DB("ROLL DATA: " + D.JSL(rollData), "ROLLER: makeGroupSheetRoll()", 1);

		_.each(params[1].split(","), function (t) {
			let tData = t.split(":");
			if (tData[0] && tData[0] != "") {
				rollData.traitData.push([tData[0], parseInt(tData[1] || 0)]);
				rollData.dicePool += parseInt(tData[1] || 0);
			}
		});

		if (params[5].split(",").length > 0) {
			_.each(params[5].split(","), function (f) {
				let fData = f.split(":");
				if (fData[0] && fData[0] != "" && fData[0].charAt(0).toLowerCase() != "x") {
					rollData.posFlagLines.push(fData[0] + " (" + "●".repeat(parseInt(fData[1] || 1)) + ")");
					rollData.dicePool += Math.abs(parseInt(fData[1] || 1));
				}
			});
		}

		if (params[6].split(",").length > 0) {
			_.each(params[6].split(","), function (f) {
				let fData = f.split(":");
				if (fData[0] && fData[0] != "" && fData[0].charAt(0).toLowerCase() != "x") {
					rollData.negFlagLines.push(fData[0] + " (" + "●".repeat(Math.abs(parseInt(fData[1] || 2))) + ")");
					rollData.dicePool -= Math.abs(parseInt(fData[1] || 2));
				}
			});
		}

		switch (rollData.type) {
			case "rouse2":
				rollData.dicePool = 2;
				rollData.hungerPool = 2;
				rollData.basePool = 0;
				break;
			case "rouse":
				rollData.dicePool = 1;
				rollData.hungerPool = 1;
				rollData.basePool = 0;
				break;
			case "check":
				rollData.dicePool = 1;
				rollData.hungerPool = 0;
				rollData.basePool = 1;
				break;
			default:
				rollData.dicePool = Math.max(0, rollData.dicePool + rollData.mod);
				rollData.hungerPool = Math.min(rollData.hunger, Math.max(1, rollData.dicePool));
				rollData.basePool = Math.max(1, rollData.dicePool) - rollData.hungerPool;
				break;
		};

		D.DB("ROLL DATA: " + D.JSL(rollData), "ROLLER: makeGroupSheetRoll()", 2);

		var rollResults = rollDice(rollData);

		D.DB("ROLL RESULTS: " + D.JSL(rollResults), "ROLLER: makeGroupSheetRoll()", 2);

		applyRoll(rollData, rollResults, true);
	}

	const makeSheetRoll = function (charObj, rollType, params) {
		D.DB("RECEIVED PARAMS: " + D.JSL(params), "ROLLER: makeSheetRoll()", 2);
		var rollParams = getRollParams(charObj);
		if (rollType == "frenzy")
			rollParams.diff = parseInt(params[1]) || rollParams.diff;
		rollParams.charName = charObj.get("name");
		rollParams.charID = charObj.id;
		rollParams.type = rollType;
		rollParams.traits = params[0].split(",");
		D.DB("FINAL PARAMS: " + D.JSL(rollParams), "ROLLER: makeSheetRoll()", 2);

		var rollData = Object.assign({
			dicePool: 0,
			hungerPool: 0,
			basePool: 0
		}, rollParams);

		var repTraits = [];
		switch (rollType) {
			case "remorse":
				rollParams.diff = 0;
				rollParams.mod = 0;
			case "humanity":
				repTraits.push("Humanity");
			case "frenzy":
			case "willpower":
				rollParams.traits = repTraits.length == 0 ? ["Willpower"] : repTraits;
				rollParams.hunger = 0;
				rollParams.flags = [];
				break;
		};

		Object.assign(rollData, rollTraits(charObj, rollParams));

		D.DB("ROLL DATA: " + D.JSL(rollData), "ROLLER: makeSheetRoll()", 2);

		var rollResults = rollDice(rollData);

		D.DB("ROLL RESULTS: " + D.JSL(rollResults), "ROLLER: makeSheetRoll()", 2);

		applyRoll(rollData, rollResults);
	};

	const rollTraits = function (charObj, params) {
		var rollData = {
			dicePool: 0,
			basePool: 0,
			hungerPool: 0
		};
		Object.assign(rollData, params);
		switch (rollData.type) {
			case "rouse2":
				rollData.dicePool++;
				rollData.hungerPool++;
			case "rouse":
				rollData.hungerPool++;
				rollData.basePool--;
			case "check":
				rollData.dicePool++;
				rollData.basePool++;
				return rollData;
				break;
			case "frenzy":
				rollData.traits.push("Humanity");
			default:
				rollData.dicePool = rollData.mod;
				rollData.posFlagLines = [];
				rollData.negFlagLines = [];
				rollData.traitData = {};
				break;
		};

		if (rollData.traits.length == 0 && rollData.dicePool <= 0) {
			D.Chat(D.GetPlayerID(charObj), "You have no dice to roll!", "ERROR: Dice Roller");
			return false;
		}

		var specialties = [];
		_.each(rollData.traits, function (trt) {
			rollData.traitData[trt] = {
				display: D.IsIn(trt) || D.IsIn(getAttrByName(charObj.id, trt + "_name")),
				value: parseInt(getAttrByName(charObj.id, trt)) || 0
			};
			if (rollData.type == "frenzy" && trt == "Humanity") {
				rollData.traitData.Humanity.display = "⅓ Humanity";
				rollData.traitData.Humanity.value = Math.floor(rollData.traitData.Humanity.value / 3);
			} else if (rollData.type == "remorse" && trt == "Humanity") {
				rollData.traitData.Humanity.display = "Human Potential";
				rollData.traitData.Humanity.value = 10 - rollData.traitData.Humanity.value - (parseInt(getAttrByName(charObj.id, "Stains")) || 0);
			} else {
				if (rollData.flags.includes("S")) {
					_.each(getSpecialty(charObj, trt), function (spec) {
						specialties.push(spec);
					});
				}
				if (!rollData.traitData[trt].display) {
					D.Chat(D.GetPlayerID(charObj), "Error determining NAME of trait '" + D.JS(trt) + "'.", "ERROR: Dice Roller");
					return false;
				};
			};
			rollData.dicePool += rollData.traitData[trt].value;
		});

		if (specialties.length > 0) {
			rollData.posFlagLines.push("Specialty: " + specialties.join(", ") + " (●)");
			rollData.dicePool++;
		}

		_.each(rollData.flags, function (flag) {
			switch (flag.charAt(0)) {
				case "B":
					let surge = parseInt(flag.slice(1));
					if (surge > 0)
						rollData.posFlagLines.push("Blood Surge (" + "●".repeat(surge) + ")");
					else
						rollData.posFlagLines.push("Blood Surge (~)");
					rollData.dicePool += surge;
					break;
				case "D":
					let disc = parseInt(flag.slice(1));
					if (disc > 0)
						rollData.posFlagLines.push("Discipline (" + "●".repeat(disc) + ")");
					else
						rollData.posFlagLines.push("Discipline (~)");
					rollData.dicePool += disc;
					break;
				case "R":
					rollData.posFlagLines.push("Resonance (●)");
					rollData.dicePool++;
					break;
				default:
					if (flag == "Health" && _.intersection(_.map(_.keys(rollData.traitData), function (k) { return k.replace(/_/g, " "); }), _.flatten([D.ATTRIBUTES.physical, D.SKILLS.physical])).length > 0) {
						rollData.negFlagLines.push("Injured (●●)");
						rollData.dicePool -= 2;
					} else if (flag == "Willpower" && _.intersection(_.map(_.keys(rollData.traitData), function (k) { return k.replace(/_/g, " "); }), _.flatten([D.ATTRIBUTES.mental, D.ATTRIBUTES.social, D.SKILLS.mental, D.SKILLS.social])).length > 0) {
						rollData.negFlagLines.push("Exhausted (●●)");
						rollData.dicePool -= 2;
					} else if (flag == "Humanity") {
						rollData.negFlagLines.push("Despairing (●●)");
						rollData.dicePool -= 2;
					} else if (flag.includes(":")) { // Custom Flags of form Compulsion (Arrogance):psma:-3
						var customFlag = flag.split(":");
						if (customFlag[1].includes("a") ||
							customFlag[1].includes("p") && _.intersection(_.map(_.keys(rollData.traitData), function (k) { return k.replace(/_/g, " "); }), _.flatten([D.ATTRIBUTES.physical, D.SKILLS.physical])).length > 0 ||
							customFlag[1].includes("m") && _.intersection(_.map(_.keys(rollData.traitData), function (k) { return k.replace(/_/g, " "); }), _.flatten([D.ATTRIBUTES.mental, D.SKILLS.mental])).length > 0 ||
							customFlag[1].includes("s") && _.intersection(_.map(_.keys(rollData.traitData), function (k) { return k.replace(/_/g, " "); }), _.flatten([D.ATTRIBUTES.social, D.SKILLS.social])).length > 0 ||
							customFlag[1].includes("d") && _.intersection(_.map(_.keys(rollData.traitData), function (k) { return k.replace(/_/g, " "); }), D.DISCIPLINES).length > 0) {
							rollData.negFlagLines.push(customFlag[0] + " (" + "●".repeat(Math.abs(parseInt(customFlag[2]) || 2)) + ")");
							rollData.dicePool -= Math.abs(parseInt(customFlag[2]) || 2);
						}
					}
					break;
			};
		});

		rollData.dicePool = Math.max(0, rollData.dicePool);
		rollData.hungerPool = Math.min(rollData.hunger, Math.max(1, rollData.dicePool));
		rollData.basePool = Math.max(1, rollData.dicePool) - rollData.hungerPool;
		return rollData;
	};

	const rollDice = function (rollData, addVals) {
		//D.DB("RECEIVED ROLL DATA: " + D.JSL(rollData), "ROLLER: rollDice()", 3);
		D.DB("RECEIVED ADDED VALS: " + D.JSL(addVals), "ROLLER: rollDice()", 3);
		var rollResults = {
			total: 0,
			critPairs: { bb: 0, hb: 0, hh: 0 },
			B: { crits: 0, succs: 0, fails: 0 },
			H: { crits: 0, succs: 0, fails: 0, botches: 0 },
			rolls: [],
			diceVals: []
		};

		var roll = function(dtype) {
			let d10 = randomInteger(10);
			rollResults.rolls.push(dtype + d10);
			switch (d10) {
				case 10:
					rollResults[dtype].crits++;
					rollResults.total++;
					break;
				case 9:
				case 8:
				case 7:
				case 6:
					rollResults[dtype].succs++;
					rollResults.total++;
					break;
				case 5:
				case 4:
				case 3:
				case 2:
					rollResults[dtype].fails++;
					break;
				case 1:
					switch (dtype) {
						case "B":
							rollResults.B.fails++;
							break;
						case "H":
							rollResults.H.botches++;
							break;
					};
					break;
			};
		};

		if (rollData.rerollAmt) {
			for (var i = 0; i < rollData.rerollAmt; i++) {
				roll("B");
			};
		} else {
			_.each({ B: rollData.basePool, H: rollData.hungerPool }, function (val, dtype) {
				for (var i = 0; i < parseInt(val) ; i++) {
					roll(dtype);
				};
			});
		}

		_.each(addVals, function (val) {
			var dtype = val.slice(0, 1);
			switch (val.slice(1, 2)) {
				case "c":
					rollResults[dtype].crits++;
					rollResults.total++;
					break;
				case "s":
					rollResults[dtype].succs++;
					rollResults.total++;
					break;
				case "f":
					rollResults[dtype].fails++;
					break;
				case "b":
					rollResults[dtype].botches++;
					break;
			}
		});

		D.DB("PRE-SORT RESULTS: " + D.JSL(rollResults), "ROLLER: rollDice()", 3);
		//D.Alert(rollResults, "PRESORT ROLL RESULTS");

		var sortBins = [];
		switch (rollData.type) {
			case "trait":
			case "frenzy":
				sortBins.push("H");
			case "remorse":
			case "humanity":
			case "willpower":
				sortBins.push("B");
				while ((rollResults.B.crits + rollResults.H.crits) >= 2) {
					while (rollResults.H.crits >= 2) {
						rollResults.H.crits -= 2;
						rollResults.critPairs.hh++;
						rollResults.total += 2;
						rollResults.diceVals.push("HcL");
						rollResults.diceVals.push("HcR");
					};
					if (rollResults.B.crits > 0 && rollResults.H.crits > 0) {
						rollResults.B.crits--;
						rollResults.H.crits--;
						rollResults.critPairs.hb++;
						rollResults.total += 2;
						rollResults.diceVals.push("HcL");
						rollResults.diceVals.push("BcR");
					};
					while (rollResults.B.crits >= 2) {
						rollResults.B.crits -= 2;
						rollResults.critPairs.bb++;
						rollResults.total += 2;
						rollResults.diceVals.push("BcL");
						rollResults.diceVals.push("BcR");
					};
				};
				_.each(["crits", "succs", "fails", "botches"], function (bin) {
					_.each(sortBins, function (rType) {
						for (var i = 0; i < rollResults[rType][bin]; i++) {
							rollResults.diceVals.push(rType + bin.slice(0, 1));
						};
					});
				});
				break;
			case "rouse2":
			case "rouse":
				rollResults.diceVals = _.map(rollResults.rolls, function (roll) {
					return parseInt(roll.slice(1)) < 6 ? "Hb" : "Bs";
				});
				if (rollResults.diceVals[1] && rollResults.diceVals[0] != rollResults.diceVals[1])
					rollResults.diceVals = ["Hb", "Bs"];
				break;
			case "check":
				rollResults.diceVals = _.map(rollResults.rolls, function (roll) {
					return parseInt(roll.slice(1)) < 6 ? "Hf" : "Bs";
				});
				break;
		};
		return rollResults;
	};

	const formatDiceLine = function (results, params) {
	    params = params || {};
	    let logLine = "";
	    if (params.isReroll) {
	        let newResults = params.newResults;
	        let changeLine = "";
	        _.each(results);

	    } else if (params.isGMMod) {

	    } else {
	        _.each(results.diceVals, function (val) {
	            logLine += CHATSTYLES.resultDice[val];
	        });
	        return CHATSTYLES.resultDice.start + CHATSTYLES.resultCount + results.total + ":</span>" + logLine + CHATSTYLES.margin + results.margin + "</span></div>";
	    }
	}

	const applyRoll = function (rollData, rollResults, isGroupRoll) {
		state[D.GAMENAME].Roller.lastRoll = {
			data: rollData,
			results: rollResults
		};
		var deltaAttrs = {};
		var rollLines = {
			rollerName: { text: "", justified: "left" },
			mainRoll: { text: "", justified: "left" },
			mainRollShadow: { text: "", justified: "left" }
		};
		var logLines = {
			fullBox: CHATSTYLES.fullBox,
			rollerName: "",
			mainRoll: "",
			mainRollSub: "",
			difficulty: "",
			resultDice: "",
			margin: "",
			outcome: ""
		}
		var isOneRollMin = false;
		var yShift = 0;
		switch (rollData.type) {
			case "trait":
				if (rollData.posFlagLines.length > 0) {
					rollLines.posMods = {
						text: "+ " + rollData.posFlagLines.join(" + ") + "          ",
						justified: "left"
					};
				} else {
					rollLines.posMods = {
						text: "  ",
						justified: "left"
					};
				}
				if (rollData.negFlagLines.length > 0) {
					rollLines.negMods = {
						text: "- " + rollData.negFlagLines.join(" - "),
						justified: "left",
						shift: {
							anchor: "posMods",
							anchorSide: "right",
							amount: 0
						}
					};
				};
			case "willpower":
			case "humanity":
				rollLines.margin = { text: "" };
			case "frenzy":
				rollLines.difficulty = { text: "" };
			case "remorse":
			case "rouse2":
			case "rouse":
			case "check":
				setImg("diffFrame", "blank");
				rollLines.summary = { text: "" };
				rollLines.summaryShadow = { text: "" };
				rollLines.resultCount = { text: "" };
				rollLines.resultCountShadow = { text: "" };
				rollLines.outcome = { text: "", justified: "left" };
				break;
		};

		_.each(_.keys(rollLines), function (line) {
			if (_.isString(COLORSCHEMES[rollData.type][line]))
				rollLines[line] = setColor(line, rollData.type, rollLines[line]);
			return;
		});

		var blankLines = _.keys(_.omit(state[D.GAMENAME].Roller.textList, _.keys(rollLines)));

		D.DB("ROLL LINES: " + D.JSL(rollLines), "ROLLER: applyRoll()", 3);
		//D.DB("BLANKING LINES: " + D.JSL(blankLines), "ROLLER: applyRoll()", 3);

		_.each(rollLines, function (content, name) {
			//D.DB("Parsing " + D.JSL(name) + " = '" + D.JSL(content) + "'", "ROLLER: applyRoll()", 4);
			switch (name) {
				case "mainRoll":
					var introPhrase = null;
					var logPhrase = null;
					switch (rollData.type) {
						case "remorse":
							introPhrase = introPhrase || ("Does " + rollData.charName + " feel remorse?");
							logPhrase = logPhrase || " rolls remorse:";
						case "frenzy":
							introPhrase = introPhrase || (rollData.charName + " and the Beast wrestle for control...");
							logPhrase = logPhrase || " resists frenzy:";
						case "trait":
						case "willpower":
						case "humanity":
							introPhrase = introPhrase || rollData.charName + " rolls: ";
							logPhrase = logPhrase || " rolls:";
							var mainRollParts = [];
							var mainRollLog = [];
							if (isGroupRoll) {
								_.each(rollData.traitData, function (tData) {
									mainRollLog.push(tData[0] + " (" + tData[1] + ")");
									mainRollParts.push(tData[0] + " (" + (tData[1] == 0 ? "~" : "●".repeat(tData[1])) + ")");
								});
							} else {
								_.each(rollData.traits, function (trt) {
									var dotline = "●".repeat(rollData.traitData[trt].value);
									switch (trt) {
										case "Stains":
											dotline = "";
										case "Humanity":
											var stains = Math.max(parseInt(getAttrByName(rollData.charID, "Stains") || 0), 0);
											var maximum = 10;
											if (rollData.type == "frenzy") {
												stains = Math.max(stains == 0 ? 0 : 1, Math.floor(stains / 3));
												maximum = 4;
											}
											if (rollData.type == "remorse")
												dotline = "◌".repeat(Math.max(maximum - dotline.length - stains, 0)) + dotline + "◌".repeat(stains);
											else
												dotline += "◌".repeat(Math.max(maximum - dotline.length - (stains || 0)), 0) + "‡".repeat(stains || 0);
											break;
										case "Willpower":   //stains
											dotline += "◌".repeat(Math.max(0, parseInt(getAttrByName(rollData.charID, "willpowerDotMax")) - parseInt(rollData.traitData[trt].value)));
											break;
										default:
											if (rollData.traitData[trt].value == 0)
												dotline = "~";
											break;
									};
									if (trt != "Stains") {
										mainRollParts.push(rollData.traitData[trt].display + " (" + dotline + ")");
										mainRollLog.push(rollData.traitData[trt].display + " (" + rollData.traitData[trt].value + ")");
									}
								});
							}
							//logLines.rollerName += logPhrase;
							rollLines.rollerName.text = introPhrase;
							rollLines.mainRoll.text = mainRollParts.join(" + ");
							logLines.mainRoll = CHATSTYLES.mainRoll + mainRollLog.join(" + ");
							if (rollData.mod != 0) {
								logLines.mainRoll += (rollData.mod < 0 ? " - " : " + ") + Math.abs(rollData.mod);
								rollLines.mainRoll.text += (rollData.mod < 0 ? " - " : " + ") + Math.abs(rollData.mod);
							}
							if (rollData.dicePool <= 0) {
								logLines.mainRollSub = CHATSTYLES.mainRollSub + "(One Die Minimum)</span>";
								rollData.dicePool = 1;
								rollLines.mainRoll.text += " (One Die Minimum)";
							}
							break;
						case "rouse2":
							rollLines.mainRoll.text = " (Best of Two)";
							logLines.mainRollSub = CHATSTYLES.mainRollSub + "(Best of Two)</span>";
						case "rouse":
							introPhrase = introPhrase || rollData.charName + ":";
							logPhrase = logPhrase || ":";
							logLines.mainRoll = CHATSTYLES.check + "Rouse Check";
							rollLines.mainRoll.text = "Rouse Check" + rollLines.mainRoll.text;
							break;
						case "check":
							introPhrase = introPhrase || rollData.charName + ":";
							logPhrase = logPhrase || ":";
							logLines.mainRoll = CHATSTYLES.check + "Simple Check";
							rollLines.mainRoll.text = "Simple Check";
							break;
						case "default":
							introPhrase = introPhrase || rollData.charName + ":";
							logPhrase = logPhrase || ":";
					};
					logLines.rollerName = logPhrase;
					rollLines.rollerName.text = introPhrase || "";
					rollLines.mainRollShadow.text = rollLines.mainRoll.text;
					break;
				case "summary":
					rollLines.summary.text = JSON.stringify(rollData.dicePool);
					rollLines.summaryShadow.text = rollLines.summary.text;
					break;
				case "difficulty":
					if (rollData.diff == 0) {
						rollLines.difficulty.text = " ";
						setImg("diffFrame", "blank");
						break;
					}
					setImg("diffFrame", "diffFrame");
					rollLines.difficulty = { text: D.JS(rollData.diff) };
					logLines.difficulty = " vs. " + D.JS(rollData.diff);
					break;
				case "resultCount":
					rollLines.resultCount.text = JSON.stringify(rollResults.total);
					rollLines.resultCountShadow.text = rollLines.resultCount.text;
					break;
				case "margin":
					if (rollData.diff == 0) {
						rollLines.margin.text = " ";
						break;
					}
					var margin = rollResults.total - rollData.diff;
					rollLines.margin.text = (margin > 0 ? "+" : margin == 0 ? "" : "-") + Math.abs(margin);
					logLines.margin = " (" + (margin > 0 ? "+" : margin == 0 ? "" : "-") + Math.abs(margin) + ")" + logLines.margin;
					rollLines.margin = setColor("margin", rollData.type, rollLines.margin, margin >= 0 ? "good" : "bad");
					break;
				case "outcome":
					var total = rollResults.total;
					var margin = rollResults.total - rollData.diff;
					switch (rollData.type) {
						case "trait":
							if ((total == 0 || margin < 0) && rollResults.H.botches > 0) {
								rollLines.outcome.text = "BESTIAL FAILURE!";
								logLines.outcome = CHATSTYLES.outcomeRed + "BESTIAL FAILURE!</span></div>";
								rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "worst");
								break;
							} else if (margin >= 0 && (rollResults.critPairs.hb + rollResults.critPairs.hh) > 0) {
								rollLines.outcome.text = "MESSY CRITICAL!";
								logLines.outcome = CHATSTYLES.outcomeRed + "MESSY CRITICAL!</span></div>";
								rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "worst");
								break;
							}
						case "willpower":
						case "humanity":
							if (total === 0) {
								rollLines.outcome.text = "TOTAL FAILURE!";
								logLines.outcome = CHATSTYLES.outcomeRed + "TOTAL FAILURE!</span></div>";
								rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "worst");
							} else if (margin < 0) {
								logLines.outcome = CHATSTYLES.outcomeOrange + "COSTLY SUCCESS?</span></div>";
								rollLines.outcome.text = "COSTLY SUCCESS?";
								rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "bad");
							} else if (rollResults.critPairs.bb > 0) {
								logLines.outcome = CHATSTYLES.outcomeWhite + "CRITICAL WIN!</span></div>";
								rollLines.outcome.text = "CRITICAL WIN!";
								rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "best");
							} else {
								logLines.outcome = CHATSTYLES.outcomeWhite + "SUCCESS!</span></div>";
								rollLines.outcome.text = "SUCCESS!";
								rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "good");
							};
							break;
						case "frenzy":
							if (total === 0 || margin < 0) {
								rollLines.outcome.text = "YOU FRENZY!";
								logLines.outcome = CHATSTYLES.outcomeRed + "FRENZY!</span></div>";
								rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "worst");
							} else if (rollResults.critPairs.bb > 0) {
								rollLines.outcome.text = "RESISTED!";
								logLines.outcome = CHATSTYLES.outcomeWhite + "RESISTED!</span></div>";
								rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "best");
							} else {
								rollLines.outcome.text = "RESTRAINED...";
								logLines.outcome = CHATSTYLES.outcomeWhite + "RESTRAINED...</span></div>";
								rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "good");
							};
							break;
						case "remorse":
							if (!isGroupRoll)
								deltaAttrs.deltaStains = -1 * parseInt(getAttrByName(rollData.charID, "Stains"));
							if (rollResults.total == 0) {
								rollLines.outcome.text = "YOUR HUMANITY FADES...";
								logLines.outcome = CHATSTYLES.outcomeRed + "DEGENERATION</span></div>";
								deltaAttrs.deltaHumanity = -1;
								rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "bad");
							} else {
								rollLines.outcome.text = "YOU FIND ABSOLUTION!";
								logLines.outcome = CHATSTYLES.outcomeWhite + "ABSOLUTION</span></div>";
								rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "good");
							}
							break;
						case "rouse":
						case "rouse2":
							if (rollResults.total > 0) {
								rollLines.outcome.text = "RESTRAINED...";
								logLines.outcome = CHATSTYLES.outcomeWhite + "RESTRAINED</span></div>";
								rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "good");
							} else {
								rollLines.outcome.text = "HUNGER ROUSED!";
								logLines.outcome = CHATSTYLES.outcomeRed + "ROUSED!</span></div>";
								rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "worst");
								if (!isGroupRoll)
									deltaAttrs.Hunger = parseInt(getAttrByName(rollData.charID, "Hunger")) + 1;
							}
							break;
						case "check":
							if (rollResults.total > 0) {
								rollLines.outcome.text = "PASS";
								logLines.outcome = CHATSTYLES.outcomeWhite + "PASS</span></div>";
								rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "good");
							} else {
								rollLines.outcome.text = "FAIL";
								logLines.outcome = CHATSTYLES.outcomeRed + "FAIL</span></div>";
								rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "worst");
							}
							break;

					};
					break;
			};
		});

		logLines.rollerName = CHATSTYLES.rollerName + rollData.charName + logLines.rollerName + "</div>";
		logLines.mainRoll = logLines.mainRoll + logLines.difficulty + "</span>" + logLines.mainRollSub + "</div>";
		logLines.resultDice = formatDiceLine(rollResults);

		var logString = logLines.fullBox + logLines.rollerName + logLines.mainRoll + logLines.resultDice + logLines.outcome + "</div>";
		log("LOGLINES: " + D.JS(logLines), "LOG LINES");

		D.SendMessage("Storyteller", logString, " ");
		//D.Alert(logString);


		D.DB("... Complete.", "ROLLER: applyRolls()", 4);

		_.each(blankLines, function (line) {
			rollLines[line] = { text: " " };
		});

		var diceCats = _.clone(STATECATS.dice);
		switch (rollData.type) {
			case "rouse2":
			case "rouse":
			case "check":
				diceCats = diceCats.reverse();
				break;
		}
		var diceObjs = [];
		//D.DB("Processing '" + D.JSL(diceCats[0]) + "' (length = " + D.JSL(state[D.GAMENAME].Roller[diceCats[0]].length) + "): " + D.JSL(state[D.GAMENAME].Roller[diceCats[0]]), "ROLLER: applyRoll()", 2);
		for (var i = 0; i < state[D.GAMENAME].Roller[diceCats[0]].length; i++)
			diceObjs.push(setDie(i, diceCats[0], rollResults.diceVals[i] || "blank", { shift: { top: yShift } }));
		//D.DB("Dice Objects List: '" + D.JSL(diceObjs) + "'", "ROLLER: applyRoll()", 2);

		var bookends = [diceObjs[0], diceObjs[rollResults.diceVals.length - 1]];

		if (!bookends || bookends.length < 2 || _.isUndefined(bookends[0]) || _.isUndefined(bookends[1]) )
			return D.ThrowError("Bookends Not Found.  DiceObjs.length is " + diceObjs.length + ", rollResults.diceVals is " + rollResults.diceVals.length + ": " + D.JSL(diceObjs));

		var spread = bookends[1].get("left") - bookends[0].get("left");

		scaleFrame("bottom", spread);
		for (var i = 0; i < state[D.GAMENAME].Roller[diceCats[1]].length; i++) {
			setDie(i, diceCats[1], "blank");
		};

		var txtWidths = {};
		_.each(rollLines, function (params, name) {
			var pars = setText(name, params);
			txtWidths[name] = pars.width;
		});
		spread = txtWidths.posMods || 0 + txtWidths.negMods || 0;
		spread += txtWidths.posMods && txtWidths.negMods ? 50 : 0;
		spread = Math.max(spread, txtWidths.mainRoll);
		scaleFrame("top", spread);

		D.RunFX("bloodBolt", POSITIONS.bloodBoltFX);



		if (!isGroupRoll && _.values(deltaAttrs).length > 0)
			setAttrs(rollData.charID, deltaAttrs);
	};

	const wpReroll = function (dieCat) {
		isRerollFXOn = false;
		clearInterval(rerollFX);
		rerollFX = null;
		var rolledDice = _.mapObject(_.omit(state[D.GAMENAME].Roller[dieCat], function(data, dieNum) {
			return data.value == "blank" || state[D.GAMENAME].Roller.selected[dieCat].includes(parseInt(dieNum));
		}), function (data, dieNum) { return data.value; });
		//D.DB("UNSELECTED VALUES: " + D.JSL(rolledDice), "ROLLER: wpReroll()", 3);
		var rollResults = rollDice({ type: "trait", rerollAmt: state[D.GAMENAME].Roller.selected[dieCat].length }, _.values(rolledDice));

		applyRoll(state[D.GAMENAME].Roller.lastRoll.data, rollResults);

		return;
	}

	const changeRoll = function (deltaDice) {
	    let rollResults = state[D.GAMENAME].Roller.lastRoll.results;
	    let reroll = parseInt();
	    if (parseInt(deltaDice) < 0) {
	        _.shuffle(rollResults.diceVals);
	        for (var i = 0; i > deltaDice; i--) {
	            let cutIndex = _.findIndex(rollResults.diceVals, function(val) {
	                return val.slice(0,1) == "B";
	            });
	            if (cutIndex == -1)
	                return D.ThrowError("Not enough base dice to remove in: " + D.JSL(rollResults.diceVals), "ROLLER: changeRoll()");
	            rollResults.diceVals.splice(cutIndex, 1);
	        }
	    }
	    rollResults = rollDice({ type: "trait", rerollAmt: parseInt(deltaDice) > 0 ? parseInt(deltaDice) : 0 }, rollResults.diceVals);
	    applyRoll(state[D.GAMENAME].Roller.lastRoll.data, rollResults);
	}
	//#endregion

	//#region Getting Random Resonance Based On District/Site Parameters
	var getResonance = function (posRes, negRes, isDoubleAcute, isLogging) {
		var resProbs;
		posRes = (posRes || "").toLowerCase();
		negRes = (negRes || "").toLowerCase();
		var resonances = ["Choleric", "Melancholic", "Phlegmatic", "Sanguine"];
		_.each(resonances, function (res) {
			if (posRes.includes(res.toLowerCase().charAt(0))) {
				resonances = _.without(resonances, res);
				resonances.unshift(res);
			}
			if (negRes.includes(res.toLowerCase().charAt(0))) {
				resonances = _.without(resonances, res);
				resonances.push(res);
			}
		});
		switch (posRes.length + negRes.length) {
			case 3:
				if (posRes.length == 2)
					if (posRes.charAt(0) == posRes.charAt(1))
						resProbs = D.RESPROBS.pos2neg;
					else
						resProbs = D.RESPROBS.posposneg;
				else
					if (negRes.charAt(0) == negRes.charAt(1))
						resProbs = D.RESPROBS.neg2pos;
					else
						resProbs = D.RESPROBS.posnegneg;
				break;
			case 2:
				if (posRes.length == 2)
					resProbs = D.RESPROBS.pospos;
				else if (negRes.length == 2)
					resProbs = D.RESPROBS.negneg;
				else
					resProbs = D.RESPROBS.posneg;
				break;
			case 1:
				resProbs = posRes.length == 1 ? D.RESPROBS.pos : D.RESPROBS.neg;
				break;
			case 0:
				resProbs = D.RESPROBS.norm;
				break;
		};
		resProbs = _.flatten(_.map(resProbs, function (ra) { return _.values(ra); }));
		if (isDoubleAcute) {
			for (var i = 0; i < 4; i++) {
				resProbs[i * 4 + 0] = resProbs[i * 4 + 0] - resProbs[i * 4 + 2] / 2 - resProbs[i * 4 + 3] / 2;
				resProbs[i * 4 + 1] = resProbs[i * 4 + 1] - resProbs[i * 4 + 2] / 2 - resProbs[i * 4 + 3] / 2;
				resProbs[i * 4 + 2] = resProbs[i * 4 + 2] * 2;
				resProbs[i * 4 + 3] = resProbs[i * 4 + 3] * 2;
			}
		}
		var randNum = Math.random();
		do {
			randNum -= resProbs.shift();
		} while (randNum > 0);

		let res = resonances.reverse()[Math.floor(resProbs.length / 4)];
		//let res = resonances[3 - Math.floor(resProbs.length / 4)];
		let temp = ["Negligible", "Fleeting", "Intense", "Acute"][3 - (resProbs.length % 4)];
		return [temp, res];
		//return ["Acute", "Choleric"];
	}

	//#endregion

	//#region Secret Dice Rolling Macro
	var handleSecretRoll = function (who, args, selected, gmID, isSpecialty, isSilent, isShowingRolls) {
		var abilName, attrName;
		var diff = 6;
		var modifier = 0;
		var targetChars = [];
		var title, message;

		D.Chat(who, JSON.stringify(who) + " & " + JSON.stringify(args), "PARAMS");
		if (!args[0] || args[0].length < 3 || !(_.contains(_.keys(D.ATTRIBUTES), args[0].slice(0, 3).toUpperCase()))) {
			D.Chat(who, "Bad Attribute: " + JSON.stringify(args[0].slice(0, 3).toUpperCase() + " not in " + JSON.stringify(_.keys(D.ATTRIBUTES))), "ERROR");
			return;
		}
		attrName = D.ATTRIBUTES[args.shift().slice(0, 3).toUpperCase()];
		if (attrName !== "Willpower") {
			args.shift();
			if (!args[0]) {
				D.Chat(who, "No Skill to pair with " + attrName, "ERROR");
				return;
			} else if (!_.contains(D.SKILLS.Talents.concat(D.SKILLS.Skills, D.SKILLS.Knowledges), args[0])) {
				D.Chat(who, "No such Skill '" + args[0] + "'.", "ERROR");
				return;
			}
			abilName = args.shift();
			abilName = abilName.slice(0, 1).toUpperCase() + abilName.slice(1);
			title = attrName.slice(0, 3).toUpperCase() + " + " + abilName;
		} else
			title = "Willpower";
		if (args[0] && args[0].slice(0, 1) === "v") {
			args.shift();
			if (args[0] && (isNaN(args[0]) || (parseInt(args[0]) >= 11 || parseInt(args[0]) <= 1))) {
				D.Chat(who, "'" + args[0] + "' is not a valid difficulty number.");
				return;
			}
			if (args[0])
				diff = parseInt(args.shift());
		}
		title += " vs " + diff;
		if (args[0]) {
			if (isNaN(args[0])) {
				D.Chat(who, "'" + args[0] + "' is not a valid dice pool modifier.");
				return;
			}
			modifier = parseInt(args.shift());
			title += " " + (modifier > 0 ? "+" : "") + modifier;
		}
		//D.Log("------------------------------------------------------------");
		//D.Log("ROLLING: " + title);
		//if (!selected || selected.length === 0) {
		targetChars = _.keys(V.CHARS);
		//} else {
		//    _.each(selected, function (token) {
		//        let thisToken = getObj("graphic", token._id);
		//        if (thisToken) {
		//            let thisChar = thisToken.get("represents");
		//            if (thisChar != "")
		//                targetChars.push(getObj("graphic", token._id).get("represents"));
		//        }
		//    });
		//}
		message = "<table style = 'border: solid;'><tr><th width = 10%></th>";
		for (var i = diff - 3; i <= diff + 3; i++) {
			message += "<th width = 10%>" + i + "</th>";
		}
		message += "<tr>";
		_.each(targetChars, function (charID) {
			message += secretRoll(charID, attrName, abilName, diff, modifier, gmID, isSpecialty, isSilent, isShowingRolls);
		});
		message += "</table>"
		D.Chat(getObj("player", gmID).get("_displayname"), message, title);
		D.Log("------------------------------------------------------------");
		return;
	}

	var secretRoll = function (charID, attrName, abilName, difficulty, modifier, gmID, isSpecialty, isSilent, isShowingRolls) {
		var playerID = V.CHARS[charID].playerID;
		var tableRow;
		var dicePool, message, resultString;
		var diceString = "";
		var succs = 0;
		var botches = 0;
		var displayName = getObj("player", playerID).get("_displayname");
		if (attrName === "Willpower") {
			dicePool = parseInt(getAttrByName(charID, "Willpower_base"));
			message = "Your Willpower";
		} else {
			dicePool = parseInt(getAttrByName(charID, attrName)) + parseInt(getAttrByName(charID, abilName));
			if (parseInt(getAttrByName(charID, abilName)) === 0) {
				if (_.contains(D.SKILLS.Skills, abilName))
					difficulty++;
				else if (_.contains(D.SKILLS.Knowledges, abilName)) {
					return "<tr><td width = 10%>" + displayName + "</td><td>Can't Roll</td></tr>";
				}
			}
			message = "Your " + attrName + " + " + abilName;
		}
		if (isSpecialty)
			message += " (applying Specialty)";
		if (charID === "-Kl5PlQrmlsA6VYckTeE" && (abilName === "Alertness" || abilName === "Awareness")) {
			message += " is being tested, but you're oh so tired...";
			difficulty += 2;
		} else if (charID === "-KqFji7R9h6a0hnHDckw")
			message += " is being tested, but you're as confident as ever!";
		else
			message += " is being tested...";
		var injuryMod = findObjs({ _type: "attribute", _characterid: charID, _name: "injury" })[0];
		dicePool += parseInt(modifier);
		dicePool += parseInt(getAttrByName(charID, "injury"));
		dicePool = Math.max(0, dicePool);
		var rollResults = [];
		diceString = ""
		for (var i = 0; i < dicePool; i++) {
			do {
				let randomRoll = randomInteger(10);
				diceString += "," + randomRoll;
				rollResults.push(randomRoll);
			} while (_.last(rollResults) === 10 && isSpecialty);

		}
		if (isShowingRolls)
			message += " [" + diceString.slice(1) + "]";
		if (!isSilent)
			sendChat("", "/w " + displayName + " " + message);
		sendChat("", "/w " + getObj("player", gmID).get("_displayname") + " " + message);
		tableRow = "<tr><td>" + displayName.slice(0, 3).toUpperCase() + "</td>";

		for (var i = difficulty - 3; i <= difficulty + 3; i++) {
			succs = 0;
			botches = 0;
			let thisDiff = i;
			_.each(rollResults, function (roll) {
				if (roll >= thisDiff)
					succs++;
				if (roll === 1) {
					botches++;
				}
			});
			if (succs === 0 && botches > 0)
				resultString = "<i>B</i>";
			else if ((succs - botches) <= 0)
				resultString = "x";
			else
				resultString = succs - botches;
			if (i === difficulty) {
				resultString = "<b>" + resultString + "</b>"
				//D.Log(">> " + displayName + " (" + difficulty + "): [" + diceString.slice(1) + "] = (" + succs + " - " + botches + ")");
			}
			resultString = "<center>" + resultString + "</center>";
			tableRow += "<td style = 'textAlign: center;'>" + resultString + "</td>"
		}
		tableRow += "<tr>";
		return tableRow;
	}
	//#endregion

	//#region Event Handlers (handleInput)
	var handleInput = function (msg) {
		if (msg.type !== "api")
			return;
		let who = (getObj('player', msg.playerid) || { get: () =>'API' }).get('_displayname');
		if (msg.content.includes("!gRoll")) {
			let preArgs = msg.content.split(/\s+/);
			preArgs.shift();
			let params = preArgs.join(" ").split("|");
			let rollType = params.shift();
			makeGroupSheetRoll(rollType, params);
			return;
		}
		let args = msg.content.split(/\s+/);
		var rollType = null;
		var name = "";
		switch (args.shift()) {             //!traitroll @{character_name}|Strength,Resolve|3|5|0|ICompulsion:3,IPhysical:2
			case '!frenzyroll':
				rollType = "frenzy";
				D.DB("INITIAL ARGS: " + D.JSL(args), "!frenzyroll", 2);
				D.DB("PREV CONTENT: " + D.JSL(state[D.GAMENAME].Roller.frenzyRoll), "!frenzyroll", 2);
				//let newContent = state[D.GAMENAME].Roller.frenzyRoll.replace(/\|(\d+)\|\d+\|(\d+)\|/, "|$1|" + args[0] + "|$2|");
				args = (state[D.GAMENAME].Roller.frenzyRoll + "|" + args[0]).split(" ");
				D.DB("NEW ARGS: " + D.JSL(args), "!frenzyroll", 2);
			case '!frenzyinitroll':
				rollType = rollType || "frenzyInit";
			case '!traitroll':
				rollType = rollType || "trait";
			case '!rouseroll':
				rollType = rollType || "rouse";
			case '!rouse2roll':
				rollType = rollType || "rouse2";
			case '!checkroll':
				rollType = rollType || "check";
			case '!willpowerroll':
				rollType = rollType || "willpower";
			case '!humanityroll':
				rollType = rollType || "humanity";
			case '!remorseroll':
				rollType = rollType || "remorse";
				var params = args.pop().split("|");
				args.push(params.shift());
				name = args.join(" ");
				let charObj = D.GetChars(name)[0];
				if (!charObj)
					return D.ThrowError("!" + rollType + "roll: No character found with name " + D.JS(name));
				if (rollType == "frenzyInit") {
					state[D.GAMENAME].Roller.frenzyRoll = name + "|" + params.join("|");
					sendChat("ROLLER", "/w Storyteller <br/><div style='display: block; background: url(https://i.imgur.com/kBl8aTO.jpg); text-align: center; border: 4px crimson outset;'><br/><span style='display: block; font-size: 16px; text-align: center; width: 100%'>[Set Frenzy Diff](!&#13;#Frenzy)</span><span style='display: block; text-align: center; font-size: 12px; font-weight: bolder; color: white; font-variant: small-caps; margin-top: 4px; width: 100%'>~ for ~</span><span style='display: block; font-size: 14px; color: red; text-align: center; font-weight: bolder; font-variant: small-caps; width: 100%'>" + name + "</span><br/></div>");
					return;
					break;
				}
				makeSheetRoll(charObj, rollType, params);
				delete state[D.GAMENAME].Roller.frenzyRoll;
				break;
			case '!buildFrame':
				initFrame();
				break;
			case '!showDice':
				_.each(state[D.GAMENAME].Roller.diceList, function (data, dieNum) {
					var thisDie = setDie(dieNum, "diceList", "Hs");
					if (_.isObject(thisDie)) {
						thisDie.set("layer", "objects");
						thisDie.set("isdrawing", false);
					}
				});
				_.each(state[D.GAMENAME].Roller.bigDice, function (data, dieNum) {
					var thisDie = setDie(dieNum, "bigDice", "Bs");
					if (_.isObject(thisDie)) {
						thisDie.set("layer", "objects");
						thisDie.set("isdrawing", false);
					}
				});
				break;
			case '!resetDice':
				_.each(STATECATS.dice, function (dieCat) {
					state[D.GAMENAME].Roller[dieCat] = [];
				});
				break;
			case '!reg':
			case '!register':
				switch (args.shift()) {
					case 'die':
						if (!msg.selected || !msg.selected[0])
							return D.ThrowError("!register die: Select a Graphic!");
						registerDie(getObj("graphic", msg.selected[0]._id), args.shift());
						break;
					case 'text':
						if (!msg.selected || !msg.selected[0])
							return D.ThrowError("register text: Select a Text Object!");
						registerText(getObj("text", msg.selected[0]._id), args.shift());
						break;
					case 'shape':
						if (!msg.selected || !msg.selected[0])
							return D.ThrowError("register text: Select a Path Object!");
						name = args.shift();
						registerShape(getObj("path", msg.selected[0]._id), name, args.shift());
						break;
					case 'image':
					case 'img':
						if (!msg.selected || !msg.selected[0])
							return D.ThrowError("register img: Select an Image!");
						name = args.shift();
						registerImg(getObj("graphic", msg.selected[0]._id), name, args.join(","));
						break;
					case 'repo':
					case 'reposition':
						if (!msg.selected || !msg.selected[0])
							return D.ThrowError("reposition: Select one or more objects to reposition!");
						reposition(msg.selected);
						break;
				};
				break;
		    case '!changeRoll':
		        changeRoll(parseInt(args.shift()));
		        break;
			case '!resCheck':
				if (args[0] == "x")
					args[0] = "";
				if (args[1] == "x")
					args[1] = "";
				//testResonances(args[0], args[1], args[2] == "2");
				//break;
				let thisRes = getResonance(args[0], args[1], args[2] == "2");
				sendChat("ROLLER", "/w Storyteller <br/><div style='display: block; background: url(https://i.imgur.com/kBl8aTO.jpg); text-align: center; border: 4px crimson outset;'><br/><span style='display: block; font-weight: bold; color: red; font-size: 16px; text-align: center; width: 100%'>" + thisRes[0].toUpperCase() + " " + thisRes[1].toUpperCase() + "</span><br/></div>");
				break;
			default:
				break;
		};
	};

	//#endregion

	//#region Public Functions: registerEventHandlers, tapSpite
	const registerEventHandlers = function () {
		on('chat:message', handleInput);
	};

	const checkInstall = function () {
		state[D.GAMENAME] = state[D.GAMENAME] || {};
		state[D.GAMENAME].Roller = state[D.GAMENAME].Roller || {};
		state[D.GAMENAME].Roller.selected = state[D.GAMENAME].Roller.selected || { diceList: [], bigDice: [] };
		state[D.GAMENAME].Roller.imgList = state[D.GAMENAME].Roller.imgList || {};
	};

	return {
		RegisterEventHandlers: registerEventHandlers,
		CheckInstall: checkInstall,
		Select: selectDie,
		Reroll: wpReroll
	};
	//#endregion
}());

on("ready", function () {
	'use strict';
	Roller.RegisterEventHandlers();
	Roller.CheckInstall();
	D.Log("Roller: Ready!");
});