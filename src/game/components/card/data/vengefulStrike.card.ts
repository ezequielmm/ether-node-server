import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';
import { defenseEffect } from 'src/game/effects/defense/constants';

/*
TODO:

-for both cards
    -notes:Comeback attacks a random monster for 2x the amount of defense remaining at the end of the monsters turn (if any).
    -cards effects logic 
*/

export const VengefulStrikeCardUpgraded: Card = {
    cardId: 567,
    name: 'Vengeful Strike+',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Defend,
    pool: 'knight',
    energy: 1,
    description: `Gain 1 comeback. Gain 5 ${defenseEffect.name}.`,
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

export const VengefulStrikeCard: Card = {
    cardId: 566,
    name: 'Vengeful Strike',
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
    upgradedCardId: VengefulStrikeCardUpgraded.cardId,
    isActive: true,
};
