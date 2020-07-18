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
    const imgSrcData = {
        District: ["Annex", "BayStFinancial", "Bennington", "Cabbagetown", "CentreIsland", "Chinatown", "Corktown", "Danforth", "DeerPark", "Discovery", "DistilleryDist", "DupontByTheCastle", "GayVillage", "HarbordVillage", "Humewood", "LibertyVillage", "LittleItaly", "LittlePortugal", "PATH", "RegentPark", "Riverdale", "Rosedale", "Sewers", "StJamesTown", "Summerhill", "Waterfront", "WestQueenWest", "Wychwood", "YongeHospital", "YongeMuseum", "YongeStreet", "Yorkville", "CityStreets", "LakeOntario", "disabled"],
        Site: ["AnarchBar", "ArtGallery", "BackAlley", "BayTower", "CasaLoma", "Cemetary", "CityApt1", "CityHall", "CityPark", "CNTower", "Docks", "Drake", "Elysium", "BrickWorks", "EvergreenPalisades", "FightClub", "CeramicsMuseum", "GayClub", "Distillery", "Laboratory", "LectureHall", "Library", "MadinaMasjid", "MiddleOfRoad", "Nightclub", "Office", "ParkingLot", "PMHospital", "ProfOffice", "RedemptionHouse", "RegentParkApt", "RogersCentre", "Rooftops", "ROM", "Sidewalk1", "Sidewalk2", "Sidewalk3", "SiteLotus", "SpawningPool", "StMichaelsCathedral", "StripClub", "StudentVillage", "SubwayStation", "SubwayTunnels", "UndergroundMedClinic", "UndergroundMedOffice", "WalkingPath", "WarrensAntechamber", "WychwoodPub", "YongeDundasSquare", "YorkvilleApt1", "YorkvilleApt2", "YouthShelter", "ChristiePitsPark", "VacantLot", "Vehicle5", "Vehicle2", "Vehicle4", "Vehicle7", "Yacht", "BillyBishopFerry", "TremereChantry", "HauntedMansion", "CabbagetownPenthouse", "GiovanniEstate", "AptCorridor", "AptStreetside", "AptLobby", "Stairwell", "Elevator", "GENERIC", "CLBallroom", "CLThroneRoom", "CLSittingRoom", "CLGrounds", "CLGallery", "Kensington", "TorontoWestern", "BBootyCells", "CLLibrary", "CLVestibule", "CLGreatHall", "CLOverlook", "CLTerrace", "CLDrawingRoom"],
        SubLoc: ["SiteLotus_LockeQuarters", "SiteLotus_NapierQuarters", "Security", "SiteLotus_RoyQuarters", "SiteLotus_AvaQuarters", "Laboratory", "GENERIC"],
        FocusHub: {
            "6Hub": ["TopRight", "Right", "Center", "MidCenter", "Left", "TopCenter", "TopLeft"]
        }
    };
    const mediaData = [
        ["DistrictCenter", {left: 795, top: 600, height: 455, width: 625}],
        ["SiteCenter", {left: 795, top: 876, height: 325, width: 440}],
        ["SiteCenter", {left: 795, top: 876, height: 258, width: 352}], // 6Hub
        ["SiteLeft", {left: 595, top: 876, height: 295, width: 400}],
        ["SiteLeft", {left: 520, top: 740, height: 233, width: 317}], // 6Hub
        ["SiteRight", {left: 995, top: 876, height: 295, width: 400}],
        ["SiteRight", {left: 1070, top: 740, height: 233, width: 317}], // 6Hub
        ["SubLocTopLeft", {left: 520, top: 751, height: 122, width: 165}],
        ["SubLocLeft", {left: 496, top: 874, height: 122, width: 165}],
        ["SubLocBotLeft", {left: 520, top: 997, height: 122, width: 165}],
        ["SubLocRight", {left: 1096, top: 875, height: 122, width: 165}],
        ["SubLocBotRight", {left: 1067, top: 997, height: 122, width: 165}],
        ["SubLocTopRight", {left: 1067, top: 752, height: 122, width: 165}],
        ["SiteBarCenter", {left: 795, top: 731, height: 37, width: 440}],
        ["SiteBarLeft", {left: 595, top: 744, height: 34, width: 400}],
        ["SiteBarRight", {left: 995, top: 744, height: 34, width: 400}],
        ["DistrictLeft", {left: 565, top: 550, height: 338, width: 460}],
        ["DistrictRight", {left: 1025, top: 550, height: 338, width: 460}],
        ["DisableLocRight", {left: 1016, top: 704, height: 679, width: 494}],
        ["DisableLocLeft", {left: 574, top: 704, height: 679, width: 494}],
        ["DisableSiteRight", {left: 997, top: 876, height: 327, width: 462}],
        ["DisableSiteLeft", {left: 593, top: 876, height: 327, width: 462}],
        ["DisableSiteBottomAll", {left: 795, top: 830, height: 451, width: 820}],
        ["SiteTopCenter", {left: 795, top: 410, height: 240, width: 326}],
        ["SiteMidCenter", {left: 795, top: 615, height: 266, width: 362}],
        ["SiteTopRight", {left: 1110, top: 530, height: 233, width: 317}],
        ["SiteTopLeft", {left: 480, top: 530, height: 233, width: 317}],
        ["SiteCenterTint", {left: 795, top: 876, height: 326, width: 441}],
        ["SiteLeftTint", {left: 595, top: 876, height: 296, width: 401}],
        ["SiteRightTint", {left: 995, top: 876, height: 296, width: 401}],
        ["SiteCenterTint", {left: 795, top: 876, height: 259, width: 353}], // 6Hub
        ["SiteLeftTint", {left: 520, top: 740, height: 234, width: 318}], // 6Hub
        ["SiteRightTint", {left: 1070, top: 740, height: 234, width: 318}], // 6Hub
        ["SiteMidCenterTint", {left: 795, top: 615, height: 267, width: 363}],
        ["SiteTopCenterTint", {left: 795, top: 410, height: 241, width: 327}],
        ["SiteTopLeftTint", {left: 480, top: 530, height: 234, width: 318}],
        ["SiteTopRightTint", {left: 1110, top: 530, height: 234, width: 318}],
        ["SiteFocusHub", {left: 795, top: 520, height: 1040, width: 1590}],
        ["SiteNameCenter", {left: 796, top: 733, height: 42, width: 262}],
        ["SiteNameLeft", {left: 595, top: 747, height: 42, width: 262}],
        ["SiteNameRight", {left: 995, top: 747, height: 42, width: 119}],
        ["SiteGenericCenterSong", {left: 795, top: 809, height: 26, width: 401}],
        ["SiteGenericCenterRes", {left: 795, top: 785, height: 32, width: 79}],
        ["SiteGenericCenterAspect", {left: 591, top: 837, height: 90, width: 415}],
        ["SiteGenericLeftRes", {left: 595, top: 795, height: 32, width: 84}],
        ["SiteGenericLeftSong", {left: 595, top: 818, height: 26, width: 203}],
        ["SiteGenericLeftAspect", {left: 402, top: 846, height: 22, width: 375}],
        ["SiteGenericRightRes", {left: 995, top: 795, height: 32, width: 79}],
        ["SiteGenericRightSong", {left: 995, top: 817, height: 26, width: 261}],
        ["SiteGenericRightAspect", {left: 803, top: 845, height: 22, width: 307}],
        ["HubAspectsTitle", {left: 967, top: 303, height: 26, width: 110}],
        ["HubAspectsNotice", {left: 967, top: 321, height: 96, width: 363}]
    ];
    const LOCATIONLAYOUTS = {
        "1-Center": {
            focusID: "1-Center",
            imgKeys: {
                District: ["DistrictCenter", {top: 0, left: 0, height: 0, width: 0}],
                Site: ["SiteCenter", {top: 0, left: 0, height: 0, width: 0}],
                SiteBar: ["SiteBarCenter", {top: 0, left: 0, height: 0, width: 0}],
                SiteName: ["SiteNameCenter", {top: 0, left: 0, height: 0, width: 0}],
                SiteSong: ["SiteSongCenter", {top: 0, left: 0, height: 0, width: 0}],
                SiteAspects: ["SiteAspectsCenter", {top: 0, left: 0, height: 0, width: 0}],
                SubLocs: [
                    ["SubLocBotLeft", {top: 0, left: 0, height: 0, width: 0}],
                    ["SubLocLeft", {top: 0, left: 0, height: 0, width: 0}],
                    ["SubLocTopLeft", {top: 0, left: 0, height: 0, width: 0}],
                    ["SubLocBotRight", {top: 0, left: 0, height: 0, width: 0}],
                    ["SubLocRight", {top: 0, left: 0, height: 0, width: 0}],
                    ["SubLocTopRight", {top: 0, left: 0, height: 0, width: 0}]
                ]
            },
            bounds: {
                topEdge: 0,
                leftEdge: 0,
                bottomEdge: C.SANDBOX.height,
                rightEdge: C.SANDBOX.width
            }
        },
        "2-Left": {
            focusID: "2-Left",
            get imgKeys() {
                return {
                    District: Location["2-Right"] && Location["2-Right"].District === Location["2-Left"].District
                        ? ["DistrictCenter", {top: 0, left: 0, height: 0, width: 0}]
                        : ["DistrictLeft", {top: 0, left: 0, height: 0, width: 0}]
                };
            }
        }
    };

    // #endregion
    // #region CLASS DEFINITIONS
    class Location {
        static get LIB() { return this._LIB }
        static set LIB(v) { Object.assign(this._LIB, {[v.focusID]: v}) }

        static ReportState(locAsset) {}
        static Register(locAsset, focusID) {
            if (focusID in LOCATIONLAYOUTS) {
                locAsset.focusID = focusID;
                locAsset.imgKeys = LOCATIONLAYOUTS[focusID].imgKeys;
                locAsset.bounds = LOCATIONLAYOUTS[focusID].bounds;
                this.LIB = locAsset;
            }
        }
        static ApplyLocations() {}
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
            if (this.onEntryCall)
                D.Call(this.onEntryCall);
            // setSoundScape();
            // findCharsInLoc();
            // activateRollEffects();
            // activateStatEffects();
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
    Locations.CheckInstall();
    D.Log("Locations Ready!");
});
void MarkStop("Locations");
