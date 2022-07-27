import { defenseEffect } from 'src/game/effects/defense/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const PlantFeetCard: Card = {
    cardId: 21,
    name: 'Plant Feet',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Defend,
    pool: 'knight',
    energy: 0,
    description: `Gain {${defenseEffect.name}} defense. Doubled each use for the remainder of combat.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: defenseEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 2,
                    doubleValuesWhenPlayed: true,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
};

export const PlantFeetCardUpgraded: Card = {
    cardId: 22,
    name: 'Plant Feet+',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Defend,
    pool: 'knight',
    energy: 0,
    description: `Gain {${defenseEffect.name}} defense. Doubled each use for the remainder of combat.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: defenseEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 3,
                    doubleValuesWhenPlayed: true,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
};
