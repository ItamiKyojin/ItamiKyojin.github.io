"use strict"

// Allgemein kommenieren

// TODO level changes reset on class change
// TODO level 1 to 13, level 90 - 99
const enduranceIncreaseDeprecated = [
    {
        'stamina' : 97,
        'maxEquipLoad' : 52.9
    },
    {
        'stamina' : 0,
        'maxEquipLoad' : 0
    },

    {
        'stamina' : 0,
        'maxEquipLoad' : 0
    },

    {
        'stamina' : 0,
        'maxEquipLoad' : 0
    },

    {
        'stamina' : 0,
        'maxEquipLoad' : 0
    },

    {
        'stamina' : 0,
        'maxEquipLoad' : 0
    },

    {
        'stamina' : 0,
        'maxEquipLoad' : 0
    },

    {
        'stamina' : 0,
        'maxEquipLoad' : 0
    },

    {
        'stamina' : 0,
        'maxEquipLoad' : 0
    },

    {
        'stamina' : 0,
        'maxEquipLoad' : 0
    },

    {
        'stamina' : 0,
        'maxEquipLoad' : 0
    },

    {
        'stamina' : 0,
        'maxEquipLoad' : 0
    },

    {
        'stamina' : 0,
        'maxEquipLoad' : 0
    },

    {
        'stamina' : 0,
        'maxEquipLoad' : 0
    },

    {
        'stamina' : 1,
        'maxEquipLoad' : 1.6
    },

    {
        'stamina' : 1,
        'maxEquipLoad' : 1.6
    },

    {
        'stamina' : 1,
        'maxEquipLoad' : 1.6
    },

    {
        'stamina' : 2,
        'maxEquipLoad' : 1.6
    },

    {
        'stamina' : 2,
        'maxEquipLoad' : 1.6
    },

    {
        'stamina' : 1,
        'maxEquipLoad' : 1.6
    },

    {
        'stamina' : 2,
        'maxEquipLoad' : 1.6
    },

    {
        'stamina' : 2,
        'maxEquipLoad' : 1.5
    },

    {
        'stamina' : 1,
        'maxEquipLoad' : 1.6
    },

    {
        'stamina' : 2,
        'maxEquipLoad' : 1.6
    },

    {
        'stamina' : 2,
        'maxEquipLoad' : 1.6
    },

    {
        'stamina' : 1,
        'maxEquipLoad' : 1.6
    },

    {
        'stamina' : 2,
        'maxEquipLoad' : 1
    },

    {
        'stamina' : 2,
        'maxEquipLoad' : 1.1
    },

    {
        'stamina' : 1,
        'maxEquipLoad' : 1.1
    },

    {
        'stamina' : 2,
        'maxEquipLoad' : 1.2
    },

    {
        'stamina' : 2,
        'maxEquipLoad' : 1.2
    },

    {
        'stamina' : 1,
        'maxEquipLoad' : 1.3
    },

    {
        'stamina' : 2,
        'maxEquipLoad' : 1.3
    },

    {
        'stamina' : 1,
        'maxEquipLoad' : 1.3
    },

    {
        'stamina' : 2,
        'maxEquipLoad' : 1.3
    },

    {
        'stamina' : 1,
        'maxEquipLoad' : 1.3
    },

    {
        'stamina' : 2,
        'maxEquipLoad' : 1.3
    },

    {
        'stamina' : 1,
        'maxEquipLoad' : 1.4
    },

    {
        'stamina' : 2,
        'maxEquipLoad' : 1.3
    },

    {
        'stamina' : 1,
        'maxEquipLoad' : 1.4
    },

    {
        'stamina' : 2,
        'maxEquipLoad' : 1.4
    },

    {
        'stamina' : 1,
        'maxEquipLoad' : 1.4
    },

    {
        'stamina' : 2,
        'maxEquipLoad' : 1.4
    },

    {
        'stamina' : 1,
        'maxEquipLoad' : 1.4
    },

    {
        'stamina' : 2,
        'maxEquipLoad' : 1.4
    },

    {
        'stamina' : 1,
        'maxEquipLoad' : 1.4
    },

    {
        'stamina' : 2,
        'maxEquipLoad' : 1.5
    },

    {
        'stamina' : 1,
        'maxEquipLoad' : 1.4
    },

    {
        'stamina' : 2,
        'maxEquipLoad' : 1.4
    },

    {
        'stamina' : 1,
        'maxEquipLoad' : 1.5
    },

    {
        'stamina' : 2,
        'maxEquipLoad' : 1.5
    },

    {
        'stamina' : 0,
        'maxEquipLoad' : 1.4
    },

    {
        'stamina' : 0,
        'maxEquipLoad' : 1.5
    },

    {
        'stamina' : 0,
        'maxEquipLoad' : 1.5
    },

    {
        'stamina' : 1,
        'maxEquipLoad' : 1.4
    },

    {
        'stamina' : 0,
        'maxEquipLoad' : 1.5
    },

    {
        'stamina' : 0,
        'maxEquipLoad' : 1.5
    },

    {
        'stamina' : 1,
        'maxEquipLoad' : 1.5
    },

    {
        'stamina' : 0,
        'maxEquipLoad' : 1.5
    },

    {
        'stamina' : 0,
        'maxEquipLoad' : 1.5
    },

    {
        'stamina' : 1,
        'maxEquipLoad' : 1.5
    },

    {
        'stamina' : 0,
        'maxEquipLoad' : 1
    },

    {
        'stamina' : 0,
        'maxEquipLoad' : 1.1
    },

    {
        'stamina' : 0,
        'maxEquipLoad' : 1
    },

    {
        'stamina' : 1,
        'maxEquipLoad' : 1
    },

    {
        'stamina' : 0,
        'maxEquipLoad' : 1
    },

    {
        'stamina' : 0,
        'maxEquipLoad' : 1.1
    },

    {
        'stamina' : 1,
        'maxEquipLoad' : 1
    },

    {
        'stamina' : 0,
        'maxEquipLoad' : 1
    },

    {
        'stamina' : 0,
        'maxEquipLoad' : 1
    },

    {
        'stamina' : 1,
        'maxEquipLoad' : 1.1
    },

    {
        'stamina' : 0,
        'maxEquipLoad' : 1
    },

    {
        'stamina' : 0,
        'maxEquipLoad' : 1
    },

    {
        'stamina' : 1,
        'maxEquipLoad' : 1
    },

    {
        'stamina' : 0,
        'maxEquipLoad' : 1.1
    },

    {
        'stamina' : 0,
        'maxEquipLoad' : 1
    },

    {
        'stamina' : 0,
        'maxEquipLoad' : 1
    },

    {
        'stamina' : 1,
        'maxEquipLoad' : 1
    },

    {
        'stamina' : 0,
        'maxEquipLoad' : 1.1
    },

    {
        'stamina' : 0,
        'maxEquipLoad' : 1
    },

    {
        'stamina' : 1,
        'maxEquipLoad' : 1
    },

    {
        'stamina' : 0,
        'maxEquipLoad' : 1
    },

    {
        'stamina' : 0,
        'maxEquipLoad' : 1.1
    },

    {
        'stamina' : 1,
        'maxEquipLoad' : 1
    },

    {
        'stamina' : 0,
        'maxEquipLoad' : 1
    },

    {
        'stamina' : 0,
        'maxEquipLoad' : 1
    },

    {
        'stamina' : 1,
        'maxEquipLoad' : 1.1
    },

    {
        'stamina' : 0,
        'maxEquipLoad' : 1
    },

    {
        'stamina' : 0,
        'maxEquipLoad' : 1
    },

    {
        'stamina' : 0,
        'maxEquipLoad' : 1
    },

    {
        'stamina' : -1,
        'maxEquipLoad' : -1
    },

    {
        'stamina' : -1,
        'maxEquipLoad' : -1
    },

    {
        'stamina' : -1,
        'maxEquipLoad' : -1
    },

    {
        'stamina' : -1,
        'maxEquipLoad' : -1
    },

    {
        'stamina' : -1,
        'maxEquipLoad' : -1
    },

    {
        'stamina' : -1,
        'maxEquipLoad' : -1
    },

    {
        'stamina' : -1,
        'maxEquipLoad' : -1
    },

    {
        'stamina' : -1,
        'maxEquipLoad' : -1
    },

    {
        'stamina' : -1,
        'maxEquipLoad' : -1
    },

    {
        'stamina' : -1,
        'maxEquipLoad' : -1
    }
]

