const fs = require("fs");
const _ = require("underscore");

const filePath = "C:\\Users\\Ryan\\Documents\\Projects\\!Roleplaying\\!!!VAMPIRE\\!CODE\\Vampire5E\\!!!Character Sheet\\";

const JSONData = {
    Napier: {
        23: [
            {
                name: "xp_summary",
                current: "199 XP Earned - 155 XP Spent =  44 XP Remaining",
                max: "",
                id: "-LU7dsfS20fV0ZfSn1gO"
            },
            {
                name: "repeating_earnedxp_-LOL0MvLYsuljyZCFymk_xp_award",
                current: "15",
                max: "",
                id: "-LU7dsfTOeGpyj3vduPs"
            },
            {
                name: "repeating_earnedxp_-LOL0MvLYsuljyZCFymk_xp_session",
                current: "Zero",
                max: "",
                id: "-LU7dsfU3R2T2spwB8Do"
            },
            {
                name: "repeating_earnedxp_-LOL0MvLYsuljyZCFymk_xp_reason",
                current: "Initial XP awarded at the beginning of the Chronicle.",
                max: "",
                id: "-LU7dsfVkJbPIJ_AULQI"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_category",
                current: "Clan Discipline",
                max: "",
                id: "-LU7dsg65B78RevMdfgF"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_trait",
                current: "Auspex",
                max: "",
                id: "-LU7dsgBCaxyUWZSmYxS"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_cost",
                current: 10,
                max: "",
                id: "-LU7dsgBCaxyUWZSmYxT"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_initial",
                current: "1",
                max: "",
                id: "-LU7dsgCOeusF4xqj-Er"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_new",
                current: "2",
                max: "",
                id: "-LU7dsgDSFTywmIsd-UH"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_category",
                current: "Advantage",
                max: "",
                id: "-LU7dsgE1g-ZcqaSs3T5"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_initial",
                current: "1",
                max: "",
                id: "-LU7dsgKwRm4CizlXOgL"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_new",
                current: "2",
                max: "",
                id: "-LU7dsgKwRm4CizlXOgM"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_trait",
                current: "Contacts (Pharma)",
                max: "",
                id: "-LU7dsgLQNtgCBtkxE5K"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_cost",
                current: 3,
                max: "",
                id: "-LU7dsgN1U_lCGqVcjXf"
            },
            {
                name: "repeating_earnedxp_-LOaOePNOjwmn9CW4oWY_xp_award",
                current: "1",
                max: "",
                id: "-LU7dsgSWCLOyRsMBRgZ"
            },
            {
                name: "repeating_earnedxp_-LOaOePNOjwmn9CW4oWY_xp_session",
                current: "Zero",
                max: "",
                id: "-LU7dsgTvwZyuVyVIKFo"
            },
            {
                name: "repeating_earnedxp_-LOaOePNOjwmn9CW4oWY_xp_reason",
                current: "Creating a relationship hook with Ava Wong, Jo's character.",
                max: "",
                id: "-LU7dsgUp-HAuSj8WEXb"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_category",
                current: "Advantage",
                max: "",
                id: "-LU7dsgb2xsXU_GgWYM7"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_trait",
                current: "Herd (Field Clinic)",
                max: "",
                id: "-LU7dsggjBc6iL4RCRL2"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_cost",
                current: 6,
                max: "",
                id: "-LU7dsgh_l4mYMwRQVOM"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_new",
                current: "2",
                max: "",
                id: "-LU7dsgiSKNG6GABne89"
            },
            {
                name: "repeating_earnedxp_-LPOmiZY-6Q2SB8AQJM3_xp_award",
                current: "4",
                max: "",
                id: "-LU7dsgzdz2k03LFmc-J"
            },
            {
                name: "repeating_earnedxp_-LPOmiZY-6Q2SB8AQJM3_xp_session",
                current: "One",
                max: "",
                id: "-LU7dsh-vXsqmVu0ya-r"
            },
            {
                name: "repeating_earnedxp_-LPOmiZY-6Q2SB8AQJM3_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LU7dsh-vXsqmVu0ya-s"
            },
            {
                name: "repeating_earnedxp_-LPqtifvc9bwzYpsuJ1E_xp_award",
                current: "9",
                max: "",
                id: "-LU7dsh20g95XujQISZm"
            },
            {
                name: "repeating_earnedxp_-LPqtifvc9bwzYpsuJ1E_xp_session",
                current: "Zero",
                max: "",
                id: "-LU7dsh49rRPOBaaYZVw"
            },
            {
                name: "repeating_earnedxp_-LPqtifvc9bwzYpsuJ1E_xp_reason",
                current: "Completing character sheet by the Thursday deadline..",
                max: "",
                id: "-LU7dsh5zLm2FK9bISAV"
            },
            {
                name: "_reporder_repeating_earnedxp",
                current: "-LOL0MvLYsuljyZCFymk,-LOaOePNOjwmn9CW4oWY,-LPOmiZY-6Q2SB8AQJM3,-LPqtifvc9bwzYpsuJ1E,-LQi-2PfA4iwP7T7FFzt,-LQi-J171uzZXnC-vewh,-LRuzhHXwCUYV11KaaRK,-LRuziGli9eaOsLceHIK,-LVaIa8cnzXhum3lscuA,-LVaUKCH8TkCB8LFBooF,-LWiZi6KpdjLcOZCbaEr,-LXqZadBzvNwHnZYVjSJ,-LYxynFLlUntenrPS096,-LZ5sM79KlGe1HsFHZ2Q,-LZebfVoomwhK3XT9ySl,-LaDZU7-WlQ8HINIY4n4,-LaJFzzQTdwQ7oBqAZxI,-LcTot98UDVjxP7TtFvp,-LfnNrdt2tIZesVzbVcg,-Lfr67XLUkO-SkkBZdJo,-LgQ6z3as9GpFCbjpUj0,-LigHrgA9V07wM4lWHam,-LjltnC3p9FqCfZD5tNJ,-LjnG66NboEtrmwVaKoq,-LjnOWqutTVfJX2RLYXV,-Ljodc6N8qIcdweBNiPc",
                max: "",
                id: "-LU7dsh6HHew8O2CJ1Oq"
            },
            {
                name: "repeating_earnedxp_-LQi-2PfA4iwP7T7FFzt_xp_award",
                current: "2",
                max: "",
                id: "-LU7dsi4LQiQ-BfVekWV"
            },
            {
                name: "repeating_earnedxp_-LQi-2PfA4iwP7T7FFzt_xp_session",
                current: "Two",
                max: "",
                id: "-LU7dsi5MCKNYf7Ff2ti"
            },
            {
                name: "repeating_earnedxp_-LQi-2PfA4iwP7T7FFzt_xp_reason",
                current: "Three Troubled Thin-Bloods: Story completion award.",
                max: "",
                id: "-LU7dsi7-0sCgAbrOxuf"
            },
            {
                name: "repeating_earnedxp_-LQi-J171uzZXnC-vewh_xp_award",
                current: "5",
                max: "",
                id: "-LU7dsi8Su9MeDOz5xFm"
            },
            {
                name: "repeating_earnedxp_-LQi-J171uzZXnC-vewh_xp_session",
                current: "Two",
                max: "",
                id: "-LU7dsi8Su9MeDOz5xFn"
            },
            {
                name: "repeating_earnedxp_-LQi-J171uzZXnC-vewh_xp_reason",
                current: "Excellent Loresheet for Netchurch.",
                max: "",
                id: "-LU7dsiA_oBXO79dZGJh"
            },
            {
                name: "xp_earnedtotal",
                current: 199,
                max: "",
                id: "-LU7dsiC3A8UvJY9Cp0_"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_category",
                current: "Advantage",
                max: "",
                id: "-LU7dsiEfKr6snYfoQVb"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_trait",
                current: "Mask (John  Nate)",
                max: "",
                id: "-LU7dsiI1-Q0jyG_vvCj"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_cost",
                current: 6,
                max: "",
                id: "-LU7dsiK4o70oLvQy0e3"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_new",
                current: "2",
                max: "",
                id: "-LU7dsiK4o70oLvQy0e4"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_category",
                current: "Advantage",
                max: "",
                id: "-LU7dsiMEqNHwldkjukn"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_new",
                current: "1",
                max: "",
                id: "-LU7dsiRXkLPqKUHepgq"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_trait",
                current: "Loresheet (Newchurch)",
                max: "",
                id: "-LU7dsiSfQVyOFXI8dhL"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_cost",
                current: 3,
                max: "",
                id: "-LU7dsiT8j81f1UwutdK"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_category",
                current: "Skill",
                max: "",
                id: "-LU7dsiUJn4qVdb2NiTb"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_trait",
                current: "Etiquette",
                max: "",
                id: "-LU7dsi_tMrvLJ-TvJI3"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_cost",
                current: 6,
                max: "",
                id: "-LU7dsibpVJRHCse_1Fd"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_initial",
                current: "1",
                max: "",
                id: "-LU7dsicdwymwHnMheLi"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_new",
                current: "2",
                max: "",
                id: "-LU7dsidqunFZghJHr2h"
            },
            {
                name: "repeating_earnedxp_-LRuzhHXwCUYV11KaaRK_xp_award",
                current: "2",
                max: "",
                id: "-LU7dsikmIhegvzBOP6e"
            },
            {
                name: "repeating_earnedxp_-LRuzhHXwCUYV11KaaRK_xp_session",
                current: "Two",
                max: "",
                id: "-LU7dsimDxL1HctsLEsP"
            },
            {
                name: "repeating_earnedxp_-LRuzhHXwCUYV11KaaRK_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LU7dsincl0X13iLrapW"
            },
            {
                name: "repeating_earnedxp_-LRuziGli9eaOsLceHIK_xp_award",
                current: "2",
                max: "",
                id: "-LU7dsincl0X13iLrapX"
            },
            {
                name: "repeating_earnedxp_-LRuziGli9eaOsLceHIK_xp_session",
                current: "Three",
                max: "",
                id: "-LU7dsip77G68eB-CcQ8"
            },
            {
                name: "repeating_earnedxp_-LRuziGli9eaOsLceHIK_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LU7dsirpLUrpZQrNkhg"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_category",
                current: "Skill",
                max: "",
                id: "-LU7dsjYK1rTdQPBYuaY"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_trait",
                current: "Intimidate",
                max: "",
                id: "-LU7dsjdDciAuI5GkOEp"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_cost",
                current: 3,
                max: "",
                id: "-LU7dsjeL5oJmluaj97W"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_new",
                current: "1",
                max: "",
                id: "-LU7dsjfA76W8xOAXO14"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_category",
                current: "Advantage",
                max: "",
                id: "-LU7dsjhkGxyRupA50F9"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_trait",
                current: "Herd (Bookies)",
                max: "",
                id: "-LU7dsjnymOoJa1zTmtf"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_cost",
                current: 9,
                max: "",
                id: "-LU7dsjoESYSD0iSp4k-"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_new",
                current: "3",
                max: "",
                id: "-LU7dsjoESYSD0iSp4k0"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LU7dsk8Q3vUQRRfcs5D"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LU7dsk9ehE62NSNlU5n"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LU7dskAIYma6A2g2aI5"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LU7dskAIYma6A2g2aI6"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LU7dskCzmlfYGDlMuKn"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LU7dskDfBpSGoqnqDyY"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LU7dskEk49SZtcoouXE"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LU7dskFczQG6FqKA7hC"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LU7dskGglgmOmTIxQ4j"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LU7dskH_2nARamCKY_n"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LU7dskIC5-zPyXJEpFd"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LU7dskJYBr1IR9Z0X7I"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LU7dskKv4ViLEoyHtdt"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LU7dskLPpKWfkzuOfdP"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LU7dskM1Zrlt0Y4dZV7"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LU7dskOHtRiMD34RzHr"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LU7dskOHtRiMD34RzHs"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LU7dskPKwucHV02a73a"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LU7dskQAMCfoGNlT-A0"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LU7dskSBBxQbVB5R6WQ"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LU7dskSBBxQbVB5R6WR"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LU7dskTAmkLWXyM8PtR"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LU7dskV1vfDz5kPn-p8"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LU7dskV1vfDz5kPn-p9"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LU7dskXRSgyVDiG3gpr"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LU7dskXRSgyVDiG3gps"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LU7dskZ4ym3FbegJQZs"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LU7dsk_5dJKmaTtRGT4"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LU7dskaun2kTMYuOe9_"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LU7dskczmNnaAqcD-yZ"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LU7dskczmNnaAqcD-y_"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LU7dskeCbiowJSD2_rV"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LU7dskfz4HOm0cFTYsg"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LU7dskgaYdFTlovs3PK"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LU7dskig4XsQc6LW9on"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LU7dskig4XsQc6LW9oo"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LU7dskjH3JWxc3-5iua"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LU7dskkZA-Xr9sCQTRi"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LU7dskmiu_-W4Cpgm1T"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LV0qHb-CYsiA84QpmAY"
            },
            {
                name: "repeating_earnedxp_-LOL0MvLYsuljyZCFymk_sorttrigger",
                current: false,
                max: "",
                id: "-LVEAPQXrE1zbcZHbst0"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_category",
                current: "Advantage",
                max: "",
                id: "-LV_mITqc93u0_eotwkV"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LV_mIWqN9eJumY9jsw0"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LV_mIWtKlnKwX0CUXcY"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LV_mIWuKsHGZRwh4f2C"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LV_mIWx28i-itiFKNqE"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_trait",
                current: "Loresheet (Newchurch)",
                max: "",
                id: "-LV_mMTgFxoX83D8tpLv"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_cost",
                current: 12,
                max: "",
                id: "-LV_mMW6AKRWITCDShQi"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_new",
                current: "4",
                max: "",
                id: "-LV_mMiQpp-1cjoO0dYc"
            },
            {
                name: "repeating_earnedxp_-LVaIa8cnzXhum3lscuA_xp_award",
                current: "1",
                max: "",
                id: "-LVaIa8W73iarDbF1qat"
            },
            {
                name: "repeating_earnedxp_-LVaIa8cnzXhum3lscuA_xp_session",
                current: "Three",
                max: "",
                id: "-LVaIa8YhtTEmK6nls1G"
            },
            {
                name: "repeating_earnedxp_-LVaIa8cnzXhum3lscuA_xp_reason",
                current: "Playing NPCs during Memoriam.",
                max: "",
                id: "-LVaIa8Z8Ug0M6WDL401"
            },
            {
                name: "repeating_earnedxp_-LVaUKCH8TkCB8LFBooF_xp_award",
                current: "1",
                max: "",
                id: "-LVaUKCANb4qp5STF4Xt"
            },
            {
                name: "repeating_earnedxp_-LVaUKCH8TkCB8LFBooF_xp_session",
                current: "Four",
                max: "",
                id: "-LVaUKCCvYSuYsON_F9G"
            },
            {
                name: "repeating_earnedxp_-LVaUKCH8TkCB8LFBooF_xp_reason",
                current: "Session XP award (albeit smaller, given the short session).",
                max: "",
                id: "-LVaUKCDh-G4Pny5J3UE"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_category",
                current: "Advantage",
                max: "",
                id: "-LWhp-8Z0z7VL715DHLx"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LWhp-B17gx45ilyEH6M"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LWhp-B4GadFXeVnSn5-"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LWhp-B7tCOPxYJRKrPF"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LWhp-B9R2E_suqwxfKd"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_trait",
                current: "Mawla",
                max: "",
                id: "-LWhp1a3OX9T86rUmxsl"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_cost",
                current: 3,
                max: "",
                id: "-LWhp1cL0LvmYSRdUarj"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_initial",
                current: "3",
                max: "",
                id: "-LWhp1olXXjgx5EAuQ_l"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_new",
                current: "4",
                max: "",
                id: "-LWhp2C361HWrKWTl1jz"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LWhp2s3_pmQ4-qJvvXt"
            },
            {
                name: "repeating_earnedxp_-LWiZi6KpdjLcOZCbaEr_xp_award",
                current: "2",
                max: "",
                id: "-LWiZi6HVVI0Tpv4xX3k"
            },
            {
                name: "repeating_earnedxp_-LWiZi6KpdjLcOZCbaEr_xp_session",
                current: "Five",
                max: "",
                id: "-LWiZi6JmXPD1lUAStjt"
            },
            {
                name: "repeating_earnedxp_-LWiZi6KpdjLcOZCbaEr_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LWiZi6KeH_5iisHwvPN"
            },
            {
                name: "repeating_earnedxp_-LXqZadBzvNwHnZYVjSJ_xp_award",
                current: "2",
                max: "",
                id: "-LXq_ad4X8uvHIXKJKuH"
            },
            {
                name: "repeating_earnedxp_-LXqZadBzvNwHnZYVjSJ_xp_session",
                current: "Six",
                max: "",
                id: "-LXq_ad63ZTDUT-9v42T"
            },
            {
                name: "repeating_earnedxp_-LXqZadBzvNwHnZYVjSJ_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LXq_ad8V6D2_S4w9nK6"
            },
            {
                name: "repeating_earnedxp_-LYxynFLlUntenrPS096_xp_award",
                current: "1",
                max: "",
                id: "-LYxynFHhgbamzr3XpWf"
            },
            {
                name: "repeating_earnedxp_-LYxynFLlUntenrPS096_xp_session",
                current: "Six",
                max: "",
                id: "-LYxynFJAuvWkXaWsQjP"
            },
            {
                name: "repeating_earnedxp_-LYxynFLlUntenrPS096_xp_reason",
                current: "Roleplaying an NPC in Ava's Memoriam",
                max: "",
                id: "-LYxynFKLPTy83DwciR1"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_category",
                current: "Attribute",
                max: "",
                id: "-LYyAOZ3JM8VsKmb08m4"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LYyAOcZvyjKsarDr4GE"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LYyAOcb3ivmAGdiHuk1"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LYyAOcePFw-7Gfs29Uh"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LYyAOchCS1v2E-CYrwh"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_trait",
                current: "Intelligence",
                max: "",
                id: "-LYyAQFgKjNd1u1843AS"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_cost",
                current: 20,
                max: "",
                id: "-LYyAQINp2oUIGrmccyP"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_initial",
                current: "3",
                max: "",
                id: "-LYyAQzbfl_frsI39IlW"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_new",
                current: "4",
                max: "",
                id: "-LYyARVhI7Z9H-hsrdAF"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LYypmjhYMQ1tUEIWADm"
            },
            {
                name: "repeating_earnedxp_-LZ5sM79KlGe1HsFHZ2Q_xp_award",
                current: "2",
                max: "",
                id: "-L_5sM73Y4YQbl_i1zN8"
            },
            {
                name: "repeating_earnedxp_-LZ5sM79KlGe1HsFHZ2Q_xp_session",
                current: "Seven",
                max: "",
                id: "-L_5sM74yWaL_ou_jUfI"
            },
            {
                name: "repeating_earnedxp_-LZ5sM79KlGe1HsFHZ2Q_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-L_5sM76M23950gK0yLy"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_category",
                current: "Clan Discipline",
                max: "",
                id: "-L_eHr2OnVtWWYD7VrtC"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-L_eHr7G1Y9BpUfB8jJl"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-L_eHr7Kq3LgLCySjMgQ"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_new_toggle",
                current: 1,
                max: "",
                id: "-L_eHr7NV18hh0tmQmay"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-L_eHr7QetqGGToT1KwI"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_trait",
                current: "Obfuscate 4 2 xp locked Requires BP 2",
                max: "",
                id: "-L_eHsoEM1XWOIXWo4Jp"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_cost",
                current: 20,
                max: "",
                id: "-L_eHsqkUp906P7Dg-2y"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_initial",
                current: "3",
                max: "",
                id: "-L_eHt5iUlribPPIAx5D"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_new",
                current: "4",
                max: "",
                id: "-L_eHtVPvUwrL3qJRNEH"
            },
            {
                name: "repeating_earnedxp_-LZebfVoomwhK3XT9ySl_xp_award",
                current: "3",
                max: "",
                id: "-L_ebfVhh0k3lk6FpS3I"
            },
            {
                name: "repeating_earnedxp_-LZebfVoomwhK3XT9ySl_xp_session",
                current: "Eight",
                max: "",
                id: "-L_ebfVjdejaYLDfhvBi"
            },
            {
                name: "repeating_earnedxp_-LZebfVoomwhK3XT9ySl_xp_reason",
                current: "Playing Alex the Lasombra during King's Memoriam, and playing him really, really, REALLY well.",
                max: "",
                id: "-L_ebfVkhicw9qbj-ZJU"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_category",
                current: "Advantage",
                max: "",
                id: "-LaDPW5RoMLmX_QcTpOv"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LaDPW9ny6wLrjfDBdVa"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LaDPW9qgrVtZE9viyu6"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LaDPW9tdPavOvV3E2Ax"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LaDPW9wJyveCW1WuORy"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_new",
                current: "1",
                max: "",
                id: "-LaDPXEVoSRc8Krw4KUp"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_trait",
                current: "Contacts The Aristocrat",
                max: "",
                id: "-LaDP_WzXtpQZAzrUN_R"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_cost",
                current: 3,
                max: "",
                id: "-LaDP_ZoyKMBWUAIo7kR"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LaDPc5yf2SqfJdTuSTL"
            },
            {
                name: "repeating_earnedxp_-LaDZU7-WlQ8HINIY4n4_xp_award",
                current: "2",
                max: "",
                id: "-LaDZU6sxDM7vwsNlWvk"
            },
            {
                name: "repeating_earnedxp_-LaDZU7-WlQ8HINIY4n4_xp_session",
                current: "Eight",
                max: "",
                id: "-LaDZU6uHtl54V9K5jz4"
            },
            {
                name: "repeating_earnedxp_-LaDZU7-WlQ8HINIY4n4_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LaDZU6wiNPqLl6u0Qve"
            },
            {
                name: "repeating_earnedxp_-LaJFzzQTdwQ7oBqAZxI_xp_award",
                current: "9",
                max: "",
                id: "-LaJFzzJKQltzCvWoiJM"
            },
            {
                name: "repeating_earnedxp_-LaJFzzQTdwQ7oBqAZxI_xp_session",
                current: "Nine",
                max: "",
                id: "-LaJFzzLTk2zEpQDwpwl"
            },
            {
                name: "repeating_earnedxp_-LaJFzzQTdwQ7oBqAZxI_xp_reason",
                current: "Refund for lost Herd (Patients) Background",
                max: "",
                id: "-LaJFzzNUiZiwXDPPnYG"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_category",
                current: "Skill",
                max: "",
                id: "-Laaqmrn-eykvLsYMStY"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-Laaqmw1uGWDJY8NEKBi"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-Laaqmw5msEI1aBaO5ck"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_new_toggle",
                current: 1,
                max: "",
                id: "-Laaqmw8-S2DFaRtztx6"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LaaqmwBlu_c-P1dZh5d"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_trait",
                current: "Crafts",
                max: "",
                id: "-LaaqobO4oPGI69_OCF-"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_cost",
                current: 3,
                max: "",
                id: "-LaaqoeiFpY-nZiNa5Fo"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_new",
                current: "1",
                max: "",
                id: "-LaaqpNU8klQrPnacpPs"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_category",
                current: "Advantage",
                max: "",
                id: "-Laart91ZCLxtLHg4Of3"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_cost",
                current: 6,
                max: "",
                id: "-LaartD1DouSuykAxpEW"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LaartD4LL1drSi9gZg5"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LaartD6NJOcTqwVxhTY"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LaartD9MQtHbsUOMgLz"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_initial",
                current: "1",
                max: "",
                id: "-Laartc_4FXKJ2k4PBab"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_new",
                current: "3",
                max: "",
                id: "-LaarttxVbwWpedzr76j"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LaarvKGTt1UbC76zo7A"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_category",
                current: "Clan Discipline",
                max: "",
                id: "-LaatALtON0BbKb5-3UO"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LaatAPN-lcTrsKJGSHd"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LaatAPQXe12GsGHOWoY"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LaatAPThBoY3PZFny0t"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LaatAPWzNDqqQTRPAo8"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_trait",
                current: "Dominate",
                max: "",
                id: "-LaatBRSvBpZoaqSteYS"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_cost",
                current: 10,
                max: "",
                id: "-LaatBUauWBxLHdD1xFq"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_initial",
                current: "1",
                max: "",
                id: "-LaatBazhlasCZVk4DFR"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_new",
                current: "2",
                max: "",
                id: "-LaatBtS9o0-y68RUYJX"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LaatCPGpioj9QJJ3afH"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LamJ5_K6az5_x4xvLHd"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_trait",
                current: "Contacts (The Aristocrat)",
                max: "",
                id: "-LamJ9FF6zEvAhkQoN1k"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LamJ9GCj2mOTq0Ihlpe"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_category",
                current: "Advantage",
                max: "",
                id: "-Lam__YC1yv94KBczScd"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-Lam__arvQ17MXoQF1Y-"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-Lam__avM340SskSKf-V"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_new_toggle",
                current: 1,
                max: "",
                id: "-Lam__ayamMQ_RZFgvJa"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-Lam__b1BRV0mCueget8"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_new",
                current: "2",
                max: "",
                id: "-Lam_aWjATbj6FFmET37"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_trait",
                current: "Herd 2  (Mobile Clinic)",
                max: "",
                id: "-Lam_lBi5a-f2FbcjYjn"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_cost",
                current: 6,
                max: "",
                id: "-Lam_lExMpW6ARcdMAKl"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-Lam_lt0od-CfC8-EChZ"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-Lbu5xVR-pXLHKFd0Ih4"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_spent_toggle",
                current: "0",
                max: "",
                id: "-LbuC7cUMRK-yQMDu8g1"
            },
            {
                name: "_reporder_repeating_spentxp",
                current: "-LOaLKRRBwYLz4EGdCWa,-LOaLRdJZb62plNm2LGK,-LOipUBMR4NWs3k5GEMN,-LRdS35zqTQZQSURSm0W,-LRdSaN5g-7rXous9qKE,-LRdSoczJpI7MPcxJSPg,-LTL-ZtVHOqFSwj8w35j,-LTL-dsRy3hS1eV9-Dvs,-LVZm9yaQfsARLurUGaq,-LVZmEeaBHCO0YGJaWBa,-LWhozCSF8j9IDqUmJQd,-LYyANiuyhrlaA1Y7G1R,-LZ5rlYr6PCoVu8bscs4,-LaDPUXGNfv90L0xsZ0D,-Laaqm0ZYo2-3jPmwnAk,-Laars8DEDz12BI4opac,-Laat9YRzAJyyac3wEll,-LamZZEZsLH9V4x2-1q7,-LZeHqQ8nruWFSCMw736",
                max: "",
                id: "-LbuDmslDp46AMhVHUAy"
            },
            {
                name: "repeating_earnedxp_-LcTot98UDVjxP7TtFvp_xp_award",
                current: "2",
                max: "",
                id: "-LcTot92Ywe58d-aYICO"
            },
            {
                name: "repeating_earnedxp_-LcTot98UDVjxP7TtFvp_xp_session",
                current: "Nine",
                max: "",
                id: "-LcTot96TmNHAKkE_28w"
            },
            {
                name: "repeating_earnedxp_-LcTot98UDVjxP7TtFvp_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LcTot99VXNvzWND9d_Y"
            },
            {
                name: "repeating_earnedxpright_-LcTovRyOSTSUNeZYjIl_xp_award",
                current: 2,
                max: "",
                id: "-LcTovRrxu7TTRrj4x9-"
            },
            {
                name: "repeating_earnedxpright_-LcTovRyOSTSUNeZYjIl_xp_session",
                current: "Twenty",
                max: "",
                id: "-LcTovRuBVccWp54c_iW"
            },
            {
                name: "repeating_earnedxpright_-LcTovRyOSTSUNeZYjIl_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-LcTovRxM6NiXkXwLVYv"
            },
            {
                name: "repeating_earnedxpright_-LfnNrb3g2IpHPbvss23_xp_award",
                current: 2,
                max: "",
                id: "-LfnNrax8vjN3hLSIrBf"
            },
            {
                name: "repeating_earnedxpright_-LfnNrb3g2IpHPbvss23_xp_session",
                current: "Twenty-One",
                max: "",
                id: "-LfnNrb2N6ZpHZ5a1xlI"
            },
            {
                name: "repeating_earnedxpright_-LfnNrb3g2IpHPbvss23_xp_reason",
                current: "Your unending patience!",
                max: "",
                id: "-LfnNrb5Evv7mqqWoh50"
            },
            {
                name: "repeating_earnedxp_-LfnNrdt2tIZesVzbVcg_xp_award",
                current: "2",
                max: "",
                id: "-LfnNrdmgzKKjqFuQPhn"
            },
            {
                name: "repeating_earnedxp_-LfnNrdt2tIZesVzbVcg_xp_session",
                current: "Nine",
                max: "",
                id: "-LfnNrdrZWIMGOWwimCc"
            },
            {
                name: "repeating_earnedxp_-LfnNrdt2tIZesVzbVcg_xp_reason",
                current: "Scheer's Strike: Story completion award.",
                max: "",
                id: "-LfnNrdvkv4LaOiBWB_D"
            },
            {
                name: "_reporder_repeating_earnedxpright",
                current: "-LcTovNZ8XnpuNyvFnnm,-LcTovPBETC3Nx50A-ic,-LcTovQcTsYAZ3Goq91l,-LcTovRyOSTSUNeZYjIl,-LfnNrb3g2IpHPbvss23,-Lfr5Kli9kw5oo7qK2kp,-Lfr67TsoW4AcYz3yZuE,-LgPhoGYQVMHB0dQtlG3,-LgQ6z0-LEq3-YIEEDZ2,-LgQ7125wPQzDqnyY4r0,-LigID0vC6PRzpkH2yTi,-LigJJGg4UocCcY3nikh,-Ljltn7lAOIi7EZdBNQ7,-Ljoe69N3PFKw8rpggxm,-LjoeIlWFN2ChLqOVxV5,-LkvQPgPoKSnheOiDFoq,-LmCusV7l9ymS-5NKXoE,-LoIju1OFhVFMbYpmYRd,-LoKrRVMT6hIquIyoaeZ,-LoZBXteanfysoKkjm43,-LtvwTSWonGuZWmZLgmv,-LtvwdWKNqYGgiBp1RRo,-Ltvwkm-62dE1JoAfVla,-LtwWxs5LddvE07tC9yx,-LuVYjA7Fjs6oTzmNXSA,-LyGozzViXZXqrtrpljd,-LyRvkRe4VMcOP8vfqCU,-LzZIc7ZkSy6s5c4ndOE,-LzZIgVK2CiPK1Q75eOI,-M-HQ4RLcHBOyJrqFq-B,-Lz5Z07tZ8HvEzxAwu5q,-LzZvY2HwDMCZA1-fZcZ",
                max: "",
                id: "-LfnNrfCMyCNmW5eCSkK"
            },
            {
                name: "repeating_earnedxpright_-Lfr5Kli9kw5oo7qK2kp_xp_award",
                current: 2,
                max: "",
                id: "-Lfr5KlawsivpL2Sonf4"
            },
            {
                name: "repeating_earnedxpright_-Lfr5Kli9kw5oo7qK2kp_xp_session",
                current: "Twenty-One",
                max: "",
                id: "-Lfr5Klh82epzMaKqciU"
            },
            {
                name: "repeating_earnedxpright_-Lfr5Kli9kw5oo7qK2kp_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-Lfr5KlmlvEt1DHxn40f"
            },
            {
                name: "repeating_earnedxpright_-Lfr67TsoW4AcYz3yZuE_xp_award",
                current: 1,
                max: "",
                id: "-Lfr67TkQeTKbHhbmSXv"
            },
            {
                name: "repeating_earnedxpright_-Lfr67TsoW4AcYz3yZuE_xp_session",
                current: "Twenty-One",
                max: "",
                id: "-Lfr67TraAQntTaW3IIM"
            },
            {
                name: "repeating_earnedxpright_-Lfr67TsoW4AcYz3yZuE_xp_reason",
                current: "Excellent in-character ghoul play",
                max: "",
                id: "-Lfr67Tuz_Nnpr4u-nP4"
            },
            {
                name: "repeating_earnedxp_-Lfr67XLUkO-SkkBZdJo_xp_award",
                current: "2",
                max: "",
                id: "-Lfr67XDQfKfM9nTME6K"
            },
            {
                name: "repeating_earnedxp_-Lfr67XLUkO-SkkBZdJo_xp_session",
                current: "Ten",
                max: "",
                id: "-Lfr67XIjcPxxGB_ch_H"
            },
            {
                name: "repeating_earnedxp_-Lfr67XLUkO-SkkBZdJo_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-Lfr67XLK4u0rEyW1WQk"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_category",
                current: "Advantage",
                max: "",
                id: "-LgPhl8VwZWrQhfvPz30"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LgPhlYuySh-msc3M9qZ"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LgPhlZ0FCUFXt-9p2oh"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LgPhlZ4gFbGW6XrgAQa"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LgPhlZAYUTf0CMomQJt"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_new",
                current: "1",
                max: "",
                id: "-LgPhmIwj_TtZdvq2yFk"
            },
            {
                name: "repeating_earnedxpright_-LgPhoGYQVMHB0dQtlG3_xp_award",
                current: 2,
                max: "",
                id: "-LgPhoGQsdkdOaeGxJaI"
            },
            {
                name: "repeating_earnedxpright_-LgPhoGYQVMHB0dQtlG3_xp_session",
                current: "Twenty-Two",
                max: "",
                id: "-LgPhoGWQZIAKJh1hhXz"
            },
            {
                name: "repeating_earnedxpright_-LgPhoGYQVMHB0dQtlG3_xp_reason",
                current: "Refund for Haven Warding purchase",
                max: "",
                id: "-LgPhoGZENwvKqtTRZpT"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_trait",
                current: "Haven Warding Merit",
                max: "",
                id: "-LgPhoV7bwo2zhqe0X8y"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_cost",
                current: 3,
                max: "",
                id: "-LgPhoXY56C0V4gZQKh6"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LgPhonpCuImi4Ud3c5N"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_category",
                current: "Advantage",
                max: "",
                id: "-LgPu9ufkuSNKCXivRQj"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LgPu9zP8vWgQSk9WLAK"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LgPu9zZH8CFnSKJLLLQ"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LgPu9zdRJBglwxveFuf"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LgPu9zoj9aU-Us4z6t8"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_trait",
                current: "Loresheet (Netchurch)",
                max: "",
                id: "-LgPuDDH_6bKmL9yw4YH"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_cost",
                current: 6,
                max: "",
                id: "-LgPuDHIRa_rM8w8O_C-"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_new",
                current: "2",
                max: "",
                id: "-LgPuEIYmRXnBcF2Vao9"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LgPuyemGKgBy6N6LsmP"
            },
            {
                name: "repeating_earnedxpright_-LgQ6z0-LEq3-YIEEDZ2_xp_award",
                current: 1,
                max: "",
                id: "-LgQ6z-rP7AWGpp69ad0"
            },
            {
                name: "repeating_earnedxpright_-LgQ6z0-LEq3-YIEEDZ2_xp_session",
                current: "Twenty-Two",
                max: "",
                id: "-LgQ6z-xEUt6X_RQIAq_"
            },
            {
                name: "repeating_earnedxpright_-LgQ6z0-LEq3-YIEEDZ2_xp_reason",
                current: "RP: Little Character Moments",
                max: "",
                id: "-LgQ6z0-y8u0Chwu1Dxp"
            },
            {
                name: "repeating_earnedxp_-LgQ6z3as9GpFCbjpUj0_xp_award",
                current: "2",
                max: "",
                id: "-LgQ6z3S5-OF0Cb00P7q"
            },
            {
                name: "repeating_earnedxp_-LgQ6z3as9GpFCbjpUj0_xp_session",
                current: "Eleven",
                max: "",
                id: "-LgQ6z3ZhrB9A9U2CV90"
            },
            {
                name: "repeating_earnedxp_-LgQ6z3as9GpFCbjpUj0_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LgQ6z3cscZLLnerwh61"
            },
            {
                name: "repeating_earnedxpright_-LgQ7125wPQzDqnyY4r0_xp_award",
                current: 2,
                max: "",
                id: "-LgQ711x7F0QSePLCF_8"
            },
            {
                name: "repeating_earnedxpright_-LgQ7125wPQzDqnyY4r0_xp_session",
                current: "Twenty-Two",
                max: "",
                id: "-LgQ7122QiWEMUXNycjW"
            },
            {
                name: "repeating_earnedxpright_-LgQ7125wPQzDqnyY4r0_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-LgQ7126bOmElpjIUrVG"
            },
            {
                name: "repeating_earnedxp_-LigHrgA9V07wM4lWHam_xp_award",
                current: 2,
                max: "",
                id: "-LigHrg224xrFg8NuU8i"
            },
            {
                name: "repeating_earnedxp_-LigHrgA9V07wM4lWHam_xp_session",
                current: "Twelve",
                max: "",
                id: "-LigHrg6xQ0eiVLMUqG6"
            },
            {
                name: "repeating_earnedxp_-LigHrgA9V07wM4lWHam_xp_reason",
                current: "Brilliant montage idea",
                max: "",
                id: "-LigHrgA7LpGCPGMyUUs"
            },
            {
                name: "repeating_earnedxpright_-LigID0vC6PRzpkH2yTi_xp_award",
                current: 2,
                max: "",
                id: "-LigID0n4wMWRTRkP9bw"
            },
            {
                name: "repeating_earnedxpright_-LigID0vC6PRzpkH2yTi_xp_session",
                current: "Twenty-Three",
                max: "",
                id: "-LigID0t-i6Gsmwko8W_"
            },
            {
                name: "repeating_earnedxpright_-LigID0vC6PRzpkH2yTi_xp_reason",
                current: "Excellent RP and character development",
                max: "",
                id: "-LigID0wnYHujS3gbZ5C"
            },
            {
                name: "repeating_earnedxpright_-LigJJGg4UocCcY3nikh_xp_award",
                current: 2,
                max: "",
                id: "-LigJJGZJYklzwlA7aWQ"
            },
            {
                name: "repeating_earnedxpright_-LigJJGg4UocCcY3nikh_xp_session",
                current: "Twenty-Three",
                max: "",
                id: "-LigJJGc1pVyr-BNd3V7"
            },
            {
                name: "repeating_earnedxpright_-LigJJGg4UocCcY3nikh_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LigJJGfo5iSROcberqJ"
            },
            {
                name: "repeating_earnedxpright_-Ljltn7lAOIi7EZdBNQ7_xp_award",
                current: 2,
                max: "",
                id: "-Ljltn7fF3Daj1TBdZea"
            },
            {
                name: "repeating_earnedxpright_-Ljltn7lAOIi7EZdBNQ7_xp_session",
                current: "Twenty-Four",
                max: "",
                id: "-Ljltn7n3min-9sL4hm1"
            },
            {
                name: "repeating_earnedxpright_-Ljltn7lAOIi7EZdBNQ7_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-Ljltn7tukaWdsEwKKvT"
            },
            {
                name: "repeating_earnedxpright_-Ljoe69N3PFKw8rpggxm_xp_award",
                current: 1,
                max: "",
                id: "-Ljoe69EFh0s1ejgZvfM"
            },
            {
                name: "repeating_earnedxpright_-Ljoe69N3PFKw8rpggxm_xp_session",
                current: "Twenty-Five",
                max: "",
                id: "-Ljoe69No6oyemQC5tzL"
            },
            {
                name: "repeating_earnedxpright_-Ljoe69N3PFKw8rpggxm_xp_reason",
                current: "Awesome Compulsion RP",
                max: "",
                id: "-Ljoe69UCQ3Mu3o-kq8X"
            },
            {
                name: "repeating_earnedxpright_-LjoeIlWFN2ChLqOVxV5_xp_award",
                current: 2,
                max: "",
                id: "-LjoeIlNpo-n9s59vYHC"
            },
            {
                name: "repeating_earnedxpright_-LjoeIlWFN2ChLqOVxV5_xp_session",
                current: "Twenty-Five",
                max: "",
                id: "-LjoeIlWlr884hmeBlvK"
            },
            {
                name: "repeating_earnedxpright_-LjoeIlWFN2ChLqOVxV5_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LjoeIldiVmTrk3-QJuu"
            },
            {
                name: "repeating_earnedxp_-LkCCiW1Ggw-lhIZZa8P_xp_award",
                current: 2,
                max: "",
                id: "-LkCCiVvkOqVfhOerSY7"
            },
            {
                name: "repeating_earnedxp_-LkCCiW1Ggw-lhIZZa8P_xp_session",
                current: "Twelve",
                max: "",
                id: "-LkCCiW-gNefPCLR-AH8"
            },
            {
                name: "repeating_earnedxp_-LkCCiW1Ggw-lhIZZa8P_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LkCCiW4cMwCf5TiM1ij"
            },
            {
                name: "repeating_earnedxp_-LkCCiXlavMTlRmj9nCw_xp_award",
                current: 2,
                max: "",
                id: "-LkCCiXdBisdtigAxENE"
            },
            {
                name: "repeating_earnedxp_-LkCCiXlavMTlRmj9nCw_xp_session",
                current: "Thirteen",
                max: "",
                id: "-LkCCiXjOSppOXDQWik2"
            },
            {
                name: "repeating_earnedxp_-LkCCiXlavMTlRmj9nCw_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-LkCCiXrqrEfFNxED9Ch"
            },
            {
                name: "repeating_earnedxpright_-LkvQPgPoKSnheOiDFoq_xp_award",
                current: 2,
                max: "",
                id: "-LkvQPgIRX4Gv6OWrVVB"
            },
            {
                name: "repeating_earnedxpright_-LkvQPgPoKSnheOiDFoq_xp_session",
                current: "Twenty-Six",
                max: "",
                id: "-LkvQPgOsjJAKRTob5t_"
            },
            {
                name: "repeating_earnedxpright_-LkvQPgPoKSnheOiDFoq_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LkvQPgRqFVCakbFxZtV"
            },
            {
                name: "repeating_earnedxpright_-LmCusV7l9ymS-5NKXoE_xp_award",
                current: 2,
                max: "",
                id: "-LmCusV3DjyW_wYgJfDl"
            },
            {
                name: "repeating_earnedxpright_-LmCusV7l9ymS-5NKXoE_xp_session",
                current: "Twenty-Seven",
                max: "",
                id: "-LmCusV8Ct8R-I_PSnKR"
            },
            {
                name: "repeating_earnedxpright_-LmCusV7l9ymS-5NKXoE_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LmCusVCKtEWgkZg5AuP"
            },
            {
                name: "repeating_earnedxp_-LmCusVu3it4WZPdANZz_xp_award",
                current: 1,
                max: "",
                id: "-LmCusVr8tC84t4_gzAn"
            },
            {
                name: "repeating_earnedxp_-LmCusVu3it4WZPdANZz_xp_session",
                current: "Thirteen",
                max: "",
                id: "-LmCusVzwD0h-bow1MaE"
            },
            {
                name: "repeating_earnedxp_-LmCusVu3it4WZPdANZz_xp_reason",
                current: "Engaging with the plot",
                max: "",
                id: "-LmCusW2f9tcwAbyE_5p"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_category",
                current: "Skill",
                max: "",
                id: "-Lmb0AawXEfl3boeN5WZ"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-Lmb0AfmHWIogVtYynu-"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-Lmb0AfsjyR72PnMq9RP"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_new_toggle",
                current: 1,
                max: "",
                id: "-Lmb0AfzdwIAttBZMUmn"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-Lmb0Ag4YgO9wBKxYbZc"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_trait",
                current: "Subterfuge",
                max: "",
                id: "-Lmb0CA538BcdzZYKBml"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_cost",
                current: 6,
                max: "",
                id: "-Lmb0CEApbZSktSRXDCQ"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_initial",
                current: "1",
                max: "",
                id: "-Lmb0CcNyTA1rv_wMWWQ"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_new",
                current: "2",
                max: "",
                id: "-Lmb0D35988EBCQMAmrw"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_category",
                current: "Clan Discipline",
                max: "",
                id: "-Lmb0FSuUwgSS4UCaQwt"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-Lmb0FWuZ0dQTZ6jQeNm"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-Lmb0FWzEhBYIu7PIJvY"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_new_toggle",
                current: 1,
                max: "",
                id: "-Lmb0FX3N7mkB53nCcRW"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-Lmb0FX75qdbv6-qzd5b"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_trait",
                current: "Dominate",
                max: "",
                id: "-Lmb0Gp1OE-1ic1fTnZh"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_cost",
                current: 10,
                max: "",
                id: "-Lmb0Gt-8EanYOYg4m0Z"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_initial",
                current: "1",
                max: "",
                id: "-Lmb0H6yQIZxUoQmJ0la"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_new",
                current: "2",
                max: "",
                id: "-Lmb0H_RyqPE-zrCrEk6"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-Lmb3b94YLyKwFvHJeCy"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_category",
                current: "Advantage",
                max: "",
                id: "-LoI_hznjHpsssXuQ6rY"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LoI_i3jb9pZMzPPTKOn"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LoI_i3pD6BdhWN1meoi"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LoI_i3tJuxOnBIsirQl"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LoI_i3xIypA44sazddo"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_trait",
                current: "Loresheet (Netchurch)",
                max: "",
                id: "-LoI_lNaKgmr9Xj1Yzm0"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_cost",
                current: 9,
                max: "",
                id: "-LoI_lRAgp63b9nMirHx"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_new",
                current: "3",
                max: "",
                id: "-LoI_lf4YJU0gDcpyHOB"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LoI_mClyCNnMx6CwK1l"
            },
            {
                name: "repeating_earnedxpright_-LoIju1OFhVFMbYpmYRd_xp_award",
                current: 1,
                max: "",
                id: "-LoIju1KGlsWOFiSzMht"
            },
            {
                name: "repeating_earnedxpright_-LoIju1OFhVFMbYpmYRd_xp_session",
                current: "Twenty-Nine",
                max: "",
                id: "-LoIju1RnLV2vKR7ssW4"
            },
            {
                name: "repeating_earnedxpright_-LoIju1OFhVFMbYpmYRd_xp_reason",
                current: "Great RP as the baroness' lapdog",
                max: "",
                id: "-LoIju1WwoWujFukeD9P"
            },
            {
                name: "repeating_earnedxpright_-LoKrRVMT6hIquIyoaeZ_xp_award",
                current: 2,
                max: "",
                id: "-LoKrRVFWZPZFLO8O21c"
            },
            {
                name: "repeating_earnedxpright_-LoKrRVMT6hIquIyoaeZ_xp_session",
                current: "Twenty-Nine",
                max: "",
                id: "-LoKrRVYg77alGLaOEOw"
            },
            {
                name: "repeating_earnedxpright_-LoKrRVMT6hIquIyoaeZ_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LoKrRVaso4Y2oGS5xMg"
            },
            {
                name: "repeating_earnedxp_-LoKrRWIdXcMWg5A95Zy_xp_award",
                current: 2,
                max: "",
                id: "-LoKrRWAuWxCiP6dgZ0c"
            },
            {
                name: "repeating_earnedxp_-LoKrRWIdXcMWg5A95Zy_xp_session",
                current: "Fourteen",
                max: "",
                id: "-LoKrRWEkL7pjYUBB_1p"
            },
            {
                name: "repeating_earnedxp_-LoKrRWIdXcMWg5A95Zy_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-LoKrRWGv_lLnxhketFa"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LoLtBWP65lDlQwR90rf"
            },
            {
                name: "repeating_earnedxpright_-LoZBXteanfysoKkjm43_xp_award",
                current: 2,
                max: "",
                id: "-Lo_BXtaCVcF-mo0Bmct"
            },
            {
                name: "repeating_earnedxpright_-LoZBXteanfysoKkjm43_xp_session",
                current: "Thirty",
                max: "",
                id: "-Lo_BXtj9fYvWzq1Y4_Q"
            },
            {
                name: "repeating_earnedxpright_-LoZBXteanfysoKkjm43_xp_reason",
                current: "NPC Creation: Carlita",
                max: "",
                id: "-Lo_BXtr9NcugcUV6B3M"
            },
            {
                name: "repeating_earnedxpright_-LtvwTSWonGuZWmZLgmv_xp_award",
                current: 2,
                max: "",
                id: "-LtvwTSPfi7ibq3K7BhV"
            },
            {
                name: "repeating_earnedxpright_-LtvwTSWonGuZWmZLgmv_xp_session",
                current: "Thirty",
                max: "",
                id: "-LtvwTSRW5ZHNqbfdToo"
            },
            {
                name: "repeating_earnedxpright_-LtvwTSWonGuZWmZLgmv_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LtvwTSU7ws-DwHGW-0C"
            },
            {
                name: "repeating_earnedxp_-LtvwTT7jhAowEss8gWx_xp_award",
                current: 2,
                max: "",
                id: "-LtvwTT-83Jd1SV7uSue"
            },
            {
                name: "repeating_earnedxp_-LtvwTT7jhAowEss8gWx_xp_session",
                current: "Fifteen",
                max: "",
                id: "-LtvwTT3o8a3L5wZG9c9"
            },
            {
                name: "repeating_earnedxp_-LtvwTT7jhAowEss8gWx_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-LtvwTT5NGJROhicVxqU"
            },
            {
                name: "repeating_earnedxpright_-LtvwdWKNqYGgiBp1RRo_xp_award",
                current: 1,
                max: "",
                id: "-LtvwdWC0b1gqCxkzijt"
            },
            {
                name: "repeating_earnedxpright_-LtvwdWKNqYGgiBp1RRo_xp_session",
                current: "Thirty-One",
                max: "",
                id: "-LtvwdWGCYJfsvzVLfnE"
            },
            {
                name: "repeating_earnedxpright_-LtvwdWKNqYGgiBp1RRo_xp_reason",
                current: "Playing Cardinal Collins",
                max: "",
                id: "-LtvwdWIvxT5FqevjOvq"
            },
            {
                name: "repeating_earnedxpright_-Ltvwkm-62dE1JoAfVla_xp_award",
                current: 2,
                max: "",
                id: "-LtvwkltNvL0a660LU0u"
            },
            {
                name: "repeating_earnedxpright_-Ltvwkm-62dE1JoAfVla_xp_session",
                current: "Thirty-One",
                max: "",
                id: "-LtvwklwKP-zVrUTEPF_"
            },
            {
                name: "repeating_earnedxpright_-Ltvwkm-62dE1JoAfVla_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LtvwklysAgqUsxcoosC"
            },
            {
                name: "repeating_earnedxp_-LtvwkmdPRafElEGeJcj_xp_award",
                current: 2,
                max: "",
                id: "-LtvwkmWpncHrG1E-uPc"
            },
            {
                name: "repeating_earnedxp_-LtvwkmdPRafElEGeJcj_xp_session",
                current: "Fifteen",
                max: "",
                id: "-LtvwkmZPrM0qbPBoMkh"
            },
            {
                name: "repeating_earnedxp_-LtvwkmdPRafElEGeJcj_xp_reason",
                current: "Being vampires!",
                max: "",
                id: "-Ltvwkma5F3teWVnVnVS"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_category",
                current: "Skill",
                max: "",
                id: "-Ltw3uPWM2OmGH97nmax"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-Ltw3uTUMvTQhG80cq1W"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-Ltw3uTZr915Dq8mSez5"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_new_toggle",
                current: 1,
                max: "",
                id: "-Ltw3uTeXdTf9BHVMEfX"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-Ltw3uTjWFe7AWhJnBZu"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_trait",
                current: "Science 4",
                max: "",
                id: "-Ltw3w2jXY9Vu8e-41Vo"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_cost",
                current: 12,
                max: "",
                id: "-Ltw3w5w4lNDOPafbih3"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_initial",
                current: "3",
                max: "",
                id: "-Ltw3wN_fMdLfGMI7_Xv"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_new",
                current: "4",
                max: "",
                id: "-Ltw3wq3EGElKnnBvmGw"
            },
            {
                name: "repeating_earnedxpright_-LtwWxs5LddvE07tC9yx_xp_award",
                current: 2,
                max: "",
                id: "-LtwWxryTddml90QNfae"
            },
            {
                name: "repeating_earnedxpright_-LtwWxs5LddvE07tC9yx_xp_session",
                current: "Thirty-Two",
                max: "",
                id: "-LtwWxs1q2tePlE65o-j"
            },
            {
                name: "repeating_earnedxpright_-LtwWxs5LddvE07tC9yx_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LtwWxs3Vyl8FzW7Uo9K"
            },
            {
                name: "repeating_earnedxpright_-LuVYjA7Fjs6oTzmNXSA_xp_award",
                current: 2,
                max: "",
                id: "-LuVYjA0hZPepOdcz2Ic"
            },
            {
                name: "repeating_earnedxpright_-LuVYjA7Fjs6oTzmNXSA_xp_session",
                current: "Thirty-Three",
                max: "",
                id: "-LuVYjA4uulvNZP1Tqcj"
            },
            {
                name: "repeating_earnedxpright_-LuVYjA7Fjs6oTzmNXSA_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LuVYjACbiA5VBwLDu-U"
            },
            {
                name: "repeating_earnedxp_-LuVYjB2euZDJTy-ir0Z_xp_award",
                current: 2,
                max: "",
                id: "-LuVYjAxZpP4CWQkyf11"
            },
            {
                name: "repeating_earnedxp_-LuVYjB2euZDJTy-ir0Z_xp_session",
                current: "Sixteen",
                max: "",
                id: "-LuVYjB0dMpWEFBSzTwR"
            },
            {
                name: "repeating_earnedxp_-LuVYjB2euZDJTy-ir0Z_xp_reason",
                current: "FOR OBFUSCATE ONLY",
                max: "",
                id: "-LuVYjB3NyICwne2uWxu"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-Lxe1H3GqJPyH9ayoxiT"
            },
            {
                name: "repeating_earnedxpright_-LyGozzViXZXqrtrpljd_xp_award",
                current: 2,
                max: "",
                id: "-LyGozzTnWCiOTi04KoV"
            },
            {
                name: "repeating_earnedxpright_-LyGozzViXZXqrtrpljd_xp_session",
                current: "Thirty-Four",
                max: "",
                id: "-LyGozzYqYy9RyGLzq2J"
            },
            {
                name: "repeating_earnedxpright_-LyGozzViXZXqrtrpljd_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LyGozzbGLxK7DeZnQDL"
            },
            {
                name: "repeating_spentxp_-LyRLIe5rzPxOuPHuR8E_xp_category",
                current: "Advantage",
                max: "",
                id: "-LyRLJwDw61gIeWxP1sg"
            },
            {
                name: "repeating_spentxp_-LyRLIe5rzPxOuPHuR8E_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LyRLK-lZB73vekh6s5J"
            },
            {
                name: "repeating_spentxp_-LyRLIe5rzPxOuPHuR8E_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LyRLK-r1VvAixtD0hwv"
            },
            {
                name: "repeating_spentxp_-LyRLIe5rzPxOuPHuR8E_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LyRLK-xY8E28H7iArFL"
            },
            {
                name: "repeating_spentxp_-LyRLIe5rzPxOuPHuR8E_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LyRLK02w4GuLZOVNUA6"
            },
            {
                name: "repeating_spentxp_-LyRLIe5rzPxOuPHuR8E_xp_trait",
                current: "Loresheet (Netchurch)",
                max: "",
                id: "-LyRLOWPXDKF_Ex0Apml"
            },
            {
                name: "repeating_spentxp_-LyRLIe5rzPxOuPHuR8E_xp_cost",
                current: 15,
                max: "",
                id: "-LyRLO_T4Z89Qo9jTAN7"
            },
            {
                name: "repeating_spentxp_-LyRLIe5rzPxOuPHuR8E_xp_new",
                current: "5",
                max: "",
                id: "-LyRLP0LHoM-mxg-F3rF"
            },
            {
                name: "repeating_earnedxpright_-LyRvkRe4VMcOP8vfqCU_xp_award",
                current: 2,
                max: "",
                id: "-LyRvkRXffrN4d2QItOp"
            },
            {
                name: "repeating_earnedxpright_-LyRvkRe4VMcOP8vfqCU_xp_session",
                current: "Thirty-Five",
                max: "",
                id: "-LyRvkRheHr26zpDTBNd"
            },
            {
                name: "repeating_earnedxpright_-LyRvkRe4VMcOP8vfqCU_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LyRvkRl1Rdcp_uri8d8"
            },
            {
                name: "repeating_earnedxp_-LyRvkSiU0a0YIAW9bQ8_xp_award",
                current: 2,
                max: "",
                id: "-LyRvkSaGlR1AhPce1Em"
            },
            {
                name: "repeating_earnedxp_-LyRvkSiU0a0YIAW9bQ8_xp_session",
                current: "Sixteen",
                max: "",
                id: "-LyRvkSfMySJimUEY5wg"
            },
            {
                name: "repeating_earnedxp_-LyRvkSiU0a0YIAW9bQ8_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-LyRvkSilTlQf4eVtT81"
            },
            {
                name: "repeating_earnedxpright_-Lz5Z07tZ8HvEzxAwu5q_xp_award",
                current: 2,
                max: "",
                id: "-Lz5_07kPxPVpERWjudK"
            },
            {
                name: "repeating_earnedxpright_-Lz5Z07tZ8HvEzxAwu5q_xp_session",
                current: "Thirty-Six",
                max: "",
                id: "-Lz5_07qPO-8drvW7MCo"
            },
            {
                name: "repeating_earnedxpright_-Lz5Z07tZ8HvEzxAwu5q_xp_reason",
                current: "Session XP Award.",
                max: "",
                id: "-Lz5_07uCXfakP9Jh76A"
            },
            {
                name: "repeating_earnedxpright_-LzZIc7ZkSy6s5c4ndOE_xp_award",
                current: -6,
                max: "",
                id: "-LzZIc7WqUkN5nT6gd7q"
            },
            {
                name: "repeating_earnedxpright_-LzZIc7ZkSy6s5c4ndOE_xp_session",
                current: "Thirty-Six",
                max: "",
                id: "-LzZIc7cG6Y78JWnS-Pw"
            },
            {
                name: "repeating_earnedxpright_-LzZIc7ZkSy6s5c4ndOE_xp_reason",
                current: "Resolving Flaw: Enemy.",
                max: "",
                id: "-LzZIc7gkQ5-iULFTK_u"
            },
            {
                name: "repeating_earnedxp_-LzZIcADSXXN5z3y7AFZ_xp_award",
                current: 2,
                max: "",
                id: "-LzZIcA71aNlW3GJ49Nz"
            },
            {
                name: "repeating_earnedxp_-LzZIcADSXXN5z3y7AFZ_xp_session",
                current: "Seventeen",
                max: "",
                id: "-LzZIcACeDRmye053qY5"
            },
            {
                name: "repeating_earnedxp_-LzZIcADSXXN5z3y7AFZ_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-LzZIcAFPTlWo3qpCG4g"
            },
            {
                name: "repeating_earnedxpright_-LzZIgVK2CiPK1Q75eOI_xp_award",
                current: 18,
                max: "",
                id: "-LzZIgVGsJyfgmVHePsI"
            },
            {
                name: "repeating_earnedxpright_-LzZIgVK2CiPK1Q75eOI_xp_session",
                current: "Thirty-Six",
                max: "",
                id: "-LzZIgVQC8FzTPYJhZ8M"
            },
            {
                name: "repeating_earnedxpright_-LzZIgVK2CiPK1Q75eOI_xp_reason",
                current: "Losing Allies: Bookies.",
                max: "",
                id: "-LzZIgVX4kNZbcc0KfHk"
            },
            {
                name: "repeating_earnedxpright_-LzZvY2HwDMCZA1-fZcZ_xp_award",
                current: 2,
                max: "",
                id: "-LzZvY2ABHC_SZqG2IvT"
            },
            {
                name: "repeating_earnedxpright_-LzZvY2HwDMCZA1-fZcZ_xp_session",
                current: "Thirty-Seven",
                max: "",
                id: "-LzZvY2DoWr8gXE32EK-"
            },
            {
                name: "repeating_earnedxpright_-LzZvY2HwDMCZA1-fZcZ_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LzZvY2F3ko1g1GcnM6Y"
            },
            {
                name: "repeating_earnedxp_-LzZvY32hqS8nLS89IlR_xp_award",
                current: 2,
                max: "",
                id: "-LzZvY2wJ9vwPQUizuxN"
            },
            {
                name: "repeating_earnedxp_-LzZvY32hqS8nLS89IlR_xp_session",
                current: "Seventeen",
                max: "",
                id: "-LzZvY3-1HtjXbZ5lYtM"
            },
            {
                name: "repeating_earnedxp_-LzZvY32hqS8nLS89IlR_xp_reason",
                current: "The Vultures Circle",
                max: "",
                id: "-LzZvY31m5zLWSSYxZsd"
            },
            {
                name: "repeating_earnedxpright_-M-HQ4RLcHBOyJrqFq-B_xp_award",
                current: 9,
                max: "",
                id: "-M-HQ4RB_Zql3s8VwdqD"
            },
            {
                name: "repeating_earnedxpright_-M-HQ4RLcHBOyJrqFq-B_xp_session",
                current: "Thirty-Six",
                max: "",
                id: "-M-HQ4RG53N1nZSfDAmJ"
            },
            {
                name: "repeating_earnedxpright_-M-HQ4RLcHBOyJrqFq-B_xp_reason",
                current: "Loosing Herd: Bookies",
                max: "",
                id: "-M-HQ4RK4YQmeFMUs0cC"
            },
            {
                name: "repeating_spentxp_-LyRLIe5rzPxOuPHuR8E_xp_spent_toggle",
                current: "0",
                max: "",
                id: "-M-HQEhXI56LofAVSR7H"
            },
            {
                name: "repeating_earnedxp_-M-cZiiSEPZQ1OX1wH7H_xp_award",
                current: 20,
                max: "",
                id: "-M-cZiiMn84ZA5_X9q-k"
            },
            {
                name: "repeating_earnedxp_-M-cZiiSEPZQ1OX1wH7H_xp_session",
                current: "Eighteen",
                max: "",
                id: "-M-cZiiPMl3FGs5ju_4N"
            },
            {
                name: "repeating_earnedxp_-M-cZiiSEPZQ1OX1wH7H_xp_reason",
                current: "Award for 15 month time jump.",
                max: "",
                id: "-M-cZiiSiRmvWdMWLS6T"
            },
            {
                name: "repeating_earnedxpright_-M0GDgu1YZz4glMFeJ3D_xp_award",
                current: 2,
                max: "",
                id: "-M0GDgtzjPQJQruRlVuy"
            },
            {
                name: "repeating_earnedxpright_-M0GDgu1YZz4glMFeJ3D_xp_session",
                current: "Thirty-Eight",
                max: "",
                id: "-M0GDgu0NtlxoG6z78Vn"
            },
            {
                name: "repeating_earnedxpright_-M0GDgu1YZz4glMFeJ3D_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-M0GDgu2er3h0dWTKnRF"
            },
            {
                name: "repeating_earnedxpright_-M1OAdEJJOwnWUhJVGq4_xp_award",
                current: 2,
                max: "",
                id: "-M1OAdECFwCIBdrh86ZC"
            },
            {
                name: "repeating_earnedxpright_-M1OAdEJJOwnWUhJVGq4_xp_session",
                current: "Thirty-Nine",
                max: "",
                id: "-M1OAdEFPCjb7KyUGpeo"
            },
            {
                name: "repeating_earnedxpright_-M1OAdEJJOwnWUhJVGq4_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-M1OAdEIXHOJiBwNkpRd"
            },
            {
                name: "repeating_spentxp_-M4BiXLUw-nA3g7GogiJ_xp_category",
                current: "Blood Potency",
                max: "",
                id: "-M4BiY1latbtYO0qkuce"
            },
            {
                name: "repeating_spentxp_-M4BiXLUw-nA3g7GogiJ_xp_cost",
                current: 20,
                max: "",
                id: "-M4BiY6E4hwSXo97p6_-"
            },
            {
                name: "repeating_spentxp_-M4BiXLUw-nA3g7GogiJ_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-M4BiY6Jq__AcwSqyTx1"
            },
            {
                name: "repeating_spentxp_-M4BiXLUw-nA3g7GogiJ_xp_new_toggle",
                current: 1,
                max: "",
                id: "-M4BiY6Og5_PlpyIGkmQ"
            },
            {
                name: "repeating_spentxp_-M4BiXLUw-nA3g7GogiJ_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-M4BiY6To6gAgfrvRHVw"
            },
            {
                name: "repeating_spentxp_-M4BiXLUw-nA3g7GogiJ_xp_initial",
                current: "1",
                max: "",
                id: "-M4BiYdYxylN7oDbJ4yT"
            },
            {
                name: "repeating_spentxp_-M4BiXLUw-nA3g7GogiJ_xp_new",
                current: "2",
                max: "",
                id: "-M4BiZ19vpDmarMBnbD6"
            },
            {
                name: "repeating_earnedxpright_-M4BwgVrQyvoCgzj9UOb_xp_award",
                current: 2,
                max: "",
                id: "-M4BwgVnptJphRq3iv2u"
            },
            {
                name: "repeating_earnedxpright_-M4BwgVrQyvoCgzj9UOb_xp_session",
                current: "Forty",
                max: "",
                id: "-M4BwgVsfswVutkNuZQw"
            },
            {
                name: "repeating_earnedxpright_-M4BwgVrQyvoCgzj9UOb_xp_reason",
                current: "RPing Drug Addiction",
                max: "",
                id: "-M4BwgVu98egNg2-OG5L"
            },
            {
                name: "repeating_earnedxp_-M4BwgWfnAGtZ1NPqrjD_xp_award",
                current: 2,
                max: "",
                id: "-M4BwgWb04bwHz8UG7xs"
            },
            {
                name: "repeating_earnedxp_-M4BwgWfnAGtZ1NPqrjD_xp_session",
                current: "Eighteen",
                max: "",
                id: "-M4BwgWdU9MvtZhsU7ub"
            },
            {
                name: "repeating_earnedxp_-M4BwgWfnAGtZ1NPqrjD_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-M4BwgWfqrq4rqKs2-dr"
            },
            {
                name: "repeating_earnedxpright_-M4CPrmfZZ6G3fnXapvL_xp_award",
                current: 2,
                max: "",
                id: "-M4CPrmbu2mJza5V2F_7"
            },
            {
                name: "repeating_earnedxpright_-M4CPrmfZZ6G3fnXapvL_xp_session",
                current: "Forty",
                max: "",
                id: "-M4CPrmdJzJFjv7N8e1i"
            },
            {
                name: "repeating_earnedxpright_-M4CPrmfZZ6G3fnXapvL_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-M4CPrmfyVlXTBGau0GO"
            },
            {
                name: "repeating_earnedxpright_-M5KQYZkC00kYZ4dhrZ7_xp_award",
                current: 2,
                max: "",
                id: "-M5KQY_auw9sb49jD8PE"
            },
            {
                name: "repeating_earnedxpright_-M5KQYZkC00kYZ4dhrZ7_xp_session",
                current: "Forty-One",
                max: "",
                id: "-M5KQY_eu3y8FXoY7lGp"
            },
            {
                name: "repeating_earnedxpright_-M5KQYZkC00kYZ4dhrZ7_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-M5KQY_hD6gVDhcrC04F"
            },
            {
                name: "repeating_earnedxp_-M5KQYag3xUDpR8bwD-w_xp_award",
                current: 2,
                max: "",
                id: "-M5KQYaXdMX4zP-JhV27"
            },
            {
                name: "repeating_earnedxp_-M5KQYag3xUDpR8bwD-w_xp_session",
                current: "Nineteen",
                max: "",
                id: "-M5KQYaamMrOTT8AbvEe"
            },
            {
                name: "repeating_earnedxp_-M5KQYag3xUDpR8bwD-w_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-M5KQYadCLaVL0qNiEZM"
            },
            {
                name: "repeating_earnedxpright_-M5KRwlo9N502f9xX4uc_xp_award",
                current: 5,
                max: "",
                id: "-M5KRwlebCp0eyUzwcM_"
            },
            {
                name: "repeating_earnedxpright_-M5KRwlo9N502f9xX4uc_xp_session",
                current: "Forty-Two",
                max: "",
                id: "-M5KRwljXm1FDmU9Iqi7"
            },
            {
                name: "repeating_earnedxpright_-M5KRwlo9N502f9xX4uc_xp_reason",
                current: "Session Scribe",
                max: "",
                id: "-M5KRwlmsYxrTABvn-wf"
            }
        ],
        24: [
            {
                name: "xp_summary",
                current: "209 XP Earned - 175 XP Spent =  34 XP Remaining",
                max: "",
                id: "-LU7dsfS20fV0ZfSn1gO"
            },
            {
                name: "repeating_earnedxp_-LOL0MvLYsuljyZCFymk_xp_award",
                current: "15",
                max: "",
                id: "-LU7dsfTOeGpyj3vduPs"
            },
            {
                name: "repeating_earnedxp_-LOL0MvLYsuljyZCFymk_xp_session",
                current: "Zero",
                max: "",
                id: "-LU7dsfU3R2T2spwB8Do"
            },
            {
                name: "repeating_earnedxp_-LOL0MvLYsuljyZCFymk_xp_reason",
                current: "Initial XP awarded at the beginning of the Chronicle.",
                max: "",
                id: "-LU7dsfVkJbPIJ_AULQI"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_category",
                current: "Clan Discipline",
                max: "",
                id: "-LU7dsg65B78RevMdfgF"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_trait",
                current: "Auspex",
                max: "",
                id: "-LU7dsgBCaxyUWZSmYxS"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_cost",
                current: 10,
                max: "",
                id: "-LU7dsgBCaxyUWZSmYxT"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_initial",
                current: "1",
                max: "",
                id: "-LU7dsgCOeusF4xqj-Er"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_new",
                current: "2",
                max: "",
                id: "-LU7dsgDSFTywmIsd-UH"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_category",
                current: "Advantage",
                max: "",
                id: "-LU7dsgE1g-ZcqaSs3T5"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_initial",
                current: "1",
                max: "",
                id: "-LU7dsgKwRm4CizlXOgL"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_new",
                current: "2",
                max: "",
                id: "-LU7dsgKwRm4CizlXOgM"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_trait",
                current: "Contacts (Pharma)",
                max: "",
                id: "-LU7dsgLQNtgCBtkxE5K"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_cost",
                current: 3,
                max: "",
                id: "-LU7dsgN1U_lCGqVcjXf"
            },
            {
                name: "repeating_earnedxp_-LOaOePNOjwmn9CW4oWY_xp_award",
                current: "1",
                max: "",
                id: "-LU7dsgSWCLOyRsMBRgZ"
            },
            {
                name: "repeating_earnedxp_-LOaOePNOjwmn9CW4oWY_xp_session",
                current: "Zero",
                max: "",
                id: "-LU7dsgTvwZyuVyVIKFo"
            },
            {
                name: "repeating_earnedxp_-LOaOePNOjwmn9CW4oWY_xp_reason",
                current: "Creating a relationship hook with Ava Wong, Jo's character.",
                max: "",
                id: "-LU7dsgUp-HAuSj8WEXb"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_category",
                current: "Advantage",
                max: "",
                id: "-LU7dsgb2xsXU_GgWYM7"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_trait",
                current: "Herd (Field Clinic)",
                max: "",
                id: "-LU7dsggjBc6iL4RCRL2"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_cost",
                current: 6,
                max: "",
                id: "-LU7dsgh_l4mYMwRQVOM"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_new",
                current: "2",
                max: "",
                id: "-LU7dsgiSKNG6GABne89"
            },
            {
                name: "repeating_earnedxp_-LPOmiZY-6Q2SB8AQJM3_xp_award",
                current: "4",
                max: "",
                id: "-LU7dsgzdz2k03LFmc-J"
            },
            {
                name: "repeating_earnedxp_-LPOmiZY-6Q2SB8AQJM3_xp_session",
                current: "One",
                max: "",
                id: "-LU7dsh-vXsqmVu0ya-r"
            },
            {
                name: "repeating_earnedxp_-LPOmiZY-6Q2SB8AQJM3_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LU7dsh-vXsqmVu0ya-s"
            },
            {
                name: "repeating_earnedxp_-LPqtifvc9bwzYpsuJ1E_xp_award",
                current: "9",
                max: "",
                id: "-LU7dsh20g95XujQISZm"
            },
            {
                name: "repeating_earnedxp_-LPqtifvc9bwzYpsuJ1E_xp_session",
                current: "Zero",
                max: "",
                id: "-LU7dsh49rRPOBaaYZVw"
            },
            {
                name: "repeating_earnedxp_-LPqtifvc9bwzYpsuJ1E_xp_reason",
                current: "Completing character sheet by the Thursday deadline..",
                max: "",
                id: "-LU7dsh5zLm2FK9bISAV"
            },
            {
                name: "_reporder_repeating_earnedxp",
                current: "-LOL0MvLYsuljyZCFymk,-LOaOePNOjwmn9CW4oWY,-LPOmiZY-6Q2SB8AQJM3,-LPqtifvc9bwzYpsuJ1E,-LQi-2PfA4iwP7T7FFzt,-LQi-J171uzZXnC-vewh,-LRuzhHXwCUYV11KaaRK,-LRuziGli9eaOsLceHIK,-LVaIa8cnzXhum3lscuA,-LVaUKCH8TkCB8LFBooF,-LWiZi6KpdjLcOZCbaEr,-LXqZadBzvNwHnZYVjSJ,-LYxynFLlUntenrPS096,-LZ5sM79KlGe1HsFHZ2Q,-LZebfVoomwhK3XT9ySl,-LaDZU7-WlQ8HINIY4n4,-LaJFzzQTdwQ7oBqAZxI,-LcTot98UDVjxP7TtFvp,-LfnNrdt2tIZesVzbVcg,-Lfr67XLUkO-SkkBZdJo,-LgQ6z3as9GpFCbjpUj0,-LigHrgA9V07wM4lWHam,-LjltnC3p9FqCfZD5tNJ,-LjnG66NboEtrmwVaKoq,-LjnOWqutTVfJX2RLYXV,-Ljodc6N8qIcdweBNiPc",
                max: "",
                id: "-LU7dsh6HHew8O2CJ1Oq"
            },
            {
                name: "repeating_earnedxp_-LQi-2PfA4iwP7T7FFzt_xp_award",
                current: "2",
                max: "",
                id: "-LU7dsi4LQiQ-BfVekWV"
            },
            {
                name: "repeating_earnedxp_-LQi-2PfA4iwP7T7FFzt_xp_session",
                current: "Two",
                max: "",
                id: "-LU7dsi5MCKNYf7Ff2ti"
            },
            {
                name: "repeating_earnedxp_-LQi-2PfA4iwP7T7FFzt_xp_reason",
                current: "Three Troubled Thin-Bloods: Story completion award.",
                max: "",
                id: "-LU7dsi7-0sCgAbrOxuf"
            },
            {
                name: "repeating_earnedxp_-LQi-J171uzZXnC-vewh_xp_award",
                current: "5",
                max: "",
                id: "-LU7dsi8Su9MeDOz5xFm"
            },
            {
                name: "repeating_earnedxp_-LQi-J171uzZXnC-vewh_xp_session",
                current: "Two",
                max: "",
                id: "-LU7dsi8Su9MeDOz5xFn"
            },
            {
                name: "repeating_earnedxp_-LQi-J171uzZXnC-vewh_xp_reason",
                current: "Excellent Loresheet for Netchurch.",
                max: "",
                id: "-LU7dsiA_oBXO79dZGJh"
            },
            {
                name: "xp_earnedtotal",
                current: 209,
                max: "",
                id: "-LU7dsiC3A8UvJY9Cp0_"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_category",
                current: "Advantage",
                max: "",
                id: "-LU7dsiEfKr6snYfoQVb"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_trait",
                current: "Mask (John  Nate)",
                max: "",
                id: "-LU7dsiI1-Q0jyG_vvCj"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_cost",
                current: 6,
                max: "",
                id: "-LU7dsiK4o70oLvQy0e3"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_new",
                current: "2",
                max: "",
                id: "-LU7dsiK4o70oLvQy0e4"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_category",
                current: "Advantage",
                max: "",
                id: "-LU7dsiMEqNHwldkjukn"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_new",
                current: "1",
                max: "",
                id: "-LU7dsiRXkLPqKUHepgq"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_trait",
                current: "Loresheet (Newchurch)",
                max: "",
                id: "-LU7dsiSfQVyOFXI8dhL"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_cost",
                current: 3,
                max: "",
                id: "-LU7dsiT8j81f1UwutdK"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_category",
                current: "Skill",
                max: "",
                id: "-LU7dsiUJn4qVdb2NiTb"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_trait",
                current: "Etiquette",
                max: "",
                id: "-LU7dsi_tMrvLJ-TvJI3"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_cost",
                current: 6,
                max: "",
                id: "-LU7dsibpVJRHCse_1Fd"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_initial",
                current: "1",
                max: "",
                id: "-LU7dsicdwymwHnMheLi"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_new",
                current: "2",
                max: "",
                id: "-LU7dsidqunFZghJHr2h"
            },
            {
                name: "repeating_earnedxp_-LRuzhHXwCUYV11KaaRK_xp_award",
                current: "2",
                max: "",
                id: "-LU7dsikmIhegvzBOP6e"
            },
            {
                name: "repeating_earnedxp_-LRuzhHXwCUYV11KaaRK_xp_session",
                current: "Two",
                max: "",
                id: "-LU7dsimDxL1HctsLEsP"
            },
            {
                name: "repeating_earnedxp_-LRuzhHXwCUYV11KaaRK_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LU7dsincl0X13iLrapW"
            },
            {
                name: "repeating_earnedxp_-LRuziGli9eaOsLceHIK_xp_award",
                current: "2",
                max: "",
                id: "-LU7dsincl0X13iLrapX"
            },
            {
                name: "repeating_earnedxp_-LRuziGli9eaOsLceHIK_xp_session",
                current: "Three",
                max: "",
                id: "-LU7dsip77G68eB-CcQ8"
            },
            {
                name: "repeating_earnedxp_-LRuziGli9eaOsLceHIK_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LU7dsirpLUrpZQrNkhg"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_category",
                current: "Skill",
                max: "",
                id: "-LU7dsjYK1rTdQPBYuaY"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_trait",
                current: "Intimidate",
                max: "",
                id: "-LU7dsjdDciAuI5GkOEp"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_cost",
                current: 3,
                max: "",
                id: "-LU7dsjeL5oJmluaj97W"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_new",
                current: "1",
                max: "",
                id: "-LU7dsjfA76W8xOAXO14"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_category",
                current: "Advantage",
                max: "",
                id: "-LU7dsjhkGxyRupA50F9"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_trait",
                current: "Herd (Bookies)",
                max: "",
                id: "-LU7dsjnymOoJa1zTmtf"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_cost",
                current: 9,
                max: "",
                id: "-LU7dsjoESYSD0iSp4k-"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_new",
                current: "3",
                max: "",
                id: "-LU7dsjoESYSD0iSp4k0"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LU7dsk8Q3vUQRRfcs5D"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LU7dsk9ehE62NSNlU5n"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LU7dskAIYma6A2g2aI5"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LU7dskAIYma6A2g2aI6"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LU7dskCzmlfYGDlMuKn"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LU7dskDfBpSGoqnqDyY"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LU7dskEk49SZtcoouXE"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LU7dskFczQG6FqKA7hC"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LU7dskGglgmOmTIxQ4j"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LU7dskH_2nARamCKY_n"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LU7dskIC5-zPyXJEpFd"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LU7dskJYBr1IR9Z0X7I"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LU7dskKv4ViLEoyHtdt"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LU7dskLPpKWfkzuOfdP"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LU7dskM1Zrlt0Y4dZV7"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LU7dskOHtRiMD34RzHr"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LU7dskOHtRiMD34RzHs"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LU7dskPKwucHV02a73a"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LU7dskQAMCfoGNlT-A0"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LU7dskSBBxQbVB5R6WQ"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LU7dskSBBxQbVB5R6WR"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LU7dskTAmkLWXyM8PtR"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LU7dskV1vfDz5kPn-p8"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LU7dskV1vfDz5kPn-p9"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LU7dskXRSgyVDiG3gpr"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LU7dskXRSgyVDiG3gps"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LU7dskZ4ym3FbegJQZs"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LU7dsk_5dJKmaTtRGT4"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LU7dskaun2kTMYuOe9_"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LU7dskczmNnaAqcD-yZ"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LU7dskczmNnaAqcD-y_"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LU7dskeCbiowJSD2_rV"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LU7dskfz4HOm0cFTYsg"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LU7dskgaYdFTlovs3PK"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LU7dskig4XsQc6LW9on"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LU7dskig4XsQc6LW9oo"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LU7dskjH3JWxc3-5iua"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LU7dskkZA-Xr9sCQTRi"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LU7dskmiu_-W4Cpgm1T"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LV0qHb-CYsiA84QpmAY"
            },
            {
                name: "repeating_earnedxp_-LOL0MvLYsuljyZCFymk_sorttrigger",
                current: false,
                max: "",
                id: "-LVEAPQXrE1zbcZHbst0"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_category",
                current: "Advantage",
                max: "",
                id: "-LV_mITqc93u0_eotwkV"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LV_mIWqN9eJumY9jsw0"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LV_mIWtKlnKwX0CUXcY"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LV_mIWuKsHGZRwh4f2C"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LV_mIWx28i-itiFKNqE"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_trait",
                current: "Loresheet (Newchurch)",
                max: "",
                id: "-LV_mMTgFxoX83D8tpLv"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_cost",
                current: 12,
                max: "",
                id: "-LV_mMW6AKRWITCDShQi"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_new",
                current: "4",
                max: "",
                id: "-LV_mMiQpp-1cjoO0dYc"
            },
            {
                name: "repeating_earnedxp_-LVaIa8cnzXhum3lscuA_xp_award",
                current: "1",
                max: "",
                id: "-LVaIa8W73iarDbF1qat"
            },
            {
                name: "repeating_earnedxp_-LVaIa8cnzXhum3lscuA_xp_session",
                current: "Three",
                max: "",
                id: "-LVaIa8YhtTEmK6nls1G"
            },
            {
                name: "repeating_earnedxp_-LVaIa8cnzXhum3lscuA_xp_reason",
                current: "Playing NPCs during Memoriam.",
                max: "",
                id: "-LVaIa8Z8Ug0M6WDL401"
            },
            {
                name: "repeating_earnedxp_-LVaUKCH8TkCB8LFBooF_xp_award",
                current: "1",
                max: "",
                id: "-LVaUKCANb4qp5STF4Xt"
            },
            {
                name: "repeating_earnedxp_-LVaUKCH8TkCB8LFBooF_xp_session",
                current: "Four",
                max: "",
                id: "-LVaUKCCvYSuYsON_F9G"
            },
            {
                name: "repeating_earnedxp_-LVaUKCH8TkCB8LFBooF_xp_reason",
                current: "Session XP award (albeit smaller, given the short session).",
                max: "",
                id: "-LVaUKCDh-G4Pny5J3UE"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_category",
                current: "Advantage",
                max: "",
                id: "-LWhp-8Z0z7VL715DHLx"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LWhp-B17gx45ilyEH6M"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LWhp-B4GadFXeVnSn5-"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LWhp-B7tCOPxYJRKrPF"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LWhp-B9R2E_suqwxfKd"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_trait",
                current: "Mawla",
                max: "",
                id: "-LWhp1a3OX9T86rUmxsl"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_cost",
                current: 3,
                max: "",
                id: "-LWhp1cL0LvmYSRdUarj"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_initial",
                current: "3",
                max: "",
                id: "-LWhp1olXXjgx5EAuQ_l"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_new",
                current: "4",
                max: "",
                id: "-LWhp2C361HWrKWTl1jz"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LWhp2s3_pmQ4-qJvvXt"
            },
            {
                name: "repeating_earnedxp_-LWiZi6KpdjLcOZCbaEr_xp_award",
                current: "2",
                max: "",
                id: "-LWiZi6HVVI0Tpv4xX3k"
            },
            {
                name: "repeating_earnedxp_-LWiZi6KpdjLcOZCbaEr_xp_session",
                current: "Five",
                max: "",
                id: "-LWiZi6JmXPD1lUAStjt"
            },
            {
                name: "repeating_earnedxp_-LWiZi6KpdjLcOZCbaEr_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LWiZi6KeH_5iisHwvPN"
            },
            {
                name: "repeating_earnedxp_-LXqZadBzvNwHnZYVjSJ_xp_award",
                current: "2",
                max: "",
                id: "-LXq_ad4X8uvHIXKJKuH"
            },
            {
                name: "repeating_earnedxp_-LXqZadBzvNwHnZYVjSJ_xp_session",
                current: "Six",
                max: "",
                id: "-LXq_ad63ZTDUT-9v42T"
            },
            {
                name: "repeating_earnedxp_-LXqZadBzvNwHnZYVjSJ_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LXq_ad8V6D2_S4w9nK6"
            },
            {
                name: "repeating_earnedxp_-LYxynFLlUntenrPS096_xp_award",
                current: "1",
                max: "",
                id: "-LYxynFHhgbamzr3XpWf"
            },
            {
                name: "repeating_earnedxp_-LYxynFLlUntenrPS096_xp_session",
                current: "Six",
                max: "",
                id: "-LYxynFJAuvWkXaWsQjP"
            },
            {
                name: "repeating_earnedxp_-LYxynFLlUntenrPS096_xp_reason",
                current: "Roleplaying an NPC in Ava's Memoriam",
                max: "",
                id: "-LYxynFKLPTy83DwciR1"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_category",
                current: "Attribute",
                max: "",
                id: "-LYyAOZ3JM8VsKmb08m4"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LYyAOcZvyjKsarDr4GE"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LYyAOcb3ivmAGdiHuk1"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LYyAOcePFw-7Gfs29Uh"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LYyAOchCS1v2E-CYrwh"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_trait",
                current: "Intelligence",
                max: "",
                id: "-LYyAQFgKjNd1u1843AS"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_cost",
                current: 20,
                max: "",
                id: "-LYyAQINp2oUIGrmccyP"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_initial",
                current: "3",
                max: "",
                id: "-LYyAQzbfl_frsI39IlW"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_new",
                current: "4",
                max: "",
                id: "-LYyARVhI7Z9H-hsrdAF"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LYypmjhYMQ1tUEIWADm"
            },
            {
                name: "repeating_earnedxp_-LZ5sM79KlGe1HsFHZ2Q_xp_award",
                current: "2",
                max: "",
                id: "-L_5sM73Y4YQbl_i1zN8"
            },
            {
                name: "repeating_earnedxp_-LZ5sM79KlGe1HsFHZ2Q_xp_session",
                current: "Seven",
                max: "",
                id: "-L_5sM74yWaL_ou_jUfI"
            },
            {
                name: "repeating_earnedxp_-LZ5sM79KlGe1HsFHZ2Q_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-L_5sM76M23950gK0yLy"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_category",
                current: "Clan Discipline",
                max: "",
                id: "-L_eHr2OnVtWWYD7VrtC"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-L_eHr7G1Y9BpUfB8jJl"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-L_eHr7Kq3LgLCySjMgQ"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_new_toggle",
                current: 1,
                max: "",
                id: "-L_eHr7NV18hh0tmQmay"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-L_eHr7QetqGGToT1KwI"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_trait",
                current: "Obfuscate 4 2 xp locked Requires BP 2",
                max: "",
                id: "-L_eHsoEM1XWOIXWo4Jp"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_cost",
                current: 20,
                max: "",
                id: "-L_eHsqkUp906P7Dg-2y"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_initial",
                current: "3",
                max: "",
                id: "-L_eHt5iUlribPPIAx5D"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_new",
                current: "4",
                max: "",
                id: "-L_eHtVPvUwrL3qJRNEH"
            },
            {
                name: "repeating_earnedxp_-LZebfVoomwhK3XT9ySl_xp_award",
                current: "3",
                max: "",
                id: "-L_ebfVhh0k3lk6FpS3I"
            },
            {
                name: "repeating_earnedxp_-LZebfVoomwhK3XT9ySl_xp_session",
                current: "Eight",
                max: "",
                id: "-L_ebfVjdejaYLDfhvBi"
            },
            {
                name: "repeating_earnedxp_-LZebfVoomwhK3XT9ySl_xp_reason",
                current: "Playing Alex the Lasombra during King's Memoriam, and playing him really, really, REALLY well.",
                max: "",
                id: "-L_ebfVkhicw9qbj-ZJU"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_category",
                current: "Advantage",
                max: "",
                id: "-LaDPW5RoMLmX_QcTpOv"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LaDPW9ny6wLrjfDBdVa"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LaDPW9qgrVtZE9viyu6"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LaDPW9tdPavOvV3E2Ax"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LaDPW9wJyveCW1WuORy"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_new",
                current: "1",
                max: "",
                id: "-LaDPXEVoSRc8Krw4KUp"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_trait",
                current: "Contacts The Aristocrat",
                max: "",
                id: "-LaDP_WzXtpQZAzrUN_R"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_cost",
                current: 3,
                max: "",
                id: "-LaDP_ZoyKMBWUAIo7kR"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LaDPc5yf2SqfJdTuSTL"
            },
            {
                name: "repeating_earnedxp_-LaDZU7-WlQ8HINIY4n4_xp_award",
                current: "2",
                max: "",
                id: "-LaDZU6sxDM7vwsNlWvk"
            },
            {
                name: "repeating_earnedxp_-LaDZU7-WlQ8HINIY4n4_xp_session",
                current: "Eight",
                max: "",
                id: "-LaDZU6uHtl54V9K5jz4"
            },
            {
                name: "repeating_earnedxp_-LaDZU7-WlQ8HINIY4n4_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LaDZU6wiNPqLl6u0Qve"
            },
            {
                name: "repeating_earnedxp_-LaJFzzQTdwQ7oBqAZxI_xp_award",
                current: "9",
                max: "",
                id: "-LaJFzzJKQltzCvWoiJM"
            },
            {
                name: "repeating_earnedxp_-LaJFzzQTdwQ7oBqAZxI_xp_session",
                current: "Nine",
                max: "",
                id: "-LaJFzzLTk2zEpQDwpwl"
            },
            {
                name: "repeating_earnedxp_-LaJFzzQTdwQ7oBqAZxI_xp_reason",
                current: "Refund for lost Herd (Patients) Background",
                max: "",
                id: "-LaJFzzNUiZiwXDPPnYG"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_category",
                current: "Skill",
                max: "",
                id: "-Laaqmrn-eykvLsYMStY"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-Laaqmw1uGWDJY8NEKBi"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-Laaqmw5msEI1aBaO5ck"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_new_toggle",
                current: 1,
                max: "",
                id: "-Laaqmw8-S2DFaRtztx6"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LaaqmwBlu_c-P1dZh5d"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_trait",
                current: "Crafts",
                max: "",
                id: "-LaaqobO4oPGI69_OCF-"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_cost",
                current: 3,
                max: "",
                id: "-LaaqoeiFpY-nZiNa5Fo"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_new",
                current: "1",
                max: "",
                id: "-LaaqpNU8klQrPnacpPs"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_category",
                current: "Advantage",
                max: "",
                id: "-Laart91ZCLxtLHg4Of3"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_cost",
                current: 6,
                max: "",
                id: "-LaartD1DouSuykAxpEW"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LaartD4LL1drSi9gZg5"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LaartD6NJOcTqwVxhTY"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LaartD9MQtHbsUOMgLz"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_initial",
                current: "1",
                max: "",
                id: "-Laartc_4FXKJ2k4PBab"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_new",
                current: "3",
                max: "",
                id: "-LaarttxVbwWpedzr76j"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LaarvKGTt1UbC76zo7A"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_category",
                current: "Clan Discipline",
                max: "",
                id: "-LaatALtON0BbKb5-3UO"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LaatAPN-lcTrsKJGSHd"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LaatAPQXe12GsGHOWoY"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LaatAPThBoY3PZFny0t"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LaatAPWzNDqqQTRPAo8"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_trait",
                current: "Dominate",
                max: "",
                id: "-LaatBRSvBpZoaqSteYS"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_cost",
                current: 10,
                max: "",
                id: "-LaatBUauWBxLHdD1xFq"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_initial",
                current: "1",
                max: "",
                id: "-LaatBazhlasCZVk4DFR"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_new",
                current: "2",
                max: "",
                id: "-LaatBtS9o0-y68RUYJX"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LaatCPGpioj9QJJ3afH"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LamJ5_K6az5_x4xvLHd"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_trait",
                current: "Contacts (The Aristocrat)",
                max: "",
                id: "-LamJ9FF6zEvAhkQoN1k"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LamJ9GCj2mOTq0Ihlpe"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_category",
                current: "Advantage",
                max: "",
                id: "-Lam__YC1yv94KBczScd"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-Lam__arvQ17MXoQF1Y-"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-Lam__avM340SskSKf-V"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_new_toggle",
                current: 1,
                max: "",
                id: "-Lam__ayamMQ_RZFgvJa"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-Lam__b1BRV0mCueget8"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_new",
                current: "2",
                max: "",
                id: "-Lam_aWjATbj6FFmET37"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_trait",
                current: "Herd 2  (Mobile Clinic)",
                max: "",
                id: "-Lam_lBi5a-f2FbcjYjn"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_cost",
                current: 6,
                max: "",
                id: "-Lam_lExMpW6ARcdMAKl"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-Lam_lt0od-CfC8-EChZ"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-Lbu5xVR-pXLHKFd0Ih4"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_spent_toggle",
                current: "0",
                max: "",
                id: "-LbuC7cUMRK-yQMDu8g1"
            },
            {
                name: "_reporder_repeating_spentxp",
                current: "-LOaLKRRBwYLz4EGdCWa,-LOaLRdJZb62plNm2LGK,-LOipUBMR4NWs3k5GEMN,-LRdS35zqTQZQSURSm0W,-LRdSaN5g-7rXous9qKE,-LRdSoczJpI7MPcxJSPg,-LTL-ZtVHOqFSwj8w35j,-LTL-dsRy3hS1eV9-Dvs,-LVZm9yaQfsARLurUGaq,-LVZmEeaBHCO0YGJaWBa,-LWhozCSF8j9IDqUmJQd,-LYyANiuyhrlaA1Y7G1R,-LZ5rlYr6PCoVu8bscs4,-LaDPUXGNfv90L0xsZ0D,-Laaqm0ZYo2-3jPmwnAk,-Laars8DEDz12BI4opac,-Laat9YRzAJyyac3wEll,-LamZZEZsLH9V4x2-1q7,-LZeHqQ8nruWFSCMw736",
                max: "",
                id: "-LbuDmslDp46AMhVHUAy"
            },
            {
                name: "repeating_earnedxp_-LcTot98UDVjxP7TtFvp_xp_award",
                current: "2",
                max: "",
                id: "-LcTot92Ywe58d-aYICO"
            },
            {
                name: "repeating_earnedxp_-LcTot98UDVjxP7TtFvp_xp_session",
                current: "Nine",
                max: "",
                id: "-LcTot96TmNHAKkE_28w"
            },
            {
                name: "repeating_earnedxp_-LcTot98UDVjxP7TtFvp_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LcTot99VXNvzWND9d_Y"
            },
            {
                name: "repeating_earnedxp_-LfnNrdt2tIZesVzbVcg_xp_award",
                current: "2",
                max: "",
                id: "-LfnNrdmgzKKjqFuQPhn"
            },
            {
                name: "repeating_earnedxp_-LfnNrdt2tIZesVzbVcg_xp_session",
                current: "Nine",
                max: "",
                id: "-LfnNrdrZWIMGOWwimCc"
            },
            {
                name: "repeating_earnedxp_-LfnNrdt2tIZesVzbVcg_xp_reason",
                current: "Scheer's Strike: Story completion award.",
                max: "",
                id: "-LfnNrdvkv4LaOiBWB_D"
            },
            {
                name: "_reporder_repeating_earnedxpright",
                current: "-LcTovNZ8XnpuNyvFnnm,-LcTovPBETC3Nx50A-ic,-LcTovQcTsYAZ3Goq91l,-LcTovRyOSTSUNeZYjIl,-LfnNrb3g2IpHPbvss23,-Lfr5Kli9kw5oo7qK2kp,-Lfr67TsoW4AcYz3yZuE,-LgPhoGYQVMHB0dQtlG3,-LgQ6z0-LEq3-YIEEDZ2,-LgQ7125wPQzDqnyY4r0,-LigID0vC6PRzpkH2yTi,-LigJJGg4UocCcY3nikh,-Ljltn7lAOIi7EZdBNQ7,-Ljoe69N3PFKw8rpggxm,-LjoeIlWFN2ChLqOVxV5,-LkvQPgPoKSnheOiDFoq,-LmCusV7l9ymS-5NKXoE,-LoIju1OFhVFMbYpmYRd,-LoKrRVMT6hIquIyoaeZ,-LoZBXteanfysoKkjm43,-LtvwTSWonGuZWmZLgmv,-LtvwdWKNqYGgiBp1RRo,-Ltvwkm-62dE1JoAfVla,-LtwWxs5LddvE07tC9yx,-LuVYjA7Fjs6oTzmNXSA,-LyGozzViXZXqrtrpljd,-LyRvkRe4VMcOP8vfqCU,-LzZIc7ZkSy6s5c4ndOE,-LzZIgVK2CiPK1Q75eOI,-M-HQ4RLcHBOyJrqFq-B,-Lz5Z07tZ8HvEzxAwu5q,-LzZvY2HwDMCZA1-fZcZ",
                max: "",
                id: "-LfnNrfCMyCNmW5eCSkK"
            },
            {
                name: "repeating_earnedxpright_-Lfr67TsoW4AcYz3yZuE_xp_award",
                current: 1,
                max: "",
                id: "-Lfr67TkQeTKbHhbmSXv"
            },
            {
                name: "repeating_earnedxpright_-Lfr67TsoW4AcYz3yZuE_xp_session",
                current: "Twenty-One",
                max: "",
                id: "-Lfr67TraAQntTaW3IIM"
            },
            {
                name: "repeating_earnedxpright_-Lfr67TsoW4AcYz3yZuE_xp_reason",
                current: "Excellent in-character ghoul play",
                max: "",
                id: "-Lfr67Tuz_Nnpr4u-nP4"
            },
            {
                name: "repeating_earnedxp_-Lfr67XLUkO-SkkBZdJo_xp_award",
                current: "2",
                max: "",
                id: "-Lfr67XDQfKfM9nTME6K"
            },
            {
                name: "repeating_earnedxp_-Lfr67XLUkO-SkkBZdJo_xp_session",
                current: "Ten",
                max: "",
                id: "-Lfr67XIjcPxxGB_ch_H"
            },
            {
                name: "repeating_earnedxp_-Lfr67XLUkO-SkkBZdJo_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-Lfr67XLK4u0rEyW1WQk"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_category",
                current: "Advantage",
                max: "",
                id: "-LgPhl8VwZWrQhfvPz30"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LgPhlYuySh-msc3M9qZ"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LgPhlZ0FCUFXt-9p2oh"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LgPhlZ4gFbGW6XrgAQa"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LgPhlZAYUTf0CMomQJt"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_new",
                current: "1",
                max: "",
                id: "-LgPhmIwj_TtZdvq2yFk"
            },
            {
                name: "repeating_earnedxpright_-LgPhoGYQVMHB0dQtlG3_xp_award",
                current: 2,
                max: "",
                id: "-LgPhoGQsdkdOaeGxJaI"
            },
            {
                name: "repeating_earnedxpright_-LgPhoGYQVMHB0dQtlG3_xp_session",
                current: "Twenty-Two",
                max: "",
                id: "-LgPhoGWQZIAKJh1hhXz"
            },
            {
                name: "repeating_earnedxpright_-LgPhoGYQVMHB0dQtlG3_xp_reason",
                current: "Refund for Haven Warding purchase",
                max: "",
                id: "-LgPhoGZENwvKqtTRZpT"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_trait",
                current: "Haven Warding Merit",
                max: "",
                id: "-LgPhoV7bwo2zhqe0X8y"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_cost",
                current: 3,
                max: "",
                id: "-LgPhoXY56C0V4gZQKh6"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LgPhonpCuImi4Ud3c5N"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_category",
                current: "Advantage",
                max: "",
                id: "-LgPu9ufkuSNKCXivRQj"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LgPu9zP8vWgQSk9WLAK"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LgPu9zZH8CFnSKJLLLQ"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LgPu9zdRJBglwxveFuf"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LgPu9zoj9aU-Us4z6t8"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_trait",
                current: "Loresheet (Netchurch)",
                max: "",
                id: "-LgPuDDH_6bKmL9yw4YH"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_cost",
                current: 6,
                max: "",
                id: "-LgPuDHIRa_rM8w8O_C-"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_new",
                current: "2",
                max: "",
                id: "-LgPuEIYmRXnBcF2Vao9"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LgPuyemGKgBy6N6LsmP"
            },
            {
                name: "repeating_earnedxpright_-LgQ6z0-LEq3-YIEEDZ2_xp_award",
                current: 1,
                max: "",
                id: "-LgQ6z-rP7AWGpp69ad0"
            },
            {
                name: "repeating_earnedxpright_-LgQ6z0-LEq3-YIEEDZ2_xp_session",
                current: "Twenty-Two",
                max: "",
                id: "-LgQ6z-xEUt6X_RQIAq_"
            },
            {
                name: "repeating_earnedxpright_-LgQ6z0-LEq3-YIEEDZ2_xp_reason",
                current: "RP: Little Character Moments",
                max: "",
                id: "-LgQ6z0-y8u0Chwu1Dxp"
            },
            {
                name: "repeating_earnedxp_-LgQ6z3as9GpFCbjpUj0_xp_award",
                current: "2",
                max: "",
                id: "-LgQ6z3S5-OF0Cb00P7q"
            },
            {
                name: "repeating_earnedxp_-LgQ6z3as9GpFCbjpUj0_xp_session",
                current: "Eleven",
                max: "",
                id: "-LgQ6z3ZhrB9A9U2CV90"
            },
            {
                name: "repeating_earnedxp_-LgQ6z3as9GpFCbjpUj0_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LgQ6z3cscZLLnerwh61"
            },
            {
                name: "repeating_earnedxpright_-LgQ7125wPQzDqnyY4r0_xp_award",
                current: 2,
                max: "",
                id: "-LgQ711x7F0QSePLCF_8"
            },
            {
                name: "repeating_earnedxpright_-LgQ7125wPQzDqnyY4r0_xp_session",
                current: "Twenty-Two",
                max: "",
                id: "-LgQ7122QiWEMUXNycjW"
            },
            {
                name: "repeating_earnedxpright_-LgQ7125wPQzDqnyY4r0_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-LgQ7126bOmElpjIUrVG"
            },
            {
                name: "repeating_earnedxp_-LigHrgA9V07wM4lWHam_xp_award",
                current: 2,
                max: "",
                id: "-LigHrg224xrFg8NuU8i"
            },
            {
                name: "repeating_earnedxp_-LigHrgA9V07wM4lWHam_xp_session",
                current: "Twelve",
                max: "",
                id: "-LigHrg6xQ0eiVLMUqG6"
            },
            {
                name: "repeating_earnedxp_-LigHrgA9V07wM4lWHam_xp_reason",
                current: "Brilliant montage idea",
                max: "",
                id: "-LigHrgA7LpGCPGMyUUs"
            },
            {
                name: "repeating_earnedxpright_-LigID0vC6PRzpkH2yTi_xp_award",
                current: 2,
                max: "",
                id: "-LigID0n4wMWRTRkP9bw"
            },
            {
                name: "repeating_earnedxpright_-LigID0vC6PRzpkH2yTi_xp_session",
                current: "Twenty-Three",
                max: "",
                id: "-LigID0t-i6Gsmwko8W_"
            },
            {
                name: "repeating_earnedxpright_-LigID0vC6PRzpkH2yTi_xp_reason",
                current: "Excellent RP and character development",
                max: "",
                id: "-LigID0wnYHujS3gbZ5C"
            },
            {
                name: "repeating_earnedxpright_-LigJJGg4UocCcY3nikh_xp_award",
                current: 2,
                max: "",
                id: "-LigJJGZJYklzwlA7aWQ"
            },
            {
                name: "repeating_earnedxpright_-LigJJGg4UocCcY3nikh_xp_session",
                current: "Twenty-Three",
                max: "",
                id: "-LigJJGc1pVyr-BNd3V7"
            },
            {
                name: "repeating_earnedxpright_-LigJJGg4UocCcY3nikh_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LigJJGfo5iSROcberqJ"
            },
            {
                name: "repeating_earnedxpright_-Ljltn7lAOIi7EZdBNQ7_xp_award",
                current: 2,
                max: "",
                id: "-Ljltn7fF3Daj1TBdZea"
            },
            {
                name: "repeating_earnedxpright_-Ljltn7lAOIi7EZdBNQ7_xp_session",
                current: "Twenty-Four",
                max: "",
                id: "-Ljltn7n3min-9sL4hm1"
            },
            {
                name: "repeating_earnedxpright_-Ljltn7lAOIi7EZdBNQ7_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-Ljltn7tukaWdsEwKKvT"
            },
            {
                name: "repeating_earnedxpright_-Ljoe69N3PFKw8rpggxm_xp_award",
                current: 1,
                max: "",
                id: "-Ljoe69EFh0s1ejgZvfM"
            },
            {
                name: "repeating_earnedxpright_-Ljoe69N3PFKw8rpggxm_xp_session",
                current: "Twenty-Five",
                max: "",
                id: "-Ljoe69No6oyemQC5tzL"
            },
            {
                name: "repeating_earnedxpright_-Ljoe69N3PFKw8rpggxm_xp_reason",
                current: "Awesome Compulsion RP",
                max: "",
                id: "-Ljoe69UCQ3Mu3o-kq8X"
            },
            {
                name: "repeating_earnedxpright_-LjoeIlWFN2ChLqOVxV5_xp_award",
                current: 2,
                max: "",
                id: "-LjoeIlNpo-n9s59vYHC"
            },
            {
                name: "repeating_earnedxpright_-LjoeIlWFN2ChLqOVxV5_xp_session",
                current: "Twenty-Five",
                max: "",
                id: "-LjoeIlWlr884hmeBlvK"
            },
            {
                name: "repeating_earnedxpright_-LjoeIlWFN2ChLqOVxV5_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LjoeIldiVmTrk3-QJuu"
            },
            {
                name: "repeating_earnedxp_-LkCCiW1Ggw-lhIZZa8P_xp_award",
                current: 2,
                max: "",
                id: "-LkCCiVvkOqVfhOerSY7"
            },
            {
                name: "repeating_earnedxp_-LkCCiW1Ggw-lhIZZa8P_xp_session",
                current: "Twelve",
                max: "",
                id: "-LkCCiW-gNefPCLR-AH8"
            },
            {
                name: "repeating_earnedxp_-LkCCiW1Ggw-lhIZZa8P_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LkCCiW4cMwCf5TiM1ij"
            },
            {
                name: "repeating_earnedxp_-LkCCiXlavMTlRmj9nCw_xp_award",
                current: 2,
                max: "",
                id: "-LkCCiXdBisdtigAxENE"
            },
            {
                name: "repeating_earnedxp_-LkCCiXlavMTlRmj9nCw_xp_session",
                current: "Thirteen",
                max: "",
                id: "-LkCCiXjOSppOXDQWik2"
            },
            {
                name: "repeating_earnedxp_-LkCCiXlavMTlRmj9nCw_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-LkCCiXrqrEfFNxED9Ch"
            },
            {
                name: "repeating_earnedxpright_-LkvQPgPoKSnheOiDFoq_xp_award",
                current: 2,
                max: "",
                id: "-LkvQPgIRX4Gv6OWrVVB"
            },
            {
                name: "repeating_earnedxpright_-LkvQPgPoKSnheOiDFoq_xp_session",
                current: "Twenty-Six",
                max: "",
                id: "-LkvQPgOsjJAKRTob5t_"
            },
            {
                name: "repeating_earnedxpright_-LkvQPgPoKSnheOiDFoq_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LkvQPgRqFVCakbFxZtV"
            },
            {
                name: "repeating_earnedxpright_-LmCusV7l9ymS-5NKXoE_xp_award",
                current: 2,
                max: "",
                id: "-LmCusV3DjyW_wYgJfDl"
            },
            {
                name: "repeating_earnedxpright_-LmCusV7l9ymS-5NKXoE_xp_session",
                current: "Twenty-Seven",
                max: "",
                id: "-LmCusV8Ct8R-I_PSnKR"
            },
            {
                name: "repeating_earnedxpright_-LmCusV7l9ymS-5NKXoE_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LmCusVCKtEWgkZg5AuP"
            },
            {
                name: "repeating_earnedxp_-LmCusVu3it4WZPdANZz_xp_award",
                current: 1,
                max: "",
                id: "-LmCusVr8tC84t4_gzAn"
            },
            {
                name: "repeating_earnedxp_-LmCusVu3it4WZPdANZz_xp_session",
                current: "Thirteen",
                max: "",
                id: "-LmCusVzwD0h-bow1MaE"
            },
            {
                name: "repeating_earnedxp_-LmCusVu3it4WZPdANZz_xp_reason",
                current: "Engaging with the plot",
                max: "",
                id: "-LmCusW2f9tcwAbyE_5p"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_category",
                current: "Skill",
                max: "",
                id: "-Lmb0AawXEfl3boeN5WZ"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-Lmb0AfmHWIogVtYynu-"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-Lmb0AfsjyR72PnMq9RP"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_new_toggle",
                current: 1,
                max: "",
                id: "-Lmb0AfzdwIAttBZMUmn"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-Lmb0Ag4YgO9wBKxYbZc"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_trait",
                current: "Subterfuge",
                max: "",
                id: "-Lmb0CA538BcdzZYKBml"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_cost",
                current: 6,
                max: "",
                id: "-Lmb0CEApbZSktSRXDCQ"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_initial",
                current: "1",
                max: "",
                id: "-Lmb0CcNyTA1rv_wMWWQ"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_new",
                current: "2",
                max: "",
                id: "-Lmb0D35988EBCQMAmrw"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_category",
                current: "Clan Discipline",
                max: "",
                id: "-Lmb0FSuUwgSS4UCaQwt"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-Lmb0FWuZ0dQTZ6jQeNm"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-Lmb0FWzEhBYIu7PIJvY"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_new_toggle",
                current: 1,
                max: "",
                id: "-Lmb0FX3N7mkB53nCcRW"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-Lmb0FX75qdbv6-qzd5b"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_trait",
                current: "Dominate",
                max: "",
                id: "-Lmb0Gp1OE-1ic1fTnZh"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_cost",
                current: 10,
                max: "",
                id: "-Lmb0Gt-8EanYOYg4m0Z"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_initial",
                current: "1",
                max: "",
                id: "-Lmb0H6yQIZxUoQmJ0la"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_new",
                current: "2",
                max: "",
                id: "-Lmb0H_RyqPE-zrCrEk6"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-Lmb3b94YLyKwFvHJeCy"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_category",
                current: "Advantage",
                max: "",
                id: "-LoI_hznjHpsssXuQ6rY"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LoI_i3jb9pZMzPPTKOn"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LoI_i3pD6BdhWN1meoi"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LoI_i3tJuxOnBIsirQl"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LoI_i3xIypA44sazddo"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_trait",
                current: "Loresheet (Netchurch)",
                max: "",
                id: "-LoI_lNaKgmr9Xj1Yzm0"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_cost",
                current: 9,
                max: "",
                id: "-LoI_lRAgp63b9nMirHx"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_new",
                current: "3",
                max: "",
                id: "-LoI_lf4YJU0gDcpyHOB"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LoI_mClyCNnMx6CwK1l"
            },
            {
                name: "repeating_earnedxpright_-LoIju1OFhVFMbYpmYRd_xp_award",
                current: 1,
                max: "",
                id: "-LoIju1KGlsWOFiSzMht"
            },
            {
                name: "repeating_earnedxpright_-LoIju1OFhVFMbYpmYRd_xp_session",
                current: "Twenty-Nine",
                max: "",
                id: "-LoIju1RnLV2vKR7ssW4"
            },
            {
                name: "repeating_earnedxpright_-LoIju1OFhVFMbYpmYRd_xp_reason",
                current: "Great RP as the baroness' lapdog",
                max: "",
                id: "-LoIju1WwoWujFukeD9P"
            },
            {
                name: "repeating_earnedxpright_-LoKrRVMT6hIquIyoaeZ_xp_award",
                current: 2,
                max: "",
                id: "-LoKrRVFWZPZFLO8O21c"
            },
            {
                name: "repeating_earnedxpright_-LoKrRVMT6hIquIyoaeZ_xp_session",
                current: "Twenty-Nine",
                max: "",
                id: "-LoKrRVYg77alGLaOEOw"
            },
            {
                name: "repeating_earnedxpright_-LoKrRVMT6hIquIyoaeZ_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LoKrRVaso4Y2oGS5xMg"
            },
            {
                name: "repeating_earnedxp_-LoKrRWIdXcMWg5A95Zy_xp_award",
                current: 2,
                max: "",
                id: "-LoKrRWAuWxCiP6dgZ0c"
            },
            {
                name: "repeating_earnedxp_-LoKrRWIdXcMWg5A95Zy_xp_session",
                current: "Fourteen",
                max: "",
                id: "-LoKrRWEkL7pjYUBB_1p"
            },
            {
                name: "repeating_earnedxp_-LoKrRWIdXcMWg5A95Zy_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-LoKrRWGv_lLnxhketFa"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LoLtBWP65lDlQwR90rf"
            },
            {
                name: "repeating_earnedxpright_-LoZBXteanfysoKkjm43_xp_award",
                current: 2,
                max: "",
                id: "-Lo_BXtaCVcF-mo0Bmct"
            },
            {
                name: "repeating_earnedxpright_-LoZBXteanfysoKkjm43_xp_session",
                current: "Thirty",
                max: "",
                id: "-Lo_BXtj9fYvWzq1Y4_Q"
            },
            {
                name: "repeating_earnedxpright_-LoZBXteanfysoKkjm43_xp_reason",
                current: "NPC Creation: Carlita",
                max: "",
                id: "-Lo_BXtr9NcugcUV6B3M"
            },
            {
                name: "repeating_earnedxpright_-LtvwTSWonGuZWmZLgmv_xp_award",
                current: 2,
                max: "",
                id: "-LtvwTSPfi7ibq3K7BhV"
            },
            {
                name: "repeating_earnedxpright_-LtvwTSWonGuZWmZLgmv_xp_session",
                current: "Thirty",
                max: "",
                id: "-LtvwTSRW5ZHNqbfdToo"
            },
            {
                name: "repeating_earnedxpright_-LtvwTSWonGuZWmZLgmv_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LtvwTSU7ws-DwHGW-0C"
            },
            {
                name: "repeating_earnedxp_-LtvwTT7jhAowEss8gWx_xp_award",
                current: 2,
                max: "",
                id: "-LtvwTT-83Jd1SV7uSue"
            },
            {
                name: "repeating_earnedxp_-LtvwTT7jhAowEss8gWx_xp_session",
                current: "Fifteen",
                max: "",
                id: "-LtvwTT3o8a3L5wZG9c9"
            },
            {
                name: "repeating_earnedxp_-LtvwTT7jhAowEss8gWx_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-LtvwTT5NGJROhicVxqU"
            },
            {
                name: "repeating_earnedxpright_-LtvwdWKNqYGgiBp1RRo_xp_award",
                current: 1,
                max: "",
                id: "-LtvwdWC0b1gqCxkzijt"
            },
            {
                name: "repeating_earnedxpright_-LtvwdWKNqYGgiBp1RRo_xp_session",
                current: "Thirty-One",
                max: "",
                id: "-LtvwdWGCYJfsvzVLfnE"
            },
            {
                name: "repeating_earnedxpright_-LtvwdWKNqYGgiBp1RRo_xp_reason",
                current: "Playing Cardinal Collins",
                max: "",
                id: "-LtvwdWIvxT5FqevjOvq"
            },
            {
                name: "repeating_earnedxpright_-Ltvwkm-62dE1JoAfVla_xp_award",
                current: 2,
                max: "",
                id: "-LtvwkltNvL0a660LU0u"
            },
            {
                name: "repeating_earnedxpright_-Ltvwkm-62dE1JoAfVla_xp_session",
                current: "Thirty-One",
                max: "",
                id: "-LtvwklwKP-zVrUTEPF_"
            },
            {
                name: "repeating_earnedxpright_-Ltvwkm-62dE1JoAfVla_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LtvwklysAgqUsxcoosC"
            },
            {
                name: "repeating_earnedxp_-LtvwkmdPRafElEGeJcj_xp_award",
                current: 2,
                max: "",
                id: "-LtvwkmWpncHrG1E-uPc"
            },
            {
                name: "repeating_earnedxp_-LtvwkmdPRafElEGeJcj_xp_session",
                current: "Fifteen",
                max: "",
                id: "-LtvwkmZPrM0qbPBoMkh"
            },
            {
                name: "repeating_earnedxp_-LtvwkmdPRafElEGeJcj_xp_reason",
                current: "Being vampires!",
                max: "",
                id: "-Ltvwkma5F3teWVnVnVS"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_category",
                current: "Skill",
                max: "",
                id: "-Ltw3uPWM2OmGH97nmax"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-Ltw3uTUMvTQhG80cq1W"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-Ltw3uTZr915Dq8mSez5"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_new_toggle",
                current: 1,
                max: "",
                id: "-Ltw3uTeXdTf9BHVMEfX"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-Ltw3uTjWFe7AWhJnBZu"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_trait",
                current: "Science 4",
                max: "",
                id: "-Ltw3w2jXY9Vu8e-41Vo"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_cost",
                current: 12,
                max: "",
                id: "-Ltw3w5w4lNDOPafbih3"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_initial",
                current: "3",
                max: "",
                id: "-Ltw3wN_fMdLfGMI7_Xv"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_new",
                current: "4",
                max: "",
                id: "-Ltw3wq3EGElKnnBvmGw"
            },
            {
                name: "repeating_earnedxpright_-LtwWxs5LddvE07tC9yx_xp_award",
                current: 2,
                max: "",
                id: "-LtwWxryTddml90QNfae"
            },
            {
                name: "repeating_earnedxpright_-LtwWxs5LddvE07tC9yx_xp_session",
                current: "Thirty-Two",
                max: "",
                id: "-LtwWxs1q2tePlE65o-j"
            },
            {
                name: "repeating_earnedxpright_-LtwWxs5LddvE07tC9yx_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LtwWxs3Vyl8FzW7Uo9K"
            },
            {
                name: "repeating_earnedxpright_-LuVYjA7Fjs6oTzmNXSA_xp_award",
                current: 2,
                max: "",
                id: "-LuVYjA0hZPepOdcz2Ic"
            },
            {
                name: "repeating_earnedxpright_-LuVYjA7Fjs6oTzmNXSA_xp_session",
                current: "Thirty-Three",
                max: "",
                id: "-LuVYjA4uulvNZP1Tqcj"
            },
            {
                name: "repeating_earnedxpright_-LuVYjA7Fjs6oTzmNXSA_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LuVYjACbiA5VBwLDu-U"
            },
            {
                name: "repeating_earnedxp_-LuVYjB2euZDJTy-ir0Z_xp_award",
                current: 2,
                max: "",
                id: "-LuVYjAxZpP4CWQkyf11"
            },
            {
                name: "repeating_earnedxp_-LuVYjB2euZDJTy-ir0Z_xp_session",
                current: "Sixteen",
                max: "",
                id: "-LuVYjB0dMpWEFBSzTwR"
            },
            {
                name: "repeating_earnedxp_-LuVYjB2euZDJTy-ir0Z_xp_reason",
                current: "FOR OBFUSCATE ONLY",
                max: "",
                id: "-LuVYjB3NyICwne2uWxu"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-Lxe1H3GqJPyH9ayoxiT"
            },
            {
                name: "repeating_earnedxpright_-LyGozzViXZXqrtrpljd_xp_award",
                current: 2,
                max: "",
                id: "-LyGozzTnWCiOTi04KoV"
            },
            {
                name: "repeating_earnedxpright_-LyGozzViXZXqrtrpljd_xp_session",
                current: "Thirty-Four",
                max: "",
                id: "-LyGozzYqYy9RyGLzq2J"
            },
            {
                name: "repeating_earnedxpright_-LyGozzViXZXqrtrpljd_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LyGozzbGLxK7DeZnQDL"
            },
            {
                name: "repeating_spentxp_-LyRLIe5rzPxOuPHuR8E_xp_category",
                current: "Advantage",
                max: "",
                id: "-LyRLJwDw61gIeWxP1sg"
            },
            {
                name: "repeating_spentxp_-LyRLIe5rzPxOuPHuR8E_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LyRLK-lZB73vekh6s5J"
            },
            {
                name: "repeating_spentxp_-LyRLIe5rzPxOuPHuR8E_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LyRLK-r1VvAixtD0hwv"
            },
            {
                name: "repeating_spentxp_-LyRLIe5rzPxOuPHuR8E_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LyRLK-xY8E28H7iArFL"
            },
            {
                name: "repeating_spentxp_-LyRLIe5rzPxOuPHuR8E_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LyRLK02w4GuLZOVNUA6"
            },
            {
                name: "repeating_spentxp_-LyRLIe5rzPxOuPHuR8E_xp_trait",
                current: "Loresheet (Netchurch)",
                max: "",
                id: "-LyRLOWPXDKF_Ex0Apml"
            },
            {
                name: "repeating_spentxp_-LyRLIe5rzPxOuPHuR8E_xp_cost",
                current: 15,
                max: "",
                id: "-LyRLO_T4Z89Qo9jTAN7"
            },
            {
                name: "repeating_spentxp_-LyRLIe5rzPxOuPHuR8E_xp_new",
                current: "5",
                max: "",
                id: "-LyRLP0LHoM-mxg-F3rF"
            },
            {
                name: "repeating_earnedxpright_-LyRvkRe4VMcOP8vfqCU_xp_award",
                current: 2,
                max: "",
                id: "-LyRvkRXffrN4d2QItOp"
            },
            {
                name: "repeating_earnedxpright_-LyRvkRe4VMcOP8vfqCU_xp_session",
                current: "Thirty-Five",
                max: "",
                id: "-LyRvkRheHr26zpDTBNd"
            },
            {
                name: "repeating_earnedxpright_-LyRvkRe4VMcOP8vfqCU_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LyRvkRl1Rdcp_uri8d8"
            },
            {
                name: "repeating_earnedxp_-LyRvkSiU0a0YIAW9bQ8_xp_award",
                current: 2,
                max: "",
                id: "-LyRvkSaGlR1AhPce1Em"
            },
            {
                name: "repeating_earnedxp_-LyRvkSiU0a0YIAW9bQ8_xp_session",
                current: "Sixteen",
                max: "",
                id: "-LyRvkSfMySJimUEY5wg"
            },
            {
                name: "repeating_earnedxp_-LyRvkSiU0a0YIAW9bQ8_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-LyRvkSilTlQf4eVtT81"
            },
            {
                name: "repeating_earnedxpright_-Lz5Z07tZ8HvEzxAwu5q_xp_award",
                current: 2,
                max: "",
                id: "-Lz5_07kPxPVpERWjudK"
            },
            {
                name: "repeating_earnedxpright_-Lz5Z07tZ8HvEzxAwu5q_xp_session",
                current: "Thirty-Six",
                max: "",
                id: "-Lz5_07qPO-8drvW7MCo"
            },
            {
                name: "repeating_earnedxpright_-Lz5Z07tZ8HvEzxAwu5q_xp_reason",
                current: "Session XP Award.",
                max: "",
                id: "-Lz5_07uCXfakP9Jh76A"
            },
            {
                name: "repeating_earnedxpright_-LzZIc7ZkSy6s5c4ndOE_xp_award",
                current: -6,
                max: "",
                id: "-LzZIc7WqUkN5nT6gd7q"
            },
            {
                name: "repeating_earnedxpright_-LzZIc7ZkSy6s5c4ndOE_xp_session",
                current: "Thirty-Six",
                max: "",
                id: "-LzZIc7cG6Y78JWnS-Pw"
            },
            {
                name: "repeating_earnedxpright_-LzZIc7ZkSy6s5c4ndOE_xp_reason",
                current: "Resolving Flaw: Enemy.",
                max: "",
                id: "-LzZIc7gkQ5-iULFTK_u"
            },
            {
                name: "repeating_earnedxp_-LzZIcADSXXN5z3y7AFZ_xp_award",
                current: 2,
                max: "",
                id: "-LzZIcA71aNlW3GJ49Nz"
            },
            {
                name: "repeating_earnedxp_-LzZIcADSXXN5z3y7AFZ_xp_session",
                current: "Seventeen",
                max: "",
                id: "-LzZIcACeDRmye053qY5"
            },
            {
                name: "repeating_earnedxp_-LzZIcADSXXN5z3y7AFZ_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-LzZIcAFPTlWo3qpCG4g"
            },
            {
                name: "repeating_earnedxpright_-LzZIgVK2CiPK1Q75eOI_xp_award",
                current: 18,
                max: "",
                id: "-LzZIgVGsJyfgmVHePsI"
            },
            {
                name: "repeating_earnedxpright_-LzZIgVK2CiPK1Q75eOI_xp_session",
                current: "Thirty-Six",
                max: "",
                id: "-LzZIgVQC8FzTPYJhZ8M"
            },
            {
                name: "repeating_earnedxpright_-LzZIgVK2CiPK1Q75eOI_xp_reason",
                current: "Losing Allies: Bookies.",
                max: "",
                id: "-LzZIgVX4kNZbcc0KfHk"
            },
            {
                name: "repeating_earnedxpright_-LzZvY2HwDMCZA1-fZcZ_xp_award",
                current: 2,
                max: "",
                id: "-LzZvY2ABHC_SZqG2IvT"
            },
            {
                name: "repeating_earnedxpright_-LzZvY2HwDMCZA1-fZcZ_xp_session",
                current: "Thirty-Seven",
                max: "",
                id: "-LzZvY2DoWr8gXE32EK-"
            },
            {
                name: "repeating_earnedxpright_-LzZvY2HwDMCZA1-fZcZ_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LzZvY2F3ko1g1GcnM6Y"
            },
            {
                name: "repeating_earnedxp_-LzZvY32hqS8nLS89IlR_xp_award",
                current: 2,
                max: "",
                id: "-LzZvY2wJ9vwPQUizuxN"
            },
            {
                name: "repeating_earnedxp_-LzZvY32hqS8nLS89IlR_xp_session",
                current: "Seventeen",
                max: "",
                id: "-LzZvY3-1HtjXbZ5lYtM"
            },
            {
                name: "repeating_earnedxp_-LzZvY32hqS8nLS89IlR_xp_reason",
                current: "The Vultures Circle",
                max: "",
                id: "-LzZvY31m5zLWSSYxZsd"
            },
            {
                name: "repeating_earnedxpright_-M-HQ4RLcHBOyJrqFq-B_xp_award",
                current: 9,
                max: "",
                id: "-M-HQ4RB_Zql3s8VwdqD"
            },
            {
                name: "repeating_earnedxpright_-M-HQ4RLcHBOyJrqFq-B_xp_session",
                current: "Thirty-Six",
                max: "",
                id: "-M-HQ4RG53N1nZSfDAmJ"
            },
            {
                name: "repeating_earnedxpright_-M-HQ4RLcHBOyJrqFq-B_xp_reason",
                current: "Loosing Herd: Bookies",
                max: "",
                id: "-M-HQ4RK4YQmeFMUs0cC"
            },
            {
                name: "repeating_spentxp_-LyRLIe5rzPxOuPHuR8E_xp_spent_toggle",
                current: "0",
                max: "",
                id: "-M-HQEhXI56LofAVSR7H"
            },
            {
                name: "repeating_earnedxp_-M-cZiiSEPZQ1OX1wH7H_xp_award",
                current: 20,
                max: "",
                id: "-M-cZiiMn84ZA5_X9q-k"
            },
            {
                name: "repeating_earnedxp_-M-cZiiSEPZQ1OX1wH7H_xp_session",
                current: "Eighteen",
                max: "",
                id: "-M-cZiiPMl3FGs5ju_4N"
            },
            {
                name: "repeating_earnedxp_-M-cZiiSEPZQ1OX1wH7H_xp_reason",
                current: "Award for 15 month time jump.",
                max: "",
                id: "-M-cZiiSiRmvWdMWLS6T"
            },
            {
                name: "repeating_earnedxpright_-M0GDgu1YZz4glMFeJ3D_xp_award",
                current: 2,
                max: "",
                id: "-M0GDgtzjPQJQruRlVuy"
            },
            {
                name: "repeating_earnedxpright_-M0GDgu1YZz4glMFeJ3D_xp_session",
                current: "Thirty-Eight",
                max: "",
                id: "-M0GDgu0NtlxoG6z78Vn"
            },
            {
                name: "repeating_earnedxpright_-M0GDgu1YZz4glMFeJ3D_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-M0GDgu2er3h0dWTKnRF"
            },
            {
                name: "repeating_earnedxpright_-M1OAdEJJOwnWUhJVGq4_xp_award",
                current: 2,
                max: "",
                id: "-M1OAdECFwCIBdrh86ZC"
            },
            {
                name: "repeating_earnedxpright_-M1OAdEJJOwnWUhJVGq4_xp_session",
                current: "Thirty-Nine",
                max: "",
                id: "-M1OAdEFPCjb7KyUGpeo"
            },
            {
                name: "repeating_earnedxpright_-M1OAdEJJOwnWUhJVGq4_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-M1OAdEIXHOJiBwNkpRd"
            },
            {
                name: "repeating_spentxp_-M4BiXLUw-nA3g7GogiJ_xp_category",
                current: "Blood Potency",
                max: "",
                id: "-M4BiY1latbtYO0qkuce"
            },
            {
                name: "repeating_spentxp_-M4BiXLUw-nA3g7GogiJ_xp_cost",
                current: 20,
                max: "",
                id: "-M4BiY6E4hwSXo97p6_-"
            },
            {
                name: "repeating_spentxp_-M4BiXLUw-nA3g7GogiJ_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-M4BiY6Jq__AcwSqyTx1"
            },
            {
                name: "repeating_spentxp_-M4BiXLUw-nA3g7GogiJ_xp_new_toggle",
                current: 1,
                max: "",
                id: "-M4BiY6Og5_PlpyIGkmQ"
            },
            {
                name: "repeating_spentxp_-M4BiXLUw-nA3g7GogiJ_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-M4BiY6To6gAgfrvRHVw"
            },
            {
                name: "repeating_spentxp_-M4BiXLUw-nA3g7GogiJ_xp_initial",
                current: "1",
                max: "",
                id: "-M4BiYdYxylN7oDbJ4yT"
            },
            {
                name: "repeating_spentxp_-M4BiXLUw-nA3g7GogiJ_xp_new",
                current: "2",
                max: "",
                id: "-M4BiZ19vpDmarMBnbD6"
            },
            {
                name: "repeating_earnedxpright_-M4BwgVrQyvoCgzj9UOb_xp_award",
                current: 2,
                max: "",
                id: "-M4BwgVnptJphRq3iv2u"
            },
            {
                name: "repeating_earnedxpright_-M4BwgVrQyvoCgzj9UOb_xp_session",
                current: "Forty",
                max: "",
                id: "-M4BwgVsfswVutkNuZQw"
            },
            {
                name: "repeating_earnedxpright_-M4BwgVrQyvoCgzj9UOb_xp_reason",
                current: "RPing Drug Addiction",
                max: "",
                id: "-M4BwgVu98egNg2-OG5L"
            },
            {
                name: "repeating_earnedxp_-M4BwgWfnAGtZ1NPqrjD_xp_award",
                current: 2,
                max: "",
                id: "-M4BwgWb04bwHz8UG7xs"
            },
            {
                name: "repeating_earnedxp_-M4BwgWfnAGtZ1NPqrjD_xp_session",
                current: "Eighteen",
                max: "",
                id: "-M4BwgWdU9MvtZhsU7ub"
            },
            {
                name: "repeating_earnedxp_-M4BwgWfnAGtZ1NPqrjD_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-M4BwgWfqrq4rqKs2-dr"
            },
            {
                name: "repeating_earnedxpright_-M4CPrmfZZ6G3fnXapvL_xp_award",
                current: 2,
                max: "",
                id: "-M4CPrmbu2mJza5V2F_7"
            },
            {
                name: "repeating_earnedxpright_-M4CPrmfZZ6G3fnXapvL_xp_session",
                current: "Forty",
                max: "",
                id: "-M4CPrmdJzJFjv7N8e1i"
            },
            {
                name: "repeating_earnedxpright_-M4CPrmfZZ6G3fnXapvL_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-M4CPrmfyVlXTBGau0GO"
            },
            {
                name: "repeating_earnedxpright_-M5KQYZkC00kYZ4dhrZ7_xp_award",
                current: 2,
                max: "",
                id: "-M5KQY_auw9sb49jD8PE"
            },
            {
                name: "repeating_earnedxpright_-M5KQYZkC00kYZ4dhrZ7_xp_session",
                current: "Forty-One",
                max: "",
                id: "-M5KQY_eu3y8FXoY7lGp"
            },
            {
                name: "repeating_earnedxpright_-M5KQYZkC00kYZ4dhrZ7_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-M5KQY_hD6gVDhcrC04F"
            },
            {
                name: "repeating_earnedxp_-M5KQYag3xUDpR8bwD-w_xp_award",
                current: 2,
                max: "",
                id: "-M5KQYaXdMX4zP-JhV27"
            },
            {
                name: "repeating_earnedxp_-M5KQYag3xUDpR8bwD-w_xp_session",
                current: "Nineteen",
                max: "",
                id: "-M5KQYaamMrOTT8AbvEe"
            },
            {
                name: "repeating_earnedxp_-M5KQYag3xUDpR8bwD-w_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-M5KQYadCLaVL0qNiEZM"
            },
            {
                name: "repeating_earnedxpright_-M5KRwlo9N502f9xX4uc_xp_award",
                current: 5,
                max: "",
                id: "-M5KRwlebCp0eyUzwcM_"
            },
            {
                name: "repeating_earnedxpright_-M5KRwlo9N502f9xX4uc_xp_session",
                current: "Forty-Two",
                max: "",
                id: "-M5KRwljXm1FDmU9Iqi7"
            },
            {
                name: "repeating_earnedxpright_-M5KRwlo9N502f9xX4uc_xp_reason",
                current: "Session Scribe",
                max: "",
                id: "-M5KRwlmsYxrTABvn-wf"
            },
            {
                name: "repeating_earnedxpright_-M5tVKgWfXGtJz4NowPc_xp_award",
                current: 2,
                max: "",
                id: "-M5tVKgOrlbsHfj9gCmz"
            },
            {
                name: "repeating_earnedxpright_-M5tVKgWfXGtJz4NowPc_xp_session",
                current: "Forty-Two",
                max: "",
                id: "-M5tVKgSMqjn6DOy2s7s"
            },
            {
                name: "repeating_earnedxpright_-M5tVKgWfXGtJz4NowPc_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-M5tVKgVdALsrHIGE8N4"
            },
            {
                name: "repeating_earnedxp_-M5tVKhMUY6JXXsZwZMs_xp_award",
                current: 2,
                max: "",
                id: "-M5tVKhFC3f3izbXsAhG"
            },
            {
                name: "repeating_earnedxp_-M5tVKhMUY6JXXsZwZMs_xp_session",
                current: "Twenty",
                max: "",
                id: "-M5tVKhLxY3FRDdsmOQb"
            },
            {
                name: "repeating_earnedxp_-M5tVKhMUY6JXXsZwZMs_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-M5tVKhOgXLRKTpLJ8l4"
            },
            {
                name: "repeating_earnedxpright_-M6SWKhpjh6dnYQ7LrZJ_xp_award",
                current: 2,
                max: "",
                id: "-M6SWKhhG1-87NtY5tOV"
            },
            {
                name: "repeating_earnedxpright_-M6SWKhpjh6dnYQ7LrZJ_xp_session",
                current: "Forty-Three",
                max: "",
                id: "-M6SWKhkxqzoylZ_ud5T"
            },
            {
                name: "repeating_earnedxpright_-M6SWKhpjh6dnYQ7LrZJ_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-M6SWKhny0zQ-L6jebV1"
            },
            {
                name: "repeating_earnedxpright_-M6SWZiVuv-00lGYRHAJ_xp_award",
                current: 2,
                max: "",
                id: "-M6SWZiPS7o4AOqzjtHU"
            },
            {
                name: "repeating_earnedxpright_-M6SWZiVuv-00lGYRHAJ_xp_session",
                current: "Forty-Three",
                max: "",
                id: "-M6SWZiVObl8j3ddKk4n"
            },
            {
                name: "repeating_earnedxpright_-M6SWZiVuv-00lGYRHAJ_xp_reason",
                current: "Session Scribe",
                max: "",
                id: "-M6SWZiaU5zzerOtK0yI"
            },
            {
                name: "repeating_earnedxp_-M6SWZkfSVM9ESTFb4Nj_xp_award",
                current: 2,
                max: "",
                id: "-M6SWZkZX6GUNJOrOgsI"
            },
            {
                name: "repeating_earnedxp_-M6SWZkfSVM9ESTFb4Nj_xp_session",
                current: "Twenty-One",
                max: "",
                id: "-M6SWZkcakSlg0RMYqrG"
            },
            {
                name: "repeating_earnedxp_-M6SWZkfSVM9ESTFb4Nj_xp_reason",
                current: "Your unending patience!",
                max: "",
                id: "-M6SWZkfgZIEjyXSoz6S"
            },
            {
                name: "repeating_earnedxpright_-M70WNAgiPk9cm9Xxm52_xp_award",
                current: 2,
                max: "",
                id: "-M70WNA_bFS8RHJA3TA-"
            },
            {
                name: "repeating_earnedxpright_-M70WNAgiPk9cm9Xxm52_xp_session",
                current: "Forty-Four",
                max: "",
                id: "-M70WNAcTXa35AbvA6-Q"
            },
            {
                name: "repeating_earnedxpright_-M70WNAgiPk9cm9Xxm52_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-M70WNAefMQ4n47JyeCK"
            },
            {
                name: "repeating_spentxp_-MAxMS4tBgIagE41sa6c_xp_category",
                current: "Advantage",
                max: "",
                id: "-MAxMTBq6dUJkIUrnagP"
            },
            {
                name: "repeating_spentxp_-MAxMS4tBgIagE41sa6c_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-MAxMTGuWs48YX397_3J"
            },
            {
                name: "repeating_spentxp_-MAxMS4tBgIagE41sa6c_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-MAxMTH1HkIloez32JhS"
            },
            {
                name: "repeating_spentxp_-MAxMS4tBgIagE41sa6c_xp_new_toggle",
                current: 1,
                max: "",
                id: "-MAxMTH9NLqP5mT5N5zm"
            },
            {
                name: "repeating_spentxp_-MAxMS4tBgIagE41sa6c_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-MAxMTHF93FoW9Xbuy3s"
            },
            {
                name: "repeating_spentxp_-MAxMS4tBgIagE41sa6c_xp_trait",
                current: "Allies (Bookies)",
                max: "",
                id: "-MAxMVQL656a_HbV3Im9"
            },
            {
                name: "repeating_spentxp_-MAxMS4tBgIagE41sa6c_xp_cost",
                current: 18,
                max: "",
                id: "-MAxMVUmKNRiNdVYjCt7"
            },
            {
                name: "repeating_spentxp_-MAxMS4tBgIagE41sa6c_xp_new",
                current: "6",
                max: "",
                id: "-MAxMWOW2Nv_mMkRGFnx"
            },
            {
                name: "repeating_spentxp_-M4BiXLUw-nA3g7GogiJ_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-MAxN4tJKdjfsuD9eiIA"
            },
            {
                name: "repeating_spentxp_-MAxNEwOG3jYWCEFqlRh_xp_category",
                current: "Attribute",
                max: "",
                id: "-MAxNFXrGT1DHAYOLGwS"
            },
            {
                name: "repeating_spentxp_-MAxNEwOG3jYWCEFqlRh_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-MAxNFbWaRZhMGSWsqMX"
            },
            {
                name: "repeating_spentxp_-MAxNEwOG3jYWCEFqlRh_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-MAxNFbaA7V64M5XS721"
            },
            {
                name: "repeating_spentxp_-MAxNEwOG3jYWCEFqlRh_xp_new_toggle",
                current: 1,
                max: "",
                id: "-MAxNFbeZiRmWgFULoC1"
            },
            {
                name: "repeating_spentxp_-MAxNEwOG3jYWCEFqlRh_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-MAxNFbiUkw4jxPdca5v"
            },
            {
                name: "repeating_spentxp_-MAxNEwOG3jYWCEFqlRh_xp_initial",
                current: "2",
                max: "",
                id: "-MAxNGLfEIhnbiy33VpE"
            },
            {
                name: "repeating_spentxp_-MAxNEwOG3jYWCEFqlRh_xp_new",
                current: "3",
                max: "",
                id: "-MAxNGiU1Q9fzQoO_c2V"
            },
            {
                name: "repeating_spentxp_-MAxNEwOG3jYWCEFqlRh_xp_trait",
                current: "Resolve",
                max: "",
                id: "-MAxNIGYc0M3amP-fi3R"
            },
            {
                name: "repeating_spentxp_-MAxNEwOG3jYWCEFqlRh_xp_cost",
                current: 15,
                max: "",
                id: "-MAxNIKqBRKp2gjK00Rn"
            },
            {
                name: "repeating_earnedxpright_-MAxox49IY75TscL8dBh_xp_award",
                current: 1,
                max: "",
                id: "-MAxox452PH9An-vU0Zd"
            },
            {
                name: "repeating_earnedxpright_-MAxox49IY75TscL8dBh_xp_session",
                current: "Forty-Five",
                max: "",
                id: "-MAxox4BxlSSk86XujMn"
            },
            {
                name: "repeating_earnedxpright_-MAxox49IY75TscL8dBh_xp_reason",
                current: "Spotlight Prompt for Ava",
                max: "",
                id: "-MAxox4F0t2lQcCUz5A5"
            },
            {
                name: "repeating_earnedxp_-MAxox55f1TkQekwNZ7F_xp_award",
                current: 2,
                max: "",
                id: "-MAxox51avM8Lv3Fmt1z"
            },
            {
                name: "repeating_earnedxp_-MAxox55f1TkQekwNZ7F_xp_session",
                current: "Twenty-One",
                max: "",
                id: "-MAxox56cNdsbor9IQpw"
            },
            {
                name: "repeating_earnedxp_-MAxox55f1TkQekwNZ7F_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-MAxox5B4wFBuGOJFGQg"
            },
            {
                name: "repeating_earnedxpright_-MAxsc4yw0k9XYw7MDaf_xp_award",
                current: 1,
                max: "",
                id: "-MAxsc4u5BLmLsDfRkZ_"
            },
            {
                name: "repeating_earnedxpright_-MAxsc4yw0k9XYw7MDaf_xp_session",
                current: "Forty-Five",
                max: "",
                id: "-MAxsc4z1OPYIrG4zl6c"
            },
            {
                name: "repeating_earnedxpright_-MAxsc4yw0k9XYw7MDaf_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-MAxsc53IKLxzggE8BdT"
            }
        ],
        25: [
            {
                name: "xp_summary",
                current: "206 XP Earned - 156 XP Spent =  50 XP Remaining",
                max: "",
                id: "-LU7dsfS20fV0ZfSn1gO"
            },
            {
                name: "repeating_earnedxp_-LOL0MvLYsuljyZCFymk_xp_award",
                current: "15",
                max: "",
                id: "-LU7dsfTOeGpyj3vduPs"
            },
            {
                name: "repeating_earnedxp_-LOL0MvLYsuljyZCFymk_xp_session",
                current: "Zero",
                max: "",
                id: "-LU7dsfU3R2T2spwB8Do"
            },
            {
                name: "repeating_earnedxp_-LOL0MvLYsuljyZCFymk_xp_reason",
                current: "Initial XP awarded at the beginning of the Chronicle.",
                max: "",
                id: "-LU7dsfVkJbPIJ_AULQI"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_category",
                current: "Clan Discipline",
                max: "",
                id: "-LU7dsg65B78RevMdfgF"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_trait",
                current: "Auspex",
                max: "",
                id: "-LU7dsgBCaxyUWZSmYxS"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_cost",
                current: 10,
                max: "",
                id: "-LU7dsgBCaxyUWZSmYxT"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_initial",
                current: "1",
                max: "",
                id: "-LU7dsgCOeusF4xqj-Er"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_new",
                current: "2",
                max: "",
                id: "-LU7dsgDSFTywmIsd-UH"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_category",
                current: "Advantage",
                max: "",
                id: "-LU7dsgE1g-ZcqaSs3T5"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_initial",
                current: "1",
                max: "",
                id: "-LU7dsgKwRm4CizlXOgL"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_new",
                current: "2",
                max: "",
                id: "-LU7dsgKwRm4CizlXOgM"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_trait",
                current: "Contacts (Pharma)",
                max: "",
                id: "-LU7dsgLQNtgCBtkxE5K"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_cost",
                current: 3,
                max: "",
                id: "-LU7dsgN1U_lCGqVcjXf"
            },
            {
                name: "repeating_earnedxp_-LOaOePNOjwmn9CW4oWY_xp_award",
                current: "1",
                max: "",
                id: "-LU7dsgSWCLOyRsMBRgZ"
            },
            {
                name: "repeating_earnedxp_-LOaOePNOjwmn9CW4oWY_xp_session",
                current: "Zero",
                max: "",
                id: "-LU7dsgTvwZyuVyVIKFo"
            },
            {
                name: "repeating_earnedxp_-LOaOePNOjwmn9CW4oWY_xp_reason",
                current: "Creating a relationship hook with Ava Wong, Jo's character.",
                max: "",
                id: "-LU7dsgUp-HAuSj8WEXb"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_category",
                current: "Advantage",
                max: "",
                id: "-LU7dsgb2xsXU_GgWYM7"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_trait",
                current: "Herd (Field Clinic)",
                max: "",
                id: "-LU7dsggjBc6iL4RCRL2"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_cost",
                current: 6,
                max: "",
                id: "-LU7dsgh_l4mYMwRQVOM"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_new",
                current: "2",
                max: "",
                id: "-LU7dsgiSKNG6GABne89"
            },
            {
                name: "repeating_earnedxp_-LPOmiZY-6Q2SB8AQJM3_xp_award",
                current: "4",
                max: "",
                id: "-LU7dsgzdz2k03LFmc-J"
            },
            {
                name: "repeating_earnedxp_-LPOmiZY-6Q2SB8AQJM3_xp_session",
                current: "One",
                max: "",
                id: "-LU7dsh-vXsqmVu0ya-r"
            },
            {
                name: "repeating_earnedxp_-LPOmiZY-6Q2SB8AQJM3_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LU7dsh-vXsqmVu0ya-s"
            },
            {
                name: "repeating_earnedxp_-LPqtifvc9bwzYpsuJ1E_xp_award",
                current: "9",
                max: "",
                id: "-LU7dsh20g95XujQISZm"
            },
            {
                name: "repeating_earnedxp_-LPqtifvc9bwzYpsuJ1E_xp_session",
                current: "Zero",
                max: "",
                id: "-LU7dsh49rRPOBaaYZVw"
            },
            {
                name: "repeating_earnedxp_-LPqtifvc9bwzYpsuJ1E_xp_reason",
                current: "Completing character sheet by the Thursday deadline..",
                max: "",
                id: "-LU7dsh5zLm2FK9bISAV"
            },
            {
                name: "_reporder_repeating_earnedxp",
                current: "-LOL0MvLYsuljyZCFymk,-LOaOePNOjwmn9CW4oWY,-LPOmiZY-6Q2SB8AQJM3,-LPqtifvc9bwzYpsuJ1E,-LQi-2PfA4iwP7T7FFzt,-LQi-J171uzZXnC-vewh,-LRuzhHXwCUYV11KaaRK,-LRuziGli9eaOsLceHIK,-LVaIa8cnzXhum3lscuA,-LVaUKCH8TkCB8LFBooF,-LWiZi6KpdjLcOZCbaEr,-LXqZadBzvNwHnZYVjSJ,-LYxynFLlUntenrPS096,-LZ5sM79KlGe1HsFHZ2Q,-LZebfVoomwhK3XT9ySl,-LaDZU7-WlQ8HINIY4n4,-LaJFzzQTdwQ7oBqAZxI,-LcTot98UDVjxP7TtFvp,-LfnNrdt2tIZesVzbVcg,-Lfr67XLUkO-SkkBZdJo,-LgQ6z3as9GpFCbjpUj0,-LigHrgA9V07wM4lWHam,-LjltnC3p9FqCfZD5tNJ,-LjnG66NboEtrmwVaKoq,-LjnOWqutTVfJX2RLYXV,-Ljodc6N8qIcdweBNiPc",
                max: "",
                id: "-LU7dsh6HHew8O2CJ1Oq"
            },
            {
                name: "repeating_earnedxp_-LQi-2PfA4iwP7T7FFzt_xp_award",
                current: "2",
                max: "",
                id: "-LU7dsi4LQiQ-BfVekWV"
            },
            {
                name: "repeating_earnedxp_-LQi-2PfA4iwP7T7FFzt_xp_session",
                current: "Two",
                max: "",
                id: "-LU7dsi5MCKNYf7Ff2ti"
            },
            {
                name: "repeating_earnedxp_-LQi-2PfA4iwP7T7FFzt_xp_reason",
                current: "Three Troubled Thin-Bloods: Story completion award.",
                max: "",
                id: "-LU7dsi7-0sCgAbrOxuf"
            },
            {
                name: "repeating_earnedxp_-LQi-J171uzZXnC-vewh_xp_award",
                current: "5",
                max: "",
                id: "-LU7dsi8Su9MeDOz5xFm"
            },
            {
                name: "repeating_earnedxp_-LQi-J171uzZXnC-vewh_xp_session",
                current: "Two",
                max: "",
                id: "-LU7dsi8Su9MeDOz5xFn"
            },
            {
                name: "repeating_earnedxp_-LQi-J171uzZXnC-vewh_xp_reason",
                current: "Excellent Loresheet for Netchurch.",
                max: "",
                id: "-LU7dsiA_oBXO79dZGJh"
            },
            {
                name: "xp_earnedtotal",
                current: 206,
                max: "",
                id: "-LU7dsiC3A8UvJY9Cp0_"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_category",
                current: "Advantage",
                max: "",
                id: "-LU7dsiEfKr6snYfoQVb"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_trait",
                current: "Mask (John  Nate)",
                max: "",
                id: "-LU7dsiI1-Q0jyG_vvCj"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_cost",
                current: 6,
                max: "",
                id: "-LU7dsiK4o70oLvQy0e3"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_new",
                current: "2",
                max: "",
                id: "-LU7dsiK4o70oLvQy0e4"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_category",
                current: "Advantage",
                max: "",
                id: "-LU7dsiMEqNHwldkjukn"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_new",
                current: "1",
                max: "",
                id: "-LU7dsiRXkLPqKUHepgq"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_trait",
                current: "Loresheet (Newchurch)",
                max: "",
                id: "-LU7dsiSfQVyOFXI8dhL"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_cost",
                current: 3,
                max: "",
                id: "-LU7dsiT8j81f1UwutdK"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_category",
                current: "Skill",
                max: "",
                id: "-LU7dsiUJn4qVdb2NiTb"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_trait",
                current: "Etiquette",
                max: "",
                id: "-LU7dsi_tMrvLJ-TvJI3"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_cost",
                current: 6,
                max: "",
                id: "-LU7dsibpVJRHCse_1Fd"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_initial",
                current: "1",
                max: "",
                id: "-LU7dsicdwymwHnMheLi"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_new",
                current: "2",
                max: "",
                id: "-LU7dsidqunFZghJHr2h"
            },
            {
                name: "repeating_earnedxp_-LRuzhHXwCUYV11KaaRK_xp_award",
                current: "2",
                max: "",
                id: "-LU7dsikmIhegvzBOP6e"
            },
            {
                name: "repeating_earnedxp_-LRuzhHXwCUYV11KaaRK_xp_session",
                current: "Two",
                max: "",
                id: "-LU7dsimDxL1HctsLEsP"
            },
            {
                name: "repeating_earnedxp_-LRuzhHXwCUYV11KaaRK_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LU7dsincl0X13iLrapW"
            },
            {
                name: "repeating_earnedxp_-LRuziGli9eaOsLceHIK_xp_award",
                current: "2",
                max: "",
                id: "-LU7dsincl0X13iLrapX"
            },
            {
                name: "repeating_earnedxp_-LRuziGli9eaOsLceHIK_xp_session",
                current: "Three",
                max: "",
                id: "-LU7dsip77G68eB-CcQ8"
            },
            {
                name: "repeating_earnedxp_-LRuziGli9eaOsLceHIK_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LU7dsirpLUrpZQrNkhg"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_category",
                current: "Skill",
                max: "",
                id: "-LU7dsjYK1rTdQPBYuaY"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_trait",
                current: "Intimidate",
                max: "",
                id: "-LU7dsjdDciAuI5GkOEp"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_cost",
                current: 3,
                max: "",
                id: "-LU7dsjeL5oJmluaj97W"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_new",
                current: "1",
                max: "",
                id: "-LU7dsjfA76W8xOAXO14"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_category",
                current: "Advantage",
                max: "",
                id: "-LU7dsjhkGxyRupA50F9"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_trait",
                current: "Herd (Bookies)",
                max: "",
                id: "-LU7dsjnymOoJa1zTmtf"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_cost",
                current: 9,
                max: "",
                id: "-LU7dsjoESYSD0iSp4k-"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_new",
                current: "3",
                max: "",
                id: "-LU7dsjoESYSD0iSp4k0"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LU7dsk8Q3vUQRRfcs5D"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LU7dsk9ehE62NSNlU5n"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LU7dskAIYma6A2g2aI5"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LU7dskAIYma6A2g2aI6"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LU7dskCzmlfYGDlMuKn"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LU7dskDfBpSGoqnqDyY"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LU7dskEk49SZtcoouXE"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LU7dskFczQG6FqKA7hC"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LU7dskGglgmOmTIxQ4j"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LU7dskH_2nARamCKY_n"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LU7dskIC5-zPyXJEpFd"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LU7dskJYBr1IR9Z0X7I"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LU7dskKv4ViLEoyHtdt"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LU7dskLPpKWfkzuOfdP"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LU7dskM1Zrlt0Y4dZV7"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LU7dskOHtRiMD34RzHr"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LU7dskOHtRiMD34RzHs"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LU7dskPKwucHV02a73a"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LU7dskQAMCfoGNlT-A0"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LU7dskSBBxQbVB5R6WQ"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LU7dskSBBxQbVB5R6WR"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LU7dskTAmkLWXyM8PtR"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LU7dskV1vfDz5kPn-p8"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LU7dskV1vfDz5kPn-p9"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LU7dskXRSgyVDiG3gpr"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LU7dskXRSgyVDiG3gps"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LU7dskZ4ym3FbegJQZs"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LU7dsk_5dJKmaTtRGT4"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LU7dskaun2kTMYuOe9_"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LU7dskczmNnaAqcD-yZ"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LU7dskczmNnaAqcD-y_"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LU7dskeCbiowJSD2_rV"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LU7dskfz4HOm0cFTYsg"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LU7dskgaYdFTlovs3PK"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LU7dskig4XsQc6LW9on"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LU7dskig4XsQc6LW9oo"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LU7dskjH3JWxc3-5iua"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LU7dskkZA-Xr9sCQTRi"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LU7dskmiu_-W4Cpgm1T"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_spent_toggle",
                current: "0",
                max: "",
                id: "-LV0qHb-CYsiA84QpmAY"
            },
            {
                name: "repeating_earnedxp_-LOL0MvLYsuljyZCFymk_sorttrigger",
                current: false,
                max: "",
                id: "-LVEAPQXrE1zbcZHbst0"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_category",
                current: "Advantage",
                max: "",
                id: "-LV_mITqc93u0_eotwkV"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LV_mIWqN9eJumY9jsw0"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LV_mIWtKlnKwX0CUXcY"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LV_mIWuKsHGZRwh4f2C"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LV_mIWx28i-itiFKNqE"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_trait",
                current: "Loresheet (Newchurch)",
                max: "",
                id: "-LV_mMTgFxoX83D8tpLv"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_cost",
                current: 12,
                max: "",
                id: "-LV_mMW6AKRWITCDShQi"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_new",
                current: "4",
                max: "",
                id: "-LV_mMiQpp-1cjoO0dYc"
            },
            {
                name: "repeating_earnedxp_-LVaIa8cnzXhum3lscuA_xp_award",
                current: "1",
                max: "",
                id: "-LVaIa8W73iarDbF1qat"
            },
            {
                name: "repeating_earnedxp_-LVaIa8cnzXhum3lscuA_xp_session",
                current: "Three",
                max: "",
                id: "-LVaIa8YhtTEmK6nls1G"
            },
            {
                name: "repeating_earnedxp_-LVaIa8cnzXhum3lscuA_xp_reason",
                current: "Playing NPCs during Memoriam.",
                max: "",
                id: "-LVaIa8Z8Ug0M6WDL401"
            },
            {
                name: "repeating_earnedxp_-LVaUKCH8TkCB8LFBooF_xp_award",
                current: "1",
                max: "",
                id: "-LVaUKCANb4qp5STF4Xt"
            },
            {
                name: "repeating_earnedxp_-LVaUKCH8TkCB8LFBooF_xp_session",
                current: "Four",
                max: "",
                id: "-LVaUKCCvYSuYsON_F9G"
            },
            {
                name: "repeating_earnedxp_-LVaUKCH8TkCB8LFBooF_xp_reason",
                current: "Session XP award (albeit smaller, given the short session).",
                max: "",
                id: "-LVaUKCDh-G4Pny5J3UE"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_category",
                current: "Advantage",
                max: "",
                id: "-LWhp-8Z0z7VL715DHLx"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LWhp-B17gx45ilyEH6M"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LWhp-B4GadFXeVnSn5-"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LWhp-B7tCOPxYJRKrPF"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LWhp-B9R2E_suqwxfKd"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_trait",
                current: "Mawla",
                max: "",
                id: "-LWhp1a3OX9T86rUmxsl"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_cost",
                current: 3,
                max: "",
                id: "-LWhp1cL0LvmYSRdUarj"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_initial",
                current: "3",
                max: "",
                id: "-LWhp1olXXjgx5EAuQ_l"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_new",
                current: "4",
                max: "",
                id: "-LWhp2C361HWrKWTl1jz"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LWhp2s3_pmQ4-qJvvXt"
            },
            {
                name: "repeating_earnedxp_-LWiZi6KpdjLcOZCbaEr_xp_award",
                current: "2",
                max: "",
                id: "-LWiZi6HVVI0Tpv4xX3k"
            },
            {
                name: "repeating_earnedxp_-LWiZi6KpdjLcOZCbaEr_xp_session",
                current: "Five",
                max: "",
                id: "-LWiZi6JmXPD1lUAStjt"
            },
            {
                name: "repeating_earnedxp_-LWiZi6KpdjLcOZCbaEr_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LWiZi6KeH_5iisHwvPN"
            },
            {
                name: "repeating_earnedxp_-LXqZadBzvNwHnZYVjSJ_xp_award",
                current: "2",
                max: "",
                id: "-LXq_ad4X8uvHIXKJKuH"
            },
            {
                name: "repeating_earnedxp_-LXqZadBzvNwHnZYVjSJ_xp_session",
                current: "Six",
                max: "",
                id: "-LXq_ad63ZTDUT-9v42T"
            },
            {
                name: "repeating_earnedxp_-LXqZadBzvNwHnZYVjSJ_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LXq_ad8V6D2_S4w9nK6"
            },
            {
                name: "repeating_earnedxp_-LYxynFLlUntenrPS096_xp_award",
                current: "1",
                max: "",
                id: "-LYxynFHhgbamzr3XpWf"
            },
            {
                name: "repeating_earnedxp_-LYxynFLlUntenrPS096_xp_session",
                current: "Six",
                max: "",
                id: "-LYxynFJAuvWkXaWsQjP"
            },
            {
                name: "repeating_earnedxp_-LYxynFLlUntenrPS096_xp_reason",
                current: "Roleplaying an NPC in Ava's Memoriam",
                max: "",
                id: "-LYxynFKLPTy83DwciR1"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_category",
                current: "Attribute",
                max: "",
                id: "-LYyAOZ3JM8VsKmb08m4"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LYyAOcZvyjKsarDr4GE"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LYyAOcb3ivmAGdiHuk1"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LYyAOcePFw-7Gfs29Uh"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LYyAOchCS1v2E-CYrwh"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_trait",
                current: "Intelligence",
                max: "",
                id: "-LYyAQFgKjNd1u1843AS"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_cost",
                current: 20,
                max: "",
                id: "-LYyAQINp2oUIGrmccyP"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_initial",
                current: "3",
                max: "",
                id: "-LYyAQzbfl_frsI39IlW"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_new",
                current: "4",
                max: "",
                id: "-LYyARVhI7Z9H-hsrdAF"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LYypmjhYMQ1tUEIWADm"
            },
            {
                name: "repeating_earnedxp_-LZ5sM79KlGe1HsFHZ2Q_xp_award",
                current: "2",
                max: "",
                id: "-L_5sM73Y4YQbl_i1zN8"
            },
            {
                name: "repeating_earnedxp_-LZ5sM79KlGe1HsFHZ2Q_xp_session",
                current: "Seven",
                max: "",
                id: "-L_5sM74yWaL_ou_jUfI"
            },
            {
                name: "repeating_earnedxp_-LZ5sM79KlGe1HsFHZ2Q_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-L_5sM76M23950gK0yLy"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_category",
                current: "Clan Discipline",
                max: "",
                id: "-L_eHr2OnVtWWYD7VrtC"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-L_eHr7G1Y9BpUfB8jJl"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-L_eHr7Kq3LgLCySjMgQ"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_new_toggle",
                current: 1,
                max: "",
                id: "-L_eHr7NV18hh0tmQmay"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-L_eHr7QetqGGToT1KwI"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_trait",
                current: "Obfuscate 4 2 xp locked Requires BP 2",
                max: "",
                id: "-L_eHsoEM1XWOIXWo4Jp"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_cost",
                current: 20,
                max: "",
                id: "-L_eHsqkUp906P7Dg-2y"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_initial",
                current: "3",
                max: "",
                id: "-L_eHt5iUlribPPIAx5D"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_new",
                current: "4",
                max: "",
                id: "-L_eHtVPvUwrL3qJRNEH"
            },
            {
                name: "repeating_earnedxp_-LZebfVoomwhK3XT9ySl_xp_award",
                current: "3",
                max: "",
                id: "-L_ebfVhh0k3lk6FpS3I"
            },
            {
                name: "repeating_earnedxp_-LZebfVoomwhK3XT9ySl_xp_session",
                current: "Eight",
                max: "",
                id: "-L_ebfVjdejaYLDfhvBi"
            },
            {
                name: "repeating_earnedxp_-LZebfVoomwhK3XT9ySl_xp_reason",
                current: "Playing Alex the Lasombra during King's Memoriam, and playing him really, really, REALLY well.",
                max: "",
                id: "-L_ebfVkhicw9qbj-ZJU"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_category",
                current: "Advantage",
                max: "",
                id: "-LaDPW5RoMLmX_QcTpOv"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LaDPW9ny6wLrjfDBdVa"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LaDPW9qgrVtZE9viyu6"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LaDPW9tdPavOvV3E2Ax"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LaDPW9wJyveCW1WuORy"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_new",
                current: "1",
                max: "",
                id: "-LaDPXEVoSRc8Krw4KUp"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_trait",
                current: "Contacts The Aristocrat",
                max: "",
                id: "-LaDP_WzXtpQZAzrUN_R"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_cost",
                current: 3,
                max: "",
                id: "-LaDP_ZoyKMBWUAIo7kR"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LaDPc5yf2SqfJdTuSTL"
            },
            {
                name: "repeating_earnedxp_-LaDZU7-WlQ8HINIY4n4_xp_award",
                current: "2",
                max: "",
                id: "-LaDZU6sxDM7vwsNlWvk"
            },
            {
                name: "repeating_earnedxp_-LaDZU7-WlQ8HINIY4n4_xp_session",
                current: "Eight",
                max: "",
                id: "-LaDZU6uHtl54V9K5jz4"
            },
            {
                name: "repeating_earnedxp_-LaDZU7-WlQ8HINIY4n4_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LaDZU6wiNPqLl6u0Qve"
            },
            {
                name: "repeating_earnedxp_-LaJFzzQTdwQ7oBqAZxI_xp_award",
                current: "9",
                max: "",
                id: "-LaJFzzJKQltzCvWoiJM"
            },
            {
                name: "repeating_earnedxp_-LaJFzzQTdwQ7oBqAZxI_xp_session",
                current: "Nine",
                max: "",
                id: "-LaJFzzLTk2zEpQDwpwl"
            },
            {
                name: "repeating_earnedxp_-LaJFzzQTdwQ7oBqAZxI_xp_reason",
                current: "Refund for lost Herd (Patients) Background",
                max: "",
                id: "-LaJFzzNUiZiwXDPPnYG"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_category",
                current: "Skill",
                max: "",
                id: "-Laaqmrn-eykvLsYMStY"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-Laaqmw1uGWDJY8NEKBi"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-Laaqmw5msEI1aBaO5ck"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_new_toggle",
                current: 1,
                max: "",
                id: "-Laaqmw8-S2DFaRtztx6"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LaaqmwBlu_c-P1dZh5d"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_trait",
                current: "Crafts",
                max: "",
                id: "-LaaqobO4oPGI69_OCF-"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_cost",
                current: 3,
                max: "",
                id: "-LaaqoeiFpY-nZiNa5Fo"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_new",
                current: "1",
                max: "",
                id: "-LaaqpNU8klQrPnacpPs"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_category",
                current: "Advantage",
                max: "",
                id: "-Laart91ZCLxtLHg4Of3"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_cost",
                current: 6,
                max: "",
                id: "-LaartD1DouSuykAxpEW"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LaartD4LL1drSi9gZg5"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LaartD6NJOcTqwVxhTY"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LaartD9MQtHbsUOMgLz"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_initial",
                current: "1",
                max: "",
                id: "-Laartc_4FXKJ2k4PBab"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_new",
                current: "3",
                max: "",
                id: "-LaarttxVbwWpedzr76j"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LaarvKGTt1UbC76zo7A"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_category",
                current: "Clan Discipline",
                max: "",
                id: "-LaatALtON0BbKb5-3UO"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LaatAPN-lcTrsKJGSHd"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LaatAPQXe12GsGHOWoY"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LaatAPThBoY3PZFny0t"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LaatAPWzNDqqQTRPAo8"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_trait",
                current: "Dominate",
                max: "",
                id: "-LaatBRSvBpZoaqSteYS"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_cost",
                current: 10,
                max: "",
                id: "-LaatBUauWBxLHdD1xFq"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_initial",
                current: "1",
                max: "",
                id: "-LaatBazhlasCZVk4DFR"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_new",
                current: "2",
                max: "",
                id: "-LaatBtS9o0-y68RUYJX"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LaatCPGpioj9QJJ3afH"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LamJ5_K6az5_x4xvLHd"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_trait",
                current: "Contacts (The Aristocrat)",
                max: "",
                id: "-LamJ9FF6zEvAhkQoN1k"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LamJ9GCj2mOTq0Ihlpe"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_category",
                current: "Advantage",
                max: "",
                id: "-Lam__YC1yv94KBczScd"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-Lam__arvQ17MXoQF1Y-"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-Lam__avM340SskSKf-V"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_new_toggle",
                current: 1,
                max: "",
                id: "-Lam__ayamMQ_RZFgvJa"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-Lam__b1BRV0mCueget8"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_new",
                current: "2",
                max: "",
                id: "-Lam_aWjATbj6FFmET37"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_trait",
                current: "Herd 2  (Mobile Clinic)",
                max: "",
                id: "-Lam_lBi5a-f2FbcjYjn"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_cost",
                current: 6,
                max: "",
                id: "-Lam_lExMpW6ARcdMAKl"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-Lam_lt0od-CfC8-EChZ"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-Lbu5xVR-pXLHKFd0Ih4"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LbuC7cUMRK-yQMDu8g1"
            },
            {
                name: "_reporder_repeating_spentxp",
                current: "-LOaLKRRBwYLz4EGdCWa,-LOaLRdJZb62plNm2LGK,-LOipUBMR4NWs3k5GEMN,-LRdS35zqTQZQSURSm0W,-LRdSaN5g-7rXous9qKE,-LRdSoczJpI7MPcxJSPg,-LTL-ZtVHOqFSwj8w35j,-LVZmEeaBHCO0YGJaWBa,-LWhozCSF8j9IDqUmJQd,-LYyANiuyhrlaA1Y7G1R,-LaDPUXGNfv90L0xsZ0D,-Laaqm0ZYo2-3jPmwnAk,-Laars8DEDz12BI4opac,-Laat9YRzAJyyac3wEll,-LamZZEZsLH9V4x2-1q7,-LZeHqQ8nruWFSCMw736,-LgPhkGn1g9HqIZpd8Bc,-LgPu8EKIrgJBgqoKBQZ,-Lmb09tDDqu5ImCOYogB,-Lmb0DsAHfcs5K6TZ5tH,-LoIZgujgFcUENp6XaBn,-Ltw3u0QNMdkBBroPKp0,-M4BiXLUw-nA3g7GogiJ,-MAxMS4tBgIagE41sa6c,-LTL-dsRy3hS1eV9-Dvs,-LyRLIe5rzPxOuPHuR8E,-MAxNEwOG3jYWCEFqlRh,-MC29xYSiwBVelh-I0nE",
                max: "",
                id: "-LbuDmslDp46AMhVHUAy"
            },
            {
                name: "repeating_earnedxp_-LcTot98UDVjxP7TtFvp_xp_award",
                current: "2",
                max: "",
                id: "-LcTot92Ywe58d-aYICO"
            },
            {
                name: "repeating_earnedxp_-LcTot98UDVjxP7TtFvp_xp_session",
                current: "Nine",
                max: "",
                id: "-LcTot96TmNHAKkE_28w"
            },
            {
                name: "repeating_earnedxp_-LcTot98UDVjxP7TtFvp_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LcTot99VXNvzWND9d_Y"
            },
            {
                name: "repeating_earnedxp_-LfnNrdt2tIZesVzbVcg_xp_award",
                current: "2",
                max: "",
                id: "-LfnNrdmgzKKjqFuQPhn"
            },
            {
                name: "repeating_earnedxp_-LfnNrdt2tIZesVzbVcg_xp_session",
                current: "Nine",
                max: "",
                id: "-LfnNrdrZWIMGOWwimCc"
            },
            {
                name: "repeating_earnedxp_-LfnNrdt2tIZesVzbVcg_xp_reason",
                current: "Scheer's Strike: Story completion award.",
                max: "",
                id: "-LfnNrdvkv4LaOiBWB_D"
            },
            {
                name: "_reporder_repeating_earnedxpright",
                current: "-LcTovNZ8XnpuNyvFnnm,-LcTovPBETC3Nx50A-ic,-LcTovQcTsYAZ3Goq91l,-LcTovRyOSTSUNeZYjIl,-LfnNrb3g2IpHPbvss23,-Lfr5Kli9kw5oo7qK2kp,-Lfr67TsoW4AcYz3yZuE,-LgPhoGYQVMHB0dQtlG3,-LgQ6z0-LEq3-YIEEDZ2,-LgQ7125wPQzDqnyY4r0,-LigID0vC6PRzpkH2yTi,-LigJJGg4UocCcY3nikh,-Ljltn7lAOIi7EZdBNQ7,-Ljoe69N3PFKw8rpggxm,-LjoeIlWFN2ChLqOVxV5,-LkvQPgPoKSnheOiDFoq,-LmCusV7l9ymS-5NKXoE,-LoIju1OFhVFMbYpmYRd,-LoKrRVMT6hIquIyoaeZ,-LoZBXteanfysoKkjm43,-LtvwTSWonGuZWmZLgmv,-LtvwdWKNqYGgiBp1RRo,-Ltvwkm-62dE1JoAfVla,-LtwWxs5LddvE07tC9yx,-LuVYjA7Fjs6oTzmNXSA,-LyGozzViXZXqrtrpljd,-LyRvkRe4VMcOP8vfqCU,-LzZIc7ZkSy6s5c4ndOE,-LzZIgVK2CiPK1Q75eOI,-M-HQ4RLcHBOyJrqFq-B,-Lz5Z07tZ8HvEzxAwu5q,-LzZvY2HwDMCZA1-fZcZ",
                max: "",
                id: "-LfnNrfCMyCNmW5eCSkK"
            },
            {
                name: "repeating_earnedxp_-Lfr67XLUkO-SkkBZdJo_xp_award",
                current: "2",
                max: "",
                id: "-Lfr67XDQfKfM9nTME6K"
            },
            {
                name: "repeating_earnedxp_-Lfr67XLUkO-SkkBZdJo_xp_session",
                current: "Ten",
                max: "",
                id: "-Lfr67XIjcPxxGB_ch_H"
            },
            {
                name: "repeating_earnedxp_-Lfr67XLUkO-SkkBZdJo_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-Lfr67XLK4u0rEyW1WQk"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_category",
                current: "Advantage",
                max: "",
                id: "-LgPhl8VwZWrQhfvPz30"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LgPhlYuySh-msc3M9qZ"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LgPhlZ0FCUFXt-9p2oh"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LgPhlZ4gFbGW6XrgAQa"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LgPhlZAYUTf0CMomQJt"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_new",
                current: "1",
                max: "",
                id: "-LgPhmIwj_TtZdvq2yFk"
            },
            {
                name: "repeating_earnedxpright_-LgPhoGYQVMHB0dQtlG3_xp_award",
                current: 2,
                max: "",
                id: "-LgPhoGQsdkdOaeGxJaI"
            },
            {
                name: "repeating_earnedxpright_-LgPhoGYQVMHB0dQtlG3_xp_session",
                current: "Twenty-Two",
                max: "",
                id: "-LgPhoGWQZIAKJh1hhXz"
            },
            {
                name: "repeating_earnedxpright_-LgPhoGYQVMHB0dQtlG3_xp_reason",
                current: "Refund for Haven Warding purchase",
                max: "",
                id: "-LgPhoGZENwvKqtTRZpT"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_trait",
                current: "Haven Warding Merit",
                max: "",
                id: "-LgPhoV7bwo2zhqe0X8y"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_cost",
                current: 3,
                max: "",
                id: "-LgPhoXY56C0V4gZQKh6"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LgPhonpCuImi4Ud3c5N"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_category",
                current: "Advantage",
                max: "",
                id: "-LgPu9ufkuSNKCXivRQj"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LgPu9zP8vWgQSk9WLAK"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LgPu9zZH8CFnSKJLLLQ"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LgPu9zdRJBglwxveFuf"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LgPu9zoj9aU-Us4z6t8"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_trait",
                current: "Loresheet (Netchurch)",
                max: "",
                id: "-LgPuDDH_6bKmL9yw4YH"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_cost",
                current: 6,
                max: "",
                id: "-LgPuDHIRa_rM8w8O_C-"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_new",
                current: "2",
                max: "",
                id: "-LgPuEIYmRXnBcF2Vao9"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LgPuyemGKgBy6N6LsmP"
            },
            {
                name: "repeating_earnedxpright_-LgQ6z0-LEq3-YIEEDZ2_xp_award",
                current: 1,
                max: "",
                id: "-LgQ6z-rP7AWGpp69ad0"
            },
            {
                name: "repeating_earnedxpright_-LgQ6z0-LEq3-YIEEDZ2_xp_session",
                current: "Twenty-Two",
                max: "",
                id: "-LgQ6z-xEUt6X_RQIAq_"
            },
            {
                name: "repeating_earnedxpright_-LgQ6z0-LEq3-YIEEDZ2_xp_reason",
                current: "RP: Little Character Moments",
                max: "",
                id: "-LgQ6z0-y8u0Chwu1Dxp"
            },
            {
                name: "repeating_earnedxp_-LgQ6z3as9GpFCbjpUj0_xp_award",
                current: "2",
                max: "",
                id: "-LgQ6z3S5-OF0Cb00P7q"
            },
            {
                name: "repeating_earnedxp_-LgQ6z3as9GpFCbjpUj0_xp_session",
                current: "Eleven",
                max: "",
                id: "-LgQ6z3ZhrB9A9U2CV90"
            },
            {
                name: "repeating_earnedxp_-LgQ6z3as9GpFCbjpUj0_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LgQ6z3cscZLLnerwh61"
            },
            {
                name: "repeating_earnedxpright_-LgQ7125wPQzDqnyY4r0_xp_award",
                current: 2,
                max: "",
                id: "-LgQ711x7F0QSePLCF_8"
            },
            {
                name: "repeating_earnedxpright_-LgQ7125wPQzDqnyY4r0_xp_session",
                current: "Twenty-Two",
                max: "",
                id: "-LgQ7122QiWEMUXNycjW"
            },
            {
                name: "repeating_earnedxpright_-LgQ7125wPQzDqnyY4r0_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-LgQ7126bOmElpjIUrVG"
            },
            {
                name: "repeating_earnedxp_-LigHrgA9V07wM4lWHam_xp_award",
                current: 2,
                max: "",
                id: "-LigHrg224xrFg8NuU8i"
            },
            {
                name: "repeating_earnedxp_-LigHrgA9V07wM4lWHam_xp_session",
                current: "Twelve",
                max: "",
                id: "-LigHrg6xQ0eiVLMUqG6"
            },
            {
                name: "repeating_earnedxp_-LigHrgA9V07wM4lWHam_xp_reason",
                current: "Brilliant montage idea",
                max: "",
                id: "-LigHrgA7LpGCPGMyUUs"
            },
            {
                name: "repeating_earnedxpright_-LigID0vC6PRzpkH2yTi_xp_award",
                current: 2,
                max: "",
                id: "-LigID0n4wMWRTRkP9bw"
            },
            {
                name: "repeating_earnedxpright_-LigID0vC6PRzpkH2yTi_xp_session",
                current: "Twenty-Three",
                max: "",
                id: "-LigID0t-i6Gsmwko8W_"
            },
            {
                name: "repeating_earnedxpright_-LigID0vC6PRzpkH2yTi_xp_reason",
                current: "Excellent RP and character development",
                max: "",
                id: "-LigID0wnYHujS3gbZ5C"
            },
            {
                name: "repeating_earnedxpright_-LigJJGg4UocCcY3nikh_xp_award",
                current: 2,
                max: "",
                id: "-LigJJGZJYklzwlA7aWQ"
            },
            {
                name: "repeating_earnedxpright_-LigJJGg4UocCcY3nikh_xp_session",
                current: "Twenty-Three",
                max: "",
                id: "-LigJJGc1pVyr-BNd3V7"
            },
            {
                name: "repeating_earnedxpright_-LigJJGg4UocCcY3nikh_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LigJJGfo5iSROcberqJ"
            },
            {
                name: "repeating_earnedxpright_-Ljltn7lAOIi7EZdBNQ7_xp_award",
                current: 2,
                max: "",
                id: "-Ljltn7fF3Daj1TBdZea"
            },
            {
                name: "repeating_earnedxpright_-Ljltn7lAOIi7EZdBNQ7_xp_session",
                current: "Twenty-Four",
                max: "",
                id: "-Ljltn7n3min-9sL4hm1"
            },
            {
                name: "repeating_earnedxpright_-Ljltn7lAOIi7EZdBNQ7_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-Ljltn7tukaWdsEwKKvT"
            },
            {
                name: "repeating_earnedxpright_-Ljoe69N3PFKw8rpggxm_xp_award",
                current: 1,
                max: "",
                id: "-Ljoe69EFh0s1ejgZvfM"
            },
            {
                name: "repeating_earnedxpright_-Ljoe69N3PFKw8rpggxm_xp_session",
                current: "Twenty-Five",
                max: "",
                id: "-Ljoe69No6oyemQC5tzL"
            },
            {
                name: "repeating_earnedxpright_-Ljoe69N3PFKw8rpggxm_xp_reason",
                current: "Awesome Compulsion RP",
                max: "",
                id: "-Ljoe69UCQ3Mu3o-kq8X"
            },
            {
                name: "repeating_earnedxpright_-LjoeIlWFN2ChLqOVxV5_xp_award",
                current: 2,
                max: "",
                id: "-LjoeIlNpo-n9s59vYHC"
            },
            {
                name: "repeating_earnedxpright_-LjoeIlWFN2ChLqOVxV5_xp_session",
                current: "Twenty-Five",
                max: "",
                id: "-LjoeIlWlr884hmeBlvK"
            },
            {
                name: "repeating_earnedxpright_-LjoeIlWFN2ChLqOVxV5_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LjoeIldiVmTrk3-QJuu"
            },
            {
                name: "repeating_earnedxp_-LkCCiW1Ggw-lhIZZa8P_xp_award",
                current: 2,
                max: "",
                id: "-LkCCiVvkOqVfhOerSY7"
            },
            {
                name: "repeating_earnedxp_-LkCCiW1Ggw-lhIZZa8P_xp_session",
                current: "Twelve",
                max: "",
                id: "-LkCCiW-gNefPCLR-AH8"
            },
            {
                name: "repeating_earnedxp_-LkCCiW1Ggw-lhIZZa8P_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LkCCiW4cMwCf5TiM1ij"
            },
            {
                name: "repeating_earnedxp_-LkCCiXlavMTlRmj9nCw_xp_award",
                current: 2,
                max: "",
                id: "-LkCCiXdBisdtigAxENE"
            },
            {
                name: "repeating_earnedxp_-LkCCiXlavMTlRmj9nCw_xp_session",
                current: "Thirteen",
                max: "",
                id: "-LkCCiXjOSppOXDQWik2"
            },
            {
                name: "repeating_earnedxp_-LkCCiXlavMTlRmj9nCw_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-LkCCiXrqrEfFNxED9Ch"
            },
            {
                name: "repeating_earnedxpright_-LkvQPgPoKSnheOiDFoq_xp_award",
                current: 2,
                max: "",
                id: "-LkvQPgIRX4Gv6OWrVVB"
            },
            {
                name: "repeating_earnedxpright_-LkvQPgPoKSnheOiDFoq_xp_session",
                current: "Twenty-Six",
                max: "",
                id: "-LkvQPgOsjJAKRTob5t_"
            },
            {
                name: "repeating_earnedxpright_-LkvQPgPoKSnheOiDFoq_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LkvQPgRqFVCakbFxZtV"
            },
            {
                name: "repeating_earnedxpright_-LmCusV7l9ymS-5NKXoE_xp_award",
                current: 2,
                max: "",
                id: "-LmCusV3DjyW_wYgJfDl"
            },
            {
                name: "repeating_earnedxpright_-LmCusV7l9ymS-5NKXoE_xp_session",
                current: "Twenty-Seven",
                max: "",
                id: "-LmCusV8Ct8R-I_PSnKR"
            },
            {
                name: "repeating_earnedxpright_-LmCusV7l9ymS-5NKXoE_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LmCusVCKtEWgkZg5AuP"
            },
            {
                name: "repeating_earnedxp_-LmCusVu3it4WZPdANZz_xp_award",
                current: 1,
                max: "",
                id: "-LmCusVr8tC84t4_gzAn"
            },
            {
                name: "repeating_earnedxp_-LmCusVu3it4WZPdANZz_xp_session",
                current: "Thirteen",
                max: "",
                id: "-LmCusVzwD0h-bow1MaE"
            },
            {
                name: "repeating_earnedxp_-LmCusVu3it4WZPdANZz_xp_reason",
                current: "Engaging with the plot",
                max: "",
                id: "-LmCusW2f9tcwAbyE_5p"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_category",
                current: "Skill",
                max: "",
                id: "-Lmb0AawXEfl3boeN5WZ"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-Lmb0AfmHWIogVtYynu-"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-Lmb0AfsjyR72PnMq9RP"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_new_toggle",
                current: 1,
                max: "",
                id: "-Lmb0AfzdwIAttBZMUmn"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-Lmb0Ag4YgO9wBKxYbZc"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_trait",
                current: "Subterfuge",
                max: "",
                id: "-Lmb0CA538BcdzZYKBml"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_cost",
                current: 6,
                max: "",
                id: "-Lmb0CEApbZSktSRXDCQ"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_initial",
                current: "1",
                max: "",
                id: "-Lmb0CcNyTA1rv_wMWWQ"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_new",
                current: "2",
                max: "",
                id: "-Lmb0D35988EBCQMAmrw"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_category",
                current: "Clan Discipline",
                max: "",
                id: "-Lmb0FSuUwgSS4UCaQwt"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-Lmb0FWuZ0dQTZ6jQeNm"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-Lmb0FWzEhBYIu7PIJvY"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_new_toggle",
                current: 1,
                max: "",
                id: "-Lmb0FX3N7mkB53nCcRW"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-Lmb0FX75qdbv6-qzd5b"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_trait",
                current: "Dominate",
                max: "",
                id: "-Lmb0Gp1OE-1ic1fTnZh"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_cost",
                current: 10,
                max: "",
                id: "-Lmb0Gt-8EanYOYg4m0Z"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_initial",
                current: "1",
                max: "",
                id: "-Lmb0H6yQIZxUoQmJ0la"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_new",
                current: "2",
                max: "",
                id: "-Lmb0H_RyqPE-zrCrEk6"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-Lmb3b94YLyKwFvHJeCy"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_category",
                current: "Advantage",
                max: "",
                id: "-LoI_hznjHpsssXuQ6rY"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LoI_i3jb9pZMzPPTKOn"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LoI_i3pD6BdhWN1meoi"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LoI_i3tJuxOnBIsirQl"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LoI_i3xIypA44sazddo"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_trait",
                current: "Loresheet (Netchurch)",
                max: "",
                id: "-LoI_lNaKgmr9Xj1Yzm0"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_cost",
                current: 9,
                max: "",
                id: "-LoI_lRAgp63b9nMirHx"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_new",
                current: "3",
                max: "",
                id: "-LoI_lf4YJU0gDcpyHOB"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LoI_mClyCNnMx6CwK1l"
            },
            {
                name: "repeating_earnedxpright_-LoIju1OFhVFMbYpmYRd_xp_award",
                current: 1,
                max: "",
                id: "-LoIju1KGlsWOFiSzMht"
            },
            {
                name: "repeating_earnedxpright_-LoIju1OFhVFMbYpmYRd_xp_session",
                current: "Twenty-Nine",
                max: "",
                id: "-LoIju1RnLV2vKR7ssW4"
            },
            {
                name: "repeating_earnedxpright_-LoIju1OFhVFMbYpmYRd_xp_reason",
                current: "Great RP as the baroness' lapdog",
                max: "",
                id: "-LoIju1WwoWujFukeD9P"
            },
            {
                name: "repeating_earnedxpright_-LoKrRVMT6hIquIyoaeZ_xp_award",
                current: 2,
                max: "",
                id: "-LoKrRVFWZPZFLO8O21c"
            },
            {
                name: "repeating_earnedxpright_-LoKrRVMT6hIquIyoaeZ_xp_session",
                current: "Twenty-Nine",
                max: "",
                id: "-LoKrRVYg77alGLaOEOw"
            },
            {
                name: "repeating_earnedxpright_-LoKrRVMT6hIquIyoaeZ_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LoKrRVaso4Y2oGS5xMg"
            },
            {
                name: "repeating_earnedxp_-LoKrRWIdXcMWg5A95Zy_xp_award",
                current: 2,
                max: "",
                id: "-LoKrRWAuWxCiP6dgZ0c"
            },
            {
                name: "repeating_earnedxp_-LoKrRWIdXcMWg5A95Zy_xp_session",
                current: "Fourteen",
                max: "",
                id: "-LoKrRWEkL7pjYUBB_1p"
            },
            {
                name: "repeating_earnedxp_-LoKrRWIdXcMWg5A95Zy_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-LoKrRWGv_lLnxhketFa"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LoLtBWP65lDlQwR90rf"
            },
            {
                name: "repeating_earnedxpright_-LoZBXteanfysoKkjm43_xp_award",
                current: 2,
                max: "",
                id: "-Lo_BXtaCVcF-mo0Bmct"
            },
            {
                name: "repeating_earnedxpright_-LoZBXteanfysoKkjm43_xp_session",
                current: "Thirty",
                max: "",
                id: "-Lo_BXtj9fYvWzq1Y4_Q"
            },
            {
                name: "repeating_earnedxpright_-LoZBXteanfysoKkjm43_xp_reason",
                current: "NPC Creation: Carlita",
                max: "",
                id: "-Lo_BXtr9NcugcUV6B3M"
            },
            {
                name: "repeating_earnedxpright_-LtvwTSWonGuZWmZLgmv_xp_award",
                current: 2,
                max: "",
                id: "-LtvwTSPfi7ibq3K7BhV"
            },
            {
                name: "repeating_earnedxpright_-LtvwTSWonGuZWmZLgmv_xp_session",
                current: "Thirty",
                max: "",
                id: "-LtvwTSRW5ZHNqbfdToo"
            },
            {
                name: "repeating_earnedxpright_-LtvwTSWonGuZWmZLgmv_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LtvwTSU7ws-DwHGW-0C"
            },
            {
                name: "repeating_earnedxp_-LtvwTT7jhAowEss8gWx_xp_award",
                current: 2,
                max: "",
                id: "-LtvwTT-83Jd1SV7uSue"
            },
            {
                name: "repeating_earnedxp_-LtvwTT7jhAowEss8gWx_xp_session",
                current: "Fifteen",
                max: "",
                id: "-LtvwTT3o8a3L5wZG9c9"
            },
            {
                name: "repeating_earnedxp_-LtvwTT7jhAowEss8gWx_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-LtvwTT5NGJROhicVxqU"
            },
            {
                name: "repeating_earnedxpright_-LtvwdWKNqYGgiBp1RRo_xp_award",
                current: 1,
                max: "",
                id: "-LtvwdWC0b1gqCxkzijt"
            },
            {
                name: "repeating_earnedxpright_-LtvwdWKNqYGgiBp1RRo_xp_session",
                current: "Thirty-One",
                max: "",
                id: "-LtvwdWGCYJfsvzVLfnE"
            },
            {
                name: "repeating_earnedxpright_-LtvwdWKNqYGgiBp1RRo_xp_reason",
                current: "Playing Cardinal Collins",
                max: "",
                id: "-LtvwdWIvxT5FqevjOvq"
            },
            {
                name: "repeating_earnedxpright_-Ltvwkm-62dE1JoAfVla_xp_award",
                current: 2,
                max: "",
                id: "-LtvwkltNvL0a660LU0u"
            },
            {
                name: "repeating_earnedxpright_-Ltvwkm-62dE1JoAfVla_xp_session",
                current: "Thirty-One",
                max: "",
                id: "-LtvwklwKP-zVrUTEPF_"
            },
            {
                name: "repeating_earnedxpright_-Ltvwkm-62dE1JoAfVla_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LtvwklysAgqUsxcoosC"
            },
            {
                name: "repeating_earnedxp_-LtvwkmdPRafElEGeJcj_xp_award",
                current: 2,
                max: "",
                id: "-LtvwkmWpncHrG1E-uPc"
            },
            {
                name: "repeating_earnedxp_-LtvwkmdPRafElEGeJcj_xp_session",
                current: "Fifteen",
                max: "",
                id: "-LtvwkmZPrM0qbPBoMkh"
            },
            {
                name: "repeating_earnedxp_-LtvwkmdPRafElEGeJcj_xp_reason",
                current: "Being vampires!",
                max: "",
                id: "-Ltvwkma5F3teWVnVnVS"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_category",
                current: "Skill",
                max: "",
                id: "-Ltw3uPWM2OmGH97nmax"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-Ltw3uTUMvTQhG80cq1W"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-Ltw3uTZr915Dq8mSez5"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_new_toggle",
                current: 1,
                max: "",
                id: "-Ltw3uTeXdTf9BHVMEfX"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-Ltw3uTjWFe7AWhJnBZu"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_trait",
                current: "Science 4",
                max: "",
                id: "-Ltw3w2jXY9Vu8e-41Vo"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_cost",
                current: 12,
                max: "",
                id: "-Ltw3w5w4lNDOPafbih3"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_initial",
                current: "3",
                max: "",
                id: "-Ltw3wN_fMdLfGMI7_Xv"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_new",
                current: "4",
                max: "",
                id: "-Ltw3wq3EGElKnnBvmGw"
            },
            {
                name: "repeating_earnedxpright_-LtwWxs5LddvE07tC9yx_xp_award",
                current: 2,
                max: "",
                id: "-LtwWxryTddml90QNfae"
            },
            {
                name: "repeating_earnedxpright_-LtwWxs5LddvE07tC9yx_xp_session",
                current: "Thirty-Two",
                max: "",
                id: "-LtwWxs1q2tePlE65o-j"
            },
            {
                name: "repeating_earnedxpright_-LtwWxs5LddvE07tC9yx_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LtwWxs3Vyl8FzW7Uo9K"
            },
            {
                name: "repeating_earnedxpright_-LuVYjA7Fjs6oTzmNXSA_xp_award",
                current: 2,
                max: "",
                id: "-LuVYjA0hZPepOdcz2Ic"
            },
            {
                name: "repeating_earnedxpright_-LuVYjA7Fjs6oTzmNXSA_xp_session",
                current: "Thirty-Three",
                max: "",
                id: "-LuVYjA4uulvNZP1Tqcj"
            },
            {
                name: "repeating_earnedxpright_-LuVYjA7Fjs6oTzmNXSA_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LuVYjACbiA5VBwLDu-U"
            },
            {
                name: "repeating_earnedxp_-LuVYjB2euZDJTy-ir0Z_xp_award",
                current: 2,
                max: "",
                id: "-LuVYjAxZpP4CWQkyf11"
            },
            {
                name: "repeating_earnedxp_-LuVYjB2euZDJTy-ir0Z_xp_session",
                current: "Sixteen",
                max: "",
                id: "-LuVYjB0dMpWEFBSzTwR"
            },
            {
                name: "repeating_earnedxp_-LuVYjB2euZDJTy-ir0Z_xp_reason",
                current: "FOR OBFUSCATE ONLY",
                max: "",
                id: "-LuVYjB3NyICwne2uWxu"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-Lxe1H3GqJPyH9ayoxiT"
            },
            {
                name: "repeating_earnedxpright_-LyGozzViXZXqrtrpljd_xp_award",
                current: 2,
                max: "",
                id: "-LyGozzTnWCiOTi04KoV"
            },
            {
                name: "repeating_earnedxpright_-LyGozzViXZXqrtrpljd_xp_session",
                current: "Thirty-Four",
                max: "",
                id: "-LyGozzYqYy9RyGLzq2J"
            },
            {
                name: "repeating_earnedxpright_-LyGozzViXZXqrtrpljd_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LyGozzbGLxK7DeZnQDL"
            },
            {
                name: "repeating_spentxp_-LyRLIe5rzPxOuPHuR8E_xp_category",
                current: "Advantage",
                max: "",
                id: "-LyRLJwDw61gIeWxP1sg"
            },
            {
                name: "repeating_spentxp_-LyRLIe5rzPxOuPHuR8E_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LyRLK-lZB73vekh6s5J"
            },
            {
                name: "repeating_spentxp_-LyRLIe5rzPxOuPHuR8E_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LyRLK-r1VvAixtD0hwv"
            },
            {
                name: "repeating_spentxp_-LyRLIe5rzPxOuPHuR8E_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LyRLK-xY8E28H7iArFL"
            },
            {
                name: "repeating_spentxp_-LyRLIe5rzPxOuPHuR8E_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LyRLK02w4GuLZOVNUA6"
            },
            {
                name: "repeating_spentxp_-LyRLIe5rzPxOuPHuR8E_xp_trait",
                current: "Loresheet (Netchurch)",
                max: "",
                id: "-LyRLOWPXDKF_Ex0Apml"
            },
            {
                name: "repeating_spentxp_-LyRLIe5rzPxOuPHuR8E_xp_cost",
                current: 15,
                max: "",
                id: "-LyRLO_T4Z89Qo9jTAN7"
            },
            {
                name: "repeating_spentxp_-LyRLIe5rzPxOuPHuR8E_xp_new",
                current: "5",
                max: "",
                id: "-LyRLP0LHoM-mxg-F3rF"
            },
            {
                name: "repeating_earnedxpright_-LyRvkRe4VMcOP8vfqCU_xp_award",
                current: 2,
                max: "",
                id: "-LyRvkRXffrN4d2QItOp"
            },
            {
                name: "repeating_earnedxpright_-LyRvkRe4VMcOP8vfqCU_xp_session",
                current: "Thirty-Five",
                max: "",
                id: "-LyRvkRheHr26zpDTBNd"
            },
            {
                name: "repeating_earnedxpright_-LyRvkRe4VMcOP8vfqCU_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LyRvkRl1Rdcp_uri8d8"
            },
            {
                name: "repeating_earnedxp_-LyRvkSiU0a0YIAW9bQ8_xp_award",
                current: 2,
                max: "",
                id: "-LyRvkSaGlR1AhPce1Em"
            },
            {
                name: "repeating_earnedxp_-LyRvkSiU0a0YIAW9bQ8_xp_session",
                current: "Sixteen",
                max: "",
                id: "-LyRvkSfMySJimUEY5wg"
            },
            {
                name: "repeating_earnedxp_-LyRvkSiU0a0YIAW9bQ8_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-LyRvkSilTlQf4eVtT81"
            },
            {
                name: "repeating_earnedxpright_-Lz5Z07tZ8HvEzxAwu5q_xp_award",
                current: 2,
                max: "",
                id: "-Lz5_07kPxPVpERWjudK"
            },
            {
                name: "repeating_earnedxpright_-Lz5Z07tZ8HvEzxAwu5q_xp_session",
                current: "Thirty-Six",
                max: "",
                id: "-Lz5_07qPO-8drvW7MCo"
            },
            {
                name: "repeating_earnedxpright_-Lz5Z07tZ8HvEzxAwu5q_xp_reason",
                current: "Session XP Award.",
                max: "",
                id: "-Lz5_07uCXfakP9Jh76A"
            },
            {
                name: "repeating_earnedxpright_-LzZIc7ZkSy6s5c4ndOE_xp_award",
                current: -6,
                max: "",
                id: "-LzZIc7WqUkN5nT6gd7q"
            },
            {
                name: "repeating_earnedxpright_-LzZIc7ZkSy6s5c4ndOE_xp_session",
                current: "Thirty-Six",
                max: "",
                id: "-LzZIc7cG6Y78JWnS-Pw"
            },
            {
                name: "repeating_earnedxpright_-LzZIc7ZkSy6s5c4ndOE_xp_reason",
                current: "Resolving Flaw: Enemy.",
                max: "",
                id: "-LzZIc7gkQ5-iULFTK_u"
            },
            {
                name: "repeating_earnedxp_-LzZIcADSXXN5z3y7AFZ_xp_award",
                current: 2,
                max: "",
                id: "-LzZIcA71aNlW3GJ49Nz"
            },
            {
                name: "repeating_earnedxp_-LzZIcADSXXN5z3y7AFZ_xp_session",
                current: "Seventeen",
                max: "",
                id: "-LzZIcACeDRmye053qY5"
            },
            {
                name: "repeating_earnedxp_-LzZIcADSXXN5z3y7AFZ_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-LzZIcAFPTlWo3qpCG4g"
            },
            {
                name: "repeating_earnedxpright_-LzZIgVK2CiPK1Q75eOI_xp_award",
                current: 18,
                max: "",
                id: "-LzZIgVGsJyfgmVHePsI"
            },
            {
                name: "repeating_earnedxpright_-LzZIgVK2CiPK1Q75eOI_xp_session",
                current: "Thirty-Six",
                max: "",
                id: "-LzZIgVQC8FzTPYJhZ8M"
            },
            {
                name: "repeating_earnedxpright_-LzZIgVK2CiPK1Q75eOI_xp_reason",
                current: "Losing Allies: Bookies.",
                max: "",
                id: "-LzZIgVX4kNZbcc0KfHk"
            },
            {
                name: "repeating_earnedxpright_-LzZvY2HwDMCZA1-fZcZ_xp_award",
                current: 2,
                max: "",
                id: "-LzZvY2ABHC_SZqG2IvT"
            },
            {
                name: "repeating_earnedxpright_-LzZvY2HwDMCZA1-fZcZ_xp_session",
                current: "Thirty-Seven",
                max: "",
                id: "-LzZvY2DoWr8gXE32EK-"
            },
            {
                name: "repeating_earnedxpright_-LzZvY2HwDMCZA1-fZcZ_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LzZvY2F3ko1g1GcnM6Y"
            },
            {
                name: "repeating_earnedxp_-LzZvY32hqS8nLS89IlR_xp_award",
                current: 2,
                max: "",
                id: "-LzZvY2wJ9vwPQUizuxN"
            },
            {
                name: "repeating_earnedxp_-LzZvY32hqS8nLS89IlR_xp_session",
                current: "Seventeen",
                max: "",
                id: "-LzZvY3-1HtjXbZ5lYtM"
            },
            {
                name: "repeating_earnedxp_-LzZvY32hqS8nLS89IlR_xp_reason",
                current: "The Vultures Circle",
                max: "",
                id: "-LzZvY31m5zLWSSYxZsd"
            },
            {
                name: "repeating_earnedxpright_-M-HQ4RLcHBOyJrqFq-B_xp_award",
                current: 9,
                max: "",
                id: "-M-HQ4RB_Zql3s8VwdqD"
            },
            {
                name: "repeating_earnedxpright_-M-HQ4RLcHBOyJrqFq-B_xp_session",
                current: "Thirty-Six",
                max: "",
                id: "-M-HQ4RG53N1nZSfDAmJ"
            },
            {
                name: "repeating_earnedxpright_-M-HQ4RLcHBOyJrqFq-B_xp_reason",
                current: "Loosing Herd: Bookies",
                max: "",
                id: "-M-HQ4RK4YQmeFMUs0cC"
            },
            {
                name: "repeating_spentxp_-LyRLIe5rzPxOuPHuR8E_xp_spent_toggle",
                current: "0",
                max: "",
                id: "-M-HQEhXI56LofAVSR7H"
            },
            {
                name: "repeating_earnedxp_-M-cZiiSEPZQ1OX1wH7H_xp_award",
                current: 20,
                max: "",
                id: "-M-cZiiMn84ZA5_X9q-k"
            },
            {
                name: "repeating_earnedxp_-M-cZiiSEPZQ1OX1wH7H_xp_session",
                current: "Eighteen",
                max: "",
                id: "-M-cZiiPMl3FGs5ju_4N"
            },
            {
                name: "repeating_earnedxp_-M-cZiiSEPZQ1OX1wH7H_xp_reason",
                current: "Award for 15 month time jump.",
                max: "",
                id: "-M-cZiiSiRmvWdMWLS6T"
            },
            {
                name: "repeating_earnedxpright_-M0GDgu1YZz4glMFeJ3D_xp_award",
                current: 2,
                max: "",
                id: "-M0GDgtzjPQJQruRlVuy"
            },
            {
                name: "repeating_earnedxpright_-M0GDgu1YZz4glMFeJ3D_xp_session",
                current: "Thirty-Eight",
                max: "",
                id: "-M0GDgu0NtlxoG6z78Vn"
            },
            {
                name: "repeating_earnedxpright_-M0GDgu1YZz4glMFeJ3D_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-M0GDgu2er3h0dWTKnRF"
            },
            {
                name: "repeating_earnedxpright_-M1OAdEJJOwnWUhJVGq4_xp_award",
                current: 2,
                max: "",
                id: "-M1OAdECFwCIBdrh86ZC"
            },
            {
                name: "repeating_earnedxpright_-M1OAdEJJOwnWUhJVGq4_xp_session",
                current: "Thirty-Nine",
                max: "",
                id: "-M1OAdEFPCjb7KyUGpeo"
            },
            {
                name: "repeating_earnedxpright_-M1OAdEJJOwnWUhJVGq4_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-M1OAdEIXHOJiBwNkpRd"
            },
            {
                name: "repeating_spentxp_-M4BiXLUw-nA3g7GogiJ_xp_category",
                current: "Blood Potency",
                max: "",
                id: "-M4BiY1latbtYO0qkuce"
            },
            {
                name: "repeating_spentxp_-M4BiXLUw-nA3g7GogiJ_xp_cost",
                current: 20,
                max: "",
                id: "-M4BiY6E4hwSXo97p6_-"
            },
            {
                name: "repeating_spentxp_-M4BiXLUw-nA3g7GogiJ_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-M4BiY6Jq__AcwSqyTx1"
            },
            {
                name: "repeating_spentxp_-M4BiXLUw-nA3g7GogiJ_xp_new_toggle",
                current: 1,
                max: "",
                id: "-M4BiY6Og5_PlpyIGkmQ"
            },
            {
                name: "repeating_spentxp_-M4BiXLUw-nA3g7GogiJ_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-M4BiY6To6gAgfrvRHVw"
            },
            {
                name: "repeating_spentxp_-M4BiXLUw-nA3g7GogiJ_xp_initial",
                current: "1",
                max: "",
                id: "-M4BiYdYxylN7oDbJ4yT"
            },
            {
                name: "repeating_spentxp_-M4BiXLUw-nA3g7GogiJ_xp_new",
                current: "2",
                max: "",
                id: "-M4BiZ19vpDmarMBnbD6"
            },
            {
                name: "repeating_earnedxpright_-M4BwgVrQyvoCgzj9UOb_xp_award",
                current: 2,
                max: "",
                id: "-M4BwgVnptJphRq3iv2u"
            },
            {
                name: "repeating_earnedxpright_-M4BwgVrQyvoCgzj9UOb_xp_session",
                current: "Forty",
                max: "",
                id: "-M4BwgVsfswVutkNuZQw"
            },
            {
                name: "repeating_earnedxpright_-M4BwgVrQyvoCgzj9UOb_xp_reason",
                current: "RPing Drug Addiction",
                max: "",
                id: "-M4BwgVu98egNg2-OG5L"
            },
            {
                name: "repeating_earnedxp_-M4BwgWfnAGtZ1NPqrjD_xp_award",
                current: 2,
                max: "",
                id: "-M4BwgWb04bwHz8UG7xs"
            },
            {
                name: "repeating_earnedxp_-M4BwgWfnAGtZ1NPqrjD_xp_session",
                current: "Eighteen",
                max: "",
                id: "-M4BwgWdU9MvtZhsU7ub"
            },
            {
                name: "repeating_earnedxp_-M4BwgWfnAGtZ1NPqrjD_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-M4BwgWfqrq4rqKs2-dr"
            },
            {
                name: "repeating_earnedxpright_-M4CPrmfZZ6G3fnXapvL_xp_award",
                current: 2,
                max: "",
                id: "-M4CPrmbu2mJza5V2F_7"
            },
            {
                name: "repeating_earnedxpright_-M4CPrmfZZ6G3fnXapvL_xp_session",
                current: "Forty",
                max: "",
                id: "-M4CPrmdJzJFjv7N8e1i"
            },
            {
                name: "repeating_earnedxpright_-M4CPrmfZZ6G3fnXapvL_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-M4CPrmfyVlXTBGau0GO"
            },
            {
                name: "repeating_earnedxpright_-M5KQYZkC00kYZ4dhrZ7_xp_award",
                current: 2,
                max: "",
                id: "-M5KQY_auw9sb49jD8PE"
            },
            {
                name: "repeating_earnedxpright_-M5KQYZkC00kYZ4dhrZ7_xp_session",
                current: "Forty-One",
                max: "",
                id: "-M5KQY_eu3y8FXoY7lGp"
            },
            {
                name: "repeating_earnedxpright_-M5KQYZkC00kYZ4dhrZ7_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-M5KQY_hD6gVDhcrC04F"
            },
            {
                name: "repeating_earnedxp_-M5KQYag3xUDpR8bwD-w_xp_award",
                current: 2,
                max: "",
                id: "-M5KQYaXdMX4zP-JhV27"
            },
            {
                name: "repeating_earnedxp_-M5KQYag3xUDpR8bwD-w_xp_session",
                current: "Nineteen",
                max: "",
                id: "-M5KQYaamMrOTT8AbvEe"
            },
            {
                name: "repeating_earnedxp_-M5KQYag3xUDpR8bwD-w_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-M5KQYadCLaVL0qNiEZM"
            },
            {
                name: "repeating_earnedxpright_-M5tVKgWfXGtJz4NowPc_xp_award",
                current: 2,
                max: "",
                id: "-M5tVKgOrlbsHfj9gCmz"
            },
            {
                name: "repeating_earnedxpright_-M5tVKgWfXGtJz4NowPc_xp_session",
                current: "Forty-Two",
                max: "",
                id: "-M5tVKgSMqjn6DOy2s7s"
            },
            {
                name: "repeating_earnedxpright_-M5tVKgWfXGtJz4NowPc_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-M5tVKgVdALsrHIGE8N4"
            },
            {
                name: "repeating_earnedxp_-M5tVKhMUY6JXXsZwZMs_xp_award",
                current: 2,
                max: "",
                id: "-M5tVKhFC3f3izbXsAhG"
            },
            {
                name: "repeating_earnedxp_-M5tVKhMUY6JXXsZwZMs_xp_session",
                current: "Twenty",
                max: "",
                id: "-M5tVKhLxY3FRDdsmOQb"
            },
            {
                name: "repeating_earnedxp_-M5tVKhMUY6JXXsZwZMs_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-M5tVKhOgXLRKTpLJ8l4"
            },
            {
                name: "repeating_earnedxpright_-M6SWKhpjh6dnYQ7LrZJ_xp_award",
                current: 2,
                max: "",
                id: "-M6SWKhhG1-87NtY5tOV"
            },
            {
                name: "repeating_earnedxpright_-M6SWKhpjh6dnYQ7LrZJ_xp_session",
                current: "Forty-Three",
                max: "",
                id: "-M6SWKhkxqzoylZ_ud5T"
            },
            {
                name: "repeating_earnedxpright_-M6SWKhpjh6dnYQ7LrZJ_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-M6SWKhny0zQ-L6jebV1"
            },
            {
                name: "repeating_earnedxp_-M6SWZkfSVM9ESTFb4Nj_xp_award",
                current: 2,
                max: "",
                id: "-M6SWZkZX6GUNJOrOgsI"
            },
            {
                name: "repeating_earnedxp_-M6SWZkfSVM9ESTFb4Nj_xp_session",
                current: "Twenty-One",
                max: "",
                id: "-M6SWZkcakSlg0RMYqrG"
            },
            {
                name: "repeating_earnedxp_-M6SWZkfSVM9ESTFb4Nj_xp_reason",
                current: "Your unending patience!",
                max: "",
                id: "-M6SWZkfgZIEjyXSoz6S"
            },
            {
                name: "repeating_earnedxpright_-M70WNAgiPk9cm9Xxm52_xp_award",
                current: 2,
                max: "",
                id: "-M70WNA_bFS8RHJA3TA-"
            },
            {
                name: "repeating_earnedxpright_-M70WNAgiPk9cm9Xxm52_xp_session",
                current: "Forty-Four",
                max: "",
                id: "-M70WNAcTXa35AbvA6-Q"
            },
            {
                name: "repeating_earnedxpright_-M70WNAgiPk9cm9Xxm52_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-M70WNAefMQ4n47JyeCK"
            },
            {
                name: "repeating_spentxp_-MAxMS4tBgIagE41sa6c_xp_category",
                current: "Advantage",
                max: "",
                id: "-MAxMTBq6dUJkIUrnagP"
            },
            {
                name: "repeating_spentxp_-MAxMS4tBgIagE41sa6c_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-MAxMTGuWs48YX397_3J"
            },
            {
                name: "repeating_spentxp_-MAxMS4tBgIagE41sa6c_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-MAxMTH1HkIloez32JhS"
            },
            {
                name: "repeating_spentxp_-MAxMS4tBgIagE41sa6c_xp_new_toggle",
                current: 1,
                max: "",
                id: "-MAxMTH9NLqP5mT5N5zm"
            },
            {
                name: "repeating_spentxp_-MAxMS4tBgIagE41sa6c_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-MAxMTHF93FoW9Xbuy3s"
            },
            {
                name: "repeating_spentxp_-MAxMS4tBgIagE41sa6c_xp_trait",
                current: "Allies (Bookies)",
                max: "",
                id: "-MAxMVQL656a_HbV3Im9"
            },
            {
                name: "repeating_spentxp_-MAxMS4tBgIagE41sa6c_xp_cost",
                current: 18,
                max: "",
                id: "-MAxMVUmKNRiNdVYjCt7"
            },
            {
                name: "repeating_spentxp_-MAxMS4tBgIagE41sa6c_xp_new",
                current: "6",
                max: "",
                id: "-MAxMWOW2Nv_mMkRGFnx"
            },
            {
                name: "repeating_spentxp_-M4BiXLUw-nA3g7GogiJ_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-MAxN4tJKdjfsuD9eiIA"
            },
            {
                name: "repeating_spentxp_-MAxNEwOG3jYWCEFqlRh_xp_category",
                current: "Attribute",
                max: "",
                id: "-MAxNFXrGT1DHAYOLGwS"
            },
            {
                name: "repeating_spentxp_-MAxNEwOG3jYWCEFqlRh_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-MAxNFbWaRZhMGSWsqMX"
            },
            {
                name: "repeating_spentxp_-MAxNEwOG3jYWCEFqlRh_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-MAxNFbaA7V64M5XS721"
            },
            {
                name: "repeating_spentxp_-MAxNEwOG3jYWCEFqlRh_xp_new_toggle",
                current: 1,
                max: "",
                id: "-MAxNFbeZiRmWgFULoC1"
            },
            {
                name: "repeating_spentxp_-MAxNEwOG3jYWCEFqlRh_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-MAxNFbiUkw4jxPdca5v"
            },
            {
                name: "repeating_spentxp_-MAxNEwOG3jYWCEFqlRh_xp_initial",
                current: "2",
                max: "",
                id: "-MAxNGLfEIhnbiy33VpE"
            },
            {
                name: "repeating_spentxp_-MAxNEwOG3jYWCEFqlRh_xp_new",
                current: "3",
                max: "",
                id: "-MAxNGiU1Q9fzQoO_c2V"
            },
            {
                name: "repeating_spentxp_-MAxNEwOG3jYWCEFqlRh_xp_trait",
                current: "Resolve",
                max: "",
                id: "-MAxNIGYc0M3amP-fi3R"
            },
            {
                name: "repeating_spentxp_-MAxNEwOG3jYWCEFqlRh_xp_cost",
                current: 15,
                max: "",
                id: "-MAxNIKqBRKp2gjK00Rn"
            },
            {
                name: "repeating_earnedxpright_-MAxox49IY75TscL8dBh_xp_award",
                current: 1,
                max: "",
                id: "-MAxox452PH9An-vU0Zd"
            },
            {
                name: "repeating_earnedxpright_-MAxox49IY75TscL8dBh_xp_session",
                current: "Forty-Five",
                max: "",
                id: "-MAxox4BxlSSk86XujMn"
            },
            {
                name: "repeating_earnedxpright_-MAxox49IY75TscL8dBh_xp_reason",
                current: "Spotlight Prompt for Ava",
                max: "",
                id: "-MAxox4F0t2lQcCUz5A5"
            },
            {
                name: "repeating_earnedxp_-MAxox55f1TkQekwNZ7F_xp_award",
                current: 2,
                max: "",
                id: "-MAxox51avM8Lv3Fmt1z"
            },
            {
                name: "repeating_earnedxp_-MAxox55f1TkQekwNZ7F_xp_session",
                current: "Twenty-One",
                max: "",
                id: "-MAxox56cNdsbor9IQpw"
            },
            {
                name: "repeating_earnedxp_-MAxox55f1TkQekwNZ7F_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-MAxox5B4wFBuGOJFGQg"
            },
            {
                name: "repeating_earnedxpright_-MAxsc4yw0k9XYw7MDaf_xp_award",
                current: 1,
                max: "",
                id: "-MAxsc4u5BLmLsDfRkZ_"
            },
            {
                name: "repeating_earnedxpright_-MAxsc4yw0k9XYw7MDaf_xp_session",
                current: "Forty-Five",
                max: "",
                id: "-MAxsc4z1OPYIrG4zl6c"
            },
            {
                name: "repeating_earnedxpright_-MAxsc4yw0k9XYw7MDaf_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-MAxsc53IKLxzggE8BdT"
            },
            {
                name: "repeating_spentxp_-MAxNEwOG3jYWCEFqlRh_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-MC29aVvNuG2odpHIYGg"
            },
            {
                name: "repeating_spentxp_-MC29xYSiwBVelh-I0nE_xp_category",
                current: "Skill",
                max: "",
                id: "-MC29y8RHipehwfTd8He"
            },
            {
                name: "repeating_spentxp_-MC29xYSiwBVelh-I0nE_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-MC29yDdV1IRlAl7sYih"
            },
            {
                name: "repeating_spentxp_-MC29xYSiwBVelh-I0nE_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-MC29yDk1uM7vwh5cEwj"
            },
            {
                name: "repeating_spentxp_-MC29xYSiwBVelh-I0nE_xp_new_toggle",
                current: 1,
                max: "",
                id: "-MC29yDoWLoxfGTR9aq0"
            },
            {
                name: "repeating_spentxp_-MC29xYSiwBVelh-I0nE_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-MC29yDw6xFEyXnZCAr4"
            },
            {
                name: "repeating_spentxp_-MC29xYSiwBVelh-I0nE_xp_trait",
                current: "Science",
                max: "",
                id: "-MC2A-P8NEvflcxRzo4e"
            },
            {
                name: "repeating_spentxp_-MC29xYSiwBVelh-I0nE_xp_initial",
                current: "4",
                max: "",
                id: "-MC2A-v2ThZxzHORFPEm"
            },
            {
                name: "repeating_spentxp_-MC29xYSiwBVelh-I0nE_xp_new",
                current: "5",
                max: "",
                id: "-MC2A0LcvNQqp2Gh0QZA"
            },
            {
                name: "repeating_spentxp_-MC29xYSiwBVelh-I0nE_xp_cost",
                current: 15,
                max: "",
                id: "-MC2A0Qei7uOLu6kWdtU"
            },
            {
                name: "repeating_spentxp_-MC29xYSiwBVelh-I0nE_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-MC2A0ttXCLq-AqjdL6-"
            },
            {
                name: "repeating_earnedxpright_-MC5-y7rQLZDiQc8sz1V_xp_award",
                current: 1,
                max: "",
                id: "-MC5-y7nAz1IfslmG2_e"
            },
            {
                name: "repeating_earnedxpright_-MC5-y7rQLZDiQc8sz1V_xp_session",
                current: "Forty-Six",
                max: "",
                id: "-MC5-y7s1scidHlM4C7p"
            },
            {
                name: "repeating_earnedxpright_-MC5-y7rQLZDiQc8sz1V_xp_reason",
                current: "Spotlight Prompt for Locke",
                max: "",
                id: "-MC5-y7xE0zKpOQ5ooiR"
            },
            {
                name: "repeating_earnedxpright_-MC50S857er8w5amGpoN_xp_award",
                current: 1,
                max: "",
                id: "-MC50S82JSxIxhBzDhQ6"
            },
            {
                name: "repeating_earnedxpright_-MC50S857er8w5amGpoN_xp_session",
                current: "Forty-Six",
                max: "",
                id: "-MC50S87Q0B-AG6X9IyO"
            },
            {
                name: "repeating_earnedxpright_-MC50S857er8w5amGpoN_xp_reason",
                current: "Session Scribe.",
                max: "",
                id: "-MC50S8BWp2kB0m1i1Gp"
            },
            {
                name: "repeating_earnedxpright_-MC50S91QQGdVDphQf2m_xp_award",
                current: 2,
                max: "",
                id: "-MC50S8zAIt8van22G5t"
            },
            {
                name: "repeating_earnedxpright_-MC50S91QQGdVDphQf2m_xp_session",
                current: "Forty-Six",
                max: "",
                id: "-MC50S93TGdNQDVOIdEQ"
            },
            {
                name: "repeating_earnedxpright_-MC50S91QQGdVDphQf2m_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-MC50S98iEfOVWwTR-BW"
            },
            {
                name: "repeating_earnedxp_-MC50S9yt2rAO5ZHlT-s_xp_award",
                current: 1,
                max: "",
                id: "-MC50S9ufkvaG7e3QyyA"
            },
            {
                name: "repeating_earnedxp_-MC50S9yt2rAO5ZHlT-s_xp_session",
                current: "Twenty-One",
                max: "",
                id: "-MC50S9z_eUKYFtVMS5N"
            },
            {
                name: "repeating_earnedxp_-MC50S9yt2rAO5ZHlT-s_xp_reason",
                current: "Excellent in-character ghoul play",
                max: "",
                id: "-MC50SA38X4Pf5LOM71X"
            }
        ],
        26: [
            {
                name: "xp_summary",
                current: "153 XP Earned - 143 XP Spent =  10 XP Remaining",
                max: "",
                id: "-LU7dsfS20fV0ZfSn1gO"
            },
            {
                name: "repeating_earnedxp_-LOL0MvLYsuljyZCFymk_xp_award",
                current: "15",
                max: "",
                id: "-LU7dsfTOeGpyj3vduPs"
            },
            {
                name: "repeating_earnedxp_-LOL0MvLYsuljyZCFymk_xp_session",
                current: "Zero",
                max: "",
                id: "-LU7dsfU3R2T2spwB8Do"
            },
            {
                name: "repeating_earnedxp_-LOL0MvLYsuljyZCFymk_xp_reason",
                current: "Initial XP awarded at the beginning of the Chronicle.",
                max: "",
                id: "-LU7dsfVkJbPIJ_AULQI"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_category",
                current: "Clan Discipline",
                max: "",
                id: "-LU7dsg65B78RevMdfgF"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_trait",
                current: "Auspex",
                max: "",
                id: "-LU7dsgBCaxyUWZSmYxS"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_cost",
                current: 10,
                max: "",
                id: "-LU7dsgBCaxyUWZSmYxT"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_initial",
                current: "1",
                max: "",
                id: "-LU7dsgCOeusF4xqj-Er"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_new",
                current: "2",
                max: "",
                id: "-LU7dsgDSFTywmIsd-UH"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_category",
                current: "Advantage",
                max: "",
                id: "-LU7dsgE1g-ZcqaSs3T5"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_initial",
                current: "1",
                max: "",
                id: "-LU7dsgKwRm4CizlXOgL"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_new",
                current: "2",
                max: "",
                id: "-LU7dsgKwRm4CizlXOgM"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_trait",
                current: "Contacts (Pharma)",
                max: "",
                id: "-LU7dsgLQNtgCBtkxE5K"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_cost",
                current: 3,
                max: "",
                id: "-LU7dsgN1U_lCGqVcjXf"
            },
            {
                name: "repeating_earnedxp_-LOaOePNOjwmn9CW4oWY_xp_award",
                current: "1",
                max: "",
                id: "-LU7dsgSWCLOyRsMBRgZ"
            },
            {
                name: "repeating_earnedxp_-LOaOePNOjwmn9CW4oWY_xp_session",
                current: "Zero",
                max: "",
                id: "-LU7dsgTvwZyuVyVIKFo"
            },
            {
                name: "repeating_earnedxp_-LOaOePNOjwmn9CW4oWY_xp_reason",
                current: "Creating a relationship hook with Ava Wong, Jo's character.",
                max: "",
                id: "-LU7dsgUp-HAuSj8WEXb"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_category",
                current: "Advantage",
                max: "",
                id: "-LU7dsgb2xsXU_GgWYM7"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_trait",
                current: "Herd (Field Clinic)",
                max: "",
                id: "-LU7dsggjBc6iL4RCRL2"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_cost",
                current: 6,
                max: "",
                id: "-LU7dsgh_l4mYMwRQVOM"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_new",
                current: "2",
                max: "",
                id: "-LU7dsgiSKNG6GABne89"
            },
            {
                name: "repeating_earnedxp_-LPOmiZY-6Q2SB8AQJM3_xp_award",
                current: "4",
                max: "",
                id: "-LU7dsgzdz2k03LFmc-J"
            },
            {
                name: "repeating_earnedxp_-LPOmiZY-6Q2SB8AQJM3_xp_session",
                current: "One",
                max: "",
                id: "-LU7dsh-vXsqmVu0ya-r"
            },
            {
                name: "repeating_earnedxp_-LPOmiZY-6Q2SB8AQJM3_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LU7dsh-vXsqmVu0ya-s"
            },
            {
                name: "repeating_earnedxp_-LPqtifvc9bwzYpsuJ1E_xp_award",
                current: "9",
                max: "",
                id: "-LU7dsh20g95XujQISZm"
            },
            {
                name: "repeating_earnedxp_-LPqtifvc9bwzYpsuJ1E_xp_session",
                current: "Zero",
                max: "",
                id: "-LU7dsh49rRPOBaaYZVw"
            },
            {
                name: "repeating_earnedxp_-LPqtifvc9bwzYpsuJ1E_xp_reason",
                current: "Completing character sheet by the Thursday deadline..",
                max: "",
                id: "-LU7dsh5zLm2FK9bISAV"
            },
            {
                name: "_reporder_repeating_earnedxp",
                current: "-LOL0MvLYsuljyZCFymk,-LOaOePNOjwmn9CW4oWY,-LPOmiZY-6Q2SB8AQJM3,-LPqtifvc9bwzYpsuJ1E,-LQi-2PfA4iwP7T7FFzt,-LQi-J171uzZXnC-vewh,-LRuzhHXwCUYV11KaaRK,-LRuziGli9eaOsLceHIK,-LVaIa8cnzXhum3lscuA,-LVaUKCH8TkCB8LFBooF,-LWiZi6KpdjLcOZCbaEr,-LXqZadBzvNwHnZYVjSJ,-LYxynFLlUntenrPS096,-LZ5sM79KlGe1HsFHZ2Q,-LZebfVoomwhK3XT9ySl,-LaDZU7-WlQ8HINIY4n4,-LaJFzzQTdwQ7oBqAZxI,-LcTot98UDVjxP7TtFvp,-LfnNrdt2tIZesVzbVcg,-Lfr67XLUkO-SkkBZdJo,-LgQ6z3as9GpFCbjpUj0,-LigHrgA9V07wM4lWHam,-LjltnC3p9FqCfZD5tNJ,-LjnG66NboEtrmwVaKoq,-LjnOWqutTVfJX2RLYXV,-Ljodc6N8qIcdweBNiPc",
                max: "",
                id: "-LU7dsh6HHew8O2CJ1Oq"
            },
            {
                name: "repeating_earnedxp_-LQi-2PfA4iwP7T7FFzt_xp_award",
                current: "2",
                max: "",
                id: "-LU7dsi4LQiQ-BfVekWV"
            },
            {
                name: "repeating_earnedxp_-LQi-2PfA4iwP7T7FFzt_xp_session",
                current: "Two",
                max: "",
                id: "-LU7dsi5MCKNYf7Ff2ti"
            },
            {
                name: "repeating_earnedxp_-LQi-2PfA4iwP7T7FFzt_xp_reason",
                current: "Three Troubled Thin-Bloods: Story completion award.",
                max: "",
                id: "-LU7dsi7-0sCgAbrOxuf"
            },
            {
                name: "repeating_earnedxp_-LQi-J171uzZXnC-vewh_xp_award",
                current: "5",
                max: "",
                id: "-LU7dsi8Su9MeDOz5xFm"
            },
            {
                name: "repeating_earnedxp_-LQi-J171uzZXnC-vewh_xp_session",
                current: "Two",
                max: "",
                id: "-LU7dsi8Su9MeDOz5xFn"
            },
            {
                name: "repeating_earnedxp_-LQi-J171uzZXnC-vewh_xp_reason",
                current: "Excellent Loresheet for Netchurch.",
                max: "",
                id: "-LU7dsiA_oBXO79dZGJh"
            },
            {
                name: "xp_earnedtotal",
                current: 153,
                max: "",
                id: "-LU7dsiC3A8UvJY9Cp0_"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_category",
                current: "Advantage",
                max: "",
                id: "-LU7dsiEfKr6snYfoQVb"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_trait",
                current: "Mask (John  Nate)",
                max: "",
                id: "-LU7dsiI1-Q0jyG_vvCj"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_cost",
                current: 6,
                max: "",
                id: "-LU7dsiK4o70oLvQy0e3"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_new",
                current: "2",
                max: "",
                id: "-LU7dsiK4o70oLvQy0e4"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_category",
                current: "Advantage",
                max: "",
                id: "-LU7dsiMEqNHwldkjukn"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_new",
                current: "1",
                max: "",
                id: "-LU7dsiRXkLPqKUHepgq"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_trait",
                current: "Loresheet (Newchurch)",
                max: "",
                id: "-LU7dsiSfQVyOFXI8dhL"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_cost",
                current: 3,
                max: "",
                id: "-LU7dsiT8j81f1UwutdK"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_category",
                current: "Skill",
                max: "",
                id: "-LU7dsiUJn4qVdb2NiTb"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_trait",
                current: "Etiquette",
                max: "",
                id: "-LU7dsi_tMrvLJ-TvJI3"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_cost",
                current: 6,
                max: "",
                id: "-LU7dsibpVJRHCse_1Fd"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_initial",
                current: "1",
                max: "",
                id: "-LU7dsicdwymwHnMheLi"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_new",
                current: "2",
                max: "",
                id: "-LU7dsidqunFZghJHr2h"
            },
            {
                name: "repeating_earnedxp_-LRuzhHXwCUYV11KaaRK_xp_award",
                current: "2",
                max: "",
                id: "-LU7dsikmIhegvzBOP6e"
            },
            {
                name: "repeating_earnedxp_-LRuzhHXwCUYV11KaaRK_xp_session",
                current: "Two",
                max: "",
                id: "-LU7dsimDxL1HctsLEsP"
            },
            {
                name: "repeating_earnedxp_-LRuzhHXwCUYV11KaaRK_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LU7dsincl0X13iLrapW"
            },
            {
                name: "repeating_earnedxp_-LRuziGli9eaOsLceHIK_xp_award",
                current: "2",
                max: "",
                id: "-LU7dsincl0X13iLrapX"
            },
            {
                name: "repeating_earnedxp_-LRuziGli9eaOsLceHIK_xp_session",
                current: "Three",
                max: "",
                id: "-LU7dsip77G68eB-CcQ8"
            },
            {
                name: "repeating_earnedxp_-LRuziGli9eaOsLceHIK_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LU7dsirpLUrpZQrNkhg"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_category",
                current: "Skill",
                max: "",
                id: "-LU7dsjYK1rTdQPBYuaY"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_trait",
                current: "Intimidate",
                max: "",
                id: "-LU7dsjdDciAuI5GkOEp"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_cost",
                current: 3,
                max: "",
                id: "-LU7dsjeL5oJmluaj97W"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_new",
                current: "1",
                max: "",
                id: "-LU7dsjfA76W8xOAXO14"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_category",
                current: "Advantage",
                max: "",
                id: "-LU7dsjhkGxyRupA50F9"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_trait",
                current: "Herd (Bookies)",
                max: "",
                id: "-LU7dsjnymOoJa1zTmtf"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_cost",
                current: 9,
                max: "",
                id: "-LU7dsjoESYSD0iSp4k-"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_new",
                current: "3",
                max: "",
                id: "-LU7dsjoESYSD0iSp4k0"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LU7dsk8Q3vUQRRfcs5D"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LU7dsk9ehE62NSNlU5n"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LU7dskAIYma6A2g2aI5"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LU7dskAIYma6A2g2aI6"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LU7dskCzmlfYGDlMuKn"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LU7dskDfBpSGoqnqDyY"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LU7dskEk49SZtcoouXE"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LU7dskFczQG6FqKA7hC"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LU7dskGglgmOmTIxQ4j"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LU7dskH_2nARamCKY_n"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LU7dskIC5-zPyXJEpFd"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LU7dskJYBr1IR9Z0X7I"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LU7dskKv4ViLEoyHtdt"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LU7dskLPpKWfkzuOfdP"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LU7dskM1Zrlt0Y4dZV7"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LU7dskOHtRiMD34RzHr"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LU7dskOHtRiMD34RzHs"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LU7dskPKwucHV02a73a"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LU7dskQAMCfoGNlT-A0"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LU7dskSBBxQbVB5R6WQ"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LU7dskSBBxQbVB5R6WR"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LU7dskTAmkLWXyM8PtR"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LU7dskV1vfDz5kPn-p8"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LU7dskV1vfDz5kPn-p9"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LU7dskXRSgyVDiG3gpr"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LU7dskXRSgyVDiG3gps"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LU7dskZ4ym3FbegJQZs"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LU7dsk_5dJKmaTtRGT4"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LU7dskaun2kTMYuOe9_"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LU7dskczmNnaAqcD-yZ"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LU7dskczmNnaAqcD-y_"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LU7dskeCbiowJSD2_rV"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LU7dskfz4HOm0cFTYsg"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LU7dskgaYdFTlovs3PK"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LU7dskig4XsQc6LW9on"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LU7dskig4XsQc6LW9oo"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LU7dskjH3JWxc3-5iua"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LU7dskkZA-Xr9sCQTRi"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LU7dskmiu_-W4Cpgm1T"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LV0qHb-CYsiA84QpmAY"
            },
            {
                name: "repeating_earnedxp_-LOL0MvLYsuljyZCFymk_sorttrigger",
                current: false,
                max: "",
                id: "-LVEAPQXrE1zbcZHbst0"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_category",
                current: "Advantage",
                max: "",
                id: "-LV_mITqc93u0_eotwkV"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LV_mIWqN9eJumY9jsw0"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LV_mIWtKlnKwX0CUXcY"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LV_mIWuKsHGZRwh4f2C"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LV_mIWx28i-itiFKNqE"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_trait",
                current: "Loresheet (Newchurch)",
                max: "",
                id: "-LV_mMTgFxoX83D8tpLv"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_cost",
                current: 12,
                max: "",
                id: "-LV_mMW6AKRWITCDShQi"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_new",
                current: "4",
                max: "",
                id: "-LV_mMiQpp-1cjoO0dYc"
            },
            {
                name: "repeating_earnedxp_-LVaIa8cnzXhum3lscuA_xp_award",
                current: "1",
                max: "",
                id: "-LVaIa8W73iarDbF1qat"
            },
            {
                name: "repeating_earnedxp_-LVaIa8cnzXhum3lscuA_xp_session",
                current: "Three",
                max: "",
                id: "-LVaIa8YhtTEmK6nls1G"
            },
            {
                name: "repeating_earnedxp_-LVaIa8cnzXhum3lscuA_xp_reason",
                current: "Playing NPCs during Memoriam.",
                max: "",
                id: "-LVaIa8Z8Ug0M6WDL401"
            },
            {
                name: "repeating_earnedxp_-LVaUKCH8TkCB8LFBooF_xp_award",
                current: "1",
                max: "",
                id: "-LVaUKCANb4qp5STF4Xt"
            },
            {
                name: "repeating_earnedxp_-LVaUKCH8TkCB8LFBooF_xp_session",
                current: "Four",
                max: "",
                id: "-LVaUKCCvYSuYsON_F9G"
            },
            {
                name: "repeating_earnedxp_-LVaUKCH8TkCB8LFBooF_xp_reason",
                current: "Session XP award (albeit smaller, given the short session).",
                max: "",
                id: "-LVaUKCDh-G4Pny5J3UE"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_category",
                current: "Advantage",
                max: "",
                id: "-LWhp-8Z0z7VL715DHLx"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LWhp-B17gx45ilyEH6M"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LWhp-B4GadFXeVnSn5-"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LWhp-B7tCOPxYJRKrPF"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LWhp-B9R2E_suqwxfKd"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_trait",
                current: "Mawla",
                max: "",
                id: "-LWhp1a3OX9T86rUmxsl"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_cost",
                current: 3,
                max: "",
                id: "-LWhp1cL0LvmYSRdUarj"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_initial",
                current: "3",
                max: "",
                id: "-LWhp1olXXjgx5EAuQ_l"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_new",
                current: "4",
                max: "",
                id: "-LWhp2C361HWrKWTl1jz"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LWhp2s3_pmQ4-qJvvXt"
            },
            {
                name: "repeating_earnedxp_-LWiZi6KpdjLcOZCbaEr_xp_award",
                current: "2",
                max: "",
                id: "-LWiZi6HVVI0Tpv4xX3k"
            },
            {
                name: "repeating_earnedxp_-LWiZi6KpdjLcOZCbaEr_xp_session",
                current: "Five",
                max: "",
                id: "-LWiZi6JmXPD1lUAStjt"
            },
            {
                name: "repeating_earnedxp_-LWiZi6KpdjLcOZCbaEr_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LWiZi6KeH_5iisHwvPN"
            },
            {
                name: "repeating_earnedxp_-LXqZadBzvNwHnZYVjSJ_xp_award",
                current: "2",
                max: "",
                id: "-LXq_ad4X8uvHIXKJKuH"
            },
            {
                name: "repeating_earnedxp_-LXqZadBzvNwHnZYVjSJ_xp_session",
                current: "Six",
                max: "",
                id: "-LXq_ad63ZTDUT-9v42T"
            },
            {
                name: "repeating_earnedxp_-LXqZadBzvNwHnZYVjSJ_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LXq_ad8V6D2_S4w9nK6"
            },
            {
                name: "repeating_earnedxp_-LYxynFLlUntenrPS096_xp_award",
                current: "1",
                max: "",
                id: "-LYxynFHhgbamzr3XpWf"
            },
            {
                name: "repeating_earnedxp_-LYxynFLlUntenrPS096_xp_session",
                current: "Six",
                max: "",
                id: "-LYxynFJAuvWkXaWsQjP"
            },
            {
                name: "repeating_earnedxp_-LYxynFLlUntenrPS096_xp_reason",
                current: "Roleplaying an NPC in Ava's Memoriam",
                max: "",
                id: "-LYxynFKLPTy83DwciR1"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_category",
                current: "Attribute",
                max: "",
                id: "-LYyAOZ3JM8VsKmb08m4"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LYyAOcZvyjKsarDr4GE"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LYyAOcb3ivmAGdiHuk1"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LYyAOcePFw-7Gfs29Uh"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LYyAOchCS1v2E-CYrwh"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_trait",
                current: "Intelligence",
                max: "",
                id: "-LYyAQFgKjNd1u1843AS"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_cost",
                current: 20,
                max: "",
                id: "-LYyAQINp2oUIGrmccyP"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_initial",
                current: "3",
                max: "",
                id: "-LYyAQzbfl_frsI39IlW"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_new",
                current: "4",
                max: "",
                id: "-LYyARVhI7Z9H-hsrdAF"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LYypmjhYMQ1tUEIWADm"
            },
            {
                name: "repeating_earnedxp_-LZ5sM79KlGe1HsFHZ2Q_xp_award",
                current: "2",
                max: "",
                id: "-L_5sM73Y4YQbl_i1zN8"
            },
            {
                name: "repeating_earnedxp_-LZ5sM79KlGe1HsFHZ2Q_xp_session",
                current: "Seven",
                max: "",
                id: "-L_5sM74yWaL_ou_jUfI"
            },
            {
                name: "repeating_earnedxp_-LZ5sM79KlGe1HsFHZ2Q_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-L_5sM76M23950gK0yLy"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_category",
                current: "Clan Discipline",
                max: "",
                id: "-L_eHr2OnVtWWYD7VrtC"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-L_eHr7G1Y9BpUfB8jJl"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-L_eHr7Kq3LgLCySjMgQ"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_new_toggle",
                current: 1,
                max: "",
                id: "-L_eHr7NV18hh0tmQmay"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-L_eHr7QetqGGToT1KwI"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_trait",
                current: "Obfuscate 4 2 xp locked Requires BP 2",
                max: "",
                id: "-L_eHsoEM1XWOIXWo4Jp"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_cost",
                current: 20,
                max: "",
                id: "-L_eHsqkUp906P7Dg-2y"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_initial",
                current: "3",
                max: "",
                id: "-L_eHt5iUlribPPIAx5D"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_new",
                current: "4",
                max: "",
                id: "-L_eHtVPvUwrL3qJRNEH"
            },
            {
                name: "repeating_earnedxp_-LZebfVoomwhK3XT9ySl_xp_award",
                current: "3",
                max: "",
                id: "-L_ebfVhh0k3lk6FpS3I"
            },
            {
                name: "repeating_earnedxp_-LZebfVoomwhK3XT9ySl_xp_session",
                current: "Eight",
                max: "",
                id: "-L_ebfVjdejaYLDfhvBi"
            },
            {
                name: "repeating_earnedxp_-LZebfVoomwhK3XT9ySl_xp_reason",
                current: "Playing Alex the Lasombra during King's Memoriam, and playing him really, really, REALLY well.",
                max: "",
                id: "-L_ebfVkhicw9qbj-ZJU"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_category",
                current: "Advantage",
                max: "",
                id: "-LaDPW5RoMLmX_QcTpOv"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LaDPW9ny6wLrjfDBdVa"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LaDPW9qgrVtZE9viyu6"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LaDPW9tdPavOvV3E2Ax"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LaDPW9wJyveCW1WuORy"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_new",
                current: "1",
                max: "",
                id: "-LaDPXEVoSRc8Krw4KUp"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_trait",
                current: "Contacts The Aristocrat",
                max: "",
                id: "-LaDP_WzXtpQZAzrUN_R"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_cost",
                current: 3,
                max: "",
                id: "-LaDP_ZoyKMBWUAIo7kR"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LaDPc5yf2SqfJdTuSTL"
            },
            {
                name: "repeating_earnedxp_-LaDZU7-WlQ8HINIY4n4_xp_award",
                current: "2",
                max: "",
                id: "-LaDZU6sxDM7vwsNlWvk"
            },
            {
                name: "repeating_earnedxp_-LaDZU7-WlQ8HINIY4n4_xp_session",
                current: "Eight",
                max: "",
                id: "-LaDZU6uHtl54V9K5jz4"
            },
            {
                name: "repeating_earnedxp_-LaDZU7-WlQ8HINIY4n4_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LaDZU6wiNPqLl6u0Qve"
            },
            {
                name: "repeating_earnedxp_-LaJFzzQTdwQ7oBqAZxI_xp_award",
                current: "9",
                max: "",
                id: "-LaJFzzJKQltzCvWoiJM"
            },
            {
                name: "repeating_earnedxp_-LaJFzzQTdwQ7oBqAZxI_xp_session",
                current: "Nine",
                max: "",
                id: "-LaJFzzLTk2zEpQDwpwl"
            },
            {
                name: "repeating_earnedxp_-LaJFzzQTdwQ7oBqAZxI_xp_reason",
                current: "Refund for lost Herd (Patients) Background",
                max: "",
                id: "-LaJFzzNUiZiwXDPPnYG"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_category",
                current: "Skill",
                max: "",
                id: "-Laaqmrn-eykvLsYMStY"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-Laaqmw1uGWDJY8NEKBi"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-Laaqmw5msEI1aBaO5ck"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_new_toggle",
                current: 1,
                max: "",
                id: "-Laaqmw8-S2DFaRtztx6"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LaaqmwBlu_c-P1dZh5d"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_trait",
                current: "Crafts",
                max: "",
                id: "-LaaqobO4oPGI69_OCF-"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_cost",
                current: 3,
                max: "",
                id: "-LaaqoeiFpY-nZiNa5Fo"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_new",
                current: "1",
                max: "",
                id: "-LaaqpNU8klQrPnacpPs"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_category",
                current: "Advantage",
                max: "",
                id: "-Laart91ZCLxtLHg4Of3"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_cost",
                current: 6,
                max: "",
                id: "-LaartD1DouSuykAxpEW"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LaartD4LL1drSi9gZg5"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LaartD6NJOcTqwVxhTY"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LaartD9MQtHbsUOMgLz"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_initial",
                current: "1",
                max: "",
                id: "-Laartc_4FXKJ2k4PBab"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_new",
                current: "3",
                max: "",
                id: "-LaarttxVbwWpedzr76j"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LaarvKGTt1UbC76zo7A"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_category",
                current: "Clan Discipline",
                max: "",
                id: "-LaatALtON0BbKb5-3UO"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LaatAPN-lcTrsKJGSHd"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LaatAPQXe12GsGHOWoY"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LaatAPThBoY3PZFny0t"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LaatAPWzNDqqQTRPAo8"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_trait",
                current: "Dominate",
                max: "",
                id: "-LaatBRSvBpZoaqSteYS"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_cost",
                current: 10,
                max: "",
                id: "-LaatBUauWBxLHdD1xFq"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_initial",
                current: "1",
                max: "",
                id: "-LaatBazhlasCZVk4DFR"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_new",
                current: "2",
                max: "",
                id: "-LaatBtS9o0-y68RUYJX"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LaatCPGpioj9QJJ3afH"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LamJ5_K6az5_x4xvLHd"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_trait",
                current: "Contacts (The Aristocrat)",
                max: "",
                id: "-LamJ9FF6zEvAhkQoN1k"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LamJ9GCj2mOTq0Ihlpe"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_category",
                current: "Advantage",
                max: "",
                id: "-Lam__YC1yv94KBczScd"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-Lam__arvQ17MXoQF1Y-"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-Lam__avM340SskSKf-V"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_new_toggle",
                current: 1,
                max: "",
                id: "-Lam__ayamMQ_RZFgvJa"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-Lam__b1BRV0mCueget8"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_new",
                current: "2",
                max: "",
                id: "-Lam_aWjATbj6FFmET37"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_trait",
                current: "Herd 2  (Mobile Clinic)",
                max: "",
                id: "-Lam_lBi5a-f2FbcjYjn"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_cost",
                current: 6,
                max: "",
                id: "-Lam_lExMpW6ARcdMAKl"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-Lam_lt0od-CfC8-EChZ"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-Lbu5xVR-pXLHKFd0Ih4"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_spent_toggle",
                current: "0",
                max: "",
                id: "-LbuC7cUMRK-yQMDu8g1"
            },
            {
                name: "_reporder_repeating_spentxp",
                current: "-LOaLKRRBwYLz4EGdCWa,-LOaLRdJZb62plNm2LGK,-LOipUBMR4NWs3k5GEMN,-LRdS35zqTQZQSURSm0W,-LRdSaN5g-7rXous9qKE,-LRdSoczJpI7MPcxJSPg,-LTL-ZtVHOqFSwj8w35j,-LTL-dsRy3hS1eV9-Dvs,-LVZm9yaQfsARLurUGaq,-LVZmEeaBHCO0YGJaWBa,-LWhozCSF8j9IDqUmJQd,-LYyANiuyhrlaA1Y7G1R,-LZ5rlYr6PCoVu8bscs4,-LaDPUXGNfv90L0xsZ0D,-Laaqm0ZYo2-3jPmwnAk,-Laars8DEDz12BI4opac,-Laat9YRzAJyyac3wEll,-LamZZEZsLH9V4x2-1q7,-LZeHqQ8nruWFSCMw736",
                max: "",
                id: "-LbuDmslDp46AMhVHUAy"
            },
            {
                name: "repeating_earnedxp_-LcTot98UDVjxP7TtFvp_xp_award",
                current: "2",
                max: "",
                id: "-LcTot92Ywe58d-aYICO"
            },
            {
                name: "repeating_earnedxp_-LcTot98UDVjxP7TtFvp_xp_session",
                current: "Nine",
                max: "",
                id: "-LcTot96TmNHAKkE_28w"
            },
            {
                name: "repeating_earnedxp_-LcTot98UDVjxP7TtFvp_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LcTot99VXNvzWND9d_Y"
            },
            {
                name: "repeating_earnedxpright_-LcTovHsXD7b30k3prbK_xp_award",
                current: 2,
                max: "",
                id: "-LcTovHlYa15QA5F2QFD"
            },
            {
                name: "repeating_earnedxpright_-LcTovHsXD7b30k3prbK_xp_session",
                current: "Sixteen",
                max: "",
                id: "-LcTovHoovQT7kPq1AdB"
            },
            {
                name: "repeating_earnedxpright_-LcTovHsXD7b30k3prbK_xp_reason",
                current: "FOR OBFUSCATE ONLY",
                max: "",
                id: "-LcTovHrTX8thOXoehwK"
            },
            {
                name: "repeating_earnedxpright_-LcTovJG3H3e1IIdiXsw_xp_award",
                current: 2,
                max: "",
                id: "-LcTovJ9JS6EWXfvmnhV"
            },
            {
                name: "repeating_earnedxpright_-LcTovJG3H3e1IIdiXsw_xp_session",
                current: "Sixteen",
                max: "",
                id: "-LcTovJDULm5ww6jBDY7"
            },
            {
                name: "repeating_earnedxpright_-LcTovJG3H3e1IIdiXsw_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-LcTovJG26TNJe0P6f7f"
            },
            {
                name: "repeating_earnedxpright_-LcTovKdVNpsbt7jZVDx_xp_award",
                current: 2,
                max: "",
                id: "-LcTovKX8JJwj9QKTduN"
            },
            {
                name: "repeating_earnedxpright_-LcTovKdVNpsbt7jZVDx_xp_session",
                current: "Seventeen",
                max: "",
                id: "-LcTovKaN2u-h82pdNmr"
            },
            {
                name: "repeating_earnedxpright_-LcTovKdVNpsbt7jZVDx_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-LcTovKcAUZrYYlk5cOU"
            },
            {
                name: "repeating_earnedxpright_-LcTovM6lstJ-ITWdQCB_xp_award",
                current: 2,
                max: "",
                id: "-LcTovM-qPrAc72ylxRz"
            },
            {
                name: "repeating_earnedxpright_-LcTovM6lstJ-ITWdQCB_xp_session",
                current: "Seventeen",
                max: "",
                id: "-LcTovM3_nxuu_AkTG9h"
            },
            {
                name: "repeating_earnedxpright_-LcTovM6lstJ-ITWdQCB_xp_reason",
                current: "The Vultures Circle",
                max: "",
                id: "-LcTovM6dh43lfK1l5sK"
            },
            {
                name: "repeating_earnedxpright_-LcTovNZ8XnpuNyvFnnm_xp_award",
                current: 20,
                max: "",
                id: "-LcTovNS_BhUE-bSHu2V"
            },
            {
                name: "repeating_earnedxpright_-LcTovNZ8XnpuNyvFnnm_xp_session",
                current: "Eighteen",
                max: "",
                id: "-LcTovNWde_SFOKEqCAf"
            },
            {
                name: "repeating_earnedxpright_-LcTovNZ8XnpuNyvFnnm_xp_reason",
                current: "Award for 15 month time jump.",
                max: "",
                id: "-LcTovNZ06qa_JzBCWl8"
            },
            {
                name: "repeating_earnedxpright_-LcTovPBETC3Nx50A-ic_xp_award",
                current: 2,
                max: "",
                id: "-LcTovP5oGysPqCKzx2p"
            },
            {
                name: "repeating_earnedxpright_-LcTovPBETC3Nx50A-ic_xp_session",
                current: "Eighteen",
                max: "",
                id: "-LcTovP9vggUVf1CENiG"
            },
            {
                name: "repeating_earnedxpright_-LcTovPBETC3Nx50A-ic_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-LcTovPB7TsG_1dAjjek"
            },
            {
                name: "repeating_earnedxpright_-LcTovQcTsYAZ3Goq91l_xp_award",
                current: 2,
                max: "",
                id: "-LcTovQWnjZHlFYmoiq3"
            },
            {
                name: "repeating_earnedxpright_-LcTovQcTsYAZ3Goq91l_xp_session",
                current: "Nineteen",
                max: "",
                id: "-LcTovQZCIKkwgz7D20f"
            },
            {
                name: "repeating_earnedxpright_-LcTovQcTsYAZ3Goq91l_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-LcTovQbO9XJxE_c4qZC"
            },
            {
                name: "repeating_earnedxpright_-LcTovRyOSTSUNeZYjIl_xp_award",
                current: 2,
                max: "",
                id: "-LcTovRrxu7TTRrj4x9-"
            },
            {
                name: "repeating_earnedxpright_-LcTovRyOSTSUNeZYjIl_xp_session",
                current: "Twenty",
                max: "",
                id: "-LcTovRuBVccWp54c_iW"
            },
            {
                name: "repeating_earnedxpright_-LcTovRyOSTSUNeZYjIl_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-LcTovRxM6NiXkXwLVYv"
            },
            {
                name: "repeating_earnedxpright_-LfnNrb3g2IpHPbvss23_xp_award",
                current: 2,
                max: "",
                id: "-LfnNrax8vjN3hLSIrBf"
            },
            {
                name: "repeating_earnedxpright_-LfnNrb3g2IpHPbvss23_xp_session",
                current: "Twenty-One",
                max: "",
                id: "-LfnNrb2N6ZpHZ5a1xlI"
            },
            {
                name: "repeating_earnedxpright_-LfnNrb3g2IpHPbvss23_xp_reason",
                current: "Your unending patience!",
                max: "",
                id: "-LfnNrb5Evv7mqqWoh50"
            },
            {
                name: "repeating_earnedxp_-LfnNrdt2tIZesVzbVcg_xp_award",
                current: "2",
                max: "",
                id: "-LfnNrdmgzKKjqFuQPhn"
            },
            {
                name: "repeating_earnedxp_-LfnNrdt2tIZesVzbVcg_xp_session",
                current: "Nine",
                max: "",
                id: "-LfnNrdrZWIMGOWwimCc"
            },
            {
                name: "repeating_earnedxp_-LfnNrdt2tIZesVzbVcg_xp_reason",
                current: "Scheer's Strike: Story completion award.",
                max: "",
                id: "-LfnNrdvkv4LaOiBWB_D"
            },
            {
                name: "_reporder_repeating_earnedxpright",
                current: "-LcTov9J-4LPa7rtlKhZ,-LcTovAlNsX3NYvaQuEi,-LcTovCDfKPJOvglQdhs,-LcTovDX1D5gWWQulLiu,-LcTovF0HTMFspey2dVt,-LcTovGXGSvsau-BAsy1,-LcTovHsXD7b30k3prbK,-LcTovJG3H3e1IIdiXsw,-LcTovKdVNpsbt7jZVDx,-LcTovM6lstJ-ITWdQCB,-LcTovNZ8XnpuNyvFnnm,-LcTovPBETC3Nx50A-ic,-LcTovQcTsYAZ3Goq91l,-LcTovRyOSTSUNeZYjIl,-LfnNrb3g2IpHPbvss23,-Lfr5Kli9kw5oo7qK2kp,-Lfr67TsoW4AcYz3yZuE,-LgPhoGYQVMHB0dQtlG3,-LgQ6z0-LEq3-YIEEDZ2,-LgQ7125wPQzDqnyY4r0,-LigID0vC6PRzpkH2yTi,-LigJJGg4UocCcY3nikh,-Ljltn7lAOIi7EZdBNQ7,-Ljoe69N3PFKw8rpggxm,-LjoeIlWFN2ChLqOVxV5",
                max: "",
                id: "-LfnNrfCMyCNmW5eCSkK"
            },
            {
                name: "repeating_earnedxpright_-Lfr5Kli9kw5oo7qK2kp_xp_award",
                current: 2,
                max: "",
                id: "-Lfr5KlawsivpL2Sonf4"
            },
            {
                name: "repeating_earnedxpright_-Lfr5Kli9kw5oo7qK2kp_xp_session",
                current: "Twenty-One",
                max: "",
                id: "-Lfr5Klh82epzMaKqciU"
            },
            {
                name: "repeating_earnedxpright_-Lfr5Kli9kw5oo7qK2kp_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-Lfr5KlmlvEt1DHxn40f"
            },
            {
                name: "repeating_earnedxpright_-Lfr67TsoW4AcYz3yZuE_xp_award",
                current: 1,
                max: "",
                id: "-Lfr67TkQeTKbHhbmSXv"
            },
            {
                name: "repeating_earnedxpright_-Lfr67TsoW4AcYz3yZuE_xp_session",
                current: "Twenty-One",
                max: "",
                id: "-Lfr67TraAQntTaW3IIM"
            },
            {
                name: "repeating_earnedxpright_-Lfr67TsoW4AcYz3yZuE_xp_reason",
                current: "Excellent in-character ghoul play",
                max: "",
                id: "-Lfr67Tuz_Nnpr4u-nP4"
            },
            {
                name: "repeating_earnedxp_-Lfr67XLUkO-SkkBZdJo_xp_award",
                current: "2",
                max: "",
                id: "-Lfr67XDQfKfM9nTME6K"
            },
            {
                name: "repeating_earnedxp_-Lfr67XLUkO-SkkBZdJo_xp_session",
                current: "Ten",
                max: "",
                id: "-Lfr67XIjcPxxGB_ch_H"
            },
            {
                name: "repeating_earnedxp_-Lfr67XLUkO-SkkBZdJo_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-Lfr67XLK4u0rEyW1WQk"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_category",
                current: "Advantage",
                max: "",
                id: "-LgPhl8VwZWrQhfvPz30"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LgPhlYuySh-msc3M9qZ"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LgPhlZ0FCUFXt-9p2oh"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LgPhlZ4gFbGW6XrgAQa"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LgPhlZAYUTf0CMomQJt"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_new",
                current: "1",
                max: "",
                id: "-LgPhmIwj_TtZdvq2yFk"
            },
            {
                name: "repeating_earnedxpright_-LgPhoGYQVMHB0dQtlG3_xp_award",
                current: 2,
                max: "",
                id: "-LgPhoGQsdkdOaeGxJaI"
            },
            {
                name: "repeating_earnedxpright_-LgPhoGYQVMHB0dQtlG3_xp_session",
                current: "Twenty-Two",
                max: "",
                id: "-LgPhoGWQZIAKJh1hhXz"
            },
            {
                name: "repeating_earnedxpright_-LgPhoGYQVMHB0dQtlG3_xp_reason",
                current: "Refund for Haven Warding purchase",
                max: "",
                id: "-LgPhoGZENwvKqtTRZpT"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_trait",
                current: "Haven Warding Merit",
                max: "",
                id: "-LgPhoV7bwo2zhqe0X8y"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_cost",
                current: 3,
                max: "",
                id: "-LgPhoXY56C0V4gZQKh6"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LgPhonpCuImi4Ud3c5N"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_category",
                current: "Advantage",
                max: "",
                id: "-LgPu9ufkuSNKCXivRQj"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LgPu9zP8vWgQSk9WLAK"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LgPu9zZH8CFnSKJLLLQ"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LgPu9zdRJBglwxveFuf"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LgPu9zoj9aU-Us4z6t8"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_trait",
                current: "Loresheet (Netchurch)",
                max: "",
                id: "-LgPuDDH_6bKmL9yw4YH"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_cost",
                current: 6,
                max: "",
                id: "-LgPuDHIRa_rM8w8O_C-"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_new",
                current: "2",
                max: "",
                id: "-LgPuEIYmRXnBcF2Vao9"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LgPuyemGKgBy6N6LsmP"
            },
            {
                name: "repeating_earnedxpright_-LgQ6z0-LEq3-YIEEDZ2_xp_award",
                current: 1,
                max: "",
                id: "-LgQ6z-rP7AWGpp69ad0"
            },
            {
                name: "repeating_earnedxpright_-LgQ6z0-LEq3-YIEEDZ2_xp_session",
                current: "Twenty-Two",
                max: "",
                id: "-LgQ6z-xEUt6X_RQIAq_"
            },
            {
                name: "repeating_earnedxpright_-LgQ6z0-LEq3-YIEEDZ2_xp_reason",
                current: "RP: Little Character Moments",
                max: "",
                id: "-LgQ6z0-y8u0Chwu1Dxp"
            },
            {
                name: "repeating_earnedxp_-LgQ6z3as9GpFCbjpUj0_xp_award",
                current: "2",
                max: "",
                id: "-LgQ6z3S5-OF0Cb00P7q"
            },
            {
                name: "repeating_earnedxp_-LgQ6z3as9GpFCbjpUj0_xp_session",
                current: "Eleven",
                max: "",
                id: "-LgQ6z3ZhrB9A9U2CV90"
            },
            {
                name: "repeating_earnedxp_-LgQ6z3as9GpFCbjpUj0_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LgQ6z3cscZLLnerwh61"
            },
            {
                name: "repeating_earnedxpright_-LgQ7125wPQzDqnyY4r0_xp_award",
                current: 2,
                max: "",
                id: "-LgQ711x7F0QSePLCF_8"
            },
            {
                name: "repeating_earnedxpright_-LgQ7125wPQzDqnyY4r0_xp_session",
                current: "Twenty-Two",
                max: "",
                id: "-LgQ7122QiWEMUXNycjW"
            },
            {
                name: "repeating_earnedxpright_-LgQ7125wPQzDqnyY4r0_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-LgQ7126bOmElpjIUrVG"
            },
            {
                name: "repeating_earnedxp_-LigHrgA9V07wM4lWHam_xp_award",
                current: 2,
                max: "",
                id: "-LigHrg224xrFg8NuU8i"
            },
            {
                name: "repeating_earnedxp_-LigHrgA9V07wM4lWHam_xp_session",
                current: "Twelve",
                max: "",
                id: "-LigHrg6xQ0eiVLMUqG6"
            },
            {
                name: "repeating_earnedxp_-LigHrgA9V07wM4lWHam_xp_reason",
                current: "Brilliant montage idea",
                max: "",
                id: "-LigHrgA7LpGCPGMyUUs"
            },
            {
                name: "repeating_earnedxpright_-LigID0vC6PRzpkH2yTi_xp_award",
                current: 2,
                max: "",
                id: "-LigID0n4wMWRTRkP9bw"
            },
            {
                name: "repeating_earnedxpright_-LigID0vC6PRzpkH2yTi_xp_session",
                current: "Twenty-Three",
                max: "",
                id: "-LigID0t-i6Gsmwko8W_"
            },
            {
                name: "repeating_earnedxpright_-LigID0vC6PRzpkH2yTi_xp_reason",
                current: "Excellent RP and character development",
                max: "",
                id: "-LigID0wnYHujS3gbZ5C"
            },
            {
                name: "repeating_earnedxpright_-LigJJGg4UocCcY3nikh_xp_award",
                current: 2,
                max: "",
                id: "-LigJJGZJYklzwlA7aWQ"
            },
            {
                name: "repeating_earnedxpright_-LigJJGg4UocCcY3nikh_xp_session",
                current: "Twenty-Three",
                max: "",
                id: "-LigJJGc1pVyr-BNd3V7"
            },
            {
                name: "repeating_earnedxpright_-LigJJGg4UocCcY3nikh_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LigJJGfo5iSROcberqJ"
            },
            {
                name: "repeating_earnedxpright_-Ljltn7lAOIi7EZdBNQ7_xp_award",
                current: 2,
                max: "",
                id: "-Ljltn7fF3Daj1TBdZea"
            },
            {
                name: "repeating_earnedxpright_-Ljltn7lAOIi7EZdBNQ7_xp_session",
                current: "Twenty-Four",
                max: "",
                id: "-Ljltn7n3min-9sL4hm1"
            },
            {
                name: "repeating_earnedxpright_-Ljltn7lAOIi7EZdBNQ7_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-Ljltn7tukaWdsEwKKvT"
            },
            {
                name: "repeating_earnedxpright_-Ljoe69N3PFKw8rpggxm_xp_award",
                current: 1,
                max: "",
                id: "-Ljoe69EFh0s1ejgZvfM"
            },
            {
                name: "repeating_earnedxpright_-Ljoe69N3PFKw8rpggxm_xp_session",
                current: "Twenty-Five",
                max: "",
                id: "-Ljoe69No6oyemQC5tzL"
            },
            {
                name: "repeating_earnedxpright_-Ljoe69N3PFKw8rpggxm_xp_reason",
                current: "Awesome Compulsion RP",
                max: "",
                id: "-Ljoe69UCQ3Mu3o-kq8X"
            },
            {
                name: "repeating_earnedxpright_-LjoeIlWFN2ChLqOVxV5_xp_award",
                current: 2,
                max: "",
                id: "-LjoeIlNpo-n9s59vYHC"
            },
            {
                name: "repeating_earnedxpright_-LjoeIlWFN2ChLqOVxV5_xp_session",
                current: "Twenty-Five",
                max: "",
                id: "-LjoeIlWlr884hmeBlvK"
            },
            {
                name: "repeating_earnedxpright_-LjoeIlWFN2ChLqOVxV5_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LjoeIldiVmTrk3-QJuu"
            },
            {
                name: "repeating_earnedxp_-LkCCiW1Ggw-lhIZZa8P_xp_award",
                current: 2,
                max: "",
                id: "-LkCCiVvkOqVfhOerSY7"
            },
            {
                name: "repeating_earnedxp_-LkCCiW1Ggw-lhIZZa8P_xp_session",
                current: "Twelve",
                max: "",
                id: "-LkCCiW-gNefPCLR-AH8"
            },
            {
                name: "repeating_earnedxp_-LkCCiW1Ggw-lhIZZa8P_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LkCCiW4cMwCf5TiM1ij"
            },
            {
                name: "repeating_earnedxp_-LkCCiXlavMTlRmj9nCw_xp_award",
                current: 2,
                max: "",
                id: "-LkCCiXdBisdtigAxENE"
            },
            {
                name: "repeating_earnedxp_-LkCCiXlavMTlRmj9nCw_xp_session",
                current: "Thirteen",
                max: "",
                id: "-LkCCiXjOSppOXDQWik2"
            },
            {
                name: "repeating_earnedxp_-LkCCiXlavMTlRmj9nCw_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-LkCCiXrqrEfFNxED9Ch"
            },
            {
                name: "repeating_earnedxpright_-LkvQPgPoKSnheOiDFoq_xp_award",
                current: 2,
                max: "",
                id: "-LkvQPgIRX4Gv6OWrVVB"
            },
            {
                name: "repeating_earnedxpright_-LkvQPgPoKSnheOiDFoq_xp_session",
                current: "Twenty-Six",
                max: "",
                id: "-LkvQPgOsjJAKRTob5t_"
            },
            {
                name: "repeating_earnedxpright_-LkvQPgPoKSnheOiDFoq_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LkvQPgRqFVCakbFxZtV"
            },
            {
                name: "repeating_earnedxpright_-LmCusV7l9ymS-5NKXoE_xp_award",
                current: 2,
                max: "",
                id: "-LmCusV3DjyW_wYgJfDl"
            },
            {
                name: "repeating_earnedxpright_-LmCusV7l9ymS-5NKXoE_xp_session",
                current: "Twenty-Seven",
                max: "",
                id: "-LmCusV8Ct8R-I_PSnKR"
            },
            {
                name: "repeating_earnedxpright_-LmCusV7l9ymS-5NKXoE_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LmCusVCKtEWgkZg5AuP"
            },
            {
                name: "repeating_earnedxp_-LmCusVu3it4WZPdANZz_xp_award",
                current: 1,
                max: "",
                id: "-LmCusVr8tC84t4_gzAn"
            },
            {
                name: "repeating_earnedxp_-LmCusVu3it4WZPdANZz_xp_session",
                current: "Thirteen",
                max: "",
                id: "-LmCusVzwD0h-bow1MaE"
            },
            {
                name: "repeating_earnedxp_-LmCusVu3it4WZPdANZz_xp_reason",
                current: "Engaging with the plot",
                max: "",
                id: "-LmCusW2f9tcwAbyE_5p"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_category",
                current: "Skill",
                max: "",
                id: "-Lmb0AawXEfl3boeN5WZ"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-Lmb0AfmHWIogVtYynu-"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-Lmb0AfsjyR72PnMq9RP"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_new_toggle",
                current: 1,
                max: "",
                id: "-Lmb0AfzdwIAttBZMUmn"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-Lmb0Ag4YgO9wBKxYbZc"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_trait",
                current: "Subterfuge",
                max: "",
                id: "-Lmb0CA538BcdzZYKBml"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_cost",
                current: 6,
                max: "",
                id: "-Lmb0CEApbZSktSRXDCQ"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_initial",
                current: "1",
                max: "",
                id: "-Lmb0CcNyTA1rv_wMWWQ"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_new",
                current: "2",
                max: "",
                id: "-Lmb0D35988EBCQMAmrw"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_category",
                current: "Clan Discipline",
                max: "",
                id: "-Lmb0FSuUwgSS4UCaQwt"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-Lmb0FWuZ0dQTZ6jQeNm"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-Lmb0FWzEhBYIu7PIJvY"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_new_toggle",
                current: 1,
                max: "",
                id: "-Lmb0FX3N7mkB53nCcRW"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-Lmb0FX75qdbv6-qzd5b"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_trait",
                current: "Dominate",
                max: "",
                id: "-Lmb0Gp1OE-1ic1fTnZh"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_cost",
                current: 10,
                max: "",
                id: "-Lmb0Gt-8EanYOYg4m0Z"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_initial",
                current: "1",
                max: "",
                id: "-Lmb0H6yQIZxUoQmJ0la"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_new",
                current: "2",
                max: "",
                id: "-Lmb0H_RyqPE-zrCrEk6"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-Lmb3b94YLyKwFvHJeCy"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_category",
                current: "Advantage",
                max: "",
                id: "-LoI_hznjHpsssXuQ6rY"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LoI_i3jb9pZMzPPTKOn"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LoI_i3pD6BdhWN1meoi"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LoI_i3tJuxOnBIsirQl"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LoI_i3xIypA44sazddo"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_trait",
                current: "Loresheet (Netchurch)",
                max: "",
                id: "-LoI_lNaKgmr9Xj1Yzm0"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_cost",
                current: 9,
                max: "",
                id: "-LoI_lRAgp63b9nMirHx"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_new",
                current: "3",
                max: "",
                id: "-LoI_lf4YJU0gDcpyHOB"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LoI_mClyCNnMx6CwK1l"
            },
            {
                name: "repeating_earnedxpright_-LoIju1OFhVFMbYpmYRd_xp_award",
                current: 1,
                max: "",
                id: "-LoIju1KGlsWOFiSzMht"
            },
            {
                name: "repeating_earnedxpright_-LoIju1OFhVFMbYpmYRd_xp_session",
                current: "Twenty-Nine",
                max: "",
                id: "-LoIju1RnLV2vKR7ssW4"
            },
            {
                name: "repeating_earnedxpright_-LoIju1OFhVFMbYpmYRd_xp_reason",
                current: "Great RP as the baroness' lapdog",
                max: "",
                id: "-LoIju1WwoWujFukeD9P"
            },
            {
                name: "repeating_earnedxpright_-LoKrRVMT6hIquIyoaeZ_xp_award",
                current: 2,
                max: "",
                id: "-LoKrRVFWZPZFLO8O21c"
            },
            {
                name: "repeating_earnedxpright_-LoKrRVMT6hIquIyoaeZ_xp_session",
                current: "Twenty-Nine",
                max: "",
                id: "-LoKrRVYg77alGLaOEOw"
            },
            {
                name: "repeating_earnedxpright_-LoKrRVMT6hIquIyoaeZ_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LoKrRVaso4Y2oGS5xMg"
            },
            {
                name: "repeating_earnedxp_-LoKrRWIdXcMWg5A95Zy_xp_award",
                current: 2,
                max: "",
                id: "-LoKrRWAuWxCiP6dgZ0c"
            },
            {
                name: "repeating_earnedxp_-LoKrRWIdXcMWg5A95Zy_xp_session",
                current: "Fourteen",
                max: "",
                id: "-LoKrRWEkL7pjYUBB_1p"
            },
            {
                name: "repeating_earnedxp_-LoKrRWIdXcMWg5A95Zy_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-LoKrRWGv_lLnxhketFa"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LoLtBWP65lDlQwR90rf"
            },
            {
                name: "repeating_earnedxpright_-LoZBXteanfysoKkjm43_xp_award",
                current: 2,
                max: "",
                id: "-Lo_BXtaCVcF-mo0Bmct"
            },
            {
                name: "repeating_earnedxpright_-LoZBXteanfysoKkjm43_xp_session",
                current: "Thirty",
                max: "",
                id: "-Lo_BXtj9fYvWzq1Y4_Q"
            },
            {
                name: "repeating_earnedxpright_-LoZBXteanfysoKkjm43_xp_reason",
                current: "NPC Creation: Carlita",
                max: "",
                id: "-Lo_BXtr9NcugcUV6B3M"
            },
            {
                name: "repeating_earnedxpright_-LtvwTSWonGuZWmZLgmv_xp_award",
                current: 2,
                max: "",
                id: "-LtvwTSPfi7ibq3K7BhV"
            },
            {
                name: "repeating_earnedxpright_-LtvwTSWonGuZWmZLgmv_xp_session",
                current: "Thirty",
                max: "",
                id: "-LtvwTSRW5ZHNqbfdToo"
            },
            {
                name: "repeating_earnedxpright_-LtvwTSWonGuZWmZLgmv_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LtvwTSU7ws-DwHGW-0C"
            },
            {
                name: "repeating_earnedxp_-LtvwTT7jhAowEss8gWx_xp_award",
                current: 2,
                max: "",
                id: "-LtvwTT-83Jd1SV7uSue"
            },
            {
                name: "repeating_earnedxp_-LtvwTT7jhAowEss8gWx_xp_session",
                current: "Fifteen",
                max: "",
                id: "-LtvwTT3o8a3L5wZG9c9"
            },
            {
                name: "repeating_earnedxp_-LtvwTT7jhAowEss8gWx_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-LtvwTT5NGJROhicVxqU"
            },
            {
                name: "repeating_earnedxpright_-LtvwdWKNqYGgiBp1RRo_xp_award",
                current: 1,
                max: "",
                id: "-LtvwdWC0b1gqCxkzijt"
            },
            {
                name: "repeating_earnedxpright_-LtvwdWKNqYGgiBp1RRo_xp_session",
                current: "Thirty-One",
                max: "",
                id: "-LtvwdWGCYJfsvzVLfnE"
            },
            {
                name: "repeating_earnedxpright_-LtvwdWKNqYGgiBp1RRo_xp_reason",
                current: "Playing Cardinal Collins",
                max: "",
                id: "-LtvwdWIvxT5FqevjOvq"
            },
            {
                name: "repeating_earnedxpright_-Ltvwkm-62dE1JoAfVla_xp_award",
                current: 2,
                max: "",
                id: "-LtvwkltNvL0a660LU0u"
            },
            {
                name: "repeating_earnedxpright_-Ltvwkm-62dE1JoAfVla_xp_session",
                current: "Thirty-One",
                max: "",
                id: "-LtvwklwKP-zVrUTEPF_"
            },
            {
                name: "repeating_earnedxpright_-Ltvwkm-62dE1JoAfVla_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LtvwklysAgqUsxcoosC"
            },
            {
                name: "repeating_earnedxp_-LtvwkmdPRafElEGeJcj_xp_award",
                current: 2,
                max: "",
                id: "-LtvwkmWpncHrG1E-uPc"
            },
            {
                name: "repeating_earnedxp_-LtvwkmdPRafElEGeJcj_xp_session",
                current: "Fifteen",
                max: "",
                id: "-LtvwkmZPrM0qbPBoMkh"
            },
            {
                name: "repeating_earnedxp_-LtvwkmdPRafElEGeJcj_xp_reason",
                current: "Being vampires!",
                max: "",
                id: "-Ltvwkma5F3teWVnVnVS"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_category",
                current: "Skill",
                max: "",
                id: "-Ltw3uPWM2OmGH97nmax"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-Ltw3uTUMvTQhG80cq1W"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-Ltw3uTZr915Dq8mSez5"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_new_toggle",
                current: 1,
                max: "",
                id: "-Ltw3uTeXdTf9BHVMEfX"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-Ltw3uTjWFe7AWhJnBZu"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_trait",
                current: "Science 4",
                max: "",
                id: "-Ltw3w2jXY9Vu8e-41Vo"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_cost",
                current: 12,
                max: "",
                id: "-Ltw3w5w4lNDOPafbih3"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_initial",
                current: "3",
                max: "",
                id: "-Ltw3wN_fMdLfGMI7_Xv"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_new",
                current: "4",
                max: "",
                id: "-Ltw3wq3EGElKnnBvmGw"
            },
            {
                name: "repeating_earnedxpright_-LtwWxs5LddvE07tC9yx_xp_award",
                current: 2,
                max: "",
                id: "-LtwWxryTddml90QNfae"
            },
            {
                name: "repeating_earnedxpright_-LtwWxs5LddvE07tC9yx_xp_session",
                current: "Thirty-Two",
                max: "",
                id: "-LtwWxs1q2tePlE65o-j"
            },
            {
                name: "repeating_earnedxpright_-LtwWxs5LddvE07tC9yx_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LtwWxs3Vyl8FzW7Uo9K"
            }
        ],
        27: [
            {
                name: "xp_summary",
                current: "206 XP Earned - 156 XP Spent =  50 XP Remaining",
                max: "",
                id: "-LU7dsfS20fV0ZfSn1gO"
            },
            {
                name: "repeating_earnedxp_-LOL0MvLYsuljyZCFymk_xp_award",
                current: "15",
                max: "",
                id: "-LU7dsfTOeGpyj3vduPs"
            },
            {
                name: "repeating_earnedxp_-LOL0MvLYsuljyZCFymk_xp_session",
                current: "Zero",
                max: "",
                id: "-LU7dsfU3R2T2spwB8Do"
            },
            {
                name: "repeating_earnedxp_-LOL0MvLYsuljyZCFymk_xp_reason",
                current: "Initial XP awarded at the beginning of the Chronicle.",
                max: "",
                id: "-LU7dsfVkJbPIJ_AULQI"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_category",
                current: "Clan Discipline",
                max: "",
                id: "-LU7dsg65B78RevMdfgF"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_trait",
                current: "Auspex",
                max: "",
                id: "-LU7dsgBCaxyUWZSmYxS"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_cost",
                current: 10,
                max: "",
                id: "-LU7dsgBCaxyUWZSmYxT"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_initial",
                current: "1",
                max: "",
                id: "-LU7dsgCOeusF4xqj-Er"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_new",
                current: "2",
                max: "",
                id: "-LU7dsgDSFTywmIsd-UH"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_category",
                current: "Advantage",
                max: "",
                id: "-LU7dsgE1g-ZcqaSs3T5"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_initial",
                current: "1",
                max: "",
                id: "-LU7dsgKwRm4CizlXOgL"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_new",
                current: "2",
                max: "",
                id: "-LU7dsgKwRm4CizlXOgM"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_trait",
                current: "Contacts (Pharma)",
                max: "",
                id: "-LU7dsgLQNtgCBtkxE5K"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_cost",
                current: 3,
                max: "",
                id: "-LU7dsgN1U_lCGqVcjXf"
            },
            {
                name: "repeating_earnedxp_-LOaOePNOjwmn9CW4oWY_xp_award",
                current: "1",
                max: "",
                id: "-LU7dsgSWCLOyRsMBRgZ"
            },
            {
                name: "repeating_earnedxp_-LOaOePNOjwmn9CW4oWY_xp_session",
                current: "Zero",
                max: "",
                id: "-LU7dsgTvwZyuVyVIKFo"
            },
            {
                name: "repeating_earnedxp_-LOaOePNOjwmn9CW4oWY_xp_reason",
                current: "Creating a relationship hook with Ava Wong, Jo's character.",
                max: "",
                id: "-LU7dsgUp-HAuSj8WEXb"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_category",
                current: "Advantage",
                max: "",
                id: "-LU7dsgb2xsXU_GgWYM7"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_trait",
                current: "Herd (Field Clinic)",
                max: "",
                id: "-LU7dsggjBc6iL4RCRL2"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_cost",
                current: 6,
                max: "",
                id: "-LU7dsgh_l4mYMwRQVOM"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_new",
                current: "2",
                max: "",
                id: "-LU7dsgiSKNG6GABne89"
            },
            {
                name: "repeating_earnedxp_-LPOmiZY-6Q2SB8AQJM3_xp_award",
                current: "4",
                max: "",
                id: "-LU7dsgzdz2k03LFmc-J"
            },
            {
                name: "repeating_earnedxp_-LPOmiZY-6Q2SB8AQJM3_xp_session",
                current: "One",
                max: "",
                id: "-LU7dsh-vXsqmVu0ya-r"
            },
            {
                name: "repeating_earnedxp_-LPOmiZY-6Q2SB8AQJM3_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LU7dsh-vXsqmVu0ya-s"
            },
            {
                name: "repeating_earnedxp_-LPqtifvc9bwzYpsuJ1E_xp_award",
                current: "9",
                max: "",
                id: "-LU7dsh20g95XujQISZm"
            },
            {
                name: "repeating_earnedxp_-LPqtifvc9bwzYpsuJ1E_xp_session",
                current: "Zero",
                max: "",
                id: "-LU7dsh49rRPOBaaYZVw"
            },
            {
                name: "repeating_earnedxp_-LPqtifvc9bwzYpsuJ1E_xp_reason",
                current: "Completing character sheet by the Thursday deadline..",
                max: "",
                id: "-LU7dsh5zLm2FK9bISAV"
            },
            {
                name: "_reporder_repeating_earnedxp",
                current: "-LOL0MvLYsuljyZCFymk,-LOaOePNOjwmn9CW4oWY,-LPOmiZY-6Q2SB8AQJM3,-LPqtifvc9bwzYpsuJ1E,-LQi-2PfA4iwP7T7FFzt,-LQi-J171uzZXnC-vewh,-LRuzhHXwCUYV11KaaRK,-LRuziGli9eaOsLceHIK,-LVaIa8cnzXhum3lscuA,-LVaUKCH8TkCB8LFBooF,-LWiZi6KpdjLcOZCbaEr,-LXqZadBzvNwHnZYVjSJ,-LYxynFLlUntenrPS096,-LZ5sM79KlGe1HsFHZ2Q,-LZebfVoomwhK3XT9ySl,-LaDZU7-WlQ8HINIY4n4,-LaJFzzQTdwQ7oBqAZxI,-LcTot98UDVjxP7TtFvp,-LfnNrdt2tIZesVzbVcg,-Lfr67XLUkO-SkkBZdJo,-LgQ6z3as9GpFCbjpUj0,-LigHrgA9V07wM4lWHam,-LjltnC3p9FqCfZD5tNJ,-LjnG66NboEtrmwVaKoq,-LjnOWqutTVfJX2RLYXV,-Ljodc6N8qIcdweBNiPc",
                max: "",
                id: "-LU7dsh6HHew8O2CJ1Oq"
            },
            {
                name: "repeating_earnedxp_-LQi-2PfA4iwP7T7FFzt_xp_award",
                current: "2",
                max: "",
                id: "-LU7dsi4LQiQ-BfVekWV"
            },
            {
                name: "repeating_earnedxp_-LQi-2PfA4iwP7T7FFzt_xp_session",
                current: "Two",
                max: "",
                id: "-LU7dsi5MCKNYf7Ff2ti"
            },
            {
                name: "repeating_earnedxp_-LQi-2PfA4iwP7T7FFzt_xp_reason",
                current: "Three Troubled Thin-Bloods: Story completion award.",
                max: "",
                id: "-LU7dsi7-0sCgAbrOxuf"
            },
            {
                name: "repeating_earnedxp_-LQi-J171uzZXnC-vewh_xp_award",
                current: "5",
                max: "",
                id: "-LU7dsi8Su9MeDOz5xFm"
            },
            {
                name: "repeating_earnedxp_-LQi-J171uzZXnC-vewh_xp_session",
                current: "Two",
                max: "",
                id: "-LU7dsi8Su9MeDOz5xFn"
            },
            {
                name: "repeating_earnedxp_-LQi-J171uzZXnC-vewh_xp_reason",
                current: "Excellent Loresheet for Netchurch.",
                max: "",
                id: "-LU7dsiA_oBXO79dZGJh"
            },
            {
                name: "xp_earnedtotal",
                current: 206,
                max: "",
                id: "-LU7dsiC3A8UvJY9Cp0_"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_category",
                current: "Advantage",
                max: "",
                id: "-LU7dsiEfKr6snYfoQVb"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_trait",
                current: "Mask (John  Nate)",
                max: "",
                id: "-LU7dsiI1-Q0jyG_vvCj"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_cost",
                current: 6,
                max: "",
                id: "-LU7dsiK4o70oLvQy0e3"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_new",
                current: "2",
                max: "",
                id: "-LU7dsiK4o70oLvQy0e4"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_category",
                current: "Advantage",
                max: "",
                id: "-LU7dsiMEqNHwldkjukn"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_new",
                current: "1",
                max: "",
                id: "-LU7dsiRXkLPqKUHepgq"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_trait",
                current: "Loresheet (Newchurch)",
                max: "",
                id: "-LU7dsiSfQVyOFXI8dhL"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_cost",
                current: 3,
                max: "",
                id: "-LU7dsiT8j81f1UwutdK"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_category",
                current: "Skill",
                max: "",
                id: "-LU7dsiUJn4qVdb2NiTb"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_trait",
                current: "Etiquette",
                max: "",
                id: "-LU7dsi_tMrvLJ-TvJI3"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_cost",
                current: 6,
                max: "",
                id: "-LU7dsibpVJRHCse_1Fd"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_initial",
                current: "1",
                max: "",
                id: "-LU7dsicdwymwHnMheLi"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_new",
                current: "2",
                max: "",
                id: "-LU7dsidqunFZghJHr2h"
            },
            {
                name: "repeating_earnedxp_-LRuzhHXwCUYV11KaaRK_xp_award",
                current: "2",
                max: "",
                id: "-LU7dsikmIhegvzBOP6e"
            },
            {
                name: "repeating_earnedxp_-LRuzhHXwCUYV11KaaRK_xp_session",
                current: "Two",
                max: "",
                id: "-LU7dsimDxL1HctsLEsP"
            },
            {
                name: "repeating_earnedxp_-LRuzhHXwCUYV11KaaRK_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LU7dsincl0X13iLrapW"
            },
            {
                name: "repeating_earnedxp_-LRuziGli9eaOsLceHIK_xp_award",
                current: "2",
                max: "",
                id: "-LU7dsincl0X13iLrapX"
            },
            {
                name: "repeating_earnedxp_-LRuziGli9eaOsLceHIK_xp_session",
                current: "Three",
                max: "",
                id: "-LU7dsip77G68eB-CcQ8"
            },
            {
                name: "repeating_earnedxp_-LRuziGli9eaOsLceHIK_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LU7dsirpLUrpZQrNkhg"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_category",
                current: "Skill",
                max: "",
                id: "-LU7dsjYK1rTdQPBYuaY"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_trait",
                current: "Intimidate",
                max: "",
                id: "-LU7dsjdDciAuI5GkOEp"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_cost",
                current: 3,
                max: "",
                id: "-LU7dsjeL5oJmluaj97W"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_new",
                current: "1",
                max: "",
                id: "-LU7dsjfA76W8xOAXO14"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_category",
                current: "Advantage",
                max: "",
                id: "-LU7dsjhkGxyRupA50F9"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_trait",
                current: "Herd (Bookies)",
                max: "",
                id: "-LU7dsjnymOoJa1zTmtf"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_cost",
                current: 9,
                max: "",
                id: "-LU7dsjoESYSD0iSp4k-"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_new",
                current: "3",
                max: "",
                id: "-LU7dsjoESYSD0iSp4k0"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LU7dsk8Q3vUQRRfcs5D"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LU7dsk9ehE62NSNlU5n"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LU7dskAIYma6A2g2aI5"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LU7dskAIYma6A2g2aI6"
            },
            {
                name: "repeating_spentxp_-LOaLKRRBwYLz4EGdCWa_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LU7dskCzmlfYGDlMuKn"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LU7dskDfBpSGoqnqDyY"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LU7dskEk49SZtcoouXE"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LU7dskFczQG6FqKA7hC"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LU7dskGglgmOmTIxQ4j"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LU7dskH_2nARamCKY_n"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LU7dskIC5-zPyXJEpFd"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LU7dskJYBr1IR9Z0X7I"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LU7dskKv4ViLEoyHtdt"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LU7dskLPpKWfkzuOfdP"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LU7dskM1Zrlt0Y4dZV7"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LU7dskOHtRiMD34RzHr"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LU7dskOHtRiMD34RzHs"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LU7dskPKwucHV02a73a"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LU7dskQAMCfoGNlT-A0"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LU7dskSBBxQbVB5R6WQ"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LU7dskSBBxQbVB5R6WR"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LU7dskTAmkLWXyM8PtR"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LU7dskV1vfDz5kPn-p8"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LU7dskV1vfDz5kPn-p9"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LU7dskXRSgyVDiG3gpr"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LU7dskXRSgyVDiG3gps"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LU7dskZ4ym3FbegJQZs"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LU7dsk_5dJKmaTtRGT4"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LU7dskaun2kTMYuOe9_"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LU7dskczmNnaAqcD-yZ"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LU7dskczmNnaAqcD-y_"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LU7dskeCbiowJSD2_rV"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LU7dskfz4HOm0cFTYsg"
            },
            {
                name: "repeating_spentxp_-LOaLRdJZb62plNm2LGK_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LU7dskgaYdFTlovs3PK"
            },
            {
                name: "repeating_spentxp_-LOipUBMR4NWs3k5GEMN_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LU7dskig4XsQc6LW9on"
            },
            {
                name: "repeating_spentxp_-LRdS35zqTQZQSURSm0W_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LU7dskig4XsQc6LW9oo"
            },
            {
                name: "repeating_spentxp_-LRdSaN5g-7rXous9qKE_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LU7dskjH3JWxc3-5iua"
            },
            {
                name: "repeating_spentxp_-LRdSoczJpI7MPcxJSPg_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LU7dskkZA-Xr9sCQTRi"
            },
            {
                name: "repeating_spentxp_-LTL-ZtVHOqFSwj8w35j_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LU7dskmiu_-W4Cpgm1T"
            },
            {
                name: "repeating_spentxp_-LTL-dsRy3hS1eV9-Dvs_xp_spent_toggle",
                current: "0",
                max: "",
                id: "-LV0qHb-CYsiA84QpmAY"
            },
            {
                name: "repeating_earnedxp_-LOL0MvLYsuljyZCFymk_sorttrigger",
                current: false,
                max: "",
                id: "-LVEAPQXrE1zbcZHbst0"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_category",
                current: "Advantage",
                max: "",
                id: "-LV_mITqc93u0_eotwkV"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LV_mIWqN9eJumY9jsw0"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LV_mIWtKlnKwX0CUXcY"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LV_mIWuKsHGZRwh4f2C"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LV_mIWx28i-itiFKNqE"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_trait",
                current: "Loresheet (Newchurch)",
                max: "",
                id: "-LV_mMTgFxoX83D8tpLv"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_cost",
                current: 12,
                max: "",
                id: "-LV_mMW6AKRWITCDShQi"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_new",
                current: "4",
                max: "",
                id: "-LV_mMiQpp-1cjoO0dYc"
            },
            {
                name: "repeating_earnedxp_-LVaIa8cnzXhum3lscuA_xp_award",
                current: "1",
                max: "",
                id: "-LVaIa8W73iarDbF1qat"
            },
            {
                name: "repeating_earnedxp_-LVaIa8cnzXhum3lscuA_xp_session",
                current: "Three",
                max: "",
                id: "-LVaIa8YhtTEmK6nls1G"
            },
            {
                name: "repeating_earnedxp_-LVaIa8cnzXhum3lscuA_xp_reason",
                current: "Playing NPCs during Memoriam.",
                max: "",
                id: "-LVaIa8Z8Ug0M6WDL401"
            },
            {
                name: "repeating_earnedxp_-LVaUKCH8TkCB8LFBooF_xp_award",
                current: "1",
                max: "",
                id: "-LVaUKCANb4qp5STF4Xt"
            },
            {
                name: "repeating_earnedxp_-LVaUKCH8TkCB8LFBooF_xp_session",
                current: "Four",
                max: "",
                id: "-LVaUKCCvYSuYsON_F9G"
            },
            {
                name: "repeating_earnedxp_-LVaUKCH8TkCB8LFBooF_xp_reason",
                current: "Session XP award (albeit smaller, given the short session).",
                max: "",
                id: "-LVaUKCDh-G4Pny5J3UE"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_category",
                current: "Advantage",
                max: "",
                id: "-LWhp-8Z0z7VL715DHLx"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LWhp-B17gx45ilyEH6M"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LWhp-B4GadFXeVnSn5-"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LWhp-B7tCOPxYJRKrPF"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LWhp-B9R2E_suqwxfKd"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_trait",
                current: "Mawla",
                max: "",
                id: "-LWhp1a3OX9T86rUmxsl"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_cost",
                current: 3,
                max: "",
                id: "-LWhp1cL0LvmYSRdUarj"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_initial",
                current: "3",
                max: "",
                id: "-LWhp1olXXjgx5EAuQ_l"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_new",
                current: "4",
                max: "",
                id: "-LWhp2C361HWrKWTl1jz"
            },
            {
                name: "repeating_spentxp_-LWhozCSF8j9IDqUmJQd_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LWhp2s3_pmQ4-qJvvXt"
            },
            {
                name: "repeating_earnedxp_-LWiZi6KpdjLcOZCbaEr_xp_award",
                current: "2",
                max: "",
                id: "-LWiZi6HVVI0Tpv4xX3k"
            },
            {
                name: "repeating_earnedxp_-LWiZi6KpdjLcOZCbaEr_xp_session",
                current: "Five",
                max: "",
                id: "-LWiZi6JmXPD1lUAStjt"
            },
            {
                name: "repeating_earnedxp_-LWiZi6KpdjLcOZCbaEr_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LWiZi6KeH_5iisHwvPN"
            },
            {
                name: "repeating_earnedxp_-LXqZadBzvNwHnZYVjSJ_xp_award",
                current: "2",
                max: "",
                id: "-LXq_ad4X8uvHIXKJKuH"
            },
            {
                name: "repeating_earnedxp_-LXqZadBzvNwHnZYVjSJ_xp_session",
                current: "Six",
                max: "",
                id: "-LXq_ad63ZTDUT-9v42T"
            },
            {
                name: "repeating_earnedxp_-LXqZadBzvNwHnZYVjSJ_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LXq_ad8V6D2_S4w9nK6"
            },
            {
                name: "repeating_earnedxp_-LYxynFLlUntenrPS096_xp_award",
                current: "1",
                max: "",
                id: "-LYxynFHhgbamzr3XpWf"
            },
            {
                name: "repeating_earnedxp_-LYxynFLlUntenrPS096_xp_session",
                current: "Six",
                max: "",
                id: "-LYxynFJAuvWkXaWsQjP"
            },
            {
                name: "repeating_earnedxp_-LYxynFLlUntenrPS096_xp_reason",
                current: "Roleplaying an NPC in Ava's Memoriam",
                max: "",
                id: "-LYxynFKLPTy83DwciR1"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_category",
                current: "Attribute",
                max: "",
                id: "-LYyAOZ3JM8VsKmb08m4"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LYyAOcZvyjKsarDr4GE"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LYyAOcb3ivmAGdiHuk1"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LYyAOcePFw-7Gfs29Uh"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LYyAOchCS1v2E-CYrwh"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_trait",
                current: "Intelligence",
                max: "",
                id: "-LYyAQFgKjNd1u1843AS"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_cost",
                current: 20,
                max: "",
                id: "-LYyAQINp2oUIGrmccyP"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_initial",
                current: "3",
                max: "",
                id: "-LYyAQzbfl_frsI39IlW"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_new",
                current: "4",
                max: "",
                id: "-LYyARVhI7Z9H-hsrdAF"
            },
            {
                name: "repeating_spentxp_-LYyANiuyhrlaA1Y7G1R_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LYypmjhYMQ1tUEIWADm"
            },
            {
                name: "repeating_earnedxp_-LZ5sM79KlGe1HsFHZ2Q_xp_award",
                current: "2",
                max: "",
                id: "-L_5sM73Y4YQbl_i1zN8"
            },
            {
                name: "repeating_earnedxp_-LZ5sM79KlGe1HsFHZ2Q_xp_session",
                current: "Seven",
                max: "",
                id: "-L_5sM74yWaL_ou_jUfI"
            },
            {
                name: "repeating_earnedxp_-LZ5sM79KlGe1HsFHZ2Q_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-L_5sM76M23950gK0yLy"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_category",
                current: "Clan Discipline",
                max: "",
                id: "-L_eHr2OnVtWWYD7VrtC"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-L_eHr7G1Y9BpUfB8jJl"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-L_eHr7Kq3LgLCySjMgQ"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_new_toggle",
                current: 1,
                max: "",
                id: "-L_eHr7NV18hh0tmQmay"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-L_eHr7QetqGGToT1KwI"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_trait",
                current: "Obfuscate 4 2 xp locked Requires BP 2",
                max: "",
                id: "-L_eHsoEM1XWOIXWo4Jp"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_cost",
                current: 20,
                max: "",
                id: "-L_eHsqkUp906P7Dg-2y"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_initial",
                current: "3",
                max: "",
                id: "-L_eHt5iUlribPPIAx5D"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_new",
                current: "4",
                max: "",
                id: "-L_eHtVPvUwrL3qJRNEH"
            },
            {
                name: "repeating_earnedxp_-LZebfVoomwhK3XT9ySl_xp_award",
                current: "3",
                max: "",
                id: "-L_ebfVhh0k3lk6FpS3I"
            },
            {
                name: "repeating_earnedxp_-LZebfVoomwhK3XT9ySl_xp_session",
                current: "Eight",
                max: "",
                id: "-L_ebfVjdejaYLDfhvBi"
            },
            {
                name: "repeating_earnedxp_-LZebfVoomwhK3XT9ySl_xp_reason",
                current: "Playing Alex the Lasombra during King's Memoriam, and playing him really, really, REALLY well.",
                max: "",
                id: "-L_ebfVkhicw9qbj-ZJU"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_category",
                current: "Advantage",
                max: "",
                id: "-LaDPW5RoMLmX_QcTpOv"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LaDPW9ny6wLrjfDBdVa"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LaDPW9qgrVtZE9viyu6"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LaDPW9tdPavOvV3E2Ax"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LaDPW9wJyveCW1WuORy"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_new",
                current: "1",
                max: "",
                id: "-LaDPXEVoSRc8Krw4KUp"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_trait",
                current: "Contacts The Aristocrat",
                max: "",
                id: "-LaDP_WzXtpQZAzrUN_R"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_cost",
                current: 3,
                max: "",
                id: "-LaDP_ZoyKMBWUAIo7kR"
            },
            {
                name: "repeating_spentxp_-LaDPUXGNfv90L0xsZ0D_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LaDPc5yf2SqfJdTuSTL"
            },
            {
                name: "repeating_earnedxp_-LaDZU7-WlQ8HINIY4n4_xp_award",
                current: "2",
                max: "",
                id: "-LaDZU6sxDM7vwsNlWvk"
            },
            {
                name: "repeating_earnedxp_-LaDZU7-WlQ8HINIY4n4_xp_session",
                current: "Eight",
                max: "",
                id: "-LaDZU6uHtl54V9K5jz4"
            },
            {
                name: "repeating_earnedxp_-LaDZU7-WlQ8HINIY4n4_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LaDZU6wiNPqLl6u0Qve"
            },
            {
                name: "repeating_earnedxp_-LaJFzzQTdwQ7oBqAZxI_xp_award",
                current: "9",
                max: "",
                id: "-LaJFzzJKQltzCvWoiJM"
            },
            {
                name: "repeating_earnedxp_-LaJFzzQTdwQ7oBqAZxI_xp_session",
                current: "Nine",
                max: "",
                id: "-LaJFzzLTk2zEpQDwpwl"
            },
            {
                name: "repeating_earnedxp_-LaJFzzQTdwQ7oBqAZxI_xp_reason",
                current: "Refund for lost Herd (Patients) Background",
                max: "",
                id: "-LaJFzzNUiZiwXDPPnYG"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_category",
                current: "Skill",
                max: "",
                id: "-Laaqmrn-eykvLsYMStY"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-Laaqmw1uGWDJY8NEKBi"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-Laaqmw5msEI1aBaO5ck"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_new_toggle",
                current: 1,
                max: "",
                id: "-Laaqmw8-S2DFaRtztx6"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LaaqmwBlu_c-P1dZh5d"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_trait",
                current: "Crafts",
                max: "",
                id: "-LaaqobO4oPGI69_OCF-"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_cost",
                current: 3,
                max: "",
                id: "-LaaqoeiFpY-nZiNa5Fo"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_new",
                current: "1",
                max: "",
                id: "-LaaqpNU8klQrPnacpPs"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_category",
                current: "Advantage",
                max: "",
                id: "-Laart91ZCLxtLHg4Of3"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_cost",
                current: 6,
                max: "",
                id: "-LaartD1DouSuykAxpEW"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LaartD4LL1drSi9gZg5"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LaartD6NJOcTqwVxhTY"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LaartD9MQtHbsUOMgLz"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_initial",
                current: "1",
                max: "",
                id: "-Laartc_4FXKJ2k4PBab"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_new",
                current: "3",
                max: "",
                id: "-LaarttxVbwWpedzr76j"
            },
            {
                name: "repeating_spentxp_-Laaqm0ZYo2-3jPmwnAk_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LaarvKGTt1UbC76zo7A"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_category",
                current: "Clan Discipline",
                max: "",
                id: "-LaatALtON0BbKb5-3UO"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LaatAPN-lcTrsKJGSHd"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LaatAPQXe12GsGHOWoY"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LaatAPThBoY3PZFny0t"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LaatAPWzNDqqQTRPAo8"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_trait",
                current: "Dominate",
                max: "",
                id: "-LaatBRSvBpZoaqSteYS"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_cost",
                current: 10,
                max: "",
                id: "-LaatBUauWBxLHdD1xFq"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_initial",
                current: "1",
                max: "",
                id: "-LaatBazhlasCZVk4DFR"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_new",
                current: "2",
                max: "",
                id: "-LaatBtS9o0-y68RUYJX"
            },
            {
                name: "repeating_spentxp_-Laat9YRzAJyyac3wEll_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LaatCPGpioj9QJJ3afH"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LamJ5_K6az5_x4xvLHd"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_trait",
                current: "Contacts (The Aristocrat)",
                max: "",
                id: "-LamJ9FF6zEvAhkQoN1k"
            },
            {
                name: "repeating_spentxp_-Laars8DEDz12BI4opac_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LamJ9GCj2mOTq0Ihlpe"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_category",
                current: "Advantage",
                max: "",
                id: "-Lam__YC1yv94KBczScd"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-Lam__arvQ17MXoQF1Y-"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-Lam__avM340SskSKf-V"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_new_toggle",
                current: 1,
                max: "",
                id: "-Lam__ayamMQ_RZFgvJa"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-Lam__b1BRV0mCueget8"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_new",
                current: "2",
                max: "",
                id: "-Lam_aWjATbj6FFmET37"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_trait",
                current: "Herd 2  (Mobile Clinic)",
                max: "",
                id: "-Lam_lBi5a-f2FbcjYjn"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_cost",
                current: 6,
                max: "",
                id: "-Lam_lExMpW6ARcdMAKl"
            },
            {
                name: "repeating_spentxp_-LamZZEZsLH9V4x2-1q7_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-Lam_lt0od-CfC8-EChZ"
            },
            {
                name: "repeating_spentxp_-LVZmEeaBHCO0YGJaWBa_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-Lbu5xVR-pXLHKFd0Ih4"
            },
            {
                name: "repeating_spentxp_-LZeHqQ8nruWFSCMw736_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LbuC7cUMRK-yQMDu8g1"
            },
            {
                name: "_reporder_repeating_spentxp",
                current: "-LOaLKRRBwYLz4EGdCWa,-LOaLRdJZb62plNm2LGK,-LOipUBMR4NWs3k5GEMN,-LRdS35zqTQZQSURSm0W,-LRdSaN5g-7rXous9qKE,-LRdSoczJpI7MPcxJSPg,-LTL-ZtVHOqFSwj8w35j,-LVZmEeaBHCO0YGJaWBa,-LWhozCSF8j9IDqUmJQd,-LYyANiuyhrlaA1Y7G1R,-LaDPUXGNfv90L0xsZ0D,-Laaqm0ZYo2-3jPmwnAk,-Laars8DEDz12BI4opac,-Laat9YRzAJyyac3wEll,-LamZZEZsLH9V4x2-1q7,-LZeHqQ8nruWFSCMw736,-LgPhkGn1g9HqIZpd8Bc,-LgPu8EKIrgJBgqoKBQZ,-Lmb09tDDqu5ImCOYogB,-Lmb0DsAHfcs5K6TZ5tH,-LoIZgujgFcUENp6XaBn,-Ltw3u0QNMdkBBroPKp0,-M4BiXLUw-nA3g7GogiJ,-MAxMS4tBgIagE41sa6c,-LTL-dsRy3hS1eV9-Dvs,-LyRLIe5rzPxOuPHuR8E,-MAxNEwOG3jYWCEFqlRh,-MC29xYSiwBVelh-I0nE",
                max: "",
                id: "-LbuDmslDp46AMhVHUAy"
            },
            {
                name: "repeating_earnedxp_-LcTot98UDVjxP7TtFvp_xp_award",
                current: "2",
                max: "",
                id: "-LcTot92Ywe58d-aYICO"
            },
            {
                name: "repeating_earnedxp_-LcTot98UDVjxP7TtFvp_xp_session",
                current: "Nine",
                max: "",
                id: "-LcTot96TmNHAKkE_28w"
            },
            {
                name: "repeating_earnedxp_-LcTot98UDVjxP7TtFvp_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LcTot99VXNvzWND9d_Y"
            },
            {
                name: "repeating_earnedxp_-LfnNrdt2tIZesVzbVcg_xp_award",
                current: "2",
                max: "",
                id: "-LfnNrdmgzKKjqFuQPhn"
            },
            {
                name: "repeating_earnedxp_-LfnNrdt2tIZesVzbVcg_xp_session",
                current: "Nine",
                max: "",
                id: "-LfnNrdrZWIMGOWwimCc"
            },
            {
                name: "repeating_earnedxp_-LfnNrdt2tIZesVzbVcg_xp_reason",
                current: "Scheer's Strike: Story completion award.",
                max: "",
                id: "-LfnNrdvkv4LaOiBWB_D"
            },
            {
                name: "_reporder_repeating_earnedxpright",
                current: "-LcTovNZ8XnpuNyvFnnm,-LcTovPBETC3Nx50A-ic,-LcTovQcTsYAZ3Goq91l,-LcTovRyOSTSUNeZYjIl,-LfnNrb3g2IpHPbvss23,-Lfr5Kli9kw5oo7qK2kp,-Lfr67TsoW4AcYz3yZuE,-LgPhoGYQVMHB0dQtlG3,-LgQ6z0-LEq3-YIEEDZ2,-LgQ7125wPQzDqnyY4r0,-LigID0vC6PRzpkH2yTi,-LigJJGg4UocCcY3nikh,-Ljltn7lAOIi7EZdBNQ7,-Ljoe69N3PFKw8rpggxm,-LjoeIlWFN2ChLqOVxV5,-LkvQPgPoKSnheOiDFoq,-LmCusV7l9ymS-5NKXoE,-LoIju1OFhVFMbYpmYRd,-LoKrRVMT6hIquIyoaeZ,-LoZBXteanfysoKkjm43,-LtvwTSWonGuZWmZLgmv,-LtvwdWKNqYGgiBp1RRo,-Ltvwkm-62dE1JoAfVla,-LtwWxs5LddvE07tC9yx,-LuVYjA7Fjs6oTzmNXSA,-LyGozzViXZXqrtrpljd,-LyRvkRe4VMcOP8vfqCU,-LzZIc7ZkSy6s5c4ndOE,-LzZIgVK2CiPK1Q75eOI,-M-HQ4RLcHBOyJrqFq-B,-Lz5Z07tZ8HvEzxAwu5q,-LzZvY2HwDMCZA1-fZcZ",
                max: "",
                id: "-LfnNrfCMyCNmW5eCSkK"
            },
            {
                name: "repeating_earnedxp_-Lfr67XLUkO-SkkBZdJo_xp_award",
                current: "2",
                max: "",
                id: "-Lfr67XDQfKfM9nTME6K"
            },
            {
                name: "repeating_earnedxp_-Lfr67XLUkO-SkkBZdJo_xp_session",
                current: "Ten",
                max: "",
                id: "-Lfr67XIjcPxxGB_ch_H"
            },
            {
                name: "repeating_earnedxp_-Lfr67XLUkO-SkkBZdJo_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-Lfr67XLK4u0rEyW1WQk"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_category",
                current: "Advantage",
                max: "",
                id: "-LgPhl8VwZWrQhfvPz30"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LgPhlYuySh-msc3M9qZ"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LgPhlZ0FCUFXt-9p2oh"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LgPhlZ4gFbGW6XrgAQa"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LgPhlZAYUTf0CMomQJt"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_new",
                current: "1",
                max: "",
                id: "-LgPhmIwj_TtZdvq2yFk"
            },
            {
                name: "repeating_earnedxpright_-LgPhoGYQVMHB0dQtlG3_xp_award",
                current: 2,
                max: "",
                id: "-LgPhoGQsdkdOaeGxJaI"
            },
            {
                name: "repeating_earnedxpright_-LgPhoGYQVMHB0dQtlG3_xp_session",
                current: "Twenty-Two",
                max: "",
                id: "-LgPhoGWQZIAKJh1hhXz"
            },
            {
                name: "repeating_earnedxpright_-LgPhoGYQVMHB0dQtlG3_xp_reason",
                current: "Refund for Haven Warding purchase",
                max: "",
                id: "-LgPhoGZENwvKqtTRZpT"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_trait",
                current: "Haven Warding Merit",
                max: "",
                id: "-LgPhoV7bwo2zhqe0X8y"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_cost",
                current: 3,
                max: "",
                id: "-LgPhoXY56C0V4gZQKh6"
            },
            {
                name: "repeating_spentxp_-LgPhkGn1g9HqIZpd8Bc_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LgPhonpCuImi4Ud3c5N"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_category",
                current: "Advantage",
                max: "",
                id: "-LgPu9ufkuSNKCXivRQj"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LgPu9zP8vWgQSk9WLAK"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LgPu9zZH8CFnSKJLLLQ"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LgPu9zdRJBglwxveFuf"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LgPu9zoj9aU-Us4z6t8"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_trait",
                current: "Loresheet (Netchurch)",
                max: "",
                id: "-LgPuDDH_6bKmL9yw4YH"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_cost",
                current: 6,
                max: "",
                id: "-LgPuDHIRa_rM8w8O_C-"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_new",
                current: "2",
                max: "",
                id: "-LgPuEIYmRXnBcF2Vao9"
            },
            {
                name: "repeating_spentxp_-LgPu8EKIrgJBgqoKBQZ_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LgPuyemGKgBy6N6LsmP"
            },
            {
                name: "repeating_earnedxpright_-LgQ6z0-LEq3-YIEEDZ2_xp_award",
                current: 1,
                max: "",
                id: "-LgQ6z-rP7AWGpp69ad0"
            },
            {
                name: "repeating_earnedxpright_-LgQ6z0-LEq3-YIEEDZ2_xp_session",
                current: "Twenty-Two",
                max: "",
                id: "-LgQ6z-xEUt6X_RQIAq_"
            },
            {
                name: "repeating_earnedxpright_-LgQ6z0-LEq3-YIEEDZ2_xp_reason",
                current: "RP: Little Character Moments",
                max: "",
                id: "-LgQ6z0-y8u0Chwu1Dxp"
            },
            {
                name: "repeating_earnedxp_-LgQ6z3as9GpFCbjpUj0_xp_award",
                current: "2",
                max: "",
                id: "-LgQ6z3S5-OF0Cb00P7q"
            },
            {
                name: "repeating_earnedxp_-LgQ6z3as9GpFCbjpUj0_xp_session",
                current: "Eleven",
                max: "",
                id: "-LgQ6z3ZhrB9A9U2CV90"
            },
            {
                name: "repeating_earnedxp_-LgQ6z3as9GpFCbjpUj0_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LgQ6z3cscZLLnerwh61"
            },
            {
                name: "repeating_earnedxpright_-LgQ7125wPQzDqnyY4r0_xp_award",
                current: 2,
                max: "",
                id: "-LgQ711x7F0QSePLCF_8"
            },
            {
                name: "repeating_earnedxpright_-LgQ7125wPQzDqnyY4r0_xp_session",
                current: "Twenty-Two",
                max: "",
                id: "-LgQ7122QiWEMUXNycjW"
            },
            {
                name: "repeating_earnedxpright_-LgQ7125wPQzDqnyY4r0_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-LgQ7126bOmElpjIUrVG"
            },
            {
                name: "repeating_earnedxp_-LigHrgA9V07wM4lWHam_xp_award",
                current: 2,
                max: "",
                id: "-LigHrg224xrFg8NuU8i"
            },
            {
                name: "repeating_earnedxp_-LigHrgA9V07wM4lWHam_xp_session",
                current: "Twelve",
                max: "",
                id: "-LigHrg6xQ0eiVLMUqG6"
            },
            {
                name: "repeating_earnedxp_-LigHrgA9V07wM4lWHam_xp_reason",
                current: "Brilliant montage idea",
                max: "",
                id: "-LigHrgA7LpGCPGMyUUs"
            },
            {
                name: "repeating_earnedxpright_-LigID0vC6PRzpkH2yTi_xp_award",
                current: 2,
                max: "",
                id: "-LigID0n4wMWRTRkP9bw"
            },
            {
                name: "repeating_earnedxpright_-LigID0vC6PRzpkH2yTi_xp_session",
                current: "Twenty-Three",
                max: "",
                id: "-LigID0t-i6Gsmwko8W_"
            },
            {
                name: "repeating_earnedxpright_-LigID0vC6PRzpkH2yTi_xp_reason",
                current: "Excellent RP and character development",
                max: "",
                id: "-LigID0wnYHujS3gbZ5C"
            },
            {
                name: "repeating_earnedxpright_-LigJJGg4UocCcY3nikh_xp_award",
                current: 2,
                max: "",
                id: "-LigJJGZJYklzwlA7aWQ"
            },
            {
                name: "repeating_earnedxpright_-LigJJGg4UocCcY3nikh_xp_session",
                current: "Twenty-Three",
                max: "",
                id: "-LigJJGc1pVyr-BNd3V7"
            },
            {
                name: "repeating_earnedxpright_-LigJJGg4UocCcY3nikh_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LigJJGfo5iSROcberqJ"
            },
            {
                name: "repeating_earnedxpright_-Ljltn7lAOIi7EZdBNQ7_xp_award",
                current: 2,
                max: "",
                id: "-Ljltn7fF3Daj1TBdZea"
            },
            {
                name: "repeating_earnedxpright_-Ljltn7lAOIi7EZdBNQ7_xp_session",
                current: "Twenty-Four",
                max: "",
                id: "-Ljltn7n3min-9sL4hm1"
            },
            {
                name: "repeating_earnedxpright_-Ljltn7lAOIi7EZdBNQ7_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-Ljltn7tukaWdsEwKKvT"
            },
            {
                name: "repeating_earnedxpright_-Ljoe69N3PFKw8rpggxm_xp_award",
                current: 1,
                max: "",
                id: "-Ljoe69EFh0s1ejgZvfM"
            },
            {
                name: "repeating_earnedxpright_-Ljoe69N3PFKw8rpggxm_xp_session",
                current: "Twenty-Five",
                max: "",
                id: "-Ljoe69No6oyemQC5tzL"
            },
            {
                name: "repeating_earnedxpright_-Ljoe69N3PFKw8rpggxm_xp_reason",
                current: "Awesome Compulsion RP",
                max: "",
                id: "-Ljoe69UCQ3Mu3o-kq8X"
            },
            {
                name: "repeating_earnedxpright_-LjoeIlWFN2ChLqOVxV5_xp_award",
                current: 2,
                max: "",
                id: "-LjoeIlNpo-n9s59vYHC"
            },
            {
                name: "repeating_earnedxpright_-LjoeIlWFN2ChLqOVxV5_xp_session",
                current: "Twenty-Five",
                max: "",
                id: "-LjoeIlWlr884hmeBlvK"
            },
            {
                name: "repeating_earnedxpright_-LjoeIlWFN2ChLqOVxV5_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LjoeIldiVmTrk3-QJuu"
            },
            {
                name: "repeating_earnedxp_-LkCCiW1Ggw-lhIZZa8P_xp_award",
                current: 2,
                max: "",
                id: "-LkCCiVvkOqVfhOerSY7"
            },
            {
                name: "repeating_earnedxp_-LkCCiW1Ggw-lhIZZa8P_xp_session",
                current: "Twelve",
                max: "",
                id: "-LkCCiW-gNefPCLR-AH8"
            },
            {
                name: "repeating_earnedxp_-LkCCiW1Ggw-lhIZZa8P_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LkCCiW4cMwCf5TiM1ij"
            },
            {
                name: "repeating_earnedxp_-LkCCiXlavMTlRmj9nCw_xp_award",
                current: 2,
                max: "",
                id: "-LkCCiXdBisdtigAxENE"
            },
            {
                name: "repeating_earnedxp_-LkCCiXlavMTlRmj9nCw_xp_session",
                current: "Thirteen",
                max: "",
                id: "-LkCCiXjOSppOXDQWik2"
            },
            {
                name: "repeating_earnedxp_-LkCCiXlavMTlRmj9nCw_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-LkCCiXrqrEfFNxED9Ch"
            },
            {
                name: "repeating_earnedxpright_-LkvQPgPoKSnheOiDFoq_xp_award",
                current: 2,
                max: "",
                id: "-LkvQPgIRX4Gv6OWrVVB"
            },
            {
                name: "repeating_earnedxpright_-LkvQPgPoKSnheOiDFoq_xp_session",
                current: "Twenty-Six",
                max: "",
                id: "-LkvQPgOsjJAKRTob5t_"
            },
            {
                name: "repeating_earnedxpright_-LkvQPgPoKSnheOiDFoq_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LkvQPgRqFVCakbFxZtV"
            },
            {
                name: "repeating_earnedxpright_-LmCusV7l9ymS-5NKXoE_xp_award",
                current: 2,
                max: "",
                id: "-LmCusV3DjyW_wYgJfDl"
            },
            {
                name: "repeating_earnedxpright_-LmCusV7l9ymS-5NKXoE_xp_session",
                current: "Twenty-Seven",
                max: "",
                id: "-LmCusV8Ct8R-I_PSnKR"
            },
            {
                name: "repeating_earnedxpright_-LmCusV7l9ymS-5NKXoE_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LmCusVCKtEWgkZg5AuP"
            },
            {
                name: "repeating_earnedxp_-LmCusVu3it4WZPdANZz_xp_award",
                current: 1,
                max: "",
                id: "-LmCusVr8tC84t4_gzAn"
            },
            {
                name: "repeating_earnedxp_-LmCusVu3it4WZPdANZz_xp_session",
                current: "Thirteen",
                max: "",
                id: "-LmCusVzwD0h-bow1MaE"
            },
            {
                name: "repeating_earnedxp_-LmCusVu3it4WZPdANZz_xp_reason",
                current: "Engaging with the plot",
                max: "",
                id: "-LmCusW2f9tcwAbyE_5p"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_category",
                current: "Skill",
                max: "",
                id: "-Lmb0AawXEfl3boeN5WZ"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-Lmb0AfmHWIogVtYynu-"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-Lmb0AfsjyR72PnMq9RP"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_new_toggle",
                current: 1,
                max: "",
                id: "-Lmb0AfzdwIAttBZMUmn"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-Lmb0Ag4YgO9wBKxYbZc"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_trait",
                current: "Subterfuge",
                max: "",
                id: "-Lmb0CA538BcdzZYKBml"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_cost",
                current: 6,
                max: "",
                id: "-Lmb0CEApbZSktSRXDCQ"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_initial",
                current: "1",
                max: "",
                id: "-Lmb0CcNyTA1rv_wMWWQ"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_new",
                current: "2",
                max: "",
                id: "-Lmb0D35988EBCQMAmrw"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_category",
                current: "Clan Discipline",
                max: "",
                id: "-Lmb0FSuUwgSS4UCaQwt"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-Lmb0FWuZ0dQTZ6jQeNm"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-Lmb0FWzEhBYIu7PIJvY"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_new_toggle",
                current: 1,
                max: "",
                id: "-Lmb0FX3N7mkB53nCcRW"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-Lmb0FX75qdbv6-qzd5b"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_trait",
                current: "Dominate",
                max: "",
                id: "-Lmb0Gp1OE-1ic1fTnZh"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_cost",
                current: 10,
                max: "",
                id: "-Lmb0Gt-8EanYOYg4m0Z"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_initial",
                current: "1",
                max: "",
                id: "-Lmb0H6yQIZxUoQmJ0la"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_new",
                current: "2",
                max: "",
                id: "-Lmb0H_RyqPE-zrCrEk6"
            },
            {
                name: "repeating_spentxp_-Lmb09tDDqu5ImCOYogB_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-Lmb3b94YLyKwFvHJeCy"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_category",
                current: "Advantage",
                max: "",
                id: "-LoI_hznjHpsssXuQ6rY"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LoI_i3jb9pZMzPPTKOn"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LoI_i3pD6BdhWN1meoi"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LoI_i3tJuxOnBIsirQl"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LoI_i3xIypA44sazddo"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_trait",
                current: "Loresheet (Netchurch)",
                max: "",
                id: "-LoI_lNaKgmr9Xj1Yzm0"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_cost",
                current: 9,
                max: "",
                id: "-LoI_lRAgp63b9nMirHx"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_new",
                current: "3",
                max: "",
                id: "-LoI_lf4YJU0gDcpyHOB"
            },
            {
                name: "repeating_spentxp_-LoIZgujgFcUENp6XaBn_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LoI_mClyCNnMx6CwK1l"
            },
            {
                name: "repeating_earnedxpright_-LoIju1OFhVFMbYpmYRd_xp_award",
                current: 1,
                max: "",
                id: "-LoIju1KGlsWOFiSzMht"
            },
            {
                name: "repeating_earnedxpright_-LoIju1OFhVFMbYpmYRd_xp_session",
                current: "Twenty-Nine",
                max: "",
                id: "-LoIju1RnLV2vKR7ssW4"
            },
            {
                name: "repeating_earnedxpright_-LoIju1OFhVFMbYpmYRd_xp_reason",
                current: "Great RP as the baroness' lapdog",
                max: "",
                id: "-LoIju1WwoWujFukeD9P"
            },
            {
                name: "repeating_earnedxpright_-LoKrRVMT6hIquIyoaeZ_xp_award",
                current: 2,
                max: "",
                id: "-LoKrRVFWZPZFLO8O21c"
            },
            {
                name: "repeating_earnedxpright_-LoKrRVMT6hIquIyoaeZ_xp_session",
                current: "Twenty-Nine",
                max: "",
                id: "-LoKrRVYg77alGLaOEOw"
            },
            {
                name: "repeating_earnedxpright_-LoKrRVMT6hIquIyoaeZ_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LoKrRVaso4Y2oGS5xMg"
            },
            {
                name: "repeating_earnedxp_-LoKrRWIdXcMWg5A95Zy_xp_award",
                current: 2,
                max: "",
                id: "-LoKrRWAuWxCiP6dgZ0c"
            },
            {
                name: "repeating_earnedxp_-LoKrRWIdXcMWg5A95Zy_xp_session",
                current: "Fourteen",
                max: "",
                id: "-LoKrRWEkL7pjYUBB_1p"
            },
            {
                name: "repeating_earnedxp_-LoKrRWIdXcMWg5A95Zy_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-LoKrRWGv_lLnxhketFa"
            },
            {
                name: "repeating_spentxp_-Lmb0DsAHfcs5K6TZ5tH_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-LoLtBWP65lDlQwR90rf"
            },
            {
                name: "repeating_earnedxpright_-LoZBXteanfysoKkjm43_xp_award",
                current: 2,
                max: "",
                id: "-Lo_BXtaCVcF-mo0Bmct"
            },
            {
                name: "repeating_earnedxpright_-LoZBXteanfysoKkjm43_xp_session",
                current: "Thirty",
                max: "",
                id: "-Lo_BXtj9fYvWzq1Y4_Q"
            },
            {
                name: "repeating_earnedxpright_-LoZBXteanfysoKkjm43_xp_reason",
                current: "NPC Creation: Carlita",
                max: "",
                id: "-Lo_BXtr9NcugcUV6B3M"
            },
            {
                name: "repeating_earnedxpright_-LtvwTSWonGuZWmZLgmv_xp_award",
                current: 2,
                max: "",
                id: "-LtvwTSPfi7ibq3K7BhV"
            },
            {
                name: "repeating_earnedxpright_-LtvwTSWonGuZWmZLgmv_xp_session",
                current: "Thirty",
                max: "",
                id: "-LtvwTSRW5ZHNqbfdToo"
            },
            {
                name: "repeating_earnedxpright_-LtvwTSWonGuZWmZLgmv_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LtvwTSU7ws-DwHGW-0C"
            },
            {
                name: "repeating_earnedxp_-LtvwTT7jhAowEss8gWx_xp_award",
                current: 2,
                max: "",
                id: "-LtvwTT-83Jd1SV7uSue"
            },
            {
                name: "repeating_earnedxp_-LtvwTT7jhAowEss8gWx_xp_session",
                current: "Fifteen",
                max: "",
                id: "-LtvwTT3o8a3L5wZG9c9"
            },
            {
                name: "repeating_earnedxp_-LtvwTT7jhAowEss8gWx_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-LtvwTT5NGJROhicVxqU"
            },
            {
                name: "repeating_earnedxpright_-LtvwdWKNqYGgiBp1RRo_xp_award",
                current: 1,
                max: "",
                id: "-LtvwdWC0b1gqCxkzijt"
            },
            {
                name: "repeating_earnedxpright_-LtvwdWKNqYGgiBp1RRo_xp_session",
                current: "Thirty-One",
                max: "",
                id: "-LtvwdWGCYJfsvzVLfnE"
            },
            {
                name: "repeating_earnedxpright_-LtvwdWKNqYGgiBp1RRo_xp_reason",
                current: "Playing Cardinal Collins",
                max: "",
                id: "-LtvwdWIvxT5FqevjOvq"
            },
            {
                name: "repeating_earnedxpright_-Ltvwkm-62dE1JoAfVla_xp_award",
                current: 2,
                max: "",
                id: "-LtvwkltNvL0a660LU0u"
            },
            {
                name: "repeating_earnedxpright_-Ltvwkm-62dE1JoAfVla_xp_session",
                current: "Thirty-One",
                max: "",
                id: "-LtvwklwKP-zVrUTEPF_"
            },
            {
                name: "repeating_earnedxpright_-Ltvwkm-62dE1JoAfVla_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LtvwklysAgqUsxcoosC"
            },
            {
                name: "repeating_earnedxp_-LtvwkmdPRafElEGeJcj_xp_award",
                current: 2,
                max: "",
                id: "-LtvwkmWpncHrG1E-uPc"
            },
            {
                name: "repeating_earnedxp_-LtvwkmdPRafElEGeJcj_xp_session",
                current: "Fifteen",
                max: "",
                id: "-LtvwkmZPrM0qbPBoMkh"
            },
            {
                name: "repeating_earnedxp_-LtvwkmdPRafElEGeJcj_xp_reason",
                current: "Being vampires!",
                max: "",
                id: "-Ltvwkma5F3teWVnVnVS"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_category",
                current: "Skill",
                max: "",
                id: "-Ltw3uPWM2OmGH97nmax"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-Ltw3uTUMvTQhG80cq1W"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-Ltw3uTZr915Dq8mSez5"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_new_toggle",
                current: 1,
                max: "",
                id: "-Ltw3uTeXdTf9BHVMEfX"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-Ltw3uTjWFe7AWhJnBZu"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_trait",
                current: "Science 4",
                max: "",
                id: "-Ltw3w2jXY9Vu8e-41Vo"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_cost",
                current: 12,
                max: "",
                id: "-Ltw3w5w4lNDOPafbih3"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_initial",
                current: "3",
                max: "",
                id: "-Ltw3wN_fMdLfGMI7_Xv"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_new",
                current: "4",
                max: "",
                id: "-Ltw3wq3EGElKnnBvmGw"
            },
            {
                name: "repeating_earnedxpright_-LtwWxs5LddvE07tC9yx_xp_award",
                current: 2,
                max: "",
                id: "-LtwWxryTddml90QNfae"
            },
            {
                name: "repeating_earnedxpright_-LtwWxs5LddvE07tC9yx_xp_session",
                current: "Thirty-Two",
                max: "",
                id: "-LtwWxs1q2tePlE65o-j"
            },
            {
                name: "repeating_earnedxpright_-LtwWxs5LddvE07tC9yx_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LtwWxs3Vyl8FzW7Uo9K"
            },
            {
                name: "repeating_earnedxpright_-LuVYjA7Fjs6oTzmNXSA_xp_award",
                current: 2,
                max: "",
                id: "-LuVYjA0hZPepOdcz2Ic"
            },
            {
                name: "repeating_earnedxpright_-LuVYjA7Fjs6oTzmNXSA_xp_session",
                current: "Thirty-Three",
                max: "",
                id: "-LuVYjA4uulvNZP1Tqcj"
            },
            {
                name: "repeating_earnedxpright_-LuVYjA7Fjs6oTzmNXSA_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LuVYjACbiA5VBwLDu-U"
            },
            {
                name: "repeating_earnedxp_-LuVYjB2euZDJTy-ir0Z_xp_award",
                current: 2,
                max: "",
                id: "-LuVYjAxZpP4CWQkyf11"
            },
            {
                name: "repeating_earnedxp_-LuVYjB2euZDJTy-ir0Z_xp_session",
                current: "Sixteen",
                max: "",
                id: "-LuVYjB0dMpWEFBSzTwR"
            },
            {
                name: "repeating_earnedxp_-LuVYjB2euZDJTy-ir0Z_xp_reason",
                current: "FOR OBFUSCATE ONLY",
                max: "",
                id: "-LuVYjB3NyICwne2uWxu"
            },
            {
                name: "repeating_spentxp_-Ltw3u0QNMdkBBroPKp0_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-Lxe1H3GqJPyH9ayoxiT"
            },
            {
                name: "repeating_earnedxpright_-LyGozzViXZXqrtrpljd_xp_award",
                current: 2,
                max: "",
                id: "-LyGozzTnWCiOTi04KoV"
            },
            {
                name: "repeating_earnedxpright_-LyGozzViXZXqrtrpljd_xp_session",
                current: "Thirty-Four",
                max: "",
                id: "-LyGozzYqYy9RyGLzq2J"
            },
            {
                name: "repeating_earnedxpright_-LyGozzViXZXqrtrpljd_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LyGozzbGLxK7DeZnQDL"
            },
            {
                name: "repeating_spentxp_-LyRLIe5rzPxOuPHuR8E_xp_category",
                current: "Advantage",
                max: "",
                id: "-LyRLJwDw61gIeWxP1sg"
            },
            {
                name: "repeating_spentxp_-LyRLIe5rzPxOuPHuR8E_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-LyRLK-lZB73vekh6s5J"
            },
            {
                name: "repeating_spentxp_-LyRLIe5rzPxOuPHuR8E_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-LyRLK-r1VvAixtD0hwv"
            },
            {
                name: "repeating_spentxp_-LyRLIe5rzPxOuPHuR8E_xp_new_toggle",
                current: 1,
                max: "",
                id: "-LyRLK-xY8E28H7iArFL"
            },
            {
                name: "repeating_spentxp_-LyRLIe5rzPxOuPHuR8E_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-LyRLK02w4GuLZOVNUA6"
            },
            {
                name: "repeating_spentxp_-LyRLIe5rzPxOuPHuR8E_xp_trait",
                current: "Loresheet (Netchurch)",
                max: "",
                id: "-LyRLOWPXDKF_Ex0Apml"
            },
            {
                name: "repeating_spentxp_-LyRLIe5rzPxOuPHuR8E_xp_cost",
                current: 15,
                max: "",
                id: "-LyRLO_T4Z89Qo9jTAN7"
            },
            {
                name: "repeating_spentxp_-LyRLIe5rzPxOuPHuR8E_xp_new",
                current: "5",
                max: "",
                id: "-LyRLP0LHoM-mxg-F3rF"
            },
            {
                name: "repeating_earnedxpright_-LyRvkRe4VMcOP8vfqCU_xp_award",
                current: 2,
                max: "",
                id: "-LyRvkRXffrN4d2QItOp"
            },
            {
                name: "repeating_earnedxpright_-LyRvkRe4VMcOP8vfqCU_xp_session",
                current: "Thirty-Five",
                max: "",
                id: "-LyRvkRheHr26zpDTBNd"
            },
            {
                name: "repeating_earnedxpright_-LyRvkRe4VMcOP8vfqCU_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LyRvkRl1Rdcp_uri8d8"
            },
            {
                name: "repeating_earnedxp_-LyRvkSiU0a0YIAW9bQ8_xp_award",
                current: 2,
                max: "",
                id: "-LyRvkSaGlR1AhPce1Em"
            },
            {
                name: "repeating_earnedxp_-LyRvkSiU0a0YIAW9bQ8_xp_session",
                current: "Sixteen",
                max: "",
                id: "-LyRvkSfMySJimUEY5wg"
            },
            {
                name: "repeating_earnedxp_-LyRvkSiU0a0YIAW9bQ8_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-LyRvkSilTlQf4eVtT81"
            },
            {
                name: "repeating_earnedxpright_-Lz5Z07tZ8HvEzxAwu5q_xp_award",
                current: 2,
                max: "",
                id: "-Lz5_07kPxPVpERWjudK"
            },
            {
                name: "repeating_earnedxpright_-Lz5Z07tZ8HvEzxAwu5q_xp_session",
                current: "Thirty-Six",
                max: "",
                id: "-Lz5_07qPO-8drvW7MCo"
            },
            {
                name: "repeating_earnedxpright_-Lz5Z07tZ8HvEzxAwu5q_xp_reason",
                current: "Session XP Award.",
                max: "",
                id: "-Lz5_07uCXfakP9Jh76A"
            },
            {
                name: "repeating_earnedxpright_-LzZIc7ZkSy6s5c4ndOE_xp_award",
                current: -6,
                max: "",
                id: "-LzZIc7WqUkN5nT6gd7q"
            },
            {
                name: "repeating_earnedxpright_-LzZIc7ZkSy6s5c4ndOE_xp_session",
                current: "Thirty-Six",
                max: "",
                id: "-LzZIc7cG6Y78JWnS-Pw"
            },
            {
                name: "repeating_earnedxpright_-LzZIc7ZkSy6s5c4ndOE_xp_reason",
                current: "Resolving Flaw: Enemy.",
                max: "",
                id: "-LzZIc7gkQ5-iULFTK_u"
            },
            {
                name: "repeating_earnedxp_-LzZIcADSXXN5z3y7AFZ_xp_award",
                current: 2,
                max: "",
                id: "-LzZIcA71aNlW3GJ49Nz"
            },
            {
                name: "repeating_earnedxp_-LzZIcADSXXN5z3y7AFZ_xp_session",
                current: "Seventeen",
                max: "",
                id: "-LzZIcACeDRmye053qY5"
            },
            {
                name: "repeating_earnedxp_-LzZIcADSXXN5z3y7AFZ_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-LzZIcAFPTlWo3qpCG4g"
            },
            {
                name: "repeating_earnedxpright_-LzZIgVK2CiPK1Q75eOI_xp_award",
                current: 18,
                max: "",
                id: "-LzZIgVGsJyfgmVHePsI"
            },
            {
                name: "repeating_earnedxpright_-LzZIgVK2CiPK1Q75eOI_xp_session",
                current: "Thirty-Six",
                max: "",
                id: "-LzZIgVQC8FzTPYJhZ8M"
            },
            {
                name: "repeating_earnedxpright_-LzZIgVK2CiPK1Q75eOI_xp_reason",
                current: "Losing Allies: Bookies.",
                max: "",
                id: "-LzZIgVX4kNZbcc0KfHk"
            },
            {
                name: "repeating_earnedxpright_-LzZvY2HwDMCZA1-fZcZ_xp_award",
                current: 2,
                max: "",
                id: "-LzZvY2ABHC_SZqG2IvT"
            },
            {
                name: "repeating_earnedxpright_-LzZvY2HwDMCZA1-fZcZ_xp_session",
                current: "Thirty-Seven",
                max: "",
                id: "-LzZvY2DoWr8gXE32EK-"
            },
            {
                name: "repeating_earnedxpright_-LzZvY2HwDMCZA1-fZcZ_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-LzZvY2F3ko1g1GcnM6Y"
            },
            {
                name: "repeating_earnedxp_-LzZvY32hqS8nLS89IlR_xp_award",
                current: 2,
                max: "",
                id: "-LzZvY2wJ9vwPQUizuxN"
            },
            {
                name: "repeating_earnedxp_-LzZvY32hqS8nLS89IlR_xp_session",
                current: "Seventeen",
                max: "",
                id: "-LzZvY3-1HtjXbZ5lYtM"
            },
            {
                name: "repeating_earnedxp_-LzZvY32hqS8nLS89IlR_xp_reason",
                current: "The Vultures Circle",
                max: "",
                id: "-LzZvY31m5zLWSSYxZsd"
            },
            {
                name: "repeating_earnedxpright_-M-HQ4RLcHBOyJrqFq-B_xp_award",
                current: 9,
                max: "",
                id: "-M-HQ4RB_Zql3s8VwdqD"
            },
            {
                name: "repeating_earnedxpright_-M-HQ4RLcHBOyJrqFq-B_xp_session",
                current: "Thirty-Six",
                max: "",
                id: "-M-HQ4RG53N1nZSfDAmJ"
            },
            {
                name: "repeating_earnedxpright_-M-HQ4RLcHBOyJrqFq-B_xp_reason",
                current: "Loosing Herd: Bookies",
                max: "",
                id: "-M-HQ4RK4YQmeFMUs0cC"
            },
            {
                name: "repeating_spentxp_-LyRLIe5rzPxOuPHuR8E_xp_spent_toggle",
                current: "0",
                max: "",
                id: "-M-HQEhXI56LofAVSR7H"
            },
            {
                name: "repeating_earnedxp_-M-cZiiSEPZQ1OX1wH7H_xp_award",
                current: 20,
                max: "",
                id: "-M-cZiiMn84ZA5_X9q-k"
            },
            {
                name: "repeating_earnedxp_-M-cZiiSEPZQ1OX1wH7H_xp_session",
                current: "Eighteen",
                max: "",
                id: "-M-cZiiPMl3FGs5ju_4N"
            },
            {
                name: "repeating_earnedxp_-M-cZiiSEPZQ1OX1wH7H_xp_reason",
                current: "Award for 15 month time jump.",
                max: "",
                id: "-M-cZiiSiRmvWdMWLS6T"
            },
            {
                name: "repeating_earnedxpright_-M0GDgu1YZz4glMFeJ3D_xp_award",
                current: 2,
                max: "",
                id: "-M0GDgtzjPQJQruRlVuy"
            },
            {
                name: "repeating_earnedxpright_-M0GDgu1YZz4glMFeJ3D_xp_session",
                current: "Thirty-Eight",
                max: "",
                id: "-M0GDgu0NtlxoG6z78Vn"
            },
            {
                name: "repeating_earnedxpright_-M0GDgu1YZz4glMFeJ3D_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-M0GDgu2er3h0dWTKnRF"
            },
            {
                name: "repeating_earnedxpright_-M1OAdEJJOwnWUhJVGq4_xp_award",
                current: 2,
                max: "",
                id: "-M1OAdECFwCIBdrh86ZC"
            },
            {
                name: "repeating_earnedxpright_-M1OAdEJJOwnWUhJVGq4_xp_session",
                current: "Thirty-Nine",
                max: "",
                id: "-M1OAdEFPCjb7KyUGpeo"
            },
            {
                name: "repeating_earnedxpright_-M1OAdEJJOwnWUhJVGq4_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-M1OAdEIXHOJiBwNkpRd"
            },
            {
                name: "repeating_spentxp_-M4BiXLUw-nA3g7GogiJ_xp_category",
                current: "Blood Potency",
                max: "",
                id: "-M4BiY1latbtYO0qkuce"
            },
            {
                name: "repeating_spentxp_-M4BiXLUw-nA3g7GogiJ_xp_cost",
                current: 20,
                max: "",
                id: "-M4BiY6E4hwSXo97p6_-"
            },
            {
                name: "repeating_spentxp_-M4BiXLUw-nA3g7GogiJ_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-M4BiY6Jq__AcwSqyTx1"
            },
            {
                name: "repeating_spentxp_-M4BiXLUw-nA3g7GogiJ_xp_new_toggle",
                current: 1,
                max: "",
                id: "-M4BiY6Og5_PlpyIGkmQ"
            },
            {
                name: "repeating_spentxp_-M4BiXLUw-nA3g7GogiJ_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-M4BiY6To6gAgfrvRHVw"
            },
            {
                name: "repeating_spentxp_-M4BiXLUw-nA3g7GogiJ_xp_initial",
                current: "1",
                max: "",
                id: "-M4BiYdYxylN7oDbJ4yT"
            },
            {
                name: "repeating_spentxp_-M4BiXLUw-nA3g7GogiJ_xp_new",
                current: "2",
                max: "",
                id: "-M4BiZ19vpDmarMBnbD6"
            },
            {
                name: "repeating_earnedxpright_-M4BwgVrQyvoCgzj9UOb_xp_award",
                current: 2,
                max: "",
                id: "-M4BwgVnptJphRq3iv2u"
            },
            {
                name: "repeating_earnedxpright_-M4BwgVrQyvoCgzj9UOb_xp_session",
                current: "Forty",
                max: "",
                id: "-M4BwgVsfswVutkNuZQw"
            },
            {
                name: "repeating_earnedxpright_-M4BwgVrQyvoCgzj9UOb_xp_reason",
                current: "RPing Drug Addiction",
                max: "",
                id: "-M4BwgVu98egNg2-OG5L"
            },
            {
                name: "repeating_earnedxp_-M4BwgWfnAGtZ1NPqrjD_xp_award",
                current: 2,
                max: "",
                id: "-M4BwgWb04bwHz8UG7xs"
            },
            {
                name: "repeating_earnedxp_-M4BwgWfnAGtZ1NPqrjD_xp_session",
                current: "Eighteen",
                max: "",
                id: "-M4BwgWdU9MvtZhsU7ub"
            },
            {
                name: "repeating_earnedxp_-M4BwgWfnAGtZ1NPqrjD_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-M4BwgWfqrq4rqKs2-dr"
            },
            {
                name: "repeating_earnedxpright_-M4CPrmfZZ6G3fnXapvL_xp_award",
                current: 2,
                max: "",
                id: "-M4CPrmbu2mJza5V2F_7"
            },
            {
                name: "repeating_earnedxpright_-M4CPrmfZZ6G3fnXapvL_xp_session",
                current: "Forty",
                max: "",
                id: "-M4CPrmdJzJFjv7N8e1i"
            },
            {
                name: "repeating_earnedxpright_-M4CPrmfZZ6G3fnXapvL_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-M4CPrmfyVlXTBGau0GO"
            },
            {
                name: "repeating_earnedxpright_-M5KQYZkC00kYZ4dhrZ7_xp_award",
                current: 2,
                max: "",
                id: "-M5KQY_auw9sb49jD8PE"
            },
            {
                name: "repeating_earnedxpright_-M5KQYZkC00kYZ4dhrZ7_xp_session",
                current: "Forty-One",
                max: "",
                id: "-M5KQY_eu3y8FXoY7lGp"
            },
            {
                name: "repeating_earnedxpright_-M5KQYZkC00kYZ4dhrZ7_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-M5KQY_hD6gVDhcrC04F"
            },
            {
                name: "repeating_earnedxp_-M5KQYag3xUDpR8bwD-w_xp_award",
                current: 2,
                max: "",
                id: "-M5KQYaXdMX4zP-JhV27"
            },
            {
                name: "repeating_earnedxp_-M5KQYag3xUDpR8bwD-w_xp_session",
                current: "Nineteen",
                max: "",
                id: "-M5KQYaamMrOTT8AbvEe"
            },
            {
                name: "repeating_earnedxp_-M5KQYag3xUDpR8bwD-w_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-M5KQYadCLaVL0qNiEZM"
            },
            {
                name: "repeating_earnedxpright_-M5tVKgWfXGtJz4NowPc_xp_award",
                current: 2,
                max: "",
                id: "-M5tVKgOrlbsHfj9gCmz"
            },
            {
                name: "repeating_earnedxpright_-M5tVKgWfXGtJz4NowPc_xp_session",
                current: "Forty-Two",
                max: "",
                id: "-M5tVKgSMqjn6DOy2s7s"
            },
            {
                name: "repeating_earnedxpright_-M5tVKgWfXGtJz4NowPc_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-M5tVKgVdALsrHIGE8N4"
            },
            {
                name: "repeating_earnedxp_-M5tVKhMUY6JXXsZwZMs_xp_award",
                current: 2,
                max: "",
                id: "-M5tVKhFC3f3izbXsAhG"
            },
            {
                name: "repeating_earnedxp_-M5tVKhMUY6JXXsZwZMs_xp_session",
                current: "Twenty",
                max: "",
                id: "-M5tVKhLxY3FRDdsmOQb"
            },
            {
                name: "repeating_earnedxp_-M5tVKhMUY6JXXsZwZMs_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-M5tVKhOgXLRKTpLJ8l4"
            },
            {
                name: "repeating_earnedxpright_-M6SWKhpjh6dnYQ7LrZJ_xp_award",
                current: 2,
                max: "",
                id: "-M6SWKhhG1-87NtY5tOV"
            },
            {
                name: "repeating_earnedxpright_-M6SWKhpjh6dnYQ7LrZJ_xp_session",
                current: "Forty-Three",
                max: "",
                id: "-M6SWKhkxqzoylZ_ud5T"
            },
            {
                name: "repeating_earnedxpright_-M6SWKhpjh6dnYQ7LrZJ_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-M6SWKhny0zQ-L6jebV1"
            },
            {
                name: "repeating_earnedxp_-M6SWZkfSVM9ESTFb4Nj_xp_award",
                current: 2,
                max: "",
                id: "-M6SWZkZX6GUNJOrOgsI"
            },
            {
                name: "repeating_earnedxp_-M6SWZkfSVM9ESTFb4Nj_xp_session",
                current: "Twenty-One",
                max: "",
                id: "-M6SWZkcakSlg0RMYqrG"
            },
            {
                name: "repeating_earnedxp_-M6SWZkfSVM9ESTFb4Nj_xp_reason",
                current: "Your unending patience!",
                max: "",
                id: "-M6SWZkfgZIEjyXSoz6S"
            },
            {
                name: "repeating_earnedxpright_-M70WNAgiPk9cm9Xxm52_xp_award",
                current: 2,
                max: "",
                id: "-M70WNA_bFS8RHJA3TA-"
            },
            {
                name: "repeating_earnedxpright_-M70WNAgiPk9cm9Xxm52_xp_session",
                current: "Forty-Four",
                max: "",
                id: "-M70WNAcTXa35AbvA6-Q"
            },
            {
                name: "repeating_earnedxpright_-M70WNAgiPk9cm9Xxm52_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-M70WNAefMQ4n47JyeCK"
            },
            {
                name: "repeating_spentxp_-MAxMS4tBgIagE41sa6c_xp_category",
                current: "Advantage",
                max: "",
                id: "-MAxMTBq6dUJkIUrnagP"
            },
            {
                name: "repeating_spentxp_-MAxMS4tBgIagE41sa6c_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-MAxMTGuWs48YX397_3J"
            },
            {
                name: "repeating_spentxp_-MAxMS4tBgIagE41sa6c_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-MAxMTH1HkIloez32JhS"
            },
            {
                name: "repeating_spentxp_-MAxMS4tBgIagE41sa6c_xp_new_toggle",
                current: 1,
                max: "",
                id: "-MAxMTH9NLqP5mT5N5zm"
            },
            {
                name: "repeating_spentxp_-MAxMS4tBgIagE41sa6c_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-MAxMTHF93FoW9Xbuy3s"
            },
            {
                name: "repeating_spentxp_-MAxMS4tBgIagE41sa6c_xp_trait",
                current: "Allies (Bookies)",
                max: "",
                id: "-MAxMVQL656a_HbV3Im9"
            },
            {
                name: "repeating_spentxp_-MAxMS4tBgIagE41sa6c_xp_cost",
                current: 18,
                max: "",
                id: "-MAxMVUmKNRiNdVYjCt7"
            },
            {
                name: "repeating_spentxp_-MAxMS4tBgIagE41sa6c_xp_new",
                current: "6",
                max: "",
                id: "-MAxMWOW2Nv_mMkRGFnx"
            },
            {
                name: "repeating_spentxp_-M4BiXLUw-nA3g7GogiJ_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-MAxN4tJKdjfsuD9eiIA"
            },
            {
                name: "repeating_spentxp_-MAxNEwOG3jYWCEFqlRh_xp_category",
                current: "Attribute",
                max: "",
                id: "-MAxNFXrGT1DHAYOLGwS"
            },
            {
                name: "repeating_spentxp_-MAxNEwOG3jYWCEFqlRh_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-MAxNFbWaRZhMGSWsqMX"
            },
            {
                name: "repeating_spentxp_-MAxNEwOG3jYWCEFqlRh_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-MAxNFbaA7V64M5XS721"
            },
            {
                name: "repeating_spentxp_-MAxNEwOG3jYWCEFqlRh_xp_new_toggle",
                current: 1,
                max: "",
                id: "-MAxNFbeZiRmWgFULoC1"
            },
            {
                name: "repeating_spentxp_-MAxNEwOG3jYWCEFqlRh_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-MAxNFbiUkw4jxPdca5v"
            },
            {
                name: "repeating_spentxp_-MAxNEwOG3jYWCEFqlRh_xp_initial",
                current: "2",
                max: "",
                id: "-MAxNGLfEIhnbiy33VpE"
            },
            {
                name: "repeating_spentxp_-MAxNEwOG3jYWCEFqlRh_xp_new",
                current: "3",
                max: "",
                id: "-MAxNGiU1Q9fzQoO_c2V"
            },
            {
                name: "repeating_spentxp_-MAxNEwOG3jYWCEFqlRh_xp_trait",
                current: "Resolve",
                max: "",
                id: "-MAxNIGYc0M3amP-fi3R"
            },
            {
                name: "repeating_spentxp_-MAxNEwOG3jYWCEFqlRh_xp_cost",
                current: 15,
                max: "",
                id: "-MAxNIKqBRKp2gjK00Rn"
            },
            {
                name: "repeating_earnedxpright_-MAxox49IY75TscL8dBh_xp_award",
                current: 1,
                max: "",
                id: "-MAxox452PH9An-vU0Zd"
            },
            {
                name: "repeating_earnedxpright_-MAxox49IY75TscL8dBh_xp_session",
                current: "Forty-Five",
                max: "",
                id: "-MAxox4BxlSSk86XujMn"
            },
            {
                name: "repeating_earnedxpright_-MAxox49IY75TscL8dBh_xp_reason",
                current: "Spotlight Prompt for Ava",
                max: "",
                id: "-MAxox4F0t2lQcCUz5A5"
            },
            {
                name: "repeating_earnedxp_-MAxox55f1TkQekwNZ7F_xp_award",
                current: 2,
                max: "",
                id: "-MAxox51avM8Lv3Fmt1z"
            },
            {
                name: "repeating_earnedxp_-MAxox55f1TkQekwNZ7F_xp_session",
                current: "Twenty-One",
                max: "",
                id: "-MAxox56cNdsbor9IQpw"
            },
            {
                name: "repeating_earnedxp_-MAxox55f1TkQekwNZ7F_xp_reason",
                current: "Session XP award",
                max: "",
                id: "-MAxox5B4wFBuGOJFGQg"
            },
            {
                name: "repeating_earnedxpright_-MAxsc4yw0k9XYw7MDaf_xp_award",
                current: 1,
                max: "",
                id: "-MAxsc4u5BLmLsDfRkZ_"
            },
            {
                name: "repeating_earnedxpright_-MAxsc4yw0k9XYw7MDaf_xp_session",
                current: "Forty-Five",
                max: "",
                id: "-MAxsc4z1OPYIrG4zl6c"
            },
            {
                name: "repeating_earnedxpright_-MAxsc4yw0k9XYw7MDaf_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-MAxsc53IKLxzggE8BdT"
            },
            {
                name: "repeating_spentxp_-MAxNEwOG3jYWCEFqlRh_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-MC29aVvNuG2odpHIYGg"
            },
            {
                name: "repeating_spentxp_-MC29xYSiwBVelh-I0nE_xp_category",
                current: "Skill",
                max: "",
                id: "-MC29y8RHipehwfTd8He"
            },
            {
                name: "repeating_spentxp_-MC29xYSiwBVelh-I0nE_xp_trait_toggle",
                current: 1,
                max: "",
                id: "-MC29yDdV1IRlAl7sYih"
            },
            {
                name: "repeating_spentxp_-MC29xYSiwBVelh-I0nE_xp_initial_toggle",
                current: 1,
                max: "",
                id: "-MC29yDk1uM7vwh5cEwj"
            },
            {
                name: "repeating_spentxp_-MC29xYSiwBVelh-I0nE_xp_new_toggle",
                current: 1,
                max: "",
                id: "-MC29yDoWLoxfGTR9aq0"
            },
            {
                name: "repeating_spentxp_-MC29xYSiwBVelh-I0nE_xp_arrow_toggle",
                current: 1,
                max: "",
                id: "-MC29yDw6xFEyXnZCAr4"
            },
            {
                name: "repeating_spentxp_-MC29xYSiwBVelh-I0nE_xp_trait",
                current: "Science",
                max: "",
                id: "-MC2A-P8NEvflcxRzo4e"
            },
            {
                name: "repeating_spentxp_-MC29xYSiwBVelh-I0nE_xp_initial",
                current: "4",
                max: "",
                id: "-MC2A-v2ThZxzHORFPEm"
            },
            {
                name: "repeating_spentxp_-MC29xYSiwBVelh-I0nE_xp_new",
                current: "5",
                max: "",
                id: "-MC2A0LcvNQqp2Gh0QZA"
            },
            {
                name: "repeating_spentxp_-MC29xYSiwBVelh-I0nE_xp_cost",
                current: 15,
                max: "",
                id: "-MC2A0Qei7uOLu6kWdtU"
            },
            {
                name: "repeating_spentxp_-MC29xYSiwBVelh-I0nE_xp_spent_toggle",
                current: "on",
                max: "",
                id: "-MC2A0ttXCLq-AqjdL6-"
            },
            {
                name: "repeating_earnedxpright_-MC5-y7rQLZDiQc8sz1V_xp_award",
                current: 1,
                max: "",
                id: "-MC5-y7nAz1IfslmG2_e"
            },
            {
                name: "repeating_earnedxpright_-MC5-y7rQLZDiQc8sz1V_xp_session",
                current: "Forty-Six",
                max: "",
                id: "-MC5-y7s1scidHlM4C7p"
            },
            {
                name: "repeating_earnedxpright_-MC5-y7rQLZDiQc8sz1V_xp_reason",
                current: "Spotlight Prompt for Locke",
                max: "",
                id: "-MC5-y7xE0zKpOQ5ooiR"
            },
            {
                name: "repeating_earnedxpright_-MC50S857er8w5amGpoN_xp_award",
                current: 1,
                max: "",
                id: "-MC50S82JSxIxhBzDhQ6"
            },
            {
                name: "repeating_earnedxpright_-MC50S857er8w5amGpoN_xp_session",
                current: "Forty-Six",
                max: "",
                id: "-MC50S87Q0B-AG6X9IyO"
            },
            {
                name: "repeating_earnedxpright_-MC50S857er8w5amGpoN_xp_reason",
                current: "Session Scribe.",
                max: "",
                id: "-MC50S8BWp2kB0m1i1Gp"
            },
            {
                name: "repeating_earnedxpright_-MC50S91QQGdVDphQf2m_xp_award",
                current: 2,
                max: "",
                id: "-MC50S8zAIt8van22G5t"
            },
            {
                name: "repeating_earnedxpright_-MC50S91QQGdVDphQf2m_xp_session",
                current: "Forty-Six",
                max: "",
                id: "-MC50S93TGdNQDVOIdEQ"
            },
            {
                name: "repeating_earnedxpright_-MC50S91QQGdVDphQf2m_xp_reason",
                current: "Session XP award.",
                max: "",
                id: "-MC50S98iEfOVWwTR-BW"
            },
            {
                name: "repeating_earnedxp_-MC50S9yt2rAO5ZHlT-s_xp_award",
                current: 1,
                max: "",
                id: "-MC50S9ufkvaG7e3QyyA"
            },
            {
                name: "repeating_earnedxp_-MC50S9yt2rAO5ZHlT-s_xp_session",
                current: "Twenty-One",
                max: "",
                id: "-MC50S9z_eUKYFtVMS5N"
            },
            {
                name: "repeating_earnedxp_-MC50S9yt2rAO5ZHlT-s_xp_reason",
                current: "Excellent in-character ghoul play",
                max: "",
                id: "-MC50SA38X4Pf5LOM71X"
            }
        ]
    }
};

const groupRows = (charName) => {
    const fileName = `${filePath}${charName}.csv`;
    const charRows = [];
    for (const [num, data] of Object.entries(JSONData[charName])) {
        const allRows = [charName, num];
        data.forEach((x) => {
            const thisRow = [...allRows];
            if (!x.name.startsWith("_reporder")) {
                if (x.name.startsWith("repeating")) {
                    const [, cat, rowID, ...attr] = x.name.split("_");
                    thisRow.push(...[cat, rowID, attr.join("_"), x.current, x.id]);
                } else {
                    thisRow.push(...["STANDARD", " ", x.name, x.current, x.id]);
                }
                charRows.push(thisRow);
            }
        });
    }
    let groupedRows = _.groupBy(charRows, (x) => x[3]);
    groupedRows = Object.values(groupedRows).map((x) => _.groupBy(x.filter((xx) => !xx.includes("sorttrigger")), (xx) => xx[1]));
    let earnedXPRows = groupedRows.filter((x) => _.all(Object.values(x), (xx) => _.all(Object.values(xx), (xxx) => xxx[2] === "earnedxp" || xxx[2] === "earnedxpright")));
    earnedXPRows = _.flatten(earnedXPRows.map((x) => Object.values(x)), true);
    earnedXPRows = earnedXPRows.map((x) => x.map((xx) => [xx[0], xx[1], xx[5]]));
    earnedXPRows = _.sortBy(earnedXPRows.map((x) => [...x[0], ...x[1], ...x[2]]).map((x) => [x[0], x[1], x[5], x[2], x[8]]), (xx) => xx[1]).map((x) => x.join("|"));

    fs.writeFile(fileName, JSON.stringify(earnedXPRows, null, 4), (err) => {
        if (err)
            throw err;
        console.log("Saved!");
    });
    console.log(groupedRows.length);
};
for (const charName of Object.keys(JSONData))
    groupRows(charName);
