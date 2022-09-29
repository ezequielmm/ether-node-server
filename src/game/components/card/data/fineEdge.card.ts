import { damageEffect } from 'src/game/effects/damage/constants';
import {
    CardRarityEnum,
    CardTypeEnum,
    CardKeywordEnum,
    CardTargetedEnum,
} from '../card.enum';
import { Card } from '../card.schema';

export const FineEdgeCardUpgraded: Card = {
    cardId: 172,
    name: 'Fine Edge+',
    rarity: CardRarityEnum.Special,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 0,
    description: `Deal {${damageEffect.name}} damage. Exhaust`,
    keywords: [CardKeywordEnum.Exhaust],
    properties: {
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Enemy,
                args: {
                    value: 7,
                },
            },
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: false,
};

export const FineEdgeCard: Card = {
    cardId: 171,
    name: 'Fine Edge',
    rarity: CardRarityEnum.Special,
    cardType: CardTypeEnum.Attack,
    pool: 'knight',
    energy: 0,
    description: `Deal {${damageEffect.name}} damage. Exhaust`,
    keywords: [CardKeywordEnum.Exhaust],
    properties: {
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Enemy,
                args: {
                    value: 5,
                },
            },
        ],
        statuses: [],
    },
    showPointer: true,
    isUpgraded: false,
    upgradedCardId: FineEdgeCardUpgraded.cardId,
};