const vigor = [0, 300, 304, 312, 322, 334, 347, 362, 378, 396, 414, 434, 455, 476, 499, 522, 547, 572, 598, 624, 652, 680, 709, 738, 769, 800, 833, 870, 910, 951, 994, 1037, 1081, 1125, 1170, 1216, 1262, 1308, 1355, 1402, 1450, 1476, 1503, 1529, 1555, 1581, 1606, 1631, 1656, 1680, 1704, 1727, 1750, 1772, 1793, 1814, 1834, 1853, 1871, 1887, 1900, 1906, 1912, 1918, 1924, 1930, 1936, 1942, 1948, 1954, 1959, 1965, 1971, 1977, 1982, 1988, 1993, 1999, 2004, 2010, 2015, 2020, 2026, 2031, 2036, 2041, 2046, 2051, 2056, 2060, 2065, 2070, 2074, 2078, 2082, 2086, 2090, 2094, 2097, 2100]

const mind = [0, 40, 43, 46, 49, 52, 55, 58, 62, 65, 68, 71, 74, 77, 81, 84, 87, 90, 93, 96, 100, 106, 112, 118, 124, 130, 136, 142, 148, 154, 160, 166, 172, 178, 184, 190, 196, 202, 208, 214, 220, 226, 232, 238, 244, 250, 256, 262, 268, 274, 280, 288, 297, 305, 313, 321, 328, 335, 341, 346, 350, 352, 355, 357, 360, 362, 365, 367, 370, 373, 375, 378, 380, 383, 385, 388, 391, 393, 396, 398, 401, 403, 406, 408, 411, 414, 416, 419, 421, 424, 426, 429, 432, 434, 437, 439, 442, 444, 447, 450]

