import { inThyNameEffect } from 'src/game/effects/inThyName/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';
import { defenseEffect } from 'src/game/effects/defense/constants';

export const InThyNameCardUpgraded: Card = {
    cardId: 565,
    name: 'In Thy Name+',
    rarity: CardRarityEnum.Starter,
    cardType: CardTypeEnum.Defend,
    pool: 'knight',
    energy: 1,
    description: `Gain 10 ${defenseEffect.name} for each enemy with the Undead trait, and 5 ${defenseEffect.name} for each non-Undead enemy.`,
    keywords: [],
    properties: {
        effects: [
            {
                effect: inThyNameEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    undeadDefense: 10,
                    notUndeadDefense: 5
                },
            },   
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: true,
    isActive: true,
};

export const InThyNameCard: Card = {
    cardId: 564,
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
                effect: inThyNameEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    undeadDefense: 8,
                    notUndeadDefense: 3
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
    upgradedCardId: InThyNameCardUpgraded.cardId,
    isActive: true,
};
