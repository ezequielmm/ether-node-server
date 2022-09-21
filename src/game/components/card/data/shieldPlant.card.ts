import { defenseEffect } from 'src/game/effects/defense/constants';
import {
    CardRarityEnum,
    CardTypeEnum,
    CardTargetedEnum,
    CardEnergyEnum,
    CardKeywordEnum,
} from '../card.enum';
import { Card } from '../card.schema';

export const ShieldPlantCard: Card = {
    cardId: 109,
    name: 'Shield Plant',
    rarity: CardRarityEnum.Rare,
    cardType: CardTypeEnum.Defend,
    pool: 'knight',
    energy: CardEnergyEnum.All,
    description: `Gain {${defenseEffect.name}} defense per energy. Exhaust`,
    keywords: [CardKeywordEnum.Exhaust],
    properties: {
        effects: [
            {
                effect: defenseEffect.name,
                target: CardTargetedEnum.RandomEnemy,
                args: {
                    value: 8,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
};

export const ShieldPlantCardUpgraded: Card = {
    cardId: 110,
    name: 'Shield Plant+',
    rarity: CardRarityEnum.Rare,
    cardType: CardTypeEnum.Defend,
    pool: 'knight',
    energy: CardEnergyEnum.All,
    description: `Gain {${defenseEffect.name}} defense per energy.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: defenseEffect.name,
                target: CardTargetedEnum.RandomEnemy,
                args: {
                    value: 8,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
};