const endurance = [
    {'stamina' : 0,
    'maxEquipLoad' : 0},
    {'stamina' : 80,
    'maxEquipLoad' : 45.0},
    {'stamina' : 81,
        'maxEquipLoad' : 45.0},
    {'stamina' : 82,
        'maxEquipLoad' : 45.0},
    {'stamina' : 84,
        'maxEquipLoad' : 45.0},
    {'stamina' : 85,
        'maxEquipLoad' : 45.0},
    {'stamina' : 87,
        'maxEquipLoad' : 45.0},
    {'stamina' : 88,
        'maxEquipLoad' : 45.0},
    {'stamina' : 90,
        'maxEquipLoad' : 45.0},
    {'stamina' : 91,
        'maxEquipLoad' : 46.6},
    {'stamina' : 92,
        'maxEquipLoad' : 48.2},
    {'stamina' : 94,
        'maxEquipLoad' : 49.8},
    {'stamina' : 95,
        'maxEquipLoad' : 51.4},
    {'stamina' : 97,
        'maxEquipLoad' : 52.9},
    {'stamina' : 98,
        'maxEquipLoad' : 54.5},
    {'stamina' : 100,
        'maxEquipLoad' : 56.1},
    {'stamina' : 101,
        'maxEquipLoad' : 57.7},
    {'stamina' : 103,
        'maxEquipLoad' : 59.3},
    {'stamina' : 105,
        'maxEquipLoad' : 60.9},
    {'stamina' : 106,
        'maxEquipLoad' : 62.5},
    {'stamina' : 108,
        'maxEquipLoad' : 64.1},
    {'stamina' : 110,
        'maxEquipLoad' : 65.6},
    {'stamina' : 111,
        'maxEquipLoad' : 67.2},
    {'stamina' : 113,
        'maxEquipLoad' : 68.8},
    {'stamina' : 115,
        'maxEquipLoad' : 70.4},
    {'stamina' : 116,
        'maxEquipLoad' : 72.0},
    {'stamina' : 118,
        'maxEquipLoad' : 73.0},
    {'stamina' : 120,
        'maxEquipLoad' : 74.1},
    {'stamina' : 121,
        'maxEquipLoad' : 75.2},
    {'stamina' : 123,
        'maxEquipLoad' : 76.4},
    {'stamina' : 125,
        'maxEquipLoad' : 77.6},
    {'stamina' : 126,
        'maxEquipLoad' : 78.9},
    {'stamina' : 128,
        'maxEquipLoad' : 80.2},
    {'stamina' : 129,
        'maxEquipLoad' : 81.5},
    {'stamina' : 131,
        'maxEquipLoad' : 82.8},
    {'stamina' : 132,
        'maxEquipLoad' : 84.1},
    {'stamina' : 134,
        'maxEquipLoad' : 85.4},
    {'stamina' : 135,
        'maxEquipLoad' : 86.8},
    {'stamina' : 137,
        'maxEquipLoad' : 88.1},
    {'stamina' : 138,
        'maxEquipLoad' : 89.5},
    {'stamina' : 140,
        'maxEquipLoad' : 90.9},
    {'stamina' : 141,
        'maxEquipLoad' : 92.3},
    {'stamina' : 143,
        'maxEquipLoad' : 93.7},
    {'stamina' : 144,
        'maxEquipLoad' : 95.1},
    {'stamina' : 146,
        'maxEquipLoad' : 96.5},
    {'stamina' : 147,
        'maxEquipLoad' : 97.9},
    {'stamina' : 149,
        'maxEquipLoad' : 99.4},
    {'stamina' : 150,
        'maxEquipLoad' : 100.8},
    {'stamina' : 152,
        'maxEquipLoad' : 102.2},
    {'stamina' : 153,
        'maxEquipLoad' : 103.7},
    {'stamina' : 155,
        'maxEquipLoad' : 105.2},
    {'stamina' : 155,
        'maxEquipLoad' : 106.6},
    {'stamina' : 155,
        'maxEquipLoad' : 108.1},
    {'stamina' : 155,
        'maxEquipLoad' : 109.6},
    {'stamina' : 156,
        'maxEquipLoad' : 111.0},
    {'stamina' : 156,
        'maxEquipLoad' : 112.5},
    {'stamina' : 156,
        'maxEquipLoad' : 114.0},
    {'stamina' : 157,
        'maxEquipLoad' : 115.5},
    {'stamina' : 157,
        'maxEquipLoad' : 117.0},
    {'stamina' : 157,
        'maxEquipLoad' : 118.5},
    {'stamina' : 158,
        'maxEquipLoad' : 120.0},
    {'stamina' : 158,
        'maxEquipLoad' : 121.0},
    {'stamina' : 158,
        'maxEquipLoad' : 122.1},
    {'stamina' : 158,
        'maxEquipLoad' : 123.1},
    {'stamina' : 159,
        'maxEquipLoad' : 124.1},
    {'stamina' : 159,
        'maxEquipLoad' : 125.1},
    {'stamina' : 159,
        'maxEquipLoad' : 126.2},
    {'stamina' : 160,
        'maxEquipLoad' : 127.2},
    {'stamina' : 160,
        'maxEquipLoad' : 128.2},
    {'stamina' : 160,
        'maxEquipLoad' : 129.2},
    {'stamina' : 161,
        'maxEquipLoad' : 130.3},
    {'stamina' : 161,
        'maxEquipLoad' : 131.3},
    {'stamina' : 161,
        'maxEquipLoad' : 132.3},
    {'stamina' : 162,
        'maxEquipLoad' : 133.3},
    {'stamina' : 162,
        'maxEquipLoad' : 134.4},
    {'stamina' : 162,
        'maxEquipLoad' : 135.4},
    {'stamina' : 162,
        'maxEquipLoad' : 136.4},
    {'stamina' : 163,
        'maxEquipLoad' : 137.4},
    {'stamina' : 163,
        'maxEquipLoad' : 138.5},
    {'stamina' : 163,
        'maxEquipLoad' : 139.5},
    {'stamina' : 164,
        'maxEquipLoad' : 140.5},
    {'stamina' : 164,
        'maxEquipLoad' : 141.5},
    {'stamina' : 164,
        'maxEquipLoad' : 142.6},
    {'stamina' : 165,
        'maxEquipLoad' : 143.6},
    {'stamina' : 165,
        'maxEquipLoad' : 144.6},
    {'stamina' : 165,
        'maxEquipLoad' : 145.6},
    {'stamina' : 166,
        'maxEquipLoad' : 146.7},
    {'stamina' : 166,
        'maxEquipLoad' : 147.7},
    {'stamina' : 166,
        'maxEquipLoad' : 148.7},
    {'stamina' : 166,
        'maxEquipLoad' : 149.7},
    {'stamina' : 167,
        'maxEquipLoad' : 150.8},
    {'stamina' : 167,
        'maxEquipLoad' : 151.8},
    {'stamina' : 167,
        'maxEquipLoad' : 152.8},
    {'stamina' : 168,
        'maxEquipLoad' : 153.8},
    {'stamina' : 168,
        'maxEquipLoad' : 154.9},
    {'stamina' : 168,
        'maxEquipLoad' : 155.9},
    {'stamina' : 169,
        'maxEquipLoad' : 156.9},
    {'stamina' : 169,
        'maxEquipLoad' : 157.9},
    {'stamina' : 169,
        'maxEquipLoad' : 159.0},
    {'stamina' : 170,
        'maxEquipLoad' : 160.0}]


