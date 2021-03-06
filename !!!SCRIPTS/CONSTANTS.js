void MarkStart("C");
// #region ESSENTIAL STARTUP CONSTANTS
// #region ... nesting
const GAMENAME = "VAMPIRE";
const SCRIPTNAME = "C";
const SCRIPTS = [
    "C",
    "D",
    "Listener",
    "Fuzzy",
    "Char",
    "Media",
    "Player",
    "Session",
    "Locations",
    "TimeTracker",
    "DragPads",
    "Roller",
    "Soundscape",
    "Complications",
    "Handouts",
    "Chat",
    "Tester",
    "InitCommands"
];

state = state || {};
state[GAMENAME] = state[GAMENAME] || {};
for (const scriptName of SCRIPTS)
    state[GAMENAME][scriptName] = state[GAMENAME][scriptName] || {};

// #endregion
// #endregion

const C = (() => {
    const RO = {
        get OT() {
            return state[GAMENAME];
        }
    };
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    // #region COMMON INITIALIZATION
    const STATE = {
        get REF() {
            return RO.OT[SCRIPTNAME];
        }
    };
    const VAL = (varList, funcName, isArray = false) => D.Validate(varList, funcName, SCRIPTNAME, isArray);
    const DB = (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME);
    const LOG = (msg, funcName) => D.Log(msg, funcName, SCRIPTNAME);
    const THROW = (msg, funcName, errObj) => D.ThrowError(msg, funcName, SCRIPTNAME, errObj);

    const checkInstall = () => {
        RO.OT[SCRIPTNAME] = RO.OT[SCRIPTNAME] || {};
    };
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    // #region CORE CONFIGURATION & BASIC REFERENCES
    const PAGES = {
        GAME: "-Lt3Ml6LYAIgYbWB6IVq",
        SplashPage: "-Lz0ONP6PmgW9T06kmiy"
    };
    const TEXTCHARS = "0123456789LMNQSOPRUWXTVZY-=●(+ABCFHDEGJIKalmnqsopruwxtvzyfhdegjikbc )?![]:;,.○~♠◌‡⅓°♦\"'`Ծ►/&—ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩⅪⅫⅬⅭⅮⅯ█_@";
    const NUMBERWORDS = {
        low: [
            "Zero",
            "One",
            "Two",
            "Three",
            "Four",
            "Five",
            "Six",
            "Seven",
            "Eight",
            "Nine",
            "Ten",
            "Eleven",
            "Twelve",
            "Thirteen",
            "Fourteen",
            "Fifteen",
            "Sixteen",
            "Seventeen",
            "Eighteen",
            "Nineteen",
            "Twenty"
        ],
        tens: ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"],
        tiers: [
            "",
            "Thousand",
            "Million",
            "Billion",
            "Trillion",
            "Quadrillion",
            "Quintillion",
            "Sextillion",
            "Septillion",
            "Octillion",
            "Nonillion",
            "Decillion",
            "Undecillion",
            "Duodecillion",
            "Tredecillion",
            "Quattuordecillion",
            "Quindecillion",
            "Sexdecillion",
            "Septendecillion",
            "Octodecillion",
            "Novemdecillion",
            "Vigintillion",
            "Unvigintillion",
            "Duovigintillion",
            "Trevigintillion",
            "Quattuorvigintillion",
            "Quinvigintillion",
            "Sexvigintillion",
            "Septenvigintillion",
            "Octovigintillion",
            "Novemvigintillion",
            "Trigintillion",
            "Untrigintillion",
            "Duotrigintillion",
            "Tretrigintillion",
            "Quattuortrigintillion"
        ]
    };
    const ORDINALSUFFIX = {
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
    };
    const COLORS = {
        white: "rgba(255, 255, 255, 1)",
        brightbrightgrey: "rgba(200, 200, 200, 1)",
        brightgrey: "rgba(175, 175, 175, 1)",
        grey: "rgba(130, 130, 130, 1)",
        midgrey: "rgba(100, 100, 100, 1)",
        darkgrey: "rgba(80, 80, 80, 1)",
        darkdarkgrey: "rgba(40, 40, 40, 1)",
        black: "rgba(0, 0, 0, 1)",

        halfwhite: "rgba(255,255,255,0.5)",
        fadedblack: "rgba(0, 0, 0, 0.2)",
        fadedgrey: "rgba(0, 0, 0, 0.1)",
        transparent: "rgba(0,0,0,0)",

        purered: "rgba(255, 0, 0, 1)",
        palered: "rgba(255, 175, 175, 1)",
        palepalered: "rgba(255, 200, 200, 1)",
        brightred: "rgba(255, 31, 34, 1)",
        lightred: "rgba(255, 60, 60, 1)",
        red: "rgba(209,0,3,1)",
        darkred: "rgba(132, 0, 2,1)",
        darkdarkred: "rgba(55, 0, 1, 1)",
        brightcrimson: "rgba(234, 9, 67, 1)",
        crimson: "rgba(160, 6, 46, 1)",
        darkcrimson: "rgba(86, 3, 25, 1)",

        fadedred: "rgba(255, 0, 0, 0.2)",

        palegold: "rgba( 255 , 220 , 180 , 1 )",
        brightgold: "rgba(255,223,0,1)",
        gold: "rgba(255,190,0,1)",
        midgold: "rgba(255,165,0,1)",
        darkgold: "rgba(167,97,0,1)",

        orange: "rgba(255,140,0,1)",
        orangered: "rgba(255,69,0,1)",
        lightorange: "rgba(255,165,0,1)",
        paleorange: "rgba(255, 202, 138,1)",

        yellow: "rgba(255,255,0,1)",
        khaki: "rgba(240,230,140,1)",
        tan: "rgba(255,216,164,1)",

        puregreen: "rgba(0, 255, 0, 1)",
        palegreen: "rgba(175, 255, 175, 1)",
        palepalegreen: "rgba(200, 255, 200, 1)",
        brightgreen: "rgba(35, 255, 35, 1)",
        green: "rgba(0, 200, 0, 1)",
        darkgreen: "rgba(0, 125, 0, 1)",

        palecyan: "rgba(161, 255, 255, 1)",
        cyan: "rgba(0, 255, 255, 1)",
        darkcyan: "rgba(0,150,150,1)",

        pureblue: "rgba(0,0,255,1)",
        paleblue: "rgba(175, 175, 255, 1)",
        palepaleblue: "rgba(200, 200, 255, 1)",
        brightblue: "rgba(150, 150, 255, 1)",
        blue: "rgba(100, 100, 255, 1)",
        darkblue: "rgba(50, 50, 150, 1)",

        magenta: "rgba(255,20,147,1)",
        palemagenta: "rgba(255,105,180,1)",
        palepalemagenta: "rgba(255,192,203,1)",
        darkmagenta: "rgba(199,21,133,1)",

        palepurple: "rgba(255, 175, 255, 1)",
        brightpurple: "rgba(200, 100, 200, 1)",
        purple: "rgba(150, 0, 150, 1)",
        darkpurple: "rgba(100, 0, 100, 1)"
    };
    const DELIM = "ɸ";
    // #endregion

    // #region ENUMERATORS
    const REPLY = {
        // For D.CommandMenu "!reply" Function
        KEEPOPEN: "keepOpen"
    };
    // #endregion

    // #region IMAGE DEFAULTS BACKGROUND IMAGES
    const IMAGES = {
        blank: "https://s3.amazonaws.com/files.d20.io/images/96594791/NKN-0QyHbcOXS2_o5X6Y2A/thumb.png?1573368252"
    };
    const BGIMAGES = {
        whiteMarble: "https://i.imgur.com/heiyoaB.jpg",
        blackMarble: "https://i.imgur.com/kBl8aTO.jpg",
        redMarble: "https://i.imgur.com/Dne2haq.jpg"
    };
    // #endregion

    // #region HTML & CHAT STYLES
    const CHATWIDTH = 267;
    const HTML = {
        // Block ==> Title, Header, ButtonLine ==> ButtonHeader, Button(label, API command, options = {})
        Block: (content, options = {}) => {
            const params = {
                color: options.color || COLORS.crimson,
                bgGradient: options.bgGradient || null,
                bgColor: options.bgColor || null,
                bgImage: options.bgImage || BGIMAGES.blackMarble,
                border: options.border || `4px outset ${options.color || COLORS.crimson}`,
                margin: options.margin || "-35px 0px -7px -42px",
                width: options.width || `${CHATWIDTH}px`,
                padding: options.padding || "0px",
                textAlign: options.textAlign || "center",
                custom: options.custom && _.flatten([options.custom])
            };
            return D.JSH(`<div style="
                    display: block;
                    margin: ${params.margin};
                    height: auto;
                    min-height: 30px;
                    min-width: ${CHATWIDTH}px;
                    font-size: 0px;
                    width: ${params.width};
                    ${(params.bgGradient && `background-image: linear-gradient(${params.bgGradient})`)
                        || (params.bgColor && `background-color: ${params.bgColor}`)
                        || `background: url('${params.bgImage}')`};
                    text-align: ${params.textAlign};
                    border: ${params.border};
                    padding: ${params.padding};
                    position: relative;
                    ${params.custom ? params.custom.join("`n") : ""}
            ">${_.flatten([content]).join("")}</div>`);
        },
        SubBlock: (content, options = {}) => {
            const params = {
                width: options.width || "100%",
                border: options.border || "none"
            };
            return content ? D.JSH(`<div style="
                    display: inline-block;
                    width: ${params.width};
                    font-size: 0px;
                    border: ${params.border};
                ">${_.flatten([content]).join("")}</div>`) : "";
        },
        Title: (content, options = {}) => {
            const params = {
                height: options.height || "45px",
                color: options.color || COLORS.brightred,
                margin: options.margin || "0px",
                fontFamily: options.fontFamily || "sexsmith", // "'Pathway Gothic One', sexsmith",
                fontSize: options.fontSize || "32px",
                lineHeight: options.lineHeight || "45px",
                bgColor: options.bgColor || "transparent",
                border: options.border || "none"
            };
            return content ? D.JSH(`<span style="
                    display: block;
                    margin: ${params.margin};
                    font-weight: bold;
                    color: ${params.color};
                    background-color: ${params.bgColor};
                    text-align: center;
                    width: auto;
                    font-family: ${params.fontFamily};
                    font-size: ${params.fontSize};
                    height: ${params.height};
                    line-height: ${params.lineHeight};
                    border: ${params.border};
                ">${_.flatten([content]).join("")}</span>`) : "";
        },
        Header: (content, options = {}) => {
            const params = {
                height: options.height || "20px",
                width: options.width || "auto",
                color: options.color || COLORS.black,
                bgColor: options.bgColor || COLORS.brightred,
                margin: options.margin || "0px",
                padding: options.padding || "0px",
                fontSize: options.fontSize || "16px",
                fontFamily: options.fontFamily || "Voltaire",
                fontVariant: options.fontVariant || "none",
                fontWeight: options.fontWeight || "bold",
                textTransform: options.textTransform || "none",
                border: options.border || `1px solid ${options.color || COLORS.brightred}`,
                textShadow: options.textShadow || "none",
                boxShadow: options.boxShadow || "none",
                textAlign: options.textAlign || "center",
                lineHeight: options.lineHeight || options.height || "20px"
            };
            return content ? D.JSH(`<span style="
                    display: block;
                    height: ${params.height};
                    line-height: ${params.lineHeight}; 
                    width: ${params.width};
                    margin: ${params.margin};
                    padding: ${params.padding};
                    box-sizing: border-box;
                    text-align: ${params.textAlign};
                    text-align-last: ${params.textAlign};
                    color: ${params.color};
                    font-family: ${params.fontFamily};
                    font-weight: ${params.fontWeight};
                    font-variant: ${params.fontVariant};
                    font-size: ${params.fontSize};
                    text-transform: ${params.textTransform};
                    background-color: ${params.bgColor};
                    border: ${params.border};
                    text-shadow: ${params.textShadow};
                    box-shadow: ${params.boxShadow};
                    overflow: hidden;
            ">${_.flatten([content]).join("<br>")}</span>`) : "";
        },
        SubHeader: (content, options = {}) => {
            const params = {
                height: options.height || "20px",
                width: options.width || "auto",
                color: options.color || COLORS.brightred,
                bgColor: options.bgColor || COLORS.fadedred,
                margin: options.margin || "0px 0px 2px 0px",
                padding: options.padding || "0px",
                fontSize: options.fontSize || "14px",
                fontFamily: options.fontFamily || "Voltaire",
                fontVariant: options.fontVariant || "none",
                fontWeight: options.fontWeight || "bold",
                border: options.border || "none; border-top: 1px solid red; border-bottom: 1px solid red;",
                textShadow:
                    options.textShadow
                    || "-1px -1px 2px #000, -1px -1px 2px #000, -1px -1px 2px #000, 1px 1px 2px #000, 1px 1px 2px #000, 1px 1px 2px #000",
                boxShadow: options.boxShadow || "none",
                textAlign: options.textAlign || "center",
                lineHeight: options.lineHeight || options.height || "20px"
            };
            return D.JSH(`<span style="
                    display: block;
                    height: ${params.height};
                    line-height: ${params.lineHeight}; 
                    width: ${params.width};
                    margin: ${params.margin};
                    padding: ${params.padding};
                    box-sizing: border-box;
                    text-align: ${params.textAlign};
                    text-align-last: ${params.textAlign};
                    color: ${params.color};
                    font-family: ${params.fontFamily};
                    font-weight: ${params.fontWeight};
                    font-variant: ${params.fontVariant};
                    font-size: ${params.fontSize};
                    background-color: ${params.bgColor};
                    border: ${params.border};
                    text-shadow: ${params.textShadow};
                    box-shadow: ${params.boxShadow};
            ">${_.flatten([content]).join("<br>")}</span>`);
        },
        Body: (content, options = {}) => {
            const params = {
                color: options.color || COLORS.brightred,
                width: options.width || "auto",
                height: options.height || "auto",
                bgColor: options.bgColor || "none",
                margin: options.margin || "4px 0px 4px 0px",
                padding: options.padding || "0px",
                fontFamily: options.fontFamily || "sexsmith", // "'Pathway Gothic One', sexsmith",
                fontSize: options.fontSize || "18px",
                fontWeight: options.fontWeight || "bold",
                textAlign: options.textAlign || "center",
                textShadow:
                    options.textShadow
                    || `0px 0px 1px ${COLORS.black}, 0px 0px 1px ${COLORS.black}, 0px 0px 1px ${COLORS.black}, 0px 0px 1px ${COLORS.black}, 0px 0px 1px ${COLORS.black}`,
                border: options.border || "none",
                boxShadow: options.boxShadow || "none",
                lineHeight: options.lineHeight || options.fontSize || "22px",
                custom: options.custom && _.flatten([options.custom])
            };
            return content ? D.JSH(`<span style="
                    display: block; 
                    height: ${params.height};
                    width: ${params.width}; 
                    line-height: ${params.lineHeight};
                    margin: ${params.margin};
                    padding: ${params.padding};
                    color: ${params.color};
                    background-color: ${params.bgColor};
                    font-size: ${params.fontSize};
                    text-align: ${params.textAlign};
                    font-family: ${params.fontFamily};
                    font-weight: ${params.fontWeight};
                    text-shadow: ${params.textShadow};
                    box-shadow: ${params.boxShadow};
                    border: ${params.border};                    
                    ${params.custom ? params.custom.join("`n") : ""}
                ">${_.flatten([content]).join("<br>")}</span>`) : "";
        },
        ClearBody: (content, options = {}) => {
            const params = Object.assign(
                {
                    bgColor: "none",
                    margin: "4px 0px 4px 2px",
                    fontFamily: "Voltaire",
                    fontSize: "16px",
                    lineHeight: "18px",
                    textAlign: "left",
                    textShadow: "none"
                },
                options
            );
            return C.HTML.Body(content, params);
        },
        Column: (content, options = {}) => {
            const params = {
                height: options.height || "100%",
                width: options.width || `${Math.floor(CHATWIDTH / 2)}px`,
                margin: options.margin || "0px",
                vertAlign: options.vertAlign || "top"
            };
            if (D.WatchList.includes("HTML-Column") && !options.isSilent)
                sendChat("HTML", `/w Storyteller ${C.HTML.CodeBlock({header: "Column", content: {options, params, content}})}`);
            return D.JSH(`<div style="
                    display: inline-block;
                    height: ${params.height};
                    width: ${params.width};
                    margin: ${params.margin};
                    font-size: 0px;
                    vertical-align: ${params.vertAlign};
                ">${_.flatten([content]).join("")}</div>`);
        },
        ButtonLine: (content, options = {}) => {
            const params = Object.assign({height: "14px", width: "100%", margin: "5px 0px 5px 0px", textAlign: "center"}, options);
            if (D.WatchList.includes("HTML-ButtonLine") && !options.isSilent)
                sendChat("HTML", `/w Storyteller ${C.HTML.CodeBlock({header: "ButtonLine", content: {options, params, content: D.JSC(content)}})}`);
            content = _.flatten([content]).map((x) => x.replace(/a\s*style.*?height[^;]*;/gu, `a style="height: ${params.height};`));
            if (D.WatchList.includes("HTML-ButtonLine") && !options.isSilent)
                sendChat(
                    "HTML",
                    `/w Storyteller ${C.HTML.CodeBlock({
                        header: "ButtonLine POST PROCESSING",
                        content: {options, params, content: D.JSC(content)}
                    })}`
                );
            return D.JSH(`<span style="  
                    height: ${params.height};
                    width: ${params.width};             
                    display: block;
                    text-align: ${params.textAlign};
                    margin: ${params.margin};
                ">${content.join("")}</span>`);
        },
        ButtonSubheader: (content, options = {}) => {
            const params = Object.assign(
                {
                    height: "12px",
                    width: `${Math.floor(CHATWIDTH * 0.15)}px`,
                    fontFamily: "Voltaire",
                    fontSize: "10px",
                    bgColor: "transparent",
                    color: COLORS.white,
                    margin: "0px 2px 0px 0px",
                    textAlign: "left",
                    textIndent: "3px",
                    padding: "0px 0px 0px 0px",
                    lineHeight: "14px"
                },
                options
            );
            if (D.WatchList.includes("HTML-ButtonSubheader") && !options.isSilent)
                sendChat("HTML", `/w Storyteller ${C.HTML.CodeBlock({header: "ButtonSubHeader", content: {options, params, content}})}`);
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
                ">${_.flatten([content]).join("")}</span>`);
        },
        Button: (name, command, options = {}) => {
            const params = Object.assign(
                {
                    height: "100%",
                    lineHeight: "16px",
                    width: `${Math.floor(CHATWIDTH * 0.25) - 2 - 2 - 6}px`,
                    fontFamily: "Voltaire",
                    margin: "0px 2px 0px 0px",
                    padding: "0px 0px 0px 0px",
                    fontSize: "10px",
                    bgColor: COLORS.brightred,
                    color: COLORS.white,
                    border: "1px solid white",
                    fontWeight: "normal",
                    textShadow: "none",
                    buttonPadding: "3px",
                    buttonTransform: "uppercase",
                    boxShadow: "none"
                },
                options
            );
            if (D.WatchList.includes("HTML-Button") && !options.isSilent)
                sendChat("HTML", `/w Storyteller ${C.HTML.CodeBlock({header: "Button", content: {options, params, content: {name, command}}})}`);
            return D.JSH(`<span style="   
                    height: ${params.height};
                    width: ${params.width};                 
                    display: inline-block;
                    margin: ${params.margin};
                    padding: ${params.padding};
                    border: ${params.border};
                    font-size: 0px;
                    overflow: hidden;
                "><a style="
                    height: 100%;
                    width: 100%;
                    display: inline-block;
                    border: none;
                    color: ${params.color};
                    background-color: ${params.bgColor};
                    font-size: ${params.fontSize};
                    line-height: ${params.lineHeight};
                    font-family: ${params.fontFamily};
                    text-transform: ${params.buttonTransform};
                    text-align: center;
                    padding: 0px;
                    font-weight: ${params.fontWeight};
                    text-shadow: ${params.textShadow};
                    box-shadow: ${params.boxShadow};
                " href="${command}">${name}</a></span>`);
        },
        ButtonSpacer: (width, isSilent = false) => {
            if (D.WatchList.includes("HTML-ButtonSpacer") && !isSilent)
                sendChat("HTML", `/w Storyteller ${C.HTML.CodeBlock({header: "ButtonSpacer", content: {width}})}`);
            return D.JSH(`<span style="   
                    height: 100%;
                    width: ${width || `${Math.floor(CHATWIDTH * 0.05)}px`};                 
                    display: inline-block;
                    margin: 0px;
                    padding: 0px;
                    font-size: 0px;
                "></span>`);
        },
        TrackerLine: (numClear, numSuper, numAgg, options = {}) => {
            const params = {
                height: options.height || "32px",
                lineHeight: options.lineHeight || options.height || "32px",
                margin: options.margin || "-8px 0px 7px 0px"
            };
            const boxes = {
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
            };
            if (D.WatchList.includes("HTML-TrackerLine") && !options.isSilent)
                sendChat(
                    "HTML",
                    `/w Storyteller ${C.HTML.CodeBlock({header: "TrackerLine", content: {numClear, numSuper, numAgg, options, boxes}})}`
                );
            return D.JSH(`<div style="
                            display: block;
                            width: 100%;
                            height: ${params.height};
                            line-height: ${params.lineHeight || params.height};
                            text-align: center;
                            text-align-last: center;
                            font-weight: bold;
                            margin: ${params.margin};"> ${boxes.aggravated.repeat(numAgg)
                + boxes.superficial.repeat(numSuper)
                + boxes.clear.repeat(numClear)}</div>`);
        },
        CodeBlock: (content, options = {}) => {
            /* if (VAL({list: content}))
                    content = D.KeyMapObj(content, undefined, v => D.JS(v).replace(/<br\s*\/?>/gu, "@@BR@@").replace(/</gu, "&lt;").replace(/>/gu, "&gt;").replace(/@@BR@@/gu, "<br>")) */
            const params = {
                fontSize: options.fontSize || "9px"
            };
            return C.HTML.Block(
                [
                    "header" in content ? C.HTML.Header(content.header, {isSilent: true}) : null,
                    D.JSH(`<pre style="
                            display: block;
                            font-size: ${params.fontSize};
                            line-height: 1.2em;
                            padding: 0px;
                        ">${D.JS(content)}</pre>`)
                ],
                {
                    textAlign: "left",
                    isSilent: true
                }
            );
        },
        MVC: {
            fullBox: (content) => D.JSH(`<div style="
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
                    ">${content}</div>`),
            title: (content) => D.JSH(`<div style="
                    display:block;
                    width: 120%;
                    margin: 10px -10%;
                    color: ${COLORS.white};
                    text-align: center;
                    font: normal normal 22px/22px Effloresce;
                    border-bottom: 1px ${COLORS.white} solid;
                    ">${content}</div>`),
            header: (content) => D.JSH(`<div style="
                    display:block; 
                    width: 120%; 
                    margin: 0px -10% 0px -10%;
                    color: ${COLORS.white}; 
                    text-align: center; 
                    font: normal normal 16px / 20px 'Bodoni SvtyTwo ITC TT'; 
                    ">${content}</div>`),
            headerL: (content) => D.JSH(`<div style="
                    display:inline-block; 
                    width: 120%; 
                    margin: 5% -10% 0px -10%;
                    color: ${COLORS.white}; 
                    text-align: center; 
                    font: normal normal 16px / 20px 'Bodoni SvtyTwo ITC TT';
                    ">${content}`),
            headerR: (content) => D.JSH(` ${content}</div>`),
            para: (content) => D.JSH(`<div style="
                    display:block; 
                    width: 103%; 
                    margin: 5px 0px;
                    color: ${COLORS.white}; 
                    text-align: left; 
                    font: normal normal 12px/14px Rockwell; 
                    ">${content}</div>`),
            paraStart: (content) => D.JSH(`<div style="
                    display:block; 
                    width: 100%; 
                    margin: 5px 0px;
                    color: ${COLORS.white}; 
                    text-align: left; 
                    font: normal normal 12px/14px Rockwell; 
                    ">${content}`),
            paraMid: (content) => D.JSH(` ${content} `),
            paraEnd: (content) => D.JSH(`${content}</div>`)
        }
    };
    const HTMLSTYLES = {
        // Block ==> Title, Header, ButtonLine ==> ButtonHeader, Button(label, API command, options = {})
        Block: (options = {}) => {
            const params = {
                color: options.color || COLORS.crimson,
                bgGradient: options.bgGradient || null,
                bgColor: options.bgColor || null,
                bgImage: options.bgImage || BGIMAGES.blackMarble,
                border: options.border || `4px outset ${options.color || COLORS.crimson}`,
                margin: options.margin || "-35px 0px -7px -42px",
                width: options.width || `${CHATWIDTH}px`,
                padding: options.padding || "0px",
                textAlign: options.textAlign || "center"
            };
            return `
            .userscript-Block {
                display: block;
                margin: ${params.margin};
                height: auto;
                min-height: 30px;
                min-width: ${CHATWIDTH}px;
                font-size: 0px;
                width: ${params.width};
                ${(params.bgGradient && `background-image: linear-gradient(${params.bgGradient})`)
                    || (params.bgColor && `background-color: ${params.bgColor}`)
                    || `background: url('${params.bgImage}')`};
                text-align: ${params.textAlign};
                border: ${params.border};
                padding: ${params.padding};
                position: relative;
            }`;
        },
        SubBlock: (options = {}) => {
            const params = {
                width: options.width || "100%",
                border: options.border || "none"
            };
            return `
            .SubBlock {
                display: inline-block;
                width: ${params.width};
                font-size: 0px;
                border: ${params.border};
            }`;
        },
        Title: (options = {}) => {
            const params = {
                height: options.height || "45px",
                color: options.color || COLORS.brightred,
                margin: options.margin || "0px",
                fontFamily: options.fontFamily || "sexsmith", // "'Pathway Gothic One', sexsmith",
                fontSize: options.fontSize || "32px",
                lineHeight: options.lineHeight || "45px",
                bgColor: options.bgColor || "transparent",
                border: options.border || "none"
            };
            return `
            .userscript-Title {
                display: block;
                margin: ${params.margin};
                font-weight: bold;
                color: ${params.color};
                background-color: ${params.bgColor};
                text-align: center;
                width: auto;
                font-family: ${params.fontFamily};
                font-size: ${params.fontSize};
                height: ${params.height};
                line-height: ${params.lineHeight};
                border: ${params.border};
            }`;
        },
        Header: (options = {}) => {
            const params = {
                height: options.height || "20px",
                width: options.width || "auto",
                color: options.color || COLORS.black,
                bgColor: options.bgColor || COLORS.brightred,
                margin: options.margin || "0px",
                padding: options.padding || "0px",
                fontSize: options.fontSize || "16px",
                fontFamily: options.fontFamily || "Voltaire",
                fontVariant: options.fontVariant || "none",
                fontWeight: options.fontWeight || "bold",
                border: options.border || `1px solid ${options.color || COLORS.brightred}`,
                textShadow: options.textShadow || "none",
                boxShadow: options.boxShadow || "none",
                textAlign: options.textAlign || "center",
                lineHeight: options.lineHeight || options.height || "20px"
            };
            return `
            .userscript-Header {
                display: block;
                height: ${params.height};
                line-height: ${params.lineHeight}; 
                width: ${params.width};
                margin: ${params.margin};
                padding: ${params.padding};
                box-sizing: border-box;
                text-align: ${params.textAlign};
                text-align-last: ${params.textAlign};
                color: ${params.color};
                font-family: ${params.fontFamily};
                font-weight: ${params.fontWeight};
                font-variant: ${params.fontVariant};
                font-size: ${params.fontSize};
                background-color: ${params.bgColor};
                border: ${params.border};
                text-shadow: ${params.textShadow};
                box-shadow: ${params.boxShadow};
                overflow: hidden;
            }`;
        },
        SubHeader: (options = {}) => {
            const params = {
                height: options.height || "20px",
                width: options.width || "auto",
                color: options.color || COLORS.brightred,
                bgColor: options.bgColor || COLORS.fadedred,
                margin: options.margin || "0px 0px 2px 0px",
                padding: options.padding || "0px",
                fontSize: options.fontSize || "14px",
                fontFamily: options.fontFamily || "Voltaire",
                fontVariant: options.fontVariant || "none",
                fontWeight: options.fontWeight || "bold",
                border: options.border || "none; border-top: 1px solid red; border-bottom: 1px solid red;",
                textShadow:
                    options.textShadow
                    || "-1px -1px 2px #000, -1px -1px 2px #000, -1px -1px 2px #000, 1px 1px 2px #000, 1px 1px 2px #000, 1px 1px 2px #000",
                boxShadow: options.boxShadow || "none",
                textAlign: options.textAlign || "center",
                lineHeight: options.lineHeight || options.height || "20px"
            };
            return `
            .userscript-SubHeader {
                display: block;
                height: ${params.height};
                line-height: ${params.lineHeight}; 
                width: ${params.width};
                margin: ${params.margin};
                padding: ${params.padding};
                box-sizing: border-box;
                text-align: ${params.textAlign};
                text-align-last: ${params.textAlign};
                color: ${params.color};
                font-family: ${params.fontFamily};
                font-weight: ${params.fontWeight};
                font-variant: ${params.fontVariant};
                font-size: ${params.fontSize};
                background-color: ${params.bgColor};
                border: ${params.border};
                text-shadow: ${params.textShadow};
                box-shadow: ${params.boxShadow};
            }`;
        },
        Body: (options = {}) => {
            const params = {
                color: options.color || COLORS.brightred,
                width: options.width || "auto",
                height: options.height || "auto",
                bgColor: options.bgColor || "none",
                margin: options.margin || "4px 0px 4px 0px",
                padding: options.padding || "0px",
                fontFamily: options.fontFamily || "sexsmith",
                fontSize: options.fontSize || "18px",
                fontWeight: options.fontWeight || "bold",
                textAlign: options.textAlign || "center",
                textShadow: options.textShadow
                    || `0px 0px 1px ${COLORS.black}, 0px 0px 1px ${COLORS.black}, 0px 0px 1px ${COLORS.black}, 0px 0px 1px ${COLORS.black}, 0px 0px 1px ${COLORS.black}`,
                border: options.border || "none",
                boxShadow: options.boxShadow || "none",
                lineHeight: options.lineHeight || options.fontSize || "22px"
            };
            return `
            .userscript-Body {
                display: block; 
                height: ${params.height};
                width: ${params.width}; 
                line-height: ${params.lineHeight};
                margin: ${params.margin};
                padding: ${params.padding};
                color: ${params.color};
                background-color: ${params.bgColor};
                font-size: ${params.fontSize};
                text-align: ${params.textAlign};
                font-family: ${params.fontFamily};
                font-weight: ${params.fontWeight};
                text-shadow: ${params.textShadow};
                box-shadow: ${params.boxShadow};
                border: ${params.border};
            }`;
        },
        ClearBody: (content, options = {}) => {
            const params = Object.assign(
                {
                    bgColor: "none",
                    margin: "4px 0px 4px 2px",
                    fontFamily: "Voltaire",
                    fontSize: "16px",
                    lineHeight: "18px",
                    textAlign: "left",
                    textShadow: "none"
                },
                options
            );
            return C.HTML.Body(content, params);
        },
        Column: (content, options = {}) => {
            const params = {
                height: options.height || "100%",
                width: options.width || `${Math.floor(CHATWIDTH / 2)}px`,
                margin: options.margin || "0px",
                vertAlign: options.vertAlign || "top"
            };
            if (D.WatchList.includes("HTML-Column") && !options.isSilent)
                sendChat("HTML", `/w Storyteller ${C.HTML.CodeBlock({header: "Column", content: {options, params, content}})}`);
            return D.JSH(`<div style="
                    display: inline-block;
                    height: ${params.height};
                    width: ${params.width};
                    margin: ${params.margin};
                    font-size: 0px;
                    vertical-align: ${params.vertAlign};
                ">${_.flatten([content]).join("")}</div>`);
        },
        ButtonLine: (content, options = {}) => {
            const params = Object.assign({height: "14px", width: "100%", margin: "5px 0px 5px 0px", textAlign: "center"}, options);
            if (D.WatchList.includes("HTML-ButtonLine") && !options.isSilent)
                sendChat("HTML", `/w Storyteller ${C.HTML.CodeBlock({header: "ButtonLine", content: {options, params, content: D.JSC(content)}})}`);
            content = _.flatten([content]).map((x) => x.replace(/a\s*style.*?height[^;]*;/gu, `a style="height: ${params.height};`));
            if (D.WatchList.includes("HTML-ButtonLine") && !options.isSilent)
                sendChat(
                    "HTML",
                    `/w Storyteller ${C.HTML.CodeBlock({
                        header: "ButtonLine POST PROCESSING",
                        content: {options, params, content: D.JSC(content)}
                    })}`
                );
            return D.JSH(`<span style="  
                    height: ${params.height};
                    width: ${params.width};             
                    display: block;
                    text-align: ${params.textAlign};
                    margin: ${params.margin};
                ">${content.join("")}</span>`);
        },
        ButtonSubheader: (content, options = {}) => {
            const params = Object.assign(
                {
                    height: "12px",
                    width: `${Math.floor(CHATWIDTH * 0.15)}px`,
                    fontFamily: "Voltaire",
                    fontSize: "10px",
                    bgColor: "transparent",
                    color: COLORS.white,
                    margin: "0px 2px 0px 0px",
                    textAlign: "left",
                    textIndent: "3px",
                    padding: "0px 0px 0px 0px",
                    lineHeight: "14px"
                },
                options
            );
            if (D.WatchList.includes("HTML-ButtonSubheader") && !options.isSilent)
                sendChat("HTML", `/w Storyteller ${C.HTML.CodeBlock({header: "ButtonSubHeader", content: {options, params, content}})}`);
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
                ">${_.flatten([content]).join("")}</span>`);
        },
        Button: (name, command, options = {}) => {
            const params = Object.assign(
                {
                    height: "100%",
                    lineHeight: "16px",
                    width: `${Math.floor(CHATWIDTH * 0.25) - 2 - 2 - 6}px`,
                    fontFamily: "Voltaire",
                    margin: "0px 2px 0px 0px",
                    padding: "0px 0px 0px 0px",
                    fontSize: "10px",
                    bgColor: COLORS.brightred,
                    color: COLORS.white,
                    border: "1px solid white",
                    fontWeight: "normal",
                    textShadow: "none",
                    buttonPadding: "3px",
                    buttonTransform: "uppercase",
                    boxShadow: "none"
                },
                options
            );
            if (D.WatchList.includes("HTML-Button") && !options.isSilent)
                sendChat("HTML", `/w Storyteller ${C.HTML.CodeBlock({header: "Button", content: {options, params, content: {name, command}}})}`);
            return D.JSH(`<span style="   
                    height: ${params.height};
                    width: ${params.width};                 
                    display: inline-block;
                    margin: ${params.margin};
                    padding: ${params.padding};
                    border: ${params.border};
                    font-size: 0px;
                    overflow: hidden;
                "><a style="
                    height: 100%;
                    width: 100%;
                    display: inline-block;
                    border: none;
                    color: ${params.color};
                    background-color: ${params.bgColor};
                    font-size: ${params.fontSize};
                    line-height: ${params.lineHeight};
                    font-family: ${params.fontFamily};
                    text-transform: ${params.buttonTransform};
                    text-align: center;
                    padding: 0px;
                    font-weight: ${params.fontWeight};
                    text-shadow: ${params.textShadow};
                    box-shadow: ${params.boxShadow};
                " href="${command}">${name}</a></span>`);
        },
        ButtonSpacer: (width, isSilent = false) => {
            if (D.WatchList.includes("HTML-ButtonSpacer") && !isSilent)
                sendChat("HTML", `/w Storyteller ${C.HTML.CodeBlock({header: "ButtonSpacer", content: {width}})}`);
            return D.JSH(`<span style="   
                    height: 100%;
                    width: ${width || `${Math.floor(CHATWIDTH * 0.05)}px`};                 
                    display: inline-block;
                    margin: 0px;
                    padding: 0px;
                    font-size: 0px;
                "></span>`);
        },
        TrackerLine: (numClear, numSuper, numAgg, options = {}) => {
            const params = {
                height: options.height || "32px",
                lineHeight: options.lineHeight || options.height || "32px",
                margin: options.margin || "-8px 0px 7px 0px"
            };
            const boxes = {
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
            };
            if (D.WatchList.includes("HTML-TrackerLine") && !options.isSilent)
                sendChat(
                    "HTML",
                    `/w Storyteller ${C.HTML.CodeBlock({header: "TrackerLine", content: {numClear, numSuper, numAgg, options, boxes}})}`
                );
            return D.JSH(`<div style="
                            display: block;
                            width: 100%;
                            height: ${params.height};
                            line-height: ${params.lineHeight || params.height};
                            text-align: center;
                            text-align-last: center;
                            font-weight: bold;
                            margin: ${params.margin};"> ${boxes.aggravated.repeat(numAgg)
                + boxes.superficial.repeat(numSuper)
                + boxes.clear.repeat(numClear)}</div>`);
        },
        CodeBlock: (content, options = {}) => {
            /* if (VAL({list: content}))
                    content = D.KeyMapObj(content, undefined, v => D.JS(v).replace(/<br\s*\/?>/gu, "@@BR@@").replace(/</gu, "&lt;").replace(/>/gu, "&gt;").replace(/@@BR@@/gu, "<br>")) */
            const params = {
                fontSize: options.fontSize || "9px"
            };
            return C.HTML.Block(
                [
                    "header" in content ? C.HTML.Header(content.header, {isSilent: true}) : null,
                    D.JSH(`<pre style="
                            display: block;
                            font-size: ${params.fontSize};
                            line-height: 1.2em;
                            padding: 0px;
                        ">${D.JS(content)}</pre>`)
                ],
                {
                    textAlign: "left",
                    isSilent: true
                }
            );
        }
    };
    const HANDOUTHTML = {
        EyesOnlyDoc: {
            Block: (content, options = {}) => {
                const params = {
                    bgURL: options.bgURL || "https://i.imgur.com/LsrLDoN.jpg"
                };
                return D.JSH(`<div style="
                        display: block;
                        width: 100%;
                        height: 800px;
                        background: url('${params.bgURL}') no-repeat top;
                        background-size: 100%;
                        "><div style="
                            display: inline-block;
                            height: 100%;
                            width: 449px;
                            margin-left: 63px;
                            margin-right: 30px;
                            margin-top: 185px;
                        ">${content}</div></div>`);
            },
            Line: (content, options = {}) => {
                const params = {
                    bgColor: options.bgColor || null,
                    border: options.border || "border: none;"
                };
                return D.JSH(`<div style="
                        display: inline-block;
                        height: auto;
                        width: 100%;
                        background-color: ${params.bgColor};
                        padding-left: 6px;
                        padding-top: 2px;
                        padding-bottom: 2px;
                        ${params.border}
                    ">${content}</div>`);
            },
            LineHeader: (content, options = {}) => {
                const params = {
                    vertAlign: options.vertAlign || "top"
                };
                return D.JSH(`<div style="
                        display: inline-block;
                        width: 75px;
                        height: auto;
                        font-family: QWERTYpe;
                        font-size: 11px;
                        text-align: left;
                        vertical-align: ${params.vertAlign};
                        line-height: 12px;
                        text-align-last: left;
                    ">${content}</div>`);
            },
            LineBody: (content, options = {}) => {
                const params = {
                    width: options.width || "370px",
                    fontFamily: options.fontFamily || "QWERTYpe",
                    fontSize: options.fontSize || "11px",
                    lineHeight: options.lineHeight || "12px",
                    textAlign: options.textAlign || "left",
                    vertAlign: options.vertAlign || "top",
                    margin: options.margin || "0px -5px 0px 5px"
                };
                return D.JSH(`<div style="
                        display: inline-block;
                        width: ${params.width};
                        height: auto;
                        margin: ${params.margin};
                        font-family: ${params.fontFamily};
                        font-size: ${params.fontSize};
                        line-height: ${params.lineHeight};
                        text-align: ${params.textAlign};
                        text-align-last: ${params.textAlign};
                        vertical-align: ${params.vertAlign};
                        ">${content}</div>`);
            },
            LineBodyRight: (content) => D.JSH(`<div style="
                        display: inline-block;
                        text-align: right;
                        text-align-last: right;
                        width: 100%;
                        margin: 0px 5px 5px -5px;
                    ">${content}</div>`)
        },
        DetailsSummaryDoc: {
            Table: (content) => D.JSH(`<table style="width: 100%; box-shadow: 7px 7px 7px rgba(0,0,0,0.5); border: 1px solid black; font-size: 0px; font-family: 'Carrois Gothic SC'; margin: 0px;"><tbody>${content}</tbody></table>`),
            HeaderRow: (content, bgColor = "rgba(20, 20, 20, 1)") => D.JSH(`<tr style="font-size: 14px; font-weight: bold; color: white; background-color: ${bgColor};">${content}</tr>`),
            Row: (content, bgColor) => D.JSH(`<tr style="vertical-align: top; border-bottom: 1px solid black; background-color: ${bgColor};">${content}</tr>`),
            SubtitleRow: (content) => D.JSH(`<tr style="vertical-align: top; border: none; background-color: white;">${content}</tr>`),
            Cell: (content, vertAlign = "top") => D.JSH(`<td style="padding: 2px 1px; white-space: nowrap; border-right: 1px solid black; line-height: 14px; vertical-align: ${vertAlign};">${content}</td>`),
            HeaderCell: (content, colSpan = 1) => D.JSH(`<td colspan="${colSpan}" style="padding: 2px 1px; white-space: nowrap; border: none; line-height: 14px;">${content}</td>`),
            SubtitleCell: (content, colSpan = 1) => D.JSH(`<td colspan="${colSpan}" style="border: none; font-family: 'Voltaire'; font-size: 17px; font-weight: bold; text-align: center; text-align-last: center; border: 1px solid transparent; overflow: hidden; padding: 0px; line-height: 18px; white-space: nowrap; vertical-align: bottom; height: 18px;">${content}</td>`),
            RowFirstCell: (content) => D.JSH(`<td style="line-height: 14px; font-weight: bold; font-size: 14px; padding: 2px 1px; white-space: nowrap; border-right: 1px solid black; width: 60px;">${content}</td>`),
            BigTextCell: (content) => D.JSH(`<td style="padding: 2px 1px; white-space: nowrap; border-right: 1px solid black; line-height: 14px; font-size: 14px;">${content}</td>`),
            LongTextCell: (content, numLines) => D.JSH(`<td style="padding: 2px 1px; white-space: nowrap; border-right: 1px solid black; line-height: 10px;"><div style="width: 100%; display: block; font-size: 10px; line-height: 10px; position:relative; height: ${numLines * 10}px; padding: 0px; white-space: normal;"><div style="width: 100%; display: block; font-size: 10px; line-height: 10px; position: absolute; overflow: hidden; width: 100%; padding: 1px 0px; margin: auto; top: 0; bottom:0; white-space: normal;">${content}</div></div></td>`),
            CellTitleSpan: (content) => D.JSH(`<span style="display: block; width: 100%; border-bottom: 1px solid rgb(200,200,200); font-family: 'Marcellus SC'; font-size: 14px; line-height: 12px; text-shadow: 0px 0px 1px black; padding: 0px 2px 2px 2px;">${content}</span>`),
            Headline: (content) => D.JSH(`<h2 style="font-family: 'Marcellus SC'; margin-bottom: -4px;" >${content}</h2>`),
            CellLine: (content, bgColor) => D.JSH(`<div style="display: block; font-size: 10px; line-height: 10px; padding: 2px; white-space: normal; background-color: ${bgColor};">${content}</div>`)
        },
        TraitSummaryDoc: {
            Table: (content) => D.JSH(`<table style="width: 100%; box-shadow: 7px 7px 7px rgba(0,0,0,0.5); border: 1px solid black; font-family: 'Carrois Gothic SC'; font-size: 0px;"><tbody>${content}</tbody></table>`),
            HeaderRow: (content, bgColor) => D.JSH(`<tr style="font-weight: bold; color: white; background-color: ${bgColor};">${content}</tr>`),
            Row: (content, bgColor) => D.JSH(`<tr style="background-color: ${bgColor};">${content}</tr>`),
            Cell: (content) => D.JSH(`<td style="line-height: 16px; padding: 1px; white-space: nowrap; border: none; border-right: 1px solid black;">${content}</td>`),
            HeaderCell: (content) => D.JSH(`<td style="line-height: 16px; padding: 0px 1px; white-space: nowrap; border: none; border-right: 1px solid black; font-size: 12px;">${content}</td>`),
            TrackerCell: (content) => D.JSH(`<td style="line-height: 12px; padding: 0px 2px; white-space: nowrap; border: none; border-right: 1px solid black; text-align: center; text-align-last: center; ">${content}</td>`),
            SymbolSpan: (content) => D.JSH(`<span style="display: inline-block; line-height: 12px;">${content}</span>`),
            SpecialtySpan: (content) => D.JSH(`<span style="display: inline-block; vertical-align: top; font-family: 'Economica'; font-size: 10px; padding-left: 3px; line-height: 8px; width: 70px; font-variant: small-caps; overflow-x: hidden; white-space: normal; text-shadow: 0px 0px 1px black;">${content}</span>`),
            PowerSpan: (content) => D.JSH(`<span style="display: block; vertical-align: top; font-family: 'Carrois Gothic SC'; font-size: 9px; padding-left: 3px; line-height: 12px; width: 100%; font-variant: small-caps; overflow-x: hidden; white-space: normal; text-shadow: 0px 0px 1px black; height: 12px;">${content}</span>`),
            Symbols: {
                DotFull: "<span style=\"display: inline-block; width: 8px; height: 8px; margin: 0px 1px 0px 0px; background: url('https://i.imgur.com/EdVCrGM.png') center; border: solid 1px black; border-radius: 50%; vertical-align: top; box-shadow: 1px 1px 2px black, 1px 1px 2px black;\">&nbsp;</span>",
                DotEmpty: "<span style=\"display: inline-block; width: 9px; height: 9px; margin: 1px 1px 0px 1px; background: rgba(150, 150, 150, 0.4); border-radius: 50%; vertical-align: top; box-shadow: -1px -1px 0px #000, 0px -1px 0px #999, 1px -1px 0px #aaa, 0px 0px 1px #000, 1px 0px 0px #fff, 0px 1px 0px #ccc, 1px 1px 0px #fff;\">&nbsp;</span>",
                OldDotFull: "<span style=\"display: inline-block; width: 9px; font-size: 18px; line-height: 12px; vertical-align: top;\">●</span>",
                OldDotEmpty: "<span style=\"display: inline-block; width: 9px; font-size: 18px; line-height: 12px; vertical-align: top; color: rgba(125, 125, 125, 1);\">○</span>",
                OldDotDisc: "<span style=\"display: inline-block; height: 14px; margin-right: 4px; width: 9px; font-size: 18px; line-height: 7px; vertical-align: top;\">●</span>",
                BoxAggro: "<span style=\"display: inline-block; vertical-align: top; width: 9px; height: 9px; line-height: 7px; margin: 1px; margin-bottom: 0px; margin-top: 3px; background-color: rgba(150, 150, 150, 0.4); box-shadow: -1px -1px 0px #333, -1px -1px 0px #333, -1px -1px 2px #666, 1px 1px 0px #fff, 1px 1px 0px #fff, 1px 1px 2px #ccc; background: url('https://i.imgur.com/3gqGRAd.png'); background-size: 100%;\"></span>",
                BoxSuper: "<span style=\"display: inline-block; vertical-align: top; width: 9px; height: 9px; line-height: 10px; margin: 1px; margin-bottom: 0px; margin-top: 3px; background-color: rgba(150, 150, 150, 0.4); box-shadow: -1px -1px 0px #333, -1px -1px 0px #333, -1px -1px 2px #666, 1px 1px 0px #fff, 1px 1px 0px #fff, 1px 1px 2px #ccc; background: url('https://i.imgur.com/e7l3Cx8.png'); background-size: 100%;\"></span>",
                BoxEmpty: "<span style=\"display: inline-block; vertical-align: top; width: 9px; height: 9px; line-height: 10px; margin: 1px; margin-bottom: 0px; margin-top: 3px; background-color: rgba(150, 150, 150, 0.4); box-shadow: -1px -1px 0px #333, -1px -1px 0px #333, -1px -1px 2px #666, 1px 1px 0px #fff, 1px 1px 0px #fff, 1px 1px 2px #ccc;\"></span>",
                BoxHumanity: "<span style=\"display: inline-block; vertical-align: top; width: 9px; height: 9px; line-height: 10px; margin: 1px; margin-bottom: 0px; margin-top: 3px; background-color: rgba(150, 150, 150, 0.4); background: url('https://i.imgur.com/9ZoSd0Z.jpg') no-repeat center; background-size: 120%; box-shadow: 1px 1px 0px #666, 1px 1px 0px #666, 1px 1px 2px #ccc, -1px -1px 0px #Fff, -1px -1px 0px #fff, -1px -1px 2px #fff;\"></span>",
                BoxStain: "<span style=\"display: inline-block; vertical-align: top; width: 9px; height: 9px; line-height: 10px; margin: 1px; margin-bottom: 0px; margin-top: 3px; background-color: rgba(150, 150, 150, 0.4); box-shadow: -1px -1px 0px #333, -1px -1px 0px #333, -1px -1px 2px #666, 1px 1px 0px #fff, 1px 1px 0px #fff, 1px 1px 2px #ccc; background: url('https://i.imgur.com/IVia33U.jpg') no-repeat center; background-size: 110%;\"></span>",
                BoxHumStain: "<span style=\"display: inline-block; vertical-align: top; width: 9px; height: 9px; line-height: 10px; margin: 1px; margin-bottom: 0px; margin-top: 3px; background-color: rgba(150, 150, 150, 0.4); box-shadow: -1px -1px 0px #333, -1px -1px 0px #333, -1px -1px 2px #666, 1px 1px 0px #fff, 1px 1px 0px #fff, 1px 1px 2px #ccc; margin-top: 3px; background: url('https://i.imgur.com/MmbObrq.jpg') no-repeat center; background-size: 110%;\"></span>",
                DotBPFull: "<span style=\"display: inline-block; width: 9px; line-height: 12px; vertical-align: top; background: rgba(150, 150, 150, 0.4); border: none; height: 9px; box-shadow: 1px 1px 2px black, 1px 1px 2px black; border-radius: 100%; margin: 2px 1px 1px 1px; background: url('https://imgsrv.roll20.net/?src=https%3A//i.imgur.com/U5ZW214.png') no-repeat center; background-size: 100%;\"></span>",
                DotBPEmpty: "<span style=\"display: inline-block; width: 9px; line-height: 12px; vertical-align: top; background: rgba(150, 150, 150, 0.4); border: none; height: 9px; box-shadow: -1px -1px 0px #000, 0px -1px 0px #999, 1px -1px 0px #aaa, 0px 0px 2px #000, 1px 0px 0px #fff, 0px 1px 0px #ccc, 1px 1px 0px #fff; border-radius: 100%; margin: 3px 1px 0px 1px;\"></span>"
            }
        },
        main: (content, hasIcon = false) => D.JSH(`<div style="
                display: block;
                width: 540px;
                background-color: ${C.COLORS.white};
                margin-top: ${hasIcon ? "-535px" : "0px"};
                margin-left: -30px;
            ">${content}</div>`),
        title: (content) => D.JSH(`<span style="
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
            ">${content}</span>`),
        subTitle: (content) => D.JSH(`<span style="
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
            ">${content}</span>`),
        bodyParagraph: (content, params = {}) => D.JSH(`<span style="
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
            ">${content}</span>`),
        smallNote: (content, color = COLORS.black) => D.JSH(`<span style="
                display:block; 
                width: 560px; 
                font-size: 10px;
                color: ${color};
                font-family: Goudy; 
                margin: 0px 20px;
                padding: 0px 3px;
                background-color: ${COLORS.fadedblack};
            ">${content}</span>`),
        projects: {
            charName: (content) => D.JSH(`<span style="
                    display: block; 
                    width: 600px;
                    font-size: 32px; 
                    color: ${COLORS.darkred}; 
                    font-family: Voltaire; 
                    font-variant: small-caps;
                ">${content}</span>`),
            goal: (content) => D.JSH(`<span style="
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
                ">${content}</span>`),
            tag: (content, color = COLORS.black) => D.JSH(`<span style="
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
                ">${content}</span>`),
            hook: (content) => D.JSH(`<span style="
                    display:inline-block; 
                    width: 530px; 
                    font-size: 12px; 
                    color: ${COLORS.black}; 
                    font-family: 'Alice Regular'; 
                    vertical-align: top; 
                    padding-top: 2px;
                    overflow: hidden;
                ">${content}</span>`),
            critSucc: (content) => D.JSH(`<span style="
                    display: inline-block; 
                    width: 300px; 
                    font-size: 20px; 
                    color: ${COLORS.purple}; 
                    font-family: Voltaire; 
                    font-weight: bold;
                ">${content}</span>`),
            succ: (content) => D.JSH(`<span style="
                    display: inline-block; 
                    width: 300px; 
                    font-size: 20px; 
                    color: ${COLORS.black}; 
                    font-family: goodfish; 
                    font-weight: bold;
                ">${content}</span>`),
            endDate: (content) => D.JSH(`<span style="
                    display: inline-block; 
                    width: 300px; 
                    font-size: 20px; 
                    color: ${COLORS.black}; 
                    font-family: Voltaire; 
                    font-weight: bold; 
                    text-align: right;
                ">${content}</span>`),
            daysLeft: (content) => D.JSH(`<span style="
                    display: inline-block; 
                    width: 600px; 
                    font-size: 14px; 
                    color: ${COLORS.black}; 
                    font-family: 'Alice Regular'; 
                    font-style: italic; 
                    text-align: right;
                ">${content}</span>`),
            stake: (content) => D.JSH(`<span style="
                    display: inline-block; 
                    width: 410px; 
                    font-family: 'Alice Regular';
                    height: 20px;
                    line-height: 20px;
                ">${content}</span>`),
            teamwork: (content) => D.JSH(`<span style="
                    display: inline-block; 
                    width: 50px; 
                    font-family: 'Alice Regular'; 
                    color: ${COLORS.blue}; 
                    font-weight: bold;
                    height: 20px;
                    line-height: 20px;
                    font-size: 16px;
                ">${content}</span>`)
        }
    };
    const ROLLERHTML = {
        fullBox: (content) => `<div style="display: block;width: 259px;padding: 5px 5px;margin-left: -42px;color: ${COLORS.white};font-family: 'Bodoni SvtyTwo ITC TT';font-size: 16px;border: 3px outset ${COLORS.darkred};background: url('http://imgsrv.roll20.net/?src=imgur.com/kBl8aTO.jpg') center no-repeat;position: relative;">${content}</div>`,
        spacer: (width) => `<span style="display: inline-block; width: ${width}px;"></span>`,
        rollerName: (content) => `<div style="display: block; width: 100%; font-variant: small-caps; font-size: 16px; height: 15px; padding-bottom: 5px; border-bottom: 1px solid ${COLORS.white}; overflow: hidden;">${content}</div>`,
        mainRoll: (content, subcontent) => `<div style="display: block; width: 100%; height: auto; padding: 3px 0px; border-bottom: 1px solid ${COLORS.white};"><span style="display: block; height: 16px; line-height: 16px; width: 100%; font-size: 14px; ">${content}</span><span style="display: block; height: 12px; line-height: 12px; width: 100%; margin-left: 24px; font-size: 10px; font-variant: italic;">${subcontent}</span></div>`,
        check: (content) => `<div style="display: block; width: 100%; height: auto; padding: 3px 0px; border-bottom: 1px solid ${COLORS.white};"><span style="display: block; height: 20px;  line-height: 20px; width: 100%; margin-left: 10%;">${content}</span></div>`,
        dicePool: (content) => `<div style="display: block; width: 100%; padding: 3px 0px; height: auto; "><span style="display: block; height: 16px; width: 100%; margin-left: 5%; line-height: 16px; font-size: 14px;">${content}</span></div>`,
        result: (content, subcontent, width, topMargin, subWidth) => `<div style="display: block; width: 100%; height: auto; "><div style="display: inline-block; width: ${width}px; margin-top:${topMargin}px; vertical-align: top; text-align: right; height: 100%; "><span style="display: inline-block; font-weight: normal; font-family: Verdana; text-shadow: none; height: 24px; line-height: 24px; vertical-align: middle; width: 40px; text-align: right; margin-right: 10px; font-size: 12px;">${content}</span></div><div style="display: inline-block ; width: ${subWidth}px ; height: auto; margin-bottom: 5px">${subcontent}</div></div>`,
        diceLine: (content) => `<div style="display: block ; width: 100% ; height: 24px ; line-height: 20px ; text-align: center ; font-weight: bold ; text-shadow: 0px 0px 2px ${COLORS.white} , 0px 0px 2px ${COLORS.white} , 0px 0px 2px ${COLORS.white} , 0px 0px 2px ${COLORS.white} ; ">${content}</div>`,
        smallResult: (content) => `<div style="display: block ; width: 100% ; height: 24px ; line-height: 20px ; text-align: center ; font-weight: bold ; text-shadow: 0px 0px 2px ${COLORS.white} , 0px 0px 2px ${COLORS.white} , 0px 0px 2px ${COLORS.white} , 0px 0px 2px ${COLORS.white} ; ">${content}</div>`,
        die: (dieVal) => {
            switch (dieVal) {
                case "BcL":
                    return D.JSH(
                        `<span style="margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: ${COLORS.white}; display: inline-block; font-size: 18px; font-family: 'Arial';">♦</span><span style="width: 10px; text-align: center; height: 20px; vertical-align: middle; color: ${COLORS.white}; display: inline-block; font-size: 16px; font-family: 'Arial'; margin-left: -5px; text-shadow: none; ">+</span>`
                    );
                case "BcR":
                    return D.JSH(
                        `<span style="width: 10px; text-align: center; height: 20px; vertical-align: middle; color: ${COLORS.white}; display: inline-block; font-size: 16px; font-family: 'Arial'; margin-left: -5px; margin-right: -3px; text-shadow: none; ">+</span><span style="margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: ${COLORS.white}; display: inline-block; font-size: 18px; font-family: 'Arial';">♦</span>`
                    );
                case "HcL":
                    return D.JSH(
                        `<span style="margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: ${COLORS.brightred}; display: inline-block; font-size: 18px; font-family: 'Arial';">♦</span><span style="width: 10px; text-align: center; height: 20px; vertical-align: middle; color: ${COLORS.brightred}; display: inline-block; font-size: 16px; font-family: 'Arial'; margin-left: -5px; text-shadow: none; ">+</span>`
                    );
                case "HcR":
                    return D.JSH(
                        `<span style="width: 10px; text-align: center; height: 20px; vertical-align: middle; color: ${COLORS.brightred}; display: inline-block; font-size: 16px; font-family: 'Arial'; margin-left: -5px; margin-right: -3px; text-shadow: none; ">+</span><span style="margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: ${COLORS.brightred}; display: inline-block; font-size: 18px; font-family: 'Arial';">♦</span>`
                    );
                case "Bc":
                    return D.JSH(
                        `<span style="margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: ${COLORS.white}; display: inline-block; font-size: 18px; font-family: 'Arial';">♦</span>`
                    );
                case "Hc":
                    return D.JSH(
                        `<span style="margin-right: 2px; width: 10px; text-align: center; height: 22px; vertical-align: middle; color: ${COLORS.brightred}; display: inline-block; font-size: 18px; font-family: 'Arial';">♦</span>`
                    );
                case "Bs":
                    return D.JSH(
                        `<span style="margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle; color: ${COLORS.white}; display: inline-block; font-size: 18px; font-family: 'Arial';">■</span>`
                    );
                case "Hs":
                    return D.JSH(
                        `<span style="margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle;color: ${COLORS.brightred}; display: inline-block; font-size: 18px; font-family: 'Arial';">■</span>`
                    );
                case "Bf":
                    return D.JSH(
                        `<span style="margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle;color: ${COLORS.white}; display: inline-block; font-size: 18px; font-family: 'Arial'; text-shadow: none;">■</span><span style="margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle;color: ${COLORS.black}; display: inline-block; margin-left: -12px; font-size: 18px; font-family: 'Arial'; margin-bottom: -4px; text-shadow: none;">×</span>`
                    );
                case "Hf":
                    return D.JSH(
                        `<span style="margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle;color: ${COLORS.brightred}; display: inline-block; font-size: 18px; font-family: 'Arial'; text-shadow: none;">■</span><span style="margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle;color: ${COLORS.black}; display: inline-block; margin-left: -12px; font-size: 18px; font-family: 'Arial'; margin-bottom: -4px; text-shadow: none;">×</span>`
                    );
                case "Hb":
                    return D.JSH(
                        `<span style="margin-right: 2px; width: 10px; text-align: center; color: ${COLORS.black}; height: 24px; vertical-align: middle; display: inline-block; font-size: 18px; font-family: 'Arial'; text-shadow: 0px 0px 2px ${COLORS.brightred}, 0px 0px 2px ${COLORS.brightred}, 0px 0px 2px ${COLORS.brightred}, 0px 0px 2px ${COLORS.brightred}, 0px 0px 2px ${COLORS.brightred}, 0px 0px 2px ${COLORS.brightred}, 0px 0px 2px ${COLORS.brightred}, 0px 0px 2px ${COLORS.brightred}, 0px 0px 2px ${COLORS.brightred}, 0px 0px 2px ${COLORS.brightred}, 0px 0px 2px ${COLORS.brightred}, 0px 0px 2px ${COLORS.brightred}; line-height: 22px;">♠</span>`
                    );
                default:
                    return D.JSH(
                        `<span style="margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle;color: ${COLORS.white}; display: inline-block; font-size: 18px; font-family: 'Arial'; text-shadow: none;">■</span><span style="margin-right: 2px; width: 10px; text-align: center; height: 24px; vertical-align: middle;color: ${COLORS.black}; display: inline-block; margin-left: -12px; font-size: 18px; font-family: 'Arial'; margin-bottom: -4px; text-shadow: none;">×</span>`
                    );
            }
        },
        margin: (content, width, topMargin) => D.JSH(
            `<div style="display: inline-block; width: ${width}px; vertical-align: top; margin-top:${topMargin}px; text-align: left; height: 100%; "><span style="display: inline-block; font-weight: normal; font-family: Verdana; text-shadow: none; height: 24px; line-height: 24px; vertical-align: middle; width: 40px; text-align: left; margin-left: 10px; font-size: 12px;">${content}</span></div>`
        ),
        outcome: (content, color) => D.JSH(
            `<div style="display: block; width: 100%; height: auto; line-height: 20px; text-align: center; font-weight: bold;"><span style="color: ${COLORS[
                color
            ] || COLORS.white}; display: block; width: 100%;  font-size: 22px; font-family: 'Bodoni SvtyTwo ITC TT';">${content}</span></div>`
        ),
        smallOutcome: (content, color) => D.JSH(
            `<div style="display: block; width: 100%; margin-top: 5px; height: 14px; line-height: 14px; text-align: center; font-weight: bold;"><span style="color: ${COLORS[
                color
            ] || COLORS.white}; display: block; width: 100%;  font-size: 14px; font-family: 'Bodoni SvtyTwo ITC TT';">${content}</span></div>`
        ),
        subOutcome: (content, color) => D.JSH(
            `<div style="display: block; width: 100%; height: 10px; line-height: 10px; text-align: center; font-weight: bold;"><span style="color: ${COLORS[
                color
            ] || COLORS.white}; display: block; width: 100%;  font-size: 12px; font-family: 'Bodoni SvtyTwo ITC TT';">${content}</span></div>`
        )
    };
    const STYLES = {
        whiteMarble: {
            block: {
                bgImage: BGIMAGES.whiteMarble,
                border: `4px outset ${COLORS.halfwhite}`
            },
            header: {
                color: COLORS.halfwhite,
                bgColor: COLORS.transparent,
                textShadow: "-1px -1px 0px #000, -1px -1px 0px #333, -1px -1px 0px #666, 1px 1px 0px #ddd, 1px 1px 0px #ddd, 1px 1px 0px #ccc",
                border: "none"
            },
            body: {
                color: COLORS.halfwhite,
                bgColor: COLORS.transparent,
                textShadow: "-1px -1px 0px #000, -1px -1px 0px #333, -1px -1px 0px #666, 1px 1px 0px #ddd, 1px 1px 0px #ddd, 1px 1px 0px #ccc",
                border: "none",
                fontSize: "16px",
                fontFamily: "Voltaire",
                fontWeight: "normal"
            },
            paragraph: {
                color: COLORS.halfwhite,
                bgColor: COLORS.transparent,
                textShadow: "-1px -1px 0px #000, -1px -1px 0px #333, -1px -1px 0px #666, 1px 1px 0px #ddd, 1px 1px 0px #ddd, 1px 1px 0px #ccc",
                border: "none",
                fontSize: "12px",
                fontFamily: "Voltaire",
                fontWeight: "normal",
                textAlign: "left",
                padding: "0px 3px",
                lineHeight: "16px"
            }
        },
        blackMarble: {
            block: {
                bgImage: BGIMAGES.blackMarble,
                border: `4px outset ${COLORS.darkgrey}`
            },
            header: {
                color: COLORS.brightred,
                bgColor: COLORS.transparent,
                textShadow: "none",
                border: "none"
            },
            body: {
                color: COLORS.brightred,
                bgColor: COLORS.transparent,
                textShadow: "none",
                border: "none",
                fontSize: "16px",
                fontFamily: "Voltaire",
                fontWeight: "normal"
            },
            paragraph: {
                color: COLORS.brightred,
                bgColor: COLORS.transparent,
                textShadow: "none",
                border: "none",
                fontSize: "12px",
                fontFamily: "Voltaire",
                fontWeight: "normal",
                textAlign: "left",
                padding: "0px 3px",
                lineHeight: "16px"
            }
        },
        redMarble: {
            block: {
                bgImage: BGIMAGES.redMarble,
                border: `4px outset ${COLORS.brightred}`
            },
            header: {
                color: COLORS.black,
                bgColor: COLORS.darkdarkred,
                textShadow: "0px 0px 10px #f00 , 0px 0px 10px #f00 , 0px 0px 5px #f00 , 0px 0px 5px #f00 , 0px 0px 10px #f00 , 0px 0px 10px #f00 , 0px 0px 5px #f00 , 0px 0px 5px #f00",
                border: "none; border-bottom: 4px solid rgb(150, 0, 0)",
                height: "30px",
                lineHeight: "30px",
                boxShadow: "inset 0px 0px 5px black, inset 0px 0px 5px black, inset 0px 0px 5px black, inset 0px 0px 5px black"
            },
            body: {
                color: COLORS.brightred,
                bgColor: COLORS.transparent,
                textShadow: "0px 0px 3px #000 , 0px 0px 3px #000 , 0px 0px 3px #000 , 0px 0px 3px #000 , 0px 0px 3px #000 , 0px 0px 3px #000",
                border: "none",
                fontSize: "14px",
                fontFamily: "Voltaire",
                fontWeight: "normal"
            }
        }
    };
    const STYLE = {
        resonance: {
            block: ["div", {
                display: "block",
                height: "auto",
                "min-height": "30px",
                width: `${CHATWIDTH}px`,
                "min-width": `${CHATWIDTH}px`,
                margin: "-35px 0px -7px -42px",
                padding: "0px",
                background: "url('https://i.imgur.com/kBl8aTO.jpg')",
                "font-size": "0px",
                "text-align": "center",
                border: "4px outset rgba(160, 6, 46, 1)",
                position: "relative"
            }],
            header: ["span", {
                display: "block",
                height: "auto",
                width: "auto",
                "line-height": "22px",
                padding: "0px",
                color: "black",
                "background-color": "rgba(255, 31, 34, 1)",
                "font-size": "18px",
                "text-align": "center",
                "font-family": "Voltaire",
                "font-weight": "bold",
                "box-shadow": "none",
                border: "none"
            }],
            detailBlock: ["div", {
                display: "block",
                width: "100%",
                padding: "0",
                margin: "0px 0px 0px 2px",
                color: "rgba(255, 31, 34, 1)",
                "font-family": "Oswald",
                "font-size": "14px",
                "line-height": "20px"
            }],
            detailHeader: ["span", {
                display: "inline-block",
                height: "10px",
                width: "60px",
                "margin-right": "5px",
                "text-align": "right",
                "vertical-align": "baseline"
            }],
            detailLine: ["span", {
                display: "inline-block",
                width: "auto",
                "vertical-align": "baseline"
            }],
            posResFlag: ["span", {
                display: "inline-block",
                height: "10px",
                width: "auto",
                padding: "3px",
                margin: "0 1px",
                "line-height": "10px",
                color: COLORS.black,
                "background-color": COLORS.purered,
                "box-shadow": `inset 0 0 1px ${COLORS.purered}, inset 0 0 1px ${COLORS.purered}, inset 0 0 1px ${COLORS.purered}`,
                "text-shadow": `0 0 1px ${COLORS.purered}, 0 0 1px ${COLORS.purered}, 0 0 1px ${COLORS.purered}`,
                "text-transform": "uppercase",
                "vertical-align": "baseline",
                "border-radius": "5px"
            }],
            negResFlag: ["span", {
                display: "inline-block",
                height: "10px",
                width: "auto",
                padding: "3px",
                margin: "0 1px",
                "line-height": "10px",
                color: COLORS.purered,
                "background-color": COLORS.black,
                "box-shadow": `inset 0 0 1px ${COLORS.purered}, inset 0 0 1px ${COLORS.purered}, inset 0 0 1px ${COLORS.purered}`,
                "text-shadow": `0 0 1px ${COLORS.black}, 0 0 1px ${COLORS.black}, 0 0 1px ${COLORS.black}`,
                "text-transform": "uppercase",
                "vertical-align": "baseline",
                "border-radius": "5px"
            }],
            whiteFlag: ["span", {
                display: "inline-block",
                height: "12px",
                width: "auto",
                padding: "3px",
                margin: "0 3px",
                "line-height": "10px",
                color: COLORS.white,
                "background-color": COLORS.black,
                "box-shadow": `inset 0 0 1px ${COLORS.white}, inset 0 0 1px ${COLORS.white}, inset 0 0 1px ${COLORS.white}`,
                "text-transform": "uppercase",
                "vertical-align": "baseline",
                "border-radius": "5px",
                "text-indent": "0px"
            }],
            strong: ["span", {
                color: "white"
            }],
            rollBlock: ["div", {
                display: "block",
                height: "20px",
                width: "100%",
                margin: "5px 0px",
                padding: "0 0 10px 0",
                "box-shadow": "inset 0 0 2px black",
                "text-align": "left"
            }],
            resSegment: ["span", {
                display: "inline-block",
                height: "20px",
                margin: "0 0 -9px 0",
                padding: "0px",
                color: "white",
                "font-family": "Oswald",
                "font-size": "10px",
                "line-height": "24px",
                "text-indent": "2px",
                "text-shadow": "0 0 1px black, 0 0 1px black, 0 0 1px black",
                "box-shadow": `inset 0 0 2px ${COLORS.purered}, inset 0 0 2px ${COLORS.purered}, inset 0 0 2px ${COLORS.purered}, inset 0 0 2px ${COLORS.purered}`,
                overflow: "hidden"
            }],
            resBaseline: ["span", {
                display: "inline-block",
                height: "4px",
                "margin-bottom": "5px",
                "background-color": "transparent",
                border: "2px solid rgb(255, 0, 0)",
                "border-top": "none",
                "box-sizing": "border-box",
                color: COLORS.red,
                "font-family": "Oswald",
                "font-size": "8px",
                "line-height": "8px",
                "padding-bottom": "5px",
                "text-indent": "1px",
                "font-weight": "bold"
            }],
            rollIndicator: ["span", {
                display: "block",
                position: "relative",
                height: "20px",
                width: "12px",
                "margin-top": "-50px",
                "margin-left": "-6px",
                color: "white",
                "font-family": "Voltaire",
                "font-size": "24px",
                "text-shadow": "0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black"
            }]
        }
    };
    // #endregion

    // #region SOUND EFFECT CONSTANTS
    const SOUNDVOLUME = {
        base: 50,
        MasterVolumeMult: 0.4,
        MULTS: {
            Inside: {
                base: 1,
                Thunder: 0.07,
                ScoreMain: 0.5,
                ScoreCasaLoma: 1,
                ScoreIntense: 0.5,
                ScoreCombat: 0.5,
                ScoreSplash: 1
            },
            Raining: {
                base: 1,
                Locations: 1.25,
                ScoreMain: 1.5,
                ScoreCasaLoma: 1.5,
                ScoreIntense: 1.5,
                ScoreCombat: 1.5
            }
        },
        Church: 60,
        CityChatter: 10,
        CityPark: 30,
        CitySuburb: 15,
        CityTraffic: 30,
        CityWalking: 40,
        EerieForest: 10,
        FastClock: 15,
        Fireplace: 30,
        Hospital: 35,
        LowWindAmbient: 30,
        RainHeavy: 50,
        RainLight: 50,
        ScoreCasaLoma: 15,
        ScoreMain: 20,
        ScoreSplash: 30,
        SoftHum: 100,
        SoftIndoor: 20,
        Thunder: 100,
        TinkleAmbient: 30,
        WindLow: 60,
        WindMax: 100,
        WindMed: 80,
        WindWinterLow: 28,
        WindWinterMax: 15,
        WindWinterMed: 30
    };
    const SOUNDMODES = {
        PlaylistDefault: {isRandom: false, isLooping: false, isPlayingAll: false, isTogether: false}
    };
    const SOUNDSCORES = {
        Active: ["ScoreMain", "ScoreIntense", "ScoreCombat"],
        Inactive: ["ScoreSplash"],
        Downtime: ["ScoreMain"],
        Daylighter: ["ScoreMain", "ScoreIntense", "ScoreCombat"],
        Spotlight: ["ScoreMain", "ScoreIntense", "ScoreCombat"],
        Complication: ["ScoreMain", "ScoreIntense", "ScoreCombat"]
    };
    // #endregion

    // #region SANDBOX CONFIGURATION & DEFINITIONS
    const PIXELSPERSQUARE = 10;
    const SANDBOX = {
        height: 1040,
        width: 1590,
        get top() {
            return this.height / 2;
        },
        get left() {
            return this.width / 2;
        }
    };
    const MAP = {
        height: 2040,
        width: SANDBOX.width,
        get top() {
            return this.height / 2 + SANDBOX.height;
        },
        get left() {
            return this.width / 2;
        }
    };

    const QUADRANTS = {
        TopLeft: {},
        BotLeft: {},
        TopRight: {},
        BotRight: {}
    };
    const SHADOWOFFSETS = {
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
    };

    // #endregion

    // #region CHARACTER ACTIONS
    const CHARACTIONS = _.mapObject(
        {
            "Health S": "!char dmg health superficial ?{Damage done (negative numbers heal)?}",
            "Health S+": "!char dmg health superficial+ ?{Damage done (negative numbers heal)?}",
            "Health A": "!char dmg health aggravated ?{Damage done (negative numbers heal)?}",
            "Will S": "!char dmg willpower superficial ?{Damage done (negative numbers heal)?}",
            "Will S+": "!char dmg willpower superficial+ ?{Damage done (negative numbers heal)?}",
            "Will A": "!char dmg willpower aggravated ?{Damage done (negative numbers heal)?}",
            "Will Ss": "!char dmg willpower social_superficial ?{Damage done (negative numbers heal)?}",
            "Will As": "!char dmg willpower social_aggravated ?{Damage done (negative numbers heal)?}"
        },
        (v) => v.replace(/\(/gu, "&#40;").replace(/\)/gu, "&#41;")
    );
    // #endregion

    // #region ROLL20 OBJECT PROPERTIES
    const SHEETATTRSJSON = `{"academics": 0,"academics_flag": 0,"academics_spec": "","academicsbonus_1": 0,"academicsbonus_10": 0,"academicsbonus_2": 0,"academicsbonus_3": 0,"academicsbonus_4": 0,"academicsbonus_5": 0,"academicsbonus_6": 0,"academicsbonus_7": 0,"academicsbonus_8": 0,"academicsbonus_9": 0,"academicsmod": 0,"academicsnull_1": 0,"academicsnull_2": 0,"academicsnull_3": 0,"academicsnull_4": 0,"academicsnull_5": 0,"ambition": "","animal_ken": 0,"animal_ken_flag": 0,"animal_ken_spec": "","animal_kenbonus_1": 0,"animal_kenbonus_10": 0,"animal_kenbonus_2": 0,"animal_kenbonus_3": 0,"animal_kenbonus_4": 0,"animal_kenbonus_5": 0,"animal_kenbonus_6": 0,"animal_kenbonus_7": 0,"animal_kenbonus_8": 0,"animal_kenbonus_9": 0,"animal_kenmod": 0,"animal_kennull_1": 0,"animal_kennull_2": 0,"animal_kennull_3": 0,"animal_kennull_4": 0,"animal_kennull_5": 0,"applybloodsurge": 0,"applydisc": 0,"applyopposed": 0,"applyresonance": 0,"applyspecialty": 0,"assets_carried": "","assets_other": "","assets_stashed": "","assets_vehicles": "","athletics": 0,"athletics_flag": 0,"athletics_spec": "","athleticsbonus_1": 0,"athleticsbonus_10": 0,"athleticsbonus_2": 0,"athleticsbonus_3": 0,"athleticsbonus_4": 0,"athleticsbonus_5": 0,"athleticsbonus_6": 0,"athleticsbonus_7": 0,"athleticsbonus_8": 0,"athleticsbonus_9": 0,"athleticsmod": 0,"athleticsnull_1": 0,"athleticsnull_2": 0,"athleticsnull_3": 0,"athleticsnull_4": 0,"athleticsnull_5": 0,"awareness": 0,"awareness_flag": 0,"awareness_spec": "","awarenessbonus_1": 0,"awarenessbonus_10": 0,"awarenessbonus_2": 0,"awarenessbonus_3": 0,"awarenessbonus_4": 0,"awarenessbonus_5": 0,"awarenessbonus_6": 0,"awarenessbonus_7": 0,"awarenessbonus_8": 0,"awarenessbonus_9": 0,"awarenessmod": 0,"awarenessnull_1": 0,"awarenessnull_2": 0,"awarenessnull_3": 0,"awarenessnull_4": 0,"awarenessnull_5": 0,"bane_text": "","bane_title": "","blood_potency": 0,"bloodline": "","bloodline_details": "","bloodline_detailstoggle": 0,"bloodline_exemplar": "","bloodline_title": "","bloodline_toggle": 0,"bloodline_vices": "","bloodline_virtues": "","bonus_bp": 0,"bonus_health": 0,"bonus_willpower": 0,"bottomdisplay": "","bp_baneseverity": 0,"bp_discbonus": 0,"bp_discbonustext": "","bp_mend": 0,"bp_mendtext": "","bp_rousereroll": 0,"bp_slakeanimal": 0,"bp_slakehuman": 0,"bp_slakekill": 0,"bp_slaketext": "","bp_surge": 0,"bp_surgetext": "","brawl": 0,"brawl_flag": 0,"brawl_spec": "","brawlbonus_1": 0,"brawlbonus_10": 0,"brawlbonus_2": 0,"brawlbonus_3": 0,"brawlbonus_4": 0,"brawlbonus_5": 0,"brawlbonus_6": 0,"brawlbonus_7": 0,"brawlbonus_8": 0,"brawlbonus_9": 0,"brawlmod": 0,"brawlnull_1": 0,"brawlnull_2": 0,"brawlnull_3": 0,"brawlnull_4": 0,"brawlnull_5": 0,"ceremonies_toggle": 0,"char_dob": "","char_dobdoe": "","char_doe": "","character_name": "","charflags": "","charisma": 1,"charisma_flag": 0,"charismabonus_1": 0,"charismabonus_10": 0,"charismabonus_2": 0,"charismabonus_3": 0,"charismabonus_4": 0,"charismabonus_5": 0,"charismabonus_6": 0,"charismabonus_7": 0,"charismabonus_8": 0,"charismabonus_9": 0,"charismamod": 0,"charismanull_1": 0,"charismanull_2": 0,"charismanull_3": 0,"charismanull_4": 0,"charismanull_5": 0,"clan": "","composure": 1,"composure_flag": 0,"composurebonus_1": 0,"composurebonus_10": 0,"composurebonus_2": 0,"composurebonus_3": 0,"composurebonus_4": 0,"composurebonus_5": 0,"composurebonus_6": 0,"composurebonus_7": 0,"composurebonus_8": 0,"composurebonus_9": 0,"composuremod": 0,"composurenull_1": 0,"composurenull_2": 0,"composurenull_3": 0,"composurenull_4": 0,"composurenull_5": 0,"compromise_1": "","compromise_2": "","compromise_3": "","compulsion": "","compulsion_toggle": 0,"conviction_1": "","conviction_2": "","conviction_3": "","craft": 0,"craft_flag": 0,"craft_spec": "","craftbonus_1": 0,"craftbonus_10": 0,"craftbonus_2": 0,"craftbonus_3": 0,"craftbonus_4": 0,"craftbonus_5": 0,"craftbonus_6": 0,"craftbonus_7": 0,"craftbonus_8": 0,"craftbonus_9": 0,"craftmod": 0,"craftnull_1": 0,"craftnull_2": 0,"craftnull_3": 0,"craftnull_4": 0,"craftnull_5": 0,"date_today": 1578628740000,"deathmarks": "","dexterity": 1,"dexterity_flag": 0,"dexteritybonus_1": 0,"dexteritybonus_10": 0,"dexteritybonus_2": 0,"dexteritybonus_3": 0,"dexteritybonus_4": 0,"dexteritybonus_5": 0,"dexteritybonus_6": 0,"dexteritybonus_7": 0,"dexteritybonus_8": 0,"dexteritybonus_9": 0,"dexteritymod": 0,"dexteritynull_1": 0,"dexteritynull_2": 0,"dexteritynull_3": 0,"dexteritynull_4": 0,"dexteritynull_5": 0,"disc1": 0,"disc1_flag": 0,"disc1_name": "","disc1_power_1": "","disc1_power_2": "","disc1_power_3": "","disc1_power_4": "","disc1_power_5": "","disc1_power_toggle": 0,"disc1_toggle": 0,"disc1bonus_1": 0,"disc1bonus_10": 0,"disc1bonus_2": 0,"disc1bonus_3": 0,"disc1bonus_4": 0,"disc1bonus_5": 0,"disc1bonus_6": 0,"disc1bonus_7": 0,"disc1bonus_8": 0,"disc1bonus_9": 0,"disc1mod": 0,"disc1null_1": 0,"disc1null_2": 0,"disc1null_3": 0,"disc1null_4": 0,"disc1null_5": 0,"disc2": 0,"disc2_flag": 0,"disc2_name": "","disc2_power_1": "","disc2_power_2": "","disc2_power_3": "","disc2_power_4": "","disc2_power_5": "","disc2_power_toggle": 0,"disc2_toggle": 0,"disc2bonus_1": 0,"disc2bonus_10": 0,"disc2bonus_2": 0,"disc2bonus_3": 0,"disc2bonus_4": 0,"disc2bonus_5": 0,"disc2bonus_6": 0,"disc2bonus_7": 0,"disc2bonus_8": 0,"disc2bonus_9": 0,"disc2mod": 0,"disc2null_1": 0,"disc2null_2": 0,"disc2null_3": 0,"disc2null_4": 0,"disc2null_5": 0,"disc3": 0,"disc3_flag": 0,"disc3_name": "","disc3_power_1": "","disc3_power_2": "","disc3_power_3": "","disc3_power_4": "","disc3_power_5": "","disc3_power_toggle": 0,"disc3_toggle": 0,"disc3bonus_1": 0,"disc3bonus_10": 0,"disc3bonus_2": 0,"disc3bonus_3": 0,"disc3bonus_4": 0,"disc3bonus_5": 0,"disc3bonus_6": 0,"disc3bonus_7": 0,"disc3bonus_8": 0,"disc3bonus_9": 0,"disc3mod": 0,"disc3null_1": 0,"disc3null_2": 0,"disc3null_3": 0,"disc3null_4": 0,"disc3null_5": 0,"distillation": "","domain_coterie": "","domain_haven": "","domain_hunt": "","domain_personal": "","domaincontrolbenefits": "","drive": 0,"drive_flag": 0,"drive_spec": "","drivebonus_1": 0,"drivebonus_10": 0,"drivebonus_2": 0,"drivebonus_3": 0,"drivebonus_4": 0,"drivebonus_5": 0,"drivebonus_6": 0,"drivebonus_7": 0,"drivebonus_8": 0,"drivebonus_9": 0,"drivemod": 0,"drivenull_1": 0,"drivenull_2": 0,"drivenull_3": 0,"drivenull_4": 0,"drivenull_5": 0,"dyscrasias": "","dyscrasias_toggle": 0,"effectchecks": "","etiquette": 0,"etiquette_flag": 0,"etiquette_spec": "","etiquettebonus_1": 0,"etiquettebonus_10": 0,"etiquettebonus_2": 0,"etiquettebonus_3": 0,"etiquettebonus_4": 0,"etiquettebonus_5": 0,"etiquettebonus_6": 0,"etiquettebonus_7": 0,"etiquettebonus_8": 0,"etiquettebonus_9": 0,"etiquettemod": 0,"etiquettenull_1": 0,"etiquettenull_2": 0,"etiquettenull_3": 0,"etiquettenull_4": 0,"etiquettenull_5": 0,"faction": "","finance": 0,"finance_flag": 0,"finance_spec": "","financebonus_1": 0,"financebonus_10": 0,"financebonus_2": 0,"financebonus_3": 0,"financebonus_4": 0,"financebonus_5": 0,"financebonus_6": 0,"financebonus_7": 0,"financebonus_8": 0,"financebonus_9": 0,"financemod": 0,"financenull_1": 0,"financenull_2": 0,"financenull_3": 0,"financenull_4": 0,"financenull_5": 0,"firearms": 0,"firearms_flag": 0,"firearms_spec": "","firearmsbonus_1": 0,"firearmsbonus_10": 0,"firearmsbonus_2": 0,"firearmsbonus_3": 0,"firearmsbonus_4": 0,"firearmsbonus_5": 0,"firearmsbonus_6": 0,"firearmsbonus_7": 0,"firearmsbonus_8": 0,"firearmsbonus_9": 0,"firearmsmod": 0,"firearmsnull_1": 0,"firearmsnull_2": 0,"firearmsnull_3": 0,"firearmsnull_4": 0,"firearmsnull_5": 0,"formulae_toggle": 0,"generation": "","health": 3,"health_1": 0,"health_10": 0,"health_11": 0,"health_12": 0,"health_13": 0,"health_14": 0,"health_15": 0,"health_2": 0,"health_3": 0,"health_4": 0,"health_5": 0,"health_6": 0,"health_7": 0,"health_8": 0,"health_9": 0,"health_admg": 0,"health_aggravated": 0,"health_bashing": 0,"health_impair_toggle": 0,"health_sdmg": 0,"hum_details": "","hum_negbullets": "","hum_negbullets_toggle": 0,"hum_neutralbullets": "","hum_neutralbullets_toggle": 0,"hum_posbullets": "","hum_posbullets_toggle": 0,"hum_title": "","hum_torportext": "","hum_torportext_toggle": 0,"humanity": 7,"humanity_1": 2,"humanity_10": 2,"humanity_2": 2,"humanity_3": 2,"humanity_4": 2,"humanity_5": 2,"humanity_6": 2,"humanity_7": 2,"humanity_8": 2,"humanity_9": 2,"humanity_impair_toggle": 0,"hunger": 1,"incap": "","insight": 0,"insight_flag": 0,"insight_spec": "","insightbonus_1": 0,"insightbonus_10": 0,"insightbonus_2": 0,"insightbonus_3": 0,"insightbonus_4": 0,"insightbonus_5": 0,"insightbonus_6": 0,"insightbonus_7": 0,"insightbonus_8": 0,"insightbonus_9": 0,"insightmod": 0,"insightnull_1": 0,"insightnull_2": 0,"insightnull_3": 0,"insightnull_4": 0,"insightnull_5": 0,"intelligence": 1,"intelligence_flag": 0,"intelligencebonus_1": 0,"intelligencebonus_10": 0,"intelligencebonus_2": 0,"intelligencebonus_3": 0,"intelligencebonus_4": 0,"intelligencebonus_5": 0,"intelligencebonus_6": 0,"intelligencebonus_7": 0,"intelligencebonus_8": 0,"intelligencebonus_9": 0,"intelligencemod": 0,"intelligencenull_1": 0,"intelligencenull_2": 0,"intelligencenull_3": 0,"intelligencenull_4": 0,"intelligencenull_5": 0,"intimidation": 0,"intimidation_flag": 0,"intimidation_spec": "","intimidationbonus_1": 0,"intimidationbonus_10": 0,"intimidationbonus_2": 0,"intimidationbonus_3": 0,"intimidationbonus_4": 0,"intimidationbonus_5": 0,"intimidationbonus_6": 0,"intimidationbonus_7": 0,"intimidationbonus_8": 0,"intimidationbonus_9": 0,"intimidationmod": 0,"intimidationnull_1": 0,"intimidationnull_2": 0,"intimidationnull_3": 0,"intimidationnull_4": 0,"intimidationnull_5": 0,"investigation": 0,"investigation_flag": 0,"investigation_spec": "","investigationbonus_1": 0,"investigationbonus_10": 0,"investigationbonus_2": 0,"investigationbonus_3": 0,"investigationbonus_4": 0,"investigationbonus_5": 0,"investigationbonus_6": 0,"investigationbonus_7": 0,"investigationbonus_8": 0,"investigationbonus_9": 0,"investigationmod": 0,"investigationnull_1": 0,"investigationnull_2": 0,"investigationnull_3": 0,"investigationnull_4": 0,"investigationnull_5": 0,"larceny": 0,"larceny_flag": 0,"larceny_spec": "","larcenybonus_1": 0,"larcenybonus_10": 0,"larcenybonus_2": 0,"larcenybonus_3": 0,"larcenybonus_4": 0,"larcenybonus_5": 0,"larcenybonus_6": 0,"larcenybonus_7": 0,"larcenybonus_8": 0,"larcenybonus_9": 0,"larcenymod": 0,"larcenynull_1": 0,"larcenynull_2": 0,"larcenynull_3": 0,"larcenynull_4": 0,"larcenynull_5": 0,"leadership": 0,"leadership_flag": 0,"leadership_spec": "","leadershipbonus_1": 0,"leadershipbonus_10": 0,"leadershipbonus_2": 0,"leadershipbonus_3": 0,"leadershipbonus_4": 0,"leadershipbonus_5": 0,"leadershipbonus_6": 0,"leadershipbonus_7": 0,"leadershipbonus_8": 0,"leadershipbonus_9": 0,"leadershipmod": 0,"leadershipnull_1": 0,"leadershipnull_2": 0,"leadershipnull_3": 0,"leadershipnull_4": 0,"leadershipnull_5": 0,"manipulation": 1,"manipulation_flag": 0,"manipulationbonus_1": 0,"manipulationbonus_10": 0,"manipulationbonus_2": 0,"manipulationbonus_3": 0,"manipulationbonus_4": 0,"manipulationbonus_5": 0,"manipulationbonus_6": 0,"manipulationbonus_7": 0,"manipulationbonus_8": 0,"manipulationbonus_9": 0,"manipulationmod": 0,"manipulationnull_1": 0,"manipulationnull_2": 0,"manipulationnull_3": 0,"manipulationnull_4": 0,"manipulationnull_5": 0,"marquee": "When the Sabbat assault a city, no strategy is more threatening to the Masquerade than their penchant formass-Embracing mortals, knocking them unconscious with a shovel before they frenzy, and throwing them intoan open grave from which they must dig themselves out — a process that invariably drives them insane.","marquee_lines_toggle": 3,"marquee_title": "Shovelheads","marquee_toggle": 1,"marquee_tracker": "10,63,47,50,28,8,3,24,1,12,51,20,19,65,30,4,40,54,71,45,70,73,23,43,15,53,2,25,16,72,37,36,62,38,14,57,60,55,35,21,64,32,33,9,22,42,48,34,58,59,31,46,67,6,27,17,29,61,0,13,66,44,69,7,5,11,18","mask": "","maskname": "","medicine": 0,"medicine_flag": 0,"medicine_spec": "","medicinebonus_1": 0,"medicinebonus_10": 0,"medicinebonus_2": 0,"medicinebonus_3": 0,"medicinebonus_4": 0,"medicinebonus_5": 0,"medicinebonus_6": 0,"medicinebonus_7": 0,"medicinebonus_8": 0,"medicinebonus_9": 0,"medicinemod": 0,"medicinenull_1": 0,"medicinenull_2": 0,"medicinenull_3": 0,"medicinenull_4": 0,"medicinenull_5": 0,"melee": 0,"melee_flag": 0,"melee_spec": "","meleebonus_1": 0,"meleebonus_10": 0,"meleebonus_2": 0,"meleebonus_3": 0,"meleebonus_4": 0,"meleebonus_5": 0,"meleebonus_6": 0,"meleebonus_7": 0,"meleebonus_8": 0,"meleebonus_9": 0,"meleemod": 0,"meleenull_1": 0,"meleenull_2": 0,"meleenull_3": 0,"meleenull_4": 0,"meleenull_5": 0,"mortal_ambition": "","mortal_history": "","npcbox_title": "","npcbox_toggle": 0,"npctoggle": 0,"occult": 0,"occult_flag": 0,"occult_spec": "","occultbonus_1": 0,"occultbonus_10": 0,"occultbonus_2": 0,"occultbonus_3": 0,"occultbonus_4": 0,"occultbonus_5": 0,"occultbonus_6": 0,"occultbonus_7": 0,"occultbonus_8": 0,"occultbonus_9": 0,"occultmod": 0,"occultnull_1": 0,"occultnull_2": 0,"occultnull_3": 0,"occultnull_4": 0,"occultnull_5": 0,"performance": 0,"performance_flag": 0,"performance_spec": "","performancebonus_1": 0,"performancebonus_10": 0,"performancebonus_2": 0,"performancebonus_3": 0,"performancebonus_4": 0,"performancebonus_5": 0,"performancebonus_6": 0,"performancebonus_7": 0,"performancebonus_8": 0,"performancebonus_9": 0,"performancemod": 0,"performancenull_1": 0,"performancenull_2": 0,"performancenull_3": 0,"performancenull_4": 0,"performancenull_5": 0,"persuasion": 0,"persuasion_flag": 0,"persuasion_spec": "","persuasionbonus_1": 0,"persuasionbonus_10": 0,"persuasionbonus_2": 0,"persuasionbonus_3": 0,"persuasionbonus_4": 0,"persuasionbonus_5": 0,"persuasionbonus_6": 0,"persuasionbonus_7": 0,"persuasionbonus_8": 0,"persuasionbonus_9": 0,"persuasionmod": 0,"persuasionnull_1": 0,"persuasionnull_2": 0,"persuasionnull_3": 0,"persuasionnull_4": 0,"persuasionnull_5": 0,"politics": 0,"politics_flag": 0,"politics_spec": "","politicsbonus_1": 0,"politicsbonus_10": 0,"politicsbonus_2": 0,"politicsbonus_3": 0,"politicsbonus_4": 0,"politicsbonus_5": 0,"politicsbonus_6": 0,"politicsbonus_7": 0,"politicsbonus_8": 0,"politicsbonus_9": 0,"politicsmod": 0,"politicsnull_1": 0,"politicsnull_2": 0,"politicsnull_3": 0,"politicsnull_4": 0,"politicsnull_5": 0,"predator": "","repstats": "","res_discs": "","resolve": 1,"resolve_flag": 0,"resolvebonus_1": 0,"resolvebonus_10": 0,"resolvebonus_2": 0,"resolvebonus_3": 0,"resolvebonus_4": 0,"resolvebonus_5": 0,"resolvebonus_6": 0,"resolvebonus_7": 0,"resolvebonus_8": 0,"resolvebonus_9": 0,"resolvemod": 0,"resolvenull_1": 0,"resolvenull_2": 0,"resolvenull_3": 0,"resolvenull_4": 0,"resolvenull_5": 0,"resonance": "None","rituals_toggle": 0,"rollarray": "","rolldiff": 0,"rolleffects": "","rollflagdisplay": "","rollmod": 0,"rollparams": "","rollpooldisplay": "","science": 0,"science_flag": 0,"science_spec": "","sciencebonus_1": 0,"sciencebonus_10": 0,"sciencebonus_2": 0,"sciencebonus_3": 0,"sciencebonus_4": 0,"sciencebonus_5": 0,"sciencebonus_6": 0,"sciencebonus_7": 0,"sciencebonus_8": 0,"sciencebonus_9": 0,"sciencemod": 0,"sciencenull_1": 0,"sciencenull_2": 0,"sciencenull_3": 0,"sciencenull_4": 0,"sciencenull_5": 0,"sheetworkertoggle": 0,"stains": 0,"stamina": 1,"stamina_flag": 0,"staminabonus_1": 0,"staminabonus_10": 0,"staminabonus_2": 0,"staminabonus_3": 0,"staminabonus_4": 0,"staminabonus_5": 0,"staminabonus_6": 0,"staminabonus_7": 0,"staminabonus_8": 0,"staminabonus_9": 0,"staminamod": 0,"staminanull_1": 0,"staminanull_2": 0,"staminanull_3": 0,"staminanull_4": 0,"staminanull_5": 0,"stealth": 0,"stealth_flag": 0,"stealth_spec": "","stealthbonus_1": 0,"stealthbonus_10": 0,"stealthbonus_2": 0,"stealthbonus_3": 0,"stealthbonus_4": 0,"stealthbonus_5": 0,"stealthbonus_6": 0,"stealthbonus_7": 0,"stealthbonus_8": 0,"stealthbonus_9": 0,"stealthmod": 0,"stealthnull_1": 0,"stealthnull_2": 0,"stealthnull_3": 0,"stealthnull_4": 0,"stealthnull_5": 0,"streetwise": 0,"streetwise_flag": 0,"streetwise_spec": "","streetwisebonus_1": 0,"streetwisebonus_10": 0,"streetwisebonus_2": 0,"streetwisebonus_3": 0,"streetwisebonus_4": 0,"streetwisebonus_5": 0,"streetwisebonus_6": 0,"streetwisebonus_7": 0,"streetwisebonus_8": 0,"streetwisebonus_9": 0,"streetwisemod": 0,"streetwisenull_1": 0,"streetwisenull_2": 0,"streetwisenull_3": 0,"streetwisenull_4": 0,"streetwisenull_5": 0,"strength": 1,"strength_flag": 0,"strengthbonus_1": 0,"strengthbonus_10": 0,"strengthbonus_2": 0,"strengthbonus_3": 0,"strengthbonus_4": 0,"strengthbonus_5": 0,"strengthbonus_6": 0,"strengthbonus_7": 0,"strengthbonus_8": 0,"strengthbonus_9": 0,"strengthmod": 0,"strengthnull_1": 0,"strengthnull_2": 0,"strengthnull_3": 0,"strengthnull_4": 0,"strengthnull_5": 0,"subterfuge": 0,"subterfuge_flag": 0,"subterfuge_spec": "","subterfugebonus_1": 0,"subterfugebonus_10": 0,"subterfugebonus_2": 0,"subterfugebonus_3": 0,"subterfugebonus_4": 0,"subterfugebonus_5": 0,"subterfugebonus_6": 0,"subterfugebonus_7": 0,"subterfugebonus_8": 0,"subterfugebonus_9": 0,"subterfugemod": 0,"subterfugenull_1": 0,"subterfugenull_2": 0,"subterfugenull_3": 0,"subterfugenull_4": 0,"subterfugenull_5": 0,"survival": 0,"survival_flag": 0,"survival_spec": "","survivalbonus_1": 0,"survivalbonus_10": 0,"survivalbonus_2": 0,"survivalbonus_3": 0,"survivalbonus_4": 0,"survivalbonus_5": 0,"survivalbonus_6": 0,"survivalbonus_7": 0,"survivalbonus_8": 0,"survivalbonus_9": 0,"survivalmod": 0,"survivalnull_1": 0,"survivalnull_2": 0,"survivalnull_3": 0,"survivalnull_4": 0,"survivalnull_5": 0,"tab_core": 1,"technology": 0,"technology_flag": 0,"technology_spec": "","technologybonus_1": 0,"technologybonus_10": 0,"technologybonus_2": 0,"technologybonus_3": 0,"technologybonus_4": 0,"technologybonus_5": 0,"technologybonus_6": 0,"technologybonus_7": 0,"technologybonus_8": 0,"technologybonus_9": 0,"technologymod": 0,"technologynull_1": 0,"technologynull_2": 0,"technologynull_3": 0,"technologynull_4": 0,"technologynull_5": 0,"tenet_1": "","tenet_2": "","tenet_3": "","tokencat": "","topdisplay": "","triggertimelinesort": 0,"willpower": 3,"willpower_1": 0,"willpower_10": 0,"willpower_2": 0,"willpower_3": 0,"willpower_4": 0,"willpower_5": 0,"willpower_6": 0,"willpower_7": 0,"willpower_8": 0,"willpower_9": 0,"willpower_admg": 0,"willpower_admg_social": 0,"willpower_admg_socialtotal": 0,"willpower_aggravated": 0,"willpower_bashing": 0,"willpower_impair_toggle": 0,"willpower_sdmg": 0,"willpower_sdmg_social": 0,"willpower_sdmg_socialtotal": 0,"willpower_social_toggle": 0,"wits": 1,"wits_flag": 0,"witsbonus_1": 0,"witsbonus_10": 0,"witsbonus_2": 0,"witsbonus_3": 0,"witsbonus_4": 0,"witsbonus_5": 0,"witsbonus_6": 0,"witsbonus_7": 0,"witsbonus_8": 0,"witsbonus_9": 0,"witsmod": 0,"witsnull_1": 0,"witsnull_2": 0,"witsnull_3": 0,"witsnull_4": 0,"witsnull_5": 0,"xp_earnedtotal": 0,"xp_summary": "","xpsorttrigger": 0}`; /* eslint-disable-line babel/quotes, quotes */
    const REPATTRSJSON = `{"advantage": ["advantage", "advantage_details", "advantage_flag", "advantage_name", "advantage_type", "advantagebonus_1", "advantagebonus_10", "advantagebonus_2", "advantagebonus_3", "advantagebonus_4", "advantagebonus_5", "advantagebonus_6", "advantagebonus_7", "advantagebonus_8", "advantagebonus_9", "advantagemod", "advantagenull_1", "advantagenull_2", "advantagenull_3", "advantagenull_4", "advantagenull_5"],"boonsowed": ["boonowed_details", "boonowed_to", "boonowed_type"],"boonsowing": ["boonowing_details", "boonowing_from", "boonowing_type"],"ceremonyleft": ["ceremony", "ceremony_name"],"ceremonymid": ["ceremony", "ceremony_name"],"ceremonyright": ["ceremony", "ceremony_name"],"desire": ["desire"],"discleft": ["disc", "disc_flag", "disc_name", "discmod", "discbonus_1", "discbonus_10", "discbonus_2", "discbonus_3", "discbonus_4", "discbonus_5", "discbonus_6", "discbonus_7", "discbonus_8", "discbonus_9", "discnull_1", "discnull_2", "discnull_3", "discnull_4", "discnull_5", "disc_power_1", "disc_power_2", "disc_power_3", "disc_power_4", "disc_power_5", "disc_power_toggle"],"discmid": ["disc", "disc_flag", "disc_name", "discmod", "discbonus_1", "discbonus_10", "discbonus_2", "discbonus_3", "discbonus_4", "discbonus_5", "discbonus_6", "discbonus_7", "discbonus_8", "discbonus_9", "discnull_1", "discnull_2", "discnull_3", "discnull_4", "discnull_5", "disc_power_1", "disc_power_2", "disc_power_3", "disc_power_4", "disc_power_5", "disc_power_toggle"],"discright": ["disc", "disc_flag", "disc_name", "discmod", "discbonus_1", "discbonus_10", "discbonus_2", "discbonus_3", "discbonus_4", "discbonus_5", "discbonus_6", "discbonus_7", "discbonus_8", "discbonus_9", "discnull_1", "discnull_2", "discnull_3", "discnull_4", "discnull_5", "disc_power_1", "disc_power_2", "disc_power_3", "disc_power_4", "disc_power_5", "disc_power_toggle"],"domaincontrolleft": ["district", "level"],"domaincontrolright": ["district", "level"],"earnedxp": ["sorttrigger", "xp_award", "xp_reason", "xp_session"],"earnedxpright": ["xp_award", "xp_reason", "xp_session"],"formulaleft": ["formula", "formula_name"],"formulamid": ["formula", "formula_name"],"formularight": ["formula", "formula_name"],"negadvantage": ["negadvantage", "negadvantage_details", "negadvantage_flag", "negadvantage_name", "negadvantagemod", "negadvantage_type", "negadvantagebonus_1", "negadvantagebonus_10", "negadvantagebonus_2", "negadvantagebonus_3", "negadvantagebonus_4", "negadvantagebonus_5", "negadvantagebonus_6", "negadvantagebonus_7", "negadvantagebonus_8", "negadvantagebonus_9", "negadvantagenull_1", "negadvantagenull_2", "negadvantagenull_3", "negadvantagenull_4", "negadvantagenull_5"],"project": ["archiveevent", "archiveevent_toggle", "archivememoriam", "archivememoriam_toggle", "archiveobjective", "archiveobjective_toggle", "archiveproject", "eventdate", "memoriamdate", "memoriamdiff", "memoriamresult", "memoriamrewards", "objectivedate", "projectdetails", "projectenddate", "projectforcedstakemod", "projectforcedstakemodline", "projectfull_toggle", "projectgoal", "projectinccounter", "projectincnum", "projectincunit", "projectlaunchdiff", "projectlaunchdiffmod", "projectlaunchmod", "projectlaunchresults", "projectlaunchresultsmargin", "projectmargin", "projectmargindisplay", "projectlaunchresultsummary", "projectlaunchroll_toggle", "projectlaunchrollparams", "projectlaunchtrait1", "projectlaunchtrait1_name", "projectlaunchtrait2", "projectlaunchtrait2_name", "projectrushpool", "projectrushrollparams", "projectrushstakelost", "projectrushstakelosttogo", "projectscope", "projectscope_name", "projectstake1", "projectstake1_name", "projectstake2", "projectstake2_name", "projectstake3", "projectstake3_name", "projectstakes_toggle", "projectstakesatrush", "projectstartdate", "projectteamwork1", "projectteamwork2", "projecttotalstake", "projectwasrushed", "schemetype", "schemetype_toggle", "schemetypebottom_toggle", "schemetypeevent_toggle", "schemetypemem_toggle", "schemetypeobj_toggle", "schemetypeproj_toggle", "schemetyperight_toggle"],"ritualleft": ["ritual", "ritual_name"],"ritualmid": ["ritual", "ritual_name"],"ritualright": ["ritual", "ritual_name"],"spentxp": ["xp_arrow_toggle", "xp_category", "xp_cost", "xp_initial", "xp_initial_toggle", "xp_new", "xp_new_toggle", "xp_spent_toggle", "xp_trait", "xp_trait_toggle"],"timeline": ["tlcategory", "tldetails", "tldotdisplay", "tlenddate", "tlsortby", "tlstartdate", "tlsummary", "tlthirdline", "tlthirdline_toggle", "tltitle"]}`; /* eslint-disable-line babel/quotes, quotes */
    const SHEETATTRS = JSON.parse(SHEETATTRSJSON);
    const REPATTRS = JSON.parse(REPATTRSJSON);
    const TRAITREPSECS = ["advantage", "negadvantage", "discleft", "discmid", "discright"];
    const IMAGEPROPS = [
        "imgsrc",
        "bar1_link",
        "bar2_link",
        "bar3_link",
        "represents",
        "left",
        "top",
        "width",
        "height",
        "rotation",
        "layer",
        "isdrawing",
        "flipv",
        "fliph",
        "name",
        "gmnotes",
        "controlledby",
        "bar1_value",
        "bar2_value",
        "bar3_value",
        "bar1_max",
        "bar2_max",
        "bar3_max",
        "aura1_radius",
        "aura2_radius",
        "tint_color",
        "statusmarkers",
        "showname",
        "showplayers_name",
        "showplayers_bar1",
        "showplayers_bar2",
        "showplayers_bar3",
        "showplayers_aura1",
        "showplayers_aura2",
        "playersedit_name",
        "playersedit_bar1",
        "playersedit_bar2",
        "playersedit_bar3",
        "playersedit_aura1",
        "playersedit_aura2",
        "light_radius",
        "light_dimradius",
        "light_otherplayers",
        "light_hassight",
        "light_angle",
        "light_losangle",
        "lastmove",
        "light_multiplier",
        "adv_fow_view_distance"
    ];
    const TEXTPROPS = ["top", "left", "width", "height", "text", "font_size", "rotation", "color", "font_family", "layer", "controlledby"];
    const ATTRPROPS = ["name", "current", "max"];
    const ATTRDISPLAYNAMES = {
        animal_ken: "Animal Ken",
        xp_earnedtotal: "Earned XP",
        blood_potency: "Blood Potency"
    };
    const HANDOUTPROPS = ["avatar", "name", "notes", "gmnotes", "inplayerjournals", "archived", "controlledby"];

    const MODEDEFAULTS = (obj, modeStatuses = {Active: true, Inactive: false, Daylighter: true, Downtime: null, Complications: null}) => {
        if (VAL({list: modeStatuses}, "MODEDEFAULTS")) {
            modeStatuses[Session.Mode] = true;
            if (VAL({object: obj}, "MODEDEFAULTS"))
                switch (obj.get("_type")) {
                    case "graphic": {
                        const name = obj.get("name");
                        if (name.includes("_Pad_")) {
                            const imgData = Media.GetImgData((DragPads.GetGraphic(obj) || {id: ""}).id);
                            if (VAL({list: imgData}))
                                return D.KeyMapObj(imgData.modes, null, (v) => Object.assign(_.omit(v, "lastState"), {isForcedState: null}));
                        }
                        if (name.includes("_PartnerPad_"))
                            return D.KeyMapObj(
                                Session.Modes,
                                (k, v) => v,
                                () => ({isForcedOn: false, isForcedState: null})
                            );
                        break;
                    }
                    case "text": {
                        const objData = Media.GetTextData(obj) || {name: "", shadowMaster: false};
                        if (objData.shadowMaster) {
                            const textData = Media.GetTextData(objData.shadowMaster);
                            if (VAL({list: textData}))
                                return textData.modes;
                        }
                        break;
                    }
                    // no default
                }
        }
        const modeStatus = {};
        _.each(modeStatuses, (v, k) => {
            modeStatus[k] = v;
        });
        return D.KeyMapObj(modeStatuses, null, (v) => {
            switch (v) {
                case true:
                    return {
                        isForcedOn: true,
                        isForcedState: null,
                        lastActive: true
                    };
                case false:
                    return {
                        isForcedOn: false,
                        isForcedState: null
                    };
                case null:
                    return {
                        isForcedOn: null,
                        isForcedState: null,
                        lastActive: true
                    };
                default:
                    return {
                        isForcedOn: true,
                        isForcedState: null,
                        lastActive: true
                    };
                // no default
            }
        });
    };
    // #endregion

    // #region VAMPIRE ATTRIBUTES, STATS & TRAITS
    const ATTRIBUTES = {
        physical: ["Strength", "Dexterity", "Stamina"],
        social: ["Charisma", "Manipulation", "Composure"],
        mental: ["Intelligence", "Wits", "Resolve"]
    };
    const SKILLS = {
        physical: ["Athletics", "Brawl", "Craft", "Drive", "Firearms", "Melee", "Larceny", "Stealth", "Survival"],
        social: ["Animal Ken", "Etiquette", "Insight", "Intimidation", "Leadership", "Performance", "Persuasion", "Streetwise", "Subterfuge"],
        mental: ["Academics", "Awareness", "Finance", "Investigation", "Medicine", "Occult", "Politics", "Science", "Technology"]
    };
    const ATTRABBVS = {
        STR: "strength",
        DEX: "dexterity",
        STA: "stamina",
        CHA: "charisma",
        MAN: "manipulation",
        COM: "composure",
        INT: "intelligence",
        WIT: "wits",
        RES: "resolve"
    };
    const SKILLABBVS = {
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
    };
    const DISCIPLINES = {
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
                prereqs: [["Obfuscate", 2]],
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
                prereqs: [["Dominate", 3]],
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
                prereqs: [["Auspex", 2]],
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
                prereqs: [["Obfuscate", 2]],
                sheetHTML: "",
                chatPROMPT: ""
            },
            ["Psychosomatic Agent"]: {
                discName: "Dominate",
                powerName: "Psychosomatic Agent",
                level: 2,
                prereqs: [["Obfuscate", 2]],
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
                prereqs: [["Animalism", 1]],
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
                prereqs: [["Auspex", 3]],
                sheetHTML: "",
                chatPROMPT: ""
            },
            ["Vanish"]: {
                discName: "Obfuscate",
                powerName: "Vanish",
                level: 4,
                prereqs: [["Obfuscate", 1, "Cloak of Shadows"]],
                sheetHTML: "",
                chatPROMPT: ""
            },
            ["Impostor Guise"]: {
                discName: "Obfuscate",
                powerName: "Impostor Guise",
                level: 5,
                prereqs: [["Obfuscate", 3, "Mask of a Thousand Faces"]],
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
                prereqs: [["Presence", 3]],
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
                prereqs: [["Protean", 1]],
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
                prereqs: [["Dominate", 1]],
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
                prereqs: [["Protean", 3, "Shapechange"]],
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
                prereqs: [["Potence", 2]],
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
    };
    const DISCABBVS = {
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
    };
    const TRACKERS = ["Willpower", "Health", "Humanity", "Blood Potency"];
    const CLANS = [
        "Brujah",
        "Gangrel",
        "Malkavian",
        "Nosferatu",
        "Toreador",
        "Tremere",
        "Ventrue",
        "Lasombra",
        "Tzimisce",
        "Banu Haqim",
        "Ministry",
        "Hecata",
        "Ravnos",
        "Salubri"
    ];
    const SECTS = ["Camarilla", "Anarch", "Sabbat", "Ashirra", "Second Inquisition", "Autarkis", "Independent", "Mortal"];
    const MISCATTRS = ["blood_potency_max", "bp_surge", "bp_discbonus", "bp_minhunger", "bp_slakekill", "hunger", "resonance"];
    const BLOODPOTENCY = [
        {bp_surge: 1, bp_discbonus: 0, bp_minhunger: 1},
        {bp_surge: 2, bp_discbonus: 0, bp_minhunger: 1},
        {bp_surge: 2, bp_discbonus: 1, bp_minhunger: 1},
        {bp_surge: 3, bp_discbonus: 1, bp_minhunger: 1},
        {bp_surge: 3, bp_discbonus: 2, bp_minhunger: 2},
        {bp_surge: 4, bp_discbonus: 2, bp_minhunger: 2},
        {bp_surge: 4, bp_discbonus: 3, bp_minhunger: 2},
        {bp_surge: 5, bp_discbonus: 3, bp_minhunger: 3},
        {bp_surge: 5, bp_discbonus: 4, bp_minhunger: 3},
        {bp_surge: 6, bp_discbonus: 4, bp_minhunger: 3},
        {bp_surge: 6, bp_discbonus: 5, bp_minhunger: 4}
    ];
    const RESONANCEODDS = {
        flavor: {
            norm: [[0.25, 0.25, 0.25, 0.25, 0, 0, 0]],
            pos: [
                [0.5, 0.1666, 0.1666, 0.1666, 0, 0, 0],
                [0.5, 0.125, 0.125, 0.125, 0.125, 0, 0]
            ],
            neg: [[0.3, 0.3, 0.3, 0.1, 0, 0, 0]],
            negpos: [
                [0.5, 0.2, 0.2, 0.1, 0, 0, 0],
                [0.5, 0.1333, 0.1333, 0.1333, 0.1, 0, 0]
            ],
            "2pos": [
                [0.7, 0.1, 0.1, 0.1, 0, 0, 0],
                [0.7, 0.075, 0.075, 0.075, 0.075, 0, 0]
            ],
            pospos: [
                [0.35, 0.35, 0.15, 0.15, 0, 0, 0],
                [0.35, 0.35, 0.1, 0.1, 0.1, 0, 0],
                [0.35, 0.35, 0.075, 0.075, 0.075, 0.075, 0]
            ],
            "2neg": [[0.3333, 0.3333, 0.3333, 0, 0, 0, 0]],
            negneg: [[0.4, 0.4, 0.1, 0.1, 0, 0, 0]],
            neg2pos: [
                [0.7, 0.15, 0.15, 0, 0, 0, 0],
                [0.7, 0.1, 0.1, 0.1, 0, 0, 0]
            ],
            "2negpos": [
                [0.5, 0.25, 0.25, 0, 0, 0, 0],
                [0.5, 0.1666, 0.1666, 0.1666, 0, 0, 0]
            ],
            negpospos: [
                [0.35, 0.35, 0.25, 0.05, 0, 0, 0],
                [0.35, 0.35, 0.125, 0.125, 0.05, 0, 0],
                [0.35, 0.35, 0.0833, 0.0833, 0.0833, 0.05, 0]
            ],
            negnegpos: [
                [0.5, 0.25, 0.125, 0.125, 0, 0, 0],
                [0.5, 0.15, 0.15, 0.1, 0.1, 0, 0]
            ]
        },
        intensity: {
            norm: [0.5, 0.3, 0.15, 0.05],
            doubleAcute: [0.45, 0.3, 0.15, 0.1]
        }
    };
    const RESONANCE = {
        flavor: {
            code: {
                c: "choleric",
                m: "melancholic",
                p: "phlegmatic",
                s: "sanguine",
                r: "primal",
                i: "ischemic",
                q: "mercurial"
            },
            common: ["choleric", "melancholic", "phlegmatic", "sanguine"],
            rare: ["primal", "ischemic", "mercurial"],
            initial: {common: 50, rare: 25},
            posMult: {common: 2, rare: 2},
            negMult: {common: 0.5, rare: 0.5},
            perMargin: {common: 50, rare: 20}
        },
        temperament: {
            code: {
                n: "negligible",
                f: "fleeting",
                i: "intense",
                a: "acute"
            },
            initial: {negligible: 500, fleeting: 300, intense: 160, acute: 40},
            perMargin: {negligible: -60, fleeting: -30, intense: 10, acute: 15}
        }
    };
    const TENETS = [
        "Take Care of Our Own",
        "Don't Kill Without Good Reason",
        "Keep the Beast Under Control"
    ];
    const MARQUEETIPS = {
        "Caine the First": [
            "Caine, son of Adam, was the First vampire.",
            "He sired the Second Generation, of which there were three: Enoch the Wise, Irad the Strong, and Zillah the Beautiful.",
            "All are said to have perished in the time before the Great Flood at the hands of their childer, the Antediluvians of the Third Generation."
        ],
        Masquerade: [
            "~ THE FIRST TRADITION ~",
            "\"Thou shall not reveal thy true nature to those not of the Blood.",
            "Doing so forfeits your claim to the Blood.\""
        ],
        Domain: ["~ THE SECOND TRADITION ~", "\"All others owe thee respect while in thy domain.", "None may challenge thy word while in it.\""],
        Progeny: ["~ THE THIRD TRADITION ~", "\"Thou shall only Sire another with the permission of thine Eldest.\""],
        Accounting: [
            "~ THE FOURTH TRADITION ~",
            "\"Those thou create are thine own children.",
            "Until thy Progeny shall be Released, their sins are thine to endure.\""
        ],
        Hospitality: [
            "~ THE FIFTH TRADITION ~",
            "\"When thou comest to a foreign city, thou shall present thyself to the Eldest who ruleth there.",
            "Without the word of acceptance, thou art nothing.\""
        ],
        Destruction: [
            "~ THE SIXTH TRADITION ~",
            "\"The right to destroy another of thy kind belongeth only to thine Eldest.",
            "Only the Eldest among thee shall call the Blood Hunt.\""
        ],
        "The Prince": [
            "The prince is the vampire who has claimed leadership over a city on behalf of the Camarilla. Only the",
            "prince possesses the authority of the Eldest, the right to Embrace, and ultimate dominion over the city.",
            "The Prince of Toronto is Osborne Lowell of Clan Ventrue, served by his seneschal Frederick Scheer, of Clan Tremere."
        ],
        "The Council of Primogen": [
            "The primogen are Camarilla officials that, at least in theory, serve as the representatives of their respective clans",
            "to the prince of a city under Camarilla rule. In general, the ruling vampires of the city value the primogen and their",
            "opinions; they are called in to consult on decisions; and their recommendations carry great weight."
        ],
        "The Baron": [
            "A baron is the Anarch Movement's equivalent to a Camarilla prince: the highest Anarch authority in a city. As the Anarchs believe",
            "in a system that awards merit, barons tend to vary in age and experience far more than princes, who are generally elders.",
            "The Baroness of Toronto is Monika Eulenberg of Clan Malkavian, marshalling over a half-dozen associated coteries. "
        ],
        "The Camarilla": [
            "The Camarilla is the largest of the vampiric sects. The Ivory Tower once presumed to represent and protect all vampires by",
            "enforcing and promulgating the Six Traditions, but it has shut its doors against outsiders in recent nights. Now, the Camarilla",
            "stands for six clans: Malkavian, Nosferatu, Toreador, Tremere, Ventrue, and recent inductees the Banu Haqim."
        ],
        "The Anarchs": [
            "The Anarchs are vampires who reject the status quo of Camarilla society. They especially resent the privileged status held by",
            "elders, and champion the rights of younger Kindred against an establishment that concentrates power among the very old. Unlike the",
            "Sabbat, the Anarchs loosely hold to the Traditions of the Camarilla, and are largely (if reluctantly) tolerated by the larger sect."
        ],
        "The Sabbat": [
            "The Sabbat is a loose organization of Kindred who reject the Traditions and the assumed humanity of the Camarilla, their bitter enemies.",
            "Though antitribu of any clan are welcome, Clans Lasombra and Tzimisce are the traditional fists and faith of the Sabbat — though there are",
            "rumors coming out of Chicago that the Clan of Night is defecting to the Camarilla en masse, to rule side-by-side with Clan Ventrue."
        ],
        "The Convention of Thorns": [
            "The Convention of Thorns is the founding document of the Camarilla. Signed",
            "in 1493 between Camarilla leaders, Anarchs, and Clan Assamite, the three-way",
            "peace agreement marked the end of the first Anarch Revolt."
        ],
        "The Convention of Prague": [
            "In 2012, at the Convention of Prague, several Camarilla leaders were killed by Brujah rebels during the clan's violent exit from the sect.",
            "Tonight, Clan Brujah is associated with the Anarchs, along with many of Clan Gangrel (another clan that recently left the Camarilla)."
        ],
        "High Clans": [
            "Before the Second Inquisition destroyed Clan Tremere's Prime Chantry in Vienna, the warlocks",
            "were one of the High Clans of the Camarilla, along with Clan Toreador and Clan Ventrue."
        ],
        "Low Clans": [
            "Clan Brujah and Clan Gangrel recently left the Camarilla to join the Anarch",
            "Movement, leaving Clan Malkavian and Clan Nosferatu as the two Low Clans of the Camarilla."
        ],
        Autarkis: [
            "An autarkis is a vampire who remains outside and apart from the larger vampire society of a given",
            "city, one who refuses to acknowledge the claim of a prince, baron, sect, clan, or other such",
            "entity. Autarkes tend to be old and powerful, to successfully flout the authority of the ruling sect."
        ],
        "The Inconnu": [
            "The Inconnu are an ancient and secretive sect of vampires, about whom virtually nothing is known.",
            "The only visible facet of the sect seems to be the Monitors, who watch vampiric events while avoiding direct interference."
        ],
        "Resonance & Dyscrasias": [
            "Strong emotions can give a mortal's blood \"resonance\". Drinking strongly-resonant blood empowers the use of associated disciplines; the",
            "strongest resonances (called \"dyscrasias\") confer even greater rewards. It is possible to influence resonances in mortals, cultivating",
            "their blood to your tastes. With a Project, you can change a resonance entirely, and even confer a dyscrasia upon the blood."
        ],
        "The Blood Hunt": [
            "If the prince calls a Blood Hunt (or the more-formal \"Lexitalionis\") against a",
            "vampire, all Kindred in the city are given permission to kill and even diablerize the convicted.",
            "It is one of the few times diablerie is sanctioned by the Camarilla."
        ],
        "The Blood Bond": [
            "Drinking another vampire's blood on three consecutive nights will forge a blood",
            "bond, a hollow mockery of subservient love that enslaves you to their will."
        ],
        Diablerie: [
            "Diablerie is the act of draining another vampire's blood and soul to gain a measure of their power.",
            "It is the only way to lower one's generation, but it is anathema to the Camarilla:",
            "Diablerists risk final death if their crimes are discovered."
        ],
        Ghouls: [
            "Feeding a mortal your blood transforms them into a ghoul. They will gain a measure of your vampiric",
            "power while retaining their humanity, and their addiction to your blood secures their loyalty."
        ],
        "Clan Brujah: The Learned Clan": [
            "Clan Brujah of the Anarchs descends from Troile of the Third Generation, childe of Irad the Strong, childe of Caine the First.",
            "Iconoclasts and rebels, they boldly fight the establishment to forge a new world."
        ],
        "Clan Gangrel: The Clan of the Beast": [
            "Clan Gangrel descends from Ennoia of the Third Generation, whose sire is unknown.",
            "Outcasts and wanderers, the Gangrel are closely tied to the animal aspect of the Beast",
            "— whether as a wolf in back alleys, or as a shark in the boardroom."
        ],
        "Clan Malkavian: The Moon Clan": [
            "Clan Malkavian of the Camarilla descends from Malkav of the Third Generation, childe of Enoch the Wise, childe of Caine the First.",
            "Cursed with vision and madness, the Malkavians are seers for whom prophecy and delusion are often indistinguishable."
        ],
        "Clan Nosferatu: The Clan of the Hidden": [
            "Clan Nosferatu of the Camarilla descends from Absimiliard of the Third Generation, childe of Zillah the Beautiful, childe of",
            "Caine the First. Cursed with deformity and ugliness, they watch and listen from the shadows and the sewers, building an ever-",
            "growing treasure-trove of secrets. This knowledge is highly prized, and comprises the largest part of their political capital."
        ],
        "Clan Toreador: The Clan of the Rose": [
            "Clan Toreador of the Camarilla descends from Arikel of the Third Generation, childe of Enoch the Wise, childe of Caine the First.",
            "Famous and infamous as a clan of artists and innovators, they are one of the bastions of the Camarilla, for",
            "their very survival depends on the facades of civility and grace on which the sect prides itself."
        ],
        "Clan Tremere: The Usurpers": [
            "Clan Tremere of the Camarilla descends from Tremere of the Third Generation, who diablerized and usurped Saulot, childe of Enoch",
            "the Wise, childe of Caine the First. Thus Clan Tremere replaced Clan Salubri as one of the thirteen Great Clans, and hunted them to",
            "extinction. Warlocks and blood sorcerers, the once-mighty Tremere recently suffered a devastating blow from the Second Inquisition."
        ],
        "Clan Ventrue: The Kingship Clan": [
            "Clan Ventrue of the Camarilla descends from Ventru of the Third Generation, childe of Irad the Strong, childe of Caine the First.",
            "Aristocrats and rulers, Clan Ventrue represents the establishment. They see themselves as the leaders of the Camarilla, and",
            "hold more positions of influence and power (among both mortals and Kindred) than any other clan."
        ],
        "Clan Lasombra: The Night Clan": [
            "Clan Lasombra of the Sabbat descends from Lasombra of the Third Generation, childe of Irad the Strong, childe of Caine the First.",
            "Predatory, elegant and inhuman manipulators of darkness and shadow, the leaders of the Sabbat",
            "are ruthless social Darwinists who believe in the worthy ruling, and the unworthy serving."
        ],
        "Clan Tzimisce: The Clan of Shapers": [
            "Clan Tzimisce (\"zih-ME-see\") of the Sabbat descends from an Antediluvian known only as \"the Eldest\", childe of Enoch the Wise, childe",
            "of Caine the First. Scholars, sorcerers and flesh-shapers, the Tzimisce are alien and inscrutable, proudly renouncing",
            "their humanity to focus on transcending the limitations of the vampiric state, by following their \"Path of Metamorphosis\"."
        ],
        "Clan Assamite: The Clan of the Hunt": [
            "Clan Assamite of the mountain fortress Alamut in the Middle East, known as the Banu Haqim, descends from Haqim of the Third",
            "generation, childe of Zillah the Beautiful, childe of Caine the First. Traditionally seen as dangerous assassins and diablerists, in",
            "truth they are guardians, scholars and warriors who seek to distance themselves from the Jyhad."
        ],
        "Clan Hecata: The Clan of Death": [
            "Clan Hecata of Venice descends from Augustus Giovanni, who diablerized and usurped Ashur, childe of Irad the Strong, childe",
            "of Caine the First. Thus Clan Hecata replaced Clan Cappadocian as one of the thirteen Great Clans, and hunted them to",
            "extinction. Incestuous necromancers with a penchant for organized crime, the Hecata rarely Embrace outside of their own mortal family."
        ],
        "Clan Setite: The Snake Clan": [
            "Clan Setite of the Anarchs, known tonight as the Ministry, descends from Setekh of the Third Generation, childe of Zillah the Beautiful,",
            "childe of Caine the First. Serpentine tempters, corruptors and purveyors of every vice, they are seen by many to embody the snake in the",
            "Garden of Eden. The Ministry only recently joined the Anarch Movement, after being shunned by the Camarilla."
        ],
        Gehenna: [
            "Foretold in the Book of Nod, a sacred text to many Kindred, Gehenna is the vampire Armageddon:",
            "It is prophesied to be the time when the Antediluvians will rise from their slumbers and devour their descendants."
        ],
        Jyhad: [
            "The Jyhad is said to be the \"eternal struggle\" for dominance between ancient methuselahs and the surviving Antediluvians.",
            "Believers claim it is a subtle and insidious conflict, one that is fought in the everynight interactions of",
            "younger vampires, most of whom are entirely unaware they are being controlled and used as pawns."
        ],
        Golconda: [
            "Golconda is a mystical state of enlightenment where a vampire is no longer subject to the",
            "Beast, or, alternatively, where the Beast and human aspects of a vampire are in balance.",
            "The secrets of achieving Golconda are known by very few; many more consider Golconda to be a myth."
        ],
        Frenzy: [
            "A frenzy occurs when the Beast seizes control of your body to act out your (its?) most primal instincts, regardless of the consequences.",
            "Frenzies are most-often the result of being overwhelmed by anger, by fear, or by hunger."
        ],
        "Of Cities: The Barrens": [
            "The Barrens are places in the city with a dearth of mortal prey, making them unsuitable for the Kindred.",
            "The Barrens often include industrial areas, abandoned districts, and the city outskirts."
        ],
        "Of Cities: The Rack": [
            "The Rack consists of the most favourable hunting grounds in the city, and thus the most valuable domains.",
            "Clubs, bars and other areas with a vibrant night life generally comprise the Rack."
        ],
        Dracula: [
            "Dracula, the vampire made famous by the mortal author Bram Stoker, is indeed real.",
            "An elder of Clan Tzimisce, the powers described in Stoker's novel are manifestations of Dracula's command",
            "of myriad disciplines, including Protean, Vicissitude, Dominate, Presence and Animalism."
        ],
        "The Beckoning": [
            "The Beckoning is a calling in the Blood, a cry for aid from the sleeping Antediluvians to guard their places of rest from the",
            "Sabbat, who search for them relentlessly in the Middle East. The stronger the Blood, the stronger the call: Only vampires of the ninth",
            "generation and lower feel it at all. Many continue to resist the summons; many others have found it impossible to ignore."
        ],
        "Of Cities: Elysium": [
            "Elysium is any place declared as such by the prince, wherein the safety of all guests is guaranteed and violence is forbidden.",
            "Until very recently, Elysiums served as neutral ground for all Kindred. Tonight, however, the Camarilla has made it clear that only",
            "those loyal to the Ivory Tower should expect the protection of its laws."
        ],
        Torpor: [
            "Torpor is a long state of dreamless slumber, during which a Kindred quite literally sleeps like the dead.",
            "Serious injury or hunger can force a vampire into torpor, as can a stake that punctures the heart.",
            "The oldest vampires enter torpor voluntarily, sleeping away the centuries for reasons unknown."
        ],
        "The Blush of Life": [
            "With effort, Kindred can force their hearts to beat and their cheeks to flush for a time, assuming the appearance of a living mortal.",
            "Called \"the Blush of Life\", it is an imperfect disguise that grows ever more difficult to achieve as one loses touch with humanity."
        ],
        "Mechanic: Memoriam": [
            "If you want to assert that you did something in the past, you can call for a \"Memoriam\".",
            "During Memoriam, we play out a quick flashback scene to see how things really turned out.",
            "If you are successful, you retroactively gain the benefits of your past efforts in the present."
        ],
        "The Prophecy of Gehenna": [
            "\"You will know these last times by the Time of Thin Blood, which will mark vampires that cannot beget.",
            "You will know them by the Clanless, who will come to rule.\"",
            " — The Book of Nod"
        ],
        "The Second Inquisition": [
            "The Second Inquisition is the name given to the current mortal pogrom against the Kindred: a global effort by covert government",
            "agencies aided by a secret militant wing of the Vatican to erase vampires from existence. It began when a Camarilla plot to turn mortal",
            "authorities against their enemies backfired, revealing the existence of the Kindred to governments around the world."
        ],
        "The Week of Nightmares": [
            "The Week of Nightmares occurred in the summer of 1999, when the Ravnos Antediluvian Zapathasura awakened from torpor and, after",
            "a long and bloody conflict, was defeated by a powerful alliance of vampires, werewolves and mages. At the moment of his",
            "death, Zapathasura unleashed a psychic scream that drove every Ravnos into a cannibalistic frenzy, nearly destroying the entire clan."
        ],
        "Clan Ravnos: The Wanderer Clan": [
            "Clan Ravnos of India descends from Zapathasura of the Third Generation, whose sire is unknown.",
            "Nomads, tricksters and performers, they have long been villified as con-artists and deceivers. Armed",
            "with unparalleled powers of illusion, the very senses turn traitor in the presence of a Ravnos."
        ],
        "Enoch the Wise": [
            "Enoch the Wise was Caine's first childe, and the eldest member of the Second Generation.",
            "Brilliant and insightful, the Antediluvians he sired inherited the gift of Auspex, as did the clans they founded:",
            "Clan Malkavian; Clan Salubri, who would be usurped by the Tremere; Clan Toreador; and Clan Tzimisce."
        ],
        "Zillah the Beautiful": [
            "Zillah the Beautiful was Caine's second childe, and the middle sibling of the Second Generation.",
            "A master of perception and disguise, the Antediluvians she sired inherited the gift of Obfuscate, as did the clans they founded:",
            "Clan Nosferatu; Clan Assamite, known tonight as the Banu Haqim; and Clan Setite, known tonight as the Ministry."
        ],
        "Irad the Strong": [
            "Irad the Strong was Caine's third childe, and the youngest member of the Second Generation.",
            "A man of strong will and great ambition, the Antediluvians he sired inherited the gift of Dominate, as did the clans they founded:",
            "Clan Brujah, who rejected the Gift; Clan Cappadocian, who would be usurped by the Hecata; Clan Lasombra; and Clan Ventrue."
        ],
        "The Pyramid Falls": [
            "Until recently, Clan Tremere was the most rigidly organized of the thirteen Great Clans: every warlock was bound by Blood to the strict",
            "hierarchy of the Pyramid. But in recent nights, the Blood of Clan Tremere has lost its power to command obedience. The Pyramid",
            "has shattered, dividing the clan into three factions: House Tremere, House Goratrix, and House Carna."
        ],
        Shovelheads: [
            "When the Sabbat assault a city, no strategy is more threatening to the Masquerade than their penchant for",
            "mass-Embracing mortals, knocking them unconscious with a shovel before they frenzy, and throwing them into",
            "an open grave from which they must dig themselves out — a process that invariably drives them insane."
        ],
        "The Book of Nod": [
            "An ancient text hailed as scripture by some and as fraudulent nonsense by others, the Book of Nod is the oldest text",
            "that mentions vampires as they exist tonight. It begins with the Testament of Caine, tells of his relationship with the blood-",
            "witch Lillith, describes the First City and the creation of the thirteen Great Clans, and ends with the doomsday Prophecy of Gehenna."
        ],
        "The Sacking of Carthage": [
            "The ancient city of Carthage was Clan Brujah's greatest achievement: strong, prosperous, idealistic, and entirely theirs...",
            "until the armies of Ventrue-held Rome destroyed it utterly, salting the earth so Carthage could never rise again. Clan Brujah",
            "has never forgotten the blood on Clan Ventrue's hands: The two clans have despised each other ever since."
        ],
        "Clan Rivalries: Ventrue & Lasombra": [
            "The Ventrue and the Lasombra are as alike as they are polar opposites: As the Ventrue rule the Camarilla, the Lasombra rule the",
            "Sabbat. Both Embrace the capable and the ambitious; both prize power above all else; and both consider themselves the true masters",
            "of Dominate. Their hatred for each other is matched only by their grudging respect for their rival kings among the Kindred."
        ],
        "Clan Rivalries: Brujah & Ventrue": [
            "When Ventrue-controlled Rome sacked Carthage, the greatest of Clan Brujah's achievements, they sparked a rivalry whose age is",
            "only surpassed by the feud between Clan Ravnos and Clan Gangrel. With Clan Ventrue embodying the status quo and Clan Brujah",
            "rebelling against the establishment, their mutual disdain has found no shortage of fuel over the centuries."
        ],
        "Clan Rivalries: Tremere & Tzimisce": [
            "It wasn't Tremere who unlocked the secrets of vampiric immortality, but his disciple Goratrix. His methods were barbaric: he",
            "experimented on hundreds of native Tzimisce, ultimately starting a war between Clan Tzimisce and the newly-formed Clan Tremere.",
            "Though the Omen War has long ended, the hatred between the two clans persists undimmed into the modern nights."
        ],
        "Clan Rivalries: Tremere & Assamite": [
            "In 1493, at the signing of the Convention of Thorns that founded the Camarilla, the Assamites were widely feared for their",
            "wanton commission of diablerie. So Clan Tremere placed a curse on the entire bloodline, preventing them from drinking Kindred",
            "Blood. Though the curse was recently broken, the Assamites (now the Banu Haqim) have yet to forgive Clan Tremere's interference."
        ],
        "Clan Rivalries: Gangrel & Ravnos": [
            "When the Gangrel Antediluvian Ennoia murdered a favored childe of the Ravnos Antediluvian Zapathasura, Zapathasura cursed Ennoia",
            "as a beast, placing upon her what would become the clan bane of all Gangrel. Thus began the oldest rivalry between clans, a feud",
            "known to every Gangrel and to every Ravnos, which continues to rage unchecked in modern nights."
        ],
        "Clan Rivalries: Nosferatu & Toreador": [
            "Throughout history, Clan Toreador has been behind a cavalcade of subtle machinations against Clan Nosferatu, ostracizing them from",
            "\"polite\" Kindred society and resigning them to the slums and sewers. For most clans, these acts would be unforgivable, but the",
            "Nosferatu are subtle and indisposed to grudges. Nevertheless, the Toreador know to expect a very steep price to secure Nosferatu services."
        ],
        "The First Inquisition: The Burning Times": [
            "During the 14th, 15th and 16th centuries, the Inquisition raged throughout Europe. Many Kindred were destroyed, and many more",
            "were forced to abandon their holdings and go into hiding. To most Kindred, this was the first time they learned to fear mortals as",
            "a threat. A cultural shift took hold, leading to the Tradition of the Masquerade and the formation of the Camarilla."
        ],
        Prestation: [
            "Prestation describes the system of exchanging favors among the Kindred. Since debts do not expire and eternity is a very long",
            "time, prestation carries great weight among immortals of all sects. Though favors (or \"boons\" as they are known) are usually tracked",
            "informally, a Kindred who renegs on such a debt is quickly identified, and risks social ostracism — or worse."
        ],
        "Mechanic: Projects": [
            "Any long-term goal that you have for your character should be tracked as a \"Project\". To start a Project, describe the goal you ",
            "wish to accomplish, and we'll go from there. Be warned: Your adversaries are running their own Projects, and may interfere with yours.",
            "There are systems for discovering Projects, interfering with Projects, and even stealing a Project and reaping its benefits."
        ],
        "The Seneschal": [
            "A seneschal is an influential vampire who is empowered by the prince to act on their behalf on most matters. At any time, they may be",
            "asked to step into the prince's place if they leave town on business, abdicate, or are slain. However powerful the position of",
            "seneschal, all actions taken by the city's second-highest authority remain subject to revocation by the prince."
        ],
        Justicars: [
            "The justicars are the most powerful visible component of the Camarilla's worldwide presence, charged with adjudicating matters of the",
            "Traditions on a global scale. There is one justicar for each Camarilla clan: Juliet, the Malkavian Justicar; Molly MacDonald, the",
            "Nosferatu Justicar; Diana Iadanza, the Toreador Justicar; Ian Carfax, the Tremere Justicar; and Lucinde, the Ventrue Justicar."
        ],
        Archons: [
            "Archons are the trusted, hand-picked servants of the justicars: if the justicars are the Camarilla's hands, the archons are its fingers.",
            "A justicar can appoint any number of archons, and each acts with the justicar's full authority in all matters. The appearance of an",
            "archon in a city is a time of great uncertainty, for even princes must defer to a justicar's mandate."
        ],
        "The Sheriff": [
            "The sheriff is a vampire selected by the prince and primogen who enforces the Blood Hunt within the prince's domain, as",
            "well as any other edicts of the prince. Ultimately, they are charged with maintaining order and harmony within a city, and",
            "investigating the commission of any crimes against the prince's laws or the Traditions themselves."
        ],
        Scourges: [
            "A scourge is directly subordinate to the prince, and is responsible for the destruction of the thin-blooded as well",
            "as any other vampires who have been Embraced in violation of the Third Tradition. Unlike the sheriff, a scourge operates",
            "under no pretense of due process or investigation: those they hunt are already guilty by their very nature."
        ],
        Antitribu: [
            "An antitribu is a vampire who is aligned with a sect that opposes the one their clan traditionally associates with. Most antitribu",
            "are defectors to the Sabbat, but there do exist Lasombra antitribu in the Camarilla. Tzimisce antitribu are virtually unheard of, both",
            "because the Tremere hunt them mercilessly, and because of the ease with which the Clan of Shapers can disguise their heritage."
        ]
    };
    const PREDTYPES = {
        Alleycat: ["Strength", "Brawl"],
        Bagger: ["Intelligence", "Streetwise"],
        Cleaver: ["Manipulation", "Subterfuge"],
        Consensualist: ["Manipulation", "Persuasion"],
        Farmer: ["Composure", "Animal Ken"],
        Headhunter: ["(Other Vampires)"],
        Osiris: ["Manipulation", "Subterfuge/Intimidation", "Fame"],
        Sandman: ["Dexterity", "Stealth"],
        Scene_Queen: ["Manipulation", "Persuasion"],
        Siren: ["Charisma", "Persuasion"]
    };
    // #endregion

    // #region CITY DETAILS
    const DISTRICTSJSON = `{"Annex": {"fullName": "the Annex", "resonance": ["p", "m"], "huntDiff": 3, "homestead": [4, 2, 2, 1], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CityRevelers"], "outside": true, "domainControl": {"rollEffects": [], "statEffects:": []}}, "BayStFinancial": {"fullName": "the Bay St. Financial District", "resonance": ["p", "s"], "huntDiff": 4, "homestead": [5, 4, 6, 5], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CityTraffic"], "outside": true, "domainControl": {"rollEffects": [], "statEffects:": []}}, "Bennington": {"fullName": "Bennington Heights", "resonance": ["p", "s"], "huntDiff": 6, "homestead": [5, 1, 5, 1], "rollEffects": ["loc:Bennington;nobloodsurge;;Bennington Heights (No Blood Surge)"], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CitySuburb"], "outside": true, "domainControl": {"rollEffects": [], "statEffects:": []}}, "Cabbagetown": {"fullName": "Cabbagetown", "resonance": ["i", "s"], "huntDiff": 2, "homestead": [2, 1, 1, 1], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CityTraffic"], "outside": true, "domainControl": {"rollEffects": [], "statEffects:": []}}, "CasaLoma": {"fullName": "Casa Loma", "resonance": ["m", "c"], "huntDiff": 3, "homestead": [5, 3, 5, 2], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["(NONE)"], "outside": false, "domainControl": {"rollEffects": [], "statEffects:": []}}, "CentreIsland": {"fullName": "Centre Island", "resonance": ["s", "p"], "huntDiff": 6, "homestead": [2, 3, 0, 2], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CityPark"], "outside": true, "domainControl": {"rollEffects": [], "statEffects:": []}}, "Chinatown": {"fullName": "Chinatown", "resonance": ["s", "m"], "huntDiff": 2, "homestead": [2, 4, 4, 2], "rollEffects": ["loc:Chinatown+brawl;2;[+1]<#> Kung-Fu Fighting|loc;Chinatown+firearms/melee;-2;[-1]<#> Kung-Fu Fighting"], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CityTraffic"], "outside": true, "domainControl": {"rollEffects": [], "statEffects:": []}}, "CityStreets": {"fullName": "City Streets", "resonance": ["c", "m"], "huntDiff": 6, "homestead": [2, 2, 2, 4], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CityTraffic"], "outside": true, "domainControl": {"rollEffects": [], "statEffects:": []}}, "Corktown": {"fullName": "Corktown", "resonance": ["c", "p"], "huntDiff": 2, "homestead": [2, 3, 1, 0], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CityTraffic"], "outside": true, "domainControl": {"rollEffects": [], "statEffects:": []}}, "Danforth": {"fullName": "the Danforth", "resonance": ["s", "p"], "huntDiff": 3, "homestead": [4, 2, 4, 2], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CityWalking"], "outside": true, "domainControl": {"rollEffects": [], "statEffects:": []}}, "DeerPark": {"fullName": "Deer Park", "resonance": ["r", "s"], "huntDiff": 5, "homestead": [2, 1, 2, 3], "rollEffects": ["loc:DeerPark;bestialcancel;[!1]Bad Moon Rising"], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CitySuburb"], "outside": true, "domainControl": {"rollEffects": [], "statEffects:": []}}, "Discovery": {"fullName": "the Discovery District", "resonance": ["m", "c"], "huntDiff": 4, "homestead": [5, 2, 3, 3], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CityChatter"], "outside": true, "domainControl": {"rollEffects": [], "statEffects:": []}}, "DistilleryDist": {"fullName": "the Distillery District", "resonance": ["c", "s"], "huntDiff": 5, "homestead": [1, 2, 4, 4], "rollEffects": ["loc:DistilleryDist+firearms;2;[+1]<#> Janie's Got a Gun|loc:DistilleryDist+brawl/melee;-2;[-1]<#> Janie's Got a Gun"], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CityTraffic"], "outside": true, "domainControl": {"rollEffects": [], "statEffects:": []}}, "DupontByTheCastle": {"fullName": "Dupont by the Castle", "resonance": ["m", "c"], "huntDiff": 4, "homestead": [5, 3, 5, 2], "rollEffects": ["loc:DupontByTheCastle+messycrit;;[!1]Can't Stop the Feeling"], "statEffects": ["loc:DupontByTheCastle;bloodpotency;1"], "onEntryCall": "", "onExitCall": "", "soundScape": ["CityWalking"], "outside": true, "domainControl": {"rollEffects": [], "statEffects:": []}}, "GayVillage": {"fullName": "the Gay Village", "resonance": ["s", "m"], "huntDiff": 2, "homestead": [4, 3, 2, 3], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CityTraffic"], "outside": true, "domainControl": {"rollEffects": [], "statEffects:": []}}, "Giovanni": {"fullName": "the GIovanni Mansion", "resonance": ["i", "s"], "huntDiff": 5, "homestead": [2, 0, 5, 1], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["(NONE)"], "outside": false, "domainControl": {"rollEffects": [], "statEffects:": []}}, "HarbordHaven": {"fullName": "Masque's Haven", "resonance": ["c", "p"], "huntDiff": 4, "homestead": [3, 5, 3, 4], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["(NONE)"], "outside": false, "domainControl": {"rollEffects": [], "statEffects:": []}}, "HarbordVillage": {"fullName": "Harbord Village", "resonance": ["c", "p"], "huntDiff": 4, "homestead": [3, 5, 3, 4], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CityTraffic"], "outside": true, "domainControl": {"rollEffects": [], "statEffects:": []}}, "Humewood": {"fullName": "Humewood", "resonance": ["r", "s"], "huntDiff": 3, "homestead": [2, 1, 4, 2], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CitySuburb"], "outside": true, "domainControl": {"rollEffects": [], "statEffects:": []}}, "LakeOntario": {"fullName": "Lake Ontario", "resonance": ["p", "s"], "huntDiff": "~", "homestead": [2, 1, 4, 4], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["Waterside"], "outside": true, "domainControl": {"rollEffects": [], "statEffects:": []}}, "LibertyVillage": {"fullName": "Liberty Village", "resonance": ["c", "m"], "huntDiff": 3, "homestead": [3, 3, 2, 1], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CityRevelers"], "outside": true, "domainControl": {"rollEffects": [], "statEffects:": []}}, "LittleItaly": {"fullName": "Little Italy", "resonance": ["c", "p"], "huntDiff": 2, "homestead": [3, 3, 3, 3], "rollEffects": ["loc:LittleItaly+melee;2;[+1]<#> Beat It|loc:LittleItaly+firearms/melee;-2;[-1]<#> Beat It"], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CityTraffic"], "outside": true, "domainControl": {"rollEffects": [], "statEffects:": []}}, "LittlePortugal": {"fullName": "Little Portugal", "resonance": ["m", "p"], "huntDiff": 2, "homestead": [1, 4, 3, 3], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["(TOTALSILENCE)"], "outside": true, "domainControl": {"rollEffects": [], "statEffects:": []}}, "PATH": {"fullName": "P.A.T.H.", "resonance": ["p", "c"], "huntDiff": 4, "homestead": [3, 6, 4, 5], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["IndoorMarket"], "outside": false, "domainControl": {"rollEffects": [], "statEffects:": []}}, "RegentPark": {"fullName": "Regent Park", "resonance": ["p", "c"], "huntDiff": 3, "homestead": [4, 4, 3, 4], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CitySuburb"], "outside": true, "domainControl": {"rollEffects": [], "statEffects:": []}}, "Riverdale": {"fullName": "Riverdale", "resonance": ["q", "m"], "huntDiff": 3, "homestead": [3, 5, 4, 3], "rollEffects": ["loc:Riverdale+messycrit;nomessycrit;[LOC]Steady As She Goes"], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CitySuburb"], "outside": true, "domainControl": {"rollEffects": [], "statEffects:": []}}, "Rosedale": {"fullName": "Rosedale", "resonance": ["p", "m"], "huntDiff": 6, "homestead": [5, 1, 5, 4], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CitySuburb"], "outside": true, "domainControl": {"rollEffects": [], "statEffects:": []}}, "Sewers": {"fullName": "the Sewers", "resonance": ["m", "s"], "huntDiff": "~", "homestead": [0, 1, 4, 5], "rollEffects": ["loc:Sewers+Nosferatu+physical/discipline;2;[+1]<#> Demons"], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["Sewers"], "outside": false, "domainControl": {"rollEffects": [], "statEffects:": []}}, "StJamesTown": {"fullName": "St. James Town", "resonance": ["i", "p"], "huntDiff": 2, "homestead": [1, 1, 4, 1], "rollEffects": ["loc:StJamesTown+Lasombra+Dominate;2;[+1]<#> Music of the Night"], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CityTraffic"], "outside": true, "domainControl": {"rollEffects": [], "statEffects:": []}}, "Summerhill": {"fullName": "Summerhill", "resonance": ["m", "s"], "huntDiff": 2, "homestead": [1, 3, 3, 2], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CitySuburb"], "outside": true, "domainControl": {"rollEffects": [], "statEffects:": []}}, "Waterfront": {"fullName": "the Waterfront", "resonance": ["s", "c"], "huntDiff": 4, "homestead": [6, 5, 4, 5], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CityTraffic"], "outside": true, "domainControl": {"rollEffects": [], "statEffects:": []}}, "WestQueenWest": {"fullName": "West Queen West", "resonance": ["s", "p"], "huntDiff": 3, "homestead": [4, 4, 3, 4], "rollEffects": ["loc:WestQueenWest+success+rouse;reroll;[!1]Hungry Like the Wolf"], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CityTraffic"], "outside": true, "domainControl": {"rollEffects": [], "statEffects:": []}}, "Wychwood": {"fullName": "Wychwood", "resonance": ["s", "c"], "huntDiff": 5, "homestead": [2, 0, 5, 1], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CitySuburb"], "outside": true, "domainControl": {"rollEffects": [], "statEffects:": []}}, "YongeHospital": {"fullName": "the Yonge & College Hospital District", "resonance": ["p", "c"], "huntDiff": 4, "homestead": [4, 4, 4, 5], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CityTraffic"], "outside": true, "domainControl": {"rollEffects": [], "statEffects:": []}}, "YongeMuseum": {"fullName": "the Yonge & Bloor Museum District", "resonance": ["m", "c"], "huntDiff": 4, "homestead": [5, 4, 4, 3], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CityChatter"], "outside": true, "domainControl": {"rollEffects": [], "statEffects:": []}}, "YongeStreet": {"fullName": "Yonge Street", "resonance": ["q", "m"], "huntDiff": 3, "homestead": [4, 5, 4, 6], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CityTraffic"], "outside": true, "domainControl": {"rollEffects": [], "statEffects:": []}}, "Yorkville": {"fullName": "Yorkville", "resonance": ["c", "m"], "huntDiff": 6, "homestead": [5, 2, 4, 5], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CitySuburb"], "outside": true, "domainControl": {"rollEffects": ["composure;1;+ Domain Bonus: Composure (<.>)", "composure;2;+ Domain Bonus: Composure (<.>)", "composure;freewpreroll;Domain Bonus: Free Reroll"], "statEffects:": []}}}`; /* eslint-disable-line babel/quotes, quotes */
    const SITESJSON = `{"AnarchBar": {"fullName": "an Anarch Dive Bar", "district": null, "resonance": ["c", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["DiveBar"], "outside": false}, "AptCorridor": {"fullName": "an apartment corridor", "district": null, "resonance": ["p", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["SoftIndoor"], "outside": false}, "AptLobby": {"fullName": "an apartment lobby", "district": null, "resonance": ["c", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["SoftIndoor"], "outside": false}, "AptStreetside": {"fullName": "an apartment streetside", "district": null, "resonance": ["q", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["(NONE)"], "outside": true}, "ArtGallery": {"fullName": "the Art Gallery of Ontario", "district": ["WestQueenWest"], "resonance": ["s", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["SoftIndoor"], "outside": false}, "BackAlley": {"fullName": "a back alley", "district": null, "resonance": [null, "s"], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["UrbanDark"], "outside": true}, "BaronyTable": {"fullName": "at the Red Barony's table", "district": ["PATH"], "resonance": [null, null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["SoftIndoor"], "outside": false}, "BayTower": {"fullName": "the Bay Wellington Tower", "district": ["BayStFinancial"], "resonance": ["p", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["SoftIndoor"], "outside": false}, "BBootyCells": {"fullName": "Bookies' Booty: Cells", "district": ["HarbordVillage"], "resonance": [null, "p"], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["SoftHum"], "outside": false}, "BillyBishopFerry": {"fullName": "the Billy Bishop Ferry", "district": ["Waterfront", "LakeOntario"], "resonance": ["m", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["Waterside"], "outside": false}, "BrickWorks": {"fullName": "the Evergreen Brick Works", "district": ["Rosedale"], "resonance": [null, "s"], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["Industry"], "outside": false}, "CabbagetownPenthouse": {"fullName": "a Cabbagetown Penthouse", "district": ["Cabbagetown"], "resonance": ["p", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["(NONE)"], "outside": false}, "Cemetary": {"fullName": "a cemetary", "district": null, "resonance": ["m", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CityPark"], "outside": true}, "CeramicsMuseum": {"fullName": "the Gardiner Ceramics Museum", "district": ["YongeHospital"], "resonance": ["p", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["SoftIndoor"], "outside": false}, "ChristiePitsPark": {"fullName": "Christie Pits Park", "district": ["Wychwood"], "resonance": ["m", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CityPark"], "outside": true}, "CityApt1": {"fullName": "a city apartment", "district": null, "resonance": ["c", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["(NONE)"], "outside": false}, "CityHall": {"fullName": "City Hall", "district": ["WestQueenWest"], "resonance": ["p", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["SoftIndoor"], "outside": false}, "CityPark": {"fullName": "a city park", "district": null, "resonance": ["s", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CityPark"], "outside": true}, "CLDrawingRoom": {"fullName": "the Casa Loma Maximillian Steele Drawing Room", "district": ["DupontByTheCastle"], "resonance": [], "rollEffects": [], "statEffects": [], "onEntryCall": "!time start 20", "onExitCall": "!time start 60", "soundScape": ["(NONE)"], "outside": false}, "CLGallery": {"fullName": "the Casa Loma Gallery of Mirrors", "district": ["DupontByTheCastle"], "resonance": [], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["SoftIndoor"], "outside": false}, "CLGreatHall": {"fullName": "the Casa Loma Great Hall", "district": ["DupontByTheCastle"], "resonance": [], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["(NONE)"], "outside": false}, "CLGrounds": {"fullName": "the Casa Loma Estate Grounds", "district": ["DupontByTheCastle"], "resonance": [null, "m"], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CitySuburb"], "outside": true}, "CLLibrary": {"fullName": "the Casa Loma Tacettin Ayhan Library", "district": ["DupontByTheCastle"], "resonance": [], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["(NONE)"], "outside": false}, "CLOverlook": {"fullName": "a Casa Loma Overlook", "district": ["DupontByTheCastle"], "resonance": [], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["SoftIndoor"], "outside": false}, "CLTerrace": {"fullName": "a Casa Loma Moonlit Terrace", "district": ["DupontByTheCastle"], "resonance": [], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CityPark"], "outside": true}, "CLVestibule": {"fullName": "the Casa Loma Vestibule", "district": ["DupontByTheCastle"], "resonance": [], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["SoftIndoor"], "outside": false}, "CNTower": {"fullName": "the CN Tower", "district": ["Waterfront"], "resonance": ["s", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["(NONE)"], "outside": false}, "DerelictWarehouse": {"fullName": "a derelict warehouse", "district": ["DistilleryDist"], "resonance": [null, null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["UrbanDark"], "outside": false}, "Distillery": {"fullName": "the Historic Distillery", "district": ["DistilleryDist"], "resonance": ["m", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["Industry"], "outside": false}, "DistilleryExterior": {"fullName": "the Historic Distillery: Exterior", "district": ["DistilleryDist"], "resonance": ["c", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["UrbanDark"], "outside": true}, "DistilleryGround": {"fullName": "the Historic Distillery: Ground Floor", "district": ["DistilleryDist"], "resonance": [null, "p"], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["SoftHum"], "outside": false}, "DistilleryUpper": {"fullName": "the Historic Distillery: Upper Floor", "district": ["DistilleryDist"], "resonance": ["m", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["SoftHum"], "outside": false}, "Docks": {"fullName": "the Docks", "district": ["DistilleryDist"], "resonance": ["c", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["Waterside"], "outside": true}, "Drake": {"fullName": "the Drake Hotel", "district": ["LittlePortugal"], "resonance": ["s", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["(TOTALSILENCE)"], "outside": false}, "Elevator": {"fullName": "an elevator", "district": null, "resonance": ["m", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["SoftHum"], "outside": false}, "Elysium": {"fullName": "Elysium", "district": null, "resonance": [null, "c"], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["SoftIndoor"], "outside": false}, "EvergreenPalisades": {"fullName": "the Evergreen Palisades", "district": ["RegentPark"], "resonance": ["i", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["(NONE)"], "outside": false}, "FightClub": {"fullName": "fight club", "district": null, "resonance": ["c", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["DiveBar"], "outside": false}, "GayClub": {"fullName": "a gay nightclub", "district": null, "resonance": ["s", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["Nightclub"], "outside": false}, "GECatacombs": {"fullName": "the catacombs", "district": ["Wychwood"], "resonance": ["i", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["Sewers"], "outside": false}, "GECathedral": {"fullName": "the Cathedral of the Conclave", "district": ["Wychwood"], "resonance": ["i", null], "rollEffects": [], "statEffects": [], "onEntryCall": "!sess giovanni unlock", "onExitCall": "", "soundScape": ["Sewers"], "outside": false}, "GEEstateGrounds": {"fullName": "the estate grounds", "district": ["Wychwood"], "resonance": ["i", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CityPark"], "outside": true}, "GEMansion": {"fullName": "the Giovanni Mansion", "district": ["Wychwood"], "resonance": ["i", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["(NONE)"], "outside": false}, "GEMortuary": {"fullName": "the mortuary", "district": ["Wychwood"], "resonance": ["i", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["(NONE)"], "outside": false}, "GENERIC": {"fullName": "generic", "district": null, "resonance": [], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["(NONE)"]}, "GEResidence": {"fullName": "the Residence", "district": ["Wychwood"], "resonance": ["i", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["DiveBar"], "outside": false}, "GETowerRoom": {"fullName": "the Tower Room", "district": ["Wychwood"], "resonance": ["i", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["SoftIndoor"], "outside": false}, "HHHarbordHaven": {"fullName": "Masque's Haven", "district": ["HarbordVillage"], "resonance": [null, null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["SoftIndoor"], "outside": false}, "HHHemovoreNecro": {"fullName": "Hemovore Necrosurgery", "district": ["HarbordVillage"], "resonance": [null, null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["MedicalClinic"], "outside": false}, "HHLuxuriousOffice": {"fullName": "a luxurious office", "district": ["HarbordVillage"], "resonance": [null, null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["SoftIndoor"], "outside": false}, "HHSanctumThaum": {"fullName": "the Sanctum Thaumaturgia", "district": ["HarbordVillage"], "resonance": [null, null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["SoftIndoor"], "outside": false}, "HHShadowedRefuge": {"fullName": "a shadowed refuge", "district": ["HarbordVillage"], "resonance": [null, null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["(TOTALSILENCE)"], "outside": false}, "Kensington": {"fullName": "Kensington Market", "district": ["HarbordVillage"], "resonance": [null, "m"], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CityWalking"], "outside": true}, "Laboratory": {"fullName": "a laboratory", "district": null, "resonance": ["m", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["(NONE)"], "outside": false}, "LectureHall": {"fullName": "a lecture hall", "district": null, "resonance": ["m", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["SoftIndoor"], "outside": false}, "Library": {"fullName": "a library", "district": null, "resonance": ["p", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["SoftIndoor"], "outside": false}, "MadinaMasjid": {"fullName": "Madina Masjid", "district": ["Danforth"], "resonance": ["p", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["Church"], "outside": false}, "MiddleOfRoad": {"fullName": "the middle of the road", "district": null, "resonance": ["m", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CityTraffic"], "outside": true}, "MobBloodDrive": {"fullName": "a mobile blood drive", "district": null, "resonance": [null, "s"], "rollEffects": ["loc:MobBloodDrive+medicine;nohungerdice;Steady On (No Hunger Dice)"], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CityTraffic"], "outside": false}, "Nightclub": {"fullName": "a nightclub", "district": null, "resonance": ["s", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["Nightclub"], "outside": false}, "Office": {"fullName": "an office", "district": null, "resonance": [null, "c"], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["SoftIndoor"], "outside": false}, "ParkingLot": {"fullName": "a parking lot", "district": null, "resonance": [null, "p"], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["(NONE)"], "outside": true}, "PMHospital": {"fullName": "Princess Margaret Hospital", "district": ["YongeMuseum"], "resonance": ["p", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["Hospital"], "outside": false}, "ProfOffice": {"fullName": "a professor's office", "district": ["Discovery"], "resonance": ["p", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["SoftIndoor"], "outside": false}, "RedemptionHouse": {"fullName": "Redemption House", "district": ["Danforth"], "resonance": [null, "p"], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["SoftIndoor"], "outside": false}, "RegentParkApt": {"fullName": "a Regent Park Apartment", "district": ["RegentPark"], "resonance": ["i", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["(TOTALSILENCE)"], "outside": false}, "RogersCentre": {"fullName": "the Rogers Centre", "district": ["Waterfront"], "resonance": ["c", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CityPark"], "outside": true}, "ROM": {"fullName": "the Royal Ontario Museum", "district": ["YongeHospital"], "resonance": ["m", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["SoftIndoor"], "outside": false}, "Rooftops": {"fullName": "the rooftops", "district": null, "resonance": ["m", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["RoofTop"], "outside": true}, "SecludedDeadEnd": {"fullName": "a secluded dead end", "district": null, "resonance": ["p", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CityPark"], "outside": true}, "SewerJunc": {"fullName": "a tunnel junction", "district": ["Sewers"], "resonance": [null, null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["Sewers"], "outside": false}, "SewerTunnel1": {"fullName": "a sewer tunnel", "district": ["Sewers"], "resonance": [null, null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["Sewers"], "outside": false}, "Sidewalk1": {"fullName": "a sidewalk", "district": null, "resonance": [null, "s"], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["(NONE)"], "outside": true}, "Sidewalk2": {"fullName": "a sidewalk", "district": null, "resonance": ["q", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["(NONE)"], "outside": true}, "Sidewalk5": {"fullName": "a sidewalk", "district": null, "resonance": ["p", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["(NONE)"], "outside": true}, "SiteLotus": {"fullName": "Site: Lotus", "district": ["YongeStreet"], "resonance": [null, null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["SoftHum"], "outside": false}, "SpawningPool": {"fullName": "a spawning pool", "district": ["Sewers"], "resonance": ["m", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["Sewers"], "outside": false}, "Stairwell": {"fullName": "a stairwell", "district": null, "resonance": ["s", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["SoftIndoor"], "outside": false}, "StMichaelsCathedral": {"fullName": "St. Michael's Cathedral Basilica", "district": ["Cabbagetown"], "resonance": ["p", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["Church"], "outside": false}, "StripClub": {"fullName": "a strip club", "district": null, "resonance": ["s", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["Nightclub"], "outside": false}, "StudentVillage": {"fullName": "the Student Village", "district": ["Discovery"], "resonance": ["s", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CityRevelers"], "outside": true}, "SubwayStation": {"fullName": "a subway station", "district": ["PATH"], "resonance": ["c", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["Subway"], "outside": false}, "SubwayTunnels": {"fullName": "a subway tunnels", "district": ["PATH"], "resonance": [null, "s"], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["Sewers"], "outside": false}, "ThreefoldExchange": {"fullName": "the Threefold Exchange", "district": ["Wychwood"], "resonance": ["p", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["SoftIndoor"], "outside": false}, "TorontoWestern": {"fullName": "Toronto Western Hospital", "district": ["HarbordVillage"], "resonance": ["m", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["Hospital"], "outside": false}, "TremereChantry": {"fullName": "the Tremere Chantry", "district": ["Discovery"], "resonance": ["p", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["Church"], "outside": false}, "UndergroundMedClinic": {"fullName": "an underground medical clinic", "district": null, "resonance": ["m", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["MedicalClinic"], "outside": false}, "UndergroundMedOffice": {"fullName": "an underground medical office", "district": null, "resonance": [null, "c"], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["SoftIndoor"], "outside": false}, "VacantLot": {"fullName": "a vacant lot", "district": null, "resonance": ["i", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["UrbanDark"], "outside": true}, "Vehicle2": {"fullName": "a vehicle", "district": null, "resonance": [null, null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CityTraffic"], "outside": true}, "Vehicle4": {"fullName": "a vehicle", "district": null, "resonance": [null, null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CityTraffic"], "outside": true}, "Vehicle5": {"fullName": "a vehicle", "district": null, "resonance": [null, null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CityTraffic"], "outside": true}, "Vehicle7": {"fullName": "a vehicle", "district": null, "resonance": [null, null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CityTraffic"], "outside": true}, "WalkingPath": {"fullName": "a walking path", "district": null, "resonance": ["q", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CityPark"], "outside": true}, "WarrensAntechamber": {"fullName": "the Warrens: Antechamber", "district": ["Sewers"], "resonance": ["m", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["Sewers"], "outside": false}, "WychwoodPub": {"fullName": "a Wychwood Pub", "district": ["Wychwood"], "resonance": [null, "c"], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["(NONE)"], "outside": false}, "Yacht": {"fullName": "a luxury yacht", "district": ["Waterfront", "LakeOntario"], "resonance": ["m", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["Waterside"], "outside": false}, "YongeDundasSquare": {"fullName": "Yonge & Dundas Square", "district": ["YongeStreet"], "resonance": ["c", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["(NONE)"], "outside": true}, "YorkvilleApt1": {"fullName": "a Yorkville Apartment", "district": ["Yorkville"], "resonance": ["m", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["(NONE)"], "outside": false}, "YorkvilleApt2": {"fullName": "a Yorkville Apartment", "district": ["Yorkville"], "resonance": ["m", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["(NONE)"], "outside": false}, "YouthShelter": {"fullName": "a youth shelter", "district": null, "resonance": ["c", null], "rollEffects": [], "statEffects": [], "onEntryCall": "", "onExitCall": "", "soundScape": ["CityRevelers"], "outside": false}}`; /* eslint-disable-line babel/quotes, quotes */
    const DISTRICTS = JSON.parse(DISTRICTSJSON);
    const SITES = JSON.parse(SITESJSON);

    // #endregion

    // #region SPOTLIGHT PROMPTS
    const SPOTLIGHTPROMPTS = [
        "Choose a coterie mate.  Narrate a scene wherein you perform a favor for that character sufficient to earn you a Minor Boon."
    ];
    // #endregion

    // #region MVC: Minimally-Viable Character Design
    const MVCVALS = [
        [
            "<span style=\"display: block; width: 100%; margin-top: -10px;\">Concept</span></div><div style=\"display: block; width: 100%; margin-top: -10px;\">",
            [
                "headerL",
                "A depressed",
                "A surly",
                "A straightforward",
                "A timid",
                "A clever",
                "A bold",
                "An inquisitive",
                "A circumspect",
                "An outgoing",
                "An optimistic",
                "An agreeable",
                "A wise",
                "A misguided",
                "A gregarious",
                "A jaded",
                "An analytical"
            ],
            [
                "headerR",
                "Cop/Detective",
                "Social Worker/Activist",
                "Doctor/Nurse/EMT",
                "Banker/Money Launderer",
                "Office Worker/Academic",
                "Soldier/Rebel",
                "Artist/Musician/Performer",
                "Con-Artist/Politician",
                "Hacker/Tech Specialist",
                "Stick-Up Kid/Armed Robber",
                "Lawyer/Fugitive",
                "Priest/True Believer",
                "Witness/Whistleblower",
                "Representative/Lobbyist",
                "Runaway/Wanderer"
            ],
            [
                "header",
                "stands accused. (Wrongfully?)",
                "was disgraced and cast out.",
                "was seriously injured (body/mind/soul).",
                "is a failure at life.",
                "is hiding from someone.",
                "is stepping on the wrong toes.",
                "is pushing the envelope.",
                "is a rising star.",
                "is respected and admired.",
                "is at the height of their field.",
                "has a secret they're ashamed of.",
                "is burnt out but still going.",
                "is famous for a thing.",
                "is reluctantly breaking the law."
            ]
        ],
        [
            "Pivotal Event",
            [
                "para",
                "<span style=\"font-size: 14px; margin-top: 10px;\"><b>In the past ...</b></span><br>... you fell in love with the wrong person, who dragged you into an exciting world you never knew existed. You freaked out and left them.",
                "<span style=\"font-size: 14px; margin-top: 10px;\"><b>In the past ...</b></span><br>... your best friend accused you of a crime you know you didn't commit, but they have photos that prove otherwise.",
                "<span style=\"font-size: 14px; margin-top: 10px;\"><b>In the past ...</b></span><br>... you ended up in a literal warzone, bullets flying all around you. If it weren't for a dangerous psychopath you befriended you'd be a corpse.",
                "<span style=\"font-size: 14px; margin-top: 10px;\"><b>In the past ...</b></span><br>... your parents were deranged on some basal level and you grew up in chaos. You escaped as soon as you could.",
                "<span style=\"font-size: 14px; margin-top: 10px;\"><b>In the past ...</b></span><br>... somehow, through no fault of your own, you ended up with money and status. You don't know what happened to it all.",
                "<span style=\"font-size: 14px; margin-top: 10px;\"><b>In the past ...</b></span><br>... someone once took you out into some isolated place and showed you something that gives you weird dreams to this day.",
                "<span style=\"font-size: 14px; margin-top: 10px;\"><b>In the past ...</b></span><br>... you had a talent that showed itself at an early age. Everyone told you you would be famous for it, but here you are.",
                "<span style=\"font-size: 14px; margin-top: 10px;\"><b>In the past ...</b></span><br>... you look a job with no experience that no one thought you could do. After a few years, you quit and didn't look back. You can't say why.",
                "<span style=\"font-size: 14px; margin-top: 10px;\"><b>In the past ...</b></span><br>... someone very close to you died. No one would tell you what happened, and the people around you refused to talk about it.",
                "<span style=\"font-size: 14px; margin-top: 10px;\"><b>In the past ...</b></span><br>... Work. Sleep. Work. Sleep. Forever. One day you'd had enough, and in the middle of the day exploded in a rage. You left that life behind and never talk about it."
            ],
            [
                "para",
                "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You <i>still</i> feel <span style=\"font-size: 14px; margin-top: 10px;\"><u>Endless Regret</u>:</b></span><br>You didn't comport yourself with any dignity or honesty. You thought you were better than that.",
                "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You <i>still</i> feel <span style=\"font-size: 14px; margin-top: 10px;\"><u>Simmering Rage</u>:</b></span><br>They know what they did, and they did it knowing what would happen.",
                "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You <i>still</i> feel a <span style=\"font-size: 14px; margin-top: 10px;\"><u>Miasma of Confusion</u>:</b></span><br>You can't square this circle. Nothing about this makes any sense and the more you think about it the worse it is.",
                "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You <i>still</i> feel <span style=\"font-size: 14px; margin-top: 10px;\"><u>Arrogant Certainty</u>:</b></span><br>You were there for the whole thing and it didn't beat you. Nothing can stand in your way now.",
                "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You <i>still</i> feel <span style=\"font-size: 14px; margin-top: 10px;\"><u>Bleak Joy</u>:</b></span><br>It's funny when you think about it. We're all just stuck here on this planet and absurd things keep happening.",
                "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You <i>still</i> feel <span style=\"font-size: 14px; margin-top: 10px;\"><u>Numb Disbelief</u>:</b></span><br>Did that really happen? It can't have happened. It doesn't feel real.",
                "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You <i>still</i> feel <span style=\"font-size: 14px; margin-top: 10px;\"><u>Renewed Purpose</u>:</b></span><br>Everything is lined up for you. You know what you have to do with your life now.",
                "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You <i>still</i> feel <span style=\"font-size: 14px; margin-top: 10px;\"><u>Frail Hopelessness</u>:</b></span><br>Nothing matters, and the more you look at it the more you feel like the Universe is a great, crushing wave.",
                "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You're <i>still</i> driven to <span style=\"font-size: 14px; margin-top: 10px;\"><u>Hypervigilance</u>:</b></span><br>This could happen at any moment to anyone. You keep your head on a swivel for the next time it does.",
                "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You <i>still</i> feel <span style=\"font-size: 14px; margin-top: 10px;\"><u>Overwhelming Oneness</u>:</b></span><br>Have you laid in the grass and felt the Earth spinning around you? That's how you feel when you reflect on this memory."
            ],
            [
                "para",
                "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You can't let go because ... </b></span><br> ... it never ended. You just move forward and try to put the past behind you. But when you can't help but look back, it's always there, right at your heels.",
                "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You can't let go because ... </b></span><br> ... the responsible parties died before they could be confronted about their part in it.",
                "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You can't let go because ... </b></span><br> ... things keep repeating, the same situations keep appearing in your periphery and reopening old wounds.",
                "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You can't let go because ... </b></span><br> ... some problems are too big.  Some problems are systemic things that won't budge to one person's will.",
                "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You can't let go because ... </b></span><br> ... forgiveness is earned, and the person or people responsible haven't earned it.",
                "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You can't let go because ... </b></span><br> ... you can't put it right, because what is done is done.",
                "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You can't let go because ... </b></span><br> ... the system stepped in, the state or family, and took it all out of your hands.",
                "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You can't let go because ... </b></span><br> ... you don't understand how it happened, and because you don't understand it, you can't resolve it.",
                "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You can't let go because ... </b></span><br> ... everything returned to normal on the outside, but just underneath that veneer of normalcy... it sits.",
                "<span style=\"font-size: 14px; margin-top: 10px;\"><b>You can't let go because ... </b></span><br> ... other things took priority, so it remained an open loop, still in the back of your head."
            ]
        ],
        [
            "Habits",
            [
                "paraStart",
                "You reinforce or establish your <b>Profession</b> ",
                "You reinforce or establish your <b>Regional Background</b> ",
                "You reinforce or establish your <b>Social Class</b> ",
                "You reinforce or establish your <b>Childhood</b> ",
                "You reinforce or establish your <b>Political Ideology</b> ",
                "You reinforce or establish your <b>Opinion on Authority</b> ",
                "You reinforce or establish your <b>Religious Faith</b> ",
                "You reinforce or establish your <b>Family Status</b> ",
                "You reinforce or establish your <b>Sexual Preference</b> ",
                "You reinforce or establish your <b>Gender Identity</b> "
            ],
            [
                "paraMid",
                "with your <b>Speech and Accent</b>, but undermine, subvert or contradict it ",
                "with your <b>Clothing and Aesthetics</b>, but undermine, subvert or contradict it ",
                "through your <b>Hobbies and Interests</b>, but undermine, subvert or contradict it ",
                "with your <b>Critical Opinions</b>, but undermine, subvert or contradict it ",
                "with your <b>Taste in Art/Music</b>, but undermine, subvert or contradict it ",
                "with your <b>Positive Opinions</b>, but undermine, subvert or contradict it ",
                "through your <b>Nervous Nature</b>, but undermine, subvert or contradict it ",
                "with your <b>Indulgent Vices</b>, but undermine, subvert or contradict it ",
                "with your <b>Outward Ambitions</b>, but undermine, subvert or contradict it ",
                "through your <b>Confident Behavior</b>, but undermine, subvert or contradict it "
            ],
            [
                "paraEnd",
                "with your <b>Speech and Accent</b>.",
                "with your <b>Clothing and Aesthetics</b>.",
                "through your <b>Hobbies and Interests</b>.",
                "with your <b>Critical Opinions</b>.",
                "with your <b>Taste in Art/Music</b>.",
                "with your <b>Positive Opinions</b>.",
                "through your <b>Nervous Nature</b>.",
                "with your <b>Indulgent Vices</b>.",
                "with your <b>Outward Ambitions</b>.",
                "through your <b>Confident Behavior</b>."
            ]
        ],
        [
            "Signposts",
            [
                "paraStart",
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
                "When you see or show <b>Mercy</b>, "
            ],
            [
                "paraEnd",
                "you react with <b>Hatred</b> (or) <b>Love:</b> You want to destroy them for existing, or to bask in their glory.",
                "you react with <b>Disgust</b> (or) <b>Appreciation:</b> The smell of sour milk, or the sweet smell of opportunity.",
                "you react with <b>Rage</b> (or) <b>Joy:</b> They cut in front of you and laugh about it, or fill you with elation.",
                "you react with <b>Vigilant Distrust</b> (or) <b>Conviction:</b> You think you're being lied to, or you're more certain than ever.",
                "you react with <b>Admiration</b> (or) <b>Judgment:</b> One day you'll do what they did, or one day they'll learn.",
                "you react with <b>Bravery</b> (or) <b>Cowardice:</b> You stood up to the bully, or ran like hell.",
                "you react with <b>Amazement</b> (or) <b>Criticism:</b> Someone has to see this thing!",
                "you react with <b>Acceptance</b> (or) <b>Denial:</b> All this is according to design, or a change must come, whatever the cost.",
                "you react with <b>Attraction</b> (or) <b>Repulsion:</b> If you can just get a little closer... or farther away...",
                "you react with <b>Zeal</b> (or) <b>Boredom:</b> You're reminded of what is good in the world, or you grow impatient to find something more interesting."
            ],
            [
                "paraStart",
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
                "When you see or show <b>Mercy</b>, "
            ],
            [
                "paraEnd",
                "you react with <b>Hatred</b> (or) <b>Love:</b> You want to destroy them for existing, or to bask in their glory.",
                "you react with <b>Disgust</b> (or) <b>Appreciation:</b> The smell of sour milk, or the sweet smell of opportunity.",
                "you react with <b>Rage</b> (or) <b>Joy:</b> They cut in front of you and laugh about it, or fill you with elation.",
                "you react with <b>Vigilant Distrust</b> (or) <b>Conviction:</b> You think you're being lied to, or you're more certain than ever.",
                "you react with <b>Admiration</b> (or) <b>Judgment:</b> One day you'll do what they did, or one day they'll learn.",
                "you react with <b>Bravery</b> (or) <b>Cowardice:</b> You stood up to the bully, or ran like hell.",
                "you react with <b>Amazement</b> (or) <b>Criticism:</b> Someone has to see this thing!",
                "you react with <b>Acceptance</b> (or) <b>Denial:</b> All this is according to design, or a change must come, whatever the cost.",
                "you react with <b>Attraction</b> (or) <b>Repulsion:</b> If you can just get a little closer... or farther away...",
                "you react with <b>Zeal</b> (or) <b>Boredom:</b> You're reminded of what is good in the world, or you grow impatient to find something more interesting."
            ]
        ]
    ];
    // #endregion

    // #region SPECIAL EFFECTS DEFINITIONS
    const FX = {
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
    };
    // #endregion

    Object.freeze(REPLY);

    return {
        CheckInstall: checkInstall,

        GAMENAME,
        RO,
        TEXTCHARS,
        PAGES,
        DELIM,

        NUMBERWORDS,
        ORDINALSUFFIX,
        COLORS,

        REPLY,

        IMAGES,
        BGIMAGES,
        HANDOUTHTML,
        ROLLERHTML,
        CHATWIDTH,
        HTML,
        HTMLSTYLES,
        STYLES,
        STYLE,

        PIXELSPERSQUARE,
        SANDBOX,
        MAP,
        QUADRANTS,
        SHADOWOFFSETS,

        CHARACTIONS,

        SHEETATTRS,
        REPATTRS,
        TRAITREPSECS,
        IMAGEPROPS,
        TEXTPROPS,
        ATTRPROPS,
        ATTRDISPLAYNAMES,
        HANDOUTPROPS,

        MODEDEFAULTS,

        ATTRIBUTES,
        ATTRABBVS,
        SKILLS,
        SKILLABBVS,
        DISCIPLINES,
        DISCABBVS,
        TRACKERS,
        get TRAITLOOKUP() {
            return Object.assign({},
                                 D.KeyMapObj(D.Clone(ATTRABBVS), (k) => D.LCase(k), (v) => D.LCase(v).replace(/ /gu, "_")),
                                 D.KeyMapObj(D.Clone(SKILLABBVS), (k) => D.LCase(k), (v) => D.LCase(v).replace(/ /gu, "_")),
                                 D.KeyMapObj(D.Clone(DISCABBVS), (k) => D.LCase(k), (v) => D.LCase(v).replace(/ /gu, "_")),
                                 {
                                     health: "health",
                                     will: "willpower",
                                     wp: "willpower",
                                     willpower: "willpower",
                                     bp: "blood_potency",
                                     hunger: "hunger"
                                 });
        },
        CLANS,
        SECTS,
        PREDTYPES,
        MARQUEETIPS,
        MISCATTRS,
        BLOODPOTENCY,
        RESONANCEODDS,
        RESONANCE,
        TENETS,

        DISTRICTS,
        SITES,
        get LOCATIONS() {
            return Object.assign({}, DISTRICTS, SITES);
        },

        SOUNDVOLUME,
        SOUNDMODES,
        SOUNDSCORES,

        SPOTLIGHTPROMPTS,

        MVCVALS,
        FX
    };
})();

on("ready", () => {
    InitCommands.PreInitialization();
    C.CheckInstall();
    D.Log("CONSTANTS Ready!");

    const resetProblemStateVals = () => {
        state.VAMPIRE.D.DEBUGLOG = [];
        /* state.VAMPIRE.D.STATSDICT = {gramSizeLower: 2, gramSizeUpper: 3, useLevenshtein: true, exactSet: {}, matchDict: {}, items: {}};
        state.VAMPIRE.D.PCDICT = {gramSizeLower: 2, gramSizeUpper: 3, useLevenshtein: true, exactSet: {}, matchDict: {}, items: {}};
        state.VAMPIRE.D.PCLIST = {gramSizeLower: 2, gramSizeUpper: 3, useLevenshtein: true, exactSet: {}, matchDict: {}, items: {}};
        state.VAMPIRE.D.NPCDICT = {gramSizeLower: 2, gramSizeUpper: 3, useLevenshtein: true, exactSet: {}, matchDict: {}, items: {}};
        state.VAMPIRE.D.NPCLIST = {gramSizeLower: 2, gramSizeUpper: 3, useLevenshtein: true, exactSet: {}, matchDict: {}, items: {}};
        state.VAMPIRE.Char.customStakes = {
            coterie: [],
            personal: {
                A: [],
                B: [
                    ["Ava's Ally (Harker)", 2, 2, "Aug 17, 2020"],
                    ["Napier's Herd (Mobile Clinic)", 2, 5, "Aug 17, 2020"]
                ],
                L: [],
                N: [],
                R: [
                    ["Ava's Contacts (Anarchs)", 2, 2, "Sep 5, 2020"]
                ]
            }
        };
        state.VAMPIRE.Media.IMGDICT = {};
        state.VAMPIRE.Media.TEXTDICT = {};
        state.VAMPIRE.Media.AREADICT = {}; */
    };
    const checkStateStability = () => {
        const okayStateRefs = [
            ["D", "WATCHLIST"],
            ["D", "BLACKLIST"],
            ["D", "CHARWIDTH"],
            ["D", "ALERTTHROTTLE"],
            ["D", "DEBUGLOG"],
            ["D", "STATSDICT"],
            ["D", "PCDICT"],
            ["D", "PCLIST"],
            ["D", "NPCDICT"],
            ["D", "NPCLIST"],
            ["D", "isReportingListener"],
            ["D", "FuncQueueName"],
            ["D", "MissingChars"],
            ["D", "PROMPTCLOCK"],
            ["D", "flexSpace"],
            ["D", "MissingTextChars"],
            ["D", "isFullDebug"],
            ["D", "isThrottlingStackLog"],
            ["D", "RULESREFERENCE"],
            ["D", "TRACELOG"],
            ["D", "TRACENESTCOUNTER"],
            ["D", "TRACESTARTTIME"],
            ["D", "TRACELOGSTOPS"],
            ["D", "ISDEBUGGING"],
            ["D", "TRACELASTTIME"],
            ["D", "AlertLineLength"],
            ["Listener", "isLocked"],
            ["Listener", "objectLog"],
            ["Listener", "GMPlayerSpoof"],
            ["Listener", "callLog"],
            ["Listener", "callLogBlacklist"],
            ["Fuzzy", "minMatchScore"],
            ["Char", "registry"],
            ["Char", "weeklyResources"],
            ["Char", "customStakes"],
            ["Char", "traitSelection"],
            ["Char", "tokenRecord"],
            ["Char", "projectDetails"],
            ["Char", "tokenPowerData"],
            ["Char", "charAlarms"],
            ["Media", "imgregistry"],
            ["Media", "textregistry"],
            ["Media", "idregistry"],
            ["Media", "areas"],
            ["Media", "tokenregistry"],
            ["Media", "soundregistry"],
            ["Media", "TokenSrcs"],
            ["Media", "imgResizeDims"],
            ["Media", "activeAnimations"],
            ["Media", "activeSounds"],
            ["Media", "curLocation"]
        ];
        const stateRefs = [];
        const lengthVals = [];
        for (const [key, value] of Object.entries(state.VAMPIRE)) {
            lengthVals[`*** ${key} ***`] = JSON.stringify(value).length;
            for (const [kkey, vvalue] of Object.entries(value)) {
                lengthVals[`${key}.${kkey}`] = JSON.stringify(vvalue).length;
                if (!_.any(okayStateRefs, (x) => x[0] === key && x[1] === kkey))
                    stateRefs.push([key, kkey]);
            }
        }
        D.Flag("Beginning State Report in 5 Seconds...");
        setTimeout(() => {
            resetProblemStateVals();
            const delayedReport = () => {
                const [key, kkey] = stateRefs.shift();
                if (key) {
                    sendChat("Report", `/w Storyteller Reporting ${key}.${kkey}...`);
                    sendChat("Report", `/w Storyteller ${JSON.stringify(state.VAMPIRE[key][kkey])}`);
                    sendChat("Report", `/w Storyteller ... Reported ${key}.${kkey}`);
                    setTimeout(delayedReport, 3000);
                } else {
                    D.Alert("FINISHED!");
                }
            };
            delayedReport();
        }, 5000);
    };
    resetProblemStateVals();
});
void MarkStop("C");
