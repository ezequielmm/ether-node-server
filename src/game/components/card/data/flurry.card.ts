import { damageEffect } from 'src/game/effects/damage/constants';
import {
    CardRarityEnum,
    CardTypeEnum,
    CardTargetedEnum,
    CardEnergyEnum,
} from '../card.enum';
import { Card } from '../card.schema';

export const FlurryCard: Card = {
    cardId: 83,
    name: 'Flurry',
    rarity: CardRarityEnum.Uncommon,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: CardEnergyEnum.All,
    description: `Deal {${damageEffect.name}} damage to 3 random enemies X times`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.RandomEnemy,
                args: {
                    value: 3,
                    amountOfEnemiesToTarget: 3,
                    useEnergyAsTimes: true,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
};

export const FlurryCardUpgraded: Card = {
    cardId: 84,
    name: 'Flurry+',
    rarity: CardRarityEnum.Uncommon,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: CardEnergyEnum.All,
    description: `Deal {${damageEffect.name}} damage to 3 random enemies X times`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.RandomEnemy,
                args: {
                    value: 4,
                    amountOfEnemiesToTarget: 3,
                    useEnergyAsTimes: true,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: true,
};