const classesJSON = {
    "classes" : [
        {
            "name" : "hero",
            "level" : 7,
            "vigor" : 14,
            "dexterity" : 9,
            "mind" : 9,
            "intelligence" : 7,
            "endurance" : 12,
            "faith" : 8,
            "strength" : 16,
            "arcane" : 11
        },
        {
            "name" : "bandit",
            "level" : 5,
            "vigor" : 10,
            "dexterity" : 13,
            "mind" : 11,
            "intelligence" : 9,
            "endurance" : 10,
            "faith" : 8,
            "strength" : 9,
            "arcane" : 14
        },
        {
            "name" : "astrologer",
            "level" : 6,
            "vigor" : 9,
            "dexterity" : 12,
            "mind" : 15,
            "intelligence" : 16,
            "endurance" : 9,
            "faith" : 7,
            "strength" : 8,
            "arcane" : 9
        },
        {
            "name" : "warrior",
            "level" : 8,
            "vigor" : 11,
            "dexterity" : 16,
            "mind" : 12,
            "intelligence" : 10,
            "endurance" : 11,
            "faith" : 8,
            "strength" : 10,
            "arcane" : 9
        },
        {
            "name" : "prisoner",
            "level" : 9,
            "vigor" : 11,
            "dexterity" : 14,
            "mind" : 12,
            "intelligence" : 14,
            "endurance" : 11,
            "faith" : 6,
            "strength" : 11,
            "arcane" : 9
        },
        {
            "name" : "confessor",
            "level" : 10,
            "vigor" : 10,
            "dexterity" : 12,
            "mind" : 13,
            "intelligence" : 9,
            "endurance" : 10,
            "faith" : 14,
            "strength" : 12,
            "arcane" : 9
        },
        {
            "name" : "wretch",
            "level" : 1,
            "vigor" : 10,
            "dexterity" : 10,
            "mind" : 10,
            "intelligence" : 10,
            "endurance" : 10,
            "faith" : 10,
            "strength" : 10,
            "arcane" : 10
        },
        {
            "name" : "vagabond",
            "level" : 9,
            "vigor" : 15,
            "dexterity" : 13,
            "mind" : 10,
            "intelligence" : 9,
            "endurance" : 11,
            "faith" : 9,
            "strength" : 14,
            "arcane" : 7
        },
        {
            "name" : "prophet",
            "level" : 7,
            "vigor" : 10,
            "dexterity" : 10,
            "mind" : 14,
            "intelligence" : 7,
            "endurance" : 8,
            "faith" : 16,
            "strength" : 11,
            "arcane" : 10
        },
        {
            "name" : "samurai",
            "level" : 9,
            "vigor" : 12,
            "dexterity" : 15,
            "mind" : 11,
            "intelligence" : 9,
            "endurance" : 13,
            "faith" : 8,
            "strength" : 12,
            "arcane" : 8
        },
    ]
}

