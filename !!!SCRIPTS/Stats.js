void MarkStart("Stats");
const Stats = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Stats";

    // #region COMMON INITIALIZATION
    const STATE = {
        get REF() {
            return C.RO.OT[SCRIPTNAME];
        }
    };
    const VAL = (varList, funcName, isArray = false) => D.Validate(varList, funcName, SCRIPTNAME, isArray);
    const DB = (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME);
    const LOG = (msg, funcName) => D.Log(msg, funcName, SCRIPTNAME);
    const THROW = (msg, funcName, errObj) => D.ThrowError(msg, funcName, SCRIPTNAME, errObj);

    const checkInstall = () => {
        C.RO.OT[SCRIPTNAME] = C.RO.OT[SCRIPTNAME] || {};
        initialize();
    };
    // #endregion

    // #region LOCAL INITIALIZATION
    const initialize = () => {
        STATE.REF.StatsLibrary = STATE.REF.StatsLibrary || {};
    };
    // #endregion

    // #region EVENT HANDLERS: (HANDLEINPUT)
    const onChatCall = (call, args, objects, msg) => {
        switch (call) {
            case "":
                break;
            // no default
        }
    };
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    // #region VERIABLE DECLARATIONS
    const PENDINGCHANGES = [];
    const LI = {
        get B() {
            return STATE.REF.StatsLibrary;
        }
    };

    // #endregion
    class Attr {
        constructor(attrObj) {
            this.SetName(attrObj);
            this.SetValue(attrObj);
        }

        SetName(v) { this._nameObj = v }
        SetValue(v) { this._valueObj = v }

        GetName() { console.log(`Attr.GET(${this._nameObj.get("name")})`) }
        GetValue() { console.log(`Attr.GET(${this._valueObj.get("value")})`) }
        Set(v) { this._value = v; console.log(`Attr.SET(${v})`) }
    }

    class Trait extends Attr {
        constructor(name) {
            super(name);
            this._value = "Trait._value";
        }
    }

    class RepTrait extends Trait {
        constructor(name) { super(name) }
    }

    // #region MIXIN DEFINITIONS
    // (Mixins provide modular functionality that can be assigned to classes without using inheritance.)
    const $repStat = {
        set obj(v) {
            this._nameObj = v;
            this._valueObj = {
                get(v) { return this[v] },
                name: "RepAttr Obj: Name",
                value: "RepAttr Obj: Value"
            };
        },
        SetValue(v) { this._valueObj = {
            get(v) { return this[v] },
            name: "RepAttr Obj: Name",
            value: "RepAttr Obj: Value"
        } },
        GetName() { console.log(`$repStat:GetName() = ${this._nameObj.get("name")}`) },
        GetValue() { console.log(`$repStat:GetValue() = ${this._valueObj.get("value")}`) }
    };
    const testObjs = [
        {
            get(v) { return this[v] },
            name: "Test Object One: Name",
            value: "Test Object One: Value"
        },
        {
            get(v) { return this[v] },
            name: "Test Object Two: Name",
            value: "Test Object Two: Value"
        }
    ];
    // #endregion

    Object.assign(RepTrait.prototype, $repStat);
    const repTraits = testObjs.map((x) => new RepTrait(x));
    console.log(repTraits.map((x) => [
        x.GetName(),
        x.GetValue()
    ]));


    // #region CLASS DEFINITIONS
    class Stat {
        // #region ~ STATIC METHODS, GETTERS & SETTERS
        // #region Instance Storage Libraries (Indexed by "id" property)
        static get LIB() { return this._StatLIB }
        static set LIB(v) {
            this._StatLIB = Object.assign(this._StatLIB || {}, {[v.id]: v});
        }
        // #endregion
        static Initialize() {
            this._StatLIB = D.KeyMapObj(findObjs({_type: "character"}), (k, v) => v.get("name"), (v) => ({
                Belief: {},
                Bio: {},
                NPC: {},
                Prestation: {},
                Roller: {},
                Scheme: {},
                Setting: {},
                Sheet: {},
                Tracker: {},
                Trait: {},
                XP: {}
            }));
            // Have to watch for creation and destruction of fieldset attributes
            // Do you even need categories? Why not just search for attributes by their name?
            //      Except maybe in specific circumstances --- like XP or Schemes can be off by themselves
            //      But all traits that you might affect or need in-game should be in one category
        }
        // #endregion

        // #region ~ BASIC GETTERS & SETTERS
        //
        get val() { return this._val }
        get name() { return this._name }
        get type() { return this._type }


        // #endregion

        // #region ~ CONSTRUCTOR
        constructor(assetRef) {
            // Checks if repeating attribute: if so, registers all associated row objects.
            // SUBCLASSES:
            //      Trait (includes traitmod, bonus/null dots, highdots; returns as value sum of traitmod & traitval)
            //      Tracker (Health & Willpower -- includes damage and healing)
            // MIXINS?
            //      RepStat
            //      Tracker
            //      Dotline
            //      HighDots
            //      TraitMod
        }
        // #endregion

        // #region ~ GETTERS
        // READ-ONLY

        // GENERAL

        // #endregion

        // #region ~ SETTERS

        // #endregion

        // #region ~ PRIVATE METHODS

        // #endregion

        // #region ~ PUBLIC METHODS
        Set(value) {

        }
        // #endregion
    }
    // #endregion
    /*
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *   SCRIPT BODY
     *
     *
     *
     *
     *
     *
     *
     *
     */

    return {
        CheckInstall: checkInstall,
        OnChatCall: onChatCall
    };
})();

on("ready", () => {
    Stats.CheckInstall();
    D.Log("Stats Ready!");
});
void MarkStop("Stats");
