const Roller = (() => {
	let [isRerollFXOn, rerollFX, isLocked] = [false, null, false]

	// #region CONFIGURATION: Image Links, Color Schemes */
	const SETTINGS = {
			dice: {
				diceList: 30,
				bigDice: 2
			}
		},
		POSITIONS = {
			diceFrameFront: {
				top: () => 207,
				left: () => 175,
				height: () => 333,
				width: () => 300
			},
			diceFrameMidTop: {
				yShift: () => -116.5,
				xShift: () => 75,
				top: () => POSITIONS.diceFrameFront.top() + POSITIONS.diceFrameMidTop.yShift(),
				left: () => POSITIONS.diceFrameFront.left() + POSITIONS.diceFrameMidTop.xShift(),
				height: () => 101,
				width: () => POSITIONS.diceFrameFront.width()
			},
			diceFrameMidBottom: {
				yShift: () => 45,
				xShift: () => POSITIONS.diceFrameMidTop.xShift(),
				top: () => POSITIONS.diceFrameFront.top() + POSITIONS.diceFrameMidBottom.yShift(),
				left: () => POSITIONS.diceFrameFront.left() + POSITIONS.diceFrameMidBottom.xShift(),
				height: () => POSITIONS.diceFrameFront.height() - POSITIONS.diceFrameMidTop.height(),
				width: () => POSITIONS.diceFrameFront.width()
			},
			diceFrameEndTop: {
				top: () => POSITIONS.diceFrameFront.top() + POSITIONS.diceFrameMidTop.yShift(),
				left: () => POSITIONS.diceFrameFront.left() + 10 * POSITIONS.diceFrameMidTop.xShift(),
				height: () => POSITIONS.diceFrameMidTop.height(),
				width: () => POSITIONS.diceFrameFront.width()
			},
			diceFrameEndBottom: {
				top: () => POSITIONS.diceFrameFront.top() + POSITIONS.diceFrameMidBottom.yShift(),
				left: () => POSITIONS.diceFrameFront.left() + 10 * POSITIONS.diceFrameMidBottom.xShift(),
				height: () => POSITIONS.diceFrameFront.height() - POSITIONS.diceFrameEndTop.height(),
				width: () => POSITIONS.diceFrameMidBottom.width()
			},
			diceFrameDiffFrame: {
				top: () => 249,
				left: () => 80,
				height: () => 49,
				width: () => 98
			},
			diceFrameRerollPad: {
				top: () => 186,
				left: () => 73,
				height: () => 64,
				width: () => 64
			},
			dice: {
				diceList: {
					top: 186,
					left: 171,
					height: 91,
					width: 91,
					pad: {
						dX: 0,
						dY: 0,
						dH: -33,
						dW: -35
					},
					spread: 56
				},
				bigDice: {
					top: 185,
					left: 185,
					height: 147,
					width: 147,
					pad: {
						dX: 0,
						dY: 0,
						dH: -47,
						dW: -53
					},
					spread: 75
				}
			},
			bloodCloudFX: {
				top: 185,
				left: 74.75
			},
			bloodBoltFX: {
				top: 185,
				left: 74.75
			},
			smokeBomb: {
				top: 301,
				left: 126
			}
		},
		IMAGES = {
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
			frontFrame: "https://s3.amazonaws.com/files.d20.io/images/69207356/uVICjIErtJxB_pVJsrukcA/thumb.png?1544984070",
			topMids: ["https://s3.amazonaws.com/files.d20.io/images/64683716/nPNGOLxzJ8WU0BzLNisuwg/thumb.png?1539327926",
				"https://s3.amazonaws.com/files.d20.io/images/64683714/VPzeYN8xpO_cPmqg1rgFRQ/thumb.png?1539327926",
				"https://s3.amazonaws.com/files.d20.io/images/64683715/xUCVS7pOmfS3ravsS2Vzpw/thumb.png?1539327926"],
			bottomMids: ["https://s3.amazonaws.com/files.d20.io/images/64683769/yVNOcNMVgUjGybRBVq3rTQ/thumb.png?1539328057",
				"https://s3.amazonaws.com/files.d20.io/images/64683709/8JFF_j804fT92-JBncWJyw/thumb.png?1539327927",
				"https://s3.amazonaws.com/files.d20.io/images/64683711/upnHr36sBnFYuQpkxoVm_A/thumb.png?1539327926"],
			topEnd: "https://s3.amazonaws.com/files.d20.io/images/64683713/4IwPjcY7x5ZCLJ9ey2lICA/thumb.png?1539327926",
			bottomEnd: "https://s3.amazonaws.com/files.d20.io/images/64683710/rJDVNhm6wMNhmQx1uIp13w/thumb.png?1539327926"
		},
		COLORS = {
			white: "rgb(255, 255, 255)",
			black: "rgb(0, 0, 0)",
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
		},
		STATECATS = {
			dice: ["diceList", "bigDice"],
			graphic: ["imgList", "diceList", "bigDice"],
			text: ["textList"],
			path: ["shapeList"]
		},
		TEXTLINES = {
			rollerName: {
				font_family: "Candal",
				font_size: 32,
				top: 20,
				left: 45,
				color: COLORS.white,
				text: "rollerName"
			},
			mainRoll: {
				font_family: "Contrail One",
				font_size: 40,
				top: 73,
				left: 135,
				color: COLORS.white,
				text: "mainRoll"
			},
			mainRollShadow: {
				font_family: "Contrail One",
				font_size: 40,
				top: 78,
				left: 140,
				color: COLORS.black,
				text: "mainRoll"
			},
			posMods: {
				font_family: "Contrail One",
				font_size: 32,
				top: 115,
				left: 157,
				color: COLORS.white,
				text: "posMods"
			},
			negMods: {
				font_family: "Contrail One",
				font_size: 32,
				top: 115,
				left: 676,
				color: COLORS.red,
				text: "negMods"
			},
			summary: {
				font_family: "Candal",
				font_size: 56,
				top: 91,
				left: 75,
				color: COLORS.white,
				text: "SS"
			},
			summaryShadow: {
				font_family: "Candal",
				font_size: 56,
				top: 96,
				left: 80,
				color: COLORS.black,
				text: "SS"
			},
			difficulty: {
				font_family: "Contrail One",
				font_size: 32,
				top: 253,
				left: 96,
				color: COLORS.white,
				text: "D"
			},
			resultCount: {
				font_family: "Candal",
				font_size: 56,
				top: 185,
				left: 75,
				color: COLORS.white,
				text: "RC"
			},
			resultCountShadow: {
				font_family: "Candal",
				font_size: 56,
				top: 190,
				left: 80,
				color: COLORS.black,
				text: "RC"
			},
			margin: {
				font_family: "Candal",
				font_size: 72,
				top: 294,
				left: 133,
				color: COLORS.white,
				text: "M"
			},
			outcome: {
				font_family: "Contrail One",
				font_size: 100,
				top: 297,
				left: 200,
				color: COLORS.white,
				text: "outcome"
			},
			subOutcome: {
				font_family: "Contrail One",
				font_size: 32,
				top: 341,
				left: 360,
				color: COLORS.white,
				text: "subOutcome"
			}
		},
		COLORSCHEMES = {
			project: {
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
					worst: COLORS.brightred
				},
				subOutcome: {
					best: COLORS.white,
					good: COLORS.white,
					bad: COLORS.orange,
					worst: COLORS.brightred
				}
			},
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
					worst: COLORS.brightred
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
					worst: COLORS.brightred
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
					worst: COLORS.brightred
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
					worst: COLORS.brightred
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
					worst: COLORS.brightred
				}
			},
			rouse: {
				rollerName: COLORS.white,
				mainRoll: COLORS.white,
				outcome: {
					best: COLORS.white,
					good: COLORS.white,
					bad: COLORS.brightred,
					worst: COLORS.brightred
				}
			},
			rouse2: {
				rollerName: COLORS.white,
				mainRoll: COLORS.white,
				outcome: {
					best: COLORS.white,
					good: COLORS.white,
					bad: COLORS.brightred,
					worst: COLORS.brightred
				}
			},
			check: {
				rollerName: COLORS.white,
				mainRoll: COLORS.white,
				outcome: {
					best: COLORS.white,
					good: COLORS.white,
					bad: COLORS.brightred,
					worst: COLORS.brightred
				}
			}
		},
		CHATSTYLES = {
			fullBox: "<div style=\"display: block;width: 259px;padding: 5px 5px;margin-left: -42px;color: white;font-family: bodoni svtytwo itc tt;font-size: 16px;border: 3px outset darkred;background: url('http://imgsrv.roll20.net/?src=imgur.com/kBl8aTO.jpg') center no-repeat;position: relative;\">",
			space10: "<span style=\"display: inline-block; width: 10px;\"></span>",
			space30: "<span style=\"display: inline-block; width: 30px;\"></span>",
			space40: "<span style=\"display: inline-block; width: 40px;\"></span>",
			rollerName: "<div style=\"display: block; width: 100%; font-variant: small-caps; font-size: 16px; height: 15px; padding-bottom: 5px; border-bottom: 1px solid white;\">",
			mainRoll: "<div style=\"display: block; width: 100%; height: auto; padding: 3px 0px; border-bottom: 1px solid white;\"><span style=\"display: block; height: 16px; line-height: 16px; width: 100%; font-size: 14px; \">",
			mainRollSub: "<span style=\"display: block; height: 12px; line-height: 12px; width: 100%; margin-left: 24px; font-size: 10px; font-variant: italic;\">",
			check: "<div style=\"display: block; width: 100%; height: auto; padding: 3px 0px; border-bottom: 1px solid white;\"><span style=\"display: block; height: 20px;  line-height: 20px; width: 100%; margin-left: 10%;\">",
			summary: "<div style=\"display: block; width: 100%; padding: 3px 0px; height: auto; \"><span style=\"display: block; height: 16px; width: 100%; margin-left: 5%; line-height: 16px; font-size: 14px;\">",
			resultBlock: "<div style=\"display: block; width: 100%; height: auto; \">",
			resultCount: "<div style=\"display: inline-block; width: YYYpx; margin-top:ZZZpx; vertical-align: top; text-align: right; height: 100%; \"><span style=\"display: inline-block; font-weight: normal; font-family: Verdana; text-shadow: none; height: 24px; line-height: 24px; vertical-align: middle; width: 40px; text-align: right; margin-right: 10px; font-size: 12px;\">",
			margin: "<div style=\"display: inline-block; width: YYYpx; vertical-align: top; margin-top:ZZZpx; text-align: left; height: 100%; \"><span style=\"display: inline-block; font-weight: normal; font-family: Verdana; text-shadow: none; height: 24px; line-height: 24px; vertical-align: middle; width: 40px; text-align: left; margin-left: 10px; font-size: 12px;\">",
			outcomeRed: "<div style=\"display: block; width: 100%; height: 20px; line-height: 20px; text-align: center; font-weight: bold;\"><span style=\"color: red; display: block; width: 100%;  font-size: 22px; font-family: 'Bodoni SvtyTwo ITC TT';\">",
			outcomeRedSmall: "<div style=\"display: block; width: 100%; margin-top: 5px; height: 14px; line-height: 14px; text-align: center; font-weight: bold;\"><span style=\"color: red; display: block; width: 100%;  font-size: 14px; font-family: 'Bodoni SvtyTwo ITC TT';\">",
			outcomeOrange: "<div style=\"display: block; width: 100%; height: 20px; line-height: 20px; text-align: center; font-weight: bold;\"><span style=\"color: orange; display: block; width: 100%;  font-size: 22px; font-family: 'Bodoni SvtyTwo ITC TT';\">",
			outcomeWhite: "<div style=\"display: block; width: 100%; height: 20px; line-height: 20px; text-align: center; font-weight: bold;\"><span style=\"color: white; display: block; width: 100%;  font-size: 22px; font-family: 'Bodoni SvtyTwo ITC TT';\">",
			outcomeWhiteSmall: "<div style=\"display: block; margin-top: 5px; width: 100%; height: 14px; line-height: 14px; text-align: center; font-weight: bold;\"><span style=\"color: white; display: block; width: 100%;  font-size: 14px; font-family: 'Bodoni SvtyTwo ITC TT';\">",
			subOutcomeRed: "<div style=\"display: block; width: 100%; height: 10px; line-height: 10px; text-align: center; font-weight: bold;\"><span style=\"color: red; display: block; width: 100%;  font-size: 12px; font-family: 'Bodoni SvtyTwo ITC TT';\">",
			subOutcomeOrange: "<div style=\"display: block; width: 100%; height: 20px; line-height: 20px; text-align: center; font-weight: bold;\"><span style=\"color: orange; display: block; width: 100%;  font-size: 12px; font-family: 'Bodoni SvtyTwo ITC TT';\">",
			subOutcomeWhite: "<div style=\"display: block; width: 100%; height: 10px; line-height: 10px; text-align: center; font-weight: bold;\"><span style=\"color: white; display: block; width: 100%;  font-size: 12px; font-family: 'Bodoni SvtyTwo ITC TT';\">",
			resultDice: { // ♦◊
				colStart: "<div style=\"display: inline-block ; width: XXXpx ; height: auto; margin-bottom: 5px\">",
				lineStart: "<div style=\"display: block ; width: 100% ; height: 24px ; line-height: 20px ; text-align: center ; font-weight: bold ; text-shadow: 0px 0px 2px white , 0px 0px 2px white , 0px 0px 2px white , 0px 0px 2px white ; \">",
				lineBreak: "</div><div style=\"display: block ; width: 100% ; height: 24px ; margin-top: -10px; line-height: 20px ; text-align: center ; font-weight: bold ; text-shadow: 0px 0px 2px white , 0px 0px 2px white , 0px 0px 2px white , 0px 0px 2px white ; \">",
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
				Hb: "<span style=\"margin-right: 2px; width: 10px; text-align: center; color: black; height: 24px; vertical-align: middle; display: inline-block; font-size: 18px; font-family: 'Arial'; text-shadow: 0px 0px 2px red, 0px 0px 2px red, 0px 0px 2px red, 0px 0px 2px red, 0px 0px 2px red, 0px 0px 2px red, 0px 0px 2px red, 0px 0px 2px red, 0px 0px 2px red, 0px 0px 2px red, 0px 0px 2px red, 0px 0px 2px red; line-height: 22px;\">♠</span>"
			},
			secret: {
				topLineStart: "<div style=\"display: block; width: 100%; font-size: 18px; height: 16px; padding: 3px 0px; border-bottom: 1px solid white;\">",
				traitLineStart: "<div style=\"width: 100%; height: 20px; line-height: 20px; display: block; text-align: center; color: white; font-variant: small-caps; border-bottom: 1px solid white;\">",
				diceStart: "<div style=\"display: block ; width: 100% ; margin-left: 0% ; height: auto; line-height: 20px ; text-align: center ; font-weight: bold ; text-shadow: 0px 0px 2px white , 0px 0px 2px white , 0px 0px 2px white , 0px 0px 2px white ; margin-bottom: 0px\">",
				blockStart: "<div style=\"width: 100%; display: block; text-align: center;\">",
				startBlock: "<div style=\"display: inline-block; width: 48%; margin: 0% 1%; text-align: center;\">",
				blockNameStart: "<div style=\"display: block; width: 100%; font-size: 13px; margin-bottom: -5px; margin-top: 10px;\">",
				lineStart: "<div style=\"display: block; width: 100%; font-size: 12px;\">",
				startPlayerBlock: "<div style=\"display: block; width: 280px; padding: 45px 5px; margin-left: -58px; margin-top: -22px; margin-bottom: -5px; color: white; font-family: 'Percolator Text'; text-align: left; font-size: 16px; background: url('https://t4.ftcdn.net/jpg/00/78/66/11/240_F_78661103_aowhE8PWKrHRtoCUogPvkfWs22U54SuU.jpg') center no-repeat; background-size: 100% 100%; z-index: 100; position: relative;\">",
				playerTopLineStart: "<div style=\"display: block; margin-left: 28px;  width: 100%; font-size: 24px; font-family: 'Percolator Text'; height: 12px; padding: 3px 0px; text-align: left; margin-bottom: 10px; margin-top: -16px;\">",
				playerBotLineStart: "<div style=\"width: 100%; margin-left: 48px; height: auto; line-height: 15px; display: block;  text-align: left; color: white;\">",
				grey: "<span style=\"color: #A0A0A0; font-size: 24px; font-weight: bold;\">",
				greyS: "<span style=\"color: #A0A0A0; display: inline-block; line-height: 14px; vertical-align: top; margin-right: 5px; margin-left: -5px;\">",
				white: "<span style=\"color: white; font-size: 24px; font-weight: bold;\">",
				whiteB: "<span style=\"color: white; font-size: 40px; font-weight: bold;\">",
				greyPlus: "<span style=\"color: #A0A0A0; font-weight: bold; display: inline-block; text-align: right; margin: 0px 5px; vertical-align: top; line-height: 14px;\"> + </span>",
				greyMinus: "<span style=\"color: #A0A0A0; font-weight: bold; display: inline-block; text-align: right; margin: 0px 5px; vertical-align: top; line-height: 14px;\"> - </span>"
			}
		},
		// #endregion

		// #region Object Creation & Registration
		registerDie = (obj, category) => {
			const padRef = POSITIONS.dice[category].pad
			state[D.GAMENAME].Roller[category] = state[D.GAMENAME].Roller[category] || []
			if (D.IsObj(obj, "graphic")) {
				obj.set( {
					imgsrc: IMAGES.dice.Bf,
					layer: "objects",
					isdrawing: true,
					name: `rollerDie_${category}_${state[D.GAMENAME].Roller[category].length}`,
					controlledby: ""
				} )
				state[D.GAMENAME].Roller[category].push( {
					id: obj.id,
					top: obj.get("top"),
					left: obj.get("left"),
					width: obj.get("width"),
					height: obj.get("height"),
					value: "blank"
				} )
				DragPads.MakePad(obj, "selectDie", {
					deltaHeight: padRef.dH,
					deltaWidth: padRef.dW,
					deltaLeft: padRef.dX,
					deltaTop: padRef.dY
				} )
				D.Alert(`Registered die #${state[D.GAMENAME].Roller[category].length}: ${D.JS(_.values(state[D.GAMENAME].Roller[category] ).slice(-1))}, Added WigglePad #${_.values(state[D.GAMENAME].DragPads.byPad).length}`, "ROLLER: registerDie()")

				// D.Alert(`Returning Die Object: ${D.JS(obj)}`)

				return obj
			}

			return D.ThrowError(`Invalid object: ${D.JSL(obj)}`, "Roller: registerDie()")
		},
		makeDie = (category, isActive = false) => {
			state[D.GAMENAME].Roller[category] = state[D.GAMENAME].Roller[category] || []
			const stateRef = state[D.GAMENAME].Roller,
				posRef = POSITIONS.dice[category],
				die = createObj("graphic", {
					_pageid: D.PAGEID(),
					imgsrc: IMAGES.dice.Bf,
					left: posRef.left + posRef.spread * stateRef[category].length,
					top: posRef.top,
					width: posRef.width,
					height: posRef.height,
					layer: isActive ? "objects" : "map",
					isdrawing: true,
					controlledby: ""
				} )
			die.set( {
				left: posRef.left + posRef.spread * stateRef[category].length,
				top: posRef.top,
				width: posRef.width,
				height: posRef.height,
			} )
			// D.Alert(`Created Die: ${D.JS(die)}`)
			registerDie(die, category)

			return die
		},
		clearDice = category => {
			const diceObjs = _.filter(findObjs( {
				_pageid: Campaign().get("playerpageid"),
				_type: "graphic"
			} ), obj => obj.get("name").includes("rollerDie") && obj.get("name").includes(category))
			for (const die of diceObjs) {
				DragPads.DelPad(die.id)
				die.remove()
			}
			state[D.GAMENAME].Roller[category] = []
		},
		makeAllDice = (category, amount) => {
			const newDice = []
			clearDice(category)
			// Now, make requested number of dice.
			for (let i = 0; i < amount; i++)
				newDice.push(makeDie(category, category === STATECATS.dice[0]))

			// D.Alert(`NewDice List: ${D.JS(newDice)}`)

			for (let i = newDice.length; i > 0; i--)
				toFront(newDice[i - 1] )
		},
		registerText = (obj, objName) => {
			state[D.GAMENAME].Roller.textList = state[D.GAMENAME].Roller.textList || {}
			if (obj) {
				obj.set( {
					layer: "objects",
					name: `rollerText_${objName}`,
					controlledby: ""
				} )
				state[D.GAMENAME].Roller.textList[objName] = {
					id: obj.id,
					top: obj.get("top"),
					left: obj.get("left"),
					height: obj.get("height"),
					width: obj.get("width")
				}
				// D.Alert(`Registered text box '${objName}: ${D.JS(_.values(state[D.GAMENAME].Roller.textList).slice(-1))}`, "ROLLER: registerText()")

				return true
			}

			return D.ThrowError(`Invalid object: ${D.JSL(obj)}`, "Roller: registerText()")
		},
		registerImg = (obj, objName, params = {} ) => {
			if (_.isString(params)) {
				const kvpairs = params.split(","),
					imgInfo = {
						images: []
					}
				_.each(kvpairs, kvp => {
					if (kvp.includes("|")) {
						const [k, v] = kvp.split("|")
						imgInfo[k] = v
					} else {
						imgInfo.images.push(kvp)
					}
				} )
			}
			if (state[D.GAMENAME].Roller.imgList[objName] ) {
				const remObj = getObj("graphic", state[D.GAMENAME].Roller.imgList[objName].id)
				if (remObj)
					remObj.remove()
			}
			if (obj === null)
				return
			obj.set( {
				layer: "objects",
				name: `rollerImage_${objName}`,
				controlledby: ""
			} )
			state[D.GAMENAME].Roller.imgList[objName] = {
				id: obj.id,
				top: obj.get("top"),
				left: obj.get("left"),
				height: obj.get("height"),
				width: obj.get("width"),
				imgsrc: (params.images && params.images[0] ) || obj.get("imgsrc"),
				images: params.images || [obj.get("imgsrc")]
			}
			// D.Alert(`Registered image '${objName}: ${D.JS(_.values(state[D.GAMENAME].Roller.imgList).slice(-1))}`, "ROLLER: registerImg()")
		},
		registerShape = (obj, objName, params = {} ) => {
			state[D.GAMENAME].Roller.shapeList = params.isResetting ? {} : state[D.GAMENAME].Roller.shapeList || {}
			if (obj === null)
				return
			obj.set( {
				layer: "objects",
				name: `rollerShape_${objName}`,
				controlledby: ""
			} )
			state[D.GAMENAME].Roller.shapeList[objName] = {
				id: obj.id,
				type: obj.get("_type"),
				subType: params.subType || "line",
				top: obj.get("top"),
				left: obj.get("left"),
				height: obj.get("height"),
				width: obj.get("width")
			}
			D.Alert(`Registered shape '${objName}: ${D.JS(_.values(state[D.GAMENAME].Roller.shapeList).slice(-1))}`, "ROLLER: registerShape()")
		},
		// #endregion

		// #region Graphic & Text Control
		makeImg = (name, imgsrc, top, left, height, width) => {
			const img = createObj("graphic", {
				_pageid: D.PAGEID(),
				imgsrc,
				top,
				left,
				width,
				height,
				layer: "objects",
				isdrawing: true,
				controlledby: ""
			} )
			// D.Alert(`Registering image '${name}'.`, "ROLLER MAKEIMG")
			registerImg(img, name)
			toFront(img)

			return img
		},
		setImg = (objName, image) => {
			const obj = getObj("graphic", state[D.GAMENAME].Roller.imgList[objName].id)
			if (obj)
				obj.set("imgsrc", IMAGES[image] )
			else
				return D.ThrowError(`ROLLER: SETIMG(${objName}) >> No such image registered.`)

			return true
		},
		clearImg = imgName => {
			if (!state[D.GAMENAME].Roller.imgList[imgName] )
				return D.ThrowError(`NO IMAGE REGISTERED AS ${imgName}`)
			const obj = getObj("graphic", state[D.GAMENAME].Roller.imgList[imgName].id)
			if (obj) {
				DragPads.DelPad(obj.id)
				obj.remove()
				state[D.GAMENAME].Roller.imgList = _.omit(state[D.GAMENAME].Roller.imgList, imgName)

				return true
			}

			return D.ThrowError(`NO IMAGE REGISTERED AS ${imgName}`)
		},
		makeText = (name, font_family, font_size, top, left, color, text = "") => {
			const txt = createObj("text", {
				_pageid: D.PAGEID(),
				font_family,
				font_size,
				top,
				left,
				color,
				text,
				layer: "objects",
				controlledby: ""
			} )
			// D.Alert(`Registering text '${name}'.`, "ROLLER MAKETEXT")
			registerText(txt, name)

			return txt
		},
		setText = (objName, params) => {
			if (!state[D.GAMENAME].Roller.textList[objName] )
				return D.ThrowError(`No text object registered with name '${D.JS(objName)}'.`, "ROLLER: setText()")
			const obj = getObj("text", state[D.GAMENAME].Roller.textList[objName].id),
				{
					width,
					left,
					top
				} = state[D.GAMENAME].Roller.textList[objName]
			if (!obj)
				return D.ThrowError(`Failure to recover object '${D.JS(objName)}': ${D.JS(state[D.GAMENAME].Roller.textList)}`, "ROLLER: setText()")
			params.top = top
			params.left = left
			if (params.justified && params.justified === "left") {
				params.width = D.GetTextWidth(obj, params.text)
				params.left = left + params.width / 2 - width / 2
			}
			if (params.shift) {
				if (params.shift.anchor) {
					if (!state[D.GAMENAME].Roller.textList[params.shift.anchor] )
						return D.ThrowError(`No anchored object registered with name '${D.JS(params.shift.anchor)}' in params set:<br><br>${D.JS(params)}.`, "ROLLER: setText()")
					const anchorObj = getObj("text", state[D.GAMENAME].Roller.textList[params.shift.anchor].id),
						anchorWidth = parseInt(anchorObj.get("width")),
						anchorLeft = parseInt(anchorObj.get("left"))
					switch (params.shift.anchorSide) {
					case "right":
						params.left = anchorLeft +
								(0.5 * anchorWidth) +
								(0.5 * params.width) +
								parseInt(params.shift.amount)
						// D.DB("Shifting " + D.JSL(objName) + " right by " + D.JSL(params.shift.amount) + " from " + D.JSL(anchorLeft) + " to " + D.JSL(params.left), "ROLLER: setText()", 2);
						break
					default:
						break
					}
				}
				params.left += params.shift.left || 0
				params.top += params.shift.top || 0
			}
			if (_.isNaN(params.left) || _.isNaN(params.top) || _.isNaN(params.width))
				return D.ThrowError(`Bad top, left or width given for '${D.JS(objName)}': ${D.JS(params)}`, "ROLLER: setText()")
			obj.set(_.omit(params, ["justified", "shift"] ))

			return params
		},
		clearText = txtName => {
			const obj = getObj("text", state[D.GAMENAME].Roller.textList[txtName].id)
			if (obj) {
				obj.remove()
				state[D.GAMENAME].Roller.textList = _.omit(state[D.GAMENAME].Roller.textList, txtName)

				return true
			}

			return D.ThrowError(`NO TEXT OBJECT REGISTERED AS ${txtName}`)
		},
		setColor = (line, type, params, level) => {
			if (!type)
				D.ThrowError(`Invalid type '${D.JSL(type)}' `, "ROLLER: setColor()")
			else if (type && !COLORSCHEMES[type] )
				D.ThrowError(`No Color Scheme for type '${D.JS(type)}'`, "ROLLER: setColor()")
			else if (line && !COLORSCHEMES[type][line] )
				D.ThrowError(`No Color Scheme for line '${D.JS(line)}' in '${D.JS(type)}'`, "ROLLER: setColor()")
			else if (level && !COLORSCHEMES[type][line][level] )
				D.ThrowError(`No Level '${D.JS(level)}' for '${D.JS(line)}' in '${D.JS(type)}'`, "ROLLER: setColor()")
			else if (!level && !_.isString(COLORSCHEMES[type][line] ))
				D.ThrowError(`Must provide Level for '${D.JS(line)}' in '${D.JS(type)}'`, "ROLLER: setColor()")
			else
				params.color = level ? COLORSCHEMES[type][line][level] : COLORSCHEMES[type][line]

			return params
		},
		reposition = (selObjs = [] ) => {
			// D.Alert(`Selected Objects: ${selObjs}`, "ROLLER: Reposition")
			for (const sel of selObjs) {
				const obj = getObj(sel._type, sel._id)
				_.find(_.pick(state[D.GAMENAME].Roller, STATECATS[sel._type] ),
					(val, key) => _.find(val,
						(v, k) => {
							if (v.id === obj.id) {
								state[D.GAMENAME].Roller[key][k].left = obj.get("left")
								state[D.GAMENAME].Roller[key][k].top = obj.get("top")
								state[D.GAMENAME].Roller[key][k].height = obj.get("height")
								state[D.GAMENAME].Roller[key][k].width = obj.get("width")
								D.Alert(`Repositioned '${obj.id}' at [${D.JS(key)}/${D.JS(k)}] to: ${D.JS(state[D.GAMENAME].Roller[key][k] )}`, "ROLLER: reposition()")

								return true
							}

							return false
						} ))
			}
		},
		// #endregion

		// #region Dice Frame
		initFrame = () => {
			const [imageList, textList] = [[],[]],
				bgImg = Images.Get("Background")
			for (const name of _.keys(state[D.GAMENAME].Roller.textList))
				clearText(name)
			for (const name of _.keys(state[D.GAMENAME].Roller.imgList)) {
				if (name !== "Background")
					clearImg(name)
			}
			DragPads.ClearAllPads("wpReroll")
			DragPads.ClearAllPads("selectDie")
			for (const cat of STATECATS.dice)
				clearDice(cat)
			for (const textLine of _.keys(TEXTLINES)) {
				textList.push(makeText(
					textLine,
					TEXTLINES[textLine].font_family,
					TEXTLINES[textLine].font_size,
					TEXTLINES[textLine].top,
					TEXTLINES[textLine].left,
					TEXTLINES[textLine].color,
					TEXTLINES[textLine].text
				))
			}
			textList.reverse()
			for (const txt of textList) {
				if (_.isObject(txt))
					toFront(txt)
				else
					D.Alert("Not a text object.")
			}

			imageList.push(makeImg(
				"frontFrame",
				IMAGES.frontFrame,
				POSITIONS.diceFrameFront.top(),
				POSITIONS.diceFrameFront.left(),
				POSITIONS.diceFrameFront.height(),
				POSITIONS.diceFrameFront.width()
			))
			for (let i = 0; i < 9; i++) {
				imageList.push(makeImg(
					`topMid${i}`,
					IMAGES.topMids[i - 3 * Math.floor(i / 3)],
					POSITIONS.diceFrameMidTop.top(),
					POSITIONS.diceFrameMidTop.left() + (i * POSITIONS.diceFrameMidTop.xShift()),
					POSITIONS.diceFrameMidTop.height(),
					POSITIONS.diceFrameMidTop.width()
				))
				imageList.push(makeImg(
					`bottomMid${i}`,
					IMAGES.bottomMids[i - 3 * Math.floor(i / 3)],
					POSITIONS.diceFrameMidBottom.top(),
					POSITIONS.diceFrameMidBottom.left() + (i * POSITIONS.diceFrameMidBottom.xShift()),
					POSITIONS.diceFrameMidBottom.height(),
					POSITIONS.diceFrameMidBottom.width()
				))
			}
			imageList.push(makeImg(
				"topEnd",
				IMAGES.topEnd,
				POSITIONS.diceFrameEndTop.top(),
				POSITIONS.diceFrameEndTop.left(),
				POSITIONS.diceFrameEndTop.height(),
				POSITIONS.diceFrameEndTop.width()
			))
			imageList.push(makeImg(
				"bottomEnd",
				IMAGES.bottomEnd,
				POSITIONS.diceFrameEndBottom.top(),
				POSITIONS.diceFrameEndBottom.left(),
				POSITIONS.diceFrameEndBottom.height(),
				POSITIONS.diceFrameEndBottom.width()
			))
			imageList.push(makeImg(
				"diffFrame",
				IMAGES.diffFrame,
				POSITIONS.diceFrameDiffFrame.top(),
				POSITIONS.diceFrameDiffFrame.left(),
				POSITIONS.diceFrameDiffFrame.height(),
				POSITIONS.diceFrameDiffFrame.width()
			))
			DragPads.MakePad(null, "wpReroll", {
				top: POSITIONS.diceFrameRerollPad.top(),
				left: POSITIONS.diceFrameRerollPad.left(),
				height: POSITIONS.diceFrameRerollPad.height(),
				width: POSITIONS.diceFrameRerollPad.width()
			} )
			DragPads.Toggle("wpReroll", false)
			imageList.reverse()
			for (const img of imageList) {
				if (_.isObject(img))
					toBack(img)
				else
					D.Alert("Not an image.")
			}
			if (bgImg)
				toBack(bgImg)
			else
				D.Alert(`No background image found for id ${D.JS(state[D.GAMENAME].Roller.imgList.Background.id)}`)
			for (const diceCat of _.keys(SETTINGS.dice))
				makeAllDice(diceCat, SETTINGS.dice[diceCat] )
		},
		scaleFrame = (row, width) => {
			const stretchWidth = Math.max(width, 120),
				imgs = [getObj("graphic", state[D.GAMENAME].Roller.imgList[`${row}End`].id)],
				blanks = []
			let [midCount, endImg, stretchPer, left] = [0, null, 0, null]
			while (stretchWidth > 225 * (imgs.length - 1)) {
				imgs.push(getObj("graphic", state[D.GAMENAME].Roller.imgList[`${row}Mid${midCount}`].id))
				midCount++
				if (midCount >= IMAGES[`${row}Mids`].length * 3) {
					// D.Alert("Need " + (midCount - imgs.length + 2) + " more mid sections for " + row);
					break
				}
			}
			while (midCount < IMAGES[`${row}Mids`].length * 3) {
				blanks.push(getObj("graphic", state[D.GAMENAME].Roller.imgList[`${row}Mid${midCount}`].id))
				midCount++
			}
			stretchPer = stretchWidth / imgs.length
			D.DB(`${row} stretchWidth: ${stretchWidth}, imgs Length: ${imgs.length}, x225 ${imgs.length * 225}, stretch per: ${stretchPer}`, "SCALEFRAME()", 4)
			D.DB(`${row} midCount: ${midCount}, blanks length: ${blanks.length}`, "SCALEFRAME()", 4)
			endImg = imgs.shift()
			left = POSITIONS.diceFrameFront.left() + 120
			D.DB(`${row}Start at ${POSITIONS.diceFrameFront.left()}, + 120 to ${left}`, "SCALEFRAME()", 4)
			for (let i = 0; i < imgs.length; i++) {
				D.DB(`Setting ${row}Mid${i} to ${left}`, "SCALEFRAME()", 4)
				imgs[i].set( {
					left,
					imgsrc: IMAGES[`${row}Mids`][i - 3 * Math.floor(i / 3)]
				} )
				left += stretchPer
			}
			D.DB(`Setting ${row}End to ${left}`, "SCALEFRAME()", 4)
			endImg.set("left", left)
			for (let j = 0; j < blanks.length; j++) {
				D.DB(`Blanking Img #${imgs.length}${j}`, "SCALEFRAME()", 4)
				blanks[j].set("imgsrc", IMAGES.blank)
			}
		},
		// #endregion

		// #region Dice Graphic Control
		setDie = (dieNum, dieCat = "diceList", dieVal, params = {}, rollType = "") => {
			const dieRef = state[D.GAMENAME].Roller[dieCat][dieNum],
				dieParams = {
					id: dieRef.id
				},
				die = getObj("graphic", dieParams.id)
			if (!die)
				return D.ThrowError(`ROLLER: SETDIE(${dieNum}, ${dieCat}, ${dieVal}) >> No die registered.`)
			// D.DB(`Setting die ${D.JSL(dieNum)} (dieVal: ${D.JSL(dieVal)}, params: ${D.JSL(params)})`)

			if (dieVal !== "selected") {
				dieRef.value = dieVal
				state[D.GAMENAME].Roller.selected[dieCat] = _.without(state[D.GAMENAME].Roller.selected[dieCat], dieNum)
			}
			DragPads.Toggle(dieParams.id, !["humanity", "project", "secret", "remorse", "willpower"].includes(rollType) && dieVal !== "blank" && !dieVal.includes("H"))
			dieParams.imgsrc = IMAGES.dice[dieVal]
			dieParams.layer = dieVal === "blank" ? "map" : "objects"
			_.each( ["top", "left", "width"], dir => {
				if (die.get(dir) !== dieRef[dir] || (params.shift && params.shift[dir] ))
					dieParams[dir] = dieRef[dir] + (params.shift && params.shift[dir] ? params.shift[dir] : 0)
			} )
			// D.DB("Setting '" + D.JSL(dieVal) + "' in " + D.JSL(dieCat) + " to '" + D.JSL(dieParams) + "'", "ROLLER: setDie()", 4);
			die.set(dieParams)

			return die
		},
		selectDie = (dieNum, dieCat) => {
			state[D.GAMENAME].Roller.selected[dieCat] = state[D.GAMENAME].Roller.selected[dieCat] || []
			if (state[D.GAMENAME].Roller.selected[dieCat].includes(dieNum)) {
				setDie(dieNum, dieCat, state[D.GAMENAME].Roller[dieCat][dieNum].value)
				state[D.GAMENAME].Roller.selected[dieCat] = _.without(state[D.GAMENAME].Roller.selected[dieCat], dieNum)
			} else {
				setDie(dieNum, dieCat, "selected")
				state[D.GAMENAME].Roller.selected[dieCat].push(dieNum)
				if (state[D.GAMENAME].Roller.selected[dieCat].length > 3)
					selectDie(state[D.GAMENAME].Roller.selected[dieCat][0], dieCat)
			}
			if (state[D.GAMENAME].Roller.selected[dieCat].length > 0 && !isRerollFXOn) {
				isRerollFXOn = true
				lockRoller(true)
				D.RunFX("bloodCloud1", POSITIONS.bloodCloudFX)
				rerollFX = setInterval(D.RunFX, 1800, "bloodCloud1", POSITIONS.bloodCloudFX)
				DragPads.Toggle("wpReroll", true)
			} else if (state[D.GAMENAME].Roller.selected[dieCat].length === 0) {
				isRerollFXOn = false
				lockRoller(false)
				clearInterval(rerollFX)
				rerollFX = null
				DragPads.Toggle("wpReroll", false)
			}
		},
		// #endregion

		// #region Getting Information & Setting State Roll Record
		parseFlags = (charObj, rollType, params = {} ) => {
			params.args = params.args || []
			const gN = params.groupNum || "",
				flagData = {
					negFlagLines: [],
					posFlagLines: [],
					flagDiceMod: 0
				},
				traitList = _.compact(
					_.map((params.args[1] || params[0] || "").split(","), v => v.replace(/:\d+/gu, "").replace(/_/gu, " "))
				),
				bloodPot = parseInt(getAttrByName(charObj.id, `${gN}bp`)) || 0
			if ( ["rouse", "rouse2", "remorse", "check", "project", "secret", "humanity"].includes(rollType))
				return flagData
			if (parseInt(getAttrByName(charObj.id, "applyspecialty")) > 0) {
				flagData.posFlagLines.push("Specialty (●)")
				flagData.flagDiceMod++
			}
			if (parseInt(getAttrByName(charObj.id, "applyresonance")) > 0) {
				flagData.posFlagLines.push("Resonance (●)")
				flagData.flagDiceMod++
			}
			if (parseInt(getAttrByName(charObj.id, `${gN}applybloodsurge`)) > 0) {
				const bonus = D.BLOODPOTENCY[bloodPot].bp_surge
				flagData.posFlagLines.push(`Blood Surge (${bonus > 0 ? "●".repeat(bonus) : "~"})`)
				flagData.flagDiceMod += bonus
			}
			if (parseInt(getAttrByName(charObj.id, `${gN}applydisc`)) > 0) {
				const bonus = D.BLOODPOTENCY[bloodPot].bp_discbonus
				flagData.posFlagLines.push(`Discipline (${bonus > 0 ? "●".repeat(bonus) : "~"})`)
				flagData.flagDiceMod += bonus
			}
			if (params.groupNum)
				params.args[5] = _.map(params.args[5].split(","), v => `${v.split(":")[0]}:-${Math.abs(parseInt(v.split(":")[1] ))}`).join(",")

			/* D.Log(D.JSL(getAttrByName(charObj.id, gN + "incap")), "INCAPACITATION");
			   D.Log("PARAMS: " + D.JSL(params), "PARAMS");
			   D.Log("PARAMS DATA: " + D.JSL(params.args), "PARAMS DATA");
			   Return;
			   D.Log(D.JSL(params.args[4]), "PARAMS DATA 4"); */
			_.each(_.compact(_.flatten( [
				getAttrByName(charObj.id, `${gN}incap`) ? getAttrByName(charObj.id, `${gN}incap`).split(",") : [],
				params.args.length > 3 ? params.args[4].split(",") : "",
				params.args.length > 4 ? params.args[5].split(",") : ""
			] )), flag => {
				if (flag === "Health" && _.intersection(traitList, _.map(_.flatten( [D.ATTRIBUTES.physical, D.SKILLS.physical] ), v => v.toLowerCase())).length > 0) {
					flagData.negFlagLines.push("Injured (●●)")
					flagData.flagDiceMod -= 2
				} else if (flag === "Willpower" && _.intersection(traitList, _.map(_.flatten( [D.ATTRIBUTES.mental, D.ATTRIBUTES.social, D.SKILLS.mental, D.SKILLS.social] ), v => v.toLowerCase())).length > 0) {
					flagData.negFlagLines.push("Exhausted (●●)")
					flagData.flagDiceMod -= 2
				} else if (flag === "Humanity") {
					flagData.negFlagLines.push("Unsympathetic (●●)")
					flagData.flagDiceMod -= 2
				} else if (flag.includes(":")) { // Custom Flags of form Compulsion (Arrogance):psmd:-3 OR Compulsion (Arrogance):-3
					const customFlag = _.compact(flag.split(":")),
						mod = parseInt(customFlag[customFlag.length - 1] )
					if ((customFlag.length === 2 || customFlag.length === 3) && (
						(customFlag[1].includes("p") && _.intersection(traitList, _.flatten( [D.ATTRIBUTES.physical, D.SKILLS.physical] )).length > 0) ||
						(customFlag[1].includes("m") && _.intersection(traitList, _.flatten( [D.ATTRIBUTES.mental, D.SKILLS.mental] )).length > 0) ||
						(customFlag[1].includes("s") && _.intersection(traitList, _.flatten( [D.ATTRIBUTES.social, D.SKILLS.social] )).length > 0) ||
						(customFlag[1].includes("d") && _.intersection(traitList, D.DISCIPLINES).length > 0)
					)) {
						if (mod >= 0)
							flagData.posFlagLines.push(`${customFlag[0]} (${mod > 0 ? "●".repeat(mod) : "~"})`)
						else if (mod < 0)
							flagData.negFlagLines.push(`${customFlag[0]} (${"●".repeat(Math.abs(mod))})`)
						flagData.flagDiceMod += mod
					}
				}
			} )

			return flagData
		},
		parseTraits = (charObj, rollType, params) => {
			let traits = _.compact((params.args[1] || params[0] || "").split(","))
			const gN = params.groupNum || "",
				tFull = {
					traitList: [],
					traitData: {},
					traitDiceMod: 0
				}

			if (!params.groupNum) {
				switch (rollType) {
				case "frenzy":
					traits = ["willpower", "humanity"]
					break
				case "humanity":
				case "remorse":
					traits = ["humanity"]
					break
				case "willpower":
					traits = ["willpower"]
					break
				default:
					break
				}
			}

			tFull.traitList = traits.map(v => v.replace(/:\d+/gu, ""))

			_.each(traits, trt => {
				if (trt.includes(":")) {
					const tData = trt.split(":")
					tFull.traitData[tData[0]] = {
						display: D.Capitalize(tData[0] ),
						value: parseInt(tData[1] )
					}
					if (rollType === "frenzy" && tData[0] === "humanity") {
						tFull.traitData.humanity.display = "⅓ Humanity"
						tFull.traitData.humanity.value = Math.floor(tFull.traitData.humanity.value / 3)
					} else if (rollType === "remorse" && tData[0] === "stains") {
						tFull.traitData.humanity.display = "Human Potential"
						tFull.traitData.humanity.value = 10 - tFull.traitData.humanity.value - parseInt(tData[1] )
						tFull.traitList = _.without(tFull.traitList, "stains")
						delete tFull.traitData[tData[0]]
					}
				} else {
					tFull.traitData[trt] = {
						display: D.IsIn(trt) || getAttrByName(charObj.id, `${gN + trt}_name`),
						value: parseInt(getAttrByName(charObj.id, gN + trt)) || 0
					}
					if (rollType === "frenzy" && trt === "humanity") {
						tFull.traitData.humanity.display = "⅓ Humanity"
						tFull.traitData.humanity.value = Math.floor(tFull.traitData.humanity.value / 3)
					} else if (rollType === "remorse" && trt === "humanity") {
						tFull.traitData.humanity.display = "Human Potential"
						tFull.traitData.humanity.value = 10 -
							tFull.traitData.humanity.value -
							(parseInt(getAttrByName(charObj.id, `${gN}stains`)) || 0)
					} else if (!tFull.traitData[trt].display) {
						D.SendToPlayer(D.GetPlayerID(charObj), `Error determining NAME of trait '${D.JS(trt)}'.`, "ERROR: Dice Roller")
					}
				}
			} )

			return tFull
		},
		getRollData = (charObj, rollType, params) => {
			/* EXAMPLE RESULTS:
				{
				  groupNum: "",
				  charID: "-LN4P73XRfqCcI8U6c-t",
				  type: "project",
				  hunger: 0,
				  posFlagLines: [],
				  negFlagLines: [],
				  dicePool: 0,
				  traits: ["Politics", "Resources"],
				  traitData: {
				  	  Politics: {
				  		  display: "Politics",
						  value: 5
					  },
					  Resources: {
						  display: "Resources",
						  value: 5
					  }
				  },
				  diffMod: 1,
				  prefix: "repeating_project_-LQSF9eezKZpUhKBodBR_",
				  charName: "Kingston \"King\" Black",
				  mod: 0,
				  diff: 3
				}*/
			const flagData = parseFlags(charObj, rollType, params),
				traitData = parseTraits(charObj, rollType, params),
				gN = params.groupNum || "",
				rollData = {
					groupNum: gN,
					charID: charObj.id,
					type: rollType,
					hunger: parseInt(getAttrByName(charObj.id, `${gN}hunger`)),
					posFlagLines: flagData.posFlagLines,
					negFlagLines: flagData.negFlagLines,
					dicePool: flagData.flagDiceMod + traitData.traitDiceMod,
					traits: traitData.traitList,
					traitData: traitData.traitData,
					diffMod: 0,
					prefix: "",
					diff: null,
					mod: null
				}
			if (params.groupNum) {
				[rollData.charName] = params.args
				rollData.diff = parseInt(params.args[2] || 0)
				rollData.mod = parseInt(params.args[3] || 0)
			} else {
				rollData.charName = D.GetName(charObj)
				switch (rollType) {
				case "remorse":
					rollData.diff = 0
					rollData.mod = 0
					break
				case "project":
					rollData.diffMod = parseInt(params[3] || 0)
					rollData.prefix = ["repeating", "project", D.GetRepIDCase(params[4] ), ""].join("_")
					D.Log(`PROJECT PREFIX: ${D.JSL(rollData.prefix)}`)
					/* falls through */
				case "secret":
					rollData.diff = parseInt(params[1] || 0)
					rollData.mod = parseInt(params[2] || 0)
					break
				case "frenzy":
					rollData.diff = parseInt(params[0] || 0)
					rollData.mod = parseInt(params[1] || 0)
					break
				default:
					rollData.diff = rollData.diff === null ? parseInt(getAttrByName(charObj.id, "rolldiff")) : rollData.diff
					rollData.mod = rollData.mod === null ? parseInt(getAttrByName(charObj.id, "rollmod")) : rollData.mod
					break
				}
			}

			if ( ["remorse", "project", "humanity", "frenzy", "willpower", "check", "rouse", "rouse2"].includes(rollType))
				rollData.hunger = 0

			D.DB(`ROLL DATA: ${D.JS(rollData)}`, "ROLLER: makeSheetRoll()", 1)

			return rollData
		},
		getCurrentRoll = () => state[D.GAMENAME].Roller.rollRecord[state[D.GAMENAME].Roller.rollIndex],
		setCurrentRoll = (rollIndex) => {
			state[D.GAMENAME].Roller.rollIndex = rollIndex
		},
		replaceRoll = (rollData, rollResults, rollIndex) => {
			state[D.GAMENAME].Roller.rollIndex = rollIndex || state[D.GAMENAME].Roller.rollIndex
			state[D.GAMENAME].Roller.rollRecord[state[D.GAMENAME].Roller.rollIndex] = {
				rollData: _.clone(rollData),
				rollResults: _.clone(rollResults)
			}
		},
		recordRoll = (rollData, rollResults) => {
			state[D.GAMENAME].Roller.rollIndex = 0
			state[D.GAMENAME].Roller.rollRecord.unshift({
				rollData: _.clone(rollData),
				rollResults: _.clone(rollResults)
			})
			if (state[D.GAMENAME].Roller.rollRecord.length > 10)
				state[D.GAMENAME].Roller.rollRecord.pop()
		},
		// #endregion

		// #region Rolling Dice & Formatting Result
		buildDicePool = rollData => {
			/* MUST SUPPLY:
				  For Rouse & Checks:    rollData = { type }
				  For All Others:        rollData = { type, mod, << traits: [],
																traitData: { value, display }, hunger >> } */
			/* EXAMPLE RESULTS:
				{
				  groupNum: "",
				  charID: "-LN4P73XRfqCcI8U6c-t",
				  type: "project",
				  hunger: 0,
				  posFlagLines: [],
				  negFlagLines: [],
				  dicePool: 10,
				  traits: ["Politics", "Resources"],
				  traitData: {
					  Politics: {
						  display: "Politics",
						  value: 5
				  	  },
					  Resources: {
						  display: "Resources",
						  value: 5
					  }
				  },
				  diffMod: 1,
				  prefix: "repeating_project_-LQSF9eezKZpUhKBodBR_",
				  charName: "Kingston \"King\" Black",
				  mod: 0,
				  diff: 3,
				  basePool: 10,
				  hungerPool: 0
				} */
			rollData.hunger = rollData.hunger || 0
			rollData.basePool = 0
			rollData.hungerPool = 0
			rollData.dicePool = rollData.dicePool || 0
			switch (rollData.type) {
			case "rouse2":
				rollData.dicePool++
				rollData.hungerPool++
				/* falls through */
			case "rouse":
				rollData.hungerPool++
				rollData.basePool--
				/* falls through */
			case "check":
				rollData.dicePool++
				rollData.basePool++

				return rollData
			default:
				_.each(_.values(rollData.traitData), v => {
					rollData.dicePool += parseInt(v.value) || 0
				} )
				rollData.dicePool += parseInt(rollData.mod) || 0
				break
			}
			if (rollData.traits.length === 0 && rollData.dicePool <= 0) {
				D.SendToPlayer(D.GetPlayerID(D.GetChar(rollData.charID)), "You have no dice to roll!", "ERROR: Dice Roller")

				return false
			}
			rollData.hungerPool = Math.min(rollData.hunger, Math.max(1, rollData.dicePool))
			rollData.basePool = Math.max(1, rollData.dicePool) - rollData.hungerPool
			D.DB(`ROLL DATA: ${D.JS(rollData)}`, "ROLLER: buildDicePool()", 1)

			return rollData

			/* Var specialties = [];
			   _.each(rollData.traits, (trt) => {
			   RollData.traitData[trt] = {
			   Display: D.IsIn(trt) || D.IsIn(getAttrByName(charObj.id, trt + "_name")),
			   Value: parseInt(getAttrByName(charObj.id, trt)) || 0
			   };
			   If (rollData.type === "frenzy" && trt === "Humanity") {
			   RollData.traitData.Humanity.display = "⅓ Humanity";
			   RollData.traitData.Humanity.value = Math.floor(rollData.traitData.Humanity.value / 3);
			   } else if (rollData.type === "remorse" && trt === "Humanity") {
			   RollData.traitData.Humanity.display = "Human Potential";
			   RollData.traitData.Humanity.value = 10 - rollData.traitData.Humanity.value
			   - (parseInt(getAttrByName(charObj.id, "Stains")) || 0);
			   } else {
			   If (rollData.flags.includes("S")) {
			   _.each(getSpecialty(charObj, trt), (spec) => {
			   Specialties.push(spec);
			   });
			   }
			   If (!rollData.traitData[trt].display) {
			   D.SendToPlayer(D.GetPlayerID(charObj),
			   "Error determining NAME of trait '" + D.JS(trt) + "'.", "ERROR: Dice Roller");
			   Return false;
			   };
			   };
			   RollData.dicePool += rollData.traitData[trt].value;
			   });
			   If (specialties.length > 0) {
			   RollData.posFlagLines.push("Specialty: " + specialties.join(", ") + " (●)");
			   RollData.dicePool++;
			   }
			   _.each(rollData.flags, (flag) => {
			   Return;
			   });
			   RollData.dicePool = Math.max(0, rollData.dicePool); */
		},
		rollDice = (rollData, addVals) => {
			/* MUST SUPPLY:
				  rollData = { type, diff, basePool, hungerPool, << diffmod >> }
				    OR
				  rollData = { type, diff, rerollAmt }  */
			/* EXAMPLE RESULTS:
				{
				  total: 10,
				  critPairs: { b: 1, hb: 0, hh: 0 },
				  B: { crits: 0, succs: 6, fails: 2 },
				  H: { crits: 0, succs: 0, fails: 0, botches: 0 },
				  rolls: [ "B7", "B5", "B7", "B10", "B8", "B8", "B7", "B7", "B5", "B10" ],
				  diceVals: [ "BcL", "BcR", "Bs", "Bs", "Bs", "Bs", "Bs", "Bs", "Bf", "Bf" ],
				  margin: 5,
				  commit: 0
				}*/
			// D.DB(`RECEIVED ROLL DATA: ${D.JSL(rollData)}`, "ROLLER: rollDice()", 3)
			if (addVals)
				D.DB(`ADDED VALS: ${D.JS(addVals)}`, "ROLLER: rollDice()", 3)
			const sortBins = [],
				rollResults = {
					total: 0,
					critPairs: {
						bb: 0,
						hb: 0,
						hh: 0
					},
					B: {
						crits: 0,
						succs: 0,
						fails: 0
					},
					H: {
						crits: 0,
						succs: 0,
						fails: 0,
						botches: 0
					},
					rolls: [],
					diceVals: []
				},
				roll = dType => {
					const d10 = randomInteger(10)
					rollResults.rolls.push(dType + d10)
					switch (d10) {
					case 10:
						rollResults[dType].crits++
						rollResults.total++
						break
					case 9:
					case 8:
					case 7:
					case 6:
						rollResults[dType].succs++
						rollResults.total++
						break
					case 5:
					case 4:
					case 3:
					case 2:
						rollResults[dType].fails++
						break
					case 1:
						switch (dType) {
						case "B":
							rollResults.B.fails++
							break
						case "H":
							rollResults.H.botches++
							break
						default:
							break
						}
						break
					default:
						break
					}
				}

			if (rollData.rerollAmt) {
				for (let i = 0; i < rollData.rerollAmt; i++)
					roll("B")
			} else {
				_.each( {
					B: rollData.basePool,
					H: rollData.hungerPool
				}, (v, dType) => {
					for (let i = 0; i < parseInt(v); i++)
						roll(dType)
				} )
			}

			_.each(addVals, val => {
				const dType = val.slice(0, 1)
				switch (val.slice(1, 2)) {
				case "c":
					rollResults[dType].crits++
					rollResults.total++
					break
				case "s":
					rollResults[dType].succs++
					rollResults.total++
					break
				case "f":
					rollResults[dType].fails++
					break
				case "b":
					rollResults[dType].botches++
					break
				default:
					break
				}
			} )

			D.DB(`PRE-SORT RESULTS: ${D.JSL(rollResults)}`, "ROLLER: rollDice()", 3)
			// D.Alert(rollResults, "PRESORT ROLL RESULTS");
			switch (rollData.type) {
			case "secret":
			case "trait":
			case "frenzy":
				sortBins.push("H")
				/* falls through */
			case "remorse":
			case "humanity":
			case "willpower":
			case "project":
				sortBins.push("B")
				while (rollResults.B.crits + rollResults.H.crits >= 2) {
					rollResults.commit = 0
					while (rollResults.H.crits >= 2) {
						rollResults.H.crits -= 2
						rollResults.critPairs.hh++
						rollResults.total += 2
						rollResults.diceVals.push("HcL")
						rollResults.diceVals.push("HcR")
					}
					if (rollResults.B.crits > 0 && rollResults.H.crits > 0) {
						rollResults.B.crits--
						rollResults.H.crits--
						rollResults.critPairs.hb++
						rollResults.total += 2
						rollResults.diceVals.push("HcL")
						rollResults.diceVals.push("BcR")
					}
					while (rollResults.B.crits >= 2) {
						rollResults.B.crits -= 2
						rollResults.critPairs.bb++
						rollResults.total += 2
						rollResults.diceVals.push("BcL")
						rollResults.diceVals.push("BcR")
					}
				}
				_.each( ["crits", "succs", "fails", "botches"], bin => {
					_.each(sortBins, v => {
						for (let i = 0; i < rollResults[v][bin]; i++)
							rollResults.diceVals.push(v + bin.slice(0, 1))
					} )
				} )
				if (rollData.diff !== 0 || rollData.diffMod > 0)
					rollResults.margin = rollResults.total - rollData.diff
				break
			case "rouse2":
			case "rouse":
				rollResults.diceVals = _.map(rollResults.rolls, rol => parseInt(rol.slice(1)) < 6 ? "Hb" : "Bs")
				if (rollResults.diceVals[1] && rollResults.diceVals[0] !== rollResults.diceVals[1] )
					rollResults.diceVals = ["Hb", "Bs"]
				break
			case "check":
				rollResults.diceVals = _.map(rollResults.rolls, rol => parseInt(rol.slice(1)) < 6 ? "Hf" : "Bs")
				break
			default:
				break
			}
			if (!(rollResults.commit && rollResults.commit === 0)) {
				const scope = rollData.diff - rollData.diffMod - 2
				rollResults.commit = Math.max(1, scope + 1 - rollResults.margin)
			}
			D.DB(`ROLL RESULTS: ${D.JS(rollResults)}`, "ROLLER: rollDice()", 1)

			return rollResults
		},
		formatDiceLine = (rollData = {}, rollResults, split = 15, isSmall = false) => {
			/* MUST SUPPLY:
				  << rollData = { isReroll = true, isGMMod = true  } >>
				  rollResults = { diceVals = [], total, << margin >> }

			resultBlock: "<div style=\"display: block; width: 120%; margin-left: -10%; height: auto; \">",
			resultCount: "<div style=\"display: inline-block; width: YYY; text-align: right; height: 100%; \">
				<span style=\"display: inline-block; font-weight: normal; font-family: Verdana; text-shadow: none;
					height: 24px; line-height: 24px; vertical-align: middle; width: 40px; text-align: right;
					margin-right: 10px; font-size: 12px;\">",
			margin: "<div style=\"display: inline-block; width: YYY; text-align: left; height: 100%; \">
				<span style=\"display: inline-block; font-weight: normal; font-family: Verdana; text-shadow: none;
					height: 24px; line-height: 24px; vertical-align: middle; width: 40px; text-align: left;
					margin-left: 10px; font-size: 12px;\">", */
			const dims = {
					widthSide: 0,
					widthMid: 0,
					marginSide: 0
				},
				critCount = _.reduce(_.values(rollResults.critPairs), (tot, num) => tot + num, 0),
				splitAt = Math.ceil((rollResults.diceVals.length + critCount) /
					Math.ceil((rollResults.diceVals.length + critCount) / split))
			let logLine = `${CHATSTYLES.resultBlock}${CHATSTYLES.resultCount}${rollResults.total}:</span></div>${
					CHATSTYLES.resultDice.colStart}${CHATSTYLES.resultDice.lineStart}`,
				counter = 0
			if (isSmall)
				logLine = CHATSTYLES.resultDice.lineStart
			if (rollData.isReroll) {
				_.each(rollResults, roll => roll)
			} else if (rollData.isGMMod) {
				_.each(rollResults, roll => roll)
			} else {
				_.each(rollResults.diceVals, v => {
					if (counter >= splitAt) {
						dims.widthMid = Math.max(dims.widthMid, counter)
						counter = 0
						logLine += CHATSTYLES.resultDice.lineBreak
						dims.marginSide += 7
					}
					logLine += CHATSTYLES.resultDice[v]
					counter += v.includes("L") || v.includes("R") ? 1.5 : 1
				} )
				dims.widthMid = 12 * Math.max(dims.widthMid, counter)
				dims.widthSide = (250 - dims.widthMid) / 2
				if (isSmall) {
					logLine += "</div>"
				} else {
					logLine = [
						logLine,
						"</div></div>",
						CHATSTYLES.margin,
						typeof rollResults.margin === "number" ?
							`(${rollResults.margin >= 0 ? "+" : "-"}${Math.abs(rollResults.margin)})` :
							"",
						"</span></div></div>"
					].join("")
						.replace(/XXX/gu, dims.widthMid)
						.replace(/YYY/gu, dims.widthSide)
						.replace(/ZZZ/gu, dims.marginSide)
				}
			}

			return logLine
		},
		displayRoll = (isLogging = true) => {
			/* MUST SUPPLY:
				[ALL]
				  rollData = { type, charName, charID }
				  rollResults = { total, diceVals: [] }
				[ALL Non-Checks]
				  rollData = { mod, dicePool, traits: [], traitData: { value, display }, << diff, groupNum >> }
				  rollResults = { H: { botches }, critPairs: {hh, hb, bb}, << margin >> }
				[TRAIT ONLY]
				  rollData = { posFlagLines, negFlagLines } */
			const {rollData, rollResults} = getCurrentRoll(),
				gNum = rollData.groupNum || "",
				[deltaAttrs, txtWidths] = [{}, {}],
				[mainRollParts, mainRollLog, diceObjs] = [[], [], []],
				yShift = 0,
				rollLines = {
					rollerName: {
						text: "",
						justified: "left"
					},
					mainRoll: {
						text: "",
						justified: "left",
						shift: {
							top: 20
						}
					},
					mainRollShadow: {
						text: "",
						justified: "left",
						shift: {
							top: 20
						}
					}
				},
				logLines = {
					fullBox: CHATSTYLES.fullBox,
					rollerName: "",
					mainRoll: "",
					mainRollSub: "",
					difficulty: "",
					resultDice: "",
					margin: "",
					outcome: "",
					subOutcome: ""
				},
				p = v => rollData.prefix + v
			let [blankLines, introPhrase, logPhrase, logString, stains, margin, total, bookends, spread] = new Array(9).fill(null),
				maxHumanity = 10,
				diceCats = _.clone(STATECATS.dice)
			switch (rollData.type) {
			case "project":
				rollLines.subOutcome = {
					text: ""
				}
				/* falls through */
			case "trait":
				if (rollData.posFlagLines.length > 0) {
					rollLines.posMods = {
						text: `+ ${rollData.posFlagLines.join(" + ")}          `,
						justified: "left"
					}
					rollLines.mainRoll.shift.top = 0
					rollLines.mainRollShadow.shift.top = 0
				} else {
					rollLines.posMods = {
						text: "  ",
						justified: "left"
					}
				}
				if (rollData.negFlagLines.length > 0) {
					rollLines.negMods = {
						text: `- ${rollData.negFlagLines.join(" - ")}`,
						justified: "left",
						shift: {
							anchor: "posMods",
							anchorSide: "right",
							amount: 0
						}
					}
					rollLines.mainRoll.shift.top = 0
					rollLines.mainRollShadow.shift.top = 0
				}
				/* falls through */
			case "willpower":
			case "humanity":
				rollLines.margin = {
					text: ""
				}
				/* falls through */
			case "frenzy":
				if (rollData.diff > 0) {
					rollLines.difficulty = {
						text: ""
					}
				}
				/* falls through */
			case "remorse":
			case "rouse2":
			case "rouse":
			case "check":
				rollLines.summary = {
					text: ""
				}
				rollLines.summaryShadow = {
					text: ""
				}
				rollLines.resultCount = {
					text: ""
				}
				rollLines.resultCountShadow = {
					text: ""
				}
				rollLines.outcome = {
					text: "",
					justified: "left"
				}
				break
			default:
				return D.ThrowError(`Unrecognized rollType: ${D.JSL(rollData.rollType)}`, "APPLYROLL: START")
			}

			if (rollData.diff === 0)
				setImg("diffFrame", "blank")

			_.each(_.keys(rollLines), line => {
				if (_.isString(COLORSCHEMES[rollData.type][line] ))
					rollLines[line] = setColor(line, rollData.type, rollLines[line] )
			} )

			blankLines = _.keys(_.omit(state[D.GAMENAME].Roller.textList, _.keys(rollLines)))

			D.DB(`ROLL LINES: ${D.JS(rollLines)}`, "ROLLER: applyRoll()", 3)
			D.DB(`BLANKING LINES: ${D.JS(blankLines)}`, "ROLLER: applyRoll()", 3)

			_.each(rollLines, (content, name) => {
				switch (name) {
				case "mainRoll":
					switch (rollData.type) {
					case "remorse":
						introPhrase = introPhrase || `Does ${rollData.charName} feel remorse?`
						logPhrase = logPhrase || " rolls remorse:"
						/* falls through */
					case "frenzy":
						introPhrase = introPhrase || `${rollData.charName} and the Beast wrestle for control...`
						logPhrase = logPhrase || " resists frenzy:"
						/* falls through */
					case "project":
						introPhrase = introPhrase ||
									`${rollData.charName} launches a Project (Scope ${rollData.diff - rollData.diffMod - 2}):`
						logPhrase = logPhrase ||
									` launches a Project (Scope ${rollData.diff - rollData.diffMod - 2}):`
						/* falls through */
					case "trait":
					case "willpower":
					case "humanity":
						introPhrase = introPhrase || `${rollData.charName} rolls: `
						logPhrase = logPhrase || " rolls:"
						_.each(rollData.traits, trt => {
							let dotline = "●".repeat(rollData.traitData[trt].value)
							switch (trt) {
							case "stains":
								dotline = ""
								/* falls through */
							case "humanity":
								stains = Math.max(parseInt(getAttrByName(rollData.charID, "stains") || 0), 0)
								if (rollData.type === "frenzy") {
									stains = Math.max(stains === 0 ? 0 : 1, Math.floor(stains / 3))
									maxHumanity = 4
								}
								if (rollData.type === "remorse")
									dotline = "◌".repeat(Math.max(maxHumanity - dotline.length - stains, 0)) + dotline + "◌".repeat(stains)
								else
									dotline += "◌".repeat(Math.max(maxHumanity - dotline.length - (stains || 0)), 0) + "‡".repeat(stains || 0)
								break
							case "willpower": // Stains
								dotline += "◌".repeat(Math.max(0, parseInt(getAttrByName(rollData.charID, "willpower_max")) - parseInt(rollData.traitData[trt].value)))
								break
							default:
								if (rollData.traitData[trt].value === 0)
									dotline = "~"
								break
							}
							if (trt !== "stains") {
								mainRollParts.push(
									`${rollData.traitData[trt].display} (${dotline})`
								)
								mainRollLog.push(
									`${rollData.traitData[trt].display} (${rollData.traitData[trt].value})`
								)
							}
						} )
						// LogLines.rollerName += logPhrase;
						rollLines.rollerName.text = introPhrase
						rollLines.mainRoll.text = mainRollParts.join(" + ")
						logLines.mainRoll = CHATSTYLES.mainRoll + mainRollLog.join(" + ")
						if (rollData.mod && rollData.mod !== 0) {
							if (rollData.traits.length === 0 && rollData.mod > 0) {
								rollLines.mainRoll.text = `${rollData.mod} Dice`
								logLines.mainRoll = `${CHATSTYLES.mainRoll + rollData.mod} Dice`
							} else {
								logLines.mainRoll += (rollData.mod < 0 ? " - " : " + ") + Math.abs(rollData.mod)
								rollLines.mainRoll.text += (rollData.mod < 0 ? " - " : " + ") + Math.abs(rollData.mod)
							}
						}
						if (rollData.type === "project")
							deltaAttrs[p("projectlaunchresultsummary")] = logLines.mainRoll
						if (rollData.dicePool <= 0) {
							logLines.mainRollSub = `${CHATSTYLES.mainRollSub}(One Die Minimum)</span>`
							rollData.dicePool = 1
							rollLines.mainRoll.text += " (One Die Minimum)"
						}
						break
					case "rouse2":
						rollLines.mainRoll.text = " (Best of Two)"
						logLines.mainRollSub = `${CHATSTYLES.mainRollSub}(Best of Two)</span>`
						/* falls through */
					case "rouse":
						introPhrase = introPhrase || `${rollData.charName}:`
						logPhrase = logPhrase || ":"
						logLines.mainRoll = `${CHATSTYLES.check}Rouse Check`
						rollLines.mainRoll.text = `Rouse Check${rollLines.mainRoll.text}`
						break
					case "check":
						introPhrase = introPhrase || `${rollData.charName}:`
						logPhrase = logPhrase || ":"
						logLines.mainRoll = `${CHATSTYLES.check}Simple Check`
						rollLines.mainRoll.text = "Simple Check"
						break
					default:
						introPhrase = introPhrase || `${rollData.charName}:`
						logPhrase = logPhrase || ":"
					}
					logLines.rollerName = logPhrase
					rollLines.rollerName.text = introPhrase || ""
					rollLines.mainRollShadow.text = rollLines.mainRoll.text
					break
				case "summary":
					rollLines.summary.text = JSON.stringify(rollData.dicePool)
					rollLines.summaryShadow.text = rollLines.summary.text
					break
				case "difficulty":
					if (rollData.diff === 0 && rollData.diffMod === 0) {
						// D.Alert("Difficulty Is BLANK!")
						rollLines.difficulty.text = " "
						setImg("diffFrame", "blank")
						break
					}
					// D.Alert(`Setting Difficulty to ${rollData.diff}`)
					setImg("diffFrame", "diffFrame")
					rollLines.difficulty = {
						text: rollData.diff.toString()
					}
					logLines.difficulty = ` vs. ${rollData.diff}`
					if (rollData.type === "project")
						deltaAttrs[p("projectlaunchresultsummary")] += ` vs. Difficulty ${rollData.diff}`

					/* D.Alert(`RollLines: ${D.JS(rollLines)}`)
								   D.Alert(`LogLines: ${D.JS(logLines)}`) */
					break
				case "resultCount":
					rollLines.resultCount.text = JSON.stringify(rollResults.total)
					rollLines.resultCountShadow.text = rollLines.resultCount.text
					break
				case "margin":
					( {
						margin
					} = rollResults)
					if (!margin) {
						rollLines.margin.text = " "
						break
					}
					rollLines.margin.text = (margin > 0 ? "+" : margin === 0 ? "" : "-") + Math.abs(margin)
					logLines.margin = ` (${margin > 0 ? "+" : margin === 0 ? "" : "-"}${Math.abs(margin)})${logLines.margin}`
					rollLines.margin = setColor("margin", rollData.type, rollLines.margin, margin >= 0 ? "good" : "bad")
					break
				case "outcome":
					( {
						total,
						margin
					} = rollResults)
					switch (rollData.type) {
					case "project":
						rollLines.outcome.shift = {
							top: -10
						}
						if (total === 0) {
							logLines.outcome = `${CHATSTYLES.outcomeRed}TOTAL FAILURE!</span></div>`
							logLines.subOutcome = `${CHATSTYLES.subOutcomeRed}Enemies Close In</span></div>`
							rollLines.outcome.text = "TOTAL FAILURE!"
							rollLines.subOutcome.text = "Your Enemies Close In..."
							rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "worst")
							rollLines.subOutcome = setColor("subOutcome", rollData.type, rollLines.subOutcome, "worst")
							deltaAttrs[p("projectlaunchresultsummary")] += ":&nbsp;&nbsp;&nbsp;TOTAL FAIL"
							deltaAttrs[p("projectlaunchresults")] = "TOTAL FAIL"
							deltaAttrs[p("projectlaunchresultsmargin")] = "You've Angered Someone..."
						} else if (margin < 0) {
							logLines.outcome = `${CHATSTYLES.outcomeOrange}FAILURE!</span></div>`
							logLines.subOutcome = `${CHATSTYLES.subOutcomeOrange}+1 Difficulty to Try Again</span></div>`
							rollLines.outcome.text = "FAILURE!"
							rollLines.subOutcome.text = "+1 Difficulty to Try Again"
							rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "bad")
							rollLines.subOutcome = setColor("subOutcome", rollData.type, rollLines.subOutcome, "bad")
							delete deltaAttrs[p("projectlaunchresultsummary")]
							deltaAttrs[p("projectlaunchdiffmod")] = rollData.diffMod + 1
							deltaAttrs[p("projectlaunchdiff")] = rollData.diff + 1
						} else if (rollResults.critPairs.bb > 0) {
							logLines.outcome = `${CHATSTYLES.outcomeWhite}CRITICAL WIN!</span></div>`
							logLines.subOutcome = `${CHATSTYLES.subOutcomeWhite}No Commit Needed!</span></div>`
							rollLines.outcome.text = "CRITICAL WIN!"
							rollLines.subOutcome.text = "No Commit Needed!"
							rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "best")
							rollLines.subOutcome = setColor("subOutcome", rollData.type, rollLines.subOutcome, "best")
							deltaAttrs[p("projectlaunchresultsummary")] += ":&nbsp;&nbsp;&nbsp;CRITICAL WIN!"
							deltaAttrs[p("projectlaunchresults")] = "CRITICAL WIN!"
							deltaAttrs[p("projectlaunchresultsmargin")] = "No Stake Needed!"
						} else {
							logLines.outcome = `${CHATSTYLES.outcomeWhite}SUCCESS!</span></div>`
							logLines.subOutcome = `${CHATSTYLES.subOutcomeWhite}Stake ${rollResults.commit} Dots</span></div>`
							rollLines.outcome.text = "SUCCESS!"
							rollLines.subOutcome.text = `Stake ${rollResults.commit} Dots`
							rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "best")
							rollLines.subOutcome = setColor("subOutcome", rollData.type, rollLines.subOutcome, "best")
							deltaAttrs[p("projecttotalstake")] = rollResults.commit
							deltaAttrs[p("projectlaunchresultsmargin")] = `(${rollResults.commit} Stake Required, ${rollResults.commit} to Go)`
							deltaAttrs[p("projectlaunchresultsummary")] += `:&nbsp;&nbsp;&nbsp;${total} SUCCESS${total > 1 ? "ES" : ""}!`
							deltaAttrs[p("projectlaunchresults")] = "SUCCESS!"
						}
						break
					case "trait":
						if (
							(total === 0 || (margin && margin < 0)) &&
									rollResults.H.botches > 0
						) {
							rollLines.outcome.text = "BESTIAL FAILURE!"
							logLines.outcome = `${CHATSTYLES.outcomeRed}BESTIAL FAILURE!</span></div>`
							rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "worst")
							break
						} else if (
							(!margin || margin >= 0) &&
									(rollResults.critPairs.hb + rollResults.critPairs.hh) > 0
						) {
							rollLines.outcome.text = "MESSY CRITICAL!"
							logLines.outcome = `${CHATSTYLES.outcomeRed}MESSY CRITICAL!</span></div>`
							rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "worst")
							break
						}
						/* falls through */
					case "willpower":
					case "humanity":
						if (total === 0) {
							rollLines.outcome.text = "TOTAL FAILURE!"
							logLines.outcome = `${CHATSTYLES.outcomeRed}TOTAL FAILURE!</span></div>`
							rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "worst")
						} else if (margin < 0) {
							logLines.outcome = `${CHATSTYLES.outcomeOrange}COSTLY SUCCESS?</span></div>`
							rollLines.outcome.text = "COSTLY SUCCESS?"
							rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "bad")
						} else if (rollResults.critPairs.bb > 0) {
							logLines.outcome = `${CHATSTYLES.outcomeWhite}CRITICAL WIN!</span></div>`
							rollLines.outcome.text = "CRITICAL WIN!"
							rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "best")
						} else {
							logLines.outcome = `${CHATSTYLES.outcomeWhite}SUCCESS!</span></div>`
							rollLines.outcome.text = "SUCCESS!"
							rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "good")
						}
						break
					case "frenzy":
						if (total === 0 || margin < 0) {
							rollLines.outcome.text = "YOU FRENZY!"
							logLines.outcome = `${CHATSTYLES.outcomeRed}FRENZY!</span></div>`
							rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "worst")
						} else if (rollResults.critPairs.bb > 0) {
							rollLines.outcome.text = "RESISTED!"
							logLines.outcome = `${CHATSTYLES.outcomeWhite}RESISTED!</span></div>`
							rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "best")
						} else {
							rollLines.outcome.text = "RESTRAINED..."
							logLines.outcome = `${CHATSTYLES.outcomeWhite}RESTRAINED...</span></div>`
							rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "good")
						}
						break
					case "remorse":
						deltaAttrs[`${gNum}humanity_dstains`] = -1 * parseInt(getAttrByName(rollData.charID, `${gNum}Stains`) || 0)
						if (rollResults.total === 0) {
							rollLines.outcome.text = "YOUR HUMANITY FADES..."
							logLines.outcome = `${CHATSTYLES.outcomeRed}DEGENERATION</span></div>`
							deltaAttrs[`${gNum}humanity_dhum`] = -1
							rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "bad")
						} else {
							rollLines.outcome.text = "YOU FIND ABSOLUTION!"
							logLines.outcome = `${CHATSTYLES.outcomeWhite}ABSOLUTION</span></div>`
							rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "good")
						}
						break
					case "rouse":
					case "rouse2":
						if (rollResults.total > 0) {
							rollLines.outcome.text = "RESTRAINED..."
							logLines.outcome = `${CHATSTYLES.outcomeWhite}RESTRAINED</span></div>`
							rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "good")
						} else {
							rollLines.outcome.text = "HUNGER ROUSED!"
							logLines.outcome = `${CHATSTYLES.outcomeRed}ROUSED!</span></div>`
							rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "worst")
							deltaAttrs[`${gNum}hunger`] = parseInt(getAttrByName(rollData.charID, `${gNum}hunger`)) + 1
						}
						break
					case "check":
						if (rollResults.total > 0) {
							rollLines.outcome.text = "PASS"
							logLines.outcome = `${CHATSTYLES.outcomeWhite}PASS</span></div>`
							rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "good")
						} else {
							rollLines.outcome.text = "FAIL"
							logLines.outcome = `${CHATSTYLES.outcomeRed}FAIL</span></div>`
							rollLines.outcome = setColor("outcome", rollData.type, rollLines.outcome, "worst")
						}
						break
					default:
						D.ThrowError(`Unrecognized rollType: ${D.JSL(rollData.rollType)}`, "APPLYROLL: MID")
					}
					break
				default:
					break
				}
			} )

			if (_.isNumber(deltaAttrs.hunger))
				Images.Toggle(`Hunger${getAttrByName(rollData.charID, "sandboxquadrant")}_1`, true, deltaAttrs.hunger)

			logLines.rollerName = `${CHATSTYLES.rollerName + rollData.charName + logLines.rollerName}</div>`
			logLines.mainRoll = `${logLines.mainRoll + logLines.difficulty}</span>${logLines.mainRollSub}</div>`
			logLines.resultDice = formatDiceLine(rollData, rollResults, 13)
			logString = `${logLines.fullBox + logLines.rollerName + logLines.mainRoll + logLines.resultDice +
				logLines.outcome + logLines.subOutcome}</div>`

			D.DB(`LOGLINES: ${D.JS(logLines)}`, "LOG LINES", 2)
			
			if (isLogging)
				sendChat("", logString)
			// D.Alert(logString);

			D.DB("... Complete.", "ROLLER: applyRolls()", 4)

			_.each(blankLines, line => {
				rollLines[line] = {
					text: " "
				}
			} )

			switch (rollData.type) {
			case "rouse2":
			case "rouse":
			case "check":
				diceCats = diceCats.reverse()
				/* falls through */
			case "project":
			case "secret":
			case "humanity":
			case "willpower":
			case "remorse":
				DragPads.Toggle("selectDie", false)
				break
			default:
				break
			}

			// D.Alert(`RollResults: ${D.JS(rollResults)}<br><br>DiceCats: ${D.JS(diceCats)}`)

			// D.DB("Processing '" + D.JSL(diceCats[0]) + "' (length = " + D.JSL(state[D.GAMENAME].Roller[diceCats[0]].length) + "): " + D.JSL(state[D.GAMENAME].Roller[diceCats[0]]), "ROLLER: applyRoll()", 2);
			for (let i = 0; i < state[D.GAMENAME].Roller[diceCats[0]].length; i++) {
				diceObjs.push(setDie(i, diceCats[0], rollResults.diceVals[i] || "blank", {
					type: rollData.type,
					shift: {
						top: yShift
					}
				}, rollData.type))
			}
			// D.DB("Dice Objects List: '" + D.JSL(diceObjs) + "'", "ROLLER: applyRoll()", 2);

			bookends = [diceObjs[0], diceObjs[rollResults.diceVals.length - 1]]

			if (!bookends || bookends.length < 2 || _.isUndefined(bookends[0] ) || _.isUndefined(bookends[1] ))
				return D.ThrowError(`Bookends Not Found.  DiceObjs.length is ${diceObjs.length}, rollResults.diceVals is ${rollResults.diceVals.length}: ${D.JSL(diceObjs)}`)

			spread = bookends[1].get("left") - bookends[0].get("left")

			scaleFrame("bottom", spread)
			for (let i = 0; i < state[D.GAMENAME].Roller[diceCats[1]].length; i++)
				setDie(i, diceCats[1], "blank")

			_.each(rollLines, (args, name) => {
				const params = setText(name, args)
				txtWidths[name] = params.width
			} )
			spread = txtWidths.posMods || 0 + txtWidths.negMods || 0
			spread += txtWidths.posMods && txtWidths.negMods ? 100 : 0
			spread = Math.max(spread, txtWidths.mainRoll)
			scaleFrame("top", spread)

			D.RunFX("bloodBolt", POSITIONS.bloodBoltFX)
			if (_.values(deltaAttrs).length > 0) {
				D.DB(`DELTAATTRS: ${D.JS(deltaAttrs)}`, 1)
				setAttrs(rollData.charID, deltaAttrs)
			}

			return deltaAttrs
		},
		makeNewRoll = (charObj, rollType, params) => {
			D.DB(`PARAMS: ${D.JS(params)} (length: ${params.length})`, "ROLLER: makeSheetRoll()", 1)
			const rollData = buildDicePool(getRollData(charObj, rollType, params))
			D.DB(`RECEIVED ROLLDATA: ${D.JS(rollData)}`, 1)
			recordRoll(rollData, rollDice(rollData))
			displayRoll()
			D.DB("FINISHED MAKE NEW ROLL.", "ROLLER: makeSheetRoll()", 1)
		},
		wpReroll = dieCat => {
			clearInterval(rerollFX);
			[isRerollFXOn, rerollFX] = [false, null]
			const rollRecord = getCurrentRoll(),
				rollData = _.clone(rollRecord.rollData),
				rolledDice = _.mapObject(
					_.omit(
						state[D.GAMENAME].Roller[dieCat],
						(v, dNum) => v.value === "blank" ||
							state[D.GAMENAME].Roller.selected[dieCat].includes(parseInt(dNum))
					), v => v.value
				),
				charObj = getObj("character", rollData.charID)
			if (charObj)
				Chars.Damage(charObj, "willpower", "spent", 1)
			rollData.rerollAmt = state[D.GAMENAME].Roller.selected[dieCat].length
			replaceRoll(rollData, rollDice(rollData, _.values(rolledDice)))
			displayRoll()
			lockRoller(false)
			DragPads.Toggle("wpReroll", false)
		},
		changeRoll = deltaDice => {
			const rollRecord = getCurrentRoll(),
				rollData = _.clone(rollRecord.rollData)
			let rollResults = _.clone(rollRecord.rollResults)
			if (parseInt(deltaDice) < 0) {
				_.shuffle(rollResults.diceVals)
				for (let i = 0; i > deltaDice; i--) {
					const cutIndex = rollResults.diceVals.findIndex(v => v.startsWith("B"))
					if (cutIndex === -1)
						return D.ThrowError(`Not enough base dice to remove in: ${D.JSL(rollResults.diceVals)}`, "ROLLER: changeRoll()")
					rollResults.diceVals.splice(cutIndex, 1)
				}
			}
			rollResults = rollDice( {
				type: "trait",
				rerollAmt: parseInt(deltaDice) > 0 ? parseInt(deltaDice) : 0,
				diff: rollData.diff
			}, rollResults.diceVals)
			rollData.dicePool += parseInt(deltaDice)
			rollData.basePool = Math.max(1, rollData.dicePool) - rollData.hungerPool
			replaceRoll(rollData, rollResults)
			displayRoll()
		},
		lockRoller = lockToggle => { isLocked = lockToggle === true },
		loadRoll = (rollIndex) => {
			setCurrentRoll(rollIndex)
			displayRoll(false)
		},
		loadPrevRoll = () => {
			loadRoll(Math.min(state[D.GAMENAME].Roller.rollIndex + 1, Math.max(state[D.GAMENAME].Roller.rollRecord.length - 1, 0)))
		},
		loadNextRoll = () => {			
			loadRoll(Math.max(state[D.GAMENAME].Roller.rollIndex - 1, 0))
		},

		// #endregion

		// #region Secret Rolls
		makeSecretRoll = (chars, params, isSilent, isHidingTraits) => {
			let rollData = buildDicePool(getRollData(chars[0], "secret", params)),
				[traitLine, playerLine] = ["", ""],
				resultLine = null
			const {
					dicePool
				} = rollData,
				blocks = []

			if (isHidingTraits || rollData.traits.length === 0) {
				playerLine = `${CHATSTYLES.space30 + CHATSTYLES.secret.greyS}... rolling </span>${CHATSTYLES.secret.whiteB}${dicePool}</span>${CHATSTYLES.space10}${CHATSTYLES.secret.greyS}${dicePool === 1 ? " die " : " dice "}...</span>${CHATSTYLES.space40}`
			} else {
				playerLine = `${CHATSTYLES.secret.greyS}rolling </span>${CHATSTYLES.secret.white}${_.map(_.keys(rollData.traitData), k => k.toLowerCase()).join(`</span><br>${CHATSTYLES.space30}${CHATSTYLES.secret.greyPlus}${CHATSTYLES.secret.white}`)}</span>`
				if (rollData.mod !== 0)
					playerLine += `${(rollData.mod > 0 ? CHATSTYLES.secret.greyPlus : "") + (rollData.mod < 0 ? CHATSTYLES.secret.greyMinus : "") + CHATSTYLES.secret.white + Math.abs(rollData.mod)}</span>`
			}

			if (rollData.traits.length > 0) {
				traitLine = _.keys(rollData.traitData).join(" + ")
				if (rollData.mod !== 0)
					traitLine += (dicePool > 0 ? " + " : "") + (dicePool < 0 ? " - " : "") + Math.abs(rollData.mod)
			} else {
				traitLine = rollData.mod + (rollData.mod === 1 ? " Die" : " Dice")
			}

			_.each(chars, char => {
				rollData = getRollData(char, "secret", params)
				rollData.isSilent = isSilent || false
				rollData.isHidingTraits = isHidingTraits || false
				rollData = buildDicePool(rollData)
				let outcomeLine = ""
				const rollResults = rollDice(rollData),
					{
						total,
						margin
					} = rollResults
				if ((total === 0 || margin < 0) && rollResults.H.botches > 0)
					outcomeLine = `${CHATSTYLES.outcomeRedSmall}BESTIAL FAIL!`
				else if (margin >= 0 && rollResults.critPairs.hb + rollResults.critPairs.hh > 0)
					outcomeLine = `${CHATSTYLES.outcomeWhiteSmall}MESSY CRIT! (${rollData.diff > 0 ? `+${margin}` : total})`
				else if (total === 0)
					outcomeLine = `${CHATSTYLES.outcomeRedSmall}TOTAL FAILURE!`
				else if (margin < 0)
					outcomeLine = `${CHATSTYLES.outcomeRedSmall}FAILURE${rollData.diff > 0 ? ` (${margin})` : ""}`
				else if (rollResults.critPairs.bb > 0)
					outcomeLine = `${CHATSTYLES.outcomeWhiteSmall}CRITICAL! (${rollData.diff > 0 ? `+${margin}` : total})`
				else
					outcomeLine = `${CHATSTYLES.outcomeWhiteSmall}SUCCESS! (${rollData.diff > 0 ? `+${margin}` : total})`
				blocks.push(`${CHATSTYLES.secret.startBlock + CHATSTYLES.secret.blockNameStart + rollData.charName}</div>${
					CHATSTYLES.secret.diceStart}${formatDiceLine(rollData, rollResults, 9, true).replace(/text-align: center; height: 20px/gu, "text-align: center; height: 20px; line-height: 25px")
					.replace(/margin-bottom: 5px;/gu, "margin-bottom: 0px;")
					.replace(/color: black; height: 24px/gu, "color: black; height: 18px")
					.replace(/height: 24px/gu, "height: 20px")
					.replace(/height: 22px/gu, "height: 18px")}</div>${
					CHATSTYLES.secret.lineStart}${outcomeLine}</div></div></div>`)
				if (!rollData.isSilent)
					sendChat("Storyteller", `/w ${D.GetName(char).split(" ")[0]} ${CHATSTYLES.secret.startPlayerBlock}${CHATSTYLES.secret.playerTopLineStart}you are being tested ...</div>${CHATSTYLES.secret.playerBotLineStart}${playerLine}</div></div>`)
			} )
			resultLine = `${CHATSTYLES.fullBox + CHATSTYLES.secret.topLineStart + (rollData.isSilent ? "Silently Rolling" : "Secretly Rolling") + (rollData.isHidingTraits ? " (Traits Hidden)" : " ...")}</div>${CHATSTYLES.secret.traitLineStart}${traitLine}${rollData.diff > 0 ? ` vs. ${rollData.diff}` : ""}</div>${blocks.join("")}</div></div>`
			sendChat("Storyteller", `/w Storyteller ${resultLine}`)
		},
		// #endregion

		// #region Getting Random Resonance Based On District/Site Parameters
		getResonance = (posRes = "", negRes = "", isDoubleAcute) => {
			let resProbs = [],
				randNum = null,
				resonances = ["Choleric", "Melancholic", "Phlegmatic", "Sanguine"],
				discLines = [
					"the resonant disciplines of Celerity and Potence",
					"the resonant disciplines of Fortitude and Obfuscate",
					"the resonant disciplines of Auspex and Dominate",
					"the resonant disciplines of Blood Sorcery and Presence"
				]
			_.each(resonances, v => {
				if (posRes.includes(v.toLowerCase().charAt(0))) {
					resonances = _.without(resonances, v)
					resonances.unshift(v)
				}
				if (negRes.includes(v.toLowerCase().charAt(0))) {
					resonances = _.without(resonances, v)
					resonances.push(v)
				}
			} )
			switch (posRes.length + negRes.length) {
			case 3:
				if (posRes.length === 2) {
					if (posRes.charAt(0) === posRes.charAt(1))
						resProbs = D.RESONANCEODDS.pos2neg
					else
						resProbs = D.RESONANCEODDS.posposneg
				} else if (negRes.charAt(0) === negRes.charAt(1)) {
					resProbs = D.RESONANCEODDS.neg2pos
				} else {
					resProbs = D.RESONANCEODDS.posnegneg
				}
				break
			case 2:
				if (posRes.length === 2)
					resProbs = D.RESONANCEODDS.pospos
				else if (negRes.length === 2)
					resProbs = D.RESONANCEODDS.negneg
				else
					resProbs = D.RESONANCEODDS.posneg
				break
			case 1:
				resProbs = posRes.length === 1 ? D.RESONANCEODDS.pos : D.RESONANCEODDS.neg
				break
			case 0:
				resProbs = D.RESONANCEODDS.norm
				break
			default:
				return D.ThrowError("Too many variables!")
			}
			resProbs = _.flatten(_.map(resProbs, v => _.values(v)))
			if (isDoubleAcute === "2") {
				for (let i = 0; i < 4; i++) {
					resProbs[i * 4 + 0] = resProbs[i * 4 + 0] - resProbs[i * 4 + 2] / 2 - resProbs[i * 4 + 3] / 2
					resProbs[i * 4 + 1] = resProbs[i * 4 + 1] - resProbs[i * 4 + 2] / 2 - resProbs[i * 4 + 3] / 2
					resProbs[i * 4 + 2] = resProbs[i * 4 + 2] * 2
					resProbs[i * 4 + 3] = resProbs[i * 4 + 3] * 2
				}
			}

			randNum = Math.random()
			do
				randNum -= resProbs.shift()
			while (randNum > 0)

			return [
				["Negligibly", "Fleetingly", "Intensely", "Acutely"][3 - resProbs.length % 4],
				resonances.reverse()[Math.floor(resProbs.length / 4)],
				discLines.reverse()[Math.floor(resProbs.length / 4)]
			]
			// Return ["Acute", "Choleric"];
		},
		// #endregion

		// #region Event Handlers (handleInput)
		handleInput = msg => {
			if (msg.type !== "api")
				return
			let args = msg.content.split(/\s+/u),
				[rollType, groupName, groupNum, charObj, diceNums, resonance, resIntLine] = [null, null, null, null, null, null, null],
				name = "",
				[isSilent, isHidingTraits] = [false, false]
			const rollString = args.shift()
			switch (rollString) { // ! traitroll @{character_name}|Strength,Resolve|3|5|0|ICompulsion:3,IPhysical:2
			case "!gRoll": // ! projectroll @{character_name}|Politics:3,Resources:2|mod|diff;
				args = args.join(" ").split("|")
				rollType = args.shift()
				groupName = args.shift()
				groupNum = args.shift()
				charObj = D.GetChar(groupName)
				makeNewRoll(charObj, rollType, {
					groupNum,
					groupName,
					args
				} )
				break
			case "!frenzyroll":
				rollType = "frenzy"
				lockRoller(false)
				args = `${state[D.GAMENAME].Roller.frenzyRoll} ${args[0]}`.split(" ")
				D.DB(`NEW ARGS: ${D.JSL(args)}`, "!frenzyroll", 2)
				/* falls through */
			case "!frenzyinitroll":
				rollType = rollType || "frenzyInit"
				if (rollType !== "frenzy")
					lockRoller(true)
				/* falls through */
			case "!traitroll":
				rollType = rollType || "trait"
				/* falls through */
			case "!rouseroll":
				rollType = rollType || "rouse"
				/* falls through */
			case "!rouse2roll":
				rollType = rollType || "rouse2"
				/* falls through */
			case "!checkroll":
				rollType = rollType || "check"
				/* falls through */
			case "!willpowerroll":
				rollType = rollType || "willpower"
				/* falls through */
			case "!humanityroll":
				rollType = rollType || "humanity"
				/* falls through */
			case "!remorseroll":
				rollType = rollType || "remorse"
				/* falls through */
			case "!projectroll":
			{
				rollType = rollType || "project"
				D.Log(`Received Roll: ${D.JSL(rollString)} ${args.join(" ")}`)
				const params = args.join(" ").split("|");
				[charObj] = D.GetChars(params[0] )
				name = params.shift()
				if (!charObj) {
					return D.ThrowError(`!${rollType}roll: No character found with name ${D.JS(name)}`)
				} else if (rollType === "frenzyInit") {
					state[D.GAMENAME].Roller.frenzyRoll = `${name}|`
					sendChat("ROLLER", `/w Storyteller <br/><div style='display: block; background: url(https://i.imgur.com/kBl8aTO.jpg); text-align: center; border: 4px crimson outset;'><br/><span style='display: block; font-size: 16px; text-align: center; width: 100%'>[Set Frenzy Diff](!&#13;#Frenzy)</span><span style='display: block; text-align: center; font-size: 12px; font-weight: bolder; color: white; font-variant: small-caps; margin-top: 4px; width: 100%'>~ for ~</span><span style='display: block; font-size: 14px; color: red; text-align: center; font-weight: bolder; font-variant: small-caps; width: 100%'>${name}</span><br/></div>`)
					return
				} else if (isLocked) {
					return
				}
				makeNewRoll(charObj, rollType, params)
				delete state[D.GAMENAME].Roller.frenzyRoll
				break
			}
			case "!buildFrame":
				initFrame()
				break
			case "!makeAllDice":
				diceNums = [parseInt(args.shift() || 25), parseInt(args.shift() || 2)]
				makeAllDice(STATECATS.dice[0], diceNums[0])
				makeAllDice(STATECATS.dice[1], diceNums[1])
				break
			case "!showDice":
				_.each(state[D.GAMENAME].Roller.diceList, (v, dNum) => {
					const thisDie = setDie(dNum, "diceList", "Hs")
					if (_.isObject(thisDie)) {
						thisDie.set("layer", "objects")
						thisDie.set("isdrawing", false)
					}
				} )
				_.each(state[D.GAMENAME].Roller.bigDice, (v, dNum) => {
					const thisDie = setDie(dNum, "bigDice", "Bs")
					if (_.isObject(thisDie)) {
						thisDie.set("layer", "objects")
						thisDie.set("isdrawing", false)
					}
				} )
				break
			case "!reg":
			case "!register":
				if (!msg.selected || !msg.selected[0] ) {
					D.ThrowError("!register die: Select a Graphic!")
				} else {
					switch (args.shift()) {
					case "die":
						registerDie(getObj("graphic", msg.selected[0]._id), args.shift())
						break
					case "text":
						registerText(getObj("text", msg.selected[0]._id), args.shift())
						break
					case "shape":
						name = args.shift()
						registerShape(getObj("path", msg.selected[0]._id), name, args.shift())
						break
					case "image":
					case "img":
						name = args.shift()
						registerImg(getObj("graphic", msg.selected[0]._id), name, args.join(","))
						break
					case "repo":
					case "reposition":
						reposition(msg.selected)
						break
					default:
						D.ThrowError("Bad registration code.")
						break
					}
				}
				break
			case "!changeRoll":
				changeRoll(parseInt(args.shift()))
				break
			case "!prevRoll":
				loadPrevRoll()
				break
			case "!nextRoll":
				loadNextRoll()
				break
			case "!resCheck":
				if (args[0] === "x")
					args[0] = ""
				if (args[1] === "x")
					args[1] = ""
				resonance = getResonance(...args)
				switch(resonance[0].toLowerCase()) {
				case "negligibly":
					resIntLine = `The blood carries only the smallest hint of ${resonance[1].toLowerCase()} resonance.  It is not strong enough to confer any benefits at all.`
					break
				case "fleetingly":
					resIntLine = `The blood's faint ${resonance[1].toLowerCase()} resonance can guide you in developing ${resonance[2]}, but lacks any real power.`
					break
				case "intensely":
					resIntLine = `The blood's strong ${resonance[1].toLowerCase()} resonance spreads through you, infusing your own vitae and enhancing both your control and understanding of ${resonance[2]}.`
					break
				case "acutely":
					resIntLine = `This blood is special.  In addition to enhancing ${resonance[2]}, its ${resonance[1].toLowerCase()} resonance is so powerful that the emotions within have crystallized into a dyscracias.`
					break
				}
				sendChat("", D.JSH(`
					<div style="display: block; margin-left: -10px; height: auto; background: url(https://i.imgur.com/kBl8aTO.jpg);text-align: center;border: 4px crimson outset;">
						<br>
						<span style="display: block; font-weight: bold; color: red; font-size: 16px; text-align: center; width: 100%;">
							${_.map([resonance[0], resonance[1]], v => v.toUpperCase()).join(" ")}<br>
						</span>
						<br>
						<span style="display: block; color: red; font-size: 12px; text-align: center; width: 100%;">
							${resIntLine}
						</span>
						<br>
					</div>`)
				)
				break
			case "!nxsroll":
			case "!xnsroll":
			case "!xsroll":
			case "!sxroll":
			case "!snxroll":
			case "!sxnroll":
			case "!nsroll":
			case "!snroll":
			case "!sroll":
			{
				rollType = "secret"
				const params = args.join(" ").split("|")
				isSilent = rollString.includes("x")
				isHidingTraits = rollString.includes("n")
				let chars = null
				if (!msg.selected || !msg.selected[0] )
					chars = D.GetChars("registered")
				else
					chars = D.GetChars(msg)
				if (params.length < 1 || params.length > 3)
					D.ThrowError(`Syntax Error: ![x][n]sroll: <trait1>[,<trait2>]|[<diff>]|[<mod>] (${D.JSL(params)})`)
				else
					makeSecretRoll(chars, params, isSilent, isHidingTraits)
				break
			}
			default:
				break
			}
		},
		// #endregion

		// #region Public Functions: regHandlers
		regHandlers = () => on("chat:message", handleInput),
		checkInstall = () => {
			state[D.GAMENAME] = state[D.GAMENAME] || {}
			state[D.GAMENAME].Roller = state[D.GAMENAME].Roller || {}
			state[D.GAMENAME].Roller.selected = state[D.GAMENAME].Roller.selected || {}
			_.each(_.uniq(_.flatten(STATECATS.dice)), v => {
				state[D.GAMENAME].Roller.selected[v] = state[D.GAMENAME].Roller.selected[v] || []
				state[D.GAMENAME].Roller[v] = state[D.GAMENAME].Roller[v] || []
			} )
			_.each(_.without(_.uniq(_.flatten(_.values(STATECATS))), ...STATECATS.dice), v => {
				state[D.GAMENAME].Roller[v] = state[D.GAMENAME].Roller[v] || {}
			} )
			state[D.GAMENAME].Roller.rollRecord = state[D.GAMENAME].Roller.rollRecord || []
		}
	// #endregion

	return {
		RegisterEventHandlers: regHandlers,
		CheckInstall: checkInstall,
		Select: selectDie,
		Reroll: wpReroll
	}
} )()

on("ready", () => {
	Roller.RegisterEventHandlers()
	Roller.CheckInstall()
	D.Log("Ready!", "Roller")
} )