const statsJSON = {
    "stats" : [
        {
            "label" : "vigor",
            "flavortext" : "Attribute governing HP. Also affects fire resistance and Immunity stat. Soft-capped at 40: returns diminish greatly after 40 points."
        },
        {
            "label" : "mind",
            "flavortext" : "Attribute governing FP. Also affects the Focus stat."
        },
        {
            "label" : "endurance",
            "flavortext" : "Attribute governing Stamina. Also affects Robustness. This attribute also determines how heavy your equipment can be. Soft-capped for stamina at 50 and maximum equip load at 60: returns diminish greatly after those points."
        },
        {
            "label" : "strength",
            "flavortext" : "Attribute required to wield heavy armaments. Also boosts attacks power of strength-scaling armaments and affects your Physical Defense."
        },
        {
            "label" : "dexterity",
            "flavortext" : "Attribute required to wield advanced armaments. Also boosts attack power of dexterity-scaling armaments, reduces casting time of Spells, softens fall damage, and makes it harder to be knocked off your horse."
        },
        {
            "label" : "intelligence",
            "flavortext" : "Attribute required to perform glintstone sorceries. Also boosts magic power of intelligence-scaling Sorceries and improves Magic Resistance."
        },
        {
            "label" : "faith",
            "flavortext" : "Attribute required to perform sacred Incantations. Also boosts magic power of faith-scaling Incantations."
        },
        {
            "label" : "arcane",
            "flavortext" : "Attribute governing Discovery. Also affects Holy Defense, Vitality, and certain Sorceries and Incantations."
        }
    ]
};


const baseStatNames = ['HP', 'FP', 'Stamina', 'Equip Load', 'Poise', 'Discovery'];

const defenseNames = ['Physical', 'VS Strike', 'VS Slash', 'VS Pierce', 'Magic', 'Fire', 'Lightning', 'Holy'];

const resistanceNames = ['Immunity', 'Robustness', 'Focus', 'Vitality'];


