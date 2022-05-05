const states = {
    class: {},

    attributePoints: {
        class: {
            level: -1,
            vigor: -1,
            mind: -1,
            endurance: -1,
            strength: -1,
            dexterity: -1,
            intelligence: -1,
            faith: -1,
            arcane: -1
        },
        editable: {
            level: -1,
            vigor: -1,
            mind: -1,
            endurance: -1,
            strength: -1,
            dexterity: -1,
            intelligence: -1,
            faith: -1,
            arcane: -1
        },
        final: {
            level: -1,
            vigor: -1,
            mind: -1,
            endurance: -1,
            strength: -1,
            dexterity: -1,
            intelligence: -1,
            faith: -1,
            arcane: -1
        }
    },

    baseStats: {
        hp: -1,
        fp: -1,
        stamina: -1,
        maxEquipLoad: -1,
        equipLoad: -1,
        poise: -1,
        discovery: -1
    },

    defenseDmgNegation: {
        defense: {
            physical: -1,
            vsStrike: -1,
            vsSlash: -1,
            vsPierce: -1,
            magic: -1,
            fire: -1,
            lightning: -1,
            holy: -1
        },
        dmgNegation: {
            physical: -1,
            vsStrike: -1,
            vsSlash: -1,
            vsPierce: -1,
            magic: -1,
            fire: -1,
            lightning: -1,
            holy: -1
        }
    },

    resistance: {
        resistance: {
            immunity: -1,
            robustness: -1,
            focus: -1,
            vitality: -1
        },
        armor: {
            immunity: -1,
            robustness: -1,
            focus: -1,
            vitality: -1
        }
    },

    armor : {
        head : headsJSON.heads[0],
        chest : chestsJSON.chests[0],
        hands : handsJSON.hands[0],
        legs : legsJSON.legs[0]
    },

    talismans : {
        talisman1 : talismansJSON[0],
        talisman2 : talismansJSON[0],
        talisman3 : talismansJSON[0],
        talisman4 : talismansJSON[0]
    }
}
