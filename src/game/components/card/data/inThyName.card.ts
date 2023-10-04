import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';
import { defenseEffect } from 'src/game/effects/defense/constants';

/*
TODO:
-for both cards
    -cards effects logic 
*/

export const InThyNameCardUpgraded: Card = {
    cardId: 562,
    name: 'In Thy Name+',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Defend,
    pool: 'knight',
    energy: 1,
    description: `Gain 8 ${defenseEffect.name} for each enemy with the Undead trait, and 5 ${defenseEffect.name} for each non-Undead enemy.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: defenseEffect.name,
                target: CardTargetedEnum.Enemy,
                args: {
                    value: 8,
                },
            },
            {
                effect: defenseEffect.name,
                target: CardTargetedEnum.Enemy,
                args: {
                    value: 8,
                },
            },    
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: true,
    isActive: true,
};

export const InThyNameCard: Card = {
    cardId: 561,
    name: 'In Thy Name',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Defend,
    pool: 'knight',
    energy: 1,
    description: `Gain 8 ${defenseEffect.name} for each enemy with the Undead trait, and 3 ${defenseEffect.name} for each non-Undead enemy.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: defenseEffect.name,
                target: CardTargetedEnum.Self,
                args: {
                    value: 8,
                },
            },
            {
                effect: defenseEffect.name,
                target: CardTargetedEnum.Self,
                args: {
                    value: 3,
                },
            },
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: false,
    upgradedCardId: InThyNameCardUpgraded.cardId,
    isActive: true,
};