let globalStats = {
    // stats are NOT INFLUENCED by equip (e.g. armor, talismans, ...)
    'hp' : -1,
    'fp' : -1,
    'stamina' : -1,
    'maxEquipLoad' : -1,
    'equipLoad' : -1,
    'poise' : -1,
    // TODO BAD NAME, SHOULD BE SOMETHING LIKE 'stat one'
    'defense' : {
        'initial' : {
            "physical" : -1,
            "vs-strike" : -1,
            "vs-slash" : -1,
            "vs-pierce" : -1,
            "magic" : -1,
            "fire" : -1,
            "lightning" : -1,
            "holy" : -1,
            "immunity" : -1,
            "robustness" : -1,
            "focus" : -1,
            "vitality" : -1
        },
        'armor' : {
            "physical" : -1,
            "vs-strike" : -1,
            "vs-slash" : -1,
            "vs-pierce" : -1,
            "magic" : -1,
            "fire" : -1,
            "lightning" : -1,
            "holy" : -1,
            "immunity" : -1,
            "robustness" : -1,
            "focus" : -1,
            "vitality" : -1
        }
    },
    // TODO BAD NAME, SHOULD BE SOMETHING LIKE 'stat two'
    'resistance' : {
        'initial' : {
            "physical" : -1,
            "vs-strike" : -1,
            "vs-slash" : -1,
            "vs-pierce" : -1,
            "magic" : -1,
            "fire" : -1,
            "lightning" : -1,
            "holy" : -1,
            "immunity" : -1,
            "robustness" : -1,
            "focus" : -1,
            "vitality" : -1
        },
        'armor' : {
            "physical": -1,
            "vs-strike": -1,
            "vs-slash": -1,
            "vs-pierce": -1,
            "magic": -1,
            "fire": -1,
            "holy": -1,
            "immunity" : -1,
            "robustness" : -1,
            "focus" : -1,
            "vitality" : -1
        }
    }

            /*"immunity" : "0",
            "robustness" : "0",
            "focus" : "0",
            "vitality" : "0",
            "poise" : "0",
            "weight" : "0",*/
}

let globalArmor = {
    'head' : headsJSON.heads[0],
    'chest' : chestsJSON.chests[0],
    'hands' : handsJSON.hands[0],
    'legs' : legsJSON.legs[0]
}


window.onload = (() => main())

function main() {
    createClassSelect();


    // detaillierter kommentieren
    // create levelable stat region
    const levelableStatsRegion = document.getElementsByClassName("levelable-stats-region")[0];
    statsJSON.stats.forEach(stat => { levelableStatsRegion.appendChild(createStatNode(stat)); })


    // add armor selects
    addArmorSelect('head-dropdown-region', headsJSON.heads, "updateGlobalArmorPiece('head', headsJSON.heads);");
    addArmorSelect('chest-dropdown-region', chestsJSON.chests, "updateGlobalArmorPiece('chest', chestsJSON.chests);");
    addArmorSelect('hands-dropdown-region', handsJSON.hands, "updateGlobalArmorPiece('hands', handsJSON.hands);");
    addArmorSelect('legs-dropdown-region', legsJSON.legs, "updateGlobalArmorPiece('legs', legsJSON.legs);");


    // add base stat nodes
    const baseStatsRegion = document.getElementsByClassName('base-stats-region')[0];
    baseStatNames.forEach(name => { baseStatsRegion.appendChild(createBaseStatNode(name)); })


    // add defense nodes
    const defenseRegion = document.getElementsByClassName('defense-region')[0];
    defenseNames.forEach(name => { defenseRegion.appendChild(createDefenseNode(name)); })


    // add resistance nodes
    const resistanceRegion = document.getElementsByClassName('resistance-region')[0];
    resistanceNames.forEach(name => { resistanceRegion.appendChild(createResistanceNode(name)); })


    // initiate some stats, once preceding equipment and stats have been set
    // initiate class stats
    updateClassStats(classesJSON, statsJSON);


    // update resulting level
    updateLevel()


    updateArmorStats();
}


// ----- specific helper functions -----
function createClassSelect() {
    const classSelectionRegion = document.getElementsByClassName("class-selection-region")[0];

    const selectNode = document.createElement("select");
    selectNode.classList.add("dropdown-select");
    selectNode.setAttribute('onchange', 'updateClassStats()');

    classesJSON.classes.forEach(characterClass => {
        const optionNode = document.createElement("option");
        const capitalizedClassName = capitalizeFirstLetter(characterClass.name);
        optionNode.setAttribute('value', capitalizedClassName);
        optionNode.innerText = capitalizedClassName;

        selectNode.appendChild(optionNode);
    })

    classSelectionRegion.appendChild(selectNode);
}

