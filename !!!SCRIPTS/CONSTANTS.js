void MarkStart("C")
const GAMENAME = "VAMPIRE",
    SCRIPTNAME = "C",
    SCRIPTS = ["C", "D", "Listener", "Fuzzy", "Char", "Media", "Player", "Session", "TimeTracker", "DragPads", "Roller", "Roll20AM", "Complications", "Handouts", "Chat", "Tester", "InitCommands", "GamePrep"]
state = state || {}
state[GAMENAME] = state[GAMENAME] || {}
for (const scriptName of SCRIPTS)
    state[GAMENAME][scriptName] = state[GAMENAME][scriptName] || {}

const C = (() => {
    const RO = {get OT() { return state[GAMENAME] }},
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    // #region COMMON INITIALIZATION
        STATE = {get REF() { return RO.OT[SCRIPTNAME] }},	// eslint-disable-line no-unused-vars
        VAL = (varList, funcName, isArray = false) => D.Validate(varList, funcName, SCRIPTNAME, isArray), // eslint-disable-line no-unused-vars
        DB = (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        LOG = (msg, funcName) => D.Log(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        THROW = (msg, funcName, errObj) => D.ThrowError(msg, funcName, SCRIPTNAME, errObj), // eslint-disable-line no-unused-vars

        checkInstall = () => {
            RO.OT[SCRIPTNAME] = RO.OT[SCRIPTNAME] || {}
        },
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    // #region CORE CONFIGURATION & BASIC REFERENCES
        TEXTCHARS = "0123456789LMNQSOPRUWXTVZY-=●(+ABCFHDEGJIKalmnqsopruwxtvzyfhdegjikbc )?![]:;,.○~♠◌‡⅓°♦\"'", // eslint-disable-line quotes
        TEXTPAGEID = "-LtEZInDvTCwXXSROD49",
        NUMBERWORDS = {
            low: ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty"],
            tens: ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"],
            tiers: ["", "Thousand", "Million", "Billion", "Trillion", "Quadrillion", "Quintillion", "Sextillion", "Septillion", "Octillion", "Nonillion", "Decillion", "Undecillion", "Duodecillion", "Tredecillion", "Quattuordecillion", "Quindecillion", "Sexdecillion", "Septendecillion", "Octodecillion", "Novemdecillion", "Vigintillion", "Unvigintillion", "Duovigintillion", "Trevigintillion", "Quattuorvigintillion", "Quinvigintillion", "Sexvigintillion", "Septenvigintillion", "Octovigintillion", "Novemvigintillion", "Trigintillion", "Untrigintillion", "Duotrigintillion", "Tretrigintillion", "Quattuortrigintillion"]
        },
        ORDINALSUFFIX = {
            zero: "zeroeth",
            one: "first",
            two: "second",
            three: "third",
            four: "fourth",
            five: "fifth",
            eight: "eighth",
            nine: "ninth",
            twelve: "twelfth",
            twenty: "twentieth",
            thirty: "thirtieth",
            forty: "fortieth",
            fifty: "fiftieth",
            sixty: "sixtieth",
            seventy: "seventieth",
            eighty: "eightieth",
            ninety: "ninetieth"
        },
        COLORS = {
            white: "rgb(255, 255, 255)",
            black: "rgb(0, 0, 0)",
            brightgrey: "rgb(175, 175, 175)",
            grey: "rgb(130, 130, 130)",
            darkgrey: "rgb(80, 80, 80)",
            brightred: "rgb(255, 0, 0)",
            brightredmid: "rgb(225, 0, 0)",
            red: "rgb(200, 0, 0)",
            darkredmid: "rgb(175, 0, 0)",
            darkred: "rgb(150, 0, 0)",
            green: "rgb(0, 200, 0)",
            yellow: "rgb(200, 200, 0)",
            orange: "rgb(200, 100, 0)",
            brightpurple: "rgb(200, 100, 200)",
            purple: "rgb(150, 0, 150)",
            darkpurple: "rgb(100, 0, 100)",
            brightblue: "rgb(150, 150, 255)",
            blue: "rgb(100, 100, 255)",
            darkblue: "rgb(50, 50, 150)",
            cyan: "rgb(0, 255, 255)",
            gold: "#ffd700",
            fadedblack: "rgba(0, 0, 0, 0.2)",
            fadedgrey: "rgba(0, 0, 0, 0.1)",
            crimson: "rgb(220, 20, 60)",
            transparent: "rgba(0,0,0,0)",
            halfwhite: "rgba(255,255,255,0.5)",
            palegreen: "rgb(175, 255, 175)",
            paleblue: "rgb(175, 175, 255)",
            palered: "rgb(255, 175, 175)",
            palepurple: "rgb(255, 175, 255)",
            brightbrightgrey: "rgb(200, 200, 200)",
            darkgreen: "rgb(0, 125, 0)"
        },
    // #endregion

    // #region IMAGE DEFAULTS BACKGROUND IMAGES    
        IMAGES = {
            blank: "https://s3.amazonaws.com/files.d20.io/images/96594791/NKN-0QyHbcOXS2_o5X6Y2A/thumb.png?1573368252"
        },
        BGIMAGES = {
            whiteMarble: "https://i.imgur.com/heiyoaB.jpg",
            blackMarble: "https://i.imgur.com/kBl8aTO.jpg"
        },
    // #endregion

    // #region HTML & CHAT STYLES
        HTML = {
            COMP: {
                promptFullBox: content => { return `<div style='
                    display: block;
                    background: url(https://i.imgur.com/kBl8aTO.jpg);
                    text-align: center;
                    border: 4px ${C.COLORS.crimson} outset;
                    box-sizing: border-box;
                    margin-left: -42px;
                    width: 275px;
                '>${content}</div>` },
                header: content => { return `<span style='
                    display: block;
                    font-size: 16px;
                    text-align: center;
                    width: 100%;
                    font-family: Voltaire;
                    color: ${C.COLORS.brightred};
                    font-weight: bold;
                '>${content}</span>` },
                column: content => { return `<div style="
                    display: inline-block;
                    width: 49%;
                    font-size: 0px;
                ">${content}</div>`},
                commandLine: (commands) => { return `<span style='
                    display: block;
                    font-size: 10px;
                    text-align: center;
                    width: 100%
                '>${_.values(D.KeyMapObj(commands, null, (v, k) => `[${k}](${v})`)).join(" ")}</span>` }
            },
            MVC: {
                fullBox: content => { return `<div style="
                    display: block;
                    width: 100%;
                    padding: 5px 5px;
                    margin-left: -10px;
                    margin-top: -20px;
                    margin-bottom: -5px;
                    color: ${COLORS.white};
                    font-variant: small-caps;
                    font-family: 'Bodoni SvtyTwo ITC TT';
                    text-align: left; font-size: 16px;
                    border: 3px outset ${COLORS.darkred};
                    background: url('https://imgur.com/kBl8aTO.jpg') top;
                    bg-color: ${COLORS.black};
                    z-index: 100;
                    position: relative;
                    ">${content}</div>` },
                title: content => { return `<div style="
                    display:block;
                    width: 120%;
                    margin: 10px -10%;
                    color: ${COLORS.white};
                    text-align: center;
                    font: normal normal 22px/22px Effloresce;
                    border-bottom: 1px ${COLORS.white} solid;
                    ">${content}</div>` },
                header: content => { return `<div style="
                    display:block; 
                    width: 120%; 
                    margin: 0px -10% 0px -10%;
                    color: ${COLORS.white}; 
                    text-align: center; 
                    font: normal normal 16px / 20px 'Bodoni SvtyTwo ITC TT'; 
                    ">${content}</div>` },
                headerL: content => { return `<div style="
                    display:inline-block; 
                    width: 120%; 
                    margin: 5% -10% 0px -10%;
                    color: ${COLORS.white}; 
                    text-align: center; 
                    font: normal normal 16px / 20px 'Bodoni SvtyTwo ITC TT';
                    ">${content}` },
                headerR: content => { return ` ${content}</div>` },
                para: content => { return `<div style="
                    display:block; 
                    width: 103%; 
                    margin: 5px 0px;
                    color: ${COLORS.white}; 
                    text-align: left; 
                    font: normal normal 12px/14px Rockwell; 
                    ">${content}</div>` },
                paraStart: content => { return `<div style="
                    display:block; 
                    width: 100%; 
                    margin: 5px 0px;
                    color: ${COLORS.white}; 
                    text-align: left; 
                    font: normal normal 12px/14px Rockwell; 
                    ">${content}` },
                paraMid: content => { return ` ${content} `},
                paraEnd: content => { return `${content}</div>`}
            }
        },
        CHATHTML = {
            MAINBLOCK: content => { return `<div style="
                display: block;
                height: auto;
                width: auto;
                padding: 0px;
                margin: -25px 0px 0px -42px;
                position: relative;
            ">${content}</div>` },
            alertHeader: content => { return `<div style="
                display: block;
                height: auto;
                width: auto;
                line-height: 23px;
                padding: 0px 5px;
                margin: 0px;
                font-family: 'copperplate gothic';
                font-variant: small-caps;
                font-size: 16px;
                background-color: ${COLORS.darkgrey};
                color: ${COLORS.white};
                border: 2px solid ${COLORS.black};
            ">${content}</div>` },
            alertBody: content => { return `<div style="
                display: block;
                width: auto;
                padding: 5px 5px;
                font-family: input, verdana, sans-serif;
                font-size: 10px;
                background-color: ${COLORS.white};
                border: 2px solid ${COLORS.black};
                line-height: 14px;
                position: relative;
            ">${content}</div>` },
            Block: (content, options = {}) => {
                const params = {
                    color: options.color || COLORS.crimson,
                    bgImage: options.bgImage || BGIMAGES.blackMarble,
                    borderColor: options.borderColor || options.color || COLORS.crimson,
                    borderStyle: options.borderStyle || "outset",
                    margin: options.margin || "-25px 0px 0px -42px",
                    width: options.width || "267px"
                }
                return D.JSH(`<div style="
                    display: block;
                    margin: ${params.margin};
                    height: auto;
                    background: url('${params.bgImage}');
                    text-align: center;
                    border: 4px ${params.borderColor} ${params.borderStyle};
                    padding: 5px;
                    width: ${params.width};
                    position: relative;
                ">${_.flatten([content]).join("")}</div>`)
            },
            Title: (content, options = {}) => {
                const params = {
                    fontSize: options.fontSize || "32px",
                    color: options.color || COLORS.brightred,
                    margin: options.margin || "0px"
                }
                return `<span style="
                    display: block;
                    font-weight: bold;
                    margin: ${params.margin};
                    color: ${params.color};
                    text-align: center;
                    width: 100%;
                    font-family: sexsmith;
                    font-size: ${params.fontSize};
                    height: 45px;
                    line-height: 45px;">${content}</span>`
            },
            Header: (content, options = {}) => {
                const params = {
                    height: options.height || "20px",
                    color: options.color || COLORS.black,
                    bgColor: options.bgColor || COLORS.brightred,
                    fontFamily: options.fontFamily || "Voltaire",
                    margin: options.margin || "0px",
                    fontSize: options.fontSize || "16px",
                    borderWidth: options.borderWidth || "1px 0px 1px 0px",
                    borderStyle: options.borderStyle || "solid none solid none",
                    borderColor: options.borderColor || options.color || COLORS.brightred,
                    textShadow: options.textShadow || "none",
                    boxShadow: options.boxShadow || "none"
                }
                return D.JSH(`<span style="
                    display: block;
                    height: ${params.height};
                    line-height: 20px; 
                    width: 100%;
                    margin: ${params.margin};
                    box-sizing: border-box;
                    text-align: center;
                    color: ${params.color};
                    font-family: '${params.fontFamily}';
                    font-weight: bold;
                    font-size: ${params.fontSize};
                    background-color: ${params.bgColor};
                    border-width: ${params.borderWidth};
                    border-style: ${params.borderStyle};
                    border-color: ${params.borderColor};
                    text-shadow: ${params.textShadow};
                    box-shadow: ${params.boxShadow};
                ">${content}</span>`)
            },
            Body: (content, options = {}) => {
                const params = {
                    color: options.color || COLORS.brightred,
                    width: options.width || "100%",
                    bgColor: options.bgColor || "none",
                    margin: options.margin || "7px 0px 0px 0px",
                    fontFamily: options.fontFamily || "sexsmith",
                    fontSize: options.fontSize || "18px",
                    fontWeight: options.fontWeight || "bold",
                    textAlign: options.textAlign || "center",
                    textShadow: options.textShadow || `0px 0px 1px ${COLORS.black}, 0px 0px 1px ${COLORS.black}, 0px 0px 1px ${COLORS.black}, 0px 0px 1px ${COLORS.black}, 0px 0px 1px ${COLORS.black}`,
                    borderWidth: options.borderWidth || "0px",
                    borderStyle: options.borderStyle || "none",
                    borderColor: options.borderColor || options.color || "black",
                    boxShadow: options.boxShadow || "none",
                    lineHeight: options.lineHeight || "22px"
                }
                return D.JSH(`<span style="
                    display: block; 
                    width: ${params.width}; 
                    line-height: ${params.lineHeight};
                    margin: ${params.margin};
                    color: ${params.color};
                    font-size: ${params.fontSize};
                    text-align: ${params.textAlign};
                    font-family: '${params.fontFamily}';
                    font-weight: ${params.fontWeight};
                    text-shadow: ${params.textShadow};
                    box-shadow: ${params.boxShadow};
                ">${content}</span>`)
            },
            TrackerLine: (numClear, numSuper, numAgg, options = {}) => {
                const params = {
                        height: options.height || "32px",
                        lineHeight: options.lineHeight || options.height || "32px",
                        margin: options.margin || "-8px 0px 7px 0px"
                    },
                    boxes = {
                        clear: `<span style="
                            margin-right: 2px;
                            width: 18px;
                            text-align: center;
                            height: 24px;
                            vertical-align: middle;
                            color: ${C.COLORS.white};
                            display: inline-block;
                            font-size: 32px;
                            font-family: 'Arial';
                            text-shadow: none;
                        ">■</span>`,
                        superficial: `<span style="
                            margin-right: 2px;
                            width: 18px;
                            text-align: center;
                            height: 24px;
                            vertical-align: middle;
                            color: ${C.COLORS.brightgrey};
                            display: inline-block;
                            font-size: 32px;
                            font-family: 'Arial';
                            text-shadow: none;
                        ">■</span><span style="
                            margin-right: 4px;
                            width: 18px;
                            text-align: center;
                            height: 24px;
                            vertical-align: middle;
                            color: ${C.COLORS.darkgrey};
                            display: inline-block;
                            margin-left: -22px;
                            font-size: 60px;
                            font-family: 'Arial';
                            text-shadow: none;
                            margin-top: -14px;
                        "><span style="
                            display: inline-block;
                            overflow: hidden;
                            height: 18px;
                            padding-bottom: 5px;
                            width: 23px;
                            font-size: 44px;
                            line-height: 10px;    
                        ">⸝</span></span>`,
                        aggravated: `<span style="
                            margin-right: 2px;
                            width: 18px;
                            text-align: center;
                            height: 24px;
                            vertical-align: middle;
                            color: ${C.COLORS.darkred};
                            display: inline-block;
                            font-size: 32px;
                            font-family: 'Arial';
                            text-shadow: 0px 0px 3px black, 0px 0px 3px black, 0px 0px 3px black, 0px 0px 3px black, 0px 0px 3px black, 0px 0px 3px black, 0px 0px 3px black;
                        ">■</span><span style="
                            margin-right: 2px;
                            width: 18px;
                            text-align: center;
                            height: 24px;
                            vertical-align: middle;
                            color: ${C.COLORS.brightred};
                            display: inline-block;
                            margin-left: -20px;
                            font-size: 34px;
                            font-family: 'Arial';
                            margin-bottom: -8px;
                            text-shadow: 0px 0px 1px black, 0px 0px 1px black, 0px 0px 1px black, 0px 0px 1px black, 0px 0px 1px black, 0px 0px 1px black, 0px 0px 1px black, 0px 0px 1px black, 0px 0px 1px black, 0px 0px 1px black, 0px 0px 1px black, 0px 0px 1px black, 0px 0px 1px black, 0px 0px 1px black;
                        ">×</span>`
                    }
                return D.JSH(`<div style="
                    display: block;
                    width: 100%;
                    height: ${params.height};
                    line-height: ${params.lineHeight || params.height};
                    text-align: center;
                    text-align-last: center;
                    font-weight: bold;
                    margin: ${params.margin};"> ${boxes.aggravated.repeat(numAgg) + boxes.superficial.repeat(numSuper) + boxes.clear.repeat(numClear)}</div>`)                
            }
        },       
        MENUHTML = { // Block ==> Title, Header, ButtonLine ==> ButtonHeader, Button(label, API command, options = {})
            Block: (content, options = {}) => {
                const params = {
                    color: options.color || COLORS.crimson,
                    bgImage: options.bgImage || BGIMAGES.blackMarble,
                    borderColor: options.borderColor || options.color || COLORS.crimson,
                    borderStyle: options.borderStyle || "outset",
                    margin: options.margin || "-25px 0px 0px -42px",
                    width: options.width || "267px"
                }
                return D.JSH(`<div style="
                    display: block;
                    margin: ${params.margin};
                    height: auto;
                    width: ${params.width};
                    background: url('${params.bgImage}');
                    text-align: center;
                    border: 4px ${params.borderColor} ${params.borderStyle};
                    box-sizing: border-box;
                    padding: 0px;
                    position: relative;
            ">${_.flatten([content]).join("")}</div>`)
            },
            Title: (content, options = {}) => {
                const params = {
                    fontSize: options.fontSize || "32px",
                    color: options.color || COLORS.brightred
                }
                return D.JSH(`<span style="
                    display: block;
                    font-weight: bold;
                    color: ${params.color};
                    text-align: center;
                    width: 100%;
                    font-family: sexsmith;
                    font-size: ${params.fontSize};
                    height: 45px;
                    line-height: 45px;
                ">${_.flatten([content]).join("")}</span>`)
            },
            Header: (content, options = {}) => {
                const params = {
                    height: options.height || "20px",
                    color: options.color || COLORS.black,
                    bgColor: options.bgColor || COLORS.brightred,
                    fontFamily: options.fontFamily || "Voltaire",
                    margin: options.margin || "0px 0px 5px 0px",
                    fontSize: options.fontSize || "16px",
                    borderWidth: options.borderWidth || "1px 0px 1px 0px",
                    borderStyle: options.borderStyle || "solid none solid none",
                    borderColor: options.borderColor || options.color || COLORS.brightred,
                    textShadow: options.textShadow || "none",
                    boxShadow: options.boxShadow || "none",
                    textAlign: options.textAlign || "center"
                }
                return D.JSH(`<span style="
                    display: block;
                    height: ${params.height};
                    line-height: ${params.height}; 
                    width: 100%;
                    margin: ${params.margin};
                    box-sizing: border-box;
                    text-align: ${params.textAlign};
                    text-align-last: ${params.textAlign};
                    color: ${params.color};
                    font-family: '${params.fontFamily}';
                    font-weight: bold;
                    font-size: ${params.fontSize};
                    background-color: ${params.bgColor};
                    border-width: ${params.borderWidth};
                    border-style: ${params.borderStyle};
                    border-color: ${params.borderColor};
                    text-shadow: ${params.textShadow};
                    box-shadow: ${params.boxShadow};
            ">${_.flatten([content]).join("")}</span>`)
            },
            Body: (content, options = {}) => {
                const params = {
                    color: options.color || COLORS.brightred,
                    width: options.width || "100%",
                    bgColor: options.bgColor || "none",
                    margin: options.margin || "7px 0px 0px 0px",
                    fontFamily: options.fontFamily || "sexsmith",
                    fontSize: options.fontSize || "18px",
                    fontWeight: options.fontWeight || "bold",
                    textAlign: options.textAlign || "center",
                    textShadow: options.textShadow || `0px 0px 1px ${COLORS.black}, 0px 0px 1px ${COLORS.black}, 0px 0px 1px ${COLORS.black}, 0px 0px 1px ${COLORS.black}, 0px 0px 1px ${COLORS.black}`,
                    borderWidth: options.borderWidth || "0px",
                    borderStyle: options.borderStyle || "none",
                    borderColor: options.borderColor || options.color || "black",
                    boxShadow: options.boxShadow || "none",
                    lineHeight: options.lineHeight || options.fontSize || "18px"
                }
                return D.JSH(`<span style="
                    display: block; 
                    width: ${params.width}; 
                    line-height: ${params.lineHeight};
                    margin: ${params.margin};
                    color: ${params.color};
                    background-color: ${params.bgColor};
                    font-size: ${params.fontSize};
                    text-align: ${params.textAlign};
                    font-family: '${params.fontFamily}';
                    font-weight: ${params.fontWeight};
                    text-shadow: ${params.textShadow};
                    box-shadow: ${params.boxShadow};
                    border: ${params.borderStyle} ${params.borderWidth} ${params.borderColor};
                ">${content}</span>`)
            },
            ButtonLine: (content, options = {}) => {
                const params = Object.assign({height: "18px",
                                              width: "100%",
                                              margin: "0px 0px 2px 0px",
                                              textAlign: "center"}, options)
                return D.JSH(`<span style="  
                    height: ${params.height};
                    width: ${params.width};             
                    display: block;
                    text-align: ${params.textAlign};
                    margin: ${params.margin};
                ">${_.flatten([content]).join("")}</span>`)
            },
            ButtonSubheader: (content, options = {}) => {
                const params = Object.assign({height: "18px",
                                              width: "15%",
                                              fontFamily: "Voltaire",
                                              fontSize: "10px",
                                              bgColor: "transparent",
                                              color: COLORS.white,
                                              margin: "0px 3% 0px 0px",
                                              textAlign: "left",
                                              textIndent: "3px",
                                              padding: "0px 0px 0px 0px",
                                              lineHeight: "16px"}, options)
                return D.JSH(`<span style="
                    height: ${params.height};
                    width: ${params.width};                 
                    display: inline-block;
                    margin: ${params.margin};
                    font-size: ${params.fontSize};
                    font-family: ${params.fontFamily};
                    line-height: ${params.lineHeight};
                    color: ${params.color};
                    overflow: hidden;
                    background-color: ${params.bgColor};
                    text-indent: ${params.textIndent};
                    text-align: ${params.textAlign};
                    text-align-last: ${params.textAlign};
                    padding: ${params.padding};
                ">${_.flatten([content]).join("")}</span>`)
            },
            Button: (name, command, options = {}) => {
                const params = Object.assign({
                    height: "100%",
                    lineHeight: "10px",
                    width: "22%",
                    fontFamily: "Voltaire",
                    margin: "0px 3% 0px 0px",
                    padding: "0px 0px 0px 0px",
                    fontSize: "10px",
                    bgColor: COLORS.brightred,
                    color: COLORS.white,
                    border: "1px solid white",
                    fontWeight: "normal",
                    textShadow: "none",
                    buttonHeight: "8px",
                    buttonWidth: "83%",
                    buttonPadding: "3px",
                    buttonTransform: "uppercase"
                }, options)
                return D.JSH(`<span style="   
                    height: ${params.height};
                    width: ${params.width};                 
                    display: inline-block;
                    margin: ${params.margin};
                    padding: ${params.padding};
                    font-size: 0px;
                    overflow: hidden;
                "><a style="
                    height: ${params.buttonHeight};
                    width: ${params.buttonWidth};
                    display: inline-block;
                    box-sizing: 'border-box';
                    border: ${params.border};
                    color: ${params.color};
                    background-color: ${params.bgColor};
                    font-size: ${params.fontSize};
                    line-height: ${params.lineHeight};
                    font-family: ${params.fontFamily};
                    text-transform: ${params.buttonTransform};
                    text-align: center;
                    padding: ${params.buttonPadding};
                    font-weight: ${params.fontWeight};
                    text-shadow: ${params.textShadow};
                    box-sizing: border-box;
                " href="${command}">${name}</a></span>`)
            },            
            ButtonSpacer: (width) => {
                return D.JSH(`<span style="   
                    height: 100%;
                    width: ${width || "5%"};                 
                    display: inline-block;
                    margin: 0px;
                    padding: 0px;
                    font-size: 0px;
                "></span>`)
            }
        },
        HANDOUTHTML = {
            main: content => { return `<div style="
                display: block;
                width: 600px;
            ">${content}</div>` },
            title: content => { return `<span style="
                display: block;
                width: 602px;
                height: 16px;
                line-height: 16px;
                background-color: ${COLORS.grey};
                font-family: 'Century Gothic';
                font-size: 14px;
                font-weight: bold;
                padding: 3px 3px;
                box-sizing: border-box;
                margin-top: 10px;
            ">${content}</span>` },
            subTitle: content => { return `<span style="
                display: block;
                width: 600px;
                height: 12px;
                line-height: 12px;
                margin: 5px 0px 5px -6px;
                font-weight: bold;
                border-bottom: 1px solid ${COLORS.black};
                font-family: 'Century Gothic';
                font-size: 12px;
                padding-bottom: 3px;
            ">${content}</span>` },
            bodyParagraph: (content, params = {}) => { return `<span style="
                display: block;
                width: 586px;
                font-family: 'Trebuchet MS';
                font-size: 12px;
                background-color: ${COLORS.brightgrey};
                ${params["border-top"] ? `border-top: ${params["border-top"]};` : ""}
                ${params["border-bottom"] ? `border-top: ${params["border-bottom"]};` : ""}
                border-left: 1px solid ${COLORS.grey};
                border-right: 1px solid ${COLORS.grey};
                padding: 3px 10px;
            ">${content}</span>` },
            smallNote: (content, color = COLORS.black) => { return `<span style="
                display:block; 
                width: 560px; 
                font-size: 10px;
                color: ${color};
                font-family: Goudy; 
                margin: 0px 20px;
                padding: 0px 3px;
                background-color: ${COLORS.fadedblack};
            ">${content}</span>` },
            projects: {
                charName: content => { return `<span style="
                    display: block; 
                    width: 600px;
                    font-size: 32px; 
                    color: ${COLORS.darkred}; 
                    font-family: Voltaire; 
                    font-variant: small-caps;
                ">${content}</span>` },
                goal: content => { return `<span style="
                    display: block; 
                    width: 600px; 
                    height: 24px; 
                    background-color: ${COLORS.brightgrey}; 
                    font-size: 16px; 
                    color: ${COLORS.black}; 
                    font-family: 'Alice Regular'; 
                    font-weight: bold; 
                    font-variant: small-caps; 
                    border-bottom: 1px solid ${COLORS.black}; 
                    border-top: 1px solid ${COLORS.black};
                    overflow: hidden;
                ">${content}</span>` },
                tag: (content, color = COLORS.black) => { return `<span style="
                    display:inline-block; 
                    width: 60px; 
                    font-size: 14px; 
                    color: ${color}; 
                    font-family: Voltaire; 
                    font-variant: small-caps; 
                    font-weight: bold; 
                    text-align: right; 
                    margin-right: 10px;
                    height: 20px;
                    line-height: 20px;
                ">${content}</span>` },
                hook: content => { return `<span style="
                    display:inline-block; 
                    width: 530px; 
                    font-size: 12px; 
                    color: ${COLORS.black}; 
                    font-family: 'Alice Regular'; 
                    vertical-align: top; 
                    padding-top: 2px;
                    overflow: hidden;
                ">${content}</span>` },
                critSucc: content => { return `<span style="
                    display: inline-block; 
                    width: 300px; 
                    font-size: 20px; 
                    color: ${COLORS.purple}; 
                    font-family: Voltaire; 
                    font-weight: bold;
                ">${content}</span>` },
                succ: content => { return `<span style="
                    display: inline-block; 
                    width: 300px; 
                    font-size: 20px; 
                    color: ${COLORS.black}; 
                    font-family: goodfish; 
                    font-weight: bold;
                ">${content}</span>` },
                endDate: content => { return `<span style="
                    display: inline-block; 
                    width: 300px; 
                    font-size: 20px; 
                    color: ${COLORS.black}; 
                    font-family: Voltaire; 
                    font-weight: bold; 
                    text-align: right;
                ">${content}</span>` },
                daysLeft: content => { return `<span style="
                    display: inline-block; 
                    width: 600px; 
                    font-size: 14px; 
                    color: ${COLORS.black}; 
                    font-family: 'Alice Regular'; 
                    font-style: italic; 
                    text-align: right;
                ">${content}</span>` },
                stake: content => { return `<span style="
                    display: inline-block; 
                    width: 410px; 
                    font-family: 'Alice Regular';
                    height: 20px;
                    line-height: 20px;
                ">${content}</span>` },
                teamwork: content => { return `<span style="
                    display: inline-block; 
                    width: 50px; 
                    font-family: 'Alice Regular'; 
                    color: ${COLORS.blue}; 
                    font-weight: bold;
                    height: 20px;
                    line-height: 20px;
                    font-size: 16px;
                ">${content}</span>` }
            },
        },
        ROLLERHTML = {
            fullBox: content => `<div style="display: block;width: 259px;padding: 5px 5px;margin-left: -42px;color: ${COLORS.white};font-family: 'Bodoni SvtyTwo ITC TT';font-size: 16px;border: 3px outset ${COLORS.darkred};background: url('http://imgsrv.roll20.net/?src=imgur.com/kBl8aTO.jpg') center no-repeat;position: relative;">${content}</div>`,
            spacer: width => `<span style="display: inline-block; width: ${width}px;"></span>`,
            rollerName: content => `<div style="display: block; width: 100%; font-variant: small-caps; font-size: 16px; height: 15px; padding-bottom: 5px; border-bottom: 1px solid ${COLORS.white}; overflow: hidden;">${content}</div>`,
            mainRoll: (content, subcontent) => `<div style="display: block; width: 100%; height: auto; padding: 3px 0px; border-bottom: 1px solid ${COLORS.white};"><span style="display: block; height: 16px; line-height: 16px; width: 100%; font-size: 14px; ">${content}</span><span style="display: block; height: 12px; line-height: 12px; width: 100%; margin-left: 24px; font-size: 10px; font-variant: italic;">${subcontent}</span></div>`,
            check: content => `<div style="display: block; width: 100%; height: auto; padding: 3px 0px; border-bottom: 1px solid ${COLORS.white};"><span style="display: block; height: 20px;  line-height: 20px; width: 100%; margin-left: 10%;">${content}</span></div>`,
            dicePool: content => `<div style="display: block; width: 100%; padding: 3px 0px; height: auto; "><span style="display: block; height: 16px; width: 100%; margin-left: 5%; line-height: 16px; font-size: 14px;">${content}</span></div>`,
            result: (content, subcontent, width, topMargin, subWidth) => `<div style="display: block; width: 100%; height: auto; "><div style="display: inline-block; width: ${width}px; margin-top:${topMargin}px; vertical-align: top; text-align: right; height: 100%; "><span style="display: inline-block; font-weight: normal; font-family: Verdana; text-shadow: none; height: 24px; line-height: 24px; vertical-align: middle; width: 40px; text-align: right; margin-right: 10px; font-size: 12px;">${content}</span></div><div style="display: inline-block ; width: ${subWidth}px ; height: auto; margin-bottom: 5px">${subcontent}</div></div>`,
            diceLine: (content) => `<div style="display: block ; width: 100% ; height: 24px ; line-height: 20px ; text-align: center ; font-weight: bold ; text-shadow: 0px 0px 2px ${COLORS.white} , 0px 0px 2px ${COLORS.white} , 0px 0px 2px ${COLORS.white} , 0px 0px 2px ${COLORS.white} ; ">${content}</div>`,
            smallResult: content => `<div style="display: block ; width: 100% ; height: 24px ; line-height: 20px ; text-align: center ; font-weight: bold ; text-shadow: 0px 0px 2px ${COLORS.white} , 0px 0px 2px ${COLORS.white} , 0px 0px 2px ${COLORS.white} , 0px 0px 2px ${COLORS.white} ; ">${content}</div>`,
            die: (dieVal) => { switch (dieVal) {
                case "BcL":
                    return `<span style="margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: ${COLORS.white}; display: inline-block; font-size: 18px; font-family: 'Arial';">♦</span><span style="width: 10px; text-align: center; height: 20px; vertical-align: middle; color: ${COLORS.white}; display: inline-block; font-size: 16px; font-family: 'Arial'; margin-left: -5px; text-shadow: none; ">+</span>`
                case "BcR":
                    return `<span style="width: 10px; text-align: center; height: 20px; vertical-align: middle; color: ${COLORS.white}; display: inline-block; font-size: 16px; font-family: 'Arial'; margin-left: -5px; margin-right: -3px; text-shadow: none; ">+</span><span style="margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: ${COLORS.white}; display: inline-block; font-size: 18px; font-family: 'Arial';">♦</span>`
                case "HcL":
                    return `<span style="margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: ${COLORS.brightred}; display: inline-block; font-size: 18px; font-family: 'Arial';">♦</span><span style="width: 10px; text-align: center; height: 20px; vertical-align: middle; color: ${COLORS.brightred}; display: inline-block; font-size: 16px; font-family: 'Arial'; margin-left: -5px; text-shadow: none; ">+</span>`
                case "HcR":
                    return `<span style="width: 10px; text-align: center; height: 20px; vertical-align: middle; color: ${COLORS.brightred}; display: inline-block; font-size: 16px; font-family: 'Arial'; margin-left: -5px; margin-right: -3px; text-shadow: none; ">+</span><span style="margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: ${COLORS.brightred}; display: inline-block; font-size: 18px; font-family: 'Arial';">♦</span>`
                case "Bc":
                    return `<span style="margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: ${COLORS.white}; display: inline-block; font-size: 18px; font-family: 'Arial';">♦</span>`
                case "Hc":
                    return `<span style="margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: ${COLORS.brightred}; display: inline-block; font-size: 18px; font-family: 'Arial';">♦</span>`
                case "Bs":
                    return `<span style="margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle; color: ${COLORS.white}; display: inline-block; font-size: 18px; font-family: 'Arial';">■</span>`
                case "Hs":
                    return `<span style="margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle;color: ${COLORS.brightred}; display: inline-block; font-size: 18px; font-family: 'Arial';">■</span>`
                case "Bf":
                    return `<span style="margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle;color: ${COLORS.white}; display: inline-block; font-size: 18px; font-family: 'Arial'; text-shadow: none;">■</span><span style="margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle;color: ${COLORS.black}; display: inline-block; margin-left: -12px; font-size: 18px; font-family: 'Arial'; margin-bottom: -4px; text-shadow: none;">×</span>`
                case "Hf": 
                    return `<span style="margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle;color: ${COLORS.brightred}; display: inline-block; font-size: 18px; font-family: 'Arial'; text-shadow: none;">■</span><span style="margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle;color: ${COLORS.black}; display: inline-block; margin-left: -12px; font-size: 18px; font-family: 'Arial'; margin-bottom: -4px; text-shadow: none;">×</span>`
                case "Hb":
                    return `<span style="margin-right: 2px; width: 10px; text-align: center; color: ${COLORS.black}; height: 24px; vertical-align: middle; display: inline-block; font-size: 18px; font-family: 'Arial'; text-shadow: 0px 0px 2px ${COLORS.brightred}, 0px 0px 2px ${COLORS.brightred}, 0px 0px 2px ${COLORS.brightred}, 0px 0px 2px ${COLORS.brightred}, 0px 0px 2px ${COLORS.brightred}, 0px 0px 2px ${COLORS.brightred}, 0px 0px 2px ${COLORS.brightred}, 0px 0px 2px ${COLORS.brightred}, 0px 0px 2px ${COLORS.brightred}, 0px 0px 2px ${COLORS.brightred}, 0px 0px 2px ${COLORS.brightred}, 0px 0px 2px ${COLORS.brightred}; line-height: 22px;">♠</span>`
                default:
                    return `<span style="margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle;color: ${COLORS.white}; display: inline-block; font-size: 18px; font-family: 'Arial'; text-shadow: none;">■</span><span style="margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle;color: ${COLORS.black}; display: inline-block; margin-left: -12px; font-size: 18px; font-family: 'Arial'; margin-bottom: -4px; text-shadow: none;">×</span>`
            } },
            margin: (content, width, topMargin) => `<div style="display: inline-block; width: ${width}px; vertical-align: top; margin-top:${topMargin}px; text-align: left; height: 100%; "><span style="display: inline-block; font-weight: normal; font-family: Verdana; text-shadow: none; height: 24px; line-height: 24px; vertical-align: middle; width: 40px; text-align: left; margin-left: 10px; font-size: 12px;">${content}</span></div>`,
            outcome: (content, color) => `<div style="display: block; width: 100%; height: 20px; line-height: 20px; text-align: center; font-weight: bold;"><span style="color: ${COLORS[color] || COLORS.white}; display: block; width: 100%;  font-size: 22px; font-family: 'Bodoni SvtyTwo ITC TT';">${content}</span></div>`,
            smallOutcome: (content, color) => `<div style="display: block; width: 100%; margin-top: 5px; height: 14px; line-height: 14px; text-align: center; font-weight: bold;"><span style="color: ${COLORS[color] || COLORS.white}; display: block; width: 100%;  font-size: 14px; font-family: 'Bodoni SvtyTwo ITC TT';">${content}</span></div>`,
            subOutcome: (content, color) => `<div style="display: block; width: 100%; height: 10px; line-height: 10px; text-align: center; font-weight: bold;"><span style="color: ${COLORS[color] || COLORS.white}; display: block; width: 100%;  font-size: 12px; font-family: 'Bodoni SvtyTwo ITC TT';">${content}</span></div>`
        },
        STYLES = {
            whiteMarble: {
                block: {
                    bgImage: BGIMAGES.whiteMarble,
                    borderColor: COLORS.halfwhite
                },
                header: {
                    color: COLORS.halfwhite,
                    bgColor: COLORS.transparent,
                    textShadow: "-1px -1px 0px #000, -1px -1px 0px #333, -1px -1px 0px #666, 1px 1px 0px #ddd, 1px 1px 0px #ddd, 1px 1px 0px #ccc",
                    borderStyle: "none",
                    margin: "0px"
                },
                body: {
                    color: COLORS.halfwhite,
                    bgColor: COLORS.transparent,
                    textShadow: "-1px -1px 0px #000, -1px -1px 0px #333, -1px -1px 0px #666, 1px 1px 0px #ddd, 1px 1px 0px #ddd, 1px 1px 0px #ccc",
                    borderStyle: "none",
                    fontSize: "16px",
                    fontFamily: "Bodoni SvtyTwo ITC TT",
                    fontWeight: "normal",
                    margin: "0px 0px 5px 0px"
                }
            }
        },
    // #endregion

    // #region SOUND EFFECT CONSTANTS
        SOUNDVOLUME = {
            indoorMult: {
                Thunder: 0.07,
                WolfHowl: 1,
                defaults: {
                    base: 1,
                    score: 0.5,
                    location: 1,
                    weather: 0,
                    effect: 0.4
                }
            },
            rainMult: {
                defaults: {
                    base: 1,
                    location: 1.75,
                    score: 2
                }
            },
            CityChatter: [10],
            CityWalking: [40],
            CityPark: [80],
            CityTraffic: [30],
            Church: [60],
            Rain: [80],
            Thunder: [100],
            WindLow: [60],
            WindWinterLow: [28],
            WindMed: [80],
            WindWinterMed: [90],
            WindMax: [100],
            WindWinterMax: [100],
            WolfHowl: [100, 100],
            SplashScreen: [15],
            defaults: {
                base: [50],
                score: [30],
                location: [45],
                weather: [45],
                effect: [60]
            }
        },
        SOUNDMODES = {
            /* Regarding Playlists:

                PLAYLIST MODE       PLAYLIST MODE               TRACK MODE          EXPLANATION
                  In JUKEBOX          In ROLL20AM                 (Inner Mode)    

                (DEF) Shuffle             Shuffle                     Loop            The playlist is merely storage for the TRACKS, which are CHOSEN by name and LOOP until another is chosen.
                      Loop                RandomLoop                  Single          The PLAYLIST loops RANDOMLY, playing each track once before moving onto another.
                      Play Once           Single                      Single          The playlist is merely storage for the TRACKS, which are CHOSEN by name and PLAY ONCE.
                      SimulPlay           RandomSingle                Single          The playlist selects a track at random and plays it once.
            */
            Effects: {
                mode: "single",
                innerMode: "single"
            },
            Thunder: {
                mode: "randomSingle",
                innerMode: "single"
            },
            MainScore: {
                mode: "randomLoop",
                innerMode: "single"
            },
            SplashScreen: {
                mode: "randomLoop",
                innerMode: "single"
            },
            defaults: {
                mode: "shuffle",
                innerMode: "loop"
            }
        },
        SOUNDSCORES = {
            MainScore: ["Active", "Downtime", "Daylighter", "Spotlight", "Complication"],
            SplashScreen: ["Inactive"]
        },
    // #endregion

    // #region SANDBOX CONFIGURATION & DEFINITIONS
        PIXELSPERSQUARE = 10,
        SANDBOX = {
            height: 1040,
            width: 1590
        }
    SANDBOX.top = SANDBOX.height/2
    SANDBOX.left = SANDBOX.width/2
    const MAP = {            
        height: 2040,
        width: SANDBOX.width
    }
    MAP.top = MAP.height/2 + SANDBOX.height
    MAP.left = MAP.width/2
    const QUADRANTS = {
            TopLeft: {},
            BotLeft: {},
            TopRight: {},
            BotRight: {}
        },
        SHADOWOFFSETS = {
            12: 2,
            14: 2,
            16: 2,
            18: 2,
            20: 2,
            22: 2,
            26: 2.5,
            32: 3,
            40: 3,
            56: 5,
            72: 7,
            100: 8,
            200: 16
        },
        
    // #endregion

    // #region CHARACTER ACTIONS
        CHARACTIONS = _.mapObject({
            "Health S": "!char dmg health superficial ?{Damage done (negative numbers heal)?}",
            "Health S+": "!char dmg health superficial+ ?{Damage done (negative numbers heal)?}",
            "Health A": "!char dmg health aggravated ?{Damage done (negative numbers heal)?}",
            "Will S": "!char dmg willpower superficial ?{Damage done (negative numbers heal)?}",
            "Will S+": "!char dmg willpower superficial+ ?{Damage done (negative numbers heal)?}",
            "Will A": "!char dmg willpower aggravated ?{Damage done (negative numbers heal)?}",
            "Will Ss": "!char dmg willpower social_superficial ?{Damage done (negative numbers heal)?}",
            "Will As": "!char dmg willpower social_aggravated ?{Damage done (negative numbers heal)?}"
        }, v => v.replace(/\(/gu, "&#40;").replace(/\)/gu, "&#41;")),
    // #endregion

    // #region ROLL20 OBJECT PROPERTIES
        IMAGEPROPS = ["imgsrc", "bar1_link", "bar2_link", "bar3_link", "represents", "left", "top", "width", "height", "rotation", "layer", "isdrawing", "flipv", "fliph", "name", "gmnotes", "controlledby", "bar1_value", "bar2_value", "bar3_value", "bar1_max", "bar2_max", "bar3_max", "aura1_radius", "aura2_radius", "tint_color", "statusmarkers", "showname", "showplayers_name", "showplayers_bar1", "showplayers_bar2", "showplayers_bar3", "showplayers_aura1", "showplayers_aura2", "playersedit_name", "playersedit_bar1", "playersedit_bar2", "playersedit_bar3", "playersedit_aura1", "playersedit_aura2", "light_radius", "light_dimradius", "light_otherplayers", "light_hassight", "light_angle", "light_losangle", "lastmove", "light_multiplier", "adv_fow_view_distance"],
        TEXTPROPS = ["top", "left", "width", "height", "text", "font_size", "rotation", "color", "font_family", "layer", "controlledby"],
        ATTRPROPS = ["name", "current", "max"],
        HANDOUTPROPS = ["avatar", "name", "notes", "gmnotes", "inplayerjournals", "archived", "controlledby"],

        MODEDEFAULTS = (obj, modeStatuses = {Active: true, Inactive: false, Daylighter: true, Downtime: null, Complications: null}) => {
            if (VAL({list: modeStatuses}, "MODEDEFAULTS")) {
                modeStatuses[Session.Mode] = true
                if (VAL({object: obj}, "MODEDEFAULTS"))
                    switch(obj.get("_type")) {
                        case "graphic": {
                            const name = obj.get("name")
                            if (name.includes("_Pad_")) {
                                const imgData = Media.GetImgData((DragPads.GetGraphic(obj) || {id: ""}).id)
                                if (VAL({list: imgData}))
                                    return D.KeyMapObj(imgData.modes, null, v => Object.assign(_.omit(v, "lastState"), {isForcedState: null}))
                            }
                            if (name.includes("_PartnerPad_"))
                                return D.KeyMapObj(Session.Modes, (k,v) => v, () => ({isForcedOn: false, isForcedState: null}))
                            break
                        }
                        case "text": {
                            const objData = Media.GetTextData(obj) || {name: "", shadowMaster: false}
                            if (objData.shadowMaster) {
                                const textData = Media.GetTextData(objData.shadowMaster)
                                if (VAL({list: textData}))
                                    return textData.modes
                            }
                            break
                        }
                        // no default
                    }
            }
            const modeStatus = {}
            _.each(modeStatuses, (v, k) => { modeStatus[k] = v })
            return D.KeyMapObj(modeStatuses, null, v => {
                switch (v) {
                    case true:
                        return {
                            isForcedOn: true,
                            isForcedState: null,
                            lastActive: true
                        }
                    case false:
                        return {
                            isForcedOn: false,
                            isForcedState: null
                        }
                    case null:
                        return {
                            isForcedOn: null,
                            isForcedState: null,
                            lastActive: true
                        }
                    default:
                        return {
                            isForcedOn: true,
                            isForcedState: null,
                            lastActive: true
                        }
                    // no default
                }
            })
        },
    // #endregion
    
    // #region VAMPIRE ATTRIBUTES, STATS & TRAITS
        ATTRIBUTES = {
            physical: ["Strength", "Dexterity", "Stamina"],
            social: ["Charisma", "Manipulation", "Composure"],
            mental: ["Intelligence", "Wits", "Resolve"]
        },
        SKILLS = {
            physical: ["Athletics", "Brawl", "Craft", "Drive", "Firearms", "Melee", "Larceny", "Stealth", "Survival"],
            social: ["Animal Ken", "Etiquette", "Insight", "Intimidation", "Leadership", "Performance", "Persuasion", "Streetwise", "Subterfuge"],
            mental: ["Academics", "Awareness", "Finance", "Investigation", "Medicine", "Occult", "Politics", "Science", "Technology"]
        },
        ATTRABBVS = {
            STR: "strength",
            DEX: "dexterity",
            STA: "stamina",
            CHA: "charisma",
            MAN: "manipulation",
            COM: "composure",
            INT: "intelligence",
            WIT: "wits",
            RES: "resolve"
        },
        SKILLABBVS = {
            ATH: "athletics",
            BRA: "brawl",
            CRA: "craft",
            DRV: "drive",
            FIR: "firearms",
            MEL: "melee",
            LAR: "larceny",
            STL: "stealth",
            SUR: "survival",
            ANK: "animal_ken",
            ETI: "etiquette",
            INS: "insight",
            INT: "intimidation",
            LED: "leadership",
            PRF: "performance",
            PER: "persuasion",
            STR: "streetwise",
            SUB: "subterfuge",
            ACA: "academics",
            AWA: "awareness",
            FIN: "finance",
            INV: "investigation",
            MED: "medicine",
            OCC: "occult",
            POL: "politics",
            SCI: "science",
            TEC: "technology"
        },
        DISCIPLINES = {
            ["Animalism"]: {
                ["Bond Famulus"]: {
                    discName: "Animalism",
                    powerName: "Bond Famulus",
                    level: 1,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Sense the Beast"]: {
                    discName: "Animalism",
                    powerName: "Sense the Beast",
                    level: 1,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Feral Whispers"]: {
                    discName: "Animalism",
                    powerName: "Feral Whispers",
                    level: 2,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Animal Succulence"]: {
                    discName: "Animalism",
                    powerName: "Animal Succulence",
                    level: 3,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Quell the Beast"]: {
                    discName: "Animalism",
                    powerName: "Quell the Beast",
                    level: 3,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Unliving Hive"]: {
                    discName: "Animalism",
                    powerName: "Unliving Hive",
                    level: 3,
                    prereqs: [ ["Obfuscate", 2] ],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Subsume the Spirit"]: {
                    discName: "Animalism",
                    powerName: "Subsume the Spirit",
                    level: 4,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Animal Dominion"]: {
                    discName: "Animalism",
                    powerName: "Animal Dominion",
                    level: 5,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Drawing Out the Beast"]: {
                    discName: "Animalism",
                    powerName: "Drawing Out the Beast",
                    level: 5,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                }
            },
            ["Auspex"]: {
                ["Heightened Senses"]: {
                    discName: "Auspex",
                    powerName: "Heightened Senses",
                    level: 1,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Sense the Unseen"]: {
                    discName: "Auspex",
                    powerName: "Sense the Unseen",
                    level: 1,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Premonition"]: {
                    discName: "Auspex",
                    powerName: "Premonition",
                    level: 2,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Scry the Soul"]: {
                    discName: "Auspex",
                    powerName: "Scry the Soul",
                    level: 3,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Share the Senses"]: {
                    discName: "Auspex",
                    powerName: "Share the Senses",
                    level: 3,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Spirit’s Touch"]: {
                    discName: "Auspex",
                    powerName: "Spirit’s Touch",
                    level: 4,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Clairvoyance"]: {
                    discName: "Auspex",
                    powerName: "Clairvoyance",
                    level: 5,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Possession"]: {
                    discName: "Auspex",
                    powerName: "Possession",
                    level: 5,
                    prereqs: [ ["Dominate", 3] ],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Telepathy"]: {
                    discName: "Auspex",
                    powerName: "Telepathy",
                    level: 5,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                }
            },
            ["Celerity"]: {
                ["Cat’s Grace"]: {
                    discName: "Celerity",
                    powerName: "Cat’s Grace",
                    level: 1,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Rapid Reflexes"]: {
                    discName: "Celerity",
                    powerName: "Rapid Reflexes",
                    level: 1,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Fleetness"]: {
                    discName: "Celerity",
                    powerName: "Fleetness",
                    level: 2,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Blink"]: {
                    discName: "Celerity",
                    powerName: "Blink",
                    level: 3,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Traversal"]: {
                    discName: "Celerity",
                    powerName: "Traversal",
                    level: 3,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Draught of Elegance"]: {
                    discName: "Celerity",
                    powerName: "Draught of Elegance",
                    level: 4,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Unerring Aim"]: {
                    discName: "Celerity",
                    powerName: "Unerring Aim",
                    level: 4,
                    prereqs: [ ["Auspex", 2] ],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Lightning Strike"]: {
                    discName: "Celerity",
                    powerName: "Lightning Strike",
                    level: 5,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Split Second"]: {
                    discName: "Celerity",
                    powerName: "Split Second",
                    level: 5,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                }
            },
            ["Dominate"]: {
                ["Cloud Memory"]: {
                    discName: "Dominate",
                    powerName: "Cloud Memory",
                    level: 1,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Compel"]: {
                    discName: "Dominate",
                    powerName: "Compel",
                    level: 1,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Mesmerize"]: {
                    discName: "Dominate",
                    powerName: "Mesmerize",
                    level: 2,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Dementation"]: {
                    discName: "Dominate",
                    powerName: "Dementation",
                    level: 2,
                    prereqs: [ ["Obfuscate", 2] ],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Psychosomatic Agent"]: {
                    discName: "Dominate",
                    powerName: "Psychosomatic Agent",
                    level: 2,
                    prereqs: [ ["Obfuscate", 2] ],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["The Forgetful Mind"]: {
                    discName: "Dominate",
                    powerName: "The Forgetful Mind",
                    level: 3,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Submerged Directive"]: {
                    discName: "Dominate",
                    powerName: "Submerged Directive",
                    level: 3,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Rationalize"]: {
                    discName: "Dominate",
                    powerName: "Rationalize",
                    level: 4,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Mass Manipulation"]: {
                    discName: "Dominate",
                    powerName: "Mass Manipulation",
                    level: 5,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Terminal Decree"]: {
                    discName: "Dominate",
                    powerName: "Terminal Decree",
                    level: 5,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                }
            },
            ["Fortitude"]: {
                ["Resilience"]: {
                    discName: "Fortitude",
                    powerName: "Resilience",
                    level: 1,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Unswayable Mind"]: {
                    discName: "Fortitude",
                    powerName: "Unswayable Mind",
                    level: 1,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Toughness"]: {
                    discName: "Fortitude",
                    powerName: "Toughness",
                    level: 2,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Enduring Beasts"]: {
                    discName: "Fortitude",
                    powerName: "Enduring Beasts",
                    level: 2,
                    prereqs: [ ["Animalism", 1] ],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Defy Bane"]: {
                    discName: "Fortitude",
                    powerName: "Defy Bane",
                    level: 3,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Fortify the Inner Facade"]: {
                    discName: "Fortitude",
                    powerName: "Fortify the Inner Facade",
                    level: 3,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Draught of Endurance"]: {
                    discName: "Fortitude",
                    powerName: "Draught of Endurance",
                    level: 4,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Flesh of Marble"]: {
                    discName: "Fortitude",
                    powerName: "Flesh of Marble",
                    level: 5,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Prowess from Pain"]: {
                    discName: "Fortitude",
                    powerName: "Prowess from Pain",
                    level: 5,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                }
            },
            ["Obfuscate"]: {
                ["Cloak of Shadows"]: {
                    discName: "Obfuscate",
                    powerName: "Cloak of Shadows",
                    level: 1,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Silence of Death"]: {
                    discName: "Obfuscate",
                    powerName: "Silence of Death",
                    level: 1,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Unseen Passage"]: {
                    discName: "Obfuscate",
                    powerName: "Unseen Passage",
                    level: 2,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Ghost in the Machine"]: {
                    discName: "Obfuscate",
                    powerName: "Ghost in the Machine",
                    level: 3,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Mask of a Thousand Faces"]: {
                    discName: "Obfuscate",
                    powerName: "Mask of a Thousand Faces",
                    level: 3,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Conceal"]: {
                    discName: "Obfuscate",
                    powerName: "Conceal",
                    level: 4,
                    prereqs: [ ["Auspex", 3] ],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Vanish"]: {
                    discName: "Obfuscate",
                    powerName: "Vanish",
                    level: 4,
                    prereqs: [ ["Obfuscate", 1, "Cloak of Shadows"] ],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Impostor Guise"]: {
                    discName: "Obfuscate",
                    powerName: "Impostor Guise",
                    level: 5,
                    prereqs: [ ["Obfuscate", 3, "Mask of a Thousand Faces"] ],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Cloak the Gathering"]: {
                    discName: "Obfuscate",
                    powerName: "Cloak the Gathering",
                    level: 5,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                }
            },
            ["Potence"]: {
                ["Lethal Body"]: {
                    discName: "Potence",
                    powerName: "Lethal Body",
                    level: 1,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Soaring Leap"]: {
                    discName: "Potence",
                    powerName: "Soaring Leap",
                    level: 1,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Prowess"]: {
                    discName: "Potence",
                    powerName: "Prowess",
                    level: 2,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Brutal Feed"]: {
                    discName: "Potence",
                    powerName: "Brutal Feed",
                    level: 3,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Spark of Rage"]: {
                    discName: "Potence",
                    powerName: "Spark of Rage",
                    level: 3,
                    prereqs: [ ["Presence", 3] ],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Uncanny Grip"]: {
                    discName: "Potence",
                    powerName: "Uncanny Grip",
                    level: 3,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Draught of Might"]: {
                    discName: "Potence",
                    powerName: "Draught of Might",
                    level: 4,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Earthshock"]: {
                    discName: "Potence",
                    powerName: "Earthshock",
                    level: 5,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Fist of Caine"]: {
                    discName: "Potence",
                    powerName: "Fist of Caine",
                    level: 5,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                }
            },
            ["Presence"]: {
                ["Awe"]: {
                    discName: "Presence",
                    powerName: "Awe",
                    level: 1,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Daunt"]: {
                    discName: "Presence",
                    powerName: "Daunt",
                    level: 1,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Eyes of the Serpent"]: {
                    discName: "Presence",
                    powerName: "Eyes of the Serpent",
                    level: 1,
                    prereqs: [ ["Protean", 1] ],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Lingering Kiss"]: {
                    discName: "Presence",
                    powerName: "Lingering Kiss",
                    level: 2,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Dread Gaze"]: {
                    discName: "Presence",
                    powerName: "Dread Gaze",
                    level: 3,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Entrancement"]: {
                    discName: "Presence",
                    powerName: "Entrancement",
                    level: 3,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Irresistible Voice"]: {
                    discName: "Presence",
                    powerName: "Irresistible Voice",
                    level: 4,
                    prereqs: [ ["Dominate", 1] ],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Summon"]: {
                    discName: "Presence",
                    powerName: "Summon",
                    level: 4,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Majesty"]: {
                    discName: "Presence",
                    powerName: "Majesty",
                    level: 5,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Star Magnetism"]: {
                    discName: "Presence",
                    powerName: "Star Magnetism",
                    level: 5,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                }
            },
            ["Protean"]: {
                ["Eyes of the Beast"]: {
                    discName: "Protean",
                    powerName: "Eyes of the Beast",
                    level: 1,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Weight of the Feather"]: {
                    discName: "Protean",
                    powerName: "Weight of the Feather",
                    level: 1,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Feral Weapons"]: {
                    discName: "Protean",
                    powerName: "Feral Weapons",
                    level: 2,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Earth Meld"]: {
                    discName: "Protean",
                    powerName: "Earth Meld",
                    level: 3,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Shapechange"]: {
                    discName: "Protean",
                    powerName: "Shapechange",
                    level: 3,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Metamorphosis"]: {
                    discName: "Protean",
                    powerName: "Metamorphosis",
                    level: 4,
                    prereqs: [ ["Protean", 3, "Shapechange"] ],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Mist Form"]: {
                    discName: "Protean",
                    powerName: "Mist Form",
                    level: 5,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["The Unfettered Heart"]: {
                    discName: "Protean",
                    powerName: "The Unfettered Heart",
                    level: 5,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                }
            },
            ["Blood Sorcery"]: {
                ["Corrosive Vitae"]: {
                    discName: "Blood Sorcery",
                    powerName: "Corrosive Vitae",
                    level: 1,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["A Taste for Blood"]: {
                    discName: "Blood Sorcery",
                    powerName: "A Taste for Blood",
                    level: 1,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Extinguish Vitae"]: {
                    discName: "Blood Sorcery",
                    powerName: "Extinguish Vitae",
                    level: 2,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Blood of Potency"]: {
                    discName: "Blood Sorcery",
                    powerName: "Blood of Potency",
                    level: 3,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Scorpion's Touch"]: {
                    discName: "Blood Sorcery",
                    powerName: "Scorpion's Touch",
                    level: 3,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Theft of Vitae"]: {
                    discName: "Blood Sorcery",
                    powerName: "Theft of Vitae",
                    level: 4,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Baal's Caress"]: {
                    discName: "Blood Sorcery",
                    powerName: "Baal's Caress",
                    level: 5,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Cauldron of Blood"]: {
                    discName: "Blood Sorcery",
                    powerName: "Cauldron of Blood",
                    level: 5,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                }
            },
            ["Oblivion"]: {
                ["Shadow Cloak"]: {
                    discName: "Oblivion",
                    powerName: "Shadow Cloak",
                    level: 1,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Oblivion's Sight"]: {
                    discName: "Oblivion",
                    powerName: "Oblivion's Sight",
                    level: 1,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Shadow Cast"]: {
                    discName: "Oblivion",
                    powerName: "Shadow Cast",
                    level: 2,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Arms of Ahriman"]: {
                    discName: "Oblivion",
                    powerName: "Arms of Ahriman",
                    level: 2,
                    prereqs: [ ["Potence", 2] ],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Shadow Perspective"]: {
                    discName: "Oblivion",
                    powerName: "Shadow Perspective",
                    level: 3,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Touch of Oblivion"]: {
                    discName: "Oblivion",
                    powerName: "Touch of Oblivion",
                    level: 3,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Stygian Shroud"]: {
                    discName: "Oblivion",
                    powerName: "Stygian Shroud",
                    level: 4,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Shadow Step"]: {
                    discName: "Oblivion",
                    powerName: "Shadow Step",
                    level: 5,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                },
                ["Tenebrous Avatar"]: {
                    discName: "Oblivion",
                    powerName: "Tenebrous Avatar",
                    level: 5,
                    prereqs: [],
                    sheetHTML: "",
                    chatPROMPT: ""
                }
            },
            ["Alchemy"]: {},
            ["Chimerstry"]: {},
            ["Vicissitude"]: {},
            ["True Faith"]: {}
        },
        DISCABBVS = {
            ANI: "Animalism",
            AUS: "Auspex",
            CEL: "Celerity",
            DOM: "Dominate",
            FOR: "Fortitude",
            OBF: "Obfuscate",
            PRE: "Presence",
            PTN: "Protean",
            POT: "Potence",
            SOR: "Blood Sorcery",
            ALC: "Alchemy",
            OBV: "Oblivion",
            VIC: "Vicissitude",
            TRF: "True Faith"
        },
        TRACKERS = ["Willpower", "Health", "Humanity", "Blood Potency"],
        CLANS = ["Brujah", "Gangrel", "Malkavian", "Nosferatu", "Toreador", "Tremere", "Ventrue", "Lasombra", "Tzimisce", "Banu Haqim", "Ministry", "Hecata", "Ravnos"],
        SECTS = ["Camarilla", "Anarch", "Sabbat", "Ashirra", "Second Inquisition", "Autarkis", "Independent", "Mortal"],
        MISCATTRS = ["blood_potency_max", "bp_surge", "bp_discbonus", "bp_minhunger", "bp_slakekill", "hunger", "resonance"],
        BLOODPOTENCY = [
            {bp_surge: 0, bp_discbonus: 0, bp_minhunger: 1},
            {bp_surge: 1, bp_discbonus: 1, bp_minhunger: 1},
            {bp_surge: 1, bp_discbonus: 1, bp_minhunger: 1},
            {bp_surge: 2, bp_discbonus: 1, bp_minhunger: 1},
            {bp_surge: 2, bp_discbonus: 2, bp_minhunger: 2},
            {bp_surge: 3, bp_discbonus: 2, bp_minhunger: 2},
            {bp_surge: 3, bp_discbonus: 3, bp_minhunger: 2},
            {bp_surge: 4, bp_discbonus: 3, bp_minhunger: 3},
            {bp_surge: 4, bp_discbonus: 4, bp_minhunger: 3},
            {bp_surge: 5, bp_discbonus: 4, bp_minhunger: 3},
            {bp_surge: 5, bp_discbonus: 5, bp_minhunger: 4}
        ],
        RESONANCEODDS = {
            flavor: {
                "norm": [[0.25, 0.25, 0.25, 0.25, 0, 0, 0]],
                "pos": [
                    [0.5, 0.1666, 0.1666, 0.1666, 0, 0, 0],
                    [0.5, 0.125, 0.125, 0.125, 0.125, 0, 0]
                ],
                "neg": [[0.3, 0.3, 0.3, 0.1, 0, 0, 0]],
                "negpos": [
                    [0.5, 0.2, 0.2, 0.1, 0, 0, 0],
                    [0.5, 0.1333, 0.1333, 0.1333, 0.1, 0, 0]
                ],
                "2pos": [
                    [0.7, 0.1, 0.1, 0.1, 0, 0, 0],
                    [0.7, 0.075, 0.075, 0.075, 0.075, 0, 0]
                ],
                "pospos": [
                    [0.35, 0.35, 0.15, 0.15, 0, 0, 0],
                    [0.35, 0.35, 0.1, 0.1, 0.1, 0, 0],
                    [0.35, 0.35, 0.075, 0.075, 0.075, 0.075, 0]
                ],
                "2neg": [[0.3333, 0.3333, 0.3333, 0, 0, 0, 0]],
                "negneg": [[0.4, 0.4, 0.1, 0.1, 0, 0, 0]],
                "neg2pos": [
                    [0.7, 0.15, 0.15, 0, 0, 0, 0],
                    [0.7, 0.1, 0.1, 0.1, 0, 0, 0]
                ],
                "2negpos": [
                    [0.5, 0.25, 0.25, 0, 0, 0, 0],
                    [0.5, 0.1666, 0.1666, 0.1666, 0, 0, 0]
                ],
                "negpospos": [
                    [0.35, 0.35, 0.25, 0.05, 0, 0, 0],
                    [0.35, 0.35, 0.125, 0.125, 0.05, 0, 0],
                    [0.35, 0.35, 0.0833, 0.0833, 0.0833, 0.05, 0]
                ],
                "negnegpos": [
                    [0.5, 0.25, 0.125, 0.125, 0, 0, 0],
                    [0.5, 0.15, 0.15, 0.1, 0.1, 0, 0]
                ]
            },
            intensity: {
                norm: [0.5, 0.3, 0.15, 0.05],
                doubleAcute: [0.45, 0.3, 0.15, 0.1]
            }
        },
    // #endregion

        CHARACTERS = [
            "Adrian Gerrard",
            "Agnes Bellanger",
            "Alexander",
            "Alexandra",
            "Alistair Etrata",
            "Amos Jax",
            "Anita Morris",
            "Antoinne LaGritte",
            "Aryana Mortazavi",
            "Baroness Monika Eulenberg",
            "Ben Blinker",
            "Bertrice",
            "Bob Johnston",
            "Bookies Enforcer",
            "Calvin Wallace",
            "Cardinal Collins",
            "Christianne",
            "Cyrus Raza",
            "Damien Abanda",
            "David Greene",
            "Drake",
            "Emily, the Dusk Rose",
            "Flamenco",
            "Frederik Scheer, Seneschal",
            "Husain",
            "I.Q.",
            "Ian Rammond",
            "Inquisitor Delta",
            "J",
            "Jack-be-Nimble",
            "Jane 'JD' Doe",
            "Jason",
            "Jesse, Good Lad That He Is",
            "Jonathan Harker",
            "Kai",
            "Kingston 'King' Black",
            "Kit Edwards",
            "Laz, Sheriff",
            "Leah Hawk",
            "Mason Schmidt",
            "Maxwell 'Max' Floyd",
            "Mr. Easy",
            "Old Quentin",
            "Prince Osborne Lowell",
            "Professor Ethan Keen",
            "Raphael Bishop",
            "Reaper",
            "Ren",
            "Rosie",
            "Sage Sam",
            "Sang-Froid",
            "Sinclair Rodriguez",
            "Soraya Mortazavi",
            "Stalker Todd",
            "Suyin",
            "Terry",
            "The Aristocrat",
            "The Island Devil",
            "The Piece-Taker",
            "The Stranger",
            "Tommy",
            "Toni Gomez",
            "Twist",
            "Tyler",
            "Victor Vex",
            "Wallflower",
            "Wesley Richardson",
            "Xavier Whitchurch",
            "Yusef Shamsin"
        ],
        ROLLERDICELIST = {
            selected: "https://s3.amazonaws.com/files.d20.io/images/87031339/qYj5D-gURif-qN4xSMuzsA/thumb.png?1563696190",
            selectedFree: "https://s3.amazonaws.com/files.d20.io/images/87031341/LcuQLLoPqrcsgBqYZfC5AQ/thumb.png?1563696193",
            selectedDouble: "https://s3.amazonaws.com/files.d20.io/images/87031344/GLCqnybOBoY1a0gKN3KeBQ/thumb.png?1563696197",
            Bf: "https://s3.amazonaws.com/files.d20.io/images/87031347/5KnJOyDS1EqlvPL-XSr_Zw/thumb.png?1563696202",
            Bs: "https://s3.amazonaws.com/files.d20.io/images/87031351/dFCCFy_4TGY0oAKPx_97tA/thumb.png?1563696206",
            Bc: "https://s3.amazonaws.com/files.d20.io/images/87031356/kk7JrIgxOxDjsB7-Tx1Hgg/thumb.png?1563696210",
            BcL: "https://s3.amazonaws.com/files.d20.io/images/87032655/4aaFfq5J3JARalsoj-FojQ/thumb.png?1563697877",
            BcR: "https://s3.amazonaws.com/files.d20.io/images/87032656/_5dWegpwW40iJnX1KZbrhg/thumb.png?1563697881",
            Hb: "https://s3.amazonaws.com/files.d20.io/images/87031371/oJ0DAobJYHsJ-yqKp1JROg/thumb.png?1563696227",
            Hf: "https://s3.amazonaws.com/files.d20.io/images/87031372/tuAwFgBv2InNa4f3dG0lYQ/thumb.png?1563696231",
            Hs: "https://s3.amazonaws.com/files.d20.io/images/87031378/v5vwY2PkvetYTGN_EHMAqw/thumb.png?1563696235",
            Hc: "https://s3.amazonaws.com/files.d20.io/images/87031383/gVLuEp2mP4jlPytjzeoFFw/thumb.png?1563696239",
            HcL: "https://s3.amazonaws.com/files.d20.io/images/87032695/FrEXcG2S4W2wp42b1QxaVQ/thumb.png?1563697900",
            HcR: "https://s3.amazonaws.com/files.d20.io/images/87032700/VudTzvmWVMynpxS-5focJw/thumb.png?1563697904",
            HcRb: "https://s3.amazonaws.com/files.d20.io/images/87032703/65M52wU1gqyULUWinCabww/thumb.png?1563697907",
            HcLb: "https://s3.amazonaws.com/files.d20.io/images/87032708/Ui_y4n4driMHJv0mdYAn7A/thumb.png?1563697910",
            BXc: "https://s3.amazonaws.com/files.d20.io/images/91336100/ESSgeEN2h4llmYgujVpJjQ/thumb.png?1567943808",
            BXs: "https://s3.amazonaws.com/files.d20.io/images/91336101/xsSpdIN3Lktcq0275avnmw/thumb.png?1567943808",
            HXc: "https://s3.amazonaws.com/files.d20.io/images/87031427/FuGfrl1aiw9HTsVy46-m1A/thumb.png?1563696289",
            HXs: "https://s3.amazonaws.com/files.d20.io/images/87031430/ucYeuAXpDbaIjkqbzoRqWQ/thumb.png?1563696294",
            HXb: "https://s3.amazonaws.com/files.d20.io/images/87031432/JoFhDPGehZCF2wnpCU652w/thumb.png?1563696299",
            HCb: "https://s3.amazonaws.com/files.d20.io/images/87031435/8qE4d1bTkLGhK01Tgg-OGQ/thumb.png?1563696304"
        },        
        ROLLERBIGDICE = {
            selected: "https://s3.amazonaws.com/files.d20.io/images/87031660/sUuDsKDSc5EWReOhOyRfFw/thumb.png?1563696663",
            selectedFree: "https://s3.amazonaws.com/files.d20.io/images/87031668/ZXnVqbO7nfQA5-BuTKJQXQ/thumb.png?1563696668",
            selectedDouble: "https://s3.amazonaws.com/files.d20.io/images/87031670/BoAzpEDrxSvndz-imHV5-Q/thumb.png?1563696671",
            Bf: "https://s3.amazonaws.com/files.d20.io/images/87031671/HYJelRirzViDAhJzBsZ51w/thumb.png?1563696674",
            Hf: "https://s3.amazonaws.com/files.d20.io/images/87031674/bvrFCzyt8m7iOFLqzXTW-A/thumb.png?1563696679",
            Bs: "https://s3.amazonaws.com/files.d20.io/images/87031676/xpWcXpa175_ushoG8Ozy7g/thumb.png?1563696683",
            Of: "https://s3.amazonaws.com/files.d20.io/images/87031681/vTU_pKd-LzYrfHAzxhQNlg/thumb.png?1563696687",
            Os: "https://s3.amazonaws.com/files.d20.io/images/87031687/lR5ndvbW1mm-lweHIoLQcA/thumb.png?1563696692",
            Hb: "https://s3.amazonaws.com/files.d20.io/images/87031371/oJ0DAobJYHsJ-yqKp1JROg/thumb.png?1563696227"
        },
    // #region CITY DETAILS
        DISTRICTS = {
            Annex: {
                fullName: "the Annex",
                resonance: ["p", "m"],
                huntDiff: 3,
                homestead: [4, 2, 2, 1],
                rollEffects: [],
                soundScape: ["CityRevelers"],
                outside: true
            },
            BayStFinancial: {
                fullName: "the Bay St. Financial District",
                resonance: ["p", "s"],
                huntDiff: 4,
                homestead: [5, 4, 6, 5],
                rollEffects: [],
                soundScape: ["CityTraffic"],
                outside: true
            },
            Bennington: {
                fullName: "Bennington Heights",
                resonance: ["p", "s"],
                huntDiff: 6,
                homestead: [5, 1, 5, 1],
                rollEffects: ["loc:Bennington+blood surge;nobloodsurge;[-1]Total Eclipse of the Heart;District Quirk: No Blood Surge"],
                soundScape: ["CitySuburb"],
                outside: true
            },
            Cabbagetown: {
                fullName: "Cabbagetown",
                resonance: ["i", "s"],
                huntDiff: 2,
                homestead: [2, 1, 1, 1],
                rollEffects: [],
                soundScape: ["CityTraffic"],
                outside: true
            },
            CentreIsland: {
                fullName: "Centre Island",
                resonance: ["s", "p"],
                huntDiff: 6,
                homestead: [2, 3, 0, 2],
                rollEffects: [],
                soundScape: ["CityPark"],
                outside: true
            },
            Chinatown: {
                fullName: "Chinatown",
                resonance: ["s", "m"],
                huntDiff: 2,
                homestead: [2, 4, 4, 2],
                rollEffects: ["loc:Chinatown+brawl;2;[+1]<#> Kung-Fu Fighting|loc;Chinatown+firearms/melee;-2;[-1]<#> Kung-Fu Fighting"],
                soundScape: ["CityTraffic"],
                outside: true
            },
            CityStreets: {
                fullName: "City Streets",
                resonance: ["c", "m"],
                huntDiff: 6,
                homestead: [2, 2, 2, 4],
                rollEffects: [],
                soundScape: ["CityTraffic"],
                outside: true
            },
            Corktown: {
                fullName: "Corktown",
                resonance: ["c", "p"],
                huntDiff: 2,
                homestead: [2, 3, 1, 0],
                rollEffects: [],
                soundScape: ["CityTraffic"],
                outside: true
            },
            Danforth: {
                fullName: "the Danforth",
                resonance: ["s", "p"],
                huntDiff: 3,
                homestead: [4, 2, 4, 2],
                rollEffects: [],
                soundScape: ["CityWalking"],
                outside: true
            },
            DeerPark: {
                fullName: "Deer Park",
                resonance: ["r", "s"],
                huntDiff: 5,
                homestead: [2, 1, 2, 3],
                rollEffects: ["loc:DeerPark;bestialcancel;[!1]Bad Moon Rising"],
                soundScape: ["CitySuburb"],
                outside: true
            },
            Discovery: {
                fullName: "the Discovery District",
                resonance: ["m", "c"],
                huntDiff: 4,
                homestead: [5, 2, 3, 3],
                rollEffects: [],
                soundScape: ["CityChatter"],
                outside: true
            },
            DistilleryDist: {
                fullName: "the Distillery District",
                resonance: ["c", "s"],
                huntDiff: 5,
                homestead: [1, 2, 4, 4],
                rollEffects: ["loc:DistilleryDist+firearms;2;[+1]<#> Janie's Got a Gun|loc:DistilleryDist+brawl/melee;-2;[-1]<#> Janie's Got a Gun"],
                soundScape: ["CityTraffic"],
                outside: true
            },
            DupontByTheCastle: {
                fullName: "Dupont by the Castle",
                resonance: ["m", "c"],
                huntDiff: 4,
                homestead: [5, 3, 5, 2],
                rollEffects: ["loc:DupontByTheCastle+messycrit;;[!1]Can't Stop the Feeling"],
                soundScape: ["CityWalking"],
                outside: true
            },
            GayVillage: {
                fullName: "the Gay Village",
                resonance: ["s", "m"],
                huntDiff: 2,
                homestead: [4, 3, 2, 3],
                rollEffects: [],
                soundScape: ["CityTraffic"],
                outside: true
            },
            HarbordVillage: {
                fullName: "Harbord Village",
                resonance: ["c", "p"],
                huntDiff: 4,
                homestead: [3, 5, 3, 4],
                rollEffects: [],
                soundScape: ["CityTraffic"],
                outside: true
            },
            Humewood: {
                fullName: "Humewood",
                resonance: ["r", "s"],
                huntDiff: 3,
                homestead: [2, 1, 4, 2],
                rollEffects: [],
                soundScape: ["CitySuburb"],
                outside: true
            },
            LakeOntario: {
                fullName: "Lake Ontario",
                resonance: ["p", "s"],
                huntDiff: "~",
                homestead: [2, 1, 4, 4],
                rollEffects: [],
                soundScape: ["Waterside"],
                outside: true
            },
            LibertyVillage: {
                fullName: "Liberty Village",
                resonance: ["c", "m"],
                huntDiff: 3,
                homestead: [3, 3, 2, 1],
                rollEffects: [],
                soundScape: ["CityRevelers"],
                outside: true
            },
            LittleItaly: {
                fullName: "Little Italy",
                resonance: ["c", "p"],
                huntDiff: 2,
                homestead: [3, 3, 3, 3],
                rollEffects: ["loc:LittleItaly+melee;2;[+1]<#> Beat It|loc:LittleItaly+firearms/melee;-2;[-1]<#> Beat It"],
                soundScape: ["CityTraffic"],
                outside: true
            },
            LittlePortugal: {
                fullName: "Little Portugal",
                resonance: ["m", "p"],
                huntDiff: 2,
                homestead: [1, 4, 3, 3],
                rollEffects: [],
                soundScape: ["(TOTALSILENCE)"],
                outside: true
            },
            PATH: {
                fullName: "P.A.T.H.",
                resonance: ["p", "c"],
                huntDiff: 4,
                homestead: [3, 6, 4, 5],
                rollEffects: [],
                soundScape: ["IndoorMarket"],
                outside: false
            },
            RegentPark: {
                fullName: "Regent Park",
                resonance: ["p", "c"],
                huntDiff: 3,
                homestead: [4, 4, 3, 4],
                rollEffects: [],
                soundScape: ["CitySuburb"],
                outside: true
            },
            Riverdale: {
                fullName: "Riverdale",
                resonance: ["q", "m"],
                huntDiff: 3,
                homestead: [3, 5, 4, 3],
                rollEffects: ["loc:Riverdale+messycrit;nomessycrit;[LOC]Steady As She Goes"],
                soundScape: ["CitySuburb"],
                outside: true
            },
            Rosedale: {
                fullName: "Rosedale",
                resonance: ["p", "m"],
                huntDiff: 6,
                homestead: [5, 1, 5, 4],
                rollEffects: [],
                soundScape: ["CitySuburb"],
                outside: true
            },
            Sewers: {
                fullName: "the Sewers",
                resonance: ["m", "s"],
                huntDiff: "~",
                homestead: [0, 1, 4, 5],
                rollEffects: ["loc:Sewers+Nosferatu+physical/discipline;2;[+1]<#> Demons"],
                soundScape: ["Sewers"],
                outside: false
            },
            StJamesTown: {
                fullName: "St. James Town",
                resonance: ["i", "p"],
                huntDiff: 2,
                homestead: [1, 1, 4, 1],
                rollEffects: ["loc:StJamesTown+Lasombra+Dominate;2;[+1]<#> Music of the Night"],
                soundScape: ["CityTraffic"],
                outside: true
            },
            Summerhill: {
                fullName: "Summerhill",
                resonance: ["m", "s"],
                huntDiff: 2,
                homestead: [1, 3, 3, 2],
                rollEffects: [],
                soundScape: ["CitySuburb"],
                outside: true
            },
            Waterfront: {
                fullName: "the Waterfront",
                resonance: ["s", "c"],
                huntDiff: 4,
                homestead: [6, 5, 4, 5],
                rollEffects: [],
                soundScape: ["CityTraffic"],
                outside: true
            },
            WestQueenWest: {
                fullName: "West Queen West",
                resonance: ["s", "p"],
                huntDiff: 3,
                homestead: [4, 4, 3, 4],
                rollEffects: ["loc:WestQueenWest+success+rouse;reroll;[!1]Hungry Like the Wolf"],
                soundScape: ["CityTraffic"],
                outside: true
            },
            Wychwood: {
                fullName: "Wychwood",
                resonance: ["s", "c"],
                huntDiff: 5,
                homestead: [2, 0, 5, 1],
                rollEffects: [],
                soundScape: ["CitySuburb"],
                outside: true
            },
            YongeMuseum: {
                fullName: "the Yonge & Bloor Museum District",
                resonance: ["m", "c"],
                huntDiff: 4,
                homestead: [5, 4, 4, 3],
                rollEffects: [],
                soundScape: ["CityChatter"],
                outside: true
            },
            YongeHospital: {
                fullName: "the Yonge & College Hospital District",
                resonance: ["p", "c"],
                huntDiff: 4,
                homestead: [4, 4, 4, 5],
                rollEffects: [],
                soundScape: ["CityTraffic"],
                outside: true
            },
            YongeStreet: {
                fullName: "Yonge Street",
                resonance: ["q", "m"],
                huntDiff: 3,
                homestead: [4, 5, 4, 6],
                rollEffects: [],
                soundScape: ["CityTraffic"],
                outside: true
            },
            Yorkville: {
                fullName: "Yorkville",
                resonance: ["c", "m"],
                huntDiff: 6,
                homestead: [5, 2, 4, 5],
                rollEffects: [],
                soundScape: ["CitySuburb"],
                outside: true
            }
        },
        SITES = {
            AnarchBar: {
                fullName: "Anarch Dive Bar",
                district: null,
                resonance: ["c", null],
                rollEffects: [],
                soundScape: ["DiveBar"],
                outside: false
            },
            ArtGallery: {
                fullName: "Art Gallery of Ontario",
                district: ["WestQueenWest"],
                resonance: ["s", null],
                rollEffects: [],
                soundScape: ["SoftIndoor"],
                outside: false
            },
            BackAlley: {
                fullName: "Back Alley",
                district: null,
                resonance: [null, "s"],
                rollEffects: [],
                soundScape: ["UrbanDark"],
                outside: true
            },
            BayTower: {
                fullName: "Bay Wellington Tower",
                district: ["BayStFinancial"],
                resonance: ["p", null],
                rollEffects: [],
                soundScape: ["SoftIndoor"],
                outside: false
            },
            BillyBishopFerry: {
                fullName: "Billy Bishop Ferry",
                district: ["Waterfront", "LakeOntario"],
                resonance: ["m", null],
                rollEffects: [],
                soundScape: ["Waterside"],
                outside: false
            },
            CasaLoma: {
                fullName: "Casa Loma",
                district: ["DupontByTheCastle"],
                resonance: [null, "m"],
                rollEffects: [],
                soundScape: ["Church"],
                outside: false
            },
            Cemetary: {
                fullName: "Cemetary",
                district: null,
                resonance: ["m", null],
                rollEffects: [],
                soundScape: ["CityPark"],
                outside: true
            },
            ChristiePitsPark: {
                fullName: "Christie Pits Park",
                district: ["Wychwood"],
                resonance: ["m", null],
                rollEffects: [],
                soundScape: ["CityPark"],
                outside: true
            },
            CityApt1: {
                fullName: "City Apartment",
                district: null,
                resonance: ["c", null],
                rollEffects: [],
                soundScape: ["(NONE)"],
                outside: false
            },
            CityHall: {
                fullName: "City Hall",
                district: ["WestQueenWest"],
                resonance: ["p", null],
                rollEffects: [],
                soundScape: ["SoftIndoor"],
                outside: false
            },
            CityPark: {
                fullName: "City Park",
                district: null,
                resonance: ["s", null],
                rollEffects: [],
                soundScape: ["CityPark"],
                outside: true
            },
            CNTower: {
                fullName: "CN Tower",
                district: ["Waterfront"],
                resonance: ["s", null],
                rollEffects: [],
                soundScape: ["RoofTop"],
                outside: false
            },
            Docks: {
                fullName: "the Docks",
                district: ["DistilleryDist"],
                resonance: ["c", null],
                rollEffects: [],
                soundScape: ["Waterside"],
                outside: true
            },
            Drake: {
                fullName: "the Drake Hotel",
                district: ["LittlePortugal"],
                resonance: ["s", null],
                rollEffects: [],
                soundScape: ["(TOTALSILENCE)"],
                outside: false
            },
            Elysium: {
                fullName: "Elysium",
                district: null,
                resonance: [null, "c"],
                rollEffects: [],
                soundScape: ["SoftIndoor"],
                outside: false
            },
            BrickWorks: {
                fullName: "Evergreen Brick Works",
                district: ["Rosedale"],
                resonance: [null, "s"],
                rollEffects: [],
                soundScape: ["Industry"],
                outside: false
            },
            EvergreenPalisades: {
                fullName: "Evergreen Palisades",
                district: ["RegentPark"],
                resonance: ["i", null],
                rollEffects: [],
                soundScape: ["(NONE)"],
                outside: false
            },
            FightClub: {
                fullName: "Fight Club",
                district: null,
                resonance: ["c", null],
                rollEffects: [],
                soundScape: ["(NONE)"],
                outside: false
            },
            CeramicsMuseum: {
                fullName: "Gardiner Ceramics Museum",
                district: ["YongeHospital"],
                resonance: ["p", null],
                rollEffects: [],
                soundScape: ["SoftIndoor"],
                outside: false
            },
            GayClub: {
                fullName: "Gay Nightclub",
                district: null,
                resonance: ["s", null],
                rollEffects: [],
                soundScape: ["Nightclub"],
                outside: false
            },
            Distillery: {
                fullName: "the Historic Distillery",
                district: ["DistilleryDist"],
                resonance: ["m", null],
                rollEffects: [],
                soundScape: ["Industry"],
                outside: false
            },
            Laboratory: {
                fullName: "Laboratory",
                district: null,
                resonance: ["m", null],
                rollEffects: [],
                soundScape: ["(NONE)"],
                outside: false
            },
            LectureHall: {
                fullName: "Lecture Hall",
                district: null,
                resonance: ["m", null],
                rollEffects: [],
                soundScape: ["SoftIndoor"],
                outside: false
            },
            Library: {
                fullName: "Library",
                district: null,
                resonance: ["p", null],
                rollEffects: [],
                soundScape: ["SoftIndoor"],
                outside: false
            },
            MadinaMasjid: {
                fullName: "Madina Masjid",
                district: ["Danforth"],
                resonance: ["p", null],
                rollEffects: [],
                soundScape: ["Church"],
                outside: false
            },
            MiddleOfRoad: {
                fullName: "Middle of the Road",
                district: null,
                resonance: ["m", null],
                rollEffects: [],
                soundScape: ["CityTraffic"],
                outside: true
            },
            Nightclub: {
                fullName: "Nightclub",
                district: null,
                resonance: ["s", null],
                rollEffects: [],
                soundScape: ["Nightclub"],
                outside: false
            },
            Office: {
                fullName: "Office",
                district: null,
                resonance: [null, "c"],
                rollEffects: [],
                soundScape: ["SoftIndoor"],
                outside: false
            },
            ParkingLot: {
                fullName: "Parking Lot",
                district: null,
                resonance: [null, "p"],
                rollEffects: [],
                soundScape: ["(NONE)"],
                outside: true
            },
            PMHospital: {
                fullName: "Princess Margaret Hospital",
                district: ["YongeMuseum"],
                resonance: ["p", null],
                rollEffects: [],
                soundScape: ["Hospital"],
                outside: false
            },
            ProfOffice: {
                fullName: "Professor's Office",
                district: ["Discovery"],
                resonance: ["p", null],
                rollEffects: [],
                soundScape: ["SoftIndoor"],
                outside: false
            },
            RedemptionHouse: {
                fullName: "Redemption House",
                district: ["Danforth"],
                resonance: [null, "p"],
                rollEffects: [],
                soundScape: ["SoftIndoor"],
                outside: false
            },
            RogersCentre: {
                fullName: "Rogers Centre",
                district: ["Waterfront"],
                resonance: ["c", null],
                rollEffects: [],
                soundScape: ["(NONE)"],
                outside: true
            },
            Rooftops: {
                fullName: "Rooftops",
                district: null,
                resonance: ["m", null],
                rollEffects: [],
                soundScape: ["RoofTop"],
                outside: true
            },
            ROM: {
                fullName: "Royal Ontario Museum",
                district: ["YongeHospital"],
                resonance: ["m", null],
                rollEffects: [],
                soundScape: ["SoftIndoor"],
                outside: false
            },
            SheerExcess: {
                fullName: "sheer eXcess DVD Rental",
                district: ["GayVillage"],
                resonance: ["m", null],
                rollEffects: [],
                soundScape: ["Nightclub"],
                outside: false
            },
            Sidewalk1: {
                fullName: "Sidewalk",
                district: null,
                resonance: [null, "s"],
                rollEffects: [],
                soundScape: ["(NONE)"],
                outside: true
            },
            Sidewalk2: {
                fullName: "Sidewalk",
                district: null,
                resonance: ["q", null],
                rollEffects: [],
                soundScape: ["(NONE)"],
                outside: true
            },
            Sidewalk3: {
                fullName: "Sidewalk",
                district: null,
                resonance: ["p", null],
                rollEffects: [],
                soundScape: ["(NONE)"],
                outside: true
            },
            SiteLotus: {
                fullName: "Site: Lotus",
                district: ["YongeStreet"],
                resonance: [null, null],
                rollEffects: [],
                soundScape: ["SoftHum"],
                outside: false
            },
            SpawningPool: {
                fullName: "Spawning Pool",
                district: ["Sewers"],
                resonance: ["m", null],
                rollEffects: [],
                soundScape: ["Sewers"],
                outside: false
            },
            StMichaelsCathedral: {
                fullName: "St. Michael's Cathedral Basilica",
                district: ["YongeStreet"],
                resonance: ["p", null],
                rollEffects: [],
                soundScape: ["Church"],
                outside: false
            },
            StripClub: {
                fullName: "Strip Club",
                district: null,
                resonance: ["s", null],
                rollEffects: [],
                soundScape: ["Nightclub"],
                outside: false
            },
            StudentVillage: {
                fullName: "Student Village",
                district: ["Discovery"],
                resonance: ["s", null],
                rollEffects: [],
                soundScape: ["CityRevelers"],
                outside: true
            },
            SubwayStation: {
                fullName: "Subway Station",
                district: ["PATH"],
                resonance: ["c", null],
                rollEffects: [],
                soundScape: ["Subway"],
                outside: false
            },
            SubwayTunnels: {
                fullName: "Subway Tunnels",
                district: ["PATH"],
                resonance: [null, "s"],
                rollEffects: [],
                soundScape: ["Sewers"],
                outside: false
            },
            TremereChantry: {
                fullName: "Tremere Chantry",
                district: ["Discovery"],
                resonance: ["p", null],
                rollEffects: [],
                soundScape: ["Church"],
                outside: false
            },
            UndergroundMedClinic: {
                fullName: "Underground Medical Clinic",
                district: ["Discovery"],
                resonance: ["m", null],
                rollEffects: [],
                soundScape: ["Hospital"],
                outside: false
            },
            UndergroundMedOffice: {
                fullName: "Underground Medical Office",
                district: ["Discovery"],
                resonance: [null, "c"],
                rollEffects: [],
                soundScape: ["SoftIndoor"],
                outside: false
            },
            VacantLot: {
                fullName: "Vacant Lot",
                district: null,
                resonance: ["i", null],
                rollEffects: [],
                soundScape: ["UrbanDark"],
                outside: true
            },
            Vehicle2: {
                fullName: "Vehicle",
                district: null,
                resonance: [null, null],
                rollEffects: [],
                soundScape: ["CityTraffic"],
                outside: true
            },
            Vehicle4: {
                fullName: "Vehicle",
                district: null,
                resonance: [null, null],
                rollEffects: [],
                soundScape: ["CityTraffic"],
                outside: true
            },
            Vehicle5: {
                fullName: "Vehicle",
                district: null,
                resonance: [null, null],
                rollEffects: [],
                soundScape: ["CityTraffic"],
                outside: true
            },
            Vehicle7: {
                fullName: "Vehicle",
                district: null,
                resonance: [null, null],
                rollEffects: [],
                soundScape: ["CityTraffic"],
                outside: true
            },
            WalkingPath: {
                fullName: "Walking Path",
                district: null,
                resonance: ["q", null],
                rollEffects: [],
                soundScape: ["CityPark"],
                outside: true
            },
            WarrensAntechamber: {
                fullName: "Warrens: Antechamber",
                district: ["Sewers"],
                resonance: ["m", null],
                rollEffects: [],
                soundScape: ["Sewers"],
                outside: false
            },
            WychwoodPub: {
                fullName: "Wychwood Pub",
                district: ["Wychwood"],
                resonance: [null, "c"],
                rollEffects: [],
                soundScape: ["(NONE)"],
                outside: false
            },
            Yacht: {
                fullName: "Luxury Yacht",
                district: ["Waterfront", "LakeOntario"],
                resonance: ["m", null],
                rollEffects: [],
                soundScape: ["Waterside"],
                outside: false
            },
            YongeDundasSquare: {
                fullName: "Yonge & Dundas Square",
                district: ["YongeStreet"],
                resonance: ["c", null],
                rollEffects: [],
                soundScape: ["(NONE)"],
                outside: true
            },
            YorkvilleApt1: {
                fullName: "Yorkville Apartment",
                district: ["Yorkville"],
                resonance: ["m", null],
                rollEffects: [],
                soundScape: ["(NONE)"],
                outside: false
            },
            YorkvilleApt2: {
                fullName: "Yorkville Apartment",
                district: ["Yorkville"],
                resonance: ["m", null],
                rollEffects: [],
                soundScape: ["(NONE)"],
                outside: false
            },
            YouthShelter: {
                fullName: "Youth Shelter",
                district: null,
                resonance: ["c", null],
                rollEffects: [],
                soundScape: ["CityRevelers"],
                outside: false
            }
        },
    // #endregion

    // #region MVC: Minimally-Viable Character Design
        MVCVALS = [
            [
                "<span style=\"display: block; width: 100%; margin-top: -10px;\">Concept</span></div><div style=\"display: block; width: 100%; margin-top: -10px;\">",
                ["headerL", "A depressed", "A surly", "A straightforward", "A timid", "A clever", "A bold", "An inquisitive", "A circumspect", "An outgoing", "An optimistic", "An agreeable", "A wise", "A misguided", "A gregarious", "A jaded", "An analytical"],
                ["headerR", "Cop/Detective", "Social Worker/Activist", "Doctor/Nurse/EMT", "Banker/Money Launderer", "Office Worker/Academic", "Soldier/Rebel", "Artist/Musician/Performer", "Con-Artist/Politician", "Hacker/Tech Specialist", "Stick-Up Kid/Armed Robber", "Lawyer/Fugitive", "Priest/True Believer", "Witness/Whistleblower", "Representative/Lobbyist", "Runaway/Wanderer"],
                ["header", "stands accused. (Wrongfully?)", "was disgraced and cast out.", "was seriously injured (body/mind/soul).", "is a failure at life.", "is hiding from someone.", "is stepping on the wrong toes.", "is pushing the envelope.", "is a rising star.", "is respected and admired.", "is at the height of their field.", "has a secret they're ashamed of.", "is burnt out but still going.", "is famous for a thing.", "is reluctantly breaking the law."],
            ],
            [
                "Pivotal Event",
                ["para",
                 "<span style=\"font-size: 14px; margin-top: 10px;\"><b>In the past ...</b></span><br>... you fell in love with the wrong person, who dragged you into an exciting world you never knew existed. You freaked out and left them.",
                 "<span style=\"font-size: 14px; margin-top: 10px;\"><b>In the past ...</b></span><br>... your best friend accused you of a crime you know you didn't commit, but they have photos that prove otherwise.",
                 "<span style=\"font-size: 14px; margin-top: 10px;\"><b>In the past ...</b></span><br>... you ended up in a literal warzone, bullets flying all around you. If it weren't for a dangerous psychopath you befriended you'd be a corpse.",
                 "<span style=\"font-size: 14px; margin-top: 10px;\"><b>In the past ...</b></span><br>... your parents were deranged on some basal level and you grew up in chaos. You escaped as soon as you could.",
                 "<span style=\"font-size: 14px; margin-top: 10px;\"><b>In the past ...</b></span><br>... somehow, through no fault of your own, you ended up with money and status. You don't know what happened to it all.",
                 "<span style=\"font-size: 14px; margin-top: 10px;\"><b>In the past ...</b></span><br>... someone once took you out into some isolated place and showed you something that gives you weird dreams to this day.",
                 "<span style=\"font-size: 14px; margin-top: 10px;\"><b>In the past ...</b></span><br>... you had a talent that showed itself at an early age. Everyone told you you would be famous for it, but here you are.",
                 "<span style=\"font-size: 14px; margin-top: 10px;\"><b>In the past ...</b></span><br>... you look a job with no experience that no one thought you could do. After a few years, you quit and didn't look back. You can't say why.",
                 "<span style=\"font-size: 14px; margin-top: 10px;\"><b>In the past ...</b></span><br>... someone very close to you died. No one would tell you what happened, and the people around you refused to talk about it.",
                 "<span style=\"font-size: 14px; margin-top: 10px;\"><b>In the past ...</b></span><br>... Work. Sleep. Work. Sleep. Forever. One day you'd had enough, and in the middle of the day exploded in a rage. You left that life behind and never talk about it."],
                ["para",
                 "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You <i>still</i> feel <span style=\"font-size: 14px; margin-top: 10px;\"><u>Endless Regret</u>:</b></span><br>You didn't comport yourself with any dignity or honesty. You thought you were better than that.",
                 "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You <i>still</i> feel <span style=\"font-size: 14px; margin-top: 10px;\"><u>Simmering Rage</u>:</b></span><br>They know what they did, and they did it knowing what would happen.",
                 "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You <i>still</i> feel a <span style=\"font-size: 14px; margin-top: 10px;\"><u>Miasma of Confusion</u>:</b></span><br>You can't square this circle. Nothing about this makes any sense and the more you think about it the worse it is.",
                 "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You <i>still</i> feel <span style=\"font-size: 14px; margin-top: 10px;\"><u>Arrogant Certainty</u>:</b></span><br>You were there for the whole thing and it didn't beat you. Nothing can stand in your way now.",
                 "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You <i>still</i> feel <span style=\"font-size: 14px; margin-top: 10px;\"><u>Bleak Joy</u>:</b></span><br>It's funny when you think about it. We're all just stuck here on this planet and absurd things keep happening.",
                 "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You <i>still</i> feel <span style=\"font-size: 14px; margin-top: 10px;\"><u>Numb Disbelief</u>:</b></span><br>Did that really happen? It can't have happened. It doesn't feel real.",
                 "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You <i>still</i> feel <span style=\"font-size: 14px; margin-top: 10px;\"><u>Renewed Purpose</u>:</b></span><br>Everything is lined up for you. You know what you have to do with your life now.",
                 "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You <i>still</i> feel <span style=\"font-size: 14px; margin-top: 10px;\"><u>Frail Hopelessness</u>:</b></span><br>Nothing matters, and the more you look at it the more you feel like the Universe is a great, crushing wave.",
                 "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You're <i>still</i> driven to <span style=\"font-size: 14px; margin-top: 10px;\"><u>Hypervigilance</u>:</b></span><br>This could happen at any moment to anyone. You keep your head on a swivel for the next time it does.",
                 "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You <i>still</i> feel <span style=\"font-size: 14px; margin-top: 10px;\"><u>Overwhelming Oneness</u>:</b></span><br>Have you laid in the grass and felt the Earth spinning around you? That's how you feel when you reflect on this memory."],
                ["para",
                 "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You can't let go because ... </b></span><br> ... it never ended. You just move forward and try to put the past behind you. But when you can't help but look back, it's always there, right at your heels.",
                 "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You can't let go because ... </b></span><br> ... the responsible parties died before they could be confronted about their part in it.",
                 "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You can't let go because ... </b></span><br> ... things keep repeating, the same situations keep appearing in your periphery and reopening old wounds.",
                 "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You can't let go because ... </b></span><br> ... some problems are too big.  Some problems are systemic things that won't budge to one person's will.",
                 "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You can't let go because ... </b></span><br> ... forgiveness is earned, and the person or people responsible haven't earned it.",
                 "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You can't let go because ... </b></span><br> ... you can't put it right, because what is done is done.",
                 "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You can't let go because ... </b></span><br> ... the system stepped in, the state or family, and took it all out of your hands.",
                 "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You can't let go because ... </b></span><br> ... you don't understand how it happened, and because you don't understand it, you can't resolve it.",
                 "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You can't let go because ... </b></span><br> ... everything returned to normal on the outside, but just underneath that veneer of normalcy... it sits.",
                 "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You can't let go because ... </b></span><br> ... other things took priority, so it remained an open loop, still in the back of your head."],
            ],
            [
                "Habits",
                ["paraStart",
                 "You reinforce or establish your <b>Profession</b> ",
                 "You reinforce or establish your <b>Regional Background</b> ",
                 "You reinforce or establish your <b>Social Class</b> ",
                 "You reinforce or establish your <b>Childhood</b> ",
                 "You reinforce or establish your <b>Political Ideology</b> ",
                 "You reinforce or establish your <b>Opinion on Authority</b> ",
                 "You reinforce or establish your <b>Religious Faith</b> ",
                 "You reinforce or establish your <b>Family Status</b> ",
                 "You reinforce or establish your <b>Sexual Preference</b> ",
                 "You reinforce or establish your <b>Gender Identity</b> "],
                ["paraMid",
                 "with your <b>Speech and Accent</b>, but undermine, subvert or contradict it ",
                 "with your <b>Clothing and Aesthetics</b>, but undermine, subvert or contradict it ",
                 "through your <b>Hobbies and Interests</b>, but undermine, subvert or contradict it ",
                 "with your <b>Critical Opinions</b>, but undermine, subvert or contradict it ",
                 "with your <b>Taste in Art/Music</b>, but undermine, subvert or contradict it ",
                 "with your <b>Positive Opinions</b>, but undermine, subvert or contradict it ",
                 "through your <b>Nervous Nature</b>, but undermine, subvert or contradict it ",
                 "with your <b>Indulgent Vices</b>, but undermine, subvert or contradict it ",
                 "with your <b>Outward Ambitions</b>, but undermine, subvert or contradict it ",
                 "through your <b>Confident Behavior</b>, but undermine, subvert or contradict it "],
                ["paraEnd",
                 "with your <b>Speech and Accent</b>.",
                 "with your <b>Clothing and Aesthetics</b>.",
                 "through your <b>Hobbies and Interests</b>.",
                 "with your <b>Critical Opinions</b>.",
                 "with your <b>Taste in Art/Music</b>.",
                 "with your <b>Positive Opinions</b>.",
                 "through your <b>Nervous Nature</b>.",
                 "with your <b>Indulgent Vices</b>.",
                 "with your <b>Outward Ambitions</b>.",
                 "through your <b>Confident Behavior</b>."],
            ],
            [
                "Signposts",
                ["paraStart",
                 "When you see or commit an <b>Abuse of Power</b>, ",
                 "When you see or show <b>Disrespect</b>, ",
                 "When you see or commit <b>Violence</b>, ",
                 "When you see or commit <b>Degradation</b>, ",
                 "When you see or cause <b>Death</b>, ",
                 "When you hear or conceive <b>Wisdom</b>, ",
                 "When you see or create <b>Beauty</b>, ",
                 "When you encounter <b>Intellectualism</b>, ",
                 "When you see or show <b>Respect</b>, ",
                 "When you see or bring about <b>Justice</b>, ",
                 "When you see or show <b>Mercy</b>, "],
                ["paraEnd",
                 "you react with <b>Hatred</b> (or) <b>Love:</b> You want to destroy them for existing, or to bask in their glory.",
                 "you react with <b>Disgust</b> (or) <b>Appreciation:</b> The smell of sour milk, or the sweet smell of opportunity.",
                 "you react with <b>Rage</b> (or) <b>Joy:</b> They cut in front of you and laugh about it, or fill you with elation.",
                 "you react with <b>Vigilant Distrust</b> (or) <b>Conviction:</b> You think you're being lied to, or you're more certain than ever.",
                 "you react with <b>Admiration</b> (or) <b>Judgment:</b> One day you'll do what they did, or one day they'll learn.",
                 "you react with <b>Bravery</b> (or) <b>Cowardice:</b> You stood up to the bully, or ran like hell.",
                 "you react with <b>Amazement</b> (or) <b>Criticism:</b> Someone has to see this thing!",
                 "you react with <b>Acceptance</b> (or) <b>Denial:</b> All this is according to design, or a change must come, whatever the cost.",
                 "you react with <b>Attraction</b> (or) <b>Repulsion:</b> If you can just get a little closer... or farther away...",
                 "you react with <b>Zeal</b> (or) <b>Boredom:</b> You're reminded of what is good in the world, or you grow impatient to find something more interesting."],
                ["paraStart",
                 "When you see or commit an <b>Abuse of Power</b>, ",
                 "When you see or show <b>Disrespect</b>, ",
                 "When you see or commit <b>Violence</b>, ",
                 "When you see or commit <b>Degradation</b>, ",
                 "When you see or cause <b>Death</b>, ",
                 "When you hear or conceive <b>Wisdom</b>, ",
                 "When you see or create <b>Beauty</b>, ",
                 "When you encounter <b>Intellectualism</b>, ",
                 "When you see or show <b>Respect</b>, ",
                 "When you see or bring about <b>Justice</b>, ",
                 "When you see or show <b>Mercy</b>, "],
                ["paraEnd",
                 "you react with <b>Hatred</b> (or) <b>Love:</b> You want to destroy them for existing, or to bask in their glory.",
                 "you react with <b>Disgust</b> (or) <b>Appreciation:</b> The smell of sour milk, or the sweet smell of opportunity.",
                 "you react with <b>Rage</b> (or) <b>Joy:</b> They cut in front of you and laugh about it, or fill you with elation.",
                 "you react with <b>Vigilant Distrust</b> (or) <b>Conviction:</b> You think you're being lied to, or you're more certain than ever.",
                 "you react with <b>Admiration</b> (or) <b>Judgment:</b> One day you'll do what they did, or one day they'll learn.",
                 "you react with <b>Bravery</b> (or) <b>Cowardice:</b> You stood up to the bully, or ran like hell.",
                 "you react with <b>Amazement</b> (or) <b>Criticism:</b> Someone has to see this thing!",
                 "you react with <b>Acceptance</b> (or) <b>Denial:</b> All this is according to design, or a change must come, whatever the cost.",
                 "you react with <b>Attraction</b> (or) <b>Repulsion:</b> If you can just get a little closer... or farther away...",
                 "you react with <b>Zeal</b> (or) <b>Boredom:</b> You're reminded of what is good in the world, or you grow impatient to find something more interesting."],
            ],
        ],
    // #endregion

    // #region SPECIAL EFFECTS DEFINITIONS
        FX = {
            bloodCloud: {
                duration: 50,
                maxParticles: 350,
                size: 30,
                sizeRandom: 5,
                lifeSpan: 15,
                lifeSpanRandom: 7,
                emissionRate: 20,
                speed: 3,
                speedRandom: 1.5,
                angle: 0,
                angleRandom: 360,
                startColour: [218, 0, 0, 1],
                startColourRandom: [160, 0, 15, 0],
                endColour: [35, 0, 0, 0],
                endColourRandom: [160, 0, 15, 0]
            },
            bloodCloud1: {
                duration: 50,
                maxParticles: 1000,
                size: 40,
                sizeRandom: 5,
                lifeSpan: 25,
                lifeSpanRandom: 7,
                emissionRate: 40,
                speed: 3,
                speedRandom: 1.5,
                angle: 0,
                angleRandom: 360,
                startColour: [18, 0, 0, 0.5],
                startColourRandom: [20, 0, 0, 0],
                endColour: [6, 0, 0, 0],
                endColourRandom: [0, 0, 0, 0]
            },
            bloodCloud2: {
                duration: 50,
                maxParticles: 350,
                size: 20,
                sizeRandom: 5,
                lifeSpan: 10,
                lifeSpanRandom: 5,
                emissionRate: 15,
                speed: 2,
                speedRandom: 0.5,
                angle: 0,
                angleRandom: 360,
                startColour: [0, 0, 0, 1],
                startColourRandom: [0, 0, 0, 0.5],
                endColour: [15, 0, 0, 0],
                endColourRandom: [0, 0, 0, 0]
            },
            bloodBolt: {
                angle: 0,
                angleRandom: 0.5,
                duration: 5,
                emissionRate: 5000,
                endColour: [0, 0, 0, 0],
                endColourRandom: [0, 0, 0, 0],
                gravity: {
                    x: 0.01,
                    y: 0.01
                },
                lifeSpan: 5,
                lifeSpanRandom: 0,
                maxParticles: 5000,
                size: 50,
                sizeRandom: 0,
                speed: 120,
                speedRandom: 121,
                startColour: [1, 0, 0, 0.5],
                startColourRandom: [10, 0, 0, 1]
            },
            compCardBlink: {
                angle: 0,
                angleRandom: 360,
                duration: 25,
                emissionRate: 300,
                endColour: [200, 0, 0, 0],
                endColourRandom: [10, 10, 10, 0],
                lifeSpan: 20,
                lifeSpanRandom: 5,
                maxParticles: 300,
                size: 35,
                sizeRandom: 10,
                speed: 12,
                speedRandom: 1,
                startColour: [150, 0, 0, 1],
                startColourRandom: [10, 10, 10, 0.5]
            }
        }
    // #endregion

    return {
        CheckInstall: checkInstall,

        GAMENAME,
        RO,
        TEXTCHARS, TEXTPAGEID,        
       
        NUMBERWORDS,
        ORDINALSUFFIX,
        COLORS,

        IMAGES, BGIMAGES,
        CHATHTML,
        MENUHTML,
        HANDOUTHTML,
        ROLLERHTML,
        HTML,
        STYLES,

        PIXELSPERSQUARE,
        SANDBOX, MAP,
        QUADRANTS,
        SHADOWOFFSETS,

        CHARACTIONS,

        IMAGEPROPS,
        TEXTPROPS,
        ATTRPROPS, 
        HANDOUTPROPS,

        MODEDEFAULTS,

        ATTRIBUTES, ATTRABBVS,
        SKILLS, SKILLABBVS,
        DISCIPLINES, DISCABBVS,
        TRACKERS,
        CLANS, SECTS,
        MISCATTRS,
        BLOODPOTENCY,
        RESONANCEODDS,

        CHARACTERS, ROLLERDICELIST, ROLLERBIGDICE,
        DISTRICTS, SITES,
        get LOCATIONS() { return Object.assign({}, DISTRICTS, SITES) },

        SOUNDVOLUME, SOUNDMODES, SOUNDSCORES,

        MVCVALS,
        FX
    }
})()

on("ready", () => {
    InitCommands.PreInitialization()
    C.CheckInstall()
    D.Log("CONSTANTS Ready!")
})
void MarkStop("C")