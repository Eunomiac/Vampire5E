void MarkStart("Locations"); /* SETTING UP TEMPLATE: Replace "Locations" with name of script (e.g. "Chars") */
const Locations = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Locations";

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
        STATE.REF.LocationsLibrary = STATE.REF.LocationsLibrary || {};
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
            return STATE.REF.LocationsLibrary;
        }
    };

    // #endregion
    // #region CLASS DEFINITIONS
    class Location {
        // #region ~ CONSTRUCTOR
        constructor(locID) {
            this._id = locID;
        }
        // #endregion

        // #region Data Source References
        // C.DISTRICTS ENTRY
        // Annex: {
        //     fullName: "the Annex",
        //     resonance: ["p","m"],
        //     huntDiff: 3,
        //     homestead: [4,2,2,1],
        //     rollEffects: [],
        //     statEffects: [],
        //     onEntryCall: "",
        //     onExitCall: "",
        //     soundScape: [
        //         "CityRevelers"],
        //     outside: true,
        //     domainControl: {
        //         rollEffects: [],
        //         statEffects:: []
        //     }
        // },
        // C.SITES ENTRY
        // AnarchBar: {
        //     fullName: "an Anarch Dive Bar",
        //     district: null,
        //     resonance: ["c",null],
        //     rollEffects: [],
        //     statEffects: [],
        //     onEntryCall: "",
        //     onExitCall: "",
        //     soundScape: [
        //         "DiveBar"],
        //     outside: false
        // }
        // Session.locationDetails Entry
        // SiteLotus: {
        //     subLocs: {
        //     TopLeft: "SiteLotus_LockeQuarters",
        //     Left: "Security",
        //     BotLeft: "SiteLotus_RoyQuarters",
        //     TopRight: "SiteLotus_NapierQuarters",
        //     Right: "Laboratory",
        //     BotRight: "SiteLotus_AvaQuarters"
        //     },
        //     siteName: "Site: Orchid"
        //     pointerPos: { left: 588, top: 2145 }
        // }
        // Session.customLocs Entry
        // Queen's Landing Stairwell: {
        //     district: "Cabbagetown",
        //     site: "Stairwell",
        //     siteName: "Queen's Landing Stairwell",
        //     pointerPos: { left: 1189, top: 2034 },
        //     subLocs: {
        //         TopLeft: "SiteLotus_LockeQuarters",
        //         Left: "Security",
        //         BotLeft: "SiteLotus_RoyQuarters",
        //         TopRight: "SiteLotus_NapierQuarters",
        //         Right: "Laboratory",
        //         BotRight: "SiteLotus_AvaQuarters"
        //     },
        //     shortName: "QL Stairwell"
        // }
        // #endregion

        // #region ~ GETTERS
        // READ-ONLY
        get name() {
            return this.data.fullName;
        }
        get resonance() {
            return this.data.resonance;
        }

        // GENERAL
        get data() {
            return this._data;
        }
        get rollEffects() {
            return this.data.rollEffects;
        }
        get statEffects() {
            return this.data.statEffects;
        }

        // #endregion

        // #region ~ SETTERS
        set position(v) {
            this._position = v; /* (subclasses will validate for proper position) */
        }

        // #endregion

        // #region ~ PRIVATE METHODS

        // #endregion

        // #region ~ PUBLIC METHODS
        Enter() {
            if (this.onEntryCall) D.Call(this.onEntryCall);
            // setSoundScape();
            // findCharsInLoc();
            // activateRollEffects();
            // activateStatEffects();
        }

        // #endregion
    }

    class District extends Location {
        // #region ~ CONSTRUCTOR
        constructor(locRef) {
            super(`District_${locRef}`);
            this._type = "District";
            this._data = D.Clone(C.DISTRICTS[locRef] || {});
        }
        // #endregion

        // #region Data Source References
        // C.DISTRICTS ENTRY
        // Annex: {
        //     fullName: "the Annex",
        //     resonance: ["p","m"],
        //     huntDiff: 3,
        //     homestead: [4,2,2,1],
        //     rollEffects: [],
        //     statEffects: [],
        //     onEntryCall: "",
        //     onExitCall: "",
        //     soundScape: [
        //         "CityRevelers"],
        //     outside: true,
        //     domainControl: {
        //         rollEffects: [],
        //         statEffects:: []
        //     }
        // },
        // C.SITES ENTRY
        // AnarchBar: {
        //     fullName: "an Anarch Dive Bar",
        //     district: null,
        //     resonance: ["c",null],
        //     rollEffects: [],
        //     statEffects: [],
        //     onEntryCall: "",
        //     onExitCall: "",
        //     soundScape: [
        //         "DiveBar"],
        //     outside: false
        // }
        // Session.locationDetails Entry
        // SiteLotus: {
        //     subLocs: {
        //     TopLeft: "SiteLotus_LockeQuarters",
        //     Left: "Security",
        //     BotLeft: "SiteLotus_RoyQuarters",
        //     TopRight: "SiteLotus_NapierQuarters",
        //     Right: "Laboratory",
        //     BotRight: "SiteLotus_AvaQuarters"
        //     },
        //     siteName: "Site: Orchid"
        //     pointerPos: { left: 588, top: 2145 }
        // }
        // Session.customLocs Entry
        // Queen's Landing Stairwell: {
        //     district: "Cabbagetown",
        //     site: "Stairwell",
        //     siteName: "Queen's Landing Stairwell",
        //     pointerPos: { left: 1189, top: 2034 },
        //     subLocs: {
        //         TopLeft: "SiteLotus_LockeQuarters",
        //         Left: "Security",
        //         BotLeft: "SiteLotus_RoyQuarters",
        //         TopRight: "SiteLotus_NapierQuarters",
        //         Right: "Laboratory",
        //         BotRight: "SiteLotus_AvaQuarters"
        //     },
        //     shortName: "QL Stairwell"
        // }
        // #endregion

        // #region ~ GETTERS
        // READ-ONLY

        // GENERAL

        // #endregion

        // #region ~ SETTERS
        set position(v) {
            super.position = {c: "Center", l: "Left", r: "Right"}[D.LCase(v.charAt(0))];
        }

        // #endregion

        // #region ~ PRIVATE METHODS

        // #endregion

        // #region ~ PUBLIC METHODS

        // #endregion
    }

    class Site extends Location {
        // #region ~ CONSTRUCTOR
        constructor(locRef) {
            super(`Site_${locRef}`);
            this._type = "Site";
            this._data = D.Clone(C.SITES[locRef] || {});
        }
        // #endregion

        // #region Data Source References
        // C.DISTRICTS ENTRY
        // Annex: {
        //     fullName: "the Annex",
        //     resonance: ["p","m"],
        //     huntDiff: 3,
        //     homestead: [4,2,2,1],
        //     rollEffects: [],
        //     statEffects: [],
        //     onEntryCall: "",
        //     onExitCall: "",
        //     soundScape: [
        //         "CityRevelers"],
        //     outside: true,
        //     domainControl: {
        //         rollEffects: [],
        //         statEffects:: []
        //     }
        // },
        // C.SITES ENTRY
        // AnarchBar: {
        //     fullName: "an Anarch Dive Bar",
        //     district: null,
        //     resonance: ["c",null],
        //     rollEffects: [],
        //     statEffects: [],
        //     onEntryCall: "",
        //     onExitCall: "",
        //     soundScape: [
        //         "DiveBar"],
        //     outside: false
        // }
        // Session.locationDetails Entry
        // SiteLotus: {
        //     subLocs: {
        //     TopLeft: "SiteLotus_LockeQuarters",
        //     Left: "Security",
        //     BotLeft: "SiteLotus_RoyQuarters",
        //     TopRight: "SiteLotus_NapierQuarters",
        //     Right: "Laboratory",
        //     BotRight: "SiteLotus_AvaQuarters"
        //     },
        //     siteName: "Site: Orchid"
        //     pointerPos: { left: 588, top: 2145 }
        // }
        // Session.customLocs Entry
        // Queen's Landing Stairwell: {
        //     district: "Cabbagetown",
        //     site: "Stairwell",
        //     siteName: "Queen's Landing Stairwell",
        //     pointerPos: { left: 1189, top: 2034 },
        //     subLocs: {
        //         TopLeft: "SiteLotus_LockeQuarters",
        //         Left: "Security",
        //         BotLeft: "SiteLotus_RoyQuarters",
        //         TopRight: "SiteLotus_NapierQuarters",
        //         Right: "Laboratory",
        //         BotRight: "SiteLotus_AvaQuarters"
        //     },
        //     shortName: "QL Stairwell"
        // }
        // #endregion

        // #region ~ GETTERS
        // READ-ONLY

        // GENERAL
        get name() {
            return this._customName || super.name;
        }

        // #endregion

        // #region ~ SETTERS
        set name(v) {
            this._customName = v;
        }

        // #endregion

        // #region ~ PRIVATE METHODS
        assignDistrict() {
            /* assigns a District instance, then combines district effects, etc with site effects */
        }

        // #endregion

        // #region ~ PUBLIC METHODS

        // #endregion
    }

    class SubLocation extends Location {
        // #region ~ CONSTRUCTOR
        constructor(locRef) {
            super(`SubLoc_${locRef}`);
            this._type = "SubLoc";
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
    Locations.CheckInstall();
    D.Log("Locations Ready!");
});
void MarkStop("Locations");