function createStatNode(stat) {
    // create label div
    const div = document.createElement("div");
    div.classList.add('clearfix');
    div.classList.add('stat-box');

    const label = document.createElement("label");
    label.setAttribute('for', stat.label);
    label.setAttribute('title', stat.flavortext);
    label.innerText = capitalizeFirstLetter(stat.label);

    div.appendChild(label);


    // create stat input
    const input2 = document.createElement('input');
    input2.setAttribute('id', stat.label);
    input2.classList.add('editable');
    input2.setAttribute('type', 'text');
    input2.setAttribute('maxlength', '2');
    input2.setAttribute('tabindex', '1');
    input2.setAttribute('onchange', "checkClassStat('" + stat.label + "')");

    div.appendChild(input2);


    // create stat-fixed input
    const input = document.createElement('input');
    input.setAttribute('id', stat.label + '-fixed');
    input.classList.add('fixed');
    input.setAttribute('type', 'text');
    input.setAttribute('readonly', '');

    div.appendChild(input);


    return div;
}

function updateClassStats() {
    // get selected class
    const classSelect = document.getElementsByClassName('class-selection-region')[0].firstChild;
    const className = classSelect.options[classSelect.selectedIndex].text.toLowerCase();

    // get the class' stats
    let classStats;
    classesJSON.classes.forEach(classStatInstance => {
        if(classStatInstance.name === className) {
            classStats = classStatInstance;
        }
    })

    // fill them in the fitting spots
    statsJSON.stats.forEach(stat => {
        const curLabel = stat.label;
        let curInput = document.getElementById(curLabel + '-fixed');
        curInput.value = classStats[curLabel];

        curInput = document.getElementById(curLabel);
        // TODO check, if value has been edited AND is >= class value
        curInput.value = classStats[curLabel];
    })
    const levelInput = document.getElementById('level-fixed');
    levelInput.value = classStats.level;

    // update level
    updateLevel()

    // update stats
    updateStats();
}

function checkClassStat(statLabel) {
    // get value of current user made attribute
    const stat = document.getElementById(statLabel);

    // get value of current attribute of class
    const classStatValue = document.getElementById(statLabel + '-fixed').value;

    // correct to min value if needed
    if(!isNumeric(stat.value) || parseInt(stat.value) < classStatValue) {
        stat.value = classStatValue;
    }

    updateLevel();
    updateStats();
}

function updateLevel() {
    let totalStats = 0;
    statsJSON.stats.forEach(stat => {
        const curLabel = stat.label;
        const curInput = document.getElementById(curLabel);

        totalStats += parseInt(curInput.value);
    })

    const levelInput = document.getElementById('level');
    levelInput.value = totalStats - 79;
}

function updateStats() {
    const vigorIndex = document.getElementById('vigor').value;
    globalStats.hp = vigor[vigorIndex];

    const mindIndex = document.getElementById('mind').value;
    globalStats.fp = mind[mindIndex];

    const enduranceIndex = document.getElementById('endurance').value;
    globalStats.stamina = endurance[enduranceIndex].stamina;
    globalStats.maxEquipLoad = endurance[enduranceIndex].maxEquipLoad;

    updateUIHP();
    updateUIFP();
    updateUIStamina();
    updateUIEquipLoad();
}

function addArmorSelect(armorClass, armorArray, onchangePart) {
    const armorDropdownRegion = document.getElementsByClassName(armorClass)[0];

    const selectNode = document.createElement('select');
    selectNode.classList.add('dropdown-select');
    selectNode.setAttribute('onchange', onchangePart + ' updateArmorStats();');

    armorArray.forEach(armorPiece => {
        const optionNode = document.createElement("option");
        const capitalizedArmorPieceName = capitalizeFirstLetter(armorPiece.name);
        optionNode.setAttribute('value', capitalizedArmorPieceName);
        optionNode.innerText = capitalizedArmorPieceName;

        selectNode.appendChild(optionNode);
    })

    armorDropdownRegion.appendChild(selectNode);
}

function updateGlobalArmorPiece(armorName, armorClass) {
    const select = document.getElementsByClassName(armorName + '-dropdown-region')[0].firstChild;
    const name = select.options[select.selectedIndex].text;
    globalArmor[armorName] = armorClass.filter(armorPiece => armorPiece.name === name)[0];
}

function updateArmorStats() {
    // update all armor related stats
    // TODO 'Equip Load', 'Poise', resistanceNames
    updateGlobalEquipLoad();
    defenseNames.forEach(defenseName => {
        const defenseInputName = defenseName.toLowerCase().replace(/\s/g, '-');
        updateGlobalDefenseArmor(defenseInputName);
    })
    resistanceNames.forEach(resistanceName => {
        const resistanceInputName = resistanceName.toLowerCase();
        updateGlobalResistanceArmor(resistanceInputName);
    })

    // update UI
    updateUIEquipLoad();
    defenseNames.forEach(defenseName => {
        const defenseInputName = defenseName.toLowerCase();
        updateUIArmorDefense(defenseInputName);
    })
    resistanceNames.forEach(resistanceName => {
        const resistanceInputName = resistanceName.toLowerCase();
        updateUIArmorResistance(resistanceInputName);
    })
}

