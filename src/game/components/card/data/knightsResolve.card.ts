import { defenseEffect } from 'src/game/effects/defense/constants';
import {
    CardRarityEnum,
    CardTypeEnum,
    CardTargetedEnum,
    CardEnergyEnum,
} from '../card.enum';
import { Card } from '../card.schema';

export const KnightsResolveCard: Card = {
    cardId: 61,
    name: 'Knights Resolve',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Defend,
    pool: 'knight',
    energy: CardEnergyEnum.All,
    description: `Gain {${defenseEffect.name}} defense X times.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: defenseEffect.name,
                args: {
                    attachTo: CardTargetedEnum.Player,
                    value: 6,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
};

export const KnightsResolveCardUpgraded: Card = {
    cardId: 62,
    name: 'Knights Resolve+',
    rarity: CardRarityEnum.Common,
    cardType: CardTypeEnum.Defend,
    pool: 'knight',
    energy: CardEnergyEnum.All,
    description: `Gain {${defenseEffect.name}} defense X times.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: defenseEffect.name,
                target: CardTargetedEnum.RandomEnemy,
                args: {
                    value: 9,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
};
