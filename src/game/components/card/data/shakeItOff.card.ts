import { defenseEffect } from 'src/game/effects/defense/constants';
import { CardRarityEnum, CardTypeEnum, CardTargetedEnum } from '../card.enum';
import { Card } from '../card.schema';

export const ShakeItOffCardUpgraded: Card = {
    cardId: 132,
    name: 'Shake it Off+',
    rarity: CardRarityEnum.Rare,
    cardType: CardTypeEnum.Defend,
    pool: 'knight',
    energy: 1,
    description:
        'Gain defense equal to twice the number of cards in your discard pile.',
    keywords: [],
    properties: {
        effects: [
            {
                effect: defenseEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 1, // Defense is calculated on the effect
                    useDiscardPileAsValue: true,
                    multiplier: 2,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: true,
    isActive: false,
};

export const ShakeItOffCard: Card = {
    cardId: 131,
    name: 'Shake it Off',
    rarity: CardRarityEnum.Rare,
    cardType: CardTypeEnum.Defend,
    pool: 'knight',
    energy: 1,
    description:
        'Gain defense equal to the number of cards in your discard pile.',
    keywords: [],
    properties: {
        effects: [
            {
                effect: defenseEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 1, // Defense is calculated on the effect
                    useDiscardPileAsValue: true,
                    multiplier: 1,
                },
            },
        ],
        statuses: [],
    },
    showPointer: false,
    isUpgraded: false,
    upgradedCardId: ShakeItOffCardUpgraded.cardId,
    isActive: false,
};
