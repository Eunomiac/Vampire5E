void MarkStart("Design")
const Design = (() => {
    // ************************************** START BOILERPLATE INITIALIZATION & CONFIGURATION **************************************
    const SCRIPTNAME = "Design",
        CHATCOMMAND = "!design",
        GMONLY = true,

    // #region COMMON INITIALIZATION
        STATEREF = C.ROOT[SCRIPTNAME],	// eslint-disable-line no-unused-vars
        VAL = (varList, funcName, isArray = false) => D.Validate(varList, funcName, SCRIPTNAME, isArray), // eslint-disable-line no-unused-vars
        DB = (msg, funcName) => D.DBAlert(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        LOG = (msg, funcName) => D.Log(msg, funcName, SCRIPTNAME), // eslint-disable-line no-unused-vars
        THROW = (msg, funcName, errObj) => D.ThrowError(msg, funcName, SCRIPTNAME, errObj), // eslint-disable-line no-unused-vars

        checkInstall = () => {
            C.ROOT[SCRIPTNAME] = C.ROOT[SCRIPTNAME] || {}
            initialize()
        },
        regHandlers = () => {
            on("chat:message", msg => {
                const args = msg.content.split(/\s+/u)
                if (msg.type === "api" && (!GMONLY || playerIsGM(msg.playerid) || msg.playerid === "API") && (!CHATCOMMAND || args.shift() === CHATCOMMAND)) {
                    const who = msg.who || "API",
                        call = args.shift()
                    handleInput(msg, who, call, args)
                }
            })
        },
    // #endregion

    // #region LOCAL INITIALIZATION
        initialize = () => { // eslint-disable-line no-empty-function
        },
    // #endregion	

    // #region EVENT HANDLERS: (HANDLEINPUT)
        handleInput = (msg, who, call, args) => { 	// eslint-disable-line no-unused-vars
        // const
            switch (call) {
                case "process": {
                    switch (args.shift().toLowerCase()) {
                        case "npcs": case "npc": {

                            break
                        }
                        // no default
                    }
                    break
                }
                // no default
            }
        }
    // #endregion
    // *************************************** END BOILERPLATE INITIALIZATION & CONFIGURATION ***************************************

    // Submit NPCs as follows:
    const SAMPLENPC = {
        Species: "Vampire",
        Rank: "++Ancilla",
        Sect: "Camarilla",
        SubSect: "Ventrue",
        Traits: ["Politician", "Leader", "Seducer"], // Put these in order of importance... or maybe make them keys, with number showing the importance
        Generation: "C",
        Blood: "C",
        Humanity: "D",
        Custom: {
            Charisma: 5, Intimidation: -1
        }

    }
    const TRAITWEIGHTS = { // Weight each stat on a scale of 1 - 5 re: how important it is. Use -1 if stat is CONTRA-INDICATED.
            Politician: {
                Attributes: {Charisma: 4, Manipulation: 4, Composure: 3, Wits: 3},
                Skills: {
                    Etiquette: 4, Insight: 4, Intimidation: 1, Persuasion: 4, Subterfuge: 3, 
                    Academics: 2, Awareness: 1, Finance: 3, Investigation: 1, Politics: 4
                },
                Advantages: {Resources: 3, Retainer: 3, Status: 3},
                Disciplines: {Auspex: 4, Presence: 4, Dominate: 4}
            },
            Schemer: {},
            Leader: {},
            Assassin: {},
            Spy: {},
            Enforcer: {},
            Bruiser: {},
            Survivor: {},
            Mastermind: {},
            Sorcerer: {},
            Gunman: {},
            Trickster: {},
            Seducer: {},
            Enigma: {},
            Horror: {},
            Doolittle: {},
            Scientist: {},
            Inventor: {},
            Mechanic: {},
            Sage: {},
            Medic: {},
            Burglar: {},
            Judge: {},
            Idealist: {},
            Swordsman: {},
            Loner: {},
            Socialite: {}
        },
        RANKS = {
            Mortal: {
                Mook: {},
                STD: {},
                Skilled: {},
                Gifted: {},
                Elite: {}
            },
            Ghoul: {},
            Fledgling: {},
            Neonate: {
                Attributes: 22,
                Skills: 0,
                Disciplines: 3,
                Generation: [14, 13, 13, 13, 12, 12, 12, 11, 11], // This range, as well as Blood and Humanity should be converted into "S, A, B, C, D, E, F"
                Blood: [1, 1, 1, 2, 2, 3],
                Humanity: [5, 6, 6, 6, 7, 7, 7, 7, 8, 8, 9]
            },
            Ancilla: {},
            Elder: {},
            Methuselah: {}
        },
        DISCTRAITS = {

        }
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
        RegisterEventHandlers: regHandlers,
        CheckInstall: checkInstall
    }
} )()

on("ready", () => {
    Design.RegisterEventHandlers()
    Design.CheckInstall()
    D.Log("Design Ready!")
} )
void MarkStop("Design")