// all 3 are very similar, last 2 almost equal
function createBaseStatNode(name) {
    const div = document.createElement('div');
    div.classList.add('clearfix');
    div.classList.add('stat-box');

    const label = document.createElement('label');
    label.setAttribute('for', name.toLowerCase());
    label.innerText = name;
    div.appendChild(label);

    const input = document.createElement('input');
    input.id = name.toLowerCase();
    input.classList.add('fixed');
    input.classList.add('er-big');
    input.setAttribute('type', 'text');
    input.setAttribute('readOnly', '');
    div.appendChild(input);

    return div;
}

function createDefenseNode(name) {
    const div = document.createElement('div');
    div.classList.add('clearfix');
    div.classList.add('stat-box');

    const label = document.createElement('label');
    label.setAttribute('for', name.toLowerCase());
    label.innerText = name;
    div.appendChild(label);

    const input1 = document.createElement('input');
    input1.id = name.toLowerCase() + '-absorption';
    input1.classList.add('fixed');
    input1.setAttribute('type', 'text');
    input1.setAttribute('readOnly', '');
    div.appendChild(input1);

    const input2 = document.createElement('input');
    input2.id = name.toLowerCase();
    input2.classList.add('fixed');
    input2.setAttribute('type', 'text');
    input2.setAttribute('readOnly', '');
    div.appendChild(input2);

    return div;
}

function createResistanceNode(name) {
    const div = document.createElement('div');
    div.classList.add('clearfix');
    div.classList.add('stat-box');

    const label = document.createElement('label');
    label.setAttribute('for', name.toLowerCase());
    label.innerText = name;
    div.appendChild(label);

    const input1 = document.createElement('input');
    input1.id = name.toLowerCase() + '-armor';
    input1.classList.add('fixed');
    input1.setAttribute('type', 'text');
    input1.setAttribute('readOnly', '');
    div.appendChild(input1);

    const input2 = document.createElement('input');
    input2.id = name.toLowerCase();
    input2.classList.add('fixed');
    input2.setAttribute('type', 'text');
    input2.setAttribute('readOnly', '');
    div.appendChild(input2);

    return div;
}

function updateGlobalEquipLoad() {
    globalStats.equipLoad = round((
        parseFloat(globalArmor.head.weight)
        + parseFloat(globalArmor.chest.weight)
        + parseFloat(globalArmor.hands.weight)
        + parseFloat(globalArmor.legs.weight)
    ), 1);
}

function updateGlobalDefenseArmor(type) {
    globalStats.resistance.armor[type] = round((
        (1 - parseFloat(globalArmor.head[type])/100)
        * (1 - parseFloat(globalArmor.chest[type])/100)
        * (1 - parseFloat(globalArmor.hands[type])/100)
        * (1 - parseFloat(globalArmor.legs[type])/100)
    ), 5);
}

function updateGlobalResistanceArmor(type) {
    globalStats.resistance.armor[type] = round((
        parseFloat(globalArmor.head[type])
        + parseFloat(globalArmor.chest[type])
        + parseFloat(globalArmor.hands[type])
        + parseFloat(globalArmor.legs[type])
    ), 0)
}

function updateUIHP() {
    const hpInput = document.getElementById('hp');
    hpInput.value = globalStats.hp;
}

function updateUIFP() {
    const fpInput = document.getElementById('fp');
    fpInput.value = globalStats.fp;
}

function updateUIStamina() {
    const staminaInput = document.getElementById('stamina');
    staminaInput.value = globalStats.stamina;
}

function updateUIEquipLoad() {
    const equipLoadInput = document.getElementById('equip load');
    equipLoadInput.value =
        Math.round(globalStats.equipLoad*10)/10 + ' / ' + Math.round(globalStats.maxEquipLoad*10)/10 +
        ' (' + Math.round((globalStats.equipLoad/globalStats.maxEquipLoad*100)*10)/10 + '%)';
}

function updateUIArmorDefense(type) {
    const defenseInput = document.getElementById(type + '-absorption');
    defenseInput.value = round((1 - globalStats.resistance.armor[type.replace(/\s/g, '-')])*100, 3);
    defenseInput.value += '%';
}

function updateUIArmorResistance(type) {
    const resistanceInput = document.getElementById(type + '-armor');
    resistanceInput.value = round(globalStats.resistance.armor[type], 0);
}


// ----- generic helper functions -----
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

function round(num, decimal) {
    return Math.round((num)*Math.pow(10, decimal))/Math.pow(10, decimal);
